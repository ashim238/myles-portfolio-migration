"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { COLOR_GROUPS, SPACING_TOKENS } from "@/lib/fresh-greens/design-tokens";

/**
 * A native design-token exhibit rendered from the real app repo values,
 * not a Figma screenshot: color swatches grouped by the job they do, and the
 * 4pt spacing ramp. On scroll into view the swatches stagger in and the
 * spacing bars grow to their true proportional width. Visible by default, so
 * no-JS and reduced-motion readers see the finished panel untouched.
 */
export function TokenExhibit() {
  const rootRef = useRef<HTMLDivElement>(null);
  const maxPx = Math.max(...SPACING_TOKENS.map((s) => s.px));

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.setAttribute("data-reveal", "pending");
    const reveal = () => el.setAttribute("data-reveal", "in");

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
          } else if (el.getAttribute("data-reveal") === "in") {
            el.setAttribute("data-reveal", "pending");
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    const fallback = window.setTimeout(reveal, 3000);

    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  // Continuous stagger index across every swatch, regardless of group.
  let swatchIndex = 0;

  return (
    <div
      className="fg-tokens"
      ref={rootRef}
      aria-label="Fresh Greens design tokens"
    >
      <div className="fg-tokens-lane">
        <p className="fg-tokens-lane-label">Color, and the job each one holds</p>
        <div className="fg-swatch-groups">
          {COLOR_GROUPS.map((group) => (
            <div className="fg-swatch-group" key={group.key}>
              <p className="fg-swatch-group-label">{group.label}</p>
              <ul className="fg-swatches" role="list">
                {group.tokens.map((c) => {
                  const i = swatchIndex++;
                  return (
                    <li
                      className="fg-swatch"
                      key={c.name}
                      style={{ "--i": i } as CSSProperties}
                    >
                      <span
                        className="fg-swatch-chip"
                        style={{ background: c.hex }}
                        aria-hidden="true"
                      />
                      <span className="fg-swatch-name">{c.name}</span>
                      <span className="fg-swatch-hex">{c.hex}</span>
                      <span className="fg-swatch-role">{c.role}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="fg-tokens-lane">
        <p className="fg-tokens-lane-label">Spacing, a 4pt ramp</p>
        <ul className="fg-tokens-spacing" role="list">
          {SPACING_TOKENS.map((s, i) => (
            <li
              key={s.name}
              className="fg-token-space"
              style={{ "--i": i } as CSSProperties}
            >
              <span className="fg-token-space-name">{s.name}</span>
              <span
                className="fg-token-space-bar"
                style={{ width: `${Math.round((s.px / maxPx) * 100)}%` }}
                aria-hidden="true"
              />
              <span className="fg-token-space-px">{s.px}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
