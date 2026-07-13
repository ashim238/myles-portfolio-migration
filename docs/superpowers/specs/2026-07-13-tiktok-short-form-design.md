# TikTok DSA — Short-Form Case Study

**Date:** 2026-07-13
**Scope:** Distill the existing hidden TikTok case study page into a concise, visually striking short-form page. Cut process sections, keep the finished work and the system thinking.

## Context

The TikTok Dynamic Showcase Ads case study covers the Summer 2021 internship only. The page is fully built (323-line bespoke page, 9 components, 43 images, dedicated CSS) but hidden. The work is strong — American Eagle adopted one template — but the full 7-section walkthrough oversells the scope of a single internship summer.

The goal: publish a short-form page that leads with the deliverable, shows the system thinking (template anatomy), and gets out. No research narrative, no retrospective, no lineage timeline. Concise but still designed and premium.

## Page Structure

### Beat 1 — Hero

Keep the existing hero structure:

- `TikTokCoverBlobs` background
- `TikTokLogo` + "Internship · 2021" eyebrow
- Title: "TikTok Dynamic Showcase Ads"
- Lede (existing copy works)
- **Move `HeroThreePhones` up into the hero area** as the primary visual, directly below the lede. Currently it lives inside section 01 ("The brief") — relocate it here so the finished work is the first thing a visitor sees.

### Beat 2 — RecruiterCut

Keep as-is. No changes to props:

- Problem, Role, Timeline, Tools, Outcome, Key moves
- This is the 30-second recruiter read

### Beat 3 — The System (TemplateAnatomy)

Section heading: "One skeleton. Three fills."

One paragraph explaining the slot-map logic (title zone, catalog grid, supplementary graphics, CTA — same role across aesthetics, only the fill changes). Then the `TemplateAnatomy` component.

No `case-section-lead` needed — the heading carries the section. Trim the existing body text to 2-3 sentences max.

### Beat 4 — Three Aesthetics

Section heading: "Three aesthetics."

Brief intro line (existing `tt-aesthetics-lede` trimmed). Then the three `AestheticShowcaseCard` components in order:

1. DopamineDressing (high-saturation joy)
2. e-Boy/e-Girl (edge and texture)
3. LightAcademia (quiet and considered)

Each card already contains: sketch, finished template, palette, and review feedback. No changes to card content or props.

### Beat 5 — Outcome Closer

Replace the full "What shipped" section + `OutcomeCard` component with a tight closing line. Use an existing `case-highlight` mark on the key outcome. One sentence, not a full section with heading.

Alternatively, keep the `OutcomeCard` if it reads tight enough on its own — evaluate during implementation.

### Beat 6 — ProjectWorkJump

Next case study navigation. No changes.

### CaseHighlightObserver

Keep — it drives the mark animations in the remaining body text.

## What Gets Cut

| Removed | Component(s) dropped |
|---|---|
| ProjectToc | Sticky TOC nav — page is short enough to scroll |
| "The full breakdown" divider | `case-tier-divider` — no longer needed |
| Section 01 body text | SystemOverviewBand, section paragraphs (HeroThreePhones relocates to hero) |
| Section 02 "Reading the platform" | Pullquote, all body text |
| Section 06 "Honest scope" | LineageTimeline |
| Section 07 "Retrospective" | All body text |
| ConsoleHello | Easter egg console.log — drop for cleanliness |

## What Changes Outside the Page

- **`content/projects/tiktok.md`**: flip `status` from `hidden` to `published`
- **No new components**: everything reuses existing components, just fewer of them
- **No CSS changes expected**: existing `.tt-` classes cover all retained elements. May need minor adjustment if HeroThreePhones needs different spacing in the hero context vs. a section body.
- **Gallery**: once status is `published`, the content engine will include TikTok in `getPublishedProjects()` and it will appear in the home work gallery automatically.

## Design Principles

- **Lead with the work, not the journey.** The three finished templates and the anatomy are the page.
- **No apology for brevity.** A short page that's confident reads better than a padded one.
- **Same visual craft.** TikTok cover blobs, aesthetic cards, anatomy breakdown — these are already well-designed components. The short form lets them breathe instead of competing with process text.
- **Consistent with other case studies.** Same `page-shell project-page tt-page` skeleton, same RecruiterCut, same ProjectWorkJump. The difference is density, not structure.

## Out of Scope

- No new interactive components
- No changes to the aesthetic card design
- No changes to other case study pages
- 2022 internship (TikTok World) is not included — this page is 2021 only
