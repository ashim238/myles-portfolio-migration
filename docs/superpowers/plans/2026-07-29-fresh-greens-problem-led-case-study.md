# Fresh Greens Problem-Led Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild Fresh Greens as a five-minute, six-chapter case study that connects Myles's personal origin to six interviews, three product problems, a working prototype, and explicit evidence limits.

**Architecture:** Keep the existing server-rendered Next.js page, `ProjectChapter` shell, daylight table of contents, and Fresh Greens artifact components. A separate shared task supplies the canonical chapter registry and shared layout contracts. This plan only recomposes page-owned content, updates the Plan artifact captions, and replaces brittle Fresh Greens page tests with rendered ownership and factual-boundary tests.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, Testing Library, existing Fresh Greens portfolio components.

## Global Constraints

- Work from `/Users/mylesashitey/.codex/worktrees/86e3/myles-portfolio-migration`.
- The thesis is: `Fresh Greens brings the safety knowledge Black drivers already use into route planning.`
- Present Myles's Brooklyn-to-rural-South-Jersey experience as the hypothesis, not proof of a population-wide need.
- State the immediate concerns plainly: a police stop or car trouble in a place where asking for help might not feel safe.
- Preserve the verified interview counts: daylight 6 of 6, police presence 5 of 6, road conditions 5 of 6, community knowledge 5 of 6, and wildlife 3 of 6.
- Do not assign those frequencies to specific preparation behaviors unless the existing interview synthesis supports that claim.
- Treat the Green Book as sourced design lineage, not as evidence that Fresh Greens is its digital successor.
- Use `trusted contacts` for a driver's personal support network and `community contributors` for people submitting reports. Never use `trusted agents`.
- Preserve the current interaction behavior of `PivotJourney`, `ArchitectureDiagram`, and `PulledOverJourney`.
- Keep `PivotJourney` as Plan's flagship, `PulledOverJourney` as Respond's flagship, and one report-detail screen plus the moderation flow as Trust's contribution-to-decision exhibit.
- Keep the current implementation limit visible: one report maps to one scored zone, so one report can affect route ranking now.
- Present corroboration-weighted ranking, visible contributor provenance, and differentiated trust levels as intended safeguards, not built behavior.
- Sparse coverage must remain uncertainty. It must never become a positive safety signal.
- Target 800 to 950 primary-path words, 13 to 15 mobile viewports, and 6 to 8 primary figures. Automate the 950-word ceiling, but do not add a minimum-word assertion that rewards filler.
- Do not claim that Fresh Greens improves safety, that a preferred route is safer, or that six interviews represent all Black drivers.
- Candidate-facing prose follows `/Users/mylesashitey/.claude/writing-style-myles.md`, `/Users/mylesashitey/career-ops/MYLES-WRITING-STYLE.md`, and the higher-precedence Writing Style section in `/Users/mylesashitey/career-ops/modes/_profile.md`.
- Do not use em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or slogan-like closing lines in candidate-facing prose.
- Do not add an accordion, new visual identity, page-local style system, new dependency, or corroboration logic in the separate Fresh Greens product repository.
- Do not deploy in this pass.

## Required Shared-Task Dependency

The shared case-study task must land before Task 1 can pass. This plan consumes the following exact interface and must not patch the owning files.

```ts
CASE_STUDY_CHAPTERS["fresh-greens"]
// [
//   {
//     id: "fg-problem",
//     stage: "Frame",
//     title: "Why route planning needs more than time and distance",
//   },
//   {
//     id: "fg-research",
//     stage: "Research",
//     title: "Three problems the interviews made clear",
//   },
//   {
//     id: "fg-design",
//     stage: "Plan",
//     title: "1. See what is on each route before choosing",
//   },
//   {
//     id: "fg-pulled-over",
//     stage: "Respond",
//     title: "2. Handle unexpected problems without adding stress",
//   },
//   {
//     id: "fg-trust",
//     stage: "Trust",
//     title: "3. Navigate with transparent community contributors",
//   },
//   {
//     id: "fg-scope",
//     stage: "Validate",
//     title: "What the prototype made possible and what still needs proof",
//   },
// ]
```

The separate shared task owns all of these changes:

- `src/lib/project-chapters.ts`: replace `fg-refine` with the `fg-pulled-over` chapter and publish the six entries above.
- `src/lib/__tests__/project-chapters.test.ts`: update the canonical registry expectation.
- `src/app/work/__tests__/case-study-tocs.test.ts`: remove the retired Fresh Greens nested evidence IDs and consume the six chapter anchors.
- `src/app/styles/base.css`: keep the horizontal TOC at 1440px and delay the vertical spine until full labels fit.
- `src/app/styles/late-polish.css`: preserve the six-stop daylight arc and move the traffic-stop emphasis from `.project-evidence-heading#fg-pulled-over` to the chapter-title contract.
- `src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts`: update the shared daylight/style assertion for `fg-pulled-over` as a chapter.
- `src/app/work/__tests__/lead-media-dimensions.test.ts` and any other shared lead-media test: retain the Fresh Greens cover geometry while retiring the requirement that the en-route `LeadVideo` remain in the primary page.

Before starting Task 1, run:

```bash
npm test -- src/lib/__tests__/project-chapters.test.ts src/app/work/__tests__/case-study-tocs.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/work/__tests__/lead-media-dimensions.test.ts
```

