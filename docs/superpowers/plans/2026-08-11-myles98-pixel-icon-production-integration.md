# Myles 98 Pixel Icon Production Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to execute this plan task by task. Use `superpowers:test-driven-development` for every production change and `superpowers:verification-before-completion` before any completion claim.

**Goal:** Replace the legacy hand-coded production glyph renderers with the exact approved 48-master Myles 98 pixel-icon family, while preserving the public component API, accessibility behavior, stable program IDs, forced-colors recovery, and shell performance.

**Architecture:** A deterministic build script converts the approved 16/24/32 SVG masters into a committed TypeScript tuple table. `Myles97Icon` selects one independently authored master by concept and native tier, then renders its ordered primitives directly inside one outer SVG. Color mode reproduces the master fills exactly. Mono mode preserves the approved outer geometry using `currentColor`; all live Myles 98 surfaces migrate to the richer color mode. No runtime filesystem access, JSDOM, nested SVG, transform, wrapper extrusion, or generic depth system enters the client bundle.

**Tech Stack:** Next.js 16, React 19, TypeScript, Node.js generator scripts, Vitest, Testing Library, Playwright, CSS forced-colors media queries, npm.

## Global constraints

- Do not begin Task 1 until Myles approves the exact sheet identified by:
  - 48-master aggregate SHA-256 `13e3dec8b8d53e8bed5ee6fe34d5cf04f72e3113b1ebb5352d9d41f0067689e6`.
  - contact-sheet SHA-256 `177db7abce08f9229ba87b4e9e2819bc15c9ad64baa6facdee8fdba028e92d7a`.
- Use npm only. Do not run pnpm, yarn, dependency installation, or package-manager repair.
- Preserve stable `ProgramId` values, including `trini-roti`, `tiktok`, and `understandingfafsa`.
- Preserve unrelated working-tree changes and Playwright logs.
- The generated module is committed source. Next builds must never rewrite it.
- Every generated primitive must stay integer-aligned and retain source order, tag, geometry, and fill.
- Live icons use color masters. `variant="mono"` remains a supported public API but is not the default for any Myles 98 production callsite.
- Forced colors may flatten color into a system-color silhouette, but must preserve the primary noun, bounds, and focus visibility.
- Commit each task atomically after its focused and related tests pass.

---

## Task 1: Add the deterministic master-to-React generator

**Files:**

- Create: `scripts/build-myles98-icon-react.mjs`
- Create: `scripts/__tests__/myles98-icon-react-output.test.ts`
- Create: `src/components/myles-97/icon-masters.generated.ts`
- Modify: `package.json`

### Steps

- [ ] Add a RED test that imports the generator and requires all 16 concepts × 3 grids.
- [ ] Require exact parity for every ordered `path`, `rect`, and `polygon` tag and attribute from the source SVG.
- [ ] Require the generated module to contain no SVG strings, nested SVG, transform, wrapper, runtime docs path, `node:fs`, JSDOM, or `dangerouslySetInnerHTML`.
- [ ] Require deterministic output by generating twice in temporary directories and comparing exact bytes.
- [ ] Require `--check` to fail when the committed output differs and to make no writes.
- [ ] Run the focused test and observe the expected missing-generator/output failures.
- [ ] Implement a Node-only generator that reuses `ICON_CONCEPTS`, `ICON_GRIDS`, `expectedMasterPath`, and `validateMasterSource` from `scripts/lib/myles98-icon-contract.mjs`.
- [ ] Emit readonly tuple data with this public shape:

```ts
export type Myles98MasterPrimitive =
  | readonly ["path", Readonly<{ d: string; fill: string }>]
  | readonly ["rect", Readonly<{ x: number; y: number; width: number; height: number; fill: string }>]
  | readonly ["polygon", Readonly<{ points: string; fill: string }>];

export const MYLES98_ICON_MASTERS: Readonly<
  Record<Myles98Concept, Readonly<Record<16 | 24 | 32, readonly Myles98MasterPrimitive[]>>>
>;
```

- [ ] Add `icons:react` and `icons:react:check` npm scripts.
- [ ] Generate the committed module, run the focused test GREEN, then run `npm run icons:verify`, `npm run icons:react:check`, scoped ESLint, TypeScript, and `git diff --check`.
- [ ] Commit as `feat: generate Myles 98 icon masters for React`.

---

## Task 2: Refactor `Myles97Icon` onto exact master geometry

**Files:**

- Modify: `src/components/myles-97/icons.tsx`
- Modify: `src/components/__tests__/myles-98-icons.test.ts`

### Steps

