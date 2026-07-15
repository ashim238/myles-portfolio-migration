# Broad Product Design portfolio fix batches

Date: 2026-07-15

## Goal

Prepare the portfolio for Associate-level Product Design roles broadly. The public-facing title remains **Product Designer**. Interaction craft, systems thinking, research, accessibility, and build fluency support that identity rather than narrowing it to an interaction/UI specialty.

The site should demonstrate that Myles can:

- own a bounded product problem from discovery through a working result;
- contribute inside an established team and product system;
- receive feedback, explain tradeoffs, and change direction when evidence warrants it;
- execute with unusual depth for an early-career designer without implying senior-level authority;
- communicate the work quickly to a recruiter and with enough depth for a hiring-manager review.

## Positioning decisions

1. Do not put “Associate” in the public hero or page title. Level is signaled through scope, collaboration, and growth evidence.
2. Keep “Product Designer” as the main identity. Interaction/UI is a strength, not the role category.
3. Preserve the strategy, design, and code intersection, but replace blanket end-to-end leadership signals with defensible bounded ownership.
4. Keep social responsibility as a demonstrated value, especially in Fresh Greens and Navi. Do not require every project to fit one exclusion-focused thesis.
5. Add team context, feedback sources, and individual decision authority before adding more visual polish.

## Motion and interactive-artifact policy

Interactive and motion-designed artifacts are part of the portfolio's evidence, not decoration to be flattened out. They can show timing, hierarchy, state changes, system behavior, and iteration more efficiently than another block of prose.

Use this test for every motion element: **What design decision becomes easier to understand because this moves?** If the answer is concrete, preserve or strengthen it. If the motion only announces that the portfolio has loaded, it competes with the work.

### Preserve and prioritize

- Product flows that reveal cause and effect, such as route-state changes, overlays, navigation behavior, and template transformations.
- Before-and-after or iteration artifacts where motion makes the design decision legible.
- Interactive exhibits that let a reviewer inspect a system instead of reading a long explanation.
- One composed signature moment per major surface when it supports the project's specific visual world.

### Balance requirements

- Motion never gates access to already-available content or blocks navigation.
- Story-bearing artifacts load when they approach the viewport or when the visitor asks to play them. They do not consume the initial page budget from far below the fold.
- Autoplay sequences end, expose pause/replay controls when appropriate, and do not loop indefinitely by default.
- Reduced-motion alternatives preserve the same information through a settled frame, state sequence, or concise caption. They do not simply remove the evidence.
- Each artifact gets a short framing line that names what to watch for. Nearby prose must add context rather than narrate every visible step.
- Prefer one purposeful artifact over several generic scroll reveals or decorative micro-interactions.
- Verify smoothness and memory use on the phone widths recruiters are expected to use first.

## Sequencing options considered

### Option A: Story first

Rewrite the hero, About, résumé, and case-study framing before technical work.

**Tradeoff:** Fastest visible positioning change, but it leaves known security, validation, responsive, and quality-gate failures in place. It also cannot proceed until the required Myles writing guide is restored.

### Option B: Risk first

Patch dependencies and quality gates before touching applicant-facing experience.

**Tradeoff:** Produces a stable baseline, but delays the recruiter-facing improvements that most directly affect applications.

### Option C: Trust, then recruiter path (selected)

Start with a compact engineering trust batch, then improve the first-minute narrative, then strengthen case-study proof.

**Why selected:** It removes low-ambiguity release risks immediately while preserving a clean boundary for copy and design decisions that need the writing guide and browser review.

## Batch 1: Release trust

This batch contains low-ambiguity corrections and no portfolio-positioning rewrite.

### 1. Patch the production framework

- Update `next` and `eslint-config-next` from 16.2.4 to the patched 16.2.10 release identified by the audit.
- Do not take unrelated major-version dependency upgrades in this batch.
- Re-run the production-only and full dependency audits after installation.

### 2. Make project visibility one strict contract

- Supported statuses remain `published`, `draft`, and `hidden`.
- Update content validation to accept all three.
- Reject missing or unknown statuses instead of silently coercing them to `published`.
- Preserve current behavior: published projects appear in the gallery and sitemap, drafts remain explicitly viewable as in-progress work, and hidden projects return 404 and stay out of generated paths.
- Add tests for all valid statuses and for an unknown status.

### 3. Centralize the canonical site URL

- Treat `https://mylesdesignsthings.com` as canonical because it already appears in metadata, the homepage intro, the Navi embed, and the résumé.
- Add the canonical URL to `siteConfig` and consume it from layout metadata, sitemap, and robots.
- Add `/about` to the sitemap.
- Stop assigning the current build date as every route's `lastModified`; omit the field until content dates are available.
- Add small tests around canonical sitemap and robots output.

### 4. Fix Navi at 320 px without removing essential actions

- Preserve the `Navi` wordmark, the route back to the case study, and the host action.
- On very narrow screens, shorten the visible exit label from “Return to case study” to “Case study” while keeping the fuller accessible name.
- Reduce only narrow-screen spacing and button padding.
- If 320 px still cannot fit after those changes, hide the wordmark below 350 px as the final fallback. The exit and host actions take priority because they are not duplicated in the mobile tab bar.
- Verify at 320, 360, 390, and 768 px.

### 5. Restore a clean quality gate

