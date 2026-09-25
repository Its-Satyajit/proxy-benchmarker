import process from "node:process";
import { inngest } from "./client.js";
import { deployReport, executeBenchmark, syncProxyFiles } from "../jobs/proxy-benchmark.js";

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
        const stats = await step.run("execute-benchmark", async () => executeBenchmark());
        const shouldPublish = stats.passed > 0;

        const commitResult = await step.run("commit-to-github", async () =>
            syncProxyFiles(shouldPublish)
        );
        const pagesResult = await step.run("deploy-to-gh-pages", async () =>
            deployReport(shouldPublish)
        );

        return { stats, commitResult, pagesResult };
    }
);
