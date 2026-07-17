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

    const observer = new IntersectionObserver(
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

    const targets = document.querySelectorAll(SELECTORS);
    targets.forEach((el) => {
      if (!el.classList.contains("sr-revealed")) {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
