---
target: portfolio wide product design critique
total_score: 35
p0_count: 0
p1_count: 3
timestamp: 2026-06-15T12-56-26Z
slug: portfolio-site-wide
---
## Design Health Score — Portfolio (site-wide)

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Entrance, TOC active dot, focus rings, persisted theme all communicate state. |
| 2 | Match System / Real World | 4 | Grounded, plain-language copy; statement-shaped section headings; no jargon. |
| 3 | User Control and Freedom | 3 | Escape/backdrop close the lightbox, but the first-visit entrance can't be skipped and lightbox focus isn't returned. |
| 4 | Consistency and Standards | 4 | Strong shared shell + scoped per-project accents; one drift — DESIGN.md documents sentence-case eyebrows but ships uppercase-mono. |
| 5 | Error Prevention | 3 | Few destructive actions; 404 present; theme persists. Limited surface to judge. |
| 6 | Recognition Rather Than Recall | 4 | Visible numbered nav, visible TOC, labeled controls, statement headings. |
| 7 | Flexibility and Efficiency | 3 | TOC jumps + theme toggle, but no keyboard shortcuts and no skip-animation path. |
| 8 | Aesthetic and Minimalist Design | 4 | Quiet, editorial, real imagery, zero decorative clutter. |
| 9 | Error Recovery | 3 | 404 recovers cleanly, lightbox closes; little else to recover from. |
| 10 | Help and Documentation | 3 | Minimal by design; TOC affordance is unexplained. Acceptable for a brand surface. |
| **Total** | | **35/40** | **Good (top of band)** |

## Anti-Patterns Verdict

**Does this look AI-generated? No — clearly the opposite.** Hand-tuned easing and timing (not round numbers), a custom hand-drawn inline-SVG logo, per-project scoped accent systems, real process imagery, and grounded human copy. None of the cross-register tells are present: no gradient text, no glassmorphism, no side-stripe borders, no cream/warm-neutral background, no identical card grids, no em dashes, no aphoristic copy.

**Deterministic scan:** `detect.mjs` over `src/app src/components` returned 2 findings, both `broken-image` (warning) at `fresh-greens.tsx:11` and `site-logo.tsx:6`. **Both verified false positives** — the literal text `<img>` appears inside code comments; every real image renders through `next/image` (5 components, 41 alt attributes, 0 raw `<img>` elements). Effectively a clean scan.

## Overall Impression

This is senior-level, intentional work. The system shows: spacing rhythm, a committed type scale, line-based depth instead of shadows, and a neutral shell that lets each case study carry its own color. The writing genuinely carries the work — section headings are arguments ("A lineage older than the app store"), not labels. The biggest opportunity is not aesthetic; it's **resilience and keyboard/AT parity** on the cleverest interactions. The craft that makes the happy path feel premium is the same craft that quietly excludes the keyboard, screen-reader, and slow-network paths.

## What's Working

1. **The system is legible across surfaces.** The shared chrome (nav, meta strip, TOC, highlight, footer) is identical across case studies while accent color is scoped per page (`.fg-page` sage, etc.). Three case studies read as one voice in three registers — consistency without flattening.
2. **Statement-shaped section headings.** "One skeleton. Three fills.", "A lineage older than the app store." Each advances the argument instead of announcing a section. This is the design system's own rule, executed well.
3. **Image alt text describes the work, not the file.** e.g. "Route preview screen — daylight-graded polyline from Manhattan to Newark Airport Express, ETA 31 min arriving at dusk." This is the PRODUCT.md mandate, actually honored.

## Priority Issues

- **[P1] Home first-paint depends entirely on JS on first visit.** On a first visit (non-reduced-motion), an inline `<head>` script adds `home-intro-wait` (opacity:0 on hero name, nav, typer, work list) and `HomeIntroFocusGuard` sets `main.inert = true`. Both are only cleared by the `home-entrance-complete` event after anime.js loads and runs. If JS is slow or anime.js fails, the primary content of the most important page — for a phone-first, 60-seconds audience — stays invisible and non-focusable, with no CSS or timeout fallback. About/footer still render, so it's not a blank page, but the hero is gone.
  - *Why it matters:* The phone-first first impression is the whole point of the home page; this is exactly the moment with the least network reliability.
  - *Fix:* Add a CSS-only fallback (`@keyframes` reveal that lands visible) or a ~1.2s `setTimeout` that force-removes `home-intro-wait` and `inert` regardless of event state.
  - *Suggested command:* `/impeccable harden`

