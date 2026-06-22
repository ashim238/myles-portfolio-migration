# Navi Live System + Playable Demo — Design Spec

**Date:** 2026-06-19
**Status:** Draft for review
**Topic:** Extend the portfolio with a standalone Navi mini-site — a living design system and a playable product demo, both built from the real Navi Figma file.

---

## 1. Goal

Turn the Navi design system (currently prose + screenshots in the case study) into a **running frontend project**: a standalone Navi mini-site with two halves —

1. **Living design system** — the Navi component library as real, interactive React components with a browsable gallery and a live props playground.
2. **Playable product demo** — a faithful reconstruction of the actual Navi app (discovery feed → search results + map → experience detail), assembled entirely from the components in (1).

The two halves compose into one argument: *"I built the system, then shipped a product on top of it."* This mirrors how the Figma file is actually structured — product screens are assembled from component instances — so the React build is a 1:1 reflection of the source.

**Why this project:** The Navi Figma (`nYimRBXiOSyDbTfAJ4gk8G`) is a production-grade, multi-theme, token-driven design system with a real component library and real product screens. Only a thin slice currently exists in code ([navi-tokens.ts](../../../src/lib/navi-tokens.ts) is 38 lines of color/spacing/string-lists). The gap between Figma and code is the opportunity.

## 2. Source of truth (Figma)

File: `nYimRBXiOSyDbTfAJ4gk8G`.

- **Component library pages:** Avatar, Button, Carousel, Keyline, Label, Modal/Cards, Placeholder, Rating, Tabs, Tooltip, plus Type & Color foundations.
- **Product screens** (on canvases not exposed by the page-list API; navigate by node id):
  - `1860:1529` ("Fleáu") — discovery feed: header, search, category taskbar, card rows, footer; responsive desktop/tablet/mobile + skeleton state.
  - `2763:54126` — **search results + map** (linked by user).
  - `2768:55607` — **experience detail** with Learn · Plan · Go (linked by user).

**Extraction method:** pull exact tokens, specs, copy, and assets per-node via Figma MCP `get_design_context` / `download_assets` at build time. (`get_variable_defs` errors with "nothing selected" in this environment, so extract from component/screen nodes, not the variable API.)

## 3. Product concept (what Navi is)

A local events/experiences discovery + hosting platform (neighborhood-scoped, Airbnb-Experiences-like). Each experience is structured as **Learn · Plan · Go**:
- **Learn** — what it is, host, description, rating.
- **Plan** — what to bring, pre-arrival commitments, impact initiative.
- **Go** — logistics: address + how to get there (subway / Citibike / walk).

Content is real in the Figma (Prospect Park carriage rides, Dancehall party in Brooklyn Junction, bracelet-making in Bed-Stuy; real Brooklyn neighborhoods, prices, ratings). The demo transcribes this real content rather than fabricating.

