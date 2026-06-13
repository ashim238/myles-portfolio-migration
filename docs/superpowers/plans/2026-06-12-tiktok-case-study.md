# TikTok DSA Case Study Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TikTok Dynamic Showcase Ads case study at `/work/tiktok` to match the depth and voice of Fresh Greens, with four custom interactive artifacts, an animated TikTok logo in the eyebrow, and a layered template-stack hero.

**Architecture:** Static Next.js route under `src/app/work/tiktok/page.tsx`, co-located components in `src/components/tiktok-dsa.tsx`. Markdown frontmatter at `content/projects/tiktok.md` so the project appears on the homepage. Scoped CSS under `.tt-page` selector. Reuses existing primitives: `ProjectToc`, `ProjectWorkJump`, `ExpandableImage`, `LightboxProvider`, `SiteNav`.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind v4, inline SVG, `next/image`, `gray-matter` (existing CMS).

**Branch:** `case-study/tiktok-dsa` (already checked out).

**Spec reference:** `docs/superpowers/specs/2026-06-12-tiktok-case-study-design.md`

---

## File Structure

| File | Purpose |
|---|---|
| `public/projects/tiktok/*.png` | Source assets pulled from Framer |
| `content/projects/tiktok.md` | Frontmatter for homepage listing |
| `src/app/work/tiktok/page.tsx` | The case study route |
| `src/components/tiktok-dsa.tsx` | Co-located components (logo, hero stack, anatomy diagram, showcase card, outcome card, lineage timeline) |
| `src/app/globals.css` | Scoped `.tt-page` styles added at end of Fresh Greens block |

---

## Task 1: Pull source assets from Framer

**Files:**
- Create: `public/projects/tiktok/` (directory)
- Various `.png` files in that directory

- [ ] **Step 1.1: List the image URLs**

Run:
```bash
curl -sL "https://orchid-pineapple-649008.framer.app/work/tiktok" -A "Mozilla/5.0" \
  | grep -oE 'https://framerusercontent\.com/images/[^"?]+\.(png|jpg|svg)' \
  | sort -u
```

Expected: ~20-25 unique URLs.

- [ ] **Step 1.2: Save the URL list to a temp file**

```bash
curl -sL "https://orchid-pineapple-649008.framer.app/work/tiktok" -A "Mozilla/5.0" \
  | grep -oE 'https://framerusercontent\.com/images/[^"?]+\.(png|jpg|svg)' \
  | sort -u > /tmp/tiktok-assets.txt
wc -l /tmp/tiktok-assets.txt
```

- [ ] **Step 1.3: Create the asset directory and download all images**

```bash
mkdir -p /Users/mylesashitey/myles-portfolio-migration/public/projects/tiktok
cd /Users/mylesashitey/myles-portfolio-migration/public/projects/tiktok
while read url; do
  filename=$(basename "$url")
  curl -sL "$url" -A "Mozilla/5.0" -o "raw-$filename"
done < /tmp/tiktok-assets.txt
ls -lh
```

Expected: ~20-25 files named `raw-<framer-hash>.png` etc.

- [ ] **Step 1.4: Open each downloaded file in Preview / Finder and identify**

Manual step — Myles inspects each `raw-*.png` and tags them by content. Rename to intent-descriptive names:

```bash
# Examples — actual names depend on what's in each file:
mv raw-3OeW2wk5NdrVlJFFKgL1kzBr49Q.png hero-light-academia.png
mv raw-46Kj9SUTr62JkzLUtAmv7OPU4.png template-dopamine-final.png
mv raw-MCHXOxYFrXSDFodZSKw9bOoh1gE.png mood-acne-studios.png
# ...etc
```

