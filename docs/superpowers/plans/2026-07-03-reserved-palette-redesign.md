# Reserved-Palette §6 Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the interactive phone-mock demo in Fresh Greens §6 with one calm, static `ReservedPalette` that groups the 12 reserved-color carve-outs by color into five lanes, plus the real `en-route` screenshot as evidence.

**Architecture:** A pure data module (`RESERVED_LANES`) drives a static, server-rendered `ReservedPalette` component (a `<dl>` of color lanes). It replaces `SignalSwatches`, `ReservedColorFilter` (deleted entirely), and `DaylightLegend` (folded into the Daylight lane). The palette uses the portfolio's own design tokens for its surface/text and the app's real reserved-color hexes for the swatches.

**Tech Stack:** Next.js 16 (App Router, server components), React 19, TypeScript, Tailwind v4 + hand-authored CSS in `globals.css`, Vitest.

**Spec:** `docs/superpowers/specs/2026-07-03-reserved-palette-redesign-design.md`

---

## File Structure

- **Create** `src/lib/fresh-greens/palette.ts` — `ReservedLane` / `CarveOut` types + `RESERVED_LANES` data.
- **Create** `src/lib/fresh-greens/__tests__/palette.test.ts` — data-shape test (mirrors the existing `src/lib/navi/__tests__/` pattern).
- **Modify** `src/components/fresh-greens.tsx` — add `ReservedPalette`; delete `SIGNALS`, `SignalSwatches`, `DaylightLegend`.
- **Modify** `src/app/work/fresh-greens/page.tsx` — rewire §6 imports and JSX.
- **Modify** `src/app/globals.css` — add `.fg-palette*`; delete `.fg-signal*`, `.fg-legend*`, and the whole `.fg-filter*` block.
- **Delete** `src/components/fresh-greens-filter.tsx` — the entire phone mock.

---

## Task 1: Lane data module + shape test

**Files:**
- Create: `src/lib/fresh-greens/palette.ts`
- Test: `src/lib/fresh-greens/__tests__/palette.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/fresh-greens/__tests__/palette.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { RESERVED_LANES } from "../palette";

describe("RESERVED_LANES", () => {
  it("has the five reserved families in order", () => {
    expect(RESERVED_LANES.map((l) => l.family)).toEqual([
      "red",
      "orange",
      "yellow",
      "navy",
      "daylight",
    ]);
  });

  it("documents all 12 carve-outs", () => {
    const total = RESERVED_LANES.reduce((n, l) => n + l.carveOuts.length, 0);
    expect(total).toBe(12);
  });

  it("gives every lane a swatch and every carve-out a tag + note", () => {
    for (const lane of RESERVED_LANES) {
      expect(lane.swatch).toMatch(/\S/);
      expect(lane.name).toMatch(/\S/);
      expect(lane.carveOuts.length).toBeGreaterThan(0);
      for (const c of lane.carveOuts) {
        expect(c.tag).toMatch(/\S/);
        expect(c.note).toMatch(/\S/);
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/fresh-greens/__tests__/palette.test.ts`
Expected: FAIL — cannot resolve `../palette` (module does not exist yet).

- [ ] **Step 3: Create the data module**

Create `src/lib/fresh-greens/palette.ts`:

