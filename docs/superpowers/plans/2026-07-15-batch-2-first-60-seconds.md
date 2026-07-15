# Batch 2: First 60 Seconds Implementation Plan

**Goal:** Make the homepage useful on first paint for broad Product Design applications while preserving motion that helps visitors understand the work.

**Voice source:** `/Users/mylesashitey/.claude/writing-style-myles.md`

**Architecture:** Remove the full-screen browser intro and its chained entrance system from the homepage composition and root layout. Keep the work-gallery and project-transition motion, which reveal project artifacts and navigation state without blocking access. Replace the endless interest typer with a static hero organized as role, claim, proof, credentials, and selected-work link.

## Task 1: Prove the first-paint contract

**Files:**

- Add: `src/app/__tests__/home-first-impression.test.tsx`
- Add: `src/app/__tests__/layout-first-paint.test.tsx`

1. Render the async homepage with content and visual child components mocked at their boundaries.
2. Assert that the hero exposes “Product Designer,” one end-to-end claim, one concrete Fresh Greens proof point, TikTok/UMG/Parsons credentials, and a direct `/#work` link.
3. Assert that the old browser intro and personal-interest typer are absent.
4. Render the root layout to static markup and assert that it does not include the `home-intro-guard` script or `home-intro-wait` class.
5. Run the focused tests and confirm they fail before production edits.

## Task 2: Remove the blocking cold open

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Delete: `src/components/home-browser-intro.tsx`
- Delete: `src/components/home-entrance.tsx`
- Delete: `src/components/home-intro-focus-guard.tsx`
- Delete: `src/components/home-intro-guard.tsx`
- Delete: `src/components/hero-interest-typer.tsx`
- Modify: `src/lib/home-intro.ts`

1. Remove the intro, focus guard, chained entrance, and typer from the homepage composition.
2. Remove the pre-hydration script and noscript override that hide homepage content.
3. Remove CSS that only supports the deleted full-screen intro, chained entrance, or typer.
4. Keep `prefersReducedMotion` in `src/lib/home-intro.ts` because project transitions still use it.
5. Keep gallery reveal and project-enter transitions unchanged.

## Task 3: Rewrite the recruiter-facing hero and About facts

**Files:**

- Modify: `src/app/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/globals.css`

Homepage structure:

- Role: `Product Designer`
- Claim: `I design products end to end and tend to go past the prototype.`
- Proof: `For my Parsons thesis, I designed and built a React Native app with more than 26 screens, VoiceOver labels, dynamic type, and a WCAG dash pattern.`
- Credentials: `Previously TikTok and UMG. MFA in Design and Technology from Parsons.`
- CTA: `View selected work`

Content rules:

- No em dashes, semicolons, rhetorical question-and-answer framing, hype language, or aphoristic closer.
- Do not add an extra Selected Work lede that restates the cards.
- Update About from current-student language to the completed 2026 MFA.
- Replace causal FAFSA shorthand with the factual sequence: the system was redesigned, and open rates went from about 30% to 52.6%.
- Keep personal interests on About, written plainly.

## Task 4: Verify the batch

1. Run focused homepage/layout tests.
2. Run the anti-slop mechanical scan over `src/app/page.tsx` and `src/app/about/page.tsx`.
3. Read both pages in full and score them against the 24-point prose gate. Require at least 22/24 and zero P0/P1 findings.
4. Run lint, content validation, TypeScript, and the full test suite.
5. Build production output.
6. Browser-check `/` and `/about` at desktop and 320 px for immediate readable content, no intro lock, no overflow, correct links, reduced-motion safety, and no console errors.
7. Commit behavior, content, and cleanup in task-scoped commits.