- **[P1] Lightbox has no focus management.** `lightbox-provider.tsx` renders `role="dialog" aria-modal="true"` and closes on Escape/backdrop, but never moves focus to the dialog on open, never traps Tab inside it, and never restores focus to the trigger on close. Keyboard and screen-reader users tab straight through to the page behind the modal.
  - *Why it matters:* WCAG 2.4.3 (Focus Order) / modal-dialog expectations; SR users lose the dialog entirely.
  - *Fix:* On open, focus the close button and store the trigger; trap Tab within `[close, image]`; on close, restore focus to the trigger.
  - *Suggested command:* `/impeccable harden`

- **[P1] Scroll-driven interactions have no keyboard-focus parity.** The work-showcase active/parallax state and the per-project metric typer are driven by IntersectionObserver/scroll only. A keyboard user tabbing through project links never triggers the active state and never sees the metric line (it's `opacity:0; min-height:0` until active). The TOC links also lack arrow-key navigation.
  - *Why it matters:* The "depth focus" affordance and project metrics are invisible to keyboard users — a real content gap, not just a missing flourish.
  - *Fix:* Bind the active state to `focusin` on the work-showcase link; reveal the metric on focus; add ←/→ (and Home/End) handling to TOC links.
  - *Suggested command:* `/impeccable harden` (or `/impeccable adapt` for the keyboard layer)

- **[P3] Hero eyebrow drifts toward the tell the system bans.** Each case study's single hero kicker ("Graduate thesis · 2026") renders UPPERCASE + Geist Mono + ~0.12em tracking — the tracked-uppercase-mono eyebrow that DESIGN.md's own "Sentence-Case Rule" calls a 2023-era SaaS-scaffold tell. It's only one kicker per page (defensible as voice, not per-section scaffolding) and contrast is fine (measured ~6.5:1 in light mode, not a fail), so this is polish, not a defect.
  - *Fix:* Drop `text-transform: uppercase` and the mono family; sentence-case Instrument Sans at the accent color keeps the kicker without the tell. Or consciously ratify the mono kicker as a named brand system and note it in DESIGN.md.
  - *Suggested command:* `/impeccable typeset`

## Persona Red Flags

**Sam (keyboard / screen reader):** Lightbox doesn't trap or return focus — tabs land behind the modal (P1). Work-showcase project cards never reach `data-active` on keyboard focus, so the depth cue and per-project metric never appear for keyboard users (P1). First-visit `inert` on `.home-page` locks keyboard focus out of the home page for ~1s with no skip (acceptable when JS works; compounds the P1 resilience risk when it doesn't).

**Casey (distracted mobile, slow connection):** First-visit home content is gated behind JS + anime.js with no fallback — on a flaky connection the hero may not paint (P1). Hover-only `translate3d/rotate` affordances on work cards give no tactile feedback on touch; the press-feedback `:active` scale is gated behind `prefers-reduced-motion: no-preference`, so it's fragile on tap. Mobile nav sits in the top ~40% of the screen (weakest one-handed thumb zone) — minor, common for portfolios.

**Riley (stress tester):** Refresh mid-scroll on a long case study drops to top with the mobile TOC collapsed — standard, low impact. The Navi heatmap binds click handlers to SVG `<path>` elements; tap-target size on those paths should be confirmed ≥44px on mobile.

## Minor Observations

- The mobile TOC auto-closes on scroll and doesn't persist its open state; on a long read, returning to the top re-collapses it (re-tap to see sections again).
- ~21 inline hex colors live in case-study TSX (e.g. `fresh-greens.tsx` signal swatches `#2f6b46`, `#d24a3b`…). They're content-level colors, but they bypass the scoped-token system and won't adapt across themes.
- `backdrop-filter: blur` on the lightbox backdrop has no `@supports` fallback (degrades to solid dim — acceptable).
- Navi loads page-scoped Jost + Lato while the other studies use only Instrument Sans; a small extra font cost worth confirming is intentional craft rather than habit.

## Questions to Consider

- Should the home hero render visible by default and *enhance* with motion, rather than start hidden and *depend* on JS to reveal? That single inversion removes the P1 entirely.
- The three case studies share one structural skeleton (Hero → Cover → Meta → Highlight → TOC → sections → outcome). Is uniformity the intent, or should a content/email project like Understanding FAFSA lead with its before/after rather than inherit the product-case shape?
- If a keyboard user can't see the work-showcase depth focus or the per-project metric, is the scroll-only version the canonical experience, or the degraded one?
