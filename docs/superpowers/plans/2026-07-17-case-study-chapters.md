# Case Study Chapters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each case study a five-to-six-stage product-design process map while preserving the existing artifact sections as nested evidence.

**Architecture:** Store every approved chapter entry in one typed source, render chapter boundaries through one semantic shared component, and make `ProjectToc` chapter-aware without changing its active-reading mechanics. Each page consumes its typed map, absorbs single-section headings into the chapter H2, and moves independently named evidence headings to H3.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library

## Global Constraints

- Each published case study uses five chapters by default and no more than six.
- Fresh Greens has six process chapters. Navi, TikTok, and UnderstandingFAFSA each have five.
- Every chapter displays an explicit process stage and a project-specific title.
- Existing artifact sections remain visible as nested evidence with correct heading hierarchy.
- `ProjectToc` tracks chapters rather than every evidence section.
- The active chapter remains active until the following chapter begins.
- The reading-progress calculation still ends at the case study's final evidence section.
- Keyboard navigation, focus management, live-region updates, and 44-pixel targets remain unchanged.
- Motion may translate, draw, or offset the motif, but it may not gate text or evidence.
- Reduced-motion users receive the completed motif with no transition.
- No em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or aphoristic closers.
- All behavior changes begin with a failing regression test.

---

## File structure

- Create `src/lib/project-chapters.ts`: the single approved source for stage, title, ID, project variant, and chapter count.
- Create `src/lib/__tests__/project-chapters.test.ts`: validates exact maps, unique IDs, and the six-chapter ceiling.
- Create `src/components/project-chapter.tsx`: renders semantic chapter hierarchy and shared motif hooks.
- Create `src/components/__tests__/project-chapter.test.tsx`: covers semantics, stage, count, content visibility, and decorative accessibility.
- Modify `src/components/project-toc.tsx`: accepts chapter entries, renders stage plus title, and announces the complete active chapter.
- Modify `src/components/__tests__/project-toc.test.tsx` and `project-toc-layout.test.ts`: preserve interaction and responsive contracts.
- Preserve the generic Markdown route by keeping `ProjectToc`'s existing `sections` prop and allowing entries without a stage.
- Modify the four explicit case-study pages: groups their current sections beneath typed chapters.
- Modify project-specific structure tests: locks exact grouping and evidence retention.
- Modify `src/app/styles/base.css`: shared chapter hierarchy, evidence headings, TOC stage labels, and responsive rhythm.
- Modify `src/app/styles/late-polish.css`: visible-first motif animation, project motifs, palette remapping, and print/reduced-motion behavior.
- Modify `src/app/styles/portfolio-surfaces.css`: retargets project-specific H2 selectors and TikTok spacing where the hierarchy changes.
- Modify portfolio-wide structure and motion tests to understand chapter H2s and evidence H3s.

### Task 1: Create the typed chapter source and semantic chapter component

**Files:**
- Create: `src/lib/project-chapters.ts`
- Create: `src/lib/__tests__/project-chapters.test.ts`
- Create: `src/components/project-chapter.tsx`
- Create: `src/components/__tests__/project-chapter.test.tsx`
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Produces: `ProjectChapterEntry = { readonly id: string; readonly stage: string; readonly title: string }`
- Produces: `ProjectChapterVariant = "fresh-greens" | "navi" | "tiktok" | "understandingfafsa"`
- Produces: `CASE_STUDY_CHAPTERS`
- Produces: `ProjectChapter({ entry, index, total, variant, children })`

- [ ] **Step 1: Write the failing chapter-map tests**

