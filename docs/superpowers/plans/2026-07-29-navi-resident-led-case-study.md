# Navi Resident-Led Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Navi read as a resident-led research story in one focused pass, with exact sample counts, clear graduate-studio versus solo ownership, and one explanation of the later React rebuild.

**Architecture:** Keep the existing five `ProjectChapter` composition and all four interactive evidence exhibits. Strengthen the typed survey data so counts and percentages come from one source, then revise page copy and source-level guardrails around that data. A separate shared chapter-map task owns the global chapter titles and table-of-contents tests.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, existing Navi components and global portfolio styles.

## Global Constraints

- Use the approved design specification at `docs/superpowers/specs/2026-07-29-portfolio-case-study-refinement-design.md`, especially “2. Navi” and “7. Test-first implementation.”
- Follow `/Users/mylesashitey/career-ops/MYLES-WRITING-STYLE.md` and the Writing Style section in `/Users/mylesashitey/career-ops/modes/_profile.md`.
- Do not use em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer framing, or slogan-like closing lines in candidate-facing copy.
- Describe the dataset as 14 resident and stakeholder responses, including two local businesses. Never call it 14 resident responses or generalize it to New York City residents.
- Use “the team” for the early Manhattan concept and six-platform audit.
- Use “I” for Myles’s survey collection and synthesis, research-informed archetypes, journey and opportunity work, flows, and later React rebuild.
- Credit the Airbnb evaluation to Myles, Kaori Ogawa, and Amy Zhang.
- Keep the heatmap explicitly exploratory, reconstructed, and unsupported by live tourist-density data.
- Keep archetypes and journeys framed as research-informed internal planning artifacts, not validated personas.
- Keep group booking future-facing and not wired into the current demo.
- Preserve `LeadMedia`, `RecruiterCut`, `HeatmapExplorer`, `HeuristicInsightCards`, `SurveyStatRings`, `NaviResearchArtifacts`, `CompositionStrip`, `NaviDemoEmbed`, `ProjectWorkJump`, `CaseHighlightObserver`, and `NaviAnimReady`.
- Preserve the current system and demo links.
- Do not change component behavior or visual styling in this workstream.
- Do not modify `src/lib/project-chapters.ts`, `src/lib/__tests__/project-chapters.test.ts`, `src/app/work/__tests__/case-study-tocs.test.ts`, `src/app/styles/base.css`, `src/app/styles/late-polish.css`, or `src/app/styles/portfolio-surfaces.css`.
- Do not deploy from this plan.

## Required Shared-Task Dependency

The shared chapter-map task must remain the sole owner of:

- `src/lib/project-chapters.ts`
- `src/lib/__tests__/project-chapters.test.ts`
- `src/app/work/__tests__/case-study-tocs.test.ts`

That task should retain the Navi IDs `nv-intro`, `nv-insights`, `nv-framework`, `nv-build`, and `nv-outcome`, preserve the stages Frame, Research, Define, Build, and Validate, and supply titles consistent with the approved resident-led arc. This plan deliberately changes the route-specific chronology test so it verifies stable IDs, stages, order, and artifact nesting without duplicating the shared title strings.

Do not run the final full suite until the shared task is present. If a shared title assertion fails before then, treat it as an expected dependency, not permission to edit a shared file.

---

### Task 1: Make survey counts and participant scope a typed evidence contract

**Files:**

- Modify: `src/lib/navi-survey-data.ts:1-33`
- Modify: `src/app/work/navi/__tests__/claim-accuracy.test.ts:32-57`

**Interfaces:**

- Keep `SurveyStat.value` as the percentage consumed by `SurveyStatRings`.
- Add `SurveyStat.count` as the integer numerator displayed in the narrative.
- Keep `NAVI_SURVEY_META.responseCount` as the shared denominator.
- Add `NAVI_SURVEY_META.localBusinessCount` so the participant scope is not embedded only in prose.
- Change `NAVI_SURVEY_META.source` from “resident survey” to “resident and stakeholder survey.”
- Do not change the `SurveyStatRings` props or `SurveyRing` rendering contract.

- [ ] **Step 1: Write the failing evidence-model test**

Add imports and a focused assertion to `claim-accuracy.test.ts`:

