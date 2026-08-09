# Release Prep Visual Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the six approved visual refinements and two Impeccable review gates into the portfolio release candidate without redesigning the shell or flattening project identity.

**Architecture:** Shared hiring-scan behavior lives in one small Reader component and Reader-owned CSS. Shell discovery and the 1024/1025 contract remain in the Myles 98 modules. Project facts stay at route callsites so claim ownership remains visible. Committed design truth and release evidence live in `DESIGN.md` and the closeout verification document.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Vitest, Testing Library, Playwright, Impeccable.

## Global Constraints

- Do not merge `codex/myles-98-visual-refinement` wholesale.
- Preserve all claim, authorship, chronology, and outcome guardrails.
- Preserve project-owned palettes, diagrams, artifacts, and narrative structures.
- Pocket is active at 1024px and narrower. Workstation begins at 1025px.
- Keep the full `RecruiterCut` after dominant lead media.
- Mobile Reader keeps one dominant top exit plus the fixed chapter control.
- Candidate-facing copy follows `MYLES-WRITING-STYLE.md`: no em dashes, semicolons, ellipses, hype, rhetorical question-and-answer scaffolding, or aphoristic closers.
- Begin behavior and responsive changes with failing tests.
- P0 and P1 Impeccable findings block release. P2 changes require an observed comprehension, accessibility, interaction, performance, or rendering failure.

---

### Task 1: Desktop discovery and shell breakpoint

**Files:**
- Modify: `src/components/myles-97/workstation-desktop.tsx`
- Modify: `src/components/myles-97/use-pocket-97.ts`
- Modify: `src/app/styles/myles-97-pocket.css`
- Modify: `src/components/__tests__/myles-97-shell.test.tsx`
- Modify: `src/components/__tests__/pocket-97-shell.test.tsx`
- Modify: `src/app/__tests__/portfolio-hardening-contract.test.ts`
- Modify: `src/app/__tests__/myles-97-hardening-contract.test.ts`

**Interfaces:**
- Consumes: `defaultGeometry`, `POCKET_97_QUERY`, and the pre-hydration workstation fallback.
- Produces: a default Welcome geometry that exposes at least three project identities and the exact query `(max-width: 1024px), (pointer: coarse)` in both JavaScript and CSS.

- [ ] **Step 1: Write failing shell tests**

Assert that `POCKET_97_QUERY` is exactly `(max-width: 1024px), (pointer: coarse)`. Assert the pre-hydration CSS uses the same boundary. Add a source contract for the approved Welcome geometry and retain the initial focused Welcome plus four discoverable case-study links.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm test -- src/app/__tests__/portfolio-hardening-contract.test.ts src/components/__tests__/myles-97-shell.test.tsx src/components/__tests__/pocket-97-shell.test.tsx`

Expected: FAIL on the old 767px boundary and old Welcome geometry.

- [ ] **Step 3: Implement the minimal shell change**

Use Pocket through 1024px in the hook and CSS fallback. Set the default Welcome geometry to `{ x: 520, y: 64, width: 504, height: 352 }` so one complete Selected Work card lane remains scannable and the window ends at the 1024px boundary. Add a narrow-workstation recipe-note correction only from 1025px through 1080px. Do not change persisted geometry, reducer behavior, shortcut positions, taskbar behavior, or project-card design.

- [ ] **Step 4: Run focused tests**

Run the command from Step 2.

Expected: PASS.

### Task 2: Reader opening scan and mobile exit simplification

**Files:**
- Create: `src/components/project-opening-facts.tsx`
- Create: `src/components/__tests__/project-opening-facts.test.tsx`
- Create: `src/app/work/__tests__/reader-opening-contract.test.ts`
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/app/work/navi/page.tsx`
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/styles/reader-mode.css`

**Interfaces:**
- Consumes: three supported strings per route plus one evidence link: `role`, `scope`, `outcome`, and `proof: { label, href }`.
- Produces: `ProjectOpeningFacts({ role, scope, outcome, proof })`, rendered between each project hero and its dominant media, plus a mobile-only rule hiding `.project-topbar` at 767px and below.

- [ ] **Step 1: Write failing component and route integration tests**

Render `ProjectOpeningFacts` and assert one `Project summary` region, exactly four definition rows, sentence-case labels, and no generic cards. For all four route sources, assert the component occurs after the hero or TikTok cover opening and before `LeadMedia` or the full `RecruiterCut`. Assert the existing `RecruiterCut` remains present. Assert Reader CSS hides `.project-topbar` only inside the 767px mobile query.

- [ ] **Step 2: Run the focused tests and confirm failure**

Run: `npm test -- src/components/__tests__/project-opening-facts.test.tsx src/app/work/__tests__/reader-opening-contract.test.ts`

Expected: FAIL because the component and mobile rule do not exist.

- [ ] **Step 3: Implement the shared component and supported route facts**

Use a semantic `section` and `dl`. Keep styling compact, Reader-owned, and distinct from the full `RecruiterCut`. Use only supported facts:

- Fresh Greens: role `Solo, design and engineering`; scope `Six interviews became a prototype spanning route comparison, en-route guidance, stress-state support, community reporting, and moderation.`; outcome `Working React Native prototype across 26+ screens.`; proof `Try the safety-flow reconstruction` to `#fg-pulled-over`.
- Navi: role `UI/UX Designer`; scope `I collected and synthesized 14 resident and stakeholder responses, including two local businesses.`; outcome `In a later solo rebuild, I turned Learn, Plan, Go into a React component system and working individual booking flow.`; proof `Try the booking flow` to `/work/navi/demo`.
- UnderstandingFAFSA: role `Product Designer`; scope `I designed the modular rules and rebuilt the live system in Mailchimp.`; outcome `A Mailchimp-native newsletter kit the founder can update without editing HTML.`; proof `Build a sample send` to `#uf-locked`.
- TikTok: role `Creative Strategist Intern · Global Creative Lab`; scope `I designed three static catalog templates for Dynamic Showcase Ads during my Global Creative Lab internship.`; outcome `Light Academia was 1 of 3 templates shipped in the launch library.`; proof `Inspect the template system` to `#tt-system`.

