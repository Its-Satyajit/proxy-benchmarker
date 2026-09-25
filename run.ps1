# Proxy Benchmarker - Windows PowerShell Runner
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$CliArgs
)

$ErrorActionPreference = "Stop"

$RepoOwner = "Its-Satyajit"
$RepoName = "proxy-benchmarker"
# Pinned so `irm | iex` runs one immutable bundle.
# Override with $env:PROXY_BENCHMARKER_REF to track a tag, branch or commit.
$BundleRef = if ($env:PROXY_BENCHMARKER_REF) { $env:PROXY_BENCHMARKER_REF } else { "v1.0.49" }
$JsdelivrUrl = "https://cdn.jsdelivr.net/gh/$RepoOwner/$RepoName@$BundleRef/dist/proxy-benchmarker.min.mjs"
$ReleaseUrl = "https://github.com/$RepoOwner/$RepoName/releases/download/$BundleRef/proxy-benchmarker.min.mjs"
$RawUrl = "https://raw.githubusercontent.com/$RepoOwner/$RepoName/$BundleRef/dist/proxy-benchmarker.min.mjs"
$TempFile = Join-Path $env:TEMP "proxy-benchmarker-$PID.mjs"
$ReportFile = Join-Path (Get-Location) "benchmark-report.html"

function Get-JsRuntime {
    if (Get-Command nub -ErrorAction SilentlyContinue) { return "nub" }
    if (Get-Command bun -ErrorAction SilentlyContinue) { return "bun" }
    if (Get-Command node -ErrorAction SilentlyContinue) { return "node" }
    if (Get-Command deno -ErrorAction SilentlyContinue) { return "deno" }
    if (Get-Command npx -ErrorAction SilentlyContinue) { return "npx" }
    if (Get-Command pnpm -ErrorAction SilentlyContinue) { return "pnpm" }
    if (Get-Command yarn -ErrorAction SilentlyContinue) { return "yarn" }
    return $null
}

$Runtime = Get-JsRuntime
if (-not $Runtime) {
    Write-Host "[ERROR] No JavaScript runtime detected (nub, bun, node, deno, npx, pnpm, yarn)." -ForegroundColor Red
    Write-Host "Install Node.js or Bun:" -ForegroundColor Yellow
    Write-Host "  winget install OpenJS.NodeJS" -ForegroundColor Gray
    Write-Host "  irm https://bun.sh/install.ps1 | iex" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Proxy Benchmark & Network Telemetry   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[INFO] Fetching pinned benchmark bundle (ref: $BundleRef)..." -ForegroundColor Gray

$Downloaded = $false

# 1. jsDelivr CDN for the pinned ref
try {
    Invoke-WebRequest -Uri $JsdelivrUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
    if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
        $Downloaded = $true
        Write-Host "[OK] Downloaded bundle via jsDelivr CDN (ref $BundleRef)." -ForegroundColor Green
    }
} catch {
    # 2. GitHub release asset for the pinned ref
    try {
        Invoke-WebRequest -Uri $ReleaseUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
        if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
            $Downloaded = $true
            Write-Host "[OK] Downloaded release asset for $BundleRef." -ForegroundColor Green
        }
    } catch {
        # 3. raw.githubusercontent.com for the pinned ref
        try {
            Invoke-WebRequest -Uri $RawUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
            if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
                $Downloaded = $true
                Write-Host "[OK] Downloaded bundle for $BundleRef from raw.githubusercontent.com." -ForegroundColor Green
            }
        } catch {
            # 4. Check if local dist exists
            if (Test-Path "./dist/proxy-benchmarker.min.mjs") {
                $TempFile = "./dist/proxy-benchmarker.min.mjs"
                $Downloaded = $true
                Write-Host "[WARN] Using local bundle: ./dist/proxy-benchmarker.min.mjs" -ForegroundColor Yellow
            }
        }
    }
}

if (-not $Downloaded) {
    Write-Host "[ERROR] Failed to download bundle for ref '$BundleRef'." -ForegroundColor Red
    Write-Host "        Set PROXY_BENCHMARKER_REF to an existing tag, branch or commit." -ForegroundColor Yellow
    exit 1
}

Write-Host ">> Executing benchmark using $Runtime..." -ForegroundColor Cyan
Write-Host ""

$AllArgs = if ($CliArgs -and $CliArgs.Count -gt 0) { $CliArgs } else { $args }
$ExitCode = 0
try {
    switch ($Runtime) {
        "nub"  { & nub $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        "bun"  { & bun run $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        "node" { & node $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        "deno" { & deno run -A $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        "npx"  { & npx --yes node $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        "pnpm" { & pnpm exec node $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        "yarn" { & yarn node $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
        Default { & node $TempFile @AllArgs; $ExitCode = $LASTEXITCODE }
    }
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
    Write-Host "[INFO] Opening HTML benchmark report in your browser..." -ForegroundColor Cyan
    Start-Process $ReportFile
    Write-Host "Report available at: $ReportFile" -ForegroundColor Gray
}

exit $ExitCode
