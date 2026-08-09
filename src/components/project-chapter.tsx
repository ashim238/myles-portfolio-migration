import type { ReactNode } from "react";
import {
  READER_EVIDENCE_MAPS,
  getEvidenceStateLabel,
  type ChapterEvidenceMap,
} from "@/lib/reader-evidence";
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

function findChapterEvidence(
  variant: ProjectChapterVariant,
  chapterId: string,
): ChapterEvidenceMap | undefined {
  const chapters = READER_EVIDENCE_MAPS[variant]
    .chapters as readonly ChapterEvidenceMap[];

  return chapters.find((chapter) => chapter.chapterId === chapterId);
}

export function ProjectChapter({
  entry,
  index,
  total,
  variant,
  children,
}: ProjectChapterProps) {
  const evidence = findChapterEvidence(variant, entry.id);
  const evidenceStateLabel = evidence
    ? getEvidenceStateLabel(evidence.evidenceState)
    : null;

  return (
    <section
      className="project-chapter"
      aria-labelledby={entry.id}
      data-chapter-index={index}
      data-chapter-variant={variant}
      data-claim-class={evidence?.claimClass}
      data-evidence-state={evidence?.evidenceState}
      data-dominant-proof={evidence?.dominantProof.id}
    >
      <p className="project-chapter-meta">
        <span className="project-chapter-meta-primary">
          <span className="project-chapter-stage">{entry.stage}</span>
          {evidenceStateLabel ? (
            <span className="project-chapter-evidence-state">
              <span className="sr-only">Evidence state: </span>
              {evidenceStateLabel}
            </span>
          ) : null}
        </span>
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
