"use client";

import { useId, useState, type CSSProperties } from "react";
import { loadPersistedWorkstation } from "@/lib/myles-97/persistence";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import "./timing-specimen.css";

// From the Motion foundation in the archived Julius docs, components v0.12.0.
const standard = [0.2, 0, 0.38, 0.9] as const;
const durations = [
  { label: "Fast", value: 150, use: "Arrow turn" },
  { label: "Moderate", value: 240, use: "Menu opening" },
  { label: "Slow", value: 400, use: "Larger expansion" },
];
const curves = [
  { label: "Standard", points: standard },
  { label: "Enter", points: [0, 0, 0.38, 0.9] },
  { label: "Exit", points: [0.2, 0, 1, 0.9] },
];

export function TimingSpecimen() {
  const [view, setView] = useState<"durations" | "curves">("durations");
  const [play, setPlay] = useState(0);
  const [instant, setInstant] = useState(false);
  const systemReduced = usePrefersReducedMotion();
  const id = useId();
  const showingDurations = view === "durations";
  function choose(next: typeof view) {
    if (next === view) return;
    setPlay(0);
    setView(next);
  }
  function replay() {
    setInstant(systemReduced || loadPersistedWorkstation().displayPreferences.reduceMotion);
    setPlay(n => n + 1);
  }

  return <figure className="timing-specimen" aria-labelledby={id + "-title"}>
    <div className="timing-specimen-toolbar">
      <h3 id={id + "-title"}>Try the motion tokens</h3>
      <div role="group" aria-label="Motion tokens to compare">
        <button type="button" aria-pressed={showingDurations} aria-controls={id} onClick={() => choose("durations")}>Durations</button>
        <button type="button" aria-pressed={!showingDurations} aria-controls={id} onClick={() => choose("curves")}>Easing curves</button>
      </div>
    </div>
    <div className="timing-specimen-sheet" id={id} data-instant={instant}>
      <ul role="list" key={view}>
        {durations.map((duration, index) => {
          const curve = curves[index];
          const ms = showingDurations ? duration.value : 400;
          const points = showingDurations ? standard : curve.points;
          return <li key={duration.label} style={{ "--sample-duration": ms + "ms", "--sample-curve": "cubic-bezier(" + points.join(", ") + ")" } as CSSProperties}>
            <div className="timing-specimen-label">
              <strong>{showingDurations ? duration.label : curve.label}</strong>
              <span>{showingDurations ? duration.use : "cubic-bezier(" + points.join(", ") + ")"}</span>
            </div>
            <div className="timing-specimen-track" aria-hidden="true">
              <span key={play} className="timing-specimen-run" data-played={play > 0}><i /></span>
            </div>
            <span className="timing-specimen-value">{showingDurations ? <>{ms}<small> ms</small></> :
              <svg aria-hidden="true" viewBox="0 0 50 30"><path d="M2 2 V28 H48" className="timing-specimen-axis" /><path d={`M2 28 C${2+46*points[0]} ${28-26*points[1]},${2+46*points[2]} ${28-26*points[3]},48 2`} /></svg>}</span>
          </li>;
        })}
      </ul>
      <div className="timing-specimen-foot">
        <button className="reader-control" type="button" onClick={replay}>
          <span aria-hidden="true">{play ? "↻" : "▶"}</span> {play ? "Replay together" : "Play together"}
        </button>
        <p>{showingDurations ? "Same distance and easing for all three." : "Same distance and duration (400 ms). Only the curve changes."}</p>
      </div>
      <span className="sr-only" role="status">{play > 0 && (instant ? "All three markers are at their end positions." : "Played all three " + (showingDurations ? "durations." : "easing curves."))}</span>
    </div>
    <figcaption>The timings and curves come from the Julius library. I used them to document how a menu should open.</figcaption>
  </figure>;
}