- [ ] **Step 4: Hide the redundant mobile breadcrumb**

Inside Reader's existing 767px query, set `.reader-mode.reader-mode .project-topbar` to `display: none`. Do not hide the sticky `ReaderHeader`, its 44px return target, or the fixed chapter control.

- [ ] **Step 5: Run focused tests and route truth tests**

Run the command from Step 2 plus the Fresh Greens, Navi, UnderstandingFAFSA, and TikTok claim or prose tests.

Expected: PASS with no ownership or metric regression.

### Task 3: Optical chrome and design exception register

**Files:**
- Modify: `src/components/myles-97/icons.tsx`
- Modify: `src/components/myles-97/reader-header.tsx`
- Modify: `src/components/myles-97/program-window.tsx`
- Modify: `src/components/myles-97/taskbar.tsx`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/components/__tests__/myles-98-icons.test.ts`
- Create: `src/components/__tests__/reader-chrome-precision.test.tsx`
- Modify: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`
- Modify: `DESIGN.md`
- Modify: `.impeccable/design.json`
- Create: `src/app/__tests__/design-system-exceptions.test.ts`

**Interfaces:**
- Consumes: `Myles97Icon` and its existing 24px drawing grid.
- Produces: a compact rendering mode for dense chrome, used by Reader header, title bars, and taskbar, aligned UnderstandingFAFSA composer controls, plus an explicit color/radius/pill exception register in `DESIGN.md` and `.impeccable/design.json`.

- [ ] **Step 1: Write failing icon and alignment tests**

Assert that a compact FAFSA icon renders one application-window and envelope silhouette without the three detached module boxes. Assert Reader header, ProgramWindow, and Taskbar request compact icons. Assert the FAFSA composer toolbar and preview heading use center alignment, the shelf uses `minmax(0, 1fr)`, and composer actions retain 44px targets.

- [ ] **Step 2: Run focused tests and confirm failure**

Run: `npm test -- src/components/__tests__/myles-98-icons.test.ts src/components/__tests__/reader-chrome-precision.test.tsx src/components/__tests__/myles-97-program-window.test.tsx`

Expected: FAIL because compact rendering and explicit optical contracts do not exist.

- [ ] **Step 3: Implement the compact icon path and optical alignment**

Add a narrowly scoped `compact` prop. For FAFSA only, use the simpler dense-chrome path. Preserve the existing icon at larger sizes. Apply compact rendering only to 16 to 18px title, Reader, and taskbar contexts. In the composer, set toolbar and preview-head alignment to center, make action controls at least 44px tall, use `3.25rem minmax(0, 1fr) auto` for shelf rows, and remove the preview heading's inherited bottom margin. Do not import the visual branch's broad composer stylesheet.

- [ ] **Step 4: Document intentional design exceptions**

