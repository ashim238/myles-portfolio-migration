# Navi — Case Study Design Spec

**Date:** 2026-06-14  
**Branch:** `cursor/navi-case-study-design-d5d3` (spec only; implementation TBD)  
**Status:** Awaiting user review before plan generation

---

## 1. Overview

Rebuild the Navi case study as a **custom interactive page** (`/work/navi`) matching the depth and ambition of Fresh Greens and TikTok. The page must feel **alive** (motion, hover, progressive reveal) while proving **systems thinking** (Figma-faithful tokens and components).

The generic markdown-driven `[slug]` page is insufficient: research visuals and the design system need structured data and live UI, not static PNG grids.

**Primary feel:** alive — scroll reveals, animated stats, interactive neighborhood explorer.  
**Secondary feel:** thinks in systems — the design-system showcase is the craft centerpiece.

**Portfolio fit:** Navi gets a scoped visual world (`.nv-page`, Jost/Lato, Darwin orange) inside the existing portfolio shell (`page-shell`, `SiteNav`, `ProjectCover`, `ProjectToc`, `ProjectHighlight`, `ProjectWorkJump`, `ExpandableImage`, lightbox, zoom transition).

---

## 2. Showcase format decision: C over D

Two formats were considered:

| | **C — Showroom → composition** | **D — Scroll-linked assembly** |
|---|---|---|
| **Desktop** | Full specimen grid + editorial strip below | Pinned scroll choreography assembles tokens → components → screen |
| **Tablet** | 2-column grids, horizontal scroll for matrices | Pinning fights split-viewport height; choreography often simplified anyway |
| **Mobile** | Natural vertical stack; matrices become horizontal scroll or accordion | Scroll-jacking conflicts with touch; short viewport breaks pin math; needs a separate static fallback |
| **Reduced motion** | Trivial — static grids, instant values | Must duplicate entire mobile fallback path |
| **Maintenance** | Matches TikTok `SystemOverviewBand` / Fresh Greens patterns | High complexity for one case study |

**Decision: C**, with **D's energy borrowed as progressive enhancement** — not pinned assembly:

- Donut rings animate 0 → value on viewport enter (once)
- Heuristic insight cards stagger in
- Showroom subsections fade up in sequence
- Composition strip uses light parallax on desktop only (`prefers-reduced-motion: no-preference`)

No scroll-pinning. No "mockup assembles from parts" choreography. Same content reads correctly on phone, tablet, and desktop without a degraded alternate layout.

---

## 3. Figma fidelity strategy

**Source files:**

- Tokens + foundations: `https://www.figma.com/design/nYimRBXiOSyDbTfAJ4gk8G/navi?m=dev`
- Published components: `https://www.figma.com/design/nYimRBXiOSyDbTfAJ4gk8G/navi?node-id=1133-3657&m=dev`
  - `fileKey`: `nYimRBXiOSyDbTfAJ4gk8G`
  - `nodeId`: `1133:3657`

**Approach:** Build a **scoped Navi UI kit in React/CSS** that mirrors published Figma components — not an iframe, not a Figma embed. Extract tokens and variant definitions via Figma MCP (preferred) or Dev Mode manual export (fallback).

**Known tokens from `design-specimen.png` (validate against Figma):**

| Token | Value |
|---|---|
| Darwin (primary) | `#F3722C` |
| Gumball | `#3A86FF` |
| Robinson | `#4A414D` |
| White / Black | `#FFFFFF` / `#000000` |
| Spacing base | 4px (`3xs` 2px → `3xl` 128px) |
| Display / UI type | Jost / Lato |

**Components to implement (match Figma published set):**

- Button — Primary / Transparent / Outline × Default / Hover / Disabled / Focus
- Tab item — Selected / Unselected × Default / Hover / Focus / Disabled
- Form fields — Default / Error / Success (email, password, dropdown, textarea)
- Trust labels — e.g. *Locally owned*, *Nature first* (from case study copy)