- Resolve the five current lint errors without disabling rules.
- Remove straightforward unused imports.
- Keep p5 global callbacks intentionally available and document or scope their lint treatment rather than deleting them.
- Address hook warnings when the fix is local and behavior-preserving. Record larger refactors for a later batch.
- Run lint, content validation, TypeScript, unit tests, and production build.

## Batch 2: The first 60 seconds

This batch starts after the Myles writing guide is available.

- Make the cold homepage immediately readable without requiring the browser-zoom sequence to finish.
- For the homepage cold open, keep at most one short, non-blocking signature motion moment with a visible skip path and a finite end state. This limit does not apply to story-bearing artifacts farther down the page or inside case studies.
- Replace the persistent interest typer with either one settled line or a finite sequence that stops.
- Give the hero one broad Product Design claim, one evidence-backed proof point, and a direct route to selected work.
- Move hobbies and personal-interest texture to About.
- Correct stale MFA language and remove copy patterns prohibited by the voice guide.
- Keep “Product Designer” public-facing. Do not add “Associate” to the hero.

## Applicant-prose anti-slop gate

This gate applies to Batch 2, Batch 3, and any later change to the hero, About, résumé, case-study prose, headings, captions, metadata descriptions, or project summaries. Passing spelling, grammar, and the punctuation rules is necessary but not sufficient.

The current applicant-facing prose scored **17/24** in the audit. It is solid at the sentence level, but repeated summary layers, statement-shaped headings, symmetrical contrasts, and thesis-like closers create an AI-polished pattern across sibling pages.

### Required review sequence

1. **Load the full Myles writing guide.** Its house rules override the generic anti-slop playbook. No applicant-facing drafting begins from remembered fragments of the guide.
2. **Read before scanning.** Read the complete target page as a recruiter, then read its sibling pages to detect cross-page monoculture. Record prose findings before running regex or other mechanical checks.
3. **Count patterns by density.** One antithesis, tricolon, or short closer may be voice. Repetition across headings, sections, or cases is grammar and must be removed.
4. **Preserve facts and attributed language.** Rewrites cannot change numbers, names, dates, scope, outcomes, or quotations. A weak flourish is deleted rather than replaced with an invented detail.
5. **Run the mechanical scan.** Check explicitly for em dashes, semicolons, ellipses, antithesis formulas, empty signposts, hype language, and the AI-vocabulary list. En dashes in date ranges and quoted material remain exempt.
6. **Re-read the full result.** Local fixes must not replace one repeated pattern with another, such as turning every antithesis heading into a colon heading.
7. **Score the final prose.** Applicant-facing copy must reach at least **22/24**, with zero P0 or P1 anti-slop findings, before the batch is complete.

### Content qualities to protect

- Concrete decisions, constraints, artifacts, and outcomes carry the argument.
- Sentence length and paragraph shape vary naturally.
- Headings use mixed constructions and tell the reader where they are in the design process.
- Collaboration is shown through a specific exchange, decision, or change, not a generic claim that feedback mattered.
- Reflection names what changed or remains unresolved. It does not end on a polished lesson or aphorism.
- Each content layer adds information. The hero, recruiter cut, TOC, section lead, body, and caption do not restate the same thesis.

### Automatic failure conditions

- Repeated “not X, but Y” or balanced two-beat constructions.
- Repeated rule-of-three phrasing used for rhythm rather than real grouping.
- Paragraph-final sentences that can be deleted without losing information.
- Uniform statement-shaped or colon-shaped headings across a case study.
- Generic executive claims such as “every decision linked back to research.”
- Empty abstractions where a real design decision or artifact is available.
- Banned hype terms, generic AI vocabulary, or any house-style punctuation violation.

## Batch 3: Professional proof

- Implement the already-approved short-form TikTok case and publish it.
- Make contribution, team context, feedback source, and shipped outcome explicit.
- Add the same collaboration fields to the other recruiter cuts where evidence exists.
- Replace causal FAFSA wording with precise post-redesign timing language.
- Reduce top-level case-study navigation to three or four decision chapters where possible.
- Let recruiter cuts replace repeated summaries instead of adding another summary layer.
- Use interactive and motion artifacts to replace explanatory prose where the artifact can show the decision more clearly.

## Batch 4: Performance and hardening

- Prevent the 24 MB Fresh Greens video from loading until it approaches the viewport.
- Give moving media user controls and finite/reduced-motion behavior.
- Add appropriate security headers and a practical CSP.
- Remove duplicate generic/dedicated route generation where it adds no value.
- Improve résumé PDF tagging and reading order when a reproducible source is available.
- Split `globals.css` by stable surface boundaries after behavioral fixes settle.

## Verification standard for every batch

Each batch must:

1. start with a failing automated test when the behavior is testable;
2. avoid unrelated redesign or dependency churn;
3. pass targeted tests before the full suite;
4. pass `npm run lint`, `npm run validate:content`, TypeScript, `npm test`, and `npm run build` before handoff;
5. receive browser verification at the affected desktop and mobile widths when browser tooling is available;
6. preserve reduced-motion behavior and keyboard access;
7. run the applicant-prose anti-slop gate whenever user-facing copy changed;
8. verify that story-bearing motion remains informative, non-blocking, performant, controllable, and meaningful under reduced motion;
9. end with a concise change summary, verification evidence, and any deferred issues.

## Current constraint

The required candidate-writing guide was not found at `~/.Codex/writing-style-myles.md`, and no matching copy was discoverable in the available workspace. Batch 1 can proceed without applicant-copy drafting. Batch 2 must pause until the guide is restored or its correct path is provided.
