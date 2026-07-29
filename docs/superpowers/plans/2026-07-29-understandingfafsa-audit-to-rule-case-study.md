# UnderstandingFAFSA Audit-to-Rule Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the 120-plus-newsletter audit into a visible five-part finding-to-rule chain while keeping ownership, the 102 KB Mailchimp constraint, and the observed open-rate evidence precise.

**Architecture:** Add one typed, page-specific audit-rule data module and render it as an ordered semantic list inside the existing Research chapter. Distill surrounding page prose so the five current chapters and interactive artifacts remain intact, then replace brittle sentence snapshots with structural, ownership, constraint, and attribution guardrails.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest, Testing Library, existing UnderstandingFAFSA components and global portfolio styles.

## Global Constraints

- Use the approved design specification at `docs/superpowers/specs/2026-07-29-portfolio-case-study-refinement-design.md`, especially “3. UnderstandingFAFSA” and “7. Test-first implementation.”
- Follow `/Users/mylesashitey/career-ops/MYLES-WRITING-STYLE.md` and the Writing Style section in `/Users/mylesashitey/career-ops/modes/_profile.md`.
- Do not use em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer framing, or slogan-like closing lines in candidate-facing copy.
- Keep exactly five chapters and retain their existing Frame, Research, Define, Build, and Outcome sequence.
- State that Myles and one collaborator compiled and evaluated more than 120 newsletters.
- State that Myles designed the modular rules and rebuilt the live system in Mailchimp.
- State that the founder assembles each send from the Mailchimp-native kit without editing HTML.
- Do not claim that the system saved time, improved efficiency, reduced errors, or produced any other unmeasured workflow effect.
- Keep Gmail’s 102 KB HTML clipping threshold as an implementation constraint.
- Keep November 4, 2025, the observed 52.6% open rate with Mailchimp Privacy Protection excluded, earlier sends around 30%, and the uncontrolled-attribution caveat together.
- Lead the outcome with the shipped modular system. Treat the metric as supporting context, never proof that the redesign caused the change.
- Preserve `BeforeAfterPhones`, `TemplateSwitcher`, `NewsletterComposerDemo`, `LockedSwappableView`, `ColorPalette`, `FigmaMailchimpPair`, `CountUp`, `ProjectWorkJump`, and `CaseHighlightObserver`.
- Preserve the composer’s current 102 KB illustrative estimate and all existing interaction behavior.
- Do not modify `src/lib/project-chapters.ts`, `src/lib/__tests__/project-chapters.test.ts`, `src/app/work/__tests__/case-study-tocs.test.ts`, `src/app/styles/base.css`, `src/app/styles/late-polish.css`, or `src/app/styles/portfolio-surfaces.css`.
- Do not deploy from this plan.

## Shared-Task Boundary

UnderstandingFAFSA keeps its current five chapter IDs and sequence. If the separate shared chapter-map task adjusts shared labels, consume that result without editing its files here. The page-specific tests in this plan should assert the five indices, evidence-anchor uniqueness, and story sequence without cloning shared title text.

---

### Task 1: Encode the five approved audit-to-rule pairs

**Files:**

- Create: `src/lib/understandingfafsa-audit-rules.ts`
- Create: `src/lib/__tests__/understandingfafsa-audit-rules.test.ts`

**Interfaces:**

- Export `UnderstandingFafsaAuditRuleId` as a closed five-value union.
- Export `UnderstandingFafsaAuditRule` with `id`, `finding`, and `response`.
- Export `UNDERSTANDING_FAFSA_AUDIT_RULES` as a readonly, ordered five-item array.
- Keep wording factual and UI-ready. The page may render these values directly.

- [ ] **Step 1: Write the failing module contract**

