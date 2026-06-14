import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/content";

type WorkProjectCardProps = {
  project: Project;
  index: number;
};

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function WorkProjectCard({ project, index }: WorkProjectCardProps) {
  const reverse = index % 2 === 1;
  const featured = index === 0;

  return (
    <li
      className={`work-item work-showcase-item${reverse ? " work-showcase-item--reverse" : ""}${featured ? " work-showcase-item--featured" : ""}`}
    >
      <Link className="work-showcase-link" href={`/work/${project.slug}`}>
        <div className="work-showcase-copy">
          <span className="work-showcase-index" aria-hidden="true">
            {formatIndex(index)}
          </span>
          <h3>{project.title}</h3>
          <p>{project.summary}</p>
          <div className="work-showcase-meta">
            {project.timeframe ? (
              <span className="work-showcase-meta-item">{project.timeframe}</span>
            ) : null}
            {project.role ? (
              <span className="work-showcase-meta-item">{project.role}</span>
            ) : null}
            {project.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="work-showcase-tag">
                {tag}
              </span>
            ))}
          </div>
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
