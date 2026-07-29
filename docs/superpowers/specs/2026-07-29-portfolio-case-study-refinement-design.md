# Portfolio case-study refinement

**Date:** 2026-07-29

**Branch:** `codex/portfolio-case-study-refinement`

**Status:** Awaiting user review before implementation planning

## Goal

Make each published project understandable in one focused read while preserving the artifacts, motion, and visual systems that make the portfolio feel authored.

Fresh Greens is the priority. Its personal origin, research bridge, and three-part product thesis need to read as one causal story. Navi, UnderstandingFAFSA, TikTok, and Play receive smaller fixes in parallel so every page answers the same basic questions:

1. What did people care about?
2. What was happening before the design?
3. What did Myles learn?
4. Why did that finding lead to this decision?
5. What exists now, and what still needs proof?

## Source and voice contract

- The production critique, repository evidence, user-provided project history, and existing claim tests define the factual boundary.
- Candidate-facing prose follows `/Users/mylesashitey/.claude/writing-style-myles.md` and `/Users/mylesashitey/career-ops/MYLES-WRITING-STYLE.md`. The Writing Style section in `/Users/mylesashitey/career-ops/modes/_profile.md` wins if they diverge.
- Write in Myles's direct first-person voice. Use contractions and concrete details.
- Do not use em dashes, semicolons, hype language, rhetorical questions with immediate answers, or slogan-like closing lines.
- Keep team work, individual work, research findings, implementation status, and future intent visibly separate.
- Do not turn a small sample, an interview theme, or a prototype behavior into proof of real-world impact.
- Keep each project's current visual identity. This is an editorial and interaction refinement, not a shared-template redesign.

## 1. Fresh Greens

### Thesis

> Fresh Greens brings the safety knowledge Black drivers already use into route planning.

The longer version may appear once near the opening:

> Fresh Greens brings the safety knowledge Black drivers have passed through their communities into contemporary navigation, reducing how much planning and vigilance they have to carry alone throughout a journey.

### Narrative bridge

The opening must make the path from one person's need to a product for other people explicit.

1. Myles grew up in Brooklyn and moved to South Jersey around age ten.
2. The part of South Jersey he moved to was rural and more conservative. Seeing Confederate flags on front lawns made night driving feel exposing.
3. The immediate fears were a police stop or car trouble in a place where asking for help might not feel safe.
4. The current process was still Google Maps or Apple Maps, plus extra vigilance. On unfamiliar night routes, Myles avoided backroads, drove comfortably below the speed limit, kept his wallet within reach, and watched his surroundings.
5. That experience formed a hypothesis. It did not prove a population-wide need.
6. Six interviews showed that Black drivers were already using related practices, including leaving with daylight, choosing particular gas stations, watching for wildlife, and preparing for police encounters.
7. Participants did not present those practices as failures waiting to be fixed. They described knowledge and behaviors that already helped them move through the world.
8. The opportunity became reducing how much of that planning and vigilance a driver has to carry alone.

### Historical lineage

Use the Green Book briefly and with a source. It is design lineage, not a claim that Fresh Greens is its digital successor.

The Green Book used the publishing medium available in its era to help Black travelers access community knowledge. Fresh Greens asks what that principle looks like inside navigation products people already use. Keep this bridge under 100 words.

### Six-chapter structure

| Anchor | Stage | Chapter | Job |
|---|---|---|---|
| `fg-problem` | Frame | Why route planning needs more than time and distance | Personal origin, present process, stakes, and Green Book lineage |
| `fg-research` | Research | Three problems the interviews made clear | Show how six interviews widened the hypothesis without overstating the sample |
| `fg-design` | Plan | 1. See what is on each route before choosing | Explain inspectable alternatives, the Google Maps pivot, route scoring, and source visibility |
| `fg-pulled-over` | Respond | 2. Handle unexpected problems without adding stress | Explain one-thumb access, calm language, offline support, and the pulled-over flow |
| `fg-trust` | Trust | 3. Navigate with transparent community contributors | Explain firsthand accounts, corroboration, uncertainty, provenance, and moderation |
| `fg-scope` | Validate | What the prototype made possible and what still needs proof | Separate demonstrated product behavior from real-world outcomes that remain unproven |

Each problem chapter follows one compact loop:

