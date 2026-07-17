# Portfolio 37 Batch One Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Correct shared cover geometry, reframe the Fresh Greens lead image, keep structural content visible during motion, and repair project navigation conflicts.

**Architecture:** Keep `LeadMedia` as the shared cover boundary, but make source geometry explicit and expose one constrained Fresh Greens presentation value. Keep the existing CSS system and motion language, changing only shared structural entrances and shared TOC behavior. Add source-contract tests that parse CSS blocks by brace depth so responsive assertions cannot escape their intended scope.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library

## Global Constraints

- Preserve existing interactive personality, project palettes, and story-bearing motion.
- Require exact width and height for every `LeadMedia` placement.
- Fresh Greens uses a `16 / 9` desktop frame with `1.03` image scale and a `2560 / 1862` mobile frame with `1.24` image scale.
- Structural entrance keyframes start visible and unblurred.
- Project-specific artifact animation is unchanged.
- The horizontal TOC remains through `1439px`; the vertical spine begins at `1440px` and shows its active title without hover.
- The mobile back-to-top control clears the `3.6rem` navigation and safe area.
- Existing keyboard behavior and reduced-motion support remain intact.
- Verification commands run sequentially.
- Do not edit or delete the pre-existing untracked screenshots, `.playwright-mcp/`, or `tmp/` files.

---

### Task 1: Make lead-media geometry explicit

**Files:**
- Modify: `src/components/__tests__/lead-media.test.tsx`
- Modify: `src/components/__tests__/lead-video.test.tsx`
- Create: `src/app/work/__tests__/lead-media-dimensions.test.ts`
- Modify: `src/components/lead-media.tsx`
- Modify: `src/components/lead-video.tsx`
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/app/work/navi/page.tsx`
- Modify: `src/app/work/understandingfafsa/page.tsx`

**Interfaces:**
- Consumes: existing `LeadMedia`, `LeadVideo`, and three case-study route callers.
- Produces: `LeadMediaProps` with required `width: number`, `height: number`, and optional `presentation?: "default" | "fresh-greens"`. `LeadVideoProps` receives required `width: number` and `height: number`.

- [ ] **Step 1: Write failing component tests for geometry and presentation**

Replace the still-image test and extend the video test in `src/components/__tests__/lead-media.test.tsx`:

```tsx
it("renders the verified still-image geometry and presentation", () => {
  const { container } = render(
    <LeadMedia
      cover="/projects/fresh-greens/cover.png"
      alt="Fresh Greens cover"
      width={2560}
      height={1862}
      presentation="fresh-greens"
    />,
  );

  expect(screen.getByAltText("Fresh Greens cover")).toHaveAttribute("width", "2560");
  expect(screen.getByAltText("Fresh Greens cover")).toHaveAttribute("height", "1862");
  expect(container.querySelector("figure")).toHaveClass(
    "case-lead-media",
    "case-lead-media--fresh-greens",
  );
});