Final intent-descriptive set should include at minimum:
- `hero-light-academia.png` (or whichever the AE-adopted aesthetic was)
- `template-dopamine-final.png`
- `template-eboy-final.png`
- `template-light-academia-final.png`
- `mood-70s-psychedelia.png`
- `mood-punk-magazine.png`
- `mood-acne-studios.png`
- `anatomy-base-grid.png` (if any base grid asset exists; otherwise we'll draw the SVG from scratch)
- `cover.png` (for homepage card — landscape composition)

- [ ] **Step 1.5: Commit the assets**

```bash
cd /Users/mylesashitey/myles-portfolio-migration
git add public/projects/tiktok/
git commit -m "Add TikTok DSA source assets pulled from Framer"
```

---

## Task 2: Markdown frontmatter + route scaffolding

**Files:**
- Create: `content/projects/tiktok.md`
- Create: `src/app/work/tiktok/page.tsx`

- [ ] **Step 2.1: Create the frontmatter file**

Write `content/projects/tiktok.md`:

```markdown
---
slug: tiktok
title: TikTok Dynamic Showcase Ads
summary: A template system built so brands could showcase product catalogs in-feed, designed around TikTok's subculture density. Adopted by American Eagle.
role: Visual Designer · Brand Studio
timeframe: May – August 2021
status: published
order: 4
coverImage: /projects/tiktok/cover.png
tags:
  - Internship
  - Brand
  - Ad Systems
sections: []
---
```

- [ ] **Step 2.2: Scaffold the page route**

Write `src/app/work/tiktok/page.tsx`:

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { ProjectToc } from "@/components/project-toc";
import { ProjectWorkJump } from "@/components/project-work-jump";
import { getAllProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "TikTok Dynamic Showcase Ads",
  description:
    "An internship-era template system for TikTok's Dynamic Showcase Ads — designed around the platform's subculture density and adopted by American Eagle.",
  openGraph: {
    title: "TikTok Dynamic Showcase Ads",
    description:
      "An internship-era template system for TikTok's Dynamic Showcase Ads — designed around the platform's subculture density and adopted by American Eagle.",
    type: "article",
  },
};

export default async function TikTokPage() {
  const allProjects = await getAllProjects();

  return (
    <main className="page-shell project-page tt-page" id="main-content">
      <SiteNav />
      <nav className="project-topbar" aria-label="Breadcrumb">
        <Link href="/#work">
          <span aria-hidden="true">← </span>
          Selected work
        </Link>
      </nav>

      <section className="hero project-hero tt-hero" aria-labelledby="tt-title">
        <p className="tt-eyebrow">Internship · 2021</p>
        <h1 id="tt-title" className="project-hero-title tt-title">
          TikTok Dynamic Showcase Ads
        </h1>
        <p className="project-hero-lede tt-lede">
          Scaffolding — replace in Task 5.
        </p>
      </section>

      <ProjectWorkJump currentSlug="tiktok" projects={allProjects} />
    </main>
  );
}
```

- [ ] **Step 2.3: Verify the route renders and the project shows on homepage**

```bash
cd /Users/mylesashitey/myles-portfolio-migration
npx tsc --noEmit
```

Expected: clean (no TS errors).

Then start the dev server with `preview_start` and visit `http://localhost:3000/work/tiktok` — should render with the scaffold. Visit `http://localhost:3000` — TikTok should appear in the work list (4th position).

- [ ] **Step 2.4: Commit**

```bash
git add content/projects/tiktok.md src/app/work/tiktok/page.tsx
git commit -m "Scaffold TikTok case study route and homepage listing"
```

---

## Task 3: Animated TikTok logo component

**Files:**
- Modify: `src/components/tiktok-dsa.tsx` (create)
- Modify: `src/app/globals.css` (add `.tt-logo*` rules)
- Modify: `src/app/work/tiktok/page.tsx` (use the component in eyebrow)

- [ ] **Step 3.1: Create the components file with the logo**

Write `src/components/tiktok-dsa.tsx`:

```tsx
// Co-located components for the TikTok DSA case study.
// One file, one page — these aren't meant to be reused elsewhere.

/* ──────────────────────────────────────────
   Animated TikTok logo
   Cyan/magenta channel separation drift.
   prefers-reduced-motion: static glyph.
   ────────────────────────────────────────── */

export function TikTokLogo() {
  return (
    <span className="tt-logo" aria-hidden="true">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g className="tt-logo-cyan">
          <path d="M22.5 6.8c-1.6-0.9-2.6-2.5-2.9-4.3h-3.7v15.1c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c0.4 0 0.7 0.1 1 0.2v-3.8c-0.3-0.04-0.7-0.06-1-0.06-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2v-7.7c1.4 1 3.2 1.6 5.1 1.6v-3.7c-0.9 0-1.8-0.3-2.2-0.6z" />
        </g>
        <g className="tt-logo-magenta">
          <path d="M22.5 6.8c-1.6-0.9-2.6-2.5-2.9-4.3h-3.7v15.1c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c0.4 0 0.7 0.1 1 0.2v-3.8c-0.3-0.04-0.7-0.06-1-0.06-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2v-7.7c1.4 1 3.2 1.6 5.1 1.6v-3.7c-0.9 0-1.8-0.3-2.2-0.6z" />
        </g>
        <g className="tt-logo-ink">
          <path d="M22.5 6.8c-1.6-0.9-2.6-2.5-2.9-4.3h-3.7v15.1c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c0.4 0 0.7 0.1 1 0.2v-3.8c-0.3-0.04-0.7-0.06-1-0.06-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2v-7.7c1.4 1 3.2 1.6 5.1 1.6v-3.7c-0.9 0-1.8-0.3-2.2-0.6z" />
        </g>
      </svg>
    </span>
  );
}
```

- [ ] **Step 3.2: Add the logo CSS to globals.css**

Append to `src/app/globals.css` (after the existing Fresh Greens block, before the lightbox block):

```css
/* ============================================================
   TikTok DSA case study
   Page-specific styling. Inherits portfolio tokens; introduces
   a TikTok-themed cyan/magenta animation for the eyebrow logo.
   ============================================================ */

.tt-page {
  --tt-cyan: #25f4ee;
  --tt-magenta: #fe2c55;
}

.tt-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0 0 0.85rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted);
}

.tt-logo {
  display: inline-block;
  width: 0.95rem;
  height: 0.95rem;
  position: relative;
}

.tt-logo svg {
  width: 100%;
  height: 100%;
  display: block;
}

.tt-logo-cyan {
  fill: var(--tt-cyan);
  mix-blend-mode: screen;
}

.tt-logo-magenta {
  fill: var(--tt-magenta);
  mix-blend-mode: screen;
}

.tt-logo-ink {
  fill: var(--foreground);
}

@media (prefers-reduced-motion: no-preference) {
  .tt-logo-cyan {
    animation: tt-logo-drift-cyan 3.5s ease-in-out infinite;
  }
  .tt-logo-magenta {
    animation: tt-logo-drift-magenta 3.5s ease-in-out infinite;
  }
}

@keyframes tt-logo-drift-cyan {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(-1.2px, 0.6px); }
}

@keyframes tt-logo-drift-magenta {
  0%, 100% { transform: translate(0, 0); }
  50%      { transform: translate(1.2px, -0.6px); }
}
```

- [ ] **Step 3.3: Wire the logo into the page eyebrow**

Modify `src/app/work/tiktok/page.tsx` — add the import and replace the eyebrow:

```tsx
import { TikTokLogo } from "@/components/tiktok-dsa";

// ...inside the hero section, replace:
//   <p className="tt-eyebrow">Internship · 2021</p>
// with:
        <p className="tt-eyebrow">
          <TikTokLogo />
          <span>Internship · 2021</span>
        </p>
```

- [ ] **Step 3.4: Verify**

```bash
npx tsc --noEmit
```

Then visit the page and confirm the logo animates with the cyan/magenta drift. Toggle reduced motion in system prefs to confirm the animation suppresses.

- [ ] **Step 3.5: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add animated TikTok logo to case study eyebrow"
```

---

## Task 4: Hero — layered template stack

**Files:**
- Modify: `src/components/tiktok-dsa.tsx` (add `HeroTemplateStack`)
- Modify: `src/app/globals.css` (add stack rules)
- Modify: `src/app/work/tiktok/page.tsx` (use the component in hero, replace lede placeholder)

- [ ] **Step 4.1: Add the HeroTemplateStack component (static, no parallax yet)**

Append to `src/components/tiktok-dsa.tsx`:

```tsx
import Image from "next/image";

/* ──────────────────────────────────────────
   Hero — layered template stack
   Light Academia in front (the AE-adopted card).
   Cursor-following parallax + scroll-driven spread.
   ────────────────────────────────────────── */

type StackCardProps = {
  src: string;
  alt: string;
  layer: "front" | "mid" | "back";
};

function StackCard({ src, alt, layer }: StackCardProps) {
  return (
    <div className={`tt-stack-card tt-stack-card--${layer}`}>
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={900}
        priority={layer === "front"}
        sizes="(max-width: 768px) 92vw, 720px"
      />
    </div>
  );
}

export function HeroTemplateStack() {
  return (
    <div className="tt-stack" aria-hidden="true">
      <StackCard
        layer="back"
        src="/projects/tiktok/template-eboy-final.png"
        alt="E-Boy / E-Girl template"
      />
      <StackCard
        layer="mid"
        src="/projects/tiktok/template-dopamine-final.png"
        alt="Dopamine Dressing template"
      />
      <StackCard
        layer="front"
        src="/projects/tiktok/template-light-academia-final.png"
        alt="Light Academia template"
      />
    </div>
  );
}
```

- [ ] **Step 4.2: Add the static fanned-arrangement CSS**

Append to `src/app/globals.css`:

```css
.tt-hero-device {
  margin-top: 2.6rem;
  display: flex;
  justify-content: center;
}

.tt-stack {
  position: relative;
  width: min(720px, 92vw);
  aspect-ratio: 16 / 9;
  perspective: 1400px;
}

.tt-stack-card {
  position: absolute;
  inset: 0;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 28px 64px rgba(0, 0, 0, 0.22),
    0 10px 24px rgba(0, 0, 0, 0.12);
  transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
  background: var(--surface);
}

.tt-stack-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.tt-stack-card--back {
  transform: translateX(-7%) translateY(-4%) rotate(-4deg) scale(0.94);
  z-index: 1;
  opacity: 0.78;
}

.tt-stack-card--mid {
  transform: translateX(5%) translateY(-2%) rotate(3deg) scale(0.96);
  z-index: 2;
  opacity: 0.88;
}

.tt-stack-card--front {
  transform: translateX(0) translateY(0) rotate(0deg) scale(1);
  z-index: 3;
}
```

- [ ] **Step 4.3: Wire the hero in and write the real lede**

In `src/app/work/tiktok/page.tsx`, import `HeroTemplateStack` and replace the placeholder lede + add the stack:

```tsx
import { HeroTemplateStack, TikTokLogo } from "@/components/tiktok-dsa";

// In the hero section, replace the placeholder lede block with:
        <p className="project-hero-lede tt-lede">
          A modular template system built for TikTok&apos;s Dynamic Showcase
          Ads — designed around the platform&apos;s subculture density so the
          ads could read as in-feed, not at-feed. American Eagle adopted one
          of the three.
        </p>
        <div className="tt-hero-device">
          <HeroTemplateStack />
        </div>
```

- [ ] **Step 4.4: Add lede/title CSS**

Append to `src/app/globals.css`:

```css
.tt-title {
  font-size: clamp(2.5rem, 7vw, 4.6rem) !important;
}

.tt-lede {
  max-width: 42ch !important;
  font-size: clamp(1.05rem, 2vw, 1.28rem) !important;
}
```

- [ ] **Step 4.5: Visually verify**

Run dev server. Confirm the stack renders with three fanned cards, Light Academia in front. Check responsive at mobile width.

- [ ] **Step 4.6: Add the cursor parallax**

Append to `src/components/tiktok-dsa.tsx` — convert `HeroTemplateStack` to a client component with parallax. Replace the existing export with:

```tsx
"use client";

import { useEffect, useRef } from "react";

// Replace the existing HeroTemplateStack export with this:
export function HeroTemplateStack() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / rect.width;   // -0.5 .. 0.5
      const ny = (e.clientY - cy) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--tt-parallax-x", String(nx));
        el.style.setProperty("--tt-parallax-y", String(ny));
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="tt-stack" aria-hidden="true">
      <StackCard
        layer="back"
        src="/projects/tiktok/template-eboy-final.png"
        alt="E-Boy / E-Girl template"
      />
      <StackCard
        layer="mid"
        src="/projects/tiktok/template-dopamine-final.png"
        alt="Dopamine Dressing template"
      />
      <StackCard
        layer="front"
        src="/projects/tiktok/template-light-academia-final.png"
        alt="Light Academia template"
      />
    </div>
  );
}
```

Note: because of `"use client"`, you'll need to extract the page-meta hero portion that uses the stack into a client island, OR keep this client component imported from a server component (Next 16 allows this — verify locally).

- [ ] **Step 4.7: Wire parallax CSS variables into the card transforms**

Modify the card transforms in `globals.css` to consume `--tt-parallax-x` and `--tt-parallax-y` (defaulting to 0 when unset):

```css
.tt-stack {
  --tt-parallax-x: 0;
  --tt-parallax-y: 0;
}

