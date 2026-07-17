# Batch 4.1 Release Protection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Close the hidden-project exposure, remove the Navi mobile navigation collision, and add baseline release security headers without changing the portfolio's visual direction.

**Architecture:** Keep each fix at its existing ownership boundary: the dedicated TikTok server route enforces project status before rendering, the client-side global mobile navigation suppresses itself only for Navi minisite routes, and Next configuration owns response headers. Each behavior receives a focused regression test before implementation.

**Tech Stack:** Next.js 16.2.10 App Router, React 19.2.4, TypeScript 5, Vitest 2.1.9, Testing Library.

## Global Constraints

- Target broad Associate Product Design roles while preserving a senior-quality craft and execution bar.
- TikTok remains hidden until its compact case study and public-safety review are approved.
- Preserve the homepage decoder, Absolute Batman line, Fresh Greens-first project order, and existing visual direction.
- Do not add dependencies.
- Every behavior change follows red-green-refactor: run the focused test and observe the expected failure before touching production code.
- Preserve reduced-motion behavior and existing keyboard semantics.
- Candidate-facing copy is out of scope for this batch.
- Required batch verification: focused tests, full `npm test`, `npm run lint`, `npx tsc --noEmit`, `npm run validate:content`, and `npm run build`.

---

### Task 1: Guard the dedicated TikTok route

**Files:**
- Create: `src/app/work/tiktok/__tests__/visibility.test.tsx`
- Modify: `src/app/work/tiktok/page.tsx:1-50`

**Interfaces:**
- Consumes: `getProjectBySlug(slug: string): Promise<Project | null>` and Next.js `notFound()`.
- Produces: a dedicated TikTok route that renders only when its content status is `published`.

- [ ] **Step 1: Write the failing route test**

```tsx
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project, ProjectStatus } from "@/lib/content";

const getProjectBySlug = vi.fn();
const getPublishedProjects = vi.fn();

vi.mock("@/lib/content", () => ({
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => getPublishedProjects(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import TikTokPage from "@/app/work/tiktok/page";

function makeProject(status: ProjectStatus): Project {
  return {
    slug: "tiktok",
    title: "TikTok Dynamic Showcase Ads",
    summary: "Summary",
    role: "Visual Designer, Brand Studio",
    timeframe: "2021",
    status,
    order: 4,
    tags: [],
    sections: [],
    bodyHtml: "",
  };
}

describe("dedicated TikTok route visibility", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getPublishedProjects.mockResolvedValue([]);
  });

  it.each(["hidden", "draft"] as const)("404s when TikTok is %s", async (status) => {
    getProjectBySlug.mockResolvedValue(makeProject(status));
    await expect(TikTokPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders when TikTok is published", async () => {
    getProjectBySlug.mockResolvedValue(makeProject("published"));
    await expect(TikTokPage()).resolves.toBeTruthy();
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/app/work/tiktok/__tests__/visibility.test.tsx`

Expected: FAIL because the current dedicated route never calls `getProjectBySlug()` or `notFound()`.

- [ ] **Step 3: Add the minimal server-route guard**

Update the route imports and first lines of `TikTokPage`:

```tsx
import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects } from "@/lib/content";

export default async function TikTokPage() {
  const project = await getProjectBySlug("tiktok");
  if (!project || project.status !== "published") {
    notFound();
  }

  const allProjects = await getPublishedProjects();
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/app/work/tiktok/__tests__/visibility.test.tsx`

Expected: 3 tests pass.

- [ ] **Step 5: Run the related generic-route regression tests**

Run: `npm test -- 'src/app/work/[slug]/__tests__/static-params.test.ts' src/lib/__tests__/content-status.test.ts`

Expected: all related tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/visibility.test.tsx
git commit -m "fix: enforce hidden project visibility"
```

---

### Task 2: Suppress global mobile navigation inside Navi minisites

**Files:**
- Create: `src/components/__tests__/mobile-nav.test.tsx`
- Modify: `src/components/mobile-nav.tsx:63-89`

**Interfaces:**
- Consumes: `usePathname(): string`.
- Produces: `MobileNav` returns `null` for `/work/navi/demo`, `/work/navi/system`, and their descendants, while remaining visible elsewhere.

- [ ] **Step 1: Write the failing component tests**

```tsx
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const route = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

import { MobileNav } from "@/components/mobile-nav";

