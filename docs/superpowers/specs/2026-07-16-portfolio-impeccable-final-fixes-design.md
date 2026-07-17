# Portfolio Impeccable Final Fixes Design

## Intent

Resolve every approved P1 through P3 finding from the final portfolio audit without flattening the four case studies into one template. The work should make the process easier to scan, improve accessibility, qualify evidence precisely, and keep the interactive artifacts that make the portfolio feel authored.

## Design decisions

### Process navigation

- The shared table of contents must land headings below the sticky navigation.
- Fresh Greens will expose all nine visible process headings. The table of contents should show the actual design progression rather than compressing it into four broad chapters.
- The Fresh Greens daylight palette may repeat across adjacent stages, but the sequence must still move from morning warmth into the night color by the final stage.

### Accessibility and color

- Opening the lightbox must make the page behind it inert to keyboard and assistive-technology navigation, while preserving Escape, close-button focus, and focus return.
- Navi will separate its bright orange graphic accent from a darker light-theme text accent. Selected labels must use the text-safe token.
- The Fresh Greens architecture scroller must be keyboard focusable, named as a region, and visibly focused.

### Recruiter scan layer

- `RecruiterCut` will display no more than four fact rows.
- Problem framing stays in the hero and process narrative, so the scan layer will prioritize role, team or contribution, timeline, and outcome or tools.
- Labels use sentence case without tracked uppercase styling.
- Key moves remain available, but the component must not force every project into the same quantity or rhetorical shape.

### UnderstandingFAFSA evidence and interaction

- The 52.6% result will be described as an observed first-send result, not a controlled attribution test.
- The shipped modular system leads the outcome framing. The earlier-send comparison remains supporting context only.
- The phone frames remain manually scrollable. Page scroll must not take control of their internal position.
- The composer remains as optional proof of the system. It will sit behind a disclosure and present fewer controls on small screens.

### TikTok close

- The final section will show critique, revision, and shipped direction as a compact visual sequence using existing template artifacts.
- Copy will remain specific to what Myles made and what he learned through Global Creative Lab. No invented performance claims or retrospective certainty.

### Media and cleanup

- Remove the unused Fresh Greens MOV from the deployable public directory.
- Re-encode the referenced MP4 only if the result is materially smaller without making the already-sensitive interface footage blurry.
- Replace the stray TikTok custom property in Fresh Greens CSS with the correct Fresh Greens or shared semantic token.

## Global constraints

- Preserve every factual claim, project role, date, metric, and evidence boundary.
- No em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or aphoristic closers in candidate-facing prose.
- Keep project-specific type, color, motion, and artifacts. Shared components may improve scanning but must not erase each case study's visual identity.
- All behavior changes begin with a failing regression test.
- Respect reduced-motion preferences and existing keyboard behavior.
- Do not alter Fresh Greens files that are unrelated to the approved audit findings from PR 37.

## Acceptance criteria

- All approved P1, P2, and P3 findings have a code or content resolution.
- Focused tests cover table-of-contents alignment, all Fresh Greens stages, lightbox inertness, Navi text token usage, architecture scroller access, recruiter fact limits, FAFSA manual scrolling and disclosure behavior, claim qualification, and the TikTok visual close.
- Full Vitest, ESLint, TypeScript, content validation, build, and `git diff --check` pass.
- The four case studies complete a final Impeccable and AI-slop audit with no new P0 or P1 findings.
