# Navi Substance Pass — Slice 3 Implementation Plan (Neighborhood pages)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/work/navi/demo/neighborhood/[slug]` pages that show a narrative intro, a mini-map of every experience in the neighborhood, the experiences grid, and the hosts based there. Cross-link from the experience detail page and (already done in Slice 2) the host page footer.

**Architecture:** Mirror the Slice 2 host approach. Keep a separate `neighborhoods.ts` module: a `NEIGHBORHOODS` record keyed by slug carrying `{ slug, name, borough, intro }`, plus pure helpers (`neighborhoodSlug`, `getNeighborhoodBySlug`, `experiencesByNeighborhood`, `neighborhoodCentroid`, `hostsByNeighborhood`). The page is a server component that reads `NEIGHBORHOODS[slug]` and derives the rest from `EXPERIENCES`. The `neighborhoodSlug` slugifier becomes the single source of truth, replacing the local copy the Slice 2 host page defined inline.

**Tech Stack:** Next.js 16 App Router (React 19), TypeScript, vitest + @testing-library/react, plain CSS using existing `nv-*` tokens.

**Spec reference:** [docs/superpowers/specs/2026-06-21-navi-substance-pass-design.md](../specs/2026-06-21-navi-substance-pass-design.md), Slice 3.

---

## Scope decisions (read before starting)

**Feed-card neighborhood link is intentionally out of scope.** The spec lists three cross-links: experience detail, feed card, and host page footer. `ExperienceCard` renders the entire card as a single `<Link>` (see `src/components/navi/demo/ExperienceCard.tsx:20`). Nesting a second anchor (the neighborhood pill) inside it produces invalid HTML. Refactoring that shared component to a stretched-link pattern would ripple through the feed, search, and host pages and their tests for a marginal benefit. So: implement the experience-detail neighborhood link, confirm the host-page footer link (built in Slice 2) now resolves, and skip the feed-card link. This decision is documented in the PR comment too.

**Neighborhood data lives in its own module,** not inline in `demo-data.ts`. The spec text said "data migration in demo-data.ts," but Slice 2 established the cleaner pattern of a dedicated lookup module (`hosts.ts`), and we follow it here for consistency. No change to the `Experience` type is needed: experiences already carry `neighborhood` and `borough` strings, and we derive the slug at lookup time.

---

## File map

**New files:**
- `src/lib/navi/neighborhoods.ts` — `Neighborhood` type, `NEIGHBORHOODS` record, `neighborhoodSlug`, `getNeighborhoodBySlug`, `experiencesByNeighborhood`, `neighborhoodCentroid`, `hostsByNeighborhood`.
- `src/lib/navi/__tests__/neighborhoods.test.ts` — unit tests for the helpers + coverage assertion.
- `src/app/work/navi/(minisite)/demo/neighborhood/[slug]/page.tsx` — server component + pure `NeighborhoodView`.
- `src/components/navi/demo/__tests__/neighborhood-page.test.tsx` — render tests.

**Modified files:**
- `src/lib/navi/hosts.ts` — import and re-export nothing new, but the host page (below) switches to the shared slugifier.
- `src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx` — replace the local `neighborhoodSlug` with the shared import from `@/lib/navi/neighborhoods`.
- `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx` — add a neighborhood link in the Go section.
- `src/components/navi/demo/__tests__/experience-page.test.tsx` — one new assertion.
- `src/app/globals.css` — add `.nv-neighborhood-*` block and a small `.nv-detail-where-nb` rule.

---

## Task 1: Neighborhood data module + helpers

