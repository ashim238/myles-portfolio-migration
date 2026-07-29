# Portfolio case-study refinement — UI review

**Audited:** 2026-07-29
**Baseline:** `docs/superpowers/specs/2026-07-29-portfolio-case-study-refinement-design.md`
**Implementation:** `codex/portfolio-case-study-refinement` at `2fd74b6`
**Rendered coverage:** 390 × 844, 1440 × 1000, and 1680 × 1000 across the five scoped routes
**Registry audit:** Not applicable. `components.json` is absent and the approved design contract lists no third-party component registry.

---

## Verdict

**24/24. No Critical or Important findings remain.**

The branch meets the approved editorial and interaction contract. All five routes preserve their individual visual identities while sharing a coherent case-study reading system. The rendered audit found no document-level overflow, clipped primary navigation, nested iframe scrolling, broken hierarchy, or breakpoint regression.

One Important accessibility issue was found during the audit and corrected before final scoring: Loom's dark-theme control boundary was initially 1.89:1. The corrected `#776e64` border is 3.35:1 against the panel and 3.06:1 against the input background (`public/play/loom/style.css:17-26`). This report scores the corrected implementation, so the issue is resolved rather than listed as an open finding.

---

## Pillar scores

| Pillar | Score | Key finding |
|---|---:|---|
| 1. Copywriting | 4/4 | PASS: Each project now states the user stake, design decision, ownership, and proof boundary without generic CTA or unsupported impact language. |
| 2. Visuals | 4/4 | PASS: Hero hierarchy, primary artifacts, chapter progression, and project-specific visual identities rendered correctly at every audited width. |
| 3. Color | 4/4 | PASS: Project accents remain scoped and legible in both themes; Loom's audited dark control boundary now clears 3:1. |
| 4. Typography | 4/4 | PASS: Headings, chapter labels, body copy, metadata, and captions form a stable hierarchy without truncation at the audited breakpoints. |
| 5. Spacing | 4/4 | PASS: Mobile, desktop, and wide layouts showed no document overflow or content collision; intended artifact scrollers stayed contained. |
| 6. Experience design | 4/4 | PASS: TOC behavior, reduced-motion handling, Loom resizing and theme sync, focus treatment, semantic structure, and non-JavaScript paths satisfy the contract. |

**Overall: 24/24**

---

## Priority fixes

None. Only Critical or Important findings are eligible for fixes in this review, and none remain after the Loom contrast correction.

---

## Detailed findings

### Pillar 1: Copywriting (4/4)

**PASS**

- Fresh Greens moves from personal origin to a bounded six-interview hypothesis, then explicitly separates prototype behavior from safety proof (`src/app/work/fresh-greens/page.tsx:113-140`, `src/app/work/fresh-greens/page.tsx:154-193`, `src/app/work/fresh-greens/page.tsx:337-384`).
- Navi leads with the resident and stakeholder stake, identifies the 14-response sample, and separates the graduate-studio concept from the solo rebuild (`src/app/work/navi/page.tsx:84-115`, `src/app/work/navi/page.tsx:173-204`).
- UnderstandingFAFSA exposes the audit-to-rule chain, founder workflow, 102 KB constraint, and uncontrolled metric attribution in direct language (`src/app/work/understandingfafsa/page.tsx:153-175`, `src/app/work/understandingfafsa/page.tsx:235-263`, `src/app/work/understandingfafsa/page.tsx:277-290`).
- TikTok defines the product, role, team, fixed and variable parts before the process story, then preserves the indirect American Eagle relationship (`src/app/work/tiktok/page.tsx:79-103`, `src/app/work/tiktok/page.tsx:114-147`, `src/app/work/tiktok/page.tsx:315-320`).
- Play uses the approved active-lab framing and makes every experiment's question, medium, state, change, next step, and update scannable (`src/app/play/page.tsx:46-53`, `src/app/play/page.tsx:72-99`).

No generic “Submit,” “Click here,” “OK,” or context-free “Save” labels were found in the audited scope.

