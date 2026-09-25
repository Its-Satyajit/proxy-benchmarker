#!/usr/bin/env bash
set -e

REPO_OWNER="Its-Satyajit"
REPO_NAME="proxy-benchmarker"
# Pinned so `curl | bash` runs one immutable bundle. Override to track a branch
# or commit: PROXY_BENCHMARKER_REF=master, or a tag like v1.0.50, or a commit SHA.
BUNDLE_REF="${PROXY_BENCHMARKER_REF:-v1.0.50}"
JSDELIVR_URL="https://cdn.jsdelivr.net/gh/${REPO_OWNER}/${REPO_NAME}@${BUNDLE_REF}/dist/proxy-benchmarker.min.mjs"
RELEASE_URL="https://github.com/${REPO_OWNER}/${REPO_NAME}/releases/download/${BUNDLE_REF}/proxy-benchmarker.min.mjs"
RAW_URL="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${BUNDLE_REF}/dist/proxy-benchmarker.min.mjs"
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
    if [ -f "$dest" ] && [ "$(wc -c < "$dest" 2>/dev/null || echo 0)" -gt 1000 ]; then
        return 0
    else
        rm -f "$dest" 2>/dev/null || true
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

# Download the pinned bundle (jsDelivr -> release asset -> raw), no moving refs
echo "[INFO] Fetching pinned bundle (ref: ${BUNDLE_REF})..."
if fetch_asset "$JSDELIVR_URL" "$TEMP_FILE" && [ -s "$TEMP_FILE" ]; then
    echo "[OK] Downloaded bundle via jsDelivr CDN (ref ${BUNDLE_REF})."
elif fetch_asset "$RELEASE_URL" "$TEMP_FILE" && [ -s "$TEMP_FILE" ]; then
    echo "[OK] Downloaded release asset for ${BUNDLE_REF}."
elif fetch_asset "$RAW_URL" "$TEMP_FILE" && [ -s "$TEMP_FILE" ]; then
    echo "[OK] Downloaded bundle for ${BUNDLE_REF} from raw.githubusercontent.com."
elif [ -f "./dist/proxy-benchmarker.min.mjs" ]; then
    echo "[WARN] Using local bundle: ./dist/proxy-benchmarker.min.mjs"
    TEMP_FILE="./dist/proxy-benchmarker.min.mjs"
else
    echo "[ERROR] Failed to download bundle for ref '${BUNDLE_REF}'."
    echo "        Set PROXY_BENCHMARKER_REF to an existing tag, branch or commit, e.g. PROXY_BENCHMARKER_REF=master"
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
