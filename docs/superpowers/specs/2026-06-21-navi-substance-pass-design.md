# Navi mini-site substance pass

**Date:** 2026-06-21
**Status:** Design approved, pending written-spec review
**Scope:** `/work/navi/(minisite)/*` — the playable Navi demo. Does not touch the case study writeup pages or the live-system page.

## Why

The Navi mini-site reads well at first scroll but lacks weight on repeat visits. The feed, the experience detail page, and the booking flow all work, but the platform feels like a shell. This pass adds three new product surfaces (host pages, neighborhood guides, an impact ledger), reworks the filter row into a slide-over panel, fixes sitewide spacing rhythm, and expands per-listing photography. The thesis: a portfolio mini-site earns more credit by showing the product compounding on itself than by adding polish to existing surfaces alone.

Substance choices, in priority order:

1. **Product substance, primary.** Real product surfaces a visitor can navigate between.
2. **Craft substance, secondary.** Spacing rhythm, micro-state in the booking flow, motion that signals state, considered empty states.

## Out of scope

- Authentication. No "Sign in" / "Save trip" flows. The case-study scope is browse + book, not account management.
- Real payment integration. Booking stays a demo confirmation.
- Server-side data. All experience data continues to live in `src/lib/navi/demo-data.ts`.
- Search infrastructure. Existing client-side filtering is enough at 37 experiences.
- The TikTok case study. Remains hidden per project memory.

## Constraints

- Voice: no em-dashes, no semicolons, no ellipses, no `--`, contractions throughout. No banned hype words.
- Components: reuse the existing `nv-*` design tokens and `nv-ui`-scoped CSS variables. Do not introduce new CSS systems.
- Tests: existing 117 tests stay green. Each new page gets a smoke test (renders, no crashes, key elements present).
- Routing: client components only; no server actions. Next 16 App Router with `React.use()` to unwrap async `params`.
- Photos: stored as local files under `/public/projects/navi-demo/` with attribution in the README. No hot-linking Unsplash.
- Accessibility: WCAG AA. The slide-over uses focus-trap, ESC-to-close, `role="dialog"`, and `aria-modal="true"`.

## Architecture overview

```
/work/navi/(minisite)/
├── demo/                          (existing — feed)
│   └── page.tsx                   ← slice 1: filter row + slide-over
├── demo/experience/[slug]/        (existing — detail)
│   └── page.tsx                   ← link out to host + neighborhood pages
├── demo/host/[slug]/              (slice 2 — NEW)
│   └── page.tsx
├── demo/neighborhood/[slug]/      (slice 3 — NEW)
│   └── page.tsx
└── demo/impact/                   (slice 4 — NEW)
    └── page.tsx
```

Data shape changes in `src/lib/navi/demo-data.ts`:
- `host: { name: string }` → `host: { slug: string; name: string; bio: string; neighborhood: string; yearsHosting: number; responseRate: number; avatarSrc?: string }`
- `neighborhood: string` → `neighborhood: { slug: string; name: string; borough: string; intro: string }`
- New field per experience: `impactTheme: ImpactTheme` (union of ~5 string literals)

Two new data accessors next to the existing `getExperienceBySlug`:
- `getHostBySlug(slug)` returns the host plus their experiences
- `getNeighborhoodBySlug(slug)` returns the neighborhood plus its experiences and the hosts based there
- `getImpactSummary()` returns experiences grouped by `impactTheme`

## Slice 1 — Filter row, slide-over, spacing

### Layout

The current feed has two separate stacked rows: a category chip rail and a `nv-feed-controls` row with two `<select>`s and a "Clear filters" button. The new layout collapses them into a single row at ≥768px with a vertical divider separating the chip rail from the sort + filters cluster.

At ≥768px:

```
┌─────────────────────────────────────────────────────────────┐
│ [←] [All] [Arch] [Arts] [Cook] … [→] │ Sort ▾  ⚙ Filters(3) │
└─────────────────────────────────────────────────────────────┘
```

