"use client";

import { useLayoutEffect } from "react";
import { HOME_ENTRANCE_COMPLETE, HOME_ENTRANCE_KEY, prefersReducedMotion } from "@/lib/home-intro";

/** Keeps keyboard focus out of main content until homepage intro sequences finish. */
export function HomeIntroFocusGuard() {
  useLayoutEffect(() => {
    const main = document.querySelector<HTMLElement>(".home-page");
    if (!main) return;

    if (prefersReducedMotion() || sessionStorage.getItem(HOME_ENTRANCE_KEY) === "1") {
      main.inert = false;
      return;
    }

    main.inert = true;

    const release = () => {
      main.inert = false;
    };

    window.addEventListener(HOME_ENTRANCE_COMPLETE, release, { once: true });
    // Failsafe: never leave the page locked if the entrance never completes
    // (slow bundle, anime.js failure). Mirrors the head-script visibility timeout.
    const failsafe = window.setTimeout(release, 2600);

    return () => {
      main.inert = false;
      window.clearTimeout(failsafe);
      window.removeEventListener(HOME_ENTRANCE_COMPLETE, release);
    };
  }, []);

  return null;
}
