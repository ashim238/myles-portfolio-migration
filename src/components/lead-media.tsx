import Image from "next/image";
import { LeadVideo } from "@/components/lead-video";
import {
  evidenceSurfaceData,
  orientationSurfaceData,
  type EvidenceSurfaceMetadata,
} from "@/lib/project-evidence";

type LeadMediaProps = {
  cover: string;
  alt: string;
  clip?: string;
  width: number;
  height: number;
  presentation?: "default" | "fresh-greens";
  evidence?: EvidenceSurfaceMetadata;
};

export function LeadMedia({
  cover,
  alt,
  clip,
  width,
  height,
  presentation = "default",
  evidence,
}: LeadMediaProps) {
  const presentationClass =
    presentation === "default" ? "" : ` case-lead-media--${presentation}`;
  const surfaceData = evidence
    ? {
        ...orientationSurfaceData("lead-media"),
        ...evidenceSurfaceData(evidence),
      }
    : orientationSurfaceData("lead-media");

  return (
    <figure
      className={`case-lead-media${presentationClass}`}
      data-project-enter-cover
      {...surfaceData}
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
          sizes="(max-width: 760px) 100vw, min(90vw, 900px)"
          priority
        />
      )}
    </figure>
  );
}
