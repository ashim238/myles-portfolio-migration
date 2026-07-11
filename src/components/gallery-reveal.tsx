"use client";

import { useEffect } from "react";

/**
 * Arms the work-gallery entrance cascade on the element with id="work-gallery".
 * Robust reveal: content is visible by default (CSS has no persistent hidden
 * state); we only add `.wg-animate` to play keyframes over it. A safety-net
 * timer removes the class regardless, so a throttled/hidden/headless render can
 * never be left blank. We never arm a hidden tab.
 */
export function GalleryReveal() {
  useEffect(() => {
    const el = document.getElementById("work-gallery");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let revealT: ReturnType<typeof setTimeout>;
    const play = () => {
      if (document.hidden) return;
      el.classList.remove("wg-animate");
      void el.offsetWidth; // restart keyframes from 0%
      el.classList.add("wg-animate");
      revealT = setTimeout(() => el.classList.remove("wg-animate"), 1300);
    };

    if (document.visibilityState === "visible") play();
    else {
      const onVis = () => {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          play();
        }
      };
      document.addEventListener("visibilitychange", onVis);
      return () => document.removeEventListener("visibilitychange", onVis);
    }
    return () => clearTimeout(revealT);
  }, []);

  return null;
}
