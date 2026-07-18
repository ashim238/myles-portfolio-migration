import { ExpandableImage } from "@/components/expandable-image";
import { ProjectSection } from "@/lib/content";
import { ColorPalette } from "@/components/color-palette";

type ProjectSectionCardProps = {
  section: ProjectSection;
  projectTitle: string;
  id?: string;
};

/**
 * Aspect-ratio thresholds:
 * - <= 0.33 (taller than 3x wide): "tall" screenshot. Render inside a
 *   scrollable frame so a 15,000px-tall newsletter doesn't dominate the page.
 *   Click still opens the lightbox at full size.
 * - >  0.33 and <= 0.85: portrait. Constrain to a reasonable max display
 *   height so it doesn't overpower the page.
 * - >  0.85: landscape / square. Render full column width.
 */
const TALL_THRESHOLD = 0.33;
const PORTRAIT_THRESHOLD = 0.85;

function variantForAspect(width: number, height: number): "tall" | "portrait" | "landscape" {
  const aspect = width / height;
  if (aspect <= TALL_THRESHOLD) return "tall";
  if (aspect <= PORTRAIT_THRESHOLD) return "portrait";
  return "landscape";
}

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
          {section.images.map((image) => {
            const variant = variantForAspect(image.width, image.height);
            if (variant === "tall") {
              return (
                <figure
                  key={image.src}
                  className="project-section-image-frame project-section-image-frame--tall"
                >
                  <div
                    className="project-section-image-scroll"
                    role="region"
                    tabIndex={0}
                    aria-label={`Scrollable preview: ${image.alt ?? section.title}. Click image to expand.`}
                  >
                    <ExpandableImage
                      className="project-section-image project-section-image--tall"
                      src={image.src}
                      alt={image.alt ?? `${projectTitle} - ${section.title}`}
                      width={image.width}
                      height={image.height}
                      sizes="(max-width: 900px) 92vw, 720px"
                    />
                  </div>
                  <figcaption className="project-section-image-hint">
                    Scroll within the frame · click to expand
                  </figcaption>
                </figure>
              );
            }
            return (
              <ExpandableImage
                key={image.src}
                className={`project-section-image project-section-image--${variant}`}
                src={image.src}
                alt={image.alt ?? `${projectTitle} - ${section.title}`}
                width={image.width}
                height={image.height}
                sizes={variant === "portrait" ? "(max-width: 900px) 80vw, 420px" : "(max-width: 900px) 92vw, 1090px"}
              />
            );
          })}
        </div>
      ) : null}
    </article>
  );
}
