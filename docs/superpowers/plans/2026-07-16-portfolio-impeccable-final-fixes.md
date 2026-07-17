# Portfolio Impeccable Final Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Resolve the approved final-audit backlog while preserving the authored visual and motion identity of all four portfolio case studies.

**Architecture:** Apply shared behavior fixes at the component and token layers, then make project-specific navigation, evidence, interaction, and closing-section changes in their owning routes. Keep the first two file-disjoint tasks parallel, then run the shared polish task after both land.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS custom properties, Vitest, Testing Library, ffmpeg.

## Global Constraints

- Preserve every factual claim, project role, date, metric, and evidence boundary.
- No em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or aphoristic closers in candidate-facing prose.
- Keep project-specific type, color, motion, and artifacts. Shared components may improve scanning but must not erase each case study's visual identity.
- All behavior changes begin with a failing regression test.
- Respect reduced-motion preferences and existing keyboard behavior.
- Do not alter Fresh Greens files that are unrelated to the approved audit findings from PR 37.

---

### Task 1: Process navigation and Fresh Greens stage map

**Files:**
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/components/__tests__/project-toc.test.tsx`
- Modify: `src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts`
- Create: `src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts`

**Interfaces:**
- Consumes: heading IDs already used by `ProjectToc` and the Fresh Greens route.
- Produces: a shared `--project-heading-offset: 3.5rem` contract and a nine-entry Fresh Greens stage list ending at `fg-scope`.

- [ ] **Step 1: Write failing tests for heading offsets and the nine-stage Fresh Greens map**

Assert that `base.css` applies `scroll-margin-top: var(--project-heading-offset)` to `.project-page h2[id]`. Assert that the route passes `fg-problem`, `fg-research`, `fg-scoring`, `fg-pulled-over`, `fg-pivot`, `fg-typecolor`, `fg-color`, `fg-trust`, and `fg-scope` to `ProjectToc` in that order.

- [ ] **Step 2: Run the focused tests and verify the old four-stage contract fails**

Run: `npm test -- src/components/__tests__/project-toc.test.tsx src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts`

Expected: FAIL because headings do not own the offset and only four Fresh Greens entries exist.

- [ ] **Step 3: Implement the shared heading offset and nine-stage map**

Define `--project-heading-offset: 3.5rem` on `.project-page`, replace the obsolete `.project-section[id]` selector with `.project-page h2[id]`, and pass all nine stage titles and IDs to `ProjectToc`. Update the daylight-arc `nth-child()` colors and mobile gradient stops to cover nine stages while preserving the sunrise-to-night sequence.

- [ ] **Step 4: Run the focused tests**

Run the command from Step 2.

Expected: all focused tests PASS.

- [ ] **Step 5: Commit only the task files**

Commit message: `fix: align process navigation with case study stages`

### Task 2: Modal, Navi, and diagram accessibility

**Files:**
- Modify: `src/components/lightbox-provider.tsx`
- Modify: `src/components/__tests__/lightbox-provider.test.tsx`
- Modify: `src/components/fresh-greens.tsx`
- Create: `src/components/fresh-greens/__tests__/architecture-diagram.test.tsx`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Create: `src/app/work/navi/__tests__/accent-contrast.test.ts`

**Interfaces:**
- Consumes: the existing LightboxProvider children wrapper, Navi `--nv-accent`, and `.fg-arch-scroll` container.
- Produces: an inert content wrapper while the lightbox is open, `--nv-accent-text`, and a focusable architecture region.

- [ ] **Step 1: Write failing accessibility and token tests**

Assert that opening the lightbox adds `inert` and `aria-hidden="true"` to the provider content wrapper and removes both after close. Assert that `.fg-arch-scroll` renders with `role="region"`, `tabIndex={0}`, and an architecture-specific accessible label. Assert that light-theme selected Navi labels use `var(--nv-accent-text)` rather than `var(--nv-accent)`.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- src/components/__tests__/lightbox-provider.test.tsx src/components/fresh-greens/__tests__/architecture-diagram.test.tsx src/app/work/navi/__tests__/accent-contrast.test.ts`