Create `src/lib/__tests__/project-chapters.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

describe("case-study chapter maps", () => {
  it("uses the approved chapter counts", () => {
    expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toHaveLength(6);
    expect(CASE_STUDY_CHAPTERS.navi).toHaveLength(5);
    expect(CASE_STUDY_CHAPTERS.tiktok).toHaveLength(5);
    expect(CASE_STUDY_CHAPTERS.understandingfafsa).toHaveLength(5);
  });

  it("never exceeds six chapters and keeps IDs unique within each story", () => {
    for (const chapters of Object.values(CASE_STUDY_CHAPTERS)) {
      expect(chapters.length).toBeLessThanOrEqual(6);
      expect(new Set(chapters.map((chapter) => chapter.id)).size).toBe(
        chapters.length,
      );
    }
  });

  it("uses the approved process language and order", () => {
    expect(CASE_STUDY_CHAPTERS).toEqual({
      "fresh-greens": [
        { id: "fg-problem", stage: "Frame", title: "Why time and distance were not enough" },
        { id: "fg-research", stage: "Research", title: "What interviews with Black drivers changed" },
        { id: "fg-design", stage: "Design", title: "Safer route decisions" },
        { id: "fg-refine", stage: "Refine", title: "From routing pivot to visual language" },
        { id: "fg-trust", stage: "Trust", title: "Moderating community reports" },
        { id: "fg-scope", stage: "Validate", title: "What I built and what still needs proof" },
      ],
      navi: [
        { id: "nv-intro", stage: "Frame", title: "Concentrated tourism as a routing problem" },
        { id: "nv-insights", stage: "Research", title: "The resident survey redirected the concept" },
        { id: "nv-framework", stage: "Define", title: "Mapping the experience" },
        { id: "nv-build", stage: "Build", title: "From prototype to booking flow" },
        { id: "nv-outcome", stage: "Validate", title: "What I would test next" },
      ],
      tiktok: [
        { id: "tt-research", stage: "Research", title: "Fashion subcultures on TikTok" },
        { id: "tt-system", stage: "Define", title: "The fixed catalog structure" },
        { id: "tt-modular", stage: "Explore", title: "Templates as modular parts" },
        { id: "tt-templates", stage: "Build", title: "From sketches to layered files" },
        { id: "tt-outcome", stage: "Deliver", title: "What shipped from the launch batch" },
      ],
      understandingfafsa: [
        { id: "uf-context", stage: "Frame", title: "A rebrand and a weekly workflow" },
        { id: "uf-audit", stage: "Research", title: "What 120 newsletters revealed" },
        { id: "uf-locked", stage: "Define", title: "Rules for fixed and swappable parts" },
        { id: "uf-figma", stage: "Build", title: "Rebuilding the system in Mailchimp" },
        { id: "uf-results", stage: "Measure", title: "The first redesigned send" },
      ],
    });
  });

  it("keeps chapter language free of banned punctuation", () => {
    for (const chapters of Object.values(CASE_STUDY_CHAPTERS)) {
      for (const chapter of chapters) {
        expect(`${chapter.stage} ${chapter.title}`).not.toMatch(/[—;…]/);
      }
    }
  });
});
```

- [ ] **Step 2: Write the failing chapter-component tests**

Create `src/components/__tests__/project-chapter.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectChapter } from "@/components/project-chapter";

const entry = {
  id: "nv-framework",
  stage: "Define",
  title: "Mapping the experience",
};

describe("ProjectChapter", () => {
  it("renders a named semantic region with the chapter hierarchy", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <p>Journey map evidence</p>
      </ProjectChapter>,
    );

    expect(
      screen.getByRole("region", { name: "Mapping the experience" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: entry.title }),
    ).toHaveAttribute("id", entry.id);
    expect(screen.getByText("Define")).toBeInTheDocument();
    expect(screen.getByText("3 of 5")).toBeInTheDocument();
    expect(screen.getByText("Journey map evidence")).toBeVisible();
    expect(container.querySelector(".project-chapter-motif")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector(".project-chapter")).toHaveAttribute(
      "data-chapter-variant",
      "navi",
    );
  });
});
```

- [ ] **Step 3: Run the focused tests to verify they fail**

```bash
npx vitest run src/lib/__tests__/project-chapters.test.ts src/components/__tests__/project-chapter.test.tsx
```

Expected: FAIL because the map and component do not exist.

- [ ] **Step 4: Add the typed chapter map**

Create `src/lib/project-chapters.ts` using the exact object asserted in Step 1:

```ts
export type ProjectChapterEntry = {
  readonly id: string;
  readonly stage: string;
  readonly title: string;
};

export type ProjectChapterVariant =
  | "fresh-greens"
  | "navi"
  | "tiktok"
  | "understandingfafsa";

export const CASE_STUDY_CHAPTERS = {
  "fresh-greens": [
    { id: "fg-problem", stage: "Frame", title: "Why time and distance were not enough" },
    { id: "fg-research", stage: "Research", title: "What interviews with Black drivers changed" },
    { id: "fg-design", stage: "Design", title: "Safer route decisions" },
    { id: "fg-refine", stage: "Refine", title: "From routing pivot to visual language" },
    { id: "fg-trust", stage: "Trust", title: "Moderating community reports" },
    { id: "fg-scope", stage: "Validate", title: "What I built and what still needs proof" },
  ],
  navi: [
    { id: "nv-intro", stage: "Frame", title: "Concentrated tourism as a routing problem" },
    { id: "nv-insights", stage: "Research", title: "The resident survey redirected the concept" },
    { id: "nv-framework", stage: "Define", title: "Mapping the experience" },
    { id: "nv-build", stage: "Build", title: "From prototype to booking flow" },
    { id: "nv-outcome", stage: "Validate", title: "What I would test next" },
  ],
  tiktok: [
    { id: "tt-research", stage: "Research", title: "Fashion subcultures on TikTok" },
    { id: "tt-system", stage: "Define", title: "The fixed catalog structure" },
    { id: "tt-modular", stage: "Explore", title: "Templates as modular parts" },
    { id: "tt-templates", stage: "Build", title: "From sketches to layered files" },
    { id: "tt-outcome", stage: "Deliver", title: "What shipped from the launch batch" },
  ],
  understandingfafsa: [
    { id: "uf-context", stage: "Frame", title: "A rebrand and a weekly workflow" },
    { id: "uf-audit", stage: "Research", title: "What 120 newsletters revealed" },
    { id: "uf-locked", stage: "Define", title: "Rules for fixed and swappable parts" },
    { id: "uf-figma", stage: "Build", title: "Rebuilding the system in Mailchimp" },
    { id: "uf-results", stage: "Measure", title: "The first redesigned send" },
  ],
} as const satisfies Record<
  ProjectChapterVariant,
  readonly ProjectChapterEntry[]
>;
```

- [ ] **Step 5: Add the semantic chapter component**

Create `src/components/project-chapter.tsx`:

```tsx
import type { ReactNode } from "react";
import type {
  ProjectChapterEntry,
  ProjectChapterVariant,
} from "@/lib/project-chapters";

type ProjectChapterProps = {
  entry: ProjectChapterEntry;
  index: number;
  total: number;
  variant: ProjectChapterVariant;
  children: ReactNode;
};

export function ProjectChapter({
  entry,
  index,
  total,
  variant,
  children,
}: ProjectChapterProps) {
  return (
    <section
      className="project-chapter"
      aria-labelledby={entry.id}
      data-chapter-index={index}
      data-chapter-variant={variant}
    >
      <p className="project-chapter-meta">
        <span className="project-chapter-stage">{entry.stage}</span>
        <span className="project-chapter-count">
          {index} of {total}
        </span>
      </p>
      <h2 id={entry.id} className="project-chapter-title">
        {entry.title}
      </h2>
      <span className="project-chapter-motif" aria-hidden="true">
        <span className="project-chapter-motif-line" />
        <span className="project-chapter-motif-point project-chapter-motif-point--start" />
        <span className="project-chapter-motif-point project-chapter-motif-point--end" />
      </span>
      {children}
    </section>
  );
}
```

- [ ] **Step 6: Add the visible-first shared hierarchy and motif CSS**

In `src/app/styles/base.css`, add:

```css
.project-chapter {
  --chapter-motif-accent: var(--toc-accent, var(--foreground));
  margin-top: clamp(4.5rem, 9vw, 7rem);
  position: relative;
}

.project-chapter[data-chapter-index="1"] {
  margin-top: 2.5rem;
}

.project-chapter-meta {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 65ch;
  margin: 0 0 0.7rem;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.4;
}

.project-chapter-stage {
  color: var(--foreground);
  font-weight: 500;
}

.project-chapter-count {
  font-variant-numeric: tabular-nums;
}

.project-chapter-title,
.project-evidence-heading {
  position: relative;
  text-wrap: balance;
}

.project-chapter-title {
  max-width: 22ch;
  margin: 0;
  padding-top: 0.85rem;
  font-size: clamp(1.9rem, 3.8vw, 3.2rem);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: var(--track-display);
}

.project-chapter-title::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 2.5rem;
  height: 1px;
  background: var(--rule);
}

.project-evidence-heading {
  margin: 0 0 1rem;
  padding-top: 0.75rem;
  font-size: clamp(1.35rem, 2.4vw, 1.8rem);
  font-weight: 500;
  line-height: 1.18;
  letter-spacing: var(--track-title);
}

.project-evidence-heading::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 1.75rem;
  height: 1px;
  background: var(--rule);
}

.project-chapter > .project-section,
.project-chapter > .project-section + .project-section {
  margin-top: 2.4rem;
}

.project-chapter-motif {
  display: block;
  position: relative;
  width: min(12rem, 44vw);
  height: 1.2rem;
  margin-top: 1.2rem;
}

.project-chapter-motif-line {
  position: absolute;
  left: 0.35rem;
  right: 0.35rem;
  top: 50%;
  height: 1px;
  background: var(--line);
}

.project-chapter-motif-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--chapter-motif-accent);
  transform-origin: left center;
}

.project-chapter-motif-point {
  position: absolute;
  top: 50%;
  width: 0.7rem;
  height: 0.7rem;
  border: 1px solid var(--chapter-motif-accent);
  border-radius: 50%;
  background: var(--background);
  transform: translateY(-50%);
}

.project-chapter-motif-point--start { left: 0; }
.project-chapter-motif-point--end { right: 0; }
```