### Pillar 2: Visuals (4/4)

**PASS**

- The canonical chapter map establishes clear project-specific story rhythms: six chapters for Fresh Greens, five for Navi, five for UnderstandingFAFSA, and four for TikTok (`src/lib/project-chapters.ts:13-101`).
- Fresh Greens gives the Plan and Respond chapters dominant, decision-specific artifacts and uses an accessible moderation sequence rather than decorative text arrows (`src/app/work/fresh-greens/page.tsx:198-248`, `src/app/work/fresh-greens/page.tsx:284-324`).
- TikTok's final beat is a legible three-step Critique → My response → Shipped result sequence (`src/app/work/tiktok/page.tsx:257-313`). Its cards share row geometry without forcing empty height (`src/app/styles/portfolio-surfaces.css:1781-1823`).
- Play preserves the authored specimen treatment while adding quiet working notes and a material-process sequence (`src/app/play/page.tsx:101-140`, `src/app/play/play.module.css:1-62`).
- Rendered verification confirmed correct hero hierarchy and loaded imagery on all five routes. No primary artifact escaped its intended container.

### Pillar 3: Color (4/4)

**PASS**

- Existing project accent systems remain isolated by page instead of being flattened into a new shared visual identity.
- The TikTok TOC uses four alternating cyan and magenta segments to match the four-beat structure (`src/app/styles/late-polish.css:1463-1484`).
- Loom maps page, panel, text, input, action, and focus colors to explicit light and dark tokens (`public/play/loom/style.css:5-27`). The final dark border is 3.35:1 against the panel and 3.06:1 against the input background.
- Loom's button text is 4.72:1 against its default brown action color and its dark body text is 15.78:1 against the page background.

No remaining color defect affects meaning, control recognition, or task completion.

### Pillar 4: Typography (4/4)

**PASS**

- Chapter titles remain descriptive rather than generic, and Fresh Greens deliberately enlarges the pulled-over chapter title as the narrative's emotional peak (`src/lib/project-chapters.ts:14-44`, `src/app/styles/late-polish.css:1216-1221`).
- TikTok and Play use compact 0.75rem uppercase labels only for definition-list metadata, with normal-sized values immediately adjacent (`src/app/work/tiktok/tiktok-four-beat.module.css:13-22`, `src/app/play/play.module.css:14-24`).
- Loom retains a restrained internal hierarchy with a fluid 1.5rem–2rem title and 1.5 line-height support copy (`public/play/loom/style.css:57-67`).
- Rendered verification found no truncated chapter labels, collapsed headings, or broken text hierarchy at mobile, 1440px, or 1680px.

### Pillar 5: Spacing (4/4)

**PASS**

- At 390 × 844, every scoped route reported `document.clientWidth === document.scrollWidth === 390`. Apparent child overflow remained inside intentional horizontal artifact scrollers.
- At 1440 × 1000, all four case studies retained a horizontal 1043 × 67 sticky TOC with no document overflow.
- At 1680 × 1000, the case-study TOC moved to the fixed 58px-wide vertical rail without colliding with content (`src/app/styles/base.css:3397-3509`).
- Play's experiment notes collapse from a two-column definition layout to a single column below 700px, and its process arrows change direction with the layout (`src/app/play/play.module.css:6-12`, `src/app/play/play.module.css:46-61`).
- TikTok's brief facts collapse from two columns to one below 640px (`src/app/work/tiktok/tiktok-four-beat.module.css:1-29`).

### Pillar 6: Experience design (4/4)

**PASS**

