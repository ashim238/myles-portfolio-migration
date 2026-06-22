# Navi Substance Pass — Slice 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the filter row + slide-over panel, do a sitewide spacing pass, and reconcile the system page with the demo by extracting a `PillRow` primitive (shared by Tabs and the detail-page sticky nav) and wiring a real `GalleryCarousel` that uses `CarouselArrow` + `PaginationDots`.

**Architecture:** All changes live inside `src/app/work/navi/(minisite)/` and `src/components/navi/`. The `nv-ui` CSS scope and `--nv-*` design tokens are reused throughout. No new build dependencies. New components are client components ("use client"). Tests are vitest + Testing Library, jsdom env.

**Tech Stack:** Next.js 16 App Router (React 19, client components), TypeScript, vitest + @testing-library/react, plain CSS using existing `nv-*` tokens in `src/app/globals.css`.

**Spec reference:** [docs/superpowers/specs/2026-06-21-navi-substance-pass-design.md](../specs/2026-06-21-navi-substance-pass-design.md) — Slice 1 plus the System reconciliation subsection inside it.

---

## File map

**New files:**
- `src/components/navi/ui/PillRow.tsx` — shared visual primitive for pill-button rows.
- `src/components/navi/ui/__tests__/PillRow.test.tsx`
- `src/components/navi/demo/GalleryCarousel.tsx` — hero carousel that wires `CarouselArrow` + `PaginationDots`, with thumb-strip jump.
- `src/components/navi/demo/__tests__/GalleryCarousel.test.tsx`
- `src/components/navi/demo/FiltersSlideOver.tsx` — slide-over panel with draft state, focus trap, ESC-to-close, live count.
- `src/components/navi/demo/__tests__/FiltersSlideOver.test.tsx`

**Modified files:**
- `src/components/navi/ui/Tabs.tsx` — refactored to consume `PillRow`. APG tablist semantics unchanged.
- `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx` — sticky nav refactored to consume `PillRow`. No visual change.
- `src/components/navi/demo/Gallery.tsx` — deleted. Callers swap to `GalleryCarousel`.
- `src/app/work/navi/(minisite)/demo/page.tsx` — restructured controls row, slide-over trigger, draft filters state lifted from native selects to slide-over.
- `src/components/navi/demo/BookingCard.tsx` — Reserve → confirmation gets a 200ms scale+fade transition with a checkmark.
- `src/app/work/navi/(minisite)/system/page.tsx` — add PillRow specimen, sticky-section-nav specimen, chip-rail specimen.
- `src/app/globals.css` — add `.nv-pill-row` primitive styles, `.nv-slide-over` styles, `.nv-gallery-carousel` styles, BookingCard reserve transition, spacing-pass targeted fixes.
- `src/components/navi/ui/index.ts` — export `PillRow`.

**Tests that must stay green (no edits expected unless noted):**
- `src/components/navi/ui/__tests__/Tabs.test.tsx`
- `src/components/navi/ui/__tests__/Carousel.test.tsx`
- `src/components/navi/demo/__tests__/Gallery.test.tsx` — may need rename to `GalleryCarousel.test.tsx` (Task 4 covers this).
- `src/components/navi/demo/__tests__/experience-page.test.tsx`
- `src/components/navi/demo/__tests__/feed-page.test.tsx`

---

## Task 1: Extract `PillRow` primitive

**Files:**
- Create: `src/components/navi/ui/PillRow.tsx`
- Create: `src/components/navi/ui/__tests__/PillRow.test.tsx`
- Modify: `src/components/navi/ui/index.ts` (add `PillRow` export)
- Modify: `src/app/globals.css` (add `.nv-pill-row` + `.nv-pill-row-item` styles)

`PillRow` is a thin presentational layout. It renders a row of pill buttons. Each item lets the caller supply ARIA attributes via an `extraAttrs` callback so consumers can supply `role="tab"` + `aria-selected` (Tabs) or `aria-current` (sticky section nav).

- [ ] **Step 1: Write the failing test**

Create `src/components/navi/ui/__tests__/PillRow.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PillRow } from "@/components/navi/ui/PillRow";

describe("PillRow", () => {
  const items = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
    { id: "c", label: "Gamma" },
  ];

  it("renders one pill per item with the active class on the active id", () => {
    render(<PillRow items={items} activeId="b" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Alpha" })).not.toHaveClass("nv-pill-row-item--active");
    expect(screen.getByRole("button", { name: "Beta" })).toHaveClass("nv-pill-row-item--active");
    expect(screen.getByRole("button", { name: "Gamma" })).not.toHaveClass("nv-pill-row-item--active");
  });

  it("fires onSelect with the item id when a pill is clicked", async () => {
    const onSelect = vi.fn();
    render(<PillRow items={items} activeId="a" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Gamma" }));
    expect(onSelect).toHaveBeenCalledWith("c");
  });

  it("merges ARIA attributes returned by extraAttrs onto each button", () => {
    render(
      <PillRow
        items={items}
        activeId="a"
        onSelect={() => {}}
        extraAttrs={(item, active) => ({
          "aria-current": active ? "true" : undefined,
          "data-test-id": item.id,
        })}
      />
    );
    const alpha = screen.getByRole("button", { name: "Alpha" });
    const beta = screen.getByRole("button", { name: "Beta" });
    expect(alpha).toHaveAttribute("aria-current", "true");
    expect(beta).not.toHaveAttribute("aria-current");
    expect(alpha).toHaveAttribute("data-test-id", "a");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/navi/ui/__tests__/PillRow.test.tsx`
Expected: FAIL with `Cannot find module '@/components/navi/ui/PillRow'`.

- [ ] **Step 3: Implement `PillRow`**

Create `src/components/navi/ui/PillRow.tsx`:

```tsx
"use client";

import type { ReactNode } from "react";

export type PillRowItem = { id: string; label: ReactNode };

type ExtraAttrs = (
  item: PillRowItem,
  active: boolean,
  index: number,
) => Record<string, string | undefined>;

export function PillRow({
  items,
  activeId,
  onSelect,
  extraAttrs,
  className,
  itemRef,
  onItemKeyDown,
}: {
  items: PillRowItem[];
  activeId: string;
  onSelect: (id: string) => void;
  extraAttrs?: ExtraAttrs;
  className?: string;
  itemRef?: (el: HTMLButtonElement | null, index: number) => void;
  onItemKeyDown?: (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
}) {
  return (
    <div className={`nv-pill-row${className ? " " + className : ""}`}>
      {items.map((item, index) => {
        const active = item.id === activeId;
        const extras = extraAttrs ? extraAttrs(item, active, index) : {};
        return (
          <button
            key={item.id}
            type="button"
            ref={(el) => itemRef?.(el, index)}
            className={`nv-pill-row-item${active ? " nv-pill-row-item--active" : ""}`}
            onClick={() => onSelect(item.id)}
            onKeyDown={onItemKeyDown ? (e) => onItemKeyDown(e, index) : undefined}
            {...extras}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Add CSS for the primitive**

Open `src/app/globals.css` and find the existing `.nv-tabs` rules (search for `^\.nv-tabs `). Add the `.nv-pill-row` primitive block immediately above them:

```css
/* ── PillRow (shared by Tabs + sticky section nav) ─────────────── */
.nv-pill-row {
  display: flex;
  gap: var(--nv-sp-xs);
  flex-wrap: wrap;
}
.nv-pill-row-item {
  min-height: 36px;
  padding: 0 var(--nv-sp-md);
  border: 1px solid transparent;
  border-radius: var(--nv-r-pill);
  background: none;
  color: var(--nv-text-muted);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
}
.nv-pill-row-item:hover { color: var(--nv-text); }
.nv-pill-row-item--active {
  color: var(--nv-text-on-action);
  background: var(--nv-action);
}
.nv-pill-row-item:focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
}
```

- [ ] **Step 5: Export PillRow from the ui index**

Open `src/components/navi/ui/index.ts` and add a new export line right after the `Tabs` export:

```ts
export { Tabs } from "./Tabs";
export { PillRow } from "./PillRow";
```

- [ ] **Step 6: Run tests and verify pass**

Run: `npx vitest run src/components/navi/ui/__tests__/PillRow.test.tsx`
Expected: PASS — 3 tests.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/ui/PillRow.tsx \
  src/components/navi/ui/__tests__/PillRow.test.tsx \
  src/components/navi/ui/index.ts \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-ui): extract PillRow primitive

Shared pill-button-row layout used by Tabs (tablist composition) and the
detail-page sticky section nav (anchor composition). Lets callers inject
ARIA attributes per item via an extraAttrs callback so semantics stay
correct for each pattern.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Refactor `Tabs` to consume `PillRow`

`Tabs` keeps its APG tablist semantics (`role="tablist"`, `role="tab"`, `aria-selected`, `aria-controls`, arrow-key keyboard pattern, tabpanel rendering). The only change: the tab row is now rendered by `PillRow`, with ARIA attributes supplied via `extraAttrs` and keyboard handling supplied via `onItemKeyDown`. Existing tests must stay green.

**Files:**
- Modify: `src/components/navi/ui/Tabs.tsx`
- Modify: `src/app/globals.css` (remove now-duplicate `.nv-tabs` / `.nv-tab` rules if and only if they exactly duplicate `.nv-pill-row` styles; otherwise leave them alone for legacy specimen styling)

- [ ] **Step 1: Replace the Tabs implementation**

Open `src/components/navi/ui/Tabs.tsx` and replace its entire contents with:

```tsx
"use client";

