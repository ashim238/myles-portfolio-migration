# Portfolio Positioning Pass Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Un-hide and bring the TikTok case to recruiter-cut parity, fix its one self-contradicting claim, reorder the home gallery (FAFSA first), and rewrite the positioning copy to claim the strategy + design + code intersection with honest numbers.

**Architecture:** Frontmatter drives ordering and publish state (`content/projects/*.md` → `getPublishedProjects`). The TikTok case page mirrors the shared recruiter-cut pattern already used by `understandingfafsa/page.tsx` and `navi/page.tsx` (`RecruiterCut` + `case-tier-divider`), reusing existing components with no new ones. Copy changes are static JSX edits. All claims verified against the grill-me ground truth (3 designed, 1 shipped = Light Academia, adopted by American Eagle).

**Tech Stack:** Next.js 16 / React 19 / TypeScript, Vitest + Testing Library, gray-matter frontmatter, existing shared components (`RecruiterCut`, `ProjectToc`).

**Spec:** `docs/superpowers/specs/2026-07-09-portfolio-positioning-pass-design.md`

**Voice rules (all copy):** no em-dashes (`—`/`--`), no semicolons, no ellipses, Oxford comma, no hype words (seamless, leveraged, etc.). En-dashes allowed only in numeric ranges.

---

### Task 1: Reorder gallery + un-hide TikTok (frontmatter) with an ordering test

**Files:**
- Modify: `content/projects/understandingfafsa.md` (order 2 → 1)
- Modify: `content/projects/fresh-greens.md` (order 1 → 2)
- Modify: `content/projects/tiktok.md` (status hidden → published)
- Create: `src/lib/__tests__/content-order.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/content-order.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("published gallery order", () => {
  it("leads with FAFSA, then Fresh Greens, Navi, TikTok", async () => {
    const slugs = (await getPublishedProjects()).map((p) => p.slug);
    expect(slugs).toEqual([
      "understandingfafsa",
      "fresh-greens",
      "navi",
      "tiktok",
    ]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/content-order.test.ts`
Expected: FAIL — current order is `["fresh-greens","understandingfafsa","navi"]` (tiktok hidden, FAFSA second).

- [ ] **Step 3: Apply the frontmatter changes**

In `content/projects/understandingfafsa.md`, change `order: 2` to `order: 1`.
In `content/projects/fresh-greens.md`, change `order: 1` to `order: 2`.
In `content/projects/tiktok.md`, change `status: hidden` to `status: published` (leave `order: 4`).
Do NOT change `content/projects/navi.md` (stays `order: 3`).

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/content-order.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/projects/understandingfafsa.md content/projects/fresh-greens.md content/projects/tiktok.md src/lib/__tests__/content-order.test.ts
git commit -m "feat: reorder gallery FAFSA-first and publish TikTok case"
```

---

### Task 2: Fix the TikTok honesty overclaim

**Files:**
- Modify: `src/app/work/tiktok/page.tsx` (the `tt-scope` section, around lines 244-255)

The current "Where the work went" second paragraph claims "three of the 30+ templates that shipped," which contradicts the page's own `OutcomeCard` (only the Light Academia template shipped and was adopted by American Eagle). Replace it with the ground truth.

- [ ] **Step 1: Replace the overclaiming paragraph**

Find this block in `src/app/work/tiktok/page.tsx`:

```tsx
          <p>
            My contribution sits in the launch generation: three of the
            30+ templates that shipped when the format went live. The
            mechanic outlived the product that introduced it.
          </p>
```

Replace it with:

```tsx
          <p>
            My contribution sits in the launch generation. I designed three
            templates, one per aesthetic, part of the roughly ten the studio
            built for launch. The Light Academia one shipped, and American
            Eagle adopted it. The mechanic outlived the product that
            introduced it.
          </p>
