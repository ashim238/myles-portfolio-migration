# Portfolio Audit Remediation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the confirmed responsive, accessibility, performance, and design-system defects while preserving the portfolio's existing personality and case-study-specific storytelling.

**Architecture:** Fix shared-shell behavior at the root, keep case-study fixes scoped to their visual systems, and isolate Navi minisite code and CSS from the portfolio shell. Every behavior change begins with a regression test. Tasks with disjoint ownership may be delegated concurrently; tasks that share `base.css`, `portfolio-surfaces.css`, or Navi primitives execute serially.

**Tech Stack:** Next.js App Router, React 19, TypeScript, CSS, Vitest, Testing Library, Playwright browser verification.

## Global Constraints

- Preserve current case-study prose, truth claims, roles, timelines, visual artifacts, and project-specific accents.
- Preserve the homepage Batman decoder payoff and the recognizable TikTok logo motion.
- Meaningful content must be visible by default and may only opt into hiding after enhancement initialization succeeds.
- WCAG 2.2 AA is required for contrast, focus, semantics, tap targets, text zoom, and 320px reflow.
- Reduced motion must disable spatial and infinite decorative motion while preserving final content states.
- Mobile ends at 767px and desktop begins at 768px except Navi, whose compact navigation owns widths through 720px and full navigation begins at 721px.
- Use existing tokens and shared components before adding one-offs. Define missing documented tokens at the root.
- Do not add new large motion systems, decorative layers, or third-party dependencies.
- Root agent owns commits. Implementer agents edit and test their assigned files but do not commit in the shared worktree.

---

### Task 1: Shared shell, reflow, navigation, and failure-safe motion