Add named Three-Layer Ownership, Project Color, Hardware Radius, and Semantic Pill rules to the existing six `DESIGN.md` sections. Mirror them in `.impeccable/design.json` and add scoped metadata for `device-bezel: 34px`, `device-screen: 27px`, and `navi-pill: 999px`. Include exact scope rules and prohibited misuse. Do not add every literal color to the shared palette.

- [ ] **Step 5: Run focused tests**

Run the command from Step 2.

Expected: PASS.

### Task 4: First Impeccable refinement gate

**Files:**
- Modify only files in Tasks 1 through 3 when rendered evidence reveals an in-scope defect.

**Interfaces:**
- Consumes: the focused green implementation.
- Produces: a scoped layout, adapt, distill, and polish disposition with no open P0 or P1 findings.

- [ ] **Step 1: Run focused cross-cutting tests**

Run all tests changed or added in Tasks 1 through 3, plus Reader contrast, route visibility, claim accuracy, and shell hardening tests.

- [ ] **Step 2: Render the changed surfaces**

From the production app, capture home and all four Reader openings at 1440 by 900 and 390 by 844 in dark and light surrounding themes. Capture home at 1024 by 768 and 1025 by 768. Record shell mode, project-card visibility, opening-fact order, exit count, overflow, console errors, and broken images.

- [ ] **Step 3: Run the scoped Impeccable pass**

Use the current PRODUCT/DESIGN context and the brand register. Evaluate semantic spacing tiers, shell/Reader/project-layer ownership, project differentiation, mobile thumb-zone chrome, and the 1024/1025 handoff. Fix only evidenced blockers or regressions.

### Task 5: Full release verification and final cold-eye gate

**Files:**
- Modify: `docs/verification/2026-08-09-portfolio-closeout.md`
- Modify only production files required by newly discovered blocking regressions.

**Interfaces:**
- Consumes: Tasks 1 through 4.
- Produces: a verified release candidate, updated hiring reviews, final Impeccable disposition, and branch cleanup recommendation.

- [ ] **Step 1: Run full automated verification**

Run: `npm test`

Run: `npm run lint`

Run: `npx tsc --noEmit`

Run: `npm run validate:content`

Run: `npm run build`

Run: `node scripts/verify-reader-performance.mjs`

Run: `git diff --check`

Expected: every command exits 0.

- [ ] **Step 2: Run the full rendered and interaction matrix**

Run the Reader evidence capture in dark and light themes. Add release-prep screenshots and geometry measurements for home at 1440 by 900, 1024 by 768, 1025 by 768, and 390 by 844. Verify direct Reader entry, homepage entry, Back and Forward, return-to-program behavior, keyboard traversal, reduced motion, forced colors, 200 percent zoom, and no horizontal overflow.

- [ ] **Step 3: Repeat the hiring-manager reviews**

Record the 90-second retrieval result for role, scope, decision, proof, outcome, and caveat. Record the 10-minute result for causal coherence, ownership, specificity, honesty, pacing, and memorability.

- [ ] **Step 4: Run the second Impeccable critique and technical audit**

Use the stable route, viewport, theme, persona, and evidence signature from the design spec. Run the deterministic detector once with bounded output. Compare against the 28/40 pre-change critique directionally because the scope has expanded. Fix any P0 or P1 finding with a covering regression test and rerun the relevant matrix.

- [ ] **Step 5: Update release documentation**

In the closeout, replace the six deferred items with implemented results, add both Impeccable gate outcomes, update exact test/build/evidence totals, and refresh branch cleanup guidance. Continue to recommend no branch deletion until the active branch is pushed, accepted, evidence is preserved, and unique commits are rechecked.

### Task 6: Commit and handoff

**Files:**
- Stage only the files changed by this plan.

**Interfaces:**
- Consumes: a clean verification ledger.
- Produces: one release-prep implementation commit after the already committed design/plan checkpoint.

- [ ] **Step 1: Review the complete diff**

Run `git diff --check`, `git status --short`, and a merge-base diff against `origin/codex/myles-97-design`. Confirm no screenshots, logs, `.impeccable` sidecars, observation logs, or unrelated branch files are staged.

- [ ] **Step 2: Commit the verified release-prep slice**

Commit message: `refine: prepare portfolio visual release`

- [ ] **Step 3: Report the push and cleanup boundary**

Do not push or delete branches unless Myles explicitly authorizes it. Recommend the exact next safe action from the verified branch state.
