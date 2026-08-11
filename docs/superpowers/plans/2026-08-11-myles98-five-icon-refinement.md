# Myles 98 Five-Icon Refinement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Use `superpowers:test-driven-development` for every master change and `superpowers:verification-before-completion` before any completion claim.

**Goal:** Improve the native-size noun, hierarchy, and late-1990s object construction of Resume, Loose Parts, Reset Desktop, Fresh Greens, and Navi while freezing the rest of the verified 48-master family.

**Architecture:** The five concepts remain standalone, hand-authored 16/24/32 SVG master families. Tasks 1–4 change disjoint SVG and focused test files so they can be reviewed independently. Task 5 is the only shared aggregation task: it updates exact semantic metadata, regenerates the canonical contact sheet, binds evidence to the new hashes, and performs the full visual/release review. Nothing in this plan changes the production `Myles97Icon` renderer or any live icon callsite.

**Tech Stack:** standalone SVG, Node.js, Sharp, Vitest, Playwright, npm, XML validation, deterministic contact-sheet generator.

## Global Constraints

- Begin from the approved scope in `docs/superpowers/specs/2026-08-11-myles98-five-icon-refinement-design.md`.
- Work only inside the five target master families until Task 5; do not redraw the locked eleven concepts.
- Use npm only. Do not run pnpm, yarn, dependency installation, or package-manager repair.
- Every master keeps the exact `0 0 16 16`, `0 0 24 24`, or `0 0 32 32` viewBox; integer geometry; `shape-rendering="crispEdges"`; opaque fills; and a one-pixel transparent perimeter.
- Use filled pixel bands, square/stepped geometry, upper-left light, and object-specific depth. Never use paths with curves, strokes, transforms, filters, masks, opacity, text, gradients, blur, rounded corners, nested SVG, or generic extrusion wrappers.
- Preserve the `data-m98-concept` and `data-m98-grid` attributes and the stable concepts `resume`, `loose-parts`, `reset-desktop`, `fresh-greens`, and `navi`.
- The pinned/stored relationship in Navi remains `pin above separate storefront`, never a shop inside a pin or an open book. TikTok remains a locked standalone shopping bag.
- Keep the current `Buss Up Shut.txt` visible-name question out of this master pass.
- Do not begin production integration until Myles approves the exact regenerated full sheet.

---

## File Structure

| File | Responsibility |
| --- | --- |
| `docs/design-assets/myles98-icons/masters/resume/resume-{16,24,32}.svg` | Profile-sheet silhouette and subordinate paperclip geometry. |
| `docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-{16,24,32}.svg` | Brand-neutral three-block volume and material planes. |
| `docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-{16,24,32}.svg` | CRT primary noun and compact restart action. |
| `docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-{16,24,32}.svg` | Solid map tile, asymmetric road, and distinct route endpoints. |
| `docs/design-assets/myles98-icons/masters/navi/navi-{16,24,32}.svg` | Pin-to-store destination relationship. |
| `scripts/__tests__/myles98-resume-reset-refinement.test.ts` | Raster/source contracts for hierarchy of the two system/personal documents. |
| `scripts/__tests__/myles98-loose-parts-refinement.test.ts` | Raster/source contracts for three-dimensional construction-block reading. |
| `scripts/__tests__/myles98-fresh-greens-refinement.test.ts` | Raster/source contracts for the Fresh Greens route-map noun. |
| `scripts/__tests__/myles98-navi-refinement.test.ts` | Raster/source contracts for the Navi pin-to-store destination relationship. |
| `docs/design-assets/myles98-icons/manifest.json` | Exact approved nouns, tiers, accepted readings, and rejected readings. |
| `scripts/lib/myles98-icon-contract.mjs` | Fail-closed approved semantic and tier metadata. |
| `scripts/__tests__/myles98-icon-contract.test.ts` | Regression proof that the revised semantic metadata cannot drift. |
| `scripts/__tests__/myles98-icon-fill-integrity.test.ts` | Exact opaque-component and enclosed-hole topology locks. |
| `docs/design-assets/myles98-icons/contact-sheet.html` | Generated, committed visual source of truth. |
| `docs/design-assets/myles98-icons/reviews/*.md` | Exact-candidate informed review reports, hashes, limitations, and findings. |

