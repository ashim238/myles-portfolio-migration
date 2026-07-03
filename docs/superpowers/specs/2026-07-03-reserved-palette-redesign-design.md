# Reserved-color §6 redesign — grouped palette

**Date:** 2026-07-03
**Surface:** Fresh Greens case study, section 6 "Reserved color that holds"
**Files:** `src/app/work/fresh-greens/page.tsx`, `src/components/fresh-greens.tsx`, `src/app/globals.css`, `src/components/fresh-greens-filter.tsx` (deleted)

## Problem

The interactive phone mock in §6 (`ReservedColorFilter`) reads as cheap next to the case study's real screenshots, adds a second heavy interactive block that interrupts the section's flow, and lists the reserved-color carve-outs as a flat 12-item list when they naturally group by color.

## Goal

Replace the fabricated, interactive demo with one calm, static exhibit that groups the carve-outs by color, and let a real screenshot carry the "it holds on a real screen" proof. The section should read like the prose around it, not like a gadget dropped into it.

## Non-goals

- No interactive toggle, focus panel, or grayscale filter. The proof is the organization plus a real screenshot, not a live mechanism.
- No new photography or Figma assets — the evidence screenshot already exists in the repo.
- No change to the reserved-color values (already wired to the app's real `theme/colors.ts` tokens in prior commits).

## Design

### New component: `ReservedPalette` (Lanes)

A static, server-rendered component (no `"use client"`) co-located in `src/components/fresh-greens.tsx`. It replaces both `SignalSwatches` and `ReservedColorFilter`.

Structure:
- A one-line **baseline** statement establishing green as the non-reserved default: *"Green carries every CTA, link, and affordance — the only non-reserved color. Four colors, plus the daylight gradient, are held back, each to one meaning."*
- Then **five lanes**, one per reserved family, rendered as a `<dl>` (semantically: color = term, carve-outs = description):
  - Each lane is a full-width band with a two-column grid: a **left rail** (color swatch + name + role) and a **right column** (that color's carve-outs, each a bold tag + a one-line note).
  - Swatches are decorative (`aria-hidden`); the color name is text, so meaning never rides on color alone.

Lane data (`RESERVED_LANES`):

| Family | Swatch | Role | Carve-outs (tag — note) |
|---|---|---|---|
| Red | `#FF3B30` | Alert | **Live audio-capture indicator** — a pulsing dot for the active recording state on `/pulled-over`. · **Destructive-action labels** — remove, unpublish, and sign-out. · **Error copy on light** — swaps to the darker `severityCritical` token for AA (~5.6:1 vs red's ~3.5:1). · **iOS red on dark auth** — the contrast argument inverts, so default red passes there. |
| Orange | `#FF9500` | Hazard · caution | **Community-report pin** — marks community observations apart from the institutional feeds. · **Report FAB** — the same orange, the contribute-back affordance. · **Route-preview hazard chips** — police presence and low-light segments. |
| Yellow | `#FFCC00` | Caution | **General caution teardrops** — map hazards and weather advisories. · **Trusted-station gold star** — a documented carve-out from the caution role. |
| Navy | `#041E49` | Safety affordance | **En-route Shield** — safety mode itself; never data state or sync. · **/emergency SOS disc** — kept distinct from the destructive-action red. |
| Daylight | gradient `#FFB347 → #C4785A → #2D1B69` | Gradient | **Daylight polyline** — color IS the data, a per-segment daylight score. A solid → dashed → dotted cadence carries it for WCAG 1.4.1. |

The Daylight lane **absorbs the old `DaylightLegend`**: its note names the solid/dashed/dotted cadence, and the swatch shows the gradient, so the standalone legend figure is removed.

### Evidence screenshot

After the palette, a single real screenshot as calm, static proof: `public/projects/fresh-greens/v2/en-route.png` (chosen because it shows the reserved palette in action — navy shield, hazards, daylight). Rendered in the existing `PhoneFrame variant="screenshot"` + `ExpandableImage` treatment, with a caption pointing out the reserved colors holding in situ. No toggle.

### New §6 order

1. Heading + intro prose (kept; light trim only).
2. **`ReservedPalette`** — the exhibit.
3. **`en-route` screenshot** — static evidence.
4. "Where color IS the signal, a second channel rides alongside" prose + the existing `report-detail` figure — kept unchanged (distinct WCAG color-plus-glyph point).
5. The old "exceptions" prose block is **removed** — its content (error copy on light, iOS red on dark auth, the recording indicator, destructive labels) is fully folded into the Red lane, so repeating it in prose is redundant.

### Responsive

- Desktop/tablet: two-column lane grid (`~150px` left rail + `1fr` right column).
- Mobile (< ~640px): the lane collapses to a single column — swatch + name + role row on top, carve-outs stacked below. No horizontal overflow.

### Motion

None. The palette is a calm reference and ships fully visible (no reveal gate, no stagger, no toggle). The prose `case-highlight` marks elsewhere in the section keep their existing animation; the palette does not compete with them.

### Accessibility

- `<dl>` structure: each `<dt>` is the color name + role, each `<dd>` holds that color's carve-outs as a `<ul role="list">`.
- Swatches `aria-hidden`; color meaning is carried by the text name.
- Note/muted text must meet WCAG AA (≥ 4.5:1) on the warm paper surface — pick a muted token at or darker than the case study's existing body-muted, verified by inspection, not eyeballed.
- Fully keyboard-neutral (no interactive controls to trap or mis-order).

### Removals / cleanup

- **Delete** `src/components/fresh-greens-filter.tsx` in full (the phone mock, filter, toggle, inlined SVG geometry, carve-out data array — the entire exhibit built earlier this session).
- Remove the `ReservedColorFilter` import and usage, the "The demo below runs the same claim…" intro prose, `SignalSwatches` usage, and `DaylightLegend` usage from `page.tsx`.
- Delete the now-unused `SignalSwatches` and `DaylightLegend` component definitions from `fresh-greens.tsx` (confirm no other references first).
- Remove `.fg-filter*` rules and the `--fgm-*` token blocks from `globals.css`; remove `.fg-signal*` and `.fg-legend*` if fully superseded. Add `.fg-palette*` rules for the lanes.

### Colors

All values come from the app's real `theme/colors.ts` (already used elsewhere in the case study): green `#41AD49`, red `#FF3B30`, orange `#FF9500`, yellow `#FFCC00`, navy `#041E49`, daylight `#FFB347 / #C4785A / #2D1B69`. Warm surfaces: page `#F4F4ED`, card `#FEFDFB`, border `#E3E1D9`.

## Verification

- Preview at desktop (1280) and mobile (375): lanes render, stack correctly on mobile, no horizontal overflow.
- `preview_inspect` the muted/note text for ≥ 4.5:1 contrast on the surface.
- Confirm the removed components leave no orphan imports; `tsc --noEmit` clean; detector clean on the changed files.
- Confirm §6 reads top-to-bottom as one calm arc: rule → palette → real screen → the two-channel nuance.

## Trade-offs accepted

- We delete the phone mock built earlier this session. Intentional: it is the element that read as cheap.
- The evidence is a single real screen rather than a live multi-color demonstration; completeness is carried by the palette, and the screenshot carries premium realism.
