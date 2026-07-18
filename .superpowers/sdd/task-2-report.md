# Task 2 report: portfolio-surface accessibility and design-system alignment

Date: 2026-07-18

Status: Complete in the shared worktree. No commit was created.

## Implementation summary

- Fresh Greens research and pulled-over tabs now render every panel with stable tab/panel IDs in the server response. `useSyncExternalStore` keeps the server snapshot unenhanced and hides inactive panels only after hydration.
- Both Fresh Greens architecture wrappers, the onboarding illustration strip, and tall project-image previews are named, keyboard-focusable regions. The onboarding strip retains its nested native list semantics.
- Palette copy uses an explicit `idle | copied | error` state, clipboard feature detection, `try/catch`, and a polite status. The hex value stays rendered and selectable when clipboard access is absent or denied.
- About quick details now use a labelled section rather than complementary content.
- Navi heuristic evidence now renders as native `ul > li` markup.
- Fresh Greens' named pullquote follows the documented centered, borderless contract. Its caption returns to sentence case.
- Mobile TOC numbers and Fresh Greens palette roles retain the full contrast of the existing muted token. Existing case-study accents are unchanged.
- Coarse-pointer controls receive a viewport-independent 44 px floor.
- Navi heuristic animation is gated to no-preference contexts, and exact artifact/image layers receive explicit reduced-motion resets.

## RED evidence

After adding the Task 2 contracts and before production changes, this command was run:

```bash
npm test -- src/app/work/__tests__/artifact-accessibility-styles.test.ts src/app/__tests__/visible-first-motion.test.ts src/components/fresh-greens/__tests__/research-synthesis.test.tsx src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx src/components/__tests__/navi-artifact-layout.test.tsx src/components/__tests__/color-palette.test.tsx src/components/__tests__/project-section-card.test.tsx
```

Observed result:

```text
Test Files  8 failed (8)
Tests       16 failed | 23 passed (39)
Exit code   1
```

The failures were the intended missing behaviors: one transient panel instead of four stable panels, missing region roles, About still using `aside`, Navi still using role overrides instead of a native list, unhandled clipboard failure paths, absent coarse-pointer rules, old pullquote geometry, reduced label opacity, and ungated heuristic motion.

During the clipboard cycle, the first scenario stubs were installed before `userEvent.setup()`. User Event replaced them with its own clipboard polyfill, so the tests reported success regardless of the requested scenario. Reordering harness setup before the scenario stub proved the production success, unavailable, and rejected paths independently. This reusable testing insight is logged as Task Observer Observation 5.

## GREEN evidence

### Exact Task 2 focused suite

The same command was rerun after implementation:

```text
Test Files  8 passed (8)
Tests       39 passed (39)
Exit code   0
Warnings    none
```

### Related Fresh Greens component regression suite

Command:

```bash
npm test -- src/components/fresh-greens/__tests__/architecture-diagram.test.tsx src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx src/components/fresh-greens/__tests__/research-synthesis.test.tsx src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx src/components/__tests__/navi-artifact-layout.test.tsx src/components/__tests__/color-palette.test.tsx src/components/__tests__/project-section-card.test.tsx
```

Fresh output:

```text
Test Files  7 passed (7)
Tests       20 passed (20)
Exit code   0
Warnings    none
```

### Type, lint, and whitespace gates

Commands:

```bash
npm exec -- tsc --noEmit
npm run lint -- src/app/about/page.tsx src/components/fresh-greens.tsx src/components/fresh-greens/research-synthesis.tsx src/components/fresh-greens/pulled-over-journey.tsx src/components/fresh-greens/onboarding-illustration-sequence.tsx src/components/color-palette.tsx src/components/project-section-card.tsx src/components/navi.tsx src/app/work/__tests__/artifact-accessibility-styles.test.ts src/app/__tests__/visible-first-motion.test.ts src/components/fresh-greens/__tests__/research-synthesis.test.tsx src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx src/components/__tests__/navi-artifact-layout.test.tsx src/components/__tests__/color-palette.test.tsx src/components/__tests__/project-section-card.test.tsx
git diff --check -- <Task 2 paths>
```

All three commands exited 0 with no warnings or output beyond the lint command echo.

## Files changed

Production:

- `src/app/styles/portfolio-surfaces.css`
- `src/app/about/page.tsx`
- `src/components/fresh-greens.tsx`
- `src/components/fresh-greens/research-synthesis.tsx`
- `src/components/fresh-greens/pulled-over-journey.tsx`
- `src/components/fresh-greens/onboarding-illustration-sequence.tsx`
- `src/components/color-palette.tsx`
- `src/components/project-section-card.tsx`
- `src/components/navi.tsx`

Tests:

- `src/app/work/__tests__/artifact-accessibility-styles.test.ts`
- `src/app/__tests__/visible-first-motion.test.ts`
- `src/components/fresh-greens/__tests__/research-synthesis.test.tsx`
- `src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx`
- `src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx`
- `src/components/__tests__/navi-artifact-layout.test.tsx`
- `src/components/__tests__/color-palette.test.tsx`
- `src/components/__tests__/project-section-card.test.tsx`

Session records:

- `.superpowers/sdd/task-2-report.md`
- `skill-observations/log.md` with Task Observer Observation 5

## Shared-worktree note

While Task 2 was active, the controller moved shared TikTok cover rules from `portfolio-surfaces.css` into `base.css` and updated the existing artifact style assertion to read that block from its new owner. Those concurrent changes are visible in the same file diff but are not Task 2 work. Task 2 did not edit or revert the TikTok cover block, and the focused suite passed after the extraction.

## Self-review and follow-up

- Stable IDs and panel count are verified in static server markup, not only in the hydrated DOM.
- Hydrated tests verify that every `aria-controls` target remains mounted and only inactive panels receive `hidden`.
- Clipboard tests prove success, missing-API, and rejected-write behavior with the actual stub boundary exercised.
- The existing architecture test remains green after adding the second named architecture region.
- The muted tokens meet AA when fully opaque: `#c4c4c4` on `#0a0a0a` is 11.35:1, `#555555` on `#f0f0f0` is 6.54:1, and `#555555` on `#fafafa` is 7.14:1. The patch removes the opacity that weakened them without changing hue or accent roles.
- The full repository suite, production build, browser matrix, no-JavaScript screenshots, real keyboard traversal, and computed contrast inspection remain Task 6 responsibilities.
