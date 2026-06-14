"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NAVI_HEURISTIC_INSIGHTS } from "@/lib/navi-heuristic-data";
import {
  NAVI_HEATMAP_NEIGHBORHOODS,
  NAVI_HEATMAP_SILHOUETTE,
  NAVI_HEATMAP_VIEWBOX,
} from "@/lib/navi-heatmap-data";
import { NAVI_SURVEY_STATS } from "@/lib/navi-survey-data";
import {
  NAVI_BUTTON_STATES,
  NAVI_BUTTON_VARIANTS,
  NAVI_COLORS,
  NAVI_FORM_STATES,
  NAVI_SPACING,
  NAVI_TAB_INTERACTIONS,
  NAVI_TAB_STATES,
  NAVI_TYPE_SAMPLES,
} from "@/lib/navi-tokens";

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

function useCopyToClipboard() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback((hex: string) => {
    navigator.clipboard.writeText(hex).then(() => {
      setCopied(hex);
      setTimeout(() => setCopied(null), 1400);
    });
  }, []);
  return { copied, copy };
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

/* ── Design system showroom ──────────────────────────── */

function NaviColorSwatches() {
  const { copied, copy } = useCopyToClipboard();
  const colors = Object.entries(NAVI_COLORS);

  return (
    <div className="nv-showroom-block">
      <h3 className="nv-showroom-heading">Color</h3>
      <ul className="nv-swatches" role="list">
        {colors.map(([name, hex]) => (
          <li key={name}>
            <button
              type="button"
              className={`nv-swatch${copied === hex ? " nv-swatch--copied" : ""}`}
              onClick={() => copy(hex)}
              aria-label={`Copy ${name} ${hex}`}
            >
              <span className="nv-swatch-chip" style={{ background: hex }} />
              <span className="nv-swatch-meta">
                <span className="nv-swatch-name">{name}</span>
                <span className="nv-swatch-hex">{copied === hex ? "Copied" : hex}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NaviTypographyGrid() {
  return (
    <div className="nv-showroom-block">
      <h3 className="nv-showroom-heading">Typography</h3>
      <div className="nv-type-grid">
        {NAVI_TYPE_SAMPLES.map((t) => (
          <div key={`${t.family}-${t.label}`} className="nv-type-cell">
            <span className="nv-type-label">
              {t.family} · {t.label}
            </span>
            <p
              className="nv-type-sample"
              style={{
                fontFamily:
                  t.family === "Jost" ? "var(--font-navi-display)" : "var(--font-navi-ui)",
                fontWeight: t.weight,
              }}
            >
              {t.sample}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function NaviSpacingScale() {
  const max = NAVI_SPACING[NAVI_SPACING.length - 1].px;
  return (
    <div className="nv-showroom-block">
      <h3 className="nv-showroom-heading">Spacing</h3>
      <div className="nv-spacing-table" role="table" aria-label="4px spacing scale">
        {NAVI_SPACING.map((row) => (
          <div key={row.token} className="nv-spacing-row" role="row">
            <span className="nv-spacing-token" role="cell">
              {row.token}
            </span>
            <span className="nv-spacing-px" role="cell">
              {row.px}px
            </span>
            <span className="nv-spacing-bar-wrap" role="cell">
              <span
                className="nv-spacing-bar"
                style={{ width: `${(row.px / max) * 100}%` }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShowroomButton({ variant, state }: { variant: string; state: string }) {
  const isDisabled = state === "disabled";
  const className = [
    "nv-ui-button",
    `nv-ui-button--${variant}`,
    state !== "default" ? `nv-ui-button--${state}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={className} disabled={isDisabled} tabIndex={state === "focus" ? 0 : undefined}>
      Explore
    </button>
  );
}

function NaviButtonMatrix() {
  return (
    <div className="nv-showroom-block">
      <h3 className="nv-showroom-heading">Buttons</h3>
      <div className="nv-matrix-scroll">
        <table className="nv-matrix">
          <thead>
            <tr>
              <th scope="col" />
              {NAVI_BUTTON_STATES.map((s) => (
                <th key={s} scope="col">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NAVI_BUTTON_VARIANTS.map((v) => (
              <tr key={v}>
                <th scope="row">{v}</th>
                {NAVI_BUTTON_STATES.map((s) => (
                  <td key={s}>
                    <ShowroomButton variant={v} state={s} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ShowroomTab({
  selected,
  interaction,
}: {
  selected: boolean;
  interaction: string;
}) {
  const disabled = interaction === "disabled";
  const className = [
    "nv-ui-tab",
    selected ? "nv-ui-tab--selected" : "nv-ui-tab--unselected",
    interaction !== "default" ? `nv-ui-tab--${interaction}` : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type="button" className={className} disabled={disabled} role="tab" aria-selected={selected}>
      Neighborhoods
    </button>
  );
}

function NaviTabMatrix() {
  return (
    <div className="nv-showroom-block">
      <h3 className="nv-showroom-heading">Tabs</h3>
      <div className="nv-matrix-scroll">
        <table className="nv-matrix">
          <thead>
            <tr>
              <th scope="col" />
              {NAVI_TAB_INTERACTIONS.map((s) => (
                <th key={s} scope="col">
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NAVI_TAB_STATES.map((selectedState) => (
              <tr key={selectedState}>
                <th scope="row">{selectedState}</th>
                {NAVI_TAB_INTERACTIONS.map((interaction) => (
                  <td key={interaction}>
                    <ShowroomTab
                      selected={selectedState === "selected"}
                      interaction={interaction}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NaviFormSpecimens() {
  return (
    <div className="nv-showroom-block">
      <h3 className="nv-showroom-heading">Form fields</h3>
      <div className="nv-form-grid">
        {NAVI_FORM_STATES.map((state) => (
          <div key={state} className={`nv-form-column nv-form-column--${state}`}>
            <p className="nv-form-state-label">{state}</p>
            <label className="nv-ui-field">
              <span>Email</span>
              <input type="email" defaultValue="you@example.com" readOnly aria-invalid={state === "error"} />
            </label>
            <label className="nv-ui-field">
              <span>Password</span>
              <input type="password" defaultValue="••••••••" readOnly />
            </label>
            <label className="nv-ui-field">
              <span>Neighborhood</span>
              <select defaultValue="harlem" aria-invalid={state === "error"}>
                <option value="harlem">Harlem</option>
                <option value="soho">SoHo</option>
              </select>
            </label>
            <label className="nv-ui-field">
              <span>Notes</span>
              <textarea rows={2} defaultValue="Looking for a quiet morning walk." readOnly />
            </label>
            {state === "error" && <p className="nv-field-message nv-field-message--error">Enter a valid email.</p>}
            {state === "success" && <p className="nv-field-message nv-field-message--success">Saved to your plan.</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DesignSystemShowroom() {
  const ref = useRevealOnce<HTMLDivElement>();

  return (
    <div ref={ref} className="nv-showroom nv-reveal">
      <NaviTypographyGrid />
      <NaviColorSwatches />
      <NaviSpacingScale />
      <NaviButtonMatrix />
      <NaviTabMatrix />
      <NaviFormSpecimens />
    </div>
  );
}

/* ── Composition strip ───────────────────────────────── */

const COMPOSITION_CARDS = [
  { title: "Weekend in Harlem", copy: "Jazz history, local bakeries, and a sunset walk through St. Nicholas Park." },
  { title: "Chinatown food crawl", copy: "Dim sum counters and tea shops curated by residents, not star ratings." },
  { title: "LES art walk", copy: "Gallery openings and community murals — timed for quieter weekday mornings." },
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

export function HeatmapExplorer() {
  const [activeId, setActiveId] = useState(NAVI_HEATMAP_NEIGHBORHOODS[0]?.id ?? "");
  const sorted = [...NAVI_HEATMAP_NEIGHBORHOODS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="nv-heatmap">
      <ul className="nv-heatmap-list" role="listbox" aria-label="Manhattan neighborhoods">
        {sorted.map((n) => (
          <li key={n.id}>
            <button
              type="button"
              role="option"
              aria-selected={activeId === n.id}
              className={`nv-heatmap-item${activeId === n.id ? " nv-heatmap-item--active" : ""}`}
              onClick={() => setActiveId(n.id)}
            >
              {n.name}
            </button>
          </li>
        ))}
      </ul>
      <div className="nv-heatmap-map-wrap">
        <svg viewBox={NAVI_HEATMAP_VIEWBOX} className="nv-heatmap-map" aria-hidden="true">
          <path className="nv-heatmap-silhouette" d={NAVI_HEATMAP_SILHOUETTE} />
          {NAVI_HEATMAP_NEIGHBORHOODS.map((n) => (
            <ellipse
              key={n.id}
              cx={n.cx}
              cy={n.cy}
              rx={n.rx}
              ry={n.ry}
              className={`nv-heatmap-region${activeId === n.id ? " nv-heatmap-region--active" : ""}`}
            />
          ))}
        </svg>
        <p className="nv-heatmap-map-label">
          {sorted.find((n) => n.id === activeId)?.name ?? "Select a neighborhood"}
        </p>
      </div>
    </div>
  );
}
