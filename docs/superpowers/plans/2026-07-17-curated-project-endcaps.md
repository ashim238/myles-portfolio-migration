# Curated Project Endcaps Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic multi-card `More work` grid with one authored next-project transition and a secondary `View all work` link on every case study.

**Architecture:** Store the four-project path and bridge copy in one pure data resolver, then keep the existing `ProjectWorkJump` caller interface while changing its rendered contract. The component resolves only published destinations, renders a destination-specific media treatment, and falls back to the work-index link when the path cannot be resolved.

**Tech Stack:** Next.js 16, React 19, TypeScript, `next/image`, CSS, Vitest, Testing Library

## Global Constraints

- Fresh Greens goes to Navi.
- Navi goes to UnderstandingFAFSA.
- UnderstandingFAFSA goes to TikTok.
- TikTok goes to Fresh Greens.
- The component must not render draft projects as a curated destination.
- An unknown next-project slug omits the primary card and retains `View all work`.
- Bridge copy cannot introduce a new outcome, role, or process claim.
- The next-project card has one clear accessible name and does not create nested interactive elements.
- Hover motion has an equivalent focus treatment.
- Reduced motion removes card translation and image scaling.
- No em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or aphoristic closers.
- All behavior changes begin with a failing regression test.

---

## File structure

- Create `src/lib/project-sequence.ts`: owns the approved transition map, bridge copy, and pure published-project resolver.
- Create `src/lib/__tests__/project-sequence.test.ts`: covers all transitions, copy constraints, unknown projects, missing projects, and draft rejection.
- Modify `src/components/project-work-jump.tsx`: renders one semantic destination card plus the work-index link.
- Create `src/components/__tests__/project-work-jump.test.tsx`: covers links, headings, media, fallback, and TikTok's animated mark.
- Create `src/components/__tests__/project-work-jump-layout.test.ts`: locks responsive geometry, focus parity, destination-scoped surfaces, and reduced motion.
- Modify `src/app/styles/base.css`: replaces the old list/card styles with the wide editorial endcap.
- Modify `src/app/styles/portfolio-surfaces.css`: retargets the supported scroll-linked entrance to the new elements.
- Modify `src/app/styles/late-polish.css`: removes the old work-jump elements from the pre-hidden IntersectionObserver fallback.
- Modify `src/components/scroll-reveal-fallback.tsx`: removes selectors for elements that no longer exist.
- Modify `src/app/__tests__/visible-first-motion.test.ts`: locks the new endcap's visible-first behavior.

Existing callers keep passing `currentSlug` and the published project array. No case-study page or project frontmatter changes are required.

### Task 1: Resolve the approved next-project path

**Files:**
- Create: `src/lib/project-sequence.ts`
- Create: `src/lib/__tests__/project-sequence.test.ts`

**Interfaces:**
- Produces: `ResolvedNextProject = { project: Project; bridge: string }`
- Produces: `resolveNextProject(currentSlug: string, projects: readonly Project[]): ResolvedNextProject | null`

- [ ] **Step 1: Write the failing resolver tests**

Create `src/lib/__tests__/project-sequence.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/content";
import { resolveNextProject } from "@/lib/project-sequence";

function project(slug: string, status: Project["status"] = "published"): Project {
  return {
    slug,
    title: slug,
    summary: `${slug} summary`,
    role: "Product Designer",
    timeframe: "2026",
    status,
    order: 1,
    tags: [],
    coverImage: `/projects/${slug}/cover.png`,
    sections: [],
    bodyHtml: "",
  };
}

const projects = [
  project("fresh-greens"),
  project("navi"),
  project("understandingfafsa"),
  project("tiktok"),
];

describe("resolveNextProject", () => {
  it.each([
    [
      "fresh-greens",
      "navi",
      "I also explored routing through neighborhood discovery and local booking.",
    ],
    [
      "navi",
      "understandingfafsa",
      "I turned an audit of 120 newsletter sends into a modular system a non-designer could run each week.",
    ],
    [
      "understandingfafsa",
      "tiktok",
      "At TikTok, I worked within a fixed catalog structure to build visual templates for fashion brands.",
    ],
    [
      "tiktok",
      "fresh-greens",
      "Fresh Greens is my most recent project: a route-planning prototype shaped by interviews with Black drivers.",
    ],
  ])("maps %s to %s", (currentSlug, nextSlug, bridge) => {
    expect(resolveNextProject(currentSlug, projects)).toEqual({
      project: expect.objectContaining({ slug: nextSlug }),
      bridge,
    });
  });

  it("returns null for an unknown current project", () => {
    expect(resolveNextProject("unknown", projects)).toBeNull();
  });

  it("returns null when the mapped destination is missing", () => {
    expect(resolveNextProject("fresh-greens", projects.slice(0, 1))).toBeNull();
  });

  it("returns null when the mapped destination is a draft", () => {
    const withDraftNavi = projects.map((item) =>
      item.slug === "navi" ? { ...item, status: "draft" as const } : item,
    );

    expect(resolveNextProject("fresh-greens", withDraftNavi)).toBeNull();
  });

  it("keeps every bridge free of banned punctuation", () => {
    for (const current of projects) {
      const resolved = resolveNextProject(current.slug, projects);
      expect(resolved?.bridge).not.toMatch(/[—;…]/);
    }
  });
});
```