- The TOC stays horizontal at 1440px and changes to a fixed vertical spine only at 1600px, where complete labels fit. Links retain 44px minimum target height and reveal labels on hover or keyboard focus (`src/app/styles/base.css:3397-3502`).
- Navi's loading skeleton removes its pulse under reduced motion (`src/app/styles/late-polish.css:281-307`).
- Fresh Greens' pivot reveal is visible by default for no-JavaScript and reduced-motion users, with an IntersectionObserver fallback (`src/components/fresh-greens/pivot-journey.tsx:7-45`).
- Loom controls use semantic labels and buttons, 44px minimum targets, visible focus, a polite status region, and a dynamically updated artwork description (`public/play/loom/index.html:21-34`, `public/play/loom/style.css:81-115`, `public/play/loom/sketch.js:280-292`).
- The same-origin Loom bridge validates message origin and source, synchronizes theme, reports content height, and stops p5's continuous draw loop (`src/components/loom-embed.tsx:50-115`, `public/play/loom/embed-bridge.js:15-42`, `public/play/loom/sketch.js:40-73`).
- Rendered verification confirmed a 932px desktop iframe with no nested scrollbar, no document overflow at any audited Play breakpoint, and a persistent direct “Open Loom in a new tab” fallback (`src/components/loom-embed.tsx:104-123`).

---

## Responsive, accessibility, coherence, and fidelity summary

- **Responsive behavior:** Passed at 390, 1440, and 1680 widths. Mobile and desktop navigation modes changed at the intended breakpoints without overlap or document overflow.
- **Hierarchy and craft:** Passed. Each route retains its own authored visual language while the shared chapter system improves scanning and causal reading.
- **Interaction:** Passed. Interactive exhibits remain reachable, Loom resizes without a nested scroll trap, and loading or motion behavior respects reduced-motion preferences.
- **Accessibility:** Passed after the dark Loom boundary correction. Semantic lists and definition lists, useful alternative text, focus-visible treatments, 44px control targets, live status, and motion fallbacks are present.
- **Scope fidelity:** Passed. The implementation follows the approved chapter counts, artifact priorities, ownership language, evidence limits, Play lab framing, and shared TOC breakpoint.

---

## Minor polish

These are observations only. They are not Critical or Important and are not eligible for fixes in this audit.

- Loom intentionally uses its own `"Inter", "Segoe UI", Arial` stack rather than inheriting the portfolio type stack (`public/play/loom/style.css:29-35`). This works as an embedded experiment, though a future typography pass could decide whether stronger host-page continuity is desirable.
- Play's process connectors use CSS arrow glyphs (`src/app/play/play.module.css:39-60`). They are decorative and absent from the accessibility tree because the semantic ordered list already carries sequence, but custom line-and-chevron geometry could offer finer visual alignment in a later polish pass.

---

## Files audited

- `docs/superpowers/specs/2026-07-29-portfolio-case-study-refinement-design.md`
- `docs/superpowers/plans/2026-07-29-fresh-greens-problem-led-case-study.md`
- `docs/superpowers/plans/2026-07-29-navi-resident-led-case-study.md`
- `docs/superpowers/plans/2026-07-29-play-active-lab.md`
- `docs/superpowers/plans/2026-07-29-portfolio-shared-case-study-contracts.md`
- `docs/superpowers/plans/2026-07-29-tiktok-four-beat-case-study.md`
- `docs/superpowers/plans/2026-07-29-understandingfafsa-audit-to-rule-case-study.md`
- `src/app/work/fresh-greens/page.tsx`
- `src/components/fresh-greens/pivot-journey.tsx`
- `src/app/work/navi/page.tsx`
- `src/components/navi/research-artifacts.tsx`
- `src/app/work/understandingfafsa/page.tsx`
- `src/lib/understandingfafsa-audit-rules.ts`
- `src/app/work/tiktok/page.tsx`
- `src/app/work/tiktok/tiktok-four-beat.module.css`
- `src/app/play/page.tsx`
- `src/app/play/play.module.css`
- `src/components/loom-embed.tsx`
- `src/components/loom-embed.module.css`
- `src/lib/content.ts`
- `src/lib/project-chapters.ts`
- `src/app/styles/base.css`
- `src/app/styles/late-polish.css`
- `src/app/styles/portfolio-surfaces.css`
- `public/play/loom/index.html`
- `public/play/loom/style.css`
- `public/play/loom/sketch.js`
- `public/play/loom/embed-bridge.js`
