# Navi Research Artifacts Design

## Goal

Strengthen the Navi case study with evidence that shows how research moved into product decisions. The page should make Myles's ownership visible without implying that internal planning artifacts were usability-tested or that group booking is part of the current build.

## Confirmed facts

- Myles collected survey responses from residents and two local businesses, DubBopBro and The Niche Shop.
- He synthesized those responses with a six-platform audit, an Airbnb heuristic evaluation, and secondary research.
- He created the scenario-based archetypes, journey maps, opportunity areas, and user flows shown in the Navi FigJam board.
- The archetypes were informed by research. They were not individual participant profiles.
- The journey maps and user flows were internal planning artifacts. They were not evaluated with participants.
- Neighborhood exploration and the individual booking flow carried into the current portfolio rebuild.
- Group booking remains a future opportunity and is not wired into the current build.

## Narrative structure

The existing chronology stays intact. The survey section establishes the strongest resident signals, then a revised process section connects those signals to the planning artifacts and the two implemented priorities.

The process section will:

1. Introduce the three research-informed archetypes.
2. Show how the journey map organized actions, product needs, and opportunity areas.
3. Trace one booking path from discovery through confirmation.
4. State that these were internal planning artifacts.
5. Separate the implemented individual booking flow from the unwired group-booking opportunity.

The final validation section will no longer claim that shared planning or host onboarding is present in the rebuild. It will identify group booking as future work.

## Visual treatment

The full FigJam board will not be embedded. It is too wide and dense for a portfolio reader.

### Archetype synthesis

A compact horizontal composition will show Cain, Ororo, and Selina as scenario-based archetypes. Each entry will pair one planning need with the product area it informed. This is a synthesis view, not three matching cards. The composition should read like material pinned up during a critique.

### Journey-map excerpt

A purpose-built journey strip will preserve the original structure without reproducing every sticky note. It will include:

- Awareness, consideration, and decision stages.
- A small number of representative actions.
- Product needs tied to those actions.
- One opportunity marker for neighborhood exploration.
- A scope marker that identifies group planning as future work.

On entry, the route line may draw from left to right and reveal the stage markers in sequence. Content remains visible before JavaScript. Reduced motion displays the completed route immediately.

### Booking-flow excerpt

A simplified flow will trace a representative individual path:

`Neighborhood discovery → Activity detail → Date and time → Cost review → Confirmation`

The flow should emphasize repeated cost, timing, and activity-detail checks. It will use Navi's orange as the active route and the portfolio's neutral hairlines for alternate paths. A short one-shot path trace is allowed. No ambient loop, bounce, or autoplay carousel.

## Responsive behavior

- Desktop presents the journey and booking paths horizontally.
- Tablet preserves the sequence while allowing the artifact to occupy the wide section container.
- Mobile converts each path into a vertical sequence. It must not require horizontal scrolling to understand the process.
- Labels remain readable at normal zoom and use the existing portfolio type system.
- The artifacts work in dark and light themes with WCAG AA body-text contrast.

## Components and boundaries

- Add a focused `NaviResearchArtifacts` component under `src/components/navi.tsx` or a new `src/components/navi/` module if the component becomes easier to test separately.
- Keep content in a small typed data structure so claims can be asserted without parsing decorative SVG paths.
- Use semantic HTML for headings, lists, and captions. SVG is decorative support and must not be the sole carrier of meaning.
- Reuse the existing `.nv-*` naming and Navi page tokens. Do not change shared portfolio chrome.
- Extend the current `NaviAnimReady` progressive-enhancement pattern rather than adding another observer.

## Prose constraints

- Use "research-informed archetypes," not "validated personas."
- Use "internal planning artifacts" once, where the distinction matters.
- Name Myles's contribution directly.
- Connect neighborhood exploration to residents wanting nearby, less-touristed experiences.
- Connect booking transparency to uncertainty around cost, requirements, timing, and lesser-known vendors.
- Do not claim that the artifacts validated a solution.
- Do not claim that group booking, shared planning, or host onboarding is implemented.
- Follow Myles's writing guide and the AI-slop guard.

## Testing

- Update the Navi structure test for the revised process heading and TOC parity.
- Add claim-accuracy assertions for research-informed archetypes, internal planning, and future group booking.
- Add component tests confirming that all stages and booking steps are present as text.
- Add reduced-motion and no-JavaScript style-contract coverage.
- Run focused Navi tests, the full test suite, ESLint, TypeScript, and a production build.
- Inspect desktop and mobile layouts in both themes. Check clipping, text size, route continuity, and section spacing.

## Acceptance criteria

- A recruiter can identify Myles's research synthesis and flow ownership without opening FigJam.
- The case study shows a clear path from research to neighborhood exploration and individual booking.
- The artifacts remain legible on mobile without horizontal scrolling.
- Motion clarifies sequence and does not delay or hide content.
- Reduced-motion users receive an equally complete static artifact.
- Group booking is presented only as future work.
- No unsupported validation or implementation claim remains.

## Out of scope

- Wiring group booking.
- Embedding the full FigJam board.
- Adding new research or quantitative outcomes.
- Editing Fresh Greens while its separate worktree is active.
- Redesigning shared case-study navigation.