In `src/app/styles/late-polish.css`, add an accent-overlay animation that begins with the neutral line still visible:

```css
@keyframes projectChapterTrace {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .project-chapter-motif-line::after {
      animation: projectChapterTrace linear both;
      animation-timeline: view();
      animation-range: entry 8% cover 34%;
    }
  }
}

@media (prefers-reduced-motion: reduce), print {
  .project-chapter,
  .project-chapter-title,
  .project-evidence-heading,
  .project-chapter-motif-line::after {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

- [ ] **Step 7: Run the chapter unit tests**

```bash
npx vitest run src/lib/__tests__/project-chapters.test.ts src/components/__tests__/project-chapter.test.tsx
```

Expected: 2 files and 5 tests pass.

- [ ] **Step 8: Commit the shared chapter unit**

```bash
git add src/lib/project-chapters.ts src/lib/__tests__/project-chapters.test.ts src/components/project-chapter.tsx src/components/__tests__/project-chapter.test.tsx src/app/styles/base.css src/app/styles/late-polish.css
git commit -m "feat: add semantic case study chapters"
```

### Task 2: Make the reading instrument chapter-aware

**Files:**
- Modify: `src/components/project-toc.tsx`
- Modify: `src/components/__tests__/project-toc.test.tsx`
- Modify: `src/components/__tests__/project-toc-layout.test.ts`
- Modify: `src/app/styles/base.css`

**Interfaces:**
- Consumes: `ProjectChapterEntry` from Task 1
- Produces: `ProjectToc({ sections, readingEndId })` with chapter-aware entries
- Preserves: a legacy entry without `stage` for the generic Markdown project route

- [ ] **Step 1: Update the ProjectToc tests so they fail against the flat API**

Keep the `sections` prop in the component tests and add chapter-aware entries shaped like:

```tsx
const chapters = [
  { id: "frame", stage: "Frame", title: "The routing problem" },
  { id: "research", stage: "Research", title: "What drivers changed" },
  { id: "design", stage: "Design", title: "Safer route decisions" },
  { id: "refine", stage: "Refine", title: "The interaction language" },
  { id: "trust", stage: "Trust", title: "Community reports" },
  { id: "validate", stage: "Validate", title: "What still needs proof" },
];
```

Add assertions that:

```tsx
expect(screen.getByRole("navigation", { name: "Case study chapters" })).toBeInTheDocument();
expect(screen.getByRole("button", { name: "Research: What drivers changed" })).toBeInTheDocument();
expect(screen.getByRole("status")).toHaveTextContent(
  "Now reading: Research: What drivers changed",
);
```

Keep the existing six-item arrow, Home, End, Escape, focus restoration, reading-end, and back-to-top tests. In `project-toc-layout.test.ts`, require `.project-toc-stage` and `.project-toc-title` to sit inside the existing ellipsis boundary without reducing the 44-pixel target.

- [ ] **Step 2: Run the TOC tests to verify they fail**

```bash
npx vitest run src/components/__tests__/project-toc.test.tsx src/components/__tests__/project-toc-layout.test.ts
```

Expected: FAIL because the component still accepts `sections` and has no stage rendering.

- [ ] **Step 3: Change the ProjectToc API and labels**

In `src/components/project-toc.tsx`, import `ProjectChapterEntry` and define:

```ts
type ProjectTocItem = Pick<ProjectChapterEntry, "id" | "title"> & {
  stage?: string;
};

type ProjectTocProps = {
  sections: readonly ProjectTocItem[];
  readingEndId?: string;
};

function completeChapterTitle(chapter: ProjectTocItem) {
  return chapter.stage
    ? `${chapter.stage}: ${chapter.title}`
    : chapter.title;
}
```

Keep the internal `sections` variable and do not change observer thresholds, progress math, keyboard behavior, or reading-end measurement. Set:

```tsx
const activeChapter =
  sections[activeIndex >= 0 ? activeIndex : 0];
const activeTitle = activeChapter
  ? completeChapterTitle(activeChapter)
  : "";
