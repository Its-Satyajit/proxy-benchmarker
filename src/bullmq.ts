import process from "node:process";
import { Queue, Worker, type ConnectionOptions, type JobsOptions } from "bullmq";
import { runProxyBenchmarkJob, type BenchmarkStats, type CommitResult, type PagesResult } from "./jobs/proxy-benchmark.js";

export const PROXY_QUEUE_NAME = "proxy-benchmark";
const SCHEDULER_ID = "proxy-benchmark-hourly";
// BullMQ cron fields are: seconds, minutes, hours, day, month, weekday.
const DEFAULT_CRON = "0 0 * * * *";
const BENCHMARK_JOB_OPTIONS: JobsOptions = {
    attempts: 2,
    backoff: { type: "exponential", delay: 60_000 },
    removeOnComplete: 10,
    removeOnFail: 50,
};

type BenchmarkJobData = Record<string, never>;
type BenchmarkJobResult = {
    stats: BenchmarkStats;
    commitResult: CommitResult;
    pagesResult: PagesResult;
};

export interface BullMqRuntime {
    queue: Queue<BenchmarkJobData, BenchmarkJobResult>;
    worker: Worker<BenchmarkJobData, BenchmarkJobResult>;
    close: () => Promise<void>;
}

function redisConnection(): ConnectionOptions {
    const url = process.env.REDIS_URL?.trim();
    if (url) {
        return { url, maxRetriesPerRequest: null };
    }

    const host = process.env.REDIS_HOST?.trim();
    if (!host) {
        throw new Error("REDIS_HOST or REDIS_URL is required for the BullMQ worker.");
    }

    const port = Number.parseInt(process.env.REDIS_PORT || "6379", 10);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        throw new Error("REDIS_PORT must be a valid TCP port.");
    }

    return {
        host,
        port,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
        connectTimeout: 10_000,
    };
}

function cronPattern(): string {
    const configured = process.env.BULLMQ_CRON?.trim() || DEFAULT_CRON;
    const fields = configured.split(/\s+/);
    return fields.length === 5 ? `0 ${configured}` : configured;
}

export async function startBullMq(): Promise<BullMqRuntime> {
    const connection = redisConnection();
    const queue = new Queue<BenchmarkJobData, BenchmarkJobResult>(PROXY_QUEUE_NAME, {
        connection,
    });
    const worker = new Worker<BenchmarkJobData, BenchmarkJobResult>(
        PROXY_QUEUE_NAME,
        async () => runProxyBenchmarkJob(),
        { connection, concurrency: 1 }
    );

    worker.on("completed", (job) => {
        console.log(`[bullmq] benchmark job ${job.id} completed`);
    });
    worker.on("failed", (job, error) => {
        console.error(`[bullmq] benchmark job ${job?.id ?? "unknown"} failed: ${error.message}`);
    });
    worker.on("error", (error) => {
        console.error(`[bullmq] worker error: ${error.message}`);
    });
    queue.on("error", (error) => {
        console.error(`[bullmq] queue error: ${error.message}`);
    });

    try {
        await queue.waitUntilReady();
        const pattern = cronPattern();
        await queue.removeJobScheduler(SCHEDULER_ID);
        await queue.upsertJobScheduler(
            SCHEDULER_ID,
            { pattern, tz: "UTC" },
            {
                name: "benchmark",
                data: {},
                opts: { ...BENCHMARK_JOB_OPTIONS },
            }
        );
        console.log(`[bullmq] connected; scheduler ${SCHEDULER_ID} uses ${pattern} UTC`);
    } catch (error) {
        await worker.close().catch(() => undefined);
        await queue.close().catch(() => undefined);
        throw error;
    }

    return {
        queue,
        worker,
        close: async () => {
            await worker.close();
            await queue.close();
        },
    };
}

export async function enqueueManualBenchmark(queue: BullMqRuntime["queue"]): Promise<string> {
    const job = await queue.add("benchmark-manual", {}, { ...BENCHMARK_JOB_OPTIONS });
    if (!job.id) {
        throw new Error("BullMQ did not return a job ID.");
    }
    return job.id;
}
