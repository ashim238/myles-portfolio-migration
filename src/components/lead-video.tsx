"use client";

import { useEffect, useRef } from "react";

type LeadVideoProps = {
  clip: string;
  poster: string;
  alt: string;
  /** MIME type of the clip. Defaults to video/mp4. Use video/quicktime for
   *  screen recordings straight out of macOS QuickTime (they're .mov files
   *  wrapped as .mp4). */
  type?: string;
};

/** Muted autoplay loop. Under reduced-motion we do not autoplay; the poster
 *  (the still cover) shows instead, so the section is never blank or busy. */
export function LeadVideo({ clip, poster, alt, type = "video/mp4" }: LeadVideoProps) {
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
      <source src={clip} type={type} />
      {/* Fallback: some browsers reject the primary type; also declare mp4
          so H.264 content plays even when the container is quirky. */}
      {type !== "video/mp4" ? <source src={clip} type="video/mp4" /> : null}
    </video>
  );
}
