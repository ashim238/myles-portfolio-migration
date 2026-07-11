# Wave B — Case-Study Density Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lay a skim path over the three long-form case studies — an at-a-glance summary block, pull-quotes, and tightened section intros — without removing any depth.

**Architecture:** A new server component `CaseStudySummary` renders a labelled `<dl>` (Problem / Role / Outcome / Stack / Timeline) near the top of each study. Existing sharp lines are promoted to `<blockquote>` pull-quotes. Section-opening prose is tightened in place. No section is removed; structure is unchanged.

**Tech Stack:** Next.js 16 (App Router, RSC), React 19, TypeScript, `globals.css`, Vitest.

**Spec:** [`docs/superpowers/specs/2026-07-06-case-study-density-design.md`](../specs/2026-07-06-case-study-density-design.md).

**Runs in parallel with Wave A.** The only shared file is `src/app/globals.css`; this plan only **appends** a `.case-summary*` / `.case-pullquote*` block and touches no `.work-*` selectors, so it does not collide with Wave A's gallery/showcase edits. If both waves are worktrees, resolve `globals.css` by keeping both appended blocks. This plan does **not** depend on any Wave A module (the summary content is authored per page, not derived from a shared helper).

---

## File Structure

- `src/components/case-study-summary.tsx` — the at-a-glance block. **Create.**
- `src/components/__tests__/case-study-summary.test.tsx` — render test. **Create.**
- `src/app/globals.css` — add `.case-summary*` + `.case-pullquote*` (append only). **Modify.**
- `src/app/work/fresh-greens/page.tsx`, `src/app/work/navi/page.tsx`, `src/app/work/understandingfafsa/page.tsx` — add summary block, add pull-quotes, tighten intros. **Modify.**
- `src/components/fresh-greens.tsx`, `src/components/navi.tsx` — tighten intro copy only where it lives in the component. **Modify (as needed).**

---

## Task 1: CaseStudySummary component

**Files:**
- Create: `src/components/case-study-summary.tsx`
- Test: `src/components/__tests__/case-study-summary.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/case-study-summary.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CaseStudySummary } from "@/components/case-study-summary";

describe("CaseStudySummary", () => {
  it("renders each labelled item as a dt/dd pair", () => {
    render(
      <CaseStudySummary
        problem="Routing ignores whose safety knowledge counts."
        role="Product Designer · Solo build"
        outcome="Shipped, solo."
        stack="React Native · Supabase"
        timeline="2025"
      />,
    );
    expect(screen.getByText("Problem")).toBeInTheDocument();
    expect(screen.getByText("Routing ignores whose safety knowledge counts.")).toBeInTheDocument();
    expect(screen.getByText("Outcome")).toBeInTheDocument();
    expect(screen.getByText("Shipped, solo.")).toBeInTheDocument();
    // semantic: labels are <dt>, values are <dd>
    expect(screen.getByText("Problem").tagName).toBe("DT");
  });
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run: `npx vitest run src/components/__tests__/case-study-summary.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the component**

Create `src/components/case-study-summary.tsx`:

```tsx
type CaseStudySummaryProps = {
  problem: string;
  role: string;
  outcome: string;
  stack: string;
  timeline: string;
};

const ORDER: Array<[keyof CaseStudySummaryProps, string]> = [
  ["problem", "Problem"],
  ["role", "Role"],
  ["outcome", "Outcome"],
  ["stack", "Stack"],
  ["timeline", "Timeline"],
];

export function CaseStudySummary(props: CaseStudySummaryProps) {
  return (
    <dl className="case-summary" aria-label="At a glance">
      {ORDER.map(([key, label]) => (
        <div className="case-summary-row" key={key}>
          <dt className="case-summary-label">{label}</dt>
          <dd className="case-summary-value">{props[key]}</dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 4: Run the test to confirm it passes**

Run: `npx vitest run src/components/__tests__/case-study-summary.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/case-study-summary.tsx src/components/__tests__/case-study-summary.test.tsx
git commit -m "feat: add CaseStudySummary at-a-glance component"
```

---

## Task 2: Summary + pull-quote CSS

**Files:**
- Modify: `src/app/globals.css` (append)

- [ ] **Step 1: Add the styles**

Append to `src/app/globals.css`:

```css
/* ── Case-study at-a-glance summary ─────────────────────────────── */
.case-summary { margin: 1.6rem 0 2.4rem; max-width: 64ch; display: grid; gap: 0.7rem; }
.case-summary-row { display: grid; grid-template-columns: 128px 1fr; gap: 1rem; align-items: baseline; }
@media (max-width: 560px) { .case-summary-row { grid-template-columns: 1fr; gap: 0.15rem; } }
.case-summary-label {
  font-family: var(--font-geist-mono); font-size: 0.72rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); margin: 0;
}
.case-summary-value { margin: 0; color: var(--foreground); font-size: 0.98rem; line-height: 1.5; }

