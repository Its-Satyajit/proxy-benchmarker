#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type { PresetName, Protocol, ProxyItem } from "./src/types.js";
import { CONFIG, createConfig, presetFromEnv } from "./src/config.js";
import { candidateLimit, parsePresetName, positiveInt } from "./src/limits.js";
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

interface CliOptions {
    customProxies: ProxyItem[];
    limit?: number;
    concurrency?: number;
    tcpConcurrency?: number;
    websiteWorkers?: number;
    websiteConcurrency?: number;
    maxCurlProcesses?: number;
    preset?: PresetName;
    strictTls?: boolean;
    showHelp?: boolean;
}

/** Rejects NaN/0/negative input up front instead of letting a stage clamp it. */
function requireInt(raw: string | undefined, flag: string, allowZero = false): number {
    if (raw === undefined || raw.trim() === "") {
        throw new Error(`${flag} requires a value`);
    }
    const value = Number(raw.trim());
    if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1)) {
        throw new Error(`${flag} must be an integer >= ${allowZero ? 0 : 1} (got "${raw}")`);
    }
    return value;
}

async function parseCliArgs(rawArgs: string[]): Promise<CliOptions> {
    const customProxies: ProxyItem[] = [];
    const options: CliOptions = { customProxies, showHelp: false };

    for (let i = 0; i < rawArgs.length; i++) {
        const arg = rawArgs[i];
        if (arg === "-h" || arg === "--help") {
            options.showHelp = true;
            continue;
        }
        if (arg === "-n" || arg === "--limit") {
            options.limit = candidateLimit(requireInt(rawArgs[++i], "--limit", true), "--limit");
            continue;
        }
        if (arg.startsWith("--limit=")) {
            options.limit = candidateLimit(requireInt(arg.split("=")[1], "--limit", true), "--limit");
            continue;
        }
        if (arg === "-c" || arg === "--concurrency") {
            options.concurrency = positiveInt(requireInt(rawArgs[++i], "--concurrency"), "--concurrency");
            continue;
        }
        if (arg.startsWith("--concurrency=")) {
            options.concurrency = positiveInt(requireInt(arg.split("=")[1], "--concurrency"), "--concurrency");
            continue;
        }
        if (arg === "--tcp-concurrency") {
            options.tcpConcurrency = positiveInt(requireInt(rawArgs[++i], "--tcp-concurrency"), "--tcp-concurrency");
            continue;
        }
        if (arg.startsWith("--tcp-concurrency=")) {
            options.tcpConcurrency = positiveInt(requireInt(arg.split("=")[1], "--tcp-concurrency"), "--tcp-concurrency");
            continue;
        }
        if (arg === "--website-workers") {
            options.websiteWorkers = positiveInt(requireInt(rawArgs[++i], "--website-workers"), "--website-workers");
            continue;
        }
        if (arg.startsWith("--website-workers=")) {
            options.websiteWorkers = positiveInt(requireInt(arg.split("=")[1], "--website-workers"), "--website-workers");
            continue;
        }
        if (arg === "--max-curl") {
            options.maxCurlProcesses = positiveInt(requireInt(rawArgs[++i], "--max-curl"), "--max-curl");
            continue;
        }
        if (arg.startsWith("--max-curl=")) {
            options.maxCurlProcesses = positiveInt(requireInt(arg.split("=")[1], "--max-curl"), "--max-curl");
            continue;
        }
        if (arg === "--strict-tls") {
            options.strictTls = true;
            continue;
        }
        if (arg === "--safe") {
            options.preset = "safe";
            continue;
        }
        if (arg === "--home") {
            options.preset = "home";
            continue;
        }
        if (arg === "--turbo" || arg === "--vps") {
            options.preset = "turbo";
            continue;
        }
        if (arg.startsWith("--preset=")) {
            options.preset = parsePresetName(arg.split("=")[1], "--preset");
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

    return options;
}

function printHelp(): void {
    log(`
Proxy Benchmark & Network Telemetry Suite

Usage:
  nub update-proxies.ts [options] [proxy...] [file...]
  curl -fsSL https://.../run.sh | bash -s -- [options] [proxy...]
  irm https://.../run.ps1 | iex [options] [proxy...]

Examples:
  # Benchmark with the default safe preset
  nub update-proxies.ts

  # Benchmark with home-router defaults (larger run)
  nub update-proxies.ts --home

  # Benchmark with ultra-gentle mode for sensitive/budget WiFi routers
  nub update-proxies.ts --safe

  # Benchmark high-speed mode on VPS / Gigabit servers
  nub update-proxies.ts --turbo

  # Benchmark a single specific proxy route
  nub update-proxies.ts socks5://64.227.186.105:1080

  # Benchmark custom list from file
  nub update-proxies.ts my-proxies.txt

Options:
  --safe              Gentle profile (500 candidates, 35 TCP sockets, 12 verification workers, 4 website workers, 16 global curl) - default
  --home              Home profile (2,000 candidates, 80 TCP sockets, 25 verification workers, 8 website workers, 64 global curl)
  --turbo, --vps      High-performance profile (1,500 TCP sockets, 300 verification workers, 100 website workers, 1,500 global curl)
  -c, --concurrency   Override Stage 2 verification worker count
  --tcp-concurrency   Override Stage 1 parallel TCP socket count
  --website-workers   Override Stage 3 proxy worker count
  --max-curl          Global ceiling on concurrent curl processes
  -n, --limit <num>   Candidate cap (0 = unlimited)
  --strict-tls        Verify TLS certificates instead of permissive transport probing
  -h, --help          Show this help message
`);
}

/* ============================================================
 * Main Workflow
 * ============================================================ */

async function main(): Promise<void> {
    const options = await parseCliArgs(process.argv.slice(2));

    if (options.showHelp) {
        printHelp();
        process.exit(0);
    }

    // Single resolution point: preset defaults -> environment -> CLI overrides.
    const resolved = createConfig(options.preset ?? presetFromEnv(process.env), process.env, {
        concurrency: options.concurrency,
        tcpConcurrency: options.tcpConcurrency,
        websiteWorkers: options.websiteWorkers,
        websiteConcurrency: options.websiteConcurrency,
        maxCurlProcesses: options.maxCurlProcesses,
        limit: options.limit,
        tlsVerify: options.strictTls,
    });
    Object.assign(CONFIG, resolved);

    const effectiveLimit = CONFIG.limit;

    log("");
    log("========================================");
    log("   Proxy Benchmark & Best Network Finder ");
    log("========================================");
    log("");
    log("Benchmark limits");
    log("──────────────────────────────────────────");
    log(`  Preset             ${options.preset ?? presetFromEnv(process.env)}`);
    log(`  Candidate cap      ${effectiveLimit === 0 ? "unlimited" : effectiveLimit.toLocaleString()}`);
    log(`  TCP connections    ${CONFIG.tcpConcurrency}`);
    log(`  Verification       ${CONFIG.concurrency}`);
    log(`  Website workers    ${CONFIG.websiteWorkers} x ${CONFIG.websiteConcurrency} probes`);
    log(`  Global curl cap    ${CONFIG.maxCurlProcesses}`);
    log(`  TLS verification   ${CONFIG.tlsVerify ? "strict" : "permissive (--insecure)"}`);
    log("");

    // 1. Dependency Checks & Network Context
    await checkDependencies();
    log(`${ansi.green}[OK]${ansi.reset} Network tools ready`);

    const localPublicIp = await getLocalPublicIp();
    log(`${ansi.cyan}[INFO]${ansi.reset} Origin Public IP: ${ansi.bold}${localPublicIp || "Direct / Unknown"}${ansi.reset}`);

    log(
        `${ansi.gray}` +
        `Timeout: ${CONFIG.timeoutSeconds}s | ` +
        `DNS: ${CONFIG.cloudflareDns} | ` +
        `Edge Targets: ${CONFIG.benchmarkTopWebsites ? `${CONFIG.topWebsites.length} sites` : "Disabled"}` +
        `${ansi.reset}\n`
    );

    // 2. Resolve Test Endpoint & Edge Targets DNS
    const endpoints = await prepareEndpoints(CONFIG.testEndpoints, CONFIG);
    if (CONFIG.benchmarkTopWebsites && CONFIG.topWebsites.length > 0) {
        CONFIG.topWebsites = await prepareWebsiteTargets(CONFIG.topWebsites, CONFIG);
    }

    let proxies: ProxyItem[] = [];

    if (options.customProxies.length > 0) {
        // Use custom CLI endpoints
        log("========================================");
        log("     Target Endpoints (CLI Input)       ");
        log("========================================");
        log("");
        proxies = deduplicateProxies(options.customProxies);
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
    log(`Stage 2: Transport Handshake & Egress Verification (${endpoints.length} verification endpoints, ${CONFIG.concurrency} workers)`);
    if (CONFIG.benchmarkTopWebsites) {
        log(`Stage 3: Global Edge Reachability Benchmark (${CONFIG.topWebsites.length} destinations, ${CONFIG.websiteWorkers} workers)`);
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
        run: {
            preset: options.preset ?? presetFromEnv(process.env),
            tlsVerification: CONFIG.tlsVerify ? "strict" : "permissive",
            maxCurlProcesses: CONFIG.maxCurlProcesses,
            tcpConcurrency: CONFIG.tcpConcurrency,
            verificationWorkers: CONFIG.concurrency,
            websiteWorkers: CONFIG.websiteWorkers,
            websiteConcurrency: CONFIG.websiteConcurrency,
        },
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