`Current behavior → friction → interview finding → product requirement → decision → artifact → proof boundary`

The loop should read as two short paragraphs, one dominant artifact, and one concise caption. It should not become seven visible subheadings.

### Research synthesis

The research chapter converts the interviews into three product problems:

1. **Plan:** Drivers could not inspect the conditions on each available route before choosing.
2. **Respond:** Unexpected problems became harder to handle after stress was already high.
3. **Trust:** Useful community knowledge lived outside navigation and depended on access to the right person at the right moment.

Keep the verified interview counts where relevant:

- Daylight: 6 of 6
- Police presence: 5 of 6
- Road conditions: 5 of 6
- Community knowledge: 5 of 6
- Wildlife: 3 of 6

Do not imply that all specific preparation behaviors occurred at those same frequencies unless the interview evidence says so.

### Artifact map

- **Frame:** Cover and one restrained historical reference. The onboarding artwork may remain only if its caption advances the lineage.
- **Research:** A compact Plan, Respond, Trust synthesis. The current four-tab taxonomy can leave the primary path.
- **Plan:** `PivotJourney` is the flagship. `ArchitectureDiagram` is secondary support. Put daylight and reserved-color decisions in captions. Remove duplicate route screenshots.
- **Respond:** `PulledOverJourney` is the flagship. Fold one-thumb reach, hidden-until-needed tools, question styling, and offline behavior into its explanation.
- **Trust:** One report-detail screen and the moderation flow become one contribution-to-decision exhibit. Remove the duplicate report-picker phone from the main path.
- **Validate:** Keep a concise Impact now and What remains ledger with one line per problem.

Standalone token inventories, tool inventories, repeated phone screens, and visual-system explanations leave the five-minute path unless they prove a specific decision.

### Community trust and sparse areas

Use **trusted contacts** for a driver's personal support network. Use **community contributors** for people submitting reports. Do not use “trusted agents.”

Public datasets still have a role because their source and scope can be inspected. They do not capture how a town or street felt to the people who moved through it. Fresh Greens keeps a firsthand account specific instead of flattening it into an official-looking fact.

Canonical rule:

> A single account is never hidden or treated as proof. Corroboration increases its route influence, while limited coverage is disclosed as uncertainty rather than interpreted as safety.

The intended trust model must distinguish four states:

1. Every firsthand account remains visible as one person's account.
2. Similar reports from separate contributors across time gain more influence over automatic ranking.
3. Specific time-sensitive hazards can surface faster when waiting for corroboration would make the information useless.
4. Sparse coverage is labeled as uncertainty. It is never converted into a positive safety signal.

The case study must also name the current implementation limit: the prototype maps one report to one scored zone, so a single report can affect route ranking now. Corroboration-weighted ranking is an intended safeguard, not a built feature.

The current report and moderation screens demonstrate contribution and review. They do not yet demonstrate visible contributor provenance or differentiated trust levels. Present those as intended parts of the trust model, not finished interface behavior.

### Outcome boundary

Target 800 to 950 primary-path words, 13 to 15 mobile viewports, and 6 to 8 primary figures.

The close should lead with what six interviews became: a working React Native prototype spanning route comparison, en-route guidance, stress-state support, community reporting, and moderation. It may say the product can explain why it prefers one route. It may not claim that the preferred route is safer.

## 2. Navi

### Story

Lead with the resident stake, not the heatmap. The hero should explain that a small resident and stakeholder survey redirected an early Manhattan concept toward neighborhood context. The heatmap then becomes the team hypothesis that research changed.

Use this five-chapter order:

1. **Frame:** The first idea moved visitors to different neighborhoods without changing how they engaged after arriving.
2. **Research:** Myles collected 14 resident and stakeholder responses, including two local businesses. The team audited six travel platforms. Make the sample size visible as 10 of 14 alongside 71%, and 7 of 14 alongside 50%.
3. **Define:** Research shifted the concept from moving tourist attention on a map to helping people learn, plan, and book with neighborhood context.
4. **Build:** Separate the graduate-studio concept from Myles's later solo React rebuild. Show how Learn, Plan, Go became a component system and working individual booking flow.
5. **Validate:** State what works in the browser and what still needs testing with residents, travelers, and local hosts.

### Ownership and artifacts