Expected: PASS with the six-entry problem-led registry, `fg-pulled-over` as chapter four, no retired Fresh Greens evidence IDs, the revised TOC contract, and no shared requirement for the en-route video. If this prerequisite is not green, stop and report the shared-task blocker. Do not edit the shared files from this plan.

---

### Task 1: Establish the personal origin and three-problem research bridge

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx:29-216`
- Test: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts:385-397`

**Interfaces:**
- Consumes: `CASE_STUDY_CHAPTERS["fresh-greens"][0]` as `fg-problem` and `[1]` as `fg-research`.
- Consumes: the verified counts in `src/lib/fresh-greens/research-synthesis-data.ts:15-78`.
- Produces: a hero thesis, a sourced historical link, a personal-origin-to-research bridge, and a compact three-item research synthesis using the existing `.fg-evidence-boundaries` visual language.
- Produces: `RecruiterCut.evidence.href === "#fg-pulled-over"` and an empty `moves` array so the three problems are not repeated before the Research chapter.

- [ ] **Step 1: Replace the old opener assertion with failing factual and structural tests**

In `prose-structure.test.ts`, replace `anchors the opener to the informed-driving goal and interview evidence` with tests that use `normalizeCopy(readPage())` and require the approved thesis, origin, hypothesis boundary, Green Book source, and three problem labels:

```ts
it("moves from Myles's experience to a research-backed three-problem brief", () => {
  const source = readPage();
  const copy = normalizeCopy(source);

  expect(copy).toContain(
    "Fresh Greens brings the safety knowledge Black drivers already use into route planning.",
  );
  expect(copy).toContain("I grew up in Brooklyn");
  expect(copy).toContain("moved to rural South Jersey around age ten");
  expect(copy).toContain("Confederate flags on front lawns");
  expect(copy).toContain("a police stop or car trouble");
  expect(copy).toContain("Google Maps or Apple Maps");
  expect(copy).toContain("That experience gave me a hypothesis, not proof.");
  expect(copy).toContain("I interviewed six Black drivers");

  expect(source).toContain(
    'href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america"',
  );
  expect(copy).toContain("Plan");
  expect(copy).toContain("Respond");
  expect(copy).toContain("Trust");
  expect(copy).toContain("6 of 6 connected trip timing to daylight");
  expect(copy).toContain("5 of 6 raised road conditions");
  expect(copy).toContain("5 of 6 raised police presence");
  expect(copy).toContain("3 of 6 raised wildlife");
  expect(copy).toContain(
    "5 of 6 asked family or friends before trusting an unfamiliar place",
  );
  expect(copy).toContain(
    "These interviews widened my hypothesis. They do not represent every Black driver.",
  );
});

it("retires the four-tab taxonomy from the primary research path", () => {
  const source = readPage();

  expect(source).not.toContain("<ResearchSynthesis");
  expect(source).not.toContain("Four recurring signals shaped the route model");
  expect(source.match(/className="fg-evidence-boundary"/g)).toHaveLength(3);
  expect(source).toContain('moves={[]}');
});
```

Keep the existing project-card truthfulness assertion unchanged.

- [ ] **Step 2: Run the focused test and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts
```

Expected: FAIL because the current page has no personal origin, no explicit hypothesis boundary, no historical source link, a four-tab synthesis, and no three-problem research summary.

- [ ] **Step 3: Rewrite the hero, Frame, and Research chapters**

Keep `LeadMedia`, role, timeline, tools, outcome, and CTA. Replace the hero lede with:

```tsx
<p className="project-hero-lede fg-lede">
  Fresh Greens brings the safety knowledge Black drivers already use into
  route planning. I turned six interviews into a working React Native
  prototype for choosing a route, handling stressful moments, and
  understanding where its information came from.
</p>
```

Set `RecruiterCut` to `moves={[]}`. Do not repeat the three-problem list in the hero or recruiter cut.

Write the Frame chapter as three compact paragraphs:

```tsx
<div className="project-section-body">
  <p>
    I grew up in Brooklyn and moved to rural South Jersey around age ten.
    Confederate flags on front lawns made night driving feel exposing,
    especially if I imagined a police stop or car trouble in a place where
    asking for help might not feel safe.
  </p>
  <p>
    I still used Google Maps or Apple Maps, then carried the rest myself. On
    unfamiliar night routes, I avoided backroads, drove comfortably below the
    speed limit, kept my wallet within reach, and watched the road and
    everything around it. That experience gave me a hypothesis, not proof. I
    interviewed six Black drivers to see what carried beyond my own route.
  </p>
  <p>
    The Green Book used the publishing medium available in its era to help
    Black travelers find places that would serve them. I use that history as
    design lineage, not as evidence that Fresh Greens is its digital
    successor. The project asks what that principle looks like inside
    navigation products people already use.{" "}
    <a
      href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america"
      rel="noreferrer"
      target="_blank"
    >
      Source: Smithsonian National Museum of African American History and Culture
    </a>
    .
  </p>
</div>
```

This historical paragraph is under 100 words and points to the Smithsonian's [Traveling Through Jim Crow America](https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america) page.

Replace `ResearchSynthesis`, the thesis pullquote, the storyboard, and the old evidence-boundary copy with one lead and three existing evidence-boundary cells:

```tsx
<p className="case-section-lead">
  The interviews did not describe broken habits waiting for a product to fix
  them. Participants already had useful ways to plan, prepare, and decide whom
  to trust. Their answers widened my hypothesis into three product problems.
