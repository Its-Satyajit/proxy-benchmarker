import process from "node:process";
import { Queue, Worker, type ConnectionOptions, type JobsOptions } from "bullmq";
import { runProxyBenchmarkJob, type BenchmarkStats, type CommitResult, type PagesResult } from "./jobs/proxy-benchmark.js";

export const PROXY_QUEUE_NAME = "proxy-benchmark";
const SCHEDULER_ID = "proxy-benchmark-hourly";
// BullMQ cron fields are: seconds, minutes, hours, day, month, weekday.
const DEFAULT_CRON = "0 0 * * * *";
const DEFAULT_QUEUE_PREFIX = "proxy-benchmarker";
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

export interface BullMqStartOptions {
    onError?: (error: Error) => void;
    onReady?: () => void;
}

function normalizedError(error: unknown): Error {
    return error instanceof Error ? error : new Error(String(error));
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

function queuePrefix(): string {
    return process.env.BULLMQ_PREFIX?.trim() || DEFAULT_QUEUE_PREFIX;
}

function cronPattern(): string {
    const configured =
        process.env.BULLMQ_CRON?.trim() || process.env.CRON?.trim() || DEFAULT_CRON;
    const fields = configured.split(/\s+/);
    if (fields.length === 5) return `0 ${configured}`;
    if (fields.length !== 6) {
        throw new Error("BULLMQ_CRON must have five or six cron fields.");
    }
    return configured;
}

export async function startBullMq(options: BullMqStartOptions = {}): Promise<BullMqRuntime> {
    const connection = redisConnection();
    const prefix = queuePrefix();
    const queue = new Queue<BenchmarkJobData, BenchmarkJobResult>(PROXY_QUEUE_NAME, {
        connection,
        prefix,
    });
    const worker = new Worker<BenchmarkJobData, BenchmarkJobResult>(
        PROXY_QUEUE_NAME,
        async () => runProxyBenchmarkJob(),
        { connection, prefix, concurrency: 1 }
    );
    const reportError = (error: unknown) => {
        const normalized = normalizedError(error);
        console.error(`[bullmq] connection error: ${normalized.message}`);
        options.onError?.(normalized);
    };

    worker.on("completed", (job) => {
        console.log(`[bullmq] benchmark job ${job.id} completed`);
    });
    worker.on("failed", (job, error) => {
        console.error(`[bullmq] benchmark job ${job?.id ?? "unknown"} failed: ${error.message}`);
    });
    worker.on("error", reportError);
    worker.on("ready", () => options.onReady?.());
    queue.on("error", reportError);

    try {
        await Promise.all([queue.waitUntilReady(), worker.waitUntilReady()]);
        await queue.setGlobalConcurrency(1);
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