```

Change the navigation label to `Case study chapters`, the help text to `Arrow keys move between chapters. Home and End jump to the ends.`, and the live string to `Now reading: ${activeTitle}`.

Render each visible label as:

```tsx
<span className="project-toc-text">
  {chapter.stage ? (
    <>
      <span className="project-toc-stage">{chapter.stage}</span>
      <span className="project-toc-separator" aria-hidden="true"> · </span>
    </>
  ) : null}
  <span className="project-toc-title">{chapter.title}</span>
</span>
```

Give each TOC button `aria-label={completeChapterTitle(chapter)}`. Use the same stage, separator, and title structure inside the mobile active label.

- [ ] **Step 4: Preserve entries without a stage**

Keep `stage` optional in `ProjectTocItem`. Add a component test that passes `{ title: "Overview", id: "overview" }` and expects the accessible button name to remain `Overview`. Do not change `src/app/work/[slug]/page.tsx` or invent a process stage for unknown future Markdown projects.

- [ ] **Step 5: Add stage-title layout rules**

In `src/app/styles/base.css`, preserve `.project-toc-text` as the overflow boundary and add:

```css
.project-toc-stage {
  color: var(--foreground);
  font-weight: 600;
}

.project-toc-separator {
  color: var(--muted);
}

.project-toc-title {
  color: inherit;
}
```

At mobile widths, keep the stage from shrinking and allow only the title to ellipsize. At `1440px` and wider, keep the full label inside the existing flyout rather than widening the fixed dot column.

- [ ] **Step 6: Run the focused TOC tests**

```bash
npx vitest run src/components/__tests__/project-toc.test.tsx src/components/__tests__/project-toc-layout.test.ts
```

Expected: both files pass with the existing interaction count unchanged.

- [ ] **Step 7: Commit the chapter-aware reading instrument**

```bash
git add src/components/project-toc.tsx src/components/__tests__/project-toc.test.tsx src/components/__tests__/project-toc-layout.test.ts src/app/styles/base.css
git commit -m "feat: navigate case studies by process chapter"
```

### Task 3: Migrate Fresh Greens into six chapters

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts`
- Modify: `src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts`
- Modify: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `CASE_STUDY_CHAPTERS["fresh-greens"]`
- Consumes: `ProjectChapter`
- Produces: six H2 chapters and five retained H3 evidence headings

- [ ] **Step 1: Rewrite the Fresh Greens structure tests first**

Assert the six exact chapter entries from the typed map, `readingEndId="fg-scope"`, and this evidence grouping:

```ts
{
  "fg-design": ["fg-scoring", "fg-pulled-over"],
  "fg-refine": ["fg-pivot", "fg-typecolor", "fg-color"],
}
```

Assert `Research` remains tied to Black drivers, the safety-interaction component remains present, `CommunityReportStack` remains present, and the final proof qualifier remains unchanged.

Update the daylight-arc expectations to six segments:

```ts
[
  { stage: 1, color: "#F09456" },
  { stage: 2, color: "#F09456" },
  { stage: 3, color: "#FDD350" },
  { stage: 4, color: "#C74757" },
  { stage: 5, color: "var(--fg-toc-night)" },
  { stage: 6, color: "var(--fg-toc-night)" },
]
```

- [ ] **Step 2: Run the Fresh Greens tests to verify they fail**

```bash
npx vitest run src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/work/fresh-greens/__tests__/prose-structure.test.ts
```

Expected: FAIL against the current nine-item flat structure.

- [ ] **Step 3: Group the Fresh Greens page without changing evidence copy**

Import `ProjectChapter` and `CASE_STUDY_CHAPTERS`, then define:

```ts
const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];
```

Pass `<ProjectToc sections={chapters} readingEndId="fg-scope" />`.

Apply these exact transformations:

| Chapter | Body transformation |
|---|---|
| `chapters[0]`, `fg-problem` | Replace the outer semantic section with `ProjectChapter`. Move its existing body into `<div className="project-section fg-section">`. Remove the duplicate H2. |
| `chapters[1]`, `fg-research` | Absorb the interview H2 into the chapter. Keep the existing wide section classes on a body div. |
| `chapters[2]`, `fg-design` | Wrap the current `fg-scoring` and `fg-pulled-over` sections. Change both H2s to `<h3 className="project-evidence-heading">` and retain their IDs. |
| `chapters[3]`, `fg-refine` | Wrap `fg-pivot`, `fg-typecolor`, and `fg-color`. Change their H2s to evidence H3s and retain their IDs. |
| `chapters[4]`, `fg-trust` | Absorb the current trust H2 and move its body into a `project-section` div. |
| `chapters[5]`, `fg-scope` | Absorb the current final H2 and move its body into a `project-section` div. |

Each `ProjectChapter` receives `index={n + 1}`, `total={chapters.length}`, and `variant="fresh-greens"`.

