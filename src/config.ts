import process from "node:process";
import type { AppConfig, CandidateFeed, PresetName, TestEndpoint } from "./types.js";
import { BENCHMARK_WEBSITES } from "./websites.js";
import {
    DEFAULT_PRESET,
    PRESET_LIMITS,
    candidateLimit,
    envBoolean,
    envCandidateLimit,
    envInt,
    envSeconds,
    parsePresetName,
    positiveInt,
    positiveSeconds,
    resolveCurlCap,
    resolveWorkerCount
} from "./limits.js";

const DEFAULT_CLOUDFLARE_DNS = "1.1.1.1";
const DEFAULT_ENDPOINT_RETRIES = 2;

export const CANDIDATE_FEEDS: CandidateFeed[] = [
    {
        name: "proxifly/free-proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/all/data.csv",
            "https://raw.githubusercontent.com/proxifly/free-proxy-list/main/proxies/all/data.csv",
        ],
    },
    {
        name: "proxyscrape/free-proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/proxyscrape/free-proxy-list@main/proxies/all/data.csv",
            "https://raw.githubusercontent.com/ProxyScrape/free-proxy-list/main/proxies/all/data.csv",
        ],
    },
    {
        name: "hproxy-com/free-proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/hproxy-com/free-proxy-list@main/live.csv",
            "https://raw.githubusercontent.com/hproxy-com/free-proxy-list/main/live.csv",
        ],
    },
    {
        name: "proxmint/free-proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/proxmint/free-proxy-list@main/proxies/all.txt",
            "https://raw.githubusercontent.com/proxmint/free-proxy-list/main/proxies/all.txt",
        ],
    },
    {
        name: "proxio-io/proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/proxio-io/proxy-list@main/all.txt",
            "https://raw.githubusercontent.com/proxio-io/proxy-list/main/all.txt",
        ],
        defaultProtocol: "http",
    },
    {
        name: "iplocate/free-proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/iplocate/free-proxy-list@main/all-proxies.txt",
            "https://raw.githubusercontent.com/iplocate/free-proxy-list/main/all-proxies.txt",
        ],
    },
    {
        name: "databay-labs/http",
        urls: [
            "https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/http.txt",
            "https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/http.txt",
        ],
        defaultProtocol: "http",
    },
    {
        name: "databay-labs/socks4",
        urls: [
            "https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks4.txt",
            "https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks4.txt",
        ],
        defaultProtocol: "socks4",
    },
    {
        name: "databay-labs/socks5",
        urls: [
            "https://cdn.jsdelivr.net/gh/databay-labs/free-proxy-list@master/socks5.txt",
            "https://raw.githubusercontent.com/databay-labs/free-proxy-list/master/socks5.txt",
        ],
        defaultProtocol: "socks5",
    },
    {
        name: "monosans/proxy-list",
        urls: [
            "https://cdn.jsdelivr.net/gh/monosans/proxy-list@main/proxies/all.txt",
            "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/all.txt",
        ],
    },
];

export const TEST_ENDPOINTS: TestEndpoint[] = [
    { name: "api.ipify.org", url: "https://api.ipify.org", parser: "plain" },
    { name: "api64.ipify.org", url: "https://api64.ipify.org", parser: "plain" },
    { name: "ifconfig.me", url: "https://ifconfig.me/ip", parser: "plain" },
    { name: "icanhazip.com", url: "https://icanhazip.com", parser: "plain" },
    { name: "ident.me", url: "https://ident.me", parser: "plain" },
    { name: "checkip.amazonaws.com", url: "https://checkip.amazonaws.com", parser: "plain" },
    { name: "ip.me", url: "https://ip.me", parser: "ipme" },
    { name: "api.my-ip.io", url: "https://api.my-ip.io/ip", parser: "plain" },
    { name: "ipinfo.io", url: "https://ipinfo.io/ip", parser: "plain" },
    { name: "ifconfig.co", url: "https://ifconfig.co/ip", parser: "plain" },
    { name: "myexternalip.com", url: "https://myexternalip.com/raw", parser: "plain" },
];

export interface ConfigOverrides {
    concurrency?: number;
    tcpConcurrency?: number;
    websiteWorkers?: number;
    websiteConcurrency?: number;
    maxCurlProcesses?: number;
    limit?: number;
    tlsVerify?: boolean;
}

export function presetFromEnv(env: NodeJS.ProcessEnv): PresetName {
    const explicit = env.PRESET;
    if (explicit !== undefined && explicit.trim() !== "") {
        return parsePresetName(explicit, "environment PRESET");
    }
    if (envBoolean(env, "TURBO", false)) return "turbo";
    if (envBoolean(env, "SAFE", false)) return "safe";
    return DEFAULT_PRESET;
}

