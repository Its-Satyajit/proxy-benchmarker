import type { BenchmarkItem, BenchmarkStats, Protocol, TestEndpoint } from "../types.js";
import { CONFIG } from "../config.js";
import { formatDuration } from "../terminal.js";
import { SVG_ICONS } from "./icons.js";
import { getReportStyles } from "./styles.js";
import { getClientScript } from "./client-script.js";

export function generateHtmlReport(
    benchmarkData: BenchmarkItem[],
    stats: BenchmarkStats,
    enabledEndpoints: TestEndpoint[],
    _outputPath: string
): string {
    const bestProxy = benchmarkData.length > 0 ? benchmarkData[0] : null;

    const avgPassLatency = benchmarkData.length > 0
        ? Math.round(benchmarkData.reduce((sum, p) => sum + p.avgLatencyMs, 0) / benchmarkData.length)
        : 0;

    const fastestProxy = benchmarkData.length > 0
        ? [...benchmarkData].sort((a, b) => a.avgLatencyMs - b.avgLatencyMs)[0]
        : null;

    const protocolCounts: Record<Protocol, { total: number; passed: number }> = {
        http: { total: 0, passed: 0 },
        https: { total: 0, passed: 0 },
        socks4: { total: 0, passed: 0 },
        socks5: { total: 0, passed: 0 },
    };

    for (const b of benchmarkData) {
        const proto = b.proxy.protocol;
        if (protocolCounts[proto]) {
            protocolCounts[proto].total++;
            if (b.status === "PASS") {
                protocolCounts[proto].passed++;
            }
        }
    }

    const reportJsonString = JSON.stringify({
        generatedAt: stats.completedAt || new Date().toISOString(),
        stats,
        localPublicIp: stats.localPublicIp,
        endpoints: enabledEndpoints,
        benchmarks: benchmarkData,
    });

    const styles = getReportStyles();
    const clientScript = getClientScript(reportJsonString, JSON.stringify(SVG_ICONS));

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Benchmark & Network Telemetry</title>
    <style>${styles}</style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1><span class="badge-pulse"></span> Proxy Benchmark & Network Telemetry</h1>
                <p>Origin IP: <span class="font-mono">${stats.localPublicIp || 'Direct'}</span> &bull; Telemetry across 50 global edge endpoints</p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn" onclick="toggleWeightsPanel()">${SVG_ICONS.settings} Scoring Weights</button>
                <button class="btn btn-highlight" onclick="copyTop10Urls()">${SVG_ICONS.copy} Copy Top 10</button>
                <button class="btn" onclick="copyPassedUrls()">${SVG_ICONS.copy} Copy All Verified</button>
                <button class="btn btn-primary" onclick="exportFilteredCsv()">${SVG_ICONS.download} Export CSV</button>
            </div>
        </header>

        <!-- Dynamic Scoring Weights Panel -->
        <div id="weights-panel" class="weights-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 0.85rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px;">${SVG_ICONS.settings} Ranking Weights</h3>
                <button class="btn" style="padding: 2px 8px; font-size: 0.7rem;" onclick="resetDefaultWeights()">Reset Defaults</button>
            </div>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">Recalculate composite rankings in real time.</p>
            <div class="weights-grid">
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.globe} Top 50 Sites</span><span id="w-val-websites">30%</span></div>
                    <input type="range" class="weight-slider" id="w-websites" min="0" max="50" value="30" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.bolt} Avg Latency</span><span id="w-val-avgLatency">20%</span></div>
                    <input type="range" class="weight-slider" id="w-avgLatency" min="0" max="50" value="20" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.rocket} Min Latency</span><span id="w-val-minLatency">10%</span></div>
                    <input type="range" class="weight-slider" id="w-minLatency" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.plug} Connect Time</span><span id="w-val-connectTime">10%</span></div>
                    <input type="range" class="weight-slider" id="w-connectTime" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.clock} TTFB</span><span id="w-val-ttfb">10%</span></div>
                    <input type="range" class="weight-slider" id="w-ttfb" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.gauge} Bandwidth</span><span id="w-val-speed">10%</span></div>
                    <input type="range" class="weight-slider" id="w-speed" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.shield} Anonymity</span><span id="w-val-anonymity">10%</span></div>
                    <input type="range" class="weight-slider" id="w-anonymity" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
            </div>
        </div>

        <!-- Telemetry Overview Strip (No Cards) -->
        <div class="telemetry-strip">
            <div class="telemetry-lead" id="telemetry-optimal-lead">
                <div class="telemetry-lead-badge font-mono">${SVG_ICONS.trophy} OPTIMAL ROUTE</div>
                <div class="telemetry-lead-addr font-mono" id="hero-proxy-url">${bestProxy ? `${bestProxy.proxy.protocol.toUpperCase()}://${bestProxy.proxy.ip}:${bestProxy.proxy.port}` : 'No working route found'}</div>
                <div class="telemetry-lead-meta" id="hero-proxy-meta">
                    ${bestProxy ? `<span>${bestProxy.proxy.country || 'Global'}</span> &bull; <span>${bestProxy.anonymity}</span> &bull; <span>${bestProxy.websitesPassed}/${bestProxy.websitesTotal} Targets (${bestProxy.websitePassRatePercent}%)</span>` : '<span style="color: var(--danger);">No proxies passed verification</span>'}
                </div>
                <div class="telemetry-lead-metrics">
                    <div class="metric-item">
                        <span class="metric-lbl">Score</span>
                        <span class="metric-val font-mono" id="hero-score" style="color: var(--accent);">${bestProxy ? bestProxy.compositeScore : '--'}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-lbl">Avg Latency</span>
                        <span class="metric-val font-mono" id="hero-latency" style="color: var(--success);">${bestProxy ? bestProxy.avgLatencyMs + ' ms' : '--'}</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-lbl">Connect</span>
                        <span class="metric-val font-mono" id="hero-connect">${bestProxy ? bestProxy.avgConnectTimeMs + ' ms' : '--'}</span>
                    </div>
                    ${bestProxy ? `<div><button class="btn btn-primary" id="hero-copy-btn" onclick="copyToClipboard('${bestProxy.proxy.protocol}://${bestProxy.proxy.ip}:${bestProxy.proxy.port}')">${SVG_ICONS.copy} Copy URL</button></div>` : ''}
                </div>
            </div>
            <div class="telemetry-metrics-grid">
                <div class="metric-box">
                    <span class="metric-lbl">Scanned</span>
                    <span class="metric-val font-mono">${stats.total.toLocaleString()}</span>
                    <span class="metric-sub">${formatDuration(stats.durationSeconds)}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Verified</span>
                    <span class="metric-val font-mono" style="color: var(--success);">${stats.passed.toLocaleString()}</span>
                    <span class="metric-sub">${((stats.passed / Math.max(stats.total, 1)) * 100).toFixed(1)}% alive</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Dropped</span>
                    <span class="metric-val font-mono" style="color: var(--danger);">${stats.failed.toLocaleString()}</span>
                    <span class="metric-sub">Excluded</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Avg Latency</span>
                    <span class="metric-val font-mono" style="color: var(--accent);">${avgPassLatency > 0 ? avgPassLatency + ' ms' : '--'}</span>
                    <span class="metric-sub">Min: ${fastestProxy ? fastestProxy.minLatencyMs + ' ms' : '--'}</span>
                </div>
                <div class="metric-box">
                    <span class="metric-lbl">Protocols Verified</span>
                    <div class="proto-strip font-mono">
                        <span>H:${protocolCounts.http.passed}</span>
                        <span>HS:${protocolCounts.https.passed}</span>
                        <span>S4:${protocolCounts.socks4.passed}</span>
                        <span>S5:${protocolCounts.socks5.passed}</span>
                    </div>
                    <span class="metric-sub">${CONFIG.topWebsites?.length || 50} edge targets</span>
                </div>
            </div>
        </div>

        <!-- Controls / Search & Filters -->
        <div class="controls">
            <div class="filter-group">
                <div class="search-box">
                    <span class="search-icon">${SVG_ICONS.search}</span>
                    <input type="text" id="search-input" class="search-input" placeholder="Search IP, port, country..." oninput="onFilterChange()">
                </div>
                
                <select id="protocol-filter" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">All Protocols</option>
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                </select>

                <select id="tier-filter" class="filter-select" onchange="onFilterChange()">
                    <option value="ALL">All Latency Tiers</option>
                    <option value="EXCELLENT">&lt; 400ms (Excellent)</option>
                    <option value="GOOD">400 - 800ms (Good)</option>
                    <option value="MODERATE">800 - 1500ms (Moderate)</option>
                    <option value="SLOW">&gt; 1500ms (Slow)</option>
                </select>
            </div>
            <div>
                <span id="filtered-count" style="font-size: 0.8rem; color: var(--text-secondary); font-family: var(--font-mono);">Showing 0 / 0</span>
            </div>
        </div>

        <!-- Virtual Scrolling Table Container -->
        <div id="table-scroll-container" class="table-scroll-container">
            <table id="proxy-table">
                <colgroup>
                    <col style="width: 28px;">
                    <col style="width: 58px;">
                    <col style="width: 68px;">
                    <col style="width: 170px;">
                    <col style="width: 80px;">
                    <col style="width: 70px;">
                    <col style="width: 65px;">
                    <col style="width: 130px;">
                    <col style="width: 95px;">
                    <col style="width: 95px;">
                    <col style="width: 75px;">
                    <col style="width: 95px;">
                    <col style="width: 80px;">
                    <col style="width: 90px;">
                    <col style="width: 75px;">
                </colgroup>
                <thead>
                    <tr>
                        <th></th>
                        <th data-sort="rank">Rank</th>
                        <th data-sort="score" class="sort-desc">Score</th>
                        <th data-sort="ip">Proxy Address</th>
                        <th data-sort="protocol">Proto</th>
                        <th data-sort="country">Country</th>
                        <th data-sort="status">Status</th>
                        <th data-sort="anonymity">Anonymity</th>
                        <th data-sort="websites">Top 50 Sites</th>
                        <th data-sort="avgLatency">Avg Latency</th>
                        <th data-sort="minLatency">Min</th>
                        <th data-sort="connectTime">Connect</th>
                        <th data-sort="ttfb">TTFB</th>
                        <th data-sort="speed">Bandwidth</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <!-- Virtual rows rendered on scroll -->
                </tbody>
            </table>
        </div>

        <div class="footer-note font-mono">
            benchmark-report.json &bull; Virtual scrolling enabled
        </div>
    </div>

    <div id="toast" class="toast">Copied to clipboard!</div>

    <script>${clientScript}</script>
</body>
</html>`;
}
