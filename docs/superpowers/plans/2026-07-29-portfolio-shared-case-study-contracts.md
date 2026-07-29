# Portfolio Shared Case-Study Contracts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the shared chapter registry, responsive table-of-contents behavior, reduced-motion fallback, and integration gates consumed by the five page-specific refinement plans.

**Architecture:** The typed chapter registry remains the single source for every case-study table of contents. Page-specific plans own their page, unique components, and focused tests. This plan owns shared registry files, shared navigation tests, shared CSS, and the final cross-page verification so independent page workers never edit the same files concurrently.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library, CSS

## Global Constraints

- Candidate-facing copy follows both Myles voice guides and the canonical Writing Style section in `career-ops/modes/_profile.md`.
- Do not use em dashes, semicolons, ellipses, hype language, rhetorical questions with immediate answers, or slogan-like closing lines.
- Preserve each project's incumbent visual identity and artifact-led reading experience.
- Keep team work, individual work, research findings, implementation status, and future intent visibly separate.
- Do not turn a small sample, interview theme, or prototype behavior into proof of real-world impact.
- No production code may be written before its covering test is observed failing for the intended reason.
- Shared files in this plan are owned by the root task. Page workers must not edit them.
- Run the production build before standalone TypeScript verification because the generated Next.js types are shared state.

---

### Task 1: Finalize the shared chapter registry

**Files:**
- Modify: `src/lib/__tests__/project-chapters.test.ts`
- Modify: `src/lib/project-chapters.ts`

**Interfaces:**
- Consumes: `ProjectChapterEntry`, `ProjectChapterVariant`, and `CASE_STUDY_CHAPTERS`.
- Produces: the final six-entry Fresh Greens map, five-entry Navi map, four-entry TikTok map, and unchanged five-entry UnderstandingFAFSA map consumed by every `ProjectToc` and `ProjectChapter`.

- [ ] **Step 1: Replace the whole-object change detector with focused chapter contracts**

Keep the generic uniqueness and punctuation checks. Replace the old count and whole-object assertions with:

```ts
it("uses the approved chapter counts", () => {
  expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toHaveLength(6);
  expect(CASE_STUDY_CHAPTERS.navi).toHaveLength(5);
  expect(CASE_STUDY_CHAPTERS.tiktok).toHaveLength(4);
  expect(CASE_STUDY_CHAPTERS.understandingfafsa).toHaveLength(5);
});

it("keeps the public narrative order and navigation anchors", () => {
  expect(CASE_STUDY_CHAPTERS["fresh-greens"].map(({ id, stage }) => ({ id, stage }))).toEqual([
    { id: "fg-problem", stage: "Frame" },
    { id: "fg-research", stage: "Research" },
    { id: "fg-design", stage: "Plan" },
    { id: "fg-pulled-over", stage: "Respond" },
    { id: "fg-trust", stage: "Trust" },
    { id: "fg-scope", stage: "Validate" },
  ]);

  expect(CASE_STUDY_CHAPTERS.navi.map(({ id, stage }) => ({ id, stage }))).toEqual([
    { id: "nv-intro", stage: "Frame" },
    { id: "nv-insights", stage: "Research" },
    { id: "nv-framework", stage: "Define" },
    { id: "nv-build", stage: "Build" },
    { id: "nv-outcome", stage: "Validate" },
  ]);

  expect(CASE_STUDY_CHAPTERS.tiktok.map(({ id, stage }) => ({ id, stage }))).toEqual([
    { id: "tt-brief", stage: "Brief" },
    { id: "tt-research", stage: "Choose" },
    { id: "tt-system", stage: "Build" },
    { id: "tt-outcome", stage: "Deliver" },
  ]);
});
```

- [ ] **Step 2: Run the registry test and verify RED**

Run:

```bash
npm test -- src/lib/__tests__/project-chapters.test.ts
```

Expected: FAIL because TikTok still has five chapters, Fresh Greens still uses `fg-refine`, and the current titles and stages use the old process-led language.

- [ ] **Step 3: Update the typed registry with the exact maps**

