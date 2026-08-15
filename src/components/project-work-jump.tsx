import Image from "next/image";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";
import { TransitionLink } from "@/components/transition-link";
import type { Project } from "@/lib/content";
import { PROJECT_PROGRAM_BLUEPRINTS } from "@/lib/myles-97/programs";
import { resolveNextProject } from "@/lib/project-sequence";

type ProjectWorkJumpProps = {
  currentSlug: string;
  projects: readonly Project[];
};

export function ProjectWorkJump({
  currentSlug,
  projects,
}: ProjectWorkJumpProps) {
  const next = resolveNextProject(currentSlug, projects);
  const publishedProjects = projects.filter(
    (project) => project.status === "published",
  );
  const nextPosition = next
    ? publishedProjects.findIndex((project) => project.slug === next.project.slug) + 1
    : 0;
  const nextAppName = next
    ? PROJECT_PROGRAM_BLUEPRINTS.find(
        (program) => program.id === next.project.slug,
      )?.appName ?? next.project.title
    : "";

  return (
    <section
      className="project-work-jump"
      aria-labelledby="project-work-jump-heading"
    >
      {next ? (
        <div
          className="project-work-jump-window"
          role="group"
          aria-label={`Next project: ${next.project.title}`}
          data-m98-next-project-window={next.project.slug}
        >
          <div className="project-work-jump-window-titlebar" aria-hidden="true">
            <Myles97Icon
              name={iconForProgram(next.project.slug)}
              size={16}
              compact
              variant="color"
            />
            <strong>{nextAppName}</strong>
            <span>Up next</span>
          </div>

          <div className="project-work-jump-window-content">
            <TransitionLink
              className="project-work-jump-card"
              href={`/work/${next.project.slug}`}
              data-next-project={next.project.slug}
            >
              <span className="project-work-jump-text">
                <span className="project-work-jump-label">Next project</span>
                <h2
                  id="project-work-jump-heading"
                  className="project-work-jump-title"
                >
                  {next.project.slug === "understandingfafsa" ? (
                    <>
                      Understanding<wbr />FAFSA
                    </>
                  ) : (
                    next.project.title
                  )}
                </h2>
                <span className="project-work-jump-bridge">{next.bridge}</span>
                <span className="project-work-jump-cta">
                  Read case study <span aria-hidden="true">→</span>
                </span>
              </span>
              <span className="project-work-jump-media" aria-hidden="true">
                {next.project.coverImage ? (
                  <Image
                    src={next.project.coverImage}
                    alt=""
                    width={1400}
                    height={933}
                    sizes="(max-width: 760px) 100vw, 52vw"
                  />
                ) : null}
              </span>
            </TransitionLink>
          </div>

          <div className="project-work-jump-window-status">
            <span className="project-work-jump-position" aria-hidden="true">
              <span className="project-work-jump-position--full">
                {nextPosition} of {publishedProjects.length} portfolio programs
              </span>
              <span className="project-work-jump-position--compact">
                {nextPosition} / {publishedProjects.length}
              </span>
            </span>
            <TransitionLink className="project-work-jump-view-all" href="/#work">
              View all work <span aria-hidden="true">→</span>
            </TransitionLink>
          </div>
        </div>
      ) : (
        <>
          <h2 id="project-work-jump-heading" className="sr-only">
            More portfolio work
          </h2>
          <TransitionLink className="project-work-jump-view-all" href="/#work">
            View all work <span aria-hidden="true">→</span>
          </TransitionLink>
        </>
      )}
    </section>
  );
}
