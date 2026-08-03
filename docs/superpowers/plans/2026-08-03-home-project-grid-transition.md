# Homepage Project Grid and Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render the four homepage projects as an equal ordered grid and carry every selected cover directly into its case-study hero.

**Architecture:** `WorkGallery` becomes a single ordered grid with one card variant. Project-entry requests carry a discriminated visual payload so `ProjectEnterTransition` can render either a normal project image or the reusable TikTok cover field, then morph that frame from the source rectangle directly to the destination hero rectangle.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Web Animations API, Vitest, Testing Library.

## Global Constraints

- Fresh Greens leads by order and numbering, not by card size.
- All desktop project cards use equal geometry and the existing 3:2 cover ratio.
- Mobile uses one column in the existing project order.
- Modified clicks and reduced-motion preferences keep normal link navigation.
- No new dependency is introduced.
- Existing design tokens, evidence labels, working-file chrome, and project imagery remain intact.

---

### Task 1: Equal ordered project grid

**Files:**
- Modify: `src/components/__tests__/work-gallery.test.tsx`
- Modify: `src/components/__tests__/work-project-card-layout.test.tsx`
- Modify: `src/components/work-gallery.tsx`
- Modify: `src/components/work-project-card.tsx`
- Modify: `src/app/styles/base.css`

**Interfaces:**
- Consumes: `Project[]` sorted by `getPublishedProjects()`.
- Produces: `WorkGallery` with one `.work-gallery-grid` containing every `WorkProjectCard` in source order.

- [ ] **Step 1: Write failing grid tests**

Replace featured/closing expectations with assertions that four projects render in one grid, retain indices `0..3`, and produce no `.work-gallery-feature`, `.work-gallery-closing`, or `.work-gallery-closing-wrap` nodes. Update the card image-size assertion to expect `(max-width: 767px) 100vw, min(46vw, 524px)` for every image-backed card.

- [ ] **Step 2: Verify the tests fail for the old asymmetric layout**

Run: `npm test -- src/components/__tests__/work-gallery.test.tsx src/components/__tests__/work-project-card-layout.test.tsx`

Expected: FAIL because Fresh Greens is still featured, TikTok still closes through a wrapper, and the closing image uses the 72vw size hint.

- [ ] **Step 3: Implement the equal grid**

Render `projects.map((project, index) => <WorkProjectCard ... />)` directly inside `.work-gallery-grid`. Remove `featured` and `closing` props and branches from `WorkProjectCard`. Use one delay sequence derived from `index`, and one responsive `sizes` value for image cards.

- [ ] **Step 4: Replace asymmetric gallery CSS**

Delete the featured and closing layout rules. Keep `.work-gallery-grid` at two equal columns with the existing fluid gap, and switch it to one column at `max-width: 767px`.

- [ ] **Step 5: Verify the grid tests pass**

Run: `npm test -- src/components/__tests__/work-gallery.test.tsx src/components/__tests__/work-project-card-layout.test.tsx`

Expected: PASS with every project in the shared grid and no asymmetric variant nodes.

### Task 2: Shared transition visual contract

**Files:**
- Create: `src/lib/__tests__/project-enter.test.ts`
- Modify: `src/lib/project-enter.ts`
- Modify: `src/components/__tests__/work-project-card-layout.test.tsx`
- Modify: `src/components/work-project-card.tsx`

**Interfaces:**
- Produces: `ProjectEnterVisual = { type: "image"; src: string } | { type: "tiktok" }`.
- Produces: `ProjectEnterRequestDetail.visual: ProjectEnterVisual`.
- Consumes: `dispatchProjectEnterRequest(detail)` from the project card.

- [ ] **Step 1: Write failing request tests**

Add a real `CustomEvent` listener test that calls `dispatchProjectEnterRequest()` and asserts the exact discriminated visual payload is delivered. Add a card interaction test that clicks TikTok with reduced motion disabled and asserts the dispatched request has `visual: { type: "tiktok" }`.

- [ ] **Step 2: Verify the tests fail because TikTok bypasses the transition**

Run: `npm test -- src/lib/__tests__/project-enter.test.ts src/components/__tests__/work-project-card-layout.test.tsx`

