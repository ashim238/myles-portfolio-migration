# Batch 1 Release Trust Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the known dependency, content-contract, metadata, 320 px navigation, and lint failures without changing the portfolio's applicant-facing positioning.

**Architecture:** Keep the existing Next.js App Router structure. Introduce one runtime-neutral project-status module shared by the content loader and validator, make `siteConfig` the only canonical-domain source, and keep Navi's narrow layout in its existing chrome and CSS. Lint fixes preserve current behavior and do not redesign the homepage motion.

**Tech Stack:** Next.js 16.2.10, React 19, TypeScript, Vitest, Testing Library, ESLint 9, CSS.

## Global Constraints

- Public positioning stays “Product Designer”; do not add “Associate” to applicant-facing copy.
- Batch 1 contains no portfolio-positioning rewrite.
- Supported project statuses are exactly `published`, `draft`, and `hidden`.
- `https://mylesdesignsthings.com` is the canonical production URL.
- Do not take unrelated major-version dependency upgrades.
- Do not disable lint rules to hide a production-code error.
- Preserve reduced-motion behavior, keyboard access, and existing project visibility behavior.
- Preserve story-bearing motion and interactive artifacts. Batch 1 fixes must not flatten, remove, or redesign them.
- Applicant-facing prose changes require the anti-slop gate in the approved specification. This batch avoids such rewrites.

---

## File map

- `package.json`, `package-lock.json`: patched framework versions only.
- `src/lib/project-status.mjs`: shared status values and strict parser usable by Node and TypeScript.
- `src/lib/content.ts`: consumes the strict shared status parser.
- `scripts/validate-content.mjs`: consumes the same shared status parser.
- `src/lib/__tests__/content-status.test.ts`: valid and invalid status contract.
- `src/lib/site-config.ts`: canonical URL source.
- `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`: canonical metadata consumers.
- `src/app/__tests__/metadata-routes.test.ts`: sitemap and robots contract.
- `src/components/navi/chrome/NaviHeader.tsx`, `src/app/globals.css`: narrow Navi header.
- `src/components/navi/chrome/__tests__/NaviHeader.test.tsx`: compact-label semantics.
- Existing lint-reported files: behavior-preserving lint cleanup only.

---

### Task 1: Patch the production framework

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

**Interfaces:**
- Consumes: existing npm dependency graph.
- Produces: `next@16.2.10` and `eslint-config-next@16.2.10` locked together.

- [ ] **Step 1: Record the failing production audit**

Run:

```bash
npm audit --omit=dev
```

Expected: non-zero exit with a high-severity advisory affecting `next@16.2.4`.

- [ ] **Step 2: Install only the patched framework pair**

Run:

```bash
npm install --save-exact next@16.2.10
npm install --save-dev --save-exact eslint-config-next@16.2.10
```

Expected: `package.json` and `package-lock.json` change; React and unrelated packages retain their current requested versions.

- [ ] **Step 3: Verify the production advisory is removed**

Run:

```bash
npm ls next eslint-config-next
npm audit --omit=dev
```

Expected: both framework packages resolve to 16.2.10 and the prior Next.js high advisory is absent.

- [ ] **Step 4: Run framework smoke checks**

Run:

```bash
npx tsc --noEmit
npm test
```

Expected: TypeScript exits 0 and all 255 existing tests pass before later tasks add tests.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "fix: patch Next.js security advisory"
```

---

### Task 2: Enforce one project-status contract

**Files:**
- Create: `src/lib/project-status.mjs`
- Create: `src/lib/__tests__/content-status.test.ts`
- Modify: `src/lib/content.ts`
- Modify: `scripts/validate-content.mjs`

**Interfaces:**
- Produces: `PROJECT_STATUSES`, a frozen tuple-like array.
- Produces: `parseProjectStatus(value: unknown): "published" | "draft" | "hidden"`.
- Consumers: content loading and the standalone validation script.

- [ ] **Step 1: Write the failing status tests**

Create `src/lib/__tests__/content-status.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  PROJECT_STATUSES,
  parseProjectStatus,
} from "@/lib/project-status.mjs";

