"use client";

import { useState } from "react";

const routes = [
  {
    duration: "10 hr 48 min",
    arrival: "Arrive 7:10 PM",
    distance: "708 mi",
    descriptor: "Safest route with current conditions",
    conditions: ["Low light", "Road"],
    daylight: "More daylight near departure",
  },
  {
    duration: "10 hr 42 min",
    arrival: "Arrive 7:04 PM",
    distance: "716 mi",
    descriptor: "6 min faster",
    conditions: ["Community flag", "Wildlife"],
    daylight: "Light fades near arrival",
  },
  {
    duration: "11 hr 03 min",
    arrival: "Arrive 7:25 PM",
    distance: "692 mi",
    descriptor: "15 min longer",
    conditions: ["Police", "Road"],
    daylight: "More of the drive after sunset",
  },
] as const;

export function RouteComparisonEvidence() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const route = routes[selectedIndex];

  return (
    <figure
      className="fg-route-comparison-evidence"
      data-evidence-proof="fresh-greens-route-comparison"
      data-evidence-role="dominant"
      data-evidence-kind="interaction"
      data-evidence-chapter="fg-design"
    >
      <div className="fg-route-proof-heading">
        <p>Implemented route controls</p>
        <h3>Compare the conditions attached to each option.</h3>
      </div>

      <div className="fg-route-proof-card" aria-live="polite">
        <div className="fg-route-proof-controls">
          <button
            type="button"
            aria-label="Previous route"
            disabled={selectedIndex === 0}
            onClick={() => setSelectedIndex((index) => Math.max(0, index - 1))}
          >
            <span aria-hidden="true">←</span>
          </button>
          <span>{selectedIndex + 1} of {routes.length}</span>
          <button
            type="button"
            aria-label="Next route"
            disabled={selectedIndex === routes.length - 1}
            onClick={() =>
              setSelectedIndex((index) => Math.min(routes.length - 1, index + 1))
            }
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <div className="fg-route-proof-summary">
          <div>
            <strong>{route.duration}</strong>
            <span>{route.descriptor}</span>
          </div>
          <dl>
            <div>
              <dt>Arrival</dt>
              <dd>{route.arrival}</dd>
            </div>
            <div>
              <dt>Distance</dt>
              <dd>{route.distance}</dd>
            </div>
          </dl>
        </div>

        <div className="fg-route-proof-chips" aria-label="Conditions on this route">
          {route.conditions.map((condition) => (
            <span key={condition}>{condition}</span>
          ))}
        </div>

        <div className="fg-route-proof-daylight">
          <span aria-hidden="true" />
          <p>{route.daylight}</p>
        </div>
      </div>

      <figcaption>
        Portfolio reconstruction of the implemented pre-drive controls. The
        route values are representative route data.
      </figcaption>
    </figure>
  );
}

export function ReportRouteInfluenceEvidence() {
  return (
    <figure
      className="fg-report-route-evidence"
      data-evidence-proof="fresh-greens-report-route-influence"
      data-evidence-role="dominant"
      data-evidence-kind="sequence"
      data-evidence-chapter="fg-trust"
    >
      <div className="fg-route-proof-heading">
        <p>Implemented route link</p>
        <h3>Show where a community report affected the preview.</h3>
      </div>

      <div className="fg-report-route-sequence">
        <article className="fg-report-route-card fg-report-route-card--report">
          <p className="fg-report-route-step">1. Report detail</p>
          <div className="fg-report-route-icon" aria-hidden="true">!</div>
          <h4>Felt unsafe</h4>
          <p className="fg-report-route-meta">Community report · Near this route</p>
          <p className="fg-report-route-context">
            On your selected route — it counts toward the community flag in
            your preview.
          </p>
        </article>

        <span className="fg-report-route-arrow" aria-hidden="true">→</span>

        <article className="fg-report-route-card fg-report-route-card--preview">
          <p className="fg-report-route-step">2. Route preview</p>
          <div className="fg-report-route-preview-head">
            <strong>10 hr 42 min</strong>
            <span>2 of 3</span>
          </div>
          <p>6 min faster</p>
          <span className="fg-report-route-chip">Community flag</span>
          <svg
            className="fg-report-route-line"
            viewBox="0 0 400 72"
            role="img"
            aria-label="A community report appears 62 percent of the way from the route start to its destination."
          >
            <defs>
              <linearGradient
                id="fg-report-route-gradient"
                x1="16"
                y1="0"
                x2="384"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#f4bd45" />
                <stop offset="0.58" stopColor="#aa725c" />
                <stop offset="1" stopColor="#493d70" />
              </linearGradient>
            </defs>
            <path className="fg-report-route-track" d="M16 36 H384" />
            <circle className="fg-report-route-start" cx="16" cy="36" r="4" />
            <g className="fg-report-route-marker">
              <circle cx="244" cy="36" r="9" />
              <text x="244" y="17" textAnchor="middle">Report</text>
            </g>
            <circle className="fg-report-route-destination" cx="384" cy="36" r="8" />
            <text
              className="fg-report-route-line-label fg-report-route-line-label--start"
              x="16"
              y="64"
            >
              Start
            </text>
            <text
              className="fg-report-route-line-label fg-report-route-line-label--end"
              x="384"
              y="64"
              textAnchor="end"
            >
              Destination
            </text>
          </svg>
        </article>
      </div>

      <figcaption>
        Portfolio reconstruction of the implemented report-to-route link. One
        report can affect ranking in the current prototype. This shows influence,
        not corroboration or proof that a route is safe.
      </figcaption>
    </figure>
  );
}
