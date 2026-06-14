import { ExpandableImage } from "@/components/expandable-image";
import { ProjectSection } from "@/lib/content";
import { ColorPalette } from "@/components/color-palette";

type ProjectSectionCardProps = {
  section: ProjectSection;
  projectTitle: string;
  id?: string;
};

export function ProjectSectionCard({ section, projectTitle, id }: ProjectSectionCardProps) {
  return (
    <article className="project-section" id={id}>
      <h2>{section.title}</h2>
      <div
        className="project-section-body"
        dangerouslySetInnerHTML={{ __html: section.bodyHtml }}
      />
      {section.colors && section.colors.length > 0 ? (
        <ColorPalette colors={section.colors} />
      ) : null}
      {section.images.length > 0 ? (
        <div className="project-section-images">
          {section.images.map((image) => (
            <ExpandableImage
              key={image.src}
              className="project-section-image"
              src={image.src}
              alt={image.alt ?? `${projectTitle} - ${section.title}`}
              width={1400}
              height={900}
            />
          ))}
        </div>
      ) : null}
    </article>
  );
}
