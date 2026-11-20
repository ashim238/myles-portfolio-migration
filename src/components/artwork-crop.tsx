import Image from "next/image";
import type { CSSProperties } from "react";

export type CropBounds = readonly [number, number, number, number];

/** All four bounds are fractions of the source, independent of the display size. */
export function ArtworkCrop({src, width, height, bounds, sizes}: {
  src: string; width: number; height: number; bounds: CropBounds; sizes: string;
}) {
  const [x,y,w,h] = bounds;
  const ratio = width * w / (height * h);
  return <span className="artwork-crop" aria-hidden="true" style={{"--crop-ratio": ratio} as CSSProperties}>
    <Image src={src} alt="" width={width} height={height} sizes={sizes}
      style={{width:100/w+"%",left:-100*x/w+"%",top:-100*y/h+"%"}} />
  </span>;
}
