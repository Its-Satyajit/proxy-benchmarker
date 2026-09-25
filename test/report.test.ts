import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { generateHtmlReport } from "../src/reporter.js";
import { scoreCandidate, summarizeSamples } from "../src/metrics.js";
import type { BenchmarkItem, BenchmarkStats, TestEndpoint } from "../src/types.js";

const websites: TestEndpoint[] = [
    { name: "api.ipify.org", url: "https://api.ipify.org", parser: "plain" }
];

function makeItem(index: number, passed: number, attempted: number, latencyMs: number): BenchmarkItem {
    const websiteSamples = Array.from({ length: attempted }, (_, i) => ({
        totalLatencyMs: latencyMs + i * 10,
        connectTimeMs: Math.round(latencyMs / 3),
        ttfbMs: Math.round(latencyMs / 2),
        downloadSpeedBps: 400_000 + index * 1000
    }));
    const performance = summarizeSamples(websiteSamples);
    const usable = passed / 53;
    const { compositeScore, breakdown } = scoreCandidate(performance, usable);

    return {
        proxy: { protocol: "socks5", ip: `10.0.0.${index}`, port: 1080 + index },
        status: "PASS",
        tier: "GOOD",
        compositeScore,
        scoreBreakdown: breakdown,
        exitIp: "203.0.113.9",
        egressStatus: "DIFFERENT_EGRESS_IP",
        verificationStrategy: "fast",
        endpointsStarted: 2,
        endpointsCompleted: 1,
        endpointsPassed: 1,
        endpointsTotal: 11,
        endpointPassRatePercent: 100,
        websitesAvailable: 53,
        websitesAttempted: attempted,
        websitesPassed: passed,
        websitePassRatePercent: Number.parseFloat(((passed / attempted) * 100).toFixed(1)),
        websitesEarlyExit: attempted < 53,
        performanceSource: "websites",
        egressVerificationLatencyMs: 120,
        ...performance,
        firstFailedEndpoint: null,
        failureReason: null,
        endpointDetails: [],
        websiteDetails: websiteSamples.map((sample, i) => ({
            name: `Site ${i}`,
            domain: `site${i}.invalid`,
            category: "Test",
            url: `https://site${i}.invalid/`,
            ok: true,
            httpCode: 200,
            totalLatencyMs: sample.totalLatencyMs,
            connectTimeMs: sample.connectTimeMs,
            sslHandshakeMs: 50,
            ttfbMs: sample.ttfbMs,
            downloadSpeedBps: sample.downloadSpeedBps,
            downloadSizeBytes: 1000,
            reason: null
        }))
    };
}

const stats: BenchmarkStats = {
    total: 120,
    completed: 120,
    passed: 2,
    failed: 118,
    localPublicIp: "198.51.100.4",
    durationSeconds: 42,
    startedAt: "2026-01-01T00:00:00.000Z",
    completedAt: "2026-01-01T00:00:42.000Z"
};

function loadClientScript(html: string): { computeWeightedScore: (item: unknown) => { totalScore: number }; getClientWeights: () => unknown } {
    const script = html.match(/<script>([\s\S]*?)<\/script>/);
    assert.ok(script, "report must embed a client script");

    const element = () => ({
        value: "0",
        textContent: "",
        innerHTML: "",
        className: "",
        style: {},
        classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        addEventListener() {},
        setAttribute() {},
        getAttribute: () => null,
        appendChild() {},
        removeChild() {},
        querySelector: () => element(),
        querySelectorAll: () => [],
        getBoundingClientRect: () => ({ top: 0, height: 41 }),
        scrollTop: 0,
        offsetHeight: 41
    });
    const document = {
        getElementById: () => element(),
        querySelector: () => element(),
        querySelectorAll: () => [],
        createElement: () => element(),
        body: element(),
        documentElement: element(),
        addEventListener() {}
    };
    const window = { addEventListener() {}, requestAnimationFrame: () => {}, devicePixelRatio: 1, innerHeight: 900 };

    const factory = new Function(
        "document",
        "window",
        "navigator",
        "Blob",
        "URL",
        "setTimeout",
        "clearTimeout",
        `${script[1]}\nreturn { computeWeightedScore, getClientWeights: () => weights };`
    );
    return factory(
        document,
        window,
        { clipboard: { writeText: async () => {} } },
        class {},
        { createObjectURL: () => "blob:", revokeObjectURL() {} },
        () => {},
        () => {}
    );
}

test("report client score matches the server score at default weights", () => {
    const items = [makeItem(1, 41, 53, 700), makeItem(2, 3, 53, 1200), makeItem(3, 12, 12, 250)];
    const outFile = path.join(os.tmpdir(), "proxy-benchmarker-parity.html");
    const html = generateHtmlReport(items, stats, websites, outFile);
    const client = loadClientScript(html);

    assert.deepEqual(client.getClientWeights(), { websites: 50, avgLatency: 20, minLatency: 8, connectTime: 8, ttfb: 7, speed: 7 });
    for (const item of items) {
        assert.equal(
            client.computeWeightedScore(item).totalScore,
            item.compositeScore,
            `score drift for ${item.proxy.ip}:${item.proxy.port}`
        );
    }
    fs.rmSync(outFile, { force: true });
});

test("report no longer claims anonymity", () => {
    const items = [makeItem(1, 41, 53, 700)];
    const html = generateHtmlReport(items, stats, websites, path.join(os.tmpdir(), "proxy-benchmarker-anon.html"));
    const clientScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? "";

    assert.ok(!/anonymity/i.test(clientScript), "client script must not score anonymity");
    assert.ok(/Egress IP/.test(html), "table must show the egress comparison");
    assert.ok(!/ELITE \/ ANONYMOUS/.test(html), "no anonymity verdict may be displayed");
    assert.ok(!/Anonymity<\/th>/.test(html), "no anonymity column header");
});

test("report shows attempted vs available website counts", () => {
    const items = [makeItem(3, 12, 12, 250)];
    const html = generateHtmlReport(items, stats, websites, path.join(os.tmpdir(), "proxy-benchmarker-counts.html"));
    const clientScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? "";
    assert.ok(/probed,/.test(clientScript), "rows must label probed vs reachable counts");
    assert.ok(/websitesAttempted/.test(clientScript) && /websitesAvailable/.test(clientScript), "both counters must be used");
    assert.ok(/targets probed/.test(html), "hero summary must show how many targets were probed");
});
