#!/usr/bin/env bash
set -e

REPO_OWNER="Its-Satyajit"
REPO_NAME="proxy-benchmarker"
BUNDLE_URL="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/master/dist/proxy-benchmarker.min.mjs"
BUNDLE_URL_FALLBACK="https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/dist/proxy-benchmarker.min.mjs"
TEMP_FILE="/tmp/proxy-benchmarker.$$.mjs"
REPORT_FILE="$(pwd)/benchmark-report.html"

# Check dependencies
command -v node >/dev/null 2>&1 || { echo "[ERROR] Node.js is required but not installed."; exit 1; }
command -v curl >/dev/null 2>&1 || { echo "[ERROR] curl is required but not installed."; exit 1; }
command -v dig >/dev/null 2>&1 || { echo "[ERROR] dig is required but not installed (install bind-utils or dnsutils)."; exit 1; }

echo ""
echo "========================================"
echo "   Proxy Benchmark Launcher & Auto-Run  "
echo "========================================"
echo ""

# Download latest minified bundle
echo "[INFO] Fetching latest proxy benchmark bundle from GitHub..."
if curl -fsSL "$BUNDLE_URL" -o "$TEMP_FILE" 2>/dev/null; then
    echo "[OK] Downloaded latest bundle."
elif curl -fsSL "$BUNDLE_URL_FALLBACK" -o "$TEMP_FILE" 2>/dev/null; then
    echo "[OK] Downloaded latest bundle (master branch)."
elif [ -f "./dist/proxy-benchmarker.min.mjs" ]; then
    echo "[WARN] Using local bundle: ./dist/proxy-benchmarker.min.mjs"
    TEMP_FILE="./dist/proxy-benchmarker.min.mjs"
else
    echo "[ERROR] Failed to download latest release bundle."
    exit 1
fi

echo ">> Executing Proxy Benchmark..."
echo ""

# Execute with Node.js
node "$TEMP_FILE" "$@"
EXIT_CODE=$?

# Cleanup temp file
if [ "$TEMP_FILE" != "./dist/proxy-benchmarker.min.mjs" ] && [ -f "$TEMP_FILE" ]; then
    rm -f "$TEMP_FILE"
fi

# Auto-launch HTML report
if [ $EXIT_CODE -eq 0 ] && [ -f "$REPORT_FILE" ]; then
    echo ""
    echo "[INFO] Opening HTML Benchmark Report in your browser..."
    if command -v xdg-open >/dev/null 2>&1; then
        xdg-open "$REPORT_FILE" 2>/dev/null &
    elif command -v open >/dev/null 2>&1; then
        open "$REPORT_FILE" 2>/dev/null &
    elif command -v sensible-browser >/dev/null 2>&1; then
        sensible-browser "$REPORT_FILE" 2>/dev/null &
    fi
    echo "Report available at: $REPORT_FILE"
fi

exit $EXIT_CODE