At ≤640px: chip rail keeps its full-width row; Sort and Filters stack below as a two-button row (`Filters` becomes 50% width, `Sort` 50% width). On `<400px` the result-count row collapses under the chip rail.

### Sort

Sort remains a native `<select>`. Keyboard-native, zero JS, accessible by default. Options unchanged: Recommended / Top rated / Price low-high / Price high-low.

### Filters slide-over

Trigger: a button with a gear icon and label "Filters". Shows a count badge when filters are active (`active-count > 0`). Click opens a slide-over panel:

- Desktop (≥768px): 420px wide, anchored right, full viewport height, slides in 200ms ease-out.
- Mobile (≤640px): full-width bottom sheet, slides up from `100vh` to `min(640px, 85vh)`.

Panel contents:

| Section | Control |
|---|---|
| Price | Four toggle pills (Any, Under $30, $30 to $60, Over $60) |
| Duration | Three toggle pills (Under 2h, Half day, Full day) — derived from existing `duration` strings |
| Group size | Three toggle pills (Solo, Small, Large) — derived from existing `groupSize` strings |
| Language | Multi-select chips (English, Spanish, Mandarin, Greek, ASL) — derived from existing data |
| Neighborhood | Multi-select chips (all distinct neighborhoods present in current results) |

Footer: `Clear all` (text button, left) and `Show N experiences` (primary action, right). N updates live as filters change inside the panel. The primary action commits filters and closes the panel. Pressing ESC discards changes since open and closes.

Focus-trap: focus moves to the close button on open and is constrained inside the dialog until close. Returns to the trigger button on close.

### Spacing pass

The fix is standardization on existing `--nv-sp-*` tokens, not a global "add more padding". Audit Navi surfaces, replace ad-hoc px values, set a consistent vertical rhythm.

Rule of thumb:
- Section-to-section vertical gap: `var(--nv-sp-xl)` (32px)
- Heading-to-body gap: `var(--nv-sp-md)` (16px)
- Card-internal padding: `var(--nv-sp-sm)` to `var(--nv-sp-md)`
- Inline-control gap: `var(--nv-sp-xs)` (8px)

Targeted offenders (from session audit):
- Feed `<header>` to categories rail
- Detail `nv-detail-head` to `nv-detail-body`
- BookingCard internal padding
- Reviews block top margin
- Map container vertical offset

No new tokens. If a value cannot be expressed with the existing scale, that is feedback to revisit the scale, not a license to hard-code.

### System reconciliation

The system page currently shows three components that the demo doesn't use: `Tabs` (orphaned by last session's anchored-sections refactor on the detail page), `CarouselArrow`, and `PaginationDots` (defined and exported but never wired). The Gallery component is a static 1-hero + 4-thumb grid with no carousel state. The system page underrepresents what the demo actually does. Reconcile in this slice:

- **Build a real Gallery carousel.** Gallery becomes a swipe-and-arrow carousel on the hero photo (thumbs stay as a quick-jump strip below). Wires `CarouselArrow` and `PaginationDots` into a real demo surface. Arrow keys + swipe + dot clicks all advance the hero. Respect `prefers-reduced-motion` (no transitions, instant swap).
- **Extract the pill-row primitive that Tabs and the sticky section nav share.** The detail page's sticky `<nav>` of pill buttons looks identical to `Tabs` but is semantically different (it's navigation, not a tablist — all sections are always visible). Rather than treat one as canonical and the other as the orphan, factor the shared styling into a single primitive (a `.nv-pill-row` CSS class plus a thin presentational `PillRow` component for layout/keyboard handling). Both `Tabs` and the new sticky-section-nav consume it. The system page documents the primitive once, then shows the two compositions built on it:
    - **Tabs (APG tablist pattern)** — for when only one panel is visible at a time. Keeps `role="tablist"`, `role="tab"`, `role="tabpanel"`, `aria-selected`. Arrow-keys-move-focus keyboard pattern.
    - **Sticky section nav (anchor pattern)** — for when sections are stacked and the nav scrolls you to them. Uses `role="navigation"`, `aria-current="true"` on the active pill. Plain tab-through keyboard pattern.
  
  Refactor `Tabs` to consume `PillRow` and verify its tests still pass. Refactor the detail-page sticky nav (already added last session) to consume the same primitive. No visual change expected — the goal is one source of truth for the pill-row styling.
