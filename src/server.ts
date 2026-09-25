import http from "node:http";
import process from "node:process";
import { startBullMq, type BullMqRuntime } from "./bullmq.js";

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

const server = http.createServer((req, res) => {
    if (req.url === "/" || req.url === "/health") {
        sendJson(res, 200, {
            status: "OK",
            service: "proxy-benchmarker-bullmq",
            queue: queueState,
            timestamp: new Date().toISOString(),
        });
        return;
    }

    if (req.url === "/ready") {
        const ready = queueState === "ready";
        sendJson(res, ready ? 200 : 503, {
            status: ready ? "OK" : "NOT_READY",
            service: "proxy-benchmarker-bullmq",
            queue: queueState,
        });
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

    void startBullMq()
        .then((runtime) => {
            queueRuntime = runtime;
            queueState = "ready";
        })
        .catch((error: unknown) => {
            queueState = "error";
            const message = error instanceof Error ? error.message : String(error);
            console.error(`[bullmq] startup failed: ${message}`);
        });
});

process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("SIGINT", () => void shutdown("SIGINT"));
