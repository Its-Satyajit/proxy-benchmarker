import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import type {
    AppConfig,
    BenchmarkItem,
    BenchmarkStats,
    Protocol,
    ProxyItem,
    TestEndpoint
} from "./types.js";
import { CONFIG } from "./config.js";
import { log, ansi, formatDuration } from "./terminal.js";
import { proxyOutputUrl } from "./proxy.js";

export async function atomicWrite(filePath: string, contents: string): Promise<void> {
    const tempPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
    await fs.writeFile(tempPath, contents, "utf8");
    await fs.rename(tempPath, filePath);
}

export async function writeProxyFiles(
    results: Record<Protocol, ProxyItem[]>,
    config: AppConfig
): Promise<void> {
    for (const [protocol, filename] of Object.entries(config.outputFiles) as [Protocol, string][]) {
        const entries = results[protocol].map(proxyOutputUrl);
        const contents = entries.length > 0 ? `${entries.join("\n")}\n` : "";
        await atomicWrite(path.join(config.outputDir, filename), contents);
    }
}

export async function writeJsonReport(
    reportData: {
        generatedAt: string;
        stats: BenchmarkStats;
        endpoints: TestEndpoint[];
        benchmarks: BenchmarkItem[];
    },
    outputPath: string
): Promise<void> {
    const jsonContent = JSON.stringify(reportData, null, 2);
    await atomicWrite(outputPath, jsonContent);
}

