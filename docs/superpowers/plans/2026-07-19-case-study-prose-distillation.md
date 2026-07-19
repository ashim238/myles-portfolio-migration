# Case-study prose distillation implementation plan

**Goal:** Make three localized case-study passages faster to read while preserving Myles's voice, process chapters, and evidence.

**Spec:** [`docs/superpowers/specs/2026-07-19-case-study-prose-distillation-design.md`](../specs/2026-07-19-case-study-prose-distillation-design.md)

## Task 1: Lock the editorial contract in tests

- Update exact chapter-title expectations across the shared chapter map and route-specific tests.
- Add assertions for the facts that the shortened passages must retain.
- Add source-level guards against the duplicated setup being removed.
- Run the focused suite and confirm it fails for the intended missing copy or title.

## Task 2: Distill Fresh Greens Refine

- Tighten type, tools, token, and reserved-color prose around the existing artifacts.
- Preserve all named tools, design iterations, accessibility facts, and evidence boundaries.
- Update the Refine title only if the plainer title survives the voice review.

## Task 3: Distill Navi Frame and Define

- Consolidate the early routing premise and heatmap caveat.
- Reduce the Define setup while retaining ownership, provenance, and the internal-planning boundary.
- Give the Define chapter a specific process-led title.

## Task 4: Distill UnderstandingFAFSA Research, Build, and Measure

- Keep the five-item audit list and compress its setup.
- Reduce the Figma-to-Mailchimp implementation story without losing concrete actions.
- Split the measured result from its attribution caveat.

## Task 5: Verify and review

- Run focused tests, AI-slop and punctuation scans, lint, TypeScript, content validation, and the full suite.
- Inspect the changed routes at desktop and mobile widths.
- Review the final diff for claim drift, title consistency, and accidental edits outside scope.