---

### Task 1: Subordinate the Resume paperclip and make Reset Desktop a restart action

**Files:**
- Modify: `docs/design-assets/myles98-icons/masters/resume/resume-16.svg`
- Modify: `docs/design-assets/myles98-icons/masters/resume/resume-24.svg`
- Modify: `docs/design-assets/myles98-icons/masters/resume/resume-32.svg`
- Modify: `docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-16.svg`
- Modify: `docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-24.svg`
- Modify: `docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-32.svg`
- Create: `scripts/__tests__/myles98-resume-reset-refinement.test.ts`

**Consumes:** The source validator and `expectedMasterPath` from `scripts/lib/myles98-icon-contract.mjs`; the `analyzeAlphaTopology` approach in `scripts/__tests__/myles98-icon-fill-integrity.test.ts`.

**Produces:** Six validated masters whose visual hierarchy is captured by dedicated native-raster tests without changing shared manifest/contract files.

- [ ] **Step 1: Write native-raster RED tests for both nouns.**

  Create a dedicated test that renders each master with Sharp at its native grid, extracts pixels by exact fill color, and asserts the intended hierarchy. Use exact helpers rather than visual snapshots:

  ```ts
  const resumeClipColors = new Set(["#164b80", "#75acd2"]);
  const resetActionColors = new Set(["#8e211e", "#8d211e", "#f15a50"]);

  expect(boundsFor(resume24, resumeClipColors)).toMatchObject({ maxY: expect.any(Number) });
  expect(boundsFor(resume24, resumeClipColors).height).toBeLessThanOrEqual(6);
  expect(boundsFor(resume32, resumeClipColors).height).toBeLessThanOrEqual(8);
  expect(boundsFor(reset16, resetActionColors).width).toBeLessThanOrEqual(8);
  expect(boundsFor(reset24, resetActionColors).width).toBeLessThanOrEqual(10);
  expect(boundsFor(reset32, resetActionColors).width).toBeLessThanOrEqual(13);
  ```

  Add source assertions that Resume 24/32 retain one paperclip opening in the top-right quadrant and that Reset contains no two full-width opposing red arrow paths.

- [ ] **Step 2: Run the new test and confirm RED.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-resume-reset-refinement.test.ts
  ```

  Expected: FAIL because the current paperclip brackets most of the page and the current red reset arrows span nearly the whole canvas.

- [ ] **Step 3: Draw the minimal tier-specific SVG revisions.**

  - Keep Resume 16 as a quiet profile sheet unless a one-pixel balance correction is necessary.
  - At 24/32, redraw the blue paperclip as a short upper-right corner cue with one internal opening. Its blue header and structured text remain the highest-contrast internal document regions.
  - Keep Reset’s CRT readable before its action cue at all three grids.
  - Replace paired, opposed arrow bars with one compact, asymmetrical stepped restart-cycle cue that orbits or returns toward the CRT without touching a canvas edge.
  - Preserve the existing exact transparent-hole contracts only if their pixels still correspond to intentional paperclip or restart anatomy; otherwise update them in Task 5.

- [ ] **Step 4: Run the focused test GREEN and validate the six files.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-resume-reset-refinement.test.ts
  npm run icons:verify -- --group personal
  npm run icons:verify -- --group system
  for file in docs/design-assets/myles98-icons/masters/resume/resume-{16,24,32}.svg docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-{16,24,32}.svg; do xmllint --noout "$file"; done
  git diff --check
  ```

  Expected: all commands pass and only the assigned masters plus the focused test are modified.

