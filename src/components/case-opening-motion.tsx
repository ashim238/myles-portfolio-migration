"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { loadPersistedWorkstation } from "@/lib/myles-97/persistence";
import styles from "./case-opening-motion.module.css";

const sources = {
  navi: ["/projects/navi/opening-activity-detail.webp"],
  newsletter: ["/projects/understandingfafsa/opening-newsletter-scroll.webp", "/projects/understandingfafsa/opening-screen-mask.png"],
  tiktok: ["/projects/tiktok/system/catalog-shirt.webp"],
};
type Variant = keyof typeof sources;
const names = { navi: "Prospect Park activity", newsletter: "newsletter scroll", tiktok: "catalog feed" };

function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  return image.decode();
}

export function CaseOpeningMotion({ variant, children }: { variant: Variant; children?: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    const mount = stage.current;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!mount || reduced || connection?.saveData || !("IntersectionObserver" in window) ||
      loadPersistedWorkstation().displayPreferences.reduceMotion) return;

    let active = true;
    let requested = false;
    let inView = false;
    const updateVisibility = () => setVisible(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updateVisibility();
      if (!inView || requested) return;
      requested = true;
      Promise.all(sources[variant].map(loadImage)).then(() => {
        if (active) { setReady(true); setPlaying(true); }
      }).catch(() => { /* Keep the original poster when an insert is unavailable. */ });
    }, { threshold: .15 });
    observer.observe(mount);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      active = false;
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [variant, reduced]);

  useEffect(() => {
    const mount = stage.current;
    if (!mount || !ready || variant !== "newsletter") return;
    // The PSD's four-corner projection is expressed on a 640px-wide artboard.
    const fit = () => mount.style.setProperty("--newsletter-scale", String(mount.clientWidth / 640));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(mount);
    return () => observer.disconnect();
  }, [ready, variant]);

  const animated = ready && !reduced;
  return <div ref={stage} className={variant === "tiktok" ? `tt-cover-work tt-original-plates ${styles.plates}` : styles.overlay}
    role={children ? "group" : undefined} aria-label={children ? "Original TikTok feed mockups" : undefined}
    data-opening={variant} data-visible={visible} data-playing={animated && playing} onAnimationEnd={event => {
      if ((event.target as HTMLElement).dataset.motionEnd === "true") {
        setPlaying(false);
        setPlayed(true);
      }
    }}>
    {children}
    {animated && variant === "newsletter" && <div className={styles.newsletter} aria-hidden="true">
      <div className={styles.artboard}>
        <div className={styles.screen}>
          <div className={styles.scrollPage} data-motion-end="true" />
        </div>
      </div>
    </div>}
    {animated && variant === "navi" && <span className={styles.insert}
      style={{ backgroundImage: `url(${sources.navi[0]})` }} data-motion-end="true" aria-hidden="true" />}
    {animated && played && <button type="button" className={styles.replay}
      aria-label={`Replay ${names[variant]} animation`}
      aria-disabled={playing} onClick={() => { if (!playing) setPlaying(true); }}>↻ Replay</button>}
  </div>;
}
