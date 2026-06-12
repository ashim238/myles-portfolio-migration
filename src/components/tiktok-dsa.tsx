"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// Co-located components for the TikTok DSA case study.
// One file, one page — these aren't meant to be reused elsewhere.

/* ──────────────────────────────────────────
   Aesthetic data — single source of truth.
   Internal working names; vendors who adopted
   the templates likely saw a different label.
   ────────────────────────────────────────── */

export const AESTHETICS = [
  {
    key: "dopamine",
    name: "High-saturation joy",
    internalLabel: "#DopamineDressing",
    palette: [
      { hex: "#1323C2", label: "Medium Blue" },
      { hex: "#74F0ED", label: "Electric Blue" },
      { hex: "#FF5576", label: "Bright Pink" },
    ],
  },
  {
    key: "eboy",
    name: "Edge and texture",
    internalLabel: "#e-Boy / #e-Girl",
    palette: [
      { hex: "#141414", label: "Night" },
      { hex: "#313539", label: "Onyx" },
      { hex: "#6F7172", label: "Dim Gray" },
    ],
  },
  {
    key: "lightacademia",
    name: "Quiet and considered",
    internalLabel: "#LightAcademia",
    palette: [
      { hex: "#141414", label: "Night" },
      { hex: "#EDC4AC", label: "Desert Sand" },
      { hex: "#F7F7F7", label: "Seasalt" },
    ],
  },
] as const;

/* ──────────────────────────────────────────
   Animated TikTok logo
   Cyan/magenta channel separation drift.
   prefers-reduced-motion: static glyph.
   ────────────────────────────────────────── */

const TIKTOK_PATH =
  "M22.5 6.8c-1.6-0.9-2.6-2.5-2.9-4.3h-3.7v15.1c0 1.9-1.6 3.5-3.5 3.5s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5c0.4 0 0.7 0.1 1 0.2v-3.8c-0.3-0.04-0.7-0.06-1-0.06-4 0-7.2 3.2-7.2 7.2s3.2 7.2 7.2 7.2 7.2-3.2 7.2-7.2v-7.7c1.4 1 3.2 1.6 5.1 1.6v-3.7c-0.9 0-1.8-0.3-2.2-0.6z";

export function TikTokLogo() {
  return (
    <span className="tt-logo" aria-hidden="true">
      <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <g className="tt-logo-cyan">
          <path d={TIKTOK_PATH} />
        </g>
        <g className="tt-logo-magenta">
          <path d={TIKTOK_PATH} />
        </g>
        <g className="tt-logo-ink">
          <path d={TIKTOK_PATH} />
        </g>
      </svg>
    </span>
  );
}

/* ──────────────────────────────────────────
   Hero — photographic three-phones composite
   Subtle cursor-following 3D tilt. The asset
   already shows all three aesthetics at angled
   perspective; we just give it gentle motion.
   ────────────────────────────────────────── */

export function HeroThreePhones() {
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
      const nx = (e.clientX - cx) / rect.width;
      const ny = (e.clientY - cy) / rect.height;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--tt-tilt-x", String(nx));
        el.style.setProperty("--tt-tilt-y", String(ny));
      });
    }
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="tt-hero-stage" aria-hidden="true">
      <div className="tt-hero-tilt">
        <Image
          src="/projects/tiktok/hero-three-phones.png"
          alt="Three iPhones angled in space, each displaying one of the three template aesthetics — Dopamine Dressing, E-Boy/E-Girl, and Light Academia"
          width={1920}
          height={1280}
          priority
          sizes="(max-width: 768px) 92vw, 880px"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   System overview band
   9 swatches in a 3-row by 3-column preview.
   Hex label appears on hover/focus.
   ────────────────────────────────────────── */

/* ──────────────────────────────────────────
   Template anatomy
   The real grid Myles built against — preserved
   as a photographic artifact with original
   measurement annotations.
   ────────────────────────────────────────── */