**Fonts:** load Jost + Lato via `next/font` on the Navi page only. Portfolio chrome keeps Instrument Sans.

**Figma MCP note:** As of spec writing, Figma MCP reports `serverStatus: error` in the cloud agent environment. Implementation should retry MCP at build time; fallback is transcribing variables from Dev Mode into `navi-tokens.ts`.

---

## 4. Page architecture

**Route:** `src/app/work/navi/page.tsx` (static segment, overrides `[slug]` for `navi`).

**Content:** migrate prose from `content/projects/navi.md` into the TSX page (or thin `navi-copy.ts`). Keep `content/projects/navi.md` frontmatter for `getPublishedProjects()` homepage card — `sections: []`, empty body.

### Sticky TOC sections

| # | Section ID | Title | Job |
|---|---|---|---|
| 01 | `nv-intro` | A regenerative travel platform | Problem framing — why NYC tourism needs reframing |
| 02 | `nv-research` | Three user groups, six platforms | Competitive audit + survey context |
| 03 | `nv-insights` | What the data did (and did not) say | Animated survey stats |
| 04 | `nv-framework` | From research to framework | Personas + Learn-Plan-Go |
| 05 | `nv-system` | **Building a system** ★ | **Design-system showroom + composition strip** |
| 06 | `nv-screens` | What it looks like in product | Screen composites — expand images |
| 07 | `nv-heatmap` | Rethinking concentration | Illustrative neighborhood explorer |
| 08 | `nv-outcome` | What Navi proved | Outcome + next steps |

TOC: reuse `ProjectToc` with IntersectionObserver (Fresh Greens / TikTok pattern).

### Page meta header

Matches portfolio case study pattern:

- **Title:** Navi
- **Lede:** from `navi.md` summary
- **Cover:** `ProjectCover` — `/projects/navi/cover.png` (zoom transition target)
- **Meta strip:** Role / Timeframe / Tags
- **Highlight:** 78% concept-test quote (existing `ProjectHighlight`)

---

## 5. Custom interactive artifacts

### 5.1 Heuristic insight cards (replaces `airbnb-audit.png`)

**Position:** Section 02 (`nv-research`).

**Data source:** `content/data/airbnb-heuristic/` (user-provided folder) + PNG fallback.

**Content (from PNG — validate against folder):**

1. **Guest Favorite label overuse** — designation on nearly every listing, no consistent criteria
2. **Minimal kid-friendly or accessibility-specific filters** — crib as only family-facing amenity
3. **Visual clutter and repetitive listings** — minimal differentiation, decision fatigue

**Treatment:** three cards in a responsive row (1-col mobile, 3-col desktop). Icon + headline + body. Stagger fade-up on viewport enter (80ms offset). Hover: subtle lift + border accent (`--nv-accent`). Not a Nielsen 10-row scorecard — the PNG is three synthesized insights.

**Reduced motion:** all cards visible immediately, no stagger.

### 5.2 Survey stat rings (replaces `survey-responses.png`)

**Position:** Section 03 (`nv-insights`).

**Data source:** `content/data/🔍 Reimagining NYC Tourism_ A More Meaningful & Sustainable Experience (Responses).xlsx` — parse at build time into `navi-survey-data.ts`.

**Known highlights (from PNG — XLSX may surface more):**

- 71% — concerned about overcrowding and over-tourism
- 50% — concerned about lack of authentic experiences

**Treatment:** SVG or CSS donut rings. Animate stroke offset 0 → value over ~900ms on viewport enter (once). Large centered percentage + caption below. Mobile: stack vertically. Tablet/desktop: side-by-side.

**Extension:** if XLSX yields additional high-signal stats, add a third ring or a tabbed "Resident priorities" row — cap at 4 visible stats to avoid dashboard creep.

**Reduced motion:** show final values instantly, no stroke animation.

### 5.3 Design-system showroom ★ (replaces `design-specimen.png`)

**Position:** Section 05 (`nv-system`) — **primary craft artifact**.

**Structure (mirrors specimen layout, responsive):**

