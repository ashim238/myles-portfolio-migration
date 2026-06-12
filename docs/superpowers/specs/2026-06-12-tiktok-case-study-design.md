# TikTok Dynamic Showcase Ads — Case Study Design Spec

**Date:** 2026-06-12
**Branch:** `case-study/tiktok-dsa`
**Status:** Awaiting user review before plan generation

---

## 1. Overview

Port the TikTok Dynamic Showcase Ads (DSA) case study from the existing Framer site (`orchid-pineapple-649008.framer.app/work/tiktok`) onto the standing Next.js portfolio at `mylesdesignsthings.com`. The new page must match the depth, voice, and visual ambition of the existing case studies (Fresh Greens, UnderstandingFAFSA, Navi) and signal product-design competency, not visual-design competency alone.

The Framer source is incomplete in two places (Proof of Concept, Final Takeaways) and pre-dates the voice the standing portfolio uses. The port is therefore a substantial rewrite with new custom artifacts, not a content migration.

## 2. Thesis & narrative arc

**Stated thesis (B):** Subculture-led modularity. TikTok's value is its niches; the templates work because they treat the platform as many audiences, not one. This is the brief Myles went in with and what the structural decisions ladder up to.

**Surfaced thesis (C):** Product thinking before the title. Research → narrowed scope → reusable system → maintainability. The visual deliverables were the vehicle for product-level decisions. This realization emerged through the work rather than being planned for.

The case study lets B carry the through-line and surfaces C in the **Retrospective** coda, where the realization gets named explicitly. The B → C arc is the narrative spine.

## 3. Page architecture

Route: `/work/tiktok` (static segment under `src/app/work/`).
Content source: rendered from a TSX page (matching the Fresh Greens pattern), not a markdown file, because the case study has too many custom interactive components for the markdown CMS.

### Sticky TOC sections

| # | Section ID | Title | Job |
|---|---|---|---|
| 01 | `tt-brief` | The brief | Set up the constraint stack: TikTok's in-feed format, the partner ask, the subculture-rich audience. |
| 02 | `tt-research` | Reading the platform | Five subcultures from desk research; narrowed to three categorical buckets. Where the B thesis lands. |
| 03 | `tt-system` | The system | Custom template-anatomy diagram. The 960×540 in-feed grid, slot definitions, swappable zones. The mechanism that makes the templates modular. |
| 04 | `tt-aesthetics` | Three aesthetics | Showcase block for the three internal working-name templates. Palette + anchor + feedback + final. |
| 05 | `tt-shipped` | What shipped | Outcome card foregrounding American Eagle as a verified DSA adopter. |
| 06 | `tt-scope` | Honest scope | DSA → Smart+ Catalog Ads lineage timeline. |
| 07 | `tt-retro` | Retrospective | The B → C realization lands here. |

TOC component: reuse the existing `ProjectToc` from Fresh Greens with IntersectionObserver.

### Page meta header

Matches Fresh Greens treatment.

- **Eyebrow:** Internship · 2021
- **Title:** TikTok Dynamic Showcase Ads
- **Lede:** ~2 sentences; lands the B thesis without spelling it out.
- **Meta strip:** Role / Stack / Timeline (Visual Designer · Brand Studio / Illustrator, Photoshop / May – Aug 2021)

## 4. Section-by-section breakdown

### Section 01 — The brief
Three paragraphs. Frames the constraint stack: TikTok's pre-existing template program (eventually 30+ templates), the partner ask for an evergreen, affordable catalog format, and the platform's defining attribute — subculture density. Plain register. No metric callouts; this is setup.

### Section 02 — Reading the platform
Documents the desk research that produced five subcultures (Y2K, Maximalism, Dark Academia, Cottagecore, WitchTok) and the narrowing to three categorical buckets. Closes with the B thesis: a single page-wide pullquote or styled callout — "An in-feed ad either feels native or it doesn't. Subcultures are how TikTok's audience makes that distinction."

### Section 03 — The system
The custom 960×540 anatomy diagram (see Section 5.2). Two paragraphs of prose introducing the constraint stack: TikTok brand guidelines (immutable), in-feed dimensions (immutable), three subculture aesthetics (variable). The diagram does the load-bearing work.

### Section 04 — Three aesthetics
Three feature-card-style showcase blocks, one per template. Each card uses its own scoped accent color. Card contents per Section 5.3.

Cards are introduced with a single line acknowledging the internal-name framing: "These were internal working names while I built. Vendors who eventually adopted them likely saw a different label."

### Section 05 — What shipped
Single full-width outcome card (Section 5.4). One line, sized for weight. Quiet attribution beneath. No surrounding prose — the card is the section.

