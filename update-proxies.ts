#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { Protocol, ProxyItem } from "./src/types.js";
import { CONFIG } from "./src/config.js";
import { log, ansi } from "./src/terminal.js";
import { checkDependencies, prepareEndpoints, prepareWebsiteTargets, getLocalPublicIp } from "./src/dns.js";
import { downloadAllFeeds, parseCsv } from "./src/csv.js";
import { deduplicateProxies, parseProxyString } from "./src/proxy.js";
import { runProxyTests } from "./src/tester.js";
import {
    writeProxyFiles,
    generateHtmlReport,
    writeJsonReport,
    atomicWrite,
    printSummary
} from "./src/reporter.js";

async function parseCliArgs(rawArgs: string[]): Promise<{
    customProxies: ProxyItem[];
    limit?: number;
    concurrency?: number;
    tcpConcurrency?: number;
    preset?: "home" | "safe" | "turbo";
    showHelp?: boolean;
}> {
    const customProxies: ProxyItem[] = [];
    let limit: number | undefined;
    let concurrency: number | undefined;
    let tcpConcurrency: number | undefined;
    let preset: "home" | "safe" | "turbo" | undefined;
    let showHelp = false;

    for (let i = 0; i < rawArgs.length; i++) {
        const arg = rawArgs[i];
        if (arg === "-h" || arg === "--help") {
            showHelp = true;
            continue;
        }
        if (arg === "-n" || arg === "--limit") {
            const next = rawArgs[++i];
            if (next) limit = Number.parseInt(next, 10);
            continue;
        }
        if (arg.startsWith("--limit=")) {
            limit = Number.parseInt(arg.split("=")[1], 10);
            continue;
        }
        if (arg === "-c" || arg === "--concurrency") {
            const next = rawArgs[++i];
            if (next) concurrency = Number.parseInt(next, 10);
            continue;
        }
        if (arg.startsWith("--concurrency=")) {
            concurrency = Number.parseInt(arg.split("=")[1], 10);
            continue;
        }
        if (arg === "--tcp-concurrency") {
            const next = rawArgs[++i];
            if (next) tcpConcurrency = Number.parseInt(next, 10);
            continue;
        }
        if (arg.startsWith("--tcp-concurrency=")) {
            tcpConcurrency = Number.parseInt(arg.split("=")[1], 10);
            continue;
        }
        if (arg === "--safe") {
            preset = "safe";
            continue;
        }
        if (arg === "--home") {
            preset = "home";
            continue;
        }
        if (arg === "--turbo" || arg === "--vps") {
            preset = "turbo";
            continue;
        }
        if (arg.startsWith("--preset=")) {
            const val = arg.split("=")[1].toLowerCase();
            if (val === "safe" || val === "home" || val === "turbo") {
                preset = val;
            }
            continue;
        }
        if (arg.startsWith("-")) {
            continue;
        }

        // Check if argument is a local file
        try {
            const stat = await fs.stat(arg);
            if (stat.isFile()) {
                const content = await fs.readFile(arg, "utf8");
                const parsed = parseCsv(content);
                customProxies.push(...parsed);
                continue;
            }
        } catch {
            // Not a file, try parsing as proxy string
        }

        const parsed = parseProxyString(arg);
        if (parsed.length > 0) {
            customProxies.push(...parsed);
        }
    }

    return { customProxies, limit, concurrency, tcpConcurrency, preset, showHelp };
}

function printHelp(): void {
    log(`
Proxy Benchmark & Network Telemetry Suite

Usage:
  nub update-proxies.ts [options] [proxy...] [file...]
  curl -fsSL https://.../run.sh | bash -s -- [options] [proxy...]
  irm https://.../run.ps1 | iex [options] [proxy...]

Examples:
  # Benchmark with safe home-router defaults (balanced)
  nub update-proxies.ts

  # Benchmark with ultra-gentle mode for sensitive/budget WiFi routers
  nub update-proxies.ts --safe

  # Benchmark high-speed mode on VPS / Gigabit servers
  nub update-proxies.ts --turbo

  # Benchmark a single specific proxy route
  nub update-proxies.ts socks5://64.227.186.105:1080

  # Benchmark custom list from file
  nub update-proxies.ts my-proxies.txt

Options:
  --safe              Ultra-safe profile (35 TCP sockets, 12 workers) for budget routers
  --home              Home router profile (80 TCP sockets, 25 workers - default)
  --turbo, --vps      High-performance profile (600 TCP sockets, 150 workers)
  -c, --concurrency   Override parallel worker count
  --tcp-concurrency   Override parallel TCP socket pre-filter count
  -n, --limit <num>   Limit the number of proxies to test
  -h, --help          Show this help message
`);
}

/* ============================================================
 * Main Workflow
 * ============================================================ */

