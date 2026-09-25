// src/server.ts
import http from "node:http";
import process3 from "node:process";
import { timingSafeEqual } from "node:crypto";

// src/bullmq.ts
import process2 from "node:process";
import { Queue, Worker } from "bullmq";

// src/jobs/proxy-benchmark.ts
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { Octokit } from "@octokit/rest";
var execFileAsync = promisify(execFile);
var EMPTY_RESULT_REASON = "Benchmark produced no verified proxies; existing lists preserved.";
function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
function githubRepository() {
  return {
    owner: process.env.GITHUB_OWNER || "Its-Satyajit",
    repo: process.env.GITHUB_REPO || "proxy-benchmarker",
    branch: process.env.GITHUB_BRANCH || "master"
  };
}
async function executeBenchmark() {
  const bundlePath = path.resolve(process.cwd(), "dist/proxy-benchmarker.min.mjs");
  const { stdout } = await execFileAsync(process.execPath, [bundlePath, "--turbo"], {
    timeout: 3e5,
    maxBuffer: 10 * 1024 * 1024
  });
  const report = JSON.parse(
    await fs.readFile(path.resolve(process.cwd(), "benchmark-report.json"), "utf8")
  );
  const passed = report.stats?.passed;
  if (typeof passed !== "number" || !Number.isSafeInteger(passed) || passed < 0) {
    throw new Error("Benchmark report has no valid passed count; refusing to publish.");
  }
  return {
    completedAt: (/* @__PURE__ */ new Date()).toISOString(),
    passed,
    summary: String(stdout).slice(-800)
  };
}
async function syncProxyFiles(shouldPublish) {
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
    "benchmark-report.html"
  ];
  const results = {};
  for (const file of files) {
    const filePath = path.resolve(process.cwd(), file);
    try {
      const content = await fs.readFile(filePath, "utf8");
      let sha;
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: file,
          ref: branch
        });
        if (!Array.isArray(data) && data.sha) {
          sha = data.sha;
        }
      } catch {
      }
      await octokit.repos.createOrUpdateFileContents({
        owner,
        repo,
        path: file,
        branch,
        message: `chore(proxies): update ${file} via BullMQ [skip ci]`,
        content: Buffer.from(content).toString("base64"),
        sha
      });
      results[file] = "synced";
    } catch (error) {
      results[file] = `failed: ${errorMessage(error)}`;
    }
  }
  return { owner, repo, branch, results };
}
async function deployReport(shouldPublish) {
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
    let sha;
    try {
      const { data } = await octokit.repos.getContent({
        owner,
        repo,
        path: "index.html",
        ref: "gh-pages"
      });
      if (!Array.isArray(data) && data.sha) {
        sha = data.sha;
      }
    } catch {
    }
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: "index.html",
      branch: "gh-pages",
      message: "deploy: update GitHub Pages report via BullMQ [skip ci]",
      content: Buffer.from(htmlContent).toString("base64"),
      sha
    });
    return { status: "deployed", branch: "gh-pages" };
  } catch (error) {
    return { status: "failed", error: errorMessage(error) };
  }
}
async function runProxyBenchmarkJob() {
  const stats = await executeBenchmark();
  const shouldPublish = stats.passed > 0;
  const commitResult = await syncProxyFiles(shouldPublish);
  const pagesResult = await deployReport(shouldPublish);
  return { stats, commitResult, pagesResult };
}

