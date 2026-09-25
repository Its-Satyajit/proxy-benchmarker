# Proxy benchmarker

Test, score, and filter free proxy lists by real connection speed, egress IP, and reachability across major websites.

The tool downloads candidate proxies from 10 open-source feeds, strips duplicate addresses using a Set, and filters them through a 3-stage funnel. It outputs clean proxy lists (`http.txt`, `socks5.txt`), telemetry data (`benchmark-report.json`), and an interactive HTML report.

![Interactive benchmark report](images/benchmark-report.png)

The default preset is `safe`, so a first run stays small: 500 candidates, 35 TCP sockets, 12 verification workers, 4 website workers, and at most 16 concurrent `curl` processes.

---

## Quick run

You do not need to clone the repository or configure dependencies. The runner detects whatever JavaScript tool you already have installed (nub, bun, node, deno, npx, pnpm, or yarn) and downloads one pinned bundle, so repeated runs are reproducible.

### Linux and macOS

```bash
# Default safe run (downloads the bundle pinned in run.sh)
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash

# Larger home run: 2,000 candidates, 80 TCP sockets, 64 concurrent curl
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- --home

# VPS run: 1,500 TCP sockets, 300 verification workers, 1,500 concurrent curl
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- --turbo

# Test a single proxy
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- socks5://64.227.186.105:1080

# Pin a different bundle ref (tag, branch, or commit SHA)
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

# Pin a different bundle ref
$env:PROXY_BENCHMARKER_REF = "master"
irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1 | iex
```

---

## Command line options and arguments

Pass options after `--` when using `run.sh` or `run.ps1`, or directly to `nub update-proxies.ts`. Every numeric option rejects `0`, negatives, and non-numeric values instead of silently falling back to a default.

| Option | Description |
| :--- | :--- |
| `--safe` | Default gentle profile: 500 candidates, 35 TCP sockets, 12 verification workers, 4 website workers x 3 probes, 16 concurrent curl. Use this on budget routers, guest WiFi, or metered connections. |
| `--home` | Home profile: 2,000 candidates, 80 TCP sockets, 25 verification workers, 8 website workers x 5 probes, 64 concurrent curl. |
| `--turbo`, `--vps` | High-throughput profile: unlimited candidates, 1,500 TCP sockets, 300 verification workers, 100 website workers x 25 probes, 1,500 concurrent curl. Use on VPS or gigabit fiber. |
| `--preset=<name>` | Same as the flags above, e.g. `--preset=turbo`. |
| `-n <num>`, `--limit <num>` | Test only the first `<num>` candidates. `0` means no cap. |
| `-c <num>`, `--concurrency <num>` | Stage 2 egress-verification workers. |
| `--tcp-concurrency <num>` | Stage 1 parallel TCP socket probes. |
| `--website-workers <num>` | Stage 3 proxies benchmarked in parallel. |
| `--max-curl <num>` | Global ceiling on concurrent `curl` processes across every stage. |
| `--strict-tls` | Verify TLS certificates. Without it, HTTPS reachability is measured permissively (`curl --insecure`). |
| `[proxy...]` | One or more proxy URLs to benchmark, e.g. `socks5://1.2.3.4:1080 http://5.6.7.8:8080`. |
| `[file...]` | Path to a local text or CSV file containing proxy addresses. |
| `-h`, `--help` | Print help and exit. |

---

## Environment variables

Any benchmark setting can come from the environment. Resolution order is **preset defaults -> environment -> CLI flags**, and every value is validated before the first stage starts.

