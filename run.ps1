# Proxy Benchmarker - Windows PowerShell Runner
$ErrorActionPreference = "Stop"

$RepoOwner = "Its-Satyajit"
$RepoName = "proxy-benchmarker"
$JsdelivrLatestUrl = "https://cdn.jsdelivr.net/gh/$RepoOwner/$RepoName@latest/dist/proxy-benchmarker.min.mjs"
$JsdelivrMasterUrl = "https://cdn.jsdelivr.net/gh/$RepoOwner/$RepoName@master/dist/proxy-benchmarker.min.mjs"
$ReleaseUrl = "https://github.com/$RepoOwner/$RepoName/releases/latest/download/proxy-benchmarker.min.mjs"
$RawMasterUrl = "https://raw.githubusercontent.com/$RepoOwner/$RepoName/master/dist/proxy-benchmarker.min.mjs"
$RawMainUrl = "https://raw.githubusercontent.com/$RepoOwner/$RepoName/main/dist/proxy-benchmarker.min.mjs"
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

Write-Host "[INFO] Fetching latest benchmark bundle..." -ForegroundColor Gray

$Downloaded = $false

# 1. Download via jsDelivr @latest Release CDN
try {
    Invoke-WebRequest -Uri $JsdelivrLatestUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
    if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
        $Downloaded = $true
        Write-Host "[OK] Downloaded latest release bundle via jsDelivr CDN." -ForegroundColor Green
    }
} catch {
    # 2. Fallback to jsDelivr @master CDN
    try {
        Invoke-WebRequest -Uri $JsdelivrMasterUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
        if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
            $Downloaded = $true
            Write-Host "[OK] Downloaded bundle via jsDelivr CDN." -ForegroundColor Green
        }
    } catch {
        # 3. Fallback to direct GitHub release asset
        try {
            Invoke-WebRequest -Uri $ReleaseUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
            if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
                $Downloaded = $true
                Write-Host "[OK] Downloaded latest release asset from GitHub." -ForegroundColor Green
            }
        } catch {
            # 4. Fallback to raw master branch
            try {
                Invoke-WebRequest -Uri $RawMasterUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
                if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
                    $Downloaded = $true
                    Write-Host "[OK] Downloaded bundle from master branch." -ForegroundColor Green
                }
            } catch {
                # 5. Fallback to raw main branch
                try {
                    Invoke-WebRequest -Uri $RawMainUrl -OutFile $TempFile -UseBasicParsing -MaximumRedirection 5
                    if ((Test-Path $TempFile) -and (Get-Item $TempFile).Length -gt 1000) {
                        $Downloaded = $true
                        Write-Host "[OK] Downloaded bundle from main branch." -ForegroundColor Green
                    }
                } catch {
                    # 6. Check if local dist exists
                    if (Test-Path "./dist/proxy-benchmarker.min.mjs") {
                        $TempFile = "./dist/proxy-benchmarker.min.mjs"
                        $Downloaded = $true
                        Write-Host "[WARN] Using local bundle: ./dist/proxy-benchmarker.min.mjs" -ForegroundColor Yellow
                    }
                }
            }
        }
    }
}

if (-not $Downloaded) {
    Write-Host "[ERROR] Failed to download proxy benchmark bundle." -ForegroundColor Red
    exit 1
}

Write-Host ">> Executing benchmark using $Runtime..." -ForegroundColor Cyan
Write-Host ""

$ExitCode = 0
try {
    switch ($Runtime) {
        "nub"  { & nub $TempFile $args; $ExitCode = $LASTEXITCODE }
        "bun"  { & bun run $TempFile $args; $ExitCode = $LASTEXITCODE }
        "node" { & node $TempFile $args; $ExitCode = $LASTEXITCODE }
        "deno" { & deno run -A $TempFile $args; $ExitCode = $LASTEXITCODE }
        "npx"  { & npx --yes node $TempFile $args; $ExitCode = $LASTEXITCODE }
        "pnpm" { & pnpm exec node $TempFile $args; $ExitCode = $LASTEXITCODE }
        "yarn" { & yarn node $TempFile $args; $ExitCode = $LASTEXITCODE }
        Default { & node $TempFile $args; $ExitCode = $LASTEXITCODE }
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
