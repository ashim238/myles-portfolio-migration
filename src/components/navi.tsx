"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NAVI_HEURISTIC_INSIGHTS } from "@/lib/navi-heuristic-data";
import {
  NAVI_HEATMAP_BORDER_REGIONS,
  NAVI_HEATMAP_NEIGHBORHOODS,
  NAVI_HEATMAP_SILHOUETTE,
  NAVI_HEATMAP_VIEWBOX,
} from "@/lib/navi-heatmap-data";
import { NAVI_SURVEY_META, NAVI_SURVEY_STATS } from "@/lib/navi-survey-data";

/* ── Shared reveal helpers ───────────────────────────── */

/* The parent .nv-page element is armed with data-nv-anim-ready once JS
   hydrates. Only then does the CSS gate the reveal state; without the
   attribute, reveal targets stay visible, so headless renders and
   observer-blocked contexts never ship blank sections. One shared
   observer covers every reveal target on the page. */
export function NaviAnimReady() {
  useEffect(() => {
    const page = document.querySelector<HTMLElement>('main.nv-page[data-project-slug="navi"]');
    if (!page) return;
    page.dataset.nvAnimReady = "true";

    const targets = page.querySelectorAll<HTMLElement>(".nv-reveal");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || targets.length === 0) {
      targets.forEach((el) => el.classList.add("nv-reveal--visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("nv-reveal--visible");
            if (entry.target.classList.contains("nv-research-artifacts")) {
              io.unobserve(entry.target);
            }
          } else {
            entry.target.classList.remove("nv-reveal--visible");
          }
        }
      },
      { threshold: 0.2 },
    );
    targets.forEach((el) => io.observe(el));

    return () => {
      io.disconnect();
      delete page.dataset.nvAnimReady;
    };
  }, []);

  return null;
}

/* ── Heuristic insight cards ─────────────────────────── */