| Variable | Default | Description |
| :--- | :---: | :--- |
| `PRESET` | `safe` | Active preset (`safe`, `home`, `turbo`). |
| `SAFE` / `TURBO` | `false` | Boolean shortcuts for `PRESET=safe` / `PRESET=turbo`. |
| `LIMIT` | `500` (`safe`) | Candidate cap. `0` tests every discovered candidate. |
| `TCP_CONCURRENCY` | `35` (`safe`) | Parallel non-blocking TCP socket probes in stage 1. |
| `TCP_TIMEOUT` | `1500` | Stage 1 TCP connect timeout in milliseconds. |
| `CONCURRENCY` | `12` (`safe`) | Stage 2 egress-verification workers. |
| `WEBSITE_WORKERS` | `4` (`safe`) | Stage 3 proxies benchmarked in parallel. |
| `WEBSITE_CONCURRENCY` | `3` (`safe`) | Website probes per proxy, per batch. |
| `MAX_CURL_PROCESSES` | `16` (`safe`) | Hard ceiling on concurrent `curl` child processes. |
| `CONNECT_TIMEOUT` | `3.0` | Connection timeout in seconds for verification endpoints. |
| `TIMEOUT` | `4.5` | Total request timeout in seconds for verification endpoints. |
| `WEBSITE_TIMEOUT` | `5.0` | Total request timeout in seconds for website checks. |
| `WEBSITE_CONNECT_TIMEOUT` | `3.5` | Connection timeout in seconds for website checks. |
| `TLS_VERIFY` | `false` | `true` enables strict certificate validation. |
| `DNS` | `1.1.1.1` | DNS resolver used to pre-resolve verification and website targets. |
| `DNS_RETRIES` | `2` | Retries when pre-resolving a target hostname. |
| `BENCHMARK_WEBSITES` | `true` | `false` skips the website reachability stage. |
| `FULL_BENCHMARK` | `false` | `true` tests every candidate against all 11 verification endpoints instead of stopping at the first success. |

### Environment variable examples

```bash
# Safe preset on the first 100 candidates
PRESET=safe LIMIT=100 nub update-proxies.ts

# Explicit limits and timeouts
CONCURRENCY=20 TCP_CONCURRENCY=50 MAX_CURL_PROCESSES=40 TIMEOUT=5 nub update-proxies.ts

# Strict TLS everywhere
TLS_VERIFY=true nub update-proxies.ts
```

---

## How the pipeline works

Probing tens of thousands of proxy endpoints one by one with curl would spawn too many processes and take hours. The benchmarker uses a 3-stage funnel to discard dead addresses fast, then scores what survives. Every stage prints its effective worker count, and a global curl cap keeps real process usage inside the configured ceiling.

![CLI terminal execution](images/terminal-execution.png)

1. **Stage 1: Non-blocking TCP port check.** Node.js sockets probe raw `ip:port` pairs with a short timeout. Most dead candidates drop here in seconds without launching subprocesses. Worker count = `TCP_CONCURRENCY`.
2. **Stage 2: Egress verification.** Surviving proxies race the top two verification endpoints (`api.ipify.org`, `api64.ipify.org`, ...) through curl. The first success wins, the losing curl is cancelled, and the worker waits for the cancellation to settle before taking the next proxy. Worker count = `CONCURRENCY`.
3. **Stage 3: Website reachability.** Working proxies test real connections to 53 web properties (Google, Cloudflare, GitHub, Microsoft, Apple, etc.) in batches. A proxy that fails its first batch exits early, and the report records that early exit instead of implying all 53 targets were tried. Workers = `WEBSITE_WORKERS`, probes per worker = `WEBSITE_CONCURRENCY`.
4. **Stage 4: Scoring and telemetry.** Each survivor is scored, ranked, and written to the report files.

![Website latency and reachability breakdown](images/website-breakdown.png)

---

## Scoring formula

Composite scores range from 0 to 100 points. Website reachability gates the performance score, so a fast proxy that cannot reach real sites cannot win:

$$\text{Usability ratio} = \frac{\text{Websites passed}}{\text{Websites available}}$$

$$\text{Final score} = (\text{Usability ratio} \times 50\text{ pts}) + (\text{Performance score} \times \text{Usability ratio})$$

