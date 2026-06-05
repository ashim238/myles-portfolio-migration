"use client";

import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  priority?: boolean;
};

export function ExpandableImage({ src, alt, width, height, style, priority }: Props) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <button
        className="expandable-trigger"
        onClick={() => setOpen(true)}
        aria-label={`Expand image: ${alt}`}
      >
        <Image src={src} alt={alt} width={width} height={height} style={style} priority={priority} />
      </button>

      {open && (
        <div
          className="expandable-overlay"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <button className="expandable-close" onClick={close} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <div
            className="expandable-content"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              style={{ width: "auto", height: "auto", maxHeight: "88vh", maxWidth: "90vw", objectFit: "contain" }}
            />
          </div>
        </div>
      )}
    </>
  );
}
