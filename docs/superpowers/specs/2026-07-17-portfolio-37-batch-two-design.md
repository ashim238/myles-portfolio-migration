# Portfolio 37 Batch Two Design

## Intent

Make the design process legible within seconds without flattening the four case studies into the same story. Each case study will use five process chapters by default and no more than six when the work needs another meaningful decision point. Existing artifact-led sections remain in the page as evidence beneath those chapters.

This batch also replaces the generic end-of-page project grid with one authored next-project transition so each case study closes with a clear continuation rather than a repeated index.

On the homepage, combine the professional tagline and separate `Also` decoder into one finite statement. The line leads with product-design positioning, then reveals personality without adding another block of hero copy.

## Quality bar

The chapter system must help a product-design reviewer answer three questions while scanning:

1. What stage of the process am I reading?
2. What did Myles decide or make at this stage?
3. What artifact supports that claim?

The answer cannot depend on large blocks of explanatory copy. Hierarchy, chapter navigation, project-specific visual language, and the existing artifacts should carry most of the story.

## Relationship to earlier specifications

This specification supersedes the process-navigation rule in `2026-07-16-portfolio-process-motion-resume-design.md` that placed every story-bearing H2 in `ProjectToc`.

The previous headings remain visible and keep their factual meaning. They become sub-sections within a smaller set of five or six process chapters. `ProjectToc` tracks the chapters rather than every artifact section.

The Fresh Greens daylight progression, TikTok split-color trace, Navi route motif, and UnderstandingFAFSA modular palette remain project-specific. Their segment counts will be remapped to the new chapters.

## Approaches considered

### A. Chapter navigation with nested evidence sections

Add a shared chapter wrapper with a process stage, project-specific title, anchor, position, and total count. Render the chapter as the H2 level. Preserve the current story-bearing headings beneath it as H3 sub-sections.

Benefits:

- The design process is explicit in the table of contents and page body.
- Existing artifacts and narrative details remain intact.
- Five or six anchors create a usable progress map on desktop and mobile.
- Projects keep different pacing and visual systems.

Cost:

- Existing section heading levels must be migrated carefully.
- Tests that currently require every H2 in the table of contents must be updated to understand chapters and nested sections.

### B. Add process prefixes to every current heading

Keep the current flat structure and rename each H2 with labels such as Research, Define, or Build.

Benefits:

- Small component change.
- Every section remains directly addressable from the table of contents.

Cost:

- Eight or nine stages are too dense for a process overview.
- Repeated process wording would feel templated.
- The distinction between a process chapter and an artifact becomes unclear.

### C. Collapse each case study into five large sections

Replace the current sections with five or six large content blocks.

Benefits:

- Simplest table of contents.
- Strongest visual separation between stages.

Cost:

- Large sections would become dense.
- Artifact-specific headings would disappear or become harder to scan.
- The migration would create unnecessary copy and layout churn.

### Decision

Use approach A. The portfolio needs a clearer process layer, not less evidence.

## Shared chapter model

Each chapter has the following data:

- `id`: the scroll target used by `ProjectToc`.
- `stage`: a short product-design stage such as Research, Define, Build, or Validate.
- `title`: a project-specific description of what happened.
- `index`: the chapter's one-based position.
- `total`: the case study's total chapter count.

The shared chapter component renders:

- A semantic section with the chapter anchor.
- An H2 containing the project-specific chapter title.
- A visible sentence-case stage label.
- A compact chapter position such as `2 of 5`.
- A decorative transition motif that is hidden from assistive technology.
- The existing evidence sections as children.

The stage label is not a tracked uppercase eyebrow. It is part of the reading hierarchy and must remain readable at normal text size. The title carries the project-specific meaning, so stages do not force every case study into identical prose.

The existing evidence headings become H3 elements when a chapter contains multiple evidence sections. When a chapter contains one section with the same title, the chapter H2 absorbs that heading and the content follows directly. The page must not repeat the same title at H2 and H3. Wording changes only where grouping makes a heading misleading or redundant. No factual claim changes are part of this batch.

## Table of contents contract

`ProjectToc` receives chapter entries rather than every evidence section. Each entry contains `id`, `stage`, and `title`.

