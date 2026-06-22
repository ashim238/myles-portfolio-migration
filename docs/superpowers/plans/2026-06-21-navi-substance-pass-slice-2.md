# Navi Substance Pass — Slice 2 Implementation Plan (Host pages)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `/work/navi/demo/host/[slug]` pages that show a host's bio, aggregate rating, and the list of experiences they run. Cross-link from the experience detail page's "Hosted by …" line.

**Architecture:** Normalize host data. Each experience already carries `host: { name }`; we extend it to `host: { slug, name }` so existing consumers keep working, and add a separate `HOSTS` record (keyed by slug) carrying the rich profile fields (bio, neighborhood, years hosting, reply rate, optional avatarSrc). Host bios are deterministic stubs derived from the host name so values are stable across reruns. The page is a server component that reads `HOSTS[slug]` and filters `EXPERIENCES` by `host.slug`.

**Tech Stack:** Next.js 16 App Router (React 19), TypeScript, vitest + @testing-library/react, plain CSS using existing `nv-*` tokens.

**Spec reference:** [docs/superpowers/specs/2026-06-21-navi-substance-pass-design.md](../specs/2026-06-21-navi-substance-pass-design.md), Slice 2.

---

## File map

**New files:**
- `src/lib/navi/hosts.ts` — `Host` type, `HOSTS` record, `getHostBySlug`, `slugifyHostName`, `hostAggregate` helper.
- `src/lib/navi/__tests__/hosts.test.ts` — unit tests for slugify + aggregate.
- `src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx` — server component for the host page.
- `src/components/navi/demo/__tests__/host-page.test.tsx` — render test for the host page view.

**Modified files:**
- `src/lib/navi/demo-data.ts` — extend `Experience["host"]` to `{ slug: string; name: string }`. Add `slug` to every existing experience (deterministic kebab-case of the name).
- `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx` — wrap the "Hosted by Name" text in a `<Link>` to `/work/navi/demo/host/<slug>`. Keep the Avatar adjacent.
- `src/components/navi/demo/__tests__/experience-page.test.tsx` — add an assertion for the Hosted-by link href.
- `src/app/globals.css` — add `.nv-host-*` block (header, bio, experiences grid wrapper, footer link).

**Tests that must stay green (no edits expected unless noted):**
- `src/components/navi/demo/__tests__/feed-page.test.tsx`
- `src/components/navi/demo/__tests__/experience-page.test.tsx` (gets one new assertion)
- All other `__tests__` directories under `src/components/navi`.

---

## Task 1: Extend host data shape, create `HOSTS` record

**Files:**
- Create: `src/lib/navi/hosts.ts`
- Create: `src/lib/navi/__tests__/hosts.test.ts`
- Modify: `src/lib/navi/demo-data.ts` (extend `Experience["host"]`, add `slug` to every entry)

The shape change is additive: existing `e.host.name` consumers keep working because `name` stays on the inline object. We add `slug` so we can both (a) link to the host page from the experience detail and (b) filter `EXPERIENCES` by host without an O(n) name match.

The rich profile fields (bio, neighborhood, years, reply rate, optional avatar) live in a separate `HOSTS` record so they're not duplicated across the many experiences a single host may run.

- [ ] **Step 1: Write the failing test**

Create `src/lib/navi/__tests__/hosts.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import {
  HOSTS,
  slugifyHostName,
  getHostBySlug,
  hostAggregate,
} from "@/lib/navi/hosts";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("slugifyHostName", () => {
  it("kebab-cases simple names", () => {
    expect(slugifyHostName("Paul Stein")).toBe("paul-stein");
  });
  it("strips diacritics and punctuation", () => {
    expect(slugifyHostName("Eléni Papadópoulos-Smith")).toBe("eleni-papadopoulos-smith");
  });
});

describe("HOSTS record", () => {
  it("has a record for every distinct host slug referenced by an experience", () => {
    const referenced = new Set(EXPERIENCES.map((e) => e.host.slug));
    for (const slug of referenced) {
      expect(HOSTS[slug], `missing HOSTS["${slug}"]`).toBeDefined();
    }
  });
});

describe("getHostBySlug", () => {
  it("returns the host when found", () => {
    const h = getHostBySlug("paul-stein");
    expect(h?.name).toBe("Paul Stein");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getHostBySlug("nobody")).toBeUndefined();
  });
});

describe("hostAggregate", () => {
  it("computes average rating and total review count across the host's experiences", () => {
    const all = EXPERIENCES.filter((e) => e.host.slug === "paul-stein");
    const agg = hostAggregate("paul-stein");
    expect(agg.experienceCount).toBe(all.length);
    expect(agg.reviewCount).toBe(all.reduce((s, e) => s + e.reviews, 0));
    const expectedAvg =
      all.reduce((s, e) => s + e.rating * e.reviews, 0) /
      Math.max(1, all.reduce((s, e) => s + e.reviews, 0));
    expect(agg.averageRating).toBeCloseTo(expectedAvg, 2);
  });

  it("returns zeroes for a host with no experiences", () => {
    const agg = hostAggregate("nobody");
    expect(agg.experienceCount).toBe(0);
    expect(agg.reviewCount).toBe(0);
    expect(agg.averageRating).toBe(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/navi/__tests__/hosts.test.ts`
