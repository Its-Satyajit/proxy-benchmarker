# Proxy benchmarker

Test, score, and filter free proxy lists by real connection speed, egress anonymity, and reachability across major websites.

The tool downloads candidate proxies from 10 open-source feeds, strips duplicate addresses using a Set, and filters them through a 3-stage funnel in under 90 seconds. It outputs clean proxy lists (`http.txt`, `socks5.txt`), telemetry data (`benchmark-report.json`), and an interactive HTML report.

![Interactive benchmark report](images/benchmark-report.png)

---

## Quick run

You do not need to clone the repository or configure dependencies. The runner detects whatever JavaScript tool you already have installed (nub, bun, node, deno, npx, pnpm, or yarn).

### Linux and macOS

```bash
# Test the full candidate proxy list via jsDelivr CDN
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash

# Safe mode for home and TP-Link routers (low socket count)
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- --safe

# Test a single proxy
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash -s -- socks5://64.227.186.105:1080

# GitHub Raw fallback
curl -fsSL https://raw.githubusercontent.com/Its-Satyajit/proxy-benchmarker/master/run.sh | bash -s -- socks5://64.227.186.105:1080
```

### Windows (PowerShell)

```powershell
# Test full proxy list
irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1 | iex

# Safe mode on Windows
& ([scriptblock]::Create((irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1))) --safe

# Test a single proxy
& ([scriptblock]::Create((irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1))) socks5://64.227.186.105:1080
```

### Local CLI (nub or node)

```bash
# Run full benchmark
nub update-proxies.ts

# Run with custom limit and safe mode
nub update-proxies.ts --safe -n 50

# Benchmark a specific route or file
nub update-proxies.ts socks5://64.227.186.105:1080
nub update-proxies.ts my-proxies.txt
```

---

## Command line options and arguments

Pass options after `--` when using `run.sh` or `run.ps1`, or directly to `nub update-proxies.ts`.

| Option | Description |
| :--- | :--- |
| `--safe` | Low socket footprint profile (35 TCP sockets, 12 workers, 3 site checks). Use this if your home WiFi router freezes or drops connections during scans. |
| `--home` | Default balanced profile (80 TCP sockets, 25 workers, 5 site checks). Suitable for typical home broadband. |
| `--turbo`, `--vps` | High-throughput profile (600 TCP sockets, 150 workers, 15 site checks). Use on cloud servers, VPS instances, or gigabit fiber. |
| `-n <num>`, `--limit <num>` | Test only the first `<num>` proxies from the feed. Example: `-n 50`. |
| `-c <num>`, `--concurrency <num>` | Set the number of parallel curl workers for stage 2 and stage 3. Overrides preset defaults. |
| `--tcp-concurrency <num>` | Set the number of parallel TCP sockets for stage 1 port checks. Overrides preset defaults. |
| `[proxy...]` | One or more proxy URLs to benchmark. Example: `socks5://1.2.3.4:1080 http://5.6.7.8:8080`. |
| `[file...]` | Path to a local text or CSV file containing proxy addresses. |
| `-h`, `--help` | Print help message and exit. |

---

## Environment variables

You can configure any benchmark setting through environment variables.

| Variable | Default | Description |
| :--- | :---: | :--- |
| `PRESET` | `home` | Active concurrency preset (`home`, `safe`, or `turbo`). |
| `LIMIT` | `0` | Maximum candidate proxies to test. `0` tests all discovered proxies. |
| `TCP_CONCURRENCY` | `80` (or `35` with safe) | Parallel non-blocking TCP socket probes in stage 1. |
| `TCP_TIMEOUT` | `1200` | Stage 1 TCP socket connect timeout in milliseconds. |
| `CONCURRENCY` | `25` (or `12` with safe) | Parallel curl worker processes for stage 2 and stage 3. |
| `CONNECT_TIMEOUT` | `3.0` | Connection timeout in seconds for verification endpoints. |
| `TIMEOUT` | `4.0` | Total request timeout in seconds for verification endpoints. |
| `WEBSITE_TIMEOUT` | `4.5` | Total request timeout in seconds for website checks. |
| `WEBSITE_CONNECT_TIMEOUT` | `3.0` | Connection timeout in seconds for website checks. |
| `WEBSITE_CONCURRENCY` | `5` (or `3` with safe) | Concurrent website checks per alive proxy. |
| `DNS` | `1.1.1.1` | DNS server used to pre-resolve verification and website target IPs. |
| `BENCHMARK_WEBSITES` | `true` | Set to `false` to skip the 50-website reachability stage. |
| `FULL_BENCHMARK` | `false` | When `true`, tests every candidate against all 11 verification endpoints instead of stopping after the first working one. |

