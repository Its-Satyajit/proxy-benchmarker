import path from "node:path";
import process from "node:process";
import { TOP_50_WEBSITES } from "./websites.mjs";

export const CONFIG = {
    // High-performance concurrency defaults (100 parallel workers)
    concurrency: Number(process.env.CONCURRENCY || 100),
    timeoutSeconds: Number(process.env.TIMEOUT || 4),
    connectTimeoutSeconds: Number(process.env.CONNECT_TIMEOUT || 3),
    endpointRetries: Number(process.env.RETRIES || 2),
    cloudflareDns: process.env.DNS || "1.1.1.1",
    outputDir: process.env.OUTPUT_DIR || process.cwd(),
    limit: process.env.LIMIT ? Number(process.env.LIMIT) : 0,

    // Benchmark settings
    fullBenchmark: process.env.FULL_BENCHMARK === "true",
    benchmarkTopWebsites: process.env.BENCHMARK_WEBSITES !== "false",
    websiteTimeoutSeconds: Number(process.env.WEBSITE_TIMEOUT || 3.5),
    websiteConnectTimeoutSeconds: Number(process.env.WEBSITE_CONNECT_TIMEOUT || 2.5),
    websiteConcurrency: Number(process.env.WEBSITE_CONCURRENCY || 25),

    csvUrls: [
        "https://cdn.jsdelivr.net/gh/ProxyScrape/free-proxy-list@main/proxies/all/data.csv",
        "https://raw.githubusercontent.com/ProxyScrape/free-proxy-list/main/proxies/all/data.csv",
    ],

    // Verification endpoints for IP verification & leak detection
    testEndpoints: [
        { name: "api.ipify.org", url: "https://api.ipify.org", parser: "ip" },
        { name: "api64.ipify.org", url: "https://api64.ipify.org", parser: "ip" },
        { name: "ifconfig.me", url: "https://ifconfig.me/ip", parser: "ip" },
        { name: "icanhazip.com", url: "https://icanhazip.com/", parser: "ip" },
        { name: "ident.me", url: "https://ident.me", parser: "ip" },
        { name: "checkip.amazonaws.com", url: "https://checkip.amazonaws.com/", parser: "ip" },
        { name: "ip.me", url: "https://ip.me/", parser: "ipme" },
        { name: "api.my-ip.io", url: "https://api.my-ip.io/v2/ip.txt", parser: "ip" },
        { name: "ipinfo.io", url: "https://ipinfo.io/ip", parser: "ip" },
        { name: "ifconfig.co", url: "https://ifconfig.co/ip", parser: "ip" },
        { name: "myexternalip.com", url: "https://myexternalip.com/raw", parser: "ip" },
    ],

    // Top 50 global websites for real-world connectivity benchmarking
    topWebsites: TOP_50_WEBSITES,

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
