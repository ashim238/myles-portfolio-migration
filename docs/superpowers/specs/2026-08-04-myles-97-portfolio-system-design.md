# Myles 97 Portfolio System Design

**Date:** 2026-08-04

**Status:** Approved concept, ready for implementation planning

**Primary surfaces:** Homepage, global navigation, project entry transitions, case-study reader shell, mobile navigation

**Design artifacts:** `.superpowers/brainstorm/84175-1785881739/content/` (local, ignored visual-companion files)

## 1. Goal

Turn the portfolio into **Myles 97**, a fictional late-1990s personal workstation that makes discovery playful while protecting the readability and credibility of the existing case studies.

The new system should leave visitors with a clear memory: Myles can move between design, code, systems thinking, and creative work without treating them as separate identities. The operating-system metaphor supplies a coherent world and motion language. It must not become a skin that slows down access to the work.

The approved homepage line is:

> Design, code, whatever you need.

Supporting context remains direct:

> Previously TikTok and UMG. Latest project: Fresh Greens.

## 2. Experience model

The portfolio has two deliberate modes.

### 2.1 Workstation Mode

The homepage is the complete Myles 97 environment. Visitors discover projects as purpose-built programs, use the Start menu to reach secondary surfaces, and see a curated desktop that gradually reflects what they have opened.

Visual-theme intensity: **100% Myles 97**.

### 2.2 Reader Mode

Case studies preserve the operating system's navigation and state model while allowing the project content to take over. The title bar becomes a slim project header, the taskbar becomes chapter navigation, and the project-specific color and imagery replace most of the gray interface chrome.

Visual-theme intensity: **approximately 25% Myles 97 / 75% project identity**.

### 2.3 Pocket 97

Mobile is a single-app adaptation of the same system. It does not simulate draggable desktop windows. Programs occupy the full phone, open apps form a vertical stack, and Reader Mode follows established mobile-reading conventions.

## 3. Core principles

1. **Behavior creates the theme.** Opening, maximizing, minimizing, switching, restoring, and inspecting are the identity. Retro decoration alone is insufficient.
2. **Projects are programs, not folders.** Each project receives an application identity derived from what was actually designed or built.
3. **Discovery can be playful. Reading must be calm.** Workstation Mode earns attention. Reader Mode sustains comprehension.
4. **The system remembers.** Returning from a case study restores the desktop state rather than resetting the visitor's context.
5. **Every visible control works.** No decorative menus, fake buttons, or disabled UI presented as interactive.
6. **Evidence stays scoped.** The interface distinguishes built, shipped, observed, proposed, and still-unproven claims.
7. **Retro conventions never outrank accessibility.** Single-click navigation, large targets, keyboard support, reduced motion, and semantic structure remain first-class.

## 4. Visual identity

### 4.1 Inspiration boundary

Myles 97 draws from late-1990s desktop interface conventions without reproducing Microsoft trademarks, logos, sounds, exact icons, or proprietary artwork.

Allowed references:

- Teal desktop fields
- Beveled system controls
- Blue active title bars
- Taskbar, Start menu, status bars, properties panels, and application windows
- Compact system typography
- Pixel-resolving boot motion

Custom identity:

- The existing portrait mark of Myles with locs is the boot mark and Start icon.
- Project icons, menus, and application names are original.
- The palette uses classic teal, cobalt, yellow, black, and project-scoped accents without copying a Windows palette byte-for-byte.
- The name is **Myles 97**, not Windows 97.

### 4.2 Typography

**System chrome:** `Tahoma, Verdana, Geneva, sans-serif`

- Used for title bars, menus, taskbar controls, buttons, labels, properties, project titles, and Reader Mode headings.
- Tahoma is preferred when installed. Verdana and Geneva provide licensing-safe, era-appropriate fallbacks.
- UI type must not fall below 12 CSS pixels on desktop or mobile except for nonessential metadata that remains at least 10 pixels with adequate contrast.

**Case-study prose:** `Georgia, "Times New Roman", serif`