Expected: FAIL with module-not-found (hosts.ts does not exist) and/or `host.slug` missing on the experience type.

- [ ] **Step 3: Extend `Experience["host"]` and add `slug` to every entry**

Open `src/lib/navi/demo-data.ts`. Change the `Experience` type's `host` field from `host: { name: string }` to:

```ts
host: { slug: string; name: string };
```

Then add `slug` to every existing entry. Use the exact kebab-case of the current `name`. Mechanical edit — for each `host: { name: "<Name>" }`, change to `host: { slug: "<slug>", name: "<Name>" }`. Examples to verify:
- `"Paul Stein"` → `slug: "paul-stein"`
- `"Eleni Papadopoulos"` → `slug: "eleni-papadopoulos"`
- `"Sal Pirrone"` → `slug: "sal-pirrone"`

Tip: use a single sed-style pass if you prefer, but verify each replacement reads correctly (no diacritics survive — `Eleni` already has plain `e` in the file, no patch needed beyond slug).

- [ ] **Step 4: Implement `src/lib/navi/hosts.ts`**

Create:

```ts
import { EXPERIENCES } from "@/lib/navi/demo-data";

export type Host = {
  slug: string;
  name: string;
  bio: string;
  neighborhood: string;
  yearsHosting: number;
  responseRate: number;
  avatarSrc?: string;
};

export function slugifyHostName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function pickIn(seed: number, min: number, max: number): number {
  const range = max - min + 1;
  return min + (seed % range);
}

const BIO_TEMPLATES = [
  "Lives a block from where the experience meets. Started hosting after friends kept asking for the inside route, and still treats every booking that way.",
  "Has run this experience long enough to know which week of the year it's quietest, and which corner of the room catches the best afternoon light.",
  "Trained as a teacher before going independent. Keeps groups small on purpose, because the conversation is the point.",
  "Came to Brooklyn for one specific reason and stayed for ten others. Each is somewhere on the tour.",
  "Was a regular at every place this experience visits, long before turning host. Knows the staff by name and brings receipts.",
];

function deterministicHost(slug: string, name: string, neighborhood: string): Host {
  const seed = hashSeed(slug);
  return {
    slug,
    name,
    neighborhood,
    bio: BIO_TEMPLATES[seed % BIO_TEMPLATES.length],
    yearsHosting: pickIn(seed >> 3, 2, 9),
    responseRate: pickIn(seed >> 7, 88, 99),
  };
}

export const HOSTS: Record<string, Host> = (() => {
  const map: Record<string, Host> = {};
  for (const e of EXPERIENCES) {
    if (map[e.host.slug]) continue;
    map[e.host.slug] = deterministicHost(e.host.slug, e.host.name, e.neighborhood);
  }
  return map;
})();

export function getHostBySlug(slug: string): Host | undefined {
  return HOSTS[slug];
}

export type HostAggregate = {
  experienceCount: number;
  reviewCount: number;
  averageRating: number;
};

export function hostAggregate(slug: string): HostAggregate {
  const list = EXPERIENCES.filter((e) => e.host.slug === slug);
  const reviewCount = list.reduce((s, e) => s + e.reviews, 0);
  const weighted = list.reduce((s, e) => s + e.rating * e.reviews, 0);
  return {
    experienceCount: list.length,
    reviewCount,
    averageRating: reviewCount === 0 ? 0 : weighted / reviewCount,
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/navi/__tests__/hosts.test.ts`
Expected: PASS (5/5).

- [ ] **Step 6: Run the rest of the suite to catch regressions from the host shape change**

Run: `npx vitest run`
Expected: all PASS. The shape change is additive (`host.name` still works); the only consumer is the experience detail page, which still calls `e.host.name`. The feed page test uses experience cards and doesn't touch `host` shape.

- [ ] **Step 7: Commit**

