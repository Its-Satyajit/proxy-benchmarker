import process from "node:process";
import type { AppConfig, CandidateFeed, TestEndpoint } from "./types.js";
import { TOP_50_WEBSITES } from "./websites.js";

export type PresetMode = "home" | "safe" | "turbo";

const envPreset = (process.env.PRESET || (process.env.TURBO === "true" || process.env.TURBO === "1" ? "turbo" : (process.env.SAFE === "true" || process.env.SAFE === "1" ? "safe" : "home"))).toLowerCase() as PresetMode;

const PRESET_DEFAULTS: Record<PresetMode, {
    tcpConcurrency: number;
    concurrency: number;
    websiteConcurrency: number;
    tcpTimeoutMs: number;
    timeoutSeconds: number;
    connectTimeoutSeconds: number;
    websiteTimeoutSeconds: number;
    websiteConnectTimeoutSeconds: number;
}> = {
    home: {
        tcpConcurrency: 80,
        concurrency: 25,
        websiteConcurrency: 5,
        tcpTimeoutMs: 1200,
        timeoutSeconds: 4.0,
        connectTimeoutSeconds: 3.0,
        websiteTimeoutSeconds: 4.5,
        websiteConnectTimeoutSeconds: 3.0,
    },
    safe: {
        tcpConcurrency: 35,
        concurrency: 12,
        websiteConcurrency: 3,
        tcpTimeoutMs: 1500,
        timeoutSeconds: 4.5,
        connectTimeoutSeconds: 3.0,
        websiteTimeoutSeconds: 5.0,
        websiteConnectTimeoutSeconds: 3.5,
    },
    turbo: {
        tcpConcurrency: 1500,
        concurrency: 300,
        websiteConcurrency: 25,
        tcpTimeoutMs: 800,
        timeoutSeconds: 3.0,
        connectTimeoutSeconds: 2.0,
        websiteTimeoutSeconds: 3.5,
        websiteConnectTimeoutSeconds: 2.5,
    },
};

const activePreset = PRESET_DEFAULTS[envPreset] ?? PRESET_DEFAULTS.home;

const DEFAULT_CONCURRENCY = activePreset.concurrency;
const DEFAULT_TCP_CONCURRENCY = activePreset.tcpConcurrency;
const DEFAULT_WEBSITE_CONCURRENCY = activePreset.websiteConcurrency;
const DEFAULT_TCP_TIMEOUT_MS = activePreset.tcpTimeoutMs;
const DEFAULT_TIMEOUT_SECONDS = activePreset.timeoutSeconds;
const DEFAULT_CONNECT_TIMEOUT_SECONDS = activePreset.connectTimeoutSeconds;
const DEFAULT_WEBSITE_TIMEOUT_SECONDS = activePreset.websiteTimeoutSeconds;
const DEFAULT_WEBSITE_CONNECT_TIMEOUT_SECONDS = activePreset.websiteConnectTimeoutSeconds;
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

export const CONFIG: AppConfig = {
    concurrency: Number.parseInt(process.env.CONCURRENCY || String(DEFAULT_CONCURRENCY), 10),
    tcpConcurrency: Number.parseInt(process.env.TCP_CONCURRENCY || String(DEFAULT_TCP_CONCURRENCY), 10),
    tcpTimeoutMs: Number.parseInt(process.env.TCP_TIMEOUT || String(DEFAULT_TCP_TIMEOUT_MS), 10),
    timeoutSeconds: Number.parseFloat(process.env.TIMEOUT || String(DEFAULT_TIMEOUT_SECONDS)),
    connectTimeoutSeconds: Number.parseFloat(process.env.CONNECT_TIMEOUT || String(DEFAULT_CONNECT_TIMEOUT_SECONDS)),
    websiteTimeoutSeconds: Number.parseFloat(process.env.WEBSITE_TIMEOUT || String(DEFAULT_WEBSITE_TIMEOUT_SECONDS)),
    websiteConnectTimeoutSeconds: Number.parseFloat(process.env.WEBSITE_CONNECT_TIMEOUT || String(DEFAULT_WEBSITE_CONNECT_TIMEOUT_SECONDS)),
    websiteConcurrency: Number.parseInt(process.env.WEBSITE_CONCURRENCY || String(DEFAULT_WEBSITE_CONCURRENCY), 10),
    cloudflareDns: process.env.DNS || DEFAULT_CLOUDFLARE_DNS,
    endpointRetries: Number.parseInt(process.env.DNS_RETRIES || String(DEFAULT_ENDPOINT_RETRIES), 10),
    limit: Number.parseInt(process.env.LIMIT || "0", 10),
    fullBenchmark: process.env.FULL_BENCHMARK === "true",
    benchmarkTopWebsites: process.env.BENCHMARK_WEBSITES !== "false",
    feeds: CANDIDATE_FEEDS,
    csvUrls: CANDIDATE_FEEDS[0].urls,
    testEndpoints: TEST_ENDPOINTS,
    topWebsites: TOP_50_WEBSITES,
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
