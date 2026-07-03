// Co-located components for the Fresh Greens case study.
// Kept in one file because these pieces are specific to that page; lifting
// them into the global component directory would imply reusability they
// don't have.

import type { ReactNode } from "react";
import { DrawOnView } from "@/components/draw-on-view";

/* ──────────────────────────────────────────
   Phone frame
   Real device chrome (notch, rounded bezel),
   takes either a child illustration or an image element.
   Aspect approximates iPhone (~9:19.5).
   ────────────────────────────────────────── */

type PhoneFrameProps = {
  children: ReactNode;
  variant?: "default" | "dark" | "screenshot";
};

export function PhoneFrame({ children, variant = "default" }: PhoneFrameProps) {
  return (
    <div className={`fg-phone fg-phone--${variant}`} role="group">
      <div className="fg-phone-bezel">
        {variant !== "screenshot" ? <span className="fg-phone-notch" aria-hidden="true" /> : null}
        <div className="fg-phone-screen">{children}</div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Hero device illustration — the route preview
   with the daylight gradient + "Along this route" briefing.
   Placeholder-real: CSS draws the screen so it looks
   intentional now and a real screenshot drops in cleanly later.
   ────────────────────────────────────────── */

export function HeroRouteIllustration() {
  return (
    <div className="fg-route-screen">
      <div className="fg-route-status">
        <span>9:41</span>
        <span className="fg-route-status-right">▮▮▮▮ ▼</span>
      </div>

      <div className="fg-route-map">
        <svg
          viewBox="0 0 300 380"
          xmlns="http://www.w3.org/2000/svg"
          className="fg-route-svg"
          aria-hidden="true"
        >
          {/* Street grid */}
          <g stroke="rgba(255,255,255,0.07)" strokeWidth="1">
            <line x1="0" y1="60" x2="300" y2="60" />
            <line x1="0" y1="140" x2="300" y2="140" />
            <line x1="0" y1="220" x2="300" y2="220" />
            <line x1="0" y1="300" x2="300" y2="300" />
            <line x1="60" y1="0" x2="60" y2="380" />
            <line x1="140" y1="0" x2="140" y2="380" />
            <line x1="220" y1="0" x2="220" y2="380" />
          </g>

          {/* The daylight-graded route polyline.
              4 segments: solid day (orange) → twilight dash → twilight dot → night dot */}
          <g fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M40 340 L40 280 L100 280 L100 220" stroke="#f6a86b" />
            <path
              d="M100 220 L160 220 L160 160"
              stroke="#c87a8a"
              strokeDasharray="9 6"
            />
            <path
              d="M160 160 L220 160 L220 100"
              stroke="#7d6ba8"
              strokeDasharray="2 6"
            />
            <path
              d="M220 100 L260 100 L260 40"
              stroke="#4a4280"
              strokeDasharray="2 6"
            />
          </g>

          {/* Start + end pins */}
          <circle cx="40" cy="340" r="6" fill="#f4f4f4" />
          <circle cx="40" cy="340" r="3" fill="#0a0a0a" />
          <circle cx="260" cy="40" r="6" fill="#4a4280" />
          <circle cx="260" cy="40" r="3" fill="#f4f4f4" />
        </svg>
      </div>

      <div className="fg-route-briefing">
        <p className="fg-route-briefing-label">Along this route</p>
        <ul className="fg-route-chips">
          <li className="fg-chip fg-chip--ok">All clear · lit corridor</li>
          <li className="fg-chip fg-chip--hazard">2 unlit segments</li>
          <li className="fg-chip fg-chip--info">Arrive 14m after dusk</li>
        </ul>
        <button className="fg-route-go" type="button" tabIndex={-1}>
          Start
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   Three-layer architecture diagram
   Inline SVG. The diagram earns its place: it makes the
   "auditable public data" stance literal.
   ────────────────────────────────────────── */

export function ArchitectureDiagram() {
  return (
    <figure className="fg-arch">
      <div className="fg-arch-scroll">
      <DrawOnView>
      <svg
        viewBox="0 0 1250 420"
        xmlns="http://www.w3.org/2000/svg"
        className="fg-arch-svg"
        role="img"
        aria-label="Three-layer architecture: eight public data sources feed an adapter layer, which feeds a deterministic scoring layer, which feeds the screen layer. Community reports are one of the eight sources, authenticated with an anonymous device UUID and stored in Postgres under row-level security, the same data routed to the moderation queue."
      >
        <defs>
          <marker
            id="fg-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Source labels — top row, 7 columns, smaller subtitle */}
        <g className="fg-arch-sources" fontFamily="var(--font-mono)" fontSize="11" fill="currentColor">
          <text x="30" y="32">OpenStreetMap</text>
          <text x="30" y="50" fontSize="10" opacity="0.62">lighting · landuse · parks</text>

          <text x="215" y="32">OSRM</text>
          <text x="215" y="50" fontSize="10" opacity="0.62">route geometry</text>

          <text x="325" y="32">SunCalc</text>
          <text x="325" y="50" fontSize="10" opacity="0.62">solar geometry</text>

          <text x="435" y="32">Mapbox Search</text>
          <text x="435" y="50" fontSize="10" opacity="0.62">destinations</text>

          <text x="550" y="32">DOT-511</text>
          <text x="550" y="50" fontSize="10" opacity="0.62">state traffic feeds</text>

          <text x="690" y="32">Mapbox incidents</text>
          <text x="690" y="50" fontSize="10" opacity="0.62">driving-traffic events</text>

          <text x="850" y="32">Open-Meteo</text>
          <text x="850" y="50" fontSize="10" opacity="0.62">weather + visibility</text>

          <text x="1000" y="32">Community reports</text>
          <text x="1000" y="50" fontSize="10" opacity="0.62">anon device-UUID · Postgres + RLS</text>
        </g>

        {/* Arrows from sources into the adapter layer */}
        <g data-draw stroke="currentColor" strokeWidth="1" fill="none" markerEnd="url(#fg-arrow)" opacity="0.45">
          <line x1="100" y1="64" x2="100" y2="100" />
          <line x1="250" y1="64" x2="250" y2="100" />
          <line x1="360" y1="64" x2="360" y2="100" />
          <line x1="475" y1="64" x2="475" y2="100" />
          <line x1="600" y1="64" x2="600" y2="100" />
          <line x1="750" y1="64" x2="750" y2="100" />
          <line x1="900" y1="64" x2="900" y2="100" />
          <line x1="1060" y1="64" x2="1060" y2="100" />
        </g>

        {/* Adapter layer */}
        <g fill="currentColor">
          <rect
            x="30"
            y="105"
            width="1190"
            height="68"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <text x="48" y="128" fontSize="11" fontFamily="var(--font-mono)" opacity="0.65">
            Adapter layer
          </text>
          <text x="48" y="155" fontSize="14" fontWeight="500">
            Typed contracts. Each source speaks one shape.
          </text>
        </g>

        {/* Arrow adapter → scoring */}
        <g
          data-draw
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          markerEnd="url(#fg-arrow)"
          opacity="0.65"
        >
          <line x1="625" y1="175" x2="625" y2="208" />
        </g>

        {/* Scoring layer — the highlight */}
        <g fill="currentColor">
          <rect
            x="30"
            y="213"
            width="1190"
            height="78"
            rx="6"
            fill="var(--fg-accent-soft)"
            stroke="var(--fg-accent)"
            strokeWidth="1.4"
          />
          <text
            x="48"
            y="236"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill="var(--fg-accent)"
          >
            Scoring layer
          </text>
          <text x="48" y="263" fontSize="14" fontWeight="500">
            Pure deterministic function.
          </text>
          <text x="48" y="282" fontSize="12" opacity="0.7">
            Same inputs → same routing decision. Reproducible. Inspectable.
          </text>
        </g>

        {/* Arrow scoring → screen */}
        <g
          data-draw
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          markerEnd="url(#fg-arrow)"
          opacity="0.65"
        >
          <line x1="625" y1="293" x2="625" y2="326" />
        </g>

        {/* Screen layer */}
        <g fill="currentColor">
          <rect
            x="30"
            y="331"
            width="1190"
            height="68"
            rx="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.5"
          />
          <text x="48" y="354" fontSize="11" fontFamily="var(--font-mono)" opacity="0.65">
            Screen layer
          </text>
          <text x="48" y="381" fontSize="14" fontWeight="500">
            Renders the result. Does not invent it.
          </text>
        </g>
      </svg>
      </DrawOnView>
      </div>
      <figcaption className="fg-arch-caption">
        Eight public data sources feed an adapter, a deterministic scoring layer,
        then the screen. Community reports are one source, authenticated with an
        anonymous device UUID and held in Postgres under row-level security, the
        same data routed to the moderation queue.
        <span className="fg-arch-scrollhint"> Scroll the diagram to read it all.</span>
      </figcaption>
    </figure>
  );
}

/* ──────────────────────────────────────────
   Process knowledge graph
   Three knowledge sources merge into one queryable memory.
   Deliberately echoes the architecture diagram above —
   same wrapper, same mono labels, same accent-highlighted
   central node — so the "medium echoes the message" claim
   in the prose lands visually too.
   ────────────────────────────────────────── */

export function ProcessGraph() {
  return (
    <figure className="fg-arch fg-arch--process">
      <div className="fg-arch-scroll">
      <DrawOnView>
      <svg
        viewBox="0 0 720 280"
        xmlns="http://www.w3.org/2000/svg"
        className="fg-arch-svg"
        role="img"
        aria-label="Three knowledge sources (the codebase, the running log of design conversations, and the thesis document) merge into one queryable memory called graphify, so any decision in the build stays reconstructible."
      >
        <defs>
          <marker
            id="fg-process-arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>

        {/* Source labels — top row, three columns with smaller subtitle */}
        <g
          className="fg-arch-sources"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="currentColor"
        >
          <text x="40" y="30">codebase</text>
          <text x="40" y="48" fontSize="12" opacity="0.62">
            the running source
          </text>

          <text x="265" y="30">design conversations</text>
          <text x="265" y="48" fontSize="12" opacity="0.62">
            every back-and-forth, indexed
          </text>

          <text x="520" y="30">thesis document</text>
          <text x="520" y="48" fontSize="12" opacity="0.62">
            the underlying claim
          </text>
        </g>

        {/* Three converging arrows — left and right curve inward,
            center drops straight */}
        <g
          data-draw
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          markerEnd="url(#fg-process-arrow)"
          opacity="0.5"
        >
          <path d="M95 62 Q 95 112 235 142" />
          <line x1="360" y1="62" x2="360" y2="145" />
          <path d="M625 62 Q 625 112 485 142" />
        </g>

        {/* graphify — highlighted central node (the merged memory) */}
        <g fill="currentColor">
          <rect
            x="30"
            y="150"
            width="660"
            height="74"
            rx="6"
            fill="var(--fg-accent-soft)"
            stroke="var(--fg-accent)"
            strokeWidth="1.4"
          />
          <text
            x="48"
            y="173"
            fontSize="11"
            fontFamily="var(--font-mono)"
            fill="var(--fg-accent)"
          >
            graphify
          </text>
          <text x="48" y="198" fontSize="14" fontWeight="500">
            One queryable memory.
          </text>
          <text x="48" y="216" fontSize="12" opacity="0.7">
            Every decision indexed across all three sources.
          </text>
        </g>

        {/* Output arrow — single line down to the outcome label */}
        <g
          data-draw
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
          markerEnd="url(#fg-process-arrow)"
          opacity="0.65"
        >
          <line x1="360" y1="226" x2="360" y2="252" />
        </g>

        {/* Outcome — quiet trailing line */}
        <text
          x="360"
          y="274"
          fontSize="12"
          textAnchor="middle"
          fill="currentColor"
          opacity="0.7"
        >
          Any decision, reconstructible.
        </text>
      </svg>
      </DrawOnView>
      </div>
      <figcaption className="fg-arch-caption">
        Codebase, design-conversation log, and thesis merge into one queryable
        memory, so any build decision stays reconstructible.
        <span className="fg-arch-scrollhint"> Scroll the diagram to read it all.</span>
      </figcaption>
    </figure>
  );
}

/* ──────────────────────────────────────────
   Reserved-color signaling chips
   Real swatches with their meaning, not aspirational chips.
   The whole point of the system is that these colors are committed.
   ────────────────────────────────────────── */

const SIGNALS = [
  {
    color: "#2f6b46",
    name: "Green",
    role: "In-flow action",
    note: "Every CTA, link, and secondary action. The only non-reserved color allowed to mean \"go.\"",
  },
  {
    color: "#d24a3b",
    name: "Red",
    role: "Alert",
    note: "SOS, the live recording indicator, form errors, and destructive actions.",
  },
  {
    color: "#f08a4b",
    name: "Orange",
    role: "Hazard · caution",
    note: "Speed-limit zones, the Report affordance, and route-preview hazard chips for police and low-light segments.",
  },
  {
    color: "#e2b340",
    name: "Yellow",
    role: "Caution · favorite",
    note: "General caution, plus the gold star for trusted stations (a documented carve-out from the caution role).",
  },
  {
    color: "#284872",
    name: "Navy",
    role: "Safety-affordance mark",
    note: "The en-route Shield and the /emergency SOS disc. Never used for data state or sync.",
  },
];

export function SignalSwatches() {
  return (
    <ul className="fg-signal-list" role="list">
      {SIGNALS.map((s) => (
        <li key={s.name} className="fg-signal">
          <span
            className="fg-signal-swatch"
            style={{ background: s.color }}
            aria-hidden="true"
          />
          <div className="fg-signal-text">
            <p className="fg-signal-name">
              <span>{s.name}</span>
              <span className="fg-signal-role">{s.role}</span>
            </p>
            <p className="fg-signal-note">{s.note}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ──────────────────────────────────────────
   Daylight dash-pattern legend
   Demonstrates the WCAG 1.4.1 non-color cue.
   ────────────────────────────────────────── */

export function DaylightLegend() {
  return (
    <ul className="fg-legend" role="list">
      <li className="fg-legend-row">
        <svg viewBox="0 0 80 12" className="fg-legend-line" aria-hidden="true">
          <line x1="2" y1="6" x2="78" y2="6" stroke="#f6a86b" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <span className="fg-legend-label">Solid · daylight remaining</span>
      </li>
      <li className="fg-legend-row">
        <svg viewBox="0 0 80 12" className="fg-legend-line" aria-hidden="true">
          <line
            x1="2"
            y1="6"
            x2="78"
            y2="6"
            stroke="#c87a8a"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="9 6"
          />
        </svg>
        <span className="fg-legend-label">Dashed · twilight</span>
      </li>
      <li className="fg-legend-row">
        <svg viewBox="0 0 80 12" className="fg-legend-line" aria-hidden="true">
          <line
            x1="2"
            y1="6"
            x2="78"
            y2="6"
            stroke="#4a4280"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 6"
          />
        </svg>
        <span className="fg-legend-label">Dotted · night</span>
      </li>
    </ul>
  );
}

/* ──────────────────────────────────────────
   Feature card
   Phone frame on top, caption + thesis tag below.
   The placeholder illustration is a CSS abstraction
   that hints at the screen's composition.
   ────────────────────────────────────────── */

type FeatureCardProps = {
  number: string;
  title: string;
  copy: string;
  thesis: string;
  illustration: ReactNode;
};

export function FeatureCard({ number, title, copy, thesis, illustration }: FeatureCardProps) {
  return (
    <article className="fg-feature">
      <PhoneFrame variant="screenshot">{illustration}</PhoneFrame>
      <div className="fg-feature-text">
        <p className="fg-feature-number">{number}</p>
        <h3 className="fg-feature-title">{title}</h3>
        <p className="fg-feature-copy">{copy}</p>
        <p className="fg-feature-thesis">
          <span className="fg-feature-thesis-label">Thesis →</span> {thesis}
        </p>
      </div>
    </article>
  );
}