// Inline SVG Icons
const SVG_ICONS = {
    trophy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    globe: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    shield: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
    settings: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    copy: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
    download: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
    search: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
    bolt: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>`,
    rocket: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    plug: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/></svg>`,
    clock: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    gauge: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
    alert: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>`,
    chevronRight: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    chevronDown: `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
};

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

    const bestProxyHtml = bestProxy ? `
        <div class="hero-card" id="best-proxy-hero">
            <div class="hero-badge">${SVG_ICONS.trophy} TOP CANDIDATE FOR YOUR NETWORK</div>
            <div class="hero-main">
                <div class="hero-left">
                    <div class="hero-title font-mono" id="hero-proxy-url">${bestProxy.proxy.protocol.toUpperCase()}://${bestProxy.proxy.ip}:${bestProxy.proxy.port}</div>
                    <div class="hero-meta" id="hero-proxy-meta">
                        <span>${SVG_ICONS.globe} ${bestProxy.proxy.country || 'Global'}</span> &bull; 
                        <span>${SVG_ICONS.shield} ${bestProxy.anonymity}</span> &bull; 
                        <span>${SVG_ICONS.globe} ${bestProxy.websitesPassed}/${bestProxy.websitesTotal} Top Websites Reachable (${bestProxy.websitePassRatePercent}%)</span>
                    </div>
                </div>
                <div class="hero-stats">
                    <div class="hero-stat-box">
                        <div class="hero-stat-label">Weighted Score</div>
                        <div class="hero-stat-value" id="hero-score" style="color: var(--accent);">${bestProxy.compositeScore} <span style="font-size: 0.9rem; color: var(--text-muted);">/100</span></div>
                    </div>
                    <div class="hero-stat-box">
                        <div class="hero-stat-label">Avg Latency</div>
                        <div class="hero-stat-value" id="hero-latency" style="color: var(--success);">${bestProxy.avgLatencyMs} ms</div>
                    </div>
                    <div class="hero-stat-box">
                        <div class="hero-stat-label">Connect Time</div>
                        <div class="hero-stat-value" id="hero-connect">${bestProxy.avgConnectTimeMs} ms</div>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="hero-copy-btn" onclick="copyToClipboard('${bestProxy.proxy.protocol}://${bestProxy.proxy.ip}:${bestProxy.proxy.port}')">${SVG_ICONS.copy} Copy Best Proxy</button>
                    </div>
                </div>
            </div>
        </div>
    ` : `
        <div class="hero-card" style="background: rgba(239, 68, 68, 0.08); border-color: rgba(239, 68, 68, 0.3);">
            <div class="hero-badge" style="background: rgba(239, 68, 68, 0.2); color: var(--danger);">${SVG_ICONS.alert} NO WORKING PROXIES FOUND</div>
            <div class="hero-main">
                <p style="color: var(--text-secondary);">None of the tested proxies successfully connected to verification endpoints from your current network.</p>
            </div>
        </div>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proxy Benchmark Report</title>
    <style>
        :root {
            --bg-primary: #0b0f19;
            --bg-secondary: #131b2e;
            --bg-card: #1a243b;
            --bg-hover: #22304d;
            --border: #263554;
            --border-light: #3b4d75;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent: #38bdf8;
            --accent-hover: #0ea5e9;
            --success: #22c55e;
            --success-bg: rgba(34, 197, 94, 0.15);
            --warning: #eab308;
            --warning-bg: rgba(234, 179, 8, 0.15);
            --danger: #ef4444;
            --danger-bg: rgba(239, 68, 68, 0.15);
            --radius: 10px;
            --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font);
            line-height: 1.5;
            padding: 24px 32px;
        }

        .container { max-width: 1560px; margin: 0 auto; }

        .icon {
            display: inline-block;
            width: 1em;
            height: 1em;
            stroke-width: 2;
            stroke: currentColor;
            fill: none;
            vertical-align: -0.125em;
            flex-shrink: 0;
        }

        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 24px;
            flex-wrap: wrap;
            gap: 16px;
        }

        .title-group h1 {
            font-size: 1.85rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .title-group p {
            color: var(--text-secondary);
            font-size: 0.875rem;
            margin-top: 4px;
        }

        .badge-pulse {
            display: inline-block;
            width: 10px;
            height: 10px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--success);
        }

        .hero-card {
            background: linear-gradient(135deg, #162444 0%, #111a33 100%);
            border: 1px solid var(--accent);
            border-radius: var(--radius);
            padding: 20px 24px;
            margin-bottom: 24px;
            box-shadow: 0 10px 25px -5px rgba(56, 189, 248, 0.15);
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background-color: rgba(56, 189, 248, 0.2);
            color: var(--accent);
            font-size: 0.75rem;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 9999px;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
        }

        .hero-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 20px;
        }

        .hero-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 6px;
        }

        .hero-meta {
            color: var(--text-secondary);
            font-size: 0.875rem;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
        }

        .hero-meta span {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .hero-stats {
            display: flex;
            align-items: center;
            gap: 24px;
            flex-wrap: wrap;
        }

        .hero-stat-box { text-align: right; }

        .hero-stat-label {
            font-size: 0.72rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
        }

        .hero-stat-value {
            font-size: 1.4rem;
            font-weight: 700;
            font-family: var(--font-mono);
        }

        .weights-panel {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 24px;
            display: none;
        }
        .weights-panel.open { display: block; }

        .weights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 14px;
            margin-top: 12px;
        }

        .weight-item {
            background-color: var(--bg-card);
            padding: 10px 14px;
            border-radius: 6px;
            border: 1px solid var(--border);
        }

        .weight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.78rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 6px;
        }

        .weight-header span:first-child {
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }

        .weight-slider {
            width: 100%;
            cursor: pointer;
            accent-color: var(--accent);
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
        }

        .card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px 20px;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .card-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted);
            font-weight: 600;
        }

        .card-value {
            font-size: 1.625rem;
            font-weight: 700;
            font-family: var(--font-mono);
        }

        .card-sub {
            font-size: 0.8rem;
            color: var(--text-secondary);
        }

        .controls {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            padding: 16px 20px;
            margin-bottom: 20px;
            display: flex;
            flex-wrap: wrap;
            gap: 16px;
            align-items: center;
            justify-content: space-between;
        }

        .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
        }

        .search-box {
            position: relative;
            display: inline-flex;
            align-items: center;
        }

        .search-box .search-icon {
            position: absolute;
            left: 10px;
            color: var(--text-muted);
            pointer-events: none;
        }

        .search-input {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 8px 14px 8px 32px;
            border-radius: 6px;
            font-size: 0.875rem;
            width: 260px;
            outline: none;
            transition: border-color 0.2s;
        }
        .search-input:focus { border-color: var(--accent); }

        select.filter-select {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.875rem;
            outline: none;
            cursor: pointer;
        }

        .btn {
            background-color: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border);
            padding: 8px 14px;
            border-radius: 6px;
            font-size: 0.875rem;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn:hover { background-color: var(--bg-hover); border-color: var(--border-light); }

        .btn-primary {
            background-color: var(--accent);
            color: #0b0f19;
            border-color: var(--accent);
            font-weight: 600;
        }
        .btn-primary:hover { background-color: var(--accent-hover); }

        .btn-highlight {
            background-color: rgba(234, 179, 8, 0.15);
            color: var(--warning);
            border-color: rgba(234, 179, 8, 0.4);
            font-weight: 600;
        }
        .btn-highlight:hover { background-color: rgba(234, 179, 8, 0.25); }

        .table-wrapper {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            overflow-x: auto;
            margin-bottom: 24px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.875rem;
            text-align: left;
        }

        thead {
            background-color: #0e1526;
            position: sticky;
            top: 0;
            z-index: 10;
        }

        th {
            padding: 12px 16px;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            border-bottom: 1px solid var(--border);
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
            transition: color 0.15s, background-color 0.15s;
        }

        th:hover { color: var(--text-primary); background-color: var(--bg-hover); }
        th.sort-asc::after { content: " \\25B2"; color: var(--accent); font-size: 0.7rem; }
        th.sort-desc::after { content: " \\25BC"; color: var(--accent); font-size: 0.7rem; }

        td {
            padding: 12px 16px;
            border-bottom: 1px solid var(--border);
            white-space: nowrap;
        }

        tbody tr { transition: background-color 0.15s; }
        tbody tr:hover { background-color: var(--bg-hover); }

        .row-expanded { background-color: rgba(56, 189, 248, 0.05) !important; }

        .details-row td {
            padding: 0;
            background-color: #0f172a;
        }

        .details-container {
            padding: 20px 24px;
            border-bottom: 2px solid var(--accent);
        }

        .tab-nav {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 8px;
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 6px 12px;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .tab-btn.active {
            background-color: rgba(56, 189, 248, 0.15);
            color: var(--accent);
        }

        .grid-websites {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 10px;
        }

        .site-card {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 6px;
            padding: 9px 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            min-width: 0;
            overflow: hidden;
            transition: border-color 0.15s, background-color 0.15s;
        }
        .site-card:hover { background-color: var(--bg-card); }

        .site-card-info {
            min-width: 0;
            flex: 1 1 auto;
            overflow: hidden;
        }

        .site-name {
            font-weight: 600;
            font-size: 0.85rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .site-domain {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-family: var(--font-mono);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .site-card-metrics {
            flex-shrink: 0;
            text-align: right;
            max-width: 48%;
            min-width: 72px;
            overflow: hidden;
        }

        .site-metric-val {
            font-family: var(--font-mono);
            font-size: 0.82rem;
            font-weight: 700;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .site-metric-sub {
            font-size: 0.7rem;
            font-family: var(--font-mono);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .font-mono { font-family: var(--font-mono); }

        .pill {
            display: inline-flex;
            align-items: center;
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .pill-pass { background-color: var(--success-bg); color: var(--success); border: 1px solid rgba(34, 197, 94, 0.3); }
        .pill-fail { background-color: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }
        .pill-protocol { background-color: rgba(56, 189, 248, 0.12); color: var(--accent); font-family: var(--font-mono); font-size: 0.72rem; }

        .rank-pill {
            background: linear-gradient(135deg, rgba(234, 179, 8, 0.2), rgba(234, 179, 8, 0.05));
            color: var(--warning);
            border: 1px solid rgba(234, 179, 8, 0.4);
            font-weight: 700;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: var(--font-mono);
        }

        .score-pill {
            font-weight: 700;
            font-size: 0.85rem;
            font-family: var(--font-mono);
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .score-high { background-color: rgba(34, 197, 94, 0.2); color: #4ade80; }
        .score-med { background-color: rgba(234, 179, 8, 0.2); color: #facc15; }
        .score-low { background-color: rgba(239, 68, 68, 0.2); color: #f87171; }

        .tier-excellent { color: #4ade80; font-weight: 600; }
        .tier-good { color: #38bdf8; font-weight: 600; }
        .tier-moderate { color: #facc15; }
        .tier-slow { color: #fb923c; }
        .tier-dead { color: var(--text-muted); }

        .latency-badge { font-family: var(--font-mono); font-weight: 600; }
        .latency-fast { color: #4ade80; }
        .latency-med { color: #facc15; }
        .latency-slow { color: #fb923c; }
        .latency-none { color: var(--text-muted); }

        .copy-btn {
            background: none;
            border: 1px solid var(--border);
            color: var(--text-secondary);
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.7rem;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 4px;
        }
        .copy-btn:hover { color: var(--text-primary); border-color: var(--accent); }

        .expand-toggle {
            cursor: pointer;
            color: var(--accent);
            user-select: none;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.2s;
            margin-right: 6px;
            width: 14px;
            height: 14px;
        }

        .footer-note {
            text-align: center;
            font-size: 0.8rem;
            color: var(--text-muted);
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid var(--border);
        }

        .toast {
            position: fixed;
            bottom: 24px;
            right: 24px;
            background-color: var(--accent);
            color: #0b0f19;
            padding: 10px 18px;
            border-radius: 6px;
            font-weight: 600;
            font-size: 0.875rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transform: translateY(10px);
            transition: all 0.25s ease;
            z-index: 1000;
        }
        .toast.show { opacity: 1; transform: translateY(0); }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <div class="title-group">
                <h1><span class="badge-pulse"></span> Proxy Benchmark & Network Finder</h1>
                <p>Testing from your network (<span class="font-mono">${stats.localPublicIp || 'Direct'}</span>) &bull; Ranked by website reachability and latency</p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button class="btn" onclick="toggleWeightsPanel()">${SVG_ICONS.settings} Scoring Weights</button>
                <button class="btn btn-highlight" onclick="copyTop10Urls()">${SVG_ICONS.copy} Copy Top 10 Proxies</button>
                <button class="btn" onclick="copyPassedUrls()">${SVG_ICONS.copy} Copy All Alive</button>
                <button class="btn btn-primary" onclick="exportFilteredCsv()">${SVG_ICONS.download} Export CSV</button>
            </div>
        </header>

        <!-- Dynamic Scoring Weights Panel -->
        <div id="weights-panel" class="weights-panel">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 0.95rem; font-weight: 700; color: var(--accent); display: flex; align-items: center; gap: 6px;">${SVG_ICONS.settings} Customize Ranking Weights</h3>
                <button class="btn" style="padding: 4px 10px; font-size: 0.75rem;" onclick="resetDefaultWeights()">Reset Defaults</button>
            </div>
            <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Change column weights to recalculate rankings in real time.</p>
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
                    <div class="weight-header"><span>${SVG_ICONS.clock} TTFB Time</span><span id="w-val-ttfb">10%</span></div>
                    <input type="range" class="weight-slider" id="w-ttfb" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.gauge} Speed / Bandwidth</span><span id="w-val-speed">10%</span></div>
                    <input type="range" class="weight-slider" id="w-speed" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
                <div class="weight-item">
                    <div class="weight-header"><span>${SVG_ICONS.shield} Anonymity</span><span id="w-val-anonymity">10%</span></div>
                    <input type="range" class="weight-slider" id="w-anonymity" min="0" max="30" value="10" oninput="updateWeights()">
                </div>
            </div>
        </div>

        <!-- Best Proxy Hero Section -->
        ${bestProxyHtml}

        <!-- Stats Overview Cards -->
        <div class="stats-grid">
            <div class="card">
                <span class="card-label">Total Proxies Scanned</span>
                <span class="card-value">${stats.total.toLocaleString()}</span>
                <span class="card-sub">Benchmarked in ${formatDuration(stats.durationSeconds)}</span>
            </div>
            <div class="card">
                <span class="card-label">Alive & Verified</span>
                <span class="card-value" style="color: var(--success);">${stats.passed.toLocaleString()}</span>
                <span class="card-sub">${((stats.passed / Math.max(stats.total, 1)) * 100).toFixed(1)}% success rate</span>
            </div>
            <div class="card">
                <span class="card-label">Hard Failed / Dropped</span>
                <span class="card-value" style="color: var(--danger);">${stats.failed.toLocaleString()}</span>
                <span class="card-sub">Excluded from report</span>
            </div>
            <div class="card">
                <span class="card-label">Avg Alive Latency</span>
                <span class="card-value" style="color: var(--accent);">${avgPassLatency > 0 ? avgPassLatency + " ms" : "--"}</span>
                <span class="card-sub">Fastest: ${fastestProxy ? fastestProxy.minLatencyMs + " ms" : "--"}</span>
            </div>
            <div class="card">
                <span class="card-label">Global Websites Tested</span>
                <span class="card-value">${CONFIG.topWebsites?.length || 50} Sites</span>
                <span class="card-sub">Google, Cloudflare, GitHub, etc.</span>
            </div>
        </div>

        <!-- Protocol Distribution Cards -->
        <div class="stats-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 24px;">
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">HTTP</span>
                <span class="card-value" style="font-size: 1.25rem;">${protocolCounts.http.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${protocolCounts.http.total}</span></span>
            </div>
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">HTTPS</span>
                <span class="card-value" style="font-size: 1.25rem;">${protocolCounts.https.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${protocolCounts.https.total}</span></span>
            </div>
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">SOCKS4</span>
                <span class="card-value" style="font-size: 1.25rem;">${protocolCounts.socks4.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${protocolCounts.socks4.total}</span></span>
            </div>
            <div class="card" style="padding: 12px 16px;">
                <span class="card-label">SOCKS5</span>
                <span class="card-value" style="font-size: 1.25rem;">${protocolCounts.socks5.passed} <span style="font-size: 0.85rem; color: var(--text-muted);">/ ${protocolCounts.socks5.total}</span></span>
            </div>
        </div>

        <!-- Controls / Search & Filters -->
        <div class="controls">
            <div class="filter-group">
                <div class="search-box">
                    <span class="search-icon">${SVG_ICONS.search}</span>
                    <input type="text" id="search-input" class="search-input" placeholder="Search IP, port, country..." oninput="applyFilters()">
                </div>
                
                <select id="protocol-filter" class="filter-select" onchange="applyFilters()">
                    <option value="ALL">All Protocols</option>
                    <option value="http">HTTP</option>
                    <option value="https">HTTPS</option>
                    <option value="socks4">SOCKS4</option>
                    <option value="socks5">SOCKS5</option>
                </select>

                <select id="tier-filter" class="filter-select" onchange="applyFilters()">
                    <option value="ALL">All Latency Tiers</option>
                    <option value="EXCELLENT">&lt; 400ms (Excellent)</option>
                    <option value="GOOD">400 - 800ms (Good)</option>
                    <option value="MODERATE">800 - 1500ms (Moderate)</option>
                    <option value="SLOW">&gt; 1500ms (Slow)</option>
                </select>
            </div>
            <div>
                <span id="filtered-count" style="font-size: 0.875rem; color: var(--text-secondary); font-family: var(--font-mono);">Showing 0 / 0</span>
            </div>
        </div>

        <!-- Benchmark Data Table -->
        <div class="table-wrapper">
            <table id="proxy-table">
                <thead>
                    <tr>
                        <th style="width: 30px;"></th>
                        <th data-sort="rank">Rank</th>
                        <th data-sort="score" class="sort-desc">Score (Weighted)</th>
                        <th data-sort="ip">Proxy Address</th>
                        <th data-sort="protocol">Protocol</th>
                        <th data-sort="country">Country</th>
                        <th data-sort="status">Status</th>
                        <th data-sort="anonymity">Anonymity</th>
                        <th data-sort="websites">Top 50 Sites</th>
                        <th data-sort="avgLatency">Avg Latency</th>
                        <th data-sort="minLatency">Min</th>
                        <th data-sort="connectTime">Connect Time</th>
                        <th data-sort="ttfb">TTFB</th>
                        <th data-sort="speed">Speed</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="table-body">
                    <!-- Rows dynamically populated -->
                </tbody>
            </table>
        </div>

        <div class="footer-note">
            Full telemetry and benchmark details saved to <span class="font-mono">benchmark-report.json</span>
        </div>
    </div>

    <div id="toast" class="toast">Copied to clipboard!</div>

    <script>
        const RAW_DATA = ${reportJsonString};
        let benchmarks = RAW_DATA.benchmarks || [];
        let currentSort = { column: 'score', asc: false };
        let expandedRows = new Set();
        let currentSubTabs = {};

        const SVG_ICONS = ${JSON.stringify(SVG_ICONS)};

        // Active Scoring Weights (Sum = 100)
        let weights = {
            websites: 30,
            avgLatency: 20,
            minLatency: 10,
            connectTime: 10,
            ttfb: 10,
            speed: 10,
            anonymity: 10,
        };

        function toggleWeightsPanel() {
            const panel = document.getElementById('weights-panel');
            panel.classList.toggle('open');
        }

        function resetDefaultWeights() {
            weights = { websites: 30, avgLatency: 20, minLatency: 10, connectTime: 10, ttfb: 10, speed: 10, anonymity: 10 };
            document.getElementById('w-websites').value = 30;
            document.getElementById('w-avgLatency').value = 20;
            document.getElementById('w-minLatency').value = 10;
            document.getElementById('w-connectTime').value = 10;
            document.getElementById('w-ttfb').value = 10;
            document.getElementById('w-speed').value = 10;
            document.getElementById('w-anonymity').value = 10;
            updateWeightLabels();
            recalculateAllScores();
        }

        function updateWeights() {
            weights.websites = parseInt(document.getElementById('w-websites').value, 10);
            weights.avgLatency = parseInt(document.getElementById('w-avgLatency').value, 10);
            weights.minLatency = parseInt(document.getElementById('w-minLatency').value, 10);
            weights.connectTime = parseInt(document.getElementById('w-connectTime').value, 10);
            weights.ttfb = parseInt(document.getElementById('w-ttfb').value, 10);
            weights.speed = parseInt(document.getElementById('w-speed').value, 10);
            weights.anonymity = parseInt(document.getElementById('w-anonymity').value, 10);
            updateWeightLabels();
            recalculateAllScores();
        }

        function updateWeightLabels() {
            document.getElementById('w-val-websites').textContent = weights.websites + '%';
            document.getElementById('w-val-avgLatency').textContent = weights.avgLatency + '%';
            document.getElementById('w-val-minLatency').textContent = weights.minLatency + '%';
            document.getElementById('w-val-connectTime').textContent = weights.connectTime + '%';
            document.getElementById('w-val-ttfb').textContent = weights.ttfb + '%';
            document.getElementById('w-val-speed').textContent = weights.speed + '%';
            document.getElementById('w-val-anonymity').textContent = weights.anonymity + '%';
        }

        function computeWeightedScore(item) {
            const usabilityRatio = item.websitesTotal > 0 ? (item.websitesPassed / item.websitesTotal) : 1;

            const wScore = usabilityRatio * 50;

            const latScore = Math.max(0, Math.min(20, 20 * (1 - (item.avgLatencyMs / 2500))));
            const minLatScore = Math.max(0, Math.min(8, 8 * (1 - (item.minLatencyMs / 1500))));
            const connScore = Math.max(0, Math.min(8, 8 * (1 - (item.avgConnectTimeMs / 800))));
            const ttfbScore = Math.max(0, Math.min(7, 7 * (1 - (item.avgTtfbMs / 1500))));
            const spdScore = Math.max(0, Math.min(7, (item.avgSpeedBps / (500 * 1024)) * 7));

            const rawPerfScore = latScore + minLatScore + connScore + ttfbScore + spdScore;
            const gatedPerfScore = rawPerfScore * usabilityRatio;

            const totalScore = Math.round(wScore + gatedPerfScore);

            return {
                totalScore,
                breakdown: {
                    websites: Math.round(wScore),
                    avgLatency: Math.round(latScore * usabilityRatio),
                    minLatency: Math.round(minLatScore * usabilityRatio),
                    connectTime: Math.round(connScore * usabilityRatio),
                    ttfb: Math.round(ttfbScore * usabilityRatio),
                    speed: Math.round(spdScore * usabilityRatio),
                    anonymity: item.anonymity === 'ELITE / ANONYMOUS' ? 10 : 0,
                }
            };
        }

        function recalculateAllScores() {
            benchmarks.forEach(item => {
                const res = computeWeightedScore(item);
                item.compositeScore = res.totalScore;
                item.scoreBreakdown = res.breakdown;
            });

            benchmarks.sort((a, b) => {
                if (b.compositeScore !== a.compositeScore) {
                    return b.compositeScore - a.compositeScore;
                }
                return a.avgLatencyMs - b.avgLatencyMs;
            });

            benchmarks.forEach((item, idx) => {
                item.rank = idx + 1;
            });

            updateHeroCard();
            renderTable();
        }

        function updateHeroCard() {
            const best = benchmarks[0];
            if (!best) return;
            const heroUrl = document.getElementById('hero-proxy-url');
            const heroMeta = document.getElementById('hero-proxy-meta');
            const heroScore = document.getElementById('hero-score');
            const heroLatency = document.getElementById('hero-latency');
            const heroConnect = document.getElementById('hero-connect');
            const heroCopyBtn = document.getElementById('hero-copy-btn');

            if (heroUrl) heroUrl.textContent = \`\${best.proxy.protocol.toUpperCase()}://\${best.proxy.ip}:\${best.proxy.port}\`;
            if (heroMeta) heroMeta.innerHTML = \`<span>\${SVG_ICONS.globe} \${best.proxy.country || 'Global'}</span> &bull; <span>\${SVG_ICONS.shield} \${best.anonymity}</span> &bull; <span>\${SVG_ICONS.globe} \${best.websitesPassed}/\${best.websitesTotal} Top Websites Reachable (\${best.websitePassRatePercent}%)</span>\`;
            if (heroScore) heroScore.innerHTML = \`\${best.compositeScore} <span style="font-size: 0.9rem; color: var(--text-muted);">/100</span>\`;
            if (heroLatency) heroLatency.textContent = \`\${best.avgLatencyMs} ms\`;
            if (heroConnect) heroConnect.textContent = \`\${best.avgConnectTimeMs} ms\`;
            if (heroCopyBtn) heroCopyBtn.setAttribute('onclick', \`copyToClipboard('\${best.proxy.protocol}://\${best.proxy.ip}:\${best.proxy.port}')\`);
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2200);
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Copied: ' + text);
            }).catch(() => {
                showToast('Failed to copy');
            });
        }

        function copyTop10Urls() {
            const top10 = benchmarks
                .slice(0, 10)
                .map(b => b.proxy.protocol + '://' + b.proxy.ip + ':' + b.proxy.port);
            if (top10.length === 0) {
                showToast('No working proxies available');
                return;
            }
            copyToClipboard(top10.join('\\n'));
            showToast(\`Copied Top \${top10.length} proxy URLs to clipboard!\`);
        }

        function copyPassedUrls() {
            const passed = benchmarks
                .filter(b => b.status === 'PASS')
                .map(b => b.proxy.protocol + '://' + b.proxy.ip + ':' + b.proxy.port);
            if (passed.length === 0) {
                showToast('No alive proxies to copy');
                return;
            }
            copyToClipboard(passed.join('\\n'));
            showToast(\`Copied \${passed.length} proxy URLs\`);
        }

        function exportFilteredCsv() {
            const filtered = getFilteredData();
            if (filtered.length === 0) {
                showToast('No rows to export');
                return;
            }
            const headers = ['Rank', 'WeightedScore', 'Protocol', 'IP', 'Port', 'Country', 'Status', 'Anonymity', 'WebsitesPassed', 'WebsitesTotal', 'WebPassRate%', 'AvgLatency_ms', 'MinLatency_ms', 'ConnectTime_ms', 'TTFB_ms', 'Speed_Bps', 'ProxyUrl'];
            const rows = filtered.map(b => [
                b.rank || '',
                b.compositeScore || 0,
                b.proxy.protocol,
                b.proxy.ip,
                b.proxy.port,
                b.proxy.country || '',
                b.status,
                b.anonymity || 'UNKNOWN',
                b.websitesPassed || 0,
                b.websitesTotal || 0,
                b.websitePassRatePercent || 0,
                b.avgLatencyMs,
                b.minLatencyMs,
                b.avgConnectTimeMs,
                b.avgTtfbMs,
                b.avgSpeedBps,
                b.proxy.protocol + '://' + b.proxy.ip + ':' + b.proxy.port
            ]);

            const csvContent = [headers.join(','), ...rows.map(r => r.map(v => typeof v === 'string' && (v.includes(',') || v.includes('"')) ? \`"\${v}"\` : v).join(','))].join('\\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', \`proxy-benchmark-weighted-\${Date.now()}.csv\`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        function escapeHtml(str) {
            if (str === null || str === undefined) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function formatWebsiteDisplay(ws) {
            if (ws.ok) {
                return {
                    val: ws.totalLatencyMs + ' ms',
                    valColor: 'var(--success)',
                    sub: ws.httpCode ? 'HTTP ' + ws.httpCode : '200 OK',
                    subColor: 'var(--text-muted)',
                    title: \`\${ws.name} (\${ws.domain}): \${ws.totalLatencyMs}ms - HTTP \${ws.httpCode || 200}\`
                };
            }

            const reason = ws.reason || '';
            let val = 'FAILED';
            let sub = 'Offline';

            if (ws.httpCode > 0) {
                val = 'HTTP ' + ws.httpCode;
                if (ws.httpCode === 403) sub = 'Forbidden';
                else if (ws.httpCode === 401) sub = 'Unauthorized';
                else if (ws.httpCode === 404) sub = 'Not Found';
                else if (ws.httpCode === 429) sub = 'Rate Limited';
                else if (ws.httpCode === 500) sub = 'Server Error';
                else if (ws.httpCode === 502) sub = 'Bad Gateway';
                else if (ws.httpCode === 503) sub = 'Unavailable';
                else if (ws.httpCode === 504) sub = 'Gateway Timeout';
                else if (ws.httpCode >= 400 && ws.httpCode < 500) sub = 'Client Error';
                else if (ws.httpCode >= 500) sub = 'Server Error';
                else sub = 'Error';
            } else if (/timed out/i.test(reason) || /curl: \\(28\\)/i.test(reason)) {
                val = 'Timed Out';
                sub = 'No Reply';
            } else if (/refused/i.test(reason) || /curl: \\(7\\)/i.test(reason)) {
                val = 'Refused';
                sub = 'Conn Refused';
            } else if (/reset/i.test(reason) || /recv failure/i.test(reason) || /curl: \\(56\\)/i.test(reason)) {
                val = 'Reset';
                sub = 'Conn Dropped';
            } else if (/empty reply/i.test(reason) || /curl: \\(52\\)/i.test(reason)) {
                val = 'Empty Reply';
                sub = '0 Bytes';
            } else if (/ssl|tls|certificate/i.test(reason) || /curl: \\((35|60)\\)/i.test(reason)) {
                val = 'SSL Error';
                sub = 'Handshake Fail';
            } else if (/resolve|dns/i.test(reason) || /curl: \\(6\\)/i.test(reason)) {
                val = 'DNS Error';
                sub = 'Unresolved';
            } else if (reason) {
                val = reason.length > 14 ? reason.slice(0, 14) + '...' : reason;
                sub = 'Failed';
            }

            return {
                val,
                valColor: 'var(--danger)',
                sub,
                subColor: 'rgba(239, 68, 68, 0.8)',
                title: \`\${ws.name} (\${ws.domain}): \${reason || ('HTTP ' + ws.httpCode)}\`
            };
        }

        function formatSpeed(bytesPerSec) {
            if (!bytesPerSec || bytesPerSec <= 0) return '--';
            if (bytesPerSec < 1024) return bytesPerSec.toFixed(0) + ' B/s';
            if (bytesPerSec < 1024 * 1024) return (bytesPerSec / 1024).toFixed(1) + ' KB/s';
            return (bytesPerSec / (1024 * 1024)).toFixed(2) + ' MB/s';
        }

        function getLatencyClass(ms, status) {
            if (status !== 'PASS' || ms <= 0) return 'latency-none';
            if (ms < 400) return 'latency-fast';
            if (ms < 1000) return 'latency-med';
            return 'latency-slow';
        }

        function getScoreClass(score) {
            if (score >= 80) return 'score-high';
            if (score >= 50) return 'score-med';
            return 'score-low';
        }

        function ipToNumber(ip) {
            return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
        }

        function getFilteredData() {
            const query = (document.getElementById('search-input').value || '').trim().toLowerCase();
            const proto = document.getElementById('protocol-filter').value;
            const tier = document.getElementById('tier-filter').value;

            return benchmarks.filter(b => {
                if (proto !== 'ALL' && b.proxy.protocol !== proto) return false;
                if (tier !== 'ALL' && b.tier !== tier) return false;

                if (query) {
                    const matchIp = b.proxy.ip.includes(query);
                    const matchPort = String(b.proxy.port).includes(query);
                    const matchCountry = (b.proxy.country || '').toLowerCase().includes(query);
                    const matchProto = b.proxy.protocol.toLowerCase().includes(query);
                    if (!matchIp && !matchPort && !matchCountry && !matchProto) return false;
                }
                return true;
            });
        }

        function sortData(data) {
            const { column, asc } = currentSort;
            const modifier = asc ? 1 : -1;

            return [...data].sort((a, b) => {
                let vA, vB;
                switch (column) {
                    case 'rank':
                        vA = a.rank || 99999;
                        vB = b.rank || 99999;
                        break;
                    case 'score':
                        vA = a.compositeScore || 0;
                        vB = b.compositeScore || 0;
                        break;
                    case 'ip':
                        vA = ipToNumber(a.proxy.ip);
                        vB = ipToNumber(b.proxy.ip);
                        break;
                    case 'protocol':
                        vA = a.proxy.protocol;
                        vB = b.proxy.protocol;
                        break;
                    case 'country':
                        vA = a.proxy.country || '';
                        vB = b.proxy.country || '';
                        break;
                    case 'status':
                        vA = a.status;
                        vB = b.status;
                        break;
                    case 'anonymity':
                        vA = a.anonymity || '';
                        vB = b.anonymity || '';
                        break;
                    case 'websites':
                        vA = a.websitesPassed || 0;
                        vB = b.websitesPassed || 0;
                        break;
                    case 'avgLatency':
                        vA = a.status === 'PASS' ? a.avgLatencyMs : 99999999;
                        vB = b.status === 'PASS' ? b.avgLatencyMs : 99999999;
                        break;
                    case 'minLatency':
                        vA = a.status === 'PASS' ? a.minLatencyMs : 99999999;
                        vB = b.status === 'PASS' ? b.minLatencyMs : 99999999;
                        break;
                    case 'connectTime':
                        vA = a.status === 'PASS' ? a.avgConnectTimeMs : 99999999;
                        vB = b.status === 'PASS' ? b.avgConnectTimeMs : 99999999;
                        break;
                    case 'ttfb':
                        vA = a.status === 'PASS' ? a.avgTtfbMs : 99999999;
                        vB = b.status === 'PASS' ? b.avgTtfbMs : 99999999;
                        break;
                    case 'speed':
                        vA = a.avgSpeedBps || 0;
                        vB = b.avgSpeedBps || 0;
                        break;
                    default:
                        vA = a.compositeScore || 0;
                        vB = b.compositeScore || 0;
                }

                if (typeof vA === 'string') {
                    return vA.localeCompare(vB) * modifier;
                }
                return (vA - vB) * modifier;
            });
        }

        function toggleRow(proxyKey) {
            if (expandedRows.has(proxyKey)) {
                expandedRows.delete(proxyKey);
            } else {
                expandedRows.add(proxyKey);
                if (!currentSubTabs[proxyKey]) {
                    currentSubTabs[proxyKey] = 'websites';
                }
            }
            renderTable();
        }

        function switchSubTab(proxyKey, tabName) {
            currentSubTabs[proxyKey] = tabName;
            renderTable();
        }

        function renderTable() {
            const filtered = getFilteredData();
            const sorted = sortData(filtered);
            const tbody = document.getElementById('table-body');
            const countLabel = document.getElementById('filtered-count');

            countLabel.textContent = \`Showing \${sorted.length.toLocaleString()} / \${benchmarks.length.toLocaleString()} alive proxies\`;

            if (sorted.length === 0) {
                tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; padding: 32px; color: var(--text-muted);">No working proxies match the selected filters.</td></tr>';
                return;
            }

            let html = '';
            for (const item of sorted) {
                const p = item.proxy;
                const pKey = \`\${p.protocol}_\${p.ip}_\${p.port}\`;
                const isExpanded = expandedRows.has(pKey);
                const fullUrl = \`\${p.protocol}://\${p.ip}:\${p.port}\`;
                const activeTab = currentSubTabs[pKey] || 'websites';

                const bd = item.scoreBreakdown || {};
                const tooltipText = \`Websites: \${bd.websites || 0} pts | Avg Lat: \${bd.avgLatency || 0} pts | Min Lat: \${bd.minLatency || 0} pts | Connect: \${bd.connectTime || 0} pts | TTFB: \${bd.ttfb || 0} pts | Speed: \${bd.speed || 0} pts | Anon: \${bd.anonymity || 0} pts\`;

                const latencyClass = getLatencyClass(item.avgLatencyMs, item.status);
                const statusPill = item.status === 'PASS' 
                    ? '<span class="pill pill-pass">PASS</span>'
                    : '<span class="pill pill-fail">FAIL</span>';

                html += \`
                <tr class="\${isExpanded ? 'row-expanded' : ''}">
                    <td>
                        <span class="expand-toggle" onclick="toggleRow('\${pKey}')">\${isExpanded ? SVG_ICONS.chevronDown : SVG_ICONS.chevronRight}</span>
                    </td>
                    <td>
                        <span class="rank-pill">#\${item.rank}</span>
                    </td>
                    <td>
                        <span class="score-pill \${getScoreClass(item.compositeScore)}" title="\${tooltipText}">\${item.compositeScore}</span>
                    </td>
                    <td class="font-mono" style="font-weight: 600;">
                        <a href="javascript:void(0)" onclick="toggleRow('\${pKey}')" style="color: var(--text-primary); text-decoration: none;">\${p.ip}:\${p.port}</a>
                    </td>
                    <td><span class="pill pill-protocol">\${p.protocol.toUpperCase()}</span></td>
                    <td>\${p.country || '--'}</td>
                    <td>\${statusPill}</td>
                    <td style="font-size: 0.78rem;">\${item.anonymity || '--'}</td>
                    <td class="font-mono">
                        \${item.websitesPassed}/\${item.websitesTotal} (\${item.websitePassRatePercent}%)
                    </td>
                    <td class="latency-badge \${latencyClass}">\${item.avgLatencyMs + ' ms'}</td>
                    <td class="font-mono \${latencyClass}">\${item.minLatencyMs + ' ms'}</td>
                    <td class="font-mono">\${item.avgConnectTimeMs + ' ms'}</td>
                    <td class="font-mono">\${item.avgTtfbMs + ' ms'}</td>
                    <td class="font-mono">\${formatSpeed(item.avgSpeedBps)}</td>
                    <td>
                        <button class="copy-btn" onclick="copyToClipboard('\${fullUrl}')" title="Copy URL">\${SVG_ICONS.copy} Copy</button>
                    </td>
                </tr>
                \`;

                if (isExpanded) {
                    html += \`
                    <tr class="details-row">
                        <td colspan="15">
                            <div class="details-container">
                                <div class="tab-nav">
                                    <button class="tab-btn \${activeTab === 'websites' ? 'active' : ''}" onclick="switchSubTab('\${pKey}', 'websites')">\${SVG_ICONS.globe} Top 50 Websites (\${item.websitesPassed || 0}/\${item.websitesTotal || 50})</button>
                                    <button class="tab-btn \${activeTab === 'endpoints' ? 'active' : ''}" onclick="switchSubTab('\${pKey}', 'endpoints')">\${SVG_ICONS.search} Verification Endpoints (\${item.endpointsPassed || 0}/\${item.endpointsTotal || 11})</button>
                                </div>

                                \${activeTab === 'websites' ? \`
                                    <div class="grid-websites">
                                        \${(item.websiteDetails || []).map(ws => {
                                            const d = formatWebsiteDisplay(ws);
                                            return \`
                                            <div class="site-card" style="border-left: 3px solid \${ws.ok ? 'var(--success)' : 'var(--danger)'};" title="\${escapeHtml(d.title)}">
                                                <div class="site-card-info">
                                                    <div class="site-name">\${escapeHtml(ws.name)} <span style="font-size: 0.7rem; color: var(--text-muted);">(\${escapeHtml(ws.category)})</span></div>
                                                    <div class="site-domain">\${escapeHtml(ws.domain)}</div>
                                                </div>
                                                <div class="site-card-metrics">
                                                    <div class="site-metric-val" style="color: \${d.valColor};">\${escapeHtml(d.val)}</div>
                                                    <div class="site-metric-sub" style="color: \${d.subColor};">\${escapeHtml(d.sub)}</div>
                                                </div>
                                            </div>
                                            \`;
                                        }).join('') || '<div style="color: var(--text-muted); padding: 12px;">No website test data recorded.</div>'}
                                    </div>
                                \` : \`
                                    <table style="width: 100%; font-size: 0.8rem; background: var(--bg-secondary); border-radius: 6px;">
                                        <thead>
                                            <tr>
                                                <th>Endpoint</th>
                                                <th>Resolved IP</th>
                                                <th>Status</th>
                                                <th>HTTP Code</th>
                                                <th>Connect Time</th>
                                                <th>TTFB</th>
                                                <th>Total Latency</th>
                                                <th>Returned IP</th>
                                                <th>Reason</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            \${item.endpointDetails.map(ep => \`
                                                <tr>
                                                    <td class="font-mono"><strong>\${escapeHtml(ep.name)}</strong></td>
                                                    <td class="font-mono" style="color: var(--text-muted);">\${escapeHtml(ep.resolvedIp || '--')}</td>
                                                    <td>\${ep.ok ? '<span class="pill pill-pass">PASS</span>' : '<span class="pill pill-fail">FAIL</span>'}</td>
                                                    <td class="font-mono">\${ep.httpCode || '--'}</td>
                                                    <td class="font-mono">\${ep.connectTimeMs > 0 ? ep.connectTimeMs + ' ms' : '--'}</td>
                                                    <td class="font-mono">\${ep.ttfbMs > 0 ? ep.ttfbMs + ' ms' : '--'}</td>
                                                    <td class="font-mono" style="font-weight: 600; color: \${ep.ok ? 'var(--success)' : 'var(--danger)'};">\${ep.totalLatencyMs > 0 ? ep.totalLatencyMs + ' ms' : '--'}</td>
                                                    <td class="font-mono" style="color: var(--accent);">\${escapeHtml(ep.returnedIp || '--')}</td>
                                                    <td style="color: \${ep.ok ? 'var(--text-muted)' : 'var(--danger)'}; max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="\${escapeHtml(ep.reason || 'OK')}">\${escapeHtml(ep.reason || 'OK')}</td>
                                                </tr>
                                            \`).join('')}
                                        </tbody>
                                    </table>
                                \`}
                            </div>
                        </td>
                    </tr>
                    \`;
                }
            }

            tbody.innerHTML = html;
        }

        function applyFilters() {
            renderTable();
        }

        function setupSorting() {
            const headers = document.querySelectorAll('#proxy-table th[data-sort]');
            headers.forEach(header => {
                header.addEventListener('click', () => {
                    const column = header.getAttribute('data-sort');
                    if (currentSort.column === column) {
                        currentSort.asc = !currentSort.asc;
                    } else {
                        currentSort.column = column;
                        currentSort.asc = (column === 'score' || column === 'websites' || column === 'speed') ? false : true;
                    }

                    headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
                    header.classList.add(currentSort.asc ? 'sort-asc' : 'sort-desc');
                    renderTable();
                });
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            setupSorting();
            renderTable();
        });
    </script>
</body>
</html>`;
}

