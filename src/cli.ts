import fs from "node:fs/promises";
import type { PresetName, ProxyItem } from "./types.js";
import { candidateLimit, parsePresetName, positiveInt } from "./limits.js";
import { parseCsv } from "./csv.js";
import { parseProxyString } from "./proxy.js";
import { log } from "./terminal.js";

export interface CliOptions {
    customProxies: ProxyItem[];
    limit?: number;
    concurrency?: number;
    tcpConcurrency?: number;
    websiteWorkers?: number;
    websiteConcurrency?: number;
    maxCurlProcesses?: number;
    preset?: PresetName;
    strictTls?: boolean;
    showHelp?: boolean;
}

/** Rejects NaN/0/negative input up front instead of letting a stage clamp it. */
export function requireInt(raw: string | undefined, flag: string, allowZero = false): number {
    if (raw === undefined || raw.trim() === "") {
        throw new Error(`${flag} requires a value`);
    }
    const value = Number(raw.trim());
    if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1)) {
        throw new Error(`${flag} must be an integer >= ${allowZero ? 0 : 1} (got "${raw}")`);
    }
    return value;
}

/** Rejects NaN/0/negative input up front instead of letting a stage clamp it. */
export function requirePositiveInt(raw: string | undefined, flag: string): number {
    return positiveInt(requireInt(raw, flag), flag);
}

const VALUE_FLAGS = new Set([
    "-n",
    "--limit",
    "-c",
    "--concurrency",
    "--tcp-concurrency",
    "--website-workers",
    "--max-curl"
]);

const BOOLEAN_FLAGS = new Set(["-h", "--help", "--safe", "--home", "--turbo", "--strict-tls"]);

function assertKnownFlag(arg: string): void {
    if (BOOLEAN_FLAGS.has(arg) || VALUE_FLAGS.has(arg)) return;
    if (/^--(limit|concurrency|tcp-concurrency|website-workers|max-curl|preset)=/.test(arg)) return;
    throw new Error(`Unknown option: ${arg} (run with --help to see supported options)`);
}

export async function parseCliArgs(rawArgs: string[]): Promise<CliOptions> {
    const customProxies: ProxyItem[] = [];
    const options: CliOptions = { customProxies, showHelp: false };
    let positionalOnly = false;

    for (let i = 0; i < rawArgs.length; i++) {
        const arg = rawArgs[i];

        if (positionalOnly || !arg.startsWith("-") || arg === "-") {
            // Check if argument is a local file
            try {
                const stat = await fs.stat(arg);
                if (stat.isFile()) {
                    customProxies.push(...parseCsv(await fs.readFile(arg, "utf8")));
                    continue;
                }
            } catch {
                // Not a file, try parsing as proxy string
            }

            const parsed = parseProxyString(arg);
            if (parsed.length > 0) {
                customProxies.push(...parsed);
            }
            continue;
        }

        if (arg === "--") {
            positionalOnly = true;
            continue;
        }

        assertKnownFlag(arg);

        if (arg === "-h" || arg === "--help") {
            options.showHelp = true;
            continue;
        }
        if (arg === "--safe") {
            options.preset = "safe";
            continue;
        }
        if (arg === "--home") {
            options.preset = "home";
            continue;
        }
        if (arg === "--turbo") {
            options.preset = "turbo";
            continue;
        }
        if (arg === "--strict-tls") {
            options.strictTls = true;
            continue;
        }
        if (arg === "-n" || arg === "--limit") {
            options.limit = candidateLimit(requireInt(rawArgs[++i], "--limit", true), "--limit");
            continue;
        }
        if (arg === "-c" || arg === "--concurrency") {
            options.concurrency = requirePositiveInt(rawArgs[++i], "--concurrency");
            continue;
        }
        if (arg === "--tcp-concurrency") {
            options.tcpConcurrency = requirePositiveInt(rawArgs[++i], "--tcp-concurrency");
            continue;
        }
        if (arg === "--website-workers") {
            options.websiteWorkers = requirePositiveInt(rawArgs[++i], "--website-workers");
            continue;
        }
        if (arg === "--max-curl") {
            options.maxCurlProcesses = requirePositiveInt(rawArgs[++i], "--max-curl");
            continue;
        }
        if (arg.startsWith("--preset=")) {
            options.preset = parsePresetName(arg.split("=")[1], "--preset");
            continue;
        }
        if (arg.startsWith("--limit=")) {
            options.limit = candidateLimit(requireInt(arg.split("=")[1], "--limit", true), "--limit");
            continue;
        }
        if (arg.startsWith("--concurrency=")) {
            options.concurrency = requirePositiveInt(arg.split("=")[1], "--concurrency");
            continue;
        }
        if (arg.startsWith("--tcp-concurrency=")) {
            options.tcpConcurrency = requirePositiveInt(arg.split("=")[1], "--tcp-concurrency");
            continue;
        }
        if (arg.startsWith("--website-workers=")) {
            options.websiteWorkers = requirePositiveInt(arg.split("=")[1], "--website-workers");
            continue;
        }
        if (arg.startsWith("--max-curl=")) {
            options.maxCurlProcesses = requirePositiveInt(arg.split("=")[1], "--max-curl");
            continue;
        }
    }

    return options;
}

export function printHelp(): void {
    log(`
Proxy Benchmark & Network Telemetry Suite

Usage:
  nub update-proxies.ts [options] [proxy...] [file...]
  curl -fsSL https://.../run.sh | bash -s -- [options] [proxy...]
  irm https://.../run.ps1 | iex [options] [proxy...]

Examples:
  # Benchmark with the default safe preset
  nub update-proxies.ts

  # Benchmark with home-router defaults (larger run)
  nub update-proxies.ts --home

  # Benchmark with gentle mode for sensitive/budget WiFi routers
  nub update-proxies.ts --safe

  # Benchmark high-performance mode on VPS / Gigabit servers
  nub update-proxies.ts --turbo

  # Benchmark a single specific proxy route
  nub update-proxies.ts socks5://64.227.186.105:1080

  # Benchmark custom list from file
  nub update-proxies.ts my-proxies.txt

Options:
  --safe              Gentle profile (500 candidates, 35 TCP sockets, 12 verification workers, 4 website workers, 16 global curl) - default
  --home              Home profile (2,000 candidates, 80 TCP sockets, 25 verification workers, 8 website workers, 64 global curl)
  --turbo             High-performance profile (1,500 TCP sockets, 300 verification workers, 100 website workers, 1,500 global curl)
  -c, --concurrency   Override Stage 2 verification worker count
  --tcp-concurrency   Override Stage 1 parallel TCP socket count
  --website-workers   Override Stage 3 proxy worker count
  --max-curl          Global ceiling on concurrent curl processes
  -n, --limit <num>   Candidate cap (0 = unlimited)
  --strict-tls        Verify TLS certificates instead of permissive transport probing
  -h, --help          Show this help message

  --                  Treat every later argument as a proxy or file path
`);
}

export function describeCliFailure(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}