- Used for sustained body reading, long captions, quotations, and evidence explanations.
- Desktop body target: 17–18 CSS pixels, 1.65–1.75 line height, 62–72ch measure.
- Mobile body target: 16–17 CSS pixels, 1.62–1.72 line height.

The system font and reading font must remain visibly distinct. Pixel or bitmap fonts are prohibited for body copy.

### 4.3 Color roles

- **Desktop teal (`#087f86`):** primary Workstation Mode field
- **Chrome gray (`#c7c7c7`):** windows, controls, taskbar, and system panels
- **Active cobalt (`#263cb8`):** focused title bars and active application states
- **Boot yellow (`#ffe52f`):** portrait-mark tile, selected controls, and a small number of high-signal accents
- **Near-black (`#111111`):** boot screen, Reader Mode system header, and high-contrast states
- **Reader paper (`#f5f3ea`) and ink (`#171717`):** long-form reading surface
- **Project accents:** remain scoped to individual project programs and Reader Mode pages

These approved working tokens produce strong baseline contrast for their intended text pairings: white on teal 4.78:1, white on cobalt 8.67:1, near-black on yellow 14.84:1, near-black on chrome 11.17:1, and ink on paper 16.13:1. Final implementation still verifies rendered states, disabled controls, focus rings, and project-accent combinations.

Color hierarchy follows a field/chrome/signal model. Teal or Reader paper owns the largest area, gray chrome organizes the interface, cobalt identifies active application state, and yellow is reserved for identity or decisive action. Yellow should occupy less than roughly 8% of a typical screen. A project accent replaces, rather than competes with, yellow inside project-specific content. Avoid simultaneous high-chroma accents that make every element appear selected.

The existing light/dark theme preference moves into a functional **Display Properties** surface. High contrast and reduced motion remain available independently of the chosen visual theme.

Display Properties reuses the existing `theme` preference as its source of truth. If the preference schema changes, migrate it once rather than keeping a second theme key that can drift out of sync with the current boot script.

### 4.4 Hierarchy, spacing, and leading

The retro interface may be visually dense, but it must not be cramped.

**Hierarchy rules:**

- One window or program is visually primary at a time.
- Active title bars, taskbar states, and program focus must agree.
- Homepage hero copy stays subordinate to the Selected Work action after the first orientation moment.
- Window menus and metadata never compete with the project title or cover.
- Reader Mode has one dominant heading per viewport region and no decorative system label above every section.
- Project color accents identify context. Yellow remains a system-level emphasis and does not compete with project accents.

**Spacing system:**

- Use an 8-pixel macro grid for page, window, section, and program layout.
- Use a 4-pixel micro grid for title bars, menu rows, property cells, status bars, and icon-label relationships.
- Page and Reader Mode spacing may use fluid `clamp()` values that resolve to the 8-pixel rhythm at representative widths.
- Beveled 2–4 pixel visual controls may sit inside larger invisible hit areas. Historical appearance never reduces the functional target below the accessibility contract.
- Window content padding targets 16–24 pixels on desktop and 16–20 pixels on mobile.
- Reader Mode paragraphs maintain at least 0.9em separation. Major sections use visibly larger intervals rather than a uniform spacing reflex.

**Leading rules:**

- System UI: 1.2–1.35 line height depending on size and density.
- Reader Mode Georgia prose: 1.65–1.75 desktop and 1.62–1.72 mobile.
- Reader Mode headings: 0.95–1.15 depending on scale, with rendered collision checks for ascenders, descenders, and wrapping.
- Labels and buttons must remain vertically optically centered after fallback fonts load.

Geometry verification must measure padding, visible gaps, and optical alignment in rendered screenshots. Source token values alone are not proof of balance.

### 4.5 Open-source resource policy

Implementation may use open-source icon sets, CSS references, interaction utilities, and other resources when they materially improve authenticity or reliability.

Requirements:

