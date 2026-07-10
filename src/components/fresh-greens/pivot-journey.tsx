"use client";

import { useEffect, useRef } from "react";
import { PhoneFrame } from "@/components/fresh-greens";
import { ExpandableImage } from "@/components/expandable-image";

/**
 * The design-direction pivot: v1 was Fresh Greens as a feature inside Google
 * Maps (Google's chrome, safety controls bolted on), then rebuilt as a
 * standalone app with its own identity. Two phone shots, the Google-Maps
 * feature against the distinct result, each with a one-line rationale. On
 * scroll into view the two steps stagger-fade in — matches the token
 * exhibit's motion craft. Visible by default (no-JS / reduced-motion
 * untouched) with a timeout fallback so a headless render never ships blank.
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
            io.disconnect();
            break;
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
            At first I imagined Fresh Greens as a feature inside Google Maps, so
            v1 wore Google&apos;s turn banner and map chrome, with my safety
            controls down the side. That moved fast, and it capped the whole
            idea at Google Maps with a safety layer bolted on.
          </p>
        </li>

        <li className="fg-pivot-step fg-pivot-step--v2">
          <p className="fg-pivot-step-label">The break</p>
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
            Rebuilding it as its own app is what let the safety signals become
            the interface. The route preview grades the road by daylight, reads
            safety at a glance, flags a station you trust, and carries its own
            glyphs on the warm surfaces.
          </p>
        </li>
      </ol>
    </div>
  );
}
