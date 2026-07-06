import Image from "next/image";
import { LeadVideo } from "@/components/lead-video";

type LeadMediaProps = {
  cover: string;
  alt: string;
  clip?: string;
  width?: number;
  height?: number;
};

export function LeadMedia({ cover, alt, clip, width = 2000, height = 1200 }: LeadMediaProps) {
  return (
    <figure className="case-lead-media">
      {clip ? (
        <LeadVideo clip={clip} poster={cover} alt={alt} />
      ) : (
        <Image
          className="case-lead-img"
          src={cover}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 760px) 100vw, min(90vw, 900px)"
          priority
        />
      )}
    </figure>
  );
}
