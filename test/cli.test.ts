import assert from "node:assert/strict";
import { test } from "node:test";
import { parseCliArgs, requireInt } from "../src/cli.js";

test("unknown flags are rejected instead of silently ignored", async () => {
    await assert.rejects(() => parseCliArgs(["--webiste-workers", "8"]), /Unknown option: --webiste-workers/);
    await assert.rejects(() => parseCliArgs(["--turboo"]), /Unknown option/);
    await assert.rejects(() => parseCliArgs(["-z"]), /Unknown option/);
});

test("known flags and values are accepted", async () => {
    const options = await parseCliArgs([
        "--turbo",
        "--strict-tls",
        "--tcp-concurrency=20",
        "--max-curl",
        "32",
        "-n",
        "150",
        "-c",
        "8",
        "--website-workers",
        "4",
        "--limit=0"
    ]);
    assert.equal(options.preset, "turbo");
    assert.equal(options.strictTls, true);
    assert.equal(options.tcpConcurrency, 20);
    assert.equal(options.maxCurlProcesses, 32);
    // Last --limit wins, and 0 means unlimited.
    assert.equal(options.limit, 0);
});

test("the --vps alias is gone; infrastructure type no longer picks a preset", async () => {
    await assert.rejects(() => parseCliArgs(["--vps"]), /Unknown option: --vps/);
});

test("bad numeric values are rejected with the flag name", async () => {
    await assert.rejects(() => parseCliArgs(["--concurrency", "abc"]), /--concurrency must be an integer/);
    await assert.rejects(() => parseCliArgs(["--concurrency", "0"]), /--concurrency must be an integer >= 1/);
    await assert.rejects(() => parseCliArgs(["--tcp-concurrency", "-1"]), /--tcp-concurrency/);
    await assert.rejects(() => parseCliArgs(["--max-curl", "0"]), /--max-curl/);
    await assert.rejects(() => parseCliArgs(["--website-workers", "x"]), /--website-workers/);
    await assert.rejects(() => parseCliArgs(["--limit", "nope"]), /--limit must be an integer >= 0/);
    await assert.rejects(() => parseCliArgs(["--preset=ultra"]), /--preset must be one of/);
    await assert.rejects(() => parseCliArgs(["--concurrency"]), /requires a value/);
});

test("proxy arguments and file-style positionals still parse", async () => {
    const options = await parseCliArgs([
        "socks5://64.227.186.105:1080",
        "1.2.3.4:8080",
        "999.999.999.999:99999"
    ]);
    assert.equal(options.customProxies.length, 5, "4 protocol variants plus the valid one");
    assert.equal(options.customProxies[0]?.ip, "64.227.186.105");
    assert.ok(!options.customProxies.some((p) => p.ip === "999.999.999.999"), "invalid target dropped");
});

test("-- stops option parsing", async () => {
    const options = await parseCliArgs(["--turbo", "--", "--not-a-flag"]);
    assert.equal(options.preset, "turbo");
    assert.equal(options.customProxies.length, 0, "flag-like positional is treated as a proxy, not an option");
});

test("requireInt enforces its bounds", () => {
    assert.equal(requireInt("5", "--x"), 5);
    assert.equal(requireInt("0", "--x", true), 0);
    assert.throws(() => requireInt("0", "--x"), />= 1/);
    assert.throws(() => requireInt(undefined, "--x"), /requires a value/);
});
