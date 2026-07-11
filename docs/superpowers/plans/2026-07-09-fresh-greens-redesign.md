# Fresh Greens Case Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. NOTE: several tasks are voice-sensitive copy or visual craft — those carry a **draft → owner approves → apply** loop and are verified in the browser, not by unit tests. Do not dispatch copy/craft tasks to an unsupervised subagent; they need the owner's eye. Mechanical tasks (reorder, asset staging, data files, component scaffolds) are safe to execute normally.

**Goal:** Rebuild the Fresh Greens case study to lead with research, cut its prose ~50% and re-voice it, and add real design-process evidence (an honest synthesis artifact, native token exhibit, custom illustrations, and the Google→distinct pivot journey).

**Architecture:** The case page (`src/app/work/fresh-greens/page.tsx`) is reordered and its sections renamed; three new presentational components (research synthesis, token exhibit, pivot journey) render from local data files; owner-supplied SVG illustrations and pulled Figma screenshots are staged as static assets; copy is rewritten section-by-section against `career-ops/MYLES-WRITING-STYLE.md`. Styles live in `src/app/globals.css` under the existing `.fg-*` namespace.

**Tech Stack:** Next.js 16 / React 19 / TypeScript, Vitest + Testing Library, existing shared components (`RecruiterCut`, `ProjectToc`, `LeadVideo`, `Device3D`), CSS custom-property tokens.

**Spec:** `docs/superpowers/specs/2026-07-09-portfolio-review-feedback-design.md`

**Voice rules (all copy):** no em-dashes / semicolons / ellipses; contractions; Oxford comma; conversational, describe-don't-position; no aphoristic closers or rhetorical Q&A; no hype words. **Anonymity:** no participant names or identifying details (cities, businesses, family specifics) anywhere.

## File structure

- Modify: `src/app/work/fresh-greens/page.tsx` — reorder, retitle, wire components, apply rewritten copy.
- Modify: `src/app/globals.css` — new exhibit styles + bigger-visual layout, `.fg-*` namespace.
- Create: `src/lib/fresh-greens/research-synthesis-data.ts` — anonymized markers + quote snippets.
- Create: `src/components/fresh-greens/research-synthesis.tsx` — the "what I heard → four markers" exhibit.
- Create: `src/lib/fresh-greens/design-tokens.ts` — token values copied from the app repo.
- Create: `src/components/fresh-greens/token-exhibit.tsx` — color/spacing/type reference.
- Create: `src/components/fresh-greens/pivot-journey.tsx` — lo-fi → Google-v1 → distinct exhibit.
- Assets → `public/projects/fresh-greens/process/`: illustrations, marker glyphs, lo-fi, pivot screenshots.

---

### Task 1: Stage the process assets

**Files:**
- Create: `public/projects/fresh-greens/process/` (illustrations, glyphs, lo-fi, pivot shots)

- [ ] **Step 1: Create the directory and stage owner assets**

```bash
cd /Users/mylesashitey/myles-portfolio-migration
mkdir -p public/projects/fresh-greens/process
# custom onboarding illustrations (owner-supplied SVG on Desktop)
cp "/Users/mylesashitey/Desktop/Artboard 2.svg" public/projects/fresh-greens/process/onboarding-illustrations.svg
```

- [ ] **Step 2: Export the four custom marker glyphs from the thesis Figma**

Use the Figma MCP `get_screenshot` on file `7DDh6c7tk7OKF4WiA7pEkp` for the marker-glyph nodes (sheriff/streetlamp/cone/deer), save each to `public/projects/fresh-greens/process/glyph-{police,light,road,wildlife}.png`. If node ids are unknown, call `get_metadata` on `0:1` first to find them. Alternatively, if the glyphs exist as SVG in the app repo (`/Users/mylesashitey/code/fresh-greens/theme/marker-glyph.ts` references them), export from there.

- [ ] **Step 3: Stage the pivot screenshots + lo-fi**

Save the two Figma overview PNGs already pulled (Google-plugin v1 from file `kXEfURrS7eliCfVukWkhbI`, and the distinct build from `7DDh6c7tk7OKF4WiA7pEkp`) as `process/pivot-google-v1.png` and `process/pivot-distinct.png`. Save the owner's lo-fi wireframe image as `process/lofi-wireframes.png`.

