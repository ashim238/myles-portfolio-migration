# Navi Case Study — Implementation Plan

**Date:** 2026-06-14  
**Spec:** `docs/superpowers/specs/2026-06-14-navi-case-study-design.md`  
**Branch:** `cursor/navi-case-study-impl-d5d3`

---

## Goal

Replace the markdown-driven `/work/navi` page with a custom interactive case study matching Fresh Greens / TikTok depth: live design-system showroom, animated survey stats, heuristic insight cards, and an illustrative heatmap explorer — all inside the existing portfolio shell.

## Prerequisites (done)

- [x] Spec merged (#7)
- [x] `content/data/` on `main` (survey XLSX + heuristic HTML/images)
- [x] Shared `ExpandableImage` on case-study components (#6)

## Build sequence

### Phase 1 — Shell + routing
- Add `src/app/work/navi/page.tsx` (static route overrides `[slug]`)
- Trim `content/projects/navi.md` to frontmatter-only (`sections: []`)
- Page shell: `SiteNav`, breadcrumb, hero, `ProjectCover`, meta, `ProjectHighlight`, `ProjectToc`, `ProjectWorkJump`
- `data-project-slug="navi"` + `.nv-page` scope
- Load Jost + Lato via `next/font` on this page only

### Phase 2 — Data layer
- `src/lib/navi-tokens.ts` — colors, spacing, radii, type scale (spec values; Figma MCP validation optional)
- `src/lib/navi-survey-data.ts` — 71% overcrowding, 50% authentic experiences (from XLSX, n=14)
- `src/lib/navi-heuristic-data.ts` — 3 synthesized insight cards
- `src/lib/navi-heatmap-data.ts` — neighborhood list + SVG blob region ids

### Phase 3 — Interactive artifacts (`src/components/navi.tsx`)
- `HeuristicInsightCards` — stagger fade-up on enter
- `SurveyStatRings` — SVG donut draw animation (once)
- `DesignSystemShowroom` — typography, swatches (copy hex), spacing, button/tab matrices, form states
- `CompositionStrip` — trust labels + CTA + curated cards; micro-parallax desktop only
- `HeatmapExplorer` — list ↔ SVG highlight sync

### Phase 4 — Remaining sections
- Personas + Learn-Plan-Go prose in `nv-framework`
- Screen composites via `ExpandableImage` in `nv-screens`
- Outcome + `final-mockup.png` in `nv-outcome`

### Phase 5 — Styles
- `src/app/globals.css` — `.nv-page`, `.nv-ui-*`, showroom grids, motion gates

### Phase 6 — Verify
- `npm run build`
- Manual: TOC scroll-spy, reduced-motion, expand images, homepage zoom to cover

## Survey stat mapping (XLSX col 10)

| Stat | Calculation | Value |
|------|-------------|-------|
| Overcrowding concern | responses selecting "Overcrowding & over-tourism" | 71% (10/14) |
| Authentic experiences | responses selecting "Lack of authentic experiences" | 50% (7/14) |

## Out of scope (v1)

- Scroll-pinned assembly
- Real geo / Mapbox
- Full 12-row heuristic table UI
- Replacing all screen PNGs with live UI

## Success criteria

- `/work/navi` serves custom page, not `[slug]` markdown renderer
- Design-system section uses live React components, not `design-specimen.png`
- Survey + heuristic PNGs replaced by interactive artifacts
- Responsive at <640, 640–1023, ≥1024
- `prefers-reduced-motion` disables animations