- Accept only resources with a verified permissive license suitable for production use, such as MIT, Apache-2.0, BSD, OFL, or CC0.
- Verify the current upstream repository, package version, license, and maintenance status before adoption.
- Record every adopted resource, version or commit, source URL, license, local modifications, and attribution requirement in `THIRD_PARTY_NOTICES.md` or the repository's existing equivalent.
- Do not hotlink production UI assets from third-party sites.
- Sanitize and vendor SVG assets when they are copied into the repository.
- Do not use Microsoft logos, startup sounds, proprietary icons, copyrighted wallpaper, or extracted Windows assets.
- Use libraries as infrastructure, not as the final art direction. Project-program icons, the portrait-mark boot sequence, and identity-bearing surfaces should remain custom.
- Avoid adding a dependency when a small, accessible component is clearer and cheaper to own locally.

Candidate libraries and icon sets remain implementation decisions until their live repositories and licenses are verified.

## 5. Boot sequence

### 5.1 Sequence

1. Near-black screen appears.
2. The existing portrait mark resolves from coarse pixels into its clean vector form.
3. `Myles 97` appears below the mark.
4. A short progress bar labeled `Loading selected work...` completes.
5. The desktop becomes visible, and the portrait mark continues as the Start-button icon.

### 5.2 Timing and control

- Maximum total duration: **1.5 seconds**.
- Play automatically only on the first eligible visit.
- Store the completed flag locally with a versioned key so major future boot changes can intentionally replay once.
- Any pointer action or key press skips immediately to the desktop.
- `prefers-reduced-motion: reduce` bypasses the animation entirely.
- Returning from a case study never replays the boot sequence.
- No startup sound in the initial implementation.

The desktop content exists in the document from the first render. The boot layer is a removable presentation layer, not a loading dependency.

## 6. Curated hybrid desktop

### 6.1 Initial state

The first desktop is clean and deliberately arranged.

Visible at first load:

- Portrait-mark Start button
- `Selected Work`
- `About Myles`
- `Loose Parts`
- `Résumé`
- Welcome window with the approved hero line
- Selected Work Explorer open behind the focused Welcome window on a clean first visit
- Real system clock
- One rotating or session-selected personal signal, such as a current design note or artifact

Personal folders such as comics, hikes, and food notes live inside Start or Loose Parts rather than crowding the initial desktop.

### 6.2 Accumulation

The desktop becomes lived-in through use.

- Opening a project adds it to the taskbar and recent-program list.
- Open windows retain their last non-mobile position and stacking order.
- A minimized program remains in the taskbar.
- Closing a program removes it from the active taskbar but not from Recent Projects.
- Returning from Reader Mode restores the exact application, position, taskbar, and desktop-scroll state from before navigation.
- The system remembers only portfolio-interface state. It does not collect personal visitor data.

### 6.3 Persistence

Use a versioned client-side state object.

```ts
type WorkstationState = {
  version: number;
  bootCompleted: boolean;
  openPrograms: Array<ProgramId>;
  minimizedPrograms: Array<ProgramId>;
  focusedProgram: ProgramId | null;
  recentPrograms: Array<ProgramId>;
  windowGeometry: Partial<Record<ProgramId, WindowGeometry>>;
  desktopScrollY: number;
  displayPreferences: DisplayPreferences;
};
```

Persistence rules:

- Local storage holds display preferences, boot completion, and recent programs.
- Session storage holds volatile window geometry, focus order, and return-transition state.
- State keys include a schema version.
- The existing `theme` key remains canonical for light/dark preference until an explicit, tested migration replaces it.
- Invalid, stale, or unparseable state falls back to the clean initial desktop without blocking rendering.
- A `Reset desktop` control is available in Display Properties.

## 7. Application model

Each published project maps to one original program definition.

### 7.1 Fresh Greens

**Program name:** `Fresh Greens.exe`

**Application type:** Route-planning software

**Primary status:** Working prototype
**Properties include:** React Native build, 26+ screens, six interviews, remaining route-quality testing

### 7.2 Understanding FAFSA

**Program name:** `FAFSA Mail.app`

**Application type:** Modular mail composer

**Primary status:** Observed result
**Properties include:** modular system, non-designer operation, 52.6% observed open rate, first redesigned send boundary

### 7.3 Navi

**Program name:** `Navi Places.exe`

**Application type:** Place-discovery and booking application

**Primary status:** Live reconstruction
**Properties include:** component system, working booking flow, playable case-study reconstruction

