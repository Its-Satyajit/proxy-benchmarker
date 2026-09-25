import { execFile } from "node:child_process";
import { promisify } from "node:util";
import net from "node:net";
import { isIP } from "node:net";
import process from "node:process";
import type {
    AppConfig,
    ProxyItem,
    TestEndpoint,
    WebsiteTarget,
    EndpointProbeResult,
    WebsiteProbeResult,
    BenchmarkItem,
    BenchmarkRunResult,
    EgressStatus,
    PerformanceSource,
    Protocol
} from "./types.js";
import { parseUrl } from "./dns.js";
import { buildCurlProxyArgs } from "./proxy.js";
import { live, ansi, formatPercent, formatRate, formatDuration } from "./terminal.js";
import { configureCurlGate, withCurlSlot } from "./curl-gate.js";
import { resolveWorkerCount } from "./limits.js";
import {
    averageLatency,
    classifyEgress,
    latencyTier,
    ratioPercent,
    scoreCandidate,
    summarizeSamples
} from "./metrics.js";

const execFileAsync = promisify(execFile);

/* ============================================================
 * Ultra-Fast Non-Blocking TCP Socket Port Probe
 * ============================================================ */

export function checkTcpPort(ip: string, port: number, timeoutMs: number = 1200): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let isDone = false;

        const cleanup = () => {
            if (!isDone) {
                isDone = true;
                socket.removeAllListeners();
                socket.destroy();
            }
        };

        socket.setTimeout(timeoutMs);

        socket.once("connect", () => {
            cleanup();
            resolve(true);
        });

        socket.once("timeout", () => {
            cleanup();
            resolve(false);
        });

        socket.once("error", () => {
            cleanup();
            resolve(false);
        });

        socket.once("close", () => {
            if (!isDone) {
                cleanup();
                resolve(false);
            }
        });

        try {
            socket.connect(port, ip);
        } catch {
            cleanup();
            resolve(false);
        }
    });
}

/* ============================================================
 * Response Parsing
 * ============================================================ */

export function extractPlainIp(body: string): string | null {
    const lines = body
        .trim()
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    for (const line of lines) {
        if (isIP(line) === 4) {
            return line;
        }
    }
    return null;
}

