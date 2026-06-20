# Navi Playable Demo — Implementation Plan (Plan 2 of 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the playable Navi demo as three connected views (discovery feed → search results + interactive map → experience detail with Learn/Plan/Go), assembled from the components shipped in Plan 1.

**Architecture:** Three Next.js App Router routes under `src/app/work/navi/(minisite)/demo/`, sharing the existing `.nv-ui` scoped chrome. New demo composites (ExperienceCard, ResultCard, BookingCard, TransitOptions, Gallery, Map, Legend, TabBar) live under `src/components/navi/demo/` and are assembled from Plan 1 primitives (Button, Card, Tag, Rating, Avatar, ImpactSignal, Tabs, Accordion, Tooltip, MapPin, SearchInput, CarouselArrow, PaginationDots). Real Leaflet + OpenStreetMap basemap (no API key), with Leaflet isolated to a client-only sub-component so SSR stays clean and Vitest tests target the public API. Demo content is transcribed verbatim from the Figma file (`nYimRBXiOSyDbTfAJ4gk8G`, nodes 1860:1529, 2763:54126, 2768:55607).

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4 (already present), Vitest + React Testing Library + jsdom (already present), **Leaflet 1.9 + react-leaflet 4** (added by this plan), `next/dynamic` for client-only loading. Visual fidelity verified via the `preview_*` workflow where unit tests can't reach.

**Companion spec:** [docs/superpowers/specs/2026-06-19-navi-live-system-minisite-design.md](../specs/2026-06-19-navi-live-system-minisite-design.md), particularly §3 (Navi product concept), §7 (demo views), §7.4 (map), §7.5 (data), §7.6 (polish), §8 (responsive/a11y).

**Source of truth:** Figma `nYimRBXiOSyDbTfAJ4gk8G`. Extract exact copy, prices, ratings, photo URLs, and Learn/Plan/Go content per-node via Figma MCP `get_design_context` and `download_assets` during execution.

---

## Component API summary (locked names)

| Component | File | Key props |
|---|---|---|
| `TabBar` | `src/components/navi/ui/TabBar.tsx` | `items: {id,label,icon,href}[]`, `active`, mobile-only |
| `ExperienceCard` | `src/components/navi/demo/ExperienceCard.tsx` | `experience: Experience`, `href` |
| `ResultCard` | `src/components/navi/demo/ResultCard.tsx` | `experience: Experience`, `href`, `onHover?` |
| `BookingCard` | `src/components/navi/demo/BookingCard.tsx` | `priceFrom`, `dates: BookingDate[]`, `onReserve` |
| `TransitOptions` | `src/components/navi/demo/TransitOptions.tsx` | `options: TransitOption[]` |
| `Gallery` | `src/components/navi/demo/Gallery.tsx` | `photos: {src,alt}[]`, `hero` |
| `Map` | `src/components/navi/demo/Map.tsx` | `center: [lat,lng]`, `zoom`, `markers: MapMarker[]`, `selectedId?`, `onSelect?` |
| `Legend` | `src/components/navi/demo/Legend.tsx` | inline static component |

**Shared types** (defined in `src/lib/navi/demo-data.ts`):
```ts
type Experience = {
  slug: string;
  title: string;
  category: string;          // "Cooking" | "Architecture" | "Community" | "Arts & Culture"
  tone: "neutral" | "popular" | "local";  // for the headline Tag
  neighborhood: string;
  borough: string;           // "Brooklyn" | "Manhattan" | ...
  lat: number;
  lng: number;
  price: number;
  rating: number;
  reviews: number;
  host: { name: string };
  photos: { src: string; alt: string }[];
  impactPhrase: string;      // short, for card
  impactStatement: string;   // longer, for Learn level
  learn: string;             // description paragraph
  plan: {
    bring: string;
    commitments: string;
    impactDetail: string;
  };
  go: {
    addressLine1: string;
    addressLine2: string;
    transit: TransitOption[];
  };
  dates: BookingDate[];
};

type TransitOption = { mode: "subway" | "citibike" | "walk"; label: string; detail: string };
type BookingDate = { date: string; time: string };  // human-readable
type MapMarker = { id: string; lat: number; lng: number; label: string };
```

---

## Phase A — Setup and data

### Task 1: Install Leaflet + react-leaflet

**Files:**
- Modify: `package.json` (dependencies)
- Create: `src/types/leaflet-css.d.ts` (CSS-as-module ambient declaration)

- [ ] **Step 1: Install dependencies**

```bash
npm install leaflet@^1.9 react-leaflet@^4 && npm install -D @types/leaflet
```

- [ ] **Step 2: Verify install**

Run: `npm ls leaflet react-leaflet @types/leaflet`
Expected: all three resolve cleanly, no peer-dep errors. (react-leaflet@4 supports React 18+; React 19 works because react-leaflet treats React as a peer.)

- [ ] **Step 3: Add ambient declaration for the Leaflet CSS import**

Create `src/types/leaflet-css.d.ts`:

```ts
declare module "leaflet/dist/leaflet.css";
```

(Some Vitest/TS setups need this; harmless if unused.)

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/types/leaflet-css.d.ts
git commit -m "feat(navi-demo): add Leaflet + react-leaflet"
```

---

### Task 2: Demo data — transcribed Experiences

**Files:**
- Create: `src/lib/navi/demo-data.ts`
- Create: `src/lib/navi/__tests__/demo-data.test.ts`

**Note for the implementer:** During execution, extract real titles, prices, ratings, neighborhoods, photo URLs, and Learn/Plan/Go copy from Figma node `1860:1529` (feed cards) + `2768:55607` (detail view) using `get_design_context` and `download_assets`. The seed values below are placeholders that the test enforces structural shape; replace strings with real Figma copy. Aim for **8-12 experiences** so the feed and map feel populated.

- [ ] **Step 1: Write the failing test**

`src/lib/navi/__tests__/demo-data.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { EXPERIENCES, getExperienceBySlug, CATEGORIES } from "@/lib/navi/demo-data";

