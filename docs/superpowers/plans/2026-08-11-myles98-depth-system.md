# Myles 98 depth-system implementation plan

## Goal

Increase the object depth and construction fidelity of the authored Myles 98 icon system and workstation chrome without turning the portfolio into a Windows asset replica or changing Reader/project-owned surfaces.

## Global constraints

- Preserve Myles-authored icon identities. Do not import or trace historical Microsoft/Windows icon assets.
- Use one top-left light source and discrete vector/CSS planes. New icon and chrome depth must not use blur, soft filters, generic `drop-shadow()`, gradients, raster generation, or AI-generated icon imagery. Preserve the existing desktop/boot grid texture and the layered-paper recipe note; they are not depth primitives introduced by this work.
- Keep purpose-built 16, 24, and 32 unit SVG masters. Geometry must remain integer-authored, recognizable at actual size, and contained inside its viewBox.
- Decorative depth must disappear in forced-colors mode while the face glyph remains legible.
- Chrome depth uses explicit raised and recessed 1px bands. Active titlebars remain flat blue; hierarchy comes from edges and control states.
- Preserve existing window geometry, 44px interactive targets, focus indicators, keyboard behavior, reduced-motion behavior, Pocket/Workstation boundary behavior, and current content hierarchy.
- Do not alter Reader styles, case-study prose, project-owned evidence surfaces, or the user-owned Reminders edits.
- Do not stage or delete `.playwright-mcp` logs or unrelated dirty files.
- Follow RED-GREEN-REFACTOR. Every production behavior change needs a failing regression first.

## Task 1: Rebuild the icon depth grammar

### Ownership

- `src/components/myles-97/icons.tsx`
- `src/components/__tests__/myles-98-icons.test.ts`

### Requirements

- Replace the generic translated whole-silhouette treatment with object-specific, fill-only planes for highlight, face, side/underside, and cast shadow where the tier has enough pixels.
- Keep internal folds, symbols, and product accents on the face only so depth layers never duplicate interior detail.
- Maintain independent chrome/menu/discovery drawings and all 13 existing icon identities.
- Give folder, profile, mail, and app the clearest reference-quality construction, then apply the same grammar across the remaining icons.
- Keep the simplified Navi pin and compact FAFSA recognition contracts.
- Ensure no plane reaches outside its viewBox, including mail and asymmetric objects.
- Preserve existing public props, program mappings, accessibility attributes, and current call sites.
- Verify actual-size rendering at 16, 20, 32, and 40px plus forced colors.

## Task 2: Establish raised and recessed chrome primitives

### Ownership

- `src/app/styles/myles-97.css`
- `src/app/styles/myles-98-polish.css` only if a forced-colors or shared polish rule belongs there
- one focused existing test file or a new focused `src/app/__tests__/myles-98-depth-system.test.ts`

### Requirements

- Add named bevel tokens for bright highlight, light face, shadow, and dark edge.
- Apply a consistent raised treatment to workstation windows, Start/task buttons, primary buttons, titlebar controls, and the Start menu.
- Apply a consistent recessed treatment to window content, status wells, taskbar clock, and other true inset fields.
- Pressed/open/focused task states must invert or recess their edge treatment without moving labels or shrinking hit targets.
- Retain hard cast shadows only where they express window layering; remove any redundant effect that makes edges muddy.
- High-contrast and forced-colors modes must remain legible and must not depend on decorative planes.
- Confirm the refinement does not shift window bounds, clip controls, create overflow, or affect Reader/project-owned surfaces.

## Integrated verification

- Focused icon and chrome regressions.
- Full unit suite, lint, typecheck, content validation, production build, and diff check.
- Rendered Workstation checks at 1440x900 and 1280x720.
- Rendered Pocket boundary checks at 1024x768 coarse and 390x844.
- Actual-size icon crops for 16px task/titlebar, 20px menu/Pocket, and 32px desktop shortcuts.
- Keyboard focus, pressed/open states, forced colors, overflow, console, and page-error checks.
- Run a post-build Impeccable critique and technical audit as independent assessments, including one deterministic detector run, rendered inspection, and P0-P3 disposition.

## Task 3: Mirror the scoped design-system exception

### Ownership

- `DESIGN.md`
- `.impeccable/design.json`
- `src/app/__tests__/design-system-exceptions.test.ts`

### Requirements

- Add one named **Myles 98 System Chrome Depth Rule** to the canonical Markdown and JSON design contracts.
- State that the portfolio remains flat by default outside the discovery shell.
- Limit the exception to Myles 98/Pocket 98 hardware and program chrome: discrete 1px top-left highlights, right/bottom shadow bands, recessed wells, and hard cast shadows only for layered windows, menus, and authored paper objects.
- Prohibit the exception from entering Reader, case-study navigation, project evidence, generic cards, or editorial surfaces.
- Record that depth must use named neutral edge tokens, preserve square/low-radius geometry, flatten in forced colors, and never use blur, soft filters, or gradient-based elevation.
- Keep `DESIGN.md` and `.impeccable/design.json` semantically mirrored and regression-tested.
