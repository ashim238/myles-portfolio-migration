import type { Project } from "@/lib/content";
import { WorkProjectCard } from "@/components/work-project-card";
import { GalleryReveal } from "@/components/gallery-reveal";

type WorkGalleryProps = { projects: Project[] };

/**
 * Visual-first work gallery: one equal grid whose source order carries the
 * hierarchy. The "working file" signature (mono head/foot, hairline rules,
 * entrance cascade) stays intact. Content is visible by default;
 * GalleryReveal only plays keyframes over it.
 */
export function WorkGallery({ projects }: WorkGalleryProps) {
  if (projects.length === 0) {
    return <p className="work-out">No published projects yet.</p>;
  }

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

      <div className="work-gallery-grid">
        {projects.map((project, index) => (
          <WorkProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>

      <div className="work-gallery-rule wg-anim" style={{ ["--d" as string]: "1.02s" }} />
      <div className="work-gallery-foot wg-anim wg-tick" style={{ ["--d" as string]: "1.1s" }}>
        <span>end · selected work</span>
        <span>baseline · 8pt</span>
      </div>
      <GalleryReveal />
    </div>
  );
}