Replace the Fresh Greens, Navi, and TikTok entries in `CASE_STUDY_CHAPTERS` with the exact IDs, stages, and human-facing titles from the approved design specification. Leave UnderstandingFAFSA unchanged. The tests protect navigational order and stages rather than freezing human prose word for word.

```ts
"fresh-greens": [
  { id: "fg-problem", stage: "Frame", title: "Why route planning needs more than time and distance" },
  { id: "fg-research", stage: "Research", title: "Three problems the interviews made clear" },
  { id: "fg-design", stage: "Plan", title: "1. See what is on each route before choosing" },
  { id: "fg-pulled-over", stage: "Respond", title: "2. Handle unexpected problems without adding stress" },
  { id: "fg-trust", stage: "Trust", title: "3. Navigate with transparent community contributors" },
  { id: "fg-scope", stage: "Validate", title: "What the prototype made possible and what still needs proof" },
],
navi: [
  { id: "nv-intro", stage: "Frame", title: "The first idea moved visitors, not behavior" },
  { id: "nv-insights", stage: "Research", title: "The survey changed the brief" },
  { id: "nv-framework", stage: "Define", title: "From neighborhood context to Learn, Plan, Go" },
  { id: "nv-build", stage: "Build", title: "From studio concept to working booking flow" },
  { id: "nv-outcome", stage: "Validate", title: "What works now and what still needs testing" },
],
tiktok: [
  { id: "tt-brief", stage: "Brief", title: "What Dynamic Showcase Ads needed" },
  { id: "tt-research", stage: "Choose", title: "Why three directions moved forward" },
  { id: "tt-system", stage: "Build", title: "One slot map, three visual systems" },
  { id: "tt-outcome", stage: "Deliver", title: "Why Light Academia shipped" },
],
```

- [ ] **Step 4: Run the registry test and verify GREEN**

Run:

```bash
npm test -- src/lib/__tests__/project-chapters.test.ts
```

Expected: PASS with four case-study maps, unique IDs, a six-chapter ceiling, and banned-punctuation protection.

- [ ] **Step 5: Commit**

```bash
git add src/lib/project-chapters.ts src/lib/__tests__/project-chapters.test.ts
git commit -m "refactor: align case-study chapter contracts"
```

---

### Task 2: Move the vertical table of contents to a safe breakpoint

**Files:**
- Modify: `src/components/__tests__/project-toc-layout.test.ts`
- Modify: `src/app/styles/base.css`

**Interfaces:**
- Consumes: the existing `.project-toc`, `.project-toc-text`, and vertical-spine media queries.
- Produces: horizontal chapter navigation through 1599px and the existing vertical spine from 1600px upward.

- [ ] **Step 1: Write the failing responsive contract**

Replace the current 1440px test with:

```ts
it("keeps 1440px horizontal and starts the vertical spine at 1600px", () => {
  expect(styles).not.toContain("@media (min-width: 1440px)");
  const wide = cssBlock("@media (min-width: 1600px)");
  const toc = cssBlock(".project-toc", wide);
  const link = cssBlock(".project-toc-link", wide);
  const rail = cssBlock(".project-toc-rail", wide);
  const label = cssBlock(".project-toc-text", wide);
  const active = cssBlock(
    ".project-toc-link--active .project-toc-text",
    wide,
  );

  expect(toc).toMatch(/width:\s*3\.6rem;/);
  expect(rail).toMatch(/height:\s*44px;/);
  expect(link).toMatch(/min-height:\s*44px;/);
  expect(label).toMatch(/right:\s*2\.5rem;/);
  expect(label).toMatch(/left:\s*auto;/);
  expect(label).toMatch(/text-align:\s*right;/);
  expect(active).toMatch(/opacity:\s*1;/);
});
```

- [ ] **Step 2: Run the layout test and verify RED**

Run:

```bash
npm test -- src/components/__tests__/project-toc-layout.test.ts
```

Expected: FAIL because `base.css` still activates the vertical spine at 1440px and has no 1600px block.

- [ ] **Step 3: Move both vertical-spine media queries**

In `base.css`, change:

```css
@media (min-width: 1440px)
```

to:

```css
@media (min-width: 1600px)
```

for both the main vertical-spine block and its reduced-motion companion. Do not change the geometry inside either block.

