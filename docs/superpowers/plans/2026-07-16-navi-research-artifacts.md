# Navi Research Artifacts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add polished, responsive Navi research artifacts that connect confirmed research evidence to neighborhood exploration and the working individual booking flow.

**Architecture:** Store the confirmed archetype, journey, and booking-flow copy in a typed data module. Render it through one focused semantic component whose diagrams remain understandable without SVG or motion. Integrate the component into the existing Navi chronology, then extend page-scoped CSS and claim-accuracy tests.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library

## Global Constraints

- The archetypes are research-informed scenario archetypes, not individual participant profiles or validated personas.
- The journey maps and flows are internal planning artifacts and were not evaluated with participants.
- Neighborhood exploration and the individual booking flow are implemented in the current portfolio rebuild.
- Group booking is future work and is not wired into the current build.
- Content must remain visible before JavaScript and under `prefers-reduced-motion: reduce`.
- Mobile diagrams must become vertical sequences without horizontal scrolling.
- Do not add a motion library, embed the full FigJam board, or edit Fresh Greens.
- Follow Myles's writing guide: no em dashes, semicolons, ellipses, hype language, or aphoristic closers.

---

## File structure

- Create `src/lib/navi/research-artifacts.ts`: typed, evidence-safe content for the three archetypes, journey stages, and individual booking steps.
- Create `src/components/navi/research-artifacts.tsx`: semantic artifact composition with captions, ordered lists, and decorative route geometry.
- Create `src/components/navi/__tests__/research-artifacts.test.tsx`: component contract and accessibility coverage.
- Modify `src/app/work/navi/page.tsx`: revised research-to-planning narrative, component placement, TOC title, and future-scope correction.
- Modify `src/app/work/navi/__tests__/claim-accuracy.test.ts`: evidence and scope regression assertions.
- Modify `src/app/work/navi/__tests__/prose-structure.test.ts`: revised process heading.
- Modify `src/app/work/__tests__/case-study-tocs.test.ts`: revised Navi TOC contract.
- Modify `src/app/styles/portfolio-surfaces.css`: responsive artifact layout, route drawing, theme treatment, and reduced-motion behavior.
- Modify `src/app/work/__tests__/artifact-accessibility-styles.test.ts`: CSS contract for progressive enhancement and mobile stacking.

---

### Task 1: Define and render the research artifacts

**Files:**
- Create: `src/lib/navi/research-artifacts.ts`
- Create: `src/components/navi/research-artifacts.tsx`
- Create: `src/components/navi/__tests__/research-artifacts.test.tsx`

**Interfaces:**
- Produces: `NAVI_ARCHETYPES`, `NAVI_JOURNEY_STAGES`, and `NAVI_BOOKING_STEPS` as readonly typed arrays.
- Produces: `NaviResearchArtifacts(): React.JSX.Element` for the Navi case-study page.

- [ ] **Step 1: Write the failing component contract**

Create the component test with three contracts:

```tsx
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NaviResearchArtifacts } from "@/components/navi/research-artifacts";

describe("NaviResearchArtifacts", () => {
  it("names the three research-informed archetypes and their scope", () => {
    render(<NaviResearchArtifacts />);
    const archetypes = screen.getByLabelText("Research-informed archetypes");
    expect(within(archetypes).getByText("Cain")).toBeInTheDocument();
    expect(within(archetypes).getByText("Ororo")).toBeInTheDocument();
    expect(within(archetypes).getByText("Selina")).toBeInTheDocument();
    expect(within(archetypes).getByText("Future opportunity")).toBeInTheDocument();
  });

  it("keeps the journey and individual booking sequence available as text", () => {
    render(<NaviResearchArtifacts />);
    const journey = screen.getByLabelText("Journey-map excerpt");
    for (const stage of ["Awareness", "Consideration", "Decision"]) {
      expect(within(journey).getByText(stage)).toBeInTheDocument();
    }
    const booking = screen.getByLabelText("Individual booking-flow excerpt");
    for (const step of ["Neighborhood discovery", "Activity detail", "Date and time", "Cost review", "Confirmation"]) {
      expect(within(booking).getByText(step)).toBeInTheDocument();
    }
  });

  it("labels the diagrams as internal planning rather than validation", () => {
    render(<NaviResearchArtifacts />);
    expect(screen.getByText("Internal planning artifact")).toBeInTheDocument();
    expect(screen.queryByText(/validated/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and verify the component is missing**

Run: `npm test -- src/components/navi/__tests__/research-artifacts.test.tsx`

Expected: FAIL because the component module does not exist.

- [ ] **Step 3: Add the typed content model**

Create `src/lib/navi/research-artifacts.ts` with these exact interfaces:

```ts
export type NaviArchetype = {
  id: "cain" | "ororo" | "selina";
  name: string;
  need: string;
  productArea: string;
  scope: "Implemented" | "Future opportunity";
};

export type NaviJourneyStage = {
  id: "awareness" | "consideration" | "decision";
  label: string;
  action: string;
  productNeed: string;
};