**Files:**
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/components/mobile-nav.tsx`
- Modify: `src/components/site-nav-list.tsx`
- Modify: `src/components/scroll-reveal-fallback.tsx`
- Modify: `src/components/draw-on-view.tsx`
- Modify: `src/components/project-toc.tsx`
- Modify: `src/components/hero-statement-decoder.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/play/page.tsx`
- Modify: `src/app/resume/page.tsx`
- Create: `src/components/portfolio-endcap.tsx`
- Create: `src/lib/navigation-state.ts`
- Test: `src/app/__tests__/portfolio-hardening-contract.test.ts`
- Test: `src/components/__tests__/mobile-nav.test.tsx`
- Test: `src/components/__tests__/project-toc.test.tsx`
- Test: `src/components/__tests__/hero-statement-decoder.test.tsx`
- Test: `src/components/__tests__/portfolio-endcap.test.tsx`
- Test: `src/components/__tests__/scroll-reveal-fallback.test.tsx`
- Test: `src/components/__tests__/draw-on-view.test.tsx`
- Test: `src/components/__tests__/project-work-jump-layout.test.ts`
- Test: `src/app/__tests__/home-statement-layout.test.ts`
- Test: `src/app/play/__tests__/play-page-semantics.test.tsx`

**Interfaces:**
- Produces: `PortfolioEndcap({ context: "play" | "resume" })` for compact desktop continuation.
- Produces: a shared `isWorkPath(pathname: string)` matcher or equivalent identical route logic for desktop and mobile navigation.
- Produces: `data-reveal-ready` on the document root only after observer setup succeeds.

- [ ] **Step 1: Write failing shell regression tests**

Add focused assertions that require the documented radius tokens, exclusive 767/768 ownership, flexible mobile-navigation items, zoom-safe endcard media, safe-area-aware content clearance, mobile footer deduplication, stable decoder geometry, `/work/*` current state, invalid per-entry footer removal on Play, and visible-first reveal gating. The style contract must assert declarations equivalent to:

```css
:root {
  --rounded-sm: 0.35rem;
  --rounded-md: 0.7rem;
  --rounded-lg: 1rem;
}

@media (max-width: 767px) {
  .mobile-nav-item { flex: 1 1 0; min-width: 0; }
  .page-shell { padding-bottom: calc(3.6rem + env(safe-area-inset-bottom) + 2rem); }
  .project-work-jump-media { min-height: 0; }
  .footer-nav a:not([href^="mailto:"]) { display: none; }
}
```

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- src/app/__tests__/portfolio-hardening-contract.test.ts src/components/__tests__/mobile-nav.test.tsx src/components/__tests__/project-toc.test.tsx src/components/__tests__/hero-statement-decoder.test.tsx src/components/__tests__/portfolio-endcap.test.tsx src/components/__tests__/scroll-reveal-fallback.test.tsx src/components/__tests__/draw-on-view.test.tsx src/components/__tests__/project-work-jump-layout.test.ts src/app/__tests__/home-statement-layout.test.ts src/app/play/__tests__/play-page-semantics.test.tsx
```

Expected: failures for missing tokens, current-route ownership, progressive enhancement, stable decoder geometry, mobile footer treatment, and missing endcap.

- [ ] **Step 3: Implement shared shell fixes**

Use one work matcher in both navigation systems:

```ts
export function isWorkPath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/work/");
}
```

Keep reveal targets visible until setup succeeds:

```ts
if (!("IntersectionObserver" in window)) return;
const observer = new IntersectionObserver(/* existing reveal callback */);
document.documentElement.dataset.revealReady = "true";
```

Scope hidden reveal CSS under `html[data-reveal-ready="true"]`. `DrawOnView` must not park strokes under reduced motion or when an observer cannot be constructed. Add a no-JavaScript-visible mobile TOC baseline, then enable collapsed behavior through an enhancement-ready attribute. Reserve the decoder's maximum wrapped geometry across every statement so changing frames do not move the hero. Keep each scramble/decode transition in the 500–700ms range, with the professional statement first and Batman final. Replace repeated Play entry `<footer>` elements with neutral containers. Add the compact endcap to Play and Resume. Hide duplicated footer navigation at mobile widths while retaining Email and copyright.

- [ ] **Step 4: Verify GREEN and refactor**

Run the focused command from Step 2. Expected: all listed tests pass with no warnings.

- [ ] **Step 5: Record task completion**

Root agent reviews the diff, commits the task, and appends the commit range to `.superpowers/sdd/progress.md`.

---

### Task 2: Portfolio-surface accessibility and design-system alignment

**Files:**
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/app/about/page.tsx`
- Modify: `src/components/fresh-greens.tsx`
- Modify: `src/components/fresh-greens/research-synthesis.tsx`
- Modify: `src/components/fresh-greens/pulled-over-journey.tsx`
- Modify: `src/components/fresh-greens/onboarding-illustration-sequence.tsx`
- Modify: `src/components/color-palette.tsx`
- Modify: `src/components/project-section-card.tsx`
- Modify: `src/components/navi.tsx`
- Test: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`
- Test: `src/app/__tests__/visible-first-motion.test.ts`
- Test: `src/components/fresh-greens/__tests__/research-synthesis.test.tsx`
- Test: `src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx`
- Test: `src/components/__tests__/navi-artifact-layout.test.tsx`
- Create: `src/components/__tests__/color-palette.test.tsx`
- Create: `src/components/__tests__/project-section-card.test.tsx`

**Interfaces:**
- Produces: stable tab and panel IDs for every Fresh Greens evidence state.
- Produces: clipboard state `idle | copied | error`, announced through `role="status"`.

- [ ] **Step 1: Write failing accessibility and surface tests**

Require all Fresh Greens panels to exist in server output, inactive panels to retain valid `aria-controls` targets, horizontal artifact/image/illustration regions to have `role="region"`, `tabIndex={0}`, and an accessible label, palette copy feedback to announce success/error, About details to use a normal labelled section, and Navi heuristic items to use a semantic list. Add style assertions for AA contrast, centered borderless `fg-pullquote`, reduced-motion resets, and 44px hit areas under `(pointer: coarse)`/`(any-pointer: coarse)`.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- src/app/work/__tests__/artifact-accessibility-styles.test.ts src/app/__tests__/visible-first-motion.test.ts src/components/fresh-greens/__tests__/research-synthesis.test.tsx src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx src/components/__tests__/navi-artifact-layout.test.tsx src/components/__tests__/color-palette.test.tsx src/components/__tests__/project-section-card.test.tsx
```

