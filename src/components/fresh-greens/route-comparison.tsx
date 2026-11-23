"use client";

import { useId, useState } from "react";
import { trip } from "@/lib/fresh-greens/weeksville-comparison";
import styles from "./route-comparison.module.css";

const ink = {
  Daylight: { color: "#D18000", dash: undefined },
  Dusk: { color: "#C4785A", dash: "8 4" },
  "After dark": { color: "#2D1B69", dash: "2 8" },
} as const;

type Light = keyof typeof ink;

function LineSample({ light, color = ink[light].color }: { light: Light; color?: string }) {
  const { dash } = ink[light];
  return (
    <svg aria-hidden="true" width="30" height="10" viewBox="0 0 30 10">
      <path d="M2 5H28" stroke={color} strokeWidth="3" strokeLinecap="round" strokeDasharray={dash} />
    </svg>
  );
}

export function RouteComparison() {
  const [index, setIndex] = useState(0);
  const groupId = useId();
  const panelId = `${groupId}-map`;
  const route = trip.routes[index];
  const lightAlongRoute = route.segments.map(segment => segment.light.toLowerCase()).join(", then ");
  const [startX, startY] = trip.start;
  const [finishX, finishY] = trip.finish;

  return (
    <section id="fg-app-walkthrough" tabIndex={-1} className={`${styles.comparison} project-proof-target`} aria-labelledby={`${groupId}-title`}>
      <header className={styles.header}>
        <p className={styles.kicker}>Route comparison</p>
        <h3 id={`${groupId}-title`}>Two routes to Weeksville</h3>
        <p className={styles.intro}>
          Leave {trip.origin} at {trip.departure}. Choose a route to see how much light to expect when you reach Weeksville Heritage Center.
        </p>
      </header>

      <fieldset className={styles.choices}>
        <legend className={styles.srOnly}>Choose a route</legend>
        {trip.routes.map((option, i) => (
          <label className={styles.choice} key={option.via}>
            <input type="radio" name={groupId} aria-label={`Via ${option.via}`} checked={index === i} onChange={() => setIndex(i)} aria-controls={panelId} />
            <span className={styles.option}>
              <span className={styles.radioMark} aria-hidden="true" />
              <span>{option.via}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className={styles.panel} id={panelId}>
        <div className={styles.details}>
          <div>
            <p className={styles.metricLabel}>Estimated arrival</p>
            <p className={styles.arrival}>{route.arrival}</p>
            <p className={styles.arrivalLight}><LineSample light={route.light} color={route.segments.at(-1)?.color} />{route.light}</p>
          </div>
          <dl className={styles.facts}>
            <div><dt>Drive time</dt><dd>{route.minutes} min</dd></div>
            <div><dt>Distance</dt><dd>{route.miles} mi</dd></div>
          </dl>
        </div>

        <figure className={styles.figure}>
          <div className={styles.mapSurface}>
            <svg className={styles.map} viewBox={trip.viewBox} role="img" aria-label={`Route from ${trip.origin} to ${trip.destination} via ${route.via}. Light along the route: ${lightAlongRoute}. Arrives at ${route.arrival}, ${route.light.toLowerCase()}.`}>
              <image href={trip.mapImage} width={trip.mapWidth} height={trip.mapHeight} />
              {route.segments.map((segment, i) => (
                <path key={i} d={segment.d} fill="none" stroke={segment.color}
                  strokeWidth="3" strokeDasharray={ink[segment.light].dash}
                  strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
              ))}
              <g transform={`translate(${startX} ${startY})`}>
                <g className={styles.mapMarker}>
                  <circle r="8" fill="#347de036" /><circle r="4.6" fill="#1176dc" stroke="white" strokeWidth="1.8" />
                  <text className={styles.mapLabel} x="10" y="4">Start</text>
                </g>
              </g>
              <g transform={`translate(${finishX} ${finishY})`}>
                <g className={styles.mapMarker}>
                  <image href="/projects/fresh-greens/pocket-map/destination-home.svg" x="-14" y="-25" width="28" height="28" />
                  <circle r="1.7" fill="#111" stroke="white" strokeWidth=".7" />
                  <text className={styles.mapLabel} x="12" y="-10">Finish</text>
                </g>
              </g>
            </svg>
            <a className={styles.credit} href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors</a>
          </div>
          <figcaption className={styles.key}>
            <span className={styles.keyLabel}>Map key</span>
            {(["Daylight", "Dusk", "After dark"] as const).map(light => (
              <span key={light} className={styles.keyItem} data-active={route.segments.some(s => s.light === light)}>
                <LineSample light={light} color={route.segments.find(s => s.light === light)?.color} />{light}
              </span>
            ))}
          </figcaption>
        </figure>
      </div>
      <p className={styles.note}>Example trip on {trip.date}. Fresh Greens estimates arrival light from the local sunset.</p>
      <span role="status" aria-atomic="true" className={styles.srOnly}>
        {route.via}, {route.minutes} minutes, {route.miles} miles. Arrives at {route.arrival}, {route.light.toLowerCase()}. Light along the route: {lightAlongRoute}.
      </span>
    </section>
  );
}