export function HeuristicInsightCards() {
  return (
    <ul className="nv-heuristic nv-reveal">
      {NAVI_HEURISTIC_INSIGHTS.map((item, i) => (
        <li
          key={item.id}
          className="nv-heuristic-card"
          style={{ "--nv-stagger": `${i * 80}ms` } as React.CSSProperties}
        >
          <h3>{item.headline}</h3>
          <p>{item.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function SurveyResponseChart() {
  const total = NAVI_SURVEY_META.responseCount;
  return (
    <div className="nv-response-chart" role="group" aria-label="Survey response highlights">
      {NAVI_SURVEY_STATS.map(stat => (
        <figure key={stat.id} className="nv-response-row">
          <figcaption><strong>{stat.label}</strong><span>{stat.caption}</span></figcaption>
          <div className="nv-response-units" aria-hidden="true" style={{gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))`}}>
            {Array.from({length: total}, (_, i) => <i key={i} data-counted={i < stat.count} />)}
          </div>
          <small>{stat.count} of {total} responses</small>
        </figure>
      ))}
    </div>
  );
}

/* ── Composition strip ───────────────────────────────── */

const COMPOSITION_CARDS = [
  { title: "Weekend in Harlem", copy: "Jazz history, local bakeries, and a sunset walk through St. Nicholas Park." },
  { title: "Chinatown food crawl", copy: "Dim sum counters and tea shops, with context beyond star ratings." },
  { title: "LES art walk", copy: "Gallery openings and community murals, timed for quieter weekday mornings." },
] as const;

export function CompositionStrip() {
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = stripRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(max-width: 767px)").matches) return;

    let rect: DOMRect | null = null;
    const readRect = () => {
      rect = el.getBoundingClientRect();
    };
    const onEnter = () => readRect();
    const onMove = (e: MouseEvent) => {
      if (!rect) readRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      el.style.setProperty("--nv-parallax-x", `${x * 6}px`);
    };
    const onLeave = () => {
      rect = null;
      el.style.setProperty("--nv-parallax-x", "0px");
    };
    const onResize = () => {
      rect = null;
    };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="nv-composition nv-reveal">
      <p className="nv-composition-eyebrow">Editorial homepage slice</p>
      <div className="nv-composition-strip">
        <div className="nv-composition-header">
          <h3 className="nv-composition-title">Plan with the neighborhood in view</h3>
          <div className="nv-trust-labels">
            <span className="nv-trust-label">Locally owned</span>
            <span className="nv-trust-label">Nature first</span>
          </div>
          <span className="nv-specimen-label" aria-hidden="true">
            Start exploring
          </span>
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
  "Learn would open with the neighborhood’s history and the context a visitor needs before arriving.";

export function HeatmapExplorer() {
  const [activeId, setActiveId] = useState("");
  const itemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const regionRefs = useRef<Record<string, SVGPathElement | null>>({});
  const listRef = useRef<HTMLUListElement>(null);
  const sorted = [...NAVI_HEATMAP_NEIGHBORHOODS].sort((a, b) => a.name.localeCompare(b.name));
  const activeName = sorted.find((n) => n.id === activeId)?.name ?? null;

  const selectNeighborhood = useCallback((id: string) => {
    setActiveId(id);
  }, []);

  // Both views share one selection. The map has one Tab stop, with arrow keys
  // following the same alphabetical order as the list.
  const handleListKey = useCallback(
    (e: React.KeyboardEvent<Element>, fromMap = false) => {
      const ids = sorted.map((n) => n.id);
      const idx = ids.indexOf(activeId);
      let next = -1;
      if (e.key === "ArrowDown" || (fromMap && e.key === "ArrowRight")) next = idx < 0 ? 0 : Math.min(ids.length - 1, idx + 1);
      else if (e.key === "ArrowUp" || (fromMap && e.key === "ArrowLeft")) next = idx < 0 ? ids.length - 1 : Math.max(0, idx - 1);
      else if (e.key === "Escape") {
        setActiveId("");
        if (fromMap) regionRefs.current[ids[0]]?.focus({ preventScroll: true });
        return;
      }
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = ids.length - 1;
      if (next < 0) return;
      e.preventDefault();
      setActiveId(ids[next]);
      if (fromMap) regionRefs.current[ids[next]]?.focus({ preventScroll: true });
      else itemRefs.current[ids[next]]?.focus();
    },
    [activeId, sorted],
  );

  useEffect(() => {
    if (!activeId) return;
    const btn = itemRefs.current[activeId];
    const list = listRef.current;
    if (!btn || !list) return;
    // Reveal the matching row inside its scroll area without moving the page
    // away from the map, especially when the two views stack on a phone.
    const rowBox = btn.getBoundingClientRect();
    const listBox = list.getBoundingClientRect();
    const delta = rowBox.top < listBox.top ? rowBox.top - listBox.top
      : rowBox.bottom > listBox.bottom ? rowBox.bottom - listBox.bottom : 0;
    if (!delta) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ top: list.scrollTop + delta, behavior: reduced ? "auto" : "smooth" });
  }, [activeId]);

  return (
    <div className="nv-heatmap">
      <ul
        ref={listRef}
        className="nv-heatmap-list"
        aria-label="Manhattan neighborhoods"
        onKeyDown={handleListKey}
      >
        {sorted.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              aria-pressed={activeId === n.id}
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
        <svg
          viewBox={NAVI_HEATMAP_VIEWBOX}
          className="nv-heatmap-map"
          role="group"
          aria-label="Manhattan neighborhood map"
        >
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
                  ref={(el) => { regionRefs.current[r.id] = el; }}
                  role={r.selectable ? "button" : undefined}
                  aria-label={r.selectable ? r.name : undefined}
                  aria-pressed={r.selectable ? isActive : undefined}
                  aria-hidden={r.selectable ? undefined : true}
                  tabIndex={r.selectable ? (isActive || (!activeId && r.id === sorted[0].id) ? 0 : -1) : undefined}
                  onClick={r.selectable ? () => selectNeighborhood(r.id) : undefined}
                  onKeyDown={r.selectable ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      selectNeighborhood(r.id);
                    } else handleListKey(e, true);
                  } : undefined}
                  className={`nv-heatmap-region${r.selectable ? "" : " nv-heatmap-region--context"}${isActive ? " nv-heatmap-region--active" : ""}`}
                >
                  {r.selectable && <title>{r.name}</title>}
                </path>
              );
            })}
          </g>
        </svg>
        <p className="nv-heatmap-map-label" aria-live="polite">
          {activeName ? (
            <>
              <span className="nv-heatmap-map-selection">
                <strong className="nv-heatmap-map-name">{activeName}</strong>
                <span className="nv-heatmap-map-pos">
                  {sorted.findIndex((n) => n.id === activeId) + 1} of {sorted.length}
                </span>
              </span>
              <span className="nv-heatmap-map-context">
                {NAVI_LEARN_CONTEXT}
              </span>
            </>
          ) : (
            `Select a neighborhood on the map or in the list to preview how Learn would frame each of ${sorted.length} neighborhoods.`
          )}
        </p>
      </div>
    </div>
  );
}
