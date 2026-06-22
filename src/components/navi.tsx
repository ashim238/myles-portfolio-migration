"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NAVI_HEURISTIC_INSIGHTS } from "@/lib/navi-heuristic-data";
import {
  NAVI_HEATMAP_BORDER_REGIONS,
  NAVI_HEATMAP_NEIGHBORHOODS,
  NAVI_HEATMAP_SILHOUETTE,
  NAVI_HEATMAP_VIEWBOX,
} from "@/lib/navi-heatmap-data";
import { NAVI_SURVEY_STATS } from "@/lib/navi-survey-data";

/* ── Shared reveal helpers ───────────────────────────── */

function useRevealOnce<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("nv-reveal--visible");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("nv-reveal--visible");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}

/* ── Heuristic insight cards ─────────────────────────── */

export function HeuristicInsightCards() {
  const ref = useRevealOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="nv-heuristic nv-reveal" role="list">
      {NAVI_HEURISTIC_INSIGHTS.map((item, i) => (
        <article
          key={item.id}
          className="nv-heuristic-card"
          style={{ "--nv-stagger": `${i * 80}ms` } as React.CSSProperties}
          role="listitem"
        >
          <span className="nv-heuristic-index" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3>{item.headline}</h3>
          <p>{item.body}</p>
        </article>
      ))}
    </div>
  );
}

/* ── Survey stat rings ───────────────────────────────── */

function SurveyRing({ value, label, caption }: { value: number; label: string; caption: string }) {
  const ref = useRevealOnce<HTMLElement>();
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <figure ref={ref} className="nv-ring nv-reveal">
      <svg viewBox="0 0 140 140" className="nv-ring-svg" aria-hidden="true">
        <circle className="nv-ring-track" cx="70" cy="70" r={radius} />
        <circle
          className="nv-ring-progress"
          cx="70"
          cy="70"
          r={radius}
          style={
            {
              strokeDasharray: circumference,
              strokeDashoffset: offset,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="nv-ring-center">
        <span className="nv-ring-value">{label}</span>
      </div>
      <figcaption className="nv-ring-caption">{caption}</figcaption>
    </figure>
  );
}

export function SurveyStatRings() {
  return (
    <div className="nv-rings" aria-label="Survey response highlights">
      {NAVI_SURVEY_STATS.map((stat) => (
        <SurveyRing
          key={stat.id}
          value={stat.value}
          label={stat.label}
          caption={stat.caption}
        />
      ))}
    </div>
  );
}

/* ── Composition strip ───────────────────────────────── */

const COMPOSITION_CARDS = [
  { title: "Weekend in Harlem", copy: "Jazz history, local bakeries, and a sunset walk through St. Nicholas Park." },
  { title: "Chinatown food crawl", copy: "Dim sum counters and tea shops curated by residents, not star ratings." },
  { title: "LES art walk", copy: "Gallery openings and community murals, timed for quieter weekday mornings." },
] as const;

export function CompositionStrip() {
  const ref = useRevealOnce<HTMLDivElement>();
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      el.style.setProperty("--nv-parallax-x", `${x * 6}px`);
    };
    const onLeave = () => el.style.setProperty("--nv-parallax-x", "0px");

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} className="nv-composition nv-reveal">
      <p className="nv-composition-eyebrow">Editorial homepage slice</p>
      <div className="nv-composition-strip">
        <div className="nv-composition-header">
          <h3 className="nv-composition-title">Plan a trip that gives back</h3>
          <div className="nv-trust-labels">
            <span className="nv-trust-label">Locally owned</span>
            <span className="nv-trust-label">Nature first</span>
          </div>
          <button type="button" className="nv-ui-button nv-ui-button--primary">
            Start exploring
          </button>
        </div>
        <div ref={stripRef} className="nv-composition-cards">
          {COMPOSITION_CARDS.map((card) => (
            <article key={card.title} className="nv-composition-card">
              <h4>{card.title}</h4>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Heatmap explorer ────────────────────────────────── */

const NAVI_LEARN_CONTEXT =
  "Learn would open with its inclusive history and local rhythm, not the same ten default stops.";

export function HeatmapExplorer() {
  const [activeId, setActiveId] = useState("");
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const sorted = [...NAVI_HEATMAP_NEIGHBORHOODS].sort((a, b) => a.name.localeCompare(b.name));
  const activeName = sorted.find((n) => n.id === activeId)?.name ?? null;

  const selectNeighborhood = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  // The list is the sole control; arrow keys rove it like a real listbox.
  const handleListKey = useCallback(
    (e: React.KeyboardEvent<HTMLUListElement>) => {
      const ids = sorted.map((n) => n.id);
      const idx = ids.indexOf(activeId);
      let next = -1;
      if (e.key === "ArrowDown") next = idx < 0 ? 0 : Math.min(ids.length - 1, idx + 1);
      else if (e.key === "ArrowUp") next = idx < 0 ? ids.length - 1 : Math.max(0, idx - 1);
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = ids.length - 1;
      if (next < 0) return;
      e.preventDefault();
      setActiveId(ids[next]);
      itemRefs.current[ids[next]]?.focus();
    },
    [activeId, sorted],
  );

  useEffect(() => {
    if (!activeId) return;
    const btn = itemRefs.current[activeId];
    if (!btn) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    btn.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <div className="nv-heatmap">
      <ul
        className="nv-heatmap-list"
        role="listbox"
        aria-label="Manhattan neighborhoods"
        onKeyDown={handleListKey}
      >
        {sorted.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              role="option"
              aria-selected={activeId === n.id}
              ref={(el) => {
                itemRefs.current[n.id] = el;
              }}
              className={`nv-heatmap-item${activeId === n.id ? " nv-heatmap-item--active" : ""}`}
              onClick={() => selectNeighborhood(n.id)}
            >
              {n.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="nv-heatmap-map-wrap">
        {/* Read-only canvas: the list drives it; the map reflects the choice.
            aria-hidden because the list + the live caption carry the meaning. */}
        <svg viewBox={NAVI_HEATMAP_VIEWBOX} className="nv-heatmap-map" aria-hidden="true">
          <defs>
            <clipPath id="nv-island-clip">
              <path d={NAVI_HEATMAP_SILHOUETTE} />
            </clipPath>
          </defs>
          <path className="nv-heatmap-silhouette" d={NAVI_HEATMAP_SILHOUETTE} />
          <g clipPath="url(#nv-island-clip)">
            {NAVI_HEATMAP_BORDER_REGIONS.map((r) => {
              const isActive = r.selectable && activeId === r.id;
              return (
                <path
                  key={r.id}
                  d={r.path}
                  className={`nv-heatmap-region${r.selectable ? "" : " nv-heatmap-region--context"}${isActive ? " nv-heatmap-region--active" : ""}`}
                />
              );
            })}
          </g>
        </svg>
        <p className="nv-heatmap-map-label" aria-live="polite">
          {activeName ? (
            <>
              <strong className="nv-heatmap-map-name">{activeName}.</strong>{" "}
              {NAVI_LEARN_CONTEXT}
            </>
          ) : (
            "Select a neighborhood to preview how Learn would frame it."
          )}
        </p>
      </div>
    </div>
  );
}
