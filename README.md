# Proxy benchmarker

Asynchronous network telemetry and proxy benchmarking suite. Measures TCP handshake latency, TLS negotiation, Time to First Byte (TTFB), transfer throughput, and reachability across 50 global edge endpoints.

A 3-stage non-blocking pipeline evaluates 26,000+ candidate routes in under 90 seconds, outputting normalized proxy configurations (`http.txt`, `socks5.txt`), machine-readable JSON telemetry (`benchmark-report.json`), and an interactive client-side report.

![Interactive benchmark report](images/Screenshot_20260925_003102.png)

---

## Quick run

### Linux & macOS

```bash
curl -fsSL https://raw.githubusercontent.com/Its-Satyajit/proxy-benchmarker/master/run.sh | bash
```

### Windows (PowerShell)

```powershell
irm https://raw.githubusercontent.com/Its-Satyajit/proxy-benchmarker/master/run.ps1 | iex
```

### Cross-platform (nub / node)

```bash
nub launcher.ts
```

---

## Pipeline architecture

Probing tens of thousands of network endpoints with individual subprocesses creates massive CPU and process spawn bottlenecks when 85%+ of candidates are unreachable. This suite uses a tiered funnel to maximize throughput:

![CLI terminal execution](images/Screenshot_20260925_002844.png)

1. **Asynchronous TCP socket pre-filter (600 parallel sockets).** Connects directly to candidate IP:port pairs using non-blocking Node.js sockets (1.2s timeout). Eliminates closed ports and unroutable hosts in ~15 seconds without spawning curl processes.
2. **Protocol handshake and egress verification (150 parallel workers).** Probes surviving endpoints to measure TCP connect duration, TLS negotiation time, TTFB, and exit IP leak detection against the local network origin.
3. **Global edge transit benchmark.** Evaluates real-world HTTP/HTTPS reachability, status code return distributions, and latency across 50 major web properties and content delivery networks.

![Website latency and reachability breakdown](images/Screenshot_20260925_003321.png)

---

## Scoring model

Composite route quality scores range from 0 to 100 points, gated by edge reachability:

$$\text{Usability ratio} = \frac{\text{Websites passed}}{50}$$

$$\text{Final score} = (\text{Usability ratio} \times 50\text{ pts}) + (\text{Performance score} \times \text{Usability ratio})$$

| Telemetry dimension | Max weight | Metric details |
| :--- | :---: | :--- |
| **Edge reachability** | 50 pts | Proportion of 50 global destinations successfully reached. |
| **Average latency** | 20 pts | Round-trip response time (scaled 0 to 2,500 ms). |
| **Minimum latency** | 8 pts | Peak single-request responsiveness. |
| **TCP connect time** | 8 pts | Transport-layer handshake duration. |
| **TTFB** | 7 pts | Time to first byte from target server. |
| **Throughput bandwidth** | 7 pts | Transfer rate (scaled to 500 KB/s). |
| **Egress anonymity** | 10 pts | 10 pts for full masking of origin public IP; 0 for direct leak. |

---

## Local development

### Requirements
* Node.js v18+ or nub (Linux, macOS, Windows)
* curl (standard on Linux, macOS, Windows 10/11)

### Commands

```bash
# Clone
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker

# Install dependencies
nub install

# Type-check
nub run typecheck

# Run benchmark
nub update-proxies.ts

# Build standalone minified bundle
nub run build
```

---

## Environment variables

| Variable | Default | Details |
| :--- | :---: | :--- |
| `TCP_CONCURRENCY` | `600` | Parallel TCP socket checks in stage 1. |
| `TCP_TIMEOUT` | `1200` | Socket timeout in milliseconds. |
| `CONCURRENCY` | `150` | Parallel curl workers for stages 2 and 3. |
| `CONNECT_TIMEOUT` | `3` | Connection timeout in seconds. |
| `TIMEOUT` | `4` | Total request timeout in seconds. |
| `WEBSITE_TIMEOUT` | `3.5` | Website check timeout in seconds. |
| `DNS` | `1.1.1.1` | Resolver for endpoint IPs. |
| `LIMIT` | `0` | Number of proxies to test (0 = all). |
| `FULL_BENCHMARK` | `false` | Tests all 11 verification endpoints when true. |
| `BENCHMARK_WEBSITES` | `true` | Enables 50-site reachability test. |

