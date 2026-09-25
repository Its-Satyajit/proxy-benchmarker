# Proxy benchmarker

Test, score, and filter public proxy lists by connection speed, anonymity, and reachability.

## Quick run

### Linux and macOS

```bash
# Test the full candidate proxy list
curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash

# Safe mode for home routers
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

# Safe mode
& ([scriptblock]::Create((irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1))) --safe

# Test a single proxy
& ([scriptblock]::Create((irm https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.ps1))) socks5://64.227.186.105:1080
```

### Local CLI

```bash
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker
nub install

# Run a full benchmark
nub update-proxies.ts

# Run with a limit and safe preset
nub update-proxies.ts --safe -n 50

# Turbo uses 1,500 TCP sockets and 300 workers
nub update-proxies.ts --turbo

# Benchmark a specific proxy or local file
nub update-proxies.ts socks5://64.227.186.105:1080
nub update-proxies.ts my-proxies.txt

# Type-check and build the standalone bundle
nub run typecheck
nub run build
```

## CI

The benchmark workflow is temporarily disabled. Its definition is retained at:

```text
.github/workflows/update-proxies.yml.disabled
```

To re-enable it, rename the file back to `update-proxies.yml`. The regular typecheck and release workflows remain enabled.