Expected: FAIL because the background is not inert, the diagram is not focusable, and the text-safe token does not exist.

- [ ] **Step 3: Implement the accessibility contracts**

Wrap provider children in a stable element that becomes inert and `aria-hidden` only while the dialog is open. Preserve Escape, focus trapping, body scroll lock, and trigger focus return. Add the architecture region attributes and a `:focus-visible` treatment. Define `--nv-accent-text` as the bright accent by default and `#b84d13` in light mode, then use it for selected or active text while retaining `--nv-accent` for fills and graphics. Replace the Fresh Greens `var(--tt-accent)` leak with `var(--foreground)`.

- [ ] **Step 4: Run focused tests**

Run the command from Step 2.

Expected: all focused tests PASS.

- [ ] **Step 5: Commit only the task files**

Commit message: `fix: harden portfolio accessibility states`

### Task 3: Recruiter scan layer and UnderstandingFAFSA interaction

**Files:**
- Modify: `src/components/recruiter-cut.tsx`
- Modify: `src/components/__tests__/recruiter-cut.test.tsx`
- Modify: `src/components/understandingfafsa.tsx`
- Modify: `src/components/__tests__/understandingfafsa-composer.test.tsx`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts`
- Modify: `src/app/work/understandingfafsa/__tests__/prose-structure.test.ts`
- Modify: `content/projects/understandingfafsa.md`

**Interfaces:**
- Consumes: existing `RecruiterCut` props and the newsletter composer state logic.
- Produces: a maximum four-row fact scan, manual phone scrolling, and an optional composer disclosure.

- [ ] **Step 1: Write failing behavior and truth tests**

Assert that `RecruiterCut` never renders more than four definition rows and omits the duplicated Problem row. Assert that page scroll does not mutate `.uf-phone-screen--scroll.scrollTop`. Assert that the composer controls are absent until a button named `Try the system` is activated. Assert that the route and metadata use both `observed` and `not a controlled attribution test` near the 52.6% result.

- [ ] **Step 2: Run focused tests and verify failure**

Run: `npm test -- src/components/__tests__/recruiter-cut.test.tsx src/components/__tests__/understandingfafsa-composer.test.tsx src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts`

Expected: FAIL on the row limit, page-scroll synchronization, disclosure, and claim qualification.

- [ ] **Step 3: Implement the smaller scanner and optional interaction**

Remove the Problem row. Select at most four facts in this order: Role, Contribution or Team, Timeline, Outcome or Stack. Keep Key moves variable-length. Remove the page-scroll synchronization effect from `BeforeAfterPhones`. Put `NewsletterComposer` behind an accessible disclosure button labeled `Try the system`, retaining the current interaction after expansion. On small screens hide Randomize and keep the block shelf and assembled-send states visually distinct. Change tracked uppercase scan labels to sentence case.

- [ ] **Step 4: Qualify the UnderstandingFAFSA outcome in Myles's voice**

Lead with the shipped modular template system. Describe 52.6% as the observed first redesigned send with MPP excluded, note earlier sends were around 30%, and state plainly that this was not a controlled attribution test. Preserve the November 4, 2025 date and all shipped deliverables.

- [ ] **Step 5: Run the focused tests and AI-slop mechanical scan**

Run the test command from Step 2, then run the AI-slop regex scan against `content/projects/understandingfafsa.md` and `src/app/work/understandingfafsa/page.tsx`.

Expected: tests PASS and the scan returns no prohibited house-style patterns in edited prose.

- [ ] **Step 6: Commit only the task files**

Commit message: `refine: focus recruiter scan and FAFSA evidence`

### Task 4: TikTok visual close

**Files:**
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/work/tiktok/__tests__/short-form.test.tsx`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: the three existing template records and their existing artifact paths.
- Produces: a compact critique-to-revision-to-shipped visual sequence in the final outcome section.

- [ ] **Step 1: Write a failing structural test**

