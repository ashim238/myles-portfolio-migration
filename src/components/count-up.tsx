"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  /** The factual display string, e.g. "78%", "~52.6%", "~30% → ~52.6%". */
  value: string;
  /** Retained for API compatibility with existing callers. */
  durationMs?: number;
  className?: string;
};

export function CountUp({ value, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;

        node.dataset.countUpEmphasized = "true";
        observer.disconnect();
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className={["count-up-fact", className].filter(Boolean).join(" ")}
    >
      {value}
    </span>
  );
}
