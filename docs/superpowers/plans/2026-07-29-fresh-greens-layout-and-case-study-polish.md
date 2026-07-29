# Fresh Greens Layout and Case-Study Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct the armed-question vertical balance, replace the Trust flow’s text arrows with responsive connectors, and reduce case-study repetition without weakening evidence boundaries.

**Architecture:** The native screen will use a bounded scroll container with an explicit title region and a flexible choices region. The portfolio will keep its existing moderation-flow markup but render connectors through CSS pseudo-elements, then consolidate duplicated prose around the artifacts that already explain each decision.

**Tech Stack:** React Native, Expo, TypeScript, Jest, Next.js, React, CSS, Vitest.

## Global Constraints

- Keep answer-card copy left-aligned and vertically centered within each card.
- Preserve 100-point minimum card height, 24-point card gaps, Dynamic Type growth, and scrolling fallback.
- Keep the portfolio’s working, configuration-dependent, planned, and unproven states explicit.
- Do not remove any story-bearing media or interactive exhibit.
- Do not introduce em dashes, semicolons, ellipses, hype language, or unsupported claims.
- Do not modify the existing user-owned Fresh Greens changes in `docs/supabase-sdk-release-runbook.md`, `.codex/`, or `AGENTS.md`.

---

### Task 1: Native armed-question geometry

**Files:**
- Modify: `/Users/mylesashitey/code/fresh-greens/app/pulled-over.tsx`
- Test: `/Users/mylesashitey/code/fresh-greens/__tests__/native-hardening/safety-flow-choice-layout-source.test.ts`

**Interfaces:**
- Consumes: the existing `ArmedView`, `armedStyles`, spacing tokens, and `safetyCardHeight`.
- Produces: an explicit `scroll`, `scrollContent`, `page`, and `answersWrapper` layout contract.

- [ ] **Step 1: Write the failing test**

Assert that `ArmedView` gives the `ScrollView` a bounded flex style, uses a flex-growing content container, nests the title and choices in an explicit page view, and uses a symmetric choice region without `minHeight: '100%'`, page-level gap, or asymmetric bottom padding.

- [ ] **Step 2: Run the focused Jest test**

Run:

```bash
npm test -- __tests__/native-hardening/safety-flow-choice-layout-source.test.ts
```

Expected: FAIL because the current `ScrollView` uses `armedStyles.page` directly and the page contains `minHeight`, `gap`, and `paddingBottom`.

- [ ] **Step 3: Implement the explicit regions**

Give the `ScrollView` `style={armedStyles.scroll}` and `contentContainerStyle={armedStyles.scrollContent}`. Add an inner `<View style={armedStyles.page}>` around the title and choices. Use `flexGrow: 1` for the page and choices region, and symmetric `paddingVertical: spacing.lg` for the choices region.

- [ ] **Step 4: Verify the focused test and TypeScript**

Run:

```bash
npm test -- __tests__/native-hardening/safety-flow-choice-layout-source.test.ts
npm run typecheck
```

Expected: PASS.

### Task 2: Responsive Trust-flow connectors

**Files:**
- Modify: `/Users/mylesashitey/myles-portfolio-migration/src/app/work/fresh-greens/page.tsx`
- Modify: `/Users/mylesashitey/myles-portfolio-migration/src/app/styles/late-polish.css`
- Test: `/Users/mylesashitey/myles-portfolio-migration/src/app/work/fresh-greens/__tests__/prose-structure.test.ts`

**Interfaces:**
- Consumes: existing `.fg-mod-flow`, `.fg-mod-stage`, `--line`, and `--fg-accent`.
- Produces: empty accessible connector spans whose line and chevron are drawn by `::before` and `::after`.

- [ ] **Step 1: Write the failing connector test**

Assert that the moderation markup contains no literal arrow glyph, the connector spans remain `aria-hidden`, the desktop connector stretches between stages, and the mobile rule switches to a vertical line with a downward chevron instead of rotating text.

- [ ] **Step 2: Run the focused Vitest file**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts
```

Expected: FAIL because literal `→` glyphs and `transform: rotate(90deg)` remain.

- [ ] **Step 3: Implement the connector**

Make each connector span empty. Use a fixed flex basis, a one-pixel `var(--line)` rule, and a small `var(--fg-accent)` CSS chevron. Override its geometry at 620 pixels so the rule becomes vertical and the chevron points down.

- [ ] **Step 4: Re-run the focused test**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts
```

Expected: PASS for the connector contract before prose edits begin.

### Task 3: Case-study distillation

**Files:**
- Modify: `/Users/mylesashitey/myles-portfolio-migration/src/app/work/fresh-greens/page.tsx`
- Modify: `/Users/mylesashitey/myles-portfolio-migration/src/components/fresh-greens.tsx`
- Modify: `/Users/mylesashitey/myles-portfolio-migration/src/components/fresh-greens/pulled-over-journey.tsx`
- Modify: `/Users/mylesashitey/myles-portfolio-migration/src/lib/fresh-greens/palette.ts`
- Test: `/Users/mylesashitey/myles-portfolio-migration/src/app/work/fresh-greens/__tests__/prose-structure.test.ts`

**Interfaces:**
- Consumes: existing chapter structure, media, evidence-boundary labels, and configuration qualifiers.
- Produces: no more than 1,750 reader-facing words across the page, composed exhibits, and interactive states measured by a deterministic TypeScript-AST test.

- [ ] **Step 1: Add the failing prose-budget test**

Extract JSX text plus known reader-facing string properties while excluding alt text, paths, class names, and implementation comments. Assert a maximum of 1,750 words and retain assertions for “Interview-supported,” “Built in the prototype,” “Not yet proven,” configuration-dependent Supabase behavior, and the final safer-route qualifier.

- [ ] **Step 2: Run the focused Vitest file**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts
```

Expected: FAIL with the current count of roughly 2,200 reader-facing words.

- [ ] **Step 3: Remove repetition by layer**

Keep decisions in body copy, demonstrations in visuals, non-visible facts in captions, and implementation status in the evidence and final scope sections. Consolidate repeated routing-signal, Held-Question, reserved-color, moderation, and future-validation explanations without changing facts.

- [ ] **Step 4: Update exact-copy assertions**

Replace assertions tied to removed sentences with assertions for the surviving facts and state boundaries. Keep all story-bearing artifact and source-integrity checks.

- [ ] **Step 5: Run prose, page, and full verification**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts
npm run lint
npm run build
```

Expected: PASS with no new lint or build errors.

### Task 4: Cross-repository verification

**Files:**
- Verify only: both repositories’ changed files.

**Interfaces:**
- Consumes: Tasks 1 through 3.
- Produces: a clean, reviewable implementation diff that excludes unrelated user files.

- [ ] **Step 1: Run focused suites**

Run the Fresh Greens layout test and typecheck, then the portfolio Fresh Greens test file.

- [ ] **Step 2: Run diff checks**

Run `git diff --check` in each repository and inspect the exact changed-file list.

- [ ] **Step 3: Re-run the ai-slop mechanical scan**

Scan the edited candidate-facing files for em dashes, semicolons, ellipses, empty signposts, vocabulary tells, and repeated antithesis.

- [ ] **Step 4: Report repository state**

List the changed files in each repository, verification results, and the untouched user-owned Fresh Greens files.