- [ ] **Step 5: Capture native evidence and commit the isolated task.**

  Render the six masters at 1× and nearest-neighbor 6× on teal, gray, and white into `/private/tmp`; inspect document/CRT primacy and no clipping. Commit only the six masters and focused test:

  ```bash
  git add docs/design-assets/myles98-icons/masters/resume docs/design-assets/myles98-icons/masters/reset-desktop scripts/__tests__/myles98-resume-reset-refinement.test.ts
  git commit -m "fix: clarify Resume and Reset Desktop icon hierarchy"
  ```

---

### Task 2: Give Loose Parts material volume without branded toy grammar

**Files:**
- Modify: `docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-16.svg`
- Modify: `docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-24.svg`
- Modify: `docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-32.svg`
- Create: `scripts/__tests__/myles98-loose-parts-refinement.test.ts`

**Consumes:** The frozen `loose-parts` noun in `manifest.json` and current no-LEGO rejected readings.

**Produces:** A one-component three-block pyramid with visible, stepped object volume at every native grid.

- [ ] **Step 1: Write a RED source/raster contract for block volume.**

  Create a focused test that proves the three tiers:

  ```ts
  const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
  expect(source).not.toMatch(/stud|lego|#(?:ff0000|ffff00|0000ff)/i);
  expect(source).toMatch(/<(?:path|polygon)\b/);
  expect(analyzeAlphaTopology(alphaFor(source, grid), grid, grid).opaqueComponents).toBe(1);
  expect(nonBackgroundFillBounds(source)).toContainEqual(expect.objectContaining({ kind: "top-or-side-plane" }));
  ```

  Implement `nonBackgroundFillBounds` in the test as a deterministic source parser: it must find at least one non-rectangular or offset face per tier, not simply an inset highlight inside a square front face.

- [ ] **Step 2: Run the test and confirm RED.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-loose-parts-refinement.test.ts
  ```

  Expected: FAIL because the current masters use three front-facing square frames and inset tonal bands rather than visibly offset construction-block planes.

- [ ] **Step 3: Redraw the three size-specific cube pyramids.**

  - Preserve exactly three generic blocks in a compact pyramid and one connected overall cluster.
  - Use a small stepped offset so each block shows a top or side plane. At 16px, favor the silhouette and one unambiguous plane over texture.
  - At 24px and 32px, give each cube a primary face, a lighter upper-left face, and a darker right/lower face that reads as volume.
  - Keep saturated colors restrained, material-like, and unrelated to any proprietary toy brand. Do not add studs, letters, logos, food cues, tables, or scattered pieces.

- [ ] **Step 4: Validate GREEN.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-loose-parts-refinement.test.ts
  npm run icons:verify -- --group personal
  xmllint --noout docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-{16,24,32}.svg
  git diff --check
  ```

  Expected: source/raster volume contract passes; all three masters retain binary alpha, a transparent perimeter, and one opaque component.

- [ ] **Step 5: Capture comparison evidence and commit.**

  Capture 1×/6× teal-gray-white comparison cards plus a monochrome alpha topology image in `/private/tmp`. Commit only the three masters and focused test:

  ```bash
  git add docs/design-assets/myles98-icons/masters/loose-parts scripts/__tests__/myles98-loose-parts-refinement.test.ts
  git commit -m "fix: give Loose Parts dimensional block geometry"
  ```

---

### Task 3: Make Fresh Greens read as a route through a place

**Files:**
- Modify: `docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-16.svg`
- Modify: `docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-24.svg`
- Modify: `docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-32.svg`
- Create: `scripts/__tests__/myles98-fresh-greens-refinement.test.ts`

**Consumes:** Existing solid-map-tile contract in `scripts/__tests__/myles98-icon-fill-integrity.test.ts` and the frozen project boundary.

**Produces:** A route-map family whose path is asymmetric, has geometrically distinct endpoints, and does not mimic a circuit trace.

