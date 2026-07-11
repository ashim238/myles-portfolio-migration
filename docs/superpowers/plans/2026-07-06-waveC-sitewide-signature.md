# Wave C — Site-Wide Signature Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the "working file" signature (left spine, mono index system, hairline measure notes, entrance/section reveals) across nav, home hero, case-study pages, chrome, and page transitions — so the identity is consistent beyond the home gallery.

**Architecture:** Generalize the gallery's robust-reveal arming into a reusable `Reveal` client component and an IntersectionObserver-based `SectionReveal` for scroll-in sections. Apply signature structural classes per surface. Case-study section numbering uses a CSS counter (`.project-section` is already an ordered argument, so the number encodes real order). Reuses the global `@keyframes` (`wgFade/wgTick/wgRise/wgRule/wgWipe`) defined in Wave A. All motion uses the robust reveal pattern (content visible by default; safety-net + visibility/observer guards; reduced-motion no-op).

**Tech Stack:** Next.js 16 (RSC + small client boundaries), React 19, TypeScript, `globals.css`, IntersectionObserver, Vitest.

**Spec:** [`docs/superpowers/specs/2026-07-06-sitewide-signature-design.md`](../specs/2026-07-06-sitewide-signature-design.md) and the signature doc.

**Sequencing:** Wave 2 — **runs after Wave A lands** (reuses Wave A's keyframes + proves the signature in situ first). Its case-study work **builds on Wave B** (density already landed on those pages). Because A and B are done first, this plan touches the case-study files sequentially, not in parallel — no collision.

---

## File Structure

- `src/components/reveal.tsx` — generic robust-reveal arming (`Reveal`, `SectionReveal`). **Create.**
- `src/components/gallery-reveal.tsx` — refactor to delegate to `Reveal`. **Modify.**
- `src/components/site-nav-list.tsx` — entrance tick-in. **Modify.**
- `src/app/page.tsx` — hero spine + mono annotation + entrance cascade (typer preserved). **Modify.**
- `src/app/work/*/page.tsx`, `src/components/{fresh-greens,navi}.tsx` — spine, section indices, measure notes, section reveals. **Modify.**
- `src/app/about/page.tsx` — light section rhythm. **Modify.**
- `src/components/project-enter-transition.tsx` — formalize the signature transition (last/deferrable). **Modify.**
- `src/app/globals.css` — signature classes for nav/hero/section/chrome + CSS section counter. **Modify.**

---

## Task 1: Generic robust-reveal utilities

**Files:**
- Create: `src/components/reveal.tsx`
- Modify: `src/components/gallery-reveal.tsx`

- [ ] **Step 1: Implement `Reveal` + `SectionReveal`**

Create `src/components/reveal.tsx`:

```tsx
"use client";

import { useEffect } from "react";

const REDUCED = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Arms an on-load entrance cascade on the element with the given id. Robust:
 *  content is visible by default; a safety-net timer clears the class regardless;
 *  never arms a hidden tab. Mirrors the gallery's proven pattern. */
export function Reveal({ targetId, totalMs = 1300 }: { targetId: string; totalMs?: number }) {
  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el || REDUCED()) return;
    let t: ReturnType<typeof setTimeout>;
    const play = () => {
      if (document.hidden) return;
      el.classList.remove("wg-animate");
      void el.offsetWidth;
      el.classList.add("wg-animate");
      t = setTimeout(() => el.classList.remove("wg-animate"), totalMs);
    };
    if (document.visibilityState === "visible") play();
    else {
      const onVis = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          play();
        }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => document.removeEventListener("visibilitychange", onVis);
    }
    return () => clearTimeout(t);
  }, [targetId, totalMs]);
  return null;
}

/** Arms `.sig-reveal` sections as they scroll into view. Content is visible by
 *  default; we only ADD `.sig-in` (which plays a keyframe over it). If the
 *  observer never fires (headless), content stays visible. */
export function SectionReveal({ selector = ".sig-reveal" }: { selector?: string }) {
  useEffect(() => {
    if (REDUCED()) return;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (nodes.length === 0 || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("sig-in");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [selector]);
  return null;
}
```

- [ ] **Step 2: Add the section-reveal keyframe hook to CSS**

Append to `src/app/globals.css`:

```css
/* Section entrance — visible by default; .sig-in plays a keyframe over it */
.sig-reveal.sig-in { animation: wgRise .6s cubic-bezier(0.16,1,0.3,1) both; }
@media (prefers-reduced-motion: reduce) { .sig-reveal.sig-in { animation: none; } }
```

- [ ] **Step 3: Refactor `GalleryReveal` to delegate**

Replace the body of `src/components/gallery-reveal.tsx` with:

```tsx
"use client";
import { Reveal } from "@/components/reveal";
export function GalleryReveal() {
  return <Reveal targetId="work-gallery" />;
}
```

- [ ] **Step 4: Verify types + the gallery still animates**

Run: `npx tsc --noEmit`. Then reload `/` — the gallery entrance still plays (delegated path). Expected: identical behavior.

- [ ] **Step 5: Commit**

```bash
git add src/components/reveal.tsx src/components/gallery-reveal.tsx src/app/globals.css
git commit -m "feat: generalize robust reveal into Reveal + SectionReveal"
```

---

## Task 2: Nav signature

**Files:**
- Modify: `src/components/site-nav-list.tsx`, `src/app/globals.css`

The nav is already numbered + mono. Add a light entrance tick-in on first load, robust-pattern.

- [ ] **Step 1: Mark nav items as animatable**

In `src/components/site-nav-list.tsx`, add `className="site-nav-list wg-animate-scope"` on the `<ul>` and, on each `<li>`, add `wg-anim wg-tick` with a staggered `--d` by index (e.g. `style={{ ["--d" as string]: `${0.04 * i}s` }}`), reading the map index.

- [ ] **Step 2: Scope the keyframe to the nav**

Append to `src/app/globals.css`:

```css
.wg-animate-scope.wg-animate .wg-anim.wg-tick { animation: wgTick .5s cubic-bezier(0.16,1,0.3,1) var(--d,0s) both; }
@media (prefers-reduced-motion: reduce) { .wg-animate-scope.wg-animate .wg-anim { animation: none; } }
```

- [ ] **Step 3: Arm it**

Render `<Reveal targetId="site-nav" />` (add `id="site-nav"` to the `<ul>`), or reuse a nav-scoped id. Keep it subtle — nav is already on-brand; this is polish only.

- [ ] **Step 4: Verify**

Reload `/`: nav ticks in once, subtly; content visible with JS off; reduced-motion static.

- [ ] **Step 5: Commit**

```bash
git add src/components/site-nav-list.tsx src/app/globals.css
git commit -m "feat: subtle nav entrance tick-in (signature)"
```

---

## Task 3: Home hero signature

**Files:**
- Modify: `src/app/page.tsx`, `src/app/globals.css`

Add the spine continuation + a mono annotation near the name, and the entrance cascade — **the interest-typer stays**; the cascade wraps around it.

- [ ] **Step 1: Structure**

In the `hero` section of `src/app/page.tsx`, add `id="hero"` and a mono annotation element (a margin-note register, e.g. role + location):

```tsx
<p className="hero-anno wg-anim wg-tick" style={{ ["--d" as string]: ".05s" }}>Product designer · NYC</p>
```

Add `wg-anim wg-rise` (with staggered `--d`) to the `hero-name` `h1`, the typer wrapper, and the credentials line, matching the signature cascade order. Keep the `HeroInterestTyper` component untouched.

- [ ] **Step 2: Hero signature CSS**

Append to `src/app/globals.css`:

```css
.hero { position: relative; }
.hero-anno { font-family: var(--font-geist-mono); font-size: 0.75rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); margin: 0 0 0.6rem; }
.hero.wg-animate .wg-anim.wg-tick { animation: wgTick .6s cubic-bezier(0.16,1,0.3,1) var(--d,0s) both; }
.hero.wg-animate .wg-anim.wg-rise { animation: wgRise .6s cubic-bezier(0.16,1,0.3,1) var(--d,0s) both; }
@media (prefers-reduced-motion: reduce) { .hero.wg-animate .wg-anim { animation: none; } }
```

- [ ] **Step 3: Arm it**

Render `<Reveal targetId="hero" />` in the hero (or a shared home reveal). Ensure it coexists with the existing `HomeEntrance` choreography — verify they don't double-animate the name; if they conflict, gate the hero cascade so it runs after `HomeEntrance` completes (the existing `home-entrance-done` class on `.home-page` is the hook).

- [ ] **Step 4: Verify in the browser**

Reload `/`: hero resolves (annotation, name, typer, credentials) without fighting `HomeEntrance`; the typer still types; content visible with JS off; reduced-motion static. This step is iterative — tune delays until it feels like one motion, not two.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/globals.css
git commit -m "feat: hero working-file signature (typer preserved)"
```

---

## Task 4: Case-study section signature

**Files:**
- Modify: `src/app/work/*/page.tsx`, `src/components/{fresh-greens,navi}.tsx`, `src/app/globals.css`

Apply the spine, a per-section mono index (CSS counter), measure notes, and section reveals. Builds on Wave B's density work already on these pages.

- [ ] **Step 1: Spine + section counter CSS**

Append to `src/app/globals.css`:

```css
/* Case-study working-file frame */
.project-page { position: relative; }
.project-content { counter-reset: section; }
.project-section { position: relative; }
.project-section > h2::before {
  counter-increment: section;
  content: counter(section, decimal-leading-zero);
  display: block; font-family: var(--font-geist-mono); font-size: 0.72rem;
  letter-spacing: 0.12em; color: var(--muted); margin: 0 0 0.5rem;
}
```

(If sections are not wrapped in a single `.project-content`, add `counter-reset: section` to the article/main wrapper instead; confirm the wrapper in each page.)

- [ ] **Step 2: Mark sections for scroll reveal**

Add `className="project-section ... sig-reveal"` to each case-study `<section>` (the pages already use `project-section`; append `sig-reveal`). Render one `<SectionReveal />` per case-study page (near the end, after the sections).

- [ ] **Step 3: Measure notes (sparse)**

Add one or two mono measure annotations consistent with the gallery (e.g. a small `end · <n> sections` foot note before the work-jump). Keep sparse.

- [ ] **Step 4: Verify each study**

Load each `/work/<slug>`: sections carry `01 / 02 …` mono indices, a spine runs the article, sections resolve on scroll-in, content is visible with JS off and under reduced-motion (never blank). Confirm the section index reads as real order, not decorative reflex.

- [ ] **Step 5: Verify the SP4 + SP3 coherence**

The Wave B summary block and this signature read as one system (mono-label register matches). Adjust the summary label styling only if it clashes.

- [ ] **Step 6: Commit**

```bash
git add src/app/work/*/page.tsx src/components/fresh-greens.tsx src/components/navi.tsx src/app/globals.css
git commit -m "feat: case-study section signature (spine, indices, reveals)"
```

---

## Task 5: About + footer chrome

**Files:**
- Modify: `src/app/about/page.tsx`, `src/app/globals.css` (footer already minimal)

- [ ] **Step 1: Apply light section rhythm**

Add `sig-reveal` to About's sections and a `<SectionReveal />`; align any mono/meta to the signature register. Keep it light — supporting surface.

- [ ] **Step 2: Footer register**

Confirm the footer meta uses the mono register consistent with the signature; adjust only if inconsistent.

- [ ] **Step 3: Verify + commit**

Reload `/about`; confirm consistency, no blank, reduced-motion static.

```bash
git add src/app/about/page.tsx src/app/globals.css
git commit -m "feat: about + footer signature alignment"
```

---

## Task 6: Page transitions (last / deferrable)

**Files:**
- Modify: `src/components/project-enter-transition.tsx`

The FLIP transition (cover → case study) already exists. Formalize it as the signature transition and make the arrival resolve via the section cascade. **This is the riskiest, least-defined piece — implement last, and be willing to ship Wave C without expanded transitions if they don't earn their keep.**

- [ ] **Step 1: Coordinate arrival with the section cascade**

On transition settle (the existing `project-enter-settling` class hook), ensure the landed case study's first section runs its `sig-in` reveal so the transition and arrival read as one motion. Do not add new transition effects beyond this coordination.

- [ ] **Step 2: Reduced motion**

Confirm the FLIP already falls back to plain navigation under reduced motion (it does — keep it). No new motion for reduced-motion users.

- [ ] **Step 3: Verify**

Click a gallery card → FLIP → arrival section resolves smoothly; reduced-motion = plain nav; keyboard nav unaffected.

- [ ] **Step 4: Decision gate**

If the coordinated arrival doesn't clearly improve the feel, revert this task and ship Wave C on nav/hero/case-study/chrome alone (per the spec's explicit allowance).

- [ ] **Step 5: Commit (or revert)**

```bash
git add src/components/project-enter-transition.tsx
git commit -m "feat: coordinate FLIP arrival with section cascade"
```

---

## Task 7: Verification

- [ ] **Step 1: One-system read** — Move across `/`, `/work/*`, `/about`: consistent spine, index, measure-note, and reveal language.
- [ ] **Step 2: Robustness** — Every surface: content visible with JS off, on a hidden/background tab, and under reduced-motion — never blank. Spot-check via `preview_eval` that `.sig-reveal` sections compute `opacity: 1` before the observer fires.
- [ ] **Step 3: Contrast** — `preview_inspect` the section indices, hero annotation, and measure notes for ≥4.5:1 on both themes.
- [ ] **Step 4: Suite** — `npx tsc --noEmit && npx vitest run` clean.
- [ ] **Step 5: Commit fixes**

```bash
git add -A
git commit -m "test: verify site-wide signature coherence + robustness"
```

---

## Task 8: Impeccable critique + audit (post-implementation)

- [ ] **Step 1: Critique** — Run `/impeccable critique` across the home + one case study; verify the signature reads as intentional, not busy. Address P0/P1.
- [ ] **Step 2: Audit** — Run `/impeccable audit` (a11y of the CSS-counter section indices and generated content; the numbered-marker ban — confirm the section numbering encodes real order and isn't reflex scaffolding; performance of the observers; reduced-motion).
- [ ] **Step 3: Apply + commit fixes**

```bash
git add -A
git commit -m "fix: address impeccable findings on site-wide signature"
```

---

## Self-Review Notes (author)

- **Spec coverage:** nav → Task 2; hero → Task 3; case-study sections → Task 4; about/footer → Task 5; transitions → Task 6; reveal utilities → Task 1. Impeccable-after → Task 8. ✅
- **Depends on Wave A:** reuses `wg*` keyframes + the reveal pattern; sequenced after A. **Builds on Wave B:** case-study density already landed before Task 4. ✅
- **Type consistency:** `Reveal({ targetId, totalMs })` and `SectionReveal({ selector })` used consistently; `GalleryReveal` refactored to delegate (Task 1). CSS hooks `.wg-animate` / `.sig-reveal.sig-in` match the components. ✅
- **Risk control:** transitions (Task 6) are explicitly deferrable with a revert gate; the numbered-marker ban is checked in Task 8 (justified: sections are an ordered argument). ✅
- **Robust reveal everywhere:** `Reveal` (on-load) and `SectionReveal` (scroll) both keep content visible by default; no surface gates visibility on JS. ✅
