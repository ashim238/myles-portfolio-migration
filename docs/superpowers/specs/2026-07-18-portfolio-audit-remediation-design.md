# Portfolio Audit Remediation Design

**Date:** 2026-07-18
**Status:** Approved for implementation by Myles Ashitey

## Context

The portfolio has passed its broad narrative and art-direction work. The remaining work is a hardening pass against a rendered-state audit: 240 cross-browser portfolio states, every generated Navi route at 320px and 1440px, settled accessibility scans, failure-mode checks, and throttled mobile performance traces. The site should retain its current personality, case-study-specific visual systems, interactive artifacts, and motion storytelling while removing objective defects and unnecessary runtime cost.

## Goals

1. Meet the portfolio's WCAG 2.2 AA target at standard widths, 200% text zoom, and 320px reflow.
2. Make meaningful content and navigation fail visible when JavaScript or an observer fails.
3. Remove Navi breakpoint collisions, calendar clipping, hidden-focus conflicts, and semantic hierarchy defects.
4. Improve the critical image path for TikTok, Play, Navi, Fresh Greens, and Understanding FAFSA.
5. Align shared chrome with the documented token, type, motion, and navigation contracts.
6. Preserve the Batman decoder payoff, the TikTok drifting logo, Fresh Greens research interactions, and the distinct visual character of each case study.

## Non-goals

- Do not rewrite case-study prose.
- Do not flatten bespoke artifacts into one generic portfolio component style.
- Do not add new large motion systems or decorative animation layers.
- Do not change the truth claims, project roles, timelines, or artifact content.
- Do not remove original source media solely to reduce the repository size when archival intent is unclear.

## Experience design

### Responsive shell

- The fixed mobile navigation must fit at 200% text zoom without clipping labels or widening the page. Items share available width and may shrink internally.
- Mobile content clearance includes the navigation height, safe-area inset, and 2rem of breathing room.
- At mobile sizes, the homepage footer keeps only contact and copyright. The fixed taskbar owns repeated Work, About, Play, and Resume navigation.
- Mobile ends at 767px and desktop begins at 768px unless a component has a narrower, documented content breakpoint.
- About, Resume, and shared project endcards allow their grid children and headings to shrink and wrap.

### Failure-safe motion and disclosure

- Content is visible in the server-rendered/default state. A successfully initialized observer may opt elements into reveal motion.
- Reduced motion disables spatial entrance motion, infinite skeleton pulses, scale effects, and rotating chevrons while preserving readable final states.
- The mobile case-study chapter list and Fresh Greens evidence panels remain available without JavaScript. Enhanced interaction may collapse or switch them only after hydration.
- The homepage decoder reserves stable geometry for all frames. The professional statement remains first and the Batman statement remains the final payoff.

### Navi product demo

- Navi uses one exclusive navigation breakpoint. The compact/mobile header and tabbar own widths through 720px; the full header owns widths from 721px.
- The root portfolio taskbar remains suppressed inside Navi demo/system routes.
- Both system and booking calendars fit at 320px without hidden date buttons or page overflow.
- The map is either a named interactive control or fully decorative. The implementation will expose the real interactive map and its controls rather than place focusable descendants in an `aria-hidden` tree.
- Result/feed cards use correct heading levels and list semantics. Primary search content is not an `aside`.
- Ratings expose readable text to assistive technology without invalid `aria-label` usage on generic spans.

### Shared portfolio system

- Work is current on the homepage and all `/work/*` routes. Navi's desktop header also exposes route-aware current state.
- Undefined radius tokens are added at the root using documented values.
- Shell labels follow sentence case and normal tracking. Literal artifact labels retain their original product/system casing.
- Fresh Greens' serif opening quote remains an intentional variant. The named `fg-pullquote` component aligns with the documented centered, borderless pullquote contract.
- Play and Resume receive a compact shared continuation endcap rather than a full project card.

## Accessibility design

- Body and label text meet 4.5:1 contrast in both themes. This includes mobile TOC numbers, Fresh Greens palette roles, and Navi system labels.
- Horizontally scrollable evidence/code regions are named and keyboard focusable.
- Copy controls report success and failure through a live status and offer selectable text when clipboard access fails.
- Repeated avatar images are decorative when an adjacent name already identifies the person.
- The calendar uses a labelled grid with one roving Tab stop and arrow-key navigation.
- Interactive controls meet a 44px target on coarse pointers even at tablet/desktop widths.

## Performance architecture

### Images and motion

- TikTok renders a lightweight hero poster in the initial response. Blob layers load after hydration/visibility, use low priority, and pause offscreen.
- The active Navi experience hero is preloaded. Cards, results, thumbnails, and hero images receive slot-specific `sizes` values.
- Play specimen images receive accurate responsive `sizes` so a phone does not select a 3840px candidate.
- Fresh Greens keeps video deferral and uses a compressed poster asset.
- Understanding FAFSA uses display-sized/tiled assets for extreme-height captures so the browser does not decode 14,000–15,000px images as one surface.

### JavaScript and CSS

- Client routes no longer import the complete Navi detail dataset for a slug helper. Shared slugification lives in a data-free module.
- Navi feed/search render an initial 12 results and expose an explicit Load more action.
- The experience-detail Leaflet map mounts shortly before it enters view; search and neighborhood maps remain immediate.
- Repeated detail scroll measurements are throttled through `requestAnimationFrame` and skip unchanged state.
- Case-study and Navi CSS are imported from route layouts where Next's CSS rules permit it. Global CSS keeps foundations and shared chrome only.
- Instrument Serif normal is localized to Fresh Greens; the unused italic face is removed.

## Error and status behavior

- Clipboard writes use feature detection and `try/catch`, with polite live feedback for success and failure.
- Intersection observer setup uses feature detection and an immediate visible fallback.
- Lazy maps and videos reserve stable dimensions so deferred loading does not shift layout.

## Verification

- Every production behavior change follows a red-green regression-test cycle.
- Unit/style-contract tests cover breakpoint ownership, token definition, current-route matching, accessible semantics, reduced motion, and image policies.
- Browser verification covers Chromium, Firefox, and WebKit at 320, 390, 641, 720, 721, 767, 768, and 1440 where relevant.
- Additional passes cover 200% text zoom, reduced motion, JavaScript disabled, keyboard traversal, the booking modal, and the complete generated Navi route set.
- Final gates: `npm test`, `npm run lint`, `npm run validate:content`, and `npm run build`.
