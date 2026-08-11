# Myles 98 Five-Icon Refinement

## Status

Approved design scope. Implementation and full-sheet approval remain pending.

## Purpose

Refine the five Myles 98 pixel-icon concepts that remain visually or semantically weaker at native size, without reopening the approved 48-master family or starting production integration. The work responds to an independent six-lens review of the final master package. It is a targeted hierarchy and metaphor correction, not a style reset.

## Baseline

- Baseline master-package commit: `fe1cb29d434a234475bdefc55ce0f1e11f473bdf`.
- The checked-in candidate is on `codex/myles-97-design`, currently synchronized with its remote.
- All masters retain exact `16`, `24`, and `32` pixel grids, integer coordinates, `shape-rendering="crispEdges"`, fully opaque fills, a transparent perimeter, and independently authored optical sizes.
- Existing non-target master concepts remain frozen for this pass.

## Scope

Only these masters may change:

- `docs/design-assets/myles98-icons/masters/resume/resume-{16,24,32}.svg`
- `docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-{16,24,32}.svg`
- `docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-{16,24,32}.svg`
- `docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-{16,24,32}.svg`
- `docs/design-assets/myles98-icons/masters/navi/navi-{16,24,32}.svg`

The manifest, icon contract tests, contact sheet, review evidence, and the existing family specification may update only to express and verify these approved refinements. Production icon-renderer code, all live callsites, layouts, case-study content, and visual chrome are explicitly out of scope.

## Shared constraints

- Preserve the late-1990s desktop dialect: pixel-banded near-black contours, upper-left light, object-specific depth, warm and cool neutral ramps, and no smooth-vector or generic-extrusion treatment.
- Preserve the approved no-brand rule. Do not introduce logos, proprietary toy-brick proportions, TikTok marks, or a Microsoft asset trace.
- Preserve a single immediately recognizable noun at 16px. At larger tiers, add subordinate material or context cues only after the noun reads.
- No clipping, perimeter contact, antialiasing, gradients, filters, opacity, transforms, text, masks, or nested SVGs.
- The visual density must move toward the family center without flattening the stronger period-authentic icons.

## Icon decisions

### Resume

The primary noun remains a professional profile sheet. The 16px document remains the simplest tier. At 24px and 32px, reduce the blue paperclip to the upper-right quadrant by roughly one quarter, keep one clear inner opening, and prevent it from visually bracketing the page. The blue header and document structure must remain the first read.

### Loose Parts

The primary noun remains three generic construction blocks in a compact pyramid. Preserve the brand-neutral, stud-free construction. Replace front-facing-tile shading with clearly stepped volume: each block needs a visible top or side plane, a small perspective offset, and material-like face hierarchy. The cluster must not read as dashboard tiles, color swatches, LEGO, food, or a table.

### Reset Desktop

The primary noun remains a CRT desktop. Replace the paired, full-width opposing arrows with one compact stepped restart-cycle cue that is subordinate to the CRT. It must read as reset or restart rather than swap, transfer, sync, or reload-browser. Keep a recognizably period-specific CRT silhouette at every tier.

### Fresh Greens

The primary noun remains a route through a place. Keep the solid square map tile, not a folded-map or device silhouette. Replace the heavy orthogonal trace with an asymmetrical stepped road that includes at least one diagonal or non-rectangular bend. Start and destination must differ in geometry as well as color. At 24px and 32px, add at most one restrained street or neighborhood-boundary cue. It must not read as circuitry, a PCB, or a maze.

### Navi

The primary noun remains a location pin above a separate neighborhood storefront. Preserve the pin-above-store composition already approved by Myles. At 24px, restore the orange pin center, reduce the inter-object gap to one pixel, and make the pin tail direct attention to the awning. At 24px and 32px, widen the storefront roughly 15–20 percent while reducing unnecessary shop detail. The pin and store must read as one destination relationship without becoming a shop inside a pin, an open book, or two unrelated stacked icons.

## Out of scope and locks

- TikTok Catalog remains the standalone shopping-bag icon with no catalog page, cursor, TikTok mark, music note, or social-app framing.
- UnderstandingFAFSA remains the newsletter-and-shallow-pocket metaphor.
- Selected Work, Display Properties, Reminders, Start, Email, Notes, About Myles, Open Apps, Generic App, and all other masters are locked unless a regression test proves this five-icon work affects them.
- Do not change the current visible program naming as part of this master pass. The later production-integration plan covers the potential `Buss Up Shut.txt` to `Notes.txt` presentation rename separately.

## Acceptance evidence

1. Every changed master passes the source, XML, integer-grid, binary-alpha, perimeter, exact topology, palette, and no-forbidden-element contracts.
2. Regenerate the canonical contact sheet deterministically and record its new aggregate master, HTML, and rendered PNG hashes.
3. Render all five concepts at native 16px, 24px, and 32px on teal `#008080`, system gray `#c0c0c0`, and white, plus nearest-neighbor enlargement for construction review.
4. Run a fresh, clean-context recognition review that identifies the intended noun before being told the filename. Historical pre-simplification blind-review JSON remains archival evidence only.
5. Run informed pixel-grid, period-fidelity, and family-consistency reviews on the exact regenerated candidate. They must bind their findings to the new hashes and report P0/P1/P2 separately from optional P3 notes.
6. Do not begin production integration until Myles explicitly approves the regenerated full sheet.

## Definition of done

The revised master package has a new exact candidate hash, all source and visual gates are green, the five concepts satisfy their noun-specific criteria, no locked master regresses, and Myles has been shown the resulting exact full contact sheet for a fresh approval decision.