**Files:**
- Create: `src/lib/navi/neighborhoods.ts`
- Create: `src/lib/navi/__tests__/neighborhoods.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/navi/__tests__/neighborhoods.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  NEIGHBORHOODS,
  neighborhoodSlug,
  getNeighborhoodBySlug,
  experiencesByNeighborhood,
  neighborhoodCentroid,
  hostsByNeighborhood,
} from "@/lib/navi/neighborhoods";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("neighborhoodSlug", () => {
  it("kebab-cases names", () => {
    expect(neighborhoodSlug("Park Slope")).toBe("park-slope");
  });
  it("handles hyphens and uppercase acronyms", () => {
    expect(neighborhoodSlug("Bedford-Stuyvesant")).toBe("bedford-stuyvesant");
    expect(neighborhoodSlug("DUMBO")).toBe("dumbo");
  });
});

describe("NEIGHBORHOODS record", () => {
  it("has an entry for every distinct neighborhood referenced by an experience", () => {
    const referenced = new Set(EXPERIENCES.map((e) => neighborhoodSlug(e.neighborhood)));
    for (const slug of referenced) {
      expect(NEIGHBORHOODS[slug], `missing NEIGHBORHOODS["${slug}"]`).toBeDefined();
    }
  });
  it("gives each entry a non-empty intro and a borough", () => {
    for (const n of Object.values(NEIGHBORHOODS)) {
      expect(n.intro.length).toBeGreaterThan(0);
      expect(n.borough.length).toBeGreaterThan(0);
    }
  });
});

describe("getNeighborhoodBySlug", () => {
  it("returns the neighborhood when found", () => {
    expect(getNeighborhoodBySlug("park-slope")?.name).toBe("Park Slope");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getNeighborhoodBySlug("nowhere")).toBeUndefined();
  });
});

describe("experiencesByNeighborhood", () => {
  it("returns every experience whose neighborhood slug matches", () => {
    const list = experiencesByNeighborhood("park-slope");
    expect(list.length).toBeGreaterThan(0);
    for (const e of list) expect(neighborhoodSlug(e.neighborhood)).toBe("park-slope");
  });
  it("returns an empty array for an unknown slug", () => {
    expect(experiencesByNeighborhood("nowhere")).toEqual([]);
  });
});

describe("neighborhoodCentroid", () => {
  it("averages lat and lng across the neighborhood's experiences", () => {
    const list = experiencesByNeighborhood("park-slope");
    const expectedLat = list.reduce((s, e) => s + e.lat, 0) / list.length;
    const expectedLng = list.reduce((s, e) => s + e.lng, 0) / list.length;
    const c = neighborhoodCentroid("park-slope");
    expect(c).not.toBeNull();
    expect(c![0]).toBeCloseTo(expectedLat, 6);
    expect(c![1]).toBeCloseTo(expectedLng, 6);
  });
  it("returns null when there are no experiences", () => {
    expect(neighborhoodCentroid("nowhere")).toBeNull();
  });
});

describe("hostsByNeighborhood", () => {
  it("returns distinct hosts whose experiences are in the neighborhood", () => {
    const hosts = hostsByNeighborhood("park-slope");
    expect(hosts.length).toBeGreaterThan(0);
    const slugs = hosts.map((h) => h.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("returns an empty array for an unknown slug", () => {
    expect(hostsByNeighborhood("nowhere")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run, verify failure**

Run: `npx vitest run src/lib/navi/__tests__/neighborhoods.test.ts`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement `src/lib/navi/neighborhoods.ts`**

The 25 intros below are final copy. Voice rules apply (no em-dashes, contractions throughout, no banned words). Transcribe them exactly.

```ts
import { EXPERIENCES } from "@/lib/navi/demo-data";
import { HOSTS, type Host } from "@/lib/navi/hosts";

export type Neighborhood = {
  slug: string;
  name: string;
  borough: string;
  intro: string;
};