export function extractIpFromIpMe(body: string): string | null {
    const normal = body.match(
        /<input\b[^>]*\bname=["']ip["'][^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["']/i
    );

    if (normal && normal[1] && isIP(normal[1]) === 4) {
        return normal[1];
    }

    const reverse = body.match(
        /<input\b[^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["'][^>]*\bname=["']ip["']/i
    );

    if (reverse && reverse[1] && isIP(reverse[1]) === 4) {
        return reverse[1];
    }

    return null;
}

export function extractIp(body: string, parser: "plain" | "ipme"): string | null {
    if (parser === "ipme") {
        return extractIpFromIpMe(body);
    }
    return extractPlainIp(body);
}

/* ============================================================
 * Fast Verification Endpoint Probe
 * ============================================================ */

export async function testProxyEndpoint(
    proxy: ProxyItem,
    endpoint: TestEndpoint,
    config: AppConfig,
    signal?: AbortSignal
): Promise<EndpointProbeResult> {
    const target = parseUrl(endpoint.url);
    const writeOutFormat = "\n__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}";

    const args: string[] = [
        "--ipv4",
        "--silent",
        "--show-error",
        "--fail-with-body",
        "--noproxy", "",
        "--connect-timeout", String(config.connectTimeoutSeconds || 2.5),
        "--max-time", String(config.timeoutSeconds || 3.5),
        "-A", "Mozilla/5.0 ProxyBenchmarker",
        "-w", writeOutFormat,
        ...buildCurlProxyArgs(proxy),
    ];

    // Transport reachability probe by default; strict TLS only when asked.
    if (!config.tlsVerify) {
        args.splice(1, 0, "--insecure");
    }

    if (endpoint.resolvedIp) {
        args.push("--resolve", `${target.hostname}:${target.port}:${endpoint.resolvedIp}`);
    }

    args.push(endpoint.url);

    const timeoutMs = ((config.timeoutSeconds || 3.5) * 1000) + 1000;

    let stdout = "";
    let stderr = "";
    let exitCode = 0;

    try {
        const res = await withCurlSlot(() => execFileAsync("curl", args, {
            timeout: timeoutMs,
            maxBuffer: 1024 * 1024,
            windowsHide: true,
            signal,
        }));
        stdout = res.stdout || "";
        stderr = res.stderr || "";
    } catch (error: any) {
        stdout = error.stdout || "";
        stderr = error.stderr || "";
        exitCode = error.code ?? 1;
    }

    let httpCode = 0;
    let connectTimeMs = 0;
    let sslHandshakeMs = 0;
    let ttfbMs = 0;
    let totalLatencyMs = 0;
    let downloadSpeedBps = 0;
    let downloadSizeBytes = 0;
    let responseBody = stdout;

    const benchmarkMarker = "\n__BENCHMARK__:";
    const markerIndex = stdout.lastIndexOf(benchmarkMarker);

    if (markerIndex !== -1) {
        responseBody = stdout.slice(0, markerIndex);
        const benchmarkPart = stdout.slice(markerIndex + benchmarkMarker.length).trim();
        const parts = benchmarkPart.split(":");

        if (parts.length >= 7) {
            httpCode = Number.parseInt(parts[0] || "0", 10) || 0;
            connectTimeMs = Math.round(Number.parseFloat(parts[1] || "0") * 1000);
            sslHandshakeMs = Math.round(Number.parseFloat(parts[2] || "0") * 1000);
            ttfbMs = Math.round(Number.parseFloat(parts[3] || "0") * 1000);
            totalLatencyMs = Math.round(Number.parseFloat(parts[4] || "0") * 1000);
            downloadSpeedBps = Number.parseFloat(parts[5] || "0") || 0;
            downloadSizeBytes = Number.parseInt(parts[6] || "0", 10) || 0;
        }
    }

    if (exitCode !== 0 && httpCode === 0) {
        return {
            name: endpoint.name,
            url: endpoint.url,
            resolvedIp: endpoint.resolvedIp,
            ok: false,
            httpCode,
            totalLatencyMs,
            connectTimeMs,
            sslHandshakeMs,
            ttfbMs,
            downloadSpeedBps,
            downloadSizeBytes,
            returnedIp: null,
            reason: stderr.trim() || `curl exit code ${exitCode}`,
        };
    }

    const returnedIp = extractIp(responseBody, endpoint.parser);

    if (!returnedIp) {
        return {
            name: endpoint.name,
            url: endpoint.url,
            resolvedIp: endpoint.resolvedIp,
            ok: false,
            httpCode,
            totalLatencyMs,
            connectTimeMs,
            sslHandshakeMs,
            ttfbMs,
            downloadSpeedBps,
            downloadSizeBytes,
            returnedIp: null,
            reason: httpCode >= 400 ? `HTTP ${httpCode}` : "No valid IPv4 returned from endpoint",
        };
    }

    return {
        name: endpoint.name,
        url: endpoint.url,
        resolvedIp: endpoint.resolvedIp,
        ok: true,
        httpCode,
        totalLatencyMs,
        connectTimeMs,
        sslHandshakeMs,
        ttfbMs,
        downloadSpeedBps,
        downloadSizeBytes,
        returnedIp,
        reason: null,
    };
}

/* ============================================================
 * Fast Website Connectivity & Benchmark Probe
 * ============================================================ */

export async function testProxyWebsite(
    proxy: ProxyItem,
    website: WebsiteTarget,
    config: AppConfig
): Promise<WebsiteProbeResult> {
    const target = parseUrl(website.url);
    const writeOutFormat = "\n__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}";

    const args: string[] = [
        "--ipv4",
        "--silent",
        "--show-error",
        "-o", "/dev/null",
        "--noproxy", "",
        "--connect-timeout", String(config.websiteConnectTimeoutSeconds || 3.0),
        "--max-time", String(config.websiteTimeoutSeconds || 4.5),
        "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "-w", writeOutFormat,
        ...buildCurlProxyArgs(proxy),
    ];

    if (!config.tlsVerify) {
        args.splice(1, 0, "--insecure");
    }

    if (website.resolvedIp && (proxy.protocol === "http" || proxy.protocol === "https")) {
        args.push("--resolve", `${target.hostname}:${target.port}:${website.resolvedIp}`);
    }

    args.push(website.url);

    const timeoutMs = ((config.websiteTimeoutSeconds || 4.5) * 1000) + 1000;

    let stdout = "";
    let stderr = "";
    let exitCode = 0;

    try {
        const res = await withCurlSlot(() => execFileAsync("curl", args, {
            timeout: timeoutMs,
            maxBuffer: 512 * 1024,
            windowsHide: true,
        }));
        stdout = res.stdout || "";
        stderr = res.stderr || "";
    } catch (error: any) {
        stdout = error.stdout || "";
        stderr = error.stderr || "";
        exitCode = error.code ?? 1;
    }

    let httpCode = 0;
    let connectTimeMs = 0;
    let sslHandshakeMs = 0;
    let ttfbMs = 0;
    let totalLatencyMs = 0;
    let downloadSpeedBps = 0;
    let downloadSizeBytes = 0;

    const benchmarkMarker = "\n__BENCHMARK__:";
    const markerIndex = stdout.lastIndexOf(benchmarkMarker);

    if (markerIndex !== -1) {
        const benchmarkPart = stdout.slice(markerIndex + benchmarkMarker.length).trim();
        const parts = benchmarkPart.split(":");

        if (parts.length >= 7) {
            httpCode = Number.parseInt(parts[0] || "0", 10) || 0;
            connectTimeMs = Math.round(Number.parseFloat(parts[1] || "0") * 1000);
            sslHandshakeMs = Math.round(Number.parseFloat(parts[2] || "0") * 1000);
            ttfbMs = Math.round(Number.parseFloat(parts[3] || "0") * 1000);
            totalLatencyMs = Math.round(Number.parseFloat(parts[4] || "0") * 1000);
            downloadSpeedBps = Number.parseFloat(parts[5] || "0") || 0;
            downloadSizeBytes = Number.parseInt(parts[6] || "0", 10) || 0;
        }
    }

    const ok = (httpCode >= 200 && httpCode < 400);

    return {
        name: website.name,
        domain: website.domain,
        category: website.category,
        url: website.url,
        ok,
        httpCode,
        totalLatencyMs,
        connectTimeMs,
        sslHandshakeMs,
        ttfbMs,
        downloadSpeedBps,
        downloadSizeBytes,
        reason: ok ? null : (httpCode > 0 ? `HTTP ${httpCode}` : stderr.trim() || `Exit code ${exitCode}`),
    };
}

export interface WebsiteSweepResult {
    results: WebsiteProbeResult[];
    /** Probes actually launched. */
    attempted: number;
    /** True when the sweep stopped after the first batch failed. */
    earlyExit: boolean;
}

export async function benchmarkTopWebsitesForProxy(
    proxy: ProxyItem,
    websites: WebsiteTarget[],
    config: AppConfig
): Promise<WebsiteSweepResult> {
    const results: WebsiteProbeResult[] = [];
    const concurrency = Math.max(config.websiteConcurrency, 1);

    let anyPassed = false;
    let earlyExit = false;
    for (let i = 0; i < websites.length; i += concurrency) {
        const batch = websites.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map((w) => testProxyWebsite(proxy, w, config))
        );
        results.push(...batchResults);

        if (batchResults.some((r) => r.ok)) {
            anyPassed = true;
        }

        // Fast-fail: if the first batch completely fails/times out, this proxy
        // cannot route HTTP CONNECT/SSL. Record what was attempted instead of
        // padding the report with un-attempted targets.
        if (results.length >= concurrency && !anyPassed) {
            earlyExit = true;
            break;
        }
    }

    return { results, attempted: results.length, earlyExit };
}

