import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { isIP } from "node:net";
import { log, ansi, sleep } from "./terminal.mjs";

const execFileAsync = promisify(execFile);

export async function getLocalPublicIp() {
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
            ], { timeout: 6000 });

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

export async function checkExecutable(command, args) {
    try {
        await execFileAsync(command, args, {
            timeout: 5000,
            maxBuffer: 1024 * 1024,
        });
        return true;
    } catch {
        return false;
    }
}

export async function checkDependencies() {
    const dependencies = [
        ["curl", ["--version"]],
        ["dig", ["-v"]],
    ];

    for (const [command, args] of dependencies) {
        const available = await checkExecutable(command, args);
        if (!available) {
            throw new Error(`Required command not found or not executable: ${command}`);
        }
    }
}

export function parseUrl(url) {
    const parsed = new URL(url);
    return {
        protocol: parsed.protocol.replace(":", ""),
        hostname: parsed.hostname,
        port: parsed.port
            ? Number(parsed.port)
            : parsed.protocol === "https:"
            ? 443
            : 80,
    };
}

export async function resolveIPv4(hostname, dnsServer = "1.1.1.1") {
    const attempts = [
        [`@${dnsServer}`, "A", hostname, "+short"],
        [`@${dnsServer}`, "A", hostname, "+short", "+tcp"],
    ];

    for (const args of attempts) {
        try {
            const { stdout } = await execFileAsync("dig", args, {
                timeout: 5000,
                maxBuffer: 1024 * 1024,
            });

            const addresses = stdout
                .split(/\r?\n/)
                .map((value) => value.trim())
                .filter((value) => isIP(value) === 4);

            if (addresses.length > 0) {
                return [...new Set(addresses)];
            }
        } catch {
            // Try next attempt
        }
    }

    return [];
}

export async function resolveOneIPv4(hostname, dnsServer = "1.1.1.1", retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        const addresses = await resolveIPv4(hostname, dnsServer);
        if (addresses.length > 0) {
            return addresses[(attempt - 1) % addresses.length];
        }
        if (attempt < retries) {
            await sleep(1000);
        }
    }
    return null;
}

export async function prepareEndpoints(testEndpoints, config) {
    log(`${ansi.cyan}Resolving test endpoints using DNS (${config.cloudflareDns})...${ansi.reset}`);
    log(`${ansi.gray}Retries: ${config.endpointRetries}${ansi.reset}\n`);

    const enabled = [];
    const disabled = [];

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
                `  ${ansi.red}✗${ansi.reset} ${endpoint.name.padEnd(24)} ` +
                `${ansi.gray}DNS resolution failed → disabled for this run${ansi.reset}`
            );
            continue;
        }

        enabled.push({
            ...endpoint,
            resolvedIp,
        });

        log(
            `  ${ansi.green}✓${ansi.reset} ${endpoint.name.padEnd(24)} ` +
            `${ansi.gray}${resolvedIp}${ansi.reset}`
        );
    }

    log("");

    if (enabled.length === 0) {
        throw new Error("No test endpoints could be resolved.");
    }

    log(
        `${ansi.green}✓ ${enabled.length}/${testEndpoints.length} ` +
        `test endpoints enabled${ansi.reset}`
    );

    if (disabled.length > 0) {
        log(
            `${ansi.yellow}⚠ ${disabled.length} endpoint(s) disabled because DNS resolution failed.${ansi.reset}`
        );
        log(
            `${ansi.gray}Proxies will be tested against the remaining ${enabled.length} endpoint(s).${ansi.reset}`
        );
    }

    log("");
    return enabled;
}