export type NaviBookingStep = {
  id: "discover" | "detail" | "schedule" | "cost" | "confirm";
  label: string;
  detail: string;
};
```

Populate the arrays with these confirmed content records:

```ts
export const NAVI_ARCHETYPES = [
  { id: "cain", name: "Cain", need: "Coordinate an activity around a group's needs.", productArea: "Group planning", scope: "Future opportunity" },
  { id: "ororo", name: "Ororo", need: "See what is happening in neighborhoods nearby.", productArea: "Neighborhood exploration", scope: "Implemented" },
  { id: "selina", name: "Selina", need: "Compare a shorter trip with precise filters.", productArea: "Search and filters", scope: "Implemented" },
] as const satisfies readonly NaviArchetype[];

export const NAVI_JOURNEY_STAGES = [
  { id: "awareness", label: "Awareness", action: "Look beyond the same tourist-heavy areas.", productNeed: "Nearby neighborhood context" },
  { id: "consideration", label: "Consideration", action: "Compare an activity, its host, timing, and requirements.", productNeed: "Details repeated at decision points" },
  { id: "decision", label: "Decision", action: "Review the full cost before confirming.", productNeed: "Transparent booking summary" },
] as const satisfies readonly NaviJourneyStage[];

export const NAVI_BOOKING_STEPS = [
  { id: "discover", label: "Neighborhood discovery", detail: "Start with a local area." },
  { id: "detail", label: "Activity detail", detail: "Review the host, activity, and requirements." },
  { id: "schedule", label: "Date and time", detail: "Choose an available session." },
  { id: "cost", label: "Cost review", detail: "See the total before committing." },
  { id: "confirm", label: "Confirmation", detail: "Keep the activity details and schedule together." },
] as const satisfies readonly NaviBookingStep[];
```

- [ ] **Step 4: Implement the semantic artifact composition**

Create `src/components/navi/research-artifacts.tsx` with:

- Wrapper `className="nv-research-artifacts nv-reveal"`.
- Archetype figure labeled `Research-informed archetypes` with a figcaption and ordered list.
- Journey figure labeled `Journey-map excerpt`, visible text `Internal planning artifact`, and an ordered list.
- Booking figure labeled `Individual booking-flow excerpt` and an ordered list.
- Data attributes for archetype scope and stage or step IDs.
- Decorative route elements marked `aria-hidden="true"`.
- No essential text inside SVG.

- [ ] **Step 5: Run the test and verify it passes**

Run: `npm test -- src/components/navi/__tests__/research-artifacts.test.tsx`

Expected: 3 tests PASS.

- [ ] **Step 6: Commit the component slice**

```bash
git add src/lib/navi/research-artifacts.ts src/components/navi/research-artifacts.tsx src/components/navi/__tests__/research-artifacts.test.tsx
git commit -m "feat: add Navi research artifacts"
```

---

### Task 2: Integrate the evidence-safe narrative

**Files:**
- Modify: `src/app/work/navi/page.tsx`
- Modify: `src/app/work/navi/__tests__/claim-accuracy.test.ts`
- Modify: `src/app/work/navi/__tests__/prose-structure.test.ts`
- Modify: `src/app/work/__tests__/case-study-tocs.test.ts`

**Interfaces:**
- Consumes: `NaviResearchArtifacts` from Task 1.
- Produces: an eight-stage chronology whose fifth heading is `Mapping the experience before the build`.

- [ ] **Step 1: Add failing claim and structure assertions**

Add these claim contracts:

```ts
expect(projectPage).toContain("research-informed archetypes");
expect(projectPage).toContain("internal planning artifacts");
expect(projectPage).toMatch(/group booking.{0,100}future opportunity/i);
expect(projectPage).toMatch(/not wired into the current rebuild/i);
expect(projectPage).not.toMatch(/three personas/i);
expect(projectPage).not.toContain("Those flows are present in the rebuild");
```

Update both structure contracts so `nv-framework` maps to `Mapping the experience before the build`.

- [ ] **Step 2: Run focused page tests and verify they fail**

Run: `npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/__tests__/case-study-tocs.test.ts`

Expected: FAIL on the heading and evidence claims.

- [ ] **Step 3: Integrate the component and revised prose**

In `src/app/work/navi/page.tsx`:

- Import `NaviResearchArtifacts`.
- Change the fifth TOC title and H2 to `Mapping the experience before the build`.
- State that Myles created three research-informed archetypes from survey findings, platform audits, and secondary research.
- State that the journey maps and user flows were internal planning artifacts.
- Connect neighborhood exploration to residents wanting nearby activity without repeated concentration in tourist-heavy areas.
- Connect booking transparency to the Airbnb audit and secondary research about cost, requirements, timing, and trust in lesser-known vendors.
- Preserve the Learn, Plan, Go definitions.
- Render `<NaviResearchArtifacts />` after the process copy.
- Replace the final paragraph so deeper neighborhood pages and local-host onboarding remain future validation work, and group booking is a future opportunity not wired into the current rebuild.

- [ ] **Step 4: Run focused page tests and verify they pass**

Run the Step 2 command.

Expected: all focused tests PASS.

- [ ] **Step 5: Run the AI-writing mechanical scan**

Run:

```bash
rg -n --pcre2 "—| -- |\b(isn('|&apos;|&#39;)t|not) (just|only|merely|about)\b|\b(delve|tapestry|testament to|underscores?|meticulous|pivotal|seamless|multifaceted|holistic|foster(ing)?|leverag(e|ing)|elevat(e|ing)|crucial|realm|landscape of)\b|;|\.\.\.|…" src/app/work/navi/page.tsx
```

Expected: no prohibited prose matches.

- [ ] **Step 6: Commit the narrative slice**

```bash
git add src/app/work/navi/page.tsx src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/__tests__/case-study-tocs.test.ts
git commit -m "fix: connect Navi research to product decisions"
```

---

### Task 3: Art-direct the responsive diagrams

**Files:**
- Modify: `src/app/styles/portfolio-surfaces.css`
- Modify: `src/app/work/__tests__/artifact-accessibility-styles.test.ts`

**Interfaces:**
- Consumes: the artifact classes from Task 1.
- Produces: dark and light, desktop and mobile, reduced-motion-safe presentation.

- [ ] **Step 1: Add failing CSS contract assertions**

```ts
expect(styles).toMatch(/\.nv-journey-route[\s\S]*?transform-origin:\s*left center/);
expect(styles).toMatch(/@media \(max-width: 700px\)[\s\S]*?\.nv-journey-stages[\s\S]*?grid-template-columns:\s*1fr/);
expect(styles).toMatch(/@media \(max-width: 700px\)[\s\S]*?\.nv-booking-flow-list[\s\S]*?grid-template-columns:\s*1fr/);
expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.nv-journey-route[\s\S]*?animation:\s*none/);
expect(styles).not.toMatch(/\.nv-research-artifacts[^{]*\{[^}]*overflow-x:\s*(auto|scroll)/);
```

- [ ] **Step 2: Run the CSS contract and verify it fails**

Run: `npm test -- src/app/work/__tests__/artifact-accessibility-styles.test.ts`

Expected: FAIL because the artifact classes are not styled.

- [ ] **Step 3: Add desktop art direction**

In `src/app/styles/portfolio-surfaces.css`:

- Reuse Navi orange and neutral surface tokens.
- Give archetype notes varied widths and slight static rotation so they read as synthesis material, not a uniform card grid.
- Use 1px full borders and tonal fills. Do not add side stripes, shadows, glass, or gradient text.
- Lay journey stages and booking steps in horizontal grids.
- Draw the route with a decorative element whose visible default is `transform: scaleX(1)`.
- Use scope data to render future group planning in a neutral dashed treatment while implemented areas use Navi orange.
- Keep captions within 65 to 75 characters per line.

- [ ] **Step 4: Add progressive motion and reduced-motion behavior**

Only when `.nv-reveal--visible` is present and motion is allowed, animate the route from `scaleX(0)` to `scaleX(1)` with the existing Navi easing over 650ms to 900ms. Stagger stage markers once. Keep every label and list item visible.

Under `prefers-reduced-motion: reduce`, set route and marker animation to `none` and preserve their final state.

- [ ] **Step 5: Add the mobile vertical sequence**

At `max-width: 700px`:

- Set journey and booking lists to `grid-template-columns: 1fr`.
- Replace horizontal connectors with a vertical route.
- Remove note rotations.
- Keep artifacts within section width with `min-width: 0` and no horizontal scrolling.

- [ ] **Step 6: Run component and CSS tests**

Run: `npm test -- src/components/navi/__tests__/research-artifacts.test.tsx src/app/work/__tests__/artifact-accessibility-styles.test.ts`

Expected: all tests PASS.

- [ ] **Step 7: Commit the visual slice**

```bash
git add src/app/styles/portfolio-surfaces.css src/app/work/__tests__/artifact-accessibility-styles.test.ts
git commit -m "style: polish Navi research diagrams"
```

---

### Task 4: Verify the complete case-study change

**Files:**
- Verify only. Apply targeted fixes only to files from Tasks 1 through 3 if a check fails.

- [ ] **Step 1: Run focused tests**

```bash
npm test -- src/components/navi/__tests__/research-artifacts.test.tsx src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/__tests__/case-study-tocs.test.ts src/app/work/__tests__/artifact-accessibility-styles.test.ts
```

Expected: all focused tests PASS.

- [ ] **Step 2: Run static checks**

```bash
npm run lint
npx tsc --noEmit
git diff --check
```

Expected: all commands exit 0.

- [ ] **Step 3: Run the complete suite and production build**

```bash
npm test
npm run build
```

Expected: the suite passes and Next.js completes a production build.

- [ ] **Step 4: Perform browser QA**

Inspect `/work/navi` at approximately 1440 by 1000 and 390 by 844 in both themes. Confirm:

- Archetype notes remain legible and avoid a uniform card-grid appearance.
- Journey and booking routes remain continuous.
- Mobile diagrams become vertical without sideways scrolling.
- No copy clips or overlaps.
- Motion runs once and never hides content.
- Reduced motion shows the complete static artifact.
- Group booking appears only as future work.

- [ ] **Step 5: Review the final diff**

Run `git diff --check` and inspect only the planned Navi component, content, styles, and tests.
