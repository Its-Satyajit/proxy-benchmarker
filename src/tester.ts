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
    LatencyTier,
    AnonymityStatus,
    Protocol
} from "./types.js";
import { parseUrl } from "./dns.js";
import { buildCurlProxyArgs } from "./proxy.js";
import { live, ansi, formatPercent, formatRate, formatDuration } from "./terminal.js";

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
    config: AppConfig
): Promise<EndpointProbeResult> {
    const target = parseUrl(endpoint.url);
    const writeOutFormat = "\n__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}";

    const args: string[] = [
        "--ipv4",
        "--insecure",
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

    if (endpoint.resolvedIp) {
        args.push("--resolve", `${target.hostname}:${target.port}:${endpoint.resolvedIp}`);
    }

    args.push(endpoint.url);

    const timeoutMs = ((config.timeoutSeconds || 3.5) * 1000) + 1000;

    let stdout = "";
    let stderr = "";
    let exitCode = 0;

    try {
        const res = await execFileAsync("curl", args, {
            timeout: timeoutMs,
            maxBuffer: 1024 * 1024,
            windowsHide: true,
        });
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
        "--insecure",
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

    if (website.resolvedIp && (proxy.protocol === "http" || proxy.protocol === "https")) {
        args.push("--resolve", `${target.hostname}:${target.port}:${website.resolvedIp}`);
    }

    args.push(website.url);

    const timeoutMs = ((config.websiteTimeoutSeconds || 4.5) * 1000) + 1000;

    let stdout = "";
    let stderr = "";
    let exitCode = 0;

    try {
        const res = await execFileAsync("curl", args, {
            timeout: timeoutMs,
            maxBuffer: 512 * 1024,
            windowsHide: true,
        });
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

export async function benchmarkTopWebsitesForProxy(
    proxy: ProxyItem,
    websites: WebsiteTarget[],
    config: AppConfig
): Promise<WebsiteProbeResult[]> {
    const results: WebsiteProbeResult[] = [];
    const concurrency = Math.max(config.websiteConcurrency || 5, 2);

    let anyPassed = false;
    for (let i = 0; i < websites.length; i += concurrency) {
        const batch = websites.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map((w) => testProxyWebsite(proxy, w, config))
        );
        results.push(...batchResults);

        if (batchResults.some((r) => r.ok)) {
            anyPassed = true;
        }

        // Fast-fail: If the first batch (e.g. Google, Cloudflare, MS, Apple) completely fails/times out,
        // this proxy does not support HTTP CONNECT / SSL web routing. Avoid sending 40+ more useless requests.
        if (results.length >= concurrency && !anyPassed) {
            break;
        }
    }

    return results;
}

function calculateMedian(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const midVal = sorted[mid] ?? 0;
    const prevVal = sorted[mid - 1] ?? 0;
    return sorted.length % 2 !== 0
        ? midVal
        : Math.round((prevVal + midVal) / 2);
}

/* ============================================================
 * Fast Health Verification Check (Phase 2)
 * ============================================================ */

export async function verifyProxyHealth(
    proxy: ProxyItem,
    endpoints: TestEndpoint[],
    config: AppConfig
): Promise<{ isAlive: boolean; exitIp: string | null; endpointResults: EndpointProbeResult[] }> {
    const endpointResults: EndpointProbeResult[] = [];
    let exitIp: string | null = null;

    // Test endpoints until at least one succeeds
    for (const endpoint of endpoints) {
        const epResult = await testProxyEndpoint(proxy, endpoint, config);
        endpointResults.push(epResult);

        if (epResult.ok) {
            exitIp = epResult.returnedIp;
            return {
                isAlive: true,
                exitIp,
                endpointResults,
            };
        }
    }

    return {
        isAlive: false,
        exitIp: null,
        endpointResults,
    };
}

/* ============================================================
 * Turbo Three-Stage Funnel Benchmark Runner
 * ============================================================ */

interface CandidateData {
    proxy: ProxyItem;
    exitIp: string | null;
    endpointResults: EndpointProbeResult[];
}

export async function runProxyTests(
    proxies: ProxyItem[],
    endpoints: TestEndpoint[],
    config: AppConfig,
    localPublicIp: string | null = null
): Promise<BenchmarkRunResult> {
    const results: Record<Protocol, ProxyItem[]> = {
        http: [],
        https: [],
        socks4: [],
        socks5: [],
    };

    /* ----------------------------------------------------------
     * STAGE 1: Ultra-Fast Async TCP Port Pre-Filter (500-800 Sockets)
     * ---------------------------------------------------------- */
    const tcpConcurrency = Math.min(Math.max(config.tcpConcurrency || 600, 50), proxies.length);
    const tcpTimeoutMs = config.tcpTimeoutMs || 1200;

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
     * STAGE 2: Proxy Protocol & Exit IP Verification (150+ Workers)
     * ---------------------------------------------------------- */
    const aliveCandidates: CandidateData[] = [];
    const stage2Concurrency = Math.min(Math.max(config.concurrency || 150, 10), Math.max(tcpResponsiveProxies.length, 1));

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
                            endpointResults: health.endpointResults,
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
     * STAGE 3: Deep Top 50 Websites Benchmark on Alive Proxies
     * ---------------------------------------------------------- */
    const benchmarkReports: BenchmarkItem[] = [];

    if (aliveCandidates.length > 0) {
        process.stdout.write(`${ansi.bold}${ansi.cyan}>> Stage 3: Top 50 Global Websites Benchmark (${aliveCandidates.length} alive proxies)${ansi.reset}\n`);

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

        const stage3Concurrency = Math.min(Math.max(Math.floor(stage2Concurrency / 10), 5), 15, aliveCandidates.length);

        async function workerStage3() {
            while (true) {
                const index = nextIndex3;
                if (index >= aliveCandidates.length) return;
                nextIndex3++;

                const candidate = aliveCandidates[index];
                if (!candidate) continue;

                const { proxy, exitIp, endpointResults } = candidate;

                let websiteResults: WebsiteProbeResult[] = [];
                if (config.benchmarkTopWebsites && config.topWebsites.length > 0) {
                    try {
                        websiteResults = await benchmarkTopWebsitesForProxy(proxy, config.topWebsites, config);
                    } catch {
                        websiteResults = [];
                    }
                }

                const successfulEp = endpointResults.filter((e) => e.ok);
                const successfulWebsites = websiteResults.filter((w) => w.ok);
                const allSuccessful = [...successfulEp, ...successfulWebsites];

                const latencies = allSuccessful.map((e) => e.totalLatencyMs);
                const connectTimes = allSuccessful.map((e) => e.connectTimeMs);
                const ttfbTimes = allSuccessful.map((e) => e.ttfbMs);
                const speeds = allSuccessful.map((e) => e.downloadSpeedBps);

                const avgLatencyMs = latencies.length > 0
                    ? Math.round(latencies.reduce((sum, val) => sum + val, 0) / latencies.length)
                    : 0;

                const minLatencyMs = latencies.length > 0 ? Math.min(...latencies) : 0;
                const maxLatencyMs = latencies.length > 0 ? Math.max(...latencies) : 0;
                const medianLatencyMs = calculateMedian(latencies);

                const avgConnectTimeMs = connectTimes.length > 0
                    ? Math.round(connectTimes.reduce((sum, val) => sum + val, 0) / connectTimes.length)
                    : 0;

                const avgTtfbMs = ttfbTimes.length > 0
                    ? Math.round(ttfbTimes.reduce((sum, val) => sum + val, 0) / ttfbTimes.length)
                    : 0;

                const avgSpeedBps = speeds.length > 0
                    ? Math.round(speeds.reduce((sum, val) => sum + val, 0) / speeds.length)
                    : 0;

                let anonymity: AnonymityStatus = "UNKNOWN";
                if (exitIp) {
                    if (localPublicIp && exitIp === localPublicIp) {
                        anonymity = "TRANSPARENT (LEAKING)";
                    } else {
                        anonymity = "ELITE / ANONYMOUS";
                    }
                }

                let tier: LatencyTier = "SLOW";
                if (avgLatencyMs < 400) tier = "EXCELLENT";
                else if (avgLatencyMs < 800) tier = "GOOD";
                else if (avgLatencyMs < 1500) tier = "MODERATE";

                const totalWebsites = config.topWebsites.length;
                const websitePassRatePercent = totalWebsites > 0
                    ? Number.parseFloat(((successfulWebsites.length / totalWebsites) * 100).toFixed(1))
                    : 0;

                // Usability-Gated Multi-Factor Scoring (0 - 100 pts)
                const usabilityRatio = totalWebsites > 0 ? (successfulWebsites.length / totalWebsites) : 1;

                // 1. Direct Web Compatibility (50 pts max)
                const webScore = usabilityRatio * 50;

                // 2. Performance Metrics (50 pts max, gated by Usability Ratio)
                const avgLatencyScore = Math.max(0, Math.min(20, 20 * (1 - (avgLatencyMs / 2500))));
                const minLatencyScore = Math.max(0, Math.min(8, 8 * (1 - (minLatencyMs / 1500))));
                const connectScore = Math.max(0, Math.min(8, 8 * (1 - (avgConnectTimeMs / 800))));
                const ttfbScore = Math.max(0, Math.min(7, 7 * (1 - (avgTtfbMs / 1500))));
                const speedScore = Math.max(0, Math.min(7, (avgSpeedBps / (500 * 1024)) * 7));

                const rawPerformanceScore = avgLatencyScore + minLatencyScore + connectScore + ttfbScore + speedScore;
                const gatedPerformanceScore = rawPerformanceScore * usabilityRatio;

                const compositeScore = Math.round(webScore + gatedPerformanceScore);

                const scoreBreakdown = {
                    websites: Math.round(webScore),
                    avgLatency: Math.round(avgLatencyScore * usabilityRatio),
                    minLatency: Math.round(minLatencyScore * usabilityRatio),
                    connectTime: Math.round(connectScore * usabilityRatio),
                    ttfb: Math.round(ttfbScore * usabilityRatio),
                    speed: Math.round(speedScore * usabilityRatio),
                    anonymity: anonymity === "ELITE / ANONYMOUS" ? 10 : 0,
                };

                const benchmarkData: BenchmarkItem = {
                    proxy,
                    status: "PASS",
                    tier,
                    compositeScore,
                    scoreBreakdown,
                    exitIp,
                    anonymity,
                    endpointsTested: endpointResults.length,
                    endpointsPassed: successfulEp.length,
                    endpointsTotal: endpoints.length,
                    passRatePercent: Number.parseFloat(((successfulEp.length / endpoints.length) * 100).toFixed(1)),
                    websitesTested: websiteResults.length,
                    websitesPassed: successfulWebsites.length,
                    websitesTotal: totalWebsites,
                    websitePassRatePercent,
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
