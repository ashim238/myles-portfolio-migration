"use client";

import { useEffect, useRef } from "react";

type DrawOnViewProps = {
  children: React.ReactNode;
  /** Per-line draw duration (ms). */
  durationMs?: number;
  /** Delay between consecutive strokes (ms). */
  staggerMs?: number;
};

/**
 * Wraps inline SVG and "draws" any descendant strokes inside a [data-draw]
 * group when the figure scrolls into view — stroke-dashoffset from full length
 * to zero, staggered in DOM order. Progressive + accessible: with reduced
 * motion (or no JS) the SVG renders fully drawn, untouched.
 *
 * Mark the connector group(s) with data-draw; their child <path>/<line>/
 * <polyline> elements are the ones that animate.
 */
export function DrawOnView({
  children,
  durationMs = 540,
  staggerMs = 70,
}: DrawOnViewProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const svg = root.querySelector("svg");
    const strokes = Array.from(
      root.querySelectorAll<SVGGeometryElement>(
        "[data-draw] path, [data-draw] line, [data-draw] polyline",
      ),
    );
    if (!svg || strokes.length === 0) return;

    // Park each stroke at "undrawn" up front so there's no draw-then-reset flash.
    const lengths = strokes.map((el) => {
      const len = el.getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
      return len;
    });

    let played = false;
    const draw = () => {
      if (played) return;
      played = true;
      strokes.forEach((el, i) => {
        el.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${i * staggerMs}ms`;
        // Next frame so the parked state is committed before transitioning.
        requestAnimationFrame(() => {
          el.style.strokeDashoffset = "0";
        });
      });
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            draw();
            io.disconnect();
          }
        }
      },
      { threshold: 0.45 },
    );
    io.observe(svg);

    return () => {
      io.disconnect();
      // Clean up inline styles if the effect re-runs.
      strokes.forEach((el, i) => {
        el.style.transition = "";
        el.style.strokeDasharray = "";
        el.style.strokeDashoffset = "";
        void lengths[i];
      });
    };
  }, [durationMs, staggerMs]);

  // display:contents — no layout box of our own; the SVG keeps its place.
  return (
    <span ref={ref} style={{ display: "contents" }}>
      {children}
    </span>
  );
}