export function neighborhoodSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Narrative intros keyed by slug. One source of truth for the prose so the
// page never has to branch on the name. Boroughs come from the experience
// data, so we only store the intro text here.
const INTROS: Record<string, string> = {
  "astoria":
    "Astoria runs on the smell of a dozen kitchens at once, Greek and Egyptian and Bangladeshi within the same block. The people who host here grew up on those corners, and they'll tell you which counter has stayed in the same family the longest.",
  "bedford-stuyvesant":
    "Bed-Stuy wears its brownstone history out loud, on stoops and in the gardens that neighbors tend together. Local hosts here treat the block as the real attraction, not a backdrop.",
  "central-harlem":
    "Harlem's music and its food carry a century of arrivals, and they're still being added to. Hosts who live here can point you past the famous addresses to the rooms where the work actually happens.",
  "chelsea":
    "Chelsea folds galleries, the High Line, and old market halls into a few walkable avenues. The hosts here know which openings are worth your evening and which are just a crowd.",
  "chinatown":
    "Chinatown moves at the pace of its produce stalls and its tea houses, and it rewards anyone who slows down to match it. Local hosts grew up running these errands, so they know the back rooms as well as the storefronts.",
  "coney-island":
    "Coney Island is louder in summer and quieter in a way worth seeing the rest of the year. Hosts from here can walk you past the boardwalk's surface into the community that keeps it running.",
  "dumbo":
    "DUMBO packs cobblestones, bridge views, and converted warehouses into a tight grid by the water. The people who host here remember it before the photos, and they'll show you both versions.",
  "east-flatbush":
    "East Flatbush carries the Caribbean across its bakeries, churches, and weekend markets. Hosts who live here can read the neighborhood's rhythms the way a regular reads a menu.",
  "east-village":
    "The East Village keeps its punk and its poetry close to the surface, in record stores and community gardens that have outlasted every trend. Local hosts can trace which corners earned their reputation.",
  "flushing":
    "Flushing's food halls are a city of their own, dense with regional cooking you won't find in a single guidebook. Hosts from here order in the languages the menus are written in.",
  "greenpoint":
    "Greenpoint holds onto its Polish bakeries while the waterfront fills in around them. The hosts here can tell you which traditions stayed and which ones are brand new.",
  "hamilton-heights":
    "Hamilton Heights climbs uptown with row houses, jazz history, and a college campus folded into the hills. Local hosts know the quiet blocks that the rest of the city skips.",
  "hunts-point":
    "Hunts Point feeds the city before dawn from its market, and it's home long after the trucks leave. Hosts here can show you the neighborhood the headlines usually miss.",
  "inwood":
    "Inwood keeps the island's last old forest and some of its steepest streets, far enough north to feel like a secret. The people who host here treat the parkland as a shared backyard.",
  "jackson-heights":
    "Jackson Heights might be the most spoken-over square mile in the country, with a different country's cooking on every block. Local hosts move between those worlds the way the rest of us cross a street.",
  "long-island-city":
    "Long Island City trades its industrial past for towers and studios, all of it staring back at the Manhattan skyline. Hosts here remember the factories and can point to what they became.",
  "lower-east-side":
    "The Lower East Side stacked immigrant generations on top of each other, and you can still taste each layer. Local hosts know which tenement stories are stitched into which storefronts.",
  "mott-haven":
    "Mott Haven is where hip-hop got its footing, and the murals still argue back. Hosts who live here can walk you through the history without flattening it.",
  "park-slope":
    "Park Slope lines its brownstones up against Prospect Park, and the food co-op runs on the same neighborly logic. The hosts here treat the block as an extension of their living room.",
  "ridgewood":
    "Ridgewood crosses the Brooklyn line quietly, all knish counters and new cafes sharing the same brick. Local hosts can tell you which spots have held the corner for fifty years.",
  "south-street-seaport":
    "The Seaport keeps the city's old harbor in its cobblestones and its tall ships. Hosts here can separate the maritime history from the mall that grew around it.",
  "sugar-hill":
    "Sugar Hill earned its name when Harlem's writers and musicians moved up the slope, and the elegance held. Local hosts know whose front steps the old photographs were taken on.",
  "sunset-park":
    "Sunset Park stacks Brooklyn's Chinatown and its Little Latin America on one hill, with the harbor laid out below. The hosts here shop both main streets in the same afternoon.",
  "van-cortlandt-village":
    "Van Cortlandt Village backs onto the borough's biggest park, with trails and ballfields a few steps from the apartments. Local hosts use that green space the way other neighborhoods use a town square.",
  "west-farms":
    "West Farms grew up along the river and the old trolley lines, and the bones are still visible. Hosts here can show you where the Bronx's industrial story meets its quieter corners.",
};

