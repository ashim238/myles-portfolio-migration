# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Hiring managers, design leads, and design collaborators evaluating Myles Ashitey for product design roles broadly, with associate roles as the near-term target. They are usually scanning quickly on a phone first, then opening the portfolio on a laptop for a deeper case-study read. They want to understand how Myles thinks, what constraints he notices, and how the work moves from context into product decisions.

## Product Purpose

The portfolio is Myles Ashitey's primary professional surface. It demonstrates range across product design, research, content systems, interactive prototyping, and code-adjacent craft. Success looks like a recruiter sharing the link with a hiring committee, a design lead understanding the quality of the thinking within a few minutes, and the writing carrying the conversation into an interview.

## Positioning

The portfolio presents case studies as editorial product arguments rather than as image galleries. It pairs narrative, artifacts, implemented interactions, and evidence-scoped claims so the work can be evaluated through decisions made, constraints handled, and outcomes shown.

## Operating Context

Visitors arrive through job applications, referrals, recruiter screens, and direct portfolio reviews. The homepage needs to orient a scanner quickly, while case-study routes support longer reading with section navigation, product imagery, and focused interactive artifacts. The site is a Next.js app with public routes for Home, About, Play, Resume, and dedicated case studies including Fresh Greens, Navi, TikTok, and Understanding FAFSA.

## Capabilities and Constraints

- Published work is routed through project metadata and dedicated case-study pages.
- Case studies use shared navigation, section tables of contents, motion/reveal behavior, lightbox media, and project-to-project jumps.
- The site supports dark and light themes, reduced-motion paths, keyboard-visible focus states, and mobile-safe navigation.
- Portfolio copy should stay evidence-scoped. Implemented behavior, prototype behavior, interview findings, and proposed future behavior should not be blurred together.
- Production releases go through direct verification when the user asks to make updates live.

## Brand Commitments

The voice is calm, considered, editorial, and human. It should read like a designer who writes carefully and ships intentionally. Avoid buzzwords, hype cadence, cryptic slogans, and generic template language. The visual shell is neutral and restrained, with per-project accents belonging to the case study rather than the global chrome.

Durable anti-references:

- Generic dev-portfolio templates, neon terminal aesthetics, and type-it-out hero tropes.
- SaaS-marketing scaffolding such as repeated uppercase eyebrows, decorative section numbering, gradient text, glassmorphic cards, and identical icon-card grids.
- Loud scroll-jacking, oversized mobile-breaking hero type, and decorative motion that delays content.
- Warm cream, sand, or beige defaults. The existing dark and light system is deliberate.

## Evidence on Hand

- Existing source routes under `src/app` and components under `src/components`.
- Public project assets under `public/projects`, including Fresh Greens, Navi, TikTok, and Understanding FAFSA imagery.
- `DESIGN.md` records the incumbent visual system, tokens, component rules, and anti-patterns.
- Tests cover content validation, route metadata, project interactions, accessibility-related style contracts, and case-study-specific prose/layout behavior.

## Product Principles

1. **The writing carries the work.** Case studies are essays with artifacts, not image galleries with captions.
2. **Quiet beats loud.** Generous space, restrained color, and one strong thing per screen should do more work than decoration.
3. **The system shows.** Spacing rhythm, type scale, reused components, and consistent interaction rules are part of the craft signal.
4. **Mobile is not a courtesy.** Phone review is a primary first impression, not a degraded fallback.
5. **Show range without flattening it.** Product work, content systems, research, and experiments should keep their own shapes while still belonging to one portfolio.

## Accessibility & Inclusion

- Target WCAG 2.2 AA for body text contrast, focus states, and tap targets.
- Light and dark themes must both remain first-class and independently legible.
- Reduced-motion behavior should preserve access to content without relying on animation.
- Section navigation and interactive case-study artifacts should remain keyboard-operable.
- Alt text should describe the work shown, not only label filenames or asset categories.
