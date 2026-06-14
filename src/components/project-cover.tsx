import { ExpandableImage } from "@/components/expandable-image";

type ProjectCoverProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Shared cover band — homepage zoom transition settles onto `.project-cover-image`. */
export function ProjectCover({ src, alt, priority = false }: ProjectCoverProps) {
  return (
    <div className="project-cover">
      <ExpandableImage
        className="project-cover-image"
        src={src}
        alt={alt}
        width={1400}
        height={900}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 1090px"
      />
    </div>
  );
}
