export type Protocol = "http" | "https" | "socks4" | "socks5";

export type LatencyTier = "EXCELLENT" | "GOOD" | "MODERATE" | "SLOW" | "DEAD";

export type PresetName = "safe" | "home" | "turbo";

/**
 * What the egress check actually proves: the observed exit IP is the same or
 * different from the origin IP. Header-level anonymity (X-Forwarded-For, Via,
 * Forwarded) is NOT measured, so no anonymity claim is derived from this.
 */
export type EgressStatus = "DIFFERENT_EGRESS_IP" | "SAME_EGRESS_IP" | "UNKNOWN";

export type PerformanceSource = "websites" | "egress-endpoints";

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
    resolvedIp?: string;
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
}

export interface BenchmarkItem {
    rank?: number;
    proxy: ProxyItem;
    status: "PASS" | "FAIL";
    tier: LatencyTier;
    compositeScore: number;
    scoreBreakdown: ScoreBreakdown;
    exitIp: string | null;
    egressStatus: EgressStatus;
    verificationStrategy: "fast" | "full";
    /** Probe requests launched during egress verification. */
    endpointsStarted: number;
    /** Probe results actually collected (aborted losers are not counted). */
    endpointsCompleted: number;
    endpointsPassed: number;
    /** Endpoints configured for this run. */
    endpointsTotal: number;
    /** endpointsStarted / endpointsTotal: how much of the endpoint set was probed. */
    endpointCoveragePercent: number;
    /** endpointsPassed / endpointsStarted: success across every probe that was launched. */
    endpointPassRatePercent: number;
    /** Website targets configured for this run. */
    websitesAvailable: number;
    /** Website probes actually attempted (may be lower than available on early exit). */
    websitesAttempted: number;
    websitesPassed: number;
    websitePassRatePercent: number;
    /** True when the website stage stopped early after the first batch failed. */
    websitesEarlyExit: boolean;
    /** Which measurement set produced the latency/throughput numbers below. */
    performanceSource: PerformanceSource;
    /** Latency of egress verification endpoints, kept separate from web performance. */
    egressVerificationLatencyMs: number;
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
    /** Stage 2 egress-verification workers. */
    concurrency: number;
    tcpConcurrency: number;
    /** Stage 3 proxy workers running website batches. */
    websiteWorkers: number;
    /** Website probes per proxy, per batch. */
    websiteConcurrency: number;
    /** Hard ceiling on concurrent curl child processes across all stages. */
    maxCurlProcesses: number;
    tcpTimeoutMs: number;
    timeoutSeconds: number;
    connectTimeoutSeconds: number;
    websiteTimeoutSeconds: number;
    websiteConnectTimeoutSeconds: number;
    /** false = permissive transport probe (curl --insecure), true = strict TLS. */
    tlsVerify: boolean;
    cloudflareDns: string;
    endpointRetries: number;
    /** 0 = unlimited candidates. */
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
