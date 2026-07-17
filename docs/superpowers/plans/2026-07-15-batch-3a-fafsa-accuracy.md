# Batch 3A FAFSA Claim Accuracy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Replace causal or unsupported UnderstandingFAFSA claims with precise timing and comparison language everywhere an applicant reviewer can see them.

**Architecture:** Keep the measured values unchanged while separating observation from causation. Project frontmatter remains the canonical gallery and recruiter-cut source. The dedicated case page, résumé page, and about page use the same factual sequence: the first redesigned send opened at about 52.6% on November 4, 2025, compared with prior sends around 30%, with Mailchimp Privacy Protection excluded.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript 5, Vitest 2.1.9.

## Global Constraints

- Follow `/Users/mylesashitey/.claude/writing-style-myles.md` and the `ai-slop` review sequence.
- Do not state or imply that the redesign caused the open-rate change.
- Do not claim the old template lost readers or identify where readers dropped off.
- Preserve the measured values, November 4, 2025 date, Mailchimp source, and MPP exclusion.
- No em dashes, semicolons, ellipses, hype, aphoristic closers, or invented evidence.
- Candidate-facing output must be consistent across project frontmatter, the dedicated case page, About, and Résumé.

---

### Task 1: Make the FAFSA outcome language evidence-safe

**Files:**
- Create: `src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts`
- Modify: `content/projects/understandingfafsa.md`
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/app/about/page.tsx`
- Modify: `src/app/resume/page.tsx`
- Modify: `src/lib/__tests__/content-outcome.test.ts`

**Interfaces:**
- Project frontmatter continues to expose `outcomeMetricValue`, `outcomeMetricLabel`, `outcomeLead`, and `outcomeRest`.
- Applicant-facing files must contain no `75% lift` or `lost readers` claim.
- The first redesigned send remains identified as November 4, 2025, with an open rate of about 52.6% compared with prior sends around 30% and MPP excluded.

- [ ] **Step 1: Add a failing cross-surface claim regression test**

Create a Vitest test that reads the four applicant-facing sources from `process.cwd()` and asserts:

```ts
const applicantFacingFiles = [
  "content/projects/understandingfafsa.md",
  "src/app/work/understandingfafsa/page.tsx",
  "src/app/about/page.tsx",
  "src/app/resume/page.tsx",
];

it("does not present the observed open-rate change as causal proof", () => {
  for (const file of applicantFacingFiles) {
    const source = readFileSync(resolve(process.cwd(), file), "utf8");
    expect(source).not.toMatch(/75% lift/i);
    expect(source).not.toMatch(/lost readers/i);
  }
});
```

Also assert the project page contains `November 4, 2025`, `~52.6%`, `around 30%`, and `MPP excluded` so accuracy is not achieved by deleting the evidence.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts`

Expected: FAIL on the current `75% lift` and `lost readers` language.

- [ ] **Step 3: Replace causal language at the canonical content source**

Use this evidence-safe frontmatter:

```yaml
summary: Redesigned a newsletter system to match a fresh site rebrand. The first redesigned send opened at ~52.6%, compared with prior sends around 30%.
outcomeMetricLabel: open rate on the first redesigned send, compared with prior sends around 30% (MPP excluded)
outcomeMetricValue: ~52.6%
outcomeLead: ~52.6%
outcomeRest: open rate on the first redesigned send, compared with prior sends around 30%.
```

- [ ] **Step 4: Align the dedicated case page without padding**

- Replace `UF_DESCRIPTION` with the frontmatter summary language.
- Rename the TOC item and section heading from `Why the old template lost readers` to `Where the old template broke down`.
- Replace the section lead with: `The old template was difficult to scan on mobile. Prior sends opened around 30%.`
- Describe the observed template issues directly. Do not infer that any issue caused a reader to leave.
- Change the results lead to: `The first redesigned send opened at about 52.6% on November 4, 2025, compared with prior sends around 30%.`
- Change the body transition from `moved from` to `opened at`, preserving Mailchimp and MPP context.

- [ ] **Step 5: Align About and Résumé language**

Replace `Open rates went from about 30% to 52.6%.` with `The first redesigned send opened at 52.6%, compared with prior sends around 30%.`

- [ ] **Step 6: Update the canonical content expectation**

In `src/lib/__tests__/content-outcome.test.ts`, change the FAFSA expectation to:

```ts
expect(fafsa!.outcomeLead).toBe("~52.6%");
expect(fafsa!.outcomeRest).toBe(
  "open rate on the first redesigned send, compared with prior sends around 30%.",
);
```

- [ ] **Step 7: Verify GREEN and nearby behavior**

Run:

```bash
npm test -- src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/lib/__tests__/content-outcome.test.ts src/lib/__tests__/work-gallery-data.test.ts
npm run validate:content
npx eslint content/projects/understandingfafsa.md src/app/work/understandingfafsa/page.tsx src/app/about/page.tsx src/app/resume/page.tsx src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/lib/__tests__/content-outcome.test.ts
npx tsc --noEmit
```

Expected: all tests and checks pass. If ESLint ignores Markdown, that is acceptable as long as the command exits successfully.

- [ ] **Step 8: Run the prose gate**

Mechanically scan the changed applicant-facing files for em dashes, semicolons, ellipses, `75% lift`, `lost readers`, and banned hype language. Re-read every changed paragraph in context and score the change at least 22/24 with zero P0/P1 anti-slop findings.

- [ ] **Step 9: Commit**

```bash
git add content/projects/understandingfafsa.md src/app/work/understandingfafsa/page.tsx src/app/about/page.tsx src/app/resume/page.tsx src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts src/lib/__tests__/content-outcome.test.ts
git commit -m "fix: qualify FAFSA outcome claims"
```

