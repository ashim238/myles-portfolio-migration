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
  unoptimized,
}: Props) {
  const { openLightbox } = useLightbox();

  return (
    <button
      type="button"
      className="expandable-trigger"
      onClick={() => openLightbox(src, alt, width, height)}
      aria-label={`Expand image: ${alt}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        style={style}
        className={className}
        // Per-call sizes lets the optimizer ship a right-sized variant; without
        // it the optimizer still converts PNG → AVIF/WebP at full resolution.
        sizes={sizes}
        priority={priority}
        unoptimized={unoptimized}
      />
    </button>
  );
}