/* ============================================================
 * Fast Health Verification Check (Phase 2)
 * ============================================================ */

export interface HealthVerification {
    isAlive: boolean;
    exitIp: string | null;
    strategy: "fast" | "full";
    /** Probe requests launched, including ones cancelled after a winner appeared. */
    requestsStarted: number;
    /** Results actually collected; cancelled losers are not counted. */
    resultsCompleted: number;
    endpointResults: EndpointProbeResult[];
}

export async function verifyProxyHealth(
    proxy: ProxyItem,
    endpoints: TestEndpoint[],
    config: AppConfig
): Promise<HealthVerification> {
    if (config.fullBenchmark) {
        const endpointResults: EndpointProbeResult[] = [];
        let exitIp: string | null = null;
        for (const endpoint of endpoints) {
            const epResult = await testProxyEndpoint(proxy, endpoint, config);
            endpointResults.push(epResult);
            if (epResult.ok && !exitIp) {
                exitIp = epResult.returnedIp;
            }
        }
        return {
            isAlive: Boolean(exitIp),
            exitIp,
            strategy: "full",
            requestsStarted: endpoints.length,
            resultsCompleted: endpointResults.length,
            endpointResults,
        };
    }

    // Fast path: race the top 2 endpoints, then cancel the loser so its curl
    // process does not outlive the worker that started it.
    const candidateEndpoints = endpoints.slice(0, 2);
    const requestsStarted = candidateEndpoints.length;
    const abort = new AbortController();
    const probePromises = candidateEndpoints.map(async (ep) => {
        const res = await testProxyEndpoint(proxy, ep, config, abort.signal);
        if (res.ok) {
            return res;
        }
        throw res;
    });

    try {
        const fastestSuccess = await Promise.any(probePromises);
        abort.abort();
        // Wait for the cancelled child to actually exit before the worker moves on.
        await Promise.allSettled(probePromises);
        return {
            isAlive: true,
            exitIp: fastestSuccess.returnedIp,
            strategy: "fast",
            requestsStarted,
            resultsCompleted: 1,
            endpointResults: [fastestSuccess],
        };
    } catch (aggregateErr: any) {
        await Promise.allSettled(probePromises);
        const failedResults: EndpointProbeResult[] = Array.isArray(aggregateErr?.errors)
            ? aggregateErr.errors
            : [];
        return {
            isAlive: false,
            exitIp: null,
            strategy: "fast",
            requestsStarted,
            resultsCompleted: failedResults.length,
            endpointResults: failedResults,
        };
    }
}

