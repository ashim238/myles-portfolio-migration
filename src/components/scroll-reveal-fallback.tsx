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
    if (typeof window.IntersectionObserver !== "function") return;
    if (typeof window.MutationObserver !== "function") return;

    let observer: IntersectionObserver;
    let mutationObserver: MutationObserver | undefined;
    let active = true;

    const disable = () => {
      if (!active) return;
      active = false;
      observer?.disconnect();
      mutationObserver?.disconnect();
      delete document.documentElement.dataset.revealReady;
    };

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

    const observeTarget = (element: Element) => {
      if (!active || element.classList.contains("sr-revealed")) return active;

      try {
        observer.observe(element);
        return true;
      } catch {
        disable();
        return false;
      }
    };

    const observeTree = (node: Node) => {
      if (!(node instanceof Element)) return true;
      if (node.matches(SELECTORS) && !observeTarget(node)) return false;

      for (const element of node.querySelectorAll(SELECTORS)) {
        if (!observeTarget(element)) return false;
      }
      return true;
    };

    const unobserveTree = (node: Node) => {
      if (!(node instanceof Element)) return true;

      try {
        if (node.matches(SELECTORS)) observer.unobserve(node);
        for (const element of node.querySelectorAll(SELECTORS)) {
          observer.unobserve(element);
        }
        return true;
      } catch {
        disable();
        return false;
      }
    };

    for (const target of document.querySelectorAll(SELECTORS)) {
      if (!observeTarget(target)) return;
    }

    try {
      mutationObserver = new MutationObserver((records) => {
        for (const record of records) {
          for (const node of record.removedNodes) {
            if (!unobserveTree(node)) return;
          }
          for (const node of record.addedNodes) {
            if (!observeTree(node)) return;
          }
        }
      });
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch {
      disable();
      return;
    }

    document.documentElement.dataset.revealReady = "true";

    return () => {
      disable();
    };
  }, []);

  return null;
}