export const NEIGHBORHOODS: Record<string, Neighborhood> = (() => {
  const map: Record<string, Neighborhood> = {};
  for (const e of EXPERIENCES) {
    const slug = neighborhoodSlug(e.neighborhood);
    if (map[slug]) continue;
    map[slug] = {
      slug,
      name: e.neighborhood,
      borough: e.borough,
      intro: INTROS[slug] ?? "",
    };
  }
  return map;
})();

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS[slug];
}

export function experiencesByNeighborhood(slug: string) {
  return EXPERIENCES.filter((e) => neighborhoodSlug(e.neighborhood) === slug);
}

export function neighborhoodCentroid(slug: string): [number, number] | null {
  const list = experiencesByNeighborhood(slug);
  if (list.length === 0) return null;
  const lat = list.reduce((s, e) => s + e.lat, 0) / list.length;
  const lng = list.reduce((s, e) => s + e.lng, 0) / list.length;
  return [lat, lng];
}

export function hostsByNeighborhood(slug: string): Host[] {
  const seen = new Set<string>();
  const out: Host[] = [];
  for (const e of experiencesByNeighborhood(slug)) {
    if (seen.has(e.host.slug)) continue;
    seen.add(e.host.slug);
    const host = HOSTS[e.host.slug];
    if (host) out.push(host);
  }
  return out;
}
```

Note: `INTROS` has 25 entries. The coverage test asserts every referenced slug has a `NEIGHBORHOODS` entry; the non-empty-intro test asserts every entry's intro is non-empty. If any slug is missing from `INTROS`, the second test fails (intro would be `""`). After writing the file, cross-check that the 25 keys in `INTROS` exactly match the 25 distinct neighborhood slugs. Run this one-liner to verify before relying on the test:
`node -e 'const {NEIGHBORHOODS}=require("./src/lib/navi/neighborhoods.ts")' ` will not work directly (TS), so instead trust the `npx vitest` run.

- [ ] **Step 4: Run tests, verify pass**

Run: `npx vitest run src/lib/navi/__tests__/neighborhoods.test.ts`
Expected: PASS (12 tests). If "non-empty intro" fails, a slug in the dataset has no `INTROS` entry. Print the offending slug by temporarily logging `Object.values(NEIGHBORHOODS).filter(n => !n.intro).map(n => n.slug)` and add the missing intro (write it in voice).

- [ ] **Step 5: Full suite**

Run: `npx vitest run`
Expected: all PASS.

- [ ] **Step 6: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add src/lib/navi/neighborhoods.ts src/lib/navi/__tests__/neighborhoods.test.ts
git commit -m "$(cat <<'EOF'
feat(navi): neighborhoods module with intros + derived helpers

Adds a NEIGHBORHOODS record keyed by slug (slug, name, borough, and a
narrative intro) plus pure helpers: neighborhoodSlug, lookup by slug,
experiences in a neighborhood, naive lat/lng centroid for the map, and
the distinct hosts based there. Intros are written in the site voice.
Sets up Slice 3's neighborhood pages.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Build the `/neighborhood/[slug]` page

**Files:**
- Create: `src/app/work/navi/(minisite)/demo/neighborhood/[slug]/page.tsx`
- Create: `src/components/navi/demo/__tests__/neighborhood-page.test.tsx`
- Modify: `src/app/globals.css`

`Map` API (from `src/components/navi/demo/Map.tsx`): props `{ center: [number, number]; zoom: number; markers: { id: string; lat: number; lng: number; label: string }[]; ... }`. The component is `next/dynamic` with `ssr: false`. In jsdom it renders the skeleton fallback, so tests should NOT assert on map internals, only that the section exists.

`ExperienceCard` API: `{ experience, href }` — pass `href={`/work/navi/demo/experience/${e.slug}`}`.
`Avatar` API: `{ name, src?, size? }` — use `size="md"` for the hosts row, and wrap each in a `<Link href={`/work/navi/demo/host/${h.slug}`}>`.

- [ ] **Step 1: Write the failing test**

Create `src/components/navi/demo/__tests__/neighborhood-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NeighborhoodView } from "@/app/work/navi/(minisite)/demo/neighborhood/[slug]/page";
import {
  getNeighborhoodBySlug,
  experiencesByNeighborhood,
  hostsByNeighborhood,
} from "@/lib/navi/neighborhoods";

