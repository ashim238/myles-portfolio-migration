"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type LeadVideoProps = {
  clip: string;
  poster: string;
  alt: string;
  /** MIME type of the clip. Defaults to video/mp4. Use video/quicktime for
   *  screen recordings straight out of macOS QuickTime (they're .mov files
   *  wrapped as .mp4). */
  type?: string;
};

function subscribeReducedMotion(callback: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Muted looping video that attaches its source only when it nears the
 *  viewport. Reduced-motion readers get the poster and can opt in with the
 *  native controls. */
export function LeadVideo({ clip, poster, alt, type = "video/mp4" }: LeadVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => {
        setLoadVideo(true);
        setInView(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setLoadVideo(true);
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!loadVideo || !inView || reducedMotion) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, [inView, loadVideo, reducedMotion]);

  return (
    <video
      ref={ref}
      className="case-lead-video"
      poster={poster}
      muted
      loop
      playsInline
      controls
      preload={loadVideo ? "metadata" : "none"}
      aria-label={alt}
    >
      {loadVideo ? (
        <>
          <source src={clip} type={type} />
          {/* Fallback: some browsers reject the primary type; also declare mp4
              so H.264 content plays even when the container is quirky. */}
          {type !== "video/mp4" ? <source src={clip} type="video/mp4" /> : null}
        </>
      ) : null}
    </video>
  );
}
