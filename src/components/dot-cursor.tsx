"use client";

import { useEffect, useRef } from "react";

const HOVER_SELECTORS =
  "a, button, [role='button'], label, summary, .work-card, .lightbox-trigger, .expandable-image, .project-toc-link";
const INPUT_SELECTORS = "input, textarea, select";

function isCoarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

export function DotCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCoarsePointer()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const dot = dotRef.current;
    if (!dot) return;

    let x = -40;
    let y = -40;

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;

      if (!dot.classList.contains("dot-cursor--visible")) {
        dot.classList.add("dot-cursor--visible");
      }

      const target = document.elementFromPoint(x, y);
      if (!target) return;

      const isInput = target.matches(INPUT_SELECTORS) || !!target.closest(INPUT_SELECTORS);
      const isHover = target.matches(HOVER_SELECTORS) || !!target.closest(HOVER_SELECTORS);

      dot.classList.toggle("dot-cursor--input", isInput);
      dot.classList.toggle("dot-cursor--hover", isHover && !isInput);
    };

    const onLeave = () => {
      dot.classList.remove("dot-cursor--visible");
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={dotRef} className="dot-cursor" aria-hidden="true" />;
}
