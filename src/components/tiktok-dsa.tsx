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
