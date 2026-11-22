import Image from "next/image";
import { LeadVideo } from "@/components/lead-video";

type LeadMediaProps = {
  cover: string;
  smallCover?: string;
  alt: string;
  clip?: string;
  width: number;
  height: number;
  children?: React.ReactNode;
  presentation?: "default" | "fresh-greens" | "story";
};

export function LeadMedia({
  cover,
  smallCover,
  alt,
  clip,
  width,
  height,
  presentation = "default",
  children,
}: LeadMediaProps) {
  const presentationClass =
    presentation === "default" ? "" : ` case-lead-media--${presentation}`;

  return (
    <figure
      className={`case-lead-media${presentationClass}`} data-prepared-cover={Boolean(smallCover) || undefined}
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
      ) : smallCover ? (
        <picture>
          <source srcSet={`${smallCover} 640w, ${cover} 1280w`}
            sizes="(max-width: 1079px) min(90vw, 688px), (max-width: 1399px) 46vw, 584px" />
          <Image className="case-lead-img" src={cover} alt={alt} width={width} height={height}
            unoptimized loading="eager" fetchPriority="high" />
        </picture>
      ) : (
        <Image
          className="case-lead-img"
          src={cover}
          alt={alt}
          width={width}
          height={height}
          // Match .page-shell's 1.4rem side padding and .case-lead-media's 90% desktop width.
          sizes="(max-width: 760px) calc(100vw - 44.8px), calc(90vw - 40.32px)"
          loading="eager"
          priority
        />
      )}
      {children}
    </figure>
  );
}
