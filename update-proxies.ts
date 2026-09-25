#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import type { Protocol, ProxyItem } from "./src/types.js";
import { CONFIG, createConfig, presetFromEnv } from "./src/config.js";
import { log, ansi } from "./src/terminal.js";
import { checkDependencies, prepareEndpoints, prepareWebsiteTargets, getLocalPublicIp } from "./src/dns.js";
import { downloadAllFeeds, interleaveByFeed } from "./src/csv.js";
import { deduplicateProxies } from "./src/proxy.js";
import { runProxyTests } from "./src/tester.js";
import { configureCurlGate } from "./src/curl-gate.js";
import {
    writeProxyFiles,
    generateHtmlReport,
    writeJsonReport,
    atomicWrite,
    printSummary
} from "./src/reporter.js";
import { parseCliArgs, printHelp } from "./src/cli.js";

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
    // Enforce the curl ceiling for the whole run, including feed downloads and
    // the origin-IP lookup, not just the benchmark stages.
    configureCurlGate(CONFIG.maxCurlProcesses);

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

        const { proxies: feedProxies, feedBuckets } = await downloadAllFeeds(CONFIG);
        proxies = feedProxies;

        if (proxies.length === 0) {
            throw new Error("Candidate feeds contained no valid endpoints.");
        }

        if (effectiveLimit > 0 && effectiveLimit < proxies.length) {
            // Round-robin across feeds: reproducible, and not dominated by whichever
            // feed happens to be fetched first.
            proxies = interleaveByFeed(feedBuckets, effectiveLimit);
            log(`  Limited to ${proxies.length.toLocaleString()} candidates, sampled round-robin across ${feedBuckets.length} feeds (LIMIT=${effectiveLimit})`);
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
