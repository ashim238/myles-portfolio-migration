# Portfolio review-feedback pass — design

Date: 2026-07-09
Branch: `portfolio/review-feedback`
Sources: external reviewer feedback (13 notes), grilled to 10 resolutions;
`career-ops/MYLES-WRITING-STYLE.md` (voice); the real interview notes PDF
(research); the Fresh Greens app repo tokens; owner-supplied Figma files, lo-fi
sketches, custom illustrations.

## Guiding principles (apply to everything below)

- **Voice = the writing guide.** No em-dashes, semicolons, or ellipses.
  Contractions throughout. Conversational, reflective, candid. Describe, don't
  position. No aphoristic closers ("That's the work."), no rhetorical
  question-and-answer, no thesis-y taglines. Concede points fairly.
- **Honesty over polish.** No fabricated personas, affinity workshops, or
  metrics. Present the real, lightweight synthesis and own the narrow timeline.
- **Anonymity is absolute.** Every research artifact strips participant names
  and identifying details (cities, businesses, family specifics). Aggregated,
  paraphrased trends and lightly-quoted snippets only.
- **Research-led IA.** Lead with the driver's problem and the research, then the
  design responses.
- **Visual-forward.** Cut prose; let bigger visuals and real artifacts carry the
  competency signals.

## Part A — Fresh Greens case (the priority)

### A1. New section order + titles (critiques #1, #2)

Restructure to research-led, with plain-voice titles that still signal the
design-process stage:

| Order | Title | Stage | Notes |
|---|---|---|---|
| 1 | **The problem I set out to solve** | Problem | Green Book framing, plain; kill "Whose knowledge counts" |
| 2 | **Listening to six drivers** | User research | moved up from slot 7; hosts the synthesis artifact + lo-fi |
| 3 | **How routes get scored** | Concept | four markers + community-in-the-same-pipeline |
| 4 | **Designing for the pulled-over moment** | Interaction | the calm /pulled-over flow |
| 5 | **Type and color** | Visual design | warm surfaces, custom illustrations, token exhibit |
| 6 | **The reserved color system** | Design system | one meaning per hue |
| 7 | **Keeping community reports trustworthy** | Testing / moderation | the moderation queue |
| 8 | **What shipped, and what didn't** | Scope / reflection | honest scope + narrow-timeline candor |

Sub-headings inside research also plain-ified ("Daylight as a first-class
input" → "Why daylight became a routing factor," etc.). Update `ProjectToc`,
`aria-labelledby` ids, and the `RecruiterCut` to match.

### A2. Copy: cut ~50% + re-voice (critiques #3, #4)

Fresh Greens is ~1,475 words (2x the other cases). Halve the prose section by
section, tighten in place (do NOT delete sections — they map to process stages).
Re-voice every paragraph to the writing guide. I draft each section; owner
approves the words. Navi and FAFSA get a lighter tighten (~15%) + the same voice
pass (they are already ~740 words).

### A3. Research synthesis artifact (critique #6)

An honest, interactive **"What I heard → the four markers"** exhibit in section
2, built from the real (anonymized) interview notes:
- Each marker (Light, Police presence, Wildlife, Road conditions) reveals 2-3
  anonymized quote snippets + how many of the six drivers raised it.
- A **community-knowledge** cluster (the design bet: "I'd listen to family over
  the city's statistics").
- A **"they asked for it"** row pairing a verbatim participant request to each
  shipped feature (a driver literally asked for "the gradient of light… your
  projected light coverage"; another for "poor road conditions highlighted").
- Framed truthfully as "trends I pulled from six interviews," with the narrow
  timeline owned. NO personas, NO fake affinity board.
- Pair with the owner's hand lo-fi sketches (real pre-work; the sketches show
  the layered route stroke later simplified — a visible decision).

### A4. Visual-design credit + custom assets (critique #7)

- Render the **four custom marker glyphs** (sheriff/streetlamp/cone/deer) and
  the **four onboarding illustrations** (SVG, owner-supplied) natively and crisp.
- Surface them as "designed, not just speced" evidence in the visual-design
  section.

### A5. Design-system exhibit + decision rationale (critique #8)

- **Built natively from the app repo tokens** (`colors.ts`, `spacing.ts`,
  `typography.ts`, `radii.ts`), not a Figma screenshot: a crafted color/spacing/
  type/radii reference. Real values, on-brand, more polished than a tool capture.
- Surface the real systems-maturity story from `spacing.ts` (implicit 5/6/13/18
  stragglers → explicit 4pt ramp).
- **Decision-rationale thread:** each major design decision gets a tight
  "considered X, chose Y, because Z (or because the research said so)":
  typography took three tries (Jost → Space Grotesk → Libre Franklin); the
  daylight dash pattern for WCAG 1.4.1; scaling back the safety toolkit because
  research said driving already takes focus.
- **The pivot journey exhibit:** lo-fi → the Google-Maps-plugin v1 (borrowed
  mental model, then limiting) → the distinct build with custom iconography →
  the shipped warm system. Show the Google-v1 vs distinct aesthetics side by
  side (Figma screenshots already pulled). This is the strongest "how I got to
  my decisions" moment.

### A6. Bigger, higher-fidelity visuals (critique #5)

Source screens are already retina (1290×2796). Present them larger (closer to
full column width), flatter and crisper; reserve the 3D `Device3D` treatment for
one or two hero moments instead of shrinking every screen into it.

### A7. Clickable prototype = the real app (critique #9)

The app is functional React Native, so the strongest interaction/animation proof
is the **real app running**, not a Figma prototype. Owner records screen
captures of key flows (zone-entry with the route stroke, hold-to-call-911,
daylight-graded route, active nav); drop them into the existing `LeadVideo`
slots (muted autoplay, poster under reduced-motion). Until clips arrive, wire
`LeadVideo` placeholders so the build isn't blocked.

## Part B — Navi + FAFSA (light touch)

Voice pass to the writing guide, ~15% trim, and de-buzzword any aphoristic
section titles to the same plain-descriptive standard as Fresh Greens. No
structural changes.

## Part C — AI exploration page (critique #10, fast-follow)

A dedicated page, built AFTER the Fresh Greens work lands. Two honest anchors:
1. **Design-with-AI workflow** — cementing the design system with the LLM, then
   generating edge/empty/error states on-aesthetic, building past the prototype
   in Claude Code.
2. **The knowledge-graph traceability system** — the graph that makes every
   design and build decision trace back to the thesis.
Framed as real practice, not bandwagon.

## Assets

- **I build from what exists:** synthesis (owner's notes), token/variable
  exhibit (repo), custom glyphs + onboarding illustrations (SVG), pivot journey
  (Figma pulls + lo-fi). All anonymized where research.
- **Owner produces exactly one thing:** screen recordings of the RN app (A7).

## Sequencing

1. **Fresh Greens redesign** (A1-A6, A7 placeholders) — the priority, biggest lift.
2. **Navi + FAFSA light pass** (Part B).
3. **AI exploration page** (Part C) — fast-follow.
4. App recordings slot into the `LeadVideo` placeholders whenever they arrive.

## Verification

- Voice check every rewritten paragraph against the guide (grep for em-dashes,
  semicolons, ellipses; read for aphoristic closers / positioning).
- Anonymity check on every research artifact (no names, no identifying detail).
- `/impeccable typeset` then `critique` + `audit` on Fresh Greens after the pass.
- Browser verify: new order, synthesis artifact interaction, token exhibit,
  bigger visuals, no overflow, reduced-motion paths.