.tt-stack-card--back {
  transform:
    translateX(calc(-7% + (var(--tt-parallax-x) * -8px)))
    translateY(calc(-4% + (var(--tt-parallax-y) * -6px)))
    rotate(-4deg) scale(0.94);
  z-index: 1;
  opacity: 0.78;
}

.tt-stack-card--mid {
  transform:
    translateX(calc(5% + (var(--tt-parallax-x) * 4px)))
    translateY(calc(-2% + (var(--tt-parallax-y) * 3px)))
    rotate(3deg) scale(0.96);
  z-index: 2;
  opacity: 0.88;
}

.tt-stack-card--front {
  transform:
    translateX(calc(0% + (var(--tt-parallax-x) * 6px)))
    translateY(calc(0% + (var(--tt-parallax-y) * 4px)))
    rotate(0deg) scale(1);
  z-index: 3;
}
```

- [ ] **Step 4.8: Visually verify parallax**

Move the cursor across the hero. Cards should drift subtly. Turn on reduced motion → drift stops.

- [ ] **Step 4.9: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add layered template stack hero with cursor parallax"
```

---

## Task 5: Project meta strip + TOC

**Files:**
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 5.1: Add the project meta dl block**

After the hero section in `page.tsx`, add:

```tsx
      <dl className="project-meta tt-meta" aria-label="Project details">
        <div className="project-meta-field">
          <dt>Role</dt>
          <dd>Visual Designer · Brand Studio</dd>
        </div>
        <div className="project-meta-field">
          <dt>Stack</dt>
          <dd>Illustrator · Photoshop</dd>
        </div>
        <div className="project-meta-field">
          <dt>Timeline</dt>
          <dd>May – Aug 2021</dd>
        </div>
      </dl>
```

- [ ] **Step 5.2: Add the TOC**

After the project-meta block:

```tsx
      <ProjectToc
        sections={[
          { title: "The brief", id: "tt-brief" },
          { title: "Reading the platform", id: "tt-research" },
          { title: "The system", id: "tt-system" },
          { title: "Three aesthetics", id: "tt-aesthetics" },
          { title: "What shipped", id: "tt-shipped" },
          { title: "Honest scope", id: "tt-scope" },
          { title: "Retrospective", id: "tt-retro" },
        ]}
      />
```

- [ ] **Step 5.3: Verify**

`npx tsc --noEmit` clean; load the page, TOC renders sticky on desktop with the 7 sections.

- [ ] **Step 5.4: Commit**

```bash
git add src/app/work/tiktok/page.tsx
git commit -m "Add TikTok case study meta strip and TOC"
```

---

## Task 6: Section 01 — The brief

**Files:**
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 6.1: Add the section markup with draft prose**

After `<ProjectToc>`:

```tsx
      <section className="project-section tt-section" aria-labelledby="tt-brief">
        <h2 id="tt-brief">A template format, built for a platform of niches.</h2>
        <div className="project-section-body">
          <p>
            TikTok&apos;s Dynamic Showcase Ads were the platform&apos;s answer
            to a specific partner ask: an affordable, evergreen way to push a
            product catalog into the feed. The format used pre-built templates
            so brands didn&apos;t need to commission a video every time the
            catalog turned over. TikTok eventually shipped 30+ of them.
          </p>
          <p>
            What made the brief sharper than &quot;design a catalog ad
            template&quot; was the platform itself. TikTok&apos;s value sits
            in its subcultures — Y2K, Maximalism, Dark Academia, Cottagecore,
            WitchTok — and a feed that hands a single ad treatment to all of
            them flattens what people are there to find. The bet I went in
            with was that catalog templates should be designed against
            subcultures, not against the platform as a whole.
          </p>
          <p>
            The constraints were the standard pair for in-feed: TikTok&apos;s
            brand guidelines, immutable; the 960×540 ad dimensions,
            immutable; and the subculture aesthetics, variable. The brief
            became designing a system that absorbed the variability without
            breaking the immutable parts.
          </p>
        </div>
      </section>
```

- [ ] **Step 6.2: Verify**

Load the page, section renders, anchor scroll from TOC works.

- [ ] **Step 6.3: Voice review with Myles (manual)**

Read the prose out loud. Tighten anything that doesn&apos;t sound like the rest of the portfolio. If revisions are needed, apply inline.

- [ ] **Step 6.4: Commit**

```bash
git add src/app/work/tiktok/page.tsx
git commit -m "Add Section 01 — The brief"
```

---

## Task 7: System overview band (early palette preview)

**Files:**
- Modify: `src/components/tiktok-dsa.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 7.1: Add the `SystemOverviewBand` component**

Append to `src/components/tiktok-dsa.tsx`:

```tsx
const AESTHETICS = [
  {
    name: "Dopamine Dressing",
    palette: [
      { hex: "#1323C2", label: "Medium Blue" },
      { hex: "#74F0ED", label: "Electric Blue" },
      { hex: "#FF5576", label: "Bright Pink" },
    ],
  },
  {
    name: "E-Boy / E-Girl",
    palette: [
      { hex: "#141414", label: "Night" },
      { hex: "#313539", label: "Onyx" },
      { hex: "#6F7172", label: "Dim Gray" },
    ],
  },
  {
    name: "Light Academia",
    palette: [
      { hex: "#141414", label: "Night" },
      { hex: "#EDC4AC", label: "Desert Sand" },
      { hex: "#F7F7F7", label: "Seasalt" },
    ],
  },
];

