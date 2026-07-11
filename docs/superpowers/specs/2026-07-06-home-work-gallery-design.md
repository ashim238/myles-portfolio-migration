# Home work display — visual-first gallery

**Date:** 2026-07-06
**Surface:** Home page, `Selected Work` section
**Files:** `src/app/page.tsx`, `src/components/work-showcase.tsx`, `src/components/work-project-card.tsx`, `src/app/globals.css`, plus deletions (below)

## Context: a three-part decomposition

This spec is **sub-project 1** of a larger goal — making the portfolio legible to a recruiter's first-minute glance. The full effort is:

1. **Home work display** (this spec) — layout, thumbnail weight, and removing the moving text.
2. **Cover treatment** — re-crop the project covers so the actual UI survives at thumbnail size. Out of scope here.
3. **Case-study density** — reduce copy weight inside individual case studies. Out of scope here.
4. **Site-wide signature** — extend the "working file" language beyond the home page. Separate spec/plan.

This gallery also **carries the "working file" signature** — see [`2026-07-06-working-file-signature-design.md`](2026-07-06-working-file-signature-design.md). The signature's structural elements (left spine, mono index system, mono annotations, hairline measure notes) and its entrance + click-to-enter **motion language** are part of this build, implemented with the signature's **robust reveal pattern** (content visible by default; keyframes play over it; safety-net timer + visibility guard + reduced-motion). The reference prototype is `docs/superpowers/prototypes/working-file-signature.html`. Where this spec and the signature doc overlap (caption layout, index numbering, motion), the signature doc is authoritative on the visual/motion language and this doc on the data/component/removal mechanics.

## Problem

The home `Selected Work` list is tuned for browsing, not for a quick-glance read:

- Each project is an alternating copy/media row where the two columns are near-equal width, but the copy column carries an index, a large title, a summary, an animated cycling metric line, meta, and tags — so copy dominates the visual weight while the thumbnail stays small. At a 1280px viewport the whole list sits in a ~770px column and each thumbnail renders at only ~353×257px, too small to read the work.
- The cycling/typing metric text on the active card is extraneous: it animates one phrase at a time (outcome, quote, role, tags, timeframe), so a recruiter can't read the full proof while it's mid-animation.
- The layout is backed by heavy client-side machinery — scroll parallax, active-index tracking, and a side rail — that adds motion and maintenance cost without serving the quick-glance goal.

## Goal

Replace the alternating rows with a calm, visual-first gallery where the work leads: large thumbnails, one static outcome line per project, and no moving text. Strip the client-side machinery down to the single interaction worth keeping (the click-to-enter transition). The section should read at a glance and feel like a designer with a point of view, not a busy showcase.

## Non-goals

- No change to the cover images or their crops (sub-project 2).
- No change to case-study copy density (sub-project 3).
- No new content fields beyond two optional frontmatter additions (`outcomeLead` / `outcomeRest`, below).
- No change to the hero, About, drafts, or footer sections of the home page.

## Design

### Layout: featured + grid

`Selected Work` becomes a gallery:

- The **first published project** (`order: 1`, currently Fresh Greens) is **featured**: a full-width card, rendered larger, with its caption below.
- **Every remaining project** flows into a **2-up grid** (`grid-template-columns: 1fr 1fr`) beneath the featured card, each with a thumbnail and caption below.
- **All thumbnails share a single 3:2 aspect ratio** — featured and grid alike. This is deliberate: sub-project 2 authors the covers as straight-on device frames whose screens fill the frame, so a wider featured crop (e.g. 2:1) would slice the device. One 3:2 cover asset per project is slot-independent — a project can move between featured and grid with no re-crop. The featured card differs only in size, not ratio.

The rule scales past today's three projects: the first is always featured; the rest fill the 2-col grid and wrap. With exactly two published projects, the grid holds a single card; with one, only the featured card renders.

### Card anatomy

Every card is a single `<Link>` wrapping the image and the caption. Nothing is overlaid on the image — the caption sits **below** it. Caption stack:

