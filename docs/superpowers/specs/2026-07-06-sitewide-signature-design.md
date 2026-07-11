# Site-wide signature — the working file across every surface

**Date:** 2026-07-06
**Surface:** Nav, home hero, case-study pages, about/footer, and page transitions
**Files:** `src/components/site-nav-list.tsx`, `src/app/page.tsx`, `src/app/work/*/page.tsx`, `src/components/{fresh-greens,navi}.tsx`, `src/app/about/page.tsx`, `src/components/project-enter-transition.tsx`, `src/app/globals.css`

## Context

**Sub-project 4** of the recruiter-glance redesign. It extends the ["working file" signature](2026-07-06-working-file-signature-design.md) — validated on the home gallery — across the rest of the site, addressing the broader "the site is a bit too safe" concern.

**Dependencies and coordination:**
- **Depends on SP1.** SP4 reuses the signature CSS SP1 creates and should only roll out once the signature is proven in the real site (not just the prototype). Implementation sequences *after* SP1 lands.
- **Coordinates with SP3.** The case-study *section signature* here touches the **same files and the same `globals.css` case-study rules** as SP3's *density* work. At implementation these become **one combined pass** over the case-study pages (density + signature together), not two collisions. The specs stay separate; the plan merges the case-study task group.

The signature doc is authoritative on the visual/motion language (spine, index system, mono annotations, measure notes, entrance cascade, robust reveal pattern). This spec says *where* each element lands per surface.

## Goal

Make the whole site read as one coherent working-file system — so the personality (structure + motion) is consistent beyond the home page, not a one-off on the gallery. Every surface keeps its content and voice; the signature is the connective tissue.

## Design by surface

### Nav (`site-nav-list.tsx`)

Already numbered (`01. Work … 05. E-mail`) and mono — essentially signature-aligned. Light touch:
- Confirm the numbering is real structure (a mono index), aligned to the signature's rhythm.
- Optional entrance: nav items tick in on first load (staggered), using the robust reveal pattern.
- Active-state and focus-visible stay; no new chrome.

### Home hero (`page.tsx`)

- Add the **left spine** continuation and a **mono annotation** near the name (e.g. a role/location micro-label in the signature's mono register) — a margin note, not a tagline.
- **Entrance cascade** applied: the name resolves, the interest-typer starts, credentials settle to baseline — staggered, ease-out-expo, robust reveal pattern. The **typer stays** (strongest personality asset); the cascade wraps around it, it is not replaced.
- A hairline rule + optional measure note separating hero from `Selected Work`, consistent with the gallery.

### Case-study pages (`work/*/page.tsx`, `fresh-greens.tsx`, `navi.tsx`) — combined with SP3

Each study already uses `project-section` wrappers with `id`-anchored `h2`s. Apply:
- **Left spine** down the article.
- **Per-section mono index** — each `h2` gets a mono section number (`01`, `02`, …) as real structure aligned to the spine (the sections already form an ordered argument, so numbering encodes something true).
- **Hairline rules + sparse measure notes** between sections, matching the gallery.
- **Section reveals** — each section resolves to baseline on scroll-into-view, using the robust reveal pattern (content visible by default; keyframes over it; safety-net + visibility guard). Per-section, not one global gate.
- **Coordination:** this lands in the *same pass* as SP3's at-a-glance block, pull-quotes, and tightened intros. The `CaseStudySummary` block (SP3) adopts the signature's mono-label register so it reads as part of the system.

### About + footer + global chrome

- About page: spine + section rhythm consistent with case studies; light.
- Footer: already minimal; align its mono/meta to the signature register.
- No heavy treatment — these are supporting surfaces.

### Page transitions (`project-enter-transition.tsx`)

The site already has a FLIP transition (cover scales from its gallery rect into the case study). SP4:
- Keeps and formalizes this as the **signature transition** — the cover "opens" into the study; on the way in, the study's spine/first section resolve via the entrance cascade so the transition and the arrival read as one motion.
- Defines a consistent, restrained language for other navigations (e.g. between case studies, back to home) — reusing the same easing and the resolve-to-baseline vocabulary rather than inventing new effects.
- **Reduced motion:** all transitions fall back to plain navigation; the FLIP already respects this and keeps that behavior.
- This is the **riskiest, least-defined** part — implement it last, behind the rest of SP4, and be willing to ship SP4 without expanded transitions if they don't earn their keep.

## The signature elements (applied consistently)

Per the signature doc, every surface draws from the same kit: left spine, mono index system, mono annotations, hairline rules + measure notes, baseline discipline, and the entrance/interaction motion — all via the **robust reveal pattern** (content visible by default; `@keyframes` over it; safety-net timer + visibility guard; reduced-motion no-op). Restraint is mandatory everywhere: the system is scaffolding; content stays the hero. This is refinement, not blueprint cosplay.

## Non-goals

- No new color system, no new typefaces — existing tokens and the sans/mono pairing only.
- No content rewrites (SP3 owns case-study copy; SP4 is structure + motion).
- No ambient/looping motion anywhere — entrance + intentional interaction only.
- Not a redesign of any page's information architecture — the signature overlays the existing structure.

## Files affected

- **Edit** `src/components/site-nav-list.tsx` — numbering/entrance polish.
- **Edit** `src/app/page.tsx` — hero spine, annotation, entrance cascade (typer preserved).
- **Edit** `src/app/work/*/page.tsx`, `src/components/fresh-greens.tsx`, `src/components/navi.tsx` — spine, section indices, measure notes, section reveals (**one pass with SP3**).
- **Edit** `src/app/about/page.tsx` — light section rhythm.
- **Edit** `src/components/project-enter-transition.tsx` — formalize the signature transition (last, optional-expansion).
- **Edit** `src/app/globals.css` — signature rules for hero/nav/case-study/chrome (**shared file — the signature base classes come from SP1; SP4 extends, doesn't duplicate**).

## Verification

- Every surface: content visible with JS off, on a hidden/background tab, and under reduced-motion — never blank.
- The signature reads as *one system* across home, case studies, about — consistent spine, index, measure-note, and reveal language.
- Entrance cascades play once on load / scroll-in and honor `prefers-reduced-motion`.
- The case-study pass shows SP3 density + SP4 signature landing coherently (no collision, one visual system).
- Transitions: FLIP still works from the new gallery; reduced-motion falls back to plain nav; keyboard nav unaffected.
- `tsc --noEmit` clean; tests pass; detector clean on changed files.

## Trade-offs accepted

- Rolling the signature everywhere risks overshoot ("too much"). Mitigated by: sequencing after SP1 proves it in situ, mandatory restraint, and keeping transitions last/optional.
- SP3 and SP4 case-study work merging into one pass makes that task group larger, but it's the only way to avoid two edits fighting over the same files.
- Formalized transitions add the most risk for the least-defined payoff; explicitly deferrable — SP4 can ship on nav/hero/case-study/chrome alone if transitions don't land.