Expected: failures for missing panels/regions/status handling, invalid list semantics, contrast, and motion coverage.

- [ ] **Step 3: Implement semantic and visual corrections**

Render every tab panel with a stable ID and use `hidden` only after the component is enhanced. Mirror the existing accessible ArchitectureDiagram scroll-region treatment for `.fg-arch-scroll`. Replace About's `aside` with a labelled section. Use `ul > li` for heuristic evidence. Implement clipboard handling equivalent to:

```ts
try {
  if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
  await navigator.clipboard.writeText(value);
  setCopyState("copied");
} catch {
  setCopyState("error");
}
```

Increase TOC/palette/system label contrast without changing case-study accents. Remove the `fg-pullquote` side border and align it to the centered documented contract. Put exact transform/animation layers inside `prefers-reduced-motion: no-preference`, with explicit reduced resets.

- [ ] **Step 4: Verify GREEN and refactor**

Run the focused command from Step 2. Expected: all listed tests pass.

- [ ] **Step 5: Record task completion**

Root agent reviews, commits, and updates the progress ledger.

---

### Task 3: Navi responsive behavior, calendar, and semantics

**Files:**
- Modify: `src/app/styles/navi-minisite.css`
- Modify: `src/components/navi/chrome/NaviHeader.tsx`
- Modify: `src/components/navi/ui/Calendar.tsx`
- Modify: `src/components/navi/ui/Rating.tsx`
- Modify: `src/components/navi/ui/Avatar.tsx`
- Modify: `src/components/navi/demo/Reviews.tsx`
- Modify: `src/components/navi/demo/Map.client.tsx`
- Modify: `src/components/navi/demo/Map.tsx`
- Modify: `src/components/navi/demo/ExperienceCard.tsx`
- Modify: `src/components/navi/demo/ResultCard.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/page.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/search/page.tsx`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Test: existing tests under `src/components/navi/**/__tests__`
- Create: `src/app/work/navi/(minisite)/__tests__/responsive-contract.test.ts`

**Interfaces:**
- `Calendar` implements a labelled grid with one roving `tabIndex={0}` date and arrow/Home/End/Page navigation.
- Card components accept `headingLevel?: 2 | 3` and default to `3` for nested use.
- `Avatar` accepts `decorative?: boolean`.

- [ ] **Step 1: Write failing Navi regression tests**

