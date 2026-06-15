---
target: portfolio wide product design critique (re-run)
total_score: 36
p0_count: 0
p1_count: 0
timestamp: 2026-06-15T19-20-47Z
slug: portfolio-site-wide
---
## Design Health Score — Portfolio (site-wide), re-run after the fix arc

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Entrance, TOC active tracking, theme toggle, focus rings, skip link all communicate state. |
| 2 | Match System / Real World | 4 | Grounded, conversational copy; statement headings; no jargon in user-facing text. |
| 3 | User Control and Freedom | 3 | Lightbox Esc/backdrop + focus return; entrance has a skip/failsafe. Project-enter zoom still can't be cancelled mid-transition on a slow load. |
| 4 | Consistency and Standards | 4 | Strong shared shell + scoped per-project worlds; eyebrows now sentence-case; copy voice consistent. |
| 5 | Error Prevention | 3 | 404, empty states, Play embed fallback present. Limited surface to judge. |
| 6 | Recognition Rather Than Recall | 4 | Visible nav, visible TOC, labeled controls, cover images + meta on work cards. |
| 7 | Flexibility and Efficiency | 3 | Keyboard parity added (work-showcase focus, TOC arrows), but the arrow-key nav is undiscoverable without a hint. |
| 8 | Aesthetic and Minimalist Design | 4 | Quiet, editorial, real imagery, no clutter, grain texture subtle. |
| 9 | Error Recovery | 4 | Lightbox restores focus to trigger; Play embed has a fallback link; 404 is friendly. |
| 10 | Help and Documentation | 3 | Minimal by register (a portfolio barely needs docs); TOC keyboard hint is the one gap. |
| **Total** | | **36/40** | **Good, upper band** |

*Independent fresh-eyes reviewer (no knowledge of the change history) scored 32/40 — stricter on Error Recovery and Help/Docs, which are arguably harsh for a brand/portfolio register. Both "P0"s it raised dissolve on verification: the light-theme body contrast actually passes (~9:1, the reviewer flagged it as hypothetically "fragile," not failing), and the metadata em dash is now fixed. Synthesized score reflects the resolved prior-run P1s and now-clean copy.*

## Anti-Patterns Verdict

**Does this look AI-generated? No** — independently confirmed by a reviewer who didn't know what changed: "Clean. No discernible AI tells. The voice is consistently editorial and calibrated; specificity carries every sentence." No gradient text, glassmorphism, side-stripes, hero-metric template, identical card grids, cream background, or SaaS eyebrows. Three case studies read as one voice with distinct identities.

**Deterministic scan:** `detect.mjs` over `src/app src/components` returned 2 `broken-image` warnings (`fresh-greens.tsx:11`, `site-logo.tsx:6`) — both the same verified false positives (the literal text `<img>` inside code comments). Clean.

## Overall Impression

This re-run measures the portfolio after the full fix arc (harden → per-case-study fixes → backlog → voice). The prior critique's three P1s (home first-paint resilience, lightbox focus management, scroll-driven keyboard parity) are all resolved and verified. Contrast failures found in the per-case-study audits are fixed in both themes. The em-dash ban is now comprehensively enforced (literal and `&mdash;` entity) across pages, components, content, aria-labels, and metadata. What remains is genuinely polish: a couple of interaction niceties and one discoverability gap. No open P0 or P1 design defects.

## What's Working

1. **Keyboard operability is baked in, not bolted on** — work-showcase active state responds to focus, TOC has roving arrow-key nav, lightbox traps and returns focus. (Independently called out as a strength.)
2. **Motion respects `prefers-reduced-motion` without gutting the experience** — entrance, parallax, TOC reveals, and project-enter all have proper reduced-motion paths.
3. **Voice carries the work** — specific, grounded, conversational, now consistently free of em dashes, semicolons, and hype across every surface.

## Priority Issues

- **[P2] Color-swatch copy feedback is quiet.** Clicking a swatch only swaps the label to "Copied" via opacity for 1.4s — easy to miss. *Fix:* add a brief scale/glow on the swatch on copy. *Command:* `/impeccable delight`
- **[P2] Project-enter zoom can't be cancelled on a slow load.** The transition locks scroll; if the next route is slow, the user is briefly stuck. *Fix:* release the lock on Escape and add a ~3s failsafe timeout. *Command:* `/impeccable harden`
- **[P3] TOC arrow-key navigation is undiscoverable.** The roving arrow keys work but nothing signals them. *Fix:* an sr-only hint and/or a subtle visible cue. *Command:* `/impeccable onboard`
- **[P3] Confirm the canonical domain.** `layout.tsx` sets `metadataBase` / OG url to `https://mylesdesignsthings.com`. Verify that's the intended production domain (not a design issue, but it drives canonical URLs and social previews).

## Persona Red Flags

- **Sam (keyboard / SR):** Strong now — focus parity, focus trap+return, skip link, sentence-case labels. Only gap: TOC arrow keys are undiscoverable (P3).
- **Casey (distracted mobile):** First-paint has a failsafe; touch press feedback added; tap targets pass. Entrance still adds ~1.5–2.5s before the hero on a cold first visit (failsafe at ~3.5s).
- **Riley (stress/edge):** Play embed now has a fallback link; lightbox recovers. Survey rings / SVG diagrams degrade to empty space if JS fails (low impact).

## Questions to Consider

- Should the project-enter zoom be skippable (Escape) for impatient or slow-network visitors?
- Is the home work-showcase meant to be representative or exhaustive? If representative, a "view all work" cue would clarify (currently only the footer "Work" link).
- The hero typer's reduced-motion fallback renders all five phrases joined by ` · ` as one dense line — is that the read you want for motion-reduced visitors?
