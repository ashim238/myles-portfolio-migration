# Myles 98 Pixel Icon Family Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce, validate, and review 48 original Myles 98 SVG pixel-icon masters before any production integration.

**Architecture:** This plan is the design-master phase only. Raw SVG masters, their manifest, validators, contact sheet, and review records live under `docs/design-assets/myles98-icons/` and `scripts/`; production `Myles97Icon` code remains unchanged until Myles approves the complete contact sheet. Three independently owned icon batches can be drawn in parallel after the shared manifest and validator land.

**Tech Stack:** Raw SVG, Node.js 24, Vitest, Playwright, HTML contact sheet, existing npm toolchain.

## Global Constraints

- Create independent `16`, `24`, and `32`-unit masters for every concept; never scale one master into another.
- Treat 16-unit icons as one primary noun, 24-unit icons as noun plus one defining cue, and 32-unit icons as the complete approved metaphor.
- Use integer-coordinate filled pixel clusters, `shape-rendering="crispEdges"`, binary transparency, filled contour bands, square or stair-stepped corners, and object-specific upper-left lighting.
- Do not use fractional coordinates, smooth curves, transforms, filters, masks, blur, gradients, translucent shadows, rounded caps, rounded joins, or reusable extrusion wrappers.
- Keep all visible geometry and contact shadows within the viewBox with at least one unit of breathing room.
- Use approximately 8 to 24 opaque colors, no more than two saturated accent families per icon, and dithering only for material or tonal separation.
- Do not trace or copy Microsoft icons, logos, proprietary symbols, or pixel arrangements.
- Preserve existing dirty working-tree changes and do not edit production icon code during this plan.
- Use `npm` only. Do not invoke pnpm, yarn, or another package manager.
- Disagreement between blind reviewers fails the icon.

---

### Task 1: Create the design-master contract and validator

**Files:**
- Create: `docs/design-assets/myles98-icons/manifest.json`
- Create: `scripts/lib/myles98-icon-contract.mjs`
- Create: `scripts/verify-myles98-icon-masters.mjs`
- Create: `scripts/__tests__/myles98-icon-contract.test.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `ICON_GRIDS: readonly [16, 24, 32]`
- Produces: `ICON_CONCEPTS: readonly string[]`
- Produces: `validateManifest(manifest): string[]`
- Produces: `validateMasterSource(source, { concept, grid }): string[]`
- Produces: `expectedMasterPath(root, concept, grid): string`
- Produces: `npm run icons:verify -- [--group system|personal|projects]`
- Consumes: the exact concept vocabulary and tier cues in `docs/superpowers/specs/2026-08-11-myles98-pixel-icon-family-design.md`.

- [ ] **Step 1: Write the failing contract tests**

```ts
import { describe, expect, it } from "vitest";
import {
  ICON_CONCEPTS,
  ICON_GRIDS,
  expectedMasterPath,
  validateManifest,
  validateMasterSource,
} from "../lib/myles98-icon-contract.mjs";