</p>

<div
  className="fg-evidence-boundaries"
  aria-label="Three Fresh Greens product problems"
>
  <div className="fg-evidence-boundary">
    <p className="fg-evidence-label">Plan</p>
    <p>
      Drivers could not inspect every route before choosing. 6 of 6 connected
      trip timing to daylight, 5 of 6 raised road conditions, 5 of 6 raised
      police presence, and 3 of 6 raised wildlife.
    </p>
  </div>
  <div className="fg-evidence-boundary">
    <p className="fg-evidence-label">Respond</p>
    <p>
      Unexpected problems became harder to handle after stress was already
      high. Participants described preparing for police encounters and keeping
      help close when something went wrong.
    </p>
  </div>
  <div className="fg-evidence-boundary">
    <p className="fg-evidence-label">Trust</p>
    <p>
      Useful community knowledge lived outside navigation. 5 of 6 asked family
      or friends before trusting an unfamiliar place.
    </p>
  </div>
</div>

<div className="project-section-body">
  <p>
    These interviews widened my hypothesis. They do not represent every Black
    driver.
  </p>
</div>
```

Remove the now-unused `ResearchSynthesis` import. Do not remove its component or component tests because the artifact remains valid optional-depth code outside the primary route.

- [ ] **Step 4: Verify the Frame and Research change**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/lib/fresh-greens/__tests__/research-synthesis-data.test.ts
npx tsc --noEmit
git diff --check
```

Expected: PASS for the new origin, source, research counts, sample qualifier, and three-problem structure. The synthesis-data test remains green because the verified counts did not change.

- [ ] **Step 5: Commit the narrative bridge**

```bash
git add src/app/work/fresh-greens/page.tsx src/app/work/fresh-greens/__tests__/prose-structure.test.ts
git commit -m "feat: connect Fresh Greens origin to three problems"
```

---

### Task 2: Give Plan, Respond, and Trust exclusive artifact ownership

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx:218-482`
- Modify: `src/components/fresh-greens/pivot-journey.tsx:7-14,72-96`
- Modify: `src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts:11-87`
- Modify: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts:198-351`
- Create: `src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx`

**Interfaces:**
- Consumes: the six-entry shared chapter map and the unchanged `ProjectChapter({ entry, index, total, variant, children })` interface.
- Consumes: `PivotJourney(): JSX.Element`, `ArchitectureDiagram(): JSX.Element`, and `PulledOverJourney(): JSX.Element`.
- Produces: exactly one `ProjectChapter` per registry entry, in registry order.
- Produces: `#fg-design` containing `PivotJourney` and `ArchitectureDiagram`, `#fg-pulled-over` containing `PulledOverJourney`, and `#fg-trust` containing one `report-detail` phone plus the existing moderation flow.
- Removes from the primary page: `LeadVideo`, `OnboardingIllustrationSequence`, `TokenExhibit`, `ReservedPalette`, the thesis storyboard, the standalone `en-route` phone, the standalone `route-preview` phone, and the `report-picker` phone.

- [ ] **Step 1: Add a rendered artifact-ownership test**

Create `narrative-ownership.test.tsx` with page-level mocks that expose the artifact positions without retesting each artifact's internal behavior:

```tsx
import type { ReactNode } from "react";
import { render, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";

const getProjectBySlug = vi.fn();
const getPublishedProjects = vi.fn();

vi.mock("@/lib/content", () => ({
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => getPublishedProjects(),
}));

vi.mock("@/components/site-nav", () => ({
  SiteNav: () => <nav aria-label="Primary" />,
}));
vi.mock("@/components/project-toc", () => ({
  ProjectToc: () => <nav data-testid="project-toc" />,
}));
vi.mock("@/components/project-work-jump", () => ({
  ProjectWorkJump: () => <nav data-testid="project-work-jump" />,
}));
vi.mock("@/components/case-highlight-observer", () => ({
  CaseHighlightObserver: () => <div data-testid="highlight-observer" />,
}));
vi.mock("@/components/lead-media", () => ({
  LeadMedia: () => <figure data-testid="lead-media" />,
}));
vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ alt }: { alt: string }) => <span role="img" aria-label={alt} />,
}));
vi.mock("@/components/fresh-greens", () => ({
  ArchitectureDiagram: () => <figure data-testid="architecture-diagram" />,
  PhoneFrame: ({ children }: { children: ReactNode }) => (
    <div data-testid="phone-frame">{children}</div>
  ),
}));
vi.mock("@/components/fresh-greens/pivot-journey", () => ({
  PivotJourney: () => <figure data-testid="pivot-journey" />,
}));
vi.mock("@/components/fresh-greens/pulled-over-journey", () => ({
  PulledOverJourney: () => <section data-testid="pulled-over-journey" />,
}));
vi.mock("@/components/fresh-greens/research-synthesis", () => ({
  ResearchSynthesis: () => <section data-testid="research-synthesis" />,
}));
vi.mock("@/components/fresh-greens/onboarding-illustration-sequence", () => ({
  OnboardingIllustrationSequence: () => <figure data-testid="onboarding-sequence" />,
}));
vi.mock("@/components/fresh-greens/token-exhibit", () => ({
  TokenExhibit: () => <figure data-testid="token-exhibit" />,
}));

import FreshGreensPage from "@/app/work/fresh-greens/page";

const project: Project = {
  slug: "fresh-greens",
  title: "Fresh Greens",
  summary: "Summary",
  role: "Product Designer",
  timeframe: "2025",
  status: "published",
  order: 1,
  tags: [],
  sections: [],
  bodyHtml: "",
};

function chapter(container: HTMLElement, id: string) {
  const heading = container.querySelector(`#${id}`);
  const owner = heading?.closest<HTMLElement>(".project-chapter");
  expect(owner, `${id} chapter`).not.toBeNull();
  return owner as HTMLElement;
}