Create `src/lib/__tests__/understandingfafsa-audit-rules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { UNDERSTANDING_FAFSA_AUDIT_RULES } from "@/lib/understandingfafsa-audit-rules";

describe("UnderstandingFAFSA audit-to-rule contract", () => {
  it("keeps the five approved findings in causal order", () => {
    expect(UNDERSTANDING_FAFSA_AUDIT_RULES).toEqual([
      {
        id: "scanning",
        finding: "Long sends needed stronger scanning cues",
        response:
          "Action-focused section titles, selective emphasis, and clearer breaks",
      },
      {
        id: "brand-structure",
        finding:
          "Weekly content changed while the brand structure should not",
        response:
          "Locked spacing, type, dividers, and section order with swappable copy and imagery",
      },
      {
        id: "founder-workflow",
        finding: "The founder assembled every issue",
        response:
          "A Mailchimp-native kit that can be edited without touching HTML",
      },
      {
        id: "gmail-clipping",
        finding: "Gmail clips large HTML emails",
        response:
          "Flatter hierarchy, fewer wrappers, lighter PNG assets, and selective native components",
      },
      {
        id: "send-density",
        finding: "Different send purposes need different density",
        response:
          "Welcome, weekly, and short event templates built from the same rules",
      },
    ]);
  });
});
```

- [ ] **Step 2: Run the module test and confirm RED**

Run:

```bash
npm test -- src/lib/__tests__/understandingfafsa-audit-rules.test.ts
```

Expected: FAIL because `@/lib/understandingfafsa-audit-rules` does not exist.

- [ ] **Step 3: Implement the minimum typed module**

Create `src/lib/understandingfafsa-audit-rules.ts`:

```ts
export type UnderstandingFafsaAuditRuleId =
  | "scanning"
  | "brand-structure"
  | "founder-workflow"
  | "gmail-clipping"
  | "send-density";

export type UnderstandingFafsaAuditRule = {
  id: UnderstandingFafsaAuditRuleId;
  finding: string;
  response: string;
};

export const UNDERSTANDING_FAFSA_AUDIT_RULES = [
  {
    id: "scanning",
    finding: "Long sends needed stronger scanning cues",
    response:
      "Action-focused section titles, selective emphasis, and clearer breaks",
  },
  {
    id: "brand-structure",
    finding: "Weekly content changed while the brand structure should not",
    response:
      "Locked spacing, type, dividers, and section order with swappable copy and imagery",
  },
  {
    id: "founder-workflow",
    finding: "The founder assembled every issue",
    response:
      "A Mailchimp-native kit that can be edited without touching HTML",
  },
  {
    id: "gmail-clipping",
    finding: "Gmail clips large HTML emails",
    response:
      "Flatter hierarchy, fewer wrappers, lighter PNG assets, and selective native components",
  },
  {
    id: "send-density",
    finding: "Different send purposes need different density",
    response:
      "Welcome, weekly, and short event templates built from the same rules",
  },
] as const satisfies readonly UnderstandingFafsaAuditRule[];
```

- [ ] **Step 4: Verify the typed contract**

Run:

```bash
npm test -- src/lib/__tests__/understandingfafsa-audit-rules.test.ts
npx tsc --noEmit
```

Expected: PASS.

- [ ] **Step 5: Commit the data contract**

Run:

```bash
git add src/lib/understandingfafsa-audit-rules.ts src/lib/__tests__/understandingfafsa-audit-rules.test.ts
git diff --cached --check
git commit -m "test(understandingfafsa): codify audit to rule chain"
```

Expected: one atomic commit containing only the typed mapping and its test.

---

### Task 2: Establish structural, ownership, and evidence guardrails

**Files:**

- Modify: `src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts:13-159`
- Modify: `src/app/work/understandingfafsa/__tests__/prose-structure.test.ts:11-137`

**Interfaces:**

- The page must import and map `UNDERSTANDING_FAFSA_AUDIT_RULES` exactly once.
- The rendered chain must be an ordered list labelled “Audit findings and system rules.”
- Each item must expose a visible “Finding” and “System rule” label.
- The story order is context, old template, audit, rule chain, three templates, Mailchimp implementation, shipped system, then supporting metric.
- Candidate-facing page prose should remain at or below 800 words. Do not add a minimum word count.

- [ ] **Step 1: Add a failing audit-chain structure test**

In `prose-structure.test.ts`, retain the title, five chapter indices, two unique evidence headings, and artifact-stack assertions. Replace brittle sentence snapshots with:

