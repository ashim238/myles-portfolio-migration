# Portfolio positioning pass — design

Date: 2026-07-09
Branch: `portfolio/positioning-pass`

## Why

Reviewer feedback (full-time product-design audience): the site undersells the
strategy + design + code intersection and underuses real impact numbers. Four
changes, all honesty-bound. No metric is claimed that the person cannot defend
in an interview.

## Part 1 — TikTok case: parity + honesty fix + un-hide

The TikTok case (`src/app/work/tiktok/page.tsx`, currently `status: hidden`) is
strong in writing (last impeccable critique 37/40) but sits one system-version
behind the other three cases and contains one self-contradicting claim.

### 1a. Honesty fix (blocking — do this even if nothing else lands)

The "Where the work went" prose currently reads:

> "My contribution sits in the launch generation: three of the 30+ templates
> that shipped when the format went live."

This contradicts the page's own `OutcomeCard`, which correctly says only the
**Light Academia** template shipped and American Eagle adopted it. Ground truth
(from the designer, verified in grill-me):

- Designed **3** templates (Dopamine / e-Boy / Light Academia aesthetics).
- **1** shipped — the Light Academia one — and **American Eagle adopted it**.
- The other 2: unknown, not claimed.
- The GCL's launch batch was **~10** templates total; TikTok's DSA format shipped
  30+ templates overall (context, not the designer's).

Rewrite the paragraph to match the OutcomeCard. Proposed:

> "My contribution sits in the launch generation. I designed three templates,
> one for each aesthetic. The Light Academia one shipped, and American Eagle
> adopted it. The other two were part of the ~10-template batch the studio built
> for the format's launch."

Keep the following (true) line: "The mechanic outlived the product that
introduced it." Do NOT restate "three ... shipped" anywhere.

### 1b. Structural parity (mirror the other three cases)

Bring the case level with the other three's recruiter-cut treatment. Note the
TikTok page already has a `ProjectToc` (keep it) and its hero already embeds
`HeroThreePhones` marked `data-project-enter-cover` — that device composite is
this case's cover, so it does NOT get a `LeadMedia` (the other three add
`LeadMedia` only because their heroes are text-only). The actual gap is the
at-a-glance block and the tier divider.

Replace the old `<dl className="project-meta tt-meta">` strip (page lines 77-90)
with `RecruiterCut`, and add the tier divider after the existing `ProjectToc`:

1. `<RecruiterCut ... />` (replaces the old meta dl) with these fields:
   - **problem:** "On TikTok, recycled product creative does not land. One ad
     treatment for every subculture flattens what people are there to find."
   - **role:** "Visual Designer, Brand Studio" (function over official title,
     matching the other cases' Role convention and this case's frontmatter; the
     May–Aug 2021 timeline beside it signals the internship scope).
   - **timeline:** "May – August 2021"
   - **stack / stackLabel:** stack "Illustrator, Photoshop", stackLabel "Tools"
     (the page's own meta strip records Illustrator · Photoshop — the real 2021
     tools, not the earlier Figma guess).
   - **outcomeValue / outcomeLabel:** value "1", label "of 3 templates shipped,
     adopted by American Eagle". (CountUp on 1 is acceptable; if it reads flat,
     drop the outcome row and let Key moves carry it.)
   - **moves:**
     - "Mapped TikTok's subcultures down to three aesthetic systems a brand
       could see itself in."
     - "Designed one slot-map skeleton with three subculture fills, so a catalog
       stays native to each audience."
     - "Shipped the Light Academia template. American Eagle adopted it."
2. Keep the existing `<ProjectToc>` (already present, lines 92-102) unchanged.
3. Add `<div className="case-tier-divider"><span>The full breakdown ↓</span></div>`
   immediately after the `ProjectToc`, before the first `tt-section`.

The bespoke `HeroThreePhones` hero stays untouched (it is the case's signature
and its cover).

### 1c. Un-hide

- `content/projects/tiktok.md`: `status: hidden → published`.
- Confirm it now appears in `/#work`, nav, sitemap, and the ProjectWorkJump
  rotation on the other three cases (all driven by `getPublishedProjects`).

## Part 2 — Reorder the home gallery

Frontmatter `order:` changes only:

| Case | order (was → now) |
|---|---|
| understandingfafsa | 2 → 1 |
| fresh-greens | 1 → 2 |
| navi | 3 → 3 |
| tiktok | 4 → 4 |

FAFSA leads (crisp 52.6% hook), Fresh Greens second (range/depth), Navi third,
TikTok fourth (earliest work, the one industry/brand case).

## Part 3 — Positioning copy rewrite

Claim the strategy + design + code intersection with the honest numbers now on
the table (FAFSA 30%→52.6%, Fresh Greens solo-built a11y-first, TikTok
shipped-and-AE-adopted). Voice rules apply: no em-dashes, semicolons, ellipses;
Oxford comma; no hype words.

### 3a. Home `about` section (`src/app/page.tsx`) — keep it punchy

Current:
> "I design end to end and ship past the prototype. Ask me about the Gmail HTML
> ceiling or why the Navi daylight cue is a WCAG dash pattern."

Proposed:
> "Strategy, design, and code, and I ship past the prototype. Ask me how a
> nonprofit newsletter went from 30% to 52.6% open rates, or why the Navi
> daylight cue is a WCAG dash pattern."

### 3b. `/about` middle paragraph (`src/app/about/page.tsx`) — the reviewer's target

Current paragraph 2 keeps its thesis + FAFSA content but gains the intersection
frame and the TikTok hook. Proposed:

> "I design end to end and tend to go past the prototype, pulling strategy,
> design, and code into the same process. My thesis was a solo-built React
> Native wayfinding app for Black travelers in America, with VoiceOver labels,
> dynamic type, and a WCAG dash pattern for the daylight cue built in from the
> start. For a financial-aid nonprofit, I rebuilt the newsletter as modular
> templates a non-designer could run without breaking the brand, and open rates
> went from 30% to 52.6%. At TikTok I designed catalog ad templates around the
> platform's subcultures, and American Eagle adopted one."

Paragraphs 1 (TikTok/UMG origin) and 3 (accessibility/systems) stay as-is.

## Part 4 — UMG stays context

No case. The origin beat on `/about` para 1 and the résumé entry are the whole
treatment. (Separate résumé chat owns any résumé-line sharpening.)

## Out of scope

- Résumé edits (owned by a separate chat).
- The Pinterest deck (separate branch `deck/pinterest-application`).
- Touching the shared chrome the TikTok critique flagged (eyebrow, meta strip,
  numbered TOC) — those are portfolio-wide and identical across all four cases;
  changing them is a separate design-system decision, not this pass.

## Verification

- `npm test` green (existing suites, incl. `work/[slug]` static params now
  including tiktok).
- Browser check: `/#work` order, TikTok case renders LeadMedia + RecruiterCut +
  ProjectToc + divider, no overflow, honesty line matches OutcomeCard.
- `/impeccable critique` and `/impeccable audit` on `src/app/work/tiktok/page.tsx`
  after the parity work; fix P0/P1, log P2/P3.