describe("Fresh Greens rendered narrative ownership", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getProjectBySlug.mockResolvedValue(project);
    getPublishedProjects.mockResolvedValue([project]);
  });

  it("gives Plan, Respond, and Trust the approved evidence", async () => {
    const { container } = render(await FreshGreensPage());
    const plan = chapter(container, "fg-design");
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");

    expect(within(plan).getByTestId("pivot-journey")).toBeInTheDocument();
    expect(within(plan).getByTestId("architecture-diagram")).toBeInTheDocument();
    expect(within(plan).queryByTestId("pulled-over-journey")).not.toBeInTheDocument();

    expect(within(respond).getByTestId("pulled-over-journey")).toBeInTheDocument();
    expect(within(respond).queryByTestId("pivot-journey")).not.toBeInTheDocument();

    expect(
      within(trust).getByRole("img", {
        name: /Felt welcome contribution form/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(trust).queryByRole("img", { name: /report picker/i }),
    ).not.toBeInTheDocument();
    expect(
      within(trust).getByLabelText("How a report moves through moderation"),
    ).toBeInTheDocument();

    expect(container.querySelectorAll(".project-chapter")).toHaveLength(6);
    expect(container.querySelectorAll("#fg-pulled-over")).toHaveLength(1);
    expect(container.querySelectorAll(".project-evidence-heading")).toHaveLength(0);
    expect(container.querySelector('[data-testid="research-synthesis"]')).toBeNull();
    expect(container.querySelector('[data-testid="onboarding-sequence"]')).toBeNull();
    expect(container.querySelector('[data-testid="token-exhibit"]')).toBeNull();
  });
});
```

- [ ] **Step 2: Run ownership and stage-map tests and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts
```

Expected: FAIL because the current Plan chapter owns the pulled-over interaction, the old Refine chapter owns the pivot, Trust renders two report phones, and `fg-pulled-over` is still a nested evidence heading instead of chapter four.

- [ ] **Step 3: Recompose the three problem chapters**

Make chapter three the complete Plan loop:

```tsx
<ProjectChapter
  entry={chapters[2]}
  index={3}
  total={chapters.length}
  variant="fresh-greens"
>
  <section className="project-section fg-section fg-section--wide">
    <div className="project-section-body">
      <p>
        Participants were already timing trips around daylight, avoiding
        certain roads, and comparing clues outside the map. Standard route
        choices optimized time and distance, so drivers carried the rest of
        the comparison themselves.
      </p>
      <p>
        Fresh Greens needed to let someone inspect alternatives before
        committing. I moved from a Google Maps feature to a standalone route
        preview, then used a deterministic scoring layer to turn public and
        community inputs into route chips and source cards. The prototype can
        explain why it prefers one route. It does not prove that route is safer.
      </p>
    </div>
    <PivotJourney />
    <ArchitectureDiagram />
  </section>
</ProjectChapter>
```

Make chapter four the complete Respond loop. Remove the nested `h3#fg-pulled-over` so the shared `ProjectChapter` heading is the only instance of that ID:

```tsx
<ProjectChapter
  entry={chapters[3]}
  index={4}
  total={chapters.length}
  variant="fresh-greens"
>
  <section className="project-section fg-section fg-section--wide">
    <div className="project-section-body">
      <p>
        Before a trip, participants described preparing for police encounters.
        Once stress is already high, a driver should not have to search through
        navigation controls or interpret forceful copy. I kept four support
        paths behind one thumb-reachable control and hidden until requested.
      </p>
    </div>
    <PulledOverJourney />
    <div className="project-section-body">
      <p>
        In the prototype, pulled-over guidance starts recording, puts
        reassurance before the next decision, keeps questions in regular
        weight, and leaves trusted-contact actions visible. Roadside help,
        unfamiliar-area guidance, location sharing, and emergency steps are
        available offline. This is prototype behavior, not evidence that it
        improves an encounter.
      </p>
    </div>
  </section>
</ProjectChapter>
```

Make chapter five own one report-detail phone and the existing moderation markup. Remove the `.fg-color-pair` wrapper and the `report-picker` figure. Keep the report detail in the existing centered `.fg-safety-visual` treatment:

```tsx
<figure className="fg-safety-visual">
  <PhoneFrame variant="screenshot">
    <Shot
      name="report-detail"
      alt="The Fresh Greens Felt welcome contribution form over the en-route map, with place-type chips, welcoming-reason chips, an optional experience field, and a green Share your experience button with black text."
    />
  </PhoneFrame>
  <figcaption className="fg-safety-visual-caption">
    Structured tags keep the account specific, while the written field lets a
    contributor add context.
  </figcaption>
</figure>
```

Move the existing `fg-moderation` block immediately after that figure without changing its three stage labels or accessible connector spans.