it("reserves the verified poster geometry before attaching the clip", () => {
  const { container } = render(
    <LeadMedia
      cover="/projects/navi/cover.png"
      alt="Navi demo"
      clip="/projects/navi/demo.mp4"
      width={2048}
      height={1365}
    />,
  );

  const video = container.querySelector("video");
  expect(video).toHaveAttribute("width", "2048");
  expect(video).toHaveAttribute("height", "1365");
  expect(video).toHaveAttribute("poster", "/projects/navi/cover.png");
  expect(video).toHaveAttribute("preload", "none");
  expect(container.querySelector("source")).toBeNull();
});
```

- [ ] **Step 2: Add failing route-source contracts**

Create `src/app/work/__tests__/lead-media-dimensions.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function routeSource(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("case-study lead-media geometry", () => {
  it("uses verified Fresh Greens dimensions and presentation", () => {
    const source = routeSource("src/app/work/fresh-greens/page.tsx");

    expect(source).toMatch(
      /<LeadMedia[\s\S]*?cover="\/projects\/fresh-greens\/cover\.png"[\s\S]*?width=\{2560\}[\s\S]*?height=\{1862\}[\s\S]*?presentation="fresh-greens"[\s\S]*?\/>/,
    );
    expect(source).toMatch(
      /<LeadVideo[\s\S]*?clip="\/projects\/fresh-greens\/process\/active-nav\.mp4"[\s\S]*?width=\{1290\}[\s\S]*?height=\{2796\}[\s\S]*?\/>/,
    );
  });

  it("uses verified Navi dimensions", () => {
    expect(routeSource("src/app/work/navi/page.tsx")).toMatch(
      /<LeadMedia[\s\S]*?cover="\/projects\/navi\/cover\.png"[\s\S]*?width=\{2048\}[\s\S]*?height=\{1365\}[\s\S]*?\/>/,
    );
  });

  it("uses verified Understanding FAFSA dimensions", () => {
    expect(routeSource("src/app/work/understandingfafsa/page.tsx")).toMatch(
      /<LeadMedia[\s\S]*?cover="\/projects\/understandingfafsa\/cover\.png"[\s\S]*?width=\{4000\}[\s\S]*?height=\{3000\}[\s\S]*?\/>/,
    );
  });
});
```

- [ ] **Step 3: Run the focused tests and verify RED**

Run:

```bash
npx vitest run src/components/__tests__/lead-media.test.tsx src/components/__tests__/lead-video.test.tsx src/app/work/__tests__/lead-media-dimensions.test.ts
```

Expected: FAIL because `presentation` does not exist, the video lacks width and height attributes, and the route callers omit dimensions.

- [ ] **Step 4: Implement the shared geometry contract**

Update `src/components/lead-media.tsx`:

```tsx
import Image from "next/image";
import { LeadVideo } from "@/components/lead-video";

type LeadMediaProps = {
  cover: string;
  alt: string;
  clip?: string;
  width: number;
  height: number;
  presentation?: "default" | "fresh-greens";
};

export function LeadMedia({
  cover,
  alt,
  clip,
  width,
  height,
  presentation = "default",
}: LeadMediaProps) {
  const presentationClass =
    presentation === "default" ? "" : ` case-lead-media--${presentation}`;

  return (
    <figure className={`case-lead-media${presentationClass}`}>
      {clip ? (
        <LeadVideo
          clip={clip}
          poster={cover}
          alt={alt}
          width={width}
          height={height}
        />
      ) : (
        <Image
          className="case-lead-img"
          src={cover}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 760px) 100vw, min(90vw, 900px)"
          priority
        />
      )}
    </figure>
  );
}
```

Add required dimensions to `LeadVideoProps`, accept them in the function, and place them on the video element:

```tsx
type LeadVideoProps = {
  clip: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
  type?: string;
};