```

- [ ] **Step 2: Verify no other "three ... shipped" claim remains**

Run: `grep -nE "three.*shipped|three of the" src/app/work/tiktok/page.tsx`
Expected: no matches (the hero lede "American Eagle adopted one of the three" is fine and stays — it does not claim three shipped).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/work/tiktok/page.tsx
git commit -m "fix: correct TikTok scope claim to match the outcome card"
```

---

### Task 3: TikTok recruiter-cut parity (RecruiterCut + tier divider)

**Files:**
- Modify: `src/app/work/tiktok/page.tsx` (imports; replace meta dl lines 77-90; add divider after ProjectToc)

Mirror the pattern in `src/app/work/understandingfafsa/page.tsx`. Do NOT add `LeadMedia` (the hero's `HeroThreePhones` is this case's cover). Keep the existing `ProjectToc`.

- [ ] **Step 1: Add the RecruiterCut import**

In `src/app/work/tiktok/page.tsx`, the import block currently has (line 4):

```tsx
import { ProjectToc } from "@/components/project-toc";
```

Add directly below it:

```tsx
import { RecruiterCut } from "@/components/recruiter-cut";
```

- [ ] **Step 2: Replace the old meta strip with RecruiterCut**

Find this block (lines 77-90):

```tsx
      <dl className="project-meta tt-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>Visual Designer · Brand Studio</dd>
        </div>
        <div className="project-meta-field">
          <dt>Stack</dt>
          <dd>Illustrator · Photoshop</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>May – Aug 2021</dd>
        </div>
      </dl>
```

Replace it entirely with:

```tsx
      <RecruiterCut
        problem="On TikTok, recycled product creative does not land. One ad treatment for every subculture flattens what people are there to find."
        role="Visual Designer, Brand Studio"
        timeline="May – August 2021"
        stack="Illustrator, Photoshop"
        stackLabel="Tools"
        outcomeValue="1"
        outcomeLabel="of 3 templates shipped, adopted by American Eagle"
        moves={[
          "Mapped TikTok's subcultures down to three aesthetic systems a brand could see itself in.",
          "Designed one slot-map skeleton with three subculture fills, so a catalog stays native to each audience.",
          "Shipped the Light Academia template. American Eagle adopted it.",
        ]}
      />
```

- [ ] **Step 3: Add the tier divider after ProjectToc**

Find the closing of the `ProjectToc` block (currently ends around line 102 with `/>`), immediately followed by the comment `{/* ── Section 01 — The brief ...`. Insert the divider between them so it reads:

```tsx
      <ProjectToc
        sections={[
          { title: "The brief", id: "tt-brief" },
          { title: "Reading the platform", id: "tt-research" },
          { title: "The system", id: "tt-system" },
          { title: "Three aesthetics", id: "tt-aesthetics" },
          { title: "What shipped", id: "tt-shipped" },
          { title: "Honest scope", id: "tt-scope" },
          { title: "Retrospective", id: "tt-retro" },
        ]}
      />

      <div className="case-tier-divider"><span>The full breakdown ↓</span></div>

      {/* ── Section 01 — The brief ─────────────────────── */}
```

- [ ] **Step 4: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors (RecruiterCut props match `src/components/recruiter-cut.tsx`).

- [ ] **Step 5: Commit**

```bash
git add src/app/work/tiktok/page.tsx
git commit -m "feat: bring TikTok case to recruiter-cut parity"
```

---

### Task 4: Positioning copy rewrite (home + /about)

**Files:**
- Modify: `src/app/page.tsx` (home `about` section)
- Modify: `src/app/about/page.tsx` (middle paragraph)

- [ ] **Step 1: Rewrite the home About paragraph**

In `src/app/page.tsx`, find:

```tsx
        <p>
          I design end to end and ship past the prototype. Ask me about the
          Gmail HTML ceiling or why the Navi daylight cue is a WCAG dash
          pattern.
        </p>
```

Replace with:

```tsx
        <p>
          Strategy, design, and code, and I ship past the prototype. Ask me
          how a nonprofit newsletter went from 30% to 52.6% open rates, or why
          the Navi daylight cue is a WCAG dash pattern.
        </p>
```