describe("project status contract", () => {
  it("accepts the three supported visibility states", () => {
    expect(PROJECT_STATUSES).toEqual(["published", "draft", "hidden"]);
    for (const status of PROJECT_STATUSES) {
      expect(parseProjectStatus(status)).toBe(status);
    }
  });

  it.each([undefined, null, "", "private", "Published"])(
    "rejects unsupported status %s",
    (status) => {
      expect(() => parseProjectStatus(status)).toThrow(
        "Project status must be published, draft, or hidden",
      );
    },
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/lib/__tests__/content-status.test.ts
```

Expected: FAIL because `@/lib/project-status.mjs` does not exist.

- [ ] **Step 3: Add the shared strict parser**

Create `src/lib/project-status.mjs`:

```js
/** @type {readonly ["published", "draft", "hidden"]} */
export const PROJECT_STATUSES = Object.freeze([
  "published",
  "draft",
  "hidden",
]);

/**
 * @param {unknown} value
 * @returns {"published" | "draft" | "hidden"}
 */
export function parseProjectStatus(value) {
  const status = typeof value === "string" ? value.trim() : "";
  if (!PROJECT_STATUSES.includes(status)) {
    throw new Error(
      `Project status must be published, draft, or hidden. Received ${JSON.stringify(value)}.`,
    );
  }
  return status;
}
```

- [ ] **Step 4: Make the content loader reject unknown states**

In `src/lib/content.ts`, import and re-export the inferred type:

```ts
import { parseProjectStatus } from "@/lib/project-status.mjs";

export type ProjectStatus = ReturnType<typeof parseProjectStatus>;
```

Replace the coercing status block in `parseProjectFrontmatter` with:

```ts
const status = parseProjectStatus(data.status);
```

- [ ] **Step 5: Make validation use the same parser**

At the top of `scripts/validate-content.mjs` add:

```js
import { parseProjectStatus } from "../src/lib/project-status.mjs";
```

Replace the two-value status check with:

```js
try {
  parseProjectStatus(data.status);
} catch (error) {
  errors.push(`${fileName}: ${error.message}`);
}
```

- [ ] **Step 6: Verify tests and real content**

Run:

```bash
npm test -- src/lib/__tests__/content-status.test.ts src/app/work/\[slug\]/__tests__/static-params.test.ts
npm run validate:content
```

Expected: status tests pass, hidden-route behavior stays green, and validation passes all four project files including `tiktok.md`.

- [ ] **Step 7: Commit**

```bash
git add src/lib/project-status.mjs src/lib/content.ts scripts/validate-content.mjs src/lib/__tests__/content-status.test.ts
git commit -m "fix: enforce project visibility states"
```

---

### Task 3: Centralize canonical metadata routes

**Files:**
- Create: `src/app/__tests__/metadata-routes.test.ts`
- Modify: `src/lib/site-config.ts`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`

**Interfaces:**
- Produces: `siteConfig.siteUrl: "https://mylesdesignsthings.com"`.
- Consumers: root metadata, sitemap, and robots metadata routes.

- [ ] **Step 1: Write failing metadata-route tests**

Create `src/app/__tests__/metadata-routes.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

const getPublishedProjects = vi.fn();
vi.mock("@/lib/content", () => ({
  getPublishedProjects: () => getPublishedProjects(),
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/lib/site-config";

describe("metadata routes", () => {
  beforeEach(() => {
    getPublishedProjects.mockResolvedValue([
      { slug: "sample-project" },
    ]);
  });

  it("uses one canonical production origin", () => {
    expect(siteConfig.siteUrl).toBe("https://mylesdesignsthings.com");
    expect(robots().sitemap).toBe(
      "https://mylesdesignsthings.com/sitemap.xml",
    );
  });

  it("includes About and published work without synthetic modified dates", async () => {
    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://mylesdesignsthings.com",
        "https://mylesdesignsthings.com/about",
        "https://mylesdesignsthings.com/work/sample-project",
      ]),
    );
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/app/__tests__/metadata-routes.test.ts
```

Expected: FAIL because `siteConfig.siteUrl` is missing, robots uses the other domain, About is absent, and `lastModified` is populated.

- [ ] **Step 3: Add the canonical URL to site configuration**

Add to `siteConfig` in `src/lib/site-config.ts`:

```ts
siteUrl: "https://mylesdesignsthings.com",
```

- [ ] **Step 4: Consume the shared URL from root metadata**

Remove `BASE_URL` from `src/app/layout.tsx` and replace its uses with:

```ts
metadataBase: new URL(siteConfig.siteUrl),
```

and:

```ts
url: siteConfig.siteUrl,
```

- [ ] **Step 5: Rebuild sitemap entries without fake timestamps**

Replace `src/app/sitemap.ts` with:

```ts
import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/content";
import { siteConfig } from "@/lib/site-config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: siteConfig.siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteConfig.siteUrl}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.siteUrl}/play`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteConfig.siteUrl}/resume`, changeFrequency: "monthly", priority: 0.5 },
  ];
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteConfig.siteUrl}/work/${project.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  return [...staticEntries, ...projectEntries];
}
```

- [ ] **Step 6: Rebuild robots from the same source**

Replace the sitemap value in `src/app/robots.ts` with:

```ts
sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
```

and add:

```ts
import { siteConfig } from "@/lib/site-config";
```

- [ ] **Step 7: Run the metadata tests**

Run:

```bash
npm test -- src/app/__tests__/metadata-routes.test.ts
npx tsc --noEmit
```

Expected: metadata tests and TypeScript pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/site-config.ts src/app/layout.tsx src/app/sitemap.ts src/app/robots.ts src/app/__tests__/metadata-routes.test.ts
git commit -m "fix: centralize canonical site metadata"
```

---

### Task 4: Make the Navi header fit at 320 px

**Files:**
- Modify: `src/components/navi/chrome/NaviHeader.tsx`
- Modify: `src/components/navi/chrome/__tests__/NaviHeader.test.tsx`
- Modify: `src/app/globals.css`

**Interfaces:**
- Preserves: accessible link name `Return to case study`.
- Produces: `.nv-nav-back-wide` and `.nv-nav-back-short` visual labels.

- [ ] **Step 1: Write the failing compact-label test**

Append to `NaviHeader.test.tsx`:

```tsx
it("provides a shorter visual exit label for narrow screens", () => {
  const { container } = render(<NaviHeader />);
  const link = screen.getByRole("link", { name: "Return to case study" });
  expect(link).toHaveAttribute("href", "/work/navi");
  expect(container.querySelector(".nv-nav-back-wide")).toHaveTextContent(
    "Return to case study",
  );
  expect(container.querySelector(".nv-nav-back-short")).toHaveTextContent(
    "Case study",
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
npm test -- src/components/navi/chrome/__tests__/NaviHeader.test.tsx
```

Expected: FAIL because the two label spans do not exist.

- [ ] **Step 3: Add accessible long and short labels**

Replace the back-link body in `NaviHeader.tsx` with:

```tsx
<Link
  href="/work/navi"
  className="nv-nav-back"
  aria-label="Return to case study"
>
  <span className="nv-nav-back-wide" aria-hidden="true">
    Return to case study
  </span>
  <span className="nv-nav-back-short" aria-hidden="true">
    Case study
  </span>
</Link>
```

- [ ] **Step 4: Add the narrow responsive treatment**

Add beside the existing Navi header rules in `globals.css`:

```css
.nv-nav-back-short {
  display: none;
}

@media (max-width: 640px) {
  .nv-header {
    gap: var(--nv-sp-xs);
  }
  .nv-nav {
    min-width: 0;
    gap: var(--nv-sp-xs);
  }
  .nv-nav-back-wide {
    display: none;
  }
  .nv-nav-back-short {
    display: inline;
  }
  .nv-nav-host {
    padding: 6px 10px;
  }
}
```

Do not hide the wordmark unless measured 320 px evidence still shows overflow after this treatment.

- [ ] **Step 5: Verify the component and responsive widths**

Run:

```bash
npm test -- src/components/navi/chrome/__tests__/NaviHeader.test.tsx
```

Expected: all NaviHeader tests pass.

Then inspect `/work/navi/demo` at 320, 360, 390, and 768 px. At every width, verify `document.documentElement.scrollWidth === window.innerWidth`, and confirm the wordmark, case-study exit, and host action remain usable.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/chrome/NaviHeader.tsx src/components/navi/chrome/__tests__/NaviHeader.test.tsx src/app/globals.css
git commit -m "fix: fit Navi header on narrow screens"
```

---

### Task 5: Restore a clean lint gate

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/components/hero-interest-typer.tsx`
- Modify: `src/components/home-browser-intro.tsx`
- Modify: `src/components/navi-demo-embed.tsx`
- Modify: `src/components/theme-toggle.tsx`
- Modify: `src/app/play/page.tsx`
- Modify: `src/app/work/navi/(minisite)/system/page.tsx`
- Modify: `src/components/navi/demo/Map.client.tsx`
- Modify: `src/lib/navi/use-overlay-behavior.ts`
- Modify: `public/play/loom/sketch.js`
- Modify: three Navi test mocks reported by ESLint.

**Interfaces:**
- Preserves all visible behavior.
- Produces: zero ESLint errors and zero warnings.

- [ ] **Step 1: Record the failing lint baseline**

Run:

```bash
npm run lint
```

Expected: 5 errors and 10 warnings.

- [ ] **Step 2: Apply non-behavioral cleanup**

Make these exact edits:

```tsx
// src/app/work/fresh-greens/page.tsx
What didn&apos;t ship yet
```

Remove the unused `siteConfig` import from `src/app/play/page.tsx` and the unused `Card` import from the Navi system page.

Before each p5 global callback in `public/play/loom/sketch.js`, add the narrow justification:

```js
// p5 discovers this callback by global name.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
```

In the three reported test mocks, consume the required signature parameter inside the function body:

```ts
void opts;
```

- [ ] **Step 3: Make hook cleanup references stable**

In the Leaflet initialization effect, capture the marker map before returning cleanup:

```ts
const markersById = markerById.current;
```

and replace the cleanup call with:

```ts
markersById.clear();
```

Update the overlay effect dependency list to:

```ts
}, [open, containerRef, initialFocusRef]);
```

- [ ] **Step 4: Remove synchronous derived-state effects**

For `HeroInterestTyper`, replace the state with an event-only state and derive reduced-motion readiness:

```ts
const [entranceSignalReady, setEntranceSignalReady] = useState(!awaitHomeEntrance);
const entranceReady = reducedMotion || entranceSignalReady;
```

Replace the entrance-readiness effect with:

```ts
useEffect(() => {
  if (!awaitHomeEntrance || reducedMotion) return;

  const onReady = () => setEntranceSignalReady(true);
  if (document.querySelector(".home-page.home-entrance-done")) {
    const frame = window.requestAnimationFrame(onReady);
    return () => window.cancelAnimationFrame(frame);
  }

  window.addEventListener(HOME_ENTRANCE_COMPLETE, onReady, { once: true });
  return () => window.removeEventListener(HOME_ENTRANCE_COMPLETE, onReady);
}, [awaitHomeEntrance, reducedMotion]);
```

For `NaviDemoEmbed`, replace the media-query effect with `useSyncExternalStore`:

```ts
function subscribeDesktopQuery(callback: () => void) {
  const query = window.matchMedia("(min-width: 900px)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia("(min-width: 900px)").matches;
}

function getDesktopServerSnapshot() {
  return false;
}
```

Then use:

```ts
const useIframe = useSyncExternalStore(
  subscribeDesktopQuery,
  getDesktopSnapshot,
  getDesktopServerSnapshot,
);
```

For `ThemeToggle`, replace the state/effect setup with this external-store implementation while leaving the existing button and SVG markup unchanged:

```ts
import { useEffect, useSyncExternalStore } from "react";

type Theme = "dark" | "light";
const THEME_CHANGE_EVENT = "theme-change";

function isTheme(value: string | null): value is Theme {
  return value === "dark" || value === "light";
}

function getThemeSnapshot(): Theme {
  const documentTheme = document.documentElement.getAttribute("data-theme");
  if (isTheme(documentTheme)) return documentTheme;
  const storedTheme = localStorage.getItem("theme");
  if (isTheme(storedTheme)) return storedTheme;
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function getThemeServerSnapshot(): Theme {
  return "dark";
}

function subscribeTheme(callback: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: light)");
  query.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    query.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      type="button"
    >
      <svg
        className="theme-toggle-icon"
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden="true"
      >
        {theme === "dark" ? (
          <circle
            cx="8"
            cy="8"
            r="3.5"
            stroke="currentColor"
            strokeWidth="1.3"
          />
        ) : (
          <path
            d="M8.9 2.2A5.5 5.5 0 0 0 13.8 7.1 5.5 5.5 0 1 1 8.9 2.2Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}
```

For `HomeBrowserIntro`, import `useSyncExternalStore` instead of `useState` and add:

```ts
const HOME_BROWSER_INTRO_VISIBILITY_CHANGE =
  "home-browser-intro-visibility-change";

function subscribeBrowserIntroVisibility(callback: () => void) {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  reducedMotion.addEventListener("change", callback);
  window.addEventListener(HOME_BROWSER_INTRO_VISIBILITY_CHANGE, callback);
  return () => {
    reducedMotion.removeEventListener("change", callback);
    window.removeEventListener(HOME_BROWSER_INTRO_VISIBILITY_CHANGE, callback);
  };
}

function getBrowserIntroVisibilitySnapshot() {
  return (
    sessionStorage.getItem(HOME_BROWSER_INTRO_KEY) !== "1" &&
    !prefersReducedMotion()
  );
}

function getBrowserIntroVisibilityServerSnapshot() {
  return true;
}
```

At the end of `completeBrowserIntro`, after writing the key and removing the lock, add:

```ts
window.dispatchEvent(new Event(HOME_BROWSER_INTRO_VISIBILITY_CHANGE));
```

Replace the visibility state with:

```ts
const visible = useSyncExternalStore(
  subscribeBrowserIntroVisibility,
  getBrowserIntroVisibilitySnapshot,
  getBrowserIntroVisibilityServerSnapshot,
);
```

Replace the early effect branch with:

```ts
if (!visible) {
  if (!seen && reduced) {
    sessionStorage.setItem(HOME_BROWSER_INTRO_KEY, "1");
  }
  window.dispatchEvent(new CustomEvent(HOME_BROWSER_INTRO_COMPLETE));
  return;
}
```

Remove `done.then(() => setVisible(false));`. The existing `done` chain calls `completeBrowserIntro`, which now updates the external-store snapshot.

- [ ] **Step 5: Run focused behavior checks**

Run:

```bash
npm test -- src/components/navi/chrome/__tests__/NaviHeader.test.tsx src/components/navi/demo/__tests__/Map.test.tsx src/lib/navi/__tests__/overlay-lock.test.ts
npm run lint
```

Expected: focused tests pass and ESLint reports zero problems.

- [ ] **Step 6: Run TypeScript and the full test suite**

Run:

```bash
npx tsc --noEmit
npm test
```

Expected: TypeScript and the complete suite pass.

- [ ] **Step 7: Commit**

```bash
git add public/play/loom/sketch.js src/app/play/page.tsx src/app/work/fresh-greens/page.tsx src/app/work/navi/\(minisite\)/system/page.tsx src/components/hero-interest-typer.tsx src/components/home-browser-intro.tsx src/components/navi-demo-embed.tsx src/components/theme-toggle.tsx src/components/navi/demo/Map.client.tsx src/lib/navi/use-overlay-behavior.ts src/components/navi/demo/__tests__/Map.test.tsx src/components/navi/demo/__tests__/experience-page.test.tsx src/components/navi/demo/__tests__/search-page.test.tsx
git commit -m "fix: restore clean lint gate"
```

---

### Task 6: Verify Batch 1 as a release candidate

**Files:**
- No production files unless a verification failure exposes a defect in the preceding tasks.

**Interfaces:**
- Consumes: Tasks 1 through 5.
- Produces: verification evidence for the Batch 1 handoff.

- [ ] **Step 1: Run all local quality gates**

Run:

```bash
npm run lint
npm run validate:content
npx tsc --noEmit
npm test
```

Expected: every command exits 0 and the suite count is at least 257 tests after the two new test files.

- [ ] **Step 2: Run dependency audits**

Run:

```bash
npm audit --omit=dev
npm audit
```

Expected: the Next.js production high advisory is absent. Record remaining development-only findings separately; do not take major upgrades without a new decision.

- [ ] **Step 3: Build production output**

Run:

```bash
npm run build
```

Expected: Next.js production build exits 0 and emits the existing application routes plus `/about` in sitemap output.

- [ ] **Step 4: Browser smoke test**

Verify these routes at desktop and 320 px when browser tooling is available:

```text
/
/about
/resume
/work/navi/demo
/work/hidden-does-not-exist
```

Confirm no console errors, no horizontal overflow, working theme toggle, hidden-project 404 behavior, and usable keyboard focus.

- [ ] **Step 5: Inspect final scope**

Run:

```bash
git status --short
git log --oneline -6
```

Expected: only intended Batch 1 files changed, commits are task-scoped, and no generated audit or temporary files are staged.
