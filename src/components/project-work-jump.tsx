import Image from "next/image";
import type { Project } from "@/lib/content";
import { TransitionLink } from "@/components/transition-link";

type ProjectWorkJumpProps = {
  currentSlug: string;
  projects: Project[];
};

export function ProjectWorkJump({ currentSlug, projects }: ProjectWorkJumpProps) {
  const others = projects.filter((p) => p.slug !== currentSlug);

  if (others.length === 0) {
    return null;
  }

  return (
    <section className="project-work-jump" aria-labelledby="project-work-jump-heading">
      <h2 id="project-work-jump-heading">More work</h2>
      <ul className="project-work-jump-list" role="list">
        {others.map((project) => (
          <li key={project.slug}>
            <TransitionLink className="project-work-jump-card" href={`/work/${project.slug}`}>
              <div className="project-work-jump-text">
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                {project.status === "draft" ? (
                  <span className="project-work-jump-draft">Draft</span>
                ) : null}
              </div>
              {project.coverImage ? (
                <Image
                  className="project-work-jump-thumb"
                  src={project.coverImage}
                  alt={`${project.title} preview`}
                  width={560}
                  height={360}
                  sizes="(max-width: 639px) 100vw, 200px"
                />
              ) : null}
            </TransitionLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
