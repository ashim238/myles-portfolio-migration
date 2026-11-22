"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { loadPersistedWorkstation } from "@/lib/myles-97/persistence";
import styles from "./case-opening-motion.module.css";

const sources = {
  navi: "/projects/navi/opening-activity-detail.webp",
  newsletter: "/projects/understandingfafsa/opening-newsletter-scroll.webp",
  tiktok: "",
};
type Variant = keyof typeof sources;
const names = { navi: "Prospect Park activity", newsletter: "newsletter scroll", tiktok: "catalog proofs" };

export function CaseOpeningMotion({ variant, children }: { variant: Variant; children?: ReactNode }) {
  const screenClip = useId();
  const stage = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const mount = stage.current;
    if (!mount || reduced || !("IntersectionObserver" in window) ||
      loadPersistedWorkstation().displayPreferences.reduceMotion) return;
    let active = true;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const begin = () => {
        if (active) { setReady(true); setPlaying(true); }
      };
      if (sources[variant]) {
        const image = new Image();
        image.onload = begin;
        image.src = sources[variant];
      } else begin();
    }, { threshold: .3 });
    observer.observe(mount);
    return () => { active = false; observer.disconnect(); };
  }, [variant, reduced]);

  return <div ref={stage} className={variant === "tiktok" ? `tt-cover-work tt-original-plates ${styles.plates}` : styles.overlay}
    role={children ? "group" : undefined} aria-label={children ? "Original catalog templates" : undefined}
    data-opening={variant} data-playing={!reduced && playing} onAnimationEnd={event => {
      if (event.target !== stage.current && playing) { setPlaying(false); setPlayed(true); }
    }}>
    {children}
    {ready && !reduced && variant === "newsletter" && <svg aria-hidden="true" focusable="false"
      className={styles.newsletter} viewBox="0 0 640 555.5">
      <defs><clipPath id={screenClip}><path d="M111 106 L133 99 Q135 111 145 106 L210 87 Q219 84 218 75 L240 68 Q258 61 263 80 L357 387 Q364 405 347 412 L209 450 Q193 456 187 438 L101 132 Q95 114 111 106Z" /></clipPath></defs>
      <g clipPath={`url(#${screenClip})`}><g transform="matrix(.966 -.280 .277 .980 94.3 111)">
        <image className={styles.scrollPage} href={sources.newsletter} width="170" height="489.333" />
      </g></g>
    </svg>}
    {ready && !reduced && variant === "navi" && <span className={styles.insert}
      style={{ backgroundImage: `url(${sources[variant]})` }} aria-hidden="true" />}
    {played && !reduced && <button type="button" className={styles.replay}
      aria-label={`Replay ${names[variant]} animation`} aria-disabled={playing}
      onClick={() => { if (!playing) setPlaying(true); }}>↻ Replay</button>}
  </div>;
}
