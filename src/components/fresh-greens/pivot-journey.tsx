"use client";

import { useEffect, useRef } from "react";
import { PhoneFrame } from "@/components/fresh-greens";
import { ExpandableImage } from "@/components/expandable-image";

/**
 * The problem-led Plan comparison: v1 put safety controls inside Google Maps,
 * while the standalone preview gives route comparison its own structure. The
 * two steps stagger-fade on scroll and stay visible by default for no-JS,
 * reduced-motion, and headless rendering.
 */
export function PivotJourney() {
  const rootRef = useRef<HTMLDivElement>(null);

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
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    const fallback = window.setTimeout(reveal, 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      className="fg-pivot"
      aria-label="From a Google Maps feature to a standalone app"
      ref={rootRef}
    >
      <ol className="fg-pivot-steps" role="list">
        <li className="fg-pivot-step fg-pivot-step--v1">
          <p className="fg-pivot-step-label">First pass</p>
          <div className="fg-pivot-phone">
            <PhoneFrame variant="screenshot">
              <ExpandableImage
                src="/projects/fresh-greens/process/pivot-google-v1-screen.png"
                alt="An early Fresh Greens screen from when it was a Google Maps feature: Google's own green turn banner, blue route line, and 3D map chrome, with Fresh Greens' Safety button and a hazard marker added down the side."
                width={390}
                height={844}
                sizes="(max-width: 768px) 62vw, 300px"
                className="fg-feature-shot"
              />
            </PhoneFrame>
          </div>
          <p className="fg-pivot-caption">
            I first added the safety layer to Google Maps. It put controls on the
            map, but those signals still felt secondary and route comparison had
            no structure of its own.
          </p>
        </li>

        <li className="fg-pivot-step fg-pivot-step--v2">
          <p className="fg-pivot-step-label">The final</p>
          <div className="fg-pivot-phone">
            <PhoneFrame variant="screenshot">
              <ExpandableImage
                src="/projects/fresh-greens/v2/route-preview.png"
                alt="The distinct Fresh Greens route preview: a daylight-graded route line with a sun-to-moon legend, an All clear safety chip, a note that a station you trust is on the route, and a green Go button on a warm surface."
                width={1290}
                height={2796}
                sizes="(max-width: 768px) 62vw, 300px"
                className="fg-feature-shot"
              />
            </PhoneFrame>
          </div>
          <p className="fg-pivot-caption">
            The standalone preview puts daylight, route status, and trusted
            places at the choice point. Reserved safety colors keep warnings
            distinct, while the sun-to-moon route shows how light changes before
            arrival.
          </p>
        </li>
      </ol>
    </div>
  );
}
