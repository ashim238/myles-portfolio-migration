"use client";

import { useEffect, useRef } from "react";

type LeadVideoProps = { clip: string; poster: string; alt: string };

/** Muted autoplay loop. Under reduced-motion we do not autoplay; the poster
 *  (the still cover) shows instead, so the section is never blank or busy. */
export function LeadVideo({ clip, poster, alt }: LeadVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      v.removeAttribute("autoplay");
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="case-lead-video"
      poster={poster}
      muted
      loop
      playsInline
      autoPlay
      aria-label={alt}
    >
      <source src={clip} type="video/mp4" />
    </video>
  );
}
