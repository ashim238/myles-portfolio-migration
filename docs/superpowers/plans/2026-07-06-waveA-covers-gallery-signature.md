# Wave A — Covers → Gallery → Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home `Selected Work` alternating-row showcase with a visual-first gallery carrying the "working file" signature, and regenerate the three project covers as unified straight-on device frames.

**Architecture:** A mostly-static server component (`WorkGallery`) renders a featured card + a 2-up grid, each `WorkProjectCard` showing a 3:2 cover then a caption below (title, one outcome line, one mono meta line). The working-file signature (left spine, mono index system, hairline rules + measure notes) frames it. A tiny client component (`GalleryReveal`) arms a CSS `@keyframes` entrance cascade using the robust reveal pattern (content visible by default, safety-net timer, visibility guard, reduced-motion no-op). The existing click-to-enter FLIP transition is preserved. The stateful showcase machinery (cycling metric text, side rail, scroll parallax, active-index tracking) is deleted.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, Tailwind v4 + `globals.css`, Vitest, `next/image`, `sips` (macOS) for cover compositing.

**Specs:** [`docs/superpowers/specs/2026-07-06-home-work-gallery-design.md`](../specs/2026-07-06-home-work-gallery-design.md), [`docs/superpowers/specs/2026-07-06-cover-treatment-design.md`](../specs/2026-07-06-cover-treatment-design.md), [`docs/superpowers/specs/2026-07-06-working-file-signature-design.md`](../specs/2026-07-06-working-file-signature-design.md). Reference prototype (real CSS/JS to adapt): [`docs/superpowers/prototypes/working-file-signature.html`](../prototypes/working-file-signature.html).

---

## File Structure

- `src/lib/content.ts` — add `outcomeLead` / `outcomeRest` optional fields to `Project` + parser. **Modify.**
- `src/lib/__tests__/content-outcome.test.ts` — new test for the two fields. **Create.**
- `content/projects/fresh-greens.md`, `content/projects/understandingfafsa.md` — add outcome fields. **Modify.**
- `src/lib/work-gallery-data.ts` — pure helper deriving `{ leadText, restText }` and `{ metaText }` from a `Project`. **Create.**
- `src/lib/__tests__/work-gallery-data.test.ts` — test the derivation. **Create.**
- `src/components/work-gallery.tsx` — new server component (featured + grid + signature frame). **Create.** (Replaces `work-showcase.tsx`.)
- `src/components/work-project-card.tsx` — rewrite to caption-below + outcome/meta, keep `handleProjectEnter`. **Modify.**
- `src/components/gallery-reveal.tsx` — tiny client component arming the entrance cascade. **Create.**
- `src/app/page.tsx` — render `WorkGallery` instead of `WorkShowcase`. **Modify.**
- `src/app/globals.css` — remove `.work-showcase-*` / rail / metric / parallax blocks (~1121–1600); add `.work-gallery-*` + signature + keyframes. **Modify.**
- **Delete:** `src/components/work-showcase.tsx`, `src/components/work-showcase-metric.tsx`, `src/components/work-showcase-rail.tsx`, `src/lib/work-showcase-metrics.ts`, `src/lib/work-showcase-parallax.ts`.
- `public/projects/{fresh-greens,navi,understandingfafsa}/cover.png` — regenerate. **Replace.**

---

## Task 1: Add outcome fields to the content model

**Files:**
- Modify: `src/lib/content.ts` (type block ~52–68, parse block ~159–177)
- Test: `src/lib/__tests__/content-outcome.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/content-outcome.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("outcome frontmatter fields", () => {
  it("parses optional outcomeLead / outcomeRest when present", async () => {
    const projects = await getPublishedProjects();
    const fafsa = projects.find((p) => p.slug === "understandingfafsa");
    expect(fafsa).toBeDefined();
    expect(fafsa!.outcomeLead).toBe("75% lift");
    expect(fafsa!.outcomeRest).toBe(
      "in open rate after a modular newsletter rebuild.",
    );
  });

  it("leaves the fields undefined when absent", async () => {
    const projects = await getPublishedProjects();
    const navi = projects.find((p) => p.slug === "navi");
    expect(navi!.outcomeLead).toBeUndefined();
    expect(navi!.outcomeRest).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run src/lib/__tests__/content-outcome.test.ts`