Behavior:

- The desktop and mobile timelines display the stage and project-specific title.
- The compact mobile control identifies the active stage before the title.
- The active chapter remains active until the following chapter begins.
- Chapter anchors retain the existing sticky-navigation offset.
- The reading-progress calculation still ends at the case study's final evidence section.
- Keyboard navigation, focus management, live-region updates, and 44-pixel targets remain unchanged.
- Titles may truncate in constrained navigation controls, but the accessible name includes the complete stage and title.

Each published case study uses five chapters by default and no more than six. The four current case studies use five or six.

## Chapter maps

### Fresh Greens: six chapters

1. **Frame**: Why time and distance were not enough
   - Why time and distance were not enough
2. **Research**: What interviews with Black drivers changed
   - What six interviews changed
3. **Design**: Safer route decisions
   - How each route gets scored
   - A calmer interface for a traffic stop
4. **Refine**: From routing pivot to visual language
   - The Google Maps feature I moved away from
   - Type and color across a trip
   - Four colors stay reserved for safety
5. **Trust**: Moderating community reports
   - Moderating community reports
6. **Validate**: What I built and what still needs proof
   - What I built and what still needs proof

Fresh Greens earns a sixth chapter because trust and moderation are a distinct product-design problem. Folding governance into visual refinement or validation would obscure an important part of the concept.

### Navi: five chapters

1. **Frame**: Concentrated tourism as a routing problem
   - Concentrated tourism as a routing problem
   - The first prototype: a Manhattan heatmap
2. **Research**: The resident survey redirected the concept
   - Platform audits and resident research
   - The resident survey redirected the concept
3. **Define**: Mapping the experience
   - Mapping the experience before the build
4. **Build**: From prototype to booking flow
   - Rebuilding Navi as a working system
   - A working booking flow
5. **Validate**: What I would test next
   - What I would validate next

The final chapter keeps the planning qualifier because the rebuilt product has not been validated with users.

### TikTok: five chapters

1. **Research**: Fashion subcultures on TikTok
   - Fashion subcultures on TikTok
2. **Define**: The fixed catalog structure
   - Defining the fixed catalog structure
3. **Explore**: Templates as modular parts
   - Templates as modular parts
4. **Build**: From sketches to layered files
   - From sketches to layered files
5. **Deliver**: What shipped from the launch batch
   - What shipped from the launch batch

TikTok remains the shortest case study. The chapter layer clarifies the process without padding a five-year-old project or inventing missing artifacts.

### UnderstandingFAFSA: five chapters

1. **Frame**: A rebrand and a weekly workflow
   - A rebrand and a weekly workflow
   - Where the old template broke down
2. **Research**: What 120 newsletters revealed
   - What 120 newsletters revealed
3. **Define**: Rules for fixed and swappable parts
   - Three send types from the audit
   - Rules for fixed and swappable parts
4. **Build**: Rebuilding the system in Mailchimp
   - Rebuilding the system in Mailchimp
5. **Measure**: The first redesigned send
   - The first redesigned send

The observed first-send result remains qualified as a measured outcome rather than a controlled attribution claim.

## Chapter transition design

The transition marker appears once per chapter, not above every evidence section. It creates a breath between stages without adding another copy-heavy introduction.

Shared behavior:

- The stage, title, count, and motif are visible on the first rendered frame.
- Scroll motion may translate, draw, or offset the motif, but it may not gate text or evidence.
- The movement happens once as the chapter approaches the viewport.
- The treatment uses existing CSS and browser capabilities. No animation library is added.
- Reduced-motion users receive the completed motif with no transition.
- The marker preserves enough vertical separation to read as a boundary without producing large empty bands.

Project treatments:

- **Fresh Greens**: a route line joins two waypoints and progresses through the existing daylight palette.
- **Navi**: an orange route segment moves between outlined wayfinding stops.
- **TikTok**: restrained cyan and magenta traces offset briefly, then return close enough to read as one path.
- **UnderstandingFAFSA**: modular blocks align into a simple sequence using the project's existing palette.

These are variations on one shared layout, not four unrelated components.

## Homepage statement decoder