### Environment variable examples

```bash
# Run safe mode on first 100 proxies
PRESET=safe LIMIT=100 nub update-proxies.ts

# Set manual timeouts and worker counts
CONCURRENCY=20 TCP_CONCURRENCY=50 TIMEOUT=5 nub update-proxies.ts
```

---

## How the pipeline works

Probing tens of thousands of proxy endpoints one by one with curl would spawn too many processes and take hours. The benchmarker uses a 3-stage funnel to discard dead addresses fast.

![CLI terminal execution](images/terminal-execution.png)

1. **Stage 1: Non-blocking TCP port check.** Node.js sockets probe raw candidate IP:port pairs with a 1.2-second timeout. Over 80% of dead candidates drop here in a few seconds without launching subprocesses.
2. **Stage 2: Health and exit IP verification.** Surviving proxies run through curl against pre-resolved verification endpoints (`api.ipify.org`, `icanhazip.com`, etc.) to verify protocol handshakes, measure latency, and detect whether the proxy masks your origin IP.
3. **Stage 3: Global website reachability.** Working proxies test real connections to 53 top web properties (Google, Cloudflare, GitHub, Microsoft, Apple, etc.). If a proxy fails the first batch of sites, it exits early to prevent wasted traffic.

![Website latency and reachability breakdown](images/website-breakdown.png)

---

## Scoring formula

Composite scores range from 0 to 100 points. Web reachability gates the performance score:

$$\text{Usability ratio} = \frac{\text{Websites passed}}{53}$$

$$\text{Final score} = (\text{Usability ratio} \times 50\text{ pts}) + (\text{Performance score} \times \text{Usability ratio})$$

| Metric | Max weight | What it measures |
| :--- | :---: | :--- |
| **Website reachability** | 50 pts | Number of global destinations reached through the proxy. |
| **Average latency** | 20 pts | Round-trip response time (scaled between 0 and 2,500 ms). |
| **Minimum latency** | 8 pts | Fastest single-request round trip. |
| **TCP connect duration** | 8 pts | Transport-layer handshake speed. |
| **TTFB** | 7 pts | Time to first byte from target web servers. |
| **Throughput** | 7 pts | Download transfer rate (scaled up to 500 KB/s). |
| **Anonymity** | 10 pts | Full masking of origin IP awards 10 points. Leaking origin IP awards 0. |

---

## Output files

Every run writes formatted proxy lists and telemetry files to the working directory:

* `http.txt` - Verified HTTP and HTTPS proxies in `protocol://ip:port` format.
* `socks4.txt` - Verified SOCKS4 proxies.
* `socks5.txt` - Verified SOCKS5 proxies.
* `benchmark-report.html` - Interactive single-page report with filters, search, and sorting.
* `benchmark-report.json` - Complete JSON telemetry including per-website latency and HTTP status codes.

### JSON report format

```json
{
  "proxy": { "protocol": "socks5", "ip": "184.178.172.25", "port": 15291, "country": "US" },
  "status": "PASS",
  "compositeScore": 84,
  "anonymity": "ELITE / ANONYMOUS",
  "exitIp": "184.178.172.25",
  "avgLatencyMs": 420,
  "minLatencyMs": 185,
  "avgConnectTimeMs": 95,
  "avgTtfbMs": 280,
  "avgSpeedBps": 184500,
  "websitesPassed": 48,
  "websitesTotal": 53,
  "websiteDetails": [
    { "name": "Google", "domain": "google.com", "ok": true, "httpCode": 204, "totalLatencyMs": 312 }
  ]
}
```

---

## Local setup and build

### Prerequisites

* Node.js v18 or later (or nub)
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

# Build standalone minified bundle
nub run build
```

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
