import Image from "next/image";
import {
  iconForProgram,
  Myles97Icon,
} from "@/components/myles-97/icons";
import { TikTokCoverBlobs } from "@/components/tiktok-dsa";
import { TransitionLink } from "@/components/transition-link";
import type { Project } from "@/lib/content";
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
  const nextIcon = next ? iconForProgram(next.project.slug) : "app";

  return (
    <section
      className="project-work-jump"
      aria-labelledby="project-work-jump-heading"
    >
      {next ? (
        <TransitionLink
          className="project-work-jump-card"
          href={`/work/${next.project.slug}`}
          data-next-project={next.project.slug}
        >
          <span className="project-work-jump-chrome">
            <span className="project-work-jump-window-title">
              <Myles97Icon name={nextIcon} size={18} />
              <span>Next project</span>
            </span>
            <span className="project-work-jump-window-action">Open</span>
          </span>

          <span className="project-work-jump-body">
            <span className="project-work-jump-text">
              <span className="project-work-jump-label">Selected Work</span>
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
                Open case study <span aria-hidden="true">→</span>
              </span>
            </span>

            <span className="project-work-jump-media" aria-hidden="true">
              {next.project.slug === "tiktok" ? (
                <span className="project-work-jump-tiktok tt-cover--preview">
                  <TikTokCoverBlobs deferUntilVisible />
                </span>
              ) : next.project.coverImage ? (
                <Image
                  src={next.project.coverImage}
                  alt=""
                  width={1400}
                  height={933}
                  sizes="(max-width: 760px) 100vw, 52vw"
                />
              ) : (
                <span className="project-work-jump-placeholder">
                  <Myles97Icon name={nextIcon} size={52} variant="color" />
                  <span>{next.project.title}</span>
                </span>
              )}
            </span>
          </span>

          <span className="project-work-jump-status">
            <span>
              Myles 98 / Selected Work / {next.project.title}
            </span>
            <span>Case study</span>
          </span>
        </TransitionLink>
      ) : (
        <h2 id="project-work-jump-heading" className="sr-only">
          More portfolio work
        </h2>
      )}
      <TransitionLink
        className="project-work-jump-view-all"
        href="/#selected-work"
      >
        <Myles97Icon name="folder" size={16} />
        Return to Selected Work <span aria-hidden="true">→</span>
      </TransitionLink>
    </section>
  );
}