/* ── Case-study pull-quote ──────────────────────────────────────── */
.case-pullquote {
  margin: 2.4rem 0; padding: 0; border: 0; max-width: 30ch;
  font-size: clamp(1.5rem, 3.2vw, 2.1rem); font-weight: 600;
  letter-spacing: var(--track-title); line-height: 1.15; color: var(--foreground);
  text-wrap: balance;
}
```

- [ ] **Step 2: Verify build compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: add case-study summary + pull-quote styles"
```

---

## Task 3: Add the summary block to each case study

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx`, `src/app/work/navi/page.tsx`, `src/app/work/understandingfafsa/page.tsx`

Insert `<CaseStudySummary .../>` after the hero/title block and before the first narrative `section`. Author `problem`, `outcome`, `stack` per study; pull `role`/`timeline` from the copy already on the page. Verify each string against the real content while editing.

- [ ] **Step 1: Fresh Greens**

Import at top of `src/app/work/fresh-greens/page.tsx`:

```tsx
import { CaseStudySummary } from "@/components/case-study-summary";
```

After the hero block, before the first `<section>`:

```tsx
<CaseStudySummary
  problem="Routing engines optimize for time and distance — not for whose safety knowledge counts."
  role="Product Designer · Solo build"
  outcome="Shipped, solo — every route traceable to an auditable source."
  stack="React Native · Supabase · Mapbox"
  timeline="2025"
/>
```

- [ ] **Step 2: Navi**

Import in `src/app/work/navi/page.tsx`, then after the hero:

```tsx
<CaseStudySummary
  problem="NYC tourism defaults to top-ten checklists that bypass the neighborhoods and people who make the city."
  role="UI/UX Designer"
  outcome="78% of concept-test participants preferred neighborhood-led recs over top-ten lists."
  stack="Figma · Research"
  timeline="January–June 2025"
/>
```

- [ ] **Step 3: UnderstandingFAFSA**

Import in `src/app/work/understandingfafsa/page.tsx`, then after the hero:

```tsx
<CaseStudySummary
  problem="A freshly rebranded site left its newsletter looking dated and untrustworthy."
  role="Product Designer"
  outcome="75% lift in open rate after a modular newsletter rebuild."
  stack="Figma · Mailchimp"
  timeline="2025 · Ongoing"
/>
```

- [ ] **Step 4: Verify in the browser**

Load each `/work/<slug>`: the summary block reads in ~5 seconds, sits below the hero, and is visually consistent across all three. Confirm the labels are mono/muted and values are body ink.

- [ ] **Step 5: Verify types + tests**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/*/page.tsx
git commit -m "feat: add at-a-glance summary to each case study"
```

---

## Task 4: Add pull-quotes

**Files:**
- Modify: the three `src/app/work/*/page.tsx` (and `src/components/{fresh-greens,navi}.tsx` if the target line lives there)

