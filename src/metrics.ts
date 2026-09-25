import type { EgressStatus, LatencyTier, ScoreBreakdown } from "./types.js";

/** Maximum points per score component. Sums to 100. */
export const SCORE_WEIGHTS = {
    websites: 50,
    avgLatency: 20,
    minLatency: 8,
    connectTime: 8,
    ttfb: 7,
    speed: 7,
} as const;

export interface TimingSample {
    totalLatencyMs: number;
    connectTimeMs: number;
    ttfbMs: number;
    downloadSpeedBps: number;
}

export interface PerformanceMetrics {
    avgLatencyMs: number;
    minLatencyMs: number;
    maxLatencyMs: number;
    medianLatencyMs: number;
    avgConnectTimeMs: number;
    avgTtfbMs: number;
    avgSpeedBps: number;
}

const EMPTY_METRICS: PerformanceMetrics = {
    avgLatencyMs: 0,
    minLatencyMs: 0,
    maxLatencyMs: 0,
    medianLatencyMs: 0,
    avgConnectTimeMs: 0,
    avgTtfbMs: 0,
    avgSpeedBps: 0,
};

function mean(values: number[]): number {
    if (values.length === 0) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function median(values: number[]): number {
    if (values.length === 0) return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const midVal = sorted[mid] ?? 0;
    const prevVal = sorted[mid - 1] ?? 0;
    return sorted.length % 2 !== 0 ? midVal : Math.round((prevVal + midVal) / 2);
}

export function summarizeSamples(samples: TimingSample[]): PerformanceMetrics {
    if (samples.length === 0) return { ...EMPTY_METRICS };
    const latencies = samples.map((s) => s.totalLatencyMs);
    return {
        avgLatencyMs: mean(latencies),
        minLatencyMs: Math.min(...latencies),
        maxLatencyMs: Math.max(...latencies),
        medianLatencyMs: median(latencies),
        avgConnectTimeMs: mean(samples.map((s) => s.connectTimeMs)),
        avgTtfbMs: mean(samples.map((s) => s.ttfbMs)),
        avgSpeedBps: mean(samples.map((s) => s.downloadSpeedBps)),
    };
}

export function averageLatency(samples: TimingSample[]): number {
    return mean(samples.map((s) => s.totalLatencyMs));
}

/**
 * The egress check only compares the observed exit IP with the origin IP.
 * It proves nothing about X-Forwarded-For / Via / Forwarded headers, so no
 * anonymity classification is derived from it.
 */
export function classifyEgress(exitIp: string | null, localPublicIp: string | null): EgressStatus {
    if (!exitIp || !localPublicIp) return "UNKNOWN";
    return exitIp === localPublicIp ? "SAME_EGRESS_IP" : "DIFFERENT_EGRESS_IP";
}

export function latencyTier(avgLatencyMs: number): LatencyTier {
    if (avgLatencyMs <= 0) return "SLOW";
    if (avgLatencyMs < 400) return "EXCELLENT";
    if (avgLatencyMs < 800) return "GOOD";
    if (avgLatencyMs < 1500) return "MODERATE";
    return "SLOW";
}

function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/** Percent over the probes that produced a verdict (cancelled probes excluded). */
export function ratioPercent(passed: number, completed: number): number {
    if (!Number.isFinite(completed) || completed <= 0) return 0;
    return Number.parseFloat(((passed / completed) * 100).toFixed(1));
}

/**
 * Usability-gated multi-factor score. Performance components are gated by the
 * website reachability ratio so a fast proxy that cannot reach real sites
 * cannot outrank one that can.
 */
export function scoreCandidate(
    performance: PerformanceMetrics,
    usabilityRatio: number
): { compositeScore: number; breakdown: ScoreBreakdown } {
    const ratio = clamp(usabilityRatio, 0, 1);
    const websites = ratio * SCORE_WEIGHTS.websites;

    const avgLatency = clamp(SCORE_WEIGHTS.avgLatency * (1 - performance.avgLatencyMs / 2500), 0, SCORE_WEIGHTS.avgLatency);
    const minLatency = clamp(SCORE_WEIGHTS.minLatency * (1 - performance.minLatencyMs / 1500), 0, SCORE_WEIGHTS.minLatency);
    const connectTime = clamp(SCORE_WEIGHTS.connectTime * (1 - performance.avgConnectTimeMs / 800), 0, SCORE_WEIGHTS.connectTime);
    const ttfb = clamp(SCORE_WEIGHTS.ttfb * (1 - performance.avgTtfbMs / 1500), 0, SCORE_WEIGHTS.ttfb);
    const speed = clamp((performance.avgSpeedBps / (500 * 1024)) * SCORE_WEIGHTS.speed, 0, SCORE_WEIGHTS.speed);

    const gatedPerformance = (avgLatency + minLatency + connectTime + ttfb + speed) * ratio;

    return {
        compositeScore: Math.round(websites + gatedPerformance),
        breakdown: {
            websites: Math.round(websites),
            avgLatency: Math.round(avgLatency * ratio),
            minLatency: Math.round(minLatency * ratio),
            connectTime: Math.round(connectTime * ratio),
            ttfb: Math.round(ttfb * ratio),
            speed: Math.round(speed * ratio),
        },
    };
}
