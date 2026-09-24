# Proxy Benchmarker & Best Network Finder

A high-performance, modular proxy benchmarking suite in TypeScript v7 designed to find the **best, fastest, and most reliable proxies for your local network** by testing against the **World's Top 50 Global Websites** with an interactive, column-sortable HTML report.

---

## Quick Run (One-Liner)

Fetch the latest release, run the benchmark, and automatically launch the HTML report in your browser:

```bash
curl -fsSL https://raw.githubusercontent.com/Its-Satyajit/proxy-benchmarker/master/run.sh | bash
```

Or using nub:

```bash
nub launcher.ts
```

---

## Key Features

* **TypeScript v7 Architecture**: Strict type definitions, clean interfaces, and modern ESM standard.
* **Three-Stage Turbo Funnel Pipeline**: Tests 26,000+ proxies in **under 1–2 minutes** by first running an ultra-fast non-blocking async TCP socket pre-filter (600 parallel sockets), cutting dead proxies in seconds before invoking curl workers.
* **Stage 1: Async TCP Socket Pre-Filter**: Slices through 26k+ IPs in ~15-20s using direct Node.js non-blocking sockets with zero subprocess overhead.
* **Stage 2: Health & Exit IP Verification**: Deep probes surviving live endpoints with parallel curl workers to determine anonymity, latency, and TTFB.
* **Stage 3: Top 50 Global Websites Benchmark**: Probes real-world connectivity, status codes, TTFB, and latency across top domains:
  * **Search & Infra**: Google, Cloudflare, 1.1.1.1, Microsoft, Apple, Bing, DuckDuckGo, Yahoo
  * **Developers**: GitHub, GitLab, StackOverflow, NPM, Docker Hub, Mozilla, Bitbucket, CDNJS
  * **AI & Next-Gen**: OpenAI, Hugging Face
  * **Media & Streaming**: YouTube, Netflix, Spotify, Twitch, Vimeo, SoundCloud
  * **Social & Comms**: Reddit, Wikipedia, X (Twitter), LinkedIn, Instagram, Discord, Telegram, Slack
  * **E-Commerce & Finance**: Amazon, eBay, PayPal, Stripe, Booking.com, Airbnb
  * **News & Productivity**: BBC, CNN, New York Times, Dropbox, Salesforce, Adobe, Zoom, etc.
* **Usability-Gated Multi-Factor Scoring (0–100 pts)**:
  * Performance is gated by actual **Website Reachability** ($\frac{\text{Websites Passed}}{50}$). Proxies that fail on websites are penalized proportionally, ensuring only functional proxies rank at the top.
* **Interactive Column-Sortable HTML Report (`benchmark-report.html`)**:
  * **Best Proxy Hero Card**: Highlights the #1 ranked candidate for your network with instant copy.
  * **One-Click Copy Top 10**: Copies the Top 10 highest-ranked proxies in `protocol://ip:port` format.
  * **Sortable Columns**: Click any table header to sort ascending/descending.
  * **Real-Time Scoring Sliders**: Adjust weights across all metrics directly in your browser.
  * **Drilldown Sub-Tabs**: View detailed latency breakdown and status codes for all 50 websites and verification endpoints.
  * **Export to CSV / JSON**: Export filtered benchmark data with one click.

---

## How Proxies Are Ranked

Proxies are evaluated using a **Usability-Gated Multi-Factor Weighted Formula (0–100 pts)**:

$$\text{Usability Ratio} = \frac{\text{Websites Passed}}{50}$$

$$\text{Final Score} = (\text{Usability Ratio} \times 50\text{ pts}) + \text{Performance Score (50 pts)} \times \text{Usability Ratio}$$

| Dimension | Max Points | Description |
| :--- | :---: | :--- |
| **Top 50 Sites** | **50 pts** | Direct percentage of reachable global websites. |
| **Avg Latency** | **20 pts** | Average round-trip response time across all successful endpoints (scaled from 0 to 2,500 ms). |
| **Min Latency** | **8 pts** | Peak burst responsiveness across tested services. |
| **Connect Time** | **8 pts** | TCP connection handshake speed. |
| **TTFB** | **7 pts** | Server response initiation time. |
| **Speed** | **7 pts** | Download bandwidth capability (scaled up to 500 KB/s). |
| **Anonymity** | **10 pts** | 10 pts for Elite/Anonymous (masks your local public IP); 0 for Leaking. |

