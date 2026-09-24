# Contributing to Proxy Benchmarker

Thank you for your interest in contributing to Proxy Benchmarker.

## Code Standards & Guidelines

1. **TypeScript v7**: All code is written in strict TypeScript targeting ES2022+ modules.
2. **Zero-Emoji Policy**: Do not use emoji characters anywhere in code, terminal outputs, reports, documentation, or commit messages. Use clean ANSI formatting, text indicators, or inline SVGs.
3. **Toolchain**: Use `nub` for running and building:
   - Install dependencies: `nub install`
   - Run typecheck: `nub run typecheck`
   - Test script: `nub update-proxies.ts`
   - Build minified bundle: `nub run build`
4. **Performance First**: Maintain the 3-stage funnel pipeline architecture. Do not introduce blocking operations or heavyweight subprocesses for dead proxy filtering.
5. **Clean Commits**: Write clear, descriptive Conventional Commits (e.g., `feat:`, `fix:`, `perf:`, `docs:`, `chore:`).

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Its-Satyajit/proxy-benchmarker.git
cd proxy-benchmarker

# Install dependencies
nub install

# Verify type safety
nub run typecheck

# Run benchmark test with limit
LIMIT=50 nub update-proxies.ts

# Build release bundle
nub run build
```

## Pull Request Process

1. Create a feature or bugfix branch.
2. Ensure `nub run typecheck` and `nub run build` pass without errors.
3. Submit a Pull Request with a clear summary of changes and benchmark numbers.