describe("Neighborhood page", () => {
  const nb = getNeighborhoodBySlug("park-slope");
  if (!nb) throw new Error("test fixture: park-slope missing");

  it("renders the neighborhood name as h1 and the borough", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    expect(screen.getByRole("heading", { level: 1, name: "Park Slope" })).toBeInTheDocument();
    expect(screen.getByText("Brooklyn")).toBeInTheDocument();
  });

  it("renders the intro paragraph", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    expect(screen.getByText(nb.intro)).toBeInTheDocument();
  });

  it("has a back link to results", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute(
      "href",
      "/work/navi/demo/search",
    );
  });

  it("renders one ExperienceCard per experience in the neighborhood", () => {
    const { container } = render(<NeighborhoodView neighborhood={nb} />);
    const expected = experiencesByNeighborhood("park-slope");
    const cards = container.querySelectorAll("a.nv-exp-card");
    expect(cards.length).toBe(expected.length);
  });

  it("renders a hosts-based-here row linking each host to their page", () => {
    render(<NeighborhoodView neighborhood={nb} />);
    const hosts = hostsByNeighborhood("park-slope");
    for (const h of hosts) {
      expect(screen.getByRole("link", { name: new RegExp(h.name) })).toHaveAttribute(
        "href",
        `/work/navi/demo/host/${h.slug}`,
      );
    }
  });
});
```

- [ ] **Step 2: Run, verify failure**

Run: `npx vitest run src/components/navi/demo/__tests__/neighborhood-page.test.tsx`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement the page**

Create `src/app/work/navi/(minisite)/demo/neighborhood/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Avatar } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { Map } from "@/components/navi/demo/Map";
import {
  getNeighborhoodBySlug,
  experiencesByNeighborhood,
  neighborhoodCentroid,
  hostsByNeighborhood,
  type Neighborhood,
} from "@/lib/navi/neighborhoods";

export default function NeighborhoodPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const neighborhood = getNeighborhoodBySlug(slug);
  if (!neighborhood) notFound();
  return <NeighborhoodView neighborhood={neighborhood} />;
}