- [ ] **Step 4: Remap the daylight styles and emotional-peak selector**

In `late-polish.css`, replace the nine Fresh Greens TOC segment declarations and gradient ranges with the six values from Step 1, using contiguous `16.667%` ranges. Change `.project-section > h2#fg-pulled-over` to `.project-evidence-heading#fg-pulled-over`.

Set matching chapter motif accents by `data-chapter-index` so Frame and Research use sunrise, Design uses daylight gold, Refine uses alert red, and Trust plus Validate use night blue.

- [ ] **Step 5: Run the Fresh Greens tests**

```bash
npx vitest run src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/work/fresh-greens/__tests__/prose-structure.test.ts
```

Expected: all focused tests pass with six chapters and every artifact retained.

- [ ] **Step 6: Commit the Fresh Greens migration**

```bash
git add src/app/work/fresh-greens/page.tsx src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/styles/late-polish.css
git commit -m "feat: group Fresh Greens into six chapters"
```

### Task 4: Migrate Navi into five chapters

**Files:**
- Modify: `src/app/work/navi/page.tsx`
- Modify: `src/app/work/navi/__tests__/toc-chronology.test.ts`
- Modify: `src/app/work/navi/__tests__/prose-structure.test.ts`
- Modify: `src/app/work/navi/__tests__/claim-accuracy.test.ts`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `CASE_STUDY_CHAPTERS.navi`
- Produces: five H2 chapters and four retained evidence H3s

- [ ] **Step 1: Update Navi's tests to the approved map**

Assert five chapters and this evidence grouping:

```ts
{
  "nv-intro": ["nv-heatmap"],
  "nv-insights": ["nv-research"],
  "nv-build": ["nv-system", "nv-screens"],
}
```

Keep assertions for all eight original evidence blocks, the resident-survey origin, the working rebuild, and the unvalidated planning qualifier.

- [ ] **Step 2: Run Navi's structure tests to verify they fail**

```bash
npx vitest run src/app/work/navi/__tests__/toc-chronology.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/claim-accuracy.test.ts
```

Expected: FAIL against the eight-item flat TOC.

- [ ] **Step 3: Apply the exact Navi grouping**

Define `const chapters = CASE_STUDY_CHAPTERS.navi` and pass `<ProjectToc sections={chapters} />`.

| Chapter | Body transformation |
|---|---|
| `nv-intro` | Absorb the premise heading. Keep its body in a project-section div. Nest the heatmap as a semantic evidence section with H3 `nv-heatmap`. |
| `nv-insights` | Nest platform audits and resident research as H3 `nv-research`. Absorb the resident-survey heading and keep its body directly in a project-section div. |
| `nv-framework` | Absorb the mapping heading and preserve every research artifact in its body div. |
| `nv-build` | Nest the system rebuild and booking flow as H3s `nv-system` and `nv-screens`. |
| `nv-outcome` | Absorb the final heading and keep the validation qualifier unchanged. |

Use `variant="navi"`. Remove no research artifacts. Add no user-validation claim.

- [ ] **Step 4: Add the Navi chapter motif treatment**

In `late-polish.css`, give Navi's shared motif an orange line, outlined waypoint stops, and a completed solid active path. Keep the underlying neutral line visible before the accent trace runs.

- [ ] **Step 5: Run Navi's tests and commit**

```bash
npx vitest run src/app/work/navi/__tests__/toc-chronology.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/claim-accuracy.test.ts
```

Expected: all focused tests pass.

```bash
git add src/app/work/navi/page.tsx src/app/work/navi/__tests__/toc-chronology.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/styles/late-polish.css
git commit -m "feat: group Navi into five chapters"
```

### Task 5: Migrate TikTok into five one-to-one chapters