```bash
git add src/lib/navi/hosts.ts \
  src/lib/navi/__tests__/hosts.test.ts \
  src/lib/navi/demo-data.ts
git commit -m "$(cat <<'EOF'
feat(navi): normalize host data with HOSTS record + slug

Extends Experience.host with a slug field so we can reference hosts
without name-matching. The rich profile (bio, neighborhood, years
hosting, reply rate) lives in a separate HOSTS record keyed by slug,
avoiding duplication across the many experiences a single host runs.
Profile fields are deterministic stubs derived from the host name so
values stay stable across reruns. Sets up Slice 2's host pages.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Add experiences-by-host helper

A trivial helper used by the host page and (later, Slice 3) the neighborhood page.

**Files:**
- Modify: `src/lib/navi/hosts.ts` (add `experiencesByHost`)
- Modify: `src/lib/navi/__tests__/hosts.test.ts` (one new test)

- [ ] **Step 1: Add the failing test**

Append to `hosts.test.ts`:

```ts
import { experiencesByHost } from "@/lib/navi/hosts";

describe("experiencesByHost", () => {
  it("returns all experiences whose host matches the slug, in stable order", () => {
    const list = experiencesByHost("paul-stein");
    expect(list.length).toBeGreaterThan(0);
    for (const e of list) expect(e.host.slug).toBe("paul-stein");
  });
  it("returns an empty array for an unknown slug", () => {
    expect(experiencesByHost("nobody")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run, verify failure**

Run: `npx vitest run src/lib/navi/__tests__/hosts.test.ts`
Expected: FAIL (`experiencesByHost` not exported).

- [ ] **Step 3: Add the helper**

Append to `src/lib/navi/hosts.ts`:

```ts
export function experiencesByHost(slug: string) {
  return EXPERIENCES.filter((e) => e.host.slug === slug);
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npx vitest run src/lib/navi/__tests__/hosts.test.ts`
Expected: PASS (7/7).

- [ ] **Step 5: Commit**

```bash
git add src/lib/navi/hosts.ts src/lib/navi/__tests__/hosts.test.ts
git commit -m "$(cat <<'EOF'
feat(navi): experiencesByHost helper

Returns the list of experiences a given host runs. Used by the
upcoming /host/[slug] page and (in slice 3) the neighborhood page's
"Hosts based here" section.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Build the `/host/[slug]` page

**Files:**
- Create: `src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx`
- Create: `src/components/navi/demo/__tests__/host-page.test.tsx`
- Modify: `src/app/globals.css` — add `.nv-host-*` block

The page is a thin server component plus a pure `HostView` inner component for testability (mirrors the pattern used by the experience detail page).

- [ ] **Step 1: Write the failing test**

Create `src/components/navi/demo/__tests__/host-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HostView } from "@/app/work/navi/(minisite)/demo/host/[slug]/page";
import { getHostBySlug } from "@/lib/navi/hosts";

describe("Host page", () => {
  const host = getHostBySlug("paul-stein");
  if (!host) throw new Error("test fixture: paul-stein host missing");

  it("renders the host name and back link", () => {
    render(<HostView host={host} />);
    expect(screen.getByRole("heading", { level: 1, name: "Paul Stein" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute(
      "href",
      "/work/navi/demo/search",
    );
  });

  it("shows the bio paragraph", () => {
    render(<HostView host={host} />);
    expect(screen.getByText(host.bio)).toBeInTheDocument();
  });

  it("renders an Experiences-from heading and at least one ExperienceCard", () => {
    render(<HostView host={host} />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Experiences from Paul Stein/ }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /View|Reserve|hours|minutes/ }).length).toBeGreaterThan(
      0,
    );
  });

  it("links the neighborhood label to the neighborhood page", () => {
    render(<HostView host={host} />);
    expect(screen.getByRole("link", { name: new RegExp(`Based in ${host.neighborhood}`) })).toHaveAttribute(
      "href",
      `/work/navi/demo/neighborhood/${host.neighborhood.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
    );
  });
});
```

If the existing `ExperienceCard` doesn't render a link role for the experiences-list assertion, simplify the third test to look for the card's title text: `expect(screen.getAllByText(/Hosted by Paul Stein/).length).toBeGreaterThan(0)` — adjust based on the card's actual output.

- [ ] **Step 2: Run, verify failure**

Run: `npx vitest run src/components/navi/demo/__tests__/host-page.test.tsx`
Expected: FAIL with module-not-found.

- [ ] **Step 3: Implement the page**

Create `src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { use } from "react";
import { Avatar } from "@/components/navi/ui";
import { Rating } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { getHostBySlug, hostAggregate, experiencesByHost, type Host } from "@/lib/navi/hosts";

function neighborhoodSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function HostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const host = getHostBySlug(slug);
  if (!host) notFound();
  return <HostView host={host} />;
}

export function HostView({ host }: { host: Host }) {
  const agg = hostAggregate(host.slug);
  const experiences = experiencesByHost(host.slug);
  const nbSlug = neighborhoodSlug(host.neighborhood);
  return (
    <article className="nv-host">
      <p className="nv-host-back">
        <Link href="/work/navi/demo/search">← Back to results</Link>
      </p>
      <header className="nv-host-head">
        <Avatar name={host.name} size="lg" src={host.avatarSrc} />
        <div className="nv-host-headtext">
          <h1>{host.name}</h1>
          <p className="nv-host-meta">
            {host.neighborhood} &nbsp;·&nbsp; Hosting for {host.yearsHosting} years &nbsp;·&nbsp;{" "}
            {host.responseRate}% reply rate
          </p>
        </div>
      </header>
      <p className="nv-host-bio">{host.bio}</p>
      {agg.reviewCount > 0 && (
        <p className="nv-host-rating">
          <Rating value={Number(agg.averageRating.toFixed(2))} reviews={agg.reviewCount} />{" "}
          average across {agg.experienceCount}{" "}
          {agg.experienceCount === 1 ? "experience" : "experiences"}
        </p>
      )}
      <section aria-labelledby="host-experiences-heading" className="nv-host-experiences">
        <h2 id="host-experiences-heading">Experiences from {host.name}</h2>
        <ul className="nv-feed-grid" aria-label={`Experiences from ${host.name}`}>
          {experiences.map((e) => (
            <li key={e.slug}>
              <ExperienceCard experience={e} />
            </li>
          ))}
        </ul>
      </section>
      <p className="nv-host-footer">
        <Link href={`/work/navi/demo/neighborhood/${nbSlug}`}>
          Based in {host.neighborhood} →
        </Link>
      </p>
    </article>
  );
}
```

Check `Avatar`'s actual prop names by reading `src/components/navi/ui/Avatar.tsx` (or wherever it lives). The plan above assumes `name`, `size`, optional `src`. If the real API differs (e.g. `imageSrc`), adapt. Same for `Rating` — pass whatever it needs.

If `Rating` doesn't accept an unweighted average rendered to 2 decimals, use a plain string like `<span aria-label={`${avg.toFixed(2)} stars`}>★ {avg.toFixed(2)}</span>`.

- [ ] **Step 4: Add CSS**

Append to `src/app/globals.css` near the other `nv-*` sections (e.g. just before the `/system` CTA block):

```css
/* ── Host page ──────────────────────────────────────────────── */
.nv-host {
  max-width: 880px; margin: 0 auto;
  padding: var(--nv-sp-lg);
  display: grid; gap: var(--nv-sp-lg);
}
.nv-host-back { margin: 0; }
.nv-host-back a { color: var(--nv-text-muted); text-decoration: none; }
.nv-host-back a:hover { color: var(--nv-text); text-decoration: underline; }
.nv-host-head {
  display: flex; align-items: center; gap: var(--nv-sp-md);
}
.nv-host-headtext h1 { margin: 0 0 var(--nv-sp-xs); font-size: 2rem; }
.nv-host-meta { margin: 0; color: var(--nv-text-muted); }
.nv-host-bio {
  margin: 0; max-width: 60ch; line-height: 1.6; color: var(--nv-text);
}
.nv-host-rating { margin: 0; display: flex; align-items: center; gap: var(--nv-sp-xs); }
.nv-host-experiences { display: grid; gap: var(--nv-sp-md); }
.nv-host-experiences h2 { margin: 0; font-size: 1.4rem; }
.nv-host-experiences .nv-feed-grid {
  list-style: none; padding: 0; margin: 0;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--nv-sp-md);
}
.nv-host-footer { margin: 0; }
.nv-host-footer a {
  color: var(--nv-action); text-decoration: none; font-weight: 700;
}
.nv-host-footer a:hover { text-decoration: underline; }
```

If the existing `.nv-feed-grid` rule already sets `list-style/padding/margin/grid` declarations, the override above just re-applies them — no harm.

- [ ] **Step 5: Run host-page tests**

Run: `npx vitest run src/components/navi/demo/__tests__/host-page.test.tsx`
Expected: 4 PASS.

- [ ] **Step 6: Run full suite**

Run: `npx vitest run`
Expected: still all PASS.

- [ ] **Step 7: Commit**

```bash
git add 'src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx' \
  src/components/navi/demo/__tests__/host-page.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): /host/[slug] page

Server-component page that reads HOSTS[slug] and shows the host's
header (avatar + neighborhood + years hosting + reply rate), bio,
aggregate rating across all their experiences, the experiences they
run as ExperienceCards, and a footer link to their neighborhood. The
pure HostView inner component is exported for testing.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Cross-link from experience detail "Hosted by"

**Files:**
- Modify: `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`
- Modify: `src/components/navi/demo/__tests__/experience-page.test.tsx` (one new assertion)

- [ ] **Step 1: Add failing assertion**

In `experience-page.test.tsx`, add a fourth test inside the existing `describe`:

```tsx
it("links the Hosted-by name to the host page", () => {
  render(<ExperienceView experience={e} />);
  expect(
    screen.getByRole("link", { name: new RegExp(e.host.name) }),
  ).toHaveAttribute("href", `/work/navi/demo/host/${e.host.slug}`);
});
```

- [ ] **Step 2: Run, verify failure**

Run: `npx vitest run src/components/navi/demo/__tests__/experience-page.test.tsx`
Expected: FAIL (no link role for the host name).

- [ ] **Step 3: Wrap the host name in a `<Link>`**

Open `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`. Find the line:

```tsx
<Avatar name={e.host.name} size="sm" /> Hosted by {e.host.name}
```

Replace with:

```tsx
<Avatar name={e.host.name} size="sm" /> Hosted by{" "}
<Link href={`/work/navi/demo/host/${e.host.slug}`} className="nv-detail-host-link">
  {e.host.name}
</Link>
```

`Link` from `next/link` is already imported on that file. If not, add the import.

- [ ] **Step 4: Add a small CSS touch**

Append to `src/app/globals.css`:

```css
.nv-detail-host-link {
  color: var(--nv-action);
  text-decoration: none;
  font-weight: 600;
}
.nv-detail-host-link:hover { text-decoration: underline; }
.nv-detail-host-link:focus-visible {
  outline: 2px solid var(--nv-focus); outline-offset: 2px;
  border-radius: 2px;
}
```

- [ ] **Step 5: Run experience-page tests**

Run: `npx vitest run src/components/navi/demo/__tests__/experience-page.test.tsx`
Expected: 4 PASS.

- [ ] **Step 6: Commit**

```bash
git add 'src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx' \
  src/components/navi/demo/__tests__/experience-page.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): link experience detail "Hosted by" to /host/[slug]

Wraps the host name in the Learn section with a next/link. Adds a
subtle hover/focus treatment so the link reads as a link without
breaking the calm tone of the prose around it.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Final integration check + PR update

- [ ] **Step 1: Run the full suite**

Run: `npx vitest run`
Expected: all PASS (133+ tests).

- [ ] **Step 2: Typecheck and lint**

Run: `npx tsc --noEmit`
Run: `npx eslint src/lib/navi src/components/navi src/app/work/navi`
Expected: clean for new/touched files. Pre-existing repo-wide errors (e.g. `<a>` vs `<Link>` in unrelated files) carry over from Slice 1 and are out of scope.

- [ ] **Step 3: Manual preview walk**

`npm run dev`, then walk:
1. `/work/navi/demo/experience/prospect-park-carriage` — "Hosted by Paul Stein" is now a link. Click it.
2. `/work/navi/demo/host/paul-stein` — header, bio, rating row, experiences grid, neighborhood footer link all render.
3. Click the neighborhood footer — leads to a 404 (Slice 3 not done yet). Expected.

- [ ] **Step 4: Push and comment on PR #23**

```bash
git push
gh pr comment 23 --body "$(cat <<'EOF'
## Substance pass (Slice 2) landed

Hosts get their own page at /work/navi/demo/host/[slug]. The
experience detail page's "Hosted by …" line links into it.

- Normalized host data: experience.host now carries { slug, name };
  the rich profile (bio, neighborhood, years hosting, reply rate)
  lives in a separate HOSTS record keyed by slug.
- Profile fields are deterministic stubs from a hash of the host's
  name so reruns produce the same values.
- HostView server component reads HOSTS[slug], filters EXPERIENCES,
  and renders header + bio + aggregate rating + experiences grid +
  neighborhood footer link.
- Neighborhood link currently 404s — Slice 3 fills that route.

🤖 Generated with Claude Code.
EOF
)"
```

- [ ] **Step 5: Done**

This plan ends here. Slice 3 (neighborhoods) and Slice 4 (impact ledger + photo expansion) each get their own plan when starting that work.