### Section 06 — Honest scope
The DSA → Smart+ Catalog Ads lineage timeline (Section 5.5). Two paragraphs of context naming what's known: DSA was deprecated in April 2023; the mechanics moved into Video Shopping Ads; that lineage continues as Smart+ Catalog Ads today. Frames Myles's contribution as one of many in the launch generation, not as causally responsible for the format's evolution.

### Section 07 — Retrospective
Two-paragraph coda. Names the B → C realization explicitly: the brief was visual; the work was product. Specific to what the project taught about systems thinking and constraints as design driver — without aphoristic phrasing. Plain Myles voice.

## 5. Custom interactive artifacts

### 5.1 System overview band
Position: between the page meta header and Section 02 (or inside Section 02's intro).
Treatment: nine swatches in a 3-row × 3-column grid, one row per aesthetic. Each swatch labeled with hex on hover. Aesthetic name labels the row.
Purpose: preview the scope of what was built before the reader dives in.

### 5.2 Template anatomy diagram
Position: Section 03's primary artifact.
Treatment: custom SVG, matches Fresh Greens `ArchitectureDiagram` visual language (Geist Mono labels, accent color line work, line-only treatment).
Structure: a 960×540 frame with labeled slots — **title zone**, **product catalog grid**, **supplementary graphics zone**, **CTA**.
Interactive: hover any slot → small thumbnail row beneath the diagram reveals how each of the three aesthetics fills that slot. Keyboard-accessible focus equivalent. Reduced-motion: thumbnails become a static row beneath without hover requirement.

### 5.3 Three aesthetics showcase cards
Three cards. Each contains:

- **Reserved accent color** scoped to `.tt-aesthetic-card`, varies per card via CSS custom property.
- **Hero template image** — actual 960×540 mockup, lightbox-expandable via existing `ExpandableImage`.
- **Palette band** — three named swatches with hex on hover, mirroring the System overview band but full-size.
- **Anchor reference** — small inline image with caption (Acne Studios pastels / 70s psychedelia / grungy punk mag).
- **Feedback card** — styled callout with the literal critique from low-fi review, mono-prefixed "Feedback:" label.
- **Final high-fi image** — second template image showing the resolved direction.

Layout: large visual column left, narrow context column right. Alternates orientation card-to-card so rhythm doesn't go static.

### 5.4 American Eagle outcome card
Position: Section 05.
Treatment: Light Academia accent block (`#EDC4AC` background, `#141414` ink).
Content:
- **Single large line:** "American Eagle adopted the Light Academia template."
- **Subtitle:** "Shipped via TikTok DSA, 2021."
- **Optional:** small AE template thumbnail to the right (or below on mobile).
- **Verification note in spec only (NOT in the case study):** TikTok For Business case study at `ads.tiktok.com/business/en-US/inspiration/american-eagle` references "their DSA results" when comparing AE's later VSA performance — confirms AE was a DSA customer.

Motion: brief fade + 2% scale-up over 360ms on viewport enter. Once, no loop. Reduced-motion: static.

### 5.5 DSA → Smart+ Catalog Ads lineage timeline
Position: Section 06.
Treatment: horizontal timeline, three nodes. Matches Fresh Greens architecture-diagram language.

Nodes:
1. **2021 · DSA launches** — 30+ templates introduced. Myles's contribution sits among them.
2. **2023 · Migration** — DSA mechanics moved into Video Shopping Ads (April 3, 2023 cutoff).
3. **2026 · Smart+ Catalog Ads** — the modular-template-from-catalog logic continues here.

Language: describes what happened. No causal claims about whether Myles's work drove the evolution. Intern-honest.

## 6. Motion + interactivity layer

- **Hero parallax** — cursor-following micro-translation (~6px max) on the three layered template cards. Gated on `prefers-reduced-motion: no-preference`.
- **Scroll stagger reveals** — section headers and body fade up on viewport enter. Reuse existing Fresh Greens entrance animation tokens.
- **Template anatomy hover** — already specified (Section 5.2).
- **Palette swatch hover** — hex labels on hover, pattern from existing `SignalSwatches`.
- **Per-aesthetic accent color** — each showcase card scopes its accent to itself (eyebrow, divider, button hover) via CSS custom property. Page chrome stays neutral.
- **AE outcome entrance** — fade + scale-up on viewport enter, once.
- **Lightbox expansion** — all template images and reference images open via existing `ExpandableImage`. Already wired through `LightboxProvider`.
- **TOC scroll-spy** — sticky timeline already exists via `ProjectToc`. Reuse.
- **Reduced motion** — every animation gated. The case study reads identically without motion.

**Cut:** A faux TikTok-feed simulation interaction was considered and rejected. It would require fabricating feed video assets we don't have, and the dishonesty would undermine the case study's premise.

## 7. Hero treatment

Layered stack of three landscape template mockups in a slight fanned arrangement. Light Academia in front (the AE-adopted template), the other two tilted behind with subtle stagger and rotation. Cursor-following micro-parallax. Subtle scroll-driven spread: as the page enters, the cards drift slightly apart and the back two tilt away.

A muted TikTok-feed background suggestion behind — silhouette only, not literal — to anchor "in-feed" without manufacturing fake screenshots.

Hero height matches the Fresh Greens hero proportion.

## 8. Assets

### Available from Framer
Image URLs were extracted from the live Framer page. Roughly 25 unique image assets at high resolution. The relevant assets are presumed to include:

- Three high-fi template mockups (likely the 6000×4000 and 5000×3333 assets)
- Mood board / anchor references
- Low-fi sketches or wireframes
- Color palette swatches (will likely regenerate as native SVG/HTML for theme integration rather than reuse as images)

Acquisition: download via `curl` into `public/projects/tiktok/`. File names should be intent-descriptive (`hero-light-academia.png`, `anatomy-slot-1.png`, etc.) rather than the Framer hash names.

### To-be-decided
- Whether the Channable blog screenshot the user mentioned should be cited or used.
- Whether any new diagrams need to be created from scratch (yes for the anatomy diagram and lineage timeline; both rendered as SVG components, no images required).

### Cover image for homepage
A landscape composition for the homepage project card. Composition TBD — a flat tile rendering of the three template aesthetics works; or a single hero render with the layered stack treatment.

## 9. Voice notes

- **Register:** plain. Em-dashes used freely. No aphoristic structures ("X is to Y as Z is to W"). No marketing rule-of-three. No "we ___, we ___, and we ___."
- **Words to avoid:** "elevate," "leverage," "iconic," "intuitive," "delightful," "seamless," "design-driven."
- **The framing of being an intern:** acknowledged in the eyebrow (`Internship · 2021`) and again in the Retrospective. Doesn't apologize. Frames the constraint of "I was 21 and learning" as part of why the realization (B → C) was the lasting takeaway.
- **The Light Academia hedging:** Myles is "80% sure" American Eagle adopted Light Academia. The case study commits — no hedging language ("I believe," "if my memory serves"). If verification surfaces a different template later, we update the line.
- **The internal-name framing:** the three aesthetic names were Myles's internal working labels, not customer-facing template names. The Section 04 intro acknowledges this directly so the case study doesn't claim more than it should.

## 10. Implementation notes

- **Page file:** `src/app/work/tiktok/page.tsx`. Static segment, matches Fresh Greens precedent.
- **Components file:** `src/components/tiktok-dsa.tsx` (co-located components: `HeroTemplateStack`, `SystemOverviewBand`, `TemplateAnatomyDiagram`, `AestheticShowcaseCard`, `AEOutcomeCard`, `LineageTimeline`). Following the Fresh Greens co-location pattern.
- **Styles:** scoped under `.tt-page` selector in `globals.css`. Reserved-color CSS custom properties scoped per aesthetic card.
- **Content meta:** create `content/projects/tiktok.md` with frontmatter (`slug: tiktok`, `title`, `summary`, `coverImage`, `order: 4`, `tags`, `sections: []`) so the project appears in the homepage `getPublishedProjects()` query. Markdown body is empty; rendering happens in the TSX page. Deliberately omit `highlightQuote` and `outcomeMetricLabel/outcomeMetricValue` — there is no public DSA-era performance metric to point to, and the named-adopter outcome (AE) carries weight without a number.
- **Homepage ordering:** `order: 4`, after Navi. Rationale: the existing three pieces (Fresh Greens, FAFSA, Navi) are more recent and more aligned with the current product designer framing. The TikTok piece sits as a foundational early-career addition.
- **Project work jump:** existing `ProjectWorkJump` component renders the prev/next between case studies. Will automatically include TikTok once it's added to `getAllProjects()`.

## 11. Open questions / TODOs to settle during implementation

- **Light Academia confirmation:** if Myles can find any internal record (Slack screenshot, email, brief reference) confirming AE adopted Light Academia specifically, we lock it. Otherwise we commit at 80% and update if invalidated.
- **Specific feedback quotes per aesthetic:** the Framer source has paraphrased feedback. We can use it as-is or refine — depends on whether Myles has the literal feedback in notes.
- **Anchor reference images:** are 70s psychedelia / grungy punk mag / Acne pastels reference images present in the Framer source, or do we need to find stand-in references? If stand-ins: license-clear sources only.
- **Mockup file states:** are the Framer assets actually finalized templates or earlier-stage exports? Need to check what we're pulling.

## 12. Out of scope

- Animated logo for TikTok in the eyebrow (not worth the build).
- Video embeds (no DSA video assets exist in usable form).
- A "scroll the templates in a faux feed" interaction (rejected for honesty reasons; see Section 6).
- Restructuring of the existing case studies for visual parity (would scope-creep this project).

---

**Next step after user review:** invoke `superpowers:writing-plans` to convert this spec into an implementation plan.
