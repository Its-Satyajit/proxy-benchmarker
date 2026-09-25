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

# Run the test suite
nub run test

# Run benchmark test with limit
LIMIT=50 nub update-proxies.ts

# Build release bundle
nub run build
```

## Pull requests

1. Branch from `master`.
2. Run `nub run typecheck`, `nub run test`, and `nub run build`.
3. Commit the rebuilt `dist/proxy-benchmarker.min.mjs` with the source change. CI fails if it is stale.
4. Open a PR with benchmark numbers comparing before and after.

## Cutting a release

`run.sh` and `run.ps1` pin an immutable release ref so `curl | bash` is reproducible, which means the pin has to move forward after every release. The release workflow tags automatically on push to `master`, so a release exists as soon as that workflow is green.

```bash
# 1. Confirm the release workflow published a tag for the commit you landed
gh release list --limit 1

# 2. Point the runner at that tag in both scripts
#    run.sh:  BUNDLE_REF="${PROXY_BENCHMARKER_REF:-v1.0.46}"
#    run.ps1: $BundleRef = if ($env:PROXY_BENCHMARKER_REF) { $env:PROXY_BENCHMARKER_REF } else { "v1.0.46" }

# 3. Update README.md if it mentions a specific version

# 4. Commit and land; CI verifies the pinned ref actually resolves
```

The `Verify Pinned Runner Ref` CI step requests the pinned bundle from jsDelivr and fails the build when the pin does not resolve, so a forgotten bump is caught before users hit it.