### Example runs

```bash
# Quick test on first 50 proxies
LIMIT=50 nub update-proxies.ts

# Fast scan on unstable network
TIMEOUT=5 CONNECT_TIMEOUT=3 nub update-proxies.ts
```

---

## Telemetry and metrics

Every run writes granular JSON telemetry to `benchmark-report.json`:

```json
{
  "proxy": { "protocol": "socks5", "ip": "185.87.255.54", "port": 1080, "country": "DE" },
  "status": "PASS",
  "compositeScore": 84,
  "anonymity": "ELITE / ANONYMOUS",
  "exitIp": "185.87.255.54",
  "avgLatencyMs": 420,
  "minLatencyMs": 185,
  "avgConnectTimeMs": 95,
  "avgTtfbMs": 280,
  "avgSpeedBps": 184500,
  "websitesPassed": 48,
  "websitesTotal": 50,
  "websiteDetails": [
    { "name": "Google", "domain": "google.com", "ok": true, "httpCode": 204, "totalLatencyMs": 312 }
  ]
}
```

---

## Project layout

```
├── update-proxies.ts        # Main benchmark orchestrator
├── launcher.ts              # Fetches release and opens browser
├── run.sh                   # Shell runner
├── tsconfig.json            # TypeScript v7 config
├── package.json             # Scripts and metadata
├── src/
│   ├── types.ts             # Type definitions
│   ├── config.ts            # Options and defaults
│   ├── websites.ts          # 50 target websites list
│   ├── dns.ts               # DNS resolution and public IP check
│   ├── csv.ts               # Proxifly free-proxy-list downloader and CSV parser
│   ├── proxy.ts             # Normalization and curl arguments
│   ├── tester.ts            # 3-stage funnel engine
│   ├── reporter.ts          # HTML report builder and file exporter
│   └── terminal.ts          # ANSI terminal output
├── dist/
│   └── proxy-benchmarker.min.mjs # Standalone bundle
├── .github/workflows/
│   └── release.yml          # Automated release workflow
├── benchmark-report.html    # Interactive HTML report
├── benchmark-report.json    # Full JSON telemetry
└── http.txt, https.txt, socks4.txt, socks5.txt # Filtered proxy lists
```

---

## Automated releases

Pushes to `master` trigger `.github/workflows/release.yml`, which runs `tsc --noEmit`, bundles `dist/proxy-benchmarker.min.mjs` via esbuild, and publishes a tagged release with auto-generated notes.

---

## Upstream projects and data sources

* [proxifly/free-proxy-list](https://github.com/proxifly/free-proxy-list) for raw proxy list data.
* [cURL](https://curl.se) for network probing.
* [Iconify](https://iconify.design) for SVG vector icons.
* [Nub](https://nubjs.com) for Node toolchain execution.
* [esbuild](https://esbuild.github.io) for bundling.
* Verification endpoints: Cloudflare, Google DNS, icanhazip.com, ifconfig.co, ipify.org, ip-api.com, seeip.org, myip.la.

---

## Contributing

See [CONTRIBUTING.md](file:///home/satyajit/Desktop/proxies/CONTRIBUTING.md) for setup and code standards.

---

## Security

See [SECURITY.md](file:///home/satyajit/Desktop/proxies/SECURITY.md) for vulnerability reports and public proxy safety notes.

---

## License

MIT. See [LICENSE](file:///home/satyajit/Desktop/proxies/LICENSE).