- Use **the team** for the early concept and six-platform audit.
- Credit survey collection, synthesis, archetypes, journeys, opportunity areas, and flows to Myles.
- State that Myles evaluated Airbnb with Kaori Ogawa and Amy Zhang.
- Use **I** for the three research-informed archetypes only where existing evidence supports that ownership.
- Use **I** for the later React component system and booking-flow rebuild.
- Describe the dataset as 14 resident and stakeholder responses, not 14 residents.
- Do not generalize the sample to New York City residents.
- Keep the heatmap, but move it after the resident problem and label it as an exploratory reconstruction without live tourist-density data.
- Make the research artifacts and Learn, Plan, Go the central bridge.
- Keep the demo and system links, but avoid explaining the same React rebuild twice.
- Keep group booking explicitly future-facing.
- Update the recruiter cut to name the graduate-studio team followed by the solo rebuild. Use Figma, FigJam, React, and TypeScript as the tools.

## 3. UnderstandingFAFSA

### Story

Keep the existing five chapters. Tighten the middle by turning the 120-newsletter audit into a visible chain from finding to rule.

| Audit finding | System response |
|---|---|
| Long sends needed stronger scanning cues | Action-focused section titles, selective emphasis, and clearer breaks |
| Weekly content changed while the brand structure should not | Locked spacing, type, dividers, and section order with swappable copy and imagery |
| The founder assembled every issue | A Mailchimp-native kit that can be edited without touching HTML |
| Gmail clips large HTML emails | Flatter hierarchy, fewer wrappers, lighter PNG assets, and selective native components |
| Different send purposes need different density | Welcome, weekly, and short event templates built from the same rules |

### Ownership and evidence

- State that Myles and one collaborator compiled and evaluated more than 120 newsletters.
- State that Myles designed the modular rules and rebuilt the live system in Mailchimp.
- Explain the founder's current assembly workflow without claiming unmeasured time savings.
- Keep the November 4, 2025 send date, observed 52.6% open rate with Mailchimp Privacy Protection excluded, earlier sends around 30%, and the uncontrolled-attribution caveat.
- The outcome is the shipped modular system. The metric is supporting context, not proof that the redesign caused the change.

## 4. TikTok

### Story

Keep this the shortest case study. Define the product and brief before discussing visual research.

The opening should establish:

- Dynamic Showcase Ads used reusable templates with fixed product slots for brand catalog content.
- During the 2021 Global Creative Lab internship, Myles designed three static template directions as layered Photoshop files.
- The template structure stayed fixed while type, color, texture, and supporting graphics changed for different fashion subcultures.

Use four concise beats:

1. **Brief, `tt-brief`:** Product, intended brand use, team context, and Myles's exact deliverable.
2. **Choose, `tt-research`:** Desk research considered five subcultures. Three directions moved forward because they created clearly different visual systems inside the same slot map.
3. **Build, `tt-system`:** Show the shared anatomy, sketches, layered files, and the limited modularity Myles proposed while building. Preserve this anchor because the recruiter CTA points to it.
4. **Deliver, `tt-outcome`:** Show Light Academia's critique, Myles's response, the shipped result, and the American Eagle relationship in that order.

The opening brief should use a compact definition list so role, team, intended use, deliverable, fixed parts, and variable parts remain scannable without another paragraph.

### Claim boundaries

- Keep the confirmed title **Creative Strategist Intern** and team **Global Creative Lab**.
- Do not imply direct collaboration with American Eagle.
- Use the verified wording that Myles later learned through Global Creative Lab that American Eagle selected Light Academia.
- Treat review notes as paraphrases, not quotations.
- Do not claim ownership of downstream production work.
- Do not add ad-performance metrics that are not in the evidence.

## 5. Play as an active lab

### Framing

Replace the recreational-gallery framing with:

> I use this page as a running lab for interaction studies, material tests, and small builds. I'll keep adding work as I test it.

Rename the list label to **In the lab** or **Current experiments**.

Each experiment receives six compact fields:

- Question
- Medium
- State
- What changed
- Next if real
- Updated

These fields should read as quiet working notes, not six new cards.

Use these initial values, which the user can approve with this specification:

| Experiment | Question | Medium | State | What changed | Next if real | Updated |
|---|---|---|---|---|---|---|
| Sukuna's finger | How much surface detail could survive a PLA print and hand-painted finish? | Digital sculpt, PLA, acrylic paint, matte varnish | Complete | A digital model became a printable form, then paint carried the skin, wounds, and color variation. | Add the original 3D model once the source file is ready for the web. | July 2026 |
| Loom | Can the same short answer always produce the same woven pattern? | p5.js, text hashing, generative drawing | Testing | A static study became a text input where the same answer produces the same five threads. | Test whether a shared weave stays readable as more people add responses. | July 2026 |

Represent `state` as `live | testing | complete | archived`. `Next if real` remains optional in the data model even though both current entries have a next step.

### Sukuna's finger

Tell the material process as:

`Digital sculpt → fabrication constraints → printed object → painted surface`

Keep the finished photographs and specimen treatment. A 3D viewer is deferred until the model file is supplied and inspected. Do not invent an interactive placeholder.

### Loom

- Keep the deterministic text-to-thread behavior.
- Replace the raw iframe with a small same-origin Loom embed component. It sizes the iframe to its document content and removes the nested mobile scroll trap.
- Give text input and buttons at least a 44px target size on mobile.
- Stop p5's continuous draw loop. Redraw only after setup, a response, clear, or resize.
- Update the artwork description or associated status when the thread count changes.
- Send the portfolio's active light or dark theme to the embed on load and whenever it changes. Use the system theme as the fallback.
- Preserve a direct “Open in a new tab” path.

## 6. Shared interface fixes

- Delay the vertical case-study table of contents until the viewport has enough left gutter for complete labels. At 1440px, retain the horizontal treatment rather than truncating active chapter names.
- Add a reduced-motion fallback to the Navi demo skeleton pulse.
- Preserve keyboard access, visible focus, non-JavaScript fallbacks, and existing content landmarks.
- Do not add accordions merely to keep low-priority material.

## 7. Test-first implementation

Production code changes begin only after a failing test establishes each intended behavior.

### Narrative contracts

- Replace brittle exact-copy tests with structural and factual guardrails.
- Assert chapter order, artifact ownership, unique anchors, evidence boundaries, and claim qualifiers.
- Keep concise word ceilings. Remove minimum word counts that reward length.
- Add a rendered Fresh Greens narrative test proving that Plan, Respond, and Trust own the correct artifacts.
- Keep existing interaction-level tests for artifacts that are moved without behavioral changes.

### Page-specific tests

- **Fresh Greens:** six problem-oriented chapters, recruiter CTA integrity, evidence states, sparse-area trust copy, and explicit current scoring limitation.
- **Navi:** resident-first order, 14-response qualifier, team versus individual ownership, and concept versus live-rebuild separation.
- **UnderstandingFAFSA:** audit-to-rule mapping, collaborator and founder roles, 102KB constraint, and metric qualifier.
- **TikTok:** four-beat chapter order, early DSA brief definition list, exact role and team, three-direction rationale, review-note paraphrases, ordered Light Academia outcome, and American Eagle wording.
- **Play:** experiment definition-list semantics, a typed state union, auto-sized iframe behavior, 44px mobile controls, event-driven p5 drawing, dynamic artwork status, and theme synchronization. Exercise the Loom script through DOM and p5 stubs instead of source-string assertions.
- **Shared:** table-of-contents breakpoint and Navi reduced-motion skeleton.

### Final verification

1. Run focused tests for each workstream.
2. Run lint, TypeScript, content validation, the full test suite, and a production build.
3. Run the Myles voice and AI-writing audit on changed candidate-facing prose.
4. Run the Impeccable detector once on the completed UI diff.
5. Review the rendered pages at desktop, 1440px, tablet, and mobile widths in both themes and with reduced motion.
6. Complete an independent code review before handoff.

## Non-goals

- No claim that Fresh Greens improves safety.
- No claim that six interviews represent all Black drivers.
- No implementation of corroboration-weighted route ranking in the separate Fresh Greens product repository.
- No new Fresh Greens visual identity.
- No redesign of the Navi mini-site.
- No unsupported UnderstandingFAFSA efficiency claim.
- No TikTok performance or downstream-production claim.
- No Play 3D viewer until the source model is available.
- No deployment in this pass unless separately requested.
