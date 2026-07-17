# Portfolio Final Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining portfolio audit fixes in two coordinated waves while preserving voice, privacy, and interactive storytelling.

**Architecture:** The main thread owns the Fresh Greens narrative files. Two independent subagents own the résumé export and motion-media lanes. Once those changes are reviewed and integrated, read-only audit lanes examine the combined portfolio before the main thread applies final fixes.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, CSS, Node PDF tooling, browser-based visual QA

## Global Constraints

- Preserve the homepage decoder and Absolute Batman line.
- Keep Fresh Greens first and identify it as the latest project.
- Name Black drivers explicitly in Fresh Greens.
- Do not add invented TikTok process detail.
- Follow `/Users/mylesashitey/.claude/writing-style-myles.md` for all candidate-facing prose.
- Keep the phone number out of public source, rendered pages, and generated artifacts.
- Use failing regression tests before implementation changes.
- Keep parallel edit scopes disjoint and preserve unrelated dirty-worktree changes.

---

### Task 1: Fresh Greens evidence and ending

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `content/projects/fresh-greens.md` if its public summary repeats an unsafe claim
- Test: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts`

**Interfaces:**
- Consumes: existing `RecruiterCut`, `ArchitectureDiagram`, and scope-section markup
- Produces: candidate-facing copy that separates interview evidence, prototype behavior, and remaining validation

- [ ] Add source-level regression tests that reject exact-weighting language, reject output-only outcome framing, require explicit prototype status, and require a demonstrated-learning closer before future work.
- [ ] Run `npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts` and confirm the new assertions fail for the intended phrases.
- [ ] Rewrite the recruiter summary, route-scoring explanation, scope labels, and ending with the minimum prose needed to satisfy the evidence model.
- [ ] Re-run the focused test and confirm it passes.
- [ ] Run the AI-slop read-through first, then its mechanical scan across Fresh Greens candidate-facing source.

### Task 2: Privacy-safe résumé PDF

**Files:**
- Modify: `scripts/export-resume-pdf.mjs`
- Modify: `scripts/verify-resume-pdf.mjs`
- Modify: `src/app/resume/page.tsx`
- Modify: `src/app/resume/__tests__/resume-source.test.ts`
- Modify: `src/app/resume/__tests__/resume-verifier.test.ts`
- Generate: `public/myles-ashitey-resume.pdf`

**Interfaces:**
- Consumes: the public résumé page and existing export scripts
- Produces: a downloadable PDF and verification that rejects phone-number leakage

- [ ] Add or strengthen failing tests for the public filename, restored download action, semantic link behavior, and phone-number exclusion.
- [ ] Run focused résumé tests and confirm the new expectations fail.
- [ ] Generate the PDF through the existing export path and restore the public download action.
- [ ] Verify text extraction, link annotations, page layout, and phone-number absence.
- [ ] Re-run the focused résumé tests and report the generated artifact size and verification results.

### Task 3: Motion-media delivery

**Files:**
- Inspect: `public/projects/fresh-greens/process/active-nav.mov`
- Inspect or modify: `src/components/lead-video.tsx`
- Inspect or modify: `src/components/__tests__/lead-video.test.tsx`
- Inspect or create: web-compatible media derivatives only when source quality supports them

**Interfaces:**
- Consumes: the existing QuickTime clip and high-resolution poster
- Produces: the best truthful web delivery possible from available source media, plus a precise remaining blocker if source resolution is insufficient

- [ ] Record source dimensions, duration, codecs, and bitrate, then compare them with rendered CSS size and common device-pixel ratios.
- [ ] Add a failing regression test for any verified delivery flaw that code can fix, such as duplicate container MIME fallbacks.
- [ ] Implement only delivery changes supported by the source and browser behavior.
- [ ] Re-run focused component tests and inspect representative playback frames.
- [ ] Do not upscale or claim the blur is fixed if the source remains 296 pixels wide.

### Task 4: Wave 1 integration review

- [ ] Inspect every subagent diff for scope and conflicts.
- [ ] Run each focused test suite from Tasks 1 through 3.
- [ ] Resolve Critical or Important review findings before Wave 2.

### Task 5: Portfolio-wide audit

**Files:**
- Inspect: all public `src/app/**/page.tsx` routes and their rendered desktop and mobile states
- Inspect: shared styles, interactive components, metadata, and public media

- [ ] Review homepage and case studies at representative desktop and mobile widths.
- [ ] Check keyboard operation, focus visibility, reduced motion, horizontal interactions, video fallbacks, and route dead ends.
- [ ] Audit candidate-facing copy across sibling pages for unsupported claims and repeated AI-writing patterns.
- [ ] Run production build and media-size checks.
- [ ] Report findings by P-level before applying any additional non-mechanical design change.

### Task 6: Final regression and release readiness

- [ ] Implement approved or objectively verified Wave 2 fixes with focused failing tests first.
- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npx tsc --noEmit`.
- [ ] Run `npm run build`.
- [ ] Run `git diff --check`.
- [ ] Confirm the phone number is absent from all public and generated artifacts.
- [ ] Summarize remaining external blockers, if any, without claiming they were fixed.
