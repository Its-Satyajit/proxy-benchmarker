import type { PresetName } from "./types.js";

/**
 * Every concurrency/timeout knob the benchmark uses, in one place.
 * Presets are the only source of these values; nothing downstream clamps them
 * silently (see resolveWorkerCount).
 */
export interface PresetLimits {
    /** 0 = unlimited candidates. */
    candidateLimit: number;
    /** Stage 1 parallel TCP sockets. */
    tcpConcurrency: number;
    /** Stage 2 parallel egress-verification workers. */
    verificationWorkers: number;
    /** Stage 3 parallel proxies running website batches. */
    websiteWorkers: number;
    /** Website probes per proxy, per batch. */
    websiteRequestsPerProxy: number;
    /** Hard ceiling on concurrent curl child processes (all stages). */
    maxCurlProcesses: number;
    tcpTimeoutMs: number;
    timeoutSeconds: number;
    connectTimeoutSeconds: number;
    websiteTimeoutSeconds: number;
    websiteConnectTimeoutSeconds: number;
}

export const PRESET_NAMES: PresetName[] = ["safe", "home", "turbo"];

/** Preset used when nothing is requested on the CLI or in the environment. */
export const DEFAULT_PRESET: PresetName = "safe";

export const PRESET_LIMITS: Record<PresetName, PresetLimits> = {
    safe: {
        candidateLimit: 500,
        tcpConcurrency: 35,
        verificationWorkers: 12,
        websiteWorkers: 4,
        websiteRequestsPerProxy: 3,
        maxCurlProcesses: 16,
        tcpTimeoutMs: 1500,
        timeoutSeconds: 4.5,
        connectTimeoutSeconds: 3.0,
        websiteTimeoutSeconds: 5.0,
        websiteConnectTimeoutSeconds: 3.5,
    },
    home: {
        candidateLimit: 2000,
        tcpConcurrency: 80,
        verificationWorkers: 25,
        websiteWorkers: 8,
        websiteRequestsPerProxy: 5,
        maxCurlProcesses: 64,
        tcpTimeoutMs: 1200,
        timeoutSeconds: 4.0,
        connectTimeoutSeconds: 3.0,
        websiteTimeoutSeconds: 4.5,
        websiteConnectTimeoutSeconds: 3.0,
    },
    turbo: {
        candidateLimit: 0,
        tcpConcurrency: 1500,
        verificationWorkers: 300,
        websiteWorkers: 100,
        websiteRequestsPerProxy: 25,
        maxCurlProcesses: 1500,
        tcpTimeoutMs: 800,
        timeoutSeconds: 3.0,
        connectTimeoutSeconds: 2.0,
        websiteTimeoutSeconds: 3.5,
        websiteConnectTimeoutSeconds: 2.5,
    },
};

const MAX_WORKERS = 100_000;
const MAX_CURL_PROCESSES = 100_000;
const MAX_TIMEOUT_SECONDS = 600;
const MAX_CANDIDATES = 10_000_000;

export function parsePresetName(value: string | undefined, source = "preset"): PresetName {
    if (value === undefined || value.trim() === "") {
        return DEFAULT_PRESET;
    }
    const normalized = value.trim().toLowerCase();
    if ((PRESET_NAMES as string[]).includes(normalized)) {
        return normalized as PresetName;
    }
    throw new Error(`${source} must be one of: ${PRESET_NAMES.join(", ")} (got "${value}")`);
}

export function positiveInt(value: number, name: string, max = MAX_WORKERS): number {
    if (!Number.isSafeInteger(value) || value < 1 || value > max) {
        throw new Error(`${name} must be an integer between 1 and ${max} (got ${value})`);
    }
    return value;
}

export function positiveSeconds(value: number, name: string): number {
    if (!Number.isFinite(value) || value <= 0 || value > MAX_TIMEOUT_SECONDS) {
        throw new Error(`${name} must be greater than 0 and at most ${MAX_TIMEOUT_SECONDS} seconds (got ${value})`);
    }
    return value;
}

/** Candidate cap: 0 means "no cap". */
export function candidateLimit(value: number, name = "limit"): number {
    if (!Number.isSafeInteger(value) || value < 0 || value > MAX_CANDIDATES) {
        throw new Error(`${name} must be an integer between 0 and ${MAX_CANDIDATES}, 0 meaning unlimited (got ${value})`);
    }
    return value;
}

export function resolveCurlCap(value: number, name = "maxCurlProcesses"): number {
    return positiveInt(value, name, MAX_CURL_PROCESSES);
}

/**
 * Worker count for a stage. No hidden minimum: a validated request of 1 stays 1,
 * and the only cap is the work actually available.
 */
export function resolveWorkerCount(requested: number, available: number): number {
    const safeAvailable = Math.max(0, Math.floor(available));
    if (safeAvailable === 0) return 0;
    return Math.max(1, Math.min(Math.floor(requested), safeAvailable));
}

/** Reads an integer from the environment, rejecting NaN/0/negative values. */
export function envInt(env: NodeJS.ProcessEnv, name: string, fallback: number, max = MAX_WORKERS): number {
    const raw = env[name];
    if (raw === undefined || raw.trim() === "") return fallback;
    return positiveInt(Number(raw.trim()), `environment ${name}`, max);
}

/** 0 = unlimited, so negatives are still rejected. */
export function envCandidateLimit(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
    const raw = env[name];
    if (raw === undefined || raw.trim() === "") return candidateLimit(fallback, `preset candidateLimit`);
    return candidateLimit(Number(raw.trim()), `environment ${name}`);
}

export function envSeconds(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
    const raw = env[name];
    if (raw === undefined || raw.trim() === "") return positiveSeconds(fallback, `preset timeout`);
    return positiveSeconds(Number(raw.trim()), `environment ${name}`);
}

export function envBoolean(env: NodeJS.ProcessEnv, name: string, fallback: boolean): boolean {
    const raw = env[name];
    if (raw === undefined || raw.trim() === "") return fallback;
    const normalized = raw.trim().toLowerCase();
    if (["1", "true", "yes", "on"].includes(normalized)) return true;
    if (["0", "false", "no", "off"].includes(normalized)) return false;
    throw new Error(`environment ${name} must be a boolean (got "${raw}")`);
}
