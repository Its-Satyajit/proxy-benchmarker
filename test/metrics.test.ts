import assert from "node:assert/strict";
import { test } from "node:test";
import {
    SCORE_WEIGHTS,
    averageLatency,
    classifyEgress,
    latencyTier,
    ratioPercent,
    scoreCandidate,
    summarizeSamples
} from "../src/metrics.js";

test("egress classification only claims what was measured", () => {
    assert.equal(classifyEgress("1.2.3.4", "9.9.9.9"), "DIFFERENT_EGRESS_IP");
    assert.equal(classifyEgress("9.9.9.9", "9.9.9.9"), "SAME_EGRESS_IP");
    assert.equal(classifyEgress(null, "9.9.9.9"), "UNKNOWN");
    assert.equal(classifyEgress("1.2.3.4", null), "UNKNOWN", "no origin ip means no comparison");
});

test("metrics are summarized per measurement set", () => {
    const websites = summarizeSamples([
        { totalLatencyMs: 300, connectTimeMs: 100, ttfbMs: 200, downloadSpeedBps: 1_000_000 },
        { totalLatencyMs: 500, connectTimeMs: 200, ttfbMs: 400, downloadSpeedBps: 500_000 },
    ]);
    assert.equal(websites.avgLatencyMs, 400);
    assert.equal(websites.minLatencyMs, 300);
    assert.equal(websites.maxLatencyMs, 500);
    assert.equal(websites.medianLatencyMs, 400);
    assert.equal(websites.avgSpeedBps, 750_000);

    // Egress endpoints are summarized on their own, never mixed with websites.
    const egress = averageLatency([{ totalLatencyMs: 120, connectTimeMs: 60, ttfbMs: 80, downloadSpeedBps: 20_000 }]);
    assert.equal(egress, 120);
});

test("empty sample sets produce zeros rather than NaN", () => {
    const metrics = summarizeSamples([]);
    assert.equal(metrics.avgLatencyMs, 0);
    assert.equal(metrics.medianLatencyMs, 0);
    assert.equal(averageLatency([]), 0);
    assert.equal(latencyTier(0), "SLOW");
});

test("composite score is gated by website reachability", () => {
    const good = summarizeSamples([{ totalLatencyMs: 200, connectTimeMs: 80, ttfbMs: 150, downloadSpeedBps: 800_000 }]);
    const full = scoreCandidate(good, 1);
    const half = scoreCandidate(good, 0.5);
    assert.ok(full.compositeScore > half.compositeScore, "less reachable means lower score");
    assert.equal(scoreCandidate(good, 0).compositeScore, 0, "nothing reachable means zero");

    const breakdown = full.breakdown;
    const summed = Object.values(breakdown).reduce((total, value) => total + value, 0);
    assert.ok(Math.abs(summed - full.compositeScore) <= 3, "breakdown matches the composite score");
    assert.ok(!("anonymity" in breakdown), "anonymity is not scored because it is not measured");
    assert.equal(
        Object.values(SCORE_WEIGHTS).reduce((total, value) => total + value, 0),
        100,
        "weights still sum to 100"
    );
});

test("pass rates use probes that produced a verdict", () => {
    assert.equal(ratioPercent(1, 1), 100);
    assert.equal(ratioPercent(1, 2), 50);
    assert.equal(ratioPercent(0, 0), 0);
    assert.equal(ratioPercent(1, 0), 0, "no probes, no percentage");
    assert.equal(ratioPercent(1, Number.NaN), 0);
});

test("latency tiers match documented thresholds", () => {
    assert.equal(latencyTier(399), "EXCELLENT");
    assert.equal(latencyTier(400), "GOOD");
    assert.equal(latencyTier(800), "MODERATE");
    assert.equal(latencyTier(1500), "SLOW");
    assert.equal(latencyTier(5000), "SLOW");
});
