# TikTok Four-Beat Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the TikTok page the shortest portfolio case study by defining Dynamic Showcase Ads and Myles's assignment first, then telling the work in four factual beats: Brief, Choose, Build, and Deliver.

**Architecture:** The route remains a server-rendered Next.js page backed by `CASE_STUDY_CHAPTERS.tiktok` and `TIKTOK_TEMPLATES`. A separate shared-chapter task supplies the four canonical chapter entries. This plan only composes those entries, adds one page-local CSS module for the brief facts, and strengthens TikTok-specific rendered and truthfulness tests.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, Vitest, Testing Library.

## Global Constraints

- Work from `/Users/mylesashitey/.codex/worktrees/86e3/myles-portfolio-migration`.
- Keep this page shorter than the other case studies. Do not add a fifth chapter, a new reflection section, or another summary scaffold.
- Keep the recruiter CTA pointed at `#tt-system`.
- Keep the confirmed title `Creative Strategist Intern` and team `Global Creative Lab`.
- Describe the three outputs as static template directions delivered as layered Photoshop files.
- Keep review notes as paraphrases. Do not render them as quotations or blockquotes.
- Do not imply that Myles worked directly with American Eagle, owned downstream production, or measured ad performance.
- Use this exact relationship sentence: `I later learned through Global Creative Lab that American Eagle selected it.`
- Do not modify `src/lib/project-chapters.ts`, `src/lib/__tests__/project-chapters.test.ts`, or `src/app/work/__tests__/case-study-tocs.test.ts`. A separate shared task owns them.
- Do not modify `src/app/styles/base.css`, `src/app/styles/late-polish.css`, or `src/app/styles/portfolio-surfaces.css`. Use the page-local CSS module named below.
- Preserve the existing `TikTokTemplateSystem`, three sketch and final-template artifact cards, Light Academia assets, work jump, and highlight observer.
- Candidate-facing copy must follow `/Users/mylesashitey/career-ops/MYLES-WRITING-STYLE.md`: no em dashes, semicolons, ellipses, hype language, or unsupported claims.

## Required Shared-Task Dependency

The shared chapter task must land before Task 1 can pass. It owns this interface:

```ts
CASE_STUDY_CHAPTERS.tiktok.map(({ id, stage }) => ({ id, stage }))
// [
//   { id: "tt-brief", stage: "Brief" },
//   { id: "tt-research", stage: "Choose" },
//   { id: "tt-system", stage: "Build" },
//   { id: "tt-outcome", stage: "Deliver" },
// ]
```

The page-specific tests should consume the shared registry rather than restating its titles. If the dependency has not landed, stop and report that precondition. Do not patch the shared files from this plan.

---

### Task 1: Establish the four-beat route and early DSA brief

**Files:**
- Modify: `src/app/work/tiktok/page.tsx:21-295`
- Create: `src/app/work/tiktok/tiktok-four-beat.module.css`
- Test: `src/app/work/tiktok/__tests__/short-form.test.tsx:83-191`

**Interfaces:**
- Consumes: `CASE_STUDY_CHAPTERS.tiktok`, whose shared-task contract is the four-entry sequence above.
- Produces: four rendered `.project-chapter` sections with heading IDs `tt-brief`, `tt-research`, `tt-system`, and `tt-outcome`.
- Produces: an early semantic `<dl>` with the terms `Role`, `Team`, `Intended use`, `Deliverable`, `Fixed parts`, and `Variable parts`.
- Preserves: `RecruiterCut.evidence.href === "#tt-system"`.

- [ ] **Step 1: Replace the five-chapter assertion with a failing four-beat and brief test**

In `short-form.test.tsx`, replace the test named `frames the route as five one-to-one process chapters` with a rendered contract. Keep the chapter titles dynamic, but assert the approved IDs, stages, count, definition-list semantics, and reading order:

