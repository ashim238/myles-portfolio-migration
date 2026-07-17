"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type LeadVideoProps = {
  clip: string;
  poster: string;
  alt: string;
  width: number;
  height: number;
  /** MIME type of the clip. Defaults to video/mp4. QuickTime clips use a
   *  same-name MP4 derivative first and retain the .mov as a fallback. */
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

function subscribeSaveData() {
  return () => {};
}

function getSaveData() {
  return Boolean(
    (navigator as Navigator & { connection?: { saveData?: boolean } }).connection
      ?.saveData,
  );
}

/** Muted looping video that attaches its source only when it nears the
 *  viewport. Reduced-motion readers get the poster and can opt in with the
 *  native controls. */
export function LeadVideo({
  clip,
  poster,
  alt,
  width,
  height,
  type = "video/mp4",
}: LeadVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loadVideo, setLoadVideo] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
  const saveData = useSyncExternalStore(subscribeSaveData, getSaveData, () => false);
  const mp4Clip =
    type === "video/quicktime"
      ? clip.replace(/\.mov(?=([?#]|$))/i, ".mp4")
      : clip;

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => {
        if (!saveData) setLoadVideo(true);
        setInView(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && !saveData) setLoadVideo(true);
      },
      { rootMargin: "320px 0px" },
    );
    observer.observe(v);
    return () => observer.disconnect();
  }, [saveData]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (!loadVideo || !inView || reducedMotion || saveData) {
      v.pause();
      return;
    }
    v.play().catch(() => {});
  }, [inView, loadVideo, reducedMotion, saveData]);

  return (
    <div className="case-video-frame">
      <video
        ref={ref}
        className="case-lead-video"
        poster={poster}
        width={width}
        height={height}
        muted
        loop
        playsInline
        controls
        preload={loadVideo ? "metadata" : "none"}
        aria-label={alt}
      >
        {loadVideo ? (
          <>
            <source src={mp4Clip} type="video/mp4" />
            {type !== "video/mp4" ? <source src={clip} type={type} /> : null}
          </>
        ) : null}
      </video>
      {saveData && !loadVideo ? (
        <button
          className="case-video-opt-in"
          type="button"
          onClick={() => setLoadVideo(true)}
        >
          Load {alt} video
        </button>
      ) : null}
    </div>
  );
}