function applyOverrides(config: AppConfig, overrides: ConfigOverrides): void {
    if (overrides.concurrency !== undefined) config.concurrency = overrides.concurrency;
    if (overrides.tcpConcurrency !== undefined) config.tcpConcurrency = overrides.tcpConcurrency;
    if (overrides.websiteWorkers !== undefined) config.websiteWorkers = overrides.websiteWorkers;
    if (overrides.websiteConcurrency !== undefined) config.websiteConcurrency = overrides.websiteConcurrency;
    if (overrides.maxCurlProcesses !== undefined) config.maxCurlProcesses = overrides.maxCurlProcesses;
    if (overrides.limit !== undefined) config.limit = overrides.limit;
    if (overrides.tlsVerify !== undefined) config.tlsVerify = overrides.tlsVerify;
}

/** Fails fast on any out-of-range value so no stage has to clamp silently. */
export function validateConfig(config: AppConfig): AppConfig {
    positiveInt(config.concurrency, "concurrency");
    positiveInt(config.tcpConcurrency, "tcpConcurrency");
    positiveInt(config.websiteWorkers, "websiteWorkers");
    positiveInt(config.websiteConcurrency, "websiteConcurrency");
    resolveCurlCap(config.maxCurlProcesses);
    positiveInt(config.tcpTimeoutMs, "tcpTimeoutMs");
    positiveSeconds(config.timeoutSeconds, "timeoutSeconds");
    positiveSeconds(config.connectTimeoutSeconds, "connectTimeoutSeconds");
    positiveSeconds(config.websiteTimeoutSeconds, "websiteTimeoutSeconds");
    positiveSeconds(config.websiteConnectTimeoutSeconds, "websiteConnectTimeoutSeconds");
    positiveInt(config.endpointRetries, "endpointRetries");
    candidateLimit(config.limit);
    return config;
}

/** Resolution order: preset defaults -> environment -> explicit CLI overrides. */
export function createConfig(
    preset: PresetName,
    env: NodeJS.ProcessEnv = {},
    overrides: ConfigOverrides = {}
): AppConfig {
    const limits = PRESET_LIMITS[preset];
    const config: AppConfig = {
        concurrency: envInt(env, "CONCURRENCY", limits.verificationWorkers),
        tcpConcurrency: envInt(env, "TCP_CONCURRENCY", limits.tcpConcurrency),
        websiteWorkers: envInt(env, "WEBSITE_WORKERS", limits.websiteWorkers),
        websiteConcurrency: envInt(env, "WEBSITE_CONCURRENCY", limits.websiteRequestsPerProxy),
        maxCurlProcesses: resolveCurlCap(envInt(env, "MAX_CURL_PROCESSES", limits.maxCurlProcesses, 100_000)),
        tcpTimeoutMs: envInt(env, "TCP_TIMEOUT", limits.tcpTimeoutMs),
        timeoutSeconds: envSeconds(env, "TIMEOUT", limits.timeoutSeconds),
        connectTimeoutSeconds: envSeconds(env, "CONNECT_TIMEOUT", limits.connectTimeoutSeconds),
        websiteTimeoutSeconds: envSeconds(env, "WEBSITE_TIMEOUT", limits.websiteTimeoutSeconds),
        websiteConnectTimeoutSeconds: envSeconds(env, "WEBSITE_CONNECT_TIMEOUT", limits.websiteConnectTimeoutSeconds),
        tlsVerify: envBoolean(env, "TLS_VERIFY", false),
        cloudflareDns: env.DNS?.trim() || DEFAULT_CLOUDFLARE_DNS,
        endpointRetries: envInt(env, "DNS_RETRIES", DEFAULT_ENDPOINT_RETRIES),
        limit: envCandidateLimit(env, "LIMIT", limits.candidateLimit),
        fullBenchmark: envBoolean(env, "FULL_BENCHMARK", false),
        benchmarkTopWebsites: envBoolean(env, "BENCHMARK_WEBSITES", true),
        feeds: CANDIDATE_FEEDS,
        csvUrls: CANDIDATE_FEEDS[0].urls,
        testEndpoints: TEST_ENDPOINTS,
        topWebsites: BENCHMARK_WEBSITES,
        outputDir: process.cwd(),
        outputFiles: {
            http: "http.txt",
            https: "https.txt",
            socks4: "socks4.txt",
            socks5: "socks5.txt",
        },
        reportFiles: {
            html: "benchmark-report.html",
            json: "benchmark-report.json",
        },
    };
    applyOverrides(config, overrides);
    return validateConfig(config);
}

export const CONFIG: AppConfig = createConfig(presetFromEnv(process.env), process.env);

export { resolveWorkerCount };