/* ============================================================
 * Turbo Three-Stage Funnel Benchmark Runner
 * ============================================================ */

interface CandidateData {
    proxy: ProxyItem;
    exitIp: string | null;
    verification: HealthVerification;
}

export async function runProxyTests(
    proxies: ProxyItem[],
    endpoints: TestEndpoint[],
    config: AppConfig,
    localPublicIp: string | null = null
): Promise<BenchmarkRunResult> {
    // One explicit ceiling for every curl child process in the run.
    configureCurlGate(config.maxCurlProcesses);

    const results: Record<Protocol, ProxyItem[]> = {
        http: [],
        https: [],
        socks4: [],
        socks5: [],
    };

    /* ----------------------------------------------------------
     * STAGE 1: Async TCP Port Pre-Filter
     * ---------------------------------------------------------- */
    const tcpConcurrency = resolveWorkerCount(config.tcpConcurrency, proxies.length);
    const tcpTimeoutMs = config.tcpTimeoutMs;

    process.stdout.write(`\n${ansi.bold}${ansi.cyan}>> Stage 1: Async TCP Socket Pre-Filter (${tcpConcurrency} parallel sockets)${ansi.reset}\n`);

    const stage1StartedAt = Date.now();
    let completedStage1 = 0;
    let openPortsCount = 0;
    let closedPortsCount = 0;
    let nextIndex1 = 0;
    const tcpResponsiveProxies: ProxyItem[] = [];

    function renderProgressStage1() {
        const elapsed = (Date.now() - stage1StartedAt) / 1000;
        const rate = completedStage1 > 0 ? completedStage1 / Math.max(elapsed, 0.001) : 0;
        const remaining = proxies.length - completedStage1;
        const eta = rate > 0 ? remaining / rate : Number.NaN;

        live(
            `${ansi.cyan}Stage 1 (TCP)${ansi.reset} ` +
            `${formatPercent(completedStage1, proxies.length)}% | ` +
            `${completedStage1.toLocaleString()}/${proxies.length.toLocaleString()} | ` +
            `${ansi.green}[OK] ${openPortsCount} Open${ansi.reset} | ` +
            `${ansi.red}[FAIL] ${closedPortsCount} Closed${ansi.reset} | ` +
            `${formatRate(rate)} | ` +
            `ETA ${formatDuration(eta)}`
        );
    }

    async function workerStage1() {
        while (true) {
            const index = nextIndex1;
            if (index >= proxies.length) return;
            nextIndex1++;

            const proxy = proxies[index];
            if (!proxy) continue;

            const isOpen = await checkTcpPort(proxy.ip, proxy.port, tcpTimeoutMs);
            completedStage1++;

            if (isOpen) {
                openPortsCount++;
                tcpResponsiveProxies.push(proxy);
            } else {
                closedPortsCount++;
            }

            renderProgressStage1();
        }
    }

    const workersStage1 = Array.from({ length: tcpConcurrency }, () => workerStage1());
    await Promise.all(workersStage1);
    process.stdout.write("\n");

    const stage1Duration = ((Date.now() - stage1StartedAt) / 1000).toFixed(1);
    process.stdout.write(
        `  ${ansi.green}[OK] Stage 1 Finished in ${stage1Duration}s${ansi.reset} - ` +
        `Found ${ansi.bold}${openPortsCount.toLocaleString()}${ansi.reset} open TCP ports (${closedPortsCount.toLocaleString()} dropped)\n\n`
    );

    /* ----------------------------------------------------------
     * STAGE 2: Proxy Protocol & Exit IP Verification
     * ---------------------------------------------------------- */
    const aliveCandidates: CandidateData[] = [];
    const stage2Concurrency = resolveWorkerCount(config.concurrency, tcpResponsiveProxies.length);

    if (tcpResponsiveProxies.length > 0) {
        process.stdout.write(`${ansi.bold}${ansi.cyan}>> Stage 2: Health & Exit IP Verification (${stage2Concurrency} parallel workers)${ansi.reset}\n`);

        const stage2StartedAt = Date.now();
        let completedStage2 = 0;
        let passedStage2 = 0;
        let failedStage2 = 0;
        let nextIndex2 = 0;

        function renderProgressStage2() {
            const elapsed = (Date.now() - stage2StartedAt) / 1000;
            const rate = completedStage2 > 0 ? completedStage2 / Math.max(elapsed, 0.001) : 0;
            const remaining = tcpResponsiveProxies.length - completedStage2;
            const eta = rate > 0 ? remaining / rate : Number.NaN;

            live(
                `${ansi.cyan}Stage 2 (Verify)${ansi.reset} ` +
                `${formatPercent(completedStage2, tcpResponsiveProxies.length)}% | ` +
                `${completedStage2.toLocaleString()}/${tcpResponsiveProxies.length.toLocaleString()} | ` +
                `${ansi.green}[OK] ${passedStage2} Alive${ansi.reset} | ` +
                `${ansi.red}[FAIL] ${failedStage2} Dropped${ansi.reset} | ` +
                `${formatRate(rate)} | ` +
                `ETA ${formatDuration(eta)}`
            );
        }

        async function workerStage2() {
            while (true) {
                const index = nextIndex2;
                if (index >= tcpResponsiveProxies.length) return;
                nextIndex2++;

                const proxy = tcpResponsiveProxies[index];
                if (!proxy) continue;

                try {
                    const health = await verifyProxyHealth(proxy, endpoints, config);
                    completedStage2++;

                    if (health.isAlive) {
                        passedStage2++;
                        aliveCandidates.push({
                            proxy,
                            exitIp: health.exitIp,
                            verification: health,
                        });
                    } else {
                        failedStage2++;
                    }
                } catch {
                    completedStage2++;
                    failedStage2++;
                }

                renderProgressStage2();
            }
        }

        const workersStage2 = Array.from({ length: stage2Concurrency }, () => workerStage2());
        await Promise.all(workersStage2);
        process.stdout.write("\n");

        const stage2Duration = ((Date.now() - stage2StartedAt) / 1000).toFixed(1);
        process.stdout.write(
            `  ${ansi.green}[OK] Stage 2 Finished in ${stage2Duration}s${ansi.reset} - ` +
            `Verified ${ansi.bold}${passedStage2.toLocaleString()}${ansi.reset} alive proxies (${failedStage2.toLocaleString()} dropped)\n\n`
        );
    }

    /* ----------------------------------------------------------
     * STAGE 3: Website Reachability Benchmark on Alive Proxies
     * ---------------------------------------------------------- */
    const benchmarkReports: BenchmarkItem[] = [];

    if (aliveCandidates.length > 0) {
        const websitesAvailable = config.benchmarkTopWebsites ? config.topWebsites.length : 0;
        process.stdout.write(`${ansi.bold}${ansi.cyan}>> Stage 3: Website Reachability (${aliveCandidates.length} alive proxies, ${websitesAvailable} targets, global curl cap ${config.maxCurlProcesses})${ansi.reset}\n`);

        const stage3StartedAt = Date.now();
        let completedStage3 = 0;
        let nextIndex3 = 0;

        function renderProgressStage3() {
            const elapsed = (Date.now() - stage3StartedAt) / 1000;
            const rate = completedStage3 > 0 ? completedStage3 / Math.max(elapsed, 0.001) : 0;
            const remaining = aliveCandidates.length - completedStage3;
            const eta = rate > 0 ? remaining / rate : Number.NaN;

            live(
                `${ansi.cyan}Stage 3 (Sites)${ansi.reset} ` +
                `${formatPercent(completedStage3, aliveCandidates.length)}% | ` +
                `${completedStage3.toLocaleString()}/${aliveCandidates.length.toLocaleString()} | ` +
                `${formatRate(rate)} | ` +
                `ETA ${formatDuration(eta)}`
            );
        }

        const stage3Concurrency = resolveWorkerCount(config.websiteWorkers, aliveCandidates.length);

        async function workerStage3() {
            while (true) {
                const index = nextIndex3;
                if (index >= aliveCandidates.length) return;
                nextIndex3++;

                const candidate = aliveCandidates[index];
                if (!candidate) continue;

                const { proxy, exitIp, verification } = candidate;

                let websiteResults: WebsiteProbeResult[] = [];
                let websitesAttempted = 0;
                let websitesEarlyExit = false;
                if (config.benchmarkTopWebsites && config.topWebsites.length > 0) {
                    try {
                        const sweep = await benchmarkTopWebsitesForProxy(proxy, config.topWebsites, config);
                        websiteResults = sweep.results;
                        websitesAttempted = sweep.attempted;
                        websitesEarlyExit = sweep.earlyExit;
                    } catch {
                        websiteResults = [];
                    }
                }

                const endpointResults = verification.endpointResults;
                const successfulEp = endpointResults.filter((e) => e.ok);
                const successfulWebsites = websiteResults.filter((w) => w.ok);

                // Health (egress verification) and website performance are
                // different measurements: keep separate aggregates and only mix
                // when there is no website data at all.
                const egressLatencyMs = averageLatency(successfulEp);
                const websiteMetrics = summarizeSamples(successfulWebsites);
                const hasWebsiteSamples = successfulWebsites.length > 0;
                const performanceSource: PerformanceSource = hasWebsiteSamples ? "websites" : "egress-endpoints";
                const performance = hasWebsiteSamples ? websiteMetrics : summarizeSamples(successfulEp);

                const {
                    avgLatencyMs,
                    minLatencyMs,
                    maxLatencyMs,
                    medianLatencyMs,
                    avgConnectTimeMs,
                    avgTtfbMs,
                    avgSpeedBps
                } = performance;

                const egressStatus: EgressStatus = classifyEgress(exitIp, localPublicIp);
                const tier = latencyTier(avgLatencyMs);

                // Scoring keeps the full target list as the usability denominator;
                // reported pass rates use the probes that actually ran.
                const usabilityRatio = websitesAvailable > 0
                    ? Math.min(1, successfulWebsites.length / websitesAvailable)
                    : 1;
                const { compositeScore, breakdown } = scoreCandidate(performance, usabilityRatio);

                const benchmarkData: BenchmarkItem = {
                    proxy,
                    status: "PASS",
                    tier,
                    compositeScore,
                    scoreBreakdown: breakdown,
                    exitIp,
                    egressStatus,
                    verificationStrategy: verification.strategy,
                    endpointsStarted: verification.requestsStarted,
                    endpointsCompleted: verification.resultsCompleted,
                    endpointsPassed: successfulEp.length,
                    endpointsTotal: endpoints.length,
                    endpointCoveragePercent: ratioPercent(verification.requestsStarted, endpoints.length),
                    endpointPassRatePercent: ratioPercent(successfulEp.length, verification.requestsStarted),
                    websitesAvailable,
                    websitesAttempted,
                    websitesPassed: successfulWebsites.length,
                    websitePassRatePercent: ratioPercent(successfulWebsites.length, websitesAttempted),
                    websitesEarlyExit,
                    performanceSource,
                    egressVerificationLatencyMs: egressLatencyMs,
                    avgLatencyMs,
                    minLatencyMs,
                    maxLatencyMs,
                    medianLatencyMs,
                    avgConnectTimeMs,
                    avgTtfbMs,
                    avgSpeedBps,
                    firstFailedEndpoint: null,
                    failureReason: null,
                    endpointDetails: endpointResults,
                    websiteDetails: websiteResults,
                };

                results[proxy.protocol].push(proxy);
                benchmarkReports.push(benchmarkData);

                completedStage3++;
                renderProgressStage3();
            }
        }

        const workersStage3 = Array.from({ length: stage3Concurrency }, () => workerStage3());
        await Promise.all(workersStage3);
        process.stdout.write("\n\n");
    }

    // Rank proxies based on compositeScore descending and latency ascending
    benchmarkReports.sort((a, b) => {
        if (b.compositeScore !== a.compositeScore) {
            return b.compositeScore - a.compositeScore;
        }
        return a.avgLatencyMs - b.avgLatencyMs;
    });

    benchmarkReports.forEach((item, idx) => {
        item.rank = idx + 1;
    });

    return {
        results,
        benchmarks: benchmarkReports,
        stats: {
            total: proxies.length,
            completed: proxies.length,
            passed: benchmarkReports.length,
            failed: proxies.length - benchmarkReports.length,
            localPublicIp,
            durationSeconds: (Date.now() - stage1StartedAt) / 1000,
            startedAt: new Date(stage1StartedAt).toISOString(),
            completedAt: new Date().toISOString(),
        },
    };
}
