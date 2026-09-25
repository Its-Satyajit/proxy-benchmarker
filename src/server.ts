import http from "node:http";
import process from "node:process";
import { timingSafeEqual } from "node:crypto";
import { enqueueManualBenchmark, startBullMq, type BullMqRuntime } from "./bullmq.js";

const MANUAL_BENCHMARK_PATH = "/jobs/benchmark";

type QueueState = "starting" | "ready" | "error";

let queueState: QueueState = "starting";
let queueRuntime: BullMqRuntime | undefined;
let shuttingDown = false;

function sendJson(
    response: http.ServerResponse,
    statusCode: number,
    body: Record<string, unknown>
): void {
    response.writeHead(statusCode, { "Content-Type": "application/json" });
    response.end(JSON.stringify(body));
}

function hasManualTriggerKey(request: http.IncomingMessage): boolean {
    const configuredKey = process.env.MANUAL_TRIGGER_KEY;
    const authorization = request.headers.authorization;
    if (!configuredKey || !authorization?.startsWith("Bearer ")) {
        return false;
    }

    const providedKey = Buffer.from(authorization.slice("Bearer ".length));
    const expectedKey = Buffer.from(configuredKey);
    return providedKey.length === expectedKey.length && timingSafeEqual(providedKey, expectedKey);
}

async function startQueue(): Promise<void> {
    try {
        const runtime = await startBullMq({
            onError: () => {
                queueState = "error";
            },
            onReady: () => {
                if (queueRuntime) queueState = "ready";
            },
        });
        queueRuntime = runtime;
        queueState = "ready";
    } catch (error) {
        queueState = "error";
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[bullmq] startup failed: ${message}`);
    }
}

const server = http.createServer(async (req, res) => {
    const ready = queueState === "ready";
    if (req.url === "/" || req.url === "/health" || req.url === "/ready") {
        sendJson(res, ready ? 200 : 503, {
            status: ready ? "OK" : "NOT_READY",
            service: "proxy-benchmarker-bullmq",
            queue: queueState,
            timestamp: new Date().toISOString(),
        });
        return;
    }

    if (req.url === MANUAL_BENCHMARK_PATH) {
        if (req.method !== "POST") {
            sendJson(res, 405, { error: "Use POST for this endpoint." });
            return;
        }

        if (!process.env.MANUAL_TRIGGER_KEY) {
            sendJson(res, 503, { error: "Manual benchmark trigger is not configured." });
            return;
        }

        if (!hasManualTriggerKey(req)) {
            sendJson(res, 401, { error: "Unauthorized" });
            return;
        }

        if (!queueRuntime || queueState !== "ready") {
            sendJson(res, 503, { error: "Benchmark queue is not ready." });
            return;
        }

        try {
            const jobId = await enqueueManualBenchmark(queueRuntime.queue);
            console.log(`[server] manually queued benchmark job ${jobId}`);
            sendJson(res, 202, {
                status: "queued",
                queue: "proxy-benchmark",
                jobId,
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[server] manual benchmark enqueue failed: ${message}`);
            sendJson(res, 500, { error: "Could not queue benchmark." });
        }
        return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
});

async function shutdown(signal: string): Promise<void> {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[server] received ${signal}; shutting down`);

    if (queueRuntime) {
        await queueRuntime.close().catch((error) => {
            console.error(`[server] queue shutdown error: ${error.message}`);
        });
    }

    server.close(() => process.exit(0));
}

const port = Number.parseInt(process.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
    console.log(`[server] BullMQ worker listening on http://0.0.0.0:${port}`);
    console.log(`[server] Health check: http://0.0.0.0:${port}/health`);
    console.log(`[server] Readiness check: http://0.0.0.0:${port}/ready`);
    void startQueue();
});

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));