Expected: FAIL — `outcomeLead` is `undefined` (field not parsed / frontmatter not yet added).

- [ ] **Step 3: Add the fields to the `Project` type**

In `src/lib/content.ts`, in the `Project` type, after the `outcomeMetricValue?: string;` line add:

```ts
  outcomeLead?: string;
  outcomeRest?: string;
```

- [ ] **Step 4: Parse the fields**

In the `parseProject` object literal, after the `outcomeMetricValue: ...` block add:

```ts
    outcomeLead: data.outcomeLead ? String(data.outcomeLead) : undefined,
    outcomeRest: data.outcomeRest ? String(data.outcomeRest) : undefined,
```

- [ ] **Step 5: Add frontmatter (so the test has data)**

In `content/projects/understandingfafsa.md` frontmatter, add:

```yaml
outcomeLead: 75% lift
outcomeRest: in open rate after a modular newsletter rebuild.
```

In `content/projects/fresh-greens.md` frontmatter, add:

```yaml
outcomeLead: Shipped, solo.
```

- [ ] **Step 6: Run the test to confirm it passes**

Run: `npx vitest run src/lib/__tests__/content-outcome.test.ts`
Expected: PASS (2 tests).

- [ ] **Step 7: Commit**

```bash
git add src/lib/content.ts src/lib/__tests__/content-outcome.test.ts content/projects/understandingfafsa.md content/projects/fresh-greens.md
git commit -m "feat: add optional outcomeLead/outcomeRest frontmatter fields"
```

---

## Task 2: Outcome + meta derivation helper

**Files:**
- Create: `src/lib/work-gallery-data.ts`
- Test: `src/lib/__tests__/work-gallery-data.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/work-gallery-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { galleryOutcome, galleryMeta } from "@/lib/work-gallery-data";
import type { Project } from "@/lib/content";

const base: Project = {
  slug: "x", title: "X", summary: "A summary sentence.", role: "Product Designer",
  timeframe: "2025", status: "published", order: 1, tags: ["Thesis", "Mobile"],
  sections: [], bodyHtml: "",
};

describe("galleryOutcome", () => {
  it("uses outcomeLead + outcomeRest when set", () => {
    expect(galleryOutcome({ ...base, outcomeLead: "75% lift", outcomeRest: "in open rate." }))
      .toEqual({ lead: "75% lift", rest: "in open rate." });
  });
  it("falls back to metric value + label", () => {
    expect(galleryOutcome({ ...base, outcomeMetricValue: "78%", outcomeMetricLabel: "preferred it" }))
      .toEqual({ lead: "78%", rest: "preferred it" });
  });
  it("falls back to summary with no lead when nothing else", () => {
    expect(galleryOutcome(base)).toEqual({ lead: "", rest: "A summary sentence." });
  });
});

describe("galleryMeta", () => {
  it("joins role and timeframe with a middot", () => {
    expect(galleryMeta(base)).toBe("Product Designer · 2025");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run src/lib/__tests__/work-gallery-data.test.ts`
Expected: FAIL — module `work-gallery-data` not found.

- [ ] **Step 3: Implement the helper**

Create `src/lib/work-gallery-data.ts`:

```ts
import type { Project } from "@/lib/content";

/** The emphasized lead + muted remainder for a gallery card's outcome line. */
export function galleryOutcome(project: Project): { lead: string; rest: string } {
  const lead = project.outcomeLead ?? project.outcomeMetricValue ?? "";
  const rest =
    project.outcomeRest ??
    (project.outcomeMetricValue ? (project.outcomeMetricLabel ?? "") : project.summary);
  return { lead, rest };
}

/** The single mono meta line: role · year. */
export function galleryMeta(project: Project): string {
  return [project.role, project.timeframe].filter(Boolean).join(" · ");
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/lib/__tests__/work-gallery-data.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/work-gallery-data.ts src/lib/__tests__/work-gallery-data.test.ts
git commit -m "feat: add gallery outcome/meta derivation helper"
```

---

## Task 3: Signature + gallery CSS

**Files:**
- Modify: `src/app/globals.css` (add a new `.work-gallery` block; do NOT delete the old `.work-showcase` block yet — that is Task 8, to avoid breaking the current page mid-plan)

