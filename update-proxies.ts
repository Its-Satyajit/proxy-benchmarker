#!/usr/bin/env node

import path from "node:path";
import process from "node:process";
import type { Protocol } from "./src/types.js";
import { CONFIG } from "./src/config.js";
import { log, ansi } from "./src/terminal.js";
import { checkDependencies, prepareEndpoints, getLocalPublicIp } from "./src/dns.js";
import { downloadCsv, parseCsv } from "./src/csv.js";
import { deduplicateProxies } from "./src/proxy.js";
import { runProxyTests } from "./src/tester.js";
import {
    writeProxyFiles,
    generateHtmlReport,
    writeJsonReport,
    atomicWrite,
    printSummary
} from "./src/reporter.js";

/* ============================================================
 * Main Workflow
 * ============================================================ */

async function main(): Promise<void> {
    log("");
    log("========================================");
    log("   Proxy Benchmark & Best Network Finder ");
    log("========================================");
    log("");

    // 1. Dependency Checks & Network Context
    await checkDependencies();
    log(`${ansi.green}[OK]${ansi.reset} curl and dig are available`);

    const localPublicIp = await getLocalPublicIp();
    log(`${ansi.cyan}[INFO]${ansi.reset} Local Network Public IP: ${ansi.bold}${localPublicIp || "Direct / Unknown"}${ansi.reset}`);

    log(
        `${ansi.gray}` +
        `TCP Sockets: ${CONFIG.tcpConcurrency} | ` +
        `Workers: ${CONFIG.concurrency} | ` +
        `Timeout: ${CONFIG.timeoutSeconds}s | ` +
        `DNS: ${CONFIG.cloudflareDns} | ` +
        `Top Websites: ${CONFIG.benchmarkTopWebsites ? `${CONFIG.topWebsites?.length || 50} sites` : "Disabled"}` +
        `${ansi.reset}\n`
    );

    // 2. Resolve Test Endpoint DNS
    const endpoints = await prepareEndpoints(CONFIG.testEndpoints, CONFIG);

    // 3. Download Proxy List
    log("========================================");
    log("        Downloading Proxy List          ");
    log("========================================");
    log("");

    const csv = await downloadCsv(CONFIG.csvUrls, CONFIG);

    // 4. Parse and Normalize
    log(`\n${ansi.cyan}Parsing proxy list CSV...${ansi.reset}`);
    const rows = parseCsv(csv);
    let proxies = deduplicateProxies(rows);

    if (proxies.length === 0) {
        throw new Error("Proxy list CSV contained no valid proxies.");
    }

    if (CONFIG.limit > 0 && CONFIG.limit < proxies.length) {
        log(`  Limiting test to first ${CONFIG.limit} proxies (LIMIT=${CONFIG.limit})`);
        proxies = proxies.slice(0, CONFIG.limit);
    }

    const discovered: Record<Protocol, number> = { http: 0, https: 0, socks4: 0, socks5: 0 };
    for (const proxy of proxies) {
        discovered[proxy.protocol]++;
    }

    log(`  Discovered ${proxies.length.toLocaleString()} unique proxies\n`);
    for (const protocol of ["http", "https", "socks4", "socks5"] as Protocol[]) {
        log(`  ${protocol.toUpperCase().padEnd(7)} ${discovered[protocol].toLocaleString()}`);
    }

    // 5. Test & Benchmark
    log("\n========================================");
    log("       Benchmarking & Testing Proxies   ");
    log("========================================");
    log("");
    log(`Stage 1: Ultra-Fast Async TCP Socket Pre-Filter (${CONFIG.tcpConcurrency} parallel sockets)`);
    log(`Stage 2: Health & Exit IP Verification (${endpoints.length} verification endpoints)`);
    if (CONFIG.benchmarkTopWebsites) {
        log(`Stage 3: Top ${CONFIG.topWebsites?.length || 50} Global Websites Benchmark (Google, Cloudflare, GitHub, etc.)`);
    }
    log("Stage 4: Composite Best Proxy Scoring & Network Compatibility Ranking\n");

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