1. **Title** — `h3`, project title. Featured ~34px, grid cards ~23px (clamped for responsive). All thumbnails are 3:2 (see Layout).
2. **Outcome line** — one sentence, muted, with the metric emphasized in the foreground ink color (not a pill, not a box). Examples:
   - Navi: **78%** of concept-test participants preferred neighborhood-led recs over top-ten lists.
   - UnderstandingFAFSA: **75% lift** in open rate after a modular newsletter rebuild.
   - Fresh Greens: **Shipped, solo.** A wayfinding app for Black travel in America — community safety data weighted alongside public sources.
3. **Meta line** — one line, mono, muted, small: `role · year` (optionally one discipline tag). E.g. `Product Designer · React Native · 2025`.

No rounded tag pills anywhere — they read as templated. The only emphasis device is font weight/color on the metric span.

### Data → caption

- **Outcome line = emphasized lead + muted remainder.** Two optional new frontmatter fields give each project full control while keeping sensible fallbacks:
  - **Lead** (emphasized, foreground ink): `outcomeLead` if set, else `outcomeMetricValue`, else nothing.
  - **Remainder** (muted): `outcomeRest` if set, else `outcomeMetricLabel` (when a metric value is present), else `summary`.
  - This reproduces all three lines: Navi uses no overrides (`78%` + its metric label); UnderstandingFAFSA sets `outcomeLead: "75% lift"` + `outcomeRest: "in open rate after a modular newsletter rebuild."` (choosing the lift figure over the raw `~52.6%`); Fresh Greens sets `outcomeLead: "Shipped, solo."` and falls back to `summary` for the remainder.
  - A project with neither override nor a metric value shows `summary` alone, with no emphasis span.
- **Meta line.** Composed from `role` and `timeframe`, with an optional single tag. Rendered in the mono face already used for meta/labels.

### Removals

Delete the machinery the gallery no longer needs. Confirm no other importers before each deletion (importer map is in the plan):

- **`src/components/work-showcase-metric.tsx`** (`WorkShowcaseMetric`) — the cycling/typing metric. Deleted in full.
- **`src/lib/work-showcase-metrics.ts`** (`getProjectMetricPhrases`) — only consumed by the card. Deleted in full.
- **`src/components/work-showcase-rail.tsx`** (`WorkShowcaseRail`) — the side jump-to index. Deleted in full.
- **`src/lib/work-showcase-parallax.ts`** (`applyActiveParallax`, `clearParallax`) — only consumed by `WorkShowcase`. Deleted in full.
- In **`work-showcase.tsx`**: remove the scroll/resize listeners, `activeIndex`/`focusedIndex`/`focusReady` state, `updateFocusState`, `clampFocusDistance`, `scrollToProject`, the rail render, and the `data-focus-ready` shell wiring.
- In **`globals.css`**: remove `.work-showcase-rail*`, `.work-showcase-metric*`, `.work-showcase-media-stack*`, the alternating-row grid rules (`.work-showcase-item--reverse`, `--featured` row padding), and the `[data-active]` / `[data-focus-distance]` parallax/depth rules. Their reduced-motion entries (the `.work-showcase-rail-button`, `.work-showcase-metric-cursor`, `media-stack` lines near globals.css:3743-3752) go with them. Add the new `.work-gallery*` rules.

### Kept behavior

- **Click-to-enter flip transition.** `handleProjectEnter` (in the card) and its `dispatchProjectEnterRequest` / `project-enter-transition.tsx` pipeline stay. The gallery cards keep a media frame element whose `getBoundingClientRect()` seeds the transition, so the cover still animates into the case study. This is the one client interaction worth keeping and is the reason `WorkProjectCard` stays a client component.
- **Hover / focus-visible.** Cards get a subtle image scale and lift on hover and an equivalent focus-visible treatment, so they read as interactive. Keyboard focus is always visible.

### Responsive

- Desktop/tablet: featured full-width (3:2), grid 2-up (3:2 each).
- Below ~768px: the grid collapses to a single column; all thumbnails stay 3:2 so nothing re-crops. Captions already sit below images, so nothing reflows awkwardly and no text ever overlaps an image. No horizontal overflow at 375px.

