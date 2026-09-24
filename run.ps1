# Proxy Benchmarker - Windows PowerShell Runner
$ErrorActionPreference = "Stop"

$RepoOwner = "Its-Satyajit"
$RepoName = "proxy-benchmarker"
$ReleaseUrl = "https://github.com/$RepoOwner/$RepoName/releases/latest/download/proxy-benchmarker.min.mjs"
$RawMasterUrl = "https://raw.githubusercontent.com/$RepoOwner/$RepoName/master/dist/proxy-benchmarker.min.mjs"
$TempFile = Join-Path $env:TEMP "proxy-benchmarker-$PID.mjs"
$ReportFile = Join-Path (Get-Location) "benchmark-report.html"

# Verify Node.js is installed
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is required but not installed or not in PATH." -ForegroundColor Red
    Write-Host "Install Node.js from https://nodejs.org or via winget: winget install OpenJS.NodeJS" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Proxy Benchmark Windows Launcher     " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[INFO] Fetching latest bundle from GitHub..." -ForegroundColor Gray

$Downloaded = $false

# 1. Download latest release asset
try {
    Invoke-WebRequest -Uri $ReleaseUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
    if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
        $Downloaded = $true
        Write-Host "[OK] Downloaded release asset." -ForegroundColor Green
    }
} catch {
    # Fallback to raw master branch
    try {
        Invoke-WebRequest -Uri $RawMasterUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
        if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
            $Downloaded = $true
            Write-Host "[OK] Downloaded bundle from master branch." -ForegroundColor Green
        }
    } catch {
        # Check if local dist exists
        if (Test-Path "./dist/proxy-benchmarker.min.mjs") {
            $TempFile = "./dist/proxy-benchmarker.min.mjs"
            $Downloaded = $true
            Write-Host "[WARN] Using local bundle: ./dist/proxy-benchmarker.min.mjs" -ForegroundColor Yellow
        }
    }
}

if (-not $Downloaded) {
    Write-Host "[ERROR] Failed to download proxy benchmark bundle." -ForegroundColor Red
    exit 1
}

Write-Host ">> Executing Benchmark..." -ForegroundColor Cyan
Write-Host ""

$ExitCode = 0
try {
    & node $TempFile $args
    $ExitCode = $LASTEXITCODE
} catch {
    $ExitCode = 1
}

# Cleanup temp file
if ($TempFile -ne "./dist/proxy-benchmarker.min.mjs" -and (Test-Path $TempFile)) {
    Remove-Item $TempFile -Force -ErrorAction SilentlyContinue
}

# Auto-open HTML report in default browser
if ($ExitCode -eq 0 -and (Test-Path $ReportFile)) {
    Write-Host ""
    Write-Host "[INFO] Opening HTML Benchmark Report in your browser..." -ForegroundColor Cyan
    Start-Process $ReportFile
    Write-Host "Report available at: $ReportFile" -ForegroundColor Gray
}

exit $ExitCode