- **Document the chip rail.** The category rail with edge-fade and chevron buttons is a real composition the demo uses. Add a system-page specimen for it so it's part of the documented system.

Out of scope: documenting Gallery itself on the system page (it's a demo-data composition, not a primitive). Out of scope: a TabBar pattern decision — same orphan status as Tabs's old framing but lower priority; leave as is for this slice.

## Slice 2 — Host pages

### Route

`/work/navi/demo/host/[slug]`

### Page layout

```
┌────────────────────────────────────────────┐
│ ← Back to experience                       │
│                                            │
│ [Avatar lg]  Paul Stein                    │
│              Park Slope, Brooklyn          │
│              Hosting for 5 years • 97% reply│
│                                            │
│ Bio paragraph (3–4 sentences). What they  │
│ do, what they care about, what's local    │
│ about their practice.                      │
│                                            │
│ ★ 4.9 average across 87 reviews            │
│                                            │
│ ── Experiences from Paul Stein ──          │
│ [ExperienceCard] [ExperienceCard]          │
│ [ExperienceCard]                           │
│                                            │
│ Based in [Park Slope, Brooklyn →]          │
└────────────────────────────────────────────┘
```

### Components reused

- `Avatar` (existing `nv-ui`) at `size="lg"` for the header
- `Rating` (existing) for the aggregate
- `ExperienceCard` (existing) for the experiences grid
- Feed grid CSS (`.nv-feed-grid`) for layout

### Data

`host: { slug, name, bio, neighborhood, yearsHosting, responseRate, avatarSrc? }` — populated from the existing experience list. One host can run multiple experiences; slug-ify `name` to derive the host slug. Hosts without an `avatarSrc` fall back to the existing `Avatar` initials view.

### Cross-links

- Experience detail page: `Hosted by Paul Stein` becomes a link to `/work/navi/demo/host/paul-stein`
- Neighborhood page (slice 3): "Hosts based here" row links to each host page
- Host page footer: neighborhood label links to `/work/navi/demo/neighborhood/[slug]`

## Slice 3 — Neighborhood pages

### Route

`/work/navi/demo/neighborhood/[slug]`

### Page layout

```
┌────────────────────────────────────────────┐
│ ← Back to results                          │
│                                            │
│ Park Slope                                 │
│ Brooklyn                                   │
│                                            │
│ Narrative intro paragraph (2–3 sentences).│
│ What's the character, who lives here, why │
│ does local-led matter here specifically.  │
│                                            │
│ [Mini-map with all markers]                │
│                                            │
│ ── Experiences in Park Slope ──            │
│ [ExperienceCard] [ExperienceCard]          │
│ [ExperienceCard]                           │
│                                            │
│ ── Hosts based here ──                     │
│ [Avatar] [Avatar] [Avatar] [Avatar]        │
└────────────────────────────────────────────┘
```

### Components reused

- `Map` (existing dynamic component) — center on neighborhood centroid, zoom 14
- `ExperienceCard` for the grid
- `Avatar` (size `md`) for the hosts row
- Reuses feed-grid CSS

### Data

`neighborhood: { slug, name, borough, intro }`. Slug-ify each distinct neighborhood string already present in the data (one-time data migration in `demo-data.ts`, not a runtime slugifier). Write a 2–3 sentence narrative `intro` for each distinct neighborhood. Voice rules apply: no em-dashes, contractions throughout.

Centroid for the map: average of `lat`/`lng` across experiences in the neighborhood. Naive but acceptable at NYC-neighborhood scale (a few square blocks per neighborhood).

### Cross-links

- Experience detail page: neighborhood label in the address block becomes a link
- Feed card: neighborhood pill becomes a link
- Host page: footer neighborhood label links here

## Slice 4 — Impact ledger + photo expansion

### Route

`/work/navi/demo/impact`

### Themes

Each experience gets one of these `impactTheme` values (one-time migration in `demo-data.ts`):

- `heritage` — neighborhood preservation, oral histories, archives
- `education` — STEM, arts education, language preservation
- `food-security` — community kitchens, gardens, food sovereignty
- `environment` — parks, waterways, urban ecology
- `arts-funding` — galleries, makers, performing arts

Themes derived by reading each experience's existing `impactStatement` and tagging by closest fit. No invented themes.

### Page layout

```
┌────────────────────────────────────────────┐
│ Where bookings go                          │
│                                            │
│ Methodology paragraph. Honest about what's │
│ measured (the impact strings on each       │
│ experience) and what isn't (no dollar      │
│ amounts in this view).                     │
│                                            │
│ ── Heritage preservation ──                │
│ 8 experiences contribute. ImpactSignals    │
│ rendered as a list.                        │
│ [ExperienceCard] [ExperienceCard] …        │
│                                            │
│ ── Education ──                            │
│ 5 experiences contribute. …                │
│                                            │
│ … (one section per theme)                  │
│                                            │
│ How impact gets measured →                 │
└────────────────────────────────────────────┘
```

### Components reused

- `ImpactSignal` (existing) — rendered in list form per theme
- `ExperienceCard` for the per-theme grids
- Feed-grid CSS

### Cross-links

- Every `ImpactSignal` on the site links to `/work/navi/demo/impact#heritage` (or the appropriate theme anchor)
- The methodology link in the page footer is local, not external

### Photo expansion

State today: 27 experiences have 3 photos, 9 have 2, 1 has 4. Target: every experience has 3 photos minimum, with several pushed to 4–5 to give the Gallery component more to render.

Approach:
1. For each of the 9 thin listings, source 1–2 additional photos via the Unsplash search API (key referenced in earlier session work)
2. Download to `/public/projects/navi-demo/` with semantic filenames matching the existing convention
3. Update `demo-data.ts` photo arrays
4. Update `public/projects/navi-demo/README.md` attribution section
5. Optionally bump 4–6 high-traffic experiences (Prospect Park, Sunset Park market, etc.) to 5 photos for stronger Gallery presence

Out of scope: replacing existing photos, switching from local storage to hot-linking.

## Craft polish (woven through slices)

- **Booking flow:** enhance the existing Reserve → confirmation transition. Today the button swaps text instantly; this adds a 200ms scale+fade with a checkmark glyph between states. `spotsLeft` decrement stays as is.
- **Empty states:** existing feed-empty stays; new on host page ("This host has no upcoming experiences") and neighborhood page ("No experiences in this neighborhood yet").
- **Loading states:** skeleton cards in the feed (visible only on first paint, fade in once data resolves). Demo data is synchronous so this is portfolio polish for the case study video, not real data-loading.
- **Hover and focus motion:** subtle lift on cards (1–2px translateY + shadow softening), respect `prefers-reduced-motion`.
- **Slide-over motion:** 200ms ease-out slide-in. Backdrop fades in 150ms. Both respect `prefers-reduced-motion`.

## Components added

- `FiltersSlideOver` — controlled component with a footer count. Owns its own draft state, commits on Apply.
- `HostHeader` — avatar + name + neighborhood + stats block.
- `NeighborhoodHeader` — name + borough + intro + map.
- `ImpactThemeSection` — heading + count + impact-statements list + experience grid.
- `GalleryCarousel` — replaces the static thumb-grid `Gallery`. Hero photo carousel with `CarouselArrow` + `PaginationDots`, thumb strip jumps to index.
- `PillRow` — thin presentational primitive holding the shared pill-button-row layout, focus styling, and active state. Used by both `Tabs` (tablist composition) and the detail-page sticky section nav (anchor composition).

## Components changed

- `FeedPage` — restructures controls row, adds slide-over.
- `ExperienceCard` — neighborhood pill becomes a link.
- `ExperienceView` (detail page) — host line and neighborhood line become links.
- `ImpactSignal` — accepts an `href` prop and renders as `<Link>` when provided.
- `Avatar` — accepts an optional `imgSrc` prop for host avatars.
- `Gallery` — renamed/refactored to `GalleryCarousel` (see Components added). Existing callers swap to the new component.
- `Tabs` — refactored to consume the new `PillRow` primitive; APG tablist semantics unchanged. Existing tests stay green.
- Detail-page sticky section nav — refactored to consume `PillRow`. No visual change expected.
- System page — keep `Tabs` specimen (now described as the tablist composition); add a sticky-section-nav specimen (the anchor composition); add a `PillRow` primitive specimen above both to show what they share; add a chip-rail specimen; verify `CarouselArrow` + `PaginationDots` specimens still match the now-real implementations.

## Testing

Existing tests stay green. New:

- `host-page.test.tsx` — renders avatar, name, neighborhood label, experiences grid, cross-links present.
- `neighborhood-page.test.tsx` — renders name, intro, map mock, experiences grid, hosts row.
- `impact-page.test.tsx` — renders methodology, one section per theme, experience counts match data.
- `filters-slideover.test.tsx` — opens on Filters click, traps focus, ESC closes without applying, Apply commits filters and updates the feed count.
- `gallery-carousel.test.tsx` — renders hero + thumbs, arrow advances hero index, dot clicks jump to that photo, thumb clicks jump to that photo, arrow keys advance when carousel is focused, `prefers-reduced-motion` disables the transition.
- `pill-row.test.tsx` — primitive renders items, active item has the active class, focus styles apply on keyboard navigation, exposes a render-prop for ARIA attributes (so Tabs can supply `role="tab"` + `aria-selected` and the sticky nav can supply `aria-current`).
- Existing `Tabs` tests stay green after the refactor (no behavior change).

Spacing pass is CSS-only and does not need new tests.

## Implementation order

1. **Slice 1** — filter row, slide-over, spacing pass. PR 1.
2. **Slice 2** — host pages + data shape change for `host`. PR 2.
3. **Slice 3** — neighborhood pages + data shape change for `neighborhood`. PR 3.
4. **Slice 4** — impact ledger + photo expansion. PR 4.

Each slice is independently shippable. Cross-links land in the slice that introduces the target page (e.g., the experience detail page gets the host link in slice 2, the neighborhood link in slice 3).

## Risks

- **Host bios feel invented.** Mitigation: keep bios tight (3–4 sentences), focus on practice + neighborhood (concrete), avoid biographical fiction.
- **Neighborhood intros feel generic.** Mitigation: write each one with a specific local-led angle (e.g., "Bed-Stuy's brownstone preservation movement traces back to the 1970s..."), not "a vibrant neighborhood with..."
- **Slide-over on mobile fights the existing chip rail scroll-snap.** Mitigation: the bottom sheet sits above the rail visually (z-index above), and `body { overflow: hidden }` while open prevents background scroll.
- **Impact ledger reads as marketing copy.** Mitigation: lead with the methodology paragraph that names what's *not* measured. The point is to show product thinking, not to sell impact.
- **Photo download blocked.** Mitigation: API key currently in session memory has been flagged for rotation. Confirm it still works before slice 4 starts; if dead, request a fresh one from the user.

## Open questions

None blocking. Implementation plan will refine PR boundaries.
