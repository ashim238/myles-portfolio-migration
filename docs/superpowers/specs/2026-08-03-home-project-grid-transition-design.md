# Homepage Project Grid and Case-Study Transition Design

## Goal

Balance the four homepage projects without using size to privilege Fresh Greens, and make every project open through the same continuous card-to-case-study transition.

## Homepage layout

- Render all published projects in one equal two-column grid on desktop.
- Preserve content order as the hierarchy: Fresh Greens is `01` in the top-left, followed by UnderstandingFAFSA, Navi, and TikTok.
- Keep every cover at the existing 3:2 ratio and give every card the same caption structure, image sizing, and spacing.
- Collapse to one column below the existing mobile breakpoint.
- Remove the featured-card and closing-card branches, including the right-aligned 72% TikTok wrapper.
- Keep the working-file header, numbered indices, rules, evidence labels, hover treatment, and entrance reveal language.

## Homepage-to-case-study transition

- Treat the selected homepage cover as the shared visual object.
- On activation, place a fixed overlay frame over the source cover and lock scrolling.
- Begin navigation as soon as the overlay is mounted. Do not expand the cover to a full-screen intermediate state.
- Keep the frame at the source geometry while the destination route loads.
- Once the matching destination hero is available, animate the frame directly to that hero's exact rectangle and border radius.
- Crossfade the overlay out while the destination page fades in near the end of the geometry animation.
- Preserve the existing timeout failsafe and Escape release behavior.

## TikTok continuity

- TikTok participates in the same transition instead of bypassing it.
- The transition request carries a discriminated visual description: a normal image source or the live TikTok cover treatment.
- The TikTok overlay renders the same animated cover component used by the homepage and case-study hero, avoiding a flash to the old static image.

## Accessibility and responsive behavior

- Modified-click navigation continues to use normal link behavior.
- Reduced-motion mode skips geometry movement and follows the link normally.
- Keyboard activation remains native through the project link.
- Touch and mobile layouts use the same one-column ordering.
- The overlay remains decorative and hidden from assistive technology.

## Verification

- Component tests prove all four projects render in one ordered grid with no featured or closing wrappers.
- Card tests prove TikTok dispatches a transition request with the live-cover visual instead of bypassing the transition.
- Transition tests prove image and TikTok visuals render in the overlay and navigation begins before the destination morph.
- Focused tests, the full test suite, lint, content validation, TypeScript, and the production build run before completion.
- Desktop and mobile screenshots verify balance, reading order, and destination landing geometry.

## Out of scope

- Reordering project content.
- Changing case-study hero art direction.
- Rewriting project summaries or evidence labels.
- Changing the site-wide typography, color palette, or navigation.
