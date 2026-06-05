"use client";

import Image from "next/image";
import { useLightbox } from "@/components/lightbox-provider";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
  priority?: boolean;
};

export function ExpandableImage({ src, alt, width, height, style, priority }: Props) {
  const { openLightbox } = useLightbox();

  return (
    <button
      className="expandable-trigger"
      onClick={() => openLightbox(src, alt)}
      aria-label={`Expand image: ${alt}`}
    >
      <Image src={src} alt={alt} width={width} height={height} style={style} priority={priority} />
    </button>
  );
}