Delete the old nested evidence sections and remove these imports from `page.tsx`:

```ts
LeadVideo
ReservedPalette
OnboardingIllustrationSequence
TokenExhibit
```

Also delete the page uses of `thesis-zone-flow.png`, `name="en-route"`, and the standalone `name="route-preview"`. Keep the `Shot` helper because Trust still uses `report-detail`.

- [ ] **Step 4: Make the pivot captions carry the relevant craft decisions**

In `pivot-journey.tsx`, keep the component API, two phone images, reveal behavior, and accessibility semantics unchanged. Replace only the two captions:

```tsx
<p className="fg-pivot-caption">
  I first added the safety layer to Google Maps. It put controls on the map,
  but those signals still felt secondary and route comparison had no structure
  of its own.
</p>
```

```tsx
<p className="fg-pivot-caption">
  The standalone preview puts daylight, route status, and trusted places at the
  choice point. Reserved safety colors keep warnings distinct, while the
  sun-to-moon route shows how light changes before arrival.
</p>
```

Update the component comment to describe the problem-led purpose instead of saying the reveal matches the retired token exhibit.

- [ ] **Step 5: Replace old evidence-heading source contracts**

In `toc-stage-map.test.ts`, stop restating the shared chapter titles. Consume the shared array and assert page composition:

```ts
it("renders one ordered ProjectChapter for every shared Fresh Greens entry", () => {
  expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toHaveLength(6);
  expect(pageSource).toContain(
    'const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];',
  );
  expect(pageSource).toContain('readingEndId="fg-scope"');

  expect(
    Array.from(
      pageSource.matchAll(
        /<ProjectChapter\s+entry=\{chapters\[(\d)\]\}\s+index=\{(\d)\}\s+total=\{chapters\.length\}\s+variant="fresh-greens"\s*>/g,
      ),
      ([, entry, index]) => ({ entry: Number(entry), index: Number(index) }),
    ),
  ).toEqual([
    { entry: 0, index: 1 },
    { entry: 1, index: 2 },
    { entry: 2, index: 3 },
    { entry: 3, index: 4 },
    { entry: 4, index: 5 },
    { entry: 5, index: 6 },
  ]);
  expect(pageSource).not.toContain('className="project-evidence-heading"');
});
```

In `prose-structure.test.ts`, replace the old five-evidence-heading, every-artifact, Refine, video, and duplicate-phone assertions with the approved primary artifact inventory:

```ts
it("keeps only decision-bearing artifacts in the five-minute path", () => {
  const source = readPage();

  for (const component of [
    "PivotJourney",
    "ArchitectureDiagram",
    "PulledOverJourney",
  ]) {
    expect(source).toContain(`<${component}`);
  }
  for (const retired of [
    "ResearchSynthesis",
    "LeadVideo",
    "OnboardingIllustrationSequence",
    "TokenExhibit",
    "ReservedPalette",
  ]) {
    expect(source).not.toContain(`<${retired}`);
  }
  expect(source).toContain('name="report-detail"');
  expect(source).not.toContain('name="report-picker"');
  expect(source).not.toContain('name="en-route"');
  expect(source).not.toContain('name="route-preview"');
  expect(source).not.toContain("thesis-zone-flow.png");
});
```

Retain the existing moderation connector assertions, architecture source-boundary assertions, project-card summary assertion, and component-level interaction tests.

- [ ] **Step 6: Run focused ownership and component tests**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx src/components/fresh-greens/__tests__/architecture-diagram.test.tsx
npx tsc --noEmit
git diff --check
```

Expected: PASS with six chapters, unique anchors, the recruiter CTA still landing on the Respond chapter, and all unchanged artifact interaction tests green.

- [ ] **Step 7: Commit the artifact ownership change**

```bash
git add src/app/work/fresh-greens/page.tsx src/components/fresh-greens/pivot-journey.tsx src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
git commit -m "feat: assign Fresh Greens evidence to three problems"
```

---

### Task 3: State the community trust rule and current scoring limitation

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx:408-482`
- Test: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts:360-445`
- Test: `src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx`

**Interfaces:**
- Consumes: the Trust chapter and contribution-to-decision exhibit from Task 2.
- Produces: the canonical sparse-area rule, four intended trust states, the exact current one-report limitation, and explicit provenance and trust-level limits.
- Preserves: `trusted contacts` in Respond and `community contributors` in Trust as separate concepts.

- [ ] **Step 1: Add failing trust-model and implementation-limit tests**

Add a chapter extraction helper to `prose-structure.test.ts`:

```ts
function chapterBody(source: string, index: number) {
  const body = source.match(
    new RegExp(
      `<ProjectChapter\\s+entry=\\{chapters\\[${index}\\]\\}[\\s\\S]*?>([\\s\\S]*?)<\\/ProjectChapter>`,
    ),
  )?.[1];
  expect(body, `chapter ${index + 1} body`).toBeDefined();
  return normalizeCopy(body ?? "");
}
```

Then add:

```ts
it("states the intended trust model without presenting it as built behavior", () => {
  const page = readPage();
  const respond = chapterBody(page, 3);
  const trust = chapterBody(page, 4);

  expect(respond).toContain("trusted-contact actions");
  expect(trust).toContain("community contributors");
  expect(`${respond} ${trust}`).not.toMatch(/trusted agents/i);
  expect(trust).toContain(
    "A single account is never hidden or treated as proof. Corroboration increases its route influence, while limited coverage is disclosed as uncertainty rather than interpreted as safety.",
  );
  expect(trust).toContain("Every firsthand account remains visible as one person's account");
  expect(trust).toContain(
    "Similar reports from separate community contributors across time gain more influence",
  );
  expect(trust).toContain(
    "A time-sensitive hazard can surface sooner when waiting would make it useless",
  );
  expect(trust).toContain(
    "Sparse coverage stays labeled as uncertainty, never as a positive safety signal",
  );
});