describe("MobileNav route ownership", () => {
  beforeEach(() => {
    route.pathname = "/";
  });

  it.each([
    "/work/navi/demo",
    "/work/navi/demo/experience/harlem-jazz-walk",
    "/work/navi/system",
    "/work/navi/system/components",
  ])("stays out of Navi-owned route %s", (pathname) => {
    route.pathname = pathname;
    render(<MobileNav />);
    expect(screen.queryByRole("navigation", { name: "Mobile navigation" })).not.toBeInTheDocument();
  });

  it("remains available on the Navi case study", () => {
    route.pathname = "/work/navi";
    render(<MobileNav />);
    expect(screen.getByRole("navigation", { name: "Mobile navigation" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/__tests__/mobile-nav.test.tsx`

Expected: four suppression cases fail because the navigation is always rendered.

- [ ] **Step 3: Add a scoped Navi-minisite predicate**

Add after `const pathname = usePathname()`:

```tsx
  const isNaviMinisite =
    pathname === "/work/navi/demo" ||
    pathname.startsWith("/work/navi/demo/") ||
    pathname === "/work/navi/system" ||
    pathname.startsWith("/work/navi/system/");

  if (isNaviMinisite) return null;
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/components/__tests__/mobile-nav.test.tsx`

Expected: 5 tests pass.

- [ ] **Step 5: Run nearby Navi chrome tests**

Run: `npm test -- src/components/navi/chrome/__tests__/NaviHeader.test.tsx src/components/navi/chrome/__tests__/ActiveTabBar.test.tsx`

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/mobile-nav.tsx src/components/__tests__/mobile-nav.test.tsx
git commit -m "fix: separate Navi mobile navigation"
```

---

### Task 3: Add baseline security headers

**Files:**
- Create: `src/app/__tests__/security-headers.test.ts`
- Modify: `next.config.ts:1-18`

**Interfaces:**
- Produces: `NextConfig.poweredByHeader = false` and a global `headers()` rule covering every path.
- CSP must preserve same-origin app scripts, inline Next/theme bootstrap styles and scripts, the local Loom iframe's CDN-hosted p5 script, CARTO map tiles, local media, blobs, and data images.

- [ ] **Step 1: Write the failing configuration test**

```ts
import { describe, expect, it } from "vitest";
import nextConfig from "../../../next.config";

describe("release security headers", () => {
  it("removes framework disclosure and applies baseline headers globally", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    expect(nextConfig.headers).toBeTypeOf("function");

    const rules = await nextConfig.headers!();
    const globalRule = rules.find((rule) => rule.source === "/(.*)");
    expect(globalRule).toBeDefined();

    const headers = Object.fromEntries(
      globalRule!.headers.map(({ key, value }) => [key, value]),
    );

    expect(headers["Content-Security-Policy"]).toContain("default-src 'self'");
    expect(headers["Content-Security-Policy"]).toContain("object-src 'none'");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()");
  });
});
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/app/__tests__/security-headers.test.ts`

Expected: FAIL because `poweredByHeader` and `headers()` do not exist.

- [ ] **Step 3: Add the minimal global header policy**

Add above `nextConfig`:

```ts
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.prod.website-files.com https://placehold.co https://*.basemaps.cartocdn.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];
```

Add to `nextConfig`:

```ts
  poweredByHeader: false,
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `npm test -- src/app/__tests__/security-headers.test.ts`

Expected: 1 test passes.

- [ ] **Step 5: Run type checking to validate the Next config contract**

Run: `npx tsc --noEmit`

Expected: exit 0 with no diagnostics.

- [ ] **Step 6: Commit**

```bash
git add next.config.ts src/app/__tests__/security-headers.test.ts
git commit -m "fix: add baseline release headers"
```

---

### Task 4: Verify Batch 4.1 as an integrated release-protection slice

**Files:**
- No production changes expected.

**Interfaces:**
- Verifies the three preceding tasks together in production mode.

- [ ] **Step 1: Run focused release-protection tests**

Run: `npm test -- src/app/work/tiktok/__tests__/visibility.test.tsx src/components/__tests__/mobile-nav.test.tsx src/app/__tests__/security-headers.test.ts`

Expected: 9 tests pass.

- [ ] **Step 2: Run the complete automated verification suite**

Run each command and require exit 0:

```bash
npm test
npm run lint
npx tsc --noEmit
npm run validate:content
npm run build
```

- [ ] **Step 3: Verify production behavior**

- Start the production server from the new build.
- Request `/work/tiktok` and verify HTTP 404.
- Request `/` and verify the four application-owned security headers are present and `X-Powered-By` is absent.
- Inspect `/work/navi/demo` at 320px and verify only Navi's product navigation occupies the bottom edge.
- Inspect `/work/navi` at 320px and verify the portfolio mobile navigation remains present.

- [ ] **Step 4: Record review and progress**

Append reviewed commit ranges and test evidence to `.superpowers/sdd/progress.md` before beginning the next batch plan.