| Block | Desktop | Tablet | Mobile |
|---|---|---|---|
| Typography | 2×3 grid (Lato/Jost × weights) | 2-col | 1-col stack |
| Color swatches | 5-across row | 3+2 wrap | 2-col grid, copy on tap |
| Spacing scale | vertical table + visual bars | same, narrower | horizontal scroll table OK |
| Buttons | 3×4 matrix | horizontal scroll | horizontal scroll |
| Tabs | 2×4 matrix | horizontal scroll | horizontal scroll |
| Forms | 3-state column (default/error/success) | stack | stack |

**Interactivity:**

- Color swatches: copy hex on click (reuse `ColorPalette` / TikTok swatch pattern)
- Buttons / tabs: **real hover, focus-visible, disabled** states — reader can tab through focus rings
- Forms: static specimens (no submit); error/success are visual states only

**All components built from `navi-tokens.ts` + scoped `.nv-ui-*` classes — not screenshots.**

### 5.4 Composition strip (C format, part 2)

**Position:** directly below showroom, still in Section 05.

**Treatment:** a narrow **editorial homepage slice** assembled from live Navi components:

- Section label in Jost
- 2–3 trust labels (*Locally owned*, *Nature first*)
- One primary CTA button (Darwin orange)
- Optional curated card row (placeholder copy from research — neighborhood name, short descriptor)

**Layout:** desktop = composed strip ~900px wide; mobile = vertical stack. Light cursor parallax on the card row (desktop only, ≤6px, gated on reduced-motion).

**Purpose:** proves the system composes into product UI — the "thinks in systems" payoff without scroll-pin assembly.

### 5.5 Screen composites (keep as expand images for v1)

**Position:** Section 06 (`nv-screens`).

Keep as `ExpandableImage`:

- `desktop-screens.png`
- `interface-composition.png`
- `flow-view-1.png` / `flow-view-2.png` / `flow-view-3.png`

Optional v2: replace one flow view with a live component demo.

### 5.6 Neighborhood heatmap explorer (replaces `heatmap.png`)

**Position:** Section 07 (`nv-heatmap`).

**Data:** illustrative only — not real geo analytics. Neighborhood names + abstract blob regions on a simplified Manhattan silhouette (SVG).

**Treatment:**

- Left (desktop) / top (mobile): scrollable alphabetical neighborhood list
- Right / bottom: SVG map with highlight regions
- **Click list item** → name highlights + corresponding map blob pulses/highlights
- Copy block: "WELCOME TO MANHATTAN" + inclusive history lede (from wireframe intent)

**Responsive:** `grid-template-columns: 1fr 1fr` ≥768px; single column below. Map scales `width: 100%`; list `max-height: 320px` scroll on mobile.

**Reduced motion:** instant highlight swap, no pulse animation.

### 5.7 Personas + final mockup

**Position:** Section 04 personas; Section 08 outcome.

Keep as `ExpandableImage`:

- `persona-cain.png`, `persona-ororo.png`, `persona-selina.png`
- `final-mockup.png`

---

## 6. Motion + interactivity layer

Reuse portfolio patterns:

- Section fade-up on viewport enter (Fresh Greens / TikTok)
- `prefers-reduced-motion: reduce` gates all motion
- Lightbox via `ExpandableImage` for screen composites
- TOC scroll-spy via `ProjectToc`
- Homepage zoom transition settles on `.project-cover-image`

**Navi-specific motion:**

| Element | Motion | Mobile safe? |
|---|---|---|
| Survey donuts | stroke draw once on enter | ✓ |
| Heuristic cards | stagger fade-up | ✓ |
| Showroom blocks | sequential fade-up | ✓ |
| Composition strip | optional micro-parallax | ✓ (disabled <768px) |
| Heatmap | highlight crossfade / soft pulse | ✓ (pulse off with reduced motion) |
| Button/tab matrices | native CSS `:hover` / `:focus-visible` | ✓ (touch = focus tap) |

**Cut:** scroll-pinned assembly (D). Rejected for responsive and maintenance reasons (see §2).