async function main(): Promise<void> {
    const { customProxies, limit, concurrency, tcpConcurrency, preset, showHelp } = await parseCliArgs(process.argv.slice(2));

    if (showHelp) {
        printHelp();
        process.exit(0);
    }

    if (preset === "safe") {
        CONFIG.tcpConcurrency = 35;
        CONFIG.concurrency = 12;
        CONFIG.websiteConcurrency = 3;
    } else if (preset === "home") {
        CONFIG.tcpConcurrency = 80;
        CONFIG.concurrency = 25;
        CONFIG.websiteConcurrency = 5;
    } else if (preset === "turbo") {
        CONFIG.tcpConcurrency = 600;
        CONFIG.concurrency = 150;
        CONFIG.websiteConcurrency = 15;
    }

    if (concurrency !== undefined) CONFIG.concurrency = concurrency;
    if (tcpConcurrency !== undefined) CONFIG.tcpConcurrency = tcpConcurrency;

    const effectiveLimit = limit !== undefined ? limit : CONFIG.limit;

    log("");
    log("========================================");
    log("   Proxy Benchmark & Best Network Finder ");
    log("========================================");
    log("");

    // 1. Dependency Checks & Network Context
    await checkDependencies();
    log(`${ansi.green}[OK]${ansi.reset} Network tools ready`);

    const localPublicIp = await getLocalPublicIp();
    log(`${ansi.cyan}[INFO]${ansi.reset} Origin Public IP: ${ansi.bold}${localPublicIp || "Direct / Unknown"}${ansi.reset}`);

    log(
        `${ansi.gray}` +
        `TCP Sockets: ${CONFIG.tcpConcurrency} | ` +
        `Workers: ${CONFIG.concurrency} | ` +
        `Timeout: ${CONFIG.timeoutSeconds}s | ` +
        `DNS: ${CONFIG.cloudflareDns} | ` +
        `Edge Targets: ${CONFIG.benchmarkTopWebsites ? `${CONFIG.topWebsites?.length || 50} sites` : "Disabled"}` +
        `${ansi.reset}\n`
    );

    // 2. Resolve Test Endpoint & Edge Targets DNS
    const endpoints = await prepareEndpoints(CONFIG.testEndpoints, CONFIG);
    if (CONFIG.benchmarkTopWebsites && CONFIG.topWebsites.length > 0) {
        CONFIG.topWebsites = await prepareWebsiteTargets(CONFIG.topWebsites, CONFIG);
    }

    let proxies: ProxyItem[] = [];

    if (customProxies.length > 0) {
        // Use custom CLI endpoints
        log("========================================");
        log("     Target Endpoints (CLI Input)       ");
        log("========================================");
        log("");
        proxies = deduplicateProxies(customProxies);
        log(`Loaded ${proxies.length} custom route(s) to benchmark:`);
        for (const p of proxies) {
            log(`  ${ansi.cyan}${p.protocol.toUpperCase()}${ansi.reset}://${p.ip}:${p.port}`);
        }
        log("");
    } else {
        // 3. Download Proxy List Feeds (Aggregate & Set Deduplicate)
        log("========================================");
        log("     Fetching Candidate Route Feeds     ");
        log("========================================");
        log("");

        const { proxies: feedProxies } = await downloadAllFeeds(CONFIG);
        proxies = feedProxies;

        if (proxies.length === 0) {
            throw new Error("Candidate feeds contained no valid endpoints.");
        }

        if (effectiveLimit > 0 && effectiveLimit < proxies.length) {
            log(`  Limiting benchmark to first ${effectiveLimit} candidates (LIMIT=${effectiveLimit})`);
            proxies = proxies.slice(0, effectiveLimit);
        }

        const discovered: Record<Protocol, number> = { http: 0, https: 0, socks4: 0, socks5: 0 };
        for (const proxy of proxies) {
            discovered[proxy.protocol]++;
        }

        log(`  Target candidate routes to benchmark (${proxies.length.toLocaleString()} total):\n`);
        for (const protocol of ["http", "https", "socks4", "socks5"] as Protocol[]) {
            log(`  ${protocol.toUpperCase().padEnd(7)} ${discovered[protocol].toLocaleString()}`);
        }
    }

    if (proxies.length === 0) {
        throw new Error("No valid candidate routes to test.");
    }

    // 5. Test & Benchmark
    log("\n========================================");
    log("      Benchmarking Route Performance    ");
    log("========================================");
    log("");
    log(`Stage 1: Async TCP Socket Pre-Filter (${Math.min(CONFIG.tcpConcurrency, proxies.length)} parallel sockets)`);
    log(`Stage 2: Transport Handshake & Egress Verification (${endpoints.length} verification endpoints)`);
    if (CONFIG.benchmarkTopWebsites) {
        log(`Stage 3: Global Edge Reachability Benchmark (${CONFIG.topWebsites?.length || 50} destinations)`);
    }
    log("Stage 4: Composite Route Scoring & Telemetry Generation\n");

    const { results, benchmarks, stats } = await runProxyTests(proxies, endpoints, CONFIG, localPublicIp);

    // 6. Write Results & Generate Benchmark Reports
    log("========================================");
    log("       Generating Reports & Files       ");
    log("========================================");
    log("");

    // Write text files
    await writeProxyFiles(results, CONFIG);

    // Generate HTML Report
    const htmlReportPath = path.join(CONFIG.outputDir, CONFIG.reportFiles.html);
    const htmlContent = generateHtmlReport(benchmarks, stats, endpoints, htmlReportPath);
    await atomicWrite(htmlReportPath, htmlContent);

    // Generate JSON Report
    const jsonReportPath = path.join(CONFIG.outputDir, CONFIG.reportFiles.json);
    await writeJsonReport({
        generatedAt: stats.completedAt,
        stats,
        endpoints,
        benchmarks,
    }, jsonReportPath);

    // 7. Summary
    printSummary(
        stats,
        results,
        endpoints.length,
        CONFIG.testEndpoints.length,
        { html: htmlReportPath, json: jsonReportPath }
    );
}

/* ============================================================
 * Signal & Error Handling
 * ============================================================ */

process.on("SIGINT", () => {
    process.stdout.write("\n\n");
    log(`${ansi.yellow}Interrupted by user.${ansi.reset}`);
    process.exit(130);
});

main().catch((error) => {
    process.stdout.write("\n\n");
    log(`${ansi.red}ERROR:${ansi.reset} ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
});
