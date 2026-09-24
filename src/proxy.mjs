import { isIP } from "node:net";

export function normalizeProtocol(row) {
    const protocol = String(row.protocol || "").toLowerCase().trim();
    const ssl = String(row.ssl || "").toLowerCase().trim();

    /*
     * ProxyScrape:
     * protocol=http + ssl=false -> HTTP
     * protocol=http + ssl=true  -> HTTPS-capable HTTP proxy
     */
    if (protocol === "http") {
        return ssl === "true" ? "https" : "http";
    }

    if (protocol === "socks4" || protocol === "socks5") {
        return protocol;
    }

    return null;
}

export function isValidProxyRow(row) {
    const ip = String(row.ip || "").trim();
    const port = Number(row.port);

    if (isIP(ip) !== 4) {
        return false;
    }

    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        return false;
    }

    return Boolean(normalizeProtocol(row));
}

export function normalizeProxy(row) {
    return {
        protocol: normalizeProtocol(row),
        ip: String(row.ip).trim(),
        port: Number(row.port),
        country: String(row.country || row.ip_data?.country || row.ip_data_countryCode || "").trim().toUpperCase(),
        username: String(row.username ?? row.user ?? "").trim(),
        password: String(row.password ?? row.pass ?? "").trim(),
    };
}

export function proxyKey(proxy) {
    return [
        proxy.protocol,
        proxy.ip,
        proxy.port,
        proxy.username,
        proxy.password,
    ].join("|");
}

export function deduplicateProxies(rows) {
    const seen = new Set();
    const proxies = [];

    for (const row of rows) {
        if (!isValidProxyRow(row)) {
            continue;
        }

        const proxy = normalizeProxy(row);
        const key = proxyKey(proxy);

        if (seen.has(key)) {
            continue;
        }

        seen.add(key);
        proxies.push(proxy);
    }

    return proxies;
}

export function proxyOutputUrl(proxy) {
    let auth = "";
    if (proxy.username || proxy.password) {
        auth = `${encodeURIComponent(proxy.username)}:${encodeURIComponent(proxy.password)}@`;
    }
    return `${proxy.protocol}://${auth}${proxy.ip}:${proxy.port}`;
}

export function buildCurlProxyArgs(proxy) {
    switch (proxy.protocol) {
        case "http":
        case "https":
            return [
                "--proxy", `http://${proxy.ip}:${proxy.port}`,
                ...(proxy.username || proxy.password
                    ? ["--proxy-user", `${proxy.username}:${proxy.password}`]
                    : []),
            ];

        case "socks4":
            return [
                "--socks4", `${proxy.ip}:${proxy.port}`,
                ...(proxy.username || proxy.password
                    ? ["--proxy-user", `${proxy.username}:${proxy.password}`]
                    : []),
            ];

        case "socks5":
            return [
                "--socks5", `${proxy.ip}:${proxy.port}`,
                ...(proxy.username || proxy.password
                    ? ["--proxy-user", `${proxy.username}:${proxy.password}`]
                    : []),
            ];

        default:
            throw new Error(`Unsupported protocol: ${proxy.protocol}`);
    }
}
