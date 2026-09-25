#!/usr/bin/env bash
set -e

REPO_OWNER="Its-Satyajit"
REPO_NAME="proxy-benchmarker"
RELEASE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/latest/download/proxy-benchmarker.min.mjs"
RAW_MASTER_URL="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/dist/proxy-benchmarker.min.mjs"
RAW_MAIN_URL="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/dist/proxy-benchmarker.min.mjs"
TEMP_FILE="/tmp/proxy-benchmarker.$$.mjs"
REPORT_FILE="$(pwd)/benchmark-report.html"

cleanup() {
    if [ "$TEMP_FILE" != "./dist/proxy-benchmarker.min.mjs" ] && [ -f "$TEMP_FILE" ]; then
        rm -f "$TEMP_FILE"
    fi
}
trap cleanup EXIT INT TERM

# Detect JavaScript runtime / package manager runner
detect_runtime() {
    if command -v nub >/dev/null 2>&1; then
        echo "nub"
    elif command -v bun >/dev/null 2>&1; then
        echo "bun"
    elif command -v node >/dev/null 2>&1; then
        echo "node"
    elif command -v deno >/dev/null 2>&1; then
        echo "deno"
    elif command -v npx >/dev/null 2>&1; then
        echo "npx"
    elif command -v pnpm >/dev/null 2>&1; then
        echo "pnpm"
    elif command -v yarn >/dev/null 2>&1; then
        echo "yarn"
    else
        echo ""
    fi
}

JS_RUNTIME="$(detect_runtime)"

if [ -z "$JS_RUNTIME" ]; then
    echo "[ERROR] No JavaScript runtime or package manager found (nub, bun, node, deno, npx, pnpm, yarn)."
    echo "Install one of the following to run proxy-benchmarker:"
    echo "  - Node.js: https://nodejs.org"
    echo "  - Bun:     curl -fsSL https://bun.sh/install | bash"
    echo "  - Deno:    curl -fsSL https://deno.land/install.sh | sh"
    echo "  - Nub:     curl -fsSL https://nubjs.com/install.sh | bash"
    exit 1
fi

fetch_asset() {
    local url="$1"
    local dest="$2"
    if command -v curl >/dev/null 2>&1; then
        curl -fsSL "$url" -o "$dest" 2>/dev/null
    elif command -v wget >/dev/null 2>&1; then
        wget -qO "$dest" "$url" 2>/dev/null
    else
        return 1
    fi
}

if ! command -v curl >/dev/null 2>&1 && ! command -v wget >/dev/null 2>&1; then
    echo "[ERROR] curl or wget is required to download the benchmark bundle."
    exit 1
fi

echo ""
echo "========================================"
echo " Proxy Benchmark & Network Telemetry    "
echo "========================================"
echo ""

# Download latest minified bundle (release -> master raw -> main raw -> local dist)
echo "[INFO] Fetching latest proxy benchmark bundle..."
if fetch_asset "$RELEASE_URL" "$TEMP_FILE" && [ -s "$TEMP_FILE" ]; then
    echo "[OK] Downloaded latest release asset."
elif fetch_asset "$RAW_MASTER_URL" "$TEMP_FILE" && [ -s "$TEMP_FILE" ]; then
    echo "[OK] Downloaded latest bundle from master branch."
elif fetch_asset "$RAW_MAIN_URL" "$TEMP_FILE" && [ -s "$TEMP_FILE" ]; then
    echo "[OK] Downloaded latest bundle from main branch."
elif [ -f "./dist/proxy-benchmarker.min.mjs" ]; then
    echo "[WARN] Using local bundle: ./dist/proxy-benchmarker.min.mjs"
    TEMP_FILE="./dist/proxy-benchmarker.min.mjs"
else
    echo "[ERROR] Failed to download benchmark bundle."
    exit 1
fi

echo ">> Executing benchmark using ${JS_RUNTIME}..."
echo ""

# Execute with detected runtime
set +e
case "$JS_RUNTIME" in
    nub)
        nub "$TEMP_FILE" "$@"
        ;;
    bun)
        bun run "$TEMP_FILE" "$@"
        ;;
    node)
        node "$TEMP_FILE" "$@"
        ;;
    deno)
        deno run -A "$TEMP_FILE" "$@"
        ;;
    npx)
        npx --yes node "$TEMP_FILE" "$@"
        ;;
    pnpm)
        pnpm exec node "$TEMP_FILE" "$@"
        ;;
    yarn)
        yarn node "$TEMP_FILE" "$@"
        ;;
esac
EXIT_CODE=$?
set -e

# Auto-launch HTML report
if [ $EXIT_CODE -eq 0 ] && [ -f "$REPORT_FILE" ]; then
    echo ""
    echo "[INFO] Opening HTML benchmark report in your browser..."
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$REPORT_FILE" 2>/dev/null &
    elif command -v open >/dev/null 2>&1; then
        open "$REPORT_FILE" 2>/dev/null &
    elif command -v sensible-browser >/dev/null 2>&1; then
        sensible-browser "$REPORT_FILE" 2>/dev/null &
    elif command -v wslview >/dev/null 2>&1; then
        wslview "$REPORT_FILE" 2>/dev/null &
    fi
    echo "Report available at: $REPORT_FILE"
fi

exit $EXIT_CODE