```ts
it("renders the five audit findings as one ordered rule chain", () => {
  expect(page).toMatch(
    /import\s*\{\s*UNDERSTANDING_FAFSA_AUDIT_RULES\s*\}\s*from\s*"@\/lib\/understandingfafsa-audit-rules"/,
  );
  expect(page).toContain(
    '<ol aria-label="Audit findings and system rules">',
  );
  expect(page).toMatch(
    /UNDERSTANDING_FAFSA_AUDIT_RULES\.map\(\(rule\) =>/,
  );
  expect(page).toContain("<strong>Finding:</strong>");
  expect(page).toContain("<strong>System rule:</strong>");
});
```

Add an ordered narrative assertion:

```ts
const storyMarkers = [
  "Where the old template broke down",
  "compile and evaluate more than 120 newsletter examples",
  "Audit findings and system rules",
  "Three send types from the audit",
  "Gmail&apos;s 102 KB HTML clipping threshold",
  "I shipped a master template",
  "November 4, 2025",
];

for (const [current, next] of storyMarkers
  .slice(0, -1)
  .map((marker, index) => [marker, storyMarkers[index + 1]] as const)) {
  expect(page.indexOf(current)).toBeGreaterThan(-1);
  expect(page.indexOf(current)).toBeLessThan(page.indexOf(next));
}
```

Retain a concise set of factual guardrails instead of exact paragraph snapshots:

```ts
expect(prose).toMatch(/one collaborator and I[\s\S]{0,100}more than 120/i);
expect(prose).toMatch(/I designed[\s\S]{0,100}modular rules/i);
expect(prose).toMatch(/I rebuilt[\s\S]{0,100}Mailchimp/i);
expect(prose).toMatch(/founder[\s\S]{0,100}without (?:touching|editing) HTML/i);
expect(prose).toMatch(/102 ?KB/i);
```

Keep assertions for all existing artifacts and for three template variants.

- [ ] **Step 2: Add failing claim-boundary assertions**

In `claim-accuracy.test.ts`, retain the current open-rate and condensed-surface checks. Add:

```ts
expect(projectPage).toMatch(
  /observed[\s\S]{0,100}52\.6%[\s\S]{0,100}MPP excluded/i,
);
expect(projectPage).toMatch(
  /earlier sends[\s\S]{0,50}around 30%/i,
);
expect(projectPage).toMatch(
  /not a controlled attribution test[\s\S]{0,120}(?:don&apos;t|do not) claim/i,
);

for (const unsupported of [
  /saved (?:the founder )?time/i,
  /faster (?:assembly|workflow|production)/i,
  /improved efficiency/i,
  /reduced errors/i,
]) {
  expect(projectPage).not.toMatch(unsupported);
}
```

Keep the existing checks for `UF_DESCRIPTION`, About, resume, the mobile comparison, and the rendered space after the 102 KB highlight.

- [ ] **Step 3: Add a maximum-only prose budget**

Use the TypeScript-AST reader-facing word-count helper already established in `src/app/work/fresh-greens/__tests__/prose-structure.test.ts:28-150`, localized to this test file and limited to `src/app/work/understandingfafsa/page.tsx`. Count JSX text, string literals rendered inside JSX, and reader-facing prop values. Exclude imports, class names, asset paths, alt text, aria labels, and comments.

Define and add:

```ts
const pagePath = "src/app/work/understandingfafsa/page.tsx";

it("keeps the primary case-study path within its prose budget", () => {
  expect(readerFacingWordCount([pagePath])).toBeLessThanOrEqual(800);
});
```

Do not add a lower bound.

- [ ] **Step 4: Run the page tests and confirm RED**

Run:

```bash
npm test -- src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts
```

Expected: FAIL because the page does not import or render the typed chain, the ownership statements do not yet match the new guardrails, the Gmail phrase lacks the spaced “102 KB” form, and the outcome still opens with the personal reflection rather than the shipped system.

- [ ] **Step 5: Review the RED diff before production changes**

Confirm that the failures establish mapping, ownership, constraint, sequence, attribution, and prose-budget behavior. Do not delete existing negative claim guards or interaction artifact assertions.

---

### Task 3: Render the audit-to-rule chain and distill the five-chapter narrative

