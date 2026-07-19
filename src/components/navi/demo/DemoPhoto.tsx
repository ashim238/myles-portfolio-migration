"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Demo photography is exported from Figma in stages. Until an asset lands, a
// missing file would render the browser's broken-image glyph and make the whole
// product read as broken. This swaps a failed load for a calm "pending" panel
// so a missing photo reads as unfinished, not broken.
export function DemoPhoto({
  src,
  alt,
  className,
  dataTestId,
  sizes,
  preload = false,
  loading = "lazy",
}: {
  src: string;
  alt: string;
  className?: string;
  dataTestId?: string;
  sizes: string;
  preload?: boolean;
  loading?: "eager" | "lazy";
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // A 404 can resolve before hydration attaches onError, leaving a broken
  // image that never fires the handler. Re-check once on mount: a finished load
  // with zero natural width is a failure. (jsdom never loads, so complete is
  // false there and this stays inert in tests.)
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  if (failed) {
    return (
      <div
        className={`nv-photo-pending${className ? ` ${className}` : ""}`}
        role="img"
        aria-label={alt}
        data-testid={dataTestId}
      >
        <span aria-hidden="true">Photo coming soon</span>
      </div>
    );
  }

  return (
    <Image
      ref={ref}
      src={src}
      alt={alt}
      width={1600}
      height={1000}
      sizes={sizes}
      className={className}
      data-testid={dataTestId}
      preload={preload}
      loading={preload ? "eager" : loading}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
