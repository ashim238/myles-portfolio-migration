# Portfolio Process, Motion, and Résumé Design

## Goal

Make each product-design case study communicate a complete design process through its visible section titles and reading timeline. Preserve the portfolio's artifact-led character while ensuring motion never renders false evidence. Bring the generated résumé into the same factual and privacy-safe system.

## Constraints

- Preserve every confirmed claim and qualifier already present in the case studies and résumé.
- Do not invent research, validation, outcomes, or implementation details.
- Keep content visible by default. Motion may emphasize content but may not gate it.
- Honor `prefers-reduced-motion`.
- Preserve the shared `ProjectToc` semantics, keyboard behavior, and 44px targets.
- Leave Fresh Greens' daylight-arc timeline unchanged.
- Do not publish a phone number.
- Use Myles's writing rules: no em dashes, semicolons, ellipses, hype language, or repeated process-eyebrow scaffolding.

## Process architecture

Every story-bearing H2 in TikTok, Navi, and UnderstandingFAFSA must appear in `ProjectToc`. The TOC title and visible H2 use the same wording. Process stages use mixed, natural heading constructions instead of repeated verb-led titles or separate eyebrow labels.

### TikTok

1. Fashion subcultures on TikTok
2. Defining the fixed catalog structure
3. Templates as modular parts
4. From sketches to layered files
5. What shipped from the launch batch

The existing outcome paragraph becomes a semantic section so the shipped result is part of the process timeline.

### Navi

1. Concentrated tourism as a routing problem
2. The first prototype: a Manhattan heatmap
3. Platform audits and resident research
4. The resident survey redirected the concept
5. From research to Learn, Plan, Go
6. Rebuilding Navi as a working system
7. A working booking flow
8. What I would validate next

The final title must retain the planning qualifier because the portfolio rebuild has not been validated with users.

### UnderstandingFAFSA

1. A rebrand and a weekly workflow
2. Where the old template broke down
3. What 120 newsletters revealed
4. Three send types from the audit
5. Rules for fixed and swappable parts
6. Rebuilding the system in Mailchimp
7. The first redesigned send

## Timeline motifs

The shared component remains unchanged at the API level. Page-scoped CSS specializes the existing dots, segment rails, and progress variables.

- TikTok uses a cyan rail with an offset magenta channel and split active waypoint.
- Navi uses its orange rail as a route with outlined waypoint stops.
- UnderstandingFAFSA assigns restrained palette colors to its process segments and uses the same sequence in the mobile progress bar.
- Fresh Greens retains its current daylight arc.

Longer active titles must ellipsize safely in the collapsed mobile control without shrinking the touch target.

## Motion

### Factual values

`CountUp` keeps its public API but stops interpolating numbers. The final value is the only text node at every moment. Intersection adds a one-shot underline or highlight reveal. Reduced-motion and no-JavaScript paths show the final value immediately.

### TikTok hero

Loosen the extracted blob composition by increasing the coordinate spread from `0.58` to `0.74` on desktop and tablet. Use a bounded mobile spread of `0.68` horizontally and `0.70` vertically. Keep the current drift envelope so the logo stays recognizable.

### Signature artifact motion

- TikTok: reveal each final template after its sketch with a short view-timeline overlay sweep. Base content remains visible.
- Navi: keep the heatmap, survey rings, and live demo as the signature moments. The route timeline connects them. Avoid new ambient loops.
- UnderstandingFAFSA: change the template-switcher preview from a generic fade to a short top-to-bottom overlay sweep. Preserve the tall preview's existing bottom-fade mask, plus the before-and-after phones, composer, and locked/swappable interaction.
- Remove the generic résumé-detail scroll reveal. Contact information is utility content and should be visible immediately.

## Résumé

`src/app/resume/page.tsx` remains the single content source. The PDF is regenerated from that page.

- Preserve the current privacy-safe and evidence-qualified project descriptions.
- Link Fresh Greens, UnderstandingFAFSA, and Navi project names to their absolute production case-study URLs.
- Hide the global grain overlay in print to remove the full-page raster payload.
- Enforce a 1 MiB PDF size ceiling while retaining tags, headings, links, language, outlines, font mappings, one-page A4 layout, and logical reading order.
- Replace the stale application-upload PDF only after the generated public artifact passes visual and structural verification.

## Acceptance criteria

- The TikTok timeline contains five sections, Navi eight, and UnderstandingFAFSA seven.
- Each timeline exactly matches the page's story-bearing H2 titles and includes the final outcome or validation section.
- Metrics never display an interpolated or false value.
- Each timeline motif is page-scoped and leaves Fresh Greens unchanged.
- TikTok's stem and lower blob have visibly more breathing room at desktop and mobile widths without clipping.
- Motion enhancements are visible by default, bounded, and reduced-motion safe.
- The résumé PDF contains no phone number, passes all structural checks, includes three case-study links, remains one-page A4, and is at most 1 MiB.
- Focused tests, the full test suite, lint, TypeScript, production build, and responsive browser QA pass.

## Out of scope

- New research claims or portfolio metrics.
- A new animation library.
- Changes to Fresh Greens' separate worktree.
- Redesigning shared portfolio navigation or case-study chrome.