```ts
// Reserved-color palette for the Fresh Greens case study, §6.
// Swatch hexes are the app's real reserved palette from theme/colors.ts.
// The 12 carve-outs are the documented reserved-color exceptions from the
// app's .cursorrules, grouped by color.

export type CarveOut = { tag: string; note: string };

export type ReservedLane = {
  family: "red" | "orange" | "yellow" | "navy" | "daylight";
  name: string;
  role: string;
  /** Solid hex for the four reserved colors; a CSS gradient for daylight. */
  swatch: string;
  carveOuts: CarveOut[];
};

export const RESERVED_LANES: ReservedLane[] = [
  {
    family: "red",
    name: "Red",
    role: "Alert",
    swatch: "#FF3B30",
    carveOuts: [
      {
        tag: "Live audio-capture indicator",
        note: "A pulsing dot for the active recording state on /pulled-over.",
      },
      {
        tag: "Destructive-action labels",
        note: "Remove, unpublish, and sign-out.",
      },
      {
        tag: "Error copy on light",
        note: "Swaps to the darker severityCritical token for AA (~5.6:1 vs red's ~3.5:1).",
      },
      {
        tag: "iOS red on dark auth",
        note: "The contrast argument inverts, so default red passes there.",
      },
    ],
  },
  {
    family: "orange",
    name: "Orange",
    role: "Hazard · caution",
    swatch: "#FF9500",
    carveOuts: [
      {
        tag: "Community-report pin",
        note: "Marks community observations apart from the institutional feeds.",
      },
      {
        tag: "Report FAB",
        note: "The same orange — the contribute-back affordance.",
      },
      {
        tag: "Route-preview hazard chips",
        note: "Police presence and low-light segments.",
      },
    ],
  },
  {
    family: "yellow",
    name: "Yellow",
    role: "Caution",
    swatch: "#FFCC00",
    carveOuts: [
      {
        tag: "General caution teardrops",
        note: "Map hazards and weather advisories.",
      },
      {
        tag: "Trusted-station gold star",
        note: "A documented carve-out from the caution role.",
      },
    ],
  },
  {
    family: "navy",
    name: "Navy",
    role: "Safety affordance",
    swatch: "#041E49",
    carveOuts: [
      {
        tag: "En-route Shield",
        note: "Safety mode itself; never data state or sync.",
      },
      {
        tag: "/emergency SOS disc",
        note: "Kept distinct from the destructive-action red.",
      },
    ],
  },
  {
    family: "daylight",
    name: "Daylight",
    role: "Gradient",
    swatch: "linear-gradient(135deg, #FFB347, #C4785A, #2D1B69)",
    carveOuts: [
      {
        tag: "Daylight polyline",
        note: "Color IS the data — a per-segment daylight score. A solid → dashed → dotted cadence carries it for WCAG 1.4.1.",
      },
    ],
  },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/fresh-greens/__tests__/palette.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/lib/fresh-greens/palette.ts src/lib/fresh-greens/__tests__/palette.test.ts
git commit -m "Add reserved-palette lane data for Fresh Greens §6"
```

---

## Task 2: `ReservedPalette` component

**Files:**
- Modify: `src/components/fresh-greens.tsx` (add component near the current `SignalSwatches`, ~line 465)

- [ ] **Step 1: Add the import at the top of `src/components/fresh-greens.tsx`**

The file currently begins with:

```tsx
import type { ReactNode } from "react";
import { DrawOnView } from "@/components/draw-on-view";
```

Add below those:

```tsx
import { RESERVED_LANES } from "@/lib/fresh-greens/palette";
```

- [ ] **Step 2: Add the `ReservedPalette` component**

Insert this component immediately BEFORE the existing `export function SignalSwatches()` (it will be deleted in Task 5, but keeping both compiling in this task avoids a broken intermediate state):

```tsx
/* ──────────────────────────────────────────
   Reserved palette — the §6 exhibit.
   Green stated once as the baseline, then the four
   reserved colors plus the daylight gradient, each
   grouped with its documented carve-outs. Static:
   no toggle, no gadget. Swatches are decorative; the
   color name carries the meaning.
   ────────────────────────────────────────── */

export function ReservedPalette() {
  return (
    <div className="fg-palette">
      <p className="fg-palette-baseline">
        <strong>Green</strong> carries every CTA, link, and affordance — the
        only non-reserved color. Four colors, plus the daylight gradient, are
        held back, each to one meaning.
      </p>
      <dl className="fg-palette-lanes">
        {RESERVED_LANES.map((lane) => (
          <div className="fg-palette-lane" key={lane.family}>
            <dt className="fg-palette-head">
              <span
                className="fg-palette-swatch"
                style={{ background: lane.swatch }}
                aria-hidden="true"
              />
              <span className="fg-palette-headtext">
                <span className="fg-palette-name">{lane.name}</span>
                <span className="fg-palette-role">{lane.role}</span>
              </span>
            </dt>
            <dd className="fg-palette-carveouts">
              <ul role="list">
                {lane.carveOuts.map((c) => (
                  <li key={c.tag}>
                    <span className="fg-palette-tag">{c.tag}.</span>{" "}
                    <span className="fg-palette-note">{c.note}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: PASS (no errors). `ReservedPalette` is unused for now — that's fine; TypeScript does not error on unused exports.

- [ ] **Step 4: Commit**

```bash
git add src/components/fresh-greens.tsx
git commit -m "Add ReservedPalette component (grouped-by-color lanes)"
```

---

## Task 3: Palette CSS

**Files:**
- Modify: `src/app/globals.css` (add a new block immediately after the `.fg-signal*` block, before the `/* ── Reserved-color filter demo ── */` comment near line 4498)

- [ ] **Step 1: Add the `.fg-palette*` rules**

Insert this block right before the line `/* ── Reserved-color filter demo ───────────────────────── */`:

```css
/* ── Reserved palette (grouped lanes) ─────────────────── */

