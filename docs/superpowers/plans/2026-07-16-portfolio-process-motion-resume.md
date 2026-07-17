# Portfolio Process, Motion, and Résumé Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the three non-Fresh-Greens case studies expose their complete design process, add project-specific reading motifs and restrained artifact motion, and regenerate a privacy-safe résumé PDF.

**Architecture:** Keep `ProjectToc` as the single accessible reading instrument and specialize it with page-scoped CSS. Keep `CountUp` API-compatible while changing it from numeric interpolation to factual-text emphasis. Treat the résumé page as the only editable content source and regenerate the PDF through the existing tagged export pipeline.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library, Chrome DevTools PDF export, Poppler.

## Global Constraints

- Preserve confirmed facts and qualifiers. Do not invent research, validation, outcomes, or implementation details.
- Content is visible by default. Motion may emphasize content but may not gate it.
- Honor `prefers-reduced-motion` for every new transition.
- Preserve `ProjectToc` keyboard behavior and 44px targets.
- Leave Fresh Greens' daylight-arc timeline unchanged.
- Do not publish a phone number.
- Candidate-facing prose follows Myles's voice guide with no em dashes, semicolons, ellipses, hype language, or repeated process-eyebrow scaffolding.
- The worktree is already dirty with user-owned changes. Do not stage or commit files during this batch.

---

### Task 1: Replace numeric interpolation with factual emphasis

**Files:**
- Create: `src/components/__tests__/count-up.test.tsx`
- Modify: `src/components/count-up.tsx`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `CountUp({ value, durationMs?, className? })`
- Produces: the same public component API, with `value` remaining the only rendered text and `data-count-up-emphasized` controlling a one-shot highlight

- [ ] **Step 1: Write the failing factual-value test**

Render `<CountUp value="~30% → ~52.6%" />` with a captured `IntersectionObserver` callback. Assert the final string before and after intersection, and assert `data-count-up-emphasized="true"` after intersection.

- [ ] **Step 2: Write the failing reduced-motion test**

Stub `matchMedia` with `matches: true`. Assert that `1` remains visible and `IntersectionObserver` is never constructed.

- [ ] **Step 3: Verify RED**

Run:

```bash
npm test -- src/components/__tests__/count-up.test.tsx
```

Expected: the intersection test fails because the existing component replaces the final result with an interpolated zero value.

- [ ] **Step 4: Implement the minimal factual reveal**

Remove tokenization, numeric rendering, state, and the animation frame loop. Render `value` directly. On intersection, set `node.dataset.countUpEmphasized = "true"`, disconnect, and retain the final text.

- [ ] **Step 5: Add the bounded highlight styles**

Add a static `.count-up-fact` underline background. Under `prefers-reduced-motion: no-preference`, transition `background-size` for 560ms with `cubic-bezier(0.22, 1, 0.36, 1)`. Under reduced motion, show the final underline immediately.

- [ ] **Step 6: Verify GREEN**

Run the focused test and the existing UnderstandingFAFSA prose suite. Expected: all tests pass and no result text changes.

---

### Task 2: Expand every process timeline

**Files:**
- Modify: `src/app/work/__tests__/case-study-tocs.test.ts`
- Modify: `src/app/work/tiktok/__tests__/short-form.test.tsx`
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/work/navi/page.tsx`
- Create: `src/app/work/navi/__tests__/prose-structure.test.ts`
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/app/work/understandingfafsa/__tests__/prose-structure.test.ts`
- Modify: `src/components/__tests__/tiktok-prune.test.ts`

**Interfaces:**
- Consumes: `ProjectToc({ sections, readingEndId? })`
- Produces: exact H2 and TOC maps from the approved design spec, including TikTok `tt-outcome`, Navi `nv-outcome`, and UnderstandingFAFSA `uf-results`

- [ ] **Step 1: Replace the grouped-chapter test contract**

Add a source helper that extracts story-bearing `<h2 id="...">...</h2>` values. Require TikTok's five, Navi's eight, and UnderstandingFAFSA's seven TOC entries to equal the visible H2 sequence. Keep Fresh Greens as the explicit grouped-navigation exception with `readingEndId="fg-scope"`.

- [ ] **Step 2: Update route-specific heading tests**

