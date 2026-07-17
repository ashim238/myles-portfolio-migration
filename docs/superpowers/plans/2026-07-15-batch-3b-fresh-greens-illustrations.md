# Batch 3B Fresh Greens Illustration Sequence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** Replace the flattened Fresh Greens onboarding composite with four individual story-bearing illustrations that remain legible and sequential on desktop, tablet, and mobile.

**Architecture:** Import the four user-supplied SVG artboards under semantic public paths. A dedicated client component owns panel data, accessible descriptions, and one-time progressive reveal. The case page renders that component in place of the composite. Scoped Fresh Greens CSS owns the four-up, two-by-two, and mobile scroll-snap layouts.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, TypeScript 5, Vitest 2.1.9, Testing Library, CSS media queries.

## Global Constraints

- Use the four individual SVGs from `/Users/mylesashitey/Desktop/SVG`; do not recreate or flatten them.
- Preserve the narrative order: location journey, reflection, trusted safety, community conversation.
- Replace the composite in the rendered page. Do not show both treatments.
- Desktop: four equal panels. Tablet: two-by-two. Mobile: 82–86vw horizontal scroll-snap with the next panel visibly peeking.
- Motion: one restrained entrance stagger only. No looping or independent panel animation.
- Progressive enhancement: panels are visible by default, visible without JavaScript, and static for reduced motion.
- Keep the existing single caption. Do not add visible labels or explanatory copy to each panel.
- Alt text identifies Black drivers where a driver appears and describes the actual illustration.
- Preserve lightbox keyboard behavior and focus visibility.

---

### Task 1: Build the responsive individual illustration sequence

**Files:**
- Create: `public/projects/fresh-greens/process/onboarding/driver-location-journey.svg`
- Create: `public/projects/fresh-greens/process/onboarding/driver-reflection.svg`
- Create: `public/projects/fresh-greens/process/onboarding/trust-and-safety.svg`
- Create: `public/projects/fresh-greens/process/onboarding/community-conversation.svg`
- Create: `src/components/fresh-greens/onboarding-illustration-sequence.tsx`
- Create: `src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx`
- Modify: `src/app/work/fresh-greens/page.tsx`
- Modify: `src/app/globals.css`

**Asset mapping:**

- `illustrationsAsset 5.svg` → `driver-location-journey.svg`
- `illustrationsAsset 6.svg` → `driver-reflection.svg`
- `illustrationsAsset 7.svg` → `trust-and-safety.svg`
- `illustrationsAsset 9.svg` → `community-conversation.svg`

- [ ] **Step 1: Write the failing semantic sequence test**

Mock `ExpandableImage` as a simple image so the component test does not depend on the lightbox provider. Assert the component renders:

- one ordered list named `Fresh Greens onboarding illustration sequence`;
- four list items in the required source order;
- the four semantic SVG paths;
- driver alt text that contains `Black driver` for panels one, two, and four;
- no reference to `onboarding-illustrations.svg`.

Run: `npm test -- src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 2: Import the source assets without modifying their artwork**

Create the semantic onboarding directory and copy the four exact Desktop SVG files according to the asset mapping. Verify file sizes and SVG viewBoxes after the copy.

- [ ] **Step 3: Implement the sequence component**

Create a client component with a module-level ordered panel array. Render:

- `<figure className="fg-illustrations">`;
- `<ol className="fg-illustration-track" aria-label="Fresh Greens onboarding illustration sequence">`;
- four `<li className="fg-illustration-panel">` items with `--fg-illustration-index` set from the map index;
- one `ExpandableImage` per panel using its semantic source and accurate alt text;
- the existing `fg-safety-visual-caption` copy after the list.

For one-time reveal:

- leave the static render visible;
- in `useEffect`, exit without setting state when reduced motion is requested;
- otherwise set `data-reveal="pending"`, observe the figure, change to `data-reveal="in"` on first intersection, disconnect, and never reset;
- if `IntersectionObserver` is unavailable, reveal immediately;
- include a bounded timeout fallback so content cannot stay parked.

- [ ] **Step 4: Replace the composite in the case page**

- Import `OnboardingIllustrationSequence`.
- Replace the inline composite `<figure>` with `<OnboardingIllustrationSequence />`.
- Remove the now-unused `ExpandableImage` import only if no other page usage remains.

- [ ] **Step 5: Implement responsive layout and reduced motion**

Update the existing Fresh Greens illustration CSS rather than creating a second unrelated block.

- Base/tablet: two-column grid with equal gutters.
- At `min-width: 900px`: four equal columns.
- At `max-width: 620px`: horizontal grid flow with `grid-auto-columns: 84%`, `overflow-x: auto`, `scroll-snap-type: x mandatory`, and each panel `scroll-snap-align: start`.
- Keep the warm-neutral panel, border, and caption treatment.
- Use `@media (prefers-reduced-motion: no-preference)` for pending/in transitions. Stagger with `calc(var(--fg-illustration-index) * 90ms)`.
- Do not hide or translate panels outside that media query.

- [ ] **Step 6: Verify behavior and source integrity**

Run:

```bash
npm test -- src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx
npx eslint src/components/fresh-greens/onboarding-illustration-sequence.tsx src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx src/app/work/fresh-greens/page.tsx
npx tsc --noEmit
git diff --check
```

Also verify the rendered page source no longer references the flattened composite and the four copied SVG hashes or sizes match their Desktop sources.

- [ ] **Step 7: Browser preview before final approval**

Inspect `/work/fresh-greens` at approximately 1440px, 768px, and 390px widths in both themes. Confirm:

- desktop is a legible four-up strip;
- tablet is two-by-two;
- mobile shows one large panel plus a next-panel peek and scrolls horizontally without page overflow;
- focus outlines remain visible on every expandable panel;
- the one-time stagger does not gate content;
- reduced motion is static;
- all four illustrations remain sharp at delivered size.

- [ ] **Step 8: Commit**

```bash
git add public/projects/fresh-greens/process/onboarding src/components/fresh-greens/onboarding-illustration-sequence.tsx src/components/fresh-greens/__tests__/onboarding-illustration-sequence.test.tsx src/app/work/fresh-greens/page.tsx src/app/globals.css
git commit -m "feat: sequence Fresh Greens onboarding illustrations"
```
