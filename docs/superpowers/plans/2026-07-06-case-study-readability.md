# Case-Study Readability Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give each of the three case studies a visual-forward "recruiter cut" (~60s) at the top that flows into the existing deep dive, now made scannable with section takeaways and pull-quotes.

**Architecture:** Two new shared server components — `LeadMedia` (still cover now, muted-autoplay `<video>` when a clip path is provided) and `RecruiterCut` (an at-a-glance `<dl>` of Problem/Role/Timeline/Stack/Outcome + a "Key moves" list). Each case-study page consolidates its scattered top blocks (`project-meta` `<dl>` + `ProjectHighlight`) into `RecruiterCut`, adds a "full breakdown ↓" divider, and gains a one-line takeaway at each deep-dive section head plus one pull-quote. A case-study type pass (measure, rhythm, the new text roles) rides along in `globals.css`. No section or evidence is removed.

**Tech Stack:** Next.js 16 (App Router, RSC + a tiny client boundary for video), React 19, TypeScript, `globals.css`, Vitest + Testing Library, `next/image`.

**Spec:** [`docs/superpowers/specs/2026-07-06-case-study-readability-design.md`](../specs/2026-07-06-case-study-readability-design.md).

**Voice rules (all new copy):** no em-dashes (no `—` / `--`), no semicolons, no ellipses, Oxford comma, contractions, no hype words (passionate, leveraged, spearheaded, remarkable, innovative, world-class, seamless, cutting-edge, best-in-class). En-dashes only in numeric date ranges.

---

## File Structure

- `src/components/lead-media.tsx` — `LeadMedia` (server): still `next/image` cover, or `<LeadVideo>` when `clip` set. **Create.**
- `src/components/lead-video.tsx` — `LeadVideo` (client): muted autoplay loop, pauses to poster under reduced-motion. **Create.**
- `src/components/recruiter-cut.tsx` — `RecruiterCut` (server): at-a-glance `<dl>` + key-moves list. **Create.**
- `src/components/__tests__/recruiter-cut.test.tsx`, `.../lead-media.test.tsx` — render tests. **Create.**
- `src/app/globals.css` — `.case-lead-*`, `.case-cut-*`, `.case-tier-divider`, `.case-section-lead`, `.case-pullquote`, plus the type-pass measure/rhythm rules. **Modify.**
- `src/app/work/fresh-greens/page.tsx`, `.../navi/page.tsx`, `.../understandingfafsa/page.tsx` — consolidate top, add divider, add section-leads + pull-quote. **Modify.**
- `src/components/{fresh-greens,navi}.tsx` — only where deep-dive section copy lives in the component. **Modify (as needed).**

---

## Task 1: `LeadMedia` + `LeadVideo` components

**Files:**
- Create: `src/components/lead-video.tsx`, `src/components/lead-media.tsx`
- Test: `src/components/__tests__/lead-media.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/lead-media.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadMedia } from "@/components/lead-media";

describe("LeadMedia", () => {
  it("renders a still image when no clip is given", () => {
    render(<LeadMedia cover="/projects/navi/cover.png" alt="Navi cover" />);
    const img = screen.getByAltText("Navi cover");
    expect(img.tagName).toBe("IMG");
  });

  it("renders a video with the cover as poster when a clip is given", () => {
    const { container } = render(
      <LeadMedia cover="/projects/navi/cover.png" alt="Navi demo" clip="/projects/navi/demo.mp4" />,
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.getAttribute("poster")).toBe("/projects/navi/cover.png");
    expect(container.querySelector("source")!.getAttribute("src")).toBe("/projects/navi/demo.mp4");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run src/components/__tests__/lead-media.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `LeadVideo` (client)**

Create `src/components/lead-video.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

type LeadVideoProps = { clip: string; poster: string; alt: string };

/** Muted autoplay loop. Under reduced-motion we do not autoplay; the poster
 *  (the still cover) shows instead, so the section is never blank or busy. */