Require exclusive 720/721 navigation ownership, no global `body` padding, a seven-column calendar that uses `minmax(0, 1fr)` and fits 320px, route-aware `aria-current`, valid rating text, non-hidden interactive maps, correct `h2` result/feed cards, a primary search section rather than `aside`, decorative adjacent avatars, collision-free system specimen classes, and calendar arrow/Home/End/Page behavior.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- src/app/work/navi/\(minisite\)/__tests__/responsive-contract.test.ts src/components/navi/chrome/__tests__/NaviHeader.test.tsx src/components/navi/ui/__tests__/Rating.test.tsx src/components/navi/ui/__tests__/Avatar.test.tsx src/lib/navi/__tests__/calendar.test.ts src/components/navi/demo/__tests__/DateTimeModal.test.tsx src/components/navi/demo/__tests__/Map.test.tsx src/components/navi/demo/__tests__/feed-page.test.tsx src/components/navi/demo/__tests__/search-page.test.tsx
```

Expected: failures for the breakpoint collision, global body leak, calendar geometry/keyboard model, map hidden focus, heading levels, current state, and rating/avatar semantics.

- [ ] **Step 3: Implement Navi corrections**

Use compact header rules through 720px and full header rules from 721px. Move bottom padding from `body` to `.nv-ui`. Make calendar rows `grid-template-columns: repeat(7, minmax(0, 1fr))`; keep date controls at least 44px when space permits and use the full cell width at 320px. Expose the map as an interactive labelled region and give markers useful accessible names. Render rating text through visually hidden content rather than an `aria-label` on a generic span. Add longest-prefix current-state matching to NaviHeader. Use the contextual heading-level prop in top-level feeds/search.

- [ ] **Step 4: Correct case-study artifact geometry and contrast**

In the Navi case-study surface block, center the booking-flow line with the marker centers using `translateX(-50%)` in both resting and animated transforms. Namespace or narrow `.nv-*` selectors that collide with the light-only system page, and set system label colors that meet 4.5:1.

- [ ] **Step 5: Verify GREEN and refactor**

Run the focused command from Step 2. Expected: all listed tests pass.

- [ ] **Step 6: Record task completion**

Root agent reviews, commits, and updates the progress ledger.

---

### Task 4: Navi critical rendering and data delivery

**Files:**
- Create: `src/lib/navi/slug.ts`
- Create: `src/lib/navi/experience-summary.ts`
- Create: `src/app/work/navi/(minisite)/demo/FeedView.tsx`
- Create: `src/app/work/navi/(minisite)/demo/search/SearchView.tsx`
- Modify: `src/lib/navi/neighborhoods.ts`
- Modify: `src/lib/navi/hosts.ts`
- Modify: `src/components/navi/demo/DemoPhoto.tsx`
- Modify: `src/components/navi/demo/GalleryCarousel.tsx`
- Modify: `src/components/navi/demo/ExperienceCard.tsx`
- Modify: `src/components/navi/demo/ResultCard.tsx`
- Modify: `src/components/navi/demo/Map.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/page.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/search/page.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/experience/[slug]/ExperienceView.tsx`
- Test: `src/components/navi/demo/__tests__/DemoPhoto.test.tsx`
- Test: `src/components/navi/demo/__tests__/GalleryCarousel.test.tsx`
- Test: `src/components/navi/demo/__tests__/feed-page.test.tsx`
- Test: `src/components/navi/demo/__tests__/search-page.test.tsx`
- Test: `src/components/navi/demo/__tests__/experience-page.test.tsx`
- Test: `src/lib/navi/__tests__/hosts.test.ts`
- Test: `src/lib/navi/__tests__/neighborhoods.test.ts`

**Interfaces:**
- `DemoPhoto` accepts `preload?: boolean` and required usage-specific `sizes` from callers.
- Feed/search show 12 records initially and increase by 12 through a labelled Load more button.
- Server route files load full experience records and pass compact `ExperienceSummary[]` data to client views; client modules do not runtime-import `demo-data.ts`.
- Detail maps accept `deferUntilVisible?: boolean` and reserve their final dimensions.

- [ ] **Step 1: Write failing delivery-policy tests**

Require the active gallery hero to preload, cards/results/thumbnails to pass exact slot-size expressions, the slug helper to import no experience data, client feed/search views to runtime-import no full detail dataset, feed/search to render 12 initial items with Load more, detail map deferral, and scroll work to use one queued animation frame while skipping unchanged state.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- src/components/navi/demo/__tests__/DemoPhoto.test.tsx src/components/navi/demo/__tests__/GalleryCarousel.test.tsx src/components/navi/demo/__tests__/feed-page.test.tsx src/components/navi/demo/__tests__/search-page.test.tsx src/components/navi/demo/__tests__/experience-page.test.tsx src/lib/navi/__tests__/hosts.test.ts src/lib/navi/__tests__/neighborhoods.test.ts
```

