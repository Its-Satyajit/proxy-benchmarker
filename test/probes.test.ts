import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import http from "node:http";
import { test } from "node:test";
import { createConfig } from "../src/config.js";
import { configureCurlGate, curlGateStats } from "../src/curl-gate.js";
import { benchmarkTopWebsitesForProxy, testProxyEndpoint, verifyProxyHealth } from "../src/tester.js";
import type { AppConfig, ProxyItem, TestEndpoint, WebsiteTarget } from "../src/types.js";

const EXIT_IP = "203.0.113.7";

function localProxyConfig(overrides: Partial<AppConfig> = {}): AppConfig {
    return { ...createConfig("safe", {}), maxCurlProcesses: 16, ...overrides };
}

async function startProxy(
    handler: (url: string) => { delayMs: number; status?: number; body?: string }
): Promise<{ port: number; server: http.Server }> {
    const server = http.createServer((req, res) => {
        const plan = handler(req.url || "");
        setTimeout(() => {
            res.statusCode = plan.status ?? 200;
            res.end(plan.body ?? EXIT_IP);
        }, plan.delayMs);
    });
    // curl keeps connections alive; drop them so the test process can exit.
    server.on("connection", (socket) => sockets.add(socket));
    await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
    return { port: (server.address() as { port: number }).port, server };
}

const sockets = new Set<import("node:net").Socket>();

function stopServer(server: http.Server): Promise<void> {
    for (const socket of sockets) socket.destroy();
    sockets.clear();
    return new Promise((resolve) => server.close(() => resolve()));
}

const proxyItem = (port: number): ProxyItem => ({ protocol: "http", ip: "127.0.0.1", port });

const endpoint = (name: string, parser: "plain" | "ipme" = "plain"): TestEndpoint => ({
    name,
    url: `http://${name}.invalid/ip`,
    parser
});

function curlPids(needle: string): string[] {
    const pids: string[] = [];
    for (const entry of readdirSync("/proc")) {
        if (!/^\d+$/.test(entry)) continue;
        try {
            const cmdline = readFileSync(`/proc/${entry}/cmdline`, "utf8");
            if (cmdline.includes("curl") && cmdline.includes(needle)) pids.push(entry);
        } catch {
            continue;
        }
    }
    return pids;
}

test("global curl gate caps concurrent curl processes", async () => {
    let inFlight = 0;
    let peak = 0;
    const { port, server } = await startProxy(() => ({ delayMs: 120 }));
    configureCurlGate(2);
    curlGateStats().peak = 0;

    await Promise.all(
        Array.from({ length: 6 }, (_, index) => {
            const promise = testProxyEndpoint(proxyItem(port), endpoint(`e${index}`), localProxyConfig());
            return promise.then((result) => {
                inFlight++;
                peak = Math.max(peak, inFlight);
                inFlight--;
                assert.equal(result.ok, true, "every probe should succeed through the local proxy");
                return result;
            });
        })
    );

    assert.ok(curlGateStats().peak <= 2, `gate peak was ${curlGateStats().peak}, expected <= 2`);
    await stopServer(server);
});

test("fast verification cancels the losing probe and reports honest counts", async () => {
    const slow = { started: false, aborted: false, finished: false };
    const { port, server } = await startProxy((url) => {
        if (url.startsWith("http://fast.invalid/")) return { delayMs: 300 };
        slow.started = true;
        setTimeout(() => { slow.finished = true; }, 4000);
        return { delayMs: 4000 };
    });

    // Track the client disappearing before the slow response is written.
    server.on("request", (req) => {
        req.socket.on("close", () => {
            if (!slow.finished) slow.aborted = true;
        });
    });

    const config = localProxyConfig();
    const startedAt = Date.now();
    const health = await verifyProxyHealth(proxyItem(port), [endpoint("fast"), endpoint("slow")], config);
    const elapsedMs = Date.now() - startedAt;

    assert.equal(health.isAlive, true);
    assert.equal(health.exitIp, EXIT_IP);
    assert.equal(health.strategy, "fast");
    assert.equal(health.requestsStarted, 2, "two probes are launched");
    assert.equal(health.resultsCompleted, 1, "only the winner is reported");
    assert.equal(health.endpointResults.length, 1);
    assert.ok(elapsedMs < 2000, `fast path resolved in ${elapsedMs}ms`);

    await new Promise((resolve) => setTimeout(resolve, 800));
    assert.equal(slow.finished, false, "slow probe must not have completed");
    assert.equal(slow.aborted, true, "losing curl must be cancelled, not left running");
    assert.deepEqual(curlPids(String(port)), [], "no curl child may outlive the verification");

    await stopServer(server);
});

test("full verification runs every endpoint sequentially", async () => {
    const { port, server } = await startProxy(() => ({ delayMs: 20 }));
    const config = localProxyConfig({ fullBenchmark: true });
    const health = await verifyProxyHealth(
        proxyItem(port),
        [endpoint("a"), endpoint("b"), endpoint("c")],
        config
    );
    assert.equal(health.strategy, "full");
    assert.equal(health.requestsStarted, 3);
    assert.equal(health.resultsCompleted, 3);
    assert.equal(health.endpointResults.length, 3);
    await stopServer(server);
});

test("website sweep records early exit instead of implying 53 failures", async () => {
    // http targets so the local forward proxy answers directly (no CONNECT).
    const websites: WebsiteTarget[] = Array.from({ length: 9 }, (_, index) => ({
        name: `Site ${index}`,
        domain: `site${index}.invalid`,
        category: "Test",
        url: `http://site${index}.invalid/`
    }));

    const failing = await startProxy(() => ({ delayMs: 10, status: 502, body: "bad gateway" }));
    const failed = await benchmarkTopWebsitesForProxy(proxyItem(failing.port), websites, localProxyConfig());
    assert.equal(failed.earlyExit, true);
    assert.equal(failed.attempted, 3, "only the first batch is attempted");
    assert.equal(failed.results.length, 3);
    assert.equal(failed.results.filter((r) => r.ok).length, 0);
    await stopServer(failing.server);

    const working = await startProxy(() => ({ delayMs: 10 }));
    const passed = await benchmarkTopWebsitesForProxy(proxyItem(working.port), websites, localProxyConfig());
    assert.equal(passed.earlyExit, false);
    assert.equal(passed.attempted, 9, "a reachable proxy is tested against every target");
    assert.equal(passed.results.filter((r) => r.ok).length, 9);
    await stopServer(working.server);
});

test("TLS mode is explicit: permissive by default, strict on request", async () => {
    const { port, server } = await startProxy(() => ({ delayMs: 10 }));
    // http:// target, so TLS does not apply; the args still must be accepted.
    const permissive = await testProxyEndpoint(proxyItem(port), endpoint("plain"), localProxyConfig());
    assert.equal(permissive.ok, true);
    const strict = await testProxyEndpoint(proxyItem(port), endpoint("plain"), localProxyConfig({ tlsVerify: true }));
    assert.equal(strict.ok, true, "plain http targets are unaffected by strict TLS");
    await stopServer(server);
});