export function printSummary(
    stats: BenchmarkStats,
    results: Record<Protocol, ProxyItem[]>,
    enabledEndpointCount: number,
    totalEndpointCount: number,
    reportPaths: { html?: string; json?: string }
): void {
    log("========================================");
    log("                 Results");
    log("========================================");
    log("");

    for (const protocol of ["http", "https", "socks4", "socks5"] as Protocol[]) {
        log(
            `  ${protocol.toUpperCase().padEnd(7)} ` +
            `${results[protocol].length.toLocaleString()} passed`
        );
    }

    log("");
    log(`  Local Network IP: ${stats.localPublicIp || 'Direct'}`);
    log(`  Verification    : Hard-failed if 0/${enabledEndpointCount} connected`);
    log(`  Top Websites    : ${CONFIG.topWebsites?.length || 50} websites benchmarked`);
    log(`  Total tested    : ${stats.total.toLocaleString()}`);
    log(`  Passed / Alive  : ${stats.passed.toLocaleString()}`);
    log(`  Hard Failed     : ${stats.failed.toLocaleString()} (excluded from report)`);
    log(`  Duration        : ${formatDuration(stats.durationSeconds)}`);
    log("");
    log("Output files:");
    for (const filename of Object.values(CONFIG.outputFiles)) {
        log(`  ${path.join(CONFIG.outputDir, filename)}`);
    }
    log("");
    log("Benchmark Reports:");
    if (reportPaths.html) {
        log(`  ${ansi.green}HTML Report :${ansi.reset} ${reportPaths.html}`);
    }
    if (reportPaths.json) {
        log(`  ${ansi.cyan}JSON Report :${ansi.reset} ${reportPaths.json}`);
    }
    log("");
}