- [ ] Rewrite the component tests RED before changing production code.
- [ ] Expand `Myles97IconName` additively with `start`, `open-apps`, and `reset-desktop`; preserve all 13 existing names.
- [ ] Lock the name-to-concept mapping:
  - `folder → selected-work`
  - `profile → about-myles`
  - `resume → resume`
  - `mail → email`
  - `document → reminders`
  - `recipe → trini-roti`
  - `loose-parts → loose-parts`
  - `display → display-properties`
  - `app → generic-app`
  - project names → their four project concepts.
- [ ] Keep the existing tier boundary exactly: compact or size ≤18 selects 16; size ≤24 selects 24; larger selects 32; explicit tier remains supported; compact still wins.
- [ ] Require `shapeRendering="crispEdges"` for every tier.
- [ ] Require exactly one outer SVG with ordered direct primitive children, no depth groups, transforms, filters, masks, nested SVG, or generic shadow wrapper.
- [ ] Require color mode attributes to equal the selected generated master exactly.
- [ ] Define mono mode explicitly: the same approved primitive geometry and order render with `fill="currentColor"`; no legacy geometry remains.
- [ ] Preserve defaults, class merging, width/height behavior, `focusable={false}`, prop forwarding order, and all existing `data-m98-icon*` attributes.
- [ ] Add `data-m98-concept` and retain the legacy `data-m98-icon` value.
- [ ] Preserve accessibility: no title means `aria-hidden`; a title means `role="img"` plus `aria-label`.
- [ ] Add an explicit `welcome → app` branch to `iconForProgram` instead of relying only on default fallback.
- [ ] Delete the old palette helpers, tier stroke widths, side-tone/depth system, three hand-coded glyph renderers, and four-layer wrapper only after all rewritten tests pass.
- [ ] Run focused icon tests, related program mapping tests, scoped ESLint, TypeScript, generated-output check, and `git diff --check`.
- [ ] Commit as `refactor: render Myles 98 icons from approved masters`.

---

## Task 3: Split overloaded actions and migrate every live surface to color

**Files:**

- Modify: `src/components/myles-97/taskbar.tsx`
- Modify: `src/components/myles-97/start-menu.tsx`
- Modify: `src/components/myles-97/pocket-97-shell.tsx`
- Modify: `src/components/myles-97/program-window.tsx`
- Modify: `src/components/myles-97/reader-header.tsx`
- Modify: `src/components/myles-97/system-document-shell.tsx`
- Modify: `src/components/myles-97/selected-work-explorer.tsx`
- Modify: `src/components/myles-97/project-program.tsx`
- Modify: `src/components/project-enter-transition.tsx`
- Modify: `src/app/not-found.tsx`
- Modify: `src/app/styles/myles-97.css`
- Modify: corresponding component tests listed below.

### Steps

- [ ] Add RED assertions for every live callsite's concept, native grid, rendered size, and `variant="color"`.
- [ ] Replace the taskbar Start `/logomark.svg` image with `name="start"`, size 24, color; remove the now-unused `next/image` import and image-only CSS selector.
- [ ] Keep the 72px Pocket intro portrait mark unchanged because it is hero identity, not a Start action.
- [ ] Change Start-menu Reset from `display` to `reset-desktop`; keep Display Properties on `display`.
- [ ] Change Pocket dock Start to `start` and Open Apps to `open-apps`.
- [ ] Make titlebar, taskbar-program, Reader, document-shell, transition, 404, and fallback callsites explicitly color so production no longer returns to plain white glyphs.
- [ ] Preserve current labels, program IDs, click behavior, focus behavior, hit targets, and layout dimensions.
- [ ] Update:
  - `src/components/__tests__/myles-98-taskbar.test.tsx`
  - `src/components/__tests__/myles-97-program-window.test.tsx`
  - `src/components/__tests__/reader-chrome-precision.test.tsx`
  - `src/components/__tests__/system-document-shell.test.tsx`
  - `src/components/__tests__/myles-97-shell.test.tsx`
  - `src/components/__tests__/pocket-97-shell.test.tsx`
  - `src/components/__tests__/myles-97-project-program.test.tsx`
  - `src/components/__tests__/project-enter-transition.test.tsx`
  - `src/app/__tests__/public-route-metadata.test.ts`.
- [ ] Run the focused callsite suite, broader shell suite, ESLint, TypeScript, and `git diff --check`.
- [ ] Commit as `feat: use precise color icons across Myles 98`.

---

## Task 4: Replace legacy forced-color depth rules with master recovery

**Files:**

- Modify: `src/app/styles/myles-98-polish.css`
- Modify: `src/components/__tests__/myles-98-icons.test.ts`
- Create or extend: a rendered Playwright icon recovery test under `scripts/__tests__/`.

