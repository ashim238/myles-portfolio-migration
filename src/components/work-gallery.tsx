import type { Project } from "@/lib/content";
import { WorkProjectCard } from "@/components/work-project-card";
import { GalleryReveal } from "@/components/gallery-reveal";

type WorkGalleryProps = { projects: Project[] };

/**
 * Visual-first work gallery: one full-width featured cover, then a 2-up pair.
 * Carries the "working file" signature (mono head/foot, hairline rules,
 * entrance cascade). Content is visible by default; GalleryReveal only plays
 * keyframes over it.
 */
export function WorkGallery({ projects }: WorkGalleryProps) {
  if (projects.length === 0) {
    return <p className="work-out">No published projects yet.</p>;
  }
  const [featured, ...rest] = projects;

  return (
    <div className="work-gallery" id="work-gallery">
      <div className="work-gallery-head">
        <span className="wg-anim wg-tick" style={{ ["--d" as string]: ".02s" }}>
          {String(projects.length).padStart(2, "0")} / projects
        </span>
        <span className="wg-anim wg-tick" style={{ ["--d" as string]: ".06s" }}>
          working file
        </span>
      </div>
      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: ".12s" }} />

      <WorkProjectCard project={featured} index={0} featured />

      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: ".66s" }} />

      {rest.length > 0 ? (
        <div className="work-gallery-pair">
          {rest.map((project, i) => (
            <WorkProjectCard key={project.slug} project={project} index={i + 1} />
          ))}
        </div>
      ) : null}

      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: "1.02s" }} />
      <div className="work-gallery-foot wg-anim wg-tick" style={{ ["--d" as string]: "1.1s" }}>
        <span>end · selected work</span>
        <span>baseline · 8pt</span>
      </div>
      <GalleryReveal />
    </div>
  );
}