---

### Task 2: Remove unsupported FAFSA effect and performance claims

**Files:**
- Modify: `src/app/work/understandingfafsa/page.tsx`
- Modify: `src/components/understandingfafsa.tsx`
- Modify: `src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts`

**Interfaces:**
- Preserve the interactive mobile comparison, newsletter composer, template switcher, and 102 KB Gmail clipping constraint.
- Replace inferred user effects, guaranteed brand outcomes, and unmeasured speed or analytics claims with observable artifact descriptions.
- Label the composer module weights as illustrative estimates because they are directional values, not measured payload sizes.

- [ ] **Step 1: Extend the claim regression and verify RED**

Add source assertions that reject these unsupported phrases:

```ts
expect(projectPage).not.toContain("primary touchpoint");
expect(projectPage).not.toContain("Subscribers were seeing two different brands");
expect(projectPage).not.toContain("still in a healthy band");
expect(comparisonComponent).not.toContain("stays on-brand no matter the order");
expect(comparisonComponent).not.toContain("faster assembly");
expect(comparisonComponent).toContain("Illustrative estimate");
```

Run: `npm test -- src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts`

Expected: FAIL on the current unsupported phrases and missing estimate label.

- [ ] **Step 2: Make the context describe the artifact, not inferred subscriber perception**

- Replace the pull quote with: `The newsletter still carried the site&apos;s previous visual system.`
- Remove `primary touchpoint` and state that the newsletter carries guidance for students, parents, and counselors.
- State that the site had already adopted Saans and a refreshed palette while the newsletter still used the older system.
- Keep the founder assembly constraint, but do not guarantee that the design maintains the brand regardless of every possible edit.

- [ ] **Step 3: Turn audit effects into observations**

Rewrite the audit bullets so each names what a reference newsletter did:

- Revenews used selective bolding, emoji section headers, and concise intros.
- Folderly carried brand color into its bullet styles.
- Several references used action-focused section titles to divide long sends.
- The 74 used a more formal register than student-facing references that used emojis and GIFs.
- Next used if/then link framing, author photos, and brief bios.

Do not say these patterns created entry points, reinforced identity, gave agency, or made the sender feel human unless the page includes supporting research.

- [ ] **Step 4: Remove guaranteed assembly and analytics language**

- Replace the founder speed/brand guarantee with: `The founder can edit copy and images within fixed spacing, type, and divider rules.`
- In the result, state: `Mailchimp reported ~52.6% for the first redesigned send with MPP excluded. Earlier sends opened around 30%.`
- Remove the claim that clicks, bounces, and unsubscribes were in a healthy band.

- [ ] **Step 5: Qualify the interactive component copy**

- Replace `The kit stays on-brand no matter the order.` with `The exercise mirrors the system&apos;s locked and swappable rules.`
- Change the composer weight display to begin with `Illustrative estimate:` while preserving the calculated value and `102 KB Gmail clipping threshold`.
- Replace the event template alt text with `Event-specific newsletter with fewer blocks for invites and recaps.`

- [ ] **Step 6: Verify and run the prose gate**

Run:

```bash
npm test -- src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts
npx eslint src/app/work/understandingfafsa/page.tsx src/components/understandingfafsa.tsx src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts
npx tsc --noEmit
git diff --check
```

Re-read the complete changed sections and score at least 22/24 with zero P0/P1 anti-slop findings. Treat JavaScript statement terminators and HTML entities as source syntax rather than rendered semicolons.

- [ ] **Step 7: Commit**

```bash
git add src/app/work/understandingfafsa/page.tsx src/components/understandingfafsa.tsx src/app/work/understandingfafsa/__tests__/claim-accuracy.test.ts
git commit -m "fix: ground FAFSA artifact claims"
```

---

### Task 3: Add optional professional-proof rows to the recruiter cut

**Files:**
- Modify: `src/components/recruiter-cut.tsx`
- Modify: `src/components/__tests__/recruiter-cut.test.tsx`

**Interfaces:**
- Add optional string props: `contribution`, `team`, and `feedback`.
- Render each supplied value as a semantic `<dt>/<dd>` row.
- Preserve every existing caller without adding empty rows or changing current output when the props are absent.
- Order supplied rows as Problem, Role, Contribution, Team, Feedback, Timeline, Tools/Stack, Outcome.

- [ ] **Step 1: Write failing component tests**

Extend the first test with concrete values for all three new props and assert their labels and values render. Add a row-order assertion against `.case-cut-row dt` text content. Extend the omission test to assert Contribution, Team, and Feedback are absent when their props are omitted.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/__tests__/recruiter-cut.test.tsx`

Expected: FAIL because the component does not accept or render the three new props.

- [ ] **Step 3: Implement the minimal optional rows**

Add the props to `RecruiterCutProps`, destructure them, and render each only when supplied:

```tsx
{contribution ? (
  <div className="case-cut-row"><dt>Contribution</dt><dd>{contribution}</dd></div>
) : null}
```

Use the same pattern for Team and Feedback. Do not add CSS or new visual containers.

- [ ] **Step 4: Verify GREEN and compatibility**

Run:

```bash
npm test -- src/components/__tests__/recruiter-cut.test.tsx
npx eslint src/components/recruiter-cut.tsx src/components/__tests__/recruiter-cut.test.tsx
npx tsc --noEmit
git diff --check
```

Expected: all checks pass and existing case-study callers remain type-compatible.

- [ ] **Step 5: Commit**

```bash
git add src/components/recruiter-cut.tsx src/components/__tests__/recruiter-cut.test.tsx
git commit -m "feat: support professional proof fields"
```