### Steps

- [ ] Add RED source and browser assertions for normal color, mono, and `forcedColors: "active"`.
- [ ] Remove obsolete selectors for `data-m98-icon-depth`, generic highlight/shadow planes, and legacy accent/surface/line groups.
- [ ] In forced colors, set the outer icon to `forced-color-adjust: none` and render all direct primitives with `CanvasText`; preserve the approved transparent outer footprint.
- [ ] Prove each of the 16 concepts remains visible at its smallest live size and that no primitive is clipped.
- [ ] Prove Start focus, Start-open selection, titlebar controls, Reader Return, and taskbar programs retain visible system-color focus indicators.
- [ ] Prove normal mode still returns exact master colors and that no forced-color rule leaks into Reader/project evidence surfaces.
- [ ] Run the focused source/browser tests, related accessibility tests, ESLint, TypeScript, and `git diff --check`.
- [ ] Commit as `fix: recover Myles 98 icons in forced colors`.

---

## Task 5: Run the rendered production matrix and optical correction pass

**Files:**

- Create or extend an ignored/temp evidence script and manifest only if existing capture tooling cannot express the assertions.
- Modify production CSS or an individual master only when measured evidence identifies a defect; any master edit invalidates the approved digests and returns to the full master-review gate.

### Steps

- [ ] Build the exact commit and serve it locally.
- [ ] Capture Workstation at 1440×900 fine pointer:
  - desktop shortcuts at 32;
  - taskbar Start at 24;
  - task programs and titlebars at 16;
  - Start menu at 20, including distinct Display and Reset;
  - document header at 18 and toolbar folder at 14.
- [ ] Capture Pocket at 1024×768 and 390×844:
  - Start, Work, Loose Parts, and Open Apps at 20/24 master selection;
  - Start sheet, Open Apps sheet, active program header;
  - no clipping, overlap, unintended server-snapshot exposure, or sub-44px interactive targets.
- [ ] Capture all four Reader openings at 1440×900, 1024×768, and 390×844; verify each 18px project header uses its distinct 16 master.
- [ ] Repeat the shell and Reader matrix in forced colors and reduced motion.
- [ ] Assert HTTP 200, no horizontal overflow, no broken images, no console/page errors, nonzero icon bounds, correct `data-m98-concept`, and visible focus.
- [ ] Perform an informed native-size collision check for:
  - Navi vs Fresh Greens;
  - TikTok shopping bag vs document families;
  - Display vs Reset;
  - Reminders vs Notes vs Resume;
  - Start vs About.
- [ ] Run an Apple-design usability pass without changing the authored Myles 98 visual language: confirm immediate press feedback, clear source-to-surface transitions, predictable enter/exit paths, legible type hierarchy at each native icon size, and reduced-motion/reduced-transparency equivalents. Treat retro depth as system chrome, not as a reason to reduce wayfinding, contrast, or interaction clarity.
- [ ] Save the evidence root, manifest, screenshots, exact commit, viewport/theme signatures, and pass/fail totals.
- [ ] Commit only measured production corrections, each with its regression test; never commit screenshots from temp evidence.

---

## Task 6: Close the release gates and update closeout evidence

**Files:**

- Modify: the current closeout/verification document.
- Modify: performance budgets only if the generated client code exceeds the current measured route limit and the total route remains within the established next 8 KiB bucket.

### Steps

- [ ] Run `npm run icons:verify`, `npm run icons:react:check`, and the icon contact-sheet unit/browser suites.
- [ ] Run the full authorized `npm test`, lint, TypeScript, content validation, and production build.
- [ ] Run the existing Reader performance verifier and record route CSS/JS/total bytes before and after.
- [ ] If a budget changes, document the exact byte delta and retain existing total ceilings whenever possible.
- [ ] Run the requested thorough Impeccable critique and technical audit against the built commit; do not reuse the one-shot detector result from an older pixel set.
- [ ] After the case-study voice edits are complete, run the `ai-slop` full-site prose audit: first read every user-facing page and record the human assessment, then run its deterministic scans. Apply the Myles voice guide and preserve all evidence-bound claims, quoted material, names, dates, numbers, and ownership guardrails. Re-audit the edited result before release.
- [ ] Require P0/P1/P2 = 0 or explicit user-approved deferment; treat P3 as optional.
- [ ] Repeat 90-second hiring-manager and 10-minute design-lead reviews from the same build/evidence root.
- [ ] Record final branch SHA, ahead/behind state, dirty-tree inventory, refs/worktrees/stashes, exact evidence root, limitations, and branch-cleanup recommendation.
- [ ] Commit as `docs: close out Myles 98 icon integration`.