### 7.4 TikTok Dynamic Showcase Ads

**Program name:** `TikTok Catalog.studio`

**Application type:** Catalog-template studio

**Primary status:** Shipped template
**Properties include:** launch-library inclusion, Light Academia, later American Eagle selection confirmation

### 7.5 Program definition contract

Program identities live in structured data rather than conditionals spread across UI components.

```ts
type PortfolioProgram = {
  id: ProgramId;
  projectSlug?: string;
  displayName: string;
  fileName: string;
  applicationType: string;
  icon: ProgramIcon;
  accent: string;
  cover: ProgramVisual;
  primaryStatus: EvidenceStatus;
  properties: Array<EvidenceProperty>;
  menuItems: Array<ProgramAction>;
};
```

The application registry may also include non-project programs such as About, Loose Parts, Résumé, Display Properties, and E-mail.

## 8. Evidence properties

Properties panels expose a consistent evidence vocabulary:

- **Built:** implemented behavior or artifact
- **Shipped:** released into a real environment
- **Observed:** result supported by a named source or measurement
- **Proposed:** intended future behavior or safeguard
- **Still needs proof:** unresolved validation or outcome question

Rules:

- Do not infer a status from project category.
- Populate status from existing verified case-study content.
- Every observed metric retains its qualifying boundary.
- Properties are summaries, not replacements for the supporting case-study section.
- `Evidence` menu actions scroll or deep-link to the supporting Reader Mode section.

## 9. Homepage anatomy

### 9.1 Desktop hierarchy

1. Portrait-mark Start button and system taskbar
2. Welcome window with name, approved line, credentials, and primary work action
3. Selected Work Explorer with four project programs
4. Clean desktop icons for secondary surfaces
5. One personal note or artifact
6. Real clock and active-program state

The homepage must make the four projects visible or reachable in one obvious action. Window movement is optional exploration, never a prerequisite for access.

### 9.2 Start menu

Required entries:

- Selected Work
- About Myles
- Loose Parts
- Résumé
- E-mail
- Display Properties
- Reset desktop

Personal folders such as comics, hikes, and food notes are deferred. The first implementation includes the Loose Parts container and existing Play content without inventing new personal material.

### 9.3 Loose Parts

Loose Parts replaces the generic Play-page framing with a native program containing experiments, interface studies, code sketches, personal collections, and unfinished artifacts.

The initial implementation reuses the existing Play content inside the Loose Parts program. Its content model allows later additions without changing the desktop architecture.

## 10. Window behavior

### 10.1 Supported actions

- Open
- Focus
- Move on desktop
- Minimize
- Restore
- Close
- Maximize into a project case study

Window resize is omitted from the initial implementation. Responsive layout and maximize behavior provide the required content access.

### 10.2 Interaction rules

- Single click or tap opens programs. Double-click is optional as an accelerator, never required.
- Active title bars and taskbar buttons communicate focus.
- Windows remain inside safe viewport bounds after resize or orientation change.
- A window cannot be moved so far offscreen that its title bar becomes unreachable.
- Keyboard controls provide equivalent actions through menus and shortcuts.
- Escape closes transient menus, not application windows.
- Close and destructive reset actions require distinct controls.

### 10.3 Layering

Use a small managed window-stack index, not arbitrary CSS z-index escalation. The state manager determines focus order and maps it into a bounded visual scale.

## 11. Workstation-to-Reader transition

### 11.1 Activation

The visitor selects `Maximize into case study`, a project cover, or the equivalent keyboard action.

### 11.2 Transformation

1. Capture the active program window rectangle, project-cover rectangle, and visible UI state.
2. Mount the existing fixed transition overlay using a structured program-window visual, not a rasterized DOM screenshot.
3. Lock document scrolling without shifting layout.
4. Begin route navigation immediately after the overlay mounts.
5. Expand the window toward the destination viewport.
6. Morph the project cover into the existing destination hero marker.
7. Convert the title bar into the minimal Reader Mode header.
8. Convert the taskbar into chapter navigation.
9. Fade nonessential gray chrome while project identity takes over.
10. Release the overlay only after destination geometry is stable.