it("names the current one-report scoring limit and unfinished trust surfaces", () => {
  const trust = chapterBody(readPage(), 4);

  expect(trust).toContain("the prototype maps one report to one scored zone");
  expect(trust).toContain("a single report can affect route ranking now");
  expect(trust).toContain(
    "Corroboration-weighted ranking is an intended safeguard, not a built feature",
  );
  expect(trust).toContain(
    "do not yet show visible contributor provenance or differentiated trust levels",
  );
  expect(trust).toContain(
    "Public datasets still matter because their source and scope can be inspected",
  );
});
```

Extend the rendered Trust assertion in `narrative-ownership.test.tsx`:

```tsx
expect(within(trust).getByText("Current prototype limit:")).toBeInTheDocument();
expect(trust).toHaveTextContent("one report to one scored zone");
expect(trust).toHaveTextContent("Corroboration-weighted ranking");
```

- [ ] **Step 2: Run the trust tests and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
```

Expected: FAIL because the current Trust copy explains moderation mechanics but does not state the sparse-area rule, the four intended states, the single-report route-ranking limitation, or the unfinished provenance and trust-level surfaces.

- [ ] **Step 3: Write the complete Trust loop**

Place this copy before the report-detail phone:

```tsx
<div className="project-section-body">
  <p>
    Five of six participants said they asked family or friends before trusting
    an unfamiliar place. Public datasets still matter because their source and
    scope can be inspected, but they cannot describe how a town or street felt
    to someone who moved through it. I kept each firsthand account specific
    instead of flattening it into an official-looking fact.
  </p>
  <p>
    A single account is never hidden or treated as proof. Corroboration
    increases its route influence, while limited coverage is disclosed as
    uncertainty rather than interpreted as safety. Every firsthand account
    remains visible as one person&apos;s account. Similar reports from separate
    community contributors across time gain more influence. A time-sensitive
    hazard can surface sooner when waiting would make it useless. Sparse
    coverage stays labeled as uncertainty, never as a positive safety signal.
  </p>
  <p>
    <strong>Current prototype limit:</strong> the prototype maps one report to
    one scored zone, so a single report can affect route ranking now.
    Corroboration-weighted ranking is an intended safeguard, not a built
    feature. The report and moderation screens below show contribution and
    review. They do not yet show visible contributor provenance or
    differentiated trust levels.
  </p>
</div>
```

Keep the existing moderation stage labels `Enters`, `Investigation panel`, and `Human decision`. Do not imply that source-device, duplicate-IP, or nearby-report checks already create contributor trust levels.

- [ ] **Step 4: Verify the trust boundary and existing moderation semantics**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx src/components/fresh-greens/__tests__/pulled-over-journey.test.tsx
npx tsc --noEmit
git diff --check
```

Expected: PASS. The rendered page distinguishes trusted contacts from community contributors, sparse areas remain uncertainty, and intended ranking safeguards are not described as current behavior.

- [ ] **Step 5: Commit the trust model**

```bash
git add src/app/work/fresh-greens/page.tsx src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
git commit -m "feat: clarify Fresh Greens trust and scoring limits"
```

---

### Task 4: Close on demonstrated evidence and enforce the five-minute budget

**Files:**
- Modify: `src/app/work/fresh-greens/page.tsx:484-543`
- Modify: `src/app/work/fresh-greens/__tests__/prose-structure.test.ts:1-180,408-464`
- Test: `src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx`

**Interfaces:**
- Consumes: the complete Frame, Research, Plan, Respond, and Trust chapters from Tasks 1 through 3.
- Produces: an `Impact now` and `What remains` evidence ledger with one line per problem.
- Produces: an automated primary-path ceiling of 950 words across `page.tsx`, `pivot-journey.tsx`, and `pulled-over-journey.tsx`.
- Preserves: `ProjectToc readingEndId="fg-scope"`, `ProjectWorkJump`, and `CaseHighlightObserver`.

- [ ] **Step 1: Add failing evidence-close and prose-budget tests**

Change `readerFacingFiles` so unused optional-depth components no longer count against the primary route:

```ts
const primaryPathFiles = [
  pagePath,
  resolve(
    process.cwd(),
    "src/components/fresh-greens/pivot-journey.tsx",
  ),
  resolve(
    process.cwd(),
    "src/components/fresh-greens/pulled-over-journey.tsx",
  ),
];
```

Keep the existing TypeScript-AST extraction, rename `readerFacingWordCount` to `primaryPathWordCount`, and replace the old 1,400-word minimum and 1,750-word maximum with a ceiling only:

```ts
it("keeps the complete primary path within the 950-word ceiling", () => {
  const wordCount = primaryPathWordCount(primaryPathFiles);

  expect(
    wordCount,
    `Fresh Greens primary path is ${wordCount} words; target is 800 to 950`,
  ).toBeLessThanOrEqual(950);
});
```

Do not add `toBeGreaterThanOrEqual(800)`. The implementation target remains 800 to 950, but the automated contract should not reward adding filler.

Replace the exact old closing-sentence assertion with:

```ts
it("leads the close with demonstrated behavior and separates remaining proof", () => {
  const scope = chapterBody(readPage(), 5);

  expect(scope).toContain("Impact now");
  expect(scope).toContain("What remains");
  expect(scope.indexOf("Impact now")).toBeLessThan(scope.indexOf("What remains"));
  expect(scope).toContain(
    "a working React Native prototype spanning route comparison, en-route guidance, stress-state support, community reporting, and moderation",
  );
  expect(scope).toContain("can explain why it prefers one route");
  expect(scope).toContain("before making any claim that a preferred route is safer");
  expect(scope).not.toMatch(/improves safety|made drivers safer|a safer route recommendation/i);
});
```

Extend the rendered test to assert the two evidence labels and the recruiter CTA:

```tsx
expect(within(chapter(container, "fg-scope")).getByText("Impact now")).toBeInTheDocument();
expect(within(chapter(container, "fg-scope")).getByText("What remains")).toBeInTheDocument();
expect(
  container.querySelector('a[href="#fg-pulled-over"]'),
).not.toBeNull();
```

- [ ] **Step 2: Run the close and budget tests and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
```

