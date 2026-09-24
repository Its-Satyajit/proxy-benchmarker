import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { log, ansi } from "./terminal.mjs";
import { resolveOneIPv4 } from "./dns.mjs";

const execFileAsync = promisify(execFile);

export function parseCsvLine(line) {
    const fields = [];
    let current = "";
    let quoted = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            if (quoted && line[i + 1] === '"') {
                current += '"';
                i++;
            } else {
                quoted = !quoted;
            }
            continue;
        }

        if (char === "," && !quoted) {
            fields.push(current);
            current = "";
            continue;
        }

        current += char;
    }

    fields.push(current);
    return fields;
}

export function parseCsv(csv) {
    const lines = csv.split(/\r?\n/);
    if (lines.length === 0) {
        return [];
    }

    const headers = parseCsvLine(lines[0]).map((header) =>
        header.trim().replace(/^\uFEFF/, "").toLowerCase()
    );

    const rows = [];
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) {
            continue;
        }

        const values = parseCsvLine(lines[i]);
        const row = {};

        for (let j = 0; j < headers.length; j++) {
            row[headers[j]] = values[j]?.trim() ?? "";
        }

        rows.push(row);
    }

    return rows;
}

export async function downloadCsv(urls, config) {
    log(`${ansi.cyan}Downloading latest ProxyScrape list...${ansi.reset}`);

    for (const sourceUrl of urls) {
        const source = new URL(sourceUrl);
        const resolvedIp = await resolveOneIPv4(
            source.hostname,
            config.cloudflareDns,
            config.endpointRetries
        );

        if (!resolvedIp) {
            log(`  ${ansi.yellow}⚠${ansi.reset} ${source.hostname}: DNS resolution failed`);
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
            "-A", "Mozilla/5.0 ProxyScrapeTester",
            sourceUrl,
        ];

        try {
            const { stdout } = await execFileAsync("curl", args, {
                timeout: 35_000,
                maxBuffer: 4 * 1024 * 1024,
                windowsHide: true,
            });

            if (!stdout.includes("protocol") || !stdout.includes("ip")) {
                log(`  ${ansi.red}✗${ansi.reset} Response does not look like ProxyScrape CSV`);
                continue;
            }

            log(`  ${ansi.green}✓${ansi.reset} Downloaded ${Math.round(stdout.length / 1024)} KB`);
            return stdout;
        } catch (error) {
            log(`  ${ansi.red}✗${ansi.reset} ${error.stderr?.trim() || error.message || "download failed"}`);
        }
    }

    throw new Error("Unable to download ProxyScrape CSV from any source.");
}
