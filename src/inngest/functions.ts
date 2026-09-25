import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Octokit } from "@octokit/rest";
import { inngest } from "./client.js";

const execFileAsync = promisify(execFile);

export const updateProxiesCron = inngest.createFunction(
    {
        id: "update-proxies-cron",
        name: "Scheduled Proxy Benchmark & Sync",
        retries: 2,
        triggers: [
            { cron: process.env.CRON || "0 * * * *" },
        ],
    },
    async ({ step }) => {
        // Step 1: Run proxy benchmark locally on Railway container
        const stats = await step.run("execute-benchmark", async () => {
            const bundlePath = path.resolve(process.cwd(), "dist/proxy-benchmarker.min.mjs");
            const { stdout } = await execFileAsync("node", [bundlePath, "--turbo"], {
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
                summary: stdout.slice(-800),
            };
        });

        const shouldPublish = stats.passed > 0;
        const emptyResultReason = "Benchmark produced no verified proxies; existing lists preserved.";

        // Step 2: Push updated proxy files to GitHub master branch (0 runner minutes)
        const commitResult = await step.run("commit-to-github", async () => {
            if (!shouldPublish) {
                return { skipped: true, reason: emptyResultReason };
            }

            const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
            if (!token) {
                return { skipped: true, reason: "No GITHUB_TOKEN or GITHUB_PAT configured." };
            }

            const owner = process.env.GITHUB_OWNER || "Its-Satyajit";
            const repo = process.env.GITHUB_REPO || "proxy-benchmarker";
            const branch = process.env.GITHUB_BRANCH || "master";
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
                        // New file
                    }

                    await octokit.repos.createOrUpdateFileContents({
                        owner,
                        repo,
                        path: file,
                        branch,
                        message: `chore(proxies): update ${file} via Inngest [skip ci]`,
                        content: Buffer.from(content).toString("base64"),
                        sha,
                    });

                    results[file] = "synced";
                } catch (err: any) {
                    results[file] = `failed: ${err.message}`;
                }
            }

            return { owner, repo, branch, results };
        });

        // Step 3: Deploy HTML report to gh-pages branch (0 runner minutes)
        const pagesResult = await step.run("deploy-to-gh-pages", async () => {
            if (!shouldPublish) {
                return { skipped: true, reason: emptyResultReason };
            }

            const token = process.env.GITHUB_TOKEN || process.env.GITHUB_PAT;
            if (!token) return { skipped: true };

            const owner = process.env.GITHUB_OWNER || "Its-Satyajit";
            const repo = process.env.GITHUB_REPO || "proxy-benchmarker";
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
                    // New file or branch
                }

                await octokit.repos.createOrUpdateFileContents({
                    owner,
                    repo,
                    path: "index.html",
                    branch: "gh-pages",
                    message: "deploy: update GitHub Pages report [skip ci]",
                    content: Buffer.from(htmlContent).toString("base64"),
                    sha,
                });

                return { status: "deployed", branch: "gh-pages" };
            } catch (err: any) {
                return { status: "failed", error: err.message };
            }
        });

        return { stats, commitResult, pagesResult };
    }
);