describe("demo data", () => {
  it("exports at least 8 experiences", () => {
    expect(EXPERIENCES.length).toBeGreaterThanOrEqual(8);
  });

  it("every experience has a unique slug", () => {
    const slugs = EXPERIENCES.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every experience has lat/lng, price, rating, photos, and impactPhrase", () => {
    for (const e of EXPERIENCES) {
      expect(typeof e.lat).toBe("number");
      expect(typeof e.lng).toBe("number");
      expect(e.price).toBeGreaterThan(0);
      expect(e.rating).toBeGreaterThan(0);
      expect(e.rating).toBeLessThanOrEqual(5);
      expect(e.photos.length).toBeGreaterThan(0);
      expect(e.impactPhrase.length).toBeGreaterThan(0);
    }
  });

  it("every experience has Learn, Plan, and Go content", () => {
    for (const e of EXPERIENCES) {
      expect(e.learn.length).toBeGreaterThan(20);
      expect(e.plan.bring.length).toBeGreaterThan(0);
      expect(e.go.addressLine1.length).toBeGreaterThan(0);
      expect(e.go.transit.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("getExperienceBySlug returns the matching experience or undefined", () => {
    const first = EXPERIENCES[0];
    expect(getExperienceBySlug(first.slug)).toBe(first);
    expect(getExperienceBySlug("nope-not-real")).toBeUndefined();
  });

  it("CATEGORIES covers every experience's category", () => {
    for (const e of EXPERIENCES) {
      expect(CATEGORIES).toContain(e.category);
    }
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- demo-data` → "Cannot find module".

- [ ] **Step 3: Implement the data module**

`src/lib/navi/demo-data.ts`:

```ts
export type TransitOption = {
  mode: "subway" | "citibike" | "walk";
  label: string;
  detail: string;
};

export type BookingDate = { date: string; time: string };

export type Experience = {
  slug: string;
  title: string;
  category: string;
  tone: "neutral" | "popular" | "local";
  neighborhood: string;
  borough: string;
  lat: number;
  lng: number;
  price: number;
  rating: number;
  reviews: number;
  host: { name: string };
  photos: { src: string; alt: string }[];
  impactPhrase: string;
  impactStatement: string;
  learn: string;
  plan: { bring: string; commitments: string; impactDetail: string };
  go: { addressLine1: string; addressLine2: string; transit: TransitOption[] };
  dates: BookingDate[];
};

export const CATEGORIES = [
  "Arts & Culture",
  "Community",
  "Cooking",
  "Architecture",
] as const;

// IMPLEMENTER: replace the seed content with real Figma copy and photo URLs
// extracted from nYimRBXiOSyDbTfAJ4gk8G (node 1860:1529 for cards, 2768:55607
// for detail content). Photo assets export to public/projects/navi-demo/.

export const EXPERIENCES: Experience[] = [
  {
    slug: "prospect-park-carriage",
    title: "Discover Prospect Park by horse-drawn carriage",
    category: "Architecture",
    tone: "local",
    neighborhood: "Park Slope",
    borough: "Brooklyn",
    lat: 40.6602,
    lng: -73.969,
    price: 48,
    rating: 4.9,
    reviews: 213,
    host: { name: "Paul Stein" },
    photos: [
      { src: "/projects/navi-demo/prospect-tunnel.jpg", alt: "Sunlit tunnel in Prospect Park" },
      { src: "/projects/navi-demo/prospect-trees.jpg", alt: "Autumn trees along the park drive" },
      { src: "/projects/navi-demo/prospect-carriage.jpg", alt: "Horse-drawn carriage with passengers" },
      { src: "/projects/navi-demo/prospect-pond.jpg", alt: "Pond at the edge of Prospect Park" },
    ],
    impactPhrase: "Funds Prospect Park tree care",
    impactStatement:
      "A share of every ride funds the Prospect Park Alliance's tree care program, which maintains the park's 30,000 trees year-round.",
    learn:
      "See the beautiful, historic, and scenic Prospect Park in a two-hour-long carriage ride that takes you through every inch of park grounds. Variation and drinks provided.",
    plan: {
      bring: "Comfortable shoes, a layer for shade, and a refillable water bottle.",
      commitments: "Arrive ten minutes before the start time. Reschedule with twenty-four hours notice.",
      impactDetail:
        "Each ride contributes to the Prospect Park Alliance's tree care program. Operators are paid a living wage and the route is reviewed quarterly for animal welfare.",
    },
    go: {
      addressLine1: "On the corner of",
      addressLine2: "Union Street and 8th Avenue, Brooklyn, New York NY 11215",
      transit: [
        { mode: "subway", label: "Take the", detail: "Q or R" },
        { mode: "citibike", label: "Grab a Citibike", detail: "0.2 miles away" },
        { mode: "walk", label: "Walk", detail: "30 min to dock" },
      ],
    },
    dates: [
      { date: "Monday, March 23", time: "12:00 pm" },
      { date: "Tuesday, March 24", time: "12:00 pm" },
      { date: "Thursday, March 26", time: "12:00 pm" },
    ],
  },
  {
    slug: "dancehall-brooklyn-junction",
    title: "Dancehall Day Party in Brooklyn Junction",
    category: "Community",
    tone: "popular",
    neighborhood: "East Flatbush",
    borough: "Brooklyn",
    lat: 40.6478,
    lng: -73.9286,
    price: 19,
    rating: 4.7,
    reviews: 138,
    host: { name: "Yvette Bryan" },
    photos: [
      { src: "/projects/navi-demo/dancehall-1.jpg", alt: "Dancers at a Brooklyn day party" },
      { src: "/projects/navi-demo/dancehall-2.jpg", alt: "DJ setup at sunset" },
    ],
    impactPhrase: "Pays Caribbean-owned venues directly",
    impactStatement:
      "Every ticket flows directly to the Caribbean-owned venues and DJs hosting the event, with no platform middlemen.",
    learn:
      "An afternoon dancehall set hosted by long-standing Brooklyn Junction operators. All ages, all neighborhoods welcome.",
    plan: {
      bring: "Comfortable shoes you can dance in. Cash for the food vendors.",
      commitments: "Honor the venue's neighborhood-quiet policy after 9 pm.",
      impactDetail:
        "100 percent of ticket revenue goes to the venue. Navi takes zero booking fee on community-tagged events.",
    },
    go: {
      addressLine1: "1180 Flatbush Avenue",
      addressLine2: "Brooklyn, New York NY 11226",
      transit: [
        { mode: "subway", label: "Take the", detail: "Q or 2" },
        { mode: "walk", label: "Walk", detail: "8 min from Beverley Rd" },
      ],
    },
    dates: [
      { date: "Saturday, March 28", time: "3:00 pm" },
      { date: "Saturday, April 4", time: "3:00 pm" },
    ],
  },
  {
    slug: "bedstuy-bracelet-making",
    title: "Hand-forged bracelet-making experience",
    category: "Arts & Culture",
    tone: "neutral",
    neighborhood: "Bedford-Stuyvesant",
    borough: "Brooklyn",
    lat: 40.6872,
    lng: -73.9418,
    price: 65,
    rating: 4.95,
    reviews: 87,
    host: { name: "Iman Reeves" },
    photos: [
      { src: "/projects/navi-demo/bracelet-1.jpg", alt: "Hands shaping a metal bracelet" },
      { src: "/projects/navi-demo/bracelet-2.jpg", alt: "Workshop tools laid out" },
    ],
    impactPhrase: "Supports a Black-owned Bed-Stuy workshop",
    impactStatement:
      "Each booking sustains a Black-owned jewelry workshop in Bed-Stuy that trains apprentices from the neighborhood.",
    learn:
      "A two-hour metalwork session with a third-generation Bed-Stuy jeweler. You leave with a finished piece.",
    plan: {
      bring: "Closed-toe shoes and a layer you do not mind getting a little sooty.",
      commitments: "Apprentices may be on-shift; respect their workflow.",
      impactDetail:
        "Booking revenue funds a six-month neighborhood apprenticeship program and tool maintenance for the studio.",
    },
    go: {
      addressLine1: "Tompkins Avenue near Halsey Street",
      addressLine2: "Brooklyn, New York NY 11216",
      transit: [
        { mode: "subway", label: "Take the", detail: "A or C" },
        { mode: "walk", label: "Walk", detail: "5 min from Utica Ave" },
      ],
    },
    dates: [
      { date: "Wednesday, April 1", time: "6:30 pm" },
      { date: "Saturday, April 4", time: "11:00 am" },
    ],
  },
  // IMPLEMENTER: add 5-9 more experiences from Figma to reach 8-12 total.
  // Suggested categories to diversify: Cooking (Bed-Stuy soul food), Architecture
  // (DUMBO industrial tour), Community (Sunset Park night market), Arts & Culture
  // (Greenpoint mural walk), Cooking (Astoria Greek baking), Community (Bronx
  // bodega heritage tour), Architecture (Harlem brownstone walking tour).
];

export function getExperienceBySlug(slug: string): Experience | undefined {
  return EXPERIENCES.find((e) => e.slug === slug);
}
```

- [ ] **Step 4: Run → PASS.** `npm test -- demo-data` → 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/navi/demo-data.ts src/lib/navi/__tests__/demo-data.test.ts
git commit -m "feat(navi-demo): typed Experience data transcribed from Figma seed"
```

---

## Phase B — New primitives + composites

### Task 3: TabBar (mobile bottom nav)

**Files:**
- Create: `src/components/navi/ui/TabBar.tsx`
- Test: `src/components/navi/ui/__tests__/TabBar.test.tsx`
- Modify: `src/app/globals.css` (append CSS)
- Modify: `src/components/navi/ui/index.ts` (add export)

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TabBar } from "@/components/navi/ui/TabBar";

const items = [
  { id: "feed", label: "Feed", icon: <span>F</span>, href: "/work/navi/demo" },
  { id: "search", label: "Search", icon: <span>S</span>, href: "/work/navi/demo/search" },
  { id: "trips", label: "Trips", icon: <span>T</span>, href: "/work/navi/demo/trips" },
];

describe("TabBar", () => {
  it("renders a labelled tab list with one item per link", () => {
    render(<TabBar items={items} active="feed" />);
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("marks the active item with aria-current=page", () => {
    render(<TabBar items={items} active="search" />);
    const links = screen.getAllByRole("link");
    expect(links.find((a) => a.getAttribute("aria-current") === "page")?.textContent).toMatch(
      /Search/,
    );
  });

  it("renders icons as decorative", () => {
    render(<TabBar items={items} active="feed" />);
    const icons = document.querySelectorAll(".nv-tabbar-icon");
    icons.forEach((i) => expect(i.getAttribute("aria-hidden")).toBe("true"));
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- TabBar`.

- [ ] **Step 3: Implement** — `src/components/navi/ui/TabBar.tsx`:

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Item = { id: string; label: string; icon: ReactNode; href: string };

export function TabBar({ items, active }: { items: Item[]; active: string }) {
  return (
    <nav className="nv-tabbar" aria-label="Primary">
      {items.map((it) => {
        const selected = it.id === active;
        return (
          <Link
            key={it.id}
            href={it.href}
            aria-current={selected ? "page" : undefined}
            className={`nv-tabbar-item${selected ? " nv-tabbar-item--active" : ""}`}
          >
            <span className="nv-tabbar-icon" aria-hidden="true">
              {it.icon}
            </span>
            <span className="nv-tabbar-label">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 4: CSS** — append to `src/app/globals.css`:

```css
.nv-tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: none;
  background: var(--nv-surface);
  border-top: 1px solid var(--nv-border);
  padding: var(--nv-sp-xs) var(--nv-sp-sm);
  z-index: 50;
}
@media (max-width: 720px) {
  .nv-tabbar { display: flex; justify-content: space-around; }
  body { padding-bottom: 64px; }
}
.nv-tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: var(--nv-sp-2xs) var(--nv-sp-sm);
  color: var(--nv-text-muted);
  text-decoration: none;
  font-size: 0.72rem;
  font-weight: 700;
  min-width: 44px;
  min-height: 44px;
}
.nv-tabbar-item--active { color: var(--nv-action); }
.nv-tabbar-icon { display: inline-flex; font-size: 1.1rem; }
```

- [ ] **Step 5: Add to barrel** — append to `src/components/navi/ui/index.ts`:

```ts
export { TabBar } from "./TabBar";
```

Also update the barrel test (`src/components/navi/ui/__tests__/index.test.ts`) — add `"TabBar"` to the list of expected exports.

- [ ] **Step 6: Run → PASS.** `npm test -- TabBar index`.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/ui/TabBar.tsx src/components/navi/ui/__tests__/TabBar.test.tsx src/components/navi/ui/index.ts src/components/navi/ui/__tests__/index.test.ts src/app/globals.css
git commit -m "feat(navi): TabBar mobile bottom nav with aria-current"
```

---

### Task 4: ExperienceCard (feed card composite)

**Files:**
- Create: `src/components/navi/demo/ExperienceCard.tsx`
- Test: `src/components/navi/demo/__tests__/ExperienceCard.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("ExperienceCard", () => {
  const e = EXPERIENCES[0];

  it("renders title, neighborhood, price, rating, tag, and impact signal", () => {
    render(<ExperienceCard experience={e} href={`/work/navi/demo/experience/${e.slug}`} />);
    expect(screen.getByRole("link", { name: new RegExp(e.title, "i") })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(e.neighborhood))).toBeInTheDocument();
    expect(screen.getByText(`$${e.price} per person`)).toBeInTheDocument();
    expect(screen.getByLabelText(/rated/i)).toBeInTheDocument();
    expect(screen.getByText(e.impactPhrase)).toBeInTheDocument();
  });

  it("the cover image has descriptive alt text", () => {
    render(<ExperienceCard experience={e} href="#" />);
    const img = screen.getByRole("img");
    expect(img.getAttribute("alt")).toBe(e.photos[0].alt);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- ExperienceCard`.

- [ ] **Step 3: Implement** — `src/components/navi/demo/ExperienceCard.tsx`:

```tsx
import Link from "next/link";
import { Tag, Rating, ImpactSignal } from "@/components/navi/ui";
import type { Experience } from "@/lib/navi/demo-data";

export function ExperienceCard({
  experience: e,
  href,
}: {
  experience: Experience;
  href: string;
}) {
  return (
    <Link href={href} className="nv-exp-card">
      <div className="nv-exp-card-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={e.photos[0].src} alt={e.photos[0].alt} />
      </div>
      <div className="nv-exp-card-body">
        <Tag tone={e.tone}>
          {e.tone === "local" ? "Locally-owned" : e.tone === "popular" ? "Popular" : e.category}
        </Tag>
        <h3 className="nv-exp-card-title">{e.title}</h3>
        <p className="nv-exp-card-loc">
          {e.neighborhood}, {e.borough}
        </p>
        <Rating value={e.rating} reviews={e.reviews} />
        <ImpactSignal>{e.impactPhrase}</ImpactSignal>
        <p className="nv-exp-card-price">${e.price} per person</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-exp-card {
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--nv-surface);
  border: 1px solid var(--nv-border);
  border-radius: var(--nv-r-md);
  overflow: hidden;
  text-decoration: none;
  color: var(--nv-text);
  transition: border-color 0.15s, transform 0.15s;
}
.nv-exp-card:hover { border-color: var(--nv-action); transform: translateY(-2px); }
.nv-exp-card-photo { aspect-ratio: 16 / 10; overflow: hidden; }
.nv-exp-card-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nv-exp-card-body { padding: var(--nv-sp-md); display: grid; gap: var(--nv-sp-xs); }
.nv-exp-card-title { font-size: 1.05rem; margin: 0; }
.nv-exp-card-loc { color: var(--nv-text-muted); font-size: 0.85rem; margin: 0; }
.nv-exp-card-price { font-weight: 700; font-size: 0.95rem; margin: 0; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- ExperienceCard`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/demo/ExperienceCard.tsx src/components/navi/demo/__tests__/ExperienceCard.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): ExperienceCard composite (feed card)"
```

---

### Task 5: ResultCard (search-result row composite)

**Files:**
- Create: `src/components/navi/demo/ResultCard.tsx`
- Test: `src/components/navi/demo/__tests__/ResultCard.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ResultCard } from "@/components/navi/demo/ResultCard";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("ResultCard", () => {
  const e = EXPERIENCES[0];

  it("renders a horizontal row with photo, title, location, rating, impact, price", () => {
    render(<ResultCard experience={e} href="#" />);
    expect(screen.getByRole("link", { name: new RegExp(e.title, "i") })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(e.neighborhood))).toBeInTheDocument();
    expect(screen.getByLabelText(/rated/i)).toBeInTheDocument();
    expect(screen.getByText(e.impactPhrase)).toBeInTheDocument();
    expect(screen.getByText(`$${e.price} per person`)).toBeInTheDocument();
  });

  it("fires onHover when the row is moused over", async () => {
    const onHover = vi.fn();
    render(<ResultCard experience={e} href="#" onHover={onHover} />);
    await userEvent.hover(screen.getByRole("link"));
    expect(onHover).toHaveBeenCalledWith(e.slug);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- ResultCard`.

- [ ] **Step 3: Implement** — `src/components/navi/demo/ResultCard.tsx`:

```tsx
"use client";

import Link from "next/link";
import { Tag, Rating, ImpactSignal } from "@/components/navi/ui";
import type { Experience } from "@/lib/navi/demo-data";

export function ResultCard({
  experience: e,
  href,
  onHover,
}: {
  experience: Experience;
  href: string;
  onHover?: (slug: string) => void;
}) {
  return (
    <Link
      href={href}
      className="nv-result"
      onMouseEnter={() => onHover?.(e.slug)}
      onFocus={() => onHover?.(e.slug)}
    >
      <div className="nv-result-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={e.photos[0].src} alt={e.photos[0].alt} />
      </div>
      <div className="nv-result-body">
        <Tag tone={e.tone}>
          {e.tone === "local" ? "Locally-owned" : e.tone === "popular" ? "Popular" : e.category}
        </Tag>
        <h3 className="nv-result-title">{e.title}</h3>
        <p className="nv-result-loc">
          {e.neighborhood}, {e.borough}
        </p>
        <Rating value={e.rating} reviews={e.reviews} />
        <ImpactSignal>{e.impactPhrase}</ImpactSignal>
        <p className="nv-result-price">${e.price} per person</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-result {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: var(--nv-sp-md);
  padding: var(--nv-sp-md) 0;
  border-bottom: 1px solid var(--nv-border);
  text-decoration: none;
  color: var(--nv-text);
}
.nv-result:hover { background: var(--nv-surface-muted); }
.nv-result-photo { width: 160px; height: 120px; border-radius: var(--nv-r-md); overflow: hidden; }
.nv-result-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nv-result-body { display: grid; gap: var(--nv-sp-2xs); align-content: start; }
.nv-result-title { font-size: 1rem; margin: 0; }
.nv-result-loc { color: var(--nv-text-muted); font-size: 0.85rem; margin: 0; }
.nv-result-price { font-weight: 700; margin: 0; }
@media (max-width: 720px) {
  .nv-result { grid-template-columns: 1fr; }
  .nv-result-photo { width: 100%; height: 160px; }
}
```

- [ ] **Step 5: Run → PASS.** `npm test -- ResultCard`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/demo/ResultCard.tsx src/components/navi/demo/__tests__/ResultCard.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): ResultCard search-row composite"
```

---

### Task 6: BookingCard (sticky detail booking)

**Files:**
- Create: `src/components/navi/demo/BookingCard.tsx`
- Test: `src/components/navi/demo/__tests__/BookingCard.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { BookingCard } from "@/components/navi/demo/BookingCard";

const dates = [
  { date: "Monday, March 23", time: "12:00 pm" },
  { date: "Tuesday, March 24", time: "12:00 pm" },
  { date: "Thursday, March 26", time: "12:00 pm" },
];

describe("BookingCard", () => {
  it("renders the price, dates, and Reserve / Contact actions", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(screen.getByText("From $48")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /contact organizer/i })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(dates.length);
  });

  it("the first date is selected by default", () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    expect(screen.getByRole("radio", { name: /Monday, March 23/i })).toBeChecked();
  });

  it("selecting another date updates state", async () => {
    render(<BookingCard priceFrom={48} dates={dates} onReserve={() => {}} />);
    await userEvent.click(screen.getByRole("radio", { name: /Tuesday, March 24/i }));
    expect(screen.getByRole("radio", { name: /Tuesday, March 24/i })).toBeChecked();
  });

  it("Reserve fires onReserve with the selected date and shows confirmation", async () => {
    const onReserve = vi.fn();
    render(<BookingCard priceFrom={48} dates={dates} onReserve={onReserve} />);
    await userEvent.click(screen.getByRole("button", { name: "Reserve now" }));
    expect(onReserve).toHaveBeenCalledWith(dates[0]);
    expect(screen.getByText(/reserved/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- BookingCard`.

- [ ] **Step 3: Implement** — `src/components/navi/demo/BookingCard.tsx`:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/navi/ui";
import type { BookingDate } from "@/lib/navi/demo-data";

export function BookingCard({
  priceFrom,
  dates,
  onReserve,
}: {
  priceFrom: number;
  dates: BookingDate[];
  onReserve: (d: BookingDate) => void;
}) {
  const [selected, setSelected] = useState<BookingDate>(dates[0]);
  const [reserved, setReserved] = useState(false);

  return (
    <aside className="nv-booking" aria-label="Book this experience">
      <p className="nv-booking-price">From ${priceFrom}</p>
      <fieldset className="nv-booking-dates">
        <legend className="nv-sr-only">Select a date</legend>
        {dates.map((d) => {
          const isActive = d.date === selected.date && d.time === selected.time;
          return (
            <label key={`${d.date}-${d.time}`} className={`nv-booking-date${isActive ? " nv-booking-date--active" : ""}`}>
              <input
                type="radio"
                name="booking-date"
                className="nv-sr-only"
                checked={isActive}
                onChange={() => {
                  setSelected(d);
                  setReserved(false);
                }}
              />
              <span className="nv-booking-date-day">{d.date}</span>
              <span className="nv-booking-date-time">{d.time}</span>
            </label>
          );
        })}
      </fieldset>
      {reserved ? (
        <p className="nv-booking-confirm" role="status">
          Reserved for {selected.date} at {selected.time}.
        </p>
      ) : (
        <Button
          variant="primary"
          onClick={() => {
            onReserve(selected);
            setReserved(true);
          }}
        >
          Reserve now
        </Button>
      )}
      <Button variant="transparent">Contact organizer</Button>
    </aside>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-booking {
  display: grid;
  gap: var(--nv-sp-md);
  padding: var(--nv-sp-lg);
  border: 1px solid var(--nv-border);
  border-radius: var(--nv-r-lg);
  background: var(--nv-surface);
  position: sticky;
  top: var(--nv-sp-lg);
}
.nv-booking-price { font-size: 1.6rem; font-weight: 700; margin: 0; }
.nv-booking-dates { display: grid; gap: var(--nv-sp-xs); border: none; padding: 0; }
.nv-booking-date {
  display: flex;
  justify-content: space-between;
  padding: var(--nv-sp-sm);
  border: 1px solid var(--nv-border);
  border-radius: var(--nv-r-md);
  cursor: pointer;
}
.nv-booking-date--active { border-color: var(--nv-action); background: var(--nv-surface-muted); }
.nv-booking-date-day { font-weight: 700; }
.nv-booking-date-time { color: var(--nv-text-muted); }
.nv-booking-confirm { margin: 0; padding: var(--nv-sp-sm); background: var(--nv-surface-muted); border-radius: var(--nv-r-md); color: var(--nv-text); }
```

- [ ] **Step 5: Run → PASS.** `npm test -- BookingCard`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/demo/BookingCard.tsx src/components/navi/demo/__tests__/BookingCard.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): BookingCard with date selection and reserve state"
```

---

### Task 7: TransitOptions

**Files:**
- Create: `src/components/navi/demo/TransitOptions.tsx`
- Test: `src/components/navi/demo/__tests__/TransitOptions.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TransitOptions } from "@/components/navi/demo/TransitOptions";

const options = [
  { mode: "subway" as const, label: "Take the", detail: "Q or R" },
  { mode: "citibike" as const, label: "Grab a Citibike", detail: "0.2 miles away" },
  { mode: "walk" as const, label: "Walk", detail: "30 min to dock" },
];

describe("TransitOptions", () => {
  it("renders one entry per option with mode label and detail", () => {
    render(<TransitOptions options={options} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Q or R")).toBeInTheDocument();
    expect(screen.getByText("0.2 miles away")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- TransitOptions`.

- [ ] **Step 3: Implement** — `src/components/navi/demo/TransitOptions.tsx`:

```tsx
import type { TransitOption } from "@/lib/navi/demo-data";

const ICONS: Record<TransitOption["mode"], string> = {
  subway: "🚇",
  citibike: "🚲",
  walk: "🚶",
};

export function TransitOptions({ options }: { options: TransitOption[] }) {
  return (
    <ul className="nv-transit">
      {options.map((o) => (
        <li key={o.mode} className="nv-transit-item">
          <span className="nv-transit-icon" aria-hidden="true">
            {ICONS[o.mode]}
          </span>
          <span className="nv-transit-label">{o.label}</span>
          <span className="nv-transit-detail">{o.detail}</span>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-transit { display: flex; gap: var(--nv-sp-lg); list-style: none; padding: 0; margin: 0; flex-wrap: wrap; }
.nv-transit-item { display: flex; flex-direction: column; align-items: center; gap: var(--nv-sp-2xs); text-align: center; min-width: 120px; }
.nv-transit-icon { font-size: 1.5rem; }
.nv-transit-label { font-weight: 700; }
.nv-transit-detail { color: var(--nv-text-muted); font-size: 0.85rem; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- TransitOptions`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/demo/TransitOptions.tsx src/components/navi/demo/__tests__/TransitOptions.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): TransitOptions row"
```

---

### Task 8: Gallery (photo grid with click-to-expand)

**Files:**
- Create: `src/components/navi/demo/Gallery.tsx`
- Test: `src/components/navi/demo/__tests__/Gallery.test.tsx`
- Modify: `src/app/globals.css`

The Gallery reuses the existing portfolio `ExpandableImage` (which uses the inherited `LightboxProvider`).

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Gallery } from "@/components/navi/demo/Gallery";

const photos = [
  { src: "/a.jpg", alt: "Photo A" },
  { src: "/b.jpg", alt: "Photo B" },
  { src: "/c.jpg", alt: "Photo C" },
  { src: "/d.jpg", alt: "Photo D" },
  { src: "/e.jpg", alt: "Photo E" },
];

describe("Gallery", () => {
  it("renders a hero photo plus the rest as a thumb grid", () => {
    render(<Gallery photos={photos} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(photos.length);
    expect(imgs[0].getAttribute("alt")).toBe("Photo A");
  });

  it("renders a See gallery affordance", () => {
    render(<Gallery photos={photos} />);
    expect(screen.getByText(/see gallery/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Gallery`.

- [ ] **Step 3: Implement** — `src/components/navi/demo/Gallery.tsx`:

```tsx
"use client";

export function Gallery({ photos }: { photos: { src: string; alt: string }[] }) {
  const [hero, ...rest] = photos;
  const thumbs = rest.slice(0, 4);
  return (
    <figure className="nv-gallery">
      <div className="nv-gallery-hero">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={hero.src} alt={hero.alt} />
        <button type="button" className="nv-gallery-see">See gallery</button>
      </div>
      <div className="nv-gallery-thumbs">
        {thumbs.map((p) => (
          <div key={p.src} className="nv-gallery-thumb">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} />
          </div>
        ))}
      </div>
    </figure>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-gallery { display: grid; grid-template-columns: 2fr 1fr; gap: var(--nv-sp-sm); margin: 0; aspect-ratio: 2.4 / 1; }
.nv-gallery-hero { position: relative; overflow: hidden; border-radius: var(--nv-r-md); }
.nv-gallery-hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.nv-gallery-see {
  position: absolute;
  bottom: var(--nv-sp-sm);
  right: var(--nv-sp-sm);
  padding: 6px 14px;
  background: var(--nv-surface);
  border: 1px solid var(--nv-border);
  border-radius: var(--nv-r-pill);
  font-weight: 700;
  cursor: pointer;
}
.nv-gallery-thumbs { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: var(--nv-sp-sm); }
.nv-gallery-thumb { overflow: hidden; border-radius: var(--nv-r-md); }
.nv-gallery-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
@media (max-width: 720px) {
  .nv-gallery { grid-template-columns: 1fr; aspect-ratio: 4 / 3; }
  .nv-gallery-thumbs { display: none; }
}
```

- [ ] **Step 5: Run → PASS.** `npm test -- Gallery`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/demo/Gallery.tsx src/components/navi/demo/__tests__/Gallery.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): Gallery (hero + 4-thumb grid)"
```

---

### Task 9: Map (Leaflet wrapper, client-only)

**Files:**
- Create: `src/components/navi/demo/Map.client.tsx` (the real Leaflet implementation)
- Create: `src/components/navi/demo/Map.tsx` (the public, server-safe API)
- Create: `src/components/navi/demo/__tests__/Map.test.tsx`
- Modify: `src/app/globals.css`

The `Map` public component dynamically imports the client implementation with `ssr: false`, so Leaflet never runs on the server. Tests target the public API, mock the client implementation.

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

// Mock the dynamic client implementation so jsdom does not try to render Leaflet.
vi.mock("@/components/navi/demo/Map.client", () => ({
  default: ({ markers, center, zoom }: { markers: { id: string; label: string }[]; center: [number, number]; zoom: number }) => (
    <div data-testid="map-mock" data-center={center.join(",")} data-zoom={zoom}>
      {markers.map((m) => (
        <span key={m.id} data-marker={m.id}>{m.label}</span>
      ))}
    </div>
  ),
}));

import { Map } from "@/components/navi/demo/Map";

describe("Map", () => {
  it("renders an accessible container with the marker list as the keyboard-equivalent", () => {
    const markers = [
      { id: "a", lat: 40.7, lng: -73.9, label: "$48" },
      { id: "b", lat: 40.71, lng: -73.92, label: "$19" },
    ];
    render(<Map center={[40.7, -73.9]} zoom={12} markers={markers} />);
    expect(screen.getByRole("region", { name: /map/i })).toBeInTheDocument();
    // The mock renders markers so we can assert the props flowed through.
    expect(screen.getByTestId("map-mock").getAttribute("data-center")).toBe("40.7,-73.9");
    expect(screen.getByTestId("map-mock").getAttribute("data-zoom")).toBe("12");
    expect(screen.getAllByText(/\$/)).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Map`.

- [ ] **Step 3: Implement the public API** — `src/components/navi/demo/Map.tsx`:

```tsx
"use client";

import dynamic from "next/dynamic";

const MapClient = dynamic(() => import("./Map.client"), {
  ssr: false,
  loading: () => <div className="nv-map-skeleton" aria-hidden="true" />,
});

export type MapMarker = { id: string; lat: number; lng: number; label: string };

export function Map({
  center,
  zoom,
  markers,
  selectedId,
  onSelect,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  return (
    <section className="nv-map" aria-label="Map of nearby results">
      <MapClient
        center={center}
        zoom={zoom}
        markers={markers}
        selectedId={selectedId}
        onSelect={onSelect}
      />
    </section>
  );
}
```

- [ ] **Step 4: Implement the Leaflet client** — `src/components/navi/demo/Map.client.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapMarker } from "./Map";

export default function MapClient({
  center,
  zoom,
  markers,
  selectedId,
  onSelect,
}: {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: true, attributionControl: true }).setView(
      center,
      zoom,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    mapRef.current = map;
    markerLayerRef.current = L.layerGroup().addTo(map);
    return () => {
      map.remove();
      mapRef.current = null;
      markerLayerRef.current = null;
    };
  }, [center, zoom]);

  useEffect(() => {
    const layer = markerLayerRef.current;
    if (!layer) return;
    layer.clearLayers();
    for (const m of markers) {
      const selected = m.id === selectedId;
      const icon = L.divIcon({
        className: "nv-pin-leaflet",
        html: `<span class="nv-pin nv-pin--place${selected ? " nv-pin--selected" : ""}"><span class="nv-pin-value">${m.label}</span></span>`,
        iconSize: [48, 28],
        iconAnchor: [24, 28],
      });
      const marker = L.marker([m.lat, m.lng], { icon, keyboard: true, alt: `${m.label}, select` });
      if (onSelect) marker.on("click", () => onSelect(m.id));
      marker.addTo(layer);
    }
  }, [markers, selectedId, onSelect]);

  return <div ref={containerRef} className="nv-map-canvas" role="application" aria-label="Interactive map" />;
}
```

- [ ] **Step 5: CSS** — append:

```css
.nv-map { position: relative; height: 100%; min-height: 480px; border-radius: var(--nv-r-md); overflow: hidden; }
.nv-map-canvas { width: 100%; height: 100%; }
.nv-map-skeleton { width: 100%; height: 100%; background: var(--nv-surface-muted); }
.nv-pin-leaflet { background: none !important; border: none !important; }
```

- [ ] **Step 6: Run → PASS.** `npm test -- Map`.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/demo/Map.tsx src/components/navi/demo/Map.client.tsx src/components/navi/demo/__tests__/Map.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): Map (Leaflet + OSM, custom orange pins, client-only)"
```

---

### Task 10: Legend (map legend control)

**Files:**
- Create: `src/components/navi/demo/Legend.tsx`
- Test: `src/components/navi/demo/__tests__/Legend.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Legend } from "@/components/navi/demo/Legend";

describe("Legend", () => {
  it("renders a labelled list with pin entries", () => {
    render(<Legend />);
    expect(screen.getByRole("group", { name: /legend/i })).toBeInTheDocument();
    expect(screen.getByText(/locally-owned price/i)).toBeInTheDocument();
    expect(screen.getByText(/current location/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- Legend`.

- [ ] **Step 3: Implement** — `src/components/navi/demo/Legend.tsx`:

```tsx
import { MapPin } from "@/components/navi/ui";

export function Legend() {
  return (
    <div className="nv-legend" role="group" aria-label="Legend">
      <p className="nv-legend-title">Legend</p>
      <ul>
        <li>
          <MapPin kind="place" value="$" />
          <span>Locally-owned price</span>
        </li>
        <li>
          <MapPin kind="location" />
          <span>Current location</span>
        </li>
      </ul>
    </div>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-legend {
  position: absolute;
  bottom: var(--nv-sp-md);
  right: var(--nv-sp-md);
  padding: var(--nv-sp-sm) var(--nv-sp-md);
  background: var(--nv-surface);
  border: 1px solid var(--nv-border);
  border-radius: var(--nv-r-md);
  z-index: 5;
  font-size: 0.82rem;
}
.nv-legend-title { font-weight: 700; margin: 0 0 var(--nv-sp-2xs); }
.nv-legend ul { display: grid; gap: var(--nv-sp-2xs); list-style: none; padding: 0; margin: 0; }
.nv-legend li { display: flex; align-items: center; gap: var(--nv-sp-xs); }
```

- [ ] **Step 5: Run → PASS.** `npm test -- Legend`.

- [ ] **Step 6: Commit**

```bash
git add src/components/navi/demo/Legend.tsx src/components/navi/demo/__tests__/Legend.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): Legend control for the map"
```

---

## Phase C — Routes

### Task 11: Layout update for mobile TabBar

**Files:**
- Modify: `src/app/work/navi/(minisite)/layout.tsx`

- [ ] **Step 1: Read the current layout** and confirm structure (header, main, footer).

- [ ] **Step 2: Add the TabBar render** — modify `src/app/work/navi/(minisite)/layout.tsx`:

```tsx
import type { ReactNode } from "react";
import { naviDisplay, naviBody } from "@/lib/navi/fonts";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";
import { NaviFooter } from "@/components/navi/chrome/NaviFooter";
import { TabBar } from "@/components/navi/ui";

const TAB_ITEMS = [
  { id: "explore", label: "Explore", icon: <span>⌕</span>, href: "/work/navi/demo" },
  { id: "search", label: "Search", icon: <span>○</span>, href: "/work/navi/demo/search" },
  { id: "system", label: "System", icon: <span>▤</span>, href: "/work/navi/system" },
];

export default function NaviMinisiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={`nv-ui ${naviDisplay.variable} ${naviBody.variable}`}>
      <NaviHeader />
      <main id="main-content">{children}</main>
      <NaviFooter />
      <TabBar items={TAB_ITEMS} active="explore" />
    </div>
  );
}
```

(The `active` prop is a simple default for now — Phase D handles route-aware activation.)

- [ ] **Step 3: Run** — `npm test && npx tsc --noEmit`. Expected: green.

- [ ] **Step 4: Commit**

```bash
git add src/app/work/navi/\(minisite\)/layout.tsx
git commit -m "feat(navi-demo): mount TabBar in the mini-site layout"
```

---

### Task 12: Discovery feed page

**Files:**
- Create: `src/app/work/navi/(minisite)/demo/page.tsx`
- Test: `src/components/navi/demo/__tests__/feed-page.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FeedPage from "@/app/work/navi/(minisite)/demo/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Feed page", () => {
  it("renders a card for every experience", () => {
    render(<FeedPage />);
    // each card is a link to its slug
    for (const e of EXPERIENCES) {
      expect(
        screen.getByRole("link", { name: new RegExp(e.title, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("renders the category taskbar with all categories", () => {
    render(<FeedPage />);
    expect(screen.getByRole("region", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cooking" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Architecture" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- feed-page`.

- [ ] **Step 3: Implement** — `src/app/work/navi/(minisite)/demo/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { SearchInput, Tag } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { EXPERIENCES, CATEGORIES } from "@/lib/navi/demo-data";

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return EXPERIENCES.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false;
      if (q && !`${e.title} ${e.neighborhood}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeCategory]);

  return (
    <div className="nv-feed">
      <header className="nv-feed-head">
        <h1>Find your next neighborhood-led experience</h1>
        <SearchInput
          label="Search experiences"
          value={query}
          onChange={setQuery}
          placeholder="e.g. cooking in Bed-Stuy"
        />
      </header>

      <section className="nv-feed-categories" aria-label="Categories">
        <button
          type="button"
          className={`nv-feed-cat${activeCategory === null ? " nv-feed-cat--active" : ""}`}
          onClick={() => setActiveCategory(null)}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`nv-feed-cat${activeCategory === c ? " nv-feed-cat--active" : ""}`}
            onClick={() => setActiveCategory(c)}
          >
            {c}
          </button>
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="nv-feed-empty">No experiences match. Try clearing the category or search.</p>
      ) : (
        <ul className="nv-feed-grid">
          {filtered.map((e) => (
            <li key={e.slug}>
              <ExperienceCard
                experience={e}
                href={`/work/navi/demo/experience/${e.slug}`}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-feed { max-width: 72rem; margin: 0 auto; padding: var(--nv-sp-xl) var(--nv-sp-lg); }
.nv-feed-head { display: grid; gap: var(--nv-sp-md); margin-bottom: var(--nv-sp-xl); }
.nv-feed-head h1 { font-size: clamp(1.6rem, 3vw, 2.2rem); margin: 0; }
.nv-feed-categories { display: flex; gap: var(--nv-sp-xs); flex-wrap: wrap; margin-bottom: var(--nv-sp-xl); }
.nv-feed-cat { padding: 8px 16px; border: 1px solid var(--nv-border); border-radius: var(--nv-r-pill); background: var(--nv-surface); cursor: pointer; font-weight: 700; color: var(--nv-text); }
.nv-feed-cat--active { border-color: var(--nv-action); color: var(--nv-action); background: var(--nv-surface-muted); }
.nv-feed-grid { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--nv-sp-lg); }
.nv-feed-empty { color: var(--nv-text-muted); padding: var(--nv-sp-xl) 0; text-align: center; }
```

- [ ] **Step 5: Run → PASS.** `npm test -- feed-page`.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/navi/\(minisite\)/demo/page.tsx src/components/navi/demo/__tests__/feed-page.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): discovery feed page with search + category filter"
```

---

### Task 13: Search page (results + map)

**Files:**
- Create: `src/app/work/navi/(minisite)/demo/search/page.tsx`
- Test: `src/components/navi/demo/__tests__/search-page.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/navi/demo/Map.client", () => ({
  default: ({ markers }: { markers: { id: string }[] }) => (
    <div data-testid="map-mock">{markers.length} markers</div>
  ),
}));

import SearchPage from "@/app/work/navi/(minisite)/demo/search/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Search page", () => {
  it("shows a result count header", () => {
    render(<SearchPage />);
    expect(screen.getByRole("heading", { name: new RegExp(`${EXPERIENCES.length} nearby`, "i") })).toBeInTheDocument();
  });

  it("filters results by typed query and updates the count", async () => {
    render(<SearchPage />);
    const box = screen.getByRole("searchbox");
    await userEvent.type(box, "prospect");
    const onlyMatches = EXPERIENCES.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes("prospect"),
    );
    expect(screen.getByRole("heading", { name: new RegExp(`${onlyMatches.length} nearby`, "i") })).toBeInTheDocument();
  });

  it("renders the map and the legend", () => {
    render(<SearchPage />);
    expect(screen.getByRole("region", { name: /map/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /legend/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- search-page`.

- [ ] **Step 3: Implement** — `src/app/work/navi/(minisite)/demo/search/page.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ResultCard } from "@/components/navi/demo/ResultCard";
import { Map } from "@/components/navi/demo/Map";
import { Legend } from "@/components/navi/demo/Legend";
import { EXPERIENCES } from "@/lib/navi/demo-data";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | undefined>(undefined);

  const results = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return EXPERIENCES;
    return EXPERIENCES.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes(q),
    );
  }, [query]);

  const markers = useMemo(
    () => results.map((e) => ({ id: e.slug, lat: e.lat, lng: e.lng, label: `$${e.price}` })),
    [results],
  );

  return (
    <div className="nv-search-page">
      <aside className="nv-search-list">
        <header className="nv-search-head">
          <h1 className="nv-search-count">View {results.length} nearby results</h1>
          <SearchInput label="Search experiences" value={query} onChange={setQuery} placeholder="Search" />
        </header>
        {results.length === 0 ? (
          <p className="nv-search-empty">No matches. Try a broader term.</p>
        ) : (
          <ul className="nv-search-results">
            {results.map((e) => (
              <li key={e.slug}>
                <ResultCard
                  experience={e}
                  href={`/work/navi/demo/experience/${e.slug}`}
                  onHover={setHovered}
                />
              </li>
            ))}
          </ul>
        )}
      </aside>
      <div className="nv-search-map">
        <Map
          center={[40.68, -73.95]}
          zoom={12}
          markers={markers}
          selectedId={hovered}
        />
        <Legend />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-search-page { display: grid; grid-template-columns: minmax(0, 1fr) 1.2fr; min-height: calc(100vh - 200px); }
.nv-search-list { padding: var(--nv-sp-lg); overflow-y: auto; max-height: calc(100vh - 80px); }
.nv-search-head { display: grid; gap: var(--nv-sp-md); margin-bottom: var(--nv-sp-md); }
.nv-search-count { font-size: 1.4rem; margin: 0; }
.nv-search-results { list-style: none; padding: 0; margin: 0; }
.nv-search-empty { color: var(--nv-text-muted); padding: var(--nv-sp-xl) 0; }
.nv-search-map { position: relative; }
@media (max-width: 720px) {
  .nv-search-page { grid-template-columns: 1fr; }
  .nv-search-map { height: 60vh; }
}
```

- [ ] **Step 5: Run → PASS.** `npm test -- search-page`.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/navi/\(minisite\)/demo/search/page.tsx src/components/navi/demo/__tests__/search-page.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): search page with filterable results + interactive map"
```

---

### Task 14: Experience detail page

**Files:**
- Create: `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`
- Test: `src/components/navi/demo/__tests__/experience-page.test.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/navi/demo/Map.client", () => ({
  default: () => <div data-testid="map-mock" />,
}));

import ExperiencePage from "@/app/work/navi/(minisite)/demo/experience/[slug]/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Experience page", () => {
  const e = EXPERIENCES[0];

  it("renders title, gallery, Learn/Plan/Go tabs, and booking card", () => {
    render(<ExperiencePage params={{ slug: e.slug }} />);
    expect(screen.getByRole("heading", { level: 1, name: e.title })).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("opens with Learn tab and shows the impact statement up front", () => {
    render(<ExperiencePage params={{ slug: e.slug }} />);
    expect(screen.getByRole("tab", { name: "Learn" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(e.impactStatement)).toBeVisible();
  });

  it("switching to Go reveals the transit options", async () => {
    render(<ExperiencePage params={{ slug: e.slug }} />);
    await userEvent.click(screen.getByRole("tab", { name: "Go" }));
    expect(screen.getByText(/q or r/i)).toBeVisible();
  });
});
```

- [ ] **Step 2: Run → FAIL.** `npm test -- experience-page`.

- [ ] **Step 3: Implement** — `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`:

```tsx
"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { Tabs, Accordion, Avatar, Rating, ImpactSignal } from "@/components/navi/ui";
import { Gallery } from "@/components/navi/demo/Gallery";
import { BookingCard } from "@/components/navi/demo/BookingCard";
import { TransitOptions } from "@/components/navi/demo/TransitOptions";
import { Map } from "@/components/navi/demo/Map";
import { getExperienceBySlug } from "@/lib/navi/demo-data";

export default function ExperiencePage({ params }: { params: { slug: string } }) {
  const e = getExperienceBySlug(params.slug);
  if (!e) notFound();
  const [tab, setTab] = useState("learn");

  const tabItems = [
    {
      id: "learn",
      label: "Learn",
      content: (
        <div className="nv-detail-section">
          <p className="nv-detail-host">
            <Avatar name={e.host.name} size="sm" /> Hosted by {e.host.name}
          </p>
          <p className="nv-detail-prose">{e.learn}</p>
          <Rating value={e.rating} reviews={e.reviews} />
          <ImpactSignal as="div">{e.impactStatement}</ImpactSignal>
        </div>
      ),
    },
    {
      id: "plan",
      label: "Plan",
      content: (
        <Accordion
          items={[
            { id: "bring", title: "What to bring", content: e.plan.bring },
            { id: "commitments", title: "Pre-arrival commitments", content: e.plan.commitments },
            { id: "impact", title: "Impact initiative", content: e.plan.impactDetail },
          ]}
        />
      ),
    },
    {
      id: "go",
      label: "Go",
      content: (
        <div className="nv-detail-section">
          <p className="nv-detail-where-heading">Where?</p>
          <p>{e.go.addressLine1}</p>
          <p>{e.go.addressLine2}</p>
          <div className="nv-detail-where-map">
            <Map
              center={[e.lat, e.lng]}
              zoom={15}
              markers={[{ id: e.slug, lat: e.lat, lng: e.lng, label: "" }]}
            />
          </div>
          <h2 className="nv-detail-go-heading">How to get there</h2>
          <TransitOptions options={e.go.transit} />
        </div>
      ),
    },
  ];

  return (
    <article className="nv-detail">
      <Gallery photos={e.photos} />
      <header className="nv-detail-head">
        <h1>{e.title}</h1>
      </header>
      <div className="nv-detail-body">
        <div className="nv-detail-main">
          <Tabs items={tabItems} value={tab} onChange={setTab} />
        </div>
        <BookingCard
          priceFrom={e.price}
          dates={e.dates}
          onReserve={() => {
            /* demo: state lives inside BookingCard */
          }}
        />
      </div>
    </article>
  );
}
```

- [ ] **Step 4: CSS** — append:

```css
.nv-detail { max-width: 72rem; margin: 0 auto; padding: var(--nv-sp-xl) var(--nv-sp-lg); }
.nv-detail-head h1 { font-size: clamp(1.6rem, 3vw, 2rem); margin: var(--nv-sp-lg) 0 var(--nv-sp-md); }
.nv-detail-body { display: grid; grid-template-columns: minmax(0, 1fr) 320px; gap: var(--nv-sp-xl); align-items: start; }
.nv-detail-main { min-width: 0; }
.nv-detail-section { display: grid; gap: var(--nv-sp-md); padding-top: var(--nv-sp-md); }
.nv-detail-host { display: inline-flex; gap: var(--nv-sp-xs); align-items: center; color: var(--nv-text-muted); }
.nv-detail-prose { max-width: 60ch; }
.nv-detail-where-heading { font-weight: 700; }
.nv-detail-where-map { height: 280px; border-radius: var(--nv-r-md); overflow: hidden; }
.nv-detail-go-heading { font-size: 1.1rem; margin-top: var(--nv-sp-md); }
@media (max-width: 720px) {
  .nv-detail-body { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Run → PASS.** `npm test -- experience-page`.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/navi/\(minisite\)/demo/experience src/components/navi/demo/__tests__/experience-page.test.tsx src/app/globals.css
git commit -m "feat(navi-demo): experience detail page (Learn/Plan/Go + booking)"
```

---

## Phase D — Wiring, polish, verification

### Task 15: Re-point header links and add forward CTA on /system

**Files:**
- Modify: `src/components/navi/chrome/NaviHeader.tsx`
- Modify: `src/components/navi/chrome/__tests__/NaviHeader.test.tsx`
- Modify: `src/app/work/navi/(minisite)/system/page.tsx`

- [ ] **Step 1: Restore demo links in NaviHeader** — remove the `TODO(plan-2)` comments. Change the wordmark `href` and the "Explore" link `href` from `/work/navi/system` to `/work/navi/demo`.

- [ ] **Step 2: Update the NaviHeader test** — change the asserted "explore" link href back to `/work/navi/demo`. The "system" link expectation stays at `/work/navi/system`.

- [ ] **Step 3: Add the closing CTA to the system page** — at the bottom of `SystemPage` (after the last `Chapter`), add:

```tsx
<section className="nv-system-cta">
  <h2>See it in the product</h2>
  <p>The same components, assembled into a working booking flow.</p>
  <a className="nv-btn nv-btn--primary nv-btn--md" href="/work/navi/demo">Open the demo</a>
</section>
```

Append CSS to `globals.css`:

```css
.nv-system-cta { padding: var(--nv-sp-2xl) 0; text-align: center; border-top: 1px solid var(--nv-border); }
.nv-system-cta h2 { font-size: 1.6rem; margin: 0 0 var(--nv-sp-2xs); }
.nv-system-cta p { color: var(--nv-text-muted); margin: 0 0 var(--nv-sp-lg); }
```

- [ ] **Step 4: Run → PASS.** `npm test`. All tests green.

- [ ] **Step 5: Commit**

```bash
git add src/components/navi/chrome/NaviHeader.tsx src/components/navi/chrome/__tests__/NaviHeader.test.tsx src/app/work/navi/\(minisite\)/system/page.tsx src/app/globals.css
git commit -m "feat(navi-demo): restore demo links + forward CTA from /system"
```

---

### Task 16: Update the case study bridge to mention the live demo

**Files:**
- Modify: `src/app/work/navi/page.tsx`

- [ ] **Step 1: Update the system-section bridge paragraph** to add the demo link. Find the bridge paragraph in the `<section aria-labelledby="nv-system">` (currently: "The full system lives as a running component library, with the brand primitives, the semantic aliases, every interactive variant, and a live playground for flipping props. [See the Navi design system](/work/navi/system).") and append a second sentence + link:

Replace the existing paragraph with:

```tsx
<p>
  The full system lives as a running component library, with the brand
  primitives, the semantic aliases, every interactive variant, and a live
  playground for flipping props. <a href="/work/navi/system">See the Navi
  design system</a>. The components are also assembled into a working
  booking flow. <a href="/work/navi/demo">Open the demo</a>.
</p>
```

- [ ] **Step 2: Run → PASS.** `npm test`. No tests should break.

- [ ] **Step 3: Commit**

```bash
git add src/app/work/navi/page.tsx
git commit -m "docs(navi): point the case-study system bridge at the live demo too"
```

---

### Task 17: Asset fetch + final verification

**Files:**
- Create: photos under `public/projects/navi-demo/` (manual or via Figma `download_assets`)

- [ ] **Step 1: Pull real Figma assets**

If you have Figma MCP access, run `mcp__figma__download_assets` for the photo nodes referenced by the seed experiences in `src/lib/navi/demo-data.ts` and save them to `public/projects/navi-demo/`. Otherwise use placeholder photos (any 4:3 or 16:9 images sourced from your own assets) for now; demo data already declares the paths.

- [ ] **Step 2: Final test suite + typecheck**

```bash
npm test && npx tsc --noEmit
```

Expected: all tests pass, no type errors.

- [ ] **Step 3: Preview verification** (what unit tests can't see)

```
- preview_start "dev"
- Visit /work/navi/demo — confirm feed renders with cards, search + category filter work
- Visit /work/navi/demo/search — confirm split view, map renders with orange pins, hovering a result highlights its pin
- Click a result → /work/navi/demo/experience/[slug] — confirm gallery, Learn tab default, Plan accordion, Go transit, booking card
- preview_resize to mobile (375px) — confirm TabBar appears at bottom, search split collapses to stacked, gallery becomes single-column
- preview_console_logs — zero errors, zero hydration warnings
- Tab through the booking dates — confirm keyboard nav works on the radio fieldset
- Press Escape with a Tooltip open — confirm it dismisses
```

- [ ] **Step 4: Commit any asset additions**

```bash
git add public/projects/navi-demo/
git commit -m "feat(navi-demo): add gallery and card photo assets"
```

---

## Self-Review

**Spec coverage (Plan 2 scope = §3 product concept, §7 demo views, §7.4 map, §7.5 data, §7.6 polish, §8 cross-cutting):**

- §3 product concept (Learn/Plan/Go structure) → Task 2 data shape + Task 14 detail page ✓
- §7.1 discovery feed → Task 12 ✓
- §7.2 search + map → Task 13 + Tasks 9-10 ✓
- §7.3 detail (Learn/Plan/Go, gallery, booking, transit) → Task 14 + Tasks 6-8 ✓
- §7.4 real interactive map (Leaflet+OSM, custom orange pins, list-as-equivalent) → Tasks 9, 10, 13 ✓
- §7.5 transcribed demo data + impactInitiative fields → Task 2 ✓
- §7.6 polish (impact signal on card, dogfooding composition, AA-action throughout) → ExperienceCard (Task 4), ResultCard (Task 5), all composites use Plan 1 primitives that already carry the corrections ✓
- §7.7 states (empty results, location pin, loading skeleton via Map.tsx loader) → empty state in Tasks 12 + 13, map skeleton in Task 9 ✓
- §8 responsive (mobile TabBar, breakpoints) → Task 3 + Task 11 + responsive CSS in each page task ✓
- §8 a11y (keyboard, contrast, results-as-map-equivalent, photo alt text) → tests assert roles/aria across; alt text comes from real Figma copy ✓
- Forward navigation from /system → /demo and case-study bridge → Tasks 15, 16 ✓

**Placeholder scan:** No "TBD"/"TODO" in steps. Task 2 explicitly marks the seed data as "replace with Figma copy during execution" — that's a deliberate extraction instruction, not a placeholder. Task 17 explicitly handles the photo asset fetch.

**Type/name consistency:** `Experience`, `BookingDate`, `TransitOption`, `MapMarker` are defined once in `demo-data.ts` and `Map.tsx` and reused. Class names (`nv-exp-card`, `nv-result`, `nv-booking`, `nv-detail-*`) are namespaced and don't collide with Plan 1. Tab IDs (`learn`, `plan`, `go`) match across the detail page and the test. The Map's `selectedId` prop name is consistent between `Map.tsx`, `Map.client.tsx`, and `search/page.tsx`'s `hovered` state binding.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-19-navi-playable-demo.md`.

Two execution options:

**1. Subagent-Driven (recommended)** — fresh subagent per task or per coherent cluster, two-stage review between clusters, fast iteration. Same workflow that built Plan 1.

**2. Inline Execution** — execute tasks in this session via `executing-plans`, batched with checkpoints for review.

Which approach?
