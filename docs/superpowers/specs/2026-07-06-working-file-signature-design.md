# "The working file" — signature design language

**Date:** 2026-07-06
**Surface:** Cross-cutting visual + motion identity. Applied to the home gallery first (sub-project 1); planned for a site-wide pass (sub-project 4).
**Reference prototype:** `docs/superpowers/prototypes/working-file-signature.html` (template, no image data) · live: validated interactive build shown in session.

## Why this exists

The recruiter-glance redesign removes motion-novelty (cycling text, parallax, rail). That risks flattening the site's personality into a generic portfolio, since the identity currently lives almost entirely in the *writing*. This signature moves personality into **structure and motion** — the two levers chosen deliberately — so the scannability landmarks (indices, rules, annotations) and the identity become the *same* elements instead of competing.

The concept: the site reads as a rigorous systems designer's own **working file**, refined into a product. On-brand for someone whose case studies are about reserved-color discipline and auditable pipelines. Validated as an interactive prototype and approved.

## Structural elements

- **Left spine.** A single hairline rule running the content's left edge — the "file" margin. Quiet (`--line` weight).
- **Index system.** Projects/sections carry a mono index (`01` / `02` / `03`) as *real structure* aligned to the spine, not decoration. It doubles as a scannability landmark.
- **Mono annotations.** Small mono labels riding alongside titles (`Product Designer · Solo build`, `UI/UX · Research`) — margin-note register. Sparse and meaningful (role, status, discipline), never decorative filler.
- **Hairline rules + measure notes.** Sections separated by hairline rules; a few carry tiny mono measure annotations (`baseline · 8pt`, `end · selected work`) that read as a designer's working marks.
- **Baseline discipline.** Precise alignment and spacing is the point — the restraint *is* the craft. Content resolves *to* baseline on entrance.

Restraint is mandatory: a few precise lines, not graph-paper. The work (covers, titles, outcomes) stays the hero; the system is scaffolding around it. This avoids the generic "technical/blueprint" AI trope — refinement, not wireframe cosplay.

## Motion language — "the system asserting itself"

On entrance (and on replay), the page assembles as if resolving into alignment, in a staggered cascade:

- **Rules draw on** — `scaleX(0) → 1`, `transform-origin: left`.
- **Indices + labels tick into place** — small `translateY(8px)` + fade.
- **Covers render in** — a top-down wipe (`clip-path: inset(0 0 100% 0) → inset(0)`), the "developing" reveal reserved for the hero/featured moment.
- **Content settles to baseline** — titles/outcomes `translateY(16px) → 0` + fade.
- **Cascade & curve** — staggered delays (~0.02s → ~1.0s, roughly top-to-bottom, pair L→R), duration 0.6s (rules/text) / 0.7s (cover wipe), easing `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo). No bounce.
- **Hover** — subtle cover `scale(1.035)` + a mono `View →` tag fading in.
- **Click-to-enter** — the card scales up, siblings dim back, a mono `→ opening /work/…` note appears; in production this is the existing flip-into-case-study transition.

## The robust reveal pattern (non-negotiable)

This is the load-bearing lesson from the prototype and must carry into implementation exactly:

- **Content is visible by default.** No persistent hidden start state in CSS. The entrance animation is CSS `@keyframes` that plays *over* already-visible content.
- **Safety-net timer.** On arming, a timeout clears the animating class after the full duration regardless of whether the animation ran — so throttled/headless/hidden-tab renders end visible, never blank.
- **Visibility guard.** Do not arm the animation on a hidden tab; play on `visibilitychange → visible`.
- **Reduced motion.** `@media (prefers-reduced-motion: reduce)` disables the animation entirely; content is already visible, so this is a clean no-op. A manual toggle in the prototype demonstrates the fallback.

Rationale: gating visibility on a JS callback or `animation-fill-mode` start-state blanks the section when the animation never fires (background tab, RSS/headless render). Verified in-browser during the prototype build — the preview harness renders tabs as `hidden`, which reproduced the blank and forced this pattern. It matches the site's existing Navi reveal discipline.

## Application scope

- **Now (sub-project 1):** the home work gallery adopts the full signature — spine, index system, mono annotations, measure notes, and the entrance + click-to-enter motion, using the robust reveal pattern.
- **Follow-on (sub-project 4):** extend the language site-wide — nav, hero, case-study section rhythm, chrome, and transitions — so the identity is consistent beyond the home page. Specced in [`2026-07-06-sitewide-signature-design.md`](2026-07-06-sitewide-signature-design.md); implementation sequences after SP1 proves the signature in situ, and its case-study portion merges with SP3 into one pass.

## Non-goals

- Not a literal blueprint/wireframe aesthetic. Refined restraint, not technical cosplay.
- Not ambient/looping motion. Entrance + intentional interaction only; nothing that competes with the scan.
- Not a new color system — uses the existing tokens (`--foreground`, `--muted`, `--line`, mono/sans faces).

## Verification

- Content visible with JS disabled, on a hidden/background tab, and under reduced-motion — never blank. (Prototype verified this in-harness.)
- Entrance cascade plays once on load in a foreground tab; Replay restarts it cleanly.
- Click-to-enter reads as intentional; hover affordances present; keyboard focus visible.
- Motion honors `prefers-reduced-motion`.
