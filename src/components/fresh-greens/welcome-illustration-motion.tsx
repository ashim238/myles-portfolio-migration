"use client";

import { useEffect, useId, useRef, useState } from "react";
import { loadPersistedWorkstation } from "@/lib/myles-97/persistence";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import styles from "./welcome-illustration-motion.module.css";

const art = "/projects/fresh-greens/process/onboarding/driver-location-journey.svg#";

export function WelcomeIllustrationMotion() {
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const mount = root.current;
    if (!mount || !("IntersectionObserver" in window) || reduced || loadPersistedWorkstation().displayPreferences.reduceMotion) return;
    let active = true;
    const drawing = new Image();
    drawing.onload = () => { if (active) setReady(true); };
    drawing.src = art.slice(0, -1);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(mount);
    return () => { active = false; observer.disconnect(); };
  }, [reduced]);

  return (
    <div ref={root} className={styles.mount} data-running={visible && !paused}>
      {ready && !reduced && <>
        <svg className={styles.scene} viewBox="0 0 1280 1005" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={id + "fade"} x1="0" x2="0" y1="0" y2="1">
              <stop stopColor="black" /><stop offset=".04" stopColor="white" />
              <stop offset=".94" stopColor="white" /><stop offset="1" stopColor="black" />
            </linearGradient>
            <mask id={id + "screen"} maskUnits="userSpaceOnUse" x="456" y="155" width="363" height="342">
              <rect x="456" y="155" width="363" height="342" fill={`url(#${id}fade)`} />
            </mask>
            <linearGradient id={id + "sky"} x2="1" y2=".55">
              <stop stopColor="#ffa918" /><stop offset="1" stopColor="#ff9d08" />
            </linearGradient>
            <g id={id + "far"}>
              <use href={art + "journey-high-cloud"} /><use href={art + "journey-upper-wind"} />
              <use href={art + "journey-small-cloud"} /><use href={art + "journey-lower-cloud"} />
            </g>
          </defs>
          <g mask={`url(#${id}screen)`}>
            <rect x="455" y="153" width="366" height="347" fill={`url(#${id}sky)`} />
            <g transform="translate(455.5 85) scale(.932)">
              <g className={styles.sun}><use href={art + "journey-sun"} /></g>
              <g className={styles.far}><use href={`#${id}far`} /><use href={`#${id}far`} x="440" /></g>
              <g className={styles.greeting}>
                <use href={art + "journey-driver"} />
                <g transform="translate(104 146)"><g className={styles.hand}>
                  <use href={art + "journey-raised-hand"} x="-104" y="-146" />
                </g></g>
                <use href={art + "hand"} />
              </g>
              <g className={styles.near}>
                <use href={art + "journey-near-cloud"} /><use href={art + "journey-near-cloud"} x="440" />
              </g>
              <use href={art + "journey-hill"} />
            </g>
          </g>
        </svg>
        <span className={styles.note} aria-hidden="true">This street needs<br />more lighting.</span>
        <button type="button" className={`reader-control ${styles.toggle}`} onClick={() => setPaused(value => !value)}
          aria-label={paused ? "Play welcome animation" : "Pause welcome animation"}>
          <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "Play" : "Pause"}
        </button>
      </>}
    </div>
  );
}
