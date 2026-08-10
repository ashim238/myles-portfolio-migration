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
        viewBox="0 0 24 32"
        focusable="false"
      >
        <path
          className="myles98-cursor-outline"
          d="M1 1v26h5v-6h4l5 10h6l-5-11h8v-3h-3v-3h-3v-3h-3V8h-3V5H9V2H6V1H1Z"
        />
        <path
          className="myles98-cursor-fill"
          d="M3 3v19h1v-5h7l5 10h1l-5-10h7v-1h-2v-3h-3v-3h-3V7H8V4H5V3H3Z"
        />
        <rect
          className="myles98-cursor-accent"
          x="4"
          y="4"
          width="3"
          height="3"
        />
      </svg>
      <svg
        className="myles98-cursor-ibeam"
        viewBox="0 0 18 28"
        focusable="false"
      >
        <path
          className="myles98-cursor-outline"
          d="M3 1h12v5h-4v16h4v5H3v-5h4V6H3V1Z"
        />
        <path
          className="myles98-cursor-fill"
          d="M5 3h8v1H9v20h4v1H5v-1h4V4H5V3Z"
        />
      </svg>
    </div>
  );
}
