import assert from "node:assert/strict";
import { test } from "node:test";
import {
    PRESET_LIMITS,
    candidateLimit,
    envInt,
    parsePresetName,
    positiveInt,
    positiveSeconds,
    resolveWorkerCount
} from "../src/limits.js";
import { createConfig, presetFromEnv, validateConfig } from "../src/config.js";

test("presets expose the documented safe contract", () => {
    const safe = createConfig("safe", {});
    assert.equal(safe.tcpConcurrency, 35);
    assert.equal(safe.concurrency, 12);
    assert.equal(safe.websiteWorkers, 4);
    assert.equal(safe.websiteConcurrency, 3);
    assert.equal(safe.maxCurlProcesses, 16);
    assert.equal(safe.limit, 500);
});

test("home and turbo presets keep their documented values", () => {
    const home = createConfig("home", {});
    assert.equal(home.tcpConcurrency, 80);
    assert.equal(home.concurrency, 25);
    assert.equal(home.limit, 2000);

    const turbo = createConfig("turbo", {});
    assert.equal(turbo.tcpConcurrency, 1500);
    assert.equal(turbo.concurrency, 300);
    assert.equal(turbo.websiteWorkers, 100);
    assert.equal(turbo.limit, 0, "turbo must not cap candidates");
});

test("every preset produces a valid config", () => {
    for (const preset of Object.keys(PRESET_LIMITS)) {
        assert.doesNotThrow(() => validateConfig(createConfig(preset as never, {})));
    }
});

test("env overrides presets and rejects bad values", () => {
    assert.equal(createConfig("safe", { TCP_CONCURRENCY: "5" }).tcpConcurrency, 5);
    assert.throws(() => createConfig("safe", { TCP_CONCURRENCY: "abc" }), /TCP_CONCURRENCY/);
    assert.throws(() => createConfig("safe", { CONCURRENCY: "0" }), /CONCURRENCY/);
    assert.throws(() => createConfig("safe", { CONCURRENCY: "-4" }), /CONCURRENCY/);
    assert.throws(() => createConfig("safe", { LIMIT: "-1" }), /LIMIT/);
    assert.throws(() => createConfig("safe", { TIMEOUT: "0" }), /TIMEOUT/);
    assert.throws(() => presetFromEnv({ PRESET: "nope" }), /PRESET/);
});

test("CLI overrides win over env and preset", () => {
    const config = createConfig("safe", { CONCURRENCY: "7" }, { concurrency: 9, limit: 25 });
    assert.equal(config.concurrency, 9);
    assert.equal(config.limit, 25);
});

test("validation helpers reject out-of-range input", () => {
    assert.throws(() => positiveInt(Number.NaN, "x"), /x/);
    assert.throws(() => positiveInt(0, "x"), /x/);
    assert.throws(() => positiveInt(1.5, "x"), /x/);
    assert.equal(candidateLimit(0), 0, "0 means unlimited candidates");
    assert.throws(() => candidateLimit(-1), /limit/);
    assert.throws(() => positiveSeconds(Number.POSITIVE_INFINITY, "t"), /t/);
    assert.throws(() => envInt({ N: "abc" }, "N", 1), /N/);
    assert.equal(envInt({}, "N", 7), 7);
    assert.throws(() => parsePresetName("ultra"), /preset/);
    assert.equal(parsePresetName("TURBO"), "turbo");});

test("presetFromEnv defaults to safe and honours flags", () => {
    assert.equal(presetFromEnv({}), "safe", "safe is the default preset");
    assert.equal(parsePresetName(undefined), "safe");
    assert.equal(presetFromEnv({ PRESET: "home" }), "home");
    assert.equal(presetFromEnv({ SAFE: "true" }), "safe");
    assert.equal(presetFromEnv({ TURBO: "1" }), "turbo");
});

test("CLI defaults resolve to the safe contract", () => {
    const config = createConfig(presetFromEnv({}), {});
    assert.deepEqual(
        {
            tcpConcurrency: config.tcpConcurrency,
            concurrency: config.concurrency,
            websiteWorkers: config.websiteWorkers,
            maxCurlProcesses: config.maxCurlProcesses,
            limit: config.limit
        },
        { tcpConcurrency: 35, concurrency: 12, websiteWorkers: 4, maxCurlProcesses: 16, limit: 500 }
    );
});

test("worker resolution has no hidden minimum", () => {
    // The regression: --safe asking for 35 sockets used to become 50.
    assert.equal(resolveWorkerCount(35, 1000), 35);
    assert.equal(resolveWorkerCount(1, 1000), 1);
    assert.equal(resolveWorkerCount(12, 5), 5, "never more workers than work");
    assert.equal(resolveWorkerCount(80, 0), 0);
});

test("stage 3 workers are independent of stage 2 workers", () => {
    const config = createConfig("turbo", {});
    const stage2 = resolveWorkerCount(config.concurrency, 10_000);
    const stage3 = resolveWorkerCount(config.websiteWorkers, 10_000);
    assert.equal(stage2, 300);
    assert.equal(stage3, 100, "stage 3 must not be derived from stage 2");
});
