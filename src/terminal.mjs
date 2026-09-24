import process from "node:process";

export const ansi = {
    clearLine: "\x1b[2K",
    reset: "\x1b[0m",
    bold: "\x1b[1m",
    dim: "\x1b[2m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    cyan: "\x1b[36m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    gray: "\x1b[90m",
};

export function log(message = "") {
    process.stdout.write(`${message}\n`);
}

export function live(message) {
    process.stdout.write(`\r${ansi.clearLine}${message}`);
}

export function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDuration(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) {
        return "--";
    }

    const total = Math.round(seconds);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const secs = total % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m ${secs}s`;
    }
    if (minutes > 0) {
        return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
}

export function formatRate(value) {
    if (!Number.isFinite(value) || value <= 0) {
        return "0.0/s";
    }
    return `${value.toFixed(1)}/s`;
}

export function formatPercent(current, total) {
    if (!total) {
        return "0.0";
    }
    return ((current / total) * 100).toFixed(1);
}

export function formatMs(ms) {
    if (!Number.isFinite(ms) || ms < 0) return "--";
    return `${Math.round(ms)} ms`;
}

export function formatSpeed(bytesPerSec) {
    if (!Number.isFinite(bytesPerSec) || bytesPerSec <= 0) return "0 B/s";
    if (bytesPerSec < 1024) return `${bytesPerSec.toFixed(0)} B/s`;
    if (bytesPerSec < 1024 * 1024) return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
    return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
}
