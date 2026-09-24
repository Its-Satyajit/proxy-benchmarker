import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isIP } from "node:net";
import { parseUrl } from "./dns.mjs";
import { buildCurlProxyArgs } from "./proxy.mjs";
import { live, ansi, formatPercent, formatRate, formatDuration } from "./terminal.mjs";

const execFileAsync = promisify(execFile);

/* ============================================================
 * Response Parsing
 * ============================================================ */

export function extractPlainIp(body) {
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

export function extractIpFromIpMe(body) {
    const normal = body.match(
        /<input\b[^>]*\bname=["']ip["'][^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["']/i
    );

    if (normal && isIP(normal[1]) === 4) {
        return normal[1];
    }

    const reverse = body.match(
        /<input\b[^>]*\bvalue=["']((?:\d{1,3}\.){3}\d{1,3})["'][^>]*\bname=["']ip["']/i
    );

    if (reverse && isIP(reverse[1]) === 4) {
        return reverse[1];
    }

    return null;
}

export function extractIp(body, parser) {
    if (parser === "ipme") {
        return extractIpFromIpMe(body);
    }
    return extractPlainIp(body);
}

/* ============================================================
 * Fast Verification Endpoint Probe
 * ============================================================ */

export async function testProxyEndpoint(proxy, endpoint, config) {
    const target = parseUrl(endpoint.url);
    const writeOutFormat = "\n__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}";

    const args = [
        "--ipv4",
        "--insecure",
        "--silent",
        "--show-error",
        "--fail-with-body",
        "--noproxy", "",
        "--connect-timeout", String(config.connectTimeoutSeconds || 3),
        "--max-time", String(config.timeoutSeconds || 4),
        "--resolve", `${target.hostname}:${target.port}:${endpoint.resolvedIp}`,
        "-A", "Mozilla/5.0 ProxyScrapeTester",
        "-w", writeOutFormat,
        ...buildCurlProxyArgs(proxy),
        endpoint.url,
    ];

    const timeoutMs = ((config.timeoutSeconds || 4) * 1000) + 1500;

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
    } catch (error) {
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
            httpCode = parseInt(parts[0], 10) || 0;
            connectTimeMs = Math.round(parseFloat(parts[1]) * 1000);
            sslHandshakeMs = Math.round(parseFloat(parts[2]) * 1000);
            ttfbMs = Math.round(parseFloat(parts[3]) * 1000);
            totalLatencyMs = Math.round(parseFloat(parts[4]) * 1000);
            downloadSpeedBps = parseFloat(parts[5]) || 0;
            downloadSizeBytes = parseInt(parts[6], 10) || 0;
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

export async function testProxyWebsite(proxy, website, config) {
    const writeOutFormat = "\n__BENCHMARK__:%{http_code}:%{time_connect}:%{time_appconnect}:%{time_starttransfer}:%{time_total}:%{speed_download}:%{size_download}";

    const args = [
        "--ipv4",
        "--insecure",
        "--silent",
        "--show-error",
        "-o", "/dev/null",
        "--noproxy", "",
        "--connect-timeout", String(config.websiteConnectTimeoutSeconds || 2.5),
        "--max-time", String(config.websiteTimeoutSeconds || 3.5),
        "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "-w", writeOutFormat,
        ...buildCurlProxyArgs(proxy),
        website.url,
    ];

    const timeoutMs = ((config.websiteTimeoutSeconds || 3.5) * 1000) + 1500;

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
    } catch (error) {
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
            httpCode = parseInt(parts[0], 10) || 0;
            connectTimeMs = Math.round(parseFloat(parts[1]) * 1000);
            sslHandshakeMs = Math.round(parseFloat(parts[2]) * 1000);
            ttfbMs = Math.round(parseFloat(parts[3]) * 1000);
            totalLatencyMs = Math.round(parseFloat(parts[4]) * 1000);
            downloadSpeedBps = parseFloat(parts[5]) || 0;
            downloadSizeBytes = parseInt(parts[6], 10) || 0;
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

export async function benchmarkTopWebsitesForProxy(proxy, websites, config) {
    const results = [];
    const concurrency = config.websiteConcurrency || 25;

    for (let i = 0; i < websites.length; i += concurrency) {
        const batch = websites.slice(i, i + concurrency);
        const batchResults = await Promise.all(
            batch.map((w) => testProxyWebsite(proxy, w, config))
        );
        results.push(...batchResults);
    }

    return results;
}

function calculateMedian(numbers) {
    if (numbers.length === 0) return 0;
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0
        ? sorted[mid]
        : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/* ============================================================
 * Fast Health Verification Check (Phase 1)
 * ============================================================ */

export async function verifyProxyHealth(proxy, endpoints, config) {
    const endpointResults = [];
    let exitIp = null;

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
 * Full High-Speed Two-Phase Funnel Benchmark Runner
 * ============================================================ */

export async function runProxyTests(proxies, endpoints, config, localPublicIp = null) {
    const results = {
        http: [],
        https: [],
        socks4: [],
        socks5: [],
    };

    const aliveCandidates = [];
    let completedPhase1 = 0;
    let passedPhase1 = 0;
    let failedPhase1 = 0;
    let nextIndex1 = 0;

    const startedAt = Date.now();
    const concurrency = Math.min(Math.max(config.concurrency || 100, 10), proxies.length);

    /* ----------------------------------------------------------
     * PHASE 1: High-Speed Parallel Health Filter (100+ Workers)
     * ---------------------------------------------------------- */
    process.stdout.write(`\n${ansi.bold}${ansi.cyan}▶ Phase 1: High-Speed Verification & Pruning (${concurrency} parallel workers)${ansi.reset}\n`);

    function renderProgressPhase1() {
        const elapsed = (Date.now() - startedAt) / 1000;
        const rate = completedPhase1 > 0 ? completedPhase1 / Math.max(elapsed, 0.001) : 0;
        const remaining = proxies.length - completedPhase1;
        const eta = rate > 0 ? remaining / rate : Number.NaN;

        live(
            `${ansi.cyan}Phase 1${ansi.reset} ` +
            `${formatPercent(completedPhase1, proxies.length)}% | ` +
            `${completedPhase1.toLocaleString()}/${proxies.length.toLocaleString()} | ` +
            `${ansi.green}✓ ${passedPhase1} Alive${ansi.reset} | ` +
            `${ansi.red}✗ ${failedPhase1} Dropped${ansi.reset} | ` +
            `${formatRate(rate)} | ` +
            `ETA ${formatDuration(eta)}`
        );
    }

    async function workerPhase1() {
        while (true) {
            const index = nextIndex1;
            if (index >= proxies.length) return;
            nextIndex1++;

            const proxy = proxies[index];
            try {
                const health = await verifyProxyHealth(proxy, endpoints, config);
                completedPhase1++;

                if (health.isAlive) {
                    passedPhase1++;
                    aliveCandidates.push({
                        proxy,
                        exitIp: health.exitIp,
                        endpointResults: health.endpointResults,
                    });
                } else {
                    failedPhase1++;
                }
            } catch {
                completedPhase1++;
                failedPhase1++;
            }

            renderProgressPhase1();
        }
    }

    const workersPhase1 = Array.from({ length: concurrency }, () => workerPhase1());
    await Promise.all(workersPhase1);
    process.stdout.write("\n");

    const phase1Duration = ((Date.now() - startedAt) / 1000).toFixed(1);
    process.stdout.write(
        `  ${ansi.green}✓ Phase 1 Finished in ${phase1Duration}s${ansi.reset} — ` +
        `Identified ${ansi.bold}${passedPhase1}${ansi.reset} alive proxies (${failedPhase1} dropped)\n\n`
    );

    /* ----------------------------------------------------------
     * PHASE 2: Deep Top 50 Websites Benchmark on Alive Proxies
     * ---------------------------------------------------------- */
    const benchmarkReports = [];

    if (aliveCandidates.length > 0) {
        process.stdout.write(`${ansi.bold}${ansi.cyan}▶ Phase 2: Top 50 Global Websites Benchmark (${aliveCandidates.length} alive proxies)${ansi.reset}\n`);

        const phase2StartedAt = Date.now();
        let completedPhase2 = 0;
        let nextIndex2 = 0;

        function renderProgressPhase2() {
            const elapsed = (Date.now() - phase2StartedAt) / 1000;
            const rate = completedPhase2 > 0 ? completedPhase2 / Math.max(elapsed, 0.001) : 0;
            const remaining = aliveCandidates.length - completedPhase2;
            const eta = rate > 0 ? remaining / rate : Number.NaN;

            live(
                `${ansi.cyan}Phase 2${ansi.reset} ` +
                `${formatPercent(completedPhase2, aliveCandidates.length)}% | ` +
                `${completedPhase2.toLocaleString()}/${aliveCandidates.length.toLocaleString()} | ` +
                `${formatRate(rate)} | ` +
                `ETA ${formatDuration(eta)}`
            );
        }

        const phase2Concurrency = Math.min(Math.max(Math.floor(concurrency / 2), 10), aliveCandidates.length);

        async function workerPhase2() {
            while (true) {
                const index = nextIndex2;
                if (index >= aliveCandidates.length) return;
                nextIndex2++;

                const candidate = aliveCandidates[index];
                const { proxy, exitIp, endpointResults } = candidate;

                let websiteResults = [];
                if (config.benchmarkTopWebsites && config.topWebsites?.length > 0) {
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

                let anonymity = "UNKNOWN";
                if (exitIp) {
                    if (localPublicIp && exitIp === localPublicIp) {
                        anonymity = "TRANSPARENT (LEAKING)";
                    } else {
                        anonymity = "ELITE / ANONYMOUS";
                    }
                }

                let tier = "SLOW";
                if (avgLatencyMs < 400) tier = "EXCELLENT";
                else if (avgLatencyMs < 800) tier = "GOOD";
                else if (avgLatencyMs < 1500) tier = "MODERATE";

                const totalWebsites = config.topWebsites?.length || 0;
                const websitePassRatePercent = totalWebsites > 0
                    ? parseFloat(((successfulWebsites.length / totalWebsites) * 100).toFixed(1))
                    : 0;

                // Usability-Gated Multi-Factor Scoring (0 - 100 pts)
                // Usability Ratio: A proxy that cannot load websites gets penalized proportionally
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

                const benchmarkData = {
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
                    passRatePercent: parseFloat(((successfulEp.length / endpoints.length) * 100).toFixed(1)),
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

                completedPhase2++;
                renderProgressPhase2();
            }
        }

        const workersPhase2 = Array.from({ length: phase2Concurrency }, () => workerPhase2());
        await Promise.all(workersPhase2);
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
            durationSeconds: (Date.now() - startedAt) / 1000,
            startedAt: new Date(startedAt).toISOString(),
            completedAt: new Date().toISOString(),
        },
    };
}
