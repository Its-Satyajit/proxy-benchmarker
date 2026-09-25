/**
 * Global ceiling on concurrent curl child processes.
 *
 * Stage 2 and Stage 3 both spawn curl processes, and Stage 3 is
 * `websiteWorkers x websiteConcurrency` in the worst case, so the per-stage
 * worker counts alone do not describe real system load. Every curl spawn goes
 * through this gate, which makes the configured cap the actual ceiling.
 */
let limit = Number.POSITIVE_INFINITY;
let inFlight = 0;
let peak = 0;
const waiters: Array<() => void> = [];

export function configureCurlGate(maxCurlProcesses: number): void {
    limit = Number.isFinite(maxCurlProcesses) && maxCurlProcesses > 0 ? Math.floor(maxCurlProcesses) : Number.POSITIVE_INFINITY;
    drain();
}

export function curlGateStats(): { limit: number; inFlight: number; peak: number; waiting: number } {
    return { limit, inFlight, peak, waiting: waiters.length };
}

export function resetCurlGateStats(): void {
    peak = inFlight;
}

function drain(): void {
    while (inFlight < limit && waiters.length > 0) {
        const next = waiters.shift();
        next?.();
    }
}

function acquire(): Promise<void> {
    if (inFlight < limit) {
        inFlight++;
        if (inFlight > peak) peak = inFlight;
        return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
        waiters.push(() => {
            inFlight++;
            if (inFlight > peak) peak = inFlight;
            resolve();
        });
    });
}

function release(): void {
    inFlight--;
    drain();
}

export async function withCurlSlot<T>(fn: () => Promise<T>): Promise<T> {
    await acquire();
    try {
        return await fn();
    } finally {
        release();
    }
}