export function LeadVideo({ clip, poster, alt }: LeadVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="case-lead-video"
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      aria-label={alt}
    >
      <source src={clip} type="video/mp4" />
    </video>
  );
}
```

- [ ] **Step 4: Implement `LeadMedia` (server)**

Create `src/components/lead-media.tsx`:

```tsx
import Image from "next/image";
import { LeadVideo } from "@/components/lead-video";

type LeadMediaProps = {
  cover: string;
  alt: string;
  clip?: string;
  width?: number;
  height?: number;
};

export function LeadMedia({ cover, alt, clip, width = 2000, height = 1200 }: LeadMediaProps) {
  return (
    <figure className="case-lead-media">
      {clip ? (
        <LeadVideo clip={clip} poster={cover} alt={alt} />
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

- [ ] **Step 5: Run the test to confirm it passes**

Run: `npx vitest run src/components/__tests__/lead-media.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add src/components/lead-media.tsx src/components/lead-video.tsx src/components/__tests__/lead-media.test.tsx
git commit -m "feat: add LeadMedia (still cover, video-ready) for case studies"
```

---

## Task 2: `RecruiterCut` component

**Files:**
- Create: `src/components/recruiter-cut.tsx`
- Test: `src/components/__tests__/recruiter-cut.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/recruiter-cut.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RecruiterCut } from "@/components/recruiter-cut";

describe("RecruiterCut", () => {
  it("renders the at-a-glance facts and key moves", () => {
    render(
      <RecruiterCut
        problem="Routing ignores whose safety knowledge counts."
        role="Solo, design and engineering"
        timeline="Sep 2025 – Jun 2026"
        stack="React Native, Supabase"
        outcomeValue="78%"
        outcomeLabel="preferred it"
        moves={["Did the first thing.", "Did the second thing."]}
      />,
    );
    expect(screen.getByText("Problem").tagName).toBe("DT");
    expect(screen.getByText("Routing ignores whose safety knowledge counts.")).toBeInTheDocument();
    expect(screen.getByText("Key moves")).toBeInTheDocument();
    expect(screen.getByText("Did the second thing.")).toBeInTheDocument();
  });

  it("omits the outcome row when value/label absent", () => {
    render(
      <RecruiterCut problem="p" role="r" timeline="t" stack="s" moves={["m"]} />,
    );
    expect(screen.queryByText("Outcome")).toBeNull();
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run src/components/__tests__/recruiter-cut.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component**

Create `src/components/recruiter-cut.tsx`:

```tsx
import { CountUp } from "@/components/count-up";

type RecruiterCutProps = {
  problem: string;
  role: string;
  timeline: string;
  stack: string;
  outcomeValue?: string;
  outcomeLabel?: string;
  moves: string[];
};

export function RecruiterCut({
  problem, role, timeline, stack, outcomeValue, outcomeLabel, moves,
}: RecruiterCutProps) {
  return (
    <section className="case-cut" aria-label="At a glance">
      <dl className="case-cut-facts">
        <div className="case-cut-row"><dt>Problem</dt><dd>{problem}</dd></div>
        <div className="case-cut-row"><dt>Role</dt><dd>{role}</dd></div>
        <div className="case-cut-row"><dt>Timeline</dt><dd>{timeline}</dd></div>
        <div className="case-cut-row"><dt>Stack</dt><dd>{stack}</dd></div>
        {outcomeValue && outcomeLabel ? (
          <div className="case-cut-row case-cut-outcome">
            <dt>Outcome</dt>
            <dd>
              <span className="case-cut-metric"><CountUp value={outcomeValue} /></span> {outcomeLabel}
            </dd>
          </div>
        ) : null}
      </dl>
      {moves.length > 0 ? (
        <div className="case-cut-moves">
          <p className="case-cut-moves-label">Key moves</p>
          <ul role="list">
            {moves.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/components/__tests__/recruiter-cut.test.tsx`
Expected: PASS (2 tests). (If `CountUp` needs a client boundary, it already has `"use client"`; RecruiterCut stays a server component with a client child.)

- [ ] **Step 5: Commit**

```bash
git add src/components/recruiter-cut.tsx src/components/__tests__/recruiter-cut.test.tsx
git commit -m "feat: add RecruiterCut at-a-glance + key-moves component"
```

---

## Task 3: Case-study readability CSS + type pass

**Files:**
- Modify: `src/app/globals.css` (append a `/* Case-study readability */` block)

- [ ] **Step 1: Append the styles**

Append to `src/app/globals.css`:

```css
/* ── Case-study readability: recruiter cut + landmarks ──────────── */
.case-lead-media { margin: 1.6rem 0 2rem; border-radius: 0.7rem; overflow: hidden; border: 1px solid var(--line); }
.case-lead-img, .case-lead-video { display: block; width: 100%; height: auto; }

.case-cut { margin: 0 0 2.2rem; display: grid; gap: 1.4rem; max-width: 70ch; }
.case-cut-facts { margin: 0; display: grid; gap: 0.6rem; }
.case-cut-row { display: grid; grid-template-columns: 120px 1fr; gap: 1rem; align-items: baseline; }
@media (max-width: 560px) { .case-cut-row { grid-template-columns: 1fr; gap: 0.1rem; } }
.case-cut-row dt { font-family: var(--font-geist-mono); font-size: 0.72rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); margin: 0; }
.case-cut-row dd { margin: 0; color: var(--foreground); font-size: 1rem; line-height: 1.5; }
.case-cut-metric { font-weight: 600; }
.case-cut-outcome dd { font-size: 1.05rem; }
.case-cut-moves-label { font-family: var(--font-geist-mono); font-size: 0.72rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); margin: 0 0 0.5rem; }
.case-cut-moves ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.5rem; }
.case-cut-moves li { position: relative; padding-left: 1.1rem; color: var(--foreground);
  font-size: 0.98rem; line-height: 1.5; }
.case-cut-moves li::before { content: "→"; position: absolute; left: 0; color: var(--muted); }

.case-tier-divider { display: flex; align-items: center; gap: 1rem; margin: 2.6rem 0 2rem; color: var(--muted); }
.case-tier-divider::before, .case-tier-divider::after { content: ""; height: 1px; background: var(--line); flex: 1; }
.case-tier-divider span { font-family: var(--font-geist-mono); font-size: 0.72rem; letter-spacing: 0.1em;
  text-transform: uppercase; white-space: nowrap; }

.case-section-lead { margin: 0 0 1rem; font-size: 1.08rem; line-height: 1.5; font-weight: 600;
  color: var(--foreground); text-wrap: pretty; max-width: 68ch; }
.case-pullquote { margin: 2.2rem 0; padding: 0; border: 0; max-width: 30ch;
  font-size: clamp(1.5rem, 3.2vw, 2.1rem); font-weight: 600; letter-spacing: var(--track-title);
  line-height: 1.15; color: var(--foreground); text-wrap: balance; }

/* Type pass: cap the case-study prose measure for comfortable reading */
.project-section-body { max-width: 68ch; }
.project-section-body p { text-wrap: pretty; }
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: case-study readability styles + prose type pass"
```

---

## Task 4: Wire Fresh Greens

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx`

Fresh Greens' current top order is: hero → section "Whose knowledge counts" → `ProjectCover` → `project-meta` `<dl>` → `ProjectToc` → sections. Reorganize into the two-tier shape. FG has no `ProjectHighlight`, so it has no outcome metric today (use the outcome copy below without a metric value).

- [ ] **Step 1: Imports + Tier 1 after the hero**

Add imports:
```tsx
import { LeadMedia } from "@/components/lead-media";
import { RecruiterCut } from "@/components/recruiter-cut";
```

Immediately after the closing `</section>` of the hero (before the "Whose knowledge counts" section), insert:
```tsx
<LeadMedia
  cover="/projects/fresh-greens/cover.png"
  alt="Fresh Greens cover"
/>
<RecruiterCut
  problem="Routing engines optimize for time and distance, not for whose safety knowledge counts."
  role="Solo, design and engineering"
  timeline="Sep 2025 – Jun 2026"
  stack="React Native, Expo, TypeScript, Supabase"
  moves={[
    "Ran community safety reports through the same pipeline as OpenStreetMap, DOT-511, OSRM, and SunCalc, weighted the same way.",
    "Built the en-route screen around one-thumb reach: turn card, 3D map, and a safety column.",
    "Held the reserved-color rule across 26+ screens and 300+ accessibility attributes.",
    "Shaped the routing signals from six driver interviews.",
  ]}
/>
```

- [ ] **Step 2: Remove the now-absorbed blocks + relocate the cover**

Delete the standalone `<ProjectCover .../>` and the `project-meta` `<dl>` (the `LeadMedia` above replaces the cover as the lead visual; the meta is now in `RecruiterCut`). Keep `<ProjectToc .../>` where it is (after the removed meta). Move the "Whose knowledge counts" `<section>` to sit **after** `ProjectToc` (it becomes the first deep-dive section).

- [ ] **Step 3: Add the tier divider before the deep dive**

Immediately after `<ProjectToc .../>`, insert:
```tsx
<div className="case-tier-divider"><span>The full breakdown ↓</span></div>
```

- [ ] **Step 4: Add a pull-quote**

Inside the "Whose knowledge counts" section, after its `<h2>`, add:
```tsx
<blockquote className="case-pullquote">Whose safety knowledge counts when the route is computed?</blockquote>
```

- [ ] **Step 5: Add a section-lead to every deep-dive section**

After each deep-dive `<h2>`, add a one-line `<p className="case-section-lead">` that states the section's point, front-loaded, in Myles's voice. Draft one per section from the section's own content. Examples (match this register, do not leave any section without one):
- "The pipeline is the answer." → `<p className="case-section-lead">Community reports and public data share one adapter, one scoring function, and one audit trail.</p>`
- "The Held-Question Rule." → `<p className="case-section-lead">The interface asks before it assumes, so a driver stays in control under pressure.</p>`
- "Reserved color that holds." → `<p className="case-section-lead">Four colors and the daylight gradient are held to safety signals, with documented carve-outs.</p>`

Author the remaining section-leads the same way. Scan every new line for em-dashes, semicolons, ellipses, and hype words before committing.

- [ ] **Step 6: Tighten prose only where a visual already carries the point**

Where a figure/diagram directly below a paragraph already shows what the paragraph tells, trim the paragraph to remove the redundancy. Do not remove any section, number, claim, or evidence. `git diff` to confirm only redundant sentences were cut.

- [ ] **Step 7: Verify in the browser**

Start the dev server. Load `/work/fresh-greens`. Confirm: hero → lead visual → recruiter cut (Problem/Role/Timeline/Stack + Key moves) → jump nav → "The full breakdown ↓" → deep dive with a bold takeaway under each heading and the pull-quote. `npx tsc --noEmit` clean.

- [ ] **Step 8: Commit**

```bash
git add src/app/work/fresh-greens/page.tsx src/components/fresh-greens.tsx
git commit -m "feat: recruiter cut + skim landmarks for Fresh Greens"
```

---

## Task 5: Wire Navi

**Files:**
- Modify: `src/app/work/navi/page.tsx`

Navi's top order is: hero → `ProjectCover` → `project-meta` `<dl>` → `ProjectHighlight` → `ProjectToc` → sections. Navi HAS an outcome metric (`outcomeMetricValue` 78%, `outcomeMetricLabel`).

- [ ] **Step 1: Imports + Tier 1 after the hero**

Add the `LeadMedia` and `RecruiterCut` imports. After the hero `</section>`, insert:
```tsx
<LeadMedia cover="/projects/navi/cover.png" alt="Navi cover" />
<RecruiterCut
  problem="NYC tourism defaults to top-ten checklists that skip the neighborhoods and people who make the city."
  role="UI/UX Designer"
  timeline="January 2025 – June 2025"
  stack="Figma, research"
  outcomeValue={project?.outcomeMetricValue}
  outcomeLabel={project?.outcomeMetricLabel}
  moves={[
    "Mapped tourist density across Manhattan to find where the checklists cluster.",
    "Ran three user groups and six platforms through one heuristic evaluation.",
    "Turned the research into a neighborhood-participation framework.",
  ]}
/>
```
(If `outcomeValue`/`outcomeLabel` are typed as `string | undefined`, that is fine — the component omits the row when either is absent.)

- [ ] **Step 2: Remove the absorbed blocks**

Delete the standalone `<ProjectCover .../>`, the `project-meta` `<dl>`, and the `<ProjectHighlight .../>` (all folded into `LeadMedia` + `RecruiterCut`). Remove the now-unused `ProjectHighlight` import. Keep `<ProjectToc .../>`.

- [ ] **Step 3: Tier divider**

After `<ProjectToc .../>`, insert:
```tsx
<div className="case-tier-divider"><span>The full breakdown ↓</span></div>
```

- [ ] **Step 4: Pull-quote**

In an early section, after its `<h2>`, add:
```tsx
<blockquote className="case-pullquote">Residents did not want fewer tourists. They wanted visitors who engage more intentionally.</blockquote>
```
Confirm the source line exists in the prose; if lifting it leaves a stutter, fold the original sentence.

- [ ] **Step 5: Section-leads for every deep-dive section**

After each `<h2>`, add a `<p className="case-section-lead">` stating the section's point, in voice. Examples:
- "Before the research, a Manhattan heatmap" → `<p className="case-section-lead">Mapping tourist density showed where the checklists cluster and where neighborhoods get skipped.</p>`
- "What the data did (and did not) say" → `<p className="case-section-lead">The research pointed to intentional participation, not more destinations.</p>`

Author the rest the same way; scan for voice violations.

- [ ] **Step 6: Tighten visual-redundant prose** (same rule as Task 4 Step 6).

- [ ] **Step 7: Verify in the browser** — `/work/navi` reads hero → lead → recruiter cut (with the 78% outcome) → jump nav → divider → scannable deep dive. `tsc` clean.

- [ ] **Step 8: Commit**

```bash
git add src/app/work/navi/page.tsx src/components/navi.tsx
git commit -m "feat: recruiter cut + skim landmarks for Navi"
```

---

## Task 6: Wire UnderstandingFAFSA

**Files:**
- Modify: `src/app/work/understandingfafsa/page.tsx`

Same top order as Navi (hero → cover → meta → highlight → toc → sections). FAFSA has an outcome metric.

- [ ] **Step 1: Imports + Tier 1 after the hero**

Add the imports. After the hero `</section>`, insert:
```tsx
<LeadMedia cover="/projects/understandingfafsa/cover.png" alt="UnderstandingFAFSA cover" />
<RecruiterCut
  problem="A freshly rebranded site left its newsletter looking dated and off-brand."
  role="Product Designer"
  timeline="February 2025 – Ongoing"
  stack="Figma, Mailchimp"
  outcomeValue={project?.outcomeMetricValue}
  outcomeLabel={project?.outcomeMetricLabel}
  moves={[
    "Researched 120+ newsletters against four criteria.",
    "Built a modular template system with locked layers and swappable parts.",
    "Matched the newsletter to the rebranded site so subscribers see one brand.",
  ]}
/>
```

- [ ] **Step 2: Remove the absorbed blocks** — delete `<ProjectCover>`, the `project-meta` `<dl>`, and `<ProjectHighlight>`; remove the `ProjectHighlight` import; keep `<ProjectToc>`.

- [ ] **Step 3: Tier divider** — after `<ProjectToc>`, insert `<div className="case-tier-divider"><span>The full breakdown ↓</span></div>`.

- [ ] **Step 4: Pull-quote** — in an early section after its `<h2>`, add:
```tsx
<blockquote className="case-pullquote">Subscribers were seeing two different brands.</blockquote>
```
Fold the source sentence if lifting it stutters.

- [ ] **Step 5: Section-leads for every section** — a `<p className="case-section-lead">` after each `<h2>`, in voice. Example:
- "120 newsletters, four criteria." → `<p className="case-section-lead">A competitive audit set the bar: what makes a newsletter scannable, trustworthy, and on-brand.</p>`

Author the rest; scan for voice violations.

- [ ] **Step 6: Tighten visual-redundant prose** (same rule).

- [ ] **Step 7: Verify in the browser** — `/work/understandingfafsa` reads correctly with the outcome metric. `tsc` clean.

- [ ] **Step 8: Commit**

```bash
git add src/app/work/understandingfafsa/page.tsx
git commit -m "feat: recruiter cut + skim landmarks for UnderstandingFAFSA"
```

---

## Task 7: Cross-study verification

- [ ] **Step 1: Consistency** — the three recruiter cuts share one structure/rhythm; dividers, section-leads, and pull-quotes look identical across studies.

- [ ] **Step 2: Skim test** — for each study, read only hero + recruiter cut + section headings + section-leads + pull-quote. Confirm the full arc lands in ~60 seconds.

- [ ] **Step 3: LeadMedia states** — with no `clip`, the still cover renders (priority image). Temporarily pass a dummy `clip` to one page and confirm a `<video muted loop playsinline poster>` renders; confirm reduced-motion pauses it to the poster (via `preview_eval` toggling the matchMedia or checking the effect). Remove the dummy clip.

- [ ] **Step 4: Contrast + measure** — `preview_inspect` `.case-cut-row dt/dd`, `.case-cut-moves li`, `.case-section-lead`, `.case-pullquote`, `.case-tier-divider span` for ≥4.5:1 on both themes. Confirm `.project-section-body` computed `max-width` ≈ 68ch (no line longer than ~70ch).

- [ ] **Step 5: Responsive** — at 375px: `.case-cut-row` stacks (label above value); no horizontal overflow; pull-quotes do not overflow.

- [ ] **Step 6: Suite** — `npx tsc --noEmit && npx vitest run` clean.

- [ ] **Step 7: Diff-review prose** — confirm no numbers, claims, or evidence were lost in the Task 4-6 tightening.

- [ ] **Step 8: Commit any fixes**

```bash
git add -A
git commit -m "test: verify case-study readability across all three studies"
```

---

## Self-Review Notes (author)

- **Spec coverage:** LeadMedia (still/video) → Task 1; RecruiterCut (at-a-glance + moves) → Task 2; CSS + type pass → Task 3; per-study wiring (consolidate top, divider, section-leads, pull-quote, tighten) → Tasks 4-6; consistency/skim/contrast/responsive → Task 7. ✅
- **Consolidation, no duplication:** each page removes the standalone `project-meta` `<dl>` and `ProjectHighlight` when adding `RecruiterCut` (Tasks 4-6 Step 2). ✅
- **Type consistency:** `RecruiterCut` props `{ problem, role, timeline, stack, outcomeValue?, outcomeLabel?, moves }` used identically in Task 2 test and Tasks 4-6 usages. `LeadMedia` props `{ cover, alt, clip?, width?, height? }` consistent. `outcomeValue`/`outcomeLabel` accept `string | undefined` (component guards). ✅
- **Voice:** every new-copy step names the voice rules and a scan; the drafted moves/problems/pull-quotes are already compliant (no em-dashes/semicolons/ellipses/hype). ✅
- **Editorial tasks:** section-leads are authored per section with examples + voice + the skim-test as their verification (Task 7 Step 2) — the honest "test" for prose. ✅
- **No video blocker:** stills ship; `clip` is optional and drop-in (Task 1, Task 7 Step 3). ✅
- **Out of scope:** the `src/app/work/[slug]/page.tsx` generic template still uses `ProjectHighlight`; it is a fallback for projects without custom pages and is not one of the three studies, so it is left unchanged.