Require the exact approved titles and order. Require TikTok to render `ProjectToc`. Require the final outcome or validation ID on all three pages. Preserve the American Eagle learning-path qualifier.

- [ ] **Step 3: Verify RED**

Run:

```bash
npm test -- src/app/work/__tests__/case-study-tocs.test.ts src/app/work/tiktok/__tests__/short-form.test.tsx src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts src/components/__tests__/tiktok-prune.test.ts
```

Expected: failures for the four-entry Navi and UnderstandingFAFSA arrays, the missing TikTok TOC, old headings, and non-semantic TikTok outcome paragraph.

- [ ] **Step 4: Implement the approved title maps**

Update every H2 and matching TOC entry exactly as written in the design spec. Import and render `ProjectToc` after TikTok's `RecruiterCut`. Convert the TikTok outcome paragraph into a `project-section tt-section` with H2 `id="tt-outcome"` and keep the existing qualified outcome text.

- [ ] **Step 5: Verify GREEN and run the anti-slop scan**

Run the focused tests. Then run the AI-slop mechanical patterns across the three page files and confirm that only date-range en dashes and source syntax match.

---

### Task 3: Add project-specific reading motifs

**Files:**
- Modify: `src/components/project-toc.tsx`
- Modify: `src/components/__tests__/project-toc.test.tsx`
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`

**Interfaces:**
- Consumes: existing `.project-toc-dot`, `.project-toc-rail::after`, `--seg-fill`, and `--toc-progress`
- Produces: page-scoped TikTok channel split, Navi route waypoints, UnderstandingFAFSA palette segments, and a safely ellipsized active mobile title

- [ ] **Step 1: Write failing CSS motif contracts**

Assert that every override is scoped beneath `.tt-page`, `.nv-page`, or `.uf-page`. Require TikTok cyan and magenta channels, Navi `var(--nv-accent)` route/waypoint treatment, and UnderstandingFAFSA staged `--seg-color` values applied to rails, dots, and mobile progress. Re-run the existing Fresh Greens timeline assertions unchanged.

- [ ] **Step 2: Write the failing mobile-title resilience test**

Require the active title to render inside a dedicated `.project-toc-active-title` span and require that selector to use `min-width: 0`, `overflow: hidden`, `text-overflow: ellipsis`, and `white-space: nowrap`.

- [ ] **Step 3: Verify RED**

Run the ProjectToc and artifact-style suites. Expected: failures for all three missing motifs and the missing active-title wrapper.

- [ ] **Step 4: Implement the CSS-only motifs and title wrapper**

Use the existing shared DOM. Do not add a motif prop. Keep the Fresh Greens block unchanged. Add the active-title wrapper without changing button labeling, focus behavior, or the 44px target.

- [ ] **Step 5: Verify GREEN**

Run the focused suites and TypeScript.

---

### Task 4: Loosen TikTok and add bounded artifact motion

**Files:**
- Create: `src/components/__tests__/tiktok-cover-blobs.test.tsx`
- Modify: `src/components/tiktok-dsa.tsx`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`

**Interfaces:**
- Consumes: extracted `COVER_BLOBS`, existing process cards, and existing template switcher states
- Produces: desktop preview coordinates using `0.74` spread, mobile variables using `0.68/0.70`, TikTok sketch-to-final overlay reveal, UnderstandingFAFSA template overlay transition, and section emphasis that never hides content before scroll

- [ ] **Step 1: Write the failing blob-geometry test**

Assert desktop top and bottom stem values near `7.31` and `65.91`, the right satellite below `78`, and mobile top and bottom values near `6.32` and `61.75`.

- [ ] **Step 2: Write failing motion-safety contracts**

Require new overlay selectors to live inside `prefers-reduced-motion: no-preference`. Require reduced-motion and print overrides and ensure base selectors do not start hidden, transparent, or fully clipped. Preserve the UnderstandingFAFSA tall preview's existing bottom-fade mask.

Add a regression contract for the shared case-study section and heading reveal rules. The base selectors must not set `opacity: 0`, translate the whole section, or fully clip the heading. Print and headless rendering must expose all content without waiting for a view timeline or observer.

- [ ] **Step 3: Verify RED**

