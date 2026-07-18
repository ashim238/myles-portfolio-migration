"use client";

import { useEffect } from "react";

const SELECTORS = [
  ".project-page .project-section",
  ".project-highlight",
  ".play-entry",
  ".about-detail",
  ".home-page .about",
  ".footer",
  ".fg-features-heading",
  ".fg-features-grid > *",
  ".nv-build-layer",
  ".nv-persona-grid > *",
].join(",");

export function ScrollRevealFallback() {
  useEffect(() => {
    if (CSS.supports("animation-timeline: view()")) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let observer: IntersectionObserver;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              entry.target.classList.add("sr-revealed");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold: 0.08 },
      );
    } catch {
      return;
    }

    const targets = document.querySelectorAll(SELECTORS);
    try {
      targets.forEach((el) => {
        if (!el.classList.contains("sr-revealed")) {
          observer.observe(el);
        }
      });
    } catch {
      observer.disconnect();
      return;
    }
    document.documentElement.dataset.revealReady = "true";

    return () => {
      observer.disconnect();
      delete document.documentElement.dataset.revealReady;
    };
  }, []);

  return null;
}