```ts
import {
  NAVI_SURVEY_META,
  NAVI_SURVEY_STATS,
} from "@/lib/navi-survey-data";

it("stores exact survey counts and participant scope with the percentages", () => {
  expect(NAVI_SURVEY_META).toMatchObject({
    responseCount: 14,
    localBusinessCount: 2,
  });
  expect(NAVI_SURVEY_META.source).toMatch(/resident and stakeholder/i);
  expect(
    NAVI_SURVEY_STATS.map(({ id, count, value }) => ({ id, count, value })),
  ).toEqual([
    { id: "overcrowding", count: 10, value: 71 },
    { id: "authentic", count: 7, value: 50 },
  ]);
});
```

- [ ] **Step 2: Run the focused test and confirm RED**

Run:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts
```

Expected: FAIL because `count` and `localBusinessCount` do not exist and the source still says “resident survey.”

- [ ] **Step 3: Add the minimum typed fields**

Update the data model without renaming `value` or changing ring behavior:

```ts
export type SurveyStat = {
  id: "overcrowding" | "authentic";
  count: number;
  value: number;
  label: string;
  caption: string;
};

export const NAVI_SURVEY_STATS = [
  {
    id: "overcrowding",
    count: 10,
    value: 71,
    label: "71%",
    caption: "concerned about overcrowding and over-tourism",
  },
  {
    id: "authentic",
    count: 7,
    value: 50,
    label: "50%",
    caption: "concerned about lack of authentic experiences",
  },
] as const satisfies readonly SurveyStat[];

export const NAVI_SURVEY_META = {
  responseCount: 14,
  localBusinessCount: 2,
  source:
    "Reimagining NYC Tourism: A More Meaningful & Sustainable Experience (resident and stakeholder survey)",
} as const;
```

- [ ] **Step 4: Verify the data contract and unchanged ring rendering**

Run:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/components/__tests__/navi-artifact-layout.test.tsx
```

Expected: PASS. The ring test proves the added fields did not alter the visual component contract.

- [ ] **Step 5: Commit the evidence-model change**

Run:

```bash
git add src/lib/navi-survey-data.ts src/app/work/navi/__tests__/claim-accuracy.test.ts
git diff --cached --check
git commit -m "test(navi): model survey counts and participant scope"
```

Expected: one atomic commit containing only the survey data and its contract test.

---

### Task 2: Lock the resident-first story, ownership, and evidence boundaries

**Files:**

- Modify: `src/app/work/navi/__tests__/claim-accuracy.test.ts:24-170`
- Modify: `src/app/work/navi/__tests__/prose-structure.test.ts:33-121`
- Modify: `src/app/work/navi/__tests__/toc-chronology.test.ts:10-65`
- Modify: `src/components/navi/__tests__/research-artifacts.test.tsx:14-32`

**Interfaces:**

- The hero lede must appear before `LeadMedia` and name both participant scope and the change in direction.
- The five `ProjectChapter` instances remain ordered `chapters[0]` through `chapters[4]`.
- The stable chapter IDs and stages come from `CASE_STUDY_CHAPTERS.navi`; titles remain owned by the shared dependency.
- Research must precede the count findings, which must precede Learn, Plan, Go, which must precede the solo rebuild, which must precede future validation.
- Each evidence heading keeps its current unique ID and owning chapter.
- Candidate-facing page prose should remain at or below 800 words. Do not add a minimum word count.

- [ ] **Step 1: Replace exact-copy expectations with structural and factual guardrails**

In `claim-accuracy.test.ts`, add guards that establish:

```ts
expect(projectPage).not.toMatch(/14(?:-response)? resident survey/i);
expect(projectPage.indexOf("resident and stakeholder responses")).toBeLessThan(
  projectPage.indexOf("<HeatmapExplorer"),
);
expect(projectPage).toMatch(/including two local businesses/i);
expect(projectPage).toMatch(/I collected[\s\S]{0,120}resident and stakeholder responses/i);
expect(projectPage).toMatch(/The team[\s\S]{0,100}six travel platforms/i);
expect(projectPage).toMatch(/I evaluated Airbnb with Kaori Ogawa and Amy\s+Zhang/i);
expect(projectPage).toMatch(/10 of 14[\s\S]{0,40}71%/i);
expect(projectPage).toMatch(/7 of 14[\s\S]{0,40}50%/i);
expect(projectPage).not.toMatch(/NYC residents (?:wanted|needed|preferred|said)/i);
```