- [ ] **Step 4: Run the layout test and verify GREEN**

Run:

```bash
npm test -- src/components/__tests__/project-toc-layout.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/__tests__/project-toc-layout.test.ts src/app/styles/base.css
git commit -m "fix: delay vertical case-study navigation"
```

---

### Task 3: Align Fresh Greens shared presentation contracts with the new chapter

**Files:**
- Modify: `src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `fg-pulled-over` as the fourth `ProjectChapter` anchor from Task 1.
- Produces: the existing emotional-peak heading scale on the new chapter title rather than on the retired nested evidence heading.

- [ ] **Step 1: Write the failing chapter-title selector contract**

Replace the first daylight-arc test with:

```ts
it("keeps the traffic-stop emphasis on its chapter title", () => {
  expect(stylesheet).toMatch(
    /\.project-chapter-title#fg-pulled-over\s*\{/,
  );
  expect(stylesheet).not.toMatch(
    /\.project-evidence-heading#fg-pulled-over\s*\{/,
  );
});
```

- [ ] **Step 2: Run the daylight test and verify RED**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts
```

Expected: FAIL because the emphasis still targets
`.project-evidence-heading#fg-pulled-over`.

- [ ] **Step 3: Move the emphasis to the chapter title**

In `late-polish.css`, replace:

```css
.project-evidence-heading#fg-pulled-over {
```

with:

```css
.project-chapter-title#fg-pulled-over {
```

Keep the existing font size, letter spacing, and line height.

- [ ] **Step 4: Run the daylight test and verify GREEN**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts
```

Expected: PASS with the six-stop daylight palette unchanged.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/styles/late-polish.css
git commit -m "fix: move Fresh Greens emphasis to chapter title"
```

---

### Task 4: Stop the Navi loading pulse for reduced motion

**Files:**
- Modify: `src/app/__tests__/visible-first-motion.test.ts`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `.nv-demo-embed-skeleton-bar` and `@keyframes nvSkeletonPulse`.
- Produces: the existing pulse for motion-safe visitors and a static 70% opacity bar for reduced-motion visitors.

- [ ] **Step 1: Add the failing reduced-motion test**

Add:

```ts
it("stops the Navi demo skeleton pulse for reduced motion", () => {
  const reduced = cssBlocks(
    "@media (prefers-reduced-motion: reduce)",
    lateStyles,
  ).join("\n");

  expect(reduced).toMatch(
    /\.nv-demo-embed-skeleton-bar\s*\{[^}]*animation:\s*none;[^}]*opacity:\s*0\.7;/,
  );
});
```

- [ ] **Step 2: Run the motion test and verify RED**

Run:

```bash
npm test -- src/app/__tests__/visible-first-motion.test.ts
```

Expected: FAIL because the skeleton pulse currently runs unconditionally.

- [ ] **Step 3: Add the reduced-motion override**

Place this beside the skeleton keyframes:

```css
@media (prefers-reduced-motion: reduce) {
  .nv-demo-embed-skeleton-bar {
    animation: none;
    opacity: 0.7;
  }
}
```

- [ ] **Step 4: Run the motion test and verify GREEN**

Run:

```bash
npm test -- src/app/__tests__/visible-first-motion.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/__tests__/visible-first-motion.test.ts src/app/styles/late-polish.css
git commit -m "fix: respect reduced motion in Navi loading"
```

---

### Task 5: Reconcile shared page contracts after page work lands

**Files:**
- Modify: `src/app/work/__tests__/case-study-tocs.test.ts`
- Modify: `src/app/work/__tests__/lead-media-dimensions.test.ts`

**Interfaces:**
- Consumes: the final `CASE_STUDY_CHAPTERS` maps and each page's `entry={chapters[index]}` sequence.
- Produces: one shared integration test that catches missing, duplicate, skipped, or extra chapter bindings without hard-coding nested evidence-heading inventory.
- Preserves: verified Fresh Greens cover geometry while retiring the requirement for the en-route `LeadVideo` that no longer appears in the five-minute primary path.

- [ ] **Step 1: Replace evidence-ID checks with exact entry sequencing**

