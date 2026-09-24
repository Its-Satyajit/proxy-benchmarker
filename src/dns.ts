import { execFile } from "node:child_process";
import { promisify } from "node:util";
import dns from "node:dns/promises";
import { isIP } from "node:net";
import type { AppConfig, TestEndpoint } from "./types.js";
import { log, ansi, sleep } from "./terminal.js";

const execFileAsync = promisify(execFile);

export async function getLocalPublicIp(): Promise<string | null> {
    const urls = [
        "https://api.ipify.org",
        "https://icanhazip.com",
        "https://ifconfig.me/ip",
    ];

    for (const url of urls) {
        try {
            const { stdout } = await execFileAsync("curl", [
                "--silent",
                "--insecure",
                "--max-time", "5",
                url
            ], { timeout: 6000, windowsHide: true });

            const ip = stdout.trim();
            if (isIP(ip) === 4) {
                return ip;
            }
        } catch {
            // Try next service
        }
    }
    return null;
}

export async function checkExecutable(command: string, args: string[]): Promise<boolean> {
    try {
        await execFileAsync(command, args, {
            timeout: 5000,
            maxBuffer: 1024 * 1024,
            windowsHide: true,
        });
        return true;
    } catch {
        return false;
    }
}

export async function checkDependencies(): Promise<void> {
    const dependencies: [string, string[]][] = [
        ["curl", ["--version"]],
    ];

    for (const [command, args] of dependencies) {
        const available = await checkExecutable(command, args);
        if (!available) {
            throw new Error(`Required command not found or not executable: ${command}`);
        }
    }
}

export function parseUrl(url: string): { protocol: string; hostname: string; port: number } {
    const parsed = new URL(url);
    return {
        protocol: parsed.protocol.replace(":", ""),
        hostname: parsed.hostname,
        port: parsed.port
            ? Number.parseInt(parsed.port, 10)
            : parsed.protocol === "https:"
            ? 443
            : 80,
    };
}

export async function resolveIPv4(hostname: string, dnsServer: string = "1.1.1.1"): Promise<string[]> {
    try {
        const resolver = new dns.Resolver({ timeout: 4000, tries: 2 });
        if (dnsServer) {
            resolver.setServers([dnsServer]);
        }
        const addresses = await resolver.resolve4(hostname);
        const validIps = addresses.filter((value: string): value is string => isIP(value) === 4);
        if (validIps.length > 0) {
            return Array.from(new Set(validIps));
        }
    } catch {
        // Fallback to default system DNS
        try {
            const addresses = await dns.resolve4(hostname);
            const validIps = addresses.filter((value: string): value is string => isIP(value) === 4);
            if (validIps.length > 0) {
                return Array.from(new Set(validIps));
            }
        } catch {
            // Unresolved
        }
    }

    return [];
}

export async function resolveOneIPv4(hostname: string, dnsServer: string = "1.1.1.1", retries: number = 3): Promise<string | null> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const addresses = await resolveIPv4(hostname, dnsServer);
        if (addresses.length > 0) {
            return addresses[(attempt - 1) % addresses.length] ?? null;
        }
        if (attempt < retries) {
            await sleep(1000);
        }
    }
    return null;
}

export async function prepareEndpoints(testEndpoints: TestEndpoint[], config: AppConfig): Promise<TestEndpoint[]> {
    log(`${ansi.cyan}Resolving test endpoints using DNS (${config.cloudflareDns})...${ansi.reset}`);
    log(`${ansi.gray}Retries: ${config.endpointRetries}${ansi.reset}\n`);

    const enabled: TestEndpoint[] = [];
    const disabled: TestEndpoint[] = [];

    for (const endpoint of testEndpoints) {
        const target = parseUrl(endpoint.url);
        const resolvedIp = await resolveOneIPv4(
            target.hostname,
            config.cloudflareDns,
            config.endpointRetries
        );

        if (!resolvedIp) {
            disabled.push(endpoint);
            log(
                `  ${ansi.red}[FAIL]${ansi.reset} ${endpoint.name.padEnd(24)} ` +
                `${ansi.gray}DNS resolution failed -> disabled for this run${ansi.reset}`
            );
            continue;
        }

        enabled.push({
            ...endpoint,
            resolvedIp,
        });

        log(
            `  ${ansi.green}[OK]${ansi.reset}   ${endpoint.name.padEnd(24)} ` +
            `${ansi.gray}${resolvedIp}${ansi.reset}`
        );
    }

    log("");

    if (enabled.length === 0) {
        throw new Error("No test endpoints could be resolved.");
    }

    log(
        `${ansi.green}[OK] ${enabled.length}/${testEndpoints.length} ` +
        `test endpoints enabled${ansi.reset}`
    );

    if (disabled.length > 0) {
        log(
            `${ansi.yellow}[WARN] ${disabled.length} endpoint(s) disabled because DNS resolution failed.${ansi.reset}`
        );
        log(
            `${ansi.gray}Proxies will be tested against the remaining ${enabled.length} endpoint(s).${ansi.reset}`
        );
    }

    log("");
    return enabled;
}