export function LeadVideo({
  clip,
  poster,
  alt,
  width,
  height,
  type = "video/mp4",
}: LeadVideoProps) {
```

```tsx
<video
  ref={ref}
  className="case-lead-video"
  poster={poster}
  width={width}
  height={height}
```

Update the three route-level `LeadMedia` calls with the exact values from the source contracts. Fresh Greens also passes `presentation="fresh-greens"`.

The in-page Fresh Greens `LeadVideo` uses the verified poster geometry, `width={1290}` and `height={2796}`. Add `width={1280}` and `height={720}` to each `LeadVideo` fixture in `src/components/__tests__/lead-video.test.tsx`. These fixture values exercise the required contract without changing behavior assertions.

- [ ] **Step 5: Run focused tests and verify GREEN**

Run the same focused Vitest command.

Expected: 3 test files pass.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/components/__tests__/lead-media.test.tsx src/components/__tests__/lead-video.test.tsx src/app/work/__tests__/lead-media-dimensions.test.ts src/components/lead-media.tsx src/components/lead-video.tsx src/app/work/fresh-greens/page.tsx src/app/work/navi/page.tsx src/app/work/understandingfafsa/page.tsx
git commit -m "fix: preserve lead media geometry"
```

### Task 2: Reframe the Fresh Greens case-study cover

**Files:**
- Create: `src/app/work/fresh-greens/__tests__/cover-layout.test.ts`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `case-lead-media--fresh-greens` from Task 1.
- Produces: scoped desktop and mobile Fresh Greens cover geometry with `--fg-cover-scale`.

- [ ] **Step 1: Write the failing scoped CSS test**

Create `src/app/work/fresh-greens/__tests__/cover-layout.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);

function cssBlocks(header: string, source = styles) {
  const blocks: string[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf(header, cursor);
    if (start === -1) break;
    const open = source.indexOf("{", start);
    let depth = 0;

    for (let index = open; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(open + 1, index));
        cursor = index + 1;
        break;
      }
    }
  }

  expect(blocks.length, `${header} CSS blocks`).toBeGreaterThan(0);
  return blocks;
}

function cssBlock(header: string, source = styles) {
  return cssBlocks(header, source)[0];
}

describe("Fresh Greens lead cover layout", () => {
  it("uses the approved desktop crop and backing", () => {
    const frame = cssBlock(".case-lead-media--fresh-greens");
    const image = cssBlock(".case-lead-media--fresh-greens .case-lead-img");

    expect(frame).toMatch(/--fg-cover-scale:\s*1\.03;/);
    expect(frame).toMatch(/aspect-ratio:\s*16\s*\/\s*9;/);
    expect(frame).toMatch(/margin-bottom:\s*1\.5rem;/);
    expect(frame).toMatch(/background:\s*#001301;/i);
    expect(image).toMatch(/height:\s*100%;/);
    expect(image).toMatch(/object-fit:\s*cover;/);
    expect(image).toMatch(/transform:\s*scale\(var\(--fg-cover-scale\)\);/);
  });

  it("restores the source ratio and approved scale on mobile", () => {
    const mobile = cssBlock("@media (max-width: 640px)");
    const frame = cssBlock(".case-lead-media--fresh-greens", mobile);

    expect(frame).toMatch(/--fg-cover-scale:\s*1\.24;/);
    expect(frame).toMatch(/aspect-ratio:\s*2560\s*\/\s*1862;/);
  });
});
```

- [ ] **Step 2: Run the cover test and verify RED**

Run:

```bash
npx vitest run src/app/work/fresh-greens/__tests__/cover-layout.test.ts
```

Expected: FAIL because the scoped cover rules do not exist.

- [ ] **Step 3: Implement the scoped cover treatment**

Replace the one-line shared lead-media rules in `src/app/styles/late-polish.css` with formatted shared rules, then add:

```css
.case-lead-media--fresh-greens {
  --fg-cover-scale: 1.03;
  aspect-ratio: 16 / 9;
  margin-bottom: 1.5rem;
  background: #001301;
}

.case-lead-media--fresh-greens .case-lead-img {
  height: 100%;
  object-fit: cover;
  object-position: 50% 50%;
  transform: scale(var(--fg-cover-scale));
  transform-origin: center;
}

@media (max-width: 640px) {
  .case-lead-media--fresh-greens {
    --fg-cover-scale: 1.24;
    aspect-ratio: 2560 / 1862;
  }
}
```

Do not apply this aspect ratio or transform to Navi, Understanding FAFSA, or video lead media.

- [ ] **Step 4: Run the cover and lead-media tests**

Run:

```bash
npx vitest run src/app/work/fresh-greens/__tests__/cover-layout.test.ts src/components/__tests__/lead-media.test.tsx src/app/work/__tests__/lead-media-dimensions.test.ts
```

Expected: 3 test files pass.

- [ ] **Step 5: Commit Task 2**

```bash
git add src/app/work/fresh-greens/__tests__/cover-layout.test.ts src/app/styles/late-polish.css
git commit -m "fix: reframe Fresh Greens lead cover"
```

### Task 3: Make shared structural motion visible-first

**Files:**
- Create: `src/app/__tests__/visible-first-motion.test.ts`
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/portfolio-surfaces.css`

**Interfaces:**
- Consumes: shared structural keyframes and selectors in the two global stylesheets.
- Produces: the same entrance timing and movement with visible, unblurred first frames.

- [ ] **Step 1: Write the failing motion-contract test**

Create `src/app/__tests__/visible-first-motion.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const surfaceStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

function cssBlock(header: string, source: string) {
  const start = source.indexOf(header);
  expect(start, `${header} CSS header`).toBeGreaterThanOrEqual(0);
  const open = source.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS block for ${header}`);
}

function expectVisibleFirst(name: string, source: string) {
  const keyframes = cssBlock(`@keyframes ${name}`, source);
  const firstFrame = keyframes.includes("from")
    ? cssBlock("from", keyframes)
    : cssBlock("0%", keyframes);
  expect(firstFrame).toMatch(/opacity:\s*1;/);
  expect(firstFrame).not.toMatch(/filter:\s*blur\([^)]*\);/);
}

describe("visible-first structural motion", () => {
  it("keeps shared base entrances visible", () => {
    expectVisibleFirst("fadeUp", baseStyles);
    expectVisibleFirst("sectionScrollIn", baseStyles);
  });

  it("keeps shared surface entrances visible and unblurred", () => {
    for (const name of [
      "nv-hero-in",
      "od-card-rise",
      "od-highlight-in",
      "od-footer-in",
    ]) {
      expectVisibleFirst(name, surfaceStyles);
    }
  });

  it("does not pre-hide structural lists before their entrance", () => {
    for (const selector of [
      ".work:not(.work-drafts) > h2",
      ".work-drafts > h2",
      ".work:not(.work-drafts) > .work-list > .work-item",
      ".work-drafts > .work-list > .work-item",
      ".play-entry",
      ".project-sections > .project-section",
      ".project-work-jump > h2",
      ".project-work-jump-list > li",
    ]) {
      expect(cssBlock(selector, baseStyles)).not.toMatch(/opacity:\s*0;/);
    }
  });

  it("retains project-specific artifact motion", () => {
    expect(surfaceStyles).toContain("@keyframes tt-outcome-arrive");
    expect(surfaceStyles).toContain("@keyframes nv-persona-rise");
    expect(surfaceStyles).toContain("@keyframes uf-template-sweep");
  });
});
```

- [ ] **Step 2: Run the motion test and verify RED**

Run:

```bash
npx vitest run src/app/__tests__/visible-first-motion.test.ts
```

Expected: FAIL because the selected keyframes begin at zero or reduced opacity, two begin blurred, and structural selectors set `opacity: 0`.

- [ ] **Step 3: Implement visible-first structural motion**

In `src/app/styles/base.css`:

- Set the first frame of `fadeUp` and `sectionScrollIn` to `opacity: 1`.
- Keep their existing `translateY` values.
- Remove `opacity: 0` from the eight structural selectors named in the test.

In `src/app/styles/portfolio-surfaces.css`:

- Set the first frame of `nv-hero-in`, `od-card-rise`, `od-highlight-in`, and `od-footer-in` to `opacity: 1`.
- Remove first-frame blur from `nv-hero-in` and `od-highlight-in`.
- Keep existing transform, scale, animation ranges, delays, and easing.
- Do not edit `tt-outcome-arrive`, `nv-persona-rise`, `uf-template-sweep`, or other project-specific artifact keyframes.

- [ ] **Step 4: Run the motion test and existing first-paint tests**

Run:

```bash
npx vitest run src/app/__tests__/visible-first-motion.test.ts src/app/__tests__/layout-first-paint.test.tsx src/app/__tests__/home-first-impression.test.tsx
```

Expected: 3 test files pass.

- [ ] **Step 5: Commit Task 3**

```bash
git add src/app/__tests__/visible-first-motion.test.ts src/app/styles/base.css src/app/styles/portfolio-surfaces.css
git commit -m "fix: keep structural motion visible"
```

### Task 4: Keep project navigation recognizable and clear of mobile chrome

**Files:**
- Create: `src/components/__tests__/project-toc-layout.test.ts`
- Modify: `src/app/styles/base.css`

**Interfaces:**
- Consumes: existing ProjectToc DOM and CSS classes.
- Produces: horizontal labeled TOC through `1439px`, vertical spine at `1440px`, persistent active spine label, and mobile-safe back-to-top offset.

- [ ] **Step 1: Write the failing scoped navigation test**

Create `src/components/__tests__/project-toc-layout.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function cssBlocks(header: string, source = styles) {
  const blocks: string[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf(header, cursor);
    if (start === -1) break;
    const open = source.indexOf("{", start);
    let depth = 0;

    for (let index = open; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(open + 1, index));
        cursor = index + 1;
        break;
      }
    }
  }

  expect(blocks.length, `${header} CSS blocks`).toBeGreaterThan(0);
  return blocks;
}

function cssBlock(header: string, source = styles) {
  const start = source.indexOf(header);
  expect(start, `${header} CSS header`).toBeGreaterThanOrEqual(0);
  const open = source.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS block for ${header}`);
}

