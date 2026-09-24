import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { AppConfig, ProxyItem, Protocol } from "./types.js";
import { log, ansi } from "./terminal.js";
import { resolveOneIPv4 } from "./dns.js";

const execFileAsync = promisify(execFile);

export function parseCsv(text: string): ProxyItem[] {
    const lines = text
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean);

    if (lines.length === 0) {
        return [];
    }

    const firstLine = lines[0] ?? "";
    const hasHeader = firstLine.toLowerCase().includes("protocol") && firstLine.toLowerCase().includes("ip");
    const startIndex = hasHeader ? 1 : 0;

    let protoIdx = -1;
    let ipIdx = -1;
    let portIdx = -1;
    let countryIdx = -1;

    if (hasHeader) {
        const header = firstLine.split(",").map((h) => h.trim().toLowerCase());
        protoIdx = header.indexOf("protocol");
        ipIdx = header.indexOf("ip");
        portIdx = header.indexOf("port");
        countryIdx = header.indexOf("country");
    }

    const rows: ProxyItem[] = [];

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i];
        if (!line) continue;

        // Check if format is URL-like: protocol://ip:port[,country,...]
        const urlMatch = line.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);
        if (urlMatch && urlMatch[1] && urlMatch[2] && urlMatch[3]) {
            const protocol = urlMatch[1].toLowerCase() as Protocol;
            const ip = urlMatch[2];
            const port = Number.parseInt(urlMatch[3], 10);
            const country = urlMatch[4] || undefined;

            if (["http", "https", "socks4", "socks5"].includes(protocol) && !Number.isNaN(port)) {
                rows.push({
                    protocol,
                    ip,
                    port,
                    country,
                    raw: line,
                });
                continue;
            }
        }

        const cols = line.split(",").map((c) => c.trim());

        if (cols.length >= 3) {
            const protocolRaw = protoIdx !== -1 ? cols[protoIdx] : cols[0];
            const ip = ipIdx !== -1 ? cols[ipIdx] : cols[1];
            const portRaw = portIdx !== -1 ? cols[portIdx] : cols[2];
            const country = countryIdx !== -1 ? cols[countryIdx] : cols[3] || "";

            if (!protocolRaw || !ip || !portRaw) continue;

            const protocol = protocolRaw.toLowerCase() as Protocol;
            const port = Number.parseInt(portRaw, 10);

            if (["http", "https", "socks4", "socks5"].includes(protocol) && !Number.isNaN(port)) {
                rows.push({
                    protocol,
                    ip,
                    port,
                    country: country || undefined,
                    raw: line,
                });
            }
        }
    }

    return rows;
}

export async function downloadCsv(urls: string[], config: AppConfig): Promise<string> {
    log("Downloading latest proxy list from proxifly/free-proxy-list...");

    for (const sourceUrl of urls) {
        const source = new URL(sourceUrl);
        const resolvedIp = await resolveOneIPv4(
            source.hostname,
            config.cloudflareDns,
            config.endpointRetries
        );

        if (!resolvedIp) {
            log(`  ${ansi.yellow}[WARN]${ansi.reset} ${source.hostname}: DNS resolution failed`);
            continue;
        }

        log(`  Trying ${source.hostname} (${resolvedIp})...`);

        const args = [
            "--ipv4",
            "--silent",
            "--show-error",
            "--fail",
            "--connect-timeout", "10",
            "--max-time", "30",
            "--resolve", `${source.hostname}:443:${resolvedIp}`,
            "-A", "Mozilla/5.0 ProxyBenchmarker",
            sourceUrl,
        ];

        try {
            const { stdout } = await execFileAsync("curl", args, {
                timeout: 35_000,
                maxBuffer: 4 * 1024 * 1024,
                windowsHide: true,
            });

            if (stdout.length < 50 || (!stdout.includes("://") && !stdout.includes(",") && !stdout.includes(":"))) {
                log(`  ${ansi.red}[FAIL]${ansi.reset} Response does not look like proxy list`);
                continue;
            }

            log(`  ${ansi.green}[OK]${ansi.reset} Downloaded ${Math.round(stdout.length / 1024)} KB`);
            return stdout;
        } catch (error: any) {
            log(`  ${ansi.red}[FAIL]${ansi.reset} ${error.stderr?.trim() || error.message || "download failed"}`);
        }
    }

    throw new Error("Unable to download proxy list CSV from any source.");
}