.fg-palette {
  margin: 2.4rem 0 0;
}

.fg-palette-baseline {
  margin: 0 0 1.7rem;
  font-size: 0.98rem;
  line-height: var(--lead-long, 1.6);
  color: var(--foreground);
  max-width: 62ch;
  text-wrap: pretty;
}

.fg-palette-baseline strong {
  color: var(--fg-accent);
  font-weight: 600;
}

.fg-palette-lanes {
  margin: 0;
}

.fg-palette-lane {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.55rem 1.6rem;
  padding: 1.15rem 0;
  border-top: 1px solid var(--line);
}

.fg-palette-lane:first-child {
  border-top: 0;
  padding-top: 0;
}

@media (min-width: 640px) {
  .fg-palette-lane {
    grid-template-columns: 168px 1fr;
    align-items: start;
  }
}

.fg-palette-head {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  margin: 0;
}

.fg-palette-swatch {
  width: 22px;
  height: 22px;
  border-radius: 6px;
  flex: none;
  margin-top: 0.1rem;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.fg-palette-headtext {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.fg-palette-name {
  font-weight: 600;
  color: var(--foreground);
  font-size: 0.98rem;
  line-height: 1.1;
}

.fg-palette-role {
  font-size: 0.72rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--muted);
}

.fg-palette-carveouts {
  margin: 0;
  min-width: 0;
}

.fg-palette-carveouts ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.fg-palette-tag {
  font-weight: 600;
  color: var(--foreground);
  font-size: 0.92rem;
}

.fg-palette-note {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.5;
  text-wrap: pretty;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "Add .fg-palette lane styles"
```

---

## Task 4: Rewire §6 in the page

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx`

- [ ] **Step 1: Update the imports (lines 8–15)**

Replace this import block:

```tsx
import {
  ArchitectureDiagram,
  DaylightLegend,
  PhoneFrame,
  SignalSwatches,
} from "@/components/fresh-greens";
import { ReservedColorFilter } from "@/components/fresh-greens-filter";
```

with:

```tsx
import {
  ArchitectureDiagram,
  PhoneFrame,
  ReservedPalette,
} from "@/components/fresh-greens";
```

(Removes `DaylightLegend`, `SignalSwatches`, and the entire `ReservedColorFilter` import line; adds `ReservedPalette`.)

- [ ] **Step 2: Replace the exhibit block**

Replace this run of JSX (currently the `<SignalSwatches />`, the "demo below" prose, and `<ReservedColorFilter />`):

```tsx
        <SignalSwatches />

        <div className="project-section-body">
          <p>
            The demo below runs the same claim on a real screen. Flip the
            toggle: brand-green fades because it isn&apos;t a reserved role,
            and the only elements still carrying color are the four
            reserved-role instances on the surface. Focus any of them to
            read the carve-out that pins the color to that meaning.
          </p>
        </div>

        <ReservedColorFilter />
```

with:

```tsx
        <ReservedPalette />

        <figure className="fg-safety-visual">
          <PhoneFrame variant="screenshot">
            <Shot
              name="en-route"
              alt="The Fresh Greens en-route screen: a navy safety Shield, hazard markers, and the daylight-graded route line — the reserved colors holding together on one real screen"
            />
          </PhoneFrame>
          <figcaption className="fg-safety-visual-caption">
            The reserved palette holding on a real screen: navy for the safety
            Shield, the daylight gradient on the route, hazard markers in their
            reserved hues — and nothing else non-green.
          </figcaption>
        </figure>
```

> **NOTE — screenshot reuse:** `en-route.png` is already the §3 `Device3D` screen. This shows it a second time (as a flat evidence shot). That was the user's explicit pick ("en-route shows the palette in action best"). If you'd rather not repeat it, swap `name="en-route"` to `name="home-collapsed"` (the real /home) and adjust the alt/caption to name the orange community pin + orange alert instead. Do not change this without confirming — en-route is the chosen default.

- [ ] **Step 3: Remove the exceptions prose and the DaylightLegend (lines ~335–355)**

Delete this entire block (the "exceptions" prose `<div>` and the `<DaylightLegend />` that follows it):

```tsx
        <div className="project-section-body">
          <p>The exceptions are worth naming, because each one is defended by contrast math.</p>
          <p>
            Error text on light surfaces uses a darker error red
            (severityCritical, roughly 5.6:1 against white) instead of the
            iOS default #FF3B30 (roughly 3.5:1, which fails AA for body
            copy). Same color role, different token, chosen because the
            contrast math forced it. Error signals (the dot, the pill) still
            use the iOS red because they&apos;re not body copy. On the dark
            auth screens the AA argument inverts, so error text there stays
            iOS red, with in-code annotations naming the split.
          </p>
          <p>
            The recording indicator on <code>/pulled-over</code> pulses red
            because a live audio-capture state is exactly what red is
            reserved for. Destructive-action labels use red for the same
            reason.
          </p>
        </div>

        <DaylightLegend />
```

After this deletion, §6 ends with the `report-detail` figure + its trailing `</section>`. The "Where color IS the signal…" prose and the `report-detail` figure (currently lines ~313–333) stay exactly as they are.

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: FAIL — `src/components/fresh-greens-filter.tsx` still exists but is now unimported (fine), and `fresh-greens.tsx` still exports the now-unused `SignalSwatches` / `DaylightLegend` (fine). The only real errors would be if a JSX tag was left dangling. If tsc reports errors in `page.tsx`, fix the JSX before continuing. Expected end state: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/fresh-greens/page.tsx
git commit -m "Rewire Fresh Greens §6 to the grouped palette + en-route evidence"
```

---

## Task 5: Delete the mock and dead code

**Files:**
- Delete: `src/components/fresh-greens-filter.tsx`
- Modify: `src/components/fresh-greens.tsx` (remove `SIGNALS`, `SignalSwatches`, `DaylightLegend`)
- Modify: `src/app/globals.css` (remove `.fg-filter*`, `.fg-signal*`, `.fg-legend*`)

- [ ] **Step 1: Confirm nothing else imports the code being deleted**

Run:

```bash
grep -rn "ReservedColorFilter\|SignalSwatches\|DaylightLegend\|fresh-greens-filter" src/ --include=*.tsx --include=*.ts
```

Expected: no matches (all were removed in Task 4). If any match remains outside the files being deleted, stop and resolve it first.

- [ ] **Step 2: Delete the mock file**

```bash
git rm src/components/fresh-greens-filter.tsx
```

- [ ] **Step 3: Remove `SIGNALS`, `SignalSwatches`, and `DaylightLegend` from `src/components/fresh-greens.tsx`**

Delete three spans:
- The `const SIGNALS = [ … ];` array and the `/* … Reserved-color signaling chips … */` comment block directly above it.
- The entire `export function SignalSwatches() { … }`.
- The `/* … Daylight dash-pattern legend … */` comment block and the entire `export function DaylightLegend() { … }`.

Leave `ReservedPalette`, `PhoneFrame`, `ArchitectureDiagram`, `ProcessGraph`, `HeroRouteIllustration`, `FeatureCard`, and the new `RESERVED_LANES` import intact.

- [ ] **Step 4: Remove the dead CSS from `src/app/globals.css`**

Delete these blocks (find them by their section-comment anchors — line numbers shift as you edit):
- The whole `/* ── Reserved-color filter demo ── */` block: everything from that comment through the end of its reduced-motion rule, stopping just before `/* ── Craft split ── */`. (Was lines ~4498–4894.)
- The `/* ── Signal swatches ── */` block: `.fg-signal-list`, `.fg-signal`, `.fg-signal:first-child`, `.fg-signal-swatch`, `.fg-signal-name`, `.fg-signal-role`, `.fg-signal-note`.
- The `.fg-legend*` rules: `.fg-legend`, `.fg-legend-row`, `.fg-legend-line`, `.fg-legend-label` (grep `\.fg-legend` to find them).

Verify none are still referenced:

```bash
grep -rn "fg-filter\|fg-signal\|fg-legend" src/ --include=*.tsx --include=*.ts
```

Expected: no matches.

- [ ] **Step 5: Typecheck + tests + lint**

Run: `npx tsc --noEmit && npx vitest run && npm run lint`
Expected: all PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Delete the reserved-color phone mock and its dead code + CSS"
```

---

## Task 6: Verify in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server and open the Fresh Greens page**

Use the `preview_start` tool (config name `portfolio`), then navigate to `/work/fresh-greens` and scroll to §6 "Reserved color that holds." (Turbopack sometimes serves stale CSS chunks in this project — if the palette styles look unapplied, delete `.next` and restart the dev server.)

- [ ] **Step 2: Desktop check (1280px)**

Confirm: the baseline sentence reads first; five lanes follow (Red, Orange, Yellow, Navy, Daylight) each with its swatch + name + role on the left and carve-outs on the right; hairline dividers between lanes; the `en-route` screenshot sits below as evidence with its caption. No leftover toggle, phone mock, or flat list.

- [ ] **Step 3: Mobile check (375px)**

Resize to mobile. Confirm each lane stacks (swatch + name + role on top, carve-outs below), no horizontal overflow, text remains readable.

- [ ] **Step 4: Contrast check**

Use `preview_inspect` on a `.fg-palette-note` element. Confirm its computed color against the section background meets WCAG AA (≥ 4.5:1). If it fails, darken `.fg-palette-note` toward `var(--foreground)` (e.g. `color-mix(in srgb, var(--foreground) 72%, transparent)`) until it passes, then re-commit the CSS.

- [ ] **Step 5: Detector**

Run: `node .claude/skills/impeccable/scripts/detect.mjs --json src/components/fresh-greens.tsx src/app/work/fresh-greens/page.tsx`
Expected: only the intentional reserved-palette color advisories (`#FF3B30`, `#FF9500`, `#FFCC00`, `#041E49`, daylight hexes) — no structural findings. Acknowledge those as the app's real palette; do not "fix" them.

- [ ] **Step 6: Screenshot proof + final confirmation**

Capture a `preview_screenshot` of §6 at desktop and mobile for the record. Confirm §6 now reads as one calm arc: rule → grouped palette → real screen → the WCAG color-plus-glyph nuance.

- [ ] **Step 7: Final commit (only if Step 4 changed CSS)**

```bash
git add src/app/globals.css
git commit -m "Nudge palette note contrast to AA"
```

---

## Notes for the implementer

- **Server component:** `ReservedPalette` has no state or interactivity — do not add `"use client"`. It renders on the server like the other static FG components.
- **Tokens:** the palette's surface/text use the portfolio's tokens (`--foreground`, `--muted`, `--line`, `--fg-accent`), NOT the app's warm-paper `#F4F4ED`. Only the swatches use the app's reserved hexes. This keeps the palette sitting calmly on the page instead of reading as a nested card.
- **No motion:** ship it fully visible. Do not gate visibility behind a reveal class (the case study's `case-highlight` marks keep their own animation; the palette stays still).
