# Cover treatment — unified straight-on device frames

**Date:** 2026-07-06
**Surface:** Project cover images used by the home gallery (and case-study headers)
**Files:** `public/projects/{fresh-greens,navi,understandingfafsa}/cover.png` (regenerated), `src/app/globals.css` (thumbnail framing only if needed)

## Context

**Sub-project 2** of the recruiter-glance redesign. It is a **hard prerequisite for sub-project 1** (the home gallery): the gallery leads with the covers, so if the covers don't read, the gallery doesn't land. These two ship as one coordinated workstream — covers first, then the gallery consumes them. Sub-project 3 (case-study density) runs in parallel and is independent.

## Problem

All three current covers spend most of their pixels on environment, not interface:

- **Fresh Greens** — a single phone floating on a large dark-green field; the phone is ~20% of the frame.
- **Navi** — a tablet in a lifestyle desk scene; the UI is small and at a perspective angle.
- **UnderstandingFAFSA** — two tilted phones on grey; the newsletter is small and angled.

At the gallery's thumbnail size the actual craft never survives the shrink, and the three don't read as a set — different backgrounds, framings, and angles.

## Goal

Regenerate all three covers as one **unified system**: straight-on (no perspective), the real product screen filling most of the frame, on a background tinted to that project's brand hue, authored to the gallery's **3:2** ratio. The row should read as a coherent, intentional set where each project's actual interface is legible even small.

## Non-goals

- No change to the gallery layout or code (sub-project 1) beyond consuming the new covers.
- No change to case-study body content (sub-project 3).
- No new photography or 3D renders — covers are composed from the real screen PNGs already in the repo.
- Not touching the many in-page screenshots inside case studies; only the `cover.png` per project.

## Design

### The unified system

Every cover shares:

- **Ratio:** 3:2 landscape, authored at 2400×1600 (source) so it stays crisp when the featured card renders large. Exported as optimized PNG (or WebP if the pipeline supports it) at a sensible weight.
- **Orientation:** straight-on. No perspective, no tilt, no drop-into-desk scenes.
- **Fill:** the device(s) are scaled so the **screen fills ≥65% of the frame's area**, bleeding off the top and bottom edges when needed so the UI reads big. Brand-hue ground fills the remaining margin (the left/right gutter for a single portrait phone; top/bottom for a landscape tablet/desktop).
- **Device frame:** a clean, minimal device bezel (phone or tablet as fits the product), consistent corner radius and bezel weight across all three. One shared frame style.
- **Background:** a flat, slightly-tinted brand hue (not pure saturation — a calm, desaturated tint of the brand color so the screen stays the hero). Subtle, single-color; no gradients, no noise, no props.
- **Lighting/shadow:** one consistent soft shadow under the device, same direction and softness on all three.

The only thing that varies between covers is the **hue** and the **screen content**.

### Per-project composition

| Project | Brand hue (tint from) | Device | Source screen(s) |
|---|---|---|---|
| Fresh Greens | green `#41AD49` | single phone, portrait, bled top/bottom | `public/projects/fresh-greens/en-route.png` or `route-preview.png` (shows the reserved palette + daylight route — the most on-brand screen) |
| Navi | orange `#f3722c` (`--nv-accent`) | tablet or desktop, landscape | `public/projects/navi/final-mockup.png` or `interface-composition.png` |
| UnderstandingFAFSA | blue (newsletter header blue; confirm exact hex from `modular-header.png`) | phone showing the newsletter, portrait, bled top/bottom | `public/projects/understandingfafsa/modular-header.png` + `modular-best.png` |

Exact source screen per project is finalized during implementation by trying candidates in the browser and picking the one that reads best small. Phone-based products (Fresh Greens, FAFSA) use the bleed-top/bottom treatment so the portrait screen fills a landscape frame; the landscape product (Navi) fills naturally.

### Consistency checklist (the "set" test)

Rendered as a row at thumbnail size, the three must share: identical bezel style and corner radius, identical shadow, identical margin rhythm, identical ratio. If two covers sit side by side and read as from different systems, the treatment has failed.

### Production approach

Composed from existing assets using image tooling (no external design app required):

1. Take the chosen source screen PNG, place it straight-on inside a shared device-frame template.
2. Scale so the screen fills ≥65% of a 2400×1600 canvas, bleeding edges as needed.
3. Fill the ground with the desaturated brand tint; add the shared soft shadow.
4. Export to `public/projects/<slug>/cover.png`, replacing the current file (same path, so no code change needed to reference it).
5. Iterate each in the browser gallery (via the sub-project-1 build) until the row reads as a set and each UI is legible at grid size.

### Accessibility

- Covers are decorative-with-context; the gallery already carries the meaning in the visible title + outcome, and the `alt` text (`"{title} preview"`) stays. No text baked into the cover art that isn't also in the DOM.
- Brand-hue grounds must not reduce contrast of any adjacent UI; the cover is self-contained imagery, so this is about the image reading clearly, not text contrast.

## Files affected

- **Replace** `public/projects/fresh-greens/cover.png`, `public/projects/navi/cover.png`, `public/projects/understandingfafsa/cover.png` (same paths).
- **Edit** `src/app/globals.css` only if the gallery thumbnail framing needs adjustment once real covers are in (e.g. object-position). Ideally zero code change.

## Verification

- View the home gallery at desktop and 375px: each project's UI is legible in its thumbnail; the featured cover reads well large; the three read as one set.
- Confirm covers are 3:2 and reasonably weighted (not multi-MB); `next/image` still optimizes them.
- Confirm no perspective/tilt remains and bezel/shadow/margin are identical across the three.
- Confirm the case-study cover usage (if any reuses `cover.png`) still looks right.

## Trade-offs accepted

- We lose the lifestyle-scene warmth of the Navi desk shot and the playful float of the others. Intentional: legibility of the work at a glance wins over mood.
- Composing from existing screen PNGs caps fidelity vs. a fresh art pass; accepted, and revisitable later if a cover feels thin.
- A unified system means the covers are more uniform and less individually bespoke; that uniformity is the point (it reads as a considered set).