Add recruiter-cut ownership and tool assertions:

```ts
expect(projectPage).toContain('stack="Figma, FigJam, React, TypeScript"');
expect(projectPage).toMatch(/Graduate studio:[\s\S]{0,180}The team/i);
expect(projectPage).toMatch(/My contribution:[\s\S]{0,220}I collected/i);
expect(projectPage).toMatch(/Solo rebuild:[\s\S]{0,180}React/i);
```

Keep the existing negative guards for unsupported preference metrics, tourist-density claims, validated personas, causal outcome claims, and group booking.

In `prose-structure.test.ts`, replace the exact sentence array with ordered tokens:

```ts
const storyMarkers = [
  "resident and stakeholder responses",
  "The team used a Manhattan heatmap",
  "10 of 14",
  "Learn, Plan, Go",
  "working alone",
  "Next research",
];

for (const [current, next] of storyMarkers
  .slice(0, -1)
  .map((marker, index) => [marker, storyMarkers[index + 1]] as const)) {
  expect(page.indexOf(current)).toBeGreaterThan(-1);
  expect(page.indexOf(current)).toBeLessThan(page.indexOf(next));
}
```

Keep the four evidence-heading IDs and their chapter ownership checks. Assert that “rebuilt the concept” appears only once, while both `/work/navi/demo` and `/work/navi/system` remain present.

In `toc-chronology.test.ts`, remove the duplicated exact title objects. Assert only:

```ts
expect(
  CASE_STUDY_CHAPTERS.navi.map(({ id, stage }) => ({ id, stage })),
).toEqual([
  { id: "nv-intro", stage: "Frame" },
  { id: "nv-insights", stage: "Research" },
  { id: "nv-framework", stage: "Define" },
  { id: "nv-build", stage: "Build" },
  { id: "nv-outcome", stage: "Validate" },
]);
```

Retain the existing checks for five `ProjectChapter` indices and evidence-heading nesting.

In `research-artifacts.test.tsx`, update provenance to expect:

```ts
screen.getByText(
  "Resident and stakeholder survey, platform audits, and secondary research",
);
```

- [ ] **Step 2: Add a maximum-only prose budget**

Use the TypeScript-AST reader-facing word-count helper already established in `src/app/work/fresh-greens/__tests__/prose-structure.test.ts:28-150`, localized to `prose-structure.test.ts`. Define:

```ts
const pagePath = "src/app/work/navi/page.tsx";
```

Count JSX text, string literals rendered inside JSX, and reader-facing prop values. Exclude imports, class names, asset paths, alt text, aria labels, and comments. Add:

```ts
it("keeps the primary case-study path within its prose budget", () => {
  expect(readerFacingWordCount([pagePath])).toBeLessThanOrEqual(800);
});
```

Do not add a lower bound.

- [ ] **Step 3: Run the narrative tests and confirm RED**

Run:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/toc-chronology.test.ts src/components/navi/__tests__/research-artifacts.test.tsx
```

Expected: FAIL because the hero is generic, the page calls the dataset a resident survey, exact counts and ownership are missing, the recruiter cut lacks the rebuild split and full stack, the rebuild is explained twice, and the research-artifact caption is too narrow.

- [ ] **Step 4: Review the RED diff before production changes**

Confirm that failures concern only the intended narrative contract. Do not weaken existing artifact, evidence-boundary, future-scope, or accessibility assertions to get a green test.

---

### Task 3: Rewrite the Navi page around the research redirect

**Files:**

- Modify: `src/app/work/navi/page.tsx:23-24, 75-109, 119-197, 206-242, 251-337`
- Modify: `src/components/navi/research-artifacts.tsx:19-26`

**Interfaces:**

- Import both `NAVI_SURVEY_META` and `NAVI_SURVEY_STATS`.
- Derive the two displayed count statements from the typed data rather than duplicating numeric literals.
- Keep the current async page API, chapter composition, component props, anchor IDs, links, and interaction components.
- Do not modify `content/projects/navi.md`; the new resident-led lede is page-specific and should not silently change homepage or resume copy.

- [ ] **Step 1: Lead the hero with Myles’s collection and the concept redirect**

Replace the generic project-summary lede with direct page copy in this shape:

```tsx
<p className="project-hero-lede nv-lede">
  I collected 14 resident and stakeholder responses, including two local
  businesses, for a graduate-studio travel concept. What I learned redirected
  the team&apos;s early Manhattan heatmap toward neighborhood context: help
  people learn, plan, and book, not just move their attention on a map.
