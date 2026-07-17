import type { ReactNode } from "react";
import type {
  ProjectChapterEntry,
  ProjectChapterVariant,
} from "@/lib/project-chapters";

type ProjectChapterProps = {
  entry: ProjectChapterEntry;
  index: number;
  total: number;
  variant: ProjectChapterVariant;
  children: ReactNode;
};

export function ProjectChapter({
  entry,
  index,
  total,
  variant,
  children,
}: ProjectChapterProps) {
  return (
    <section
      className="project-chapter"
      aria-labelledby={entry.id}
      data-chapter-index={index}
      data-chapter-variant={variant}
    >
      <p className="project-chapter-meta">
        <span className="project-chapter-stage">{entry.stage}</span>
        <span className="project-chapter-count">
          {index} of {total}
        </span>
      </p>
      <h2 id={entry.id} className="project-chapter-title">
        {entry.title}
      </h2>
      <span className="project-chapter-motif" aria-hidden="true">
        <span className="project-chapter-motif-line" />
        <span className="project-chapter-motif-point project-chapter-motif-point--start" />
        <span className="project-chapter-motif-point project-chapter-motif-point--end" />
      </span>
      {children}
    </section>
  );
}