```tsx
it("defines DSA before research and renders the four approved beats", async () => {
  const { container } = render(await TikTokPage());
  const renderedChapters = Array.from(
    container.querySelectorAll<HTMLElement>(".project-chapter"),
  );

  expect(CASE_STUDY_CHAPTERS.tiktok.map(({ id, stage }) => ({ id, stage }))).toEqual([
    { id: "tt-brief", stage: "Brief" },
    { id: "tt-research", stage: "Choose" },
    { id: "tt-system", stage: "Build" },
    { id: "tt-outcome", stage: "Deliver" },
  ]);
  expect(renderedChapters).toHaveLength(4);
  expect(
    renderedChapters.map((chapter) => chapter.querySelector("h2")?.id),
  ).toEqual(["tt-brief", "tt-research", "tt-system", "tt-outcome"]);

  const brief = container.querySelector("#tt-brief")?.closest(".project-chapter");
  const research = container
    .querySelector("#tt-research")
    ?.closest(".project-chapter");
  expect(brief).not.toBeNull();
  expect(research).not.toBeNull();
  expect(brief?.compareDocumentPosition(research as Node)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
  expect(brief).toHaveTextContent(
    "Dynamic Showcase Ads (DSA) used reusable templates with fixed product slots for brand catalog content.",
  );

  const facts = brief?.querySelector("dl");
  expect(facts).not.toBeNull();
  expect(
    Array.from(facts!.querySelectorAll("dt"), (term) => term.textContent),
  ).toEqual([
    "Role",
    "Team",
    "Intended use",
    "Deliverable",
    "Fixed parts",
    "Variable parts",
  ]);
  expect(within(facts as HTMLElement).getByText("Creative Strategist Intern")).toBeInTheDocument();
  expect(within(facts as HTMLElement).getByText("Global Creative Lab")).toBeInTheDocument();
});
```

Do not add an ARIA role that changes the native `<dl>`, `<dt>`, and `<dd>` semantics merely to satisfy the test.

- [ ] **Step 2: Run the focused test and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx
```

Expected: FAIL because the current registry and page render five chapters, there is no `tt-brief` heading, and the opening brief has no definition list.

- [ ] **Step 3: Recompose the page into four chapter shells**

Keep the hero and `RecruiterCut`, then map the page content to exactly four `ProjectChapter` instances. Move existing content rather than duplicating it:

```tsx
<ProjectChapter entry={chapters[0]} index={1} total={chapters.length} variant="tiktok">
  {/* DSA definition and brief facts */}
</ProjectChapter>
<ProjectChapter entry={chapters[1]} index={2} total={chapters.length} variant="tiktok">
  {/* five-to-three selection */}
</ProjectChapter>
<ProjectChapter entry={chapters[2]} index={3} total={chapters.length} variant="tiktok">
  {/* system, limited modularity, sketches, and layered files */}
</ProjectChapter>
<ProjectChapter entry={chapters[3]} index={4} total={chapters.length} variant="tiktok">
  {/* ordered Light Academia outcome */}
</ProjectChapter>
```

The Brief body should begin with:

```tsx
<p>
  Dynamic Showcase Ads (DSA) used reusable templates with fixed product slots
  for brand catalog content.
</p>
```

Render the facts as native description-list markup:

```tsx
<dl className={styles.briefFacts}>
  <div><dt>Role</dt><dd>Creative Strategist Intern</dd></div>
  <div><dt>Team</dt><dd>Global Creative Lab</dd></div>
  <div><dt>Intended use</dt><dd>Reusable templates for brand catalog content</dd></div>
  <div><dt>Deliverable</dt><dd>Three static template directions as layered Photoshop files</dd></div>
  <div><dt>Fixed parts</dt><dd>Product slots and the shared slot map</dd></div>
  <div><dt>Variable parts</dt><dd>Type, color, texture, and supporting graphics</dd></div>