Assert that the outcome section contains three labeled visual stages, `Critique`, `Revision`, and `Shipped direction`, and reuses existing artifact images rather than adding prose-only cards.

- [ ] **Step 2: Run the TikTok focused tests and verify failure**

Run: `npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx src/app/work/tiktok/__tests__/visibility.test.tsx src/app/work/tiktok/__tests__/truthfulness.test.ts`

Expected: FAIL because the current ending is one paragraph.

- [ ] **Step 3: Implement the visual sequence**

Build one compact semantic figure or ordered list with three artifact-backed stages. Keep the existing verified outcome: Light Academia shipped in the launch library and Myles later learned through Global Creative Lab that American Eagle selected it. Do not add performance metrics or claim ownership beyond the templates.

- [ ] **Step 4: Run tests and AI-slop scan**

Run the test command from Step 2 and the AI-slop regex scan against `src/app/work/tiktok/page.tsx`.

Expected: tests PASS and edited prose contains no prohibited patterns.

- [ ] **Step 5: Commit only the task files**

Commit message: `refine: give TikTok a visual project close`

### Task 5: Fresh Greens media cleanup

**Files:**
- Delete: `public/projects/fresh-greens/process/active-nav.mov`
- Potentially modify: `public/projects/fresh-greens/process/active-nav.mp4`
- Modify: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts`

**Interfaces:**
- Consumes: the existing `/projects/fresh-greens/process/active-nav.mp4` route reference.
- Produces: one deployable, browser-ready source with no unused MOV duplicate.

- [ ] **Step 1: Add a failing asset contract**

Assert that the route references the MP4 and that the public process directory contains no MOV duplicate.

- [ ] **Step 2: Inspect the referenced video before changing quality**

Run: `ffprobe -v error -show_entries stream=codec_name,width,height,r_frame_rate:format=duration,size,bit_rate -of default=noprint_wrappers=1 public/projects/fresh-greens/process/active-nav.mp4`

Record the codec, resolution, duration, and size.

- [ ] **Step 3: Remove the unused MOV and test a visually conservative transcode**

Encode to a temporary MP4 using H.264, `-preset slow`, `-crf 20`, `-movflags +faststart`, and the original dimensions. Replace the current MP4 only if it is smaller and frame inspection shows interface text and edges remain crisp. Otherwise retain the current MP4 and remove only the MOV.

- [ ] **Step 4: Run the asset test and inspect representative frames**

Run the focused test, extract frames at 25%, 50%, and 75% duration, and inspect them at original detail.

Expected: test PASS, no unused MOV, and no visible blur regression.

- [ ] **Step 5: Commit only the task files**

Commit message: `perf: trim Fresh Greens process media`

### Task 6: Portfolio-wide verification and final polish audit

**Files:**
- Modify only files required by newly discovered P0 or P1 regressions.
- Update: `.impeccable/critique/` with the final audit report.

**Interfaces:**
- Consumes: Tasks 1 through 5.
- Produces: a verified branch with no known P0 or P1 portfolio findings.

- [ ] **Step 1: Run focused cross-cutting tests**

Run the project TOC, lightbox, recruiter cut, UnderstandingFAFSA, TikTok, Fresh Greens, Navi contrast, and architecture test files together.

- [ ] **Step 2: Run full verification**

Run: `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run validate:content`, `npm run build`, and `git diff --check`.

Expected: every command exits 0.

- [ ] **Step 3: Run final AI-slop and Impeccable audits**

Read all four case-study routes and their metadata once before running the deterministic prose scan. Re-run the Impeccable critique across Fresh Greens, Navi, TikTok, and UnderstandingFAFSA. Fix any new P0 or P1 finding with a failing regression test.

- [ ] **Step 4: Request whole-branch code review**

Generate a review package from the branch merge base through HEAD and dispatch a broad reviewer. Address every Critical or Important finding, rerun covering tests, and re-review.

- [ ] **Step 5: Run the full verification commands again**

Expected: all tests, lint, type checking, content validation, production build, and whitespace checks pass after review fixes.