// src/bullmq.ts
var PROXY_QUEUE_NAME = "proxy-benchmark";
var SCHEDULER_ID = "proxy-benchmark-hourly";
var DEFAULT_CRON = "0 0 * * * *";
var BENCHMARK_JOB_OPTIONS = {
  attempts: 2,
  backoff: { type: "exponential", delay: 6e4 },
  removeOnComplete: 10,
  removeOnFail: 50
};
function redisConnection() {
  const url = process2.env.REDIS_URL?.trim();
  if (url) {
    return { url, maxRetriesPerRequest: null };
  }
  const host = process2.env.REDIS_HOST?.trim();
  if (!host) {
    throw new Error("REDIS_HOST or REDIS_URL is required for the BullMQ worker.");
  }
  const port2 = Number.parseInt(process2.env.REDIS_PORT || "6379", 10);
  if (!Number.isInteger(port2) || port2 < 1 || port2 > 65535) {
    throw new Error("REDIS_PORT must be a valid TCP port.");
  }
  return {
    host,
    port: port2,
    password: process2.env.REDIS_PASSWORD || void 0,
    maxRetriesPerRequest: null,
    connectTimeout: 1e4
  };
}
function cronPattern() {
  const configured = process2.env.BULLMQ_CRON?.trim() || DEFAULT_CRON;
  const fields = configured.split(/\s+/);
  return fields.length === 5 ? `0 ${configured}` : configured;
}
async function startBullMq() {
  const connection = redisConnection();
  const queue = new Queue(PROXY_QUEUE_NAME, {
    connection
  });
  const worker = new Worker(
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
        opts: { ...BENCHMARK_JOB_OPTIONS }
      }
    );
    console.log(`[bullmq] connected; scheduler ${SCHEDULER_ID} uses ${pattern} UTC`);
  } catch (error) {
    await worker.close().catch(() => void 0);
    await queue.close().catch(() => void 0);
    throw error;
  }
  return {
    queue,
    worker,
    close: async () => {
      await worker.close();
      await queue.close();
    }
  };
}
async function enqueueManualBenchmark(queue) {
  const job = await queue.add("benchmark-manual", {}, { ...BENCHMARK_JOB_OPTIONS });
  if (!job.id) {
    throw new Error("BullMQ did not return a job ID.");
  }
  return job.id;
}

// src/server.ts
var MANUAL_BENCHMARK_PATH = "/jobs/benchmark";
var queueState = "starting";
var queueRuntime;
var shuttingDown = false;
function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(body));
}
function hasManualTriggerKey(request) {
  const configuredKey = process3.env.MANUAL_TRIGGER_KEY;
  const authorization = request.headers.authorization;
  if (!configuredKey || !authorization?.startsWith("Bearer ")) {
    return false;
  }
  const providedKey = Buffer.from(authorization.slice("Bearer ".length));
  const expectedKey = Buffer.from(configuredKey);
  return providedKey.length === expectedKey.length && timingSafeEqual(providedKey, expectedKey);
}
var server = http.createServer(async (req, res) => {
  if (req.url === "/" || req.url === "/health") {
    sendJson(res, 200, {
      status: "OK",
      service: "proxy-benchmarker-bullmq",
      queue: queueState,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
    return;
  }
  if (req.url === "/ready") {
    const ready = queueState === "ready";
    sendJson(res, ready ? 200 : 503, {
      status: ready ? "OK" : "NOT_READY",
      service: "proxy-benchmarker-bullmq",
      queue: queueState
    });
    return;
  }
  if (req.url === MANUAL_BENCHMARK_PATH) {
    if (req.method !== "POST") {
      sendJson(res, 405, { error: "Use POST for this endpoint." });
      return;
    }
    if (!process3.env.MANUAL_TRIGGER_KEY) {
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
        jobId
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
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[server] received ${signal}; shutting down`);
  if (queueRuntime) {
    await queueRuntime.close().catch((error) => {
      console.error(`[server] queue shutdown error: ${error.message}`);
    });
  }
  server.close(() => process3.exit(0));
}
var port = Number.parseInt(process3.env.PORT || "3000", 10);
server.listen(port, "0.0.0.0", () => {
  console.log(`[server] BullMQ worker listening on http://0.0.0.0:${port}`);
  console.log(`[server] Health check: http://0.0.0.0:${port}/health`);
  console.log(`[server] Readiness check: http://0.0.0.0:${port}/ready`);
  void startBullMq().then((runtime) => {
    queueRuntime = runtime;
    queueState = "ready";
  }).catch((error) => {
    queueState = "error";
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[bullmq] startup failed: ${message}`);
  });
});
process3.once("SIGTERM", () => void shutdown("SIGTERM"));
process3.once("SIGINT", () => void shutdown("SIGINT"));