Promote one existing sharp line per study to a `<blockquote className="case-pullquote">`. Do **not** write new copy — locate the line already in the prose and set it as the pull-quote (either lift it to a blockquote near its section, or duplicate it as an emphasis landmark and confirm it doesn't read as repetition). Confirm the exact wording against the page before editing.

- [ ] **Step 1: Fresh Greens**

Promote the thesis line (from the hero lede / intro): place near the top of the argument —

```tsx
<blockquote className="case-pullquote">Whose safety knowledge counts when the route is computed?</blockquote>
```

- [ ] **Step 2: Navi**

```tsx
<blockquote className="case-pullquote">Tourism reframed from destination checklists to intentional neighborhood participation.</blockquote>
```

- [ ] **Step 3: UnderstandingFAFSA**

```tsx
<blockquote className="case-pullquote">The newsletter should feel as trustworthy and modern as the newly rebranded website.</blockquote>
```

- [ ] **Step 4: Verify in the browser**

Each study: the pull-quote lands as a visual landmark (large, spaced), does not read as duplicated boilerplate, and respects the 30ch max-width without overflow at mobile.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/*/page.tsx src/components/fresh-greens.tsx src/components/navi.tsx
git commit -m "feat: add pull-quote landmarks to case studies"
```

---

## Task 5: Tighten section intros

**Files:**
- Modify: the three `src/app/work/*/page.tsx` and `src/components/{fresh-greens,navi}.tsx` where section-opening prose lives

Editorial pass guided by a principle, not a fixed script: for each section's opening paragraph, **lead with the claim or result**, cut throat-clearing openers, compress multi-clause sentences, remove sentences that restate the prior section. **Keep every concrete detail and number.** Target: a reader skimming headings + first sentences + pull-quotes + the summary block gets the full arc.

- [ ] **Step 1: Fresh Greens — tighten each section's first paragraph**

For each `section` in `fresh-greens/page.tsx` (and prose in `fresh-greens.tsx`), rewrite the opening sentence to front-load the point. Preserve all data (26+ screens, 300+ a11y attributes, the carve-outs, WCAG references). Diff-review to confirm nothing substantive was cut.

- [ ] **Step 2: Navi — same pass**

Front-load each section opener in `navi/page.tsx` / `navi.tsx`. Preserve the 78% figure, the six-platform evaluation, the heuristic-evaluation detail.

- [ ] **Step 3: UnderstandingFAFSA — same pass**

Front-load each section opener. Preserve the 120-newsletter research, the ~52.6%/75% figures, the modular-template detail.

- [ ] **Step 4: Skim test in the browser**

For each study, read only the headings + first sentence of each section + the pull-quote + the summary. Confirm the full argument still lands. Read top-to-bottom to confirm voice wasn't flattened.

- [ ] **Step 5: Diff review for lost content**

Run `git diff` on each page; confirm no numbers, claims, or evidence were removed — only compression and reordering.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/*/page.tsx src/components/fresh-greens.tsx src/components/navi.tsx
git commit -m "refactor: tighten case-study section intros (front-load the point)"
```

---

## Task 6: Verification

- [ ] **Step 1: Consistency**

All three summary blocks render with identical structure/rhythm; pull-quotes share one treatment.

- [ ] **Step 2: Contrast**

`preview_inspect` `.case-summary-label` and `.case-summary-value` and `.case-pullquote` computed color vs background on both themes; confirm ≥4.5:1.

- [ ] **Step 3: Responsive**

At 375px: summary rows stack (label above value); pull-quotes don't overflow; no horizontal scroll.

- [ ] **Step 4: Suite**

Run: `npx tsc --noEmit && npx vitest run`
Expected: clean.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A
git commit -m "test: verify case-study density layer"
```

---

## Task 7: Impeccable critique + audit (post-implementation)

- [ ] **Step 1: Critique** — Run `/impeccable critique` on one representative case study (`/work/fresh-greens`). Address P0/P1.
- [ ] **Step 2: Audit** — Run `/impeccable audit` on the same (a11y of the `<dl>` and `<blockquote>` semantics, contrast, responsive, and the "numbered/eyebrow" checks against the summary labels).
- [ ] **Step 3: Apply + commit fixes**

```bash
git add -A
git commit -m "fix: address impeccable findings on case-study density"
```

---

## Self-Review Notes (author)

- **Spec coverage:** at-a-glance block → Tasks 1–3; pull-quotes → Task 4; tightened intros → Task 5; consistency/a11y → Tasks 6–7. ✅
- **No structural cut:** every task preserves all sections and all data (Task 5 explicitly diff-reviews for lost content). ✅
- **Independence from Wave A:** summary content authored per page; no shared helper; `globals.css` touches only `.case-*` selectors. ✅
- **Type consistency:** `CaseStudySummary` props `{ problem, role, outcome, stack, timeline }` used identically in Task 1 test and Task 3 usages. ✅
- **Coordinates with Wave 2 (SP4):** the case-study *signature* (spine, section indices, reveals) is Plan C and lands after this; the `CaseStudySummary` adopts the mono-label register there. Not in this plan.
