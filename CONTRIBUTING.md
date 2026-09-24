# Contributing

Guidelines for development, code standards, and pull requests.

## Code standards

1. **TypeScript v7.** Strict types only, targeting ES2022+ modules.
2. **Zero emojis.** Never add emoji characters to code, terminal outputs, reports, documentation, or commits. Use plain text or inline SVGs.
3. **Toolchain.** Run tasks with nub (`nub install`, `nub run typecheck`, `nub run build`).
4. **Performance.** Keep the 3-stage funnel architecture intact. Do not spawn subprocesses for dead proxy filtering.
5. **Commits.** Use Conventional Commits (`feat:`, `fix:`, `perf:`, `docs:`, `chore:`).

## Development setup

```bash
# Clone
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker

# Install dependencies
nub install

# Verify types
nub run typecheck

# Run benchmark test with limit
LIMIT=50 nub update-proxies.ts

# Build release bundle
nub run build
```

## Pull requests

1. Branch from `master`.
2. Run `nub run typecheck` and `nub run build`.
3. Open a PR with benchmark numbers comparing before and after.
