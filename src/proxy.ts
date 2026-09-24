import type { ProxyItem } from "./types.js";

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

export function buildCurlProxyArgs(proxy: ProxyItem): string[] {
    switch (proxy.protocol) {
        case "http":
            return ["-x", `http://${proxy.ip}:${proxy.port}`];
        case "https":
            return ["-x", `https://${proxy.ip}:${proxy.port}`];
        case "socks4":
            return ["--socks4", `${proxy.ip}:${proxy.port}`];
        case "socks5":
            return ["--socks5", `${proxy.ip}:${proxy.port}`];
        default:
            return ["-x", `${proxy.protocol}://${proxy.ip}:${proxy.port}`];
    }
}