This extends the existing `ProjectEnterVisual` discriminated union with a program-window variant and preserves the existing `data-project-enter-cover` destination contract. The variant carries a project/program identifier plus the minimum visual state required to render the title bar, cover, and active chrome. It does not serialize arbitrary DOM.

### 11.3 Return behavior

- Reader Mode exposes a persistent `Desktop` return control.
- Returning through the Reader Mode `Desktop` control uses the reverse geometry handoff when the source program and saved geometry are available.
- If source geometry is unavailable, the system uses a short crossfade and still restores the saved workstation state.
- The destination program restores focused and at its saved geometry.
- Taskbar and recent-program state remain intact.
- Browser Back behaves consistently with the visible return control.

### 11.4 Failure and reduced-motion behavior

- A timeout releases scroll lock and renders the destination normally if geometry never settles.
- Escape cancels a pre-navigation transition when safe.
- Reduced motion skips geometry movement and uses a short crossfade or immediate route change.
- Direct project URLs open in Reader Mode without manufacturing a fake desktop transition.

## 12. Reader Mode

### 12.1 Persistent system elements

- Slim project title bar
- Project icon and title
- Return-to-desktop control
- Reading progress
- Chapter navigation derived from the taskbar
- Project switcher or next-project action at the end

Reader Mode wraps the existing `ProjectToc` behavior and section targets rather than introducing a second chapter model. The visual treatment changes, but current anchors, keyboard behavior, and case-study semantics remain stable.

### 12.2 Elements that recede

- Beveled window frame around the complete article
- Gray desktop background
- File menus that do not serve the reading task
- Small system typography in article content
- Overlapping windows around long-form prose

### 12.3 Evidence windows

The initial Reader Mode retains existing lightbox and interactive-artifact behavior rather than wrapping every artifact in new system windows. Evidence properties open from the project program and deep-link to the supporting case-study section. The case-study body remains a normal semantic document.

### 12.4 Existing content preservation

Initial implementation does not rewrite case-study prose or restructure evidence. It changes the shell, typography, navigation, project-entry sequence, and artifact presentation around the existing content.

## 13. Pocket 97

### 13.1 Mobile homepage

- Full-width, vertically stacked program cards
- Portrait mark, name, and approved line at the top
- Clean initial stack with one personal note or artifact
- Open programs accumulate in the stack and app switcher
- Bottom dock provides Start, Work, Loose Parts, and Open Apps
- Project cards remain immediately reachable without dragging or horizontal desktop panning

### 13.2 Mobile program view

- A selected program occupies the full viewport above the dock
- Project cover, status, and properties read as a compact application
- `Maximize into case study` is the clear primary action
- Menus collapse into an accessible overflow control

### 13.3 Mobile Reader Mode

- Sticky system header with Work/Desktop return, current chapter, and progress
- Georgia prose at mobile reading size
- Tahoma system controls and headings
- Bottom chapter controls remain thumb-reachable
- No draggable, overlapping, or resizable windows

### 13.4 Breakpoint principle

The switch from Workstation to Pocket behavior is capability-led. Coarse pointer, viewport width, and available space determine interaction behavior. CSS layout remains responsive across intermediate widths.

## 14. Accessibility

### 14.1 Semantics

- Desktop and window visuals do not replace document landmarks.
- Project programs remain links or buttons with accurate accessible names.
- Window titles map to headings or dialog labels as appropriate.
- Reader Mode retains a single logical `h1` and a valid heading hierarchy.
- Taskbar and Start menu use navigation/menu semantics only where behavior matches those patterns.

### 14.2 Keyboard

- All programs and controls are reachable in a predictable order.
- Enter and Space activate buttons.
- Escape closes menus, popovers, and dialogs.
- Arrow-key navigation is used only inside components that advertise it.
- Focus returns to the originating control after closing a transient surface.
- Visible focus indicators meet WCAG 2.2 contrast requirements in every theme.

### 14.3 Motion

- Every animation has a reduced-motion outcome with the same final information state.
- Boot, window movement, and route morphs are presentation enhancements.
- No content begins permanently hidden while waiting for JavaScript or an animation callback.