- [ ] **Step 1: Add Fresh Greens RED cases to the project-refinement test.**

  Write exact source/raster assertions that distinguish the route from the square map grid:

  ```ts
  const source = sourceFor("fresh-greens", grid);
  expect(source).toMatch(/<(?:path|polygon)\b[^>]*(?:points|d)=/);
  expect(routeTurns(source)).toContain("diagonal-or-asymmetric-step");
  expect(endpointShape(source, "start")).not.toEqual(endpointShape(source, "destination"));
  expect(source).not.toMatch(/<svg[^>]*>|transform=|opacity=|filter=|stroke=/i);
  ```

  Make `routeTurns` parse only the route primitive and classify its integer run vectors. Make `endpointShape` compare its width/height/primitive tuple, so endpoint difference cannot be color-only.

- [ ] **Step 2: Run the focused Fresh test RED.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-fresh-greens-refinement.test.ts
  ```

  Expected: FAIL because the current dark route is entirely thick orthogonal U-shaped runs and its endpoint differentiation is dominated by color.

- [ ] **Step 3: Draw the revised road-map tiers.**

  - Retain the solid square road-map tile and its upper-left-lit period framing.
  - Give the route one intentional diagonal or asymmetrical stepped bend at all tiers.
  - Make start and destination distinct in shape, for example a compact square start and a pointed/flag-like destination, while retaining the project palette.
  - At 24/32, add only one low-contrast street or boundary cue. Do not introduce a folded-map silhouette, device bezel, leaf logo, grocery cue, circuitry, or maze density.

- [ ] **Step 4: Run Fresh-specific validation GREEN.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-fresh-greens-refinement.test.ts
  npm run icons:verify -- --group projects
  xmllint --noout docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-{16,24,32}.svg
  git diff --check
  ```

- [ ] **Step 5: Capture evidence and commit the isolated project change.**

  Inspect the native/6× cards beside Navi on all three review surfaces. Commit only Fresh Greens masters and its dedicated focused test.

  ```bash
  git add docs/design-assets/myles98-icons/masters/fresh-greens scripts/__tests__/myles98-fresh-greens-refinement.test.ts
  git commit -m "fix: clarify Fresh Greens route-map icon"
  ```

---

### Task 4: Tighten Navi into one destination relationship

**Files:**
- Modify: `docs/design-assets/myles98-icons/masters/navi/navi-16.svg`
- Modify: `docs/design-assets/myles98-icons/masters/navi/navi-24.svg`
- Modify: `docs/design-assets/myles98-icons/masters/navi/navi-32.svg`
- Create: `scripts/__tests__/myles98-navi-refinement.test.ts`

**Consumes:** Existing separate-pin/store topology allowance from `scripts/__tests__/myles98-icon-fill-integrity.test.ts` and the user-approved pin-above-store metaphor.

**Produces:** A focused 16px pin and coherent 24/32px destination icon with a visibly intentional pin-to-awning relationship.

- [ ] **Step 1: Add Navi RED cases without changing the icon noun.**

  Create the focused Navi test to establish exact geometry relationships:

  ```ts
  expect(orangeCenterBounds(sourceFor("navi", 24))).toEqual({ x: expect.any(Number), y: expect.any(Number), width: expect.any(Number), height: expect.any(Number) });
  expect(verticalGap(pinBounds(navi24), storefrontBounds(navi24))).toBe(1);
  expect(storefrontBounds(navi24).width).toBeGreaterThanOrEqual(14);
  expect(storefrontBounds(navi32).width).toBeGreaterThanOrEqual(22);
  expect(pinTailX(navi24)).toBeGreaterThanOrEqual(storefrontBounds(navi24).minX);
  expect(pinTailX(navi24)).toBeLessThanOrEqual(storefrontBounds(navi24).maxX);
  ```

  Keep the 16px test narrow: it must retain a filled orange center and a location-marker silhouette, but no store detail.

