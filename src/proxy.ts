import { isIP } from "node:net";
import type { Protocol, ProxyItem } from "./types.js";

/** Canonical target check: real IPv4 (not 999.999.999.999) and a usable port. */
export function isValidProxyTarget(ip: string, port: number): boolean {
    return isIP(ip) === 4 && Number.isSafeInteger(port) && port >= 1 && port <= 65535;
}

export function formatProxy(proxy: ProxyItem): string {
    return `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
}

export function proxyOutputUrl(proxy: ProxyItem): string {
    return `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
}

export function deduplicateProxies(proxies: ProxyItem[]): ProxyItem[] {
    const seen = new Set<string>();
    const unique: ProxyItem[] = [];

    for (const proxy of proxies) {
        const key = `${proxy.protocol}:${proxy.ip}:${proxy.port}`;
        if (!seen.has(key)) {
            seen.add(key);
            unique.push(proxy);
        }
    }

    return unique;
}

export function parseProxyString(input: string): ProxyItem[] {
    const trimmed = input.trim();
    if (!trimmed) return [];

    // 1. Matches protocol://ip:port[,country]
    const urlMatch = trimmed.match(/^([a-zA-Z0-9]+):\/\/([0-9.]+):([0-9]+)(?:,([a-zA-Z]{2}))?/);
    if (urlMatch && urlMatch[1] && urlMatch[2] && urlMatch[3]) {
        const protocol = urlMatch[1].toLowerCase() as Protocol;
        const ip = urlMatch[2];
        const port = Number.parseInt(urlMatch[3], 10);
        const country = urlMatch[4];
        if (["http", "https", "socks4", "socks5"].includes(protocol) && isValidProxyTarget(ip, port)) {
            return [{
                protocol,
                ip,
                port,
                country,
                raw: trimmed,
            }];
        }
    }

    // 2. Matches bare ip:port -> probe across common protocols
    const ipPortMatch = trimmed.match(/^([0-9.]+):([0-9]+)$/);
    if (ipPortMatch && ipPortMatch[1] && ipPortMatch[2]) {
        const ip = ipPortMatch[1];
        const port = Number.parseInt(ipPortMatch[2], 10);
        if (isValidProxyTarget(ip, port)) {
            return (["socks5", "http", "https", "socks4"] as Protocol[]).map((protocol) => ({
                protocol,
                ip,
                port,
                raw: `${protocol}://${ip}:${port}`,
            }));
        }
    }

    return [];
}

export function buildCurlProxyArgs(proxy: ProxyItem): string[] {
    switch (proxy.protocol) {
        case "http":
            return ["-x", `http://${proxy.ip}:${proxy.port}`];
        case "https":
            return ["-x", `https://${proxy.ip}:${proxy.port}`];
        case "socks4":
            return ["--socks4a", `${proxy.ip}:${proxy.port}`];
        case "socks5":
            return ["--socks5-hostname", `${proxy.ip}:${proxy.port}`];
        default:
            return ["-x", `${proxy.protocol}://${proxy.ip}:${proxy.port}`];
    }
}
