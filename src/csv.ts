import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { AppConfig, CandidateFeed, Protocol, ProxyItem } from "./types.js";
import { log, ansi } from "./terminal.js";
import { resolveOneIPv4 } from "./dns.js";

const execFileAsync = promisify(execFile);

export function parseProxyFeedText(text: string, defaultProtocol?: Protocol): ProxyItem[] {
    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return [];
    }

    const firstLine = lines[0] ?? "";
    const isCsvHeader = (firstLine.includes(",") || firstLine.includes(";")) &&
        (firstLine.toLowerCase().includes("ip") || firstLine.toLowerCase().includes("protocol") || firstLine.toLowerCase().includes("port"));

    let protoIdx = -1;
    let ipIdx = -1;
    let portIdx = -1;
    let countryIdx = -1;

    if (isCsvHeader) {
        const header = firstLine.split(/[,;]/).map((h) => h.trim().toLowerCase());
        protoIdx = header.findIndex((h) => h === "protocol" || h === "protocols" || h === "proto" || h === "type");
        ipIdx = header.findIndex((h) => h === "ip" || h === "host" || h === "ip_address");
        portIdx = header.findIndex((h) => h === "port");
        countryIdx = header.findIndex((h) => h === "country" || h === "country_code" || h === "code");
    }

    const startIndex = isCsvHeader ? 1 : 0;
    const rows: ProxyItem[] = [];

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        // 1. Matches protocol://ip:port[,country,...]
        const urlMatch = line.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);
        if (urlMatch && urlMatch[1] && urlMatch[2] && urlMatch[3]) {
            const protocol = urlMatch[1].toLowerCase() as Protocol;
            const ip = urlMatch[2];
            const port = Number.parseInt(urlMatch[3], 10);
            const country = urlMatch[4] || undefined;

            if (["http", "https", "socks4", "socks5"].includes(protocol) && !Number.isNaN(port)) {
                rows.push({ protocol, ip, port, country, raw: line });
                continue;
            }
        }

        // 2. Matches bare ip:port
        const bareMatch = line.match(/^([0-9.]+):([0-9]+)$/);
        if (bareMatch && bareMatch[1] && bareMatch[2]) {
            const ip = bareMatch[1];
            const port = Number.parseInt(bareMatch[2], 10);
            if (!Number.isNaN(port)) {
                if (defaultProtocol) {
                    rows.push({ protocol: defaultProtocol, ip, port, raw: `${defaultProtocol}://${ip}:${port}` });
                } else {
                    rows.push({ protocol: "http", ip, port, raw: `http://${ip}:${port}` });
                }
                continue;
            }
        }

        // 3. Delimited CSV line
        const cols = line.split(/[,;]/).map((c) => c.trim().replace(/^["']|["']$/g, ""));
        if (cols.length >= 2) {
            const ip = ipIdx !== -1 ? cols[ipIdx] : (cols[0]?.includes(".") ? cols[0] : cols[1]);
            const portRaw = portIdx !== -1 ? cols[portIdx] : (ip === cols[0] ? cols[1] : cols[2]);
            const protoRaw = protoIdx !== -1 ? cols[protoIdx] : (ip === cols[1] ? cols[0] : (defaultProtocol || "http"));
            const country = countryIdx !== -1 ? cols[countryIdx] : undefined;

            if (!ip || !portRaw) continue;
            const port = Number.parseInt(portRaw, 10);
            if (Number.isNaN(port) || !/^[0-9.]+$/.test(ip)) continue;

            const protoTokens = (protoRaw || "http").toLowerCase().split(/[|,/]/);
            for (const token of protoTokens) {
                const protocol = token.trim() as Protocol;
                if (["http", "https", "socks4", "socks5"].includes(protocol)) {
                    rows.push({
                        protocol,
                        ip,
                        port,
                        country: country || undefined,
                        raw: `${protocol}://${ip}:${port}`,
                    });
                }
            }
        }
    }

    return rows;
}

export function parseCsv(text: string): ProxyItem[] {
    return parseProxyFeedText(text);
}

export async function fetchSingleFeed(feed: CandidateFeed, config: AppConfig): Promise<string> {
    for (const sourceUrl of feed.urls) {
        try {
            const source = new URL(sourceUrl);
            const resolvedIp = await resolveOneIPv4(
                source.hostname,
                config.cloudflareDns,
                config.endpointRetries
            );

            const args = [
                "--ipv4",
                "--silent",
                "--show-error",
                "--fail",
                "--connect-timeout", "6",
                "--max-time", "20",
                "-A", "Mozilla/5.0 ProxyBenchmarker",
            ];

            if (resolvedIp) {
                args.push("--resolve", `${source.hostname}:443:${resolvedIp}`);
            }
            args.push(sourceUrl);

            const { stdout } = await execFileAsync("curl", args, {
                timeout: 25_000,
                maxBuffer: 8 * 1024 * 1024,
                windowsHide: true,
            });

            if (stdout && stdout.length > 30) {
                return stdout;
            }
        } catch {
            // Try next URL fallback
        }
    }

    throw new Error(`Failed to fetch feed ${feed.name} from all mirrors`);
}

export async function downloadAllFeeds(config: AppConfig): Promise<{
    proxies: ProxyItem[];
    feedStats: Array<{ name: string; count: number; status: "OK" | "FAIL" }>;
    totalDiscovered: number;
}> {
    const feeds = config.feeds;
    log(`Fetching candidate routes from ${feeds.length} upstream feeds...\n`);

    const feedStats: Array<{ name: string; count: number; status: "OK" | "FAIL" }> = [];
    const seen = new Set<string>();
    const deduplicatedProxies: ProxyItem[] = [];
    let totalDiscovered = 0;

    for (const feed of feeds) {
        try {
            const content = await fetchSingleFeed(feed, config);
            const parsed = parseProxyFeedText(content, feed.defaultProtocol);
            totalDiscovered += parsed.length;

            let addedCount = 0;
            for (const item of parsed) {
                const key = `${item.protocol}://${item.ip}:${item.port}`;
                if (!seen.has(key)) {
                    seen.add(key);
                    deduplicatedProxies.push(item);
                    addedCount++;
                }
            }

            feedStats.push({ name: feed.name, count: parsed.length, status: "OK" });
            log(`  ${ansi.green}[OK]${ansi.reset} ${feed.name.padEnd(30)} ${parsed.length.toLocaleString().padStart(6)} routes (+${addedCount.toLocaleString()} new)`);
        } catch {
            feedStats.push({ name: feed.name, count: 0, status: "FAIL" });
            log(`  ${ansi.yellow}[WARN]${ansi.reset} ${feed.name.padEnd(30)} Fetch failed (skipped)`);
        }
    }

    log(`\n${ansi.bold}Discovered ${totalDiscovered.toLocaleString()} candidate entries across ${feeds.length} feeds${ansi.reset}`);
    log(`${ansi.bold}${ansi.cyan}Deduplicated into ${deduplicatedProxies.length.toLocaleString()} unique routes via Set key normalization${ansi.reset}\n`);

    return {
        proxies: deduplicatedProxies,
        feedStats,
        totalDiscovered,
    };
}

export async function downloadCsv(urls: string[], config: AppConfig): Promise<string> {
    const defaultFeed: CandidateFeed = {
        name: "default",
        urls,
    };
    return fetchSingleFeed(defaultFeed, config);
}