- [ ] **Step 2: Run the resolver test to verify it fails**

```bash
npx vitest run src/lib/__tests__/project-sequence.test.ts
```

Expected: FAIL because `@/lib/project-sequence` does not exist.

- [ ] **Step 3: Add the pure transition map and resolver**

Create `src/lib/project-sequence.ts`:

```ts
import type { Project } from "@/lib/content";

const PROJECT_SEQUENCE = {
  "fresh-greens": {
    nextSlug: "navi",
    bridge:
      "I also explored routing through neighborhood discovery and local booking.",
  },
  navi: {
    nextSlug: "understandingfafsa",
    bridge:
      "I turned an audit of 120 newsletter sends into a modular system a non-designer could run each week.",
  },
  understandingfafsa: {
    nextSlug: "tiktok",
    bridge:
      "At TikTok, I worked within a fixed catalog structure to build visual templates for fashion brands.",
  },
  tiktok: {
    nextSlug: "fresh-greens",
    bridge:
      "Fresh Greens is my most recent project: a route-planning prototype shaped by interviews with Black drivers.",
  },
} as const satisfies Record<string, { nextSlug: string; bridge: string }>;

export type ResolvedNextProject = {
  project: Project;
  bridge: string;
};

export function resolveNextProject(
  currentSlug: string,
  projects: readonly Project[],
): ResolvedNextProject | null {
  const route = PROJECT_SEQUENCE[currentSlug as keyof typeof PROJECT_SEQUENCE];
  if (!route) return null;

  const project = projects.find(
    (candidate) =>
      candidate.slug === route.nextSlug && candidate.status === "published",
  );

  return project ? { project, bridge: route.bridge } : null;
}
```

- [ ] **Step 4: Run the resolver tests to verify they pass**

```bash
npx vitest run src/lib/__tests__/project-sequence.test.ts
```

Expected: 1 file and 8 tests pass.

- [ ] **Step 5: Commit the path contract**

```bash
git add src/lib/project-sequence.ts src/lib/__tests__/project-sequence.test.ts
git commit -m "feat: define curated portfolio reading path"
```

### Task 2: Render one semantic next-project destination

**Files:**
- Modify: `src/components/project-work-jump.tsx`
- Create: `src/components/__tests__/project-work-jump.test.tsx`

**Interfaces:**
- Consumes: `resolveNextProject(currentSlug, projects)` from Task 1
- Preserves: `ProjectWorkJump({ currentSlug, projects: readonly Project[] })`
- Produces: `.project-work-jump-card`, `.project-work-jump-label`, `.project-work-jump-title`, `.project-work-jump-bridge`, `.project-work-jump-media`, and `.project-work-jump-view-all`

- [ ] **Step 1: Write the failing component tests**

Create `src/components/__tests__/project-work-jump.test.tsx` with `next/image`, `next/link`, `TransitionLink`, and `TikTokCoverBlobs` test doubles. Use this fixture and contract:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { ProjectWorkJump } from "@/components/project-work-jump";