| Metric | Max weight | What it measures |
| :--- | :---: | :--- |
| **Website reachability** | 50 pts | Share of the 53 global destinations reached through the proxy. |
| **Average latency** | 20 pts | Round-trip response time (scaled between 0 and 2,500 ms). |
| **Minimum latency** | 8 pts | Fastest single-request round trip. |
| **TCP connect duration** | 8 pts | Transport-layer handshake speed. |
| **TTFB** | 7 pts | Time to first byte from target web servers. |
| **Throughput** | 7 pts | Download transfer rate (scaled up to 500 KB/s). |

There is no anonymity component, because header-level anonymity is not measured. See below.

The HTML report's ranking sliders default to these exact weights, so the browser score matches the score in the JSON until you move a slider.

### What the report does and does not claim

- **Egress IP** compares the observed exit IP with your origin IP: `DIFFERENT_EGRESS_IP`, `SAME_EGRESS_IP`, or `UNKNOWN`. It is not an anonymity verdict. Header leaks such as `X-Forwarded-For`, `Via`, and `Forwarded` are not probed, so no "elite/anonymous" label is shown anywhere.
- **Egress probes** report `endpointsStarted`, `endpointsCompleted`, and `endpointsPassed`. A fast check launches two probes but usually keeps one result, and the pass rate is computed over completed probes.
- **Websites** report `websitesPassed / websitesAttempted` alongside `websitesAvailable` and `websitesEarlyExit`, so an early-exit sweep is not read as "all 53 targets failed".
- **performanceSource** tells you whether latency and throughput came from website probes or, when no website succeeded, from egress verification. Egress latency is always reported separately as `egressVerificationLatencyMs`.
- **TLS mode** is `permissive` by default (broken certificates still count as transport reachability) and is recorded in the report's `run` metadata. Use `--strict-tls` to measure real HTTPS connectivity.

---

## Output files

Every run writes formatted proxy lists and telemetry files to the working directory. They are generated artifacts and are not tracked in git:

* `http.txt` - Verified HTTP proxies in `protocol://ip:port` format.
* `https.txt` - Verified HTTPS proxies.
* `socks4.txt` - Verified SOCKS4 proxies.
* `socks5.txt` - Verified SOCKS5 proxies.
* `benchmark-report.html` - Interactive single-page report with search, filters, sortable columns, and adjustable ranking weights.
* `benchmark-report.json` - Complete telemetry including the run configuration, per-endpoint results, and per-website latency and HTTP status codes.

### JSON report format

```json
{
  "generatedAt": "2026-09-25T16:11:18.870Z",
  "run": {
    "preset": "safe",
    "tlsVerification": "permissive",
    "maxCurlProcesses": 16,
    "tcpConcurrency": 35,
    "verificationWorkers": 12,
    "websiteWorkers": 4,
    "websiteConcurrency": 3
  },
  "stats": { "total": 60, "completed": 60, "passed": 30, "failed": 30, "durationSeconds": 461.1 },
  "benchmarks": [
    {
      "proxy": { "protocol": "socks5", "ip": "184.178.172.25", "port": 15291, "country": "US" },
      "status": "PASS",
      "compositeScore": 67,
      "scoreBreakdown": { "websites": 39, "avgLatency": 11, "minLatency": 5, "connectTime": 6, "ttfb": 3, "speed": 2 },
      "exitIp": "184.178.172.25",
      "egressStatus": "DIFFERENT_EGRESS_IP",
      "verificationStrategy": "fast",
      "endpointsStarted": 2,
      "endpointsCompleted": 1,
      "endpointsPassed": 1,
      "endpointsTotal": 11,
      "endpointPassRatePercent": 100,
      "websitesAvailable": 53,
      "websitesAttempted": 53,
      "websitesPassed": 41,
      "websitePassRatePercent": 77.4,
      "websitesEarlyExit": false,
      "performanceSource": "websites",
      "egressVerificationLatencyMs": 430,
      "avgLatencyMs": 703,
      "minLatencyMs": 198,
      "maxLatencyMs": 2077,
      "medianLatencyMs": 620,
      "avgConnectTimeMs": 38,
      "avgTtfbMs": 569,
      "avgSpeedBps": 217683,
      "websiteDetails": [
        { "name": "Google", "domain": "google.com", "ok": true, "httpCode": 204, "totalLatencyMs": 312 }
      ]
    }
  ]
}
```