### 14.4 Pointer and touch

- Minimum target size: 44 by 44 CSS pixels for mobile controls.
- Desktop title-bar controls remain at least 32 by 32 CSS pixels unless the containing title bar provides a larger combined target.
- Dragging is optional. Every drag result has a non-drag alternative.

### 14.5 Contrast and zoom

- Validate all chrome, inactive states, focus rings, project accents, Georgia prose, and high-contrast mode against WCAG 2.2 AA.
- Reader Mode remains usable at 200% browser zoom and with large text.
- Classic gray is adjusted where historically accurate colors would fail modern contrast.

## 15. Performance and loading

- The homepage shell renders server-side where practical.
- Window management and persistence hydrate progressively.
- Initial page access does not wait for boot animation assets or noncritical project imagery.
- Project covers retain Next.js image optimization.
- Heavy project media remain lazy-loaded outside the initial viewport.
- Avoid a large window-management dependency unless native pointer handling proves insufficient.
- Fonts use system stacks, avoiding new font downloads.

## 16. Error and edge states

System dialogs are allowed when they contain a real explanation and recovery action.

Required states:

- Invalid persisted desktop state → reset silently to the clean desktop
- Project metadata unavailable → open Selected Work with a clear fallback message
- Project image failure → retain project title, status, and open action
- Transition timeout → release locks and complete navigation normally
- Unknown route → themed 404 with Home/Desktop and Selected Work actions
- Empty Loose Parts → explain what will live there and route back to Work

Avoid joke errors that obscure recovery or make the site appear broken.

## 17. Component architecture

Suggested boundaries:

- `Myles97Shell` — global workstation frame and persistence bootstrap
- `BootSequence` — first-visit presentation layer
- `WorkstationDesktop` — desktop field, icons, and initial layout
- `StartMenu` — primary navigation and utilities
- `Taskbar` — open programs, focus, clock, and minimized state
- `WindowManager` — focus order, geometry, move/minimize/close actions
- `ProgramWindow` — shared accessible window frame
- `ProgramRegistry` — typed application and project definitions
- `SelectedWorkExplorer` — primary project discovery program
- `ProjectProperties` — evidence-status summary
- `LoosePartsProgram` — experimental and personal artifact surface
- `DisplayProperties` — theme, high contrast, reduced motion, and reset
- `ReaderShell` — minimal project header and chapter-taskbar transformation
- `Pocket97Shell` — mobile single-app navigation model
- `Myles97Transition` — program-window to case-study morph built on the existing transition utility

Window-management state stays independent from project content. Project definitions stay independent from rendering components.

On the homepage, `Myles97Shell` replaces the current `SiteNav` presentation with the taskbar and Start menu. Direct About, Play, Résumé, and case-study routes retain a minimal navigation fallback until they are rendered inside Reader Mode or a purpose-built program, so no route becomes dependent on first visiting the desktop.

## 18. URL and navigation behavior

- Homepage URLs remain `/` and existing anchor-compatible routes where practical.
- Existing public case-study URLs do not change.
- Direct case-study links render Reader Mode immediately.
- Browser Back and Forward restore meaningful page and workstation states.
- Application state is not encoded into public URLs unless a surface needs a stable, shareable deep link.
- Existing About, Play, and Résumé URLs remain canonical public routes. Workstation programs may preview or frame them, but direct and modified-click navigation continues to resolve to those existing routes.
- Modified clicks on project links preserve normal browser behavior and skip custom same-tab transition state.

## 19. Testing and verification

### 19.1 Unit and component tests

- Program registry maps every published project exactly once.
- Evidence states render with verified labels and qualifiers.
- Window reducer handles open, focus, move, minimize, restore, close, and reset.
- Invalid persisted state falls back safely.
- Boot eligibility respects first visit, skip input, and reduced motion.
- Pocket 97 replaces draggable desktop behavior at the mobile contract.

### 19.2 Transition tests

