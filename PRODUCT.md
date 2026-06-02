# Product

## Register

brand

## Users

Hiring managers, design leads, and design collaborators evaluating Myles Ashitey for senior product / interaction roles. They're typically scanning on a phone first, then opening the portfolio on a laptop for the case study deep-dive. Often they have 60 seconds for the home page and 5 minutes for one case study. They want to see how Myles thinks, not just what he made.

## Product Purpose

The portfolio is Myles Ashitey's primary professional surface. It needs to demonstrate range (UX, product, content, systems, code-adjacent craft), articulate a point of view about design's social responsibility, and showcase a small number of case studies with depth. Success looks like: a recruiter shares the link with a hiring committee, an interview gets scheduled, and the writing carries the conversation into the room.

## Brand Personality

Calm, considered, editorial. Reads like a designer who writes carefully and ships intentionally. Three-word personality: precise, grounded, generous. Voice avoids buzzwords, marketing cadence, and "look how clever I am" tone. Quietly confident. The work argues for itself; the framing makes the argument legible.

## Anti-references

- Generic dev-portfolio templates (Cassidoo / Brittany Chiang clones, neon accent, terminal aesthetic, "type-it-out" hero).
- SaaS-marketing landing-page tropes: tiny uppercase tracked eyebrows above every section, numbered section markers (01 / 02 / 03), gradient text, glassmorphic cards, identical 3-up icon-heading-body card grids.
- Loud "design studio" portfolios with aggressive scroll-jacking, oversized hero type that overflows on mobile, and decorative motion that delays content.
- Aphoristic / cryptic landing copy ("Design at the edge." "Crafting tomorrow."). The voice should read like a person talking, not a brand manifesto.
- Cream / sand / "warm minimal" body backgrounds — the 2026 AI default. The dark + light system here is deliberate; neither defaults to warm-neutral.

## Design Principles

1. **The writing carries the work.** Case studies are essays with images, not image galleries with captions. Long-form reading is the primary mode.
2. **Quiet beats loud.** Generous space, restrained color, one-strong-thing-per-screen. Where competitors shout, this surface measures.
3. **The system shows.** Spacing rhythm, type scale, and reused components are the brand. Consistency screen-to-screen is the craft signal.
4. **Mobile is not a courtesy.** Recruiters open links on phones. The phone version is the first impression, not a degraded fallback.
5. **Show range without flattening it.** Tags, role labels, and case-study structure differentiate product work from content/email work from research work — not all projects are the same shape.

## Accessibility & Inclusion

- WCAG 2.2 AA target across body text contrast, focus states, and tap targets.
- Light + dark themes already shipped; both must meet contrast on their own (not just one).
- Reduced-motion path exists for entrance animations and the typer; honor it everywhere.
- Section anchors on case studies must be keyboard-navigable; the ToC component is interactive and needs proper aria states.
- Image alt text must describe the work, not just label it ("airbnb-audit.png" → "Airbnb heuristic audit highlights").
