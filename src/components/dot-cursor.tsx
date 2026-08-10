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
    let frame = 0;

    const render = () => {
      frame = 0;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;

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

    const onMove = (event: MouseEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };

    const release = () => {
      dot.classList.remove("dot-cursor--pressed");
    };

    const onDown = () => {
      dot.classList.add("dot-cursor--pressed");
    };

    const onLeave = () => {
      dot.classList.remove("dot-cursor--visible");
      release();
    };

    document.documentElement.classList.add("dot-cursor-ready");
    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mousedown", onDown, { passive: true });
    document.addEventListener("mouseup", release, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", release);

    return () => {
      document.documentElement.classList.remove("dot-cursor-ready");
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", release);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", release);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={dotRef} className="dot-cursor" aria-hidden="true">
      <svg
        className="myles98-cursor-arrow"
        viewBox="0 0 32 32"
        data-m98-cursor-hotspot="0 0"
        data-m98-pixel-bounds="0 0 11 19"
        focusable="false"
      >
        <path
          className="myles98-cursor-outline"
          d="M0 0h1v1H0ZM0 1h2v1H0ZM0 2h3v1H0ZM0 3h4v1H0ZM0 4h5v1H0ZM0 5h6v1H0ZM0 6h7v1H0ZM0 7h8v1H0ZM0 8h9v1H0ZM0 9h10v1H0ZM0 10h11v1H0ZM0 11h7v1H0ZM0 12h3v1H0ZM4 12h4v1H4ZM0 13h2v1H0ZM4 13h4v1H4ZM0 14h1v1H0ZM5 14h4v1H5ZM5 15h4v1H5ZM6 16h4v1H6ZM6 17h4v1H6ZM7 18h2v1H7Z"
        />
        <path
          className="myles98-cursor-fill"
          d="M1 2h1v1H1ZM1 3h2v1H1ZM1 4h3v1H1ZM1 5h4v1H1ZM1 6h5v1H1ZM1 7h6v1H1ZM1 8h7v1H1ZM1 9h8v1H1ZM1 10h5v1H1ZM1 11h2v1H1ZM4 11h2v1H4ZM1 12h1v1H1ZM5 12h2v1H5ZM5 13h2v1H5ZM6 14h2v1H6ZM6 15h2v1H6ZM7 16h2v1H7ZM7 17h2v1H7Z"
        />
      </svg>
      <svg
        className="myles98-cursor-ibeam"
        viewBox="0 0 32 32"
        data-m98-cursor-hotspot="10 10"
        data-m98-pixel-bounds="6 1 9 18"
        focusable="false"
      >
        <path
          className="myles98-cursor-outline"
          d="M6 1h9v3H6ZM9 4h3v12H9ZM6 16h9v3H6Z"
        />
        <path
          className="myles98-cursor-fill"
          d="M7 2h3v1H7ZM11 2h3v1H11ZM10 3h1v14H10ZM7 17h3v1H7ZM11 17h3v1H11Z"
        />
      </svg>
    </div>
  );
}