**Design point of view — regenerative travel made visible.** Navi is a *regenerative* travel platform: experiences route money and attention back into the neighborhoods and communities that host them. In the source Figma this thesis lives almost entirely in copy and IA (the "Impact initiative" inside the detail page's Plan step). The demo elevates it: a glanceable **impact signal** on the card surfaces *what each experience supports or restores* — previewing the detail's Impact initiative — so the regenerative value is legible in the scan, before the click. This is a deliberate, documented enhancement over the source (see §6 `ImpactSignal`, §7), and a core beat of the case-study argument.

## 4. Architecture & IA

### Routes (Next.js App Router, under existing `src/app/work/navi`)

| Route | What it is | Status |
|---|---|---|
| `/work/navi` | Existing editorial case study | Keep; add CTAs into the mini-site |
| `/work/navi/system` | Living design system — gallery + live playground | New |
| `/work/navi/demo` | Discovery feed (entry point) | New |
| `/work/navi/demo/search` | Search results + interactive map | New |
| `/work/navi/demo/experience/[slug]` | Experience detail (Learn/Plan/Go) | New |
| `src/app/work/navi/(minisite)/layout.tsx` | Navi-scoped product chrome (header, footer, mobile tab bar) | New |

### Scoping

All mini-site UI is scoped under a `.nv-ui` root class. Per DESIGN.md's **Neutral Shell Rule** and **Per-Project Accent Rule**, the mini-site carries its own Navi chrome (light surfaces, Darwin-orange brand, Jost/Lato type) and never leaks accent into the portfolio's neutral shell. The case study links *into* the mini-site; it is not reworked.

### File structure

```
src/app/work/navi/
  page.tsx                       (existing case study — add CTAs only)
  (minisite)/layout.tsx          (Navi product chrome, scoped .nv-ui)
  system/page.tsx                (gallery + live playground)
  demo/page.tsx                  (discovery feed)
  demo/search/page.tsx           (results + map)
  demo/experience/[slug]/page.tsx (detail)
src/components/navi/
  ui/        Button, IconButton, Tabs, Card, ExperienceCard, ResultCard,
             BookingCard, Rating, Tag, Label, ImpactSignal, Avatar, SearchInput,
             Accordion, Gallery, Carousel, Tooltip, TabBar, Map, MapPin, Legend
  system/    ComponentGallery, PropPlayground, Specimen
  demo/      FeedView, SearchView, ExperienceView, TransitOptions
src/lib/navi/
  tokens.ts        (expanded from current navi-tokens.ts)
  demo-data.ts     (experiences transcribed from Figma; typed)
src/app/navi-system.css  (or scoped block in globals.css): .nv-ui token vars + component styles
public/projects/navi-demo/  (real photos exported from Figma)
```

## 5. Token foundation

`src/lib/navi/tokens.ts` is the single source of truth, emitted as CSS custom properties under `.nv-ui`.

- **Two-tier model:** primitives (`darwin #F3722C`, `gumball #3A86FF`, `robinson #4A414D`, white, black) → semantic aliases (`--nv-action`, `--nv-text-default`, `--nv-surface`, `--nv-border`, `--nv-focus`, `--nv-error`, `--nv-info`, `--nv-shadow-*`). Components reference semantic tokens only — never raw hex. `--nv-error` and `--nv-info` are introduced to replace the off-palette red asterisk / purple help-icon found in the Figma Label component (see §6.1).
- **Spacing:** existing 4px scale (`3xs`→`3xl`).
- **Type:** Jost (display) + Lato (UI) with the real size/weight ramp from Figma.
- **Radii + shadows:** ported from the Figma alias layer.
- **Single theme for v1** (default Darwin/orange light). The scoped-class structure makes multi-theme a cheap phase-2 add.

### Accessibility correction (decided)

The brand orange fails WCAG 2.2 AA as used in Figma:

| Usage | Figma ratio | Verdict |
|---|---|---|
| White text on `#F3722C` (primary button) | 2.89 | Fails (need 4.5; fails 3.0 large too) |
| Orange text on white (transparent/outline) | 2.89 | Fails |
| Orange focus ring on white | 2.89 | Fails 2.2 non-text 3:1 |
| Gumball blue text / white-on-blue | 3.48 | Fails normal text |

**Resolution:** keep bright `#F3722C` as the brand primitive (large decorative fills, brand moments) and introduce **`--nv-action = #C4541A`** (white-on-it = 4.54, passes both directions) for all interactive text/fills/focus indicators. The correction is **documented in the system showcase** ("source system used bright orange for emphasis; here is the accessible derivation and why") — turning the source flaw into visible systems thinking. Robinson neutral (`9.75` on white) is unchanged.

## 6. Living design system — the `system` page

The **gallery showcases the primitives** — the reusable building blocks, grounded in what the product screens actually use (YAGNI: build the parts the demo exercises, plus the showcase staples): **Button (+ icon button), Tabs, Card, Rating, Tag (category chip), Label (form field), Avatar, SearchInput, Accordion, Gallery/Carousel, Tooltip, MapPin, TabBar.** Note **Tag and Label are distinct components** — Figma "Label" is a form-field label (required/optional/help affordances); the card chip ("Locally-owned"/"Popular") is a "Tag". One **new primitive not in the source Figma** is added: **`ImpactSignal`** — a quiet community/leaf icon + one concrete phrase (the regenerative enhancement, §3). It is a first-class gallery component with documented rationale. The demo-level composites (`ResultCard`, `ExperienceCard`, `BookingCard`, `Map`, `Legend`) are *assembled from* these primitives and live in `ui/` but are demo compositions, not gallery entries — which is exactly the dogfooding point.

Each component:
- Typed props mirroring Figma variants (e.g. `Button({ variant: 'primary'|'transparent'|'outline', size, leadingIcon, trailingIcon, state })`).
- Reads semantic tokens; real hover/focus/disabled states.
- Carries a short a11y note (focus behavior, contrast correction).

The page has two modes:
1. **Gallery** — each component as its full variant×state matrix (the Figma board, but live: hover hovers, focus rings).
2. **Live playground** — segmented controls to flip variant / state / size / icons, watching the component update in real time, with a live props/code readout beside it. Controls are keyboard-operable and reduced-motion safe.

### 6.1 Component-library polish (applied + documented)

A full audit of the in-scope component pages found the library is **structurally strong** — consistent Default/Hover/Disabled/Focus state model, selection encoded by *shape* (fill-vs-ring, underline present/absent) not color alone, clear size scales. The gaps are contrast and a couple of off-palette colors. Decided: apply all; document corrections in the showcase.

| Finding | Severity | Correction |
|---|---|---|
| Orange used as a graphical state indicator across Tabs (underline/focus/hover), Carousel (active dot, progress fill, arrow rings), Avatar (chip outline), Tooltip (link/button), Map pins — all fail WCAG 2.2 3:1 non-text contrast at `#F3722C` | High | **Single cascade:** the `--nv-action #C4541A` token (see §5) fixes all of these at once. Map pins additionally need dark text / stronger fill over imagery |
| **Rating** badge uses a green/yellow/red traffic-light scale with white text — white-on-yellow ~1.5:1 (severe fail), white-on-red borderline; quality conveyed largely by hue | High | **Replace with a single-color (brand) badge + prominent numeral.** Colorblind-safe, passes contrast, removes competing colors from the card |
| **Label** (form field) uses off-palette **red** required asterisk and **purple** help icon — not in the token set | Med | Map to new semantic tokens `--nv-error` (accessible red) and `--nv-info` (blue/defined token) |
| **Green overload** — green means "Locally-owned" Tag, top-of-Rating, and default map pin | Med | Resolved largely by the mono-Rating change; ensure Tag green and pin green are distinct, defined tokens with separate meaning |

The map-pin set is a **defined system** (green = default/current-location; orange = place/price, darkening to brown when selected; Filled/Not-Filled × Selected/Not-Selected) — not an inconsistency. The only fix needed is contrast on the unselected orange pin.

## 7. Playable demo — the `demo` views

A faithful, navigable reconstruction of the real screens, assembled from Section 6 components.

### 7.1 Discovery feed (`/work/navi/demo`)
Header → search → category taskbar (Interactive Tags: Arts & Culture, Community, Cooking, Architecture…) → responsive card grid → footer (real IA from Figma). Entry point into the demo. Each feed card carries the **`ImpactSignal`** (§3) beneath the title.

### 7.2 Search results + map (`/work/navi/demo/search`)
Split view. Left: scannable result list (photo, category tag, title, neighborhood, "Outstanding" rating + review count, price, like, and the **`ImpactSignal`** in the slot freed by demoting the review quote — see §7.6). A sort/toggle control. Right: a **real interactive map** with custom **orange price pins** and a Legend. Filtering by category tag and by search text updates both list and map. Clicking a result (or pin) navigates to the detail view.

### 7.3 Experience detail (`/work/navi/demo/experience/[slug]`)
Photo gallery (hero + thumb grid → lightbox via existing `LightboxProvider`). **Learn · Plan · Go** tabs:
- Learn: description, host (Avatar), rating, and a Learn-level **impact initiative** statement (the full version of the card's `ImpactSignal`) — promoted out of the Plan accordion so the regenerative value is visible up front, not buried.
- Plan: accordion rows (What to bring / Pre-arrival commitments / Impact initiative detail — logistics-level specifics).
- Go: address + transit options (subway / Citibike distance / walk time) with a small location map + pin.
Sticky **booking card**: "From $X", date options, "Reserve now", "Contact organizer". Booking is non-transactional (demo) — selecting a date updates the card; Reserve shows a confirmation state. No real payments/accounts.

### 7.4 Map (decided: real interactive)
Real map library with custom orange price-pin markers and a styled basemap.
- **Recommended library/tiles:** Leaflet + OpenStreetMap raster tiles — no API key, simplest path. Custom pins via `divIcon`. (Alternative: MapLibre GL + MapTiler/Stadia for a more on-brand vector basemap, but requires an API key — defer unless the keyless basemap looks off-brand.)
- Lazy-loaded (client-only) so it doesn't weigh the rest of the mini-site.
- **Accessible equivalent:** the results list carries the same data; map has `aria` labelling and keyboard-reachable pins; map is not the only path to any information.

### 7.5 Demo data
`src/lib/navi/demo-data.ts` — typed experiences transcribed from the real Figma content (title, category, neighborhood, lat/lng, price, rating, reviews, photos, Learn/Plan/Go copy, dates), plus an **`impactInitiative`** field: a short concrete phrase for the card `ImpactSignal` (e.g. "Funds Prospect Park tree care") and a longer statement for the detail's Learn-level impact line. Phrasing follows the writing voice — concrete and specific, no vague impact language. Seed with the experiences present in the Figma; expand to ~8–12 so the feed and map feel populated. Labeled as an illustrative demo dataset.

### 7.6 Screen-level polish (applied + documented)

The Figma screens are faithful to layout, but an audit surfaced design issues that we **correct during implementation and document in the showcase** (same "improve it, show the reasoning" approach as the contrast fix). Decided: apply all.

| Finding | Severity | Correction |
|---|---|---|
| Map **price pins**: white-on-orange over a busy map = sub-3:1 legibility | High | Per-pin treatment beyond the token — dark text or stronger fill/outline so pins stay legible over map imagery |
| **Green overloaded** — same green for the "Outstanding" rating badge *and* the "Locally-owned" category tag (two unrelated meanings) | Med | Split the semantics: rating gets its own treatment; category tags use a distinct/neutral palette |
| ~~Map pins inconsistent across screens~~ — *corrected in §6.1: the pins are a defined system (green = current-location, orange = place/price), not an inconsistency* | — | Contrast fix on the unselected orange pin only (per §6.1) |
| **Alignment break (detail)** — "Where?" heading + address centered and the location map inset narrower, inside an otherwise left-aligned page | Med | Left-align "Where?" to the content column; map spans the content width |
| **Heading + rhythm inconsistency (detail)** — Learn/Plan left-aligned vs "Where?" centered; uneven section spacing | Med | One section-heading style; consistent section gap |
| **Result-row density (search)** — title+location+rating+price+italic review quote stacked per row | Low | Demote the review quote and **replace its slot with the `ImpactSignal`** (§3) — same density, higher-value signal (regenerative impact over a generic quote) |
| **Booking-card hierarchy** — tiny low-contrast date/time/price rows; dates don't read as selectable | Low | Strengthen selected-date affordance + contrast |

Each correction is surfaced in the system showcase as a short before/after note ("source screen did X; corrected to Y because Z").

### 7.7 States to define at build time

Not flaws — gaps to spec via `get_design_context` during implementation: pin hover/selected state, empty-results state, error state. (Loading skeleton already exists in the feed Figma.)

## 8. Cross-cutting

- **Responsive:** all three breakpoints; mobile uses the bottom **TabBar**. Mobile-first per portfolio principle.
- **Motion:** reuse `useRevealOnce` reveal pattern and `LightboxProvider`/`ExpandableImage`; `animejs` (existing dep) for playground + pin transitions. Everything gated by `prefers-reduced-motion: reduce`.
- **Accessibility (WCAG 2.2 AA):** action-orange tokens; corrected focus rings (≥3:1); keyboard-operable tabs/accordion/playground/map; results-list as map equivalent; real descriptive alt text on photos.
- **Assets:** photos exported via Figma `download_assets` to `public/projects/navi-demo/`.

## 9. Verification

No test framework in the repo; verification is preview-driven:
- `preview_*` workflow: start dev server, `preview_snapshot` for structure, `preview_screenshot` for visual proof, `preview_resize` for breakpoints.
- Contrast re-check on shipped tokens (≥4.5 body / ≥3.0 focus & large).
- Keyboard pass (tabs, accordion, playground controls, map pins).
- Reduced-motion pass.
- `npm run validate:content` if demo data flows through the content pipeline.

## 10. Out of scope (phase 2)

- Full 10-component library (Keyline, Placeholder, Modal beyond what the demo uses) — build only when needed.
- Multi-theme switching (Darwin/Garden/Hunter families).
- Figma Code Connect / publish pipeline.
- Real booking/auth/payments.
- MapLibre vector basemap (unless keyless raster looks off-brand).
- A new top-level portfolio "Lab" section (the mini-site lives under `/work/navi` for now).

## 11. Open implementation notes

- Settle the map tile source at build time (keyless Leaflet+OSM recommended; escalate to keyed vector tiles only if needed).
- Enumerate additional Figma states during implementation (loading skeleton, empty results, mobile variants) via `get_design_context`.
- Confirm font availability (Jost, Lato) — add via `next/font` if not already loaded by the shell.
