---
target: src/app/work/tiktok/page.tsx
total_score: 31
p0_count: 2
p1_count: 2
timestamp: 2026-06-12T21-52-57Z
slug: src-app-work-tiktok-page-tsx
---
# Critique Report — `src/app/work/tiktok/page.tsx`

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Sticky TOC accordion shows section, no scroll-progress affordance |
| 2 | Match System / Real World | 4 | Editorial language, no jargon |
| 3 | User Control and Freedom | 3 | TOC + back link; no skip inside aesthetic block |
| 4 | Consistency and Standards | 2 | Voice slips to 3rd-person "Myles"; numbered conventions inconsistent across TOC, slots, aesthetic cards |
| 5 | Error Prevention | 4 | N/A — read-only |
| 6 | Recognition Rather Than Recall | 3 | "Internal label" + "Anchor" terms require holding definitions across cards |
| 7 | Flexibility and Efficiency | 3 | "What shipped" h2 is `sr-only` |
| 8 | Aesthetic and Minimalist Design | 2 | Aesthetic cards stack 7 distinct text blocks |
| 9 | Error Recovery | 4 | N/A |
| 10 | Help and Documentation | 3 | Self-explanatory; figcaptions help |
| **Total** | | **31/40** | **Good — consistency + minimalism are the weak spots** |

## Anti-Patterns Verdict

**LLM assessment**: Writing is clearly human — voice, specificity, restraint, "I was 21" honesty. But chrome leans on patterns PRODUCT.md explicitly bans: numbered eyebrows, tracked-uppercase labels, cream-rounded outcome card. Hiring manager skimming for 60 seconds clocks the templated grammar before reading a sentence.

**Deterministic scan**: 2 side-tab borders flagged:
- `globals.css:3591` — `border-left: 3px solid var(--foreground)` on `.tt-pullquote`
- `globals.css:3824` — `border-left: 3px solid var(--tt-accent)` on `.tt-aesthetic-feedback`

Both hit the absolute ban on side-stripe borders.

## Overall Impression

Strong essay wrapped in templated grammar. Writing carries it; scaffolding undercuts it. Biggest opportunity: strip section numbers + tracked-uppercase eyebrows + side-tab borders, let typography carry hierarchy.

## What's Working

1. **The lede + retrospective**: specific, undefended, brand voice the project asks for.
2. **`TemplateAnatomy` artifact**: original 540×960 grid with pink/cyan annotations preserved — receipt that converts skeptics.
3. **`LineageTimeline` honest framing**: "My contribution sits in the launch generation" — refuses the causal claim.

## Priority Issues

**[P0] Numbered eyebrows + tracked-uppercase labels everywhere.** `01.` on TOC, `01–04` in TemplateAnatomy slots, `01/02/03` in AestheticShowcaseCard, tracked-uppercase ROLE STACK TIMELINE ANCHOR PALETTE FEEDBACK RECEIVED INTERNSHIP · 2021.
- Why: First-order AI tell. Design lead clocks templated before reading.
- Fix: Kill section numbers across TOC + slot list + aesthetic cards. Replace tracked-uppercase labels with sentence-case at body size, or delete.
- Command: `/impeccable typeset` or `/impeccable quieter`

**[P0] Side-stripe borders on pullquote + feedback blockquote.** `border-left: 3px solid …` on `.tt-pullquote` and `.tt-aesthetic-feedback`.
- Why: Absolute ban. Most recognizable tell of AI UIs.
- Fix: Background tint, oversize leading glyph, or nothing.
- Command: `/impeccable polish`

**[P1] Aesthetic cards collapse to single-column at desktop.** Kills lateral comparison across the three cards (the whole point) and inflates page height.
- Fix: At ≥900px, two-column grid (visual / context). Consider 3-up comparative lineup.
- Command: `/impeccable layout`

**[P1] OutcomeCard is the cream-rounded warm-minimal card PRODUCT.md bans.** Peach `#EDC4AC` rounded surface — exactly the "warm minimal" aesthetic flagged as 2026 AI default. Worst place to undercut: this is the outcome moment.
- Fix: Full-bleed editorial treatment. Large in-feed phone shot, attribution caption, no card.
- Command: `/impeccable bolder`

**[P2] Voice slip: "Myles" in LineageTimeline figcaption.** Third person inside first-person essay.
- Fix: "The mechanic I contributed to still ships under a different product name today."
- Command: `/impeccable clarify` or direct edit

## Persona Red Flags

**Jordan (non-design recruiter)**: "Internal label" + "Anchor" jargon unfamiliar; rename to "Reference" / "Inspiration."

**Casey (mobile)**: page is ~12,400px on mobile. Each `tt-aesthetic` card alone is ~3 phone screens. Per-card stack doesn't compress at 375px.

**Hiring Manager (5-min deep dive)**: anatomy grid buried at Section 3. Outcome moment (American Eagle) has `sr-only` h2 — Section 5 has no visible heading. They lose the "what shipped" beat.

## Minor Observations

- `tt-section--wide` only used once — dead system surface.
- TikTok logo CMY drift — only animated brand glyph on the site. Out of register with "quiet beats loud."
- `tabIndex={0}` on `.tt-overview-swatch` with no role/handler — a11y noise.
- Three aesthetic cards; only #1 and #3 have feature image — asymmetry reads as missing asset.

## Questions to Consider

1. What if the page had no section numbers at all and the seven h2s carried structure?
2. What if "Three aesthetics" was a comparison object showing all three side-by-side?
3. Why is the hero a glossy 3-phone composite (marketing render) instead of the actual grid artifact?