Remove `evidenceIds`, `idOccurrences`, and the per-page evidence arrays. After checking `ProjectToc`, derive the page's chapter indexes and compare them with the registry:

```ts
const entryIndexes = Array.from(
  source.matchAll(/entry=\{chapters\[(\d+)\]\}/g),
  ([, index]) => index,
);
const expectedIndexes = chapters.map((_, index) => String(index));

expect(entryIndexes).toEqual(expectedIndexes);
```

Keep the typed map access check and Fresh Greens `readingEndId="fg-scope"` check.

- [ ] **Step 2: Retire the removed en-route video expectation**

In `lead-media-dimensions.test.ts`, keep the existing Fresh Greens
`LeadMedia` assertion and optimized poster file checks. Delete only the
`LeadVideo` source assertion:

```ts
expect(source).toMatch(
  /<LeadVideo[\s\S]*?clip="\/projects\/fresh-greens\/process\/active-nav-flat-route\.mp4"[\s\S]*?width=\{1290\}[\s\S]*?height=\{2796\}[\s\S]*?\/>/,
);
```

Do not delete the media assets or change the verified cover dimensions.

- [ ] **Step 3: Run the shared integration tests**

Run after the Fresh Greens, Navi, TikTok, and UnderstandingFAFSA page plans have landed:

```bash
npm test -- src/app/work/__tests__/case-study-tocs.test.ts src/app/work/__tests__/lead-media-dimensions.test.ts
```

Expected: PASS. If it fails, fix the page binding rather than weakening the expected index sequence.

- [ ] **Step 4: Commit**

```bash
git add src/app/work/__tests__/case-study-tocs.test.ts src/app/work/__tests__/lead-media-dimensions.test.ts
git commit -m "test: protect case-study chapter integration"
```

---

### Task 6: Run the cross-page quality gates

**Files:**
- Verify only: every file changed by this plan and the five page-specific plans.

**Interfaces:**
- Consumes: all completed workstream commits.
- Produces: one verified branch ready for independent code review and rendered inspection.

- [ ] **Step 1: Run all focused page suites**

```bash
npm test -- \
  src/app/work/fresh-greens \
  src/components/fresh-greens \
  src/lib/fresh-greens \
  src/app/work/navi \
  src/app/work/understandingfafsa \
  src/app/work/tiktok \
  src/app/play \
  src/components/__tests__/loom-embed.test.tsx \
  src/components/__tests__/project-toc-layout.test.ts \
  src/components/__tests__/tiktok-template-system.test.tsx \
  src/components/__tests__/understandingfafsa-composer.test.tsx \
  src/app/work/__tests__/case-study-tocs.test.ts \
  src/app/work/__tests__/dedicated-route-visibility.test.tsx \
  src/lib/__tests__/project-chapters.test.ts
```

Expected: PASS with no warnings.

- [ ] **Step 2: Run the full automated gates in dependency-safe order**

```bash
npm run build
npx tsc --noEmit
npm run lint
npm run validate:content
npm test
git diff --check
```

Expected: every command exits 0.

- [ ] **Step 3: Run the prose gates once**

Read every changed candidate-facing paragraph aloud first. Then run the AI-writing scan against the changed page and content files. Reject em dashes, semicolons, ellipses, hype terms, canned transitions, repeated antithesis, rhetorical question-and-answer scaffolding, and structural rhyming across project openings.

- [ ] **Step 4: Run the Impeccable detector once**

Run the detector against the exact changed UI targets. Classify each result as introduced, touched, or pre-existing before acting. Do not repair `PRODUCT.md` or the stale design sidecar as part of this task.

- [ ] **Step 5: Review rendered pages in one bounded browser pass**

Bootstrap the in-app browser before declaring rendered review unavailable. Inspect Fresh Greens, Navi, UnderstandingFAFSA, TikTok, and Play at desktop, 1440px, tablet, and mobile widths in both themes. Confirm reduced motion for the Navi skeleton and Loom. Batch all defects, fix them once, then run at most one confirmation pass.

- [ ] **Step 6: Request independent whole-branch review**

Give the reviewer the approved design spec, all six implementation plans, the full branch diff, focused/full test evidence, and any detector findings classified as introduced or touched. Address all important findings before handoff.
