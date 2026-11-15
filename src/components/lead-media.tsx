import Image from "next/image";
import { LeadVideo } from "@/components/lead-video";

type LeadMediaProps = {
  cover: string;
  alt: string;
  clip?: string;
  width: number;
  height: number;
  presentation?: "default" | "fresh-greens";
};

export function LeadMedia({
  cover,
  alt,
  clip,
  width,
  height,
  presentation = "default",
}: LeadMediaProps) {
  const presentationClass =
    presentation === "default" ? "" : ` case-lead-media--${presentation}`;

  return (
    <figure
      className={`case-lead-media${presentationClass}`}
      data-project-enter-cover
    >
      {clip ? (
        <LeadVideo
          clip={clip}
          poster={cover}
          alt={alt}
          width={width}
          height={height}
        />
      ) : (
        <Image
          className="case-lead-img"
          src={cover}
          alt={alt}
          width={width}
          height={height}
          sizes="(max-width: 760px) calc(100vw - 44.8px), calc(90vw - 40.32px)"
          loading="eager"
          priority
        />
      )}
    </figure>
  );
}