Remove the separate visible `Also` line. Replace the static tagline and `HeroInterestTyper` with one `HeroStatementDecoder` in the current tagline position.

Visible sequence:

1. `I design digital products and stay close through the build.`
2. `I sweat the empty states and the error copy.`
3. `I make my own roti from scratch.`
4. `I count down to each Absolute Batman drop.`

Behavior:

- The professional statement is present in the server-rendered first frame.
- It holds long enough to read before any characters change.
- The line uses the existing finite glyph-decoding language to move through the three personality statements.
- Transitions never clear the line to an empty string.
- The sequence runs once and stops on the Absolute Batman statement.
- The current credentials line and work action remain fixed beneath it.
- A hidden sizing copy of the professional statement reserves the line's maximum expected height so shorter phrases do not move the credentials or call to action.
- The visible decoder uses the homepage headline type rather than a separate monospace paragraph. Scrambled glyphs may use the existing glyph set, but the resolved statements retain the portfolio's primary type voice.
- The cursor appears only while the finite sequence is running.
- Reduced-motion users receive the static professional statement with no timed text changes.

Accessibility:

- The changing visual string is hidden from assistive technology and is not a live region.
- One static screen-reader string contains the professional statement followed by the three personality statements.
- The component produces one semantic paragraph rather than separate tagline and personality paragraphs.
- Server and client initial text match to avoid a hydration flash.

This decoder is the homepage's main personality moment. Additional Impeccable personality opportunities may be identified during implementation, but they remain recommendations until approved. They should reward close attention to the work rather than add constant ambient motion.

## Curated next-project endcap

Replace the generic `More work` list with one large next-project card and a secondary `View all work` link.

The endcap includes:

- The label `Next project`.
- The next project's title.
- One short factual bridge that explains the relationship between the two projects.
- The next project's existing cover treatment.
- A primary link to the project and a secondary link back to the homepage work index.

The component must not render draft projects as a curated destination.

Sequence:

- Fresh Greens to Navi.
- Navi to UnderstandingFAFSA.
- UnderstandingFAFSA to TikTok.
- TikTok to Fresh Greens.

Proposed bridge copy:

- Fresh Greens to Navi: `I also explored routing through neighborhood discovery and local booking.`
- Navi to UnderstandingFAFSA: `I turned an audit of 120 newsletter sends into a modular system a non-designer could run each week.`
- UnderstandingFAFSA to TikTok: `At TikTok, I worked within a fixed catalog structure to build visual templates for fashion brands.`
- TikTok to Fresh Greens: `Fresh Greens is my most recent project: a route-planning prototype shaped by interviews with Black drivers.`

Bridge copy must describe the work rather than position it. It cannot introduce a new outcome, role, or process claim.

Responsive behavior:

- Desktop uses a wide editorial card with text and media sharing the frame.
- Mobile stacks text and media while keeping both links reachable above the fixed navigation.
- Cover art uses each project's existing art direction rather than a generic crop.
- Hover motion is subtle and has an equivalent focus treatment.
- Reduced-motion removes card translation and image scaling.

## Content and voice constraints

- Preserve confirmed roles, dates, metrics, team names, research methods, and evidence boundaries.
- Use Myles's writing guide for any new bridge copy.
- No em dashes, semicolons, ellipses, hype language, rhetorical question-and-answer constructions, or aphoristic closers.
- Chapter titles describe what happened. They do not claim seniority or add process that is not supported by the case study.
- Do not add body copy only to make chapter lengths visually equal.

## Accessibility

- Chapter wrappers use valid H2 and H3 hierarchy.
- Decorative transition motifs are `aria-hidden`.
- Complete stage and title text remains available to assistive technology when visual truncation occurs.
- Active chapter changes continue to use the existing polite live region.
- Anchor navigation lands the chapter heading below the sticky header.
- Focus indicators meet the existing portfolio contrast and visibility standards.
- The next-project card has one clear accessible name and does not create nested interactive elements.

## Error handling and fallbacks

- Missing or duplicate chapter IDs fail regression tests.
- A chapter count above six fails the case-study contract test. The four current case studies also have exact count assertions.
- An unknown next-project slug does not fall through to a draft. The component omits the primary card and retains `View all work`.
- A missing cover image preserves the card's project-colored surface and readable text.
- Browsers without scroll-linked animation receive the complete static transition motif.