</p>
```

Keep `project` for status and outcome metadata. Do not remove the content lookup.

- [ ] **Step 2: Make the recruiter cut an ownership timeline**

Change the tools to:

```tsx
stack="Figma, FigJam, React, TypeScript"
```

Use three moves with explicit labels:

```tsx
moves={[
  "Graduate studio: the team tested an early Manhattan redirection concept and audited six travel platforms.",
  "My contribution: I collected and synthesized 14 resident and stakeholder responses, including two local businesses, then created archetypes, journeys, opportunity areas, and flows.",
  "Solo rebuild: I turned Learn, Plan, Go into a React component system and working individual booking flow.",
]}
```

Do not mix Myles’s individual work into the team sentence.

- [ ] **Step 3: Reframe the heatmap as the hypothesis the research changed**

Open Frame with the limitation of the first idea:

```tsx
<p className="case-section-lead">
  The early team concept could move a visitor to another neighborhood, but it
  didn&apos;t change how they engaged after arriving.
</p>
```

Then describe the Manhattan heatmap as the team’s exploratory hypothesis. Keep the existing statement that the reconstruction does not represent actual tourist density or live geo analytics.

The hero’s resident stake must remain before the heatmap. Do not move `HeatmapExplorer` into a different chapter or change its behavior.

- [ ] **Step 4: Correct the Research sample and render exact counts from data**

Import:

```ts
import {
  NAVI_SURVEY_META,
  NAVI_SURVEY_STATS,
} from "@/lib/navi-survey-data";
```

At module scope, bind the two stable records:

```ts
const [overcrowdingStat, authenticExperienceStat] = NAVI_SURVEY_STATS;
```

Revise Research so it states:

- Myles collected the 14 resident and stakeholder responses, including two local businesses.
- The team audited six travel platforms.
- Myles evaluated Airbnb with Kaori Ogawa and Amy Zhang.
- The sample informs this concept but does not stand in for all NYC residents.

Render the findings from the typed values:

```tsx
<p>
  {overcrowdingStat.count} of {NAVI_SURVEY_META.responseCount} responses (
  {overcrowdingStat.label}) named overcrowding and over-tourism.{" "}
  {authenticExperienceStat.count} of {NAVI_SURVEY_META.responseCount} (
  {authenticExperienceStat.label}) named a lack of authentic experiences.
</p>
```

Keep `SurveyStatRings` directly after the supporting prose.

- [ ] **Step 5: Make Learn, Plan, Go the explicit research-to-product bridge**

Keep Myles’s ownership of the three research-informed archetypes. Add one direct transition before the existing list:

```tsx
<p>
  The research changed the product question. Instead of treating movement on
  the map as the outcome, I organized the next concept around{" "}
  <mark className="case-highlight">Learn, Plan, Go</mark>.
</p>
```

Retain:

- “research-informed archetypes”
- “internal planning artifacts”
- the Airbnb and secondary-research provenance for the booking flow
- the implemented versus future labels in `NaviResearchArtifacts`

Do not describe the archetypes as participant profiles or validated personas.

- [ ] **Step 6: Explain the later solo rebuild once**

Open Build with one boundary paragraph:

```tsx
<p>
  The graduate-studio project ended as a Figma concept. Later, working alone, I
  turned Learn, Plan, Go into a React and TypeScript component system and a
  working individual booking flow.
</p>
```

Keep the typography, palette, spacing, component-system explanation, `CompositionStrip`, and both links. In the following screens section, describe the current browser actions without repeating “I rebuilt the concept”:

```tsx
<p>
  In the current build, you can browse the feed, search by neighborhood, open a
  host, and complete a sample individual reservation with the same components
  catalogued on the system page.