**Files:**
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/work/tiktok/__tests__/short-form.test.tsx`
- Modify: `src/components/__tests__/tiktok-prune.test.ts`
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `CASE_STUDY_CHAPTERS.tiktok`
- Produces: five chapter H2s with existing artifact-card H3s unchanged

- [ ] **Step 1: Add failing one-to-one chapter assertions**

Assert the five typed chapters render in order, the old section H2s are absorbed rather than duplicated, all three template directions remain, the layered-file process remains, and the shipped claim remains limited to Light Academia. Assert the duplicate `aria-labelledby="tt-outcome"` attribute is removed while the section is migrated.

- [ ] **Step 2: Run TikTok's focused tests to verify they fail**

```bash
npx vitest run src/app/work/tiktok/__tests__/short-form.test.tsx src/components/__tests__/tiktok-prune.test.ts
```

Expected: FAIL because `ProjectChapter` is not yet used.

- [ ] **Step 3: Convert the five current sections directly**

Define `const chapters = CASE_STUDY_CHAPTERS.tiktok`, pass `<ProjectToc sections={chapters} />`, and replace each of the five semantic outer sections with one `ProjectChapter`. Move the current section classes to a body div and remove the duplicate H2. Keep the template-card H3s unchanged.

Use chapter titles from the typed map, including `The fixed catalog structure`. Do not change the body copy or add retrospective outcomes.

- [ ] **Step 4: Retarget TikTok spacing and split-trace CSS**

Update selectors that currently depend on `.tt-preview-process > h2` or `.tt-section h2` to target `.project-chapter-title` or `.project-evidence-heading`. Reset the old five-rem section top margin so `.project-chapter` owns the rhythm.

Render the motif's base line in cyan with a restrained magenta offset that returns close to the cyan path. The resolved shape must read as one trace, and reduced motion must show the aligned final state.

- [ ] **Step 5: Run TikTok's focused tests and commit**

```bash
npx vitest run src/app/work/tiktok/__tests__/short-form.test.tsx src/components/__tests__/tiktok-prune.test.ts
```

Expected: both files pass.

```bash
git add src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/short-form.test.tsx src/components/__tests__/tiktok-prune.test.ts src/app/styles/portfolio-surfaces.css src/app/styles/late-polish.css
git commit -m "feat: frame TikTok as five process chapters"
```

### Task 6: Migrate UnderstandingFAFSA into five chapters

**Files:**
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/app/work/understandingfafsa/__tests__/prose-structure.test.ts`
- Modify: `src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts`
- Modify: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`
- Modify: `src/app/styles/late-polish.css`

**Interfaces:**
- Consumes: `CASE_STUDY_CHAPTERS.understandingfafsa`
- Produces: five H2 chapters and three retained evidence H3s

- [ ] **Step 1: Update the FAFSA tests to the five-chapter contract**

Assert this grouping:

```ts
{
  "uf-context": ["uf-problem"],
  "uf-locked": ["uf-templates"],
}
```

Keep assertions for all seven original evidence blocks, the 120-send audit, Mailchimp constraint, modular system, and qualified first-send result.

Update artifact palette assertions to five segments in this order:

```ts
[
  "var(--uf-accent-warm)",
  "var(--uf-accent-highlight)",
  "var(--uf-accent-cool-text)",
  "var(--uf-accent-warm)",
  "var(--uf-accent-highlight)",
]
```

- [ ] **Step 2: Run the FAFSA tests to verify they fail**

```bash
npx vitest run src/app/work/understandingfafsa/__tests__/prose-structure.test.ts src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/__tests__/artifact-accessibility-styles.test.ts
```

Expected: FAIL against the seven-item flat structure and palette.

- [ ] **Step 3: Apply the exact FAFSA grouping**

Define `const chapters = CASE_STUDY_CHAPTERS.understandingfafsa` and pass `<ProjectToc sections={chapters} />`.

| Chapter | Body transformation |
|---|---|
| `uf-context` | Absorb the rebrand heading. Nest the old-template breakdown as H3 `uf-problem`. |
| `uf-audit` | Absorb the 120-newsletter audit heading and preserve the audit visual. |
| `uf-locked` | Nest the three-send-type section as H3 `uf-templates`. Absorb the fixed/swappable heading and preserve its interaction. |
| `uf-figma` | Absorb the Mailchimp build heading. |
| `uf-results` | Absorb the result heading and retain the observed-result qualification. |

Use `variant="understandingfafsa"` and do not change the metric copy.

- [ ] **Step 4: Remap the modular palette and motif**

Replace the seven TOC item colors and seven mobile gradient ranges with the five values from Step 1, using contiguous 20-percent ranges. Give the chapter motif square endpoints and a five-block visual rhythm using the same palette order. The accent overlay remains decorative and visible-first.

- [ ] **Step 5: Run the FAFSA tests and commit**

```bash
npx vitest run src/app/work/understandingfafsa/__tests__/prose-structure.test.ts src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/__tests__/artifact-accessibility-styles.test.ts
```

Expected: all focused tests pass.

```bash
git add src/app/work/understandingfafsa/page.tsx src/app/work/understandingfafsa/__tests__/prose-structure.test.ts src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/__tests__/artifact-accessibility-styles.test.ts src/app/styles/late-polish.css
git commit -m "feat: group UnderstandingFAFSA into five chapters"
```

### Task 7: Lock portfolio-wide chapter structure and motion

**Files:**
- Modify: `src/app/work/__tests__/case-study-tocs.test.ts`
- Modify: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`
- Modify: `src/app/__tests__/visible-first-motion.test.ts`
- Modify: `src/app/styles/base.css`
- Modify: `src/app/styles/late-polish.css`
- Modify: `src/app/styles/portfolio-surfaces.css`

