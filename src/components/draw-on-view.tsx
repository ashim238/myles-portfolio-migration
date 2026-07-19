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
    if (!("IntersectionObserver" in window)) return;

    const svg = root.querySelector("svg");
    const strokes = Array.from(
      root.querySelectorAll<SVGGeometryElement>(
        "[data-draw] path, [data-draw] line, [data-draw] polyline",
      ),
    );
    if (!svg || strokes.length === 0) return;

    let lengths: number[];
    try {
      lengths = strokes.map((el) => el.getTotalLength());
    } catch {
      return;
    }

    const park = (i: number) => {
      const el = strokes[i];
      el.style.transition = "none";
      el.style.strokeDashoffset = `${lengths[i]}`;
    };

    let drawn = false;
    const draw = () => {
      if (drawn) return;
      drawn = true;
      strokes.forEach((el, i) => {
        el.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.22, 0.61, 0.36, 1) ${i * staggerMs}ms`;
        // Next frame so the parked state is committed before transitioning.
        requestAnimationFrame(() => {
          el.style.strokeDashoffset = "0";
        });
      });
    };
    const reset = () => {
      if (!drawn) return;
      drawn = false;
      strokes.forEach((_, i) => park(i));
    };

    // Re-arm on every entry: a fast scroller who flew past it still sees the
    // draw when they scroll back. Reset only once it has fully left the
    // viewport, so partial-scroll jitter doesn't restart it mid-draw.
    let io: IntersectionObserver;
    try {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.intersectionRatio >= 0.5) draw();
            else if (entry.intersectionRatio === 0) reset();
          }
        },
        { threshold: [0, 0.5] },
      );
    } catch {
      return;
    }

    const restore = () => {
      strokes.forEach((el) => {
        el.style.transition = "";
        el.style.strokeDasharray = "";
        el.style.strokeDashoffset = "";
      });
    };

    try {
      io.observe(svg);
    } catch {
      io.disconnect();
      return;
    }
    strokes.forEach((el, i) => {
      el.style.strokeDasharray = `${lengths[i]}`;
      park(i);
    });

    return () => {
      io.disconnect();
      // Clean up inline styles if the effect re-runs.
      restore();
    };
  }, [durationMs, staggerMs]);

  // display:contents — no layout box of our own; the SVG keeps its place.
  return (
    <span ref={ref} style={{ display: "contents" }}>
      {children}
    </span>
  );
}
