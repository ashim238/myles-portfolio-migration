# Release Prep Visual Refinement Design

## Intent

Close the six visual refinements Myles approved after the portfolio closeout. This is a release-prep pass, not a redesign. It keeps the Myles 98 workstation, Pocket 98, Reader, and four project identities intact while reducing hiring-manager retrieval cost and documenting intentional design exceptions.

The existing 28/40 Impeccable critique is the pre-change baseline. Release prep adds one implementation-focused Impeccable review and one final cold-eye review after rendered verification.

## Approved refinements

### 1. Put a compact recruiter summary before dominant media

Each Reader route gets a shared, compact opening summary between the hero and dominant lead media. It exposes four facts without replacing the existing `RecruiterCut`:

- Role
- Scope
- Outcome
- Proof

The full `RecruiterCut` remains after lead media and keeps the richer timeline, tools, evidence link, and project-specific move list. The compact summary uses truthful facts already supported by route copy, project metadata, and content files. Its Proof fact links to the same evidence target as `RecruiterCut`, so the two trailheads cannot drift. It must not introduce new claims or make four projects sound like one template. UnderstandingFAFSA leads with the founder-editable Mailchimp kit here, not the observed open-rate metric.

### 2. Reveal more project identity behind Welcome

The desktop still opens with Welcome focused over Selected Work. The default Welcome window becomes narrower and shifts right enough to leave at least three project identities scannable in the first fold at 1440 by 900. It keeps the existing Selected Work action and does not turn the homepage into a conventional project grid.

At the workstation boundary, default windows must remain reachable without horizontal clipping. Persisted user window geometry remains authoritative.

### 3. Remove the redundant mobile Reader exit

Pocket Reader keeps the sticky `ReaderHeader` return action and fixed chapter control. The secondary `Selected work` breadcrumb is hidden at 767px and below so the opening gives more room to the project title and compact summary. Desktop retains both controls because their spatial cost is low and their destinations are distinct.

### 4. Make Pocket own the complete intermediate range

Pocket 98 applies at 1024px and narrower. Workstation mode begins at 1025px. The JavaScript media query and pre-hydration CSS fallback use the same exact boundary so the first paint and hydrated shell cannot disagree.

Rendered verification must include 1024 by 768 and 1025 by 768 in addition to the locked 1440 by 900 and 390 by 844 checks.

### 5. Apply only small optical corrections

Optical work stays inside existing chrome and spacing contracts:

- Use a dedicated compact UnderstandingFAFSA icon silhouette in dense 16 to 20px monochrome chrome while preserving the richer project glyph at larger sizes.
- Align the UnderstandingFAFSA composer toolbar, 44px action controls, block shelf, and preview heading to shared centerlines.
- Preserve the already-correct Reader title/back alignment and Window title/control centering. Do not add speculative negative margins or one-pixel nudges without rendered evidence.
- Preserve the 16px shell content padding, flat composer frame, and project-owned palette.

No new icon family, type system, animation language, or decorative layer is introduced.

### 6. Document intentional exceptions

`DESIGN.md` gains a clear exception register that distinguishes authored project identity from design drift:

- Project-owned colors are permitted only inside their project scope or evidence artifact.
- Device hardware, screenshots, maps, and faithful product reconstructions may use radii outside the shared shell scale.
- Pills are permitted for native status, filter, chip, pagination, and device-control semantics, not as default decorative containers.
- Myles 98 and Pocket 98 chrome uses square or low-radius geometry by contract.

The tracked `.impeccable/design.json` sidecar mirrors the same named rules and scoped token metadata. Release truth remains grounded in committed `DESIGN.md`, the sidecar, and regression coverage.

## Impeccable release gates

### Gate A: refinement review

After focused implementation tests pass, run a scoped Impeccable layout, adapt, distill, and polish review against the changed homepage and Reader openings. Fix only evidenced P0 or P1 failures and any approved P2 regression caused by this pass.

### Gate B: final cold-eye review

After the production build and rendered matrix pass, run a second Impeccable critique and technical audit with a stable comparison signature:

- Routes: home plus all four Reader case studies
- Viewports: 1440 by 900, 1024 by 768, 1025 by 768, and 390 by 844
- Surrounding themes: dark and light
- Personas: first-time hiring manager, mobile recruiter, keyboard reviewer, and low-vision reviewer
- Evidence: production build, screenshots, computed geometry, contrast, overflow, console, and interaction checks

P0 and P1 findings block release. New P2 findings are fixed only when they are comprehension, accessibility, interaction, performance, or rendering failures.

## Release-prep verification

- Focused component, route, breakpoint, and static CSS contract tests
- Full Vitest, ESLint, TypeScript, content validation, production build, performance budgets, and `git diff --check`
- Rendered dark and light evidence at 1440 by 900 and 390 by 844
- Shell-boundary evidence at 1024 by 768 and 1025 by 768
- Direct entry, homepage entry, Back and Forward, keyboard traversal, reduced motion, forced colors, and 200 percent zoom
- Updated 90-second and 10-minute hiring-manager reviews
- Branch comparison and cleanup recommendation refreshed after the integrated result is committed

## Constraints

- Do not merge `codex/myles-98-visual-refinement` wholesale. Adapt only verified patch ideas that still fit the active branch.
- Do not flatten project palettes, diagrams, artifacts, or narrative structures.
- Preserve all claim, authorship, chronology, and outcome guardrails.
- Do not use user answers as blockers for objective fixes or verification.
- Candidate-facing copy follows `MYLES-WRITING-STYLE.md`: no em dashes, semicolons, ellipses, hype, rhetorical question-and-answer scaffolding, or aphoristic closers.
- All behavior and responsive changes begin with a failing regression test.

## Acceptance criteria

- The first Reader fold exposes role, scope, outcome, and proof before dominant media on all four projects.
- Desktop Welcome leaves at least three project identities scannable without removing the authored overlap.
- Pocket is active through 1024px, workstation begins at 1025px, and first paint matches hydration.
- Mobile Reader has one dominant top exit plus the chapter control.
- UnderstandingFAFSA chrome and shared window controls are optically aligned at rendered size.
- `DESIGN.md` names the color, radius, and pill exceptions precisely.
- Both Impeccable gates complete with no open P0 or P1 findings.
- Full verification, rendered evidence, and both hiring-manager reviews pass before a push is recommended.