**Interfaces:**
- Consumes: completed chapter maps, component, TOC, and four page migrations
- Produces: one cross-site structural and motion contract

- [ ] **Step 1: Replace the old flat H2 assumptions**

In `case-study-tocs.test.ts`, import `CASE_STUDY_CHAPTERS` and assert each explicit page passes the correct typed map to `ProjectToc`, every chapter ID appears exactly once, every approved evidence ID remains present, and no map exceeds six items. Remove the rule requiring every story-bearing H2 to equal a TOC item.

In `artifact-accessibility-styles.test.ts`, require `.project-chapter-title` and `.project-evidence-heading` to remain visible before motion runs. Require each motif to keep a neutral base line when its accent overlay is at the start of its animation.

In `visible-first-motion.test.ts`, add `.project-chapter`, `.project-chapter-title`, `.project-evidence-heading`, and `.project-chapter-motif` to the structural visibility checks. Do not allow `opacity: 0` on chapter text or children.

- [ ] **Step 2: Run the entire focused chapter gate**

```bash
npx vitest run src/lib/__tests__/project-chapters.test.ts src/components/__tests__/project-chapter.test.tsx src/components/__tests__/project-toc.test.tsx src/components/__tests__/project-toc-layout.test.ts src/app/work/__tests__/case-study-tocs.test.ts src/app/work/__tests__/artifact-accessibility-styles.test.ts src/app/__tests__/visible-first-motion.test.ts src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/toc-chronology.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/tiktok/__tests__/short-form.test.tsx src/components/__tests__/tiktok-prune.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts
```

Expected: every focused chapter and page contract passes.

- [ ] **Step 3: Run content-quality scans**

```bash
rg -n '[—…]' src/lib/project-chapters.ts src/components/project-chapter.tsx src/app/work/fresh-greens/page.tsx src/app/work/navi/page.tsx src/app/work/tiktok/page.tsx src/app/work/understandingfafsa/page.tsx
```

Expected: no new matches in changed candidate-facing strings. If an unchanged source string is reported, compare it with the pre-task baseline before editing it.

- [ ] **Step 4: Commit cross-site contract corrections**

```bash
git add src/app/work/__tests__/case-study-tocs.test.ts src/app/work/__tests__/artifact-accessibility-styles.test.ts src/app/__tests__/visible-first-motion.test.ts src/app/styles/base.css src/app/styles/late-polish.css src/app/styles/portfolio-surfaces.css
git commit -m "test: lock case study chapter hierarchy"
```

If these files were already committed in the project-specific tasks and no correction is needed, do not create an empty commit.

### Task 8: Verify chapter hierarchy in the browser and full repository

**Files:**
- Verify only. No expected source edits.

**Interfaces:**
- Consumes: Tasks 1 through 7
- Produces: fresh responsive evidence and full repository verification

- [ ] **Step 1: Run the full automated gates sequentially**

```bash
npm test
npm run lint
npx tsc --noEmit --incremental false
npm run validate:content
git diff --check
```

Expected: every command exits 0. Run sequentially because Vitest and ESLint can touch shared temporary files.

- [ ] **Step 2: Capture section-specific chapter evidence**

For each case study, capture fresh screenshots of:

- Hero plus first chapter at `1440 × 900`.
- One grouped middle chapter at `1440 × 900`.
- Active mobile chapter control at `390 × 844`.
- One mobile chapter transition at `390 × 844`.

Check both themes. Confirm Fresh Greens has six daylight stops, Navi has five route stops, TikTok's cyan and magenta traces stay aligned enough to read as one path, and UnderstandingFAFSA has five modular palette segments.

- [ ] **Step 3: Exercise keyboard, reduced motion, and long-label behavior**

Verify arrow, Home, End, Escape, mobile toggle focus return, and back-to-top behavior. Confirm the full accessible chapter label remains available when a visible title truncates. Capture one reduced-motion chapter marker and confirm its completed motif is visible with no text or evidence hidden.

- [ ] **Step 4: Commit only if verification required a corrective edit**

If a correction was necessary, rerun the focused chapter gate and commit only that correction:

```bash
git commit -m "fix: refine case study chapter hierarchy"
```

If no correction was required, keep the verified worktree clean and do not create an empty commit.
