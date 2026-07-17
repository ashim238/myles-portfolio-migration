# Portfolio 37 Batch One Design

## Intent

Move the portfolio from its current 32/40 audit score toward 37 by fixing the first-impression and navigation defects that do not require new case-study prose. Fresh Greens remains the flagship, so its cover receives the only project-specific composition change in this batch.

## Quality bar

This is flagship polish for a portfolio aimed at broad product-design roles. The work must preserve the existing interactive personality, project palettes, and story-bearing motion. It must also improve first paint, responsive geometry, and reviewer orientation.

## Scope

Batch One includes four changes:

1. Exact intrinsic dimensions for shared case-study lead media.
2. A responsive Fresh Greens cover treatment for the case-study page.
3. Visible-first shared entrance motion.
4. Persistent desktop TOC recognition and mobile back-to-top clearance.

Case-study chapter grouping, rewritten endings, recommended-next-project logic, About imagery, and new touch inspection cues remain outside this batch. Those changes need separate editorial or visual decisions.

## Approaches considered

### A. Semantic media variant with exact dimensions

Add exact width and height requirements to `LeadMedia`, then give Fresh Greens a named presentation variant. Keep the existing PNG and tune its crop through responsive CSS.

Benefits:

- Small migration across the three current callers.
- Correct first-paint geometry for every case-study lead image.
- Fresh Greens can have a distinct crop without changing Navi or Understanding FAFSA.
- Existing source art remains unchanged.

Cost:

- The caller must still provide verified dimensions.
- The Fresh Greens composition needs responsive screenshot checks.

### B. Static image imports

Import each cover as a static module so Next.js derives width and height automatically.

Benefits:

- Compile-time image metadata.
- Less chance of future dimension drift.

Cost:

- Changes the current content-path convention.
- Requires a broader migration across project data and components.
- Does not solve the Fresh Greens art direction by itself.

### C. Separate exported cover assets

Create dedicated desktop, mobile, and homepage images with different crops.

Benefits:

- Highest art-direction control.

Cost:

- Duplicates source assets and increases maintenance.
- Future visual changes must be re-exported several times.
- Unnecessary unless responsive CSS cannot retain the complete phone.

### Decision

Use approach A. Keep approach C as a fallback only if the responsive crop fails the visual acceptance criteria.

## Shared lead-media contract

`LeadMedia` will require `width` and `height` for every placement. It will pass those dimensions to both `next/image` and `LeadVideo`. `LeadVideo` will place them on the video element so the poster reserves the correct frame before metadata loads.

The three current callers will pass verified source dimensions:

- Fresh Greens: `2560 × 1862`
- Navi: `2048 × 1365`
- Understanding FAFSA: `4000 × 3000`

`LeadMedia` will accept a constrained presentation value. The initial values are `default` and `fresh-greens`. The value becomes a modifier class on the figure. Arbitrary caller classes will not be added.

## Fresh Greens cover composition

The source phone is centered, so changing `object-position` alone cannot correct the composition. The implementation will reduce the surrounding green field while keeping the complete device visible.

Desktop and tablet behavior:

- Frame ratio: `16 / 9`.
- Image behavior: centered cover crop inside an overflow-hidden frame.
- Background: a sampled dark green from the source asset.
- Bottom margin: `1.5rem`.
- Scale: `1.03`, which keeps the complete device visible while making it occupy roughly 85 percent of the frame height at `1024`, `1280`, and `1440` pixel viewport widths.

Mobile behavior:

- The frame returns to the source ratio, `2560 / 1862`.
- Image scale: `1.24`.
- The phone must occupy 28 to 34 percent of the frame width at a `390` pixel viewport.
- No part of the device may be clipped.
- No horizontal overflow is allowed.

The homepage work card keeps its existing `3 / 2` frame. Any homepage crop adjustment will be evaluated separately after the case-study cover passes.

## Visible-first motion

Shared structural content must remain readable from the first rendered frame. Motion will continue through position, scale, and project-specific transformations.

The implementation will update these shared structural keyframes:

- `fadeUp`
- `sectionScrollIn`
- `nv-hero-in`
- `od-card-rise`
- `od-highlight-in`
- `od-footer-in`

Rules:

- Structural keyframes start at `opacity: 1`.
- Structural text does not start blurred.
- Existing lift, scale, and easing remain unless visual testing shows jank.
- Explicit `opacity: 0` declarations paired with structural entrance motion are removed.
- Project-specific artifact animation is unchanged in this batch.
- Reduced-motion behavior remains instant or transform-free.

This keeps the page alive without making the initial experience depend on animation progress.

## Reading instrument

Desktop spine:

- The horizontal sticky TOC remains active from `1280px` through `1439px`, where its labels already stay visible.
- The vertical spine begins at `1440px`.
- The active section title remains visible in the vertical spine without hover.
- Inactive labels keep their current hover and focus behavior.
- The active label uses the existing surface, foreground, line, and project TOC accent tokens.
- Vertical-spine labels open toward the outside left gutter and must stay on-screen without covering the case-study text column at `1440` and `1600` pixel widths.
- Keyboard behavior and the live region remain unchanged.

Mobile return control:

- The back-to-top button sits above the `3.6rem` bottom navigation and safe area.
- The control remains at least `44 × 44px`.
- Its stacking level sits above the mobile navigation without exceeding modal or tooltip layers.
- The hidden and revealed focus behavior remains unchanged.

## Error handling and fallbacks

- Invalid or omitted lead-media dimensions fail at TypeScript compile time.
- If the Fresh Greens image fails, the figure retains the dark-green frame instead of exposing a light seam.
- Browsers without scroll-linked animation still receive readable content and the existing timed transform entrance.
- Reduced-motion users receive visible content without delayed opacity changes.

## Regression coverage

All behavior changes begin with failing tests.

### Lead media

- Update `lead-media.test.tsx` to require and assert exact width and height.
- Assert the semantic Fresh Greens presentation class.
- Add route-source coverage confirming all three case studies pass verified dimensions.

### Fresh Greens cover CSS

- Parse the relevant selector and media-query blocks with brace-depth helpers.
- Assert the desktop frame, cover behavior, dark backing, and scoped bottom margin.
- Assert the mobile override does not impose the desktop ratio unconditionally.

### Motion

- Add a shared motion contract test that extracts full keyframe blocks.
- Assert structural keyframes do not begin at `opacity: 0`.
- Assert `nv-hero-in` and `od-highlight-in` do not begin with blur.
- Assert project-specific artifact keyframes remain present.

### Navigation

- Assert the active desktop label has a persistent visible rule inside the wide-screen media query.
- Assert the mobile back-to-top offset accounts for the navigation height and safe area.
- Preserve current ProjectToc interaction and focus tests.

## Visual verification

Capture fresh, section-specific screenshots after implementation.

- Fresh Greens: `1440 × 900`, `1024 × 768`, and `390 × 844`.
- One additional case-study hero at desktop and mobile sizes to confirm the shared dimension contract did not alter unrelated cover composition.
- Homepage and About at desktop after the visible-first motion change.
- One long case study at `1280px` with the horizontal TOC and at `1440px` with the desktop spine active.
- One long case study at `390px` after the back-to-top control appears.
- Light and dark themes for the Fresh Greens cover and navigation controls.

Saved screenshots created before this implementation are historical references only.

## Verification commands

Run repository checks sequentially because Vitest and ESLint can touch shared temporary files.

1. Focused Vitest files for lead media, motion, ProjectToc, and Fresh Greens cover contracts.
2. Full `npm test`.
3. `npm run lint`.
4. `npm run validate:content`.
5. `git diff --check`.

The development server stays available for visual verification. A production build will run only when it will not interfere with the active preview server.

## Acceptance criteria

- All three lead-media callers use verified source dimensions.
- Fresh Greens no longer reads as a small phone floating in an oversized green field.
- The page background below the Fresh Greens cover reads as intentional section spacing.
- Structural content is readable on the first frame while entrance motion remains visible.
- The active desktop stage is recognizable without hover.
- The mobile back-to-top control clears the fixed navigation and safe area.
- Existing project-specific motion, keyboard behavior, and reduced-motion support remain intact.
- Focused and full verification pass.

## Later grill decisions

After Batch One is previewed, the next interview branch will resolve which project should follow Fresh Greens. The recommendation is Navi because it pairs the newest end-to-end build with the portfolio's strongest research and product-framing evidence. Understanding FAFSA would remain the secondary systems-and-execution proof, while TikTok would remain visual-craft proof.