export function SystemOverviewBand() {
  return (
    <figure className="tt-overview" aria-label="Color system across three aesthetics">
      {AESTHETICS.map((a) => (
        <div key={a.name} className="tt-overview-row">
          <p className="tt-overview-label">{a.name}</p>
          <ul className="tt-overview-swatches" role="list">
            {a.palette.map((p) => (
              <li key={p.hex} className="tt-overview-swatch" title={`${p.label} · ${p.hex}`}>
                <span style={{ background: p.hex }} aria-hidden="true" />
                <span className="tt-overview-hex">{p.hex}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </figure>
  );
}
```

- [ ] **Step 7.2: Add CSS**

Append to `globals.css`:

```css
.tt-overview {
  margin: 2.4rem 0 0;
  padding: 1.5rem 1.2rem;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  background: var(--surface);
  display: grid;
  gap: 0.85rem;
}

.tt-overview-row {
  display: grid;
  grid-template-columns: minmax(9rem, 1fr) auto;
  align-items: center;
  gap: 1.2rem;
}

.tt-overview-label {
  margin: 0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.tt-overview-swatches {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tt-overview-swatch {
  position: relative;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.35rem;
  overflow: hidden;
  cursor: default;
}

.tt-overview-swatch span:first-child {
  position: absolute;
  inset: 0;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: inherit;
}

.tt-overview-hex {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.62rem;
  color: var(--background);
  background: rgba(0, 0, 0, 0.55);
  opacity: 0;
  transition: opacity 160ms ease;
}

.tt-overview-swatch:hover .tt-overview-hex,
.tt-overview-swatch:focus-within .tt-overview-hex {
  opacity: 1;
}

@media (max-width: 640px) {
  .tt-overview-row {
    grid-template-columns: 1fr;
    gap: 0.45rem;
  }
}
```

- [ ] **Step 7.3: Add to the page after Section 01**

In `page.tsx`, import `SystemOverviewBand` and add `<SystemOverviewBand />` immediately after the closing `</section>` of `tt-brief`.

- [ ] **Step 7.4: Verify**

Hovering swatches reveals hex labels. Responsive collapses cleanly to mobile.

- [ ] **Step 7.5: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add system overview palette band — 9 swatches, 3 aesthetics"
```

---

## Task 8: Section 02 — Reading the platform

**Files:**
- Modify: `src/app/work/tiktok/page.tsx`
- Modify: `src/app/globals.css` (add pullquote rule if not inheritable)

- [ ] **Step 8.1: Add the section**

After the SystemOverviewBand, add:

```tsx
      <section className="project-section tt-section" aria-labelledby="tt-research">
        <h2 id="tt-research">Five subcultures. Three buckets. A working hypothesis.</h2>
        <div className="project-section-body">
          <p>
            Without a brand to anchor the work, I started with desk research
            — scrolling TikTok the way the platform&apos;s users actually do,
            mapping the recurring aesthetic worlds that organize how content
            (and shopping) finds its audience. Five surfaced cleanly: Y2K,
            Maximalism, Dark Academia, Cottagecore, and WitchTok. Each had
            its own visual register, its own creator vocabulary, its own
            commerce footprint.
          </p>
          <p>
            Five was too many to build templates against. Modularity needed
            buckets broad enough that a brand could see itself in one without
            requiring per-brand customization. I narrowed to three
            categorical groupings — high-saturation joy, edge and texture,
            quiet and considered — and built internal working names around
            them so the team could talk about them while I designed. Vendors
            who eventually adopted the templates likely saw a different label.
          </p>
        </div>

        <figure className="tt-pullquote">
          <blockquote>
            An in-feed ad either feels native or it doesn&apos;t. Subcultures
            are how TikTok&apos;s audience makes that distinction.
          </blockquote>
          <figcaption>Working hypothesis · TikTok DSA, 2021</figcaption>
        </figure>

        <div className="project-section-body">
          <p>
            The bet was that designing against subculture buckets would
            absorb the breadth without losing the specificity. The system
            had to share a skeleton — same in-feed dimensions, same TikTok
            chrome — and let three aesthetic registers fill it.
          </p>
        </div>
      </section>
```

- [ ] **Step 8.2: Add pullquote CSS (reuse Fresh Greens treatment)**

Append to `globals.css`:

```css
.tt-pullquote {
  margin: 2rem 0;
  padding: 1.4rem 1.6rem;
  border-left: 3px solid var(--foreground);
  background: var(--surface);
  border-radius: 0.5rem;
}

.tt-pullquote blockquote {
  margin: 0 0 0.55rem;
  font-size: clamp(1.15rem, 2.2vw, 1.35rem);
  line-height: 1.35;
  font-weight: 400;
  text-wrap: balance;
}

.tt-pullquote figcaption {
  margin: 0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}
```

- [ ] **Step 8.3: Verify and commit**

```bash
npx tsc --noEmit
git add src/app/work/tiktok/page.tsx src/app/globals.css
git commit -m "Add Section 02 — Reading the platform"
```

---

## Task 9: Section 03 — The system + template anatomy diagram

**Files:**
- Modify: `src/components/tiktok-dsa.tsx` (add `TemplateAnatomyDiagram`)
- Modify: `src/app/globals.css`
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 9.1: Add the TemplateAnatomyDiagram component**

Append to `src/components/tiktok-dsa.tsx`:

```tsx
"use client";

import { useState } from "react";

type SlotKey = "title" | "catalog" | "supplementary" | "cta";

const SLOT_THUMBS: Record<SlotKey, { aesthetic: string; src: string }[]> = {
  title: [
    { aesthetic: "Dopamine", src: "/projects/tiktok/anatomy-title-dopamine.png" },
    { aesthetic: "E-Boy", src: "/projects/tiktok/anatomy-title-eboy.png" },
    { aesthetic: "Light Academia", src: "/projects/tiktok/anatomy-title-la.png" },
  ],
  catalog: [
    { aesthetic: "Dopamine", src: "/projects/tiktok/anatomy-catalog-dopamine.png" },
    { aesthetic: "E-Boy", src: "/projects/tiktok/anatomy-catalog-eboy.png" },
    { aesthetic: "Light Academia", src: "/projects/tiktok/anatomy-catalog-la.png" },
  ],
  supplementary: [
    { aesthetic: "Dopamine", src: "/projects/tiktok/anatomy-supp-dopamine.png" },
    { aesthetic: "E-Boy", src: "/projects/tiktok/anatomy-supp-eboy.png" },
    { aesthetic: "Light Academia", src: "/projects/tiktok/anatomy-supp-la.png" },
  ],
  cta: [
    { aesthetic: "Dopamine", src: "/projects/tiktok/anatomy-cta-dopamine.png" },
    { aesthetic: "E-Boy", src: "/projects/tiktok/anatomy-cta-eboy.png" },
    { aesthetic: "Light Academia", src: "/projects/tiktok/anatomy-cta-la.png" },
  ],
};

export function TemplateAnatomyDiagram() {
  const [active, setActive] = useState<SlotKey | null>(null);

  return (
    <figure className="tt-anatomy">
      <svg
        viewBox="0 0 960 540"
        xmlns="http://www.w3.org/2000/svg"
        className="tt-anatomy-svg"
        role="img"
        aria-label="960×540 in-feed ad frame with four labeled slot zones."
      >
        <rect
          x="2" y="2" width="956" height="536"
          fill="none" stroke="currentColor" strokeWidth="1" opacity="0.4"
        />

        <g
          className={`tt-anatomy-slot ${active === "title" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("title")}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("title")}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          <rect x="32" y="32" width="380" height="80" rx="4"
            fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
          <text x="48" y="76" fontSize="14" fontFamily="var(--font-mono)" fill="currentColor">
            title zone
          </text>
        </g>

        <g
          className={`tt-anatomy-slot ${active === "catalog" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("catalog")}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("catalog")}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          <rect x="32" y="140" width="600" height="320" rx="4"
            fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
          <text x="48" y="172" fontSize="14" fontFamily="var(--font-mono)" fill="currentColor">
            product catalog grid
          </text>
        </g>

        <g
          className={`tt-anatomy-slot ${active === "supplementary" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("supplementary")}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("supplementary")}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          <rect x="660" y="140" width="268" height="220" rx="4"
            fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
          <text x="676" y="172" fontSize="14" fontFamily="var(--font-mono)" fill="currentColor">
            supplementary graphics
          </text>
        </g>

        <g
          className={`tt-anatomy-slot ${active === "cta" ? "is-active" : ""}`}
          onMouseEnter={() => setActive("cta")}
          onMouseLeave={() => setActive(null)}
          onFocus={() => setActive("cta")}
          onBlur={() => setActive(null)}
          tabIndex={0}
        >
          <rect x="660" y="380" width="268" height="80" rx="4"
            fill="none" stroke="currentColor" strokeWidth="1.4" opacity="0.7" />
          <text x="676" y="424" fontSize="14" fontFamily="var(--font-mono)" fill="currentColor">
            CTA
          </text>
        </g>
      </svg>

      <div className="tt-anatomy-thumbs" aria-live="polite">
        {active ? (
          <>
            <p className="tt-anatomy-thumb-label">
              {active === "title" ? "Title zone" :
                active === "catalog" ? "Product catalog grid" :
                active === "supplementary" ? "Supplementary graphics" : "CTA"} — across the three aesthetics
            </p>
            <ul role="list">
              {SLOT_THUMBS[active].map((t) => (
                <li key={t.aesthetic}>
                  <Image src={t.src} alt={`${active} slot, ${t.aesthetic}`} width={240} height={160} />
                  <span>{t.aesthetic}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="tt-anatomy-thumb-hint">
            Hover or focus a slot to see how each aesthetic fills it.
          </p>
        )}
      </div>
    </figure>
  );
}
```

NOTE: This task assumes you have anatomy slot crops (12 images: 4 slots × 3 aesthetics) prepared. If you don't, the simplification is to drop the per-slot thumbnails and just show the diagram statically — see Step 9.5.

- [ ] **Step 9.2: Add anatomy CSS**

Append to `globals.css`:

```css
.tt-anatomy {
  margin: 2.2rem 0 1.4rem;
  padding: 1.5rem 1.2rem;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  background: var(--surface);
  color: var(--foreground);
}

.tt-anatomy-svg {
  width: 100%;
  height: auto;
  display: block;
}

.tt-anatomy-slot {
  cursor: pointer;
  transition: opacity 200ms ease;
}

.tt-anatomy-slot:not(.is-active) {
  opacity: 0.75;
}

.tt-anatomy-slot.is-active rect {
  stroke: var(--tt-magenta);
  opacity: 1;
}

.tt-anatomy-slot:focus {
  outline: none;
}

.tt-anatomy-slot:focus-visible rect {
  stroke: var(--tt-cyan);
  stroke-width: 2;
}

.tt-anatomy-thumbs {
  margin-top: 1.4rem;
  min-height: 6rem;
}

.tt-anatomy-thumb-label {
  margin: 0 0 0.6rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.tt-anatomy-thumb-hint {
  margin: 0;
  color: var(--muted);
  font-style: italic;
}

.tt-anatomy-thumbs ul {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tt-anatomy-thumbs li {
  display: grid;
  gap: 0.35rem;
}

.tt-anatomy-thumbs img {
  width: 100%;
  height: auto;
  border-radius: 0.35rem;
  border: 1px solid var(--line);
}

.tt-anatomy-thumbs span {
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  color: var(--muted);
}

@media (max-width: 640px) {
  .tt-anatomy-thumbs ul {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tt-anatomy-slot {
    transition: none;
  }
}
```

- [ ] **Step 9.3: Add the section to the page**

After Section 02 in `page.tsx`:

```tsx
      <section className="project-section tt-section tt-section--wide" aria-labelledby="tt-system">
        <h2 id="tt-system">One skeleton. Three fills.</h2>
        <div className="project-section-body">
          <p>
            The constraint stack — TikTok&apos;s brand guidelines, the 960×540
            in-feed dimensions, three subculture aesthetics — only resolves
            cleanly if the variability lives in defined places. I drew the
            template against a slot map: title zone, product catalog grid,
            supplementary graphics, CTA. Each slot held the same role across
            every aesthetic. What changed was the fill: typography, palette,
            ornament, image treatment.
          </p>
          <p>
            The diagram below is the shared skeleton. Hover a slot to see
            how the three aesthetics filled it.
          </p>
        </div>

        <TemplateAnatomyDiagram />
      </section>
```

Import `TemplateAnatomyDiagram` at top of file.

- [ ] **Step 9.4: Visually verify**

Hover the slots — magenta highlight + thumb row beneath. Tab through with keyboard — focus ring (cyan) cycles through slots.

- [ ] **Step 9.5: Fallback if slot thumbs don't exist**

If you don't have the 12 slot-crop images yet, the simplification is:

1. Skip the `SLOT_THUMBS` constant.
2. Replace the `tt-anatomy-thumbs` block with a static description of what fills each slot per aesthetic.

For now, draft slot copy if no images exist:

```
Title zone — large display type with the aesthetic's signature typographic register.
Product catalog grid — 3-up product cards with aesthetic-specific frame treatment.
Supplementary graphics — palette-specific ornament; high in Dopamine, restrained in Light Academia.
CTA — standardized TikTok button in the aesthetic's accent.
```

- [ ] **Step 9.6: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add Section 03 — The system + template anatomy diagram"
```

---

## Task 10: Section 04 — Three aesthetics showcase cards

**Files:**
- Modify: `src/components/tiktok-dsa.tsx` (add `AestheticShowcaseCard`)
- Modify: `src/app/globals.css`
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 10.1: Add the AestheticShowcaseCard component**

Append to `src/components/tiktok-dsa.tsx`:

```tsx
import { ExpandableImage } from "@/components/expandable-image";

type Swatch = { hex: string; label: string };

type AestheticShowcaseProps = {
  number: string;
  name: string;
  internalLabel: string; // e.g., "#DopamineDressing"
  accentHex: string;
  accentInk: string;     // text color that reads on the accent
  palette: Swatch[];
  anchor: { src: string; alt: string; caption: string };
  feedback: string;
  hero: { src: string; alt: string };
  final: { src: string; alt: string };
  reverse?: boolean;
};

export function AestheticShowcaseCard({
  number, name, internalLabel, accentHex, accentInk,
  palette, anchor, feedback, hero, final, reverse,
}: AestheticShowcaseProps) {
  const accentStyle = {
    "--tt-accent": accentHex,
    "--tt-accent-ink": accentInk,
  } as React.CSSProperties;

  return (
    <article
      className={`tt-aesthetic ${reverse ? "tt-aesthetic--reverse" : ""}`}
      style={accentStyle}
    >
      <div className="tt-aesthetic-visual">
        <ExpandableImage
          src={hero.src}
          alt={hero.alt}
          width={1600}
          height={900}
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        <ExpandableImage
          src={final.src}
          alt={final.alt}
          width={1600}
          height={900}
          style={{ width: "100%", height: "auto", display: "block", marginTop: "0.85rem" }}
        />
      </div>

      <div className="tt-aesthetic-context">
        <p className="tt-aesthetic-number">{number}</p>
        <h3 className="tt-aesthetic-name">{name}</h3>
        <p className="tt-aesthetic-internal">Internal label: {internalLabel}</p>

        <p className="tt-aesthetic-meta-label">Palette</p>
        <ul className="tt-aesthetic-palette" role="list">
          {palette.map((s) => (
            <li key={s.hex} title={`${s.label} · ${s.hex}`}>
              <span style={{ background: s.hex }} aria-hidden="true" />
              <span className="tt-aesthetic-palette-label">
                <span className="tt-aesthetic-palette-name">{s.label}</span>
                <span className="tt-aesthetic-palette-hex">{s.hex}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="tt-aesthetic-meta-label">Anchor</p>
        <figure className="tt-aesthetic-anchor">
          <ExpandableImage
            src={anchor.src}
            alt={anchor.alt}
            width={800}
            height={500}
            style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.35rem" }}
          />
          <figcaption>{anchor.caption}</figcaption>
        </figure>

        <p className="tt-aesthetic-meta-label">Feedback received</p>
        <blockquote className="tt-aesthetic-feedback">{feedback}</blockquote>
      </div>
    </article>
  );
}
```

- [ ] **Step 10.2: Add showcase CSS**

Append to `globals.css`:

```css
.tt-aesthetic {
  --tt-accent: #888;
  --tt-accent-ink: #fff;

  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 2.2rem;
  align-items: start;
  padding: 2.4rem 0;
  border-top: 1px solid var(--line);
}

.tt-aesthetic--reverse {
  grid-template-columns: 1fr 1.4fr;
}

.tt-aesthetic--reverse .tt-aesthetic-visual {
  order: 2;
}

.tt-aesthetic-number {
  margin: 0 0 0.4rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--tt-accent);
}

.tt-aesthetic-name {
  margin: 0 0 0.35rem;
  font-size: clamp(1.5rem, 2.4vw, 1.85rem);
  font-weight: 500;
  letter-spacing: var(--track-display);
}

.tt-aesthetic-internal {
  margin: 0 0 1.4rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  color: var(--muted);
}

.tt-aesthetic-meta-label {
  margin: 1.4rem 0 0.5rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border-left: 2px solid var(--tt-accent);
  padding-left: 0.55rem;
}

.tt-aesthetic-palette {
  display: grid;
  gap: 0.45rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.tt-aesthetic-palette li {
  display: grid;
  grid-template-columns: 1.6rem 1fr;
  gap: 0.7rem;
  align-items: center;
}

.tt-aesthetic-palette li span:first-child {
  display: block;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 0.25rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.tt-aesthetic-palette-label {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  color: var(--foreground);
}

.tt-aesthetic-palette-hex {
  color: var(--muted);
}

.tt-aesthetic-anchor figcaption {
  margin-top: 0.4rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.7rem;
  letter-spacing: 0.05em;
  color: var(--muted);
}

.tt-aesthetic-feedback {
  margin: 0;
  padding: 0.85rem 1rem;
  border-left: 3px solid var(--tt-accent);
  background: var(--surface);
  border-radius: 0 0.35rem 0.35rem 0;
  font-size: 0.95rem;
  font-style: italic;
  line-height: 1.45;
}

@media (max-width: 768px) {
  .tt-aesthetic,
  .tt-aesthetic--reverse {
    grid-template-columns: 1fr;
    gap: 1.4rem;
  }
  .tt-aesthetic--reverse .tt-aesthetic-visual {
    order: 0;
  }
}
```

- [ ] **Step 10.3: Render the three cards in the page**

After Section 03 in `page.tsx`:

```tsx
      <section className="tt-aesthetics-section" aria-labelledby="tt-aesthetics">
        <h2 id="tt-aesthetics" className="tt-section-heading">Three aesthetics.</h2>
        <p className="tt-section-lede">
          These were my internal working names while I built. The team used
          them to talk about the templates day-to-day; vendors who adopted
          the templates likely saw a different label downstream.
        </p>

        <AestheticShowcaseCard
          number="01"
          name="High-saturation joy"
          internalLabel="#DopamineDressing"
          accentHex="#FF5576"
          accentInk="#141414"
          palette={[
            { hex: "#1323C2", label: "Medium Blue" },
            { hex: "#74F0ED", label: "Electric Blue" },
            { hex: "#FF5576", label: "Bright Pink" },
          ]}
          anchor={{
            src: "/projects/tiktok/mood-70s-psychedelia.png",
            alt: "70s psychedelic reference imagery",
            caption: "70s psychedelia — fluid forms, bold patterning.",
          }}
          feedback="Continue incorporating TikTok's brand guidelines and brand copy."
          hero={{
            src: "/projects/tiktok/template-dopamine-hifi.png",
            alt: "Dopamine Dressing high-fidelity template",
          }}
          final={{
            src: "/projects/tiktok/template-dopamine-final.png",
            alt: "Dopamine Dressing final template",
          }}
        />

        <AestheticShowcaseCard
          number="02"
          name="Edge and texture"
          internalLabel="#e-Boy / #e-Girl"
          accentHex="#313539"
          accentInk="#F4F4F4"
          reverse
          palette={[
            { hex: "#141414", label: "Night" },
            { hex: "#313539", label: "Onyx" },
            { hex: "#6F7172", label: "Dim Gray" },
          ]}
          anchor={{
            src: "/projects/tiktok/mood-punk-magazine.png",
            alt: "Grungy punk magazine reference",
            caption: "Grungy punk magazine — texture, distress, dimension.",
          }}
          feedback="Continue working on the design, but note that the aesthetic deviates from what TikTok is known for. Use dimension and texture to elevate it."
          hero={{
            src: "/projects/tiktok/template-eboy-hifi.png",
            alt: "E-Boy / E-Girl high-fidelity template",
          }}
          final={{
            src: "/projects/tiktok/template-eboy-final.png",
            alt: "E-Boy / E-Girl final template",
          }}
        />

        <AestheticShowcaseCard
          number="03"
          name="Quiet and considered"
          internalLabel="#LightAcademia"
          accentHex="#EDC4AC"
          accentInk="#141414"
          palette={[
            { hex: "#141414", label: "Night" },
            { hex: "#EDC4AC", label: "Desert Sand" },
            { hex: "#F7F7F7", label: "Seasalt" },
          ]}
          anchor={{
            src: "/projects/tiktok/mood-acne-studios.png",
            alt: "Acne Studios pastel reference",
            caption: "Acne Studios pastels — clean, restrained, anchored.",
          }}
          feedback="Lean into TikTok's upbeat tone. Consider how simplicity can strengthen a design."
          hero={{
            src: "/projects/tiktok/template-light-academia-hifi.png",
            alt: "Light Academia high-fidelity template",
          }}
          final={{
            src: "/projects/tiktok/template-light-academia-final.png",
            alt: "Light Academia final template",
          }}
        />
      </section>
```

Import `AestheticShowcaseCard` at top.

- [ ] **Step 10.4: Add section heading CSS**

Append to `globals.css`:

```css
.tt-aesthetics-section {
  margin-top: 4rem;
}

.tt-section-heading {
  margin: 0 0 0.55rem;
  font-size: clamp(1.7rem, 3vw, 2.5rem);
  font-weight: 500;
  line-height: 1.16;
  letter-spacing: var(--track-display);
}

.tt-section-lede {
  margin: 0 0 2rem;
  max-width: 60ch;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.55;
}
```

- [ ] **Step 10.5: Verify**

`npx tsc --noEmit` clean. Each card renders with its accent color in the eyebrow, palette border-left, and feedback bar. Second card reverses orientation. Mobile collapses to single column.

- [ ] **Step 10.6: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add Section 04 — Three aesthetics showcase cards"
```

---

## Task 11: Section 05 — American Eagle outcome card

**Files:**
- Modify: `src/components/tiktok-dsa.tsx`
- Modify: `src/app/globals.css`
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 11.1: Add the AEOutcomeCard component**

Append to `src/components/tiktok-dsa.tsx`:

```tsx
export function AEOutcomeCard() {
  return (
    <div className="tt-outcome">
      <div className="tt-outcome-text">
        <p className="tt-outcome-label">What shipped</p>
        <p className="tt-outcome-headline">
          American Eagle adopted the Light Academia template.
        </p>
        <p className="tt-outcome-sub">Shipped via TikTok DSA, 2021.</p>
      </div>
      <div className="tt-outcome-image">
        <ExpandableImage
          src="/projects/tiktok/template-light-academia-final.png"
          alt="Light Academia template — the version American Eagle adopted"
          width={1600}
          height={900}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 11.2: Add outcome CSS**

Append to `globals.css`:

```css
.tt-outcome {
  margin: 2.4rem 0;
  padding: 2.2rem 2.4rem;
  background: #EDC4AC;
  color: #141414;
  border-radius: 0.8rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  opacity: 0;
  transform: scale(0.985);
}

.tt-outcome.is-revealed {
  opacity: 1;
  transform: scale(1);
  transition: opacity 360ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}

@media (prefers-reduced-motion: reduce) {
  .tt-outcome {
    opacity: 1;
    transform: none;
    transition: none;
  }
}

.tt-outcome-label {
  margin: 0 0 0.85rem;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #141414;
  opacity: 0.7;
}

.tt-outcome-headline {
  margin: 0 0 0.6rem;
  font-size: clamp(1.4rem, 2.6vw, 2rem);
  line-height: 1.18;
  font-weight: 500;
  letter-spacing: var(--track-display);
  text-wrap: balance;
}

.tt-outcome-sub {
  margin: 0;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.78rem;
  letter-spacing: 0.06em;
  color: #141414;
  opacity: 0.7;
}

@media (max-width: 768px) {
  .tt-outcome {
    grid-template-columns: 1fr;
    padding: 1.6rem 1.4rem;
  }
}
```

- [ ] **Step 11.3: Wire the IntersectionObserver-based reveal**

Convert `AEOutcomeCard` to a client component:

Replace the export with:

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function AEOutcomeCard() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`tt-outcome ${revealed ? "is-revealed" : ""}`}>
      <div className="tt-outcome-text">
        <p className="tt-outcome-label">What shipped</p>
        <p className="tt-outcome-headline">
          American Eagle adopted the Light Academia template.
        </p>
        <p className="tt-outcome-sub">Shipped via TikTok DSA, 2021.</p>
      </div>
      <div className="tt-outcome-image">
        <ExpandableImage
          src="/projects/tiktok/template-light-academia-final.png"
          alt="Light Academia template — the version American Eagle adopted"
          width={1600}
          height={900}
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 11.4: Add the section to the page**

After Section 04 in `page.tsx`:

```tsx
      <section className="project-section tt-section" aria-labelledby="tt-shipped">
        <h2 id="tt-shipped" className="sr-only">What shipped</h2>
        <AEOutcomeCard />
      </section>
```

Import `AEOutcomeCard` at top.

- [ ] **Step 11.5: Verify**

Scroll to the section — card fades and scales in on viewport enter. Reduced-motion: appears static.

- [ ] **Step 11.6: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add Section 05 — American Eagle outcome card"
```

---

## Task 12: Section 06 — Honest scope + lineage timeline

**Files:**
- Modify: `src/components/tiktok-dsa.tsx` (add `LineageTimeline`)
- Modify: `src/app/globals.css`
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 12.1: Add the LineageTimeline component**

Append to `src/components/tiktok-dsa.tsx`:

```tsx
export function LineageTimeline() {
  return (
    <figure className="tt-lineage" aria-label="DSA to Smart+ Catalog Ads timeline">
      <svg
        viewBox="0 0 900 220"
        xmlns="http://www.w3.org/2000/svg"
        className="tt-lineage-svg"
        role="img"
        aria-label="Timeline: 2021 DSA launches, 2023 migration to Video Shopping Ads, 2026 Smart+ Catalog Ads."
      >
        <line x1="60" y1="110" x2="840" y2="110"
          stroke="currentColor" strokeWidth="1" opacity="0.4" />

        <g fill="currentColor">
          <circle cx="120" cy="110" r="6" />
          <circle cx="450" cy="110" r="6" />
          <circle cx="780" cy="110" r="6" />
        </g>

        <g fontFamily="var(--font-mono)" fontSize="11" fill="currentColor"
           textAnchor="middle">
          <text x="120" y="85" opacity="0.7">2021</text>
          <text x="450" y="85" opacity="0.7">2023</text>
          <text x="780" y="85" opacity="0.7">2026</text>
        </g>

        <g fontSize="13" fill="currentColor" textAnchor="middle">
          <text x="120" y="148" fontWeight="500">DSA launches</text>
          <text x="120" y="168" fontSize="11" opacity="0.7">
            30+ templates in the launch generation
          </text>

          <text x="450" y="148" fontWeight="500">Migration</text>
          <text x="450" y="168" fontSize="11" opacity="0.7">
            Mechanics move into Video Shopping Ads
          </text>

          <text x="780" y="148" fontWeight="500">Smart+ Catalog Ads</text>
          <text x="780" y="168" fontSize="11" opacity="0.7">
            The modular-template logic continues
          </text>
        </g>
      </svg>
    </figure>
  );
}
```

- [ ] **Step 12.2: Add lineage CSS**

Append to `globals.css`:

```css
.tt-lineage {
  margin: 2rem 0 1.2rem;
  padding: 1.5rem 1.2rem;
  border: 1px solid var(--line);
  border-radius: 0.7rem;
  background: var(--surface);
  color: var(--foreground);
}

.tt-lineage-svg {
  width: 100%;
  height: auto;
  display: block;
  min-width: 600px;
}

@media (max-width: 640px) {
  .tt-lineage {
    overflow-x: auto;
  }
}
```

- [ ] **Step 12.3: Add the section to the page**

After Section 05:

```tsx
      <section className="project-section tt-section tt-section--wide" aria-labelledby="tt-scope">
        <h2 id="tt-scope">Honest scope.</h2>
        <div className="project-section-body">
          <p>
            The Dynamic Showcase Ads format itself was deprecated on April 3,
            2023. Its mechanics migrated into Video Shopping Ads, and the
            modular-template-from-catalog logic continues today as Smart+
            Catalog Ads. The work I did sat in the launch generation of 30+
            templates; I can&apos;t claim a causal line from my contribution
            to where the format went after.
          </p>
          <p>
            Naming what I don&apos;t know is part of the case study&apos;s
            stance: I was an intern, the work shipped during the format&apos;s
            early window, and one of the templates found a brand. That&apos;s
            the disclosure.
          </p>
        </div>

        <LineageTimeline />
      </section>
```

Import `LineageTimeline` at top.

- [ ] **Step 12.4: Verify**

Timeline renders. On mobile, horizontally scrolls without breaking layout.

- [ ] **Step 12.5: Commit**

```bash
git add src/components/tiktok-dsa.tsx src/app/globals.css src/app/work/tiktok/page.tsx
git commit -m "Add Section 06 — Honest scope + lineage timeline"
```

---

## Task 13: Section 07 — Retrospective

**Files:**
- Modify: `src/app/work/tiktok/page.tsx`

- [ ] **Step 13.1: Add the section**

After Section 06:

```tsx
      <section className="project-section tt-section" aria-labelledby="tt-retro">
        <h2 id="tt-retro">A visual brief that was secretly a product brief.</h2>
        <div className="project-section-body">
          <p>
            I went into this as a Visual Designer. The work the project
            actually asked for was different. Research that defined the
            audience taxonomy. Scope decisions that narrowed five subcultures
            into three buckets the team could build against. A slot system
            that made the templates modular instead of single-shot. A craft
            stance that protected TikTok&apos;s brand chrome while letting
            three aesthetic registers breathe.
          </p>
          <p>
            None of those were what my title described. All of them were what
            the project needed. The realization arrived in the build, not the
            brief — that the visual work was the delivery vehicle for
            product-level decisions about systems, constraints, and audience.
            That recognition was the thing I left the internship with. The
            title caught up later.
          </p>
        </div>
      </section>
```

- [ ] **Step 13.2: Voice review**

Read aloud, tighten anything that sounds off-voice. Aphorisms (e.g., "the visual was the product") can creep in; favor plain Myles register.

- [ ] **Step 13.3: Commit**

```bash
git add src/app/work/tiktok/page.tsx
git commit -m "Add Section 07 — Retrospective"
```

---

## Task 14: Generate homepage cover image

**Files:**
- Create: `public/projects/tiktok/cover.png`

- [ ] **Step 14.1: Choose composition**

Open Figma (or equivalent), create a 2048×1365 landscape canvas. Drop the three template mockups in the same fanned arrangement as the hero. Light Academia in front, others tilted behind. TikTok cyan/magenta accent micro-touches at the edges (small, restrained).

- [ ] **Step 14.2: Export and place**

Export as `cover.png` to `/Users/mylesashitey/myles-portfolio-migration/public/projects/tiktok/cover.png`.

- [ ] **Step 14.3: Verify**

Load homepage, the TikTok project card shows the cover.

- [ ] **Step 14.4: Commit**

```bash
git add public/projects/tiktok/cover.png
git commit -m "Add TikTok homepage cover image"
```

---

## Task 15: Final visual verification + responsive pass

**Files:** none directly, all dev-server verification.

- [ ] **Step 15.1: Start the dev server**

```bash
cd /Users/mylesashitey/myles-portfolio-migration
npm run dev
```

- [ ] **Step 15.2: Walk the full page at desktop width**

Visit `http://localhost:3000/work/tiktok`. Confirm:
- Animated TikTok logo loops in eyebrow
- Hero stack parallax responds to cursor
- TOC sticky, scroll-spy active
- All 7 sections render in order
- System overview band swatches reveal hex on hover
- Template anatomy slot hover swaps thumbnails beneath
- Three aesthetic cards alternate orientation
- AE outcome card fades + scales in on viewport enter
- Lineage timeline renders
- ProjectWorkJump at bottom shows prev/next

- [ ] **Step 15.3: Resize to mobile (375px)**

Confirm:
- Hero stack scales reasonably
- All grids collapse to single column
- TOC moves to top-of-content or hides per existing ProjectToc behavior
- Lineage timeline scrolls horizontally without breaking layout
- AE outcome card stacks text above image

- [ ] **Step 15.4: Toggle dark mode**

Confirm:
- Animated logo readable in dark (cyan/magenta on dark background)
- Diagram text fills `currentColor` so it reads on both themes
- AE outcome card's hard-coded `#EDC4AC` background still reads with `#141414` text (the contrast is high enough for AA regardless of theme)

- [ ] **Step 15.5: Toggle reduced motion (system pref)**

Confirm:
- Logo drift stops
- Hero stack parallax stops
- AE outcome card appears static, no scale-in
- Anatomy slot hover still works (it's not motion-gated)

- [ ] **Step 15.6: Run final type check**

```bash
npx tsc --noEmit
```

- [ ] **Step 15.7: If any fixes were needed, commit them**

```bash
git add -p
git commit -m "Polish: responsive + reduced-motion + dark-mode fixes"
```

---

## Task 16: Push the branch and open PR

- [ ] **Step 16.1: Push the feature branch**

```bash
git push -u origin case-study/tiktok-dsa
```

- [ ] **Step 16.2: Open PR**

```bash
gh pr create --title "Add TikTok Dynamic Showcase Ads case study" --body "$(cat <<'EOF'
## Summary
- Full case study at /work/tiktok matching the depth and voice of Fresh Greens
- Animated TikTok logo in the eyebrow (cyan/magenta channel drift, reduced-motion respected)
- Layered template-stack hero with cursor parallax
- Four custom interactive artifacts: system overview band, template anatomy diagram (slot-hover modularity demo), American Eagle outcome card with scroll-triggered entrance, DSA→Smart+ Catalog Ads lineage timeline
- B→C narrative arc preserved: subculture-led modularity (the brief) surfacing product thinking (the realization)
- Homepage card included with landscape cover composition

## Test plan
- [ ] Visit /work/tiktok at desktop width; confirm all 7 sections render
- [ ] Confirm hero parallax responds to cursor and stops under reduced motion
- [ ] Confirm anatomy diagram slot hover swaps thumbnails beneath
- [ ] Confirm AE outcome card scale-in fires on viewport enter
- [ ] Resize to mobile (375px); confirm all grids collapse and lineage scrolls horizontally
- [ ] Toggle dark mode; confirm diagram text and animated logo read correctly
- [ ] Toggle reduced motion; confirm all decorative animations suppress

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

### Spec coverage check
- [x] §3 Page architecture (TOC, meta) → Tasks 2, 5
- [x] §4 Section-by-section → Tasks 6, 8, 9, 10, 11, 12, 13
- [x] §5.1 System overview band → Task 7
- [x] §5.2 Template anatomy diagram → Task 9
- [x] §5.3 Three aesthetic cards → Task 10
- [x] §5.4 AE outcome card → Task 11
- [x] §5.5 Lineage timeline → Task 12
- [x] §6 Motion (logo, parallax, palette hover, accent scoping, AE entrance, lightbox, reduced motion) → Tasks 3, 4, 7, 10, 11
- [x] §7 Hero treatment → Task 4
- [x] §8 Assets → Task 1
- [x] §9 Voice notes → embedded in section task copy + voice review steps
- [x] §10 Implementation notes → Tasks 2 (route + content frontmatter), all components in `tiktok-dsa.tsx`
- [x] §11 Open questions → flagged as Task 9.5 fallback (slot thumbs) and Task 14 (cover composition)
- [x] §12 Out of scope → respected (no faux feed, no video embeds)

### Placeholder scan
- Task 1 Step 1.4 includes Myles-manual asset renaming — this is intentional, not a placeholder.
- Task 9 Step 9.1 assumes slot-crop images exist; Step 9.5 specifies the static fallback if they don't. This is a documented branch, not a placeholder.
- Task 14 cover image is a manual Figma step. Acceptable — the alternative is generating a programmatic cover which would be out of place for a designer's portfolio.

### Type consistency
- `AestheticShowcaseCard` props consistent (`number`, `name`, `internalLabel`, `accentHex`, `accentInk`, `palette`, `anchor`, `feedback`, `hero`, `final`, `reverse?`)
- `Swatch` type reused (hex + label)
- `SlotKey` consistent across map and component
- All asset paths use `/projects/tiktok/...` convention

### Implementation order rationale
Asset acquisition first (Task 1) → scaffold structure second (Task 2) → eyebrow logo (Task 3) and hero (Task 4) because these are the highest-risk visual moments → sections in narrative order (Tasks 5–13) → cover + verification (Tasks 14–15) → ship (Task 16).