vi.mock("next/image", () => ({
  default: ({ alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

vi.mock("@/components/transition-link", () => ({
  TransitionLink: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("@/components/tiktok-dsa", () => ({
  TikTokCoverBlobs: ({ deferUntilVisible }: { deferUntilVisible?: boolean }) => (
    <span data-testid="tiktok-cover-blobs" data-deferred={deferUntilVisible} />
  ),
}));

function project(slug: string, title: string): Project {
  return {
    slug,
    title,
    summary: `${title} summary`,
    role: "Product Designer",
    timeframe: "2026",
    status: "published",
    order: 1,
    tags: [],
    coverImage: `/projects/${slug}/cover.png`,
    sections: [],
    bodyHtml: "",
  };
}

const projects = [
  project("fresh-greens", "Fresh Greens"),
  project("navi", "Navi"),
  project("understandingfafsa", "UnderstandingFAFSA"),
  project("tiktok", "TikTok Dynamic Showcase Ads"),
];

describe("ProjectWorkJump", () => {
  it("renders one destination link and one work-index link", () => {
    render(<ProjectWorkJump currentSlug="fresh-greens" projects={projects} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/work/navi");
    expect(links[0]).toHaveTextContent("Next project");
    expect(links[0]).toHaveTextContent("Navi");
    expect(links[0]).toHaveTextContent(
      "I also explored routing through neighborhood discovery and local booking.",
    );
    expect(links[1]).toHaveAttribute("href", "/#work");
    expect(links[1]).toHaveTextContent("View all work");
  });

  it("treats destination media as decorative inside the descriptive link", () => {
    const { container } = render(
      <ProjectWorkJump currentSlug="fresh-greens" projects={projects} />,
    );

    expect(
      container.querySelector(".project-work-jump-media img"),
    ).toHaveAttribute("alt", "");
  });

  it("uses the deferred TikTok mark for the TikTok destination", () => {
    render(
      <ProjectWorkJump currentSlug="understandingfafsa" projects={projects} />,
    );

    expect(screen.getByTestId("tiktok-cover-blobs")).toHaveAttribute(
      "data-deferred",
      "true",
    );
    expect(screen.queryByRole("img", { hidden: true })).toBeNull();
  });

  it("retains the media surface when a published image is missing", () => {
    const withoutCover = projects.map((item) =>
      item.slug === "navi" ? { ...item, coverImage: undefined } : item,
    );
    const { container } = render(
      <ProjectWorkJump currentSlug="fresh-greens" projects={withoutCover} />,
    );

    expect(container.querySelector(".project-work-jump-media")).not.toBeNull();
  });

  it.each([
    ["unknown", projects],
    [
      "fresh-greens",
      projects.map((item) =>
        item.slug === "navi" ? { ...item, status: "draft" as const } : item,
      ),
    ],
  ])("keeps View all work when no destination resolves", (slug, items) => {
    render(<ProjectWorkJump currentSlug={slug} projects={items} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /View all work/ })).toHaveAttribute(
      "href",
      "/#work",
    );
    expect(screen.queryByText("Next project")).toBeNull();
  });
});
```

- [ ] **Step 2: Run the component test to verify it fails**

```bash
npx vitest run src/components/__tests__/project-work-jump.test.tsx
```

Expected: FAIL because the current component renders every other project and has no curated resolver.

- [ ] **Step 3: Replace the component implementation**

Replace `src/components/project-work-jump.tsx` with:

```tsx
import Image from "next/image";
import { TikTokCoverBlobs } from "@/components/tiktok-dsa";
import { TransitionLink } from "@/components/transition-link";
import type { Project } from "@/lib/content";
import { resolveNextProject } from "@/lib/project-sequence";

type ProjectWorkJumpProps = {
  currentSlug: string;
  projects: readonly Project[];
};

export function ProjectWorkJump({ currentSlug, projects }: ProjectWorkJumpProps) {
  const next = resolveNextProject(currentSlug, projects);

  return (
    <section
      className="project-work-jump"
      aria-labelledby="project-work-jump-heading"
    >
      {next ? (
        <TransitionLink
          className="project-work-jump-card"
          href={`/work/${next.project.slug}`}
          data-next-project={next.project.slug}
        >
          <span className="project-work-jump-text">
            <span className="project-work-jump-label">Next project</span>
            <h2 id="project-work-jump-heading" className="project-work-jump-title">
              {next.project.title}
            </h2>
            <span className="project-work-jump-bridge">{next.bridge}</span>
            <span className="project-work-jump-cta">
              Read case study <span aria-hidden="true">→</span>
            </span>
          </span>
          <span className="project-work-jump-media" aria-hidden="true">
            {next.project.slug === "tiktok" ? (
              <span className="project-work-jump-tiktok tt-cover--preview">
                <TikTokCoverBlobs deferUntilVisible />
              </span>
            ) : next.project.coverImage ? (
              <Image
                src={next.project.coverImage}
                alt=""
                width={1400}
                height={933}
                sizes="(max-width: 760px) 100vw, 52vw"
              />
            ) : null}
          </span>
        </TransitionLink>
      ) : (
        <h2 id="project-work-jump-heading" className="sr-only">
          More portfolio work
        </h2>
      )}
      <TransitionLink className="project-work-jump-view-all" href="/#work">
        View all work <span aria-hidden="true">→</span>
      </TransitionLink>
    </section>
  );
}
```

- [ ] **Step 4: Run the component tests to verify they pass**

```bash
npx vitest run src/lib/__tests__/project-sequence.test.ts src/components/__tests__/project-work-jump.test.tsx
```

Expected: 2 files and all tests pass.

- [ ] **Step 5: Commit the semantic endcap**

```bash
git add src/components/project-work-jump.tsx src/components/__tests__/project-work-jump.test.tsx
git commit -m "feat: curate each case study endcap"
```

### Task 3: Replace the grid styling and preserve visible-first motion

**Files:**
- Create: `src/components/__tests__/project-work-jump-layout.test.ts`
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/components/scroll-reveal-fallback.tsx`
- Modify: `src/app/__tests__/visible-first-motion.test.ts`

**Interfaces:**
- Consumes: the class contract from Task 2
- Produces: one-column mobile and two-column desktop card geometry
- Produces: destination-scoped media surfaces using `[data-next-project]`

- [ ] **Step 1: Write the failing layout contract**

Create `src/components/__tests__/project-work-jump-layout.test.ts`. Read `base.css`, `portfolio-surfaces.css`, and `late-polish.css` with the balanced-brace helper already used in `work-project-card-layout.test.tsx`. Assert:

```ts
expect(block(".project-work-jump-card", baseStyles)).toContain("display: grid");
expect(block(".project-work-jump-card", baseStyles)).toContain("min-height: 44px");
expect(block(".project-work-jump-view-all", baseStyles)).toContain("min-height: 44px");
expect(block('.project-work-jump-card[data-next-project="fresh-greens"] .project-work-jump-media', baseStyles)).toContain("background:");
expect(block('.project-work-jump-card[data-next-project="navi"] .project-work-jump-media', baseStyles)).toContain("background:");
expect(block('.project-work-jump-card[data-next-project="understandingfafsa"] .project-work-jump-media', baseStyles)).toContain("background:");
expect(block('.project-work-jump-card[data-next-project="tiktok"] .project-work-jump-media', baseStyles)).toContain("background:");
expect(baseStyles).toMatch(/\.project-work-jump-card:hover[\s\S]*?\.project-work-jump-card:focus-visible/);
expect(baseStyles).toMatch(/prefers-reduced-motion: reduce[\s\S]*?\.project-work-jump-card[\s\S]*?transform: none/);
expect(surfaceStyles).toMatch(/\.project-work-jump-card[\s\S]*?animation-timeline: view\(\)/);
expect(fallbackStyles).not.toMatch(/\.project-work-jump-list|\.project-work-jump > h2/);
```

Also update `src/app/__tests__/visible-first-motion.test.ts` so its structural selector list contains `.project-work-jump-card` and `.project-work-jump-view-all`, and no longer contains the old heading or list selectors.

- [ ] **Step 2: Run the layout tests to verify they fail**

```bash
npx vitest run src/components/__tests__/project-work-jump-layout.test.ts src/app/__tests__/visible-first-motion.test.ts
```

Expected: FAIL because the old list-based CSS is still present.

- [ ] **Step 3: Replace the base endcap styles**

In `src/app/styles/base.css`, remove `.project-work-jump-list`, `.project-work-jump-thumb`, `.project-work-jump-draft`, and the old list-item stagger rules. Replace the endcap block with a mobile-first grid card:

```css
.project-work-jump {
  margin-top: clamp(4rem, 9vw, 7rem);
  padding-top: clamp(2rem, 5vw, 3.5rem);
  padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));
  border-top: 1px solid var(--line);
}

.project-work-jump-card {
  display: grid;
  min-height: 44px;
  gap: 1.4rem;
  color: inherit;
  text-decoration: none;
}

.project-work-jump-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
}

.project-work-jump-label {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.4;
}

.project-work-jump-title {
  margin-top: 0.45rem;
  max-width: 16ch;
  font-size: clamp(2rem, 5vw, 4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: var(--track-display);
  text-wrap: balance;
  overflow-wrap: anywhere;
}

.project-work-jump-bridge {
  margin-top: 0.9rem;
  max-width: 46ch;
  color: var(--muted);
  font-size: 1rem;
  line-height: var(--lead-body);
  text-wrap: pretty;
}

.project-work-jump-cta,
.project-work-jump-view-all {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}

.project-work-jump-cta {
  margin-top: 0.9rem;
  font-weight: 500;
}

.project-work-jump-media {
  display: block;
  position: relative;
  min-height: 12rem;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--rounded-md);
  background: var(--surface);
}

.project-work-jump-media > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-work-jump-tiktok {
  display: block;
  position: absolute;
  inset: 0;
  background: #08080d;
}

.project-work-jump-card[data-next-project="fresh-greens"] .project-work-jump-media {
  background: #103c2b;
}

.project-work-jump-card[data-next-project="navi"] .project-work-jump-media {
  background: #281208;
}

.project-work-jump-card[data-next-project="understandingfafsa"] .project-work-jump-media {
  background: #4d2b86;
}

.project-work-jump-card[data-next-project="tiktok"] .project-work-jump-media {
  background: #08080d;
}

.project-work-jump-card:hover .project-work-jump-media,
.project-work-jump-card:focus-visible .project-work-jump-media {
  border-color: var(--foreground);
}

.project-work-jump-card:hover .project-work-jump-media > img,
.project-work-jump-card:focus-visible .project-work-jump-media > img {
  transform: scale(1.015);
}

.project-work-jump-card:focus-visible,
.project-work-jump-view-all:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 4px;
}

.project-work-jump-view-all {
  margin-top: 1rem;
  color: var(--muted);
}

@media (min-width: 760px) {
  .project-work-jump-card {
    grid-template-columns: minmax(15rem, 0.8fr) minmax(22rem, 1.2fr);
    align-items: center;
    gap: clamp(2rem, 5vw, 5rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .project-work-jump-card,
  .project-work-jump-media,
  .project-work-jump-media > img {
    animation: none !important;
    transition: none !important;
    transform: none !important;
  }
}
```

Keep the approved centered crop unless fresh screenshots show that a meaningful subject is clipped. Measure the subject bounds before adding a destination-specific `object-position` override.

- [ ] **Step 4: Retarget motion and remove the pre-hidden fallback**

In `src/app/styles/portfolio-surfaces.css`, replace the old work-jump view-timeline selectors with `.project-work-jump-card` and `.project-work-jump-view-all`, both using `od-card-rise` and `animation-range: entry 0% cover 30%`.

In `src/app/styles/late-polish.css`, remove `.project-work-jump > h2` and `.project-work-jump-list > li` from both pre-hidden and `.sr-revealed` selector groups. In `src/components/scroll-reveal-fallback.tsx`, remove the same selectors and do not add replacements. Browsers without scroll-linked animation receive the complete static endcap.

Update the reduced-motion selector lists in `base.css` to use the new card, media, and view-all classes.

- [ ] **Step 5: Run the focused endcap gate**

```bash
npx vitest run src/lib/__tests__/project-sequence.test.ts src/components/__tests__/project-work-jump.test.tsx src/components/__tests__/project-work-jump-layout.test.ts src/app/__tests__/visible-first-motion.test.ts src/components/__tests__/work-project-card-layout.test.tsx
```

Expected: all focused files pass. The homepage TikTok cover contract remains unchanged.

- [ ] **Step 6: Commit the editorial endcap layout**

```bash
git add src/app/styles/base.css src/app/styles/portfolio-surfaces.css src/app/styles/late-polish.css src/components/scroll-reveal-fallback.tsx src/app/__tests__/visible-first-motion.test.ts src/components/__tests__/project-work-jump-layout.test.ts
git commit -m "style: turn project jumps into editorial endcaps"
```

### Task 4: Verify all four destination states

**Files:**
- Verify only. No expected source edits.

**Interfaces:**
- Consumes: Tasks 1 through 3
- Produces: automated and responsive evidence for all four transitions

- [ ] **Step 1: Run the complete automated gates sequentially**

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run validate:content
git diff --check
```

Expected: every command exits 0. Run sequentially because Vitest and ESLint can touch shared temporary files.

- [ ] **Step 2: Capture fresh endcap evidence**

At `1440 × 900` and `390 × 844`, capture the final chapter plus endcap for:

- Fresh Greens leading to Navi.
- Navi leading to UnderstandingFAFSA.
- UnderstandingFAFSA leading to TikTok.
- TikTok leading to Fresh Greens.

Check light and dark themes, keyboard focus on both links, mobile safe-area clearance, TikTok deferred motion, and reduced-motion behavior. Verify the destination surface does not inherit the current project's accent.

- [ ] **Step 3: Run the final Impeccable personality review**

Review the homepage, About, all four case studies, and the new endcaps for earned personality moments. Return additional opportunities as P2 or P3 recommendations with the exact surface, interaction, and reason. Do not implement a suggestion merely because it is decorative. Favor interactions that reveal process, reward inspection, or extend an existing project motif.

- [ ] **Step 4: Commit only if visual verification required a correction**

If a correction was required, rerun the focused endcap gate and commit only the correction:

```bash
git commit -m "fix: refine curated project endcaps"
```

If no correction was required, keep the verified worktree clean and do not create an empty commit.
