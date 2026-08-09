# Myles 98 six-step redesign closeout

**Branch:** `codex/myles-98-visual-refinement`  
**Started:** 2026-08-09  
**Rule:** Every change must improve comprehension, visual coherence, accessibility, performance, or project identity. No new framework work without a rendered failure.

## Step 1 — Capture and inventory

Run the local production screenshot matrix against the exact branch commit, then inspect:

- Home at 1440×900, 1280×720, 1024×768, 768×1024, 390×844, and 320×568.
- Fresh Greens, Navi, UnderstandingFAFSA, and TikTok on desktop and Pocket.
- About, Résumé, and Loose Parts on Pocket.
- Navi demo on desktop and Pocket.

For each issue, record the viewport, screen, evidence, severity, and proposed correction. Source inspection alone is not sufficient for spacing, crop, hierarchy, or optical-alignment decisions.

## Step 2 — System chrome and icon precision

Review the system at its actual display sizes rather than only on the 24×24 drawing grid:

- 16–20px compact chrome: Reader header, title bars, taskbar, Start, and next-project handoffs.
- 24–32px program listings: Start menu and Pocket surfaces.
- 40px+ desktop shortcuts.

Acceptance criteria:

- Each icon has one dominant silhouette.
- Internal shapes do not merge at compact sizes.
- Color is supportive rather than required for recognition.
- Optical weight and baseline alignment are consistent.
- Project icons remain distinct without becoming miniature diagrams.

### Issues already confirmed

| Surface | Problem | Cause | Resolution |
| --- | --- | --- | --- |
| UnderstandingFAFSA Reader header | The envelope plus three detached module boxes collapses into a knot at 18px. | The large project glyph was reused without a small-icon drawing. | Compact monochrome chrome now uses a dedicated application-window-and-mail silhouette; the richer project icon remains available at larger color sizes. |
| Reader `Selected work` control on Pocket | The control appears detached from the top-left system edge. | It inherited both the page-shell padding and the centered Reader-column inset. | Mobile Reader navigation now aligns to the same 12px safe edge as the Reader header while retaining a 44px target. |

## Step 3 — Responsive composition and route continuity

Review the complete portfolio journey rather than isolated pages:

- Desktop/Pocket → project program → Reader.
- Direct case-study links.
- Reader → next project.
- Reader → Selected Work and Return to Desktop.
- About, Résumé, and Loose Parts inside Myles 98.
- Browser Back and Forward.

Check window balance, shortcut spacing, taskbar rhythm, safe areas, dock clearance, title wrapping, media scale, lightbox clearance, and the 767/768px shell boundary.

## Step 4 — Case-study visual simplification and voice

Use the evidence maps as private editorial checks, not visible page grammar.

- Fresh Greens follows the James Carter screenplay and Myles's answers.
- TikTok and UnderstandingFAFSA lose labels, cards, or miniature frameworks that interrupt the story.
- Navi keeps project identity while removing style collisions and correcting diagram geometry.
- Every custom artifact must prove a decision, expose process, demonstrate behavior, show change, validate an outcome, or clarify a constraint.
- Each chapter should have one dominant proof and end with an interpretation rather than an unexplained image.

## Step 5 — Interaction, accessibility, and performance QA

Run the full automated matrix, then manually verify:

- Keyboard-only use.
- 200% zoom and enlarged text.
- Reduced motion.
- Forced colors.
- Coarse pointer and touch targets.
- Focus order and focus visibility.
- Back/Forward and scroll restoration.
- No blank transition frames.
- Deployed LCP and CLS.

## Step 6 — Hiring-manager scan and design freeze

Test each case study with unfamiliar readers:

- **90 seconds:** role, problem, strongest decision, proof, and outcome are recoverable.
- **10 minutes:** the story remains coherent, specific, honest, and memorable.

After these checks, freeze the visual system. Additional changes require a specific comprehension, accessibility, performance, interaction, or rendering failure.

## Information to request from Myles only when needed

Ask for input when the decision depends on personal voice, authorship, project chronology, intended emotional tone, or an unavailable source asset. Do not ask for approval on objective alignment, overflow, contrast, tap-target, or rendering defects.