export function TemplateAnatomy() {
  const SLOTS = [
    { label: "Title zone", note: "Display type, the aesthetic's signature register." },
    { label: "Product catalog grid", note: "The hero image area. Frame treatment swaps per aesthetic." },
    { label: "Supplementary graphics", note: "Ornament zone — high in Dopamine, restrained in Light Academia." },
    { label: "CTA", note: "Standardized TikTok button, accented per aesthetic." },
  ];

  return (
    <figure className="tt-anatomy">
      <div className="tt-anatomy-grid">
        <div className="tt-anatomy-image">
          <Image
            src="/projects/tiktok/anatomy-grid-light-academia.png"
            alt="The 540×960 template grid with pink and cyan measurement annotations — the shared skeleton all three aesthetic templates were built against."
            width={864}
            height={1537}
            sizes="(max-width: 768px) 100vw, 420px"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
        <ol className="tt-anatomy-slots" role="list">
          {SLOTS.map((s, i) => (
            <li key={s.label}>
              <span className="tt-anatomy-slot-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <p className="tt-anatomy-slot-label">{s.label}</p>
                <p className="tt-anatomy-slot-note">{s.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <figcaption>
        540×960 frame. Pink markers in the original file are slot margins;
        cyan markers are the immutable outer boundaries.
      </figcaption>
    </figure>
  );
}

/* ──────────────────────────────────────────
   Aesthetic showcase card
   One per aesthetic. Scoped accent color via
   CSS custom property; rest of the rhythm shared.
   ────────────────────────────────────────── */

import { ExpandableImage } from "@/components/expandable-image";

type Swatch = { hex: string; label: string };

type AestheticShowcaseProps = {
  number: string;
  name: string;
  internalLabel: string;
  accentHex: string;
  palette: readonly Swatch[];
  anchorText: string;
  feedback: string;
  process: { src: string; alt: string };
  feature?: { src: string; alt: string; caption?: string };
  reverse?: boolean;
};

export function AestheticShowcaseCard({
  number, name, internalLabel, accentHex,
  palette, anchorText, feedback, process, feature, reverse,
}: AestheticShowcaseProps) {
  const accentStyle = { "--tt-accent": accentHex } as React.CSSProperties;

  return (
    <article
      className={`tt-aesthetic ${reverse ? "tt-aesthetic--reverse" : ""}`}
      style={accentStyle}
    >
      <div className="tt-aesthetic-visual">
        <ExpandableImage
          src={process.src}
          alt={process.alt}
          width={1600}
          height={900}
          style={{
            width: "100%",
            height: "auto",
            display: "block",
            borderRadius: "0.45rem",
            background: "var(--surface)",
          }}
        />
        {feature ? (
          <figure className="tt-aesthetic-feature">
            <ExpandableImage
              src={feature.src}
              alt={feature.alt}
              width={1200}
              height={1200}
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                borderRadius: "0.45rem",
              }}
            />
            {feature.caption ? <figcaption>{feature.caption}</figcaption> : null}
          </figure>
        ) : null}
      </div>

      <div className="tt-aesthetic-context">
        <p className="tt-aesthetic-number">{number}</p>
        <h3 className="tt-aesthetic-name">{name}</h3>
        <p className="tt-aesthetic-internal">Internal label: {internalLabel}</p>

        <p className="tt-aesthetic-meta-label">Anchor</p>
        <p className="tt-aesthetic-anchor-text">{anchorText}</p>

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

        <p className="tt-aesthetic-meta-label">Feedback received</p>
        <blockquote className="tt-aesthetic-feedback">{feedback}</blockquote>
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────
   American Eagle outcome card
   Scroll-triggered fade + scale entrance.
   prefers-reduced-motion: static.
   ────────────────────────────────────────── */

export function OutcomeCard() {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("tt-outcome--visible");
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("tt-outcome--visible");
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <article ref={ref} className="tt-outcome">
      <div className="tt-outcome-text">
        <p className="tt-outcome-headline">
          American Eagle adopted the Light Academia template.
        </p>
        <p className="tt-outcome-sub">Shipped via TikTok DSA, 2021.</p>
      </div>
      <div className="tt-outcome-image">
        <Image
          src="/projects/tiktok/shipped-light-academia-in-hand.png"
          alt="The Light Academia template shown on a phone held in-hand — the version American Eagle adopted."
          width={1200}
          height={800}
          sizes="(max-width: 768px) 80vw, 320px"
          style={{ width: "100%", height: "auto", display: "block", borderRadius: "0.5rem" }}
        />
      </div>
    </article>
  );
}

/* ──────────────────────────────────────────
   DSA lineage timeline
   Three-node horizontal timeline SVG.
   Matches the Geist Mono + line-only language
   used in the Fresh Greens architecture diagram.
   ────────────────────────────────────────── */

const TIMELINE_NODES = [
  { year: "2021", label: "DSA launches", detail: "30+ templates introduced" },
  { year: "2023", label: "Migration", detail: "Mechanics move to Video Shopping Ads" },
  { year: "2026", label: "Smart+ Catalog Ads", detail: "Modular-template logic continues" },
] as const;

export function LineageTimeline() {
  return (
    <figure className="tt-timeline" aria-label="DSA feature lineage">
      <div className="tt-timeline-track">
        {TIMELINE_NODES.map((n, i) => (
          <div key={n.year} className="tt-timeline-node">
            <span className="tt-timeline-dot" aria-hidden="true" />
            {i < TIMELINE_NODES.length - 1 && (
              <span className="tt-timeline-connector" aria-hidden="true" />
            )}
            <p className="tt-timeline-year">{n.year}</p>
            <p className="tt-timeline-label">{n.label}</p>
            <p className="tt-timeline-detail">{n.detail}</p>
          </div>
        ))}
      </div>
      <figcaption>
        The template-from-catalog mechanic Myles contributed to still ships
        under a different product name today.
      </figcaption>
    </figure>
  );
}

export function SystemOverviewBand() {
  return (
    <figure className="tt-overview" aria-label="Color system across three aesthetics">
      {AESTHETICS.map((a) => (
        <div key={a.key} className="tt-overview-row">
          <p className="tt-overview-label">{a.internalLabel}</p>
          <ul className="tt-overview-swatches" role="list">
            {a.palette.map((p) => (
              <li
                key={p.hex}
                className="tt-overview-swatch"
                tabIndex={0}
                title={`${p.label} · ${p.hex}`}
              >
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
