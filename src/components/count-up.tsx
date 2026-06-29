"use client";

import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** The final display string, e.g. "78%", "~52.6%", "~30% → ~52.6%". */
  value: string;
  /** Animation duration in ms. */
  durationMs?: number;
  className?: string;
};

type Token =
  | { kind: "text"; text: string }
  | { kind: "num"; target: number; decimals: number };

/** Split a string into literal text and numeric tokens we can animate. */
function tokenize(value: string): Token[] {
  const tokens: Token[] = [];
  const re = /\d+(?:\.\d+)?/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(value)) !== null) {
    if (match.index > last) {
      tokens.push({ kind: "text", text: value.slice(last, match.index) });
    }
    const raw = match[0];
    const dot = raw.indexOf(".");
    tokens.push({
      kind: "num",
      target: Number(raw),
      decimals: dot === -1 ? 0 : raw.length - dot - 1,
    });
    last = match.index + raw.length;
  }
  if (last < value.length) {
    tokens.push({ kind: "text", text: value.slice(last) });
  }
  return tokens;
}

function render(tokens: Token[], progress: number): string {
  return tokens
    .map((t) =>
      t.kind === "text" ? t.text : (t.target * progress).toFixed(t.decimals),
    )
    .join("");
}

// easeOutExpo — fast start, gentle landing. Reads as "settling on a result."
function ease(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function CountUp({ value, durationMs = 1100, className }: CountUpProps) {
  const tokens = tokenize(value);
  const ref = useRef<HTMLSpanElement>(null);
  // Render the real, final value on the server and first client paint so no-JS,
  // SEO, and reduced-motion users always see the true number.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return;

    let raf = 0;
    let start = 0;
    let done = false;

    const run = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / durationMs, 1);
      setDisplay(render(tokens, ease(p)));
      if (p < 1) {
        raf = requestAnimationFrame(run);
      } else {
        done = true;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !done && !raf) {
            setDisplay(render(tokens, 0));
            raf = requestAnimationFrame(run);
          }
        }
      },
      { threshold: 0.6 },
    );

    io.observe(node);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // tokens is derived from `value`; depend on the primitive to avoid re-runs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {display}
    </span>
  );
}