**Files:**

- Modify: `src/app/work/understandingfafsa/page.tsx:20-26, 89-106, 116-190, 199-237, 246-307`

**Interfaces:**

- Import `UNDERSTANDING_FAFSA_AUDIT_RULES` from the new data module.
- Render one semantic ordered list with stable `rule.id` keys.
- Use the existing `.project-section-body` typography and list rules. Do not add a stylesheet or new global selectors.
- Keep the page async API, chapter composition, current anchor IDs, and all component props.
- Do not modify `content/projects/understandingfafsa.md`, About, resume, or `src/components/understandingfafsa.tsx`; their current metric and interaction contracts remain valid.

- [ ] **Step 1: Clarify ownership in the recruiter cut**

Replace the three moves with:

```tsx
moves={[
  "Research: one collaborator and I compiled and evaluated more than 120 newsletters.",
  "System: I designed the modular rules and rebuilt the live template in Mailchimp.",
  "Workflow: the founder assembles each send from the kit without editing HTML.",
]}
```

Keep the role, timeline, tools, evidence link, and observed outcome props unchanged.

- [ ] **Step 2: Tighten the Frame around the actual operating context**

Keep the audience, refreshed visual system, email-only scope, deadline-driven content, old-template problems, and founder assembly workflow. Remove any repeated explanation that is now visible in the audit chain.

The Frame must still answer:

- who reads the newsletter
- what the founder must assemble
- what was structurally difficult in the old template

Do not add a claim about reader loss, workflow speed, or brand inconsistency as measured behavior.

- [ ] **Step 3: Replace the reference inventory with a visible finding-to-rule chain**

Import:

```ts
import { UNDERSTANDING_FAFSA_AUDIT_RULES } from "@/lib/understandingfafsa-audit-rules";
```

Open Research with explicit ownership:

```tsx
<p>
  One collaborator and I worked together to compile and evaluate more than 120
  newsletter examples. We compared clarity, personalization, tone of voice,
  visual appeal, and branding consistency.
</p>
```

Keep one compact source sentence naming Revenews, The 74, Next by Jeff Selingo, Medium, and Folderly, then replace the five reference-detail bullets with:

```tsx
<ol aria-label="Audit findings and system rules">
  {UNDERSTANDING_FAFSA_AUDIT_RULES.map((rule) => (
    <li key={rule.id}>
      <p>
        <strong>Finding:</strong> {rule.finding}.
      </p>
      <p>
        <strong>System rule:</strong> {rule.response}.
      </p>
    </li>
  ))}
</ol>
```

The period stays outside each data string so the same strings remain reusable.

- [ ] **Step 4: Let Define expand only the rules that need artifacts**

Keep the three template types, `TemplateSwitcher`, `NewsletterComposerDemo`, `LockedSwappableView`, and `ColorPalette`.

State explicitly:

```tsx
<p>
  I designed the modular rules around a fixed section order, spacing, type, and
  dividers. The founder can swap weekly copy and imagery without changing that
  structure.
</p>
```

Do not restate all five audit-rule pairs in prose. The interactive composer demonstrates the locked and swappable model.

- [ ] **Step 5: Keep the Build chapter concrete and constraint-led**

Retain:

- Myles rebuilt the live system in Mailchimp
- the founder can edit it without touching HTML
- Gmail’s `102 KB` HTML clipping threshold
- flatter hierarchy and fewer wrappers
- merged sections where scanning remained clear
- lighter or compressed PNGs
- selective Mailchimp-native structure
- Photoshop background removal for dark-mode-friendly dividers

Use the spaced form in visible prose:

```tsx
<mark className="case-highlight">
  Gmail&apos;s 102 KB HTML clipping threshold set a rigid constraint.
</mark>{" "}
```

Keep the explicit `{" "}` after `</mark>` so rendered prose does not collapse.

- [ ] **Step 6: Lead Outcome with the shipped system, then qualify the metric**

Use this order:

1. Shipped master template, modular blocks, locked-versus-swappable rules, and three variants.
2. Founder’s current assembly workflow without HTML.
3. November 4, 2025 send date.
4. Observed `~52.6%` open rate with MPP excluded, with earlier sends around 30%.
5. Uncontrolled-attribution caveat.
6. Brief reflection that this was Myles’s first system assembled weekly by someone else.

