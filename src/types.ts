export type Protocol = "http" | "https" | "socks4" | "socks5";

export type LatencyTier = "EXCELLENT" | "GOOD" | "MODERATE" | "SLOW" | "DEAD";

export type AnonymityStatus = "ELITE / ANONYMOUS" | "TRANSPARENT (LEAKING)" | "UNKNOWN";

export interface ProxyItem {
    protocol: Protocol;
    ip: string;
    port: number;
    country?: string;
    raw?: string;
}

export interface CandidateFeed {
    name: string;
    urls: string[];
    defaultProtocol?: Protocol;
}

export interface WebsiteTarget {
    name: string;
    domain: string;
    category: string;
    url: string;
}

export interface TestEndpoint {
    name: string;
    url: string;
    parser: "plain" | "ipme";
    resolvedIp?: string;
}

export interface EndpointProbeResult {
    name: string;
    url: string;
    resolvedIp?: string;
    ok: boolean;
    httpCode: number;
    totalLatencyMs: number;
    connectTimeMs: number;
    sslHandshakeMs: number;
    ttfbMs: number;
    downloadSpeedBps: number;
    downloadSizeBytes: number;
    returnedIp: string | null;
    reason: string | null;
}

export interface WebsiteProbeResult {
    name: string;
    domain: string;
    category: string;
    url: string;
    ok: boolean;
    httpCode: number;
    totalLatencyMs: number;
    connectTimeMs: number;
    sslHandshakeMs: number;
    ttfbMs: number;
    downloadSpeedBps: number;
    downloadSizeBytes: number;
    reason: string | null;
}

export interface ScoreBreakdown {
    websites: number;
    avgLatency: number;
    minLatency: number;
    connectTime: number;
    ttfb: number;
    speed: number;
    anonymity: number;
}

export interface BenchmarkItem {
    rank?: number;
    proxy: ProxyItem;
    status: "PASS" | "FAIL";
    tier: LatencyTier;
    compositeScore: number;
    scoreBreakdown: ScoreBreakdown;
    exitIp: string | null;
    anonymity: AnonymityStatus;
    endpointsTested: number;
    endpointsPassed: number;
    endpointsTotal: number;
    passRatePercent: number;
    websitesTested: number;
    websitesPassed: number;
    websitesTotal: number;
    websitePassRatePercent: number;
    avgLatencyMs: number;
    minLatencyMs: number;
    maxLatencyMs: number;
    medianLatencyMs: number;
    avgConnectTimeMs: number;
    avgTtfbMs: number;
    avgSpeedBps: number;
    firstFailedEndpoint: string | null;
    failureReason: string | null;
    endpointDetails: EndpointProbeResult[];
    websiteDetails: WebsiteProbeResult[];
}

export interface BenchmarkStats {
    total: number;
    completed: number;
    passed: number;
    failed: number;
    localPublicIp: string | null;
    durationSeconds: number;
    startedAt: string;
    completedAt: string;
}

export interface BenchmarkRunResult {
    results: Record<Protocol, ProxyItem[]>;
    benchmarks: BenchmarkItem[];
    stats: BenchmarkStats;
}

export interface AppConfig {
    concurrency: number;
    tcpConcurrency: number;
    tcpTimeoutMs: number;
    timeoutSeconds: number;
    connectTimeoutSeconds: number;
    websiteTimeoutSeconds: number;
    websiteConnectTimeoutSeconds: number;
    websiteConcurrency: number;
    cloudflareDns: string;
    endpointRetries: number;
    limit: number;
    fullBenchmark: boolean;
    benchmarkTopWebsites: boolean;
    feeds: CandidateFeed[];
    csvUrls?: string[];
    testEndpoints: TestEndpoint[];
    topWebsites: WebsiteTarget[];
    outputDir: string;
    outputFiles: Record<Protocol, string>;
    reportFiles: {
        html: string;
        json: string;
    };
}