- Program-window overlay mounts before navigation.
- Cover marker geometry reaches the destination hero.
- Reader title bar and chapter navigation replace the relevant chrome.
- Timeout, Escape, route failure, and reduced-motion cleanup always release scroll and temporary layers.
- Return navigation restores the prior workstation state.

### 19.3 Browser verification

Validate at minimum:

- Desktop: 1440×900 and 1280×720
- Tablet/intermediate: 1024×768 and 768×1024
- Mobile: 390×844 and 320×568
- Dark, classic, and high-contrast display modes
- Fine pointer, coarse pointer, keyboard only, and reduced motion
- Direct project entry and homepage-origin project entry
- Refresh in Workstation Mode and Reader Mode
- Back/Forward restoration
- 200% zoom and large-text behavior

For each representative viewport, capture and compare rendered geometry for:

- Outer page padding
- Window-content padding
- Title-bar text and control alignment
- Icon-to-label spacing
- Paragraph measure and leading
- Heading wrapping and collision clearance
- Distance between primary, secondary, and tertiary hierarchy levels
- Sticky Reader Mode chrome against the visible content region

Critical hierarchy or spacing claims require rendered evidence, not only CSS-token inspection.

### 19.4 Visual-quality review gates

Before release, run independent review passes for:

1. **Design direction:** hierarchy, theme coherence, project differentiation, color strategy, and whether the interface feels authored rather than generically retro.
2. **Typography and geometry:** fallback-font behavior, line height, padding, optical centering, wrapping, and responsive rhythm.
3. **Accessibility and motion:** contrast, focus, keyboard order, touch targets, reduced motion, zoom, and screen-reader semantics.
4. **Interaction integrity:** window state, Back/Forward restoration, direct links, failed transitions, and Pocket 97 behavior.
5. **Code quality:** state boundaries, cancellation, cleanup, dependency weight, and maintainability.

Use separate reviewers or subagents when available so the final judgment is not anchored by the implementation context. Every finding must include rendered or source evidence and a severity. P0 and P1 findings block release.

### 19.5 Content and release checks

- Existing content validation remains green.
- Full test suite, lint, TypeScript, production build, and `git diff --check` pass.
- Case-study selectable text and public metadata remain intact.
- Production verification confirms the branded domain renders the Myles 97 shell, Reader Mode, and Pocket 97 without stale assets.

## 20. Implementation sequence

The implementation plan should divide work into verifiable vertical slices:

1. Tokens, system typography, registry, and static shell
2. Desktop discovery, Start menu, and project programs
3. Window state, persistence, and desktop restoration
4. Boot sequence and display preferences
5. Workstation-to-Reader transition
6. Reader Mode shell across all case studies
7. Pocket 97 mobile system
8. Loose Parts migration and themed edge states
9. Accessibility, responsive, performance, and release verification

Each slice must leave existing public routes usable. Do not hold the complete portfolio behind an unfinished all-at-once rewrite.

## 21. Non-goals

- Rewriting case-study prose during the shell redesign
- Recreating Windows 95 or Windows 98 exactly
- Using Microsoft logos, sounds, icons, or copyrighted UI assets
- Building a general-purpose desktop operating system
- Requiring window dragging or double-clicking
- Keeping full retro chrome around long-form case-study prose
- Adding sound in the initial release
- Adding accounts, cloud persistence, or cross-device workstation state
- Turning every image or paragraph into a window
- Replacing project-specific identities with one uniform retro skin

## 22. Approved decisions

- Theme: fictional **Myles 97** workstation
- Logo interpretation: existing portrait mark of Myles with locs
- Homepage density: curated hybrid
- Homepage line: `Design, code, whatever you need.`
- Desktop behavior: clean first state that accumulates opened programs
- Project identity: purpose-built applications
- Case studies: Reader Mode with lighter OS influence
- Case-study type: Tahoma-led system stack plus Georgia prose
- Transition: program window maximizes into case study
- Mobile: Pocket 97 single-app model
- Boot: portrait mark, first eligible visit only, skippable, no sound
- Evidence model: built, shipped, observed, proposed, and still needs proof

## 23. Acceptance statement

The design is ready for implementation planning when the user confirms this document accurately captures the approved visual-companion direction and system boundaries.
