"use client";

import { useEffect } from "react";

/**
 * Reveals `mark.case-highlight` phrases with a background-size sweep the first
 * time each one enters the viewport. If JS never runs (or an observer fails),
 * the highlights are already visible via the base `.case-highlight` styles.
 * That's the point of the two-layer setup: the sweep is a flourish, not a gate.
 */
export function CaseHighlightObserver() {
  useEffect(() => {
    const article = document.querySelector<HTMLElement>(
      "main[data-project-slug]"
    );
    if (!article) return;

    const marks = Array.from(
      article.querySelectorAll<HTMLElement>("mark.case-highlight")
    );
    if (marks.length === 0) return;

    article.dataset.highlightAnimReady = "true";

    const revealIfInView = (el: HTMLElement) => {
      const rect = el.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight && rect.bottom > 0 && rect.width > 0;
      if (inView) el.classList.add("is-revealed");
    };

    marks.forEach(revealIfInView);

    if (typeof IntersectionObserver === "undefined") {
      marks.forEach((m) => m.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          } else {
            entry.target.classList.remove("is-revealed");
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    marks.forEach((m) => observer.observe(m));

    return () => observer.disconnect();
  }, []);

  return null;
}