- [ ] **Step 2: Run the Navi-focused test RED.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-navi-refinement.test.ts
  ```

  Expected: FAIL because 24px lacks the orange center, has a wider gap, and the store does not satisfy the new width/relationship contract.

- [ ] **Step 3: Draw the tier-specific Navi revision.**

  - Preserve the 16px pin as the minimum noun and keep its orange center.
  - At 24px, restore an orange center, reduce the store gap to one pixel, widen the storefront to at least 14 grid units, and align the tail above its awning span.
  - At 32px, widen the storefront to at least 22 grid units while removing nonessential internal detail. Preserve a distinct transparent separation between pin and store, never draw the storefront inside the pin.
  - Keep the fill-integrity exceptions explicit: Navi 24/32 remain exactly two opaque components because the store is intentionally separate.

- [ ] **Step 4: Validate the new relationship GREEN.**

  Run:

  ```bash
  npm test -- scripts/__tests__/myles98-navi-refinement.test.ts
  npm run icons:verify -- --group projects
  xmllint --noout docs/design-assets/myles98-icons/masters/navi/navi-{16,24,32}.svg
  git diff --check
  ```

- [ ] **Step 5: Capture evidence and commit.**

  Inspect native/6× cards against Fresh Greens on teal, system gray, and white. Commit the three Navi masters and dedicated focused test:

  ```bash
  git add docs/design-assets/myles98-icons/masters/navi scripts/__tests__/myles98-navi-refinement.test.ts
  git commit -m "fix: connect Navi pin and storefront icon"
  ```

---

### Task 5: Rebind metadata, regenerate the canonical candidate, and run the full master-review gate

**Files:**
- Modify: `docs/design-assets/myles98-icons/manifest.json`
- Modify: `scripts/lib/myles98-icon-contract.mjs`
- Modify: `scripts/__tests__/myles98-icon-contract.test.ts`
- Modify: `scripts/__tests__/myles98-icon-fill-integrity.test.ts`
- Modify: `docs/design-assets/myles98-icons/contact-sheet.html`
- Modify: `docs/design-assets/myles98-icons/reviews/geometry-review.md`
- Modify: `docs/design-assets/myles98-icons/reviews/period-fidelity-review.md`
- Modify: `docs/design-assets/myles98-icons/reviews/family-consistency-review.md`
- Modify: `docs/design-assets/myles98-icons/reviews/loose-parts-blocks-review.md`
- Modify: `docs/superpowers/specs/2026-08-11-myles98-pixel-icon-family-design.md`

**Consumes:** The four isolated icon commits and all five focused test files.

**Produces:** One exact, deterministic 48-master candidate with new hashes, fail-closed semantics, a regenerated contact sheet, and transparent review provenance.

- [ ] **Step 1: Update the manifest and contract in RED.**

  Update exact semantics only where the new tier statement is materially different:

  ```ts
  const approvedTiers = {
    resume: { "16": "Profile sheet with blue header", "24": "Subordinate blue paperclip and two bullets", "32": "Professional profile sheet with compact paperclip and structured lines" },
    "reset-desktop": { "16": "Desktop screen with compact reset cycle", "24": "Compact red reset cycle", "32": "CRT desktop with a clear, subordinate reset cycle" },
    "fresh-greens": { "16": "Road-map tile with asymmetric route", "24": "Asymmetric route with distinct start and destination", "32": "Road-map tile with non-monotonic road, geometric endpoints, and one boundary cue" },
    navi: { "16": "Location marker", "24": "Location marker with orange center above storefront", "32": "Location marker above a widened neighborhood storefront" },
  };
  ```

  Keep loose-parts’ brand-neutral rejected readings and update its tier cue only if the new wording is necessary to state visible top/side planes. Add a mutation test for every altered object/tier/readings array, then run it RED before source updates are mirrored.

- [ ] **Step 2: Reconcile topology locks with the final exact pixels.**

  Update `INTENTIONAL_ENCLOSED_TRANSPARENCY` and `INTENTIONAL_OPAQUE_COMPONENTS` only after rasterizing the final masters. Keep Navi 24/32 at exactly two opaque components, do not permit accidental holes, and never loosen the default one-component rule. Add a regression test that mutates each allowed exception and proves the exact coordinate/component contract fails.

- [ ] **Step 3: Regenerate and verify the source of truth.**

  Run:

  ```bash
  npm run icons:verify
  npm run icons:contact-sheet
  npm test -- scripts/__tests__/myles98-icon-contract.test.ts scripts/__tests__/myles98-icon-fill-integrity.test.ts scripts/__tests__/myles98-resume-reset-refinement.test.ts scripts/__tests__/myles98-loose-parts-refinement.test.ts scripts/__tests__/myles98-fresh-greens-refinement.test.ts scripts/__tests__/myles98-navi-refinement.test.ts scripts/__tests__/myles98-icon-contact-sheet.test.ts
  npm exec vitest -- run scripts/__tests__/myles98-icon-contact-sheet.browser.test.ts
  ```

  Expected: 48 verified masters; generated HTML byte-matches a second temporary regeneration; browser test proves 144 labeled cards and 144 blind cards across teal, gray, and white with true 6× nearest-neighbor pixels.

- [ ] **Step 4: Produce exact evidence and fresh reviews.**

  - Compute and record the sorted-master aggregate SHA-256, `contact-sheet.html` SHA-256, and labeled full-page PNG SHA-256.
  - Render all five revised concepts at 1× and 6× on teal, gray, and white. Verify no clipping, partial alpha, broken assets, or visual mass regression against the locked family.
  - Run two clean-context recognition reviews using blind mode. Reviewers receive only the anonymous tier groups and required questions: intended noun, two plausible readings, brand/product implication, and cross-tier consistency. Do not label any result “blind” if the reviewer has seen filenames, source, review logs, or prior icon conclusions.
  - Run informed geometry, period-fidelity, and family-consistency reviews against the exact new hashes. Record P0–P3 counts, review limitations, and the specific Navi/Fresh/Resume/Loose/Reset decisions.
  - Update the family spec’s candidate hashes and state plainly that production integration is pending Myles’s renewed full-sheet approval.

- [ ] **Step 5: Run full repository verification and commit the candidate.**

  Run:

  ```bash
  npm test
  npm run lint
  npm exec tsc -- --noEmit
  npm run validate:content
  npm run build
  git diff --check
  git status --short
  ```

  Expected: all checks pass. Browser sandbox failure must be retried unchanged with authorized elevation before classifying it as a product issue. Preserve unrelated working-tree changes and do not commit `/private/tmp` evidence.

  Commit only the shared semantic/contact-sheet/review files:

  ```bash
  git add docs/design-assets/myles98-icons/manifest.json scripts/lib/myles98-icon-contract.mjs scripts/__tests__/myles98-icon-contract.test.ts scripts/__tests__/myles98-icon-fill-integrity.test.ts docs/design-assets/myles98-icons/contact-sheet.html docs/design-assets/myles98-icons/reviews docs/superpowers/specs/2026-08-11-myles98-pixel-icon-family-design.md
  git commit -m "docs: verify refined Myles 98 icon candidate"
  ```

---

## Plan Self-Review

### Spec coverage

- Resume hierarchy: Task 1.
- Loose Parts volume, material, and no-brand constraints: Task 2.
- Reset as restart rather than transfer: Task 1.
- Fresh Greens asymmetric route and geometric endpoints: Task 3.
- Navi pin-to-store relationship with exact 24/32 dimensions: Task 4.
- Metadata, topology, deterministic sheet, clean-context recognition, informed reviews, and renewed full-sheet approval: Task 5.
- Production integration and visible program naming are explicitly excluded.

### Placeholder scan

The plan contains no deferred or undefined interface steps. Every task names owned files, RED assertion intent, GREEN command, validation, evidence, and commit scope.

### Boundary check

Tasks 1–4 have disjoint master-file ownership. Task 5 is deliberately serialized because it owns the shared manifest, contract, contact sheet, evidence, and final review artifacts.