Preserve:

```tsx
<CountUp value="~52.6%" />{" "}open rate
```

Use explicit caveat copy:

```tsx
That result is supporting context, not a controlled attribution test. I
don&apos;t claim the redesign caused the change.
```

- [ ] **Step 7: Run the focused page and interaction tests**

Run:

```bash
npm test -- src/lib/__tests__/understandingfafsa-audit-rules.test.ts src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts src/components/__tests__/understandingfafsa-composer.test.tsx src/components/__tests__/count-up.test.tsx
```

Expected: PASS. The composer and CountUp tests prove that the editorial restructure did not alter existing interaction behavior.

- [ ] **Step 8: Commit the page and guardrails**

Run:

```bash
git add src/app/work/understandingfafsa/page.tsx src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts
git diff --cached --check
git commit -m "feat(understandingfafsa): connect audit findings to system rules"
```

Expected: one atomic commit containing the page narrative and page-level guardrails, with no component, style, shared chapter-map, or unrelated file.

---

### Task 4: Verify the case study as a focused read

**Files:**

- Verify only: files changed in Tasks 1 through 3.
- Verify dependency only: shared chapter-map files after the separate task lands.

**Interfaces:**

- The implementation must render at `/work/understandingfafsa`.
- Existing keyboard, theme, image expansion, template-switching, composer, and CountUp behavior must remain intact.
- Completion requires both automated and visual evidence.

- [ ] **Step 1: Confirm scope and dependency state**

Run:

```bash
git status --short
git diff --name-only
```

Expected: no accidental modifications to `src/components/understandingfafsa.tsx`, global styles, content frontmatter, About, resume, or shared chapter-map files from this plan.

- [ ] **Step 2: Run static validation**

Run:

```bash
npm run lint -- src/app/work/understandingfafsa/page.tsx src/lib/understandingfafsa-audit-rules.ts src/lib/__tests__/understandingfafsa-audit-rules.test.ts src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/app/work/understandingfafsa/__tests__/prose-structure.test.ts
npm run validate:content
git diff --check
```

Expected: all commands PASS.

- [ ] **Step 3: Run full repository gates**

After the shared chapter-map task is present, run:

```bash
npm run build
npx tsc --noEmit
npm test
```

Expected: all tests and the production build PASS.

- [ ] **Step 4: Audit Myles’s voice and evidence boundaries**

Use the `ai-slop` skill on the final candidate-facing diff. Confirm:

- no em dashes, semicolons, ellipses, hype, rhetorical question-and-answer framing, or aphoristic closer
- the collaborator, Myles, and founder roles never blur
- the five data pairs match the approved specification
- the 102 KB threshold is a constraint, not a measured performance result
- no copy claims time savings, efficiency gains, error reduction, or causal open-rate improvement
- the shipped system leads the outcome and the metric remains supporting context

- [ ] **Step 5: Inspect the route at all required viewports**

Start the site:

```bash
npm run dev
```

Using the browser workflow, inspect `/work/understandingfafsa` at 375, 768, and 1440 CSS pixels in light and dark themes, then with reduced motion enabled. Confirm:

- the five-item ordered chain scans as finding followed by system rule
- long finding and response text wraps without orphaned labels or horizontal overflow
- the chain does not feel like five new cards or disrupt chapter rhythm
- the recruiter cut remains concise and readable
- all images, template controls, composer controls, weight feedback, and original-capture links work
- the 102 KB constraint and attribution caveat remain visible without dominating the outcome
- focus indicators and keyboard order remain intact

- [ ] **Step 6: Request independent review**

Use `superpowers:requesting-code-review` against the two atomic commits. Ask the reviewer to check the five audit mappings, contributor ownership, founder workflow claims, the Gmail threshold, metric attribution, artifact preservation, and accidental scope expansion.

- [ ] **Step 7: Report completion evidence**

Report the two commit hashes, focused and full-suite results, build result, inspected viewports and themes, reviewer findings, and any dependency commit used. Do not claim deployment.