Expected: FAIL because the current scope ledger has four uneven implementation bullets, no `Impact now` label, no one-line-per-problem mapping, the old closer ends on a repeated safety caveat, and the old word-count helper still rewards length.

- [ ] **Step 3: Replace the scope ledger with three demonstrated and three unproven lines**

Use the existing `.fg-scope-grid`, `.fg-scope-col`, `.fg-scope-label`, and `.fg-scope-list` classes:

```tsx
<div className="project-section-body">
  <p>
    Six interviews became a working React Native prototype spanning route
    comparison, en-route guidance, stress-state support, community reporting,
    and moderation. The product can explain why it prefers one route. That
    makes the design decisions inspectable, not proven safer.
  </p>
</div>

<div className="fg-scope-grid">
  <div className="fg-scope-col">
    <p className="fg-scope-label">Impact now</p>
    <ul className="fg-scope-list" role="list">
      <li>
        Plan: route comparison and en-route guidance explained through chips
        and source cards
      </li>
      <li>
        Respond: one-thumb, offline support for pulled-over, roadside,
        unfamiliar-area, location-sharing, and emergency states
      </li>
      <li>
        Trust: community contribution and moderation flows that keep
        firsthand reports reviewable instead of presenting them as verified
        facts
      </li>
    </ul>
  </div>
  <div className="fg-scope-col">
    <p className="fg-scope-label">What remains</p>
    <ul className="fg-scope-list" role="list">
      <li>
        Plan: route-quality testing with more Black drivers across regions
        before making any claim that a preferred route is safer
      </li>
      <li>
        Respond: stress-state and failure-mode testing on real devices and
        configured builds
      </li>
      <li>
        Trust: corroboration-weighted ranking, visible contributor provenance,
        differentiated trust levels, and a public moderation transparency page
      </li>
    </ul>
  </div>
</div>

<div className="project-section-body fg-scope-closer">
  <p>
    Building the full route-and-safety flow made the research inspectable. I
    can point to where each interview theme changed the product, then test
    those decisions with more drivers instead of treating the prototype as the
    answer.
  </p>
</div>
```

Remove repeated implementation inventories such as source-name lists, Figma-variable counts, accessibility-attribute counts, and configured-action detail from the close. Those facts do not earn another stop in the five-minute path.

- [ ] **Step 4: Verify the full Fresh Greens slice**

Run:

```bash
npm test -- src/app/work/fresh-greens/__tests__ src/components/fresh-greens/__tests__ src/lib/fresh-greens/__tests__
npx tsc --noEmit
git diff --check
```

Expected: PASS. The word-count assertion reports no more than 950 words, all six chapters render, the CTA lands on the Respond chapter, artifact interactions remain green, and evidence qualifiers remain intact.

Review the word-count diagnostic in the test if it fails. Edit for clarity until the measured primary path is between 800 and 950 words. Do not pad copy merely to reach 800.

- [ ] **Step 5: Commit the evidence close**

```bash
git add src/app/work/fresh-greens/page.tsx src/app/work/fresh-greens/__tests__/prose-structure.test.ts src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
git commit -m "feat: close Fresh Greens on evidence and limits"
```

## Final Verification

- [ ] **Run the shared dependency tests first**

```bash
npm test -- src/lib/__tests__/project-chapters.test.ts src/app/work/__tests__/case-study-tocs.test.ts src/app/work/fresh-greens/__tests__/toc-daylight-arc.test.ts src/app/work/__tests__/lead-media-dimensions.test.ts
```

Expected: PASS. If these fail, classify the result against the separate shared task before touching any file it owns.

- [ ] **Run the complete Fresh Greens verification slice**

```bash
npm test -- src/app/work/fresh-greens/__tests__ src/components/fresh-greens/__tests__ src/lib/fresh-greens/__tests__ src/app/work/__tests__/dedicated-route-visibility.test.tsx
```

Expected: PASS with no React warnings, duplicate IDs, missing CTA target, or changed artifact interaction behavior.

- [ ] **Run repository gates sequentially**

