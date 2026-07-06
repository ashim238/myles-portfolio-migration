# Case-study readability — a recruiter cut over the deep dive

**Date:** 2026-07-06
**Surface:** The three published case studies (`/work/fresh-greens`, `/work/navi`, `/work/understandingfafsa`)
**Branch:** `case-study-readability`

## Problem

Each case study is a long-form read with no fast path to the essential story:

| Study | Length | Structure |
|---|---|---|
| Fresh Greens | 2,045 words (~9 min) | 24 paragraphs · 9 sections · 18 visuals |
| UnderstandingFAFSA | 1,213 words (~5.5 min) | 18 paragraphs · 8 sections · 23 visuals |
| Navi | 1,044 words (~5 min) | 22 paragraphs · 9 sections · 7 visuals |

A recruiter spends ~60–90 seconds per study and reads maybe 200–300 words — under 15% of Fresh Greens. The pieces of a fast summary already exist at the top of each study but sit as four disconnected blocks (cover, a meta list, a highlight quote + metric, a table of contents), with no problem statement and no "what did you actually do." There is no designed 60-second version, and the deep dive has no skim landmarks.

## Goal

Give each case study two tiers on one continuous page: a **recruiter cut** (a designed, visual-forward, ~60-second version at the top) flowing directly into the **deep dive** (the existing depth, made scannable with landmarks). A recruiter gets the whole story fast; a hiring manager keeps scrolling into the detail. Nothing is hidden and no depth is removed.

## Non-goals

- No toggle, collapse, or separate deep-dive route. One continuous top-to-bottom scroll (decided).
- No aggressive cutting of the deep dive. Depth is preserved; only front-loaded and made scannable.
- No dependency on new video before shipping. Video is a drop-in enhancement (slot ready); stills ship now.
- No change to the home page, nav, or other routes.

## Design

### Tier 1 — the recruiter cut

A cohesive block right after the hero, consolidating today's scattered top-of-page components and adding what's missing. Order:

1. **Hero** — kept as-is (eyebrow, title, lede).
2. **Lead visual** — the existing project cover (Myles's original images), rendered through a new `LeadMedia` wrapper that shows a muted autoplay `<video loop playsinline>` when a clip path is provided, else the still `next/image` cover. Video-ready, still today.
3. **At a glance** — a single labelled block (a `<dl>`), consolidating the current `project-meta` list **and** `ProjectHighlight` into one unit, with two additions:
   - **Problem** (new) — one sentence: whose need was unmet / what wasn't working.
   - **Role**, **Timeline**, **Stack** — from the project data / current meta.
   - **Outcome** (from the existing highlight metric) — the headline result, emphasized.
4. **Key moves** (new) — 3–4 one-line takeaways: what Myles did and what happened. Distinct from the facts block; this is the "so what did you do" a recruiter needs. Rendered as a tight list (no pills, no cards).
5. **Jump nav** — keep the existing `ProjectToc`; it's already a skim aid.

The current standalone `project-meta` `<dl>` and `<ProjectHighlight>` are **removed** where the recruiter cut absorbs them (no duplication).

### Tier divider

A quiet full-width marker between the tiers: a hairline rule plus a small label, **"The full breakdown ↓"**. Signals the shift from fast to deep; not a control, just a landmark.

### Tier 2 — the deep dive, made scannable

The existing sections keep their depth and structure, plus:

- **Section takeaway** — a one-line lead at the head of each section (a `<p className="case-section-lead">`), stating the section's point before the prose. Skimming headings + takeaways alone conveys the full arc. This is new copy, one line per section, in Myles's voice.
- **Pull-quotes** — promote one or two of the sharpest existing lines per study to a `<blockquote className="case-pullquote">` landmark. Not new copy; a line already in the prose, lifted (and de-duplicated so it doesn't stutter against its source).
- **Prose tightening — only where a visual carries the point.** Where a figure/diagram already shows what a paragraph tells, trim the paragraph. No section removed; no numbers, claims, or evidence lost.

### Typography (the type pass, folded in)

Readability is typographic, so this work includes a type pass on the case studies:

- Body measure capped ~65–70ch; comfortable line-height (the case-study prose is the main read).
- Distinct, deliberate type for the three new text roles: the **key-moves** line, the **section-takeaway** lead, and the **pull-quote** — each visually separable from body and from each other.
- Section-heading rhythm with air above; consistent vertical spacing scale across all three studies.
- A separate, broader site-wide `/impeccable typeset` pass is a **follow-up** after this lands (noted, out of scope here).

### Consistency

All three studies get the same Tier 1 pattern, the same divider, the same landmark system, and the same type treatment. New components are shared; only the content differs.

### Per-study content (draft, refine during implementation)

Voice rules apply to all new copy: no em-dashes, no semicolons, no ellipses, Oxford comma, contractions, no hype words (en-dashes only in numeric date ranges, matching `project-meta`).

**Fresh Greens** — Problem: "Routing engines optimize for time and distance, not for whose safety knowledge counts." · Outcome: "Shipped solo, every route traceable to an auditable source." · Key moves: (1) community safety reports run through the same pipeline as OpenStreetMap, DOT-511, OSRM, and SunCalc, weighted the same way; (2) the en-route screen built around one-thumb reach (turn card, 3D map, safety column); (3) the reserved-color rule held across 26+ screens and 300+ accessibility attributes; (4) routing signals shaped by six driver interviews. · Pull-quote: "Whose safety knowledge counts when the route is computed?"

**Navi** — Problem: "NYC tourism defaults to top-ten checklists that skip the neighborhoods and people who make the city." · Outcome: "78% of concept-test participants preferred neighborhood-led recs over top-ten lists." · Key moves: (1) mapped tourist density across Manhattan; (2) ran three user groups and six platforms through one heuristic evaluation; (3) turned the research into a neighborhood-participation framework. · Pull-quote: "Residents did not want fewer tourists. They wanted visitors who engage more intentionally."

**UnderstandingFAFSA** — Problem: "A freshly rebranded site left its newsletter looking dated and off-brand." · Outcome: "Open rates moved from around 30% to ~52.6%, a 75% lift." · Key moves: (1) researched 120+ newsletters against four criteria; (2) built a modular template system with locked layers and swappable parts; (3) matched the newsletter to the rebranded site. · Pull-quote: "Subscribers were seeing two different brands."

### Recording shot list (optional, video-ready slots)

The Tier 1 `LeadMedia` slot accepts a short muted autoplay loop (~5–8s, MP4/WebM) per study. Recommended captures for Myles to record in parallel:

- **Fresh Greens** — the en-route screen in motion: the turn card updating, the 3D map, the daylight-graded route line. Alt: the route-preview daylight gradient scrubbing.
- **Navi** — the discovery/browse flow: scrolling neighborhood-led recommendations and a filter interaction.
- **UnderstandingFAFSA** — a smooth scroll through the shipped newsletter, or a short old→new before/after wipe (the rebrand match is the story).

Until clips exist, each Tier 1 leads with the still cover; dropping a clip path into the data swaps it to video with no layout change.

## Components / files affected

- **New** `src/components/recruiter-cut.tsx` — the Tier 1 block (`RecruiterCut`): at-a-glance `<dl>` (problem/role/timeline/stack/outcome) + key-moves list. Server component, structured props.
- **New** `src/components/lead-media.tsx` — `LeadMedia`: renders muted autoplay `<video>` when a `clip` prop is set, else the still cover via `next/image`. Robust: still is the default, video is progressive.
- **New** small shared bits: a `case-tier-divider` element and `case-section-lead` / `case-pullquote` styles (in `globals.css`).
- **Edit** `src/app/work/*/page.tsx` (all three) — insert `RecruiterCut` + `LeadMedia` after the hero; remove the now-absorbed standalone `project-meta` `<dl>` and `<ProjectHighlight>`; add the tier divider; add section-lead takeaways and pull-quotes to the deep-dive sections.
- **Edit** `src/components/{fresh-greens,navi}.tsx` — only where section-opening copy lives in the component.
- **Edit** `src/app/globals.css` — styles for the recruiter cut, divider, section-lead, pull-quote, and the type-pass adjustments (measure, rhythm).
- **Content** — no frontmatter change required if problem/moves are authored as page props; optionally add `outcomeMetric*` are already present. A `clip` path per project is added when videos exist.

## Verification

- Each study: the recruiter cut reads in ~60 seconds (problem, role, outcome, key moves, one strong visual); the "full breakdown ↓" divider is clear; the deep dive flows below with a takeaway at each section head and pull-quote landmarks.
- Skim test: reading only the hero + recruiter cut + section headings + section-leads + pull-quotes conveys the whole arc.
- `LeadMedia` shows the still with no clip and swaps to a muted autoplay loop when a clip is provided; respects `prefers-reduced-motion` (no autoplay → poster/still) and never ships blank.
- Body measure ≤ ~70ch; new text roles are visually distinct; contrast ≥ 4.5:1 on both themes for all new text.
- The three studies read as one consistent system.
- `tsc --noEmit` clean; tests pass; detector clean on changed files.
- Diff-review the deep-dive prose: confirm only visual-redundant sentences were trimmed; no numbers/claims lost.

## Trade-offs accepted

- The top of each study gets longer (the recruiter cut adds height before the deep dive). Accepted: it buys the 60-second path, and it replaces four scattered blocks with one designed unit, so the net addition is small.
- Two reading tiers on one page means the recruiter cut and deep dive must not restate each other; the cut is facts + moves + one visual, the dive is the narrative — deliberately different registers.
- Video is deferred to content availability; the still-first design means no launch blocker, at the cost of the clips landing later.
