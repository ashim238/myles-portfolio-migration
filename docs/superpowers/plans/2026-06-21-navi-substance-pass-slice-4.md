# Navi Substance Pass — Slice 4: Impact Ledger + Photo Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/work/navi/demo/impact` ledger that groups every experience by the kind of regenerative outcome its bookings fund, make `ImpactSignal` link into that page where it is not already inside a card anchor, and give every listing a fuller photo gallery (thin listings to at least three, feed heroes to five).

**Architecture:** A new `impactTheme` field on each `Experience` (one-time data migration) drives a pure `getImpactSummary()` helper in a new `src/lib/navi/impact.ts` module. The impact page is a server component that maps the summary into `ImpactThemeSection`s. `ImpactSignal` gains an opt-in `href` prop and renders as a `next/link` only when given one, so the existing in-card signals (inside the full-card `ExperienceCard`/`ResultCard` anchors) stay plain and HTML stays valid. Photo expansion is an asset task: source one more photo per thin listing from the Unsplash API, store it under `/public/projects/navi-demo/`, and update both `demo-data.ts` and the README attribution list.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, vitest + @testing-library/react (jsdom), Leaflet via `next/dynamic`, Unsplash Search API (runtime only, key never committed).

---

## Voice and project constraints (apply to every task)

- No em-dashes (—). Use commas, colons, periods, or parentheses. No `--` runs in prose. No semicolons in prose. No ellipses. Contractions throughout.
- Banned words anywhere in copy: `passionate about`, `leveraged`, `spearheaded`, `remarkable`, `innovative`, `world-class`, `seamless`, `cutting-edge`, `best-in-class`.
- The TikTok case study stays hidden. Do not surface it in nav, reviews, or copy.
- Never commit `skill-observations/` or `.impeccable/critique/`.
- Never commit the Unsplash API key. It is supplied at runtime via the `UNSPLASH_ACCESS_KEY` environment variable (see Task 5). The key in session memory is flagged for rotation and will be deleted after this slice.
- Every commit message ends with a blank line then exactly:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`
- PR comments/bodies end with `🤖 Generated with Claude Code.`

## Scope decisions (documented up front)

1. **`ImpactSignal` href is opt-in, not universal.** The spec line "every `ImpactSignal` on the site links to the impact page" cannot apply to the signals rendered inside `ExperienceCard` and `ResultCard`, because both are full-card `<Link>`s and a nested `<a>` is invalid HTML. The `href` is therefore wired only where the signal is not inside another anchor: the experience detail page (the "Learn" section signal) and the `BookingCard`. The signals on the impact page itself also stay unlinked (they are already on the destination).
2. **Photo expansion: every listing gets at least 3 photos, with no upper cap.** The floor is three so the gallery carousel always has something to cycle. Beyond the floor, high-traffic experiences (the feed heroes on `/work/navi/demo`) are brought up to five photos where strong, relevant images exist. There is no fixed 3-photo limit (per user direction during Slice 4). Picks remain judgment calls: only add a photo when it genuinely fits the listing.
3. **GalleryCarousel and PillRow are already shipped (Slice 1).** Slice 4 is impact ledger plus photos only.

## File structure

- `src/lib/navi/demo-data.ts` — add `ImpactTheme` union type and an `impactTheme` field on all 37 experiences (Task 1). Photo arrays for 9 listings updated (Task 5).
- `src/lib/navi/impact.ts` — NEW. Theme display metadata (`IMPACT_THEMES`) and the pure `getImpactSummary()` helper (Task 2).
- `src/lib/navi/__tests__/impact.test.ts` — NEW. Covers the field migration and the helper (Tasks 1 and 2).
- `src/app/work/navi/(minisite)/demo/impact/page.tsx` — NEW. `ImpactPage` default export plus exported pure `ImpactView` (Task 3).
- `src/components/navi/demo/ImpactThemeSection.tsx` — NEW. One theme block (Task 3).
- `src/components/navi/demo/__tests__/impact-page.test.tsx` — NEW (Task 3).
- `src/components/navi/ui/ImpactSignal.tsx` — add optional `href` (Task 4).
- `src/components/navi/ui/__tests__/ImpactSignal.test.tsx` — add link test (Task 4).
- `src/components/navi/demo/BookingCard.tsx` — accept and forward `impactHref` (Task 4).
- `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx` — wire the two signal hrefs (Task 4).
- `src/components/navi/chrome/NaviFooter.tsx` — add the impact-page footer link (Task 4).
- `src/components/navi/chrome/__tests__/NaviFooter.test.tsx` — update if it asserts the link list (Task 4).
- `src/app/globals.css` — append `.nv-impact-*` block (Task 3); `.nv-impact--link` rule (Task 4).
- `public/projects/navi-demo/*.jpg` + `public/projects/navi-demo/README.md` — new photos and attribution (Task 5).

---

## Task 1: Add the `impactTheme` field to every experience

**Files:**
- Modify: `src/lib/navi/demo-data.ts`
- Create: `src/lib/navi/__tests__/impact.test.ts`

The five themes (from the spec, no invented themes):

| theme id | meaning |
| --- | --- |
| `heritage` | neighborhood preservation, oral histories, archives |
| `education` | STEM, arts education, youth and free programming |
| `food-security` | community kitchens, gardens, food sovereignty |
| `environment` | parks, waterways, urban ecology, waste reduction |
| `arts-funding` | galleries, makers, performing arts |

The full slug → theme assignment (derived by reading each `impactStatement`):

```
heritage (9):
  dumbo-industrial-architecture-walk
  bedstuy-soul-food-cooking
  harlem-brownstone-walking-tour
  astoria-greek-baking
  bronx-bodega-heritage-tour
  chinatown-immigration-history-walk
  harlem-jazz-history-session
  coney-island-boardwalk-evening
  lower-east-side-film-locations-walk

education (5):
  flushing-cultural-center-potluck
  inwood-hill-sunrise-yoga
  harlem-riverside-run-club
  long-island-city-bouldering-intro
  astoria-puppet-making-afternoon

food-security (4):
  sunset-park-night-market
  lower-east-side-community-garden
  flushing-dumpling-crawl
  jackson-heights-south-asian-food-walk

environment (11):
  prospect-park-carriage
  van-cortlandt-birding-walk
  bronx-river-foraging-walk
  greenpoint-makers-sunday-flea
  sunset-park-handball-pickup
  inwood-forest-story-walk
  queensboro-bridge-golden-hour-walk
  south-street-schooner-sail
  newtown-creek-sunset-kayak
  east-village-vintage-crawl
  lower-east-side-mending-workshop

arts-funding (8):
  dancehall-brooklyn-junction
  bedstuy-bracelet-making
  greenpoint-mural-walk
  harlem-live-jazz-night
  chelsea-gallery-hop
  lower-east-side-artist-run-spaces
  bronx-street-art-gallery-tour
  ridgewood-ceramics-studio-open-house
```

- [ ] **Step 1: Write the failing test**

Create `src/lib/navi/__tests__/impact.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { EXPERIENCES, type ImpactTheme } from "@/lib/navi/demo-data";

const THEMES: ImpactTheme[] = [
  "heritage",
  "education",
  "food-security",
  "environment",
  "arts-funding",
];

describe("impactTheme migration", () => {
  it("gives every experience a valid impactTheme", () => {
    for (const e of EXPERIENCES) {
      expect(THEMES).toContain(e.impactTheme);
    }
  });

  it("assigns the expected count to each theme", () => {
    const counts = THEMES.reduce<Record<string, number>>((acc, t) => {
      acc[t] = EXPERIENCES.filter((e) => e.impactTheme === t).length;
      return acc;
    }, {});
    expect(counts).toEqual({
      heritage: 9,
      education: 5,
      "food-security": 4,
      environment: 11,
      "arts-funding": 8,
    });
  });

  it("covers all 37 experiences with no theme empty", () => {
    expect(EXPERIENCES).toHaveLength(37);
    for (const t of THEMES) {
      expect(EXPERIENCES.some((e) => e.impactTheme === t)).toBe(true);
    }
  });
});
```

- [ ] **Step 2: Run the test, confirm it fails**

Run: `npx vitest run src/lib/navi/__tests__/impact.test.ts`
Expected: FAIL (no `ImpactTheme` export, and `e.impactTheme` does not exist).

- [ ] **Step 3: Add the `ImpactTheme` type and the field to the `Experience` type**

In `src/lib/navi/demo-data.ts`, immediately above the `export type Experience = {` declaration, add:

```ts
export type ImpactTheme =
  | "heritage"
  | "education"
  | "food-security"
  | "environment"
  | "arts-funding";
```

Then inside the `Experience` type, add the field right after `impactStatement: string;`:

```ts
  impactTheme: ImpactTheme;
```

- [ ] **Step 4: Add `impactTheme` to all 37 experience objects**

For each experience object in `EXPERIENCES`, add an `impactTheme:` line. Place it directly after that object's `impactStatement:` value, using the slug → theme table above. Example for the first entry (`prospect-park-carriage`, which is `environment`):

```ts
    impactStatement:
      "A share of every ride funds the Prospect Park Alliance's tree care program, which maintains the park's 30,000 trees year-round.",
    impactTheme: "environment",
```

Apply the correct theme to every one of the 37 objects. Use the table verbatim. Do not change any other field.

- [ ] **Step 5: Run the test, confirm it passes**

Run: `npx vitest run src/lib/navi/__tests__/impact.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0. (The new required field will surface any experience object you missed as a type error. Fix any flagged object.)

- [ ] **Step 7: Commit**

```bash
git add src/lib/navi/demo-data.ts src/lib/navi/__tests__/impact.test.ts
git commit -m "$(cat <<'EOF'
feat(navi-demo): tag every experience with an impactTheme

Add an ImpactTheme union and an impactTheme field to all 37
experiences, assigned by reading each existing impactStatement and
matching it to the closest of the five themes. This is the data
foundation for the impact ledger page.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: `getImpactSummary()` helper and theme metadata

**Files:**
- Create: `src/lib/navi/impact.ts`
- Modify: `src/lib/navi/__tests__/impact.test.ts`

- [ ] **Step 1: Write the failing test (append to the existing impact test file)**

Add these imports at the top of `src/lib/navi/__tests__/impact.test.ts` (merge with the existing import line from `@/lib/navi/demo-data`):

```ts
import { IMPACT_THEMES, getImpactSummary } from "@/lib/navi/impact";
```

Then append this describe block to the file:

```ts
describe("getImpactSummary", () => {
  it("returns one section per theme in declared order", () => {
    const summary = getImpactSummary();
    expect(summary.map((s) => s.id)).toEqual([
      "heritage",
      "education",
      "food-security",
      "environment",
      "arts-funding",
    ]);
  });

  it("gives each section a human label and its theme anchor", () => {
    const summary = getImpactSummary();
    const heritage = summary.find((s) => s.id === "heritage");
    expect(heritage?.label).toBe("Heritage preservation");
    expect(heritage?.anchor).toBe("heritage");
  });

  it("puts every experience in exactly one section", () => {
    const summary = getImpactSummary();
    const total = summary.reduce((n, s) => n + s.experiences.length, 0);
    expect(total).toBe(EXPERIENCES.length);
  });

  it("section experiences all share the section theme", () => {
    for (const s of getImpactSummary()) {
      for (const e of s.experiences) {
        expect(e.impactTheme).toBe(s.id);
      }
    }
  });

  it("IMPACT_THEMES has five entries with id and label", () => {
    expect(IMPACT_THEMES).toHaveLength(5);
    for (const t of IMPACT_THEMES) {
      expect(typeof t.id).toBe("string");
      expect(t.label.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test, confirm it fails**

Run: `npx vitest run src/lib/navi/__tests__/impact.test.ts`
Expected: FAIL (cannot resolve `@/lib/navi/impact`).

- [ ] **Step 3: Create the impact module**

Create `src/lib/navi/impact.ts`:

```ts
import { EXPERIENCES, type Experience, type ImpactTheme } from "@/lib/navi/demo-data";

export type ImpactThemeMeta = {
  id: ImpactTheme;
  label: string;
  anchor: string;
};

// Declared order is the page order. Anchor equals id so cross-links can
// target /work/navi/demo/impact#<id>.
export const IMPACT_THEMES: ImpactThemeMeta[] = [
  { id: "heritage", label: "Heritage preservation", anchor: "heritage" },
  { id: "education", label: "Education and youth programs", anchor: "education" },
  { id: "food-security", label: "Food security", anchor: "food-security" },
  { id: "environment", label: "Environment and ecology", anchor: "environment" },
  { id: "arts-funding", label: "Arts funding", anchor: "arts-funding" },
];

export type ImpactSection = ImpactThemeMeta & {
  experiences: Experience[];
};

// Groups every experience under its theme, in IMPACT_THEMES order. Pure:
// derived entirely from EXPERIENCES, stable across calls.
export function getImpactSummary(): ImpactSection[] {
  return IMPACT_THEMES.map((theme) => ({
    ...theme,
    experiences: EXPERIENCES.filter((e) => e.impactTheme === theme.id),
  }));
}
```

- [ ] **Step 4: Run the test, confirm it passes**

Run: `npx vitest run src/lib/navi/__tests__/impact.test.ts`
Expected: PASS (8 tests total in the file now).

- [ ] **Step 5: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/lib/navi/impact.ts src/lib/navi/__tests__/impact.test.ts
git commit -m "$(cat <<'EOF'
feat(navi-demo): getImpactSummary helper and theme metadata

Add src/lib/navi/impact.ts with the ordered IMPACT_THEMES metadata
(id, label, anchor) and a pure getImpactSummary that groups every
experience under its theme in page order. Foundation for the impact
ledger page and the ImpactSignal cross-links.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: The impact ledger page

**Files:**
- Create: `src/components/navi/demo/ImpactThemeSection.tsx`
- Create: `src/app/work/navi/(minisite)/demo/impact/page.tsx`
- Create: `src/components/navi/demo/__tests__/impact-page.test.tsx`
- Modify: `src/app/globals.css`

Context: `ExperienceCard` is imported from `@/components/navi/demo/ExperienceCard`, props `{ experience, href }`, whole card is `a.nv-exp-card`. `ImpactSignal` is imported from `@/components/navi/ui`, props `{ children, as?, href? }` (the `href` lands in Task 4; for this task call it without `href`). Reuse the global `.nv-feed-grid` for the per-theme grids. The page is a server component (no `"use client"`).

- [ ] **Step 1: Write the failing test**

Create `src/components/navi/demo/__tests__/impact-page.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImpactView } from "@/app/work/navi/(minisite)/demo/impact/page";
import { getImpactSummary } from "@/lib/navi/impact";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Impact ledger page", () => {
  it("renders the page heading and a methodology paragraph", () => {
    render(<ImpactView />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Where bookings go" }),
    ).toBeInTheDocument();
    // methodology names what is NOT measured
    expect(screen.getByText(/experiences, not dollars/i)).toBeInTheDocument();
  });

  it("renders one section per theme with its label and anchor id", () => {
    render(<ImpactView />);
    for (const section of getImpactSummary()) {
      const heading = screen.getByRole("heading", { level: 2, name: section.label });
      expect(heading).toHaveAttribute("id", section.anchor);
    }
  });

  it("states the contributing-experience count per theme", () => {
    render(<ImpactView />);
    const heritage = getImpactSummary().find((s) => s.id === "heritage");
    if (!heritage) throw new Error("fixture: heritage section missing");
    const region = screen.getByRole("region", { name: heritage.label });
    expect(
      within(region).getByText(
        new RegExp(`${heritage.experiences.length} experiences contribute`),
      ),
    ).toBeInTheDocument();
  });

  it("renders one experience card per experience across all sections", () => {
    const { container } = render(<ImpactView />);
    const cards = container.querySelectorAll("a.nv-exp-card");
    expect(cards.length).toBe(EXPERIENCES.length);
  });
});
```

- [ ] **Step 2: Run the test, confirm it fails**

Run: `npx vitest run src/components/navi/demo/__tests__/impact-page.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Create the `ImpactThemeSection` component**

Create `src/components/navi/demo/ImpactThemeSection.tsx`:

```tsx
import { ImpactSignal } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import type { ImpactSection } from "@/lib/navi/impact";

export function ImpactThemeSection({ section }: { section: ImpactSection }) {
  const count = section.experiences.length;
  return (
    <section aria-labelledby={`${section.anchor}-heading`} className="nv-impact-theme">
      <h2 id={section.anchor} className="nv-impact-theme-head">
        {section.label}
      </h2>
      {/* visually-hidden duplicate so the region's accessible name is the label,
          while the visible heading carries the cross-link anchor id */}
      <span id={`${section.anchor}-heading`} hidden>
        {section.label}
      </span>
      <p className="nv-impact-count">
        {count} {count === 1 ? "experience contributes" : "experiences contribute"}
      </p>
      <ul className="nv-impact-statements" aria-label={`What ${section.label} bookings fund`}>
        {section.experiences.map((e) => (
          <li key={e.slug}>
            <ImpactSignal as="div">{e.impactStatement}</ImpactSignal>
          </li>
        ))}
      </ul>
      <ul className="nv-feed-grid" aria-label={`${section.label} experiences`}>
        {section.experiences.map((e) => (
          <li key={e.slug}>
            <ExperienceCard
              experience={e}
              href={`/work/navi/demo/experience/${e.slug}`}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Note on the region name: `aria-labelledby` points at the hidden `span` carrying the label text, so `getByRole("region", { name: section.label })` resolves. The visible `<h2>` keeps `id={section.anchor}` so `/impact#heritage` scrolls to it.

- [ ] **Step 4: Create the page**

Create `src/app/work/navi/(minisite)/demo/impact/page.tsx`:

```tsx
import { ImpactThemeSection } from "@/components/navi/demo/ImpactThemeSection";
import { getImpactSummary } from "@/lib/navi/impact";

export default function ImpactPage() {
  return <ImpactView />;
}

export function ImpactView() {
  const summary = getImpactSummary();
  return (
    <article className="nv-impact-page">
      <header className="nv-impact-intro">
        <h1>Where bookings go</h1>
        <p>
          Every Navi experience commits to one regenerative outcome. This ledger
          groups those commitments by theme so you can see where bookings
          concentrate. A few honest caveats: the counts here are experiences, not
          dollars, and there are no revenue figures in this view. Each theme
          reflects what a host says a booking supports, not an audited result.
          The point is to show the pattern, not to sell it.
        </p>
      </header>
      {summary.map((section) => (
        <ImpactThemeSection key={section.id} section={section} />
      ))}
      <footer className="nv-impact-method">
        <h2>How we count this</h2>
        <p>
          Themes are assigned by reading each host's stated commitment and
          matching it to the closest category. No experience appears in more than
          one theme, and we don't invent themes to fill a section.
        </p>
      </footer>
    </article>
  );
}
```

- [ ] **Step 5: Run the test, confirm it passes**

Run: `npx vitest run src/components/navi/demo/__tests__/impact-page.test.tsx`
Expected: PASS (4 tests). If the methodology assertion fails, confirm the paragraph contains the exact phrase "experiences, not dollars".

- [ ] **Step 6: Append the CSS block**

Find the end of the neighborhood CSS block: `grep -n 'nv-neighborhood-host:focus-visible' src/app/globals.css`. After that rule's closing brace, append:

```css
/* ── Impact ledger page ─────────────────────────────────────── */
.nv-impact-page {
  max-width: 1040px;
  margin: 0 auto;
  padding: var(--nv-sp-lg);
  display: grid;
  gap: var(--nv-sp-2xl);
}
.nv-impact-intro { display: grid; gap: var(--nv-sp-sm); max-width: 70ch; }
.nv-impact-intro h1 { margin: 0; font-size: 2.2rem; }
.nv-impact-intro p { margin: 0; line-height: 1.6; color: var(--nv-text); }
.nv-impact-theme { display: grid; gap: var(--nv-sp-md); }
.nv-impact-theme-head {
  margin: 0;
  font-size: 1.5rem;
  padding-bottom: var(--nv-sp-sm);
  border-bottom: 1px solid var(--nv-border, rgba(0, 0, 0, 0.1));
}
.nv-impact-count { margin: 0; color: var(--nv-text-muted); font-weight: 600; }
.nv-impact-statements {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--nv-sp-xs);
}
.nv-impact-statements .nv-feed-grid,
.nv-impact-theme .nv-feed-grid {
  list-style: none;
  margin: 0;
  padding: 0;
}
.nv-impact-method {
  display: grid;
  gap: var(--nv-sp-sm);
  max-width: 70ch;
  padding-top: var(--nv-sp-lg);
  border-top: 1px solid var(--nv-border, rgba(0, 0, 0, 0.1));
}
.nv-impact-method h2 { margin: 0; font-size: 1.25rem; }
.nv-impact-method p { margin: 0; line-height: 1.6; color: var(--nv-text-muted); }
```

Before committing, confirm the `--nv-sp-2xl` token exists: `grep -n -- '--nv-sp-2xl' src/app/globals.css`. If it does not, use `--nv-sp-xl` instead in the `.nv-impact-page` gap. The `--nv-border` reference uses a fallback so it is safe whether or not the token exists.

- [ ] **Step 7: Full suite + typecheck**

Run: `npx vitest run`
Expected: all pass (162 prior + 3 (Task 1) + 5 (Task 2) + 4 (Task 3) = 174).
Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 8: Commit**

```bash
git add src/components/navi/demo/ImpactThemeSection.tsx \
  'src/app/work/navi/(minisite)/demo/impact/page.tsx' \
  src/components/navi/demo/__tests__/impact-page.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): impact ledger page at /demo/impact

Server component that groups every experience by impact theme. Each
theme section leads with the contributing count, lists the funded
commitments, and shows the experience grid. Opens with a methodology
note that is honest about counting experiences rather than dollars,
and closes with how themes are assigned.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: `ImpactSignal` href + cross-links + footer link

**Files:**
- Modify: `src/components/navi/ui/ImpactSignal.tsx`
- Modify: `src/components/navi/ui/__tests__/ImpactSignal.test.tsx`
- Modify: `src/components/navi/demo/BookingCard.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`
- Modify: `src/components/navi/chrome/NaviFooter.tsx`
- Modify: `src/components/navi/chrome/__tests__/NaviFooter.test.tsx` (only if it asserts the footer link set)
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write the failing test for the linked variant**

Add to `src/components/navi/ui/__tests__/ImpactSignal.test.tsx` a new test inside the existing `describe("ImpactSignal", ...)` block:

```tsx
  it("renders as a link to the given href and is not a note", () => {
    render(<ImpactSignal href="/work/navi/demo/impact#heritage">Funds tree care</ImpactSignal>);
    const link = screen.getByRole("link", { name: /Funds tree care/ });
    expect(link).toHaveAttribute("href", "/work/navi/demo/impact#heritage");
    expect(link).toHaveClass("nv-impact");
    // a link should not also claim role=note
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
```

- [ ] **Step 2: Run the ImpactSignal test, confirm the new case fails**

Run: `npx vitest run src/components/navi/ui/__tests__/ImpactSignal.test.tsx`
Expected: the new test FAILS (no link rendered), the two existing tests still PASS.

- [ ] **Step 3: Add the `href` prop to `ImpactSignal`**

Replace the whole body of `src/components/navi/ui/ImpactSignal.tsx` with:

```tsx
import type { ReactNode } from "react";
import Link from "next/link";

const ICON = (
  <span className="nv-impact-icon" aria-hidden="true">
    {/* leaf glyph */}
    <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
      <path d="M13 2C7 2 3 5 3 11c0 1 0 2 .5 3C5 11 8 9 12 8c-3 2-5 4-6 7 5 0 8-4 8-10 0-1 0-2-1-3z" />
    </svg>
  </span>
);

export function ImpactSignal({
  children,
  as: As = "span",
  href,
}: {
  children: ReactNode;
  as?: "span" | "div";
  href?: string;
}) {
  // When linked, the element is announced as a link (its accessible name is the
  // content), so it must not also carry role="note". The unlinked variant keeps
  // the note semantics it has used across the site.
  if (href) {
    return (
      <Link href={href} className="nv-impact nv-impact--link">
        {ICON}
        <span className="nv-impact-text">{children}</span>
      </Link>
    );
  }
  return (
    <As className="nv-impact" role="note" aria-label="Regenerative impact">
      {ICON}
      <span className="nv-impact-text">{children}</span>
    </As>
  );
}
```

- [ ] **Step 4: Run the ImpactSignal test, confirm all pass**

Run: `npx vitest run src/components/navi/ui/__tests__/ImpactSignal.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Forward an `impactHref` through `BookingCard`**

In `src/components/navi/demo/BookingCard.tsx`, find the props type and the `impact` usage. Add an `impactHref?: string` prop and pass it to the signal. Change the props destructure to include `impactHref`, and change:

```tsx
      {impact && <ImpactSignal as="div">{impact}</ImpactSignal>}
```

to:

```tsx
      {impact && (
        <ImpactSignal as="div" href={impactHref}>
          {impact}
        </ImpactSignal>
      )}
```

Add `impactHref?: string;` to the `BookingCard` props type (alongside the existing `impact?: string` / `impact: string` prop, matching its existing optionality).

- [ ] **Step 6: Wire the two hrefs on the experience detail page**

In `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`:

Change the Learn-section signal (currently `<ImpactSignal as="div">{e.impactStatement}</ImpactSignal>`) to:

```tsx
            <ImpactSignal as="div" href={`/work/navi/demo/impact#${e.impactTheme}`}>
              {e.impactStatement}
            </ImpactSignal>
```

Change the `BookingCard` usage to pass the matching href. Find the `<BookingCard ... />` element and add the prop:

```tsx
          impactHref={`/work/navi/demo/impact#${e.impactTheme}`}
```

(Place it next to the existing `impact={e.impactPhrase}` prop.)

Do **not** touch `ExperienceCard` or `ResultCard`. Their `ImpactSignal`s stay unlinked because the whole card is already a `<Link>` (nested anchors are invalid HTML). This is scope decision 1.

- [ ] **Step 7: Add the impact link to the footer**

In `src/components/navi/chrome/NaviFooter.tsx`, in the `"About"` column's `links` array, add as the first entry:

```tsx
        { label: "Where bookings go", href: "/work/navi/demo/impact" },
```

Then check the footer test: `npx vitest run src/components/navi/chrome/__tests__/NaviFooter.test.tsx`. If it asserts the exact link list or a specific count, update it to include the new link. If it only checks that the footer renders, no change is needed.

- [ ] **Step 8: Add the linked-signal CSS**

In `src/app/globals.css`, find the `.nv-impact` base rule: `grep -n '\.nv-impact ' src/app/globals.css | head`. After the existing `.nv-impact` rules, append:

```css
.nv-impact--link {
  text-decoration: none;
  cursor: pointer;
}
.nv-impact--link:hover .nv-impact-text { text-decoration: underline; }
.nv-impact--link:focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
  border-radius: var(--nv-r-sm);
}
```

- [ ] **Step 9: Full suite + typecheck**

Run: `npx vitest run`
Expected: all pass (174 + 1 new ImpactSignal test = 175, unless the footer test gained/changed assertions; adjust the expected number by whatever the footer test change adds).
Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 10: Commit**

```bash
git add src/components/navi/ui/ImpactSignal.tsx \
  src/components/navi/ui/__tests__/ImpactSignal.test.tsx \
  src/components/navi/demo/BookingCard.tsx \
  'src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx' \
  src/components/navi/chrome/NaviFooter.tsx \
  src/app/globals.css
# include the footer test only if you changed it:
git add src/components/navi/chrome/__tests__/NaviFooter.test.tsx 2>/dev/null || true
git commit -m "$(cat <<'EOF'
feat(navi-demo): link impact signals to the ledger

ImpactSignal accepts an optional href and renders as a link (dropping
the note role so it is announced as a link). Wire the experience
detail Learn signal and the BookingCard signal to their theme anchor
on the impact page, and add a footer entry. In-card signals stay
unlinked because the card is already a full-card link.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Photo expansion (asset task, runs in the main session)

**Files:**
- Create: `public/projects/navi-demo/<slug>-N.jpg` for the new photos
- Modify: `src/lib/navi/demo-data.ts` (photo arrays)
- Modify: `public/projects/navi-demo/README.md` (attribution)

This task is **not** TDD and handles a secret credential, so it runs in the main session rather than a dispatched implementer subagent. After it commits, dispatch a code-quality reviewer on the diff.

Two parts (per scope decision 2, there is no 3-photo cap):
- **Floor:** bring the 9 currently-thin listings (2 photos) up to at least 3.
- **Heroes:** bring the feed-hero experiences (the ones rendered on `/work/navi/demo`) up to 5 photos where a strong, on-topic image exists. Identify the heroes by reading the feed source at execution time (`grep` the demo feed/page for which experiences it lists), then add 1-2 photos each. Only add a photo that genuinely fits. Filenames follow the existing family with the next index (`-4.jpg`, `-5.jpg`).

The 9 thin listings (currently 2 photos each), with a search query for the third photo:

| slug | Unsplash query |
| --- | --- |
| dancehall-brooklyn-junction | caribbean dancehall party crowd |
| bedstuy-bracelet-making | handmade beaded bracelet craft |
| dumbo-industrial-architecture-walk | dumbo brooklyn cobblestone street |
| sunset-park-night-market | night market food stalls lanterns |
| bedstuy-soul-food-cooking | southern soul food plate |
| greenpoint-mural-walk | colorful street mural wall |
| harlem-brownstone-walking-tour | harlem brownstone row houses |
| astoria-greek-baking | greek pastry baklava bakery |
| bronx-bodega-heritage-tour | new york city bodega corner store |

- [ ] **Step 1: Export the key for this session only (never committed)**

```bash
export UNSPLASH_ACCESS_KEY='<paste the flagged key here at runtime>'
```

Confirm it works:

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" \
  "https://api.unsplash.com/search/photos?query=test&per_page=1" \
  -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY" --max-time 20
```
Expected: `HTTP 200`. If not, stop and ask the user for a fresh key.

- [ ] **Step 2: For each thin slug, read the current photo filenames**

Run for each slug to learn the existing naming convention so the new file matches it:

```bash
npx tsx -e "import {getExperienceBySlug} from './src/lib/navi/demo-data'; const e=getExperienceBySlug('dumbo-industrial-architecture-walk'); console.log(e?.photos.map(p=>p.src));"
```

Name the new file to match the family (for example, if the existing files are `dumbo-bridge.jpg` and `dumbo-warehouse.jpg`, name the third `dumbo-3.jpg`; if they are `greenpoint-mural-1.jpg` / `-2.jpg`, name it `greenpoint-mural-3.jpg`).

- [ ] **Step 3: Search, choose a landscape result, and download**

For each slug, query the Search API, take the first landscape result, capture the photographer name and the regular image URL, then download to the public folder. Example for one slug (repeat per slug, swapping query and filename):

```bash
QUERY="dumbo brooklyn cobblestone street"
OUT="public/projects/navi-demo/dumbo-3.jpg"
JSON=$(curl -s "https://api.unsplash.com/search/photos?query=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1]))" "$QUERY")&per_page=5&orientation=landscape" -H "Authorization: Client-ID $UNSPLASH_ACCESS_KEY")
echo "$JSON" | python3 -c "import json,sys; d=json.load(sys.stdin); r=d['results'][0]; print('PHOTOG:', r['user']['name']); print('URL:', r['urls']['regular'])"
# then download the printed URL:
curl -sL "<the printed regular URL>" -o "$OUT"
# downsize to 1600px wide to match the existing assets (matches README note):
sips -Z 1600 "$OUT" >/dev/null 2>&1 || true
```

Record each photographer name for Step 5. Keep API calls to one search per slug (9 total, well under the 50/hour limit). Verify each file downloaded and is a real JPEG:

```bash
for f in public/projects/navi-demo/*-3.jpg; do echo "$f: $(file -b "$f")"; done
```
Expected: each reports JPEG image data. If any is not an image (for example an API error body), re-run that slug's search and pick a different result.

- [ ] **Step 4: Add the new photos to each array in `demo-data.ts`**

For each thin experience, append a third `{ src, alt }` to its `photos` array, and for each feed hero append up to two more so it reaches five. The `alt` must be specific and descriptive (no banned words, no em-dashes). Example:

```ts
      { src: "/projects/navi-demo/dumbo-3.jpg", alt: "Cobblestone street under the Manhattan Bridge in DUMBO" },
```

- [ ] **Step 5: Update the README attribution**

In `public/projects/navi-demo/README.md`, under the existing `**From Unsplash**` photographers list, add one line per new file in the same `- \`filename.jpg\` — Photographer Name` format. If a new file came from a slug whose existing photos were from Figma, still list the new Unsplash file under the Unsplash section.

- [ ] **Step 6: Verify and typecheck**

```bash
npx tsx -e "import {EXPERIENCES} from './src/lib/navi/demo-data'; const thin=EXPERIENCES.filter(e=>e.photos.length<3); console.log('still thin:', thin.map(e=>e.slug)); console.log('min photos:', Math.min(...EXPERIENCES.map(e=>e.photos.length)));"
```
Expected: `still thin: []` and `min photos: 3`.

```bash
npx vitest run && npx tsc --noEmit
```
Expected: all green, exit 0.

- [ ] **Step 7: Confirm every referenced photo file exists on disk**

```bash
npx tsx -e "import {EXPERIENCES} from './src/lib/navi/demo-data'; import {existsSync} from 'node:fs'; const missing=EXPERIENCES.flatMap(e=>e.photos).map(p=>'public'+p.src).filter(p=>!existsSync(p)); console.log('missing files:', missing);"
```
Expected: `missing files: []`.

- [ ] **Step 8: Commit (photos + data + README only, never the key)**

```bash
git add public/projects/navi-demo/*.jpg \
  public/projects/navi-demo/README.md \
  src/lib/navi/demo-data.ts
git status --short   # confirm no key, no skill-observations, no .impeccable staged
git commit -m "$(cat <<'EOF'
feat(navi-demo): give every listing a fuller gallery

Bring the nine thin experiences up to at least three photos and the
feed heroes up to five, so the gallery carousel always has something
to cycle. New files are Unsplash-licensed and credited in the asset
README.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 9: Unset the key**

```bash
unset UNSPLASH_ACCESS_KEY
```

(Remind the user to rotate/delete the key now that this slice has used it.)

---

## Task 6: Integration check, push, PR, plan commit

**Files:**
- Modify: (none for code) — plus commit this plan file.

- [ ] **Step 1: Full suite**

Run: `npx vitest run`
Expected: all pass. Record the total count.

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: exit 0.

- [ ] **Step 3: Scoped lint**

Run:
```bash
npx eslint 'src/app/work/navi/(minisite)/demo/impact/page.tsx' \
  src/components/navi/demo/ImpactThemeSection.tsx \
  src/lib/navi/impact.ts \
  src/components/navi/ui/ImpactSignal.tsx \
  src/components/navi/demo/BookingCard.tsx \
  src/components/navi/chrome/NaviFooter.tsx \
  'src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx'
```
Expected: exit 0. (Pre-existing `<a>` vs `<Link>` warnings in `src/app/work/navi/page.tsx` and `system/page.tsx` are out of scope.)

- [ ] **Step 4: Manual preview walk**

Start (or reuse) the dev server and check:
- `/work/navi/demo/impact` renders the heading, methodology, five theme sections (each with its count and grid), and the closing note. No console errors.
- From an experience detail page, the Learn-section impact signal and the BookingCard impact signal are links that land on `/work/navi/demo/impact#<theme>` and scroll to the right section.
- A listing that was thin (for example DUMBO) now shows three photos in the gallery.

- [ ] **Step 5: Commit this plan file**

```bash
git add docs/superpowers/plans/2026-06-21-navi-substance-pass-slice-4.md
git commit -m "$(cat <<'EOF'
docs(navi): Slice 4 impact-ledger + photo plan

Records the impact-ledger plan (theme migration, getImpactSummary,
the ledger page, opt-in ImpactSignal links) and the photo-expansion
approach, plus the two scope decisions: ImpactSignal links are
opt-in (never nested inside a card anchor) and every listing gets a
fuller gallery (thin listings to at least three, feed heroes to five).

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

- [ ] **Step 6: Push**

```bash
git push origin feat/navi-living-system
```

- [ ] **Step 7: Comment on PR #23**

Summarize: the impact ledger page and theme model, the opt-in `ImpactSignal` cross-links (and why in-card signals stay unlinked), the photo expansion (9 listings brought to 3), and the verification results (test count, tsc, lint, preview walk). End with `🤖 Generated with Claude Code.`

---

## Self-review

**1. Spec coverage.**
- Route `/work/navi/demo/impact` → Task 3. ✓
- `impactTheme` field + 5 themes + migration → Task 1. ✓
- `getImpactSummary()` grouping → Task 2. ✓
- Page layout (heading, methodology, per-theme count + signals list + card grid, closing methodology link) → Tasks 3. ✓
- Components reused (`ImpactSignal`, `ExperienceCard`, feed-grid) → Task 3. ✓
- Cross-links: every applicable `ImpactSignal` links to `#theme`; footer link local → Task 4 (with documented opt-in scope for card-nested signals). ✓
- Photo expansion: thin listings to at least 3, feed heroes to 5, downloads, demo-data, README → Task 5. ✓ (No 3-photo cap: scope decision 2.)
- `ImpactSignal` accepts `href` and renders as Link → Task 4. ✓

**2. Placeholder scan.** No TBD/TODO. The only runtime-supplied value is the Unsplash key (env var, intentionally not in the file). The per-slug download command is a concrete template repeated across 9 slugs. Acceptable: the asset-fetch result (which exact image) cannot be pre-baked.

**3. Type consistency.** `ImpactTheme` defined in demo-data.ts (Task 1), imported by impact.ts (Task 2) and used in cross-links (Task 4). `ImpactSection`/`ImpactThemeMeta` defined in impact.ts (Task 2), consumed by `ImpactThemeSection` (Task 3). `getImpactSummary` signature stable across Tasks 2–3. `ImpactSignal` `href?: string` added in Task 4 and used in Tasks 3 (without) and 4 (with). `BookingCard` gains `impactHref?: string` in Task 4, supplied by the detail page in the same task. Consistent.