</p>
```

- [ ] **Step 7: Preserve the validation ledger and narrow the research caption**

Keep the existing “Working now” and “Next research” separation, including testing with residents, travelers, and local hosts. Keep group booking explicitly future-facing.

Change the archetype provenance caption to:

```tsx
<span>
  Resident and stakeholder survey, platform audits, and secondary research
</span>
```

- [ ] **Step 8: Run the focused suite and confirm GREEN**

Run:

```bash
npm test -- src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/toc-chronology.test.ts src/components/navi/__tests__/research-artifacts.test.tsx src/components/__tests__/navi-artifact-layout.test.tsx src/components/__tests__/navi-heatmap.test.tsx src/components/__tests__/navi-demo-embed.test.tsx
```

Expected: PASS. Failures in the separate shared chapter-title tests are outside this task until the dependency lands.

- [ ] **Step 9: Commit the narrative change**

Run:

```bash
git add src/app/work/navi/page.tsx src/components/navi/research-artifacts.tsx src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/toc-chronology.test.ts src/components/navi/__tests__/research-artifacts.test.tsx
git diff --cached --check
git commit -m "feat(navi): lead case study with resident research"
```

Expected: one atomic commit containing the resident-first narrative and its guardrails, with no style, shared chapter-map, or unrelated file.

---

### Task 4: Verify the focused read without changing the visual system

**Files:**

- Verify only: files changed in Tasks 1 through 3.
- Verify dependency only: shared chapter-map files after the separate task lands.

**Interfaces:**

- The implementation must render at the existing route `/work/navi`.
- Existing keyboard, theme, reduced-motion, heatmap, demo, and design-system behavior must remain intact.
- Completion requires both automated and visual evidence.

- [ ] **Step 1: Rebase or merge the shared chapter-map dependency**

Confirm the shared task is present, then run:

```bash
git diff --name-only
git status --short
```

Expected: no accidental edits to the three shared chapter files from this plan.

- [ ] **Step 2: Run static validation**

Run:

```bash
npm run lint -- src/app/work/navi/page.tsx src/components/navi/research-artifacts.tsx src/lib/navi-survey-data.ts src/app/work/navi/__tests__/claim-accuracy.test.ts src/app/work/navi/__tests__/prose-structure.test.ts src/app/work/navi/__tests__/toc-chronology.test.ts src/components/navi/__tests__/research-artifacts.test.tsx
npm run validate:content
git diff --check
```

Expected: all commands PASS.

- [ ] **Step 3: Run the full repository gates**

Run:

```bash
npm run build
npx tsc --noEmit
npm test
```

Expected: all tests and the production build PASS after the shared chapter-map dependency is present.

- [ ] **Step 4: Audit Myles’s voice and evidence boundaries**

Use the `ai-slop` skill on the final candidate-facing diff. Confirm:

- no em dashes, semicolons, ellipses, hype, rhetorical question-and-answer framing, or aphoristic closer
- no sentence changes “14 resident and stakeholder responses” into a population claim
- every “team” and “I” statement matches the ownership contract
- 10 of 14 stays paired with 71%, and 7 of 14 stays paired with 50%
- the heatmap, archetypes, journey artifacts, current browser build, and future validation remain distinct evidence states

- [ ] **Step 5: Inspect the route at all required viewports**

Start the site:

```bash
npm run dev
```

Using the browser workflow, inspect `/work/navi` at 375, 768, and 1440 CSS pixels in light and dark themes, then with reduced motion enabled. Confirm:

- the resident stake is visible before the first interactive artifact
- the recruiter cut wraps cleanly with four tool names
- `10 of 14 (71%)` and `7 of 14 (50%)` remain legible beside the rings
- the five-chapter flow has no duplicate React-rebuild explanation
- all artifact headings, demo links, system links, focus states, and interactive controls still work
- no new horizontal overflow, clipped text, or collapsed spacing appears

- [ ] **Step 6: Request independent review**

Use `superpowers:requesting-code-review` against the two atomic commits. Ask the reviewer to check participant scope, ownership, evidence boundaries, chapter chronology, interaction preservation, and accidental changes outside the Navi files.

- [ ] **Step 7: Report completion evidence**

Report the two commit hashes, focused and full-suite results, build result, inspected viewports and themes, reviewer findings, and any dependency commit used. Do not claim deployment.