Run the new geometry test and artifact-style suite. Expected: failure against the current `0.58` composition and missing mask rules.

- [ ] **Step 4: Implement geometry and motion**

Add desktop and mobile custom properties to each blob and the `max-width: 640px` position override. Keep drift keyframes unchanged. Add low-opacity pseudo-element overlay sweeps to TikTok process finals and the UnderstandingFAFSA keyed template preview instead of clipping the real artifacts. Replace the content-gating section and heading reveals with non-gating emphasis so the base DOM remains fully visible at every scroll position.

- [ ] **Step 5: Verify GREEN**

Run focused tests. Inspect the hero and artifact sections at 1280px and 390px in the browser, including section-specific screenshots and reduced motion.

---

### Task 5: Regenerate the canonical résumé

**Files:**
- Modify: `src/app/resume/page.tsx`
- Modify: `src/app/resume/__tests__/resume-page.test.tsx`
- Modify: `src/app/resume/__tests__/resume-source.test.ts`
- Modify: `src/app/resume/__tests__/resume-verifier.test.ts`
- Modify: `src/components/scroll-reveal-fallback.tsx`
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `scripts/verify-resume-pdf.mjs`
- Generate: `public/myles-ashitey-resume.pdf`

**Interfaces:**
- Consumes: the résumé page, tagged Chrome export, and existing structural verifier
- Produces: three absolute case-study links, immediately visible contact details, no print grain, a 1 MiB size ceiling, and a verified one-page tagged PDF

- [ ] **Step 1: Write failing source and verifier tests**

Require absolute Fresh Greens, UnderstandingFAFSA, and Navi links around their project names. Require those URI/text pairs in the verifier. Require positive Navi and TikTok evidence sentinels, `body::after { display: none !important; }` inside print CSS, and the absence of `.resume-detail` from the scroll-reveal fallback.

- [ ] **Step 2: Add a failing size-limit unit test**

Extract or export a file-size assertion. Verify an under-1-MiB fixture passes and an over-limit fixture throws.

- [ ] **Step 3: Verify RED**

Run all four résumé suites. Expected: failures for missing case-study links, print-grain suppression, immediate contact details, and size validation.

- [ ] **Step 4: Implement the source fixes**

Use absolute production URLs for project headings. Remove `.resume-detail` from the fallback selector lists. Hide `body::after` in print. Extend the verifier without weakening any existing privacy, tagging, structure, link, font, or reading-order check.

- [ ] **Step 5: Verify GREEN before generation**

Run all résumé suites, lint the touched files, and run TypeScript.

- [ ] **Step 6: Generate and inspect the candidate PDF**

Build and start the local production server. Export to `tmp/pdfs/myles-ashitey-resume-candidate.pdf`. Run the verifier, `pdfinfo`, `pdffonts`, and render page one at 144 DPI. Inspect the PNG for clipping, overlaps, density, and link-label clarity.

- [ ] **Step 7: Publish the verified artifact**

Replace `public/myles-ashitey-resume.pdf` with the verified candidate, run `npm run resume:pdf:verify`, and confirm the public artifact is byte-identical to the inspected candidate.

---

### Task 6: Integrated verification and review

**Files:**
- Inspect: all files changed in Tasks 1 through 5

**Interfaces:**
- Consumes: completed implementation
- Produces: fresh regression, build, visual, and review evidence

- [ ] **Step 1: Run full automated gates**

```bash
npm test
npm run lint
npx tsc --noEmit
npm run build
git diff --check
```

- [ ] **Step 2: Run responsive visual QA**

Inspect TikTok, Navi, UnderstandingFAFSA, and the résumé at 1280px and 390px. Capture the hero plus every changed process or artifact section. Verify dark and light themes, timeline scrolling, mobile title ellipsis, no horizontal overflow, final metric text, and reduced-motion behavior.

- [ ] **Step 3: Run final whole-diff review**

Dispatch a fresh reviewer against the scoped diff. Fix every Critical or Important finding with a covering test, then re-run the relevant gates.

- [ ] **Step 4: Report the handoff**

Summarize the process maps, motion changes, résumé artifact size and structure, test counts, build result, and any deliberately deferred P2 or P3 work. Do not stage or commit.
