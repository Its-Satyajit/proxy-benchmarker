// Client-side script bundle for interactive virtual scrolling, filtering, sorting, and telemetry calculations

export function getClientScript(reportJsonString: string, svgIconsJson: string): string {
    return `
        const RAW_DATA = ${reportJsonString};
        let benchmarks = RAW_DATA.benchmarks || [];
        let currentSort = { column: 'score', asc: false };
        let expandedRows = new Set();
        let currentSubTabs = {};

        const SVG_ICONS = ${svgIconsJson};

        // Virtual scroll state
        const ROW_HEIGHT = 41;
        const BUFFER_ROWS = 12;
        let filteredAndSortedData = [];
        let itemPositions = [];
        let itemHeights = [];
        let totalContentHeight = 0;
        let isScrollPending = false;

        // Active Scoring Weights (defaults mirror the server-side composite score)
        let weights = {
            websites: 50,
            avgLatency: 20,
            minLatency: 8,
            connectTime: 8,
            ttfb: 7,
            speed: 7,
        };

        function toggleWeightsPanel() {
            const panel = document.getElementById('weights-panel');
            panel.classList.toggle('open');
        }

        function resetDefaultWeights() {
            weights = { websites: 50, avgLatency: 20, minLatency: 8, connectTime: 8, ttfb: 7, speed: 7 };
            document.getElementById('w-websites').value = 50;
            document.getElementById('w-avgLatency').value = 20;
            document.getElementById('w-minLatency').value = 8;
            document.getElementById('w-connectTime').value = 8;
            document.getElementById('w-ttfb').value = 7;
            document.getElementById('w-speed').value = 7;
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
        }

        // Maximum points per component, identical to SCORE_WEIGHTS in src/metrics.ts
        const SCORE_MAX = { websites: 50, avgLatency: 20, minLatency: 8, connectTime: 8, ttfb: 7, speed: 7 };

        function rawScoreComponents(item) {
            const usable = item.websitesAvailable > 0 ? (item.websitesPassed / item.websitesAvailable) : 1;
            const ratio = Math.max(0, Math.min(1, usable));
            const clamp = (value, max) => Math.max(0, Math.min(max, value));

            // Performance components are gated by website reachability, exactly
            // like scoreCandidate() in src/metrics.ts.
            return {
                websites: ratio * SCORE_MAX.websites,
                avgLatency: clamp(SCORE_MAX.avgLatency * (1 - (item.avgLatencyMs / 2500)), SCORE_MAX.avgLatency) * ratio,
                minLatency: clamp(SCORE_MAX.minLatency * (1 - (item.minLatencyMs / 1500)), SCORE_MAX.minLatency) * ratio,
                connectTime: clamp(SCORE_MAX.connectTime * (1 - (item.avgConnectTimeMs / 800)), SCORE_MAX.connectTime) * ratio,
                ttfb: clamp(SCORE_MAX.ttfb * (1 - (item.avgTtfbMs / 1500)), SCORE_MAX.ttfb) * ratio,
                speed: clamp((item.avgSpeedBps / (500 * 1024)) * SCORE_MAX.speed, SCORE_MAX.speed) * ratio
            };
        }

        function computeWeightedScore(item) {
            const raw = rawScoreComponents(item);
            const weightTotal = Object.keys(SCORE_MAX).reduce((sum, key) => sum + (weights[key] || 0), 0);
            if (weightTotal <= 0) {
                return { totalScore: 0, breakdown: { websites: 0, avgLatency: 0, minLatency: 0, connectTime: 0, ttfb: 0, speed: 0 } };
            }

            const breakdown = {};
            let total = 0;
            Object.keys(SCORE_MAX).forEach(key => {
                // Raw component points are already gated by website reachability.
                const weighted = (raw[key] / SCORE_MAX[key]) * weights[key];
                total += weighted;
                breakdown[key] = Math.round(weighted);
            });

            return { totalScore: Math.round((total * 100) / weightTotal), breakdown };
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

            updateHeroSummary();
            onFilterChange();
        }

        function updateHeroSummary() {
            const best = benchmarks[0];
            if (!best) return;
            const heroUrl = document.getElementById('hero-proxy-url');
            const heroMeta = document.getElementById('hero-proxy-meta');
            const heroScore = document.getElementById('hero-score');
            const heroLatency = document.getElementById('hero-latency');
            const heroConnect = document.getElementById('hero-connect');
            const heroCopyBtn = document.getElementById('hero-copy-btn');

            if (heroUrl) heroUrl.textContent = \`\${best.proxy.protocol.toUpperCase()}://\${best.proxy.ip}:\${best.proxy.port}\`;
            if (heroMeta) heroMeta.innerHTML = \`<span>\${best.proxy.country || 'Global'}</span> &bull; <span>\${best.egressStatus}</span> &bull; <span>\${best.websitesPassed}/\${best.websitesAttempted} targets probed (\${best.websitesPassed}/\${best.websitesAvailable} reachable)</span>\`;
            if (heroScore) heroScore.textContent = best.compositeScore;
            if (heroLatency) heroLatency.textContent = \`\${best.avgLatencyMs} ms\`;
            if (heroConnect) heroConnect.textContent = \`\${best.avgConnectTimeMs} ms\`;
            if (heroCopyBtn) heroCopyBtn.setAttribute('onclick', \`copyToClipboard('\${best.proxy.protocol}://\${best.proxy.ip}:\${best.proxy.port}')\`);
        }

        function showToast(msg) {
            const toast = document.getElementById('toast');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 2000);
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
            showToast(\`Copied Top \${top10.length} URLs\`);
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
            showToast(\`Copied \${passed.length} verified URLs\`);
        }

        function exportFilteredCsv() {
            const filtered = filteredAndSortedData;
            if (filtered.length === 0) {
                showToast('No rows to export');
                return;
            }
            const headers = ['Rank', 'Score', 'Protocol', 'IP', 'Port', 'Country', 'Status', 'EgressIP', 'EgressProbesStarted', 'EgressProbesPassed', 'WebsitesAvailable', 'WebsitesAttempted', 'WebsitesPassed', 'WebPassRate%', 'PerfSource', 'AvgLatency_ms', 'MinLatency_ms', 'ConnectTime_ms', 'TTFB_ms', 'Speed_Bps', 'ProxyUrl'];
            const rows = filtered.map(b => [
                b.rank || '',
                b.compositeScore || 0,
                b.proxy.protocol,
                b.proxy.ip,
                b.proxy.port,
                b.proxy.country || '',
                b.status,
                b.egressStatus || 'UNKNOWN',
                b.endpointsStarted || 0,
                b.endpointsPassed || 0,
                b.websitesAvailable || 0,
                b.websitesAttempted || 0,
                b.websitesPassed || 0,
                b.websitePassRatePercent || 0,
                b.performanceSource || '',
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
            link.setAttribute('download', \`proxy-telemetry-\${Date.now()}.csv\`);
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
                else if (ws.httpCode === 429) sub = 'Rate Limit';
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
                    case 'egress':
                        vA = a.egressStatus || '';
                        vB = b.egressStatus || '';
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

        function getItemHeight(item) {
            const p = item.proxy;
            const pKey = \`\${p.protocol}_\${p.ip}_\${p.port}\`;
            if (!expandedRows.has(pKey)) {
                return ROW_HEIGHT;
            }
            const activeTab = currentSubTabs[pKey] || 'websites';
            if (activeTab === 'websites') {
                const count = (item.websiteDetails || []).length || 50;
                const rows = Math.ceil(count / 4);
                return ROW_HEIGHT + 44 + (rows * 38) + 20;
            } else {
                const count = (item.endpointDetails || []).length || 11;
                return ROW_HEIGHT + 44 + (count * 30) + 38;
            }
        }

        function computePositions() {
            itemPositions = new Array(filteredAndSortedData.length);
            itemHeights = new Array(filteredAndSortedData.length);
            let currentY = 0;
            for (let i = 0; i < filteredAndSortedData.length; i++) {
                itemPositions[i] = currentY;
                const h = getItemHeight(filteredAndSortedData[i]);
                itemHeights[i] = h;
                currentY += h;
            }
            totalContentHeight = currentY;
        }

        function findStartIndex(scrollTop) {
            let low = 0, high = itemPositions.length - 1;
            let index = 0;
            while (low <= high) {
                const mid = (low + high) >> 1;
                if (itemPositions[mid] <= scrollTop) {
                    index = mid;
                    low = mid + 1;
                } else {
                    high = mid - 1;
                }
            }
            return Math.max(0, index - BUFFER_ROWS);
        }

        function findEndIndex(scrollBottom) {
            let low = 0, high = itemPositions.length - 1;
            let index = itemPositions.length - 1;
            while (low <= high) {
                const mid = (low + high) >> 1;
                if (itemPositions[mid] >= scrollBottom) {
                    index = mid;
                    high = mid - 1;
                } else {
                    low = mid + 1;
                }
            }
            return Math.min(itemPositions.length, index + 1 + BUFFER_ROWS);
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
            computePositions();
            renderVirtualRows();
        }

        function switchSubTab(proxyKey, tabName) {
            currentSubTabs[proxyKey] = tabName;
            computePositions();
            renderVirtualRows();
        }

        function renderRowHtml(item) {
            const p = item.proxy;
            const pKey = \`\${p.protocol}_\${p.ip}_\${p.port}\`;
            const isExpanded = expandedRows.has(pKey);
            const fullUrl = \`\${p.protocol}://\${p.ip}:\${p.port}\`;
            const activeTab = currentSubTabs[pKey] || 'websites';

            const bd = item.scoreBreakdown || {};
            const tooltipText = \`Websites: \${bd.websites || 0} pts | Avg Lat: \${bd.avgLatency || 0} pts | Min Lat: \${bd.minLatency || 0} pts | Connect: \${bd.connectTime || 0} pts | TTFB: \${bd.ttfb || 0} pts | Speed: \${bd.speed || 0} pts\`;

            const latencyClass = getLatencyClass(item.avgLatencyMs, item.status);
            const statusPill = item.status === 'PASS' 
                ? '<span class="pill pill-pass">PASS</span>'
                : '<span class="pill pill-fail">FAIL</span>';

            let out = \`
            <tr class="\${isExpanded ? 'row-expanded' : ''}">
                <td style="text-align: center;">
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
                <td style="font-size: 0.72rem;">\${item.egressStatus || '--'}</td>
                <td class="font-mono">
                    \${item.websitesPassed}/\${item.websitesAttempted} probed, \${item.websitesPassed}/\${item.websitesAvailable} ok (\${item.websitePassRatePercent}%)
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
                out += \`
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
                                        <div class="site-item" style="border-left-color: \${ws.ok ? 'var(--success)' : 'var(--danger)'};" title="\${escapeHtml(d.title)}">
                                            <div class="site-info">
                                                <div class="site-name">\${escapeHtml(ws.name)}</div>
                                                <div class="site-domain">\${escapeHtml(ws.domain)}</div>
                                            </div>
                                            <div class="site-metrics">
                                                <div class="site-metric-val" style="color: \${d.valColor};">\${escapeHtml(d.val)}</div>
                                                <div class="site-metric-sub" style="color: \${d.subColor};">\${escapeHtml(d.sub)}</div>
                                            </div>
                                        </div>
                                        \`;
                                    }).join('') || '<div style="color: var(--text-muted); padding: 8px;">No website test data recorded.</div>'}
                                </div>
                            \` : \`
                                <table style="width: 100%; font-size: 0.75rem; background: var(--bg-secondary);">
                                    <thead>
                                        <tr>
                                            <th>Endpoint</th>
                                            <th>Resolved IP</th>
                                            <th>Status</th>
                                            <th>HTTP Code</th>
                                            <th>Connect</th>
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

            return out;
        }

        function renderVirtualRows() {
            const container = document.getElementById('table-scroll-container');
            const tbody = document.getElementById('table-body');
            const countLabel = document.getElementById('filtered-count');

            countLabel.textContent = \`Showing \${filteredAndSortedData.length.toLocaleString()} / \${benchmarks.length.toLocaleString()} verified\`;

            if (filteredAndSortedData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="15" style="text-align: center; padding: 40px; color: var(--text-muted);">No proxies match the selected filters.</td></tr>';
                return;
            }

            const scrollTop = container.scrollTop;
            const clientHeight = container.clientHeight;
            const scrollBottom = scrollTop + clientHeight;

            const startIndex = findStartIndex(scrollTop);
            const endIndex = findEndIndex(scrollBottom);

            const topSpacerHeight = itemPositions[startIndex] || 0;
            const endPos = endIndex < itemPositions.length ? itemPositions[endIndex] : totalContentHeight;
            const bottomSpacerHeight = Math.max(0, totalContentHeight - endPos);

            let html = '';

            if (topSpacerHeight > 0) {
                html += \`<tr style="height: \${topSpacerHeight}px; border: none;"><td colspan="15" style="padding: 0; border: none; height: \${topSpacerHeight}px;"></td></tr>\`;
            }

            for (let i = startIndex; i < endIndex; i++) {
                html += renderRowHtml(filteredAndSortedData[i]);
            }

            if (bottomSpacerHeight > 0) {
                html += \`<tr style="height: \${bottomSpacerHeight}px; border: none;"><td colspan="15" style="padding: 0; border: none; height: \${bottomSpacerHeight}px;"></td></tr>\`;
            }

            tbody.innerHTML = html;
        }

        function onFilterChange() {
            const filtered = getFilteredData();
            filteredAndSortedData = sortData(filtered);
            computePositions();
            renderVirtualRows();
        }

        function setupVirtualScroll() {
            const container = document.getElementById('table-scroll-container');
            container.addEventListener('scroll', () => {
                if (!isScrollPending) {
                    requestAnimationFrame(() => {
                        renderVirtualRows();
                        isScrollPending = false;
                    });
                    isScrollPending = true;
                }
            }, { passive: true });

            window.addEventListener('resize', () => {
                computePositions();
                renderVirtualRows();
            });
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
                    onFilterChange();
                });
            });
        }

        window.addEventListener('DOMContentLoaded', () => {
            setupSorting();
            setupVirtualScroll();
            onFilterChange();
        });
    `;
}