## Regression coverage

All behavior changes begin with a failing test.

### Chapter component

- Renders a semantic chapter section, H2 title, sentence-case stage, and chapter position.
- Keeps the decorative motif hidden from assistive technology.
- Accepts nested evidence sections without hiding their content.

### Project table of contents

- Accepts and renders stage plus title.
- Announces the complete active chapter name.
- Preserves scrolling, keyboard navigation, focus behavior, mobile expansion, progress, and reading-end behavior.
- Handles five or six chapters without layout-contract regressions.

### Case-study structure

- Confirms each chapter ID exists exactly once in the rendered page source.
- Confirms each case study uses the approved chapter count and order.
- Confirms evidence headings appear beneath the correct chapter.
- Confirms the final chapter retains necessary validation or outcome qualifiers.
- Updates palette-segment tests to the new chapter counts.

### Next-project endcap

- Confirms the four-project sequence.
- Rejects a draft as the curated next project.
- Renders one primary project destination and one work-index link.
- Preserves accessible names, focus treatment, and reduced-motion behavior.

### Homepage statement decoder

- Renders the professional statement on the server and initial client frame.
- Holds the initial statement before decoding the next phrase.
- Moves through the approved first-person sequence without rendering a blank line.
- Stops on the Absolute Batman statement and clears its timer.
- Removes the visible `Also` prefix and separate personality paragraph.
- Keeps the fixed credentials and work link in the homepage first-impression test.
- Uses a static professional statement when reduced motion is active.
- Exposes the complete static copy to assistive technology without announcing each frame.

### Content quality

- Scan all changed candidate-facing source strings for em dashes, semicolons, and ellipses.
- Assert approved stage and chapter language with whitespace-tolerant source checks.
- Include strings passed through shared child components in the scan.

## Visual verification

Capture fresh screenshots after implementation. Historical screenshots are comparison references only.

For each case study:

- Hero plus first chapter at `1440 × 900`.
- A middle chapter transition at `1440 × 900`.
- The final chapter plus curated endcap at `1440 × 900`.
- Active mobile chapter control and one transition at `390 × 844`.
- Mobile endcap at `390 × 844`.

Cross-site checks:

- Homepage statement at `1440 × 900` and `390 × 844`, including the initial professional frame and final Absolute Batman frame.
- Homepage reduced-motion state at desktop and mobile widths.
- No vertical shift in the credentials or work action as the statement changes.
- All four project timelines in light and dark themes.
- Fresh Greens with six daylight segments.
- TikTok with restrained split-color movement.
- Navi with five route stops.
- UnderstandingFAFSA with five modular palette segments.
- Keyboard focus through a chapter link, evidence link where present, next-project card, and `View all work`.
- Reduced-motion screenshots for one chapter transition and one endcap.

## Verification commands

Run repository checks sequentially because Vitest and ESLint can touch shared temporary files.

1. Focused Vitest files for the chapter component, `ProjectToc`, case-study chapter maps, palette segments, and next-project endcap.
2. Full `npm test`.
3. `npm run lint`.
4. `npx tsc --noEmit --incremental false`.
5. `npm run validate:content`.
6. `git diff --check`.

Keep the current development server available for browser QA. Run a production build only when it will not interfere with the preview server.

## Acceptance criteria

- Fresh Greens has six process chapters. Navi, TikTok, and UnderstandingFAFSA each have five.
- Every chapter displays an explicit process stage and a project-specific title.
- Existing artifact sections remain visible as nested evidence with correct heading hierarchy.
- `ProjectToc` tracks chapters rather than every evidence section.
- Project-specific timeline palettes and transition motifs remain recognizable.
- Motion is visible-first, bounded, and reduced-motion safe.
- Each case study ends with the approved curated next project and a `View all work` link.
- The homepage has one finite statement decoder, no visible `Also` line, and no hero layout shift between phrases.
- No new factual or outcome claims are introduced.
- Focused and full automated verification pass.
- Fresh responsive screenshots confirm the new hierarchy works at desktop and mobile sizes.