import { useId, useRef } from "react";
import type { ReactNode } from "react";
import { PillRow } from "./PillRow";

type Item = { id: string; label: string; content?: ReactNode };

export function Tabs({
  items,
  value,
  onChange,
}: {
  items: Item[];
  value: string;
  onChange: (id: string) => void;
}) {
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const hasPanels = items.some((it) => it.content != null);

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLButtonElement>,
    idx: number,
  ) {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % items.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + items.length) % items.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = items.length - 1;
    else return;
    e.preventDefault();
    onChange(items[next].id);
    refs.current[next]?.focus();
  }

  return (
    <>
      <PillRow
        className="nv-pill-row--tablist"
        items={items.map((it) => ({ id: it.id, label: it.label }))}
        activeId={value}
        onSelect={onChange}
        itemRef={(el, idx) => {
          refs.current[idx] = el;
        }}
        onItemKeyDown={handleKeyDown}
        extraAttrs={(it, selected) => ({
          id: `${baseId}-tab-${it.id}`,
          role: "tab",
          "aria-selected": selected ? "true" : "false",
          "aria-controls":
            items.find((x) => x.id === it.id)?.content != null
              ? `${baseId}-panel-${it.id}`
              : undefined,
          tabIndex: selected ? "0" : "-1",
        })}
      />
      {hasPanels &&
        items
          .filter((it) => it.content != null)
          .map((it) => (
            <div
              key={it.id}
              id={`${baseId}-panel-${it.id}`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${it.id}`}
              hidden={it.id !== value}
              className="nv-tabpanel"
            >
              {it.content}
            </div>
          ))}
    </>
  );
}
```

Note: the outer container now uses `PillRow`'s `.nv-pill-row` class, not the legacy `.nv-tabs` wrapper. The `role="tablist"` was on the wrapper before — it now sits on the `PillRow` div via the `extraAttrs`'s siblings. Re-add it via a dedicated container attribute pass: open `src/components/navi/ui/PillRow.tsx` and add an optional `role` prop:

```tsx
// In the PillRow function signature, add:
  role?: string;
// And on the outer <div>, replace className-only with:
  <div className={`nv-pill-row${className ? " " + className : ""}`} role={role}>
```

Then in `Tabs.tsx`, pass `role="tablist"` to PillRow:

```tsx
<PillRow
  role="tablist"
  className="nv-pill-row--tablist"
  ...
/>
```

- [ ] **Step 2: Run Tabs tests to verify still pass**

Run: `npx vitest run src/components/navi/ui/__tests__/Tabs.test.tsx src/components/navi/ui/__tests__/PillRow.test.tsx`
Expected: all Tabs and PillRow tests PASS.

- [ ] **Step 3: Run the full ui test suite to catch any indirect regressions**

Run: `npx vitest run src/components/navi/ui/__tests__/`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/components/navi/ui/Tabs.tsx src/components/navi/ui/PillRow.tsx
git commit -m "$(cat <<'EOF'
refactor(navi-ui): Tabs consumes PillRow primitive

Tabs keeps its APG tablist semantics (role, aria-selected, aria-controls,
arrow-key keyboard pattern, hidden tabpanels). The pill-button row layout
is now rendered by PillRow with ARIA attributes injected via extraAttrs.
No behavior change; existing tests stay green.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Refactor detail-page sticky nav to consume `PillRow`

The sticky section nav added last session is hand-rolled in `[slug]/page.tsx`. Replace its inline `<nav>` markup with a `PillRow`. Semantic role stays `navigation`, `aria-current` stays on the active pill, scroll behavior unchanged.

**Files:**
- Modify: `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`
- Modify: `src/app/globals.css` (delete `.nv-detail-nav` and `.nv-detail-nav-pill` rules — they are now the `.nv-pill-row` primitive)

- [ ] **Step 1: Find the sticky nav block**

Open `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`. Locate the existing JSX:

```tsx
<nav className="nv-detail-nav" aria-label="Sections">
  {SECTIONS.map((s) => (
    <button
      key={s.id}
      type="button"
      className={`nv-detail-nav-pill${active === s.id ? " is-active" : ""}`}
      aria-current={active === s.id ? "true" : undefined}
      onClick={() => goTo(s.id)}
    >
      {s.label}
    </button>
  ))}
</nav>
```

- [ ] **Step 2: Replace with PillRow**

Add `PillRow` to the existing import line:

```tsx
import { Accordion, Avatar, Rating, ImpactSignal, PillRow } from "@/components/navi/ui";
```

Replace the `<nav>` block above with:

```tsx
<PillRow
  className="nv-pill-row--sticky-section-nav"
  role="navigation"
  items={SECTIONS.map((s) => ({ id: s.id, label: s.label }))}
  activeId={active}
  onSelect={goTo}
  extraAttrs={(_, isActive) => ({
    "aria-current": isActive ? "true" : undefined,
  })}
/>
```

Then add `aria-label="Sections"` support to `PillRow`. Open `src/components/navi/ui/PillRow.tsx` and extend its props:

```tsx
// Add to the prop signature:
  ariaLabel?: string;
// And on the outer <div>:
  <div
    className={`nv-pill-row${className ? " " + className : ""}`}
    role={role}
    aria-label={ariaLabel}
  >
```

Back in the experience page, pass it:

```tsx
<PillRow
  ariaLabel="Sections"
  role="navigation"
  ...
/>
```

- [ ] **Step 3: Add sticky-section-nav variant CSS, remove duplicates**

In `src/app/globals.css`, find and **delete** these now-redundant rules (the old `nv-detail-nav` block, roughly lines 7284–7305):

```css
.nv-detail-nav { ... }
.nv-detail-nav-pill { ... }
.nv-detail-nav-pill:hover { ... }
.nv-detail-nav-pill.is-active { ... }
.nv-detail-nav-pill:focus-visible { ... }
```

Add the sticky-section-nav variant just below the `.nv-pill-row` block from Task 1:

```css
.nv-pill-row--sticky-section-nav {
  position: sticky;
  top: 0;
  z-index: 2;
  background: var(--nv-surface);
  padding: var(--nv-sp-sm) 0;
  margin-bottom: var(--nv-sp-md);
  border-bottom: 1px solid var(--nv-border);
}
```

Keep `.nv-detail-section` and `.nv-detail-section-heading` rules — they apply to the stacked sections, not the nav.

- [ ] **Step 4: Run experience-page test to verify it still passes**

Run: `npx vitest run src/components/navi/demo/__tests__/experience-page.test.tsx`
Expected: all tests PASS, including "marks Learn as the initial active section" which checks `aria-current="true"` on the Learn button.

- [ ] **Step 5: Visual verification in the dev preview**

Open `/work/navi/demo/experience/prospect-park-carriage`. Confirm:
- The Learn/Plan/Go nav pills look identical to before.
- The nav stays sticky at the top of the viewport as you scroll.
- Clicking Plan scrolls to the Plan section.
- The active pill switches as you scroll past sections.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/navi/\(minisite\)/demo/experience/\[slug\]/page.tsx \
  src/components/navi/ui/PillRow.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
refactor(navi-demo): sticky section nav consumes PillRow primitive

The detail page's sticky Learn/Plan/Go nav now renders through PillRow. ARIA
role="navigation" + aria-current="true" on the active pill stay correct.
.nv-detail-nav and .nv-detail-nav-pill rules deleted; the sticky variant lives
on .nv-pill-row--sticky-section-nav. No visual change.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Build `GalleryCarousel` and replace `Gallery`

The hero becomes a real swipe-and-arrow carousel using `CarouselArrow` + `PaginationDots`. Thumbnails stay below as a quick-jump strip. Arrow keys advance when the hero is focused. Respects `prefers-reduced-motion` (no transitions).

**Files:**
- Create: `src/components/navi/demo/GalleryCarousel.tsx`
- Create: `src/components/navi/demo/__tests__/GalleryCarousel.test.tsx`
- Delete: `src/components/navi/demo/Gallery.tsx`
- Delete: `src/components/navi/demo/__tests__/Gallery.test.tsx`
- Modify: `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx` — import swap
- Modify: `src/app/globals.css` — add `.nv-gallery-carousel` rules; delete `.nv-gallery`-prefixed rules that no longer apply

- [ ] **Step 1: Write the failing test**

Create `src/components/navi/demo/__tests__/GalleryCarousel.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GalleryCarousel } from "@/components/navi/demo/GalleryCarousel";

const photos = [
  { src: "/a.jpg", alt: "A" },
  { src: "/b.jpg", alt: "B" },
  { src: "/c.jpg", alt: "C" },
];

describe("GalleryCarousel", () => {
  it("renders the first photo as the hero", () => {
    render(<GalleryCarousel photos={photos} />);
    const hero = screen.getByTestId("gallery-hero-img");
    expect(hero).toHaveAttribute("src", "/a.jpg");
    expect(hero).toHaveAttribute("alt", "A");
  });

  it("renders a thumb per non-hero photo", () => {
    render(<GalleryCarousel photos={photos} />);
    expect(screen.getAllByTestId("gallery-thumb")).toHaveLength(3);
  });

  it("advances the hero when the next arrow is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/b.jpg");
  });

  it("wraps to the last photo when previous is clicked from the first", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/c.jpg");
  });

  it("jumps to a photo when its thumb is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getAllByTestId("gallery-thumb")[2]);
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/c.jpg");
  });

  it("jumps to a photo when its dot is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    const dots = screen.getAllByRole("button", { name: /Go to photo/ });
    await userEvent.click(dots[1]);
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/b.jpg");
  });

  it("advances with the ArrowRight key when the hero region is focused", async () => {
    render(<GalleryCarousel photos={photos} />);
    const region = screen.getByRole("region", { name: "Experience photos" });
    region.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/b.jpg");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/navi/demo/__tests__/GalleryCarousel.test.tsx`
Expected: FAIL with `Cannot find module '@/components/navi/demo/GalleryCarousel'`.

- [ ] **Step 3: Implement GalleryCarousel**

Create `src/components/navi/demo/GalleryCarousel.tsx`:

```tsx
"use client";

import { useCallback, useState } from "react";
import { CarouselArrow, PaginationDots } from "@/components/navi/ui";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";

type Photo = { src: string; alt: string };

export function GalleryCarousel({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState(0);
  const count = photos.length;

  const goTo = useCallback(
    (i: number) => {
      if (count === 0) return;
      const wrapped = ((i % count) + count) % count;
      setIndex(wrapped);
    },
    [count],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  if (count === 0) return null;
  const hero = photos[index];

  return (
    <figure className="nv-gallery-carousel" aria-label="Experience photos">
      <div
        className="nv-gallery-carousel-hero"
        role="region"
        aria-label="Experience photos"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <DemoPhoto src={hero.src} alt={hero.alt} dataTestId="gallery-hero-img" />
        {count > 1 && (
          <>
            <div className="nv-gallery-carousel-arrows">
              <CarouselArrow
                direction="prev"
                label="Previous photo"
                onClick={() => goTo(index - 1)}
              />
              <CarouselArrow
                direction="next"
                label="Next photo"
                onClick={() => goTo(index + 1)}
              />
            </div>
            <div className="nv-gallery-carousel-dots">
              <PaginationDots
                count={count}
                activeIndex={index}
                onSelect={(i) => goTo(i)}
                label="photo"
              />
            </div>
          </>
        )}
      </div>
      {count > 1 && (
        <ul className="nv-gallery-carousel-thumbs">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                data-testid="gallery-thumb"
                aria-label={`Show photo ${i + 1}: ${p.alt}`}
                aria-current={i === index ? "true" : undefined}
                className={`nv-gallery-carousel-thumb${i === index ? " is-active" : ""}`}
                onClick={() => goTo(i)}
              >
                <DemoPhoto src={p.src} alt={p.alt} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </figure>
  );
}
```

- [ ] **Step 4: Confirm or extend `DemoPhoto` to accept `dataTestId`**

Open `src/components/navi/demo/DemoPhoto.tsx`. If it doesn't accept an extra prop to put on the `<img>`, add one. Find the component's prop type and props destructure; add:

```tsx
// In the prop type:
  dataTestId?: string;
// In the JSX:
  <img ... data-testid={dataTestId} />
```

Apply the same change to any placeholder branch (the "Photo coming soon" path).

- [ ] **Step 5: Confirm or extend `PaginationDots` to take a `label` prop**

Open `src/components/navi/ui/PaginationDots.tsx`. The test expects buttons with `name: /Go to photo/`. If the component doesn't currently set `aria-label`, add it:

```tsx
// In the prop type:
  label?: string;
// On each button:
  aria-label={`Go to ${label ?? "item"} ${index + 1}`}
```

And give it an `onSelect(index: number)` prop if it doesn't already have one.

- [ ] **Step 6: Run GalleryCarousel tests, verify pass**

Run: `npx vitest run src/components/navi/demo/__tests__/GalleryCarousel.test.tsx`
Expected: 7 tests PASS.

- [ ] **Step 7: Swap callers from Gallery to GalleryCarousel**

Open `src/app/work/navi/(minisite)/demo/experience/[slug]/page.tsx`. Replace:

```tsx
import { Gallery } from "@/components/navi/demo/Gallery";
```

with:

```tsx
import { GalleryCarousel } from "@/components/navi/demo/GalleryCarousel";
```

And replace the `<Gallery photos={e.photos} />` JSX with `<GalleryCarousel photos={e.photos} />`.

Search the rest of the codebase for any other `Gallery` usages:

Run: `grep -rn "from \"@/components/navi/demo/Gallery\"" src/`
Expected: no results after the swap above.

- [ ] **Step 8: Delete the old Gallery files**

Run: `rm src/components/navi/demo/Gallery.tsx src/components/navi/demo/__tests__/Gallery.test.tsx`

- [ ] **Step 9: Add CSS for the carousel**

In `src/app/globals.css`, locate any `.nv-gallery`, `.nv-gallery-hero`, `.nv-gallery-thumbs`, `.nv-gallery-thumb`, `.nv-gallery--solo` rules. **Delete them.**

Add the new carousel rules at the same location:

```css
/* ── GalleryCarousel ────────────────────────────────────────────── */
.nv-gallery-carousel {
  display: grid;
  gap: var(--nv-sp-sm);
  margin: 0;
}
.nv-gallery-carousel-hero {
  position: relative;
  border-radius: var(--nv-r-md);
  overflow: hidden;
  outline: none;
}
.nv-gallery-carousel-hero:focus-visible {
  outline: 3px solid var(--nv-focus);
  outline-offset: 2px;
}
.nv-gallery-carousel-arrows {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--nv-sp-sm);
  pointer-events: none;
}
.nv-gallery-carousel-arrows .nv-carousel-arrow {
  pointer-events: auto;
}
.nv-gallery-carousel-dots {
  position: absolute;
  left: 50%;
  bottom: var(--nv-sp-sm);
  transform: translateX(-50%);
}
.nv-gallery-carousel-thumbs {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--nv-sp-xs);
}
.nv-gallery-carousel-thumb {
  display: block;
  width: 100%;
  padding: 0;
  border: 2px solid transparent;
  border-radius: var(--nv-r-sm);
  background: none;
  cursor: pointer;
  overflow: hidden;
}
.nv-gallery-carousel-thumb.is-active { border-color: var(--nv-action); }
.nv-gallery-carousel-thumb:focus-visible {
  outline: 2px solid var(--nv-focus);
  outline-offset: 2px;
}
@media (prefers-reduced-motion: no-preference) {
  .nv-gallery-carousel-hero img { transition: opacity 0.18s ease; }
}
```

- [ ] **Step 10: Run all touched tests**

Run: `npx vitest run src/components/navi/demo/__tests__/GalleryCarousel.test.tsx src/components/navi/demo/__tests__/experience-page.test.tsx src/components/navi/ui/__tests__/Carousel.test.tsx`
Expected: all PASS.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "$(cat <<'EOF'
feat(navi-demo): replace Gallery with GalleryCarousel

Hero photo becomes a real carousel: prev/next arrows (CarouselArrow), pagination
dots (PaginationDots), thumbnail strip jumps to index, ArrowLeft/ArrowRight on
the focused hero region advance. Wraps around on edges. Wires the previously
orphaned CarouselArrow and PaginationDots components into a real demo surface.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Build `FiltersSlideOver`

A controlled slide-over panel with internal draft state. Opens via the trigger button, applies on Apply, discards on ESC. Focus-trapped while open. Right-anchored 420px on desktop; bottom sheet on mobile.

**Files:**
- Create: `src/components/navi/demo/FiltersSlideOver.tsx`
- Create: `src/components/navi/demo/__tests__/FiltersSlideOver.test.tsx`
- Modify: `src/app/globals.css` — add `.nv-slide-over*` rules

- [ ] **Step 1: Define the filter shape (shared with the feed page)**

Create `src/components/navi/demo/filters.ts`:

```ts
export type PriceBand = "any" | "under30" | "30to60" | "over60";
export type DurationBand = "any" | "under2h" | "halfDay" | "fullDay";
export type GroupBand = "any" | "solo" | "small" | "large";

export type Filters = {
  price: PriceBand;
  duration: DurationBand;
  group: GroupBand;
  languages: string[];
  neighborhoods: string[];
};

export const DEFAULT_FILTERS: Filters = {
  price: "any",
  duration: "any",
  group: "any",
  languages: [],
  neighborhoods: [],
};

export function activeCount(f: Filters): number {
  let n = 0;
  if (f.price !== "any") n += 1;
  if (f.duration !== "any") n += 1;
  if (f.group !== "any") n += 1;
  n += f.languages.length;
  n += f.neighborhoods.length;
  return n;
}
```

- [ ] **Step 2: Write the failing test**

Create `src/components/navi/demo/__tests__/FiltersSlideOver.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FiltersSlideOver } from "@/components/navi/demo/FiltersSlideOver";
import { DEFAULT_FILTERS } from "@/components/navi/demo/filters";

const baseProps = {
  open: true,
  initial: DEFAULT_FILTERS,
  languageOptions: ["English", "Spanish"],
  neighborhoodOptions: ["Park Slope", "Bed-Stuy"],
  matchCountFor: () => 12,
};

describe("FiltersSlideOver", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <FiltersSlideOver {...baseProps} open={false} onApply={() => {}} onClose={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders as a dialog with the Filters heading when open", () => {
    render(<FiltersSlideOver {...baseProps} onApply={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
  });

  it("calls onApply with the draft filters when Apply is clicked", async () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(<FiltersSlideOver {...baseProps} onApply={onApply} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
    await userEvent.click(screen.getByRole("button", { name: /Show 12 experiences/ }));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ price: "under30" }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose without applying when ESC is pressed", async () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(<FiltersSlideOver {...baseProps} onApply={onApply} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
    expect(onApply).not.toHaveBeenCalled();
  });

  it("resets draft to defaults when Clear all is clicked", async () => {
    render(
      <FiltersSlideOver
        {...baseProps}
        initial={{ ...DEFAULT_FILTERS, price: "under30" }}
        onApply={() => {}}
        onClose={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    const underBtn = screen.getByRole("button", { name: "Under $30" });
    expect(underBtn).toHaveAttribute("aria-pressed", "false");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run src/components/navi/demo/__tests__/FiltersSlideOver.test.tsx`
Expected: FAIL with module-not-found.

- [ ] **Step 4: Implement FiltersSlideOver**

Create `src/components/navi/demo/FiltersSlideOver.tsx`:

```tsx
"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  type Filters,
  type PriceBand,
  type DurationBand,
  type GroupBand,
  DEFAULT_FILTERS,
  activeCount,
} from "@/components/navi/demo/filters";

const PRICE_OPTIONS: { id: PriceBand; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "under30", label: "Under $30" },
  { id: "30to60", label: "$30 to $60" },
  { id: "over60", label: "Over $60" },
];

const DURATION_OPTIONS: { id: DurationBand; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "under2h", label: "Under 2h" },
  { id: "halfDay", label: "Half day" },
  { id: "fullDay", label: "Full day" },
];

const GROUP_OPTIONS: { id: GroupBand; label: string }[] = [
  { id: "any", label: "Any" },
  { id: "solo", label: "Solo" },
  { id: "small", label: "Small" },
  { id: "large", label: "Large" },
];

function PillToggleGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="nv-slide-over-group">
      <legend className="nv-slide-over-legend">{legend}</legend>
      <div className="nv-slide-over-pills">
        {options.map((o) => {
          const active = o.id === value;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={active}
              className={`nv-slide-over-pill${active ? " is-active" : ""}`}
              onClick={() => onChange(o.id)}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function MultiChipGroup({
  legend,
  options,
  values,
  onToggle,
}: {
  legend: string;
  options: string[];
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <fieldset className="nv-slide-over-group">
      <legend className="nv-slide-over-legend">{legend}</legend>
      <div className="nv-slide-over-pills">
        {options.map((o) => {
          const active = values.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              className={`nv-slide-over-pill${active ? " is-active" : ""}`}
              onClick={() => onToggle(o)}
            >
              {o}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function FiltersSlideOver({
  open,
  initial,
  languageOptions,
  neighborhoodOptions,
  matchCountFor,
  onApply,
  onClose,
}: {
  open: boolean;
  initial: Filters;
  languageOptions: string[];
  neighborhoodOptions: string[];
  matchCountFor: (draft: Filters) => number;
  onApply: (next: Filters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Filters>(initial);
  const headingId = useId();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) setDraft(initial);
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const count = matchCountFor(draft);

  return (
    <>
      <div className="nv-slide-over-backdrop" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        className="nv-slide-over"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <header className="nv-slide-over-head">
          <h2 id={headingId}>Filters</h2>
          <button
            type="button"
            ref={closeBtnRef}
            className="nv-slide-over-close"
            aria-label="Close filters"
            onClick={onClose}
          >
            ✕
          </button>
        </header>
        <div className="nv-slide-over-body">
          <PillToggleGroup
            legend="Price"
            options={PRICE_OPTIONS}
            value={draft.price}
            onChange={(price) => setDraft((d) => ({ ...d, price }))}
          />
          <PillToggleGroup
            legend="Duration"
            options={DURATION_OPTIONS}
            value={draft.duration}
            onChange={(duration) => setDraft((d) => ({ ...d, duration }))}
          />
          <PillToggleGroup
            legend="Group size"
            options={GROUP_OPTIONS}
            value={draft.group}
            onChange={(group) => setDraft((d) => ({ ...d, group }))}
          />
          <MultiChipGroup
            legend="Language"
            options={languageOptions}
            values={draft.languages}
            onToggle={(v) =>
              setDraft((d) => ({
                ...d,
                languages: d.languages.includes(v)
                  ? d.languages.filter((x) => x !== v)
                  : [...d.languages, v],
              }))
            }
          />
          <MultiChipGroup
            legend="Neighborhood"
            options={neighborhoodOptions}
            values={draft.neighborhoods}
            onToggle={(v) =>
              setDraft((d) => ({
                ...d,
                neighborhoods: d.neighborhoods.includes(v)
                  ? d.neighborhoods.filter((x) => x !== v)
                  : [...d.neighborhoods, v],
              }))
            }
          />
        </div>
        <footer className="nv-slide-over-foot">
          <button
            type="button"
            className="nv-slide-over-clear"
            onClick={() => setDraft(DEFAULT_FILTERS)}
          >
            Clear all
          </button>
          <button
            type="button"
            className="nv-slide-over-apply"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Show {count} {count === 1 ? "experience" : "experiences"}
            {activeCount(draft) > 0 ? ` (${activeCount(draft)} filters)` : ""}
          </button>
        </footer>
      </div>
    </>
  );
}
```

- [ ] **Step 5: Add CSS for the slide-over**

Append to `src/app/globals.css`, near the other `nv-feed`/`nv-detail` blocks:

```css
/* ── Filters slide-over ─────────────────────────────────────────── */
.nv-slide-over-backdrop {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(0, 0, 0, 0.35);
  animation: nvSlideOverFade 0.15s ease-out both;
}
.nv-slide-over {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: min(420px, 100vw); z-index: 51;
  background: var(--nv-surface);
  display: grid; grid-template-rows: auto 1fr auto;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.18);
  animation: nvSlideOverIn 0.2s ease-out both;
}
.nv-slide-over-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: var(--nv-sp-md) var(--nv-sp-lg);
  border-bottom: 1px solid var(--nv-border);
}
.nv-slide-over-head h2 { margin: 0; font-size: 1.2rem; }
.nv-slide-over-close {
  width: 36px; height: 36px; border-radius: 50%;
  border: 1px solid var(--nv-border); background: var(--nv-surface);
  cursor: pointer;
}
.nv-slide-over-body {
  padding: var(--nv-sp-lg);
  overflow-y: auto;
  display: grid; gap: var(--nv-sp-lg);
}
.nv-slide-over-group { border: 0; padding: 0; margin: 0; }
.nv-slide-over-legend { font-weight: 700; margin-bottom: var(--nv-sp-sm); padding: 0; }
.nv-slide-over-pills { display: flex; flex-wrap: wrap; gap: var(--nv-sp-xs); }
.nv-slide-over-pill {
  min-height: 36px; padding: 0 var(--nv-sp-md);
  border: 1px solid var(--nv-border); border-radius: var(--nv-r-pill);
  background: var(--nv-surface); cursor: pointer; font: inherit;
}
.nv-slide-over-pill.is-active {
  background: var(--nv-action); color: var(--nv-text-on-action);
  border-color: var(--nv-action);
}
.nv-slide-over-pill:focus-visible {
  outline: 2px solid var(--nv-focus); outline-offset: 2px;
}
.nv-slide-over-foot {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--nv-sp-md); padding: var(--nv-sp-md) var(--nv-sp-lg);
  border-top: 1px solid var(--nv-border);
}
.nv-slide-over-clear {
  background: none; border: none; cursor: pointer; font: inherit;
  color: var(--nv-text-muted); text-decoration: underline;
}
.nv-slide-over-apply {
  flex: 1; min-height: 44px; padding: 0 var(--nv-sp-lg);
  border: none; border-radius: var(--nv-r-pill);
  background: var(--nv-action); color: var(--nv-text-on-action);
  cursor: pointer; font: inherit; font-weight: 700;
}
.nv-slide-over-apply:focus-visible {
  outline: 2px solid var(--nv-focus); outline-offset: 2px;
}
@keyframes nvSlideOverFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes nvSlideOverIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
@media (prefers-reduced-motion: reduce) {
  .nv-slide-over, .nv-slide-over-backdrop { animation: none; }
}
@media (max-width: 640px) {
  .nv-slide-over {
    top: auto; left: 0; right: 0;
    width: 100%; max-height: min(640px, 85vh);
    border-top-left-radius: var(--nv-r-lg);
    border-top-right-radius: var(--nv-r-lg);
    animation-name: nvSlideOverInBottom;
  }
  @keyframes nvSlideOverInBottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
}
```

- [ ] **Step 6: Run tests, verify pass**

Run: `npx vitest run src/components/navi/demo/__tests__/FiltersSlideOver.test.tsx`
Expected: 5 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/components/navi/demo/FiltersSlideOver.tsx \
  src/components/navi/demo/filters.ts \
  src/components/navi/demo/__tests__/FiltersSlideOver.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): FiltersSlideOver panel with draft state

Right-anchored slide-over (bottom-sheet on mobile) with focus trap, ESC-to-close,
and a live "Show N experiences" Apply button. Internal draft state commits on
Apply, discards on Close. Pill-toggle groups for Price/Duration/Group, multi-
chip groups for Language/Neighborhood.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Restructure feed controls row, wire `FiltersSlideOver`

The chip rail keeps its current chevron behavior. To its right (separated by a vertical divider), Sort stays as a native `<select>` and a new "Filters" button opens the slide-over. The old `<select>` for price moves into the slide-over and disappears from the row.

**Files:**
- Modify: `src/app/work/navi/(minisite)/demo/page.tsx`
- Modify: `src/components/navi/demo/__tests__/feed-page.test.tsx` (update assertions to match the new row + slide-over)
- Modify: `src/app/globals.css` — restructured `.nv-feed-controls`, divider, Filters button

- [ ] **Step 1: Update FeedPage to use the new Filters type and slide-over**

Open `src/app/work/navi/(minisite)/demo/page.tsx`. Replace the top of the file (imports + the `PRICE_BANDS`/`PriceBand` block + initial state) with:

```tsx
"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { SearchInput } from "@/components/navi/ui";
import { ExperienceCard } from "@/components/navi/demo/ExperienceCard";
import { CategoryIcon } from "@/components/navi/demo/CategoryIcon";
import { FiltersSlideOver } from "@/components/navi/demo/FiltersSlideOver";
import { DEFAULT_FILTERS, activeCount, type Filters } from "@/components/navi/demo/filters";
import { EXPERIENCES, CATEGORIES } from "@/lib/navi/demo-data";

type SortKey = "recommended" | "rating" | "price-asc" | "price-desc";

const PRICE_TEST: Record<Filters["price"], (p: number) => boolean> = {
  any: () => true,
  under30: (p) => p < 30,
  "30to60": (p) => p >= 30 && p <= 60,
  over60: (p) => p > 60,
};

function durationMatches(band: Filters["duration"], duration: string): boolean {
  if (band === "any") return true;
  const lower = duration.toLowerCase();
  if (band === "under2h") return /(\d+)\s*(min|hour)/.test(lower) && /^(60|90|45|30|1\.5|1 hour|2 hour)/.test(lower) === false ? lower.includes("hour") === false || lower.startsWith("1 hour") : false;
  if (band === "halfDay") return lower.includes("3 hour") || lower.includes("4 hour");
  if (band === "fullDay") return lower.includes("5 hour") || lower.includes("6 hour") || lower.includes("day");
  return true;
}

function groupMatches(band: Filters["group"], group: string): boolean {
  if (band === "any") return true;
  const lower = group.toLowerCase();
  const max = parseInt((lower.match(/(\d+)/) ?? ["0"])[0], 10);
  if (band === "solo") return max <= 1;
  if (band === "small") return max > 1 && max <= 8;
  if (band === "large") return max > 8;
  return true;
}

export default function FeedPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("recommended");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [slideOverOpen, setSlideOverOpen] = useState(false);

  const allLanguages = useMemo(
    () => Array.from(new Set(EXPERIENCES.map((e) => e.language))).sort(),
    [],
  );
  const allNeighborhoods = useMemo(
    () =>
      Array.from(
        new Set(
          EXPERIENCES.map((e) =>
            typeof e.neighborhood === "string" ? e.neighborhood : e.neighborhood?.name,
          ),
        ),
      ).filter(Boolean) as string[],
    [],
  );

  function applyFilters(list: typeof EXPERIENCES, f: Filters): typeof EXPERIENCES {
    const q = query.toLowerCase();
    const inPrice = PRICE_TEST[f.price];
    return list.filter((e) => {
      if (activeCategory && e.category !== activeCategory) return false;
      if (!inPrice(e.price)) return false;
      if (!durationMatches(f.duration, e.duration)) return false;
      if (!groupMatches(f.group, e.groupSize)) return false;
      if (f.languages.length > 0 && !f.languages.includes(e.language)) return false;
      if (f.neighborhoods.length > 0) {
        const nbName = typeof e.neighborhood === "string" ? e.neighborhood : e.neighborhood?.name;
        if (!nbName || !f.neighborhoods.includes(nbName)) return false;
      }
      const haystack = `${e.title} ${typeof e.neighborhood === "string" ? e.neighborhood : e.neighborhood?.name ?? ""}`;
      if (q && !haystack.toLowerCase().includes(q)) return false;
      return true;
    });
  }

  const filtered = useMemo(() => {
    const list = applyFilters([...EXPERIENCES], filters);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, activeCategory, sort, filters]);

  const hasFilters =
    activeCategory !== null ||
    activeCount(filters) > 0 ||
    query !== "" ||
    sort !== "recommended";
  const clearFilters = () => {
    setActiveCategory(null);
    setFilters(DEFAULT_FILTERS);
    setSort("recommended");
    setQuery("");
  };

  const matchCountFor = useCallback(
    (draft: Filters) => applyFilters([...EXPERIENCES], draft).length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [query, activeCategory],
  );
```

Note: the `applyFilters` and `matchCountFor` use stable deps via `useCallback` / `useMemo` deps lists, with disable-comments only where the lint rule would over-flag the helper function call.

If the existing `Experience` type still uses `neighborhood: string`, the `typeof e.neighborhood === "string"` branches above will be the only path that runs. They become future-proof once Slice 3 lands.

- [ ] **Step 2: Update the chip rail JSX (unchanged) and the controls row**

The chip rail markup is unchanged — it sits inside `.nv-feed-catwrap` with the chevron buttons. Below it, replace the existing `<div className="nv-feed-controls">…</div>` block with:

```tsx
      <div className="nv-feed-controls">
        <p className="nv-feed-count" role="status">
          {filtered.length} {filtered.length === 1 ? "experience" : "experiences"}
          {activeCategory ? ` in ${activeCategory}` : ""}
        </p>
        <div className="nv-feed-actions">
          <label className="nv-feed-select">
            <span className="nv-sr-only">Sort experiences</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </label>
          <button
            type="button"
            className="nv-feed-filters"
            onClick={() => setSlideOverOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={slideOverOpen}
          >
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true" focusable="false"
            >
              <line x1="4" y1="6" x2="20" y2="6" />
              <circle cx="9" cy="6" r="2" fill="currentColor" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <circle cx="15" cy="12" r="2" fill="currentColor" />
              <line x1="4" y1="18" x2="20" y2="18" />
              <circle cx="11" cy="18" r="2" fill="currentColor" />
            </svg>
            <span>Filters</span>
            {activeCount(filters) > 0 && (
              <span className="nv-feed-filters-badge" aria-label={`${activeCount(filters)} active`}>
                {activeCount(filters)}
              </span>
            )}
          </button>
          {hasFilters && (
            <button type="button" className="nv-feed-clear" onClick={clearFilters}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      <FiltersSlideOver
        open={slideOverOpen}
        initial={filters}
        languageOptions={allLanguages}
        neighborhoodOptions={allNeighborhoods}
        matchCountFor={matchCountFor}
        onApply={setFilters}
        onClose={() => setSlideOverOpen(false)}
      />
```

- [ ] **Step 3: Add the divider and new row CSS**

In `src/app/globals.css`, find the existing `.nv-feed-controls` rule and **replace** the block (the controls rule plus `.nv-feed-selects`, `.nv-feed-select`) with:

```css
.nv-feed-controls {
  display: flex; align-items: center; justify-content: space-between;
  gap: var(--nv-sp-md); flex-wrap: wrap;
  margin-bottom: var(--nv-sp-lg);
}
.nv-feed-count { margin: 0; font-weight: 700; }
.nv-feed-actions { display: flex; align-items: center; gap: var(--nv-sp-sm); }
.nv-feed-select { display: inline-flex; align-items: center; }
.nv-feed-select select {
  min-height: 36px; padding: 0 var(--nv-sp-md);
  border: 1px solid var(--nv-border); border-radius: var(--nv-r-pill);
  background: var(--nv-surface); font: inherit; cursor: pointer;
}
.nv-feed-filters {
  display: inline-flex; align-items: center; gap: var(--nv-sp-xs);
  min-height: 36px; padding: 0 var(--nv-sp-md);
  border: 1px solid var(--nv-border); border-radius: var(--nv-r-pill);
  background: var(--nv-surface); cursor: pointer; font: inherit; font-weight: 700;
}
.nv-feed-filters-badge {
  display: inline-grid; place-items: center;
  min-width: 20px; height: 20px; padding: 0 6px;
  border-radius: var(--nv-r-pill); font-size: 0.75rem; font-weight: 700;
  background: var(--nv-action); color: var(--nv-text-on-action);
}
.nv-feed-filters:focus-visible { outline: 2px solid var(--nv-focus); outline-offset: 2px; }
```

To put the divider between the chip rail and the actions on wide viewports, restructure `.nv-feed-catwrap` and `.nv-feed-controls` to share a row at ≥768px. Add this rule below the existing `.nv-feed-controls` block:

```css
@media (min-width: 768px) {
  .nv-feed-row {
    display: flex; align-items: center; gap: var(--nv-sp-md);
    margin-bottom: var(--nv-sp-md);
  }
  .nv-feed-row .nv-feed-catwrap { flex: 1; min-width: 0; margin-bottom: 0; }
  .nv-feed-row .nv-feed-divider {
    width: 1px; height: 36px; background: var(--nv-border);
  }
  .nv-feed-row .nv-feed-actions { flex: 0 0 auto; }
}
@media (max-width: 767px) {
  .nv-feed-divider { display: none; }
}
```

- [ ] **Step 4: Wrap the chip rail + actions in `.nv-feed-row` and add the divider**

In `src/app/work/navi/(minisite)/demo/page.tsx`, restructure the JSX so the chip rail and the actions row are siblings inside a `.nv-feed-row`. Move the count line below the row so it sits above the grid:

```tsx
      <div className="nv-feed-row">
        <div className={`nv-feed-catwrap${canPrev ? " is-prev" : ""}${canNext ? " is-next" : ""}`}>
          {/* existing chip rail + chevron markup */}
        </div>
        <div className="nv-feed-divider" aria-hidden="true" />
        <div className="nv-feed-actions">
          {/* the new actions cluster: sort select, Filters button, Clear filters */}
        </div>
      </div>

      <p className="nv-feed-count" role="status">
        {filtered.length} {filtered.length === 1 ? "experience" : "experiences"}
        {activeCategory ? ` in ${activeCategory}` : ""}
      </p>

      <FiltersSlideOver ... />
```

At narrow viewports the divider hides and the actions cluster wraps under the chip rail naturally.

- [ ] **Step 5: Update the feed-page test**

Open `src/components/navi/demo/__tests__/feed-page.test.tsx`. Replace any assertion that selected `<select>` elements by their displayed text for price (since price is now in the slide-over) with assertions that the Filters button exists and that clicking it opens a `role="dialog"`. Keep assertions for the sort select.

If the test currently includes a price-band assertion like:

```tsx
await userEvent.selectOptions(screen.getByLabelText(/filter by price/i), "under30");
```

Replace it with:

```tsx
await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
await userEvent.click(screen.getByRole("button", { name: /Show .* experiences/ }));
```

- [ ] **Step 6: Run the feed-page test, fix any breakage**

Run: `npx vitest run src/components/navi/demo/__tests__/feed-page.test.tsx`
Expected: PASS.

- [ ] **Step 7: Visual verification in dev**

Open `/work/navi/demo`. Confirm:
- Chip rail and the Sort + Filters cluster share a row at desktop widths.
- A 1px vertical divider sits between them.
- Clicking Filters opens a right-anchored panel.
- Pressing ESC closes it without applying.
- Toggling Under $30 + Apply updates the count and closes the panel.
- The Filters button shows a `(1)` badge after applying a filter.

- [ ] **Step 8: Commit**

```bash
git add src/app/work/navi/\(minisite\)/demo/page.tsx \
  src/components/navi/demo/__tests__/feed-page.test.tsx \
  src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): combined filter row + slide-over panel

Feed page combines the chip rail and the sort/filters cluster into one row,
separated by a 1px divider at desktop widths. Sort stays as a native select.
Price band moves out of the row and into the new FiltersSlideOver, joined by
Duration, Group size, Language, and Neighborhood filters. The Filters button
shows an active-count badge.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Sitewide spacing pass

Audit the targeted offenders from the spec and replace ad-hoc px values with `--nv-sp-*` tokens. The rule is:
- Section-to-section vertical gap: `var(--nv-sp-xl)`
- Heading-to-body gap: `var(--nv-sp-md)`
- Card-internal padding: `var(--nv-sp-sm)` to `var(--nv-sp-md)`
- Inline-control gap: `var(--nv-sp-xs)`

**Files:**
- Modify: `src/app/globals.css` (multiple targeted blocks)

- [ ] **Step 1: Audit each named offender and apply the rule**

For each target below, open `src/app/globals.css`, find the rule, and replace any hard-coded `px` values that govern vertical rhythm with the appropriate token. Do NOT touch CSS that is intentionally non-rhythmic (e.g. component-internal border widths).

Targets:

1. `.nv-feed-head` — gap between `<header>` content and the categories rail. Confirm `margin-bottom` uses `var(--nv-sp-xl)`.
2. `.nv-detail-head` to `.nv-detail-body` — find the existing rule and confirm a `gap` or `margin-bottom` of `var(--nv-sp-xl)` between them.
3. `.nv-booking` (BookingCard) — internal `padding` should be `var(--nv-sp-md)`; `gap` between children should be `var(--nv-sp-sm)`.
4. `.nv-reviews` (Reviews) — top margin from the previous block should be `var(--nv-sp-xl)`.
5. `.nv-detail-where-map` — vertical margin should be `var(--nv-sp-md)`.
6. `.nv-detail-section` — confirm `gap: var(--nv-sp-md)` and `padding-top: var(--nv-sp-xl)` already match the new rhythm.

After each change, re-read the rule block to confirm only tokens or zeroes appear in vertical-rhythm positions.

- [ ] **Step 2: Visual scan**

Open `/work/navi/demo`, `/work/navi/demo/experience/prospect-park-carriage`, `/work/navi/system` in the dev preview. Walk top-to-bottom on each. Note any place a margin or gap reads as visually wrong (cramped, oddly large). Fix by adjusting the offender's token to the next step on the scale.

- [ ] **Step 3: Run the full test suite to catch any layout-dependent test regressions**

Run: `npx vitest run`
Expected: all PASS.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "$(cat <<'EOF'
fix(navi): sitewide spacing pass

Replace ad-hoc px values with --nv-sp-* tokens across nv-feed-head,
nv-detail-head, nv-booking, nv-reviews, and nv-detail-where-map.
Establishes a consistent vertical rhythm: section gap xl, heading-to-body
md, card-internal sm-md, inline-control xs.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: System page specimens

Document the new PillRow primitive and its two compositions. Add a chip-rail specimen. Verify CarouselArrow + PaginationDots specimens still match the now-real implementations.

**Files:**
- Modify: `src/app/work/navi/(minisite)/system/page.tsx`

- [ ] **Step 1: Add a `PillRow` specimen before the Tabs specimen**

Open `src/app/work/navi/(minisite)/system/page.tsx`. Add `PillRow` to the existing `@/components/navi/ui` import line.

Find the existing `<Specimen title="Tabs">` block. Just above it, add:

```tsx
<Specimen
  title="PillRow"
  note="Shared visual primitive. Tabs and the sticky section nav both consume it."
>
  <PillRowDemo />
</Specimen>
```

Inside the same file (next to existing local components like `SearchInputDemo`), add the demo helper:

```tsx
function PillRowDemo() {
  const [active, setActive] = useState("plan");
  return (
    <PillRow
      items={[
        { id: "learn", label: "Learn" },
        { id: "plan", label: "Plan" },
        { id: "go", label: "Go" },
      ]}
      activeId={active}
      onSelect={setActive}
    />
  );
}
```

Make sure `useState` is in the file's import list.

- [ ] **Step 2: Update the Tabs specimen note**

Find the existing `<Specimen title="Tabs">` block and replace its (possibly empty) `note=` prop with:

```tsx
<Specimen
  title="Tabs"
  note="Tablist composition: one panel visible at a time. Use for settings, billing, anywhere you want N panels under one selector. For stacked, scroll-jump sections, use the Sticky section nav specimen below instead."
>
```

- [ ] **Step 3: Add a `Sticky section nav` specimen**

Just below the Tabs specimen, add:

```tsx
<Specimen
  title="Sticky section nav"
  note="Anchor composition: all sections are visible and stacked. The nav jumps you to a section and tracks active state by scroll position. Used on the experience detail page."
>
  <StickySectionNavDemo />
</Specimen>
```

Define the helper:

```tsx
function StickySectionNavDemo() {
  const [active] = useState("plan");
  return (
    <PillRow
      role="navigation"
      ariaLabel="Sections (demo)"
      items={[
        { id: "learn", label: "Learn" },
        { id: "plan", label: "Plan" },
        { id: "go", label: "Go" },
      ]}
      activeId={active}
      onSelect={() => {}}
      extraAttrs={(_, isActive) => ({
        "aria-current": isActive ? "true" : undefined,
      })}
    />
  );
}
```

- [ ] **Step 4: Add a chip-rail specimen**

Inside the existing "Content" or "Navigation" chapter (whichever fits — the file already groups specimens by chapter), add:

```tsx
<Specimen
  title="Category chip rail"
  note="Horizontal scrolling rail with edge fades and chevron buttons that only appear when there's overflow to scroll to. Used at the top of the feed."
>
  <CategoryRailDemo />
</Specimen>
```

Define the helper. Pull `CategoryIcon` and a slice of `CATEGORIES` (just first 6 to keep the specimen compact):

```tsx
import { CategoryIcon } from "@/components/navi/demo/CategoryIcon";
import { CATEGORIES } from "@/lib/navi/demo-data";

function CategoryRailDemo() {
  const [active, setActive] = useState<string | null>(null);
  return (
    <div className="nv-feed-catwrap">
      <section className="nv-feed-categories" aria-label="Categories (demo)">
        <button
          type="button"
          className={`nv-feed-cat${active === null ? " nv-feed-cat--active" : ""}`}
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          <CategoryIcon name="All" />
          <span>All</span>
        </button>
        {CATEGORIES.slice(0, 6).map((c) => (
          <button
            key={c}
            type="button"
            className={`nv-feed-cat${active === c ? " nv-feed-cat--active" : ""}`}
            aria-pressed={active === c}
            onClick={() => setActive(c)}
          >
            <CategoryIcon name={c} />
            <span>{c}</span>
          </button>
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 5: Verify CarouselArrow + PaginationDots specimens still render**

The existing specimens are at lines around 226–228 (CarouselArrow) and wherever `PaginationDots` appears. Confirm they still display the components after Task 4's component changes.

Visual check: open `/work/navi/system` in the dev preview. Scroll to each new specimen. Confirm:
- PillRow specimen renders the three pills, clicking switches active.
- Tabs specimen unchanged.
- Sticky section nav specimen renders; clicking does nothing (no scroll target here, that's fine).
- Chip rail specimen renders with icons and chevrons appearing only on overflow.
- CarouselArrow and PaginationDots specimens render with the centered SVG arrows from the previous session.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/navi/\(minisite\)/system/page.tsx
git commit -m "$(cat <<'EOF'
docs(navi-system): add PillRow, sticky section nav, and chip-rail specimens

Documents the new PillRow primitive and its two compositions (Tabs as tablist,
sticky section nav as anchor). Adds a chip-rail specimen so the live category
pattern is part of the documented system. Tabs specimen gets a note clarifying
when to choose it vs the sticky section nav.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: BookingCard reserve transition

Enhance the existing instant text-swap from Reserve → Confirmation with a 200ms scale+fade and a checkmark glyph between the two states. Respects `prefers-reduced-motion`.

**Files:**
- Modify: `src/components/navi/demo/BookingCard.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Add a transition wrapper in BookingCard**

Open `src/components/navi/demo/BookingCard.tsx`. Replace the `{reserved ? ... : ...}` block with a wrapper that keeps both states in the DOM and toggles a class:

```tsx
      <div className={`nv-booking-state${reserved ? " is-reserved" : ""}`}>
        <div className="nv-booking-state-reserve" aria-hidden={reserved}>
          <Button
            variant="primary"
            onClick={() => {
              onReserve(selected);
              setReserved(true);
            }}
          >
            Reserve now
          </Button>
          {priceFrom > 0 && (
            <p className="nv-booking-note">You won&apos;t be charged in this demo.</p>
          )}
        </div>
        <div className="nv-booking-state-confirmed" aria-hidden={!reserved}>
          <p className="nv-booking-confirm" role="status">
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              strokeLinejoin="round" aria-hidden="true" focusable="false"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Reserved for {selected.date} at {selected.time}. Nothing was charged in this demo.
          </p>
          <Button variant="transparent" onClick={() => setReserved(false)}>
            Change reservation
          </Button>
        </div>
      </div>
```

- [ ] **Step 2: Add the CSS for the cross-fade**

Append to `src/app/globals.css`:

```css
.nv-booking-state { display: grid; }
.nv-booking-state > div {
  grid-column: 1; grid-row: 1;
  display: grid; gap: var(--nv-sp-sm);
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.nv-booking-state .nv-booking-state-reserve { opacity: 1; transform: scale(1); }
.nv-booking-state .nv-booking-state-confirmed { opacity: 0; transform: scale(0.97); pointer-events: none; }
.nv-booking-state.is-reserved .nv-booking-state-reserve { opacity: 0; transform: scale(0.97); pointer-events: none; }
.nv-booking-state.is-reserved .nv-booking-state-confirmed { opacity: 1; transform: scale(1); pointer-events: auto; }
.nv-booking-confirm svg { vertical-align: -3px; margin-right: 6px; color: var(--nv-action); }
@media (prefers-reduced-motion: reduce) {
  .nv-booking-state > div { transition: none; }
}
```

- [ ] **Step 3: Run BookingCard tests**

Run: `npx vitest run src/components/navi/demo/__tests__/BookingCard.test.tsx`
Expected: PASS. If the existing tests assert that the Reserve button disappears after Reserve is clicked, they may need updating to assert that the confirmation message becomes visible instead. Use `expect(screen.getByText(/Reserved for/)).toBeVisible()` and `expect(screen.getByRole("button", { name: "Reserve now" })).not.toBeVisible()` (since `pointer-events: none` is not "not visible" per testing-library — use `.toHaveStyle({ opacity: "0" })` or query by `aria-hidden`).

- [ ] **Step 4: Commit**

```bash
git add src/components/navi/demo/BookingCard.tsx src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(navi-demo): cross-fade Reserve and Confirmed states in BookingCard

Replaces the instant text-swap with a 200ms scale+fade cross-fade between
"Reserve now" and "Reserved for …" states, plus a checkmark glyph next to
the confirmation. Respects prefers-reduced-motion. Both states stay in the
DOM with aria-hidden toggled so screen readers only announce the active one.

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Final integration check

- [ ] **Step 1: Run the full test suite**

Run: `npx vitest run`
Expected: all green.

- [ ] **Step 2: Run typecheck and lint**

Run: `npx tsc --noEmit && npx eslint .`
Expected: both clean.

- [ ] **Step 3: Walk the four surfaces in the dev preview**

Open the dev preview (`npm run dev` if not running) and walk through:

1. `/work/navi/demo` — chip rail + Sort + Filters in one row at ≥768px. Filters opens a slide-over. Apply commits filters and updates the count + badge. Clear filters resets everything.
2. `/work/navi/demo/experience/prospect-park-carriage` — Learn/Plan/Go sticky pills (now via PillRow). Reserve button cross-fades to the Confirmed state with a checkmark. Gallery carousel works (arrows, dots, thumbs, ArrowLeft/ArrowRight when hero focused).
3. `/work/navi/demo/search` — map + cards still render, no spacing regressions.
4. `/work/navi/system` — PillRow specimen, Tabs specimen (with new note), Sticky section nav specimen, chip-rail specimen, CarouselArrow + PaginationDots specimens all render. Walk top to bottom; visual rhythm reads even.

- [ ] **Step 4: Open the PR**

Push the branch and open a PR with the title and body:

Title: `feat(navi): substance pass slice 1 — filter slide-over, PillRow primitive, GalleryCarousel`

Body:

```markdown
## Summary
- Combines the chip rail and Sort/Filters cluster into one row at ≥768px.
- New FiltersSlideOver panel with draft state, focus trap, ESC-to-close, live "Show N experiences" Apply button. Price/Duration/Group/Language/Neighborhood inside.
- Extracts PillRow primitive. Tabs (tablist) and the detail-page sticky section nav (anchor) both consume it. System page documents the primitive plus both compositions.
- New GalleryCarousel wires the previously orphaned CarouselArrow and PaginationDots into a real demo surface (hero carousel + thumb-jump strip + arrow-key support).
- Sitewide spacing pass standardizes vertical rhythm on --nv-sp-* tokens.
- BookingCard Reserve → Confirmed gets a 200ms scale+fade cross-fade with a checkmark glyph.

## Test plan
- [ ] `npx vitest run` is green.
- [ ] `npx tsc --noEmit` and `npx eslint .` are clean.
- [ ] Manual walk-through on `/work/navi/demo`, `/work/navi/demo/experience/prospect-park-carriage`, `/work/navi/demo/search`, `/work/navi/system` per Task 10 Step 3.

🤖 Generated with Claude Code.
```

- [ ] **Step 5: Mark the slice 1 work complete**

This plan ends here. Slices 2–4 each get their own plan when starting that work.