Adapt the validated CSS from `docs/superpowers/prototypes/working-file-signature.html`. Use the site's real tokens (`--foreground`, `--muted`, `--line`, `--font-family-sans`, `--font-geist-mono`) instead of the prototype's hardcoded fallbacks.

- [ ] **Step 1: Add the gallery + signature CSS**

Append to `src/app/globals.css`:

```css
/* ── Work gallery (visual-first, "working file" signature) ───────── */
.work-gallery { position: relative; padding-left: 34px; }
.work-gallery::before { /* left spine */
  content: ""; position: absolute; left: 6px; top: 0; bottom: 0;
  width: 1px; background: var(--line);
}
.work-gallery-head {
  display: flex; align-items: baseline; justify-content: space-between;
  gap: 16px; margin: 0 0 14px;
}
.work-gallery-head .t { font-family: var(--font-geist-mono); font-size: 0.75rem;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); }
.work-gallery-head .m { font-family: var(--font-geist-mono); font-size: 0.75rem;
  letter-spacing: 0.04em; color: color-mix(in srgb, var(--muted) 78%, transparent); }
.work-gallery-rule { height: 1px; background: var(--line); transform-origin: left center; }

.work-gallery-feature { padding: 30px 0 34px; }
.work-gallery-pair { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; padding: 30px 0 20px; }
@media (max-width: 760px) { .work-gallery-pair { grid-template-columns: 1fr; gap: 34px; } }

.work-gallery-index { display: block; margin: 0 0 12px;
  font-family: var(--font-geist-mono); font-size: 0.75rem; letter-spacing: 0.08em;
  color: color-mix(in srgb, var(--muted) 78%, transparent); }

.work-card { display: block; text-decoration: none; color: inherit; position: relative; cursor: pointer; }
.work-card:focus-visible { outline: 2px solid var(--foreground); outline-offset: 6px; border-radius: 14px; }
.work-thumb { position: relative; border-radius: 11px; overflow: hidden; background: var(--line);
  box-shadow: 0 14px 34px -24px rgba(0,0,0,.45); aspect-ratio: 3 / 2; }
.work-thumb::after { content: ""; position: absolute; inset: 0; border-radius: 11px;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--foreground) 8%, transparent); pointer-events: none; }
.work-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform .6s cubic-bezier(0.16,1,0.3,1); }
.work-card:hover .work-thumb img { transform: scale(1.035); }

.work-cap { margin-top: 18px; }
.work-cap-row { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.work-title { font-weight: 600; letter-spacing: var(--track-title); line-height: 1.02; margin: 0; color: var(--foreground); }
.work-gallery-feature .work-title { font-size: clamp(1.6rem, 3.4vw, 2.1rem); }
.work-gallery-pair .work-title { font-size: 1.4rem; }
.work-anno { font-family: var(--font-geist-mono); font-size: 0.69rem; letter-spacing: 0.03em;
  color: color-mix(in srgb, var(--muted) 78%, transparent); white-space: nowrap; }
.work-out { margin: 11px 0 0; color: var(--muted); line-height: 1.5; font-size: 0.95rem; max-width: 58ch; }
.work-gallery-pair .work-out { font-size: 0.9rem; }
.work-out b, .work-out strong { color: var(--foreground); font-weight: 600; }
.work-meta { font-family: var(--font-geist-mono); font-size: 0.75rem; letter-spacing: 0.02em;
  color: color-mix(in srgb, var(--muted) 78%, transparent); margin: 12px 0 0; }
.work-gallery-foot { font-family: var(--font-geist-mono); font-size: 0.69rem; letter-spacing: 0.06em;
  color: color-mix(in srgb, var(--muted) 70%, transparent); padding: 20px 0 0;
  display: flex; justify-content: space-between; }

/* Entrance cascade — content visible by default; keyframes play OVER it */
.work-gallery.wg-animate .wg-anim { animation: wgFade .6s cubic-bezier(0.16,1,0.3,1) var(--d, 0s) both; }
.work-gallery.wg-animate .wg-anim.wg-tick { animation-name: wgTick; }
.work-gallery.wg-animate .wg-anim.wg-rise { animation-name: wgRise; }
.work-gallery.wg-animate .work-gallery-rule.wg-anim { animation-name: wgRule; }
.work-gallery.wg-animate .work-thumb.wg-anim { animation-name: wgWipe; animation-duration: .7s; }
@keyframes wgFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes wgTick { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
@keyframes wgRise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
@keyframes wgRule { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }
@keyframes wgWipe { from { opacity: 0; clip-path: inset(0 0 100% 0); } to { opacity: 1; clip-path: inset(0 0 0 0); } }
@media (prefers-reduced-motion: reduce) { .work-gallery.wg-animate .wg-anim { animation: none; } }
```

