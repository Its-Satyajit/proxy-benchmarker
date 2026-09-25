import assert from "node:assert/strict";
import { test } from "node:test";
import { interleaveByFeed, parseProxyFeedText } from "../src/csv.js";
import { ratioPercent } from "../src/metrics.js";
import { configureCurlGate, curlGateStats, withCurlSlot } from "../src/curl-gate.js";
import type { ProxyItem } from "../src/types.js";

const proxy = (ip: string, port: number, protocol: ProxyItem["protocol"] = "http"): ProxyItem => ({
    protocol,
    ip,
    port
});

test("candidate sampling is feed-balanced and deterministic", () => {
    const buckets = [
        [proxy("10.0.0.1", 1), proxy("10.0.0.2", 2), proxy("10.0.0.3", 3), proxy("10.0.0.4", 4)],
        [proxy("10.0.1.1", 1), proxy("10.0.1.2", 2)],
        [proxy("10.0.2.1", 1), proxy("10.0.2.2", 2), proxy("10.0.2.3", 3)]
    ];

    const first = interleaveByFeed(buckets, 6);
    const second = interleaveByFeed(buckets, 6);
    assert.deepEqual(first, second, "same inputs must produce the same sample");

    const fromBigFeed = first.filter((p) => p.ip.startsWith("10.0.0."));
    assert.equal(fromBigFeed.length, 2, "the largest feed must not dominate the sample");
    assert.equal(first.length, 6);
    assert.deepEqual(first.map((p) => p.ip), [
        "10.0.0.1", "10.0.1.1", "10.0.2.1",
        "10.0.0.2", "10.0.1.2", "10.0.2.2"
    ]);
});

test("sampling handles short buckets, empty input and unlimited", () => {
    const buckets = [[proxy("10.0.0.1", 1)], [proxy("10.0.1.1", 1), proxy("10.0.1.2", 2)]];
    assert.equal(interleaveByFeed(buckets, 99).length, 3, "cannot invent candidates");
    assert.equal(interleaveByFeed([], 10).length, 0);
    assert.equal(interleaveByFeed(buckets, 0).length, 3, "0 means unlimited");
});

test("endpoint coverage and success rate are separate numbers", () => {
    // Fast verification: 2 of 11 endpoints probed, 1 success.
    assert.equal(ratioPercent(2, 11), 18.2, "coverage");
    assert.equal(ratioPercent(1, 2), 50, "success across started probes");
    assert.notEqual(ratioPercent(1, 2), 100, "a cancelled probe must not read as a pass");
    assert.equal(ratioPercent(11, 11), 100);
});

test("curl gate caps at one and releases waiters", async () => {
    configureCurlGate(1);
    curlGateStats().peak = 0;
    let inFlight = 0;
    let peak = 0;

    await Promise.all(
        Array.from({ length: 5 }, async () => {
            await withCurlSlot(async () => {
                inFlight++;
                peak = Math.max(peak, inFlight);
                await new Promise((resolve) => setTimeout(resolve, 25));
                inFlight--;
            });
        })
    );

    assert.equal(peak, 1, "gate of 1 must serialise every caller");
    assert.equal(curlGateStats().inFlight, 0, "all waiters released");
    assert.equal(curlGateStats().waiting, 0);
});

test("curl gate caps at two and never exceeds it", async () => {
    configureCurlGate(2);
    curlGateStats().peak = 0;
    let inFlight = 0;
    let peak = 0;

    await Promise.all(
        Array.from({ length: 8 }, async () => {
            await withCurlSlot(async () => {
                inFlight++;
                peak = Math.max(peak, inFlight);
                await new Promise((resolve) => setTimeout(resolve, 15));
                inFlight--;
            });
        })
    );

    assert.equal(peak, 2);
    assert.ok(curlGateStats().peak <= 2, `gate peak was ${curlGateStats().peak}`);
    assert.equal(curlGateStats().inFlight, 0);
});

test("curl gate propagates errors and still releases the slot", async () => {
    configureCurlGate(1);
    await assert.rejects(() => withCurlSlot(async () => { throw new Error("boom"); }), /boom/);
    assert.equal(curlGateStats().inFlight, 0, "a failed task must not leak its slot");
    assert.equal(await withCurlSlot(async () => "ok"), "ok");
});

test("feed parsing rejects out-of-range ports and malformed rows", () => {
    const rows = parseProxyFeedText(
        [
            "64.227.186.105,1080,http,US",
            "64.227.186.106,99999,http,US",
            "64.227.186.107,0,http,US",
            "not,an,ip,row,at,all",
            "",
            "8.8.8.8,443,https,US"
        ].join("\n")
    );
    assert.deepEqual(rows.map((r) => `${r.ip}:${r.port}`), ["64.227.186.105:1080", "8.8.8.8:443"]);
});