---

## Local setup and build

### Prerequisites

* Node.js v20 or later (or nub)
* curl

### Commands

```bash
# Clone
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker

# Install
nub install

# Type-check
nub run typecheck

# Run the test suite (config, parsers, metrics, curl gate, report parity)
nub run test

# Build standalone minified bundle
nub run build

# Benchmark directly from source
nub update-proxies.ts
nub update-proxies.ts --turbo
nub update-proxies.ts socks5://64.227.186.105:1080
nub update-proxies.ts my-proxies.txt
```

---

## CI

- **`CI`** (`.github/workflows/ci.yml`) installs dependencies, type-checks, runs the test suite, rebuilds the bundle, and fails if the committed `dist/proxy-benchmarker.min.mjs` is stale. Source and shipped bundle can never drift apart.
- **`Release Minified Bundle`** (`.github/workflows/release.yml`) publishes the freshly built bundle as a tagged release asset. Those tags are what `run.sh` and `run.ps1` pin to.
- **Benchmark + Pages publishing** is temporarily disabled. Its definition is retained at `.github/workflows/update-proxies.yml.disabled`; rename it back to `update-proxies.yml` to re-enable it. It installs dependencies, type-checks, tests, and builds from source before running the benchmark, so it never executes a stale bundle.

---

## Upstream proxy feeds and credits

Candidate proxy discovery aggregates and deduplicates data across 10 open-source repositories:

* [proxifly/free-proxy-list](https://github.com/proxifly/free-proxy-list) - Live CSV dataset with protocol and country metadata.
* [ProxyScrape/free-proxy-list](https://github.com/ProxyScrape/free-proxy-list) - HTTP, HTTPS, SOCKS4, and SOCKS5 lists.
* [hproxy-com/free-proxy-list](https://github.com/hproxy-com/free-proxy-list) - Multi-protocol verified candidate CSVs.
* [proxmint/free-proxy-list](https://github.com/proxmint/free-proxy-list) - Unified protocol URI endpoint lists.
* [proxio-io/proxy-list](https://github.com/proxio-io/proxy-list) - Global candidate endpoint lists.
* [iplocate/free-proxy-list](https://github.com/iplocate/free-proxy-list) - Worldwide proxy route feeds.
* [databay-labs/free-proxy-list](https://github.com/databay-labs/free-proxy-list) - Dedicated HTTP, SOCKS4, and SOCKS5 feeds.
* [monosans/proxy-list](https://github.com/monosans/proxy-list) - Frequently updated proxy lists.

### Infrastructure and tooling

* [jsDelivr](https://www.jsdelivr.com) for edge CDN delivery and GitHub proxying.
* [cURL](https://curl.se) for network transport probes.
* [Iconify](https://iconify.design) for UI vector icons.
* [Nub](https://nubjs.com) for Node toolchain execution.
* [esbuild](https://esbuild.github.io) for bundling.
* IP verification services: Cloudflare, Google DNS, `api.ipify.org`, `icanhazip.com`, `ifconfig.me`, `ifconfig.co`, `ident.me`, `checkip.amazonaws.com`, `ip.me`, `api.my-ip.io`, `ipinfo.io`, `myexternalip.com`.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for code standards and pull request workflows.

---

## Security

See [SECURITY.md](SECURITY.md) for vulnerability reports and public proxy safety guidelines.

---

## License

MIT. See [LICENSE](LICENSE).
