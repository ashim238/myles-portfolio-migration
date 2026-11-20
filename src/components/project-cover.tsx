import { ExpandableImage } from "@/components/expandable-image";

import { readImageDimensions } from "@/lib/content";

type ProjectCoverProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/** Shared cover band — homepage zoom transition settles onto the explicit cover marker. */
export async function ProjectCover({ src, alt, priority = false }: ProjectCoverProps) {
  const { width, height } = await readImageDimensions(src);
  return (
    <div className="project-cover" data-project-enter-cover>
      <ExpandableImage
        className="project-cover-image"
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 768px) 100vw, 1090px"
      />
    </div>
  );
}