Expected: FAIL because the request type has no `visual` field and the TikTok click returns before dispatch.

- [ ] **Step 3: Implement the discriminated visual request**

Add `ProjectEnterVisual`, replace `imageSrc` with `visual`, remove the TikTok early return, and dispatch `{ type: "tiktok" }` for TikTok or `{ type: "image", src: project.coverImage }` for normal image cards.

- [ ] **Step 4: Verify request tests pass**

Run: `npm test -- src/lib/__tests__/project-enter.test.ts src/components/__tests__/work-project-card-layout.test.tsx`

Expected: PASS with both visual payloads observable through the real custom event.

### Task 3: Direct source-to-hero morph

**Files:**
- Create: `src/components/__tests__/project-enter-transition.test.tsx`
- Modify: `src/components/project-enter-transition.tsx`
- Modify: `src/app/styles/base.css`

**Interfaces:**
- Consumes: `ProjectEnterRequestDetail.visual`.
- Consumes: `waitForProjectCover(slug)` and the destination hero's bounding rectangle.
- Produces: `.project-enter-image` for image visuals and `.project-enter-tiktok` containing `TikTokCoverBlobs` for TikTok visuals.

- [ ] **Step 1: Write failing overlay tests**

Render `ProjectEnterTransition` with a mocked Next router, dispatch an image request, and assert navigation begins once the overlay mounts. Enter the settling phase with marked destination media and assert exact target geometry, Escape cleanup, and reduced-motion fallback. Repeat with a TikTok request and assert `.project-enter-tiktok .tt-cover-field` is rendered eagerly instead of `.project-enter-image`.

- [ ] **Step 2: Verify the tests fail against the full-screen intermediate transition**

Run: `npm test -- src/components/__tests__/project-enter-transition.test.tsx`

Expected: FAIL because navigation currently waits for the zoom timeline and the overlay only renders `next/image`.

- [ ] **Step 3: Implement the holding and direct-morph phases**

Replace `zoom-in` with `holding`. After the overlay commits, push the route and enter `navigating`. Add the settling class before navigation so the destination page is hidden on first paint. In `runSettle`, animate the frame's `top`, `left`, `width`, `height`, and corner radius directly to the marked destination rectangle, then crossfade the overlay and page near the end. Direct geometry keeps unlike aspect ratios and rounded corners from distorting under scale.

- [ ] **Step 4: Render the matching overlay visual**

Import `TikTokCoverBlobs`. Render it inside `.project-enter-tiktok` for `{ type: "tiktok" }`; render `Image` for `{ type: "image" }`. Size both to fill `.project-enter-frame`.

- [ ] **Step 5: Verify transition tests pass**

Run: `npm test -- src/components/__tests__/project-enter-transition.test.tsx`

Expected: PASS for immediate navigation after mount and both overlay visual variants.

### Task 4: Regression and visual verification

**Files:**
- Modify only if verification exposes a defect in files already listed above.

**Interfaces:**
- Consumes: the completed homepage grid and transition behavior.
- Produces: fresh verification evidence for handoff.

- [ ] **Step 1: Run focused tests**

Run: `npm test -- src/components/__tests__/work-gallery.test.tsx src/components/__tests__/work-project-card-layout.test.tsx src/components/__tests__/project-enter-transition.test.tsx src/lib/__tests__/project-enter.test.ts`

- [ ] **Step 2: Run static and content checks**

Run: `npm run lint`

Run: `npm run validate:content`

Run: `npm run build`

Run: `npx tsc --noEmit`

- [ ] **Step 3: Run the full test suite**

Run: `npm test`

- [ ] **Step 4: Inspect desktop and mobile renders**

At 1440px width, verify a complete two-by-two grid with TikTok in the bottom-right. At 390px width, verify a single ordered column. Activate a normal project and TikTok, confirming each visible cover lands on the matching destination hero without a full-screen zoom detour.

- [ ] **Step 5: Review the final diff**

Run: `git diff --check`

Run: `git diff --stat`

Confirm only the approved grid, transition, tests, and planning documents changed.
