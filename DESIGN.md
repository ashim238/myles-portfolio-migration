---
name: Myles Ashitey Portfolio
description: Portfolio for a product designer targeting broad roles, with associate roles as the near-term focus. Editorial long-form case studies, dark + light themes, per-project accent scoping.
colors:
  background: "#050505"
  surface: "#0a0a0a"
  foreground: "#f4f4f4"
  muted: "#c4c4c4"
  line: "#343434"
  focus-ring: "#8ab4ff"
  background-light: "#fafafa"
  surface-light: "#f0f0f0"
  foreground-light: "#111111"
  muted-light: "#555555"
  line-light: "#d4d4d4"
  fg-accent: "#6aab7e"
  fg-accent-light: "#3d6447"
  tt-cyan: "#25f4ee"
  tt-magenta: "#fe2c55"
typography:
  display:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(2.4rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 0.9
    letterSpacing: "-0.026em"
  headline:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(1.7rem, 3vw, 2.5rem)"
    fontWeight: 500
    lineHeight: 1.16
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "clamp(1.15rem, 2.2vw, 1.35rem)"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Golos Text, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.58
    letterSpacing: "0.008em"
  label:
    fontFamily: "Mona Sans, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "normal"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.78rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  none: "0"
  sm: "0.35rem"
  md: "0.7rem"
  lg: "1rem"
spacing:
  xs: "0.45rem"
  sm: "0.9rem"
  md: "1.6rem"
  lg: "2.4rem"
  xl: "5rem"
  content-max: "68rem"
components:
  link-primary:
    textColor: "{colors.foreground}"
  link-primary-hover:
    textColor: "{colors.fg-accent}"
  pullquote:
    textColor: "{colors.foreground}"
    typography: "{typography.headline}"
  project-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "1.6rem"
  project-card-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
  toc-link:
    textColor: "{colors.muted}"
    typography: "{typography.label}"
  toc-link-active:
    textColor: "{colors.foreground}"
---

# Design System: Myles Ashitey Portfolio

## 1. Overview

**Creative North Star: "The Open Studio"**

The portfolio is staged like a critique session with the work pinned up: the case studies are the artifacts on the wall, the writing is the conversation around them, and the visitor walks the room at their own pace. The artifacts on display include real things — original grid annotations from a working Illustrator file, hand-drawn sketches with their pink marker notes, photographs of the shipped product in someone's hand. The chrome around the artifacts stays out of the way so the work can talk.

The system rejects every pattern that signals templated production: SaaS marketing scaffolding (tracked-uppercase eyebrows above each section, decorative `01/02/03` numbering, gradient text), generic dev-portfolio costume (neon accent on terminal aesthetic, the "type-it-out" hero), and the 2026 warm-minimal cream-card default. Instead, depth comes from typography hierarchy, generous spacing rhythm, line-based separators (not shadows), and case-study-scoped accent color that lets each project carry its own voice while the page chrome stays neutral.

**Key Characteristics:**
- Dark by default, light by toggle. Both modes are first-class — neither is a degraded fallback.
- Editorial long-form: case studies are essays with images, not image galleries with captions.
- Per-project scoped accent color (Fresh Greens sage, TikTok cyan/magenta). The shell stays neutral; the case study brings the color.
- Line-based depth (1px borders, color-mix rules) instead of shadows or glass.
- Mobile is the first impression — recruiters open links on phones, then deep-dive on laptops.

**The Three-Layer Ownership Rule.** The shell owns system chrome. Reader owns paper, ink, measure, and editorial chrome. Project and evidence namespaces own project identity and evidence styling. Projects must not repaint the shell or Reader, and shared layers must not normalize project evidence.

## 2. Colors

A monochrome shell with strict tonal control, animated only by the case-study's scoped accent. Two themes, one logic.

### Primary (per case study, scoped)

The portfolio shell has no primary brand accent of its own. The primary color is assigned per case study via `--tt-accent`, `--fg-accent`, etc. scoped to the page root.

- **Fresh Greens Sage** (`#6aab7e` dark / `#3d6447` light): Wayfinding-app project accent. Quiet, organic, in-frame for routes that maximize daylight.
- **TikTok Cyan** (`#25f4ee`): One channel of the TikTok logo separation. Used for cyan/magenta drift animation on the eyebrow logo and the lineage-timeline dots.
- **TikTok Magenta** (`#fe2c55`): The other TikTok logo channel. Used in the channel-separation drift and as the Dopamine card accent.

### Neutral (dark theme, default)

- **Near Black** (`#050505`): Page background. True near-black; not warm-tinted (PRODUCT.md anti-reference: warm-minimal defaults).
- **Carbon Surface** (`#0a0a0a`): Card and elevated-region surface. One step lighter than background; used to subtly distinguish containers without shadows.
- **Soft White** (`#f4f4f4`): Primary body and display text. High-contrast against background (≥14:1).
- **Stone Muted** (`#c4c4c4`): Secondary text, captions, figure labels, project meta. Still WCAG AA at body sizes.
- **Carbon Line** (`#343434`): Hairlines, dividers, ruled separators. Never used as a colored stripe accent (see Don'ts).
- **Sky Focus** (`#8ab4ff`): Keyboard focus ring. Same in both themes for consistency.

### Neutral (light theme)

- **Bone** (`#fafafa`): Page background. Cool-neutral, not cream.
- **Paper Surface** (`#f0f0f0`): Card and elevated-region surface.
- **Ink** (`#111111`): Primary body and display text.
- **Slate Muted** (`#555555`): Secondary text. Pushed darker than the dark-theme muted to keep WCAG AA on the lighter background.
- **Bone Line** (`#d4d4d4`): Hairlines and dividers.

### Named Rules

**The Neutral Shell Rule.** The portfolio chrome (nav, footer, layout, type) uses only neutrals. Accent color is scoped to a case-study page and never leaks into shared shell components.

**The Per-Project Accent Rule.** Each case study brings its own accent color via a scoped CSS custom property on the page root (`.tt-page`, `.fg-page`). New case studies declare a new accent token; they do not reach for a shared brand color.

**The No-Warm-Default Rule.** Neither the dark nor light theme tints toward warmth-by-default. `#050505` is true near-black; `#fafafa` is cool-neutral. The 2026 cream/sand/paper aesthetic is forbidden.

**The Reader Paper Exception.** `--m97-paper` is a tightly scoped warm off-white for Reader paper and Reader-owned editorial chrome only. It represents a document opened from Myles 98, not the portfolio's light theme. It must not enter shell chrome, cards, or project evidence. Under reduced transparency it stays fully opaque; under increased contrast it retains an explicit ink divider.

**The Project Color Rule.** Project colors live on the project page root or inside the artifact they reproduce. They may color project navigation, evidence, and authored simulations. They must not recolor shared shell chrome or enter the global palette solely because one project uses them.

## 3. Typography

**Display Font:** Mona Sans (with `system-ui, sans-serif` fallback)

**Body Font:** Golos Text (with `system-ui, sans-serif` fallback)
**Mono Font:** Geist Mono (with `ui-monospace, monospace` fallback)

**Character:** Mona Sans gives display text a more particular, softly technical shape without tipping into novelty. Golos Text keeps long-form case-study copy neutral and durable. Geist Mono carries small monospace labels (figcaptions, hex values, project meta) without screaming "developer."

### Hierarchy

- **Display** (500, `clamp(2.4rem, 6vw, 4.5rem)`, line-height 0.9, letter-spacing -0.026em): Hero name on the homepage, case-study title (`h1`).
- **Headline** (500, `clamp(1.7rem, 3vw, 2.5rem)`, line-height 1.16, letter-spacing -0.02em): Section headings (`h2`) inside case studies.
- **Title** (500, `clamp(1.15rem, 2.2vw, 1.35rem)`, line-height 1.3): Pullquote text, subsection headings (`h3`).
- **Body** (400, `1rem`, line-height 1.58, letter-spacing 0.008em): Paragraph copy. Capped at ~65-75ch line length.
- **Label** (500, `0.85rem`): Inline meta strip dt labels (Role/Stack/Timeline), project tags.
- **Mono** (400, `0.78rem`, letter-spacing 0.05em): Figcaptions, palette hex values, project-meta `dt` labels, mono receipts inside case-study artifacts.

### Named Rules

**The Sentence-Case Rule.** Section labels and meta strip labels are sentence-case at body weight. Tracked-uppercase mono `eyebrow` labels (`ROLE`, `STACK`, `ANCHOR`, `FEEDBACK RECEIVED`) above every section are PRODUCT.md anti-references — they read as 2023-era SaaS marketing scaffolding. Reserve uppercase for ≤4-word brand-system kickers or `<abbr>` content, never as recurring section grammar.

**The Writing Carries the Work Rule.** Body type is sized for sustained reading, not for browsing. ~65-75ch line length, line-height 1.58, letter-spacing 0.008em. If a section's voice can't survive plain body type, it's the voice that needs work — not the typography.

**The No Numbered Eyebrow Rule.** Decorative `01 · About / 02 · Process / 03 · Pricing` numbering above sections is forbidden as system grammar. The case-study TOC carries section numbers as navigation receipts (with mnemonic value); body sections do not repeat the number above their `h2`.

## 4. Elevation

Flat by default. Depth comes from typography hierarchy, generous spacing, and 1px hairlines (`var(--line)`). The system has no shadow vocabulary; no `box-shadow` is used to elevate cards, modals, or hover states. Lightbox overlay is the one exception — it uses a `rgba(0,0,0,0.78)` backdrop to dim the page, not a shadow on the dialog frame.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Hover states use color, opacity, or transform — never shadow. Cards and containers separate via background tonal shift (`--surface` vs `--background`) or 1px line, never via drop shadow.

**The 1px Border Rule.** Hairlines are exactly 1px. The system never uses 2px or 3px colored borders as visual emphasis. Side-stripe borders (`border-left: Npx solid var(--accent)`) are absolutely banned — they are the most recognizable tell of AI-generated UI.

**The Hardware Radius Rule.** Hardware radii are approved for device hardware, screenshots, maps, and faithful reconstructions. Myles 98 and Pocket 98 chrome must stay square or low-radius. The exact `device-bezel: 34px` and `device-screen: 27px` metadata remains limited to phone outer bezels and screen apertures and must not be used as general UI radii.

**The Myles 98 System Chrome Depth Rule.** The portfolio remains flat by default outside the discovery shell. The Myles 98/Pocket 98 system, hardware, and program chrome exception is limited to discrete 1px top-left highlights, right/bottom shadow bands, recessed wells, and hard cast shadows for layered windows, menus, and authored paper objects. It must not enter Reader, case-study navigation, project evidence, generic cards, or editorial surfaces. Depth must use the named neutral edge tokens `--m97-bevel-highlight`, `--m97-bevel-light`, `--m97-bevel-shadow`, and `--m97-bevel-dark`, preserve square or low-radius geometry, flatten this depth in forced colors, and never use blur, soft filters, or gradient-based elevation.

## 5. Components

### Site Navigation

- **Style:** Minimal text-link nav. Numbered shortcut list (`01. Work`, `02. About`, `03. Play`, `04. Resume`, `05. E-mail`) at the top of the homepage entrance state; collapses into compact nav after browser-intro animation completes.
- **Typography:** Headline (500, ~1.7rem at default).
- **States:** Default `var(--foreground)`. Hover: shift to `var(--accent)` of current page scope (sage on Fresh Greens; cyan-or-magenta on TikTok via channel logo).
- **Mobile:** Same vertical list; touch targets pass 44×44.

### Project Cards (homepage Work list)

- **Corner Style:** `var(--rounded-md)` (0.7rem).
- **Background:** `var(--surface)` (one tonal step from page background).
- **Border:** None at rest; 1px `var(--line)` on hover.
- **Internal Padding:** ~1.6rem.
- **Content:** Title (headline scale) + summary line + tags + cover image. No icon-heading-body 3-up grid (PRODUCT.md anti-reference).
- **States:** Hover lifts the title color one tonal step; image scale unchanged.

### Sticky Section TOC (`ProjectToc`)

- **Style:** Bordered hairline track, sticky after the meta strip scrolls past. Active section indicator via dot + bolder text.
- **Mobile:** Collapses to a single current-section button with chevron; expands on tap.
- **State management:** IntersectionObserver tracks the active section.

### Pullquote (`tt-pullquote`, `fg-pullquote`)

- **Shape:** No card. No left-border. Centered text, max 56ch, surrounded by generous vertical margin.
- **Typography:** Display-scale restraint in Mona Sans at headline scale (`clamp(1.4rem, 2.6vw, 1.8rem)`, line-height 1.3, weight 400).
- **Caption:** Sentence-case below the quote (`Working hypothesis · TikTok DSA, 2021`). Never tracked-uppercase mono.

### Lightbox (`ExpandableImage` + `LightboxProvider`)

- **Backdrop:** `rgba(0,0,0,0.78)` at z-index 9000.
- **Frame:** Pointer-events: none except on close button; z-index 9001.
- **Close:** Click backdrop or press Escape; the frame's image is the only content-bearing element.
- **State:** Lift origin animates from the source thumbnail rect to centered viewport rect on open.

### Case-Study Section Heading (`h2`)

- **Always visible.** Sections never use `sr-only` for their primary heading — the visible h2 is part of the visual rhythm.
- **Typography:** Headline scale, sentence-case, statement-shaped ("One skeleton. Three fills.", "Where the work went."). Never just a label.

### Scoped Shape Exceptions

**The Semantic Pill Rule.** Pill geometry is approved when shape carries status, filter, chip or category, pagination, segmented-choice, or round device-control semantics. The `navi-pill: 999px` metadata remains limited to Navi route, trust, filter, and status controls. It must not be used for generic containers, CTAs, cards, or every label.

## 6. Do's and Don'ts

### Do:
- **Do** scope accent color per case study via a CSS custom property on the page root (`.tt-page`, `.fg-page`). Shell stays neutral.
- **Do** use 1px hairlines for separation. Tonal background shift (`--background` → `--surface`) for elevation.
- **Do** write section headings as statements, not labels. "One skeleton. Three fills." not "The System."
- **Do** preserve original working artifacts when the case study earns it (the TikTok grid annotations, Fresh Greens sketches). The marks of how the work was made are part of the design.
- **Do** ship real imagery (process photos, in-hand shots, grid artifacts) — not colored CSS panels where photos should go.
- **Do** test every animation under `prefers-reduced-motion: reduce`. Reduced motion is not optional.
- **Do** verify ≥4.5:1 contrast on body text in both themes. Muted gray on muted background is the most common contrast failure.
- **Do** keep shared-shell, project-namespace, and artifact-local values in their owning layer; document narrowly scoped hardware and semantic shape exceptions.

### Don't:
- **Don't** use side-stripe borders (`border-left: Npx solid var(--accent)` where N > 1). Absolute ban; the most recognizable tell of AI-generated UI. Replace with full borders, background tints, leading numbers, oversized leading glyphs, or nothing.
- **Don't** add tiny uppercase tracked eyebrows (`ABOUT`, `PROCESS`, `WORK`) above section headings. PRODUCT.md anti-reference: "SaaS-marketing landing-page tropes."
- **Don't** add numbered section markers (`01 · About`, `02 · Process`) above section headings as decorative scaffolding. Numbers earn their place only when the section IS a sequence and the order carries information.
- **Don't** use cream/sand/beige body backgrounds. PRODUCT.md anti-reference: "the 2026 AI default." The dark + light system here is deliberate; neither defaults to warm-neutral.
- **Don't** ship identical card grids (icon + heading + body × 3) as a default layout pattern. PRODUCT.md anti-reference.
- **Don't** use gradient text (`background-clip: text` with a gradient). Decorative, never meaningful.
- **Don't** use glassmorphism (decorative `backdrop-filter: blur`) as a default container style.
- **Don't** use mono font as lazy shorthand for "technical / developer." If the section isn't a literal terminal or specification, mono reads as costume.
- **Don't** redesign the shared portfolio chrome (`ProjectToc`, `project-meta`, `ProjectWorkJump`) inside a case study. If the system needs to change, change the system, not one page.
- **Don't** use aphoristic / cryptic copy ("Design at the edge", "Crafting tomorrow"). PRODUCT.md anti-reference; the voice reads like a person talking, not a brand manifesto.
- **Don't** animate decorative motion that delays content reveal. Reveals must enhance an already-visible default.
- **Don't** promote literal project colors, `device-bezel`, `device-screen`, or `navi-pill` into reusable global defaults.
