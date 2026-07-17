# Portfolio Final Pass Design

## Goal

Finish the portfolio-wide audit work without flattening the personality, motion, or artifact-led storytelling that makes the site memorable.

## Wave 1

Three independent lanes can proceed together:

1. Fresh Greens evidence and narrative, owned by the main thread. Replace claims that imply validation with precise prototype language. Distinguish interview-supported inputs, implemented behavior, and questions that still require testing. Tighten the final third and end on demonstrated product judgment, with future work clearly secondary.
2. Résumé export, owned by a subagent. Restore a downloadable, accessible PDF generated from the public résumé page while keeping the phone number out of the site, generated PDF, tests, and source.
3. Motion media, owned by a subagent. Inspect the existing navigation clip and delivery component, improve formats and fallbacks where code can help, and identify whether a higher-resolution source is required. Do not synthesize detail that is absent from the source.

## Wave 2

After Wave 1 is integrated, run read-only portfolio-wide reviews for rendered layout, accessibility and interaction, prose and claim consistency, media performance, and production build behavior. Fix only verified issues, then repeat the full quality gates.

## Content constraints

- Preserve the homepage decoder and Absolute Batman line.
- Keep Fresh Greens first and clearly identified as the latest project.
- Name Black drivers explicitly in Fresh Greens.
- Keep TikTok concise. Do not manufacture process detail for a five-year-old project.
- Preserve specific facts while removing inflated or unsupported implications.
- Follow Myles's voice guide: no em dashes, semicolons, ellipses, hype, rhetorical questions posed and answered, or aphoristic closers.
- Prefer interactive or visual evidence over additional prose when it materially clarifies the product story.

## Engineering constraints

- Use test-first changes for behavior and candidate-facing claim guards.
- Keep subagent edit scopes disjoint because all agents share one worktree.
- Preserve unrelated dirty-worktree changes.
- Do not expose a phone number in any public artifact.
- Do not claim media sharpness without checking the source at its rendered size.
- Run focused tests after each lane, then the full test, lint, type-check, diff, build, and rendered QA gates before release.

## Success criteria

- Fresh Greens clearly labels what research supported, what was built, and what remains unproven.
- The case study ends on a concrete design decision or learning, not an unfinished feature.
- The public résumé has a verified downloadable PDF without a phone number.
- Motion playback is delivered in appropriate web formats, or the remaining source-resolution blocker is stated precisely.
- Homepage and every public route pass desktop and mobile visual review.
- All automated quality gates pass after integration.
