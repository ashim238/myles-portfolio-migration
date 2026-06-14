# Understanding FAFSA — Case Study Design Spec

**Date:** 2026-06-14  
**Branch:** TBD at implementation (`cursor/understandingfafsa-case-study-d5d3` suggested)  
**Status:** Approved — implementation in progress  
**Figma:** [UnderstandingFAFSA Template](https://www.figma.com/design/GtA0aGSygtLpY8ES8VtkZt/UnderstandingFAFSA-Template?m=dev) (`GtA0aGSygtLpY8ES8VtkZt`)

---

## 1. Overview

Rebuild the Understanding FAFSA case study as a **custom page** (`/work/understandingfafsa`) with visual dimensionality comparable to Navi and Fresh Greens. Scope is **case study only** — the homepage work showcase card stays unchanged.

The generic markdown-driven `[slug]` page is insufficient: email modular blocks, before/after mobile proof, and the locked-vs-swappable system decision need structured layout and light interactivity, not a flat PNG grid.

**Primary feel:** dimensional — phone frames, staggered module stack, scoped accent world.  
**Secondary feel:** system design — two small interactives make the modular framework legible without reading three paragraphs.

**Portfolio fit:** Scoped visual world (`.uf-page`, warm/cool FAFSA accents) inside the existing shell (`page-shell`, `SiteNav`, `ProjectCover`, `ProjectToc`, `ProjectHighlight`, `ProjectWorkJump`, `ExpandableImage`, lightbox, homepage zoom enter transition).

**Content strategy (between B and C):** Custom page with prose inlined in the route file (like Navi). Frontmatter in `content/projects/understandingfafsa.md` remains the source for homepage card, meta, metrics, and SEO fields. Markdown `sections` cleared to `[]` to prevent duplicate generic route content.

---

## 2. Scope

### In scope

- Dedicated `/work/understandingfafsa/page.tsx`
- Co-located components in `src/components/understandingfafsa.tsx`
- Scoped CSS tokens under `.uf-page` in `globals.css`
- Six content sections with custom visual bands where noted below
- Two light interactives bundled in §04 (Building the System):
  1. **Template variant switcher** — Weekly / ICYMI / Counselor
  2. **Locked vs swappable toggle** — overlay zones on one modular block
- `data-project-slug="understandingfafsa"` for homepage enter transition
- `ProjectCover` with existing `cover.png`
- `prefers-reduced-motion` paths for all motion and crossfades

### Out of scope

- Homepage work showcase changes (stack image, accent, parallax)
- Third interactive artifact
- Competitive audit visualization (120+ examples remain prose)
- Live Mailchimp embed or HTML email preview
- TikTok case study
- New fonts (portfolio shell typography only)

---

## 3. Page architecture

```
/work/understandingfafsa/page.tsx
├── Shell (.uf-page, data-project-slug="understandingfafsa")
├── SiteNav + breadcrumb
├── Hero (eyebrow, title, lede from getProjectBySlug)
├── ProjectCover (/projects/understandingfafsa/cover.png)
├── Meta strip (role, timeframe, tags)
├── ProjectHighlight (quote + ~52.6% open rate metric)
├── ProjectToc (7 anchors)
├── §01 Context                    — prose
├── §02 The Problem                — prose + BeforeAfterPhones
├── §03 Competitive Audit          — prose only
├── §04 Building the System        — prose + TemplateSwitcher + ModularGallery + LockedSwappableToggle + ColorPalette
├── §05 Figma to Mailchimp         — prose + image pair (ExpandableImage)
├── §06 Results                    — prose + metric callout
└── ProjectWorkJump
```

**Markdown change:** Set `sections: []` in `content/projects/understandingfafsa.md`. All other frontmatter unchanged.

---

## 4. Scoped visual world

`.uf-page` CSS custom properties:

| Token | Value | Use |
|---|---|---|
| `--uf-accent-warm` | `#f26938` | Swappable overlay, eyebrow, warm accents |
| `--uf-accent-cool` | `#164f73` | Locked overlay, secondary accent |
| `--uf-accent-soft` | `color-mix(in oklch, var(--uf-accent-warm) 14%, transparent)` | Card backgrounds, hover states |
| `--uf-accent-line` | `color-mix(in srgb, var(--uf-accent-warm) 55%, transparent)` | Borders, dividers |

**Eyebrow:** `Product design · 2025` — mono, sentence-case. No tracked all-caps eyebrows (PRODUCT.md anti-ref).

**Enter transition:** Same pattern as Navi/Fresh Greens — homepage card zoom settles onto `.project-cover-image`.

---

## 5. Visual bands

### §02 — Before/after phones (`BeforeAfterPhones`)

Two mobile screenshots in lightweight phone frames (`.uf-phone`, adapted from Fresh Greens `.fg-phone` pattern):

| Slot | Asset | Label |
|---|---|---|
| Before | `/projects/understandingfafsa/mobile-before.jpg` | ~30% open rate |
| After | `/projects/understandingfafsa/mobile-after.jpg` | ~52.6% open rate |

- Desktop: side-by-side with opposing rest tilt (−2° / +2°)
- Mobile: stacked vertically
- Both wrapped in `ExpandableImage` for lightbox
- Tilt and hover depth collapse under `prefers-reduced-motion`

Note: alt text in markdown currently swaps before/after descriptions — fix during implementation so alt matches visual content.

### §04 — Modular block gallery (`ModularBlockGallery`)

Staggered vertical stack (not flat grid) of modular PNGs:

1. `modular-header.png`
2. `modular-students.png`
3. `modular-best.png`
4. `modular-related.png`
5. `modular-reading.png`
6. `modular-guides.png`
7. `modular-closer.png`

Each card: offset, shadow, alternating slight rotation (−1° to +1°), slight overlap for depth. `ExpandableImage` on each. Mobile: single column, no overlap, zero rotation.

---

## 6. Interactive artifacts (§04)

Both live in "Building the System" after the intro prose and before the palette band.

### 6.1 Template variant switcher (`TemplateSwitcher`)

**Question answered:** *What does the system ship?*

Three chip buttons: **Weekly · ICYMI · Counselor**

| Variant | Preview image | Descriptor |
|---|---|---|
| Weekly (default) | `shipped-mailchimp.jpg` | Full modular kit — emoji headers, founder's default send |
| ICYMI | `modular-related.png` | Fewer blocks, faster assembly for event recaps |
| Counselor | `modular-students.png` | Duotone icons, formal register for counselor audience |

**Behavior:**
- `<button>` chips with `aria-pressed`
- Image + descriptor crossfade on switch (~200ms)
- Static swap (no transition) under `prefers-reduced-motion`
- No URL persistence

### 6.2 Locked vs swappable toggle (`LockedSwappableToggle`)

**Question answered:** *How does the system hold together when a non-designer assembles every send?*

Representative block: **`modular-students.png`**

Two-segment control: **[ Swappable | Locked ]** — default Swappable.

| Mode | Overlay color | Regions highlighted | Legend |
|---|---|---|---|
| Swappable | `--uf-accent-warm` at ~12% opacity | Body copy area, emoji/header image slot, link text | "Founder edits each send" |
| Locked | `--uf-accent-cool` at ~12% opacity | Spacing rails, divider lines, type scale, footer skeleton | "Structure stays fixed" |

**Implementation:** CSS absolutely-positioned overlay zones on a wrapper around the image. Approximate rectangles — explanatory, not pixel-perfect Figma trace.

**Behavior:**
- Toggle buttons with `aria-pressed`
- Crossfade between overlay states (~200ms)
- Static under `prefers-reduced-motion`

### 6.3 How the two interactives relate

- **Template switcher** = outputs (what ships)
- **Locked/swappable toggle** = rules (how it holds)

Different questions, same section, minimal overlap.

---

## 7. §04 layout order

```
[ intro prose — 2 paragraphs ]

TemplateSwitcher
  chips → preview image → descriptor

ModularBlockGallery
  staggered stack (7 cards)

LockedSwappableToggle
  toggle → image + overlays → legend

ColorPalette (existing component, 12 hex values from frontmatter/content)

[ outro prose — locked-vs-swappable decision paragraph ]
```

Desktop: full width bands, gallery max-width constrained. Mobile: vertical stack in this order; chips wrap.

---

## 8. §05 — Figma to Mailchimp

Prose from existing markdown section. Image pair below copy:

- `figma-design.jpg` — Figma layout before translation
- `shipped-mailchimp.jpg` — shipped Mailchimp template

Both `ExpandableImage`. Side-by-side on desktop, stacked on mobile. No slider interactivity (out of scope).

---

## 9. §06 — Results

Prose from existing markdown. Inline metric callout reusing `ProjectHighlight` metric pattern or a simple `.uf-outcome` band:

- **~30% → ~52.6%** open rate (MPP excluded)
- First redesigned send: November 4, 2025

No animated counter (out of scope).

---

## 10. Files to create / modify

| File | Action |
|---|---|
| `src/app/work/understandingfafsa/page.tsx` | Create — custom case study route |
| `src/components/understandingfafsa.tsx` | Create — `BeforeAfterPhones`, `ModularBlockGallery`, `TemplateSwitcher`, `LockedSwappableToggle`, `EmailPhoneFrame` |
| `src/app/globals.css` | Add `.uf-page` tokens + component styles |
| `content/projects/understandingfafsa.md` | Set `sections: []` |

**Dependencies (existing, no changes required):**
- `ProjectCover`, `ProjectHighlight`, `ProjectToc`, `ProjectWorkJump`
- `ExpandableImage`, `ColorPalette`
- `getProjectBySlug`, `getPublishedProjects`
- `project-enter` transition (already on homepage card click)

---

## 11. Accessibility

- All toggle/chip controls: keyboard focusable, `aria-pressed` state
- Overlay zones: decorative (`aria-hidden="true"`) — meaning conveyed via legend text
- Phone frame wrappers: decorative; meaningful alt on inner images
- Reduced motion: disable tilt, crossfades, stack breathe; instant state swaps OK
- Contrast: overlay tints at 12% opacity must not obscure readable image content beneath

---

## 12. Verification

- [ ] `/work/understandingfafsa` renders; generic `[slug]` route not used for this project
- [ ] Homepage card click triggers enter transition; cover settles correctly
- [ ] Template switcher swaps image + descriptor; all three variants work
- [ ] Locked/swappable toggle swaps overlays + legend
- [ ] Gallery cards expand in lightbox
- [ ] Before/after phones expand in lightbox
- [ ] `prefers-reduced-motion`: no tilt, no crossfade, static toggles
- [ ] Mobile: sections stack cleanly; no horizontal overflow
- [ ] Light + dark theme: `.uf-page` tokens readable in both
- [ ] `npm run build` passes

---

## 13. Voice notes

- Keep em-dash count low in visible copy (portfolio voice pass from TikTok applies here too)
- Case study is email/content design — differentiate from product-app case studies (Fresh Greens, Navi) through module-stack metaphor, not phone-app chrome everywhere
- The 120+ newsletter audit stays prose — don't apologize for lack of viz; the writing carries it (PRODUCT.md principle 1)

---

## 14. Figma reference appendix

Source file: `GtA0aGSygtLpY8ES8VtkZt` — [UnderstandingFAFSA Template](https://www.figma.com/design/GtA0aGSygtLpY8ES8VtkZt/UnderstandingFAFSA-Template?m=dev)

### Key frames

| Frame | Node ID | Maps to |
|---|---|---|
| Modular Blocks stack | `1110:683` | Gallery block order + locked/swappable anatomy |
| Weekly template (Charizard theme) | `463:1365` | Template switcher — Weekly variant |
| ICYMI / related reading | `1106:1080` | Template switcher — ICYMI variant |
| Students section | `1106:1116` | Locked/swappable toggle base + Counselor tone |
| Educator toolkit | `903:962` | Counselor variant register |
| Components library | `200:2` | Locked chrome: header, wave, button, section tag |

### Production colors (from Figma)

| Role | Hex | Spec token |
|---|---|---|
| Body text | `#212121` | inherited shell |
| Links | `#4083b9` | — |
| Header sky | `#82c5fa` | near `#82c5fb` in palette |
| Students bg | `#e7f2fb` | — |
| Guides bg | `#f3e0fd` | — |
| Footer/closer | `#0788c1` | near `#2788c1` in palette |
| Orange accent | `#f26938` | `--uf-accent-warm` ✓ |
| Navy accent | `#164f73` | `--uf-accent-cool` ✓ |

### Locked vs swappable (Figma structure)

**Locked (cool overlay):** header banner shell, wave dividers, 40px padding rails, section-tag pattern, button chrome, footer/closer skeleton.

**Swappable (warm overlay):** headlines, body copy, emoji/duotone icons, article links, junior/senior content blocks, PDF/guide images.

Overlay rectangles in `LockedSwappableToggle` are approximate — explanatory, not pixel-traced from Figma.
