#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { exec, spawn } from "node:child_process";

const REPO_OWNER = "Its-Satyajit";
const REPO_NAME = "proxy-benchmarker";
const BUNDLE_FILENAME = "proxy-benchmarker.min.mjs";
const TMP_BUNDLE_PATH = path.join(process.cwd(), ".proxy-benchmarker.latest.mjs");
const REPORT_PATH = path.join(process.cwd(), "benchmark-report.html");

const ansi = {
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    green: "\x1b[32m",
    cyan: "\x1b[36m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    gray: "\x1b[90m",
} as const;

function log(msg: string): void {
    process.stdout.write(`${msg}\n`);
}

async function fetchLatestBundle(): Promise<string> {
    log(`${ansi.cyan}[INFO] Fetching latest minified release from GitHub (${REPO_OWNER}/${REPO_NAME})...${ansi.reset}`);

    const sources = [
        // 1. Direct GitHub Release Asset Download
        async () => {
            const url = `https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest/download/${BUNDLE_FILENAME}`;
            const res = await fetch(url, { redirect: "follow" });
            if (!res.ok) throw new Error(`Direct release download returned HTTP ${res.status}`);
            return await res.text();
        },
        // 2. GitHub Releases Latest API
        async () => {
            const res = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`, {
                headers: { "User-Agent": "Proxy-Benchmarker-Launcher" },
            });
            if (!res.ok) throw new Error(`Release API returned HTTP ${res.status}`);
            const data = await res.json() as { assets?: { name: string; browser_download_url: string }[] };
            const asset = data.assets?.find((a) => a.name === BUNDLE_FILENAME);
            if (!asset?.browser_download_url) throw new Error("Bundle asset not found in release");
            
            const fileRes = await fetch(asset.browser_download_url);
            if (!fileRes.ok) throw new Error(`Asset download failed with HTTP ${fileRes.status}`);
            return await fileRes.text();
        },
        // 3. Raw GitHub Master Branch Fallback
        async () => {
            const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/dist/${BUNDLE_FILENAME}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Raw master returned HTTP ${res.status}`);
            return await res.text();
        },
        // 4. Raw GitHub Main Branch Fallback
        async () => {
            const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/dist/${BUNDLE_FILENAME}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Raw main returned HTTP ${res.status}`);
            return await res.text();
        },
    ];

    for (const source of sources) {
        try {
            const content = await source();
            if (content && content.length > 1000) {
                await fs.writeFile(TMP_BUNDLE_PATH, content, "utf8");
                log(`${ansi.green}[OK] Latest bundle downloaded successfully (${Math.round(content.length / 1024)} KB)${ansi.reset}\n`);
                return TMP_BUNDLE_PATH;
            }
        } catch {
            // Try next source
        }
    }

    // Fallback: check if local build exists
    const localPath = path.join(process.cwd(), "dist", BUNDLE_FILENAME);
    try {
        await fs.access(localPath);
        log(`${ansi.yellow}[WARN] Remote fetch unavailable. Using local bundle: ${localPath}${ansi.reset}\n`);
        return localPath;
    } catch {
        throw new Error("Failed to fetch latest bundle from GitHub and no local dist bundle found.");
    }
}

function openBrowser(filePath: string): void {
    const platform = process.platform;
    let command: string;

    if (platform === "win32") {
        command = `start "" "${filePath}"`;
    } else if (platform === "darwin") {
        command = `open "${filePath}"`;
    } else {
        command = `xdg-open "${filePath}" 2>/dev/null || sensible-browser "${filePath}" 2>/dev/null || x-www-browser "${filePath}" 2>/dev/null`;
    }

    exec(command, () => {});
}

async function main(): Promise<void> {
    log("\n========================================");
    log("   Proxy Benchmark Launcher & Browser   ");
    log("========================================");
    log("");

    const bundlePath = await fetchLatestBundle();

    log(`${ansi.bold}${ansi.cyan}>> Starting Benchmark Execution...${ansi.reset}\n`);

    const child = spawn("node", [bundlePath, ...process.argv.slice(2)], {
        stdio: "inherit",
        env: process.env,
    });

    child.on("close", async (code: number | null) => {
        // Clean up temp file if created
        try {
            if (bundlePath === TMP_BUNDLE_PATH) {
                await fs.unlink(TMP_BUNDLE_PATH);
            }
        } catch {}

        if (code === 0) {
            log(`\n${ansi.green}[OK] Benchmark Completed Successfully!${ansi.reset}`);
            log(`${ansi.cyan}[INFO] Launching HTML Benchmark Report in your browser...${ansi.reset}`);
            
            try {
                await fs.access(REPORT_PATH);
                openBrowser(REPORT_PATH);
                log(`${ansi.gray}Opened: ${REPORT_PATH}${ansi.reset}\n`);
            } catch {
                log(`${ansi.yellow}[WARN] Report file not found at ${REPORT_PATH}${ansi.reset}\n`);
            }
        } else {
            log(`\n${ansi.red}[FAIL] Benchmark process exited with code ${code}${ansi.reset}\n`);
        }
        process.exit(code || 0);
    });
}

main().catch((err: Error) => {
    log(`\n${ansi.red}ERROR:${ansi.reset} ${err.message}\n`);
    process.exit(1);
});