Expected: failures for missing preload/size policies, unbounded initial results, data-coupled slugification, immediate detail map, and unthrottled scroll work.

- [ ] **Step 3: Implement image and list delivery**

Move slugification into the data-free module. Convert the feed and search route files to server components that project full records into compact summaries and render focused client views. Use these size policies:

```ts
const CARD_SIZES = "(max-width: 720px) calc(100vw - 32px), 340px";
const RESULT_SIZES = "(max-width: 720px) calc(100vw - 32px), 160px";
const THUMB_SIZES = "(max-width: 720px) 22vw, 220px";
const HERO_SIZES = "(max-width: 720px) 100vw, min(70vw, 960px)";
```

Preload only the active hero. Add a 12-item initial limit and Load more increments of 12. Keep filtered result counts accurate against the full result set.

- [ ] **Step 4: Implement detail deferral and scroll throttling**

Gate only the experience-detail map with an IntersectionObserver root margin near `300px`; keep search/neighborhood maps immediate. Replace direct scroll calculations with one queued `requestAnimationFrame` and call state setters only when the derived state changes.

- [ ] **Step 5: Verify GREEN and refactor**

Run the focused command from Step 2. Expected: all listed tests pass.

- [ ] **Step 6: Record task completion**

Root agent reviews, commits, and updates the progress ledger.

---

### Task 5: Case-study media, CSS, font, and dependency delivery

