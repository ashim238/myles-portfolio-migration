"use client";

import type { Project } from "@/lib/content";

type WorkShowcaseRailProps = {
  projects: Project[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function WorkShowcaseRail({
  projects,
  activeIndex,
  onSelect,
}: WorkShowcaseRailProps) {
  if (projects.length < 2) {
    return null;
  }

  return (
    <nav className="work-showcase-rail" aria-label="Work index">
      <ol className="work-showcase-rail-list" role="list">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <button
              type="button"
              className={`work-showcase-rail-button${index === activeIndex ? " work-showcase-rail-button--active" : ""}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => onSelect(index)}
            >
              <span className="work-showcase-rail-index">{formatIndex(index)}</span>
              <span className="work-showcase-rail-title">{project.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
