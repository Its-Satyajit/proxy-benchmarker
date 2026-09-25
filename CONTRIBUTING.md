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

Releases are automatic. On any push to `master` that touches source, the `Release Minified Bundle` workflow:

1. Installs dependencies, type-checks, runs the test suite, and builds `dist/proxy-benchmarker.min.mjs`.
2. Publishes a tagged release (`v1.0.<run number>`) with that bundle as an asset.
3. Commits the same bundle back into `dist/` on `master` and moves the pinned runner ref forward in `run.sh` and `run.ps1` to the tag it just published.
4. Dispatches `CI` on that commit, because a push made with the default `GITHUB_TOKEN` does not start other workflows on its own.

So the pin is never stale and `/dist` on `master` always matches the released artifact. The sync commit touches only `run.sh`, `run.ps1`, and `dist/`, which the release workflow ignores, so it cannot re-trigger itself.

If a release fails partway, re-run the workflow. The steps are idempotent: the pin is rewritten to the same value and the sync step exits early when there is nothing to commit.

For an emergency manual override, users can point the runner at any ref without changing the repository:

```bash
PROXY_BENCHMARKER_REF=master curl -fsSL https://cdn.jsdelivr.net/gh/Its-Satyajit/proxy-benchmarker@master/run.sh | bash
```