export function NeighborhoodView({ neighborhood: n }: { neighborhood: Neighborhood }) {
  const experiences = experiencesByNeighborhood(n.slug);
  const hosts = hostsByNeighborhood(n.slug);
  const centroid = neighborhoodCentroid(n.slug);
  return (
    <article className="nv-neighborhood">
      <p className="nv-neighborhood-back">
        <Link href="/work/navi/demo/search">← Back to results</Link>
      </p>
      <header className="nv-neighborhood-head">
        <h1>{n.name}</h1>
        <p className="nv-neighborhood-borough">{n.borough}</p>
      </header>
      <p className="nv-neighborhood-intro">{n.intro}</p>
      {centroid && (
        <div className="nv-neighborhood-map">
          <Map
            center={centroid}
            zoom={14}
            markers={experiences.map((e) => ({
              id: e.slug,
              lat: e.lat,
              lng: e.lng,
              label: e.title,
            }))}
          />
        </div>
      )}
      <section aria-labelledby="nb-experiences-heading" className="nv-neighborhood-experiences">
        <h2 id="nb-experiences-heading">Experiences in {n.name}</h2>
        <ul className="nv-feed-grid" aria-label={`Experiences in ${n.name}`}>
          {experiences.map((e) => (
            <li key={e.slug}>
              <ExperienceCard
                experience={e}
                href={`/work/navi/demo/experience/${e.slug}`}
              />
            </li>
          ))}
        </ul>
      </section>
      {hosts.length > 0 && (
        <section aria-labelledby="nb-hosts-heading" className="nv-neighborhood-hosts">
          <h2 id="nb-hosts-heading">Hosts based here</h2>
          <ul className="nv-neighborhood-hosts-row" aria-label={`Hosts based in ${n.name}`}>
            {hosts.map((h) => (
              <li key={h.slug}>
                <Link href={`/work/navi/demo/host/${h.slug}`} className="nv-neighborhood-host">
                  <Avatar name={h.name} size="md" src={h.avatarSrc} />
                  <span>{h.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
```

- [ ] **Step 4: Append CSS to `src/app/globals.css`**

Anchor near the `.nv-host` block added in Slice 2 (`grep -n 'nv-host {' src/app/globals.css`). Append after the host block:

```css
/* ── Neighborhood page ──────────────────────────────────────── */
.nv-neighborhood {
  max-width: 960px;
  margin: 0 auto;
  padding: var(--nv-sp-lg);
  display: grid;
  gap: var(--nv-sp-lg);
}
.nv-neighborhood-back { margin: 0; }
.nv-neighborhood-back a { color: var(--nv-text-muted); text-decoration: none; }
.nv-neighborhood-back a:hover { color: var(--nv-text); text-decoration: underline; }
.nv-neighborhood-back a:focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
}
.nv-neighborhood-head { display: grid; gap: var(--nv-sp-xs); }
.nv-neighborhood-head h1 { margin: 0; font-size: 2.2rem; }
.nv-neighborhood-borough { margin: 0; color: var(--nv-text-muted); }
.nv-neighborhood-intro {
  margin: 0;
  max-width: 64ch;
  line-height: 1.6;
  color: var(--nv-text);
}
.nv-neighborhood-map { border-radius: var(--nv-r-lg); overflow: hidden; }
.nv-neighborhood-experiences { display: grid; gap: var(--nv-sp-md); }
.nv-neighborhood-experiences h2 { margin: 0; font-size: 1.4rem; }
.nv-neighborhood-experiences .nv-feed-grid {
  list-style: none;
  padding: 0;
  margin: 0;
}
.nv-neighborhood-hosts { display: grid; gap: var(--nv-sp-md); }
.nv-neighborhood-hosts h2 { margin: 0; font-size: 1.4rem; }
.nv-neighborhood-hosts-row {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--nv-sp-md);
}
.nv-neighborhood-host {
  display: inline-flex;
  align-items: center;
  gap: var(--nv-sp-sm);
  text-decoration: none;
  color: var(--nv-text);
  font-weight: 600;
}
.nv-neighborhood-host:hover span { text-decoration: underline; }
.nv-neighborhood-host:focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
  border-radius: var(--nv-r-md);
}
```

If `--nv-r-lg` or `--nv-r-md` don't exist, check `grep -n 'nv-r-' src/app/globals.css` and use whatever radius tokens are defined (Slice 1 referenced `--nv-r-pill/md/lg`).

- [ ] **Step 5: Run neighborhood-page tests, verify pass**

Run: `npx vitest run src/components/navi/demo/__tests__/neighborhood-page.test.tsx`
Expected: 5 PASS. In jsdom the `Map` renders its skeleton (ssr:false dynamic), which is fine. The tests don't touch map internals.

- [ ] **Step 6: Full suite**

Run: `npx vitest run`
Expected: all PASS.

- [ ] **Step 7: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 8: Commit**

```bash
git add 'src/app/work/navi/(minisite)/demo/neighborhood/[slug]/page.tsx' \
  src/components/navi/demo/__tests__/neighborhood-page.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): /neighborhood/[slug] page

Server component reads NEIGHBORHOODS[slug] and renders the name,
borough, narrative intro, a mini-map centered on the neighborhood
centroid with a marker per experience, the experiences grid, and a
row of the hosts based there (each linking to their host page). The
pure NeighborhoodView inner component is exported for testing.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Cross-links + slugifier consolidation

**Files:**
- Modify: `src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx` (use shared `neighborhoodSlug`)
- Modify: `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx` (add neighborhood link in Go section)
- Modify: `src/components/navi/demo/__tests__/experience-page.test.tsx` (one new assertion)
- Modify: `src/app/globals.css` (`.nv-detail-where-nb` rule)

### Part A — Consolidate the slugifier on the host page

- [ ] **Step 1: Replace the local slugifier**

In `src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx`, find the local `function neighborhoodSlug(name: string)` definition and DELETE it. Add an import at the top:

```tsx
import { neighborhoodSlug } from "@/lib/navi/neighborhoods";
```

The usage site (`const nbSlug = neighborhoodSlug(host.neighborhood);`) stays the same. The shared slugifier strips diacritics too, which the local copy did not, but no host neighborhood has diacritics, so behavior is identical.

- [ ] **Step 2: Run host-page tests, verify still pass**

Run: `npx vitest run src/components/navi/demo/__tests__/host-page.test.tsx`
Expected: 5 PASS (the test computes its own slug with the same regex, so the href still matches).

### Part B — Neighborhood link on the experience detail Go section

- [ ] **Step 3: Add the failing assertion**

In `src/components/navi/demo/__tests__/experience-page.test.tsx`, add inside the existing describe (fixture is `const e = EXPERIENCES[0]`):

```tsx
it("links the neighborhood in the Go section to the neighborhood page", () => {
  render(<ExperienceView experience={e} />);
  const slug = e.neighborhood
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  expect(
    screen.getByRole("link", { name: new RegExp(e.neighborhood) }),
  ).toHaveAttribute("href", `/work/navi/demo/neighborhood/${slug}`);
});
```

- [ ] **Step 4: Run, verify failure**

Run: `npx vitest run src/components/navi/demo/__tests__/experience-page.test.tsx`
Expected: FAIL (no link with the neighborhood name yet).

- [ ] **Step 5: Add the neighborhood link to the Go section**

In `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`, import the slugifier at top:

```tsx
import { neighborhoodSlug } from "@/lib/navi/neighborhoods";
```

Find the Go section's "Where?" block:

```tsx
<h3 className="nv-detail-where-heading">Where?</h3>
<p>{e.go.addressLine1}</p>
<p>{e.go.addressLine2}</p>
```

Add a neighborhood line after the address lines:

```tsx
<h3 className="nv-detail-where-heading">Where?</h3>
<p>{e.go.addressLine1}</p>
<p>{e.go.addressLine2}</p>
<p className="nv-detail-where-nb">
  In{" "}
  <Link
    href={`/work/navi/demo/neighborhood/${neighborhoodSlug(e.neighborhood)}`}
    className="nv-detail-nb-link"
  >
    {e.neighborhood}
  </Link>
  , {e.borough}
</p>
```

`Link` is already imported on this file.

- [ ] **Step 6: Add CSS**

Append to `src/app/globals.css` (near `.nv-detail-host-link`):

```css
.nv-detail-where-nb { margin: var(--nv-sp-xs) 0 0; color: var(--nv-text-muted); }
.nv-detail-nb-link {
  color: var(--nv-action);
  text-decoration: none;
  font-weight: 600;
}
.nv-detail-nb-link:hover { text-decoration: underline; }
.nv-detail-nb-link:focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
  border-radius: 2px;
}
```

- [ ] **Step 7: Run experience-page tests, verify pass**

Run: `npx vitest run src/components/navi/demo/__tests__/experience-page.test.tsx`
Expected: 5 PASS (3 original + Slice 2 host link + this neighborhood link).

- [ ] **Step 8: Full suite + typecheck**

Run: `npx vitest run` then `npx tsc --noEmit`
Expected: all PASS, clean.

- [ ] **Step 9: Commit**

```bash
git add 'src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx' \
  'src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx' \
  src/components/navi/demo/__tests__/experience-page.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): neighborhood cross-links + shared slugifier

Adds a neighborhood link to the experience detail Go section so the
address block points to the neighborhood page. Replaces the host
page's local neighborhoodSlug with the shared helper from the
neighborhoods module, so both pages and the experience detail derive
the same slug from one source.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Final integration check + PR update

- [ ] **Step 1: Full suite**

Run: `npx vitest run`
Expected: all PASS (~161 tests: +12 neighborhoods unit, +5 neighborhood page, +1 experience-page neighborhood link).

- [ ] **Step 2: Typecheck + scoped lint**

Run: `npx tsc --noEmit`
Run: `npx eslint src/lib/navi src/components/navi src/app/work/navi`
Expected: clean for new/touched files. The 4 pre-existing `<a>` vs `<Link>` errors in `work/navi/page.tsx` carry over from before this branch and are out of scope.

- [ ] **Step 3: Manual preview walk**

`npm run dev`, then walk:
1. `/work/navi/demo/experience/<first-slug>` — the Go section now shows "In [Neighborhood], Borough" with the neighborhood as a link. Click it.
2. `/work/navi/demo/neighborhood/park-slope` — name, borough, intro, mini-map with markers, experiences grid, hosts row all render. Map shows markers (real Leaflet here, not the jsdom skeleton).
3. From the neighborhood page, click a host avatar — lands on `/host/[slug]`.
4. From `/host/paul-stein`, click the "Based in [Neighborhood]" footer — now resolves instead of 404.

- [ ] **Step 4: Push and comment on PR #23**

```bash
git push
gh pr comment 23 --body "$(cat <<'EOF'
## Substance pass (Slice 3) landed

Neighborhoods now have their own page at /work/navi/demo/neighborhood/[slug].

- NEIGHBORHOODS module keyed by slug: name, borough, and a narrative
  intro written in the site voice for all 25 neighborhoods.
- Derived helpers: experiencesByNeighborhood, a naive lat/lng centroid
  for the map, and the distinct hosts based there.
- NeighborhoodView server component renders name + borough + intro +
  mini-map (marker per experience) + experiences grid + a hosts-based-
  here row that links each host to their page.
- Experience detail Go section now links the neighborhood. The host
  page footer link from Slice 2 now resolves instead of 404ing.
- Consolidated the neighborhood slugifier into one shared helper
  (was duplicated inline on the host page).

Note: the feed card's neighborhood label is intentionally NOT linked.
ExperienceCard is a single full-card anchor, so nesting a second link
inside it would be invalid HTML. Neighborhood discovery happens from
the experience detail page and host footer instead.

🤖 Generated with Claude Code.
EOF
)"
```

- [ ] **Step 5: Commit the plan file**

```bash
git add docs/superpowers/plans/2026-06-21-navi-substance-pass-slice-3.md
git commit -m "$(cat <<'EOF'
docs(navi): slice-3 implementation plan for neighborhood pages

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
git push
```

- [ ] **Step 6: Done**

This plan ends here. Slice 4 (impact ledger + photo expansion) gets its own plan when starting that work.