describe("Myles 98 icon master contract", () => {
  it("locks the complete family and three native grids", () => {
    expect(ICON_GRIDS).toEqual([16, 24, 32]);
    expect(ICON_CONCEPTS).toEqual([
      "start",
      "selected-work",
      "about-myles",
      "resume",
      "email",
      "reminders",
      "trini-roti",
      "loose-parts",
      "display-properties",
      "open-apps",
      "reset-desktop",
      "generic-app",
      "fresh-greens",
      "understandingfafsa",
      "navi",
      "tiktok-catalog",
    ]);
  });

  it("rejects modern vector treatments and non-integer geometry", () => {
    const invalid = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
      <path d="M1.5 1 C2 3 4 5 6 7" stroke="black" stroke-linejoin="round" />
    </svg>`;
    expect(validateMasterSource(invalid, { concept: "start", grid: 16 })).toEqual(
      expect.arrayContaining([
        expect.stringContaining("shape-rendering"),
        expect.stringContaining("fractional"),
        expect.stringContaining("curve command"),
        expect.stringContaining("rounded join"),
      ]),
    );
  });

  it("accepts a bounded crisp pixel master", () => {
    const valid = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges" data-m98-concept="start" data-m98-grid="16">
      <path fill="#111111" d="M2 2H13V13H2Z" />
      <path fill="#f5f3ea" d="M3 3H12V12H3Z" />
    </svg>`;
    expect(validateMasterSource(valid, { concept: "start", grid: 16 })).toEqual([]);
  });

  it("uses deterministic source paths", () => {
    expect(expectedMasterPath("docs/design-assets/myles98-icons", "navi", 24)).toBe(
      "docs/design-assets/myles98-icons/masters/navi/navi-24.svg",
    );
  });
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm exec vitest -- run scripts/__tests__/myles98-icon-contract.test.ts`

Expected: FAIL because `scripts/lib/myles98-icon-contract.mjs` does not exist.

- [ ] **Step 3: Add the exact manifest schema and all 16 entries**

Each manifest entry must use this shape:

```json
{
  "id": "fresh-greens",
  "group": "projects",
  "intendedObject": "folded two-lane road map",
  "tiers": {
    "16": "folded road map",
    "24": "road map with green route and orange destination",
    "32": "two-lane road map with route, folds, and destination flag"
  },
  "acceptedReadings": ["road map", "route map", "navigation map"],
  "rejectedReadings": ["groceries", "leaf logo", "city guide"]
}
```

Use the three groups and exact membership below:

- `system`: `start`, `selected-work`, `email`, `display-properties`, `open-apps`, `reset-desktop`, `generic-app`
- `personal`: `about-myles`, `resume`, `reminders`, `trini-roti`, `loose-parts`
- `projects`: `fresh-greens`, `understandingfafsa`, `navi`, `tiktok-catalog`

- [ ] **Step 4: Implement the validator**

`validateMasterSource` must parse SVG with `JSDOM`, require the exact viewBox and data attributes, reject banned elements and attributes, reject commands other than `M`, `L`, `H`, `V`, and `Z`, reject every fractional geometry number, require opaque hex fills, count unique colors, and require every numeric coordinate to remain between `1` and `grid - 1`.

The CLI must load the manifest, select every entry or one group, report missing and invalid files with deterministic relative paths, and exit nonzero when any error exists.

- [ ] **Step 5: Add the npm command**

```json
"icons:verify": "node scripts/verify-myles98-icon-masters.mjs"
```

- [ ] **Step 6: Run the focused checks**

Run: `npm exec vitest -- run scripts/__tests__/myles98-icon-contract.test.ts`

Expected: PASS.

Run: `npm run icons:verify -- --group system`

Expected: FAIL with 21 deterministic missing-master paths. This is the RED state for Task 2.

- [ ] **Step 7: Commit Task 1**

```bash
git add package.json docs/design-assets/myles98-icons/manifest.json scripts/lib/myles98-icon-contract.mjs scripts/verify-myles98-icon-masters.mjs scripts/__tests__/myles98-icon-contract.test.ts
git commit -m "test: define Myles 98 icon master contract"
```

---

### Task 2: Draw the seven system concepts

**Files:**
- Create: `docs/design-assets/myles98-icons/masters/start/start-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/selected-work/selected-work-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/email/email-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/display-properties/display-properties-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/open-apps/open-apps-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/reset-desktop/reset-desktop-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/generic-app/generic-app-{16,24,32}.svg`

**Interfaces:**
- Consumes: manifest group `system` and `validateMasterSource`.
- Produces: 21 raw SVG masters passing `npm run icons:verify -- --group system`.

- [ ] **Step 1: Preserve the missing-master RED state**

Run: `npm run icons:verify -- --group system`

Expected: FAIL listing exactly the 21 files owned by this task.

- [ ] **Step 2: Author the 16-unit masters**

Use only these nouns: portrait, portfolio folder, envelope, CRT monitor, overlapping windows, monitor with reset cue, and single application window. Each SVG must contain only the dominant silhouette and essential color identity.

- [ ] **Step 3: Author the 24-unit masters**

Add exactly one cue per concept: locs and glasses, one image thumbnail, yellow stamp, color-test tiles, distinct titlebars, red reset arrow, or blue titlebar with inner pane.

- [ ] **Step 4: Author the 32-unit masters**

Complete each approved object without adding a second accessory beyond the spec. Start must adapt `public/logomark.svg` rather than inventing a new portrait identity, while using original pixel geometry instead of tracing its paths mechanically.

- [ ] **Step 5: Verify the system batch**

Run: `npm run icons:verify -- --group system`

Expected: PASS for 21 masters.

- [ ] **Step 6: Commit Task 2**

```bash
git add docs/design-assets/myles98-icons/masters/start docs/design-assets/myles98-icons/masters/selected-work docs/design-assets/myles98-icons/masters/email docs/design-assets/myles98-icons/masters/display-properties docs/design-assets/myles98-icons/masters/open-apps docs/design-assets/myles98-icons/masters/reset-desktop docs/design-assets/myles98-icons/masters/generic-app
git commit -m "feat: draw Myles 98 system icon masters"
```

---

### Task 3: Draw the five personal-program concepts

**Files:**
- Create: `docs/design-assets/myles98-icons/masters/about-myles/about-myles-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/resume/resume-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/reminders/reminders-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/trini-roti/trini-roti-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/loose-parts/loose-parts-{16,24,32}.svg`

**Interfaces:**
- Consumes: manifest group `personal` and `validateMasterSource`.
- Produces: 15 raw SVG masters passing `npm run icons:verify -- --group personal`.

- [ ] **Step 1: Preserve the missing-master RED state**

Run: `npm run icons:verify -- --group personal`

Expected: FAIL listing exactly the 15 files owned by this task.

- [ ] **Step 2: Author 16-unit noun silhouettes**

Use portrait card, white document, yellow checklist pad, warm recipe card, and wooden plank plus wedge. Keep About distinct from Start by retaining the card boundary; keep Reminders distinct from Résumé through yellow fill and checklist rhythm.

- [ ] **Step 3: Author 24-unit defining cues**

Add one information line, blue paperclip with two bullets, spiral edge with two checks, wooden spoon, or one wooden cube, respectively.

- [ ] **Step 4: Author 32-unit complete objects**

Add only the approved information lines, document structure, short pencil, restrained cooking detail, or third construction piece. Loose Parts must not include studs or proprietary connectors.

- [ ] **Step 5: Verify the personal batch**

Run: `npm run icons:verify -- --group personal`

Expected: PASS for 15 masters.

- [ ] **Step 6: Commit Task 3**

```bash
git add docs/design-assets/myles98-icons/masters/about-myles docs/design-assets/myles98-icons/masters/resume docs/design-assets/myles98-icons/masters/reminders docs/design-assets/myles98-icons/masters/trini-roti docs/design-assets/myles98-icons/masters/loose-parts
git commit -m "feat: draw Myles 98 personal icon masters"
```

---

### Task 4: Draw the four project concepts

**Files:**
- Create: `docs/design-assets/myles98-icons/masters/fresh-greens/fresh-greens-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/understandingfafsa/understandingfafsa-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/navi/navi-{16,24,32}.svg`
- Create: `docs/design-assets/myles98-icons/masters/tiktok-catalog/tiktok-catalog-{16,24,32}.svg`

**Interfaces:**
- Consumes: manifest group `projects` and `validateMasterSource`.
- Produces: 12 raw SVG masters passing `npm run icons:verify -- --group projects`.

- [ ] **Step 1: Preserve the missing-master RED state**

Run: `npm run icons:verify -- --group projects`

Expected: FAIL listing exactly the 12 files owned by this task.

- [ ] **Step 2: Author 16-unit noun silhouettes**

Use folded road map, newsletter page, pocket guidebook, and catalog sheet. Do not add destination, envelope, storefront, or cursor cues at this tier unless recognition fails without the cue.

- [ ] **Step 3: Author 24-unit defining cues**

Add green route plus orange destination, blue masthead inside an open envelope, orange bookmark plus one storefront marker, and product-card grid plus cursor.

- [ ] **Step 4: Author 32-unit complete objects**

Complete the two-lane road map, modular newsletter, neighborhood guide, and catalog drafting surface while preserving the collision rules in the spec.

- [ ] **Step 5: Verify the project batch**

Run: `npm run icons:verify -- --group projects`

Expected: PASS for 12 masters.

- [ ] **Step 6: Commit Task 4**

```bash
git add docs/design-assets/myles98-icons/masters/fresh-greens docs/design-assets/myles98-icons/masters/understandingfafsa docs/design-assets/myles98-icons/masters/navi docs/design-assets/myles98-icons/masters/tiktok-catalog
git commit -m "feat: draw Myles 98 project icon masters"
```

---

### Task 5: Generate the native-size contact sheet

**Files:**
- Create: `scripts/build-myles98-icon-contact-sheet.mjs`
- Create: `scripts/__tests__/myles98-icon-contact-sheet.test.ts`
- Create: `docs/design-assets/myles98-icons/contact-sheet.html`
- Modify: `package.json`

**Interfaces:**
- Consumes: manifest plus all 48 verified SVG masters.
- Produces: `npm run icons:contact-sheet`.
- Produces: deterministic HTML sections `#surface-teal`, `#surface-chrome`, and `#surface-white`.
- Produces: every icon at native size and nearest-neighbor magnification, with a separate randomized unlabeled review mode.

- [ ] **Step 1: Write the failing contact-sheet test**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("Myles 98 icon contact sheet", () => {
  it("contains all 48 masters on all three review surfaces", () => {
    const html = readFileSync(
      "docs/design-assets/myles98-icons/contact-sheet.html",
      "utf8",
    );
    expect(html.match(/data-master=/g)).toHaveLength(48 * 3);
    expect(html).toContain('id="surface-teal"');
    expect(html).toContain('id="surface-chrome"');
    expect(html).toContain('id="surface-white"');
    expect(html).toContain('data-review-mode="unlabeled"');
    expect(html).toContain("image-rendering: pixelated");
  });
});
```

- [ ] **Step 2: Run the contact-sheet test to verify it fails**

Run: `npm exec vitest -- run scripts/__tests__/myles98-icon-contact-sheet.test.ts`

Expected: FAIL because the contact sheet does not exist.

- [ ] **Step 3: Implement the generator**

The generator must verify all masters first, then embed each raw SVG without changing its geometry. It must render 16, 24, and 32-unit icons at 1× and at an integer nearest-neighbor zoom. The unlabeled mode must use a deterministic seed and replace names with review IDs so filenames and labels cannot coach reviewers.

- [ ] **Step 4: Add the npm command**

```json
"icons:contact-sheet": "node scripts/build-myles98-icon-contact-sheet.mjs"
```

- [ ] **Step 5: Generate and test the sheet**

Run: `npm run icons:contact-sheet`

Expected: writes `docs/design-assets/myles98-icons/contact-sheet.html` after a clean 48-master validation.

Run: `npm exec vitest -- run scripts/__tests__/myles98-icon-contact-sheet.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit Task 5**

```bash
git add package.json scripts/build-myles98-icon-contact-sheet.mjs scripts/__tests__/myles98-icon-contact-sheet.test.ts docs/design-assets/myles98-icons/contact-sheet.html
git commit -m "feat: add Myles 98 icon review sheet"
```

---

### Task 6: Run two blind-recognition gates

**Files:**
- Create: `docs/design-assets/myles98-icons/reviews/blind-review-1.json`
- Create: `docs/design-assets/myles98-icons/reviews/blind-review-2.json`
- Modify only when failed: the specific SVG masters named by both review reports

**Interfaces:**
- Consumes: randomized unlabeled contact sheet and manifest acceptance vocabulary.
- Produces: one independent result per reviewer, per concept, per tier.
- Produces: `verdict: "pass" | "revise"` and exact first reading, alternatives, brand reading, sibling collision, and same-family confidence.

- [ ] **Step 1: Dispatch two uninformed reviewers without the design rationale**

Each reviewer receives only the randomized unlabeled renders and these questions: primary object, two plausible alternatives, specific brand implication, and whether the three sizes depict one family.

- [ ] **Step 2: Compare results against tier-specific criteria**

At 16 units, accept the primary noun. At 24 units, require the defining cue. At 32 units, require the complete object category. Reject any prohibited brand or sibling reading.

- [ ] **Step 3: Revise every disagreement**

Return disputed icons to silhouette design. Rerun only the affected anonymous review IDs with two fresh reviewers. Do not add micro-detail as the first repair.

- [ ] **Step 4: Persist the final independent reports**

Both JSON files must retain the raw first readings and alternatives, not only the synthesized verdict.

- [ ] **Step 5: Commit Task 6**

```bash
git add docs/design-assets/myles98-icons/masters docs/design-assets/myles98-icons/reviews/blind-review-1.json docs/design-assets/myles98-icons/reviews/blind-review-2.json
git commit -m "test: verify Myles 98 icon recognition"
```

---

### Task 7: Run specialist geometry, fidelity, and family reviews

**Files:**
- Create: `docs/design-assets/myles98-icons/reviews/geometry-review.md`
- Create: `docs/design-assets/myles98-icons/reviews/period-fidelity-review.md`
- Create: `docs/design-assets/myles98-icons/reviews/family-consistency-review.md`
- Modify only when failed: affected SVG masters and regenerated contact sheet

**Interfaces:**
- Consumes: blind-approved masters.
- Produces: three independent PASS/REVISE reports with exact icon IDs and tier-specific findings.

- [ ] **Step 1: Run the geometry review**

Check integer alignment, path command restrictions, contour-band continuity, one-unit bounds, stair-step rhythm, cast-shadow containment, and native-size optical centering.

- [ ] **Step 2: Run the period-fidelity review**

Check upper-left lighting, hard-edge palette ramps, object-authored depth, restrained dithering, absence of generic glossy-vector effects, and original rather than copied pixel arrangements.

- [ ] **Step 3: Run the family-consistency review**

Check density, palette relationships, silhouette collisions, project-versus-system distinction, and whether the three tiers feel authored rather than scaled.

- [ ] **Step 4: Revise every non-pass finding and regenerate the sheet**

Run: `npm run icons:verify && npm run icons:contact-sheet`

Expected: PASS and a contact sheet built from the revised masters.

- [ ] **Step 5: Commit Task 7**

```bash
git add docs/design-assets/myles98-icons/masters docs/design-assets/myles98-icons/contact-sheet.html docs/design-assets/myles98-icons/reviews
git commit -m "fix: refine Myles 98 icon family"
```

---

### Task 8: Verify and present the design-master release candidate

**Files:**
- Create: `docs/design-assets/myles98-icons/reviews/final-verification.md`
- Modify: `docs/design-assets/myles98-icons/manifest.json`

**Interfaces:**
- Consumes: all 48 approved masters, generated contact sheet, and five review reports.
- Produces: a design-master release candidate ready for Myles's visual approval.
- Does not modify: `src/components/myles-97/icons.tsx` or any production callsite.

- [ ] **Step 1: Mark manifest review status from evidence**

Every concept and tier must reference both blind reports and all three specialist reports. No entry may be marked approved from a synthesized report alone.

- [ ] **Step 2: Run the complete design gate**

Run: `npm run icons:verify`

Expected: PASS for 48 masters.

Run: `npm run icons:contact-sheet`

Expected: deterministic rebuild with no file drift.

Run: `npm exec vitest -- run scripts/__tests__/myles98-icon-contract.test.ts scripts/__tests__/myles98-icon-contact-sheet.test.ts`

Expected: PASS.

Run: `npm run lint -- scripts docs/design-assets/myles98-icons`

Expected: PASS for script sources; generated SVG and HTML are not treated as TypeScript inputs.

Run: `git diff --check`

Expected: PASS.

- [ ] **Step 3: Render the contact sheet in the browser**

Verify all 48 icons at native size and magnification on teal, chrome, and white. Record zero clipping, broken SVGs, unintended antialiasing, or label leakage in unlabeled mode.

- [ ] **Step 4: Write final verification**

Record the exact commit, commands, counts, reviewer verdicts, exceptions, and any icon deliberately simplified below the full metaphor at 16 units.

- [ ] **Step 5: Commit Task 8**

```bash
git add docs/design-assets/myles98-icons/manifest.json docs/design-assets/myles98-icons/reviews/final-verification.md
git commit -m "docs: close Myles 98 icon design review"
```

- [ ] **Step 6: Present the contact sheet for Myles's approval**

Stop before production integration. A separate plan will map approved raw geometry into `Myles97Icon`, update closed icon-name and tier tests, split overloaded program mappings, verify forced colors, and run the full Impeccable release matrix.