- [ ] **Step 2: Rewrite the /about middle paragraph**

In `src/app/about/page.tsx`, find the paragraph beginning "I design end to end and tend to go past the prototype." (the one that ends "Open rates went from 30% to 52.6%."). Replace the whole `<p>...</p>` with:

```tsx
            <p>
              I design end to end and tend to go past the prototype, pulling
              strategy, design, and code into the same process. My thesis was a
              solo-built React Native wayfinding app for Black travelers in
              America, with VoiceOver labels, dynamic type, and a WCAG dash
              pattern for the daylight cue built in from the start. For a
              financial-aid nonprofit, I rebuilt the newsletter as modular
              templates a non-designer could run without breaking the brand,
              and open rates went from 30% to 52.6%. At TikTok I designed
              catalog ad templates around the platform&apos;s subcultures, and
              American Eagle adopted one.
            </p>
```

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx src/app/about/page.tsx
git commit -m "feat: positioning copy claims strategy+design+code with honest numbers"
```

---

### Task 5: Cleanup stale test reference + full verification + /impeccable

**Files:**
- Modify: `src/app/work/[slug]/__tests__/static-params.test.ts` (rename the "hidden" fixture off tiktok)

- [ ] **Step 1: Un-stale the hidden-project fixture**

In `src/app/work/[slug]/__tests__/static-params.test.ts`, the test uses `makeProject("tiktok", "hidden")` as its hidden example, but tiktok is now published. Replace both occurrences of the hidden slug `"tiktok"` with `"secret-case"`, and update the assertion `expect(slugs).not.toContain("tiktok")` to `expect(slugs).not.toContain("secret-case")`. Leave the published/draft slugs as-is. This keeps the test's intent (hidden projects are filtered) without referencing a now-published case.

- [ ] **Step 2: Run the full suite**

Run: `npx vitest run`
Expected: PASS (all existing suites plus `content-order.test.ts`).

- [ ] **Step 3: Typecheck**

Run: `npx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Browser verification**

Start the dev server (preview tools) and verify:
- `/#work` gallery order is FAFSA, Fresh Greens, Navi, TikTok.
- `/work/tiktok` renders: hero (HeroThreePhones) → RecruiterCut at-a-glance → ProjectToc → "The full breakdown ↓" divider → sections. No old `project-meta` dl remains.
- The `tt-scope` section reads the corrected scope paragraph (no "three ... shipped").
- `/about` middle paragraph reads the new copy; home About reads the new copy.
- No console errors, no layout overflow on the RecruiterCut block at mobile width.

- [ ] **Step 5: Commit the test cleanup**

```bash
git add "src/app/work/[slug]/__tests__/static-params.test.ts"
git commit -m "test: retarget hidden-project fixture off the now-published TikTok case"
```

- [ ] **Step 6: /impeccable critique + audit on the TikTok case**

Run `/impeccable critique src/app/work/tiktok/page.tsx` and `/impeccable audit src/app/work/tiktok/page.tsx`. Focus areas: the new RecruiterCut block's consistency with the other cases, contrast, mobile fit, and that no claim exceeds the ground truth. Fix any P0/P1 in this branch; log P2/P3 in the plan or `next-session`. (Shared-chrome findings — eyebrow, numbered TOC — are portfolio-wide and out of scope per the spec.)

---

## Self-review notes

- **Spec coverage:** Part 1a → Task 2. Part 1b → Task 3. Part 1c (un-hide) → Task 1. Part 2 (reorder) → Task 1. Part 3 (copy) → Task 4. Part 4 (UMG) → no-op by design. Verification + /impeccable → Task 5.
- **No LeadMedia** for TikTok is deliberate (hero carries the cover); Task 3 omits it on purpose.
- **Ground-truth claims:** every TikTok number traces to grill-me (3 designed, ~10 batch, 1 shipped = Light Academia, AE adopted). No performance metric is claimed (the public 40%/60% ROAS figures belong to later AI-avatar campaigns and are excluded).