---

## Local Development & Manual Run

### Prerequisites
* **Node.js** (v18+) or **nub**
* **curl**
* **dig** (`bind-utils` or `dnsutils`)

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker

# Install dependencies with nub
nub install

# Type-check TypeScript code
nub run typecheck

# Run the benchmark
nub update-proxies.ts

# Build the minified standalone bundle
nub run build
```

---

## Environment Variables & Tuning

Customize benchmark execution with environment variables:

| Variable | Default | Description |
| :--- | :---: | :--- |
| `TCP_CONCURRENCY` | `600` | Number of concurrent non-blocking TCP socket probes in Stage 1. |
| `TCP_TIMEOUT` | `1200` | Stage 1 TCP socket connection timeout in milliseconds. |
| `CONCURRENCY` | `150` | Number of parallel worker threads in Stage 2 and Stage 3. |
| `CONNECT_TIMEOUT` | `3` | Connection timeout in seconds for curl workers. |
| `TIMEOUT` | `4` | Maximum total timeout per request in seconds. |
| `WEBSITE_TIMEOUT` | `3.5` | Website probe timeout in seconds. |
| `DNS` | `1.1.1.1` | DNS server used for pre-resolving verification endpoints. |
| `LIMIT` | `0` | Test only the first *N* proxies (e.g. `LIMIT=50`). `0` = all. |
| `FULL_BENCHMARK` | `false` | If `true`, tests all 11 verification endpoints per proxy. |
| `BENCHMARK_WEBSITES` | `true` | Set `false` to disable the Top 50 websites benchmark. |

### Example Custom Runs:

```bash
# Test the first 50 proxies with high concurrency
LIMIT=50 CONCURRENCY=150 nub update-proxies.ts

# Custom timeouts for slower connections
TIMEOUT=6 CONNECT_TIMEOUT=4 nub update-proxies.ts
```

---

## Project Architecture

```
├── update-proxies.ts        # Main orchestrator script (TypeScript)
├── launcher.ts              # Launcher script (fetches latest release & opens browser)
├── run.sh                   # One-liner bash runner script
├── tsconfig.json            # TypeScript v7 configuration
├── package.json             # NPM / ES Module config & build scripts
├── src/
│   ├── types.ts             # Strict TypeScript types & interfaces
│   ├── config.ts            # Central configuration & environment variables
│   ├── websites.ts          # Top 50 Global Websites dataset & categories
│   ├── dns.ts               # DNS pre-resolution & local public IP detection
│   ├── csv.ts               # ProxyScrape downloader & RFC4180 CSV parser
│   ├── proxy.ts             # Normalization, deduplication & curl proxy args
│   ├── tester.ts            # Two-phase funnel benchmark & usability scoring
│   ├── reporter.ts          # Interactive HTML report generator & file exporter
│   └── terminal.ts          # ANSI terminal logs & live progress meter
├── dist/
│   └── proxy-benchmarker.min.mjs # Zero-dependency minified bundle (~81 KB)
├── .github/workflows/
│   └── release.yml          # GitHub Actions compile & release automation
├── benchmark-report.html    # Interactive sortable HTML report
├── benchmark-report.json    # Machine-readable JSON telemetry
└── http.txt, https.txt, socks4.txt, socks5.txt # Output proxy lists
```

---

## GitHub Actions Automated Releases

Every push to the `main` or `master` branch automatically:
1. Validates TypeScript types via `tsc --noEmit`.
2. Bundles and minifies the entire project with `esbuild` into `dist/proxy-benchmarker.min.mjs`.
3. Creates a new GitHub Release with the standalone asset.
4. Allows anyone to run the latest benchmark with a single `curl | bash` command!

---

## License

MIT