- [ ] **Step 4: Commit**

```bash
git add public/projects/fresh-greens/process/
git commit -m "chore: stage Fresh Greens process assets (illustrations, glyphs, pivot, lo-fi)"
```

---

### Task 2: Reorder sections + rename titles

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx` (ProjectToc, section order, h2 titles, aria ids)
- Test: `src/app/work/fresh-greens/__tests__/section-order.test.tsx`

Target order + titles (from spec A1):
1. `fg-problem` — **The problem I set out to solve**
2. `fg-research` — **Listening to six drivers**
3. `fg-scoring` — **How routes get scored**
4. `fg-pulled-over` — **Designing for the pulled-over moment**
5. `fg-typecolor` — **Type and color**
6. `fg-color` — **The reserved color system**
7. `fg-trust` — **Keeping community reports trustworthy**
8. `fg-scope` — **What shipped, and what didn't**

- [ ] **Step 1: Write a failing test for the new ProjectToc order**

Create `src/app/work/fresh-greens/__tests__/section-order.test.tsx`:

```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import FreshGreensPage from "@/app/work/fresh-greens/page";

describe("Fresh Greens section order", () => {
  it("leads with problem then research", async () => {
    const ui = await FreshGreensPage();
    const { container } = render(ui);
    const ids = [...container.querySelectorAll("section[aria-labelledby]")].map(
      (s) => s.getAttribute("aria-labelledby"),
    );
    expect(ids.slice(0, 3)).toEqual(["fg-problem", "fg-research", "fg-scoring"]);
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** — `npx vitest run src/app/work/fresh-greens/__tests__/section-order.test.tsx` (current ids are `fg-argument`, `fg-pipeline`, …).

- [ ] **Step 3: Reorder the `<section>` blocks** in `page.tsx` to the target order, move the existing "Six interviews" (research) content to slot 2, rename each `id`/`aria-labelledby`/`<h2>` per the table, and update the `ProjectToc` `sections` array to match (title + id). Update `RecruiterCut` if it references old anchors. Keep all body content for now (copy rewrite is Task 8).

- [ ] **Step 4: Run test, expect PASS.** Also `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** — `git commit -am "refactor: Fresh Greens research-led order + plain titles"`

---

### Task 3: Research synthesis data (anonymized)

**Files:**
- Create: `src/lib/fresh-greens/research-synthesis-data.ts`
- Test: `src/lib/fresh-greens/__tests__/research-synthesis-data.test.ts`

- [ ] **Step 1: Write the failing test** (guards the anonymized shape + no names):

```ts
import { describe, it, expect } from "vitest";
import { SYNTHESIS, FEATURE_REQUESTS } from "@/lib/fresh-greens/research-synthesis-data";

describe("research synthesis data", () => {
  it("has the four markers plus the community cluster", () => {
    expect(SYNTHESIS.map((s) => s.key)).toEqual([
      "light", "police", "wildlife", "road", "community",
    ]);
  });
  it("every cluster cites how many of six raised it, and 2+ snippets", () => {
    for (const s of SYNTHESIS) {
      expect(s.raisedBy).toBeGreaterThanOrEqual(1);
      expect(s.raisedBy).toBeLessThanOrEqual(6);
      expect(s.snippets.length).toBeGreaterThanOrEqual(2);
    }
  });
  it("pairs verbatim requests to shipped features", () => {
    expect(FEATURE_REQUESTS.length).toBeGreaterThanOrEqual(3);
  });
});
```

- [ ] **Step 2: Run it, expect FAIL** (module missing).

- [ ] **Step 3: Create the data file** with the anonymized, paraphrased trends (no names, no cities):

```ts
// Anonymized synthesis from six driver interviews. Names and identifying
// details are deliberately stripped; snippets are lightly paraphrased.
export type Cluster = {
  key: "light" | "police" | "wildlife" | "road" | "community";
  label: string;
  raisedBy: number; // of six
  insight: string;
  snippets: string[];
};

export const SYNTHESIS: Cluster[] = [
  {
    key: "light",
    label: "Light",
    raisedBy: 6,
    insight: "People time trips around daylight and read lighting as safety.",
    snippets: [
      "Always leaving in the morning.",
      "I wouldn't feel comfortable driving at night.",
      "The street lights were sparse.",
    ],
  },
  {
    key: "police",
    label: "Police presence",
    raisedBy: 5,
    insight: "Police proximity is a live fear, managed with taught behaviors.",
    snippets: [
      "Biggest fear is interacting with police.",
      "If the app said there's cops here, we're going around that.",
      "Wallet out, phone out, everything visible.",
    ],
  },
  {
    key: "wildlife",
    label: "Wildlife",
    raisedBy: 3,
    insight: "Deer at dusk reroute people off certain roads after dark.",
    snippets: [
      "Deer at night, so I'd avoid those roads once evening hit.",
      "Deer-heavy areas.",
    ],
  },
  {
    key: "road",
    label: "Road conditions",
    raisedBy: 5,
    insight: "Road size, quality, and flooding change the route people pick.",
    snippets: [
      "Narrow backroads that can't fit two cars.",
      "A lot of places get flooded.",
      "I cared about road size and road quality.",
    ],
  },
  {
    key: "community",
    label: "Community knowledge",
    raisedBy: 5,
    insight:
      "Drivers trust people over institutions. This is why community reports carry weight in the routing.",
    snippets: [
      "I'd listen to family over the statistic. The powers that be aren't honest.",
      "For a new area I'd ask friends who'd been there.",
      "I'd call someone who's already at the spot.",
    ],
  },
];

// Drivers who, unprompted, described features Fresh Greens went on to ship.
export type FeatureRequest = { asked: string; became: string };
export const FEATURE_REQUESTS: FeatureRequest[] = [
  {
    asked: "Show the gradient of light, bright where you are and dark where you arrive, your projected light coverage.",
    became: "The daylight-graded route.",
  },
  {
    asked: "Poor road conditions highlighted along the route.",
    became: "The road-conditions marker.",
  },
  {
    asked: "If the app said there's cops here, we're going around that.",
    became: "Police presence in the route score.",
  },
];
```

- [ ] **Step 4: Run test, expect PASS.**

- [ ] **Step 5: OWNER CHECK** — surface the snippets to the owner to confirm they read true and carry no identifying detail. Apply edits, re-run test.

- [ ] **Step 6: Commit** — `git add src/lib/fresh-greens/research-synthesis-data.ts src/lib/fresh-greens/__tests__/research-synthesis-data.test.ts && git commit -m "feat: anonymized Fresh Greens research synthesis data"`

---

### Task 4: Research synthesis component + styles

**Files:**
- Create: `src/components/fresh-greens/research-synthesis.tsx`
- Modify: `src/app/globals.css` (`.fg-synth*`)
- Modify: `src/app/work/fresh-greens/page.tsx` (render it in the research section)

- [ ] **Step 1: Build the component** — an accessible board: each `Cluster` is a `<button>`/`<details>` that reveals its snippets + "raised by N of 6"; below it the `FEATURE_REQUESTS` as an "unprompted, they asked for it" row. Server component with a small client wrapper only if interaction is added. Render the lo-fi image (`process/lofi-wireframes.png`) beside it via `next/image` with a caption "Last lo-fi pass. The layered route stroke here got simplified for the small-screen glance." Import `SYNTHESIS`, `FEATURE_REQUESTS`.

```tsx
import Image from "next/image";
import { SYNTHESIS, FEATURE_REQUESTS } from "@/lib/fresh-greens/research-synthesis-data";

export function ResearchSynthesis() {
  return (
    <div className="fg-synth" aria-label="What the interviews surfaced">
      <ul className="fg-synth-clusters" role="list">
        {SYNTHESIS.map((c) => (
          <li key={c.key} className={`fg-synth-cluster fg-synth-cluster--${c.key}`}>
            <p className="fg-synth-label">{c.label}</p>
            <p className="fg-synth-count">{c.raisedBy} of 6 raised it</p>
            <p className="fg-synth-insight">{c.insight}</p>
            <ul className="fg-synth-snippets" role="list">
              {c.snippets.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div className="fg-synth-asked">
        <p className="fg-synth-asked-label">They asked for it, unprompted</p>
        <ul role="list">
          {FEATURE_REQUESTS.map((r) => (
            <li key={r.became}>
              <span className="fg-synth-asked-quote">{r.asked}</span>
              <span className="fg-synth-asked-became">{r.became}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add `.fg-synth*` styles** to `globals.css` (grid of clusters, muted snippet type, an accent per marker keyed to the reserved colors; the "asked → became" as a two-column list). Keep on the warm-paper surface.

- [ ] **Step 3: Wire it** into the `fg-research` section in `page.tsx`, after the section lead.

- [ ] **Step 4: Browser-verify** (dev server): synthesis renders, clusters + counts + asked-row present, lo-fi image loads, no overflow at 375/768, no console errors.

- [ ] **Step 5: Commit** — `git commit -am "feat: Fresh Greens research synthesis exhibit"`

---

### Task 5: Design-token exhibit (color / spacing / type)

**Files:**
- Create: `src/lib/fresh-greens/design-tokens.ts` (values copied from the app repo)
- Create: `src/components/fresh-greens/token-exhibit.tsx`
- Modify: `src/app/globals.css` (`.fg-tokens*`), `page.tsx` (render in `fg-typecolor`)

- [ ] **Step 1: Copy the real token values** into `design-tokens.ts` (source: `/Users/mylesashitey/code/fresh-greens/theme/{colors,spacing,typography,radii}.ts`):

```ts
export const COLOR_TOKENS = [
  { name: "freshgreen", hex: "#41AD49", role: "primary CTA, in-flow links" },
  { name: "wiltedgreen", hex: "#326936", role: "secondary CTA, headers" },
  { name: "burntgreen", hex: "#003F04", role: "deep accents" },
  { name: "orange", hex: "#FF9500", role: "hazard" },
  { name: "red", hex: "#FF3B30", role: "alert" },
  { name: "yellow", hex: "#FFCC00", role: "caution" },
  { name: "navy", hex: "#041E49", role: "safety affordances" },
  { name: "surfacePage", hex: "#F4F4ED", role: "page, warm paper" },
  { name: "surfaceCard", hex: "#FEFDFB", role: "card surface" },
] as const;
export const SPACING_TOKENS = [
  { name: "xs", px: 4 }, { name: "sm", px: 8 }, { name: "md", px: 16 },
  { name: "lg", px: 24 }, { name: "xl", px: 32 }, { name: "xxl", px: 48 },
] as const;
```

- [ ] **Step 2: Build `TokenExhibit`** — three lanes: color swatches (chip + name + hex + role), the spacing ramp (bars whose widths equal the px values), and a short type/radii note. All from the data above.

- [ ] **Step 3: Add `.fg-tokens*` styles.** Swatches as a responsive grid; spacing bars proportional; no external UI, pure tokens.

- [ ] **Step 4: Wire into `fg-typecolor`**, with a one-line caption that surfaces the real maturity story: "The spacing scale started implicit and drifted to stragglers at 5, 6, 13, 18. I made the 4pt ramp explicit so drift was easy to flag."

- [ ] **Step 5: Browser-verify + commit** — `git commit -am "feat: Fresh Greens native design-token exhibit"`

---

### Task 6: Pivot-journey exhibit (how I decided)

**Files:**
- Create: `src/components/fresh-greens/pivot-journey.tsx`
- Modify: `globals.css` (`.fg-pivot*`), `page.tsx` (render early in the design sections, e.g. start of `fg-scoring` or a short beat after research)

- [ ] **Step 1: Build `PivotJourney`** — a small three-step visual: lo-fi sketch → Google-plugin v1 → the distinct build, using the staged `process/` images, each with a one-line caption tracing the reasoning (borrowed mental model → limiting → built something distinct with its own iconography). `next/image`.

- [ ] **Step 2: Add `.fg-pivot*` styles** (three framed shots in a row on desktop, stacked on mobile, captions beneath).

- [ ] **Step 3: Wire it in + browser-verify + commit** — `git commit -am "feat: Fresh Greens Google-to-distinct pivot exhibit"`

---

### Task 7: Bigger visuals + custom illustrations

**Files:**
- Modify: `globals.css` (enlarge `.fg-*` figure widths, reduce Device3D shrink), `page.tsx` (render onboarding illustrations)

- [ ] **Step 1: Enlarge the screen figures** — bump the key `ExpandableImage`/figure widths toward full column width; reserve `Device3D` for one or two hero moments (en-route, route-preview) and render the rest as larger flat screens. Verify no overflow at 375/768.

- [ ] **Step 2: Render the custom onboarding illustrations** (`process/onboarding-illustrations.svg`) in `fg-typecolor` as a strip, captioned as your own illustration work. Marker glyphs rendered inline where the four markers are introduced (in `fg-scoring`).

- [ ] **Step 3: Browser-verify + commit** — `git commit -am "feat: bigger Fresh Greens visuals + custom illustrations"`

---

### Task 8: Copy rewrite — cut ~50% + re-voice (collaborative)

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx` (all eight section bodies + leads)

This is the voice-sensitive workstream. **It is a draft → owner-approve → apply loop per section, verified by reading, not unit tests.** Target: FG total prose from ~1,475 words to ~740, tightening each section in place. Hold every paragraph to the writing guide.

- [ ] **Step 1 (per section, 1-8):** Draft the tightened + re-voiced copy for that section: cut to ~half, contractions, no em-dashes/semicolons/ellipses, describe-don't-position, no aphoristic closers. Preserve the load-bearing facts (four markers, the pipeline/equal-weighting, WCAG dash rationale, the toolkit scale-back, honest scope). Add the decision-rationale line where relevant ("tried Jost then Space Grotesk, landed on Libre Franklin because…").

- [ ] **Step 2 (per section):** Show the draft to the owner. Apply edits.

- [ ] **Step 3 (per section):** Apply to `page.tsx`. Run `grep -nE "—|--|;|\.\.\." ` over the section and confirm only `&apos;`/`&mdash;`-free content.

- [ ] **Step 4:** After all eight, measure: rough word count of FG prose ≈ 740 (± 15%). `npx tsc --noEmit` clean.

- [ ] **Step 5: Commit** — `git commit -am "feat: Fresh Greens copy cut ~50% and re-voiced to the writing guide"`

---

### Task 9: LeadVideo placeholders for the real app

**Files:**
- Modify: `page.tsx` (wire `LeadVideo`/`LeadMedia` clip slots for four flows)

- [ ] **Step 1: Add `LeadVideo` slots** (per `src/components/lead-video.tsx` API) for: zone-entry route stroke, hold-to-call-911, daylight-graded route, active nav. Point `clip` at `process/clip-{zone,emergency,daylight,active}.mp4` (files arrive later from the owner) and set the existing high-res screen PNG as the `poster`, so the slot renders the poster gracefully until the clip lands.

- [ ] **Step 2: Verify** the posters render with no broken-video state when the mp4 is absent (LeadVideo falls back to poster under reduced-motion / missing source). Commit — `git commit -am "feat: wire Fresh Greens app-recording slots (posters until clips land)"`

---

### Task 10: Verification + /impeccable

- [ ] **Step 1:** `npx vitest run` (all green, incl. new section-order + synthesis-data tests) and `npx tsc --noEmit` clean.
- [ ] **Step 2: Browser pass** — new order (problem → research → …), synthesis exhibit interaction, token exhibit, pivot exhibit, bigger visuals, illustrations, LeadVideo posters. No console errors, no overflow at 375/768, reduced-motion paths intact.
- [ ] **Step 3: Voice + anonymity audit** — grep the FG page for `—`, `;`, `...`; read for aphoristic closers/positioning; confirm no participant name or identifying detail anywhere in the synthesis.
- [ ] **Step 4: `/impeccable typeset` then `critique` + `audit`** on `src/app/work/fresh-greens/page.tsx`. Fix P0/P1 in-branch; log P2/P3.

---

## Self-review notes

- **Spec coverage:** A1 → Task 2. A2 → Task 8. A3 → Tasks 3-4. A4 → Task 7 (illustrations) + Task 1 (glyphs). A5 → Task 5 (tokens) + Task 6 (pivot/decision) + Task 8 (rationale lines). A6 → Task 7. A7 → Task 9. Verification → Task 10.
- **Collaborative tasks** (3 owner-check, 8 copy) are intentionally not pure-mechanical; flagged for inline execution with the owner.
- **Owner-produced asset** (app recordings) is non-blocking — Task 9 renders posters until clips arrive.
- **No fabricated research** anywhere; synthesis is anonymized real data (Task 3).
