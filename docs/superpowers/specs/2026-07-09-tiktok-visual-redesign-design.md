# TikTok case visual redesign — design

Date: 2026-07-09
Branch: `portfolio/positioning-pass` (continues the same branch as the parity work)

## Why

Reviewer/owner feedback on the newly-published TikTok case: the cover photo and
exhibits feel flat, the color reads dull, the timeline has a contrast issue, and
the layout lacks rhythm. Root cause: the case argues that TikTok ads must speak
in vibrant, subculture-native registers, but the page is dressed in restrained
gray. Direction chosen: **restrained editorial shell, vibrant subculture
exhibits** (the Fresh Greens reserved-color move — saturation earns its place
where the content is about color).

## Assets (staged in `public/projects/tiktok/`)

Owner re-exported from the 2021 Illustrator/PSD source:
- `tpl-dopamine.svg`, `tpl-eboy.svg`, `tpl-academia.svg` — full 1080×1920 vector
  ad screens with the product photo embedded as base64 (browsers render them
  fully; qlmanage thumbnails do not, which is a tooling artifact only).
- `asset-dopamine-title.svg`, `asset-academia-text.svg`,
  `asset-academia-barcode.svg` — isolated vector elements for richer comps.
- `gradient-cover.png` — 2400×1350 flatten of `Gradient Cover Art.psd`: fluid
  cyan/blue/magenta/white blobs on near-black. The animated cover source.

No new photography. Everything else is CSS + light `sharp` compositing.

## The redesign

### 1. Cover — animated gradient (drenched, dark)

- Full-bleed cover using `gradient-cover.png` on a near-black ground. Title,
  eyebrow, and lede sit over it in light type (editorial shell stays calm; the
  ground carries the vibrancy).
- **Motion (slight):** the composition drifts/breathes on a slow ~25s loop, with
  one or two blurred CSS radial-gradient accent blobs (cyan `--tt-cyan`, magenta
  `--tt-magenta`) floating independently over it. Ease-in-out, transform/opacity
  only (GPU-cheap).
- **Robust reveal + reduced motion (load-bearing):** the cover image and title
  are visible by default; motion plays *over* an already-painted cover. Under
  `prefers-reduced-motion: reduce`, the gradient is static and the floating
  blobs are hidden. Never gate cover visibility on a JS/animation class (avoids
  the blank-hero failure on hidden tabs / headless renders).
- The old `HeroThreePhones` composite is retired from the hero; the three-phones
  idea moves to §2.

### 2. In-feed exhibits — the three templates, shown in context

- Replace the flat template presentation with the crisp `tpl-*.svg` screens, each
  framed as an in-feed post (rounded 9:16 screen, subtle device edge) sitting on
  its own subculture color environment.
- Per aesthetic, a full color field (not tiny chips): dopamine (electric
  blue/pink), e-boy (onyx/near-black), light academia (sand/desert). The
  per-aesthetic accent that is currently flattened to gray `--tt-accent: #888`
  is restored to each aesthetic's real color for that section only.

### 3. Outcome moment

- Give `shipped-light-academia-in-hand.png` a full saturated band (the real
  shipped ad, held in a real hand) instead of a small card. Strongest real
  asset, biggest moment.

### 4. Timeline accessibility fix

- The node dots are `--tt-cyan` (#25f4ee) on white ≈ 1.2:1 (near-invisible).
  Change the dot to an accessible treatment: a dark/ink-filled node that passes
  ≥3:1, with the cyan kept only as a subtle outer glow. Bump the small mono
  year/detail text to a legible size + contrast. Keep the existing
  reduced-motion guard on the pulse.

### 5. Layout rhythm

- Break the flat centered stack with full-bleed color moments: the cover band,
  the alternating color-blocked aesthetic exhibits (reuse the existing
  `--reverse` alternation), and the outcome band. Scale contrast between the
  neutral shell sections and the saturated exhibits carries the rhythm.

### Shell stays neutral (unchanged)

Hero prose, `case-section-lead` sentences, body copy, `RecruiterCut`, and
`ProjectToc` keep the editorial neutral treatment from the parity pass. Only the
exhibits go vibrant.

## Files

- `src/app/work/tiktok/page.tsx` — cover markup, exhibit structure, outcome band.
- `src/components/tiktok-dsa.tsx` — `HeroThreePhones` → new cover component;
  `AestheticShowcaseCard` exhibit framing; `LineageTimeline` dot fix.
- `src/app/globals.css` — `.tt-*` cover/exhibit/timeline styles, motion keyframes
  + reduced-motion guards, per-aesthetic accent restoration.

## Verification

- Live preview iteration at each step (cover motion, exhibit color, timeline,
  layout) — this is craft work, verified visually in the browser, not by unit
  tests.
- Robust-reveal check: cover + exhibits paint with JS disabled / on a hidden
  tab; reduced-motion renders static with no missing content.
- `/impeccable audit` after: contrast (timeline dots, light-on-dark cover text,
  per-aesthetic accents), motion (reduced-motion coverage), responsive (no
  overflow at 375/768, cover legible on mobile).
- Swap owner's crisp SVGs are already in; no placeholder remains.

## Open confirm

Cover interpretation: the animated gradient is the cover and the three phones
move to §2 (recommended and assumed). If the owner wants the phones composited
*on top of* the gradient instead, §1 and §2 merge.
