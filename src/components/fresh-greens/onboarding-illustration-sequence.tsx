"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { ExpandableImage } from "@/components/expandable-image";

const PANELS = [
  {
    src: "/projects/fresh-greens/process/onboarding/driver-location-journey.svg",
    alt: "Hand-drawn illustration of a Black driver soaring like a map pin above green hills at sunrise.",
    height: 848,
  },
  {
    src: "/projects/fresh-greens/process/onboarding/driver-reflection.svg",
    alt: "Hand-drawn illustration of a Black driver sitting in thought and reflecting on how a route feels.",
    height: 844,
  },
  {
    src: "/projects/fresh-greens/process/onboarding/trust-and-safety.svg",
    alt: "Hand-drawn navy shield with a check mark, representing trust and safety in Fresh Greens.",
    height: 844,
  },
  {
    src: "/projects/fresh-greens/process/onboarding/community-conversation.svg",
    alt: "Hand-drawn illustration of a Black driver resting beside speech bubbles that represent community conversation.",
    height: 844,
  },
] as const;

export function OnboardingIllustrationSequence() {
  const figureRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const controls: {
      observer?: IntersectionObserver;
      fallback?: number;
    } = {};

    const reveal = () => {
      figure.dataset.reveal = "in";
      controls.observer?.disconnect();
      if (controls.fallback !== undefined) {
        window.clearTimeout(controls.fallback);
      }
    };

    figure.dataset.reveal = "pending";
    controls.fallback = window.setTimeout(reveal, 1800);

    if (!("IntersectionObserver" in window)) {
      reveal();
      return;
    }

    controls.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) reveal();
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );
    controls.observer.observe(figure);

    return () => {
      controls.observer?.disconnect();
      if (controls.fallback !== undefined) {
        window.clearTimeout(controls.fallback);
      }
    };
  }, []);

  return (
    <figure className="fg-illustrations" ref={figureRef}>
      <div
        className="fg-illustration-scroll"
        role="region"
        tabIndex={0}
        aria-label="Fresh Greens onboarding illustration sequence"
      >
        <ol
          className="fg-illustration-track"
          aria-label="Fresh Greens onboarding illustration sequence"
        >
          {PANELS.map((panel, index) => (
            <li
              className="fg-illustration-panel"
              key={panel.src}
              style={{ "--fg-illustration-index": index } as CSSProperties}
            >
              <ExpandableImage
                src={panel.src}
                alt={panel.alt}
                width={390}
                height={panel.height}
                sizes="(max-width: 620px) 84vw, (max-width: 899px) 42vw, 190px"
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </li>
          ))}
        </ol>
      </div>
      <figcaption className="fg-safety-visual-caption">
        The onboarding illustrations, drawn by hand. They set the warm, human
        register the app opens on, before a single safety signal appears.
      </figcaption>
    </figure>
  );
}