</dl>
```

Do not repeat these six facts in a second paragraph. Keep the hero lede to one or two sentences.

- [ ] **Step 4: Add restrained page-local definition-list styling**

Create `tiktok-four-beat.module.css`. Use a two-column facts grid at wide widths and one column below 640px. Each fact may have a top rule, but no card background, pill, shadow, or decorative icon:

```css
.briefFacts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 1.5rem;
  margin: 1.5rem 0 0;
}

.briefFacts > div {
  border-top: 1px solid var(--line);
  padding: 0.75rem 0 0.9rem;
}

.briefFacts dt {
  color: var(--muted);
  font-size: 0.75rem;
  letter-spacing: var(--track-caps);
  text-transform: uppercase;
}

.briefFacts dd {
  margin: 0.3rem 0 0;
  line-height: var(--lead-copy);
}

@media (max-width: 639px) {
  .briefFacts {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 5: Run focused tests and commit the structural change**

Run:

```bash
npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx
npx eslint src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/short-form.test.tsx
git diff --check
```

Expected: PASS. Inspect the diff and confirm that no shared chapter or shared CSS file is present.

Commit:

```bash
git add src/app/work/tiktok/page.tsx src/app/work/tiktok/tiktok-four-beat.module.css src/app/work/tiktok/__tests__/short-form.test.tsx
git commit -m "feat: frame TikTok case study in four beats"
```

### Task 2: Make the Choose and Build rationale explicit

**Files:**
- Modify: `src/app/work/tiktok/page.tsx:107-221`
- Test: `src/app/work/tiktok/__tests__/short-form.test.tsx:102-216`

**Interfaces:**
- Consumes: `TIKTOK_TEMPLATES`, `TikTokTemplateSystem`, and the existing three sketch and final-template assets.
- Produces: a Choose chapter that names five researched subcultures, the three selected directions, and the selection criterion.
- Produces: a Build chapter ordered as shared anatomy, limited modularity, sketches, layered files, and three final directions.
- Preserves: one rendered `TikTokTemplateSystem` inside the `#tt-system` chapter and three artifact cards headed `#DopamineDressing`, `#e-Boy/#e-Girl`, and `#LightAcademia`.

- [ ] **Step 1: Add a failing rendered rationale and artifact-order test**

Add this focused contract to `short-form.test.tsx`:

```tsx
it("explains why five references became three directions inside one slot map", async () => {
  const { container } = render(await TikTokPage());
  const research = container
    .querySelector("#tt-research")
    ?.closest(".project-chapter") as HTMLElement;
  const system = container
    .querySelector("#tt-system")
    ?.closest(".project-chapter") as HTMLElement;

  expect(research).toHaveTextContent("Y2K");
  expect(research).toHaveTextContent("Maximalism");
  expect(research).toHaveTextContent("Dark Academia");
  expect(research).toHaveTextContent("WitchTok");
  expect(research).toHaveTextContent("Cottagecore");
  expect(research).toHaveTextContent(
    "Three directions moved forward because they created clearly different visual systems inside the same slot map.",
  );
  expect(research).toHaveTextContent("Dopamine Dressing");
  expect(research).toHaveTextContent("e-Boy/e-Girl");
  expect(research).toHaveTextContent("Light Academia");

  expect(within(system).getByTestId("template-system")).toBeInTheDocument();
  expect(
    within(system).getAllByRole("heading", { level: 3 }).map((heading) => heading.textContent),
  ).toEqual(["#DopamineDressing", "#e-Boy/#e-Girl", "#LightAcademia"]);
  expect(within(system).getAllByText("Static template")).toHaveLength(3);
  expect(system).toHaveTextContent("layered Photoshop");
  expect(system).toHaveTextContent(/most parts stayed within their own visual system/i);
});
```

- [ ] **Step 2: Run the focused test and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx
```

Expected: FAIL because the current five-to-three explanation only says the differences were obvious at a glance, and the system, modularity, and process artifacts occupy separate chapters.

- [ ] **Step 3: Write the concise Choose beat**

Keep the five research inputs and three outputs in one paragraph. Use the approved criterion verbatim:

```tsx
<p>
  I compared Y2K, Maximalism, Dark Academia, WitchTok, and Cottagecore through
  their use of type, color, texture, and imagery. Three directions moved
  forward because they created clearly different visual systems inside the
  same slot map: Dopamine Dressing, e-Boy/e-Girl, and Light Academia.
</p>
```

Do not add a claim about audience performance, cultural authenticity, or which direction was strategically strongest.

- [ ] **Step 4: Consolidate the Build beat without removing artifacts**

Inside `#tt-system`, order the material as follows:

1. Explain the shared anatomy and layered-file handoff.
2. Render `TikTokTemplateSystem`.
3. Explain the limited modularity Myles proposed while constructing the files.
4. State that most parts stayed within their own visual system and that Light Academia and e-Boy/e-Girl shared only some structure.
5. Render the existing three process cards with their sketch, static template, shipped marker, and iteration note.

Use this ownership-safe build copy:

```tsx
<p>
  Each direction used the same product slots and shared slot map. I handed off
  three static directions as layered Photoshop files, then separated type,
  color, texture, and supporting graphics so I could test how much of each
  direction could move.
</p>
<p>
  I proposed that limited modularity while building the files. Most parts
  stayed within their own visual system. Light Academia and e-Boy/e-Girl
  shared enough structure for a few parts to cross between them.
</p>
```

Keep the existing sentence that identifies the review notes as paraphrases immediately before the three cards.

- [ ] **Step 5: Run focused tests and commit the rationale**

Run:

```bash
npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx
npx eslint src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/short-form.test.tsx
git diff --check
```

Expected: PASS with one template-system exhibit and three process cards inside the Build chapter.

Commit:

```bash
git add src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/short-form.test.tsx
git commit -m "feat: clarify TikTok selection and build rationale"
```

### Task 3: Order the Light Academia outcome and lock claim boundaries

**Files:**
- Modify: `src/app/work/tiktok/page.tsx:223-295`
- Test: `src/app/work/tiktok/__tests__/short-form.test.tsx:193-236`
- Test: `src/app/work/tiktok/__tests__/truthfulness.test.ts:9-59`

**Interfaces:**
- Consumes: the Light Academia record selected from `TIKTOK_TEMPLATES`.
- Produces: an ordered visual sequence labeled `Critique`, `My response`, and `Shipped result`, followed by the exact American Eagle relationship sentence.
- Produces: truthfulness guards covering paraphrase treatment, direct-client implications, downstream production ownership, and unverified performance metrics.

- [ ] **Step 1: Add failing order and truthfulness tests**

Replace the current loose outcome text checks with a DOM-order contract:

```tsx
it("orders the Light Academia critique, response, result, and relationship", async () => {
  const { container } = render(await TikTokPage());
  const outcome = container
    .querySelector("#tt-outcome")
    ?.closest(".project-chapter") as HTMLElement;
  const labels = within(outcome)
    .getAllByText(/^(Critique|My response|Shipped result)$/)
    .map((node) => node.textContent);
  const relationship = within(outcome).getByText(
    "I later learned through Global Creative Lab that American Eagle selected it.",
  );

  expect(labels).toEqual(["Critique", "My response", "Shipped result"]);
  expect(outcome).toHaveTextContent(
    "Global Creative Lab felt the simplicity was working and encouraged a more upbeat, deliberate direction.",
  );
  expect(outcome).toHaveTextContent(
    "I kept the fixed catalog slot and refined the editorial title, color, and supporting details.",
  );
  expect(outcome).toHaveTextContent("Light Academia entered the launch library.");

  const shippedStep = within(outcome).getByText("Shipped result").closest("li");
  expect(shippedStep?.compareDocumentPosition(relationship)).toBe(
    Node.DOCUMENT_POSITION_FOLLOWING,
  );
});
```

Strengthen `truthfulness.test.ts` using the actual page and data sources:

```ts
it("keeps review notes paraphrased and excludes unsupported outcome claims", () => {
  const page = read("src/app/work/tiktok/page.tsx");
  const data = read("src/lib/tiktok-data.ts");
  const publicCaseStudy = `${page}\n${data}`;

  expect(publicCaseStudy).toContain("paraphrase");
  expect(publicCaseStudy).not.toContain("<blockquote");
  expect(publicCaseStudy).not.toMatch(/worked (?:with|for) American Eagle/i);
  expect(publicCaseStudy).not.toMatch(/American Eagle client/i);
  expect(publicCaseStudy).not.toMatch(/CTR|ROAS|conversion rate|click-through rate/i);
  expect(publicCaseStudy).not.toContain(
    "Global Creative Lab then took the static Light Academia design into production.",
  );
});
```

- [ ] **Step 2: Run both TikTok test files and confirm the intended RED state**

Run:

```bash
npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx src/app/work/tiktok/__tests__/truthfulness.test.ts
```

Expected: FAIL because the current labels are `Design move` and `Shipped direction`, and the critique is split into an incomplete fragment.

- [ ] **Step 3: Implement the ordered Deliver beat**

Keep the existing `<ol aria-label="Light Academia iteration sequence">`, images, and shipped asset. Change the labels and captions to this sequence:

```tsx
<li>
  <p>Critique</p>
  <figcaption>
    Global Creative Lab felt the simplicity was working and encouraged a more
    upbeat, deliberate direction.
  </figcaption>
</li>
<li>
  <p>My response</p>
  <figcaption>
    I kept the fixed catalog slot and refined the editorial title, color, and
    supporting details.
  </figcaption>
</li>
<li>
  <p>Shipped result</p>
  <figcaption>Light Academia entered the launch library.</figcaption>
</li>
```

Place the relationship sentence after the closing `</ol>`. Keep it in body text and retain `case-highlight`. Do not use quotation marks around review language.

- [ ] **Step 4: Run focused tests and commit the evidence-bound outcome**

Run:

```bash
npm test -- src/app/work/tiktok/__tests__/short-form.test.tsx src/app/work/tiktok/__tests__/truthfulness.test.ts src/components/__tests__/tiktok-template-system.test.tsx
npx eslint src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/short-form.test.tsx src/app/work/tiktok/__tests__/truthfulness.test.ts
git diff --check
```

Expected: PASS. The template-system interaction test must remain green because this plan changes its placement, not its behavior.

Commit:

```bash
git add src/app/work/tiktok/page.tsx src/app/work/tiktok/__tests__/short-form.test.tsx src/app/work/tiktok/__tests__/truthfulness.test.ts
git commit -m "feat: order TikTok outcome and claim boundary"
```

## Final Verification

- [ ] Run all TikTok-specific tests:

```bash
npm test -- src/app/work/tiktok/__tests__ src/components/__tests__/tiktok-template-system.test.tsx
```

- [ ] Run repository checks:

```bash
npm run lint
npm run validate:content
npm test
npm run build
npx tsc --noEmit
git diff --check
```

- [ ] Inspect `/work/tiktok` at 390px, 768px, 1440px, and a wider desktop viewport in both light and dark themes. Confirm that the facts list collapses cleanly, the ToC has four items, `#tt-system` lands on the interactive system, the three process cards remain legible, and the outcome reads in the approved order.

- [ ] Search the final candidate-facing diff for prohibited punctuation and unsupported claims:

```bash
git diff -- src/app/work/tiktok/page.tsx | rg '—|…|American Eagle adopted|worked (with|for) American Eagle|CTR|ROAS|conversion rate'
```

Expected: no matches.

- [ ] Confirm commit scope:

```bash
git show --stat --oneline HEAD~3..HEAD
git status --short
```

Expected: only the TikTok page, its page-local CSS module, and the two TikTok-specific test files are included. Shared chapter files and shared CSS remain owned by their separate task.