**Files:**
- Modify: `src/components/tiktok-dsa.tsx`
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/components/specimen-card.tsx`
- Modify: `src/components/lead-video.tsx`
- Modify: `src/lib/understandingfafsa-assets.ts`
- Modify: `src/components/understandingfafsa.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`
- Create: `src/app/about/layout.tsx`
- Create: `src/app/play/layout.tsx`
- Create: `src/app/work/layout.tsx`
- Create: `src/app/work/fresh-greens/layout.tsx`
- Modify: `src/app/work/navi/(minisite)/layout.tsx`
- Modify: `package.json`
- Modify: lockfile selected by the repository
- Create: optimized media under existing project asset directories when source-preserving conversion is possible
- Test: `src/components/__tests__/tiktok-cover-blobs.test.tsx`
- Test: `src/components/__tests__/specimen-card.test.tsx`
- Test: `src/components/__tests__/lead-video.test.tsx`
- Test: `src/app/__tests__/global-style-boundaries.test.ts`
- Test: `src/app/__tests__/public-route-metadata.test.ts`
- Test: `src/app/work/__tests__/lead-media-dimensions.test.ts`
- Test: `src/components/__tests__/understandingfafsa-composer.test.tsx`

**Interfaces:**
- TikTok's initial response contains one optimized static poster; animated layers mount after hydration/visibility and pause outside the viewport.
- `SpecimenCard` passes a responsive `sizes` value to every Next Image.
- Fresh Greens owns `--font-instrument-serif` through its route layout; root layout does not preload it.

- [ ] **Step 1: Write failing media-delivery tests**

Require zero below-fold TikTok eager hints, no initial blob-layer image requests, one lightweight initial TikTok field/poster, visibility-controlled layer activity including background-tab pause, responsive Play `sizes`, a compressed Fresh Greens poster reference, bounded/tiled FAFSA captures with explicit original links, route-local Navi/portfolio CSS imports, and route-local Instrument Serif normal with no italic face.

- [ ] **Step 2: Run focused tests and verify RED**

Run:

```bash
npm test -- src/components/__tests__/tiktok-cover-blobs.test.tsx src/components/__tests__/specimen-card.test.tsx src/components/__tests__/lead-video.test.tsx src/components/__tests__/understandingfafsa-composer.test.tsx src/app/__tests__/global-style-boundaries.test.ts src/app/__tests__/public-route-metadata.test.ts src/app/work/__tests__/lead-media-dimensions.test.ts
```

Expected: failures for preload storm, missing visibility pause, absent Play sizes, global CSS/font ownership, and unoptimized poster policy.

- [ ] **Step 3: Implement TikTok and Play delivery**

Server-render the existing lightweight CSS TikTok field or one optimized poster, then mount blob layers only after hydration and near-visibility. Always observe the cover and `document.visibilityState` so `isActive` becomes false offscreen or in a background tab. Remove below-fold `priority`/eager hints. Give nonessential layers lazy loading and low fetch priority. Add a slot-specific `sizes` prop to SpecimenCard images.

- [ ] **Step 4: Optimize Fresh Greens and Understanding FAFSA media**

Generate source-preserving WebP/AVIF display assets for the Fresh Greens poster. For FAFSA's extreme-height captures, generate display-width vertical tiles or selected crops and update the asset map/components to lazy-load each tile independently. Retain original source captures in the repository.

- [ ] **Step 5: Localize CSS and font ownership**

Keep only Tailwind, base, and late-polish styles in root globals. Import `portfolio-surfaces.css` from About, Play, and Work route layouts. Import `navi-minisite.css` only from the Navi minisite layout. Define Instrument Serif normal in the Fresh Greens layout, remove root serif loading, and remove the unused italic face.

- [ ] **Step 6: Remove verified unused dependencies**

Use `rg` to prove each dependency has no runtime, config, or script imports before removal. Remove verified unused packages through the repository package manager. Remove only proven boilerplate assets (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) after reference checks, and leave original unreferenced design-source media in place unless it is a byte-identical duplicate.

- [ ] **Step 7: Verify GREEN and refactor**

Run the focused command from Step 2. Expected: all listed tests pass.

- [ ] **Step 8: Record task completion**

Root agent reviews, commits, and updates the progress ledger.

---

### Task 6: Integrated regression, browser matrix, and final polish

**Files:**
- Modify only files required by verified integration defects.
- Update: `DESIGN.md` for intentional opening-quote, pinned-card elevation, and Navi light-only exceptions.
- Test: existing full suite plus browser audit scripts kept outside the tracked repository.

**Interfaces:**
- No new production interface. This is the final integration and documentation gate.

- [ ] **Step 1: Run static and unit verification**

Run:

```bash
npm test
npm run lint
npm run validate:content
npm run build
```

Expected: every command exits 0 with no test failures, lint errors, content errors, or build errors.

- [ ] **Step 2: Run rendered responsive verification**

Build and serve the production app. Test Chromium, Firefox, and WebKit at 320, 390, 641, 720, 721, 767, 768, and 1440 where relevant. Verify no document overflow, broken images, hidden content, dual navigation, calendar clipping, or next-project overflow.

- [ ] **Step 3: Run accessibility and failure-mode verification**

Re-run settled accessibility scans, 200% text zoom, reduced motion, JavaScript-disabled pages, keyboard traversal, the Fresh Greens lightbox, Navi overlays, the booking calendar, and clipboard success/failure states.

- [ ] **Step 4: Re-run performance traces**

Trace the eight principal routes under the same throttled mobile profile. Confirm TikTok no longer emits an 18-image preload storm, Play does not select a 3840px phone candidate, Navi experience preloads its active hero, offscreen motion pauses, and deferred content reserves layout.

- [ ] **Step 5: Crawl every generated Navi route**

Re-run all 104 Navi routes at 320px and 1440px. Exclude only explicitly identified external tile failures. Every local route must resolve without overflow, broken local media, or page exceptions.

- [ ] **Step 6: Update intentional design-system exceptions**

Document the Fresh Greens serif opening quote as a distinct variant, the homepage pinned-artifact elevation as one sanctioned exception, and the Navi minisite as an intentionally light-only embedded product demo.

- [ ] **Step 7: Final review and commit**

Generate a whole-branch review package, dispatch an independent final reviewer, resolve every Critical or Important finding, re-run affected tests, then commit the integrated polish and update `.superpowers/sdd/progress.md`.
