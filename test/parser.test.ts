import assert from "node:assert/strict";
import { test } from "node:test";
import { isValidProxyTarget, parseProxyString } from "../src/proxy.js";
import { parseProxyFeedText } from "../src/csv.js";

test("target validation rejects impossible addresses", () => {
    assert.equal(isValidProxyTarget("64.227.186.105", 1080), true);
    assert.equal(isValidProxyTarget("999.999.999.999", 8080), false, "invalid octets");
    assert.equal(isValidProxyTarget("64.227.186.105", 99999), false, "port out of range");
    assert.equal(isValidProxyTarget("64.227.186.105", 0), false);
    assert.equal(isValidProxyTarget("not-an-ip", 80), false);
    assert.equal(isValidProxyTarget("::1", 80), false, "IPv4 only for now");
});

test("proxy strings are validated", () => {
    assert.deepEqual(parseProxyString("socks5://64.227.186.105:1080"), [
        { protocol: "socks5", ip: "64.227.186.105", port: 1080, country: undefined, raw: "socks5://64.227.186.105:1080" }
    ]);
    assert.deepEqual(parseProxyString("999.999.999.999:99999"), [], "invalid target is dropped");
    assert.deepEqual(parseProxyString("64.227.186.105:0"), [], "port 0 is not usable");
    assert.equal(parseProxyString("1.2.3.4:8080").length, 4, "bare ip:port expands across protocols");
});

test("feed text drops invalid rows and keeps valid ones", () => {
    const rows = parseProxyFeedText(
        [
            "ip,port,protocols,code",
            "64.227.186.105,1080,socks5,US",
            "999.999.999.999,99999,http,XX",
            "10.0.0.1,3128,http,",
            "1.2.3.4,-1,http,",
        ].join("\n")
    );
    assert.deepEqual(rows.map((r) => `${r.protocol}://${r.ip}:${r.port}`), [
        "socks5://64.227.186.105:1080",
        "http://10.0.0.1:3128",
    ]);
});
