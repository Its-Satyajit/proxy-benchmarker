// Flat telemetry dashboard CSS styles (No Cards, Virtual Scrolling)

export function getReportStyles(): string {
    return `
        :root {
            --bg-primary: #090d16;
            --bg-secondary: #0f172a;
            --bg-tertiary: #162036;
            --bg-hover: #1e293b;
            --border: #1e293b;
            --border-light: #334155;
            --border-accent: #38bdf8;
            --text-primary: #f8fafc;
            --text-secondary: #94a3b8;
            --text-muted: #64748b;
            --accent: #38bdf8;
            --accent-hover: #0ea5e9;
            --success: #22c55e;
            --success-bg: rgba(34, 197, 94, 0.12);
            --warning: #eab308;
            --warning-bg: rgba(234, 179, 8, 0.12);
            --danger: #ef4444;
            --danger-bg: rgba(239, 68, 68, 0.12);
            --font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            background-color: var(--bg-primary);
            color: var(--text-primary);
            font-family: var(--font);
            line-height: 1.45;
            padding: 18px 24px;
        }

        .container { max-width: 1680px; margin: 0 auto; }

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
            padding-bottom: 16px;
            border-bottom: 1px solid var(--border);
            margin-bottom: 16px;
            flex-wrap: wrap;
            gap: 12px;
        }

        .title-group h1 {
            font-size: 1.5rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .title-group p {
            color: var(--text-secondary);
            font-size: 0.8rem;
            margin-top: 2px;
        }

        .badge-pulse {
            display: inline-block;
            width: 8px;
            height: 8px;
            background-color: var(--success);
            border-radius: 50%;
            box-shadow: 0 0 8px var(--success);
        }

        /* Telemetry Overview Strip (Flat HUD) */
        .telemetry-strip {
            background: var(--bg-secondary);
            border: 1px solid var(--border);
            display: grid;
            grid-template-columns: 1.2fr 2fr;
            margin-bottom: 16px;
            border-radius: 4px;
        }

        @media (max-width: 1100px) {
            .telemetry-strip { grid-template-columns: 1fr; }
        }

        .telemetry-lead {
            padding: 14px 18px;
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 8px;
            background: linear-gradient(90deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%);
        }

        @media (max-width: 1100px) {
            .telemetry-lead { border-right: none; border-bottom: 1px solid var(--border); }
        }

        .telemetry-lead-badge {
            font-size: 0.7rem;
            font-weight: 700;
            color: var(--accent);
            letter-spacing: 0.05em;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .telemetry-lead-addr {
            font-size: 1.2rem;
            font-weight: 700;
            color: #ffffff;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .telemetry-lead-meta {
            color: var(--text-secondary);
            font-size: 0.75rem;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        }

        .telemetry-lead-metrics {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-top: 4px;
            flex-wrap: wrap;
        }

        .metric-item {
            display: flex;
            flex-direction: column;
        }

        .metric-lbl {
            font-size: 0.68rem;
            color: var(--text-muted);
            text-transform: uppercase;
            font-weight: 600;
            letter-spacing: 0.04em;
        }

        .metric-val {
            font-size: 1.1rem;
            font-weight: 700;
            line-height: 1.2;
        }

        .metric-sub {
            font-size: 0.7rem;
            color: var(--text-muted);
        }

        .telemetry-metrics-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
        }

        @media (max-width: 900px) {
            .telemetry-metrics-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .metric-box {
            padding: 12px 16px;
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 3px;
        }
        .metric-box:last-child { border-right: none; }

        .proto-strip {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            font-size: 0.72rem;
            color: var(--text-secondary);
        }
        .proto-strip span {
            background: var(--bg-primary);
            padding: 1px 5px;
            border-radius: 3px;
            border: 1px solid var(--border);
        }

        .weights-panel {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 14px 18px;
            margin-bottom: 16px;
            display: none;
        }
        .weights-panel.open { display: block; }

        .weights-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 12px;
            margin-top: 10px;
        }

        .weight-item {
            background-color: var(--bg-primary);
            padding: 8px 12px;
            border-radius: 4px;
            border: 1px solid var(--border);
        }

        .weight-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 4px;
        }

        .weight-slider {
            width: 100%;
            cursor: pointer;
            accent-color: var(--accent);
        }

        .controls {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            padding: 10px 16px;
            margin-bottom: 16px;
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            align-items: center;
            justify-content: space-between;
        }

        .filter-group {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
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
            padding: 6px 12px 6px 30px;
            border-radius: 4px;
            font-size: 0.8rem;
            width: 250px;
            outline: none;
            transition: border-color 0.15s;
        }
        .search-input:focus { border-color: var(--accent); }

        select.filter-select {
            background-color: var(--bg-primary);
            border: 1px solid var(--border);
            color: var(--text-primary);
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 0.8rem;
            outline: none;
            cursor: pointer;
        }

        .btn {
            background-color: var(--bg-tertiary);
            color: var(--text-primary);
            border: 1px solid var(--border-light);
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.8rem;
            cursor: pointer;
            font-weight: 500;
            transition: background-color 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .btn:hover { background-color: var(--bg-hover); }

        .btn-primary {
            background-color: var(--accent);
            color: #0b0f19;
            border-color: var(--accent);
            font-weight: 600;
        }
        .btn-primary:hover { background-color: var(--accent-hover); }

        .btn-highlight {
            background-color: rgba(234, 179, 8, 0.12);
            color: var(--warning);
            border-color: rgba(234, 179, 8, 0.3);
            font-weight: 600;
        }
        .btn-highlight:hover { background-color: rgba(234, 179, 8, 0.2); }

        /* Virtual Scrolling Container */
        .table-scroll-container {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-radius: 4px;
            height: calc(100vh - 290px);
            min-height: 480px;
            overflow-y: auto;
            overflow-x: auto;
            position: relative;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.8rem;
            text-align: left;
            table-layout: fixed;
        }

        thead {
            position: sticky;
            top: 0;
            z-index: 20;
            background-color: #0b1222;
        }

        th {
            padding: 10px 12px;
            color: var(--text-secondary);
            font-weight: 600;
            font-size: 0.72rem;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            border-bottom: 2px solid var(--border);
            border-right: 1px solid rgba(255, 255, 255, 0.03);
            cursor: pointer;
            user-select: none;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            background-color: #0b1222;
        }

        th:hover { color: var(--text-primary); background-color: var(--bg-hover); }
        th.sort-asc::after { content: " \\25B2"; color: var(--accent); font-size: 0.65rem; }
        th.sort-desc::after { content: " \\25BC"; color: var(--accent); font-size: 0.65rem; }

        td {
            padding: 9px 12px;
            border-bottom: 1px solid var(--border);
            border-right: 1px solid rgba(255, 255, 255, 0.02);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        tbody tr { height: 41px; }
        tbody tr:hover { background-color: var(--bg-hover); }

        .row-expanded { background-color: rgba(56, 189, 248, 0.04) !important; }

        .details-row td {
            padding: 0;
            background-color: #080d1a;
            border-bottom: 2px solid var(--accent);
            white-space: normal;
        }

        .details-container {
            padding: 14px 18px;
        }

        .tab-nav {
            display: flex;
            gap: 6px;
            margin-bottom: 12px;
            border-bottom: 1px solid var(--border);
            padding-bottom: 6px;
        }

        .tab-btn {
            background: none;
            border: none;
            color: var(--text-secondary);
            padding: 4px 10px;
            font-size: 0.78rem;
            font-weight: 600;
            cursor: pointer;
            border-radius: 3px;
            transition: all 0.15s;
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }
        .tab-btn.active {
            background-color: rgba(56, 189, 248, 0.12);
            color: var(--accent);
        }

        /* High Density Websites Grid (Flat items, no cards) */
        .grid-websites {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 6px;
        }

        .site-item {
            background-color: var(--bg-secondary);
            border: 1px solid var(--border);
            border-left-width: 3px;
            padding: 6px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
            min-width: 0;
            border-radius: 2px;
        }
        .site-item:hover { background-color: var(--bg-tertiary); }

        .site-info {
            min-width: 0;
            flex: 1 1 auto;
            overflow: hidden;
        }

        .site-name {
            font-weight: 600;
            font-size: 0.78rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .site-domain {
            font-size: 0.68rem;
            color: var(--text-muted);
            font-family: var(--font-mono);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .site-metrics {
            flex-shrink: 0;
            text-align: right;
        }

        .site-metric-val {
            font-family: var(--font-mono);
            font-size: 0.78rem;
            font-weight: 700;
        }

        .site-metric-sub {
            font-size: 0.68rem;
            font-family: var(--font-mono);
        }

        .font-mono { font-family: var(--font-mono); }

        .pill {
            display: inline-flex;
            align-items: center;
            padding: 1px 6px;
            border-radius: 3px;
            font-size: 0.7rem;
            font-weight: 600;
            text-transform: uppercase;
        }

        .pill-pass { background-color: var(--success-bg); color: var(--success); border: 1px solid rgba(34, 197, 94, 0.3); }
        .pill-fail { background-color: var(--danger-bg); color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3); }
        .pill-protocol { background-color: rgba(56, 189, 248, 0.1); color: var(--accent); font-family: var(--font-mono); font-size: 0.7rem; }

        .rank-pill {
            color: var(--warning);
            font-weight: 700;
            font-family: var(--font-mono);
            font-size: 0.75rem;
        }

        .score-pill {
            font-weight: 700;
            font-size: 0.8rem;
            font-family: var(--font-mono);
            padding: 1px 6px;
            border-radius: 3px;
            cursor: pointer;
        }
        .score-high { background-color: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .score-med { background-color: rgba(234, 179, 8, 0.15); color: #facc15; }
        .score-low { background-color: rgba(239, 68, 68, 0.15); color: #f87171; }

        .latency-badge { font-family: var(--font-mono); font-weight: 600; }
        .latency-fast { color: #4ade80; }
        .latency-med { color: #facc15; }
        .latency-slow { color: #fb923c; }
        .latency-none { color: var(--text-muted); }

        .copy-btn {
            background: none;
            border: 1px solid var(--border-light);
            color: var(--text-secondary);
            cursor: pointer;
            padding: 2px 6px;
            border-radius: 3px;
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
            width: 14px;
            height: 14px;
        }

        .footer-note {
            text-align: center;
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-top: 14px;
        }

        .toast {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--accent);
            color: #0b0f19;
            padding: 8px 14px;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.8rem;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            opacity: 0;
            pointer-events: none;
            transform: translateY(8px);
            transition: all 0.2s ease;
            z-index: 1000;
        }
        .toast.show { opacity: 1; transform: translateY(0); }
    `;
}
