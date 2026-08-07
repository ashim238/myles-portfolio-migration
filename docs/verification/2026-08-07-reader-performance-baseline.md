# Reader performance baseline and budgets

**Measured:** 2026-08-07
**Branch:** `codex/reader-evidence-grammar`
**Build:** Next.js production build on the Reader verification workflow
**Enforcement file:** `docs/verification/reader-performance-budgets.json`

## Measurement boundary

The CI script reads each case-study route's generated Next.js client-reference manifest and totals its unique uncompressed JavaScript and CSS files. This is a stable regression signal for route-level client assets. It is not a network-transfer estimate because production compression, caching, and shared chunks change what a browser actually downloads.

The script writes the complete file inventory to `.next/reader-performance-report.json` and fails the workflow when a route exceeds any byte or file-count limit.

## Baseline and enforced headroom

| Route | Baseline total | Baseline JS | Baseline CSS | Files | Enforced total | Enforced JS | Enforced CSS | File limit |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Fresh Greens | 352.5 KiB | 129.8 KiB | 222.8 KiB | 8 | 406 KiB | 150 KiB | 257 KiB | 10 |
| Navi | 445.7 KiB | 221.3 KiB | 224.4 KiB | 9 | 513 KiB | 255 KiB | 259 KiB | 11 |
| UnderstandingFAFSA | 365.8 KiB | 144.1 KiB | 221.7 KiB | 7 | 421 KiB | 166 KiB | 255 KiB | 9 |
| TikTok | 342.6 KiB | 118.6 KiB | 224.0 KiB | 8 | 394 KiB | 137 KiB | 258 KiB | 10 |

The byte budgets provide approximately 15 percent headroom, rounded up to the next kibibyte. Each route may add at most two client assets before the file-count gate requires an explicit review.

## Loading policies protected by source contracts

- Each case study has one priority lead surface with intrinsic dimensions, protecting first-paint geometry.
- Non-lead evidence imagery remains responsive and should not become eager without a documented LCP reason.
- The Navi demo iframe loads lazily on desktop.
- Mobile and iframe-error paths use a static product-screen fallback rather than activating the embedded app.
- The TikTok selection proof is text, CSS, and existing typed data. The full image-heavy comparison stays in the following Build chapter instead of being duplicated.

## Field targets

The release targets are:

- Largest Contentful Paint: at or below 2.5 seconds.
- Cumulative Layout Shift: at or below 0.1.

These targets require a deployed browser or field measurement. CI does not claim them from asset bytes alone. The build gate controls route growth; the deployed performance review remains a separate release observation.

## Change-control rule

A route that exceeds a budget must identify the new asset, the claim or interaction it serves, and why an existing proof cannot carry the same job. Raising a budget without that review is not an acceptable fix.