- [ ] **Step 2: Verify the CSS parses (dev server compiles)**

Run: `npx tsc --noEmit` (CSS isn't type-checked, but this confirms the build is clean before wiring). Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add work-gallery + working-file signature CSS"
```

---

## Task 4: Gallery reveal client component (robust reveal pattern)

**Files:**
- Create: `src/components/gallery-reveal.tsx`

This arms the entrance cascade. It is the ONLY client boundary the gallery adds for motion. Content is visible by default; this component only *adds* the animating class, guarded by visibility and a safety-net timer, matching the signature doc.

- [ ] **Step 1: Implement the component**

Create `src/components/gallery-reveal.tsx`:

```tsx
"use client";

import { useEffect } from "react";

/**
 * Arms the work-gallery entrance cascade on the element with id="work-gallery".
 * Robust reveal: content is visible by default (CSS has no persistent hidden
 * state); we only add `.wg-animate` to play keyframes over it. A safety-net
 * timer removes the class regardless, so a throttled/hidden/headless render can
 * never be left blank. We never arm a hidden tab.
 */
export function GalleryReveal() {
  useEffect(() => {
    const el = document.getElementById("work-gallery");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revealT: ReturnType<typeof setTimeout>;
    const play = () => {
      if (document.hidden) return;
      el.classList.remove("wg-animate");
      void el.offsetWidth; // restart keyframes from 0%
      el.classList.add("wg-animate");
      revealT = setTimeout(() => el.classList.remove("wg-animate"), 1300);
    };

    if (document.visibilityState === "visible") play();
    else {
      const onVis = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          play();
        }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => document.removeEventListener("visibilitychange", onVis);
    }
    return () => clearTimeout(revealT);
  }, []);

  return null;
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/gallery-reveal.tsx
git commit -m "feat: add GalleryReveal client component (robust reveal)"
```

---

## Task 5: WorkProjectCard rewrite (caption below, outcome + meta)

**Files:**
- Modify: `src/components/work-project-card.tsx` (full rewrite of the render; keep `handleProjectEnter` logic verbatim)

- [ ] **Step 1: Rewrite the component**

Replace the contents of `src/components/work-project-card.tsx` with:

```tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/home-intro";
import { dispatchProjectEnterRequest } from "@/lib/project-enter";
import { galleryOutcome, galleryMeta } from "@/lib/work-gallery-data";

type WorkProjectCardProps = {
  project: Project;
  index: number;      // 0-based; used for the mono index label
  featured?: boolean;
};

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function WorkProjectCard({ project, index, featured = false }: WorkProjectCardProps) {
  const { lead, rest } = galleryOutcome(project);
  const meta = galleryMeta(project);

  const handleProjectEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey ||
      event.altKey || prefersReducedMotion() || !project.coverImage
    ) return;
    const frame = event.currentTarget.querySelector<HTMLElement>(".work-thumb");
    if (!frame) return;
    event.preventDefault();
    const rect = frame.getBoundingClientRect();
    dispatchProjectEnterRequest({
      slug: project.slug,
      href: `/work/${project.slug}`,
      rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      imageSrc: project.coverImage,
      imageAlt: `${project.title} preview`,
      borderRadius: getComputedStyle(frame).borderRadius,
    });
  };

  return (
    <div className={featured ? "work-gallery-feature" : undefined}>
      <span className="work-gallery-index wg-anim wg-tick" style={{ ["--d" as string]: featured ? ".32s" : ".78s" }}>
        {formatIndex(index)}
      </span>
      <Link className="work-card" href={`/work/${project.slug}`} onClick={handleProjectEnter}>
        {project.coverImage ? (
          <div className="work-thumb wg-anim" style={{ ["--d" as string]: featured ? ".38s" : ".82s" }}>
            <Image
              src={project.coverImage}
              alt={`${project.title} preview`}
              width={1400}
              height={933}
              sizes={featured ? "(max-width: 760px) 100vw, min(70vw, 1000px)" : "(max-width: 760px) 100vw, 40vw"}
              priority={featured}
            />
          </div>
        ) : null}
        <div className="work-cap">
          <div className="work-cap-row">
            <h3 className="work-title wg-anim wg-rise" style={{ ["--d" as string]: featured ? ".50s" : ".90s" }}>
              {project.title}
            </h3>
            {meta ? (
              <span className="work-anno wg-anim wg-tick" style={{ ["--d" as string]: featured ? ".54s" : ".92s" }}>
                {project.role}
              </span>
            ) : null}
          </div>
          <p className="work-out wg-anim wg-rise" style={{ ["--d" as string]: featured ? ".56s" : ".94s" }}>
            {lead ? <strong>{lead}</strong> : null}{lead ? " " : ""}{rest}
          </p>
          <p className="work-meta">{meta}</p>
        </div>
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks** (will still error until `WorkGallery` consumes it — that's Task 6; just confirm no syntax errors in this file)

Run: `npx tsc --noEmit`
Expected: errors only about `work-showcase.tsx` still importing the old card shape (resolved in Task 6). No syntax errors in `work-project-card.tsx` itself.

- [ ] **Step 3: Commit**

```bash
git add src/components/work-project-card.tsx
git commit -m "feat: rewrite WorkProjectCard as caption-below gallery card"
```

---

## Task 6: WorkGallery server component

**Files:**
- Create: `src/components/work-gallery.tsx`

- [ ] **Step 1: Implement the component**

Create `src/components/work-gallery.tsx`:

```tsx
import type { Project } from "@/lib/content";
import { WorkProjectCard } from "@/components/work-project-card";
import { GalleryReveal } from "@/components/gallery-reveal";

type WorkGalleryProps = { projects: Project[] };

export function WorkGallery({ projects }: WorkGalleryProps) {
  if (projects.length === 0) {
    return <p className="work-out">No published projects yet.</p>;
  }
  const [featured, ...rest] = projects;

  return (
    <div className="work-gallery" id="work-gallery">
      <div className="work-gallery-head">
        <span className="t wg-anim wg-tick" style={{ ["--d" as string]: ".02s" }}>Selected work</span>
        <span className="m wg-anim wg-tick" style={{ ["--d" as string]: ".06s" }}>
          {String(projects.length).padStart(2, "0")} / projects · {featured.timeframe}
        </span>
      </div>
      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: ".12s" }} />

      <WorkProjectCard project={featured} index={0} featured />

      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: ".66s" }} />

      {rest.length > 0 ? (
        <div className="work-gallery-pair">
          {rest.map((project, i) => (
            <WorkProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      ) : null}

      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: "1.02s" }} />
      <div className="work-gallery-foot wg-anim wg-tick" style={{ ["--d" as string]: "1.1s" }}>
        <span>end · selected work</span><span>baseline · 8pt</span>
      </div>
      <GalleryReveal />
    </div>
  );
}
```

- [ ] **Step 2: Verify it type-checks** (still errors because `page.tsx` imports `WorkShowcase`; fixed in Task 7)

Run: `npx tsc --noEmit`
Expected: error only in `page.tsx` (old import). No errors in `work-gallery.tsx`.

- [ ] **Step 3: Commit**

```bash
git add src/components/work-gallery.tsx
git commit -m "feat: add WorkGallery server component"
```

---

## Task 7: Wire the home page to WorkGallery

**Files:**
- Modify: `src/app/page.tsx` (import + the `Selected Work` section)

- [ ] **Step 1: Swap the import**

In `src/app/page.tsx`, replace:

```tsx
import { WorkShowcase } from "@/components/work-showcase";
```

with:

```tsx
import { WorkGallery } from "@/components/work-gallery";
```

- [ ] **Step 2: Swap the usage**

In the `work` section, replace `<WorkShowcase projects={projects} />` with:

```tsx
<WorkGallery projects={projects} />
```

- [ ] **Step 3: Verify build + types**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Verify in the browser**

Start the dev server (preview tools). Navigate to `/`, scroll to `Selected Work`. Expected: featured Fresh Greens card on top (cover, then title + "Shipped, solo." outcome + mono meta), Navi + FAFSA in a 2-up grid below, left spine + `01/02/03` indices + hairline rules + `end · selected work` / `baseline · 8pt` foot notes present.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: render WorkGallery on the home page"
```

---

## Task 8: Delete the old showcase machinery

**Files:**
- Delete: `src/components/work-showcase.tsx`, `src/components/work-showcase-metric.tsx`, `src/components/work-showcase-rail.tsx`, `src/lib/work-showcase-metrics.ts`, `src/lib/work-showcase-parallax.ts`
- Modify: `src/app/globals.css` (remove `.work-showcase-*`, `.work-showcase-rail*`, `.work-showcase-metric*`, `.work-showcase-media-stack*`, and the reduced-motion entries for those — the block spanning roughly lines 1121–1600, EXCLUDING the new `.work-gallery` block added in Task 3 and the shared `.work-list` base if still referenced elsewhere)

- [ ] **Step 1: Confirm no remaining importers**

Run:
```bash
grep -rln "work-showcase\|WorkShowcase\|getProjectMetricPhrases\|work-showcase-parallax\|WorkShowcaseMetric\|WorkShowcaseRail" src/
```
Expected: only the five files about to be deleted (and no `page.tsx` / other consumers). If anything else appears, stop and resolve it first.

- [ ] **Step 2: Delete the modules**

```bash
git rm src/components/work-showcase.tsx src/components/work-showcase-metric.tsx src/components/work-showcase-rail.tsx src/lib/work-showcase-metrics.ts src/lib/work-showcase-parallax.ts
```

- [ ] **Step 3: Remove the dead CSS**

In `src/app/globals.css`, delete every rule whose selector starts with `.work-showcase` (including `-rail`, `-metric`, `-media-stack`, `-item`, `-copy`, `-media`, `-link`, `-index`, `-shell`, and the `[data-focus-ready]` / `[data-active]` / `[data-focus-distance]` variants), plus their `prefers-reduced-motion` entries. Keep the new `.work-gallery*` block. Keep `.work-list` only if grep shows another consumer; otherwise remove it too.

- [ ] **Step 4: Confirm no orphan references**

Run:
```bash
grep -rn "work-showcase" src/ ; echo "exit: $?"
```
Expected: no matches (grep exit 1).

- [ ] **Step 5: Verify build, types, tests, and the page still render**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean; all tests pass.
Then reload `/` in the browser — the gallery still renders identically (only dead code removed).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: delete old work-showcase machinery + dead CSS"
```

---

## Task 9: Regenerate the three covers (SP2)

**Files:**
- Replace: `public/projects/fresh-greens/cover.png`, `public/projects/navi/cover.png`, `public/projects/understandingfafsa/cover.png`

Per [`cover-treatment-design.md`](../specs/2026-07-06-cover-treatment-design.md): unified straight-on device frames, screen filling ≥65%, brand-hue ground (FG green `#41AD49`, Navi orange `#f3722c`, FAFSA blue — confirm from `modular-header.png`), authored 3:2 at 2400×1600. This task is asset production + in-browser iteration, not code; the steps below define the method and the acceptance bar.

- [ ] **Step 1: Pick the source screen per project**

Load candidates in the browser gallery and pick the one that reads best at grid size:
- Fresh Greens: `public/projects/fresh-greens/en-route.png` or `route-preview.png`.
- Navi: `public/projects/navi/final-mockup.png` or `interface-composition.png`.
- FAFSA: `public/projects/understandingfafsa/modular-header.png` (+ `modular-best.png`).

- [ ] **Step 2: Compose each cover**

For each: place the source screen straight-on in a shared device-frame template, scale so the screen fills ≥65% of a 2400×1600 canvas (bleed edges for portrait phones), fill the ground with the desaturated brand tint, add one shared soft shadow. Export to the project's `cover.png` path (same filename). Keep bezel/shadow/margin identical across all three.

- [ ] **Step 3: Verify the "set" test in the browser**

Reload `/`. Expected: each project's UI is legible in its thumbnail (desktop and 375px); the three read as one system (identical bezel, shadow, margin, ratio); the featured cover reads well large. Iterate compositions until this holds.

- [ ] **Step 4: Confirm weight + optimization**

Each `cover.png` should be reasonably sized (not multi-MB); `next/image` still optimizes. Check `preview_network` shows optimized responses.

- [ ] **Step 5: Commit**

```bash
git add public/projects/*/cover.png
git commit -m "feat: regenerate covers as unified straight-on device frames"
```

---

## Task 10: Integrated verification

- [ ] **Step 1: Desktop + mobile layout**

In the browser at desktop and 375px: featured full-width 3:2, 2-up grid collapsing to 1 column; no horizontal overflow; captions below images; nothing overlapped. Use `preview_inspect` to confirm the featured and grid thumbs are both `aspect-ratio: 3 / 2`.

- [ ] **Step 2: Motion + robust reveal**

Reload `/`: the entrance cascade plays (rules draw, indices tick, featured cover wipes, captions settle). Then verify no-blank on a throttled render: via `preview_eval`, confirm that with the gallery present and `document.hidden` reported by the harness, every `.wg-anim` element computes `opacity: 1` (content visible, never gated). Confirm `getAnimations()` on a sample `.wg-anim` shows the correct keyframe when armed.

- [ ] **Step 3: Reduced motion**

`preview_resize` won't toggle reduced-motion; instead via `preview_eval` confirm the CSS `@media (prefers-reduced-motion: reduce)` rule exists and that `GalleryReveal` early-returns under it (content already visible).

- [ ] **Step 4: Click-to-enter**

Click the featured card; confirm the FLIP transition fires (cover animates toward the case study) and navigation lands on `/work/fresh-greens`.

- [ ] **Step 5: Contrast**

`preview_inspect` `.work-out` and `.work-meta` computed color vs background on both themes; confirm ≥4.5:1 (muted `#555` on `#fafafa` ≈ 7:1; `#c4c4c4` on `#050505` ≈ 11:1 — both pass). The mono meta at `color-mix(... 78%, transparent)` must still clear 4.5:1 — if not, raise the mix percentage.

- [ ] **Step 6: Full suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: types clean, all tests pass.

- [ ] **Step 7: Commit any fixes**

```bash
git add -A
git commit -m "test: verify gallery layout, motion, a11y, covers"
```

---

## Task 11: Impeccable critique + audit (post-implementation)

Per the user: run the design critique + audit on the built UI, not the spec.

- [ ] **Step 1: Critique**

Run `/impeccable critique` scoped to the home `Selected Work` gallery. Address any P0/P1 findings; note P2/P3 for follow-up.

- [ ] **Step 2: Audit**

Run `/impeccable audit` scoped to the same surface (a11y, performance, responsive, theming, anti-patterns — especially the numbered-index and mono-annotation choices against the "numbered markers as scaffolding" ban; they are justified here as a real ordered index + the working-file signature, but confirm they don't read as reflex).

- [ ] **Step 3: Apply + commit fixes**

Fix confirmed issues, re-verify in the browser, and commit.

```bash
git add -A
git commit -m "fix: address impeccable critique/audit findings on the gallery"
```

---

## Self-Review Notes (author)

- **Spec coverage:** SP1 (gallery, caption-below, outcome/meta, removals, motion, a11y) → Tasks 1–8, 10. SP2 (covers) → Task 9. Signature (structure + motion + robust reveal) → Tasks 3, 4, 6, 10. Impeccable-after → Task 11. ✅
- **Signature ↔ SP1 overlap:** signature doc is authoritative on visual/motion; this plan implements it via the `.wg-*` classes and `GalleryReveal`. ✅
- **Type consistency:** `galleryOutcome` returns `{ lead, rest }`; `galleryMeta` returns string — used consistently in Task 5. `WorkProjectCard` props `{ project, index, featured }` — matches Task 6 usage. Thumb selector is `.work-thumb` in both the CSS (Task 3), the FLIP `handleProjectEnter` (Task 5), and verification (Task 10). ✅
- **Deferred to Wave 2 (SP4):** the signature on hero/nav/case-studies/chrome/transitions — not in this plan.
