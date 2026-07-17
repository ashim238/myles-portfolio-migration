# TikTok Template System Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a noindex TikTok case-study preview that replaces the tumbling-phone composition with an authentic, selectable three-template system explanation.

**Architecture:** Add a dedicated `/work/tiktok/preview` route so the published case remains stable during review. Keep TikTok-specific interaction in focused client components, copy original SVG exports into a public system-assets directory, and reuse shared portfolio chrome and case-study primitives.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Use the exact factual scope from `docs/superpowers/specs/2026-07-15-tiktok-template-system-preview-design.md`.
- Do not change the published `/work/tiktok` route during preview implementation.
- Do not publish PSD files or fabricate a historical hybrid.
- Use only the original template names: `#DopamineDressing`, `#e-Boy/#e-Girl`, and `#LightAcademia`.
- Use `Creative Strategist Intern` and `Global Creative Lab`.
- Present GCL feedback as paraphrased iteration notes, never direct quotations.
- All candidate-facing copy follows `/Users/mylesashitey/.claude/writing-style-myles.md`.
- Mobile controls have a 44px minimum touch target, visible focus, and reduced-motion behavior.

---

### Task 1: Lock the preview narrative and route contract

**Files:**
- Create: `src/app/work/tiktok/preview/__tests__/page.test.tsx`
- Create: `src/app/work/tiktok/preview/page.tsx`
- Modify: `src/lib/tiktok-data.ts`

**Interfaces:**
- Produces: `TIKTOK_TEMPLATES`, the single data source for template names, asset paths, shipped state, and iteration notes.
- Produces: a noindex `/work/tiktok/preview` route.

- [ ] **Step 1: Write failing route tests**

Assert the rendered preview contains `Creative Strategist Intern`, `Global Creative Lab`, the three original names, exactly one `Shipped` label associated with Light Academia, and language stating that Myles learned through GCL that American Eagle selected it. Assert the preview source excludes the three retired secondary names and `<blockquote`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/app/work/tiktok/preview/__tests__/page.test.tsx`

Expected: FAIL because the preview route and template data do not exist.

- [ ] **Step 3: Add the minimal data model and preview route scaffold**

Define a typed `TIKTOK_TEMPLATES` array with keys, exact names, full-template asset paths, optional component asset paths, shipped state, sketch paths, and paraphrased iteration notes. Render the approved factual copy and shared portfolio chrome. Add noindex metadata.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/app/work/tiktok/preview/__tests__/page.test.tsx`

Expected: PASS.

### Task 2: Add original system assets and selectable contact sheet

**Files:**
- Create: `public/projects/tiktok/system/academia.svg`
- Create: `public/projects/tiktok/system/dopamine.svg`
- Create: `public/projects/tiktok/system/eboy.svg`
- Create: `public/projects/tiktok/system/academia-barcode.svg`
- Create: `public/projects/tiktok/system/academia-text.svg`
- Create: `public/projects/tiktok/system/dopamine-title.svg`
- Create: `src/components/__tests__/tiktok-template-system.test.tsx`
- Modify: `src/components/tiktok-dsa.tsx`

**Interfaces:**
- Produces: `TikTokTemplateSystem`, a client component consuming `TIKTOK_TEMPLATES` and exposing selected-template state.

- [ ] **Step 1: Copy the approved original SVG exports**

Copy the six files from `/Users/mylesashitey/Downloads/tiktok_portfolio_asset/` into `public/projects/tiktok/system/` with the normalized names above. Do not copy `Gradient Cover Art.psd`.

- [ ] **Step 2: Write failing component tests**

Assert all three template buttons render, Light Academia alone has the shipped state, the first template is selected initially, clicking another button changes the detailed-view accessible label, and the buttons expose selected state.

- [ ] **Step 3: Run the focused test and verify RED**

Run: `npm test -- src/components/__tests__/tiktok-template-system.test.tsx`

Expected: FAIL because `TikTokTemplateSystem` does not exist.

- [ ] **Step 4: Implement the minimal contact sheet and selected view**

Render three flat, selectable templates using original SVGs. Keep the selected template in a detailed upright stage. Use real buttons with `aria-pressed` and descriptive names. Do not add cursor-following 3D transforms.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `npm test -- src/components/__tests__/tiktok-template-system.test.tsx`

Expected: PASS.

### Task 3: Add the assembly explanation and preview styling

**Files:**
- Modify: `src/components/__tests__/tiktok-template-system.test.tsx`
- Modify: `src/components/tiktok-dsa.tsx`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/app/work/tiktok/preview/page.tsx`

**Interfaces:**
- Extends: `TikTokTemplateSystem` with selected-region state for title, catalog slot, supporting graphics, and TikTok interface.

- [ ] **Step 1: Write failing assembly-control tests**

Assert four region controls render, selecting a region updates the explanatory copy and selected state, and the component distinguishes original exported parts from conceptual overlays.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/__tests__/tiktok-template-system.test.tsx`

Expected: FAIL because assembly controls are absent.

- [ ] **Step 3: Implement assembly controls and responsive styling**

Add the four region controls, overlays, fixed deep-slate sketch mattes, 44px mobile targets, AA text colors, focus states, and reduced-motion overrides. Keep motion to short opacity and position transitions that explain selection.

- [ ] **Step 4: Tighten the cover drift for the preview**

Scope a calmer cover variant to the preview. Keep the extracted pieces close enough that the TikTok mark remains recognizable at rest and throughout the loop. Do not alter the published route's cover until approval.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run: `npm test -- src/components/__tests__/tiktok-template-system.test.tsx src/app/work/tiktok/preview/__tests__/page.test.tsx`

Expected: PASS.

### Task 4: Verify the preview and protect the published route

**Files:**
- Modify: `src/app/work/tiktok/__tests__/short-form.test.tsx` only if needed to assert the published route remains unchanged.

- [ ] **Step 1: Run TikTok regression tests**

Run: `npm test -- src/app/work/tiktok src/components/__tests__/tiktok-template-system.test.tsx src/components/__tests__/tiktok-copy.test.tsx src/components/__tests__/tiktok-prune.test.ts`

Expected: PASS.

- [ ] **Step 2: Run lint and the complete suite**

Run: `npm run lint`

Expected: exit 0.

Run: `npm test -- --reporter=dot`

Expected: all tests pass.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: exit 0 and both `/work/tiktok` and `/work/tiktok/preview` appear in build output.

- [ ] **Step 4: Browser-check the preview**

At 390×844 and 1440×900, inspect light and dark themes, keyboard selection, focus visibility, reduced motion, heading order, contrast, and page-level overflow. Confirm the published route still renders its previous composition.