```bash
npm run build
npx tsc --noEmit
npm run lint
npm run validate:content
npm test
git diff --check
```

Expected: every command exits 0. Run these sequentially because lint and the test runner inspect shared transient files in this repository.

- [ ] **Run the Myles voice and AI-writing audit**

Load the `ai-slop` skill and review the complete changed prose, not isolated lines. Then run:

```bash
git diff -U0 -- src/app/work/fresh-greens/page.tsx src/components/fresh-greens/pivot-journey.tsx | rg '^\+.*(—|…|passionate about|remarkable|innovative|seamless|cutting-edge|That is the work|That is the point)'
git diff -U0 -- src/app/work/fresh-greens/page.tsx src/components/fresh-greens/pivot-journey.tsx | rg '^\+.*;'
```

Expected: the first command returns no matches. Review every second-command match and confirm it is TypeScript syntax rather than rendered prose. Re-read for rhetorical question-and-answer framing, repeated antithesis, structural rhyming across Plan/Respond/Trust, and a slogan-like final line.

- [ ] **Run the Impeccable detector once on the completed UI diff**

After all code changes are complete, load the Impeccable skill and run its detector exactly once:

```bash
node /Users/mylesashitey/.codex/plugins/cache/impeccable/impeccable/4.0.3/skills/impeccable/scripts/detect.mjs --json src/app/work/fresh-greens/page.tsx src/components/fresh-greens/pivot-journey.tsx
```

Expected: no P0 or P1 findings caused by this diff. Do not rerun the detector in the same execution session. Inspect any reported finding against the rendered page before classifying it.

- [ ] **Review the rendered route across the required state matrix**

Run the production build locally and inspect `/work/fresh-greens` at 390px, 768px, 1440px, and at least 1600px in light and dark themes. Repeat the affected rows with reduced motion.

Verify all of the following:

- At 390px, `document.documentElement.scrollHeight / window.innerHeight` is between 13 and 15 after fonts and reveal motion settle.
- The Frame chapter reaches the personal origin before the historical reference dominates the viewport.
- The Research grid stacks as Plan, Respond, Trust and preserves the five verified counts.
- Plan owns the two-phone pivot and architecture diagram without a duplicate route-preview phone.
- Respond owns the recruiter CTA target and the complete pulled-over interaction.
- Trust renders one report-detail phone, the moderation flow, the sparse-area rule, and the current one-report limitation.
- The six daylight stages remain legible. At 1440px, the shared task keeps the horizontal TOC instead of showing truncated flyout labels.
- The page contains 6 to 8 primary evidence figures or figure groups. Hidden PulledOver states do not count as separate narrative stops.
- All reveal-based artifacts are inspected only after their longest transition plus a small buffer has elapsed.
- Keyboard focus reaches the historical source, TOC, architecture scroller, image expansion, and pulled-over controls.

- [ ] **Request independent code review**

Use `superpowers:requesting-code-review` or the code-reviewer agent on these files:

```text
src/app/work/fresh-greens/page.tsx
src/components/fresh-greens/pivot-journey.tsx
src/app/work/fresh-greens/__tests__/prose-structure.test.ts
src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts
src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
```

The reviewer must check claim boundaries, chapter and artifact ownership, duplicate IDs, the current one-report limitation, sparse-area language, the word ceiling, and accidental reliance on files owned by the shared task. Address P0 and P1 findings before handoff.

- [ ] **Confirm atomic commit and file scope**

```bash
git log --oneline -4
git diff --name-only HEAD~4..HEAD
git status --short
```

Expected commits:

```text
feat: connect Fresh Greens origin to three problems
feat: assign Fresh Greens evidence to three problems
feat: clarify Fresh Greens trust and scoring limits
feat: close Fresh Greens on evidence and limits
```

Expected changed files from this plan:

```text
src/app/work/fresh-greens/page.tsx
src/components/fresh-greens/pivot-journey.tsx
src/app/work/fresh-greens/__tests__/prose-structure.test.ts
src/app/work/fresh-greens/__tests__/toc-stage-map.test.ts
src/app/work/fresh-greens/__tests__/narrative-ownership.test.tsx
```

Shared chapter files, shared CSS, shared TOC tests, and shared lead-media tests must not appear in this plan's commits.

## Self-Review Coverage

- Personal origin, immediate fears, existing navigation behavior, and hypothesis boundary: Task 1.
- Green Book lineage under 100 words with an authoritative source: Task 1.
- Six interviews, verified counts, sample qualifier, and compact Plan/Respond/Trust synthesis: Task 1.
- Six problem-led chapters and unique `fg-pulled-over` ownership: shared dependency plus Task 2.
- Plan's pivot, architecture support, daylight caption, reserved-color caption, and route-explanation boundary: Task 2.
- Respond's one-thumb access, hidden-until-needed behavior, calm question weight, offline support, and interaction: Task 2.
- Trust's community-contributor language, four intended states, sparse-area rule, one-report implementation limit, provenance limit, report detail, and moderation: Task 3.
- Impact now, What remains, working-prototype boundary, 800-to-950 target, and no safer-route claim: Task 4.
- Shared TOC breakpoint, daylight CSS, chapter registry, shared evidence IDs, and lead-video test retirement: required shared-task dependency.
- No placeholder implementation steps, undefined interfaces, shared-file edits, new dependency, new visual identity, product-repository ranking work, or deployment are included.
