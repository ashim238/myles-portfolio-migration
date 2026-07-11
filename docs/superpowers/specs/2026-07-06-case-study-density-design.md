# Case-study density — a skim path over the depth

**Date:** 2026-07-06
**Surface:** The three published case studies (`/work/fresh-greens`, `/work/navi`, `/work/understandingfafsa`)
**Files:** `src/app/work/*/page.tsx`, a new `CaseStudySummary` component, `src/app/globals.css`

## Context

**Sub-project 3** of the recruiter-glance redesign. It is **independent** of sub-projects 1 (home gallery) and 2 (covers) — it touches the case-study pages, not the home/gallery/cover files — so it runs in **parallel** with the covers→gallery workstream. The one shared file is `globals.css`; changes here are additive (new summary/pull-quote rules) and must be coordinated to avoid merge collisions.

## Problem

The case studies are strong but long-form: 7–8 sections each, dense prose throughout. A recruiter doing a first-minute scan has no fast path — there's no summary, no visual landmarks to catch, and the opening of each study is narrative rather than orienting. The depth is an asset for someone who commits to reading; it's a wall for someone deciding whether to.

## Goal

Keep the depth, but lay a **skim path** over it so a recruiter gets the whole story fast and a committed reader still gets everything. Three moves, applied consistently across all three studies:

1. An **at-a-glance summary block** at the top of each study.
2. **Pull-quotes** that surface the one or two sharpest lines per study as visual landmarks.
3. **Tightened section intros** — front-load the point of each section so a skimmer reading only first sentences still follows the argument.

Nothing substantive is removed. This is additive structure plus prose tightening, not a structural cut.

## Non-goals

- No section deletion or merging — structure stays. (That was the rejected "structural cut" option.)
- No change to the home gallery, covers, or navigation.
- No change to the thesis, claims, or evidence — tightening is about compression and ordering, not cutting arguments.

## Design

### 1. At-a-glance summary block

A new server component, `CaseStudySummary`, rendered once near the top of each case study (after the hero/title, before the first narrative section).

Content — a compact, scannable block, four to five labelled items:

- **Problem** — one sentence: what wasn't working / whose need was unmet.
- **Role** — from the project's `role` (e.g. "Product Designer · Solo build").
- **Outcome** — the headline result (the same emphasized metric the home gallery uses: 78% preferred / 75% open-rate lift / shipped-solo).
- **Stack / medium** — the tools or platform (e.g. "React Native · Supabase" / "Figma · Mailchimp").
- **Timeline** — from `timeframe`.

Layout: a labelled definition-list style block (label in mono/muted, value in body), laid out with grid/`gap` — not cards, not pills (consistent with the no-pills decision in sub-project 1). Reads as a quiet spec strip, not a marketing hero. Values that already exist on the `Project` (`role`, `timeframe`, outcome fields) are passed in; `Problem` and `Stack` are authored per study as component props in each `page.tsx` (the pages are hand-authored TSX, so no frontmatter change is required).

The block is consistent across all three studies — same component, same labels, same rhythm — so the set reads as intentional.

### 2. Pull-quotes

Extract one or two of the sharpest existing lines per study into a visual pull-quote treatment (larger type, generous space, set off from body). These are **not new copy** — they promote a line already in the prose to a landmark a skimmer's eye catches. Candidates: the thesis line of each study (e.g. Fresh Greens' "whose safety knowledge counts", Navi's checklist-to-participation reframe, FAFSA's trust/rebrand line). Style shares the site's existing type system; no rounded cards, no giant quotation-mark glyphs.

### 3. Tightened section intros

For each section, ensure the **first sentence states the point**, then the detail follows. Cut throat-clearing openers, compress multi-clause sentences, one idea per paragraph. This is per-section editorial work guided by a principle, not a fixed script:

- Lead with the claim or the result, not the setup.
- Remove sentences that restate the previous section.
- Keep every concrete detail and number; cut connective padding.

Target feel: a reader skimming only headings + first sentences + pull-quotes + the summary block comes away with the full arc.

### Consistency

All three studies get the same three moves in the same visual language. The `CaseStudySummary` component and pull-quote styling are shared; only the content differs. A reader moving between studies should feel one system.

### Accessibility

- `CaseStudySummary` uses semantic markup (a `<dl>` for the labelled items, or a labelled list); labels are real text, not color-coded.
- Pull-quotes use `<blockquote>` with appropriate semantics; they duplicate in-flow prose, so they add emphasis without hiding content from assistive tech (or are marked appropriately if the source line is also present).
- Muted label text meets WCAG AA on both themes (existing `--muted` tokens pass).

## Files affected

- **New** `src/components/case-study-summary.tsx` — the at-a-glance block.
- **Edit** `src/app/work/fresh-greens/page.tsx`, `src/app/work/navi/page.tsx`, `src/app/work/understandingfafsa/page.tsx` — add the summary block, add pull-quotes, tighten section intros.
- **Edit** `src/components/fresh-greens.tsx`, `src/components/navi.tsx` — only where section intro copy lives in the component rather than the page.
- **Edit** `src/app/globals.css` — add `.case-summary*` and pull-quote rules (**shared file — coordinate with sub-projects 1 and 2**).

## Verification

- Read each study top-to-bottom on desktop and mobile: the summary block reads in ~5 seconds; pull-quotes land as landmarks; skimming headings + first sentences + quotes conveys the full arc.
- Confirm the three summary blocks are visually consistent.
- `preview_inspect` summary labels and pull-quote text for ≥4.5:1 contrast on both themes.
- `tsc --noEmit` clean; existing tests pass; detector clean on changed files.
- Confirm no claims, numbers, or evidence were lost in the tightening (diff-review the prose changes).

## Trade-offs accepted

- Adding a summary block and pull-quotes adds vertical length near the top; accepted because it buys a fast exit for skimmers and the depth stays intact below.
- Tightening prose risks flattening voice if over-done; mitigated by keeping it to front-loading and de-padding, not rewriting the argument.
- We keep all sections even though a structural cut would be shorter; intentional per the chosen approach — the depth is a deliberate asset, the skim path makes it optional rather than mandatory.
