import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type {
    AppConfig,
    BenchmarkItem,
    BenchmarkStats,
    Protocol,
    ProxyItem,
    TestEndpoint
} from "../types.js";
import { CONFIG } from "../config.js";
import { log, ansi, formatDuration } from "../terminal.js";
import { proxyOutputUrl } from "../proxy.js";

export async function atomicWrite(filePath: string, contents: string): Promise<void> {
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tempPath, contents, "utf8");
    await fs.rename(tempPath, filePath);
}

export async function writeProxyFiles(
    results: Record<Protocol, ProxyItem[]>,
    config: AppConfig
): Promise<void> {
    for (const [protocol, filename] of Object.entries(config.outputFiles) as [Protocol, string][]) {
        const entries = results[protocol].map(proxyOutputUrl);
        const contents = entries.length > 0 ? `${entries.join("\n")}\n` : "";
        await atomicWrite(path.join(config.outputDir, filename), contents);
    }
}

export async function writeJsonReport(
    reportData: {
        generatedAt: string;
        stats: BenchmarkStats;
        endpoints: TestEndpoint[];
        benchmarks: BenchmarkItem[];
    },
    outputPath: string
): Promise<void> {
    const jsonContent = JSON.stringify(reportData, null, 2);
    await atomicWrite(outputPath, jsonContent);
}

export function printSummary(
    stats: BenchmarkStats,
    results: Record<Protocol, ProxyItem[]>,
    enabledEndpointCount: number,
    _totalEndpointCount: number,
    reportPaths: { html?: string; json?: string }
): void {
    log("========================================");
    log("                 Results");
    log("========================================");
    log("");

    for (const protocol of ["http", "https", "socks4", "socks5"] as Protocol[]) {
        log(
            `  ${protocol.toUpperCase().padEnd(7)} ` +
            `${results[protocol].length.toLocaleString()} passed`
        );
    }

    log("");
    log(`  Local Network IP: ${stats.localPublicIp || 'Direct'}`);
    log(`  Verification    : Hard-failed if 0/${enabledEndpointCount} connected`);
    log(`  Top Websites    : ${CONFIG.topWebsites?.length || 50} websites benchmarked`);
    log(`  Total tested    : ${stats.total.toLocaleString()}`);
    log(`  Passed / Alive  : ${stats.passed.toLocaleString()}`);
    log(`  Hard Failed     : ${stats.failed.toLocaleString()} (excluded from report)`);
    log(`  Duration        : ${formatDuration(stats.durationSeconds)}`);
    log("");
    log("Output files:");
    for (const filename of Object.values(CONFIG.outputFiles)) {
        log(`  ${path.join(CONFIG.outputDir, filename)}`);
    }
    log("");
    log("Benchmark Reports:");
    if (reportPaths.html) {
        log(`  ${ansi.green}HTML Report :${ansi.reset} ${reportPaths.html}`);
    }
    if (reportPaths.json) {
        log(`  ${ansi.cyan}JSON Report :${ansi.reset} ${reportPaths.json}`);
    }
    log("");
}
