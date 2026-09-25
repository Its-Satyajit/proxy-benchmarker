# Proxy benchmarker

Test, score, and filter public proxy lists by connection speed, egress IP, and reachability.

## Quick run

The default preset is `safe` (500 candidates, 35 TCP sockets, 12 verification workers, 4 website workers, 16 concurrent curl processes).

### Linux and macOS

```bash
# Default safe run (pinned bundle, ref v1.0.44)
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash

# Larger home run: 2,000 candidates, 80 TCP sockets, 64 concurrent curl
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- --home

# VPS run: 1,500 TCP sockets, 1,500 concurrent curl
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- --turbo

# Test a single proxy
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- socks5://64.227.186.105:1080

# Pin a different ref (tag, branch, or commit SHA)
PROXY_BENCHMARKER_REF=master curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash

# GitHub Raw fallback for the script itself
curl -fsSL https://raw.githubusercontent.com/Its-Satyajit/proxy-benchmarker/master/run.sh | bash
```

### Windows (PowerShell)

```powershell
# Default safe run
irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1 | iex

# Larger home run
& ([scriptblock]::Create((irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1))) --home

# Test a single proxy
& ([scriptblock]::Create((irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1))) socks5://64.227.186.105:1080
```

### Local CLI

```bash
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker
nub install

# Default (safe) run
nub update-proxies.ts

# Presets
nub update-proxies.ts --safe
nub update-proxies.ts --home
nub update-proxies.ts --turbo

# Overrides (validated: 0, negatives, and NaN are rejected)
nub update-proxies.ts -n 200 --tcp-concurrency 20 --concurrency 8
nub update-proxies.ts --website-workers 4 --max-curl 16

# 0 = unlimited candidates
nub update-proxies.ts --limit 0

# Verify TLS certificates instead of permissive transport probing
nub update-proxies.ts --strict-tls

# Benchmark a specific proxy or local file
nub update-proxies.ts socks5://64.227.186.105:1080
nub update-proxies.ts my-proxies.txt

# Type-check, test, and build the standalone bundle
nub run typecheck
nub run test
nub run build
```

### What the report means

- `Egress IP` is a comparison of the observed exit IP with your origin IP. It is not an anonymity claim; header leaks such as `X-Forwarded-For` are not measured.
- Website columns report `passed/attempted` alongside `websitesAvailable`, so an early-exit sweep is not read as "all 53 targets failed".
- `performanceSource` tells you whether latency and throughput came from website probes or, when no website succeeded, from egress verification.
- TLS is permissive by default (`curl --insecure`) so broken certificates still measure transport reachability. Use `--strict-tls` to measure real HTTPS connectivity.

## CI

`CI` (`.github/workflows/ci.yml`) runs typecheck, the test suite, a fresh build, and fails if the committed `dist/proxy-benchmarker.min.mjs` is stale.

`Release Minified Bundle` (`.github/workflows/release.yml`) publishes `dist/proxy-benchmarker.min.mjs` as a tagged release asset, which is what `run.sh`/`run.ps1` pin to.

The benchmark workflow is temporarily disabled. Its definition is retained at:

```text
.github/workflows/update-proxies.yml.disabled
```

To re-enable it, rename the file back to `update-proxies.yml`. It builds the bundle from source before running it.
