"use client";

import Image from "next/image";
import { useLightbox } from "@/components/lightbox-provider";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  className?: string;
  sizes?: string;
  priority?: boolean;
  overlay?: React.ReactNode;
  /** Optional detail crop for the inline image. The viewer opens the full source. */
  previewSrc?: string;
  /** Intrinsic size of the inline art when it differs from the full image. */
  previewSize?: { width: number; height: number };
  /** Describe the full screen when the inline image is only a detail. */
  expandedAlt?: string;
  /** Opt out of Next's image optimizer (e.g. animated GIFs). */
  unoptimized?: boolean;
};

export function ExpandableImage({
  src,
  alt,
  width,
  height,
  style,
  className,
  sizes,
  priority,
  overlay,
  previewSrc,
  previewSize,
  expandedAlt,
  unoptimized,
}: Props) {
  const { openLightbox } = useLightbox();

  return (
    <button
      type="button"
      className="expandable-trigger"
      onClick={() => openLightbox(src, expandedAlt ?? alt, width, height, { unoptimized, overlay })}
      aria-label={expandedAlt ? `Open full screen: ${expandedAlt}` : `Expand image: ${alt}`}
    >
      <Image
        src={previewSrc ?? src}
        alt={alt}
        width={previewSize?.width ?? width}
        height={previewSize?.height ?? height}
        style={style}
        className={className}
        // Per-call sizes lets the optimizer ship a right-sized variant; without
        // it the optimizer still converts PNG → AVIF/WebP at full resolution.
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
      />
      {overlay}
    </button>
  );
}
