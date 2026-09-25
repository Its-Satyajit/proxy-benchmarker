import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Octokit } from "@octokit/rest";

const execFileAsync = promisify(execFile);

export const EMPTY_RESULT_REASON =
    "Benchmark produced no verified proxies; existing lists preserved.";

export interface BenchmarkStats {
    completedAt: string;
    passed: number;
    summary: string;
}

export interface CommitResult {
    skipped?: boolean;
    reason?: string;
    owner?: string;
    repo?: string;
    branch?: string;
    results?: Record<string, string>;
}

export interface PagesResult {
    skipped?: boolean;
    reason?: string;
    status?: string;
    branch?: string;
    error?: string;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function githubRepository() {
    return {
        owner: process.env.GITHUB_OWNER || "Its-Satyajit",
        repo: process.env.GITHUB_REPO || "proxy-benchmarker",
        branch: process.env.GITHUB_BRANCH || "master",
    };
}

export async function executeBenchmark(): Promise<BenchmarkStats> {
    const bundlePath = path.resolve(process.cwd(), "dist/proxy-benchmarker.min.mjs");
    const { stdout } = await execFileAsync(process.execPath, [bundlePath, "--turbo"], {
        timeout: 300_000,
        maxBuffer: 10 * 1024 * 1024,
    });
    const report = JSON.parse(
        await fs.readFile(path.resolve(process.cwd(), "benchmark-report.json"), "utf8")
    ) as { stats?: { passed?: number } };
    const passed = report.stats?.passed;

    if (typeof passed !== "number" || !Number.isSafeInteger(passed) || passed < 0) {
        throw new Error("Benchmark report has no valid passed count; refusing to publish.");
    }

    return {
        completedAt: new Date().toISOString(),
        passed,
        summary: String(stdout).slice(-800),
    };
}

export async function syncProxyFiles(shouldPublish: boolean): Promise<CommitResult> {
    if (!shouldPublish) {
        return { skipped: true, reason: EMPTY_RESULT_REASON };
    }

    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
    if (!token) {
        return { skipped: true, reason: "No GITHUB_TOKEN or GITHUB_PAT configured." };
    }

    const { owner, repo, branch } = githubRepository();
    const octokit = new Octokit({ auth: token });
    const files = [
        "http.txt",
        "https.txt",
        "socks4.txt",
        "socks5.txt",
        "benchmark-report.json",
        "benchmark-report.html",
    ];
    const results: Record<string, string> = {};

    for (const file of files) {
        const filePath = path.resolve(process.cwd(), file);
        try {
            const content = await fs.readFile(filePath, "utf8");
            let sha: string | undefined;

            try {
                const { data } = await octokit.repos.getContent({
                    owner,
                    repo,
                    path: file,
                    ref: branch,
                });
                if (!Array.isArray(data) && data.sha) {
                    sha = data.sha;
                }
            } catch {
                // The file may not exist yet.
            }

            await octokit.repos.createOrUpdateFileContents({
                owner,
                repo,
                path: file,
                branch,
                message: `chore(proxies): update ${file} via BullMQ [skip ci]`,
                content: Buffer.from(content).toString("base64"),
                sha,
            });
            results[file] = "synced";
        } catch (error) {
            results[file] = `failed: ${errorMessage(error)}`;
        }
    }

    return { owner, repo, branch, results };
}

export async function deployReport(shouldPublish: boolean): Promise<PagesResult> {
    if (!shouldPublish) {
        return { skipped: true, reason: EMPTY_RESULT_REASON };
    }

    const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
    if (!token) {
        return { skipped: true, reason: "No GITHUB_TOKEN or GITHUB_PAT configured." };
    }

    const { owner, repo } = githubRepository();
    const octokit = new Octokit({ auth: token });
    const htmlPath = path.resolve(process.cwd(), "benchmark-report.html");

    try {
        const htmlContent = await fs.readFile(htmlPath, "utf8");
        let sha: string | undefined;

        try {
            const { data } = await octokit.repos.getContent({
                owner,
                repo,
                path: "index.html",
                ref: "gh-pages",
            });
            if (!Array.isArray(data) && data.sha) {
                sha = data.sha;
            }
        } catch {
            // The report branch or file may not exist yet.
        }

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: "index.html",
            branch: "gh-pages",
            message: "deploy: update GitHub Pages report via BullMQ [skip ci]",
            content: Buffer.from(htmlContent).toString("base64"),
            sha,
        });

        return { status: "deployed", branch: "gh-pages" };
    } catch (error) {
        return { status: "failed", error: errorMessage(error) };
    }
}

export async function runProxyBenchmarkJob() {
    const stats = await executeBenchmark();
    const shouldPublish = stats.passed > 0;
    const commitResult = await syncProxyFiles(shouldPublish);
    const pagesResult = await deployReport(shouldPublish);
    return { stats, commitResult, pagesResult };
}
