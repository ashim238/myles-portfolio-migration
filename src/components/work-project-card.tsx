"use client";

import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/home-intro";
import { dispatchProjectEnterRequest } from "@/lib/project-enter";
import { getProjectMetricPhrases } from "@/lib/work-showcase-metrics";
import { WorkShowcaseMetric } from "@/components/work-showcase-metric";

type WorkProjectCardProps = {
  project: Project;
  index: number;
  isActive?: boolean;
  focusDistance?: number;
};

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function WorkProjectCard({
  project,
  index,
  isActive = false,
  focusDistance = 0,
}: WorkProjectCardProps) {
  const reverse = index % 2 === 1;
  const featured = index === 0;
  const metricPhrases = getProjectMetricPhrases(project);

  const handleProjectEnter = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      prefersReducedMotion() ||
      !project.coverImage
    ) {
      return;
    }

    const frame = event.currentTarget.querySelector<HTMLElement>(".work-showcase-media-frame");
    if (!frame) return;

    event.preventDefault();

    const rect = frame.getBoundingClientRect();
    dispatchProjectEnterRequest({
      slug: project.slug,
      href: `/work/${project.slug}`,
      rect: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
      },
      imageSrc: project.coverImage,
      imageAlt: `${project.title} preview`,
      borderRadius: getComputedStyle(frame).borderRadius,
    });
  };

  return (
    <li
      id={`work-${project.slug}`}
      data-project-index={index}
      data-active={isActive ? "true" : undefined}
      data-focus-distance={focusDistance > 0 ? String(focusDistance) : undefined}
      className={`work-item work-showcase-item${reverse ? " work-showcase-item--reverse" : ""}${featured ? " work-showcase-item--featured" : ""}`}
    >
      <Link
        className="work-showcase-link"
        href={`/work/${project.slug}`}
        onClick={handleProjectEnter}
      >
        <div className="work-showcase-copy">
          <span className="work-showcase-index" aria-hidden="true">
            {formatIndex(index)}
          </span>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <WorkShowcaseMetric phrases={metricPhrases} isActive={isActive} />
          <div className="work-showcase-meta">
            {project.timeframe ? (
              <span className="work-showcase-meta-item">{project.timeframe}</span>
            ) : null}
            {project.role ? (
              <span className="work-showcase-meta-item">{project.role}</span>
            ) : null}
          </div>
          {project.tags.length > 0 && (
            <div className="work-showcase-tags">
              {project.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="work-showcase-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {project.coverImage ? (
          <div className="work-showcase-media">
            <div className="work-showcase-media-stack" aria-hidden="true" />
            <div className="work-showcase-media-frame">
              <Image
                className="work-showcase-image"
                src={project.coverImage}
                alt={`${project.title} preview`}
                width={1400}
                height={900}
                sizes="(max-width: 768px) 100vw, min(52vw, 640px)"
                priority={featured}
              />
            </div>
          </div>
        ) : null}
      </Link>
    </li>
  );
}