---

## 7. Data layer

```
content/data/
  🔍 Reimagining NYC Tourism_…(Responses).xlsx   ← survey source
  airbnb-heuristic/                              ← heuristic notes/assets

src/lib/navi-tokens.ts        ← Figma variables (colors, spacing, radii, type scale)
src/lib/navi-survey-data.ts   ← generated or hand-transcribed from XLSX
src/lib/navi-heuristic-data.ts
src/lib/navi-heatmap-data.ts  ← illustrative neighborhood list + blob map coords
```

**XLSX parsing:** build-time script or `fs` read in a small `scripts/parse-navi-survey.ts` that emits typed JSON/TS. Do not bundle `openpyxl` in the client.

**Pre-merge requirement:** user must commit + push `content/data/` to the repo.

---

## 8. Implementation file map

| File | Responsibility |
|---|---|
| `src/app/work/navi/page.tsx` | Page shell, section order, prose |
| `src/components/navi.tsx` | Co-located artifacts (showroom, rings, cards, heatmap, composition) |
| `src/lib/navi-tokens.ts` | Design tokens |
| `src/lib/navi-survey-data.ts` | Survey stat values |
| `src/lib/navi-heuristic-data.ts` | Heuristic insight cards |
| `src/lib/navi-heatmap-data.ts` | Neighborhood + SVG region mapping |
| `src/app/globals.css` | `.nv-page`, `.nv-ui-*` scoped styles |
| `content/projects/navi.md` | Frontmatter only for homepage listing |

**Routing:** Next.js static `navi/page.tsx` takes precedence over `[slug]/page.tsx` for `/work/navi`.

---

## 9. Responsive breakpoints

Align with existing portfolio:

- **<640px:** single column, horizontal scroll for button/tab matrices, stacked stats
- **640–1023px:** 2-column where appropriate (personas, stats, showroom type grid)
- **≥1024px:** full specimen layout, side-by-side heatmap, composition strip at content max width

Touch targets ≥44px on interactive swatches and neighborhood list items.

---

## 10. Voice notes

- Register: plain, research-forward. Same voice as existing `navi.md`.
- The design-system section prose should explain *why* Jost/Lato and Darwin orange — link decisions to persona/research needs.
- Heatmap section must disclose illustrative intent in prose: "early concept for how neighborhood context could surface — not live geo data."
- Avoid dashboard/dashboards language; these are **case-study artifacts**, not product analytics.

---

## 11. Build sequence (single PR, ordered commits)

1. **Shell** — `navi/page.tsx`, frontmatter trim, TOC, cover, meta, highlight
2. **Tokens** — `navi-tokens.ts` from Figma; `.nv-page` CSS variables; fonts
3. **Showroom** — typography, color, spacing, buttons, tabs, forms
4. **Composition strip** — editorial slice from live components
5. **Survey rings** — XLSX parse + animated component
6. **Heuristic cards** — data file + stagger component
7. **Heatmap explorer** — SVG + list sync
8. **Screens** — wire remaining `ExpandableImage` blocks; remove replaced PNGs from JSX (keep files in `public/` as fallback assets)

---

## 12. Open questions / pre-implementation checklist

- [ ] Push `content/data/` (XLSX + airbnb-heuristic folder) to remote
- [ ] Figma MCP healthy — extract variables + component property defs from node `1133:3657`
- [ ] Confirm published component list matches Button / Tab / Form / Label set
- [ ] Validate survey XLSX columns — which questions map to the two donut stats?
- [ ] Heuristic folder contents — any detail beyond the three PNG insights?

---

## 13. Out of scope (v1)

- Full navigable Navi product prototype
- Real NYC geo data or Mapbox integration
- Scroll-pinned assembly animation (D)
- Replacing all screen PNGs with live UI
- Code Connect / Figma publish pipeline (unless trivially added later)

---

**Next step after user review:** invoke `writing-plans` → `docs/superpowers/plans/2026-06-14-navi-case-study.md`