### Motion

- No cycling text, no scroll parallax. Motion is the **signature entrance cascade** (rules draw on, indices tick in, the featured cover wipes in, captions settle to baseline) plus hover/focus micro-interactions and the existing click-to-enter transition. Values and easing per the signature doc.
- Implemented with the signature's **robust reveal pattern**: content visible by default, CSS `@keyframes` play over it, safety-net timer + visibility guard so it never ships blank on a hidden/headless render.
- `prefers-reduced-motion`: the entrance cascade is disabled (content already visible → clean no-op); hover scale suppressed; click-to-enter falls back to normal navigation.

### Accessibility

- Each card is one link; the image carries descriptive `alt` (`"{title} preview"` today — unchanged), and the visible title + outcome carry the meaning, so nothing rides on the image alone.
- The emphasized metric is a `<strong>` (or a span with a semantic class) inside the outcome sentence, so emphasis is conveyed structurally, not by color alone.
- Muted outcome and meta text must meet WCAG AA (≥4.5:1) on the `#fafafa` / `#050505` surfaces — verified by inspection, not eyeballed. The existing `--muted` tokens (`#555` light, `#c4c4c4` dark) pass.
- Focus order follows document order: featured, then grid cards left-to-right. Focus-visible outline present on every card.

### Copy

- Outcome lines are recruiter-legible and lead with the proof: a percentage or "Shipped, solo." first, the context after. Active voice, no hype.
- Meta stays factual: role, discipline, year.

## Files affected

- **Edit** `src/app/page.tsx` — the `Selected Work` section markup (may simplify now that the shell/rail are gone; likely just renders `<WorkGallery projects={projects} />`).
- **Rewrite** `src/components/work-showcase.tsx` — from stateful client showcase to a near-static gallery (server component rendering featured + grid; may be renamed `work-gallery.tsx`).
- **Edit** `src/components/work-project-card.tsx` — new caption-below layout, outcome + meta lines, keep `handleProjectEnter`; drop the metric import and the index/summary/tags row structure.
- **Edit** `src/app/globals.css` — remove the rows/rail/metric/parallax CSS; add `.work-gallery*`.
- **Edit** `content/projects/*.md` — add `outcomeLead` / `outcomeRest` where a crafted phrase beats the raw metric: Fresh Greens (`outcomeLead: "Shipped, solo."`) and UnderstandingFAFSA (`outcomeLead: "75% lift"`, `outcomeRest: "in open rate after a modular newsletter rebuild."`). Navi needs no change. Also extend the `Project` type + parser in `src/lib/content.ts` with the two optional fields.
- **Delete** `work-showcase-metric.tsx`, `work-showcase-metrics.ts`, `work-showcase-rail.tsx`, `work-showcase-parallax.ts`.

## Verification

- Preview at 1280 and 375: featured 2:1 on top, 2-up grid below; grid collapses to one column and featured goes 3:2 on mobile; no horizontal overflow; no text overlaps an image.
- `preview_inspect` the outcome and meta text for ≥4.5:1 contrast on both themes.
- Confirm the deleted modules leave no orphan imports (`grep` for each symbol); `tsc --noEmit` clean; existing tests pass; detector clean on changed files.
- Confirm the click-to-enter transition still fires from a gallery card and animates into the case study.
- Confirm keyboard: tab through cards, focus-visible on each, activation navigates.

## Trade-offs accepted

- We lose the editorial alternating-row personality and the parallax/rail flourish. Intentional: they were the source of the "copy-heavy, busy" read and the quick-glance goal wins.
- A gallery leans harder on the covers reading well; today's covers bury the UI in environment. This is why sub-project 2 (new device-frame covers) is a hard prerequisite for the gallery landing well — the two ship together as one workstream.
- A full-width 3:2 featured card is tall. Accepted: it's the lead project and earns the space. If it reads as too dominant in preview, the fix is size/padding, not a ratio change (ratio is fixed at 3:2 for slot-independence).