describe("ProjectToc responsive layout", () => {
  it("starts the vertical spine at 1440px and keeps its active label visible", () => {
    expect(styles).not.toContain("@media (min-width: 1280px)");
    const wide = cssBlock("@media (min-width: 1440px)");
    const label = cssBlock(".project-toc-text", wide);
    const active = cssBlock(
      ".project-toc-link--active .project-toc-text",
      wide,
    );

    expect(label).toMatch(/right:\s*2\.5rem;/);
    expect(label).toMatch(/left:\s*auto;/);
    expect(label).toMatch(/text-align:\s*right;/);
    expect(active).toMatch(/opacity:\s*1;/);
  });

  it("raises the return control above mobile navigation and the safe area", () => {
    const mobile = cssBlocks("@media (max-width: 768px)").find((block) =>
      block.includes(".reading-top"),
    );
    expect(mobile).toBeDefined();
    const top = cssBlock(".reading-top", mobile!);

    expect(top).toMatch(
      /bottom:\s*calc\(3\.6rem \+ env\(safe-area-inset-bottom, 0px\) \+ 0\.75rem\);/,
    );
    expect(top).toMatch(/z-index:\s*110;/);
  });
});
```

- [ ] **Step 2: Run the navigation test and verify RED**

Run:

```bash
npx vitest run src/components/__tests__/project-toc-layout.test.ts
```

Expected: FAIL because the spine still begins at `1280px`, the active label is hidden, and no mobile return-control override exists.

- [ ] **Step 3: Implement the responsive TOC and return-control rules**

In `src/app/styles/base.css`:

- Change both `@media (min-width: 1280px)` ProjectToc queries to `@media (min-width: 1440px)`.
- In the wide `.project-toc-text` rule, use:

```css
left: auto;
right: 2.5rem;
max-width: min(12rem, calc(50vw - 38rem));
text-align: right;
transform: translateY(-50%) translateX(4px);
```

- Extend the reveal selector so the active label is visible without interaction:

```css
.project-toc-link--active .project-toc-text,
.project-toc-link:hover .project-toc-text,
.project-toc-link:focus-visible .project-toc-text {
  opacity: 1;
  transform: translateY(-50%) translateX(0);
}
```

- Inside `@media (max-width: 768px)`, add:

```css
.reading-top {
  right: 0.75rem;
  bottom: calc(3.6rem + env(safe-area-inset-bottom, 0px) + 0.75rem);
  z-index: 110;
}
```

- [ ] **Step 4: Run navigation tests**

Run:

```bash
npx vitest run src/components/__tests__/project-toc-layout.test.ts src/components/__tests__/project-toc.test.tsx src/app/work/__tests__/artifact-accessibility-styles.test.ts
```

Expected: 3 test files pass.

- [ ] **Step 5: Commit Task 4**

```bash
git add src/components/__tests__/project-toc-layout.test.ts src/app/styles/base.css
git commit -m "fix: keep project navigation readable"
```

### Task 5: Verify the complete batch in the browser and repository

**Files:**
- Modify only when visual acceptance fails: `src/app/styles/late-polish.css`
- Modify only when visual acceptance fails: `src/app/styles/base.css`
- Modify only when visual acceptance fails: `src/app/styles/portfolio-surfaces.css`

**Interfaces:**
- Consumes: Tasks 1 through 4 and the running local server on port `3100`.
- Produces: fresh responsive evidence and a clean verified branch.

- [ ] **Step 1: Capture fresh Fresh Greens cover evidence**

Open `/work/fresh-greens` at `1440 × 900`, `1024 × 768`, and `390 × 844` in light and dark themes.

Verify the complete device remains visible, desktop occupancy is roughly 85 percent of frame height, mobile width occupancy is 28 to 34 percent, the bottom gap reads as `1.5rem`, and no light seam or horizontal overflow appears.

When only phone occupancy fails, change `--fg-cover-scale` without changing the approved aspect ratios. Re-run the focused cover test and recapture every affected viewport.

- [ ] **Step 2: Verify unrelated covers and shared first paint**

Capture Navi at `1440 × 900` and `390 × 844`. Confirm its cover composition is unchanged and no layout shift appears after image decode.

Capture the homepage and About at `1440 × 900` immediately after navigation and after one second. Confirm structural content is readable in both captures and the lift motion still runs.

- [ ] **Step 3: Verify project navigation**

At `1280px`, confirm the horizontal TOC stays visible with readable labels. At `1440px`, confirm the vertical spine appears, its active label stays visible, labels open into the left gutter, and no label covers case-study text. At `390px`, scroll until the back-to-top control appears and confirm it clears the mobile navigation and safe area. Use keyboard Tab, Arrow keys, Home, End, and Escape to confirm existing behavior.

- [ ] **Step 4: Run focused tests sequentially**

```bash
npx vitest run src/components/__tests__/lead-media.test.tsx src/app/work/__tests__/lead-media-dimensions.test.ts src/app/work/fresh-greens/__tests__/cover-layout.test.ts src/app/__tests__/visible-first-motion.test.ts src/components/__tests__/project-toc-layout.test.ts src/components/__tests__/project-toc.test.tsx src/app/__tests__/layout-first-paint.test.tsx src/app/__tests__/home-first-impression.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 5: Run full verification sequentially**

```bash
npm test
npm run lint
npm run validate:content
git diff --check
```

Expected: 109 or more Vitest files pass, ESLint exits zero, content validation passes for four project files, and `git diff --check` prints no output.

- [ ] **Step 6: Review branch scope**

Run:

```bash
git status --short
git diff --stat HEAD~4..HEAD
git diff --name-only HEAD~4..HEAD
```

Expected: only the approved spec, plan, Batch One components, routes, styles, and tests are tracked. Pre-existing untracked screenshot and temporary directories remain untouched.
