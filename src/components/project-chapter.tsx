import type { ReactNode } from "react";
import {
  EvidenceSummary,
  evidenceSummaryIdFor,
} from "@/components/evidence-summary";
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

// Phase one proves the shared reading grammar at materially different
// structured-data, interaction, and comparison callsites. The artifacts keep
// their project-owned composition; only the interpretation pattern is shared.
const FEATURED_EVIDENCE_PROOFS = new Set([
  "navi-research-artifacts",
  "navi-booking-demo",
  "fafsa-composer-demo",
  "fafsa-figma-mailchimp",
]);

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
  const showEvidenceSummary = Boolean(
    evidence && FEATURED_EVIDENCE_PROOFS.has(evidence.dominantProof.id),
  );
  const evidenceSummaryId =
    evidence && showEvidenceSummary ? evidenceSummaryIdFor(evidence) : undefined;

  return (
    <section
      className="project-chapter"
      aria-labelledby={entry.id}
      aria-describedby={evidenceSummaryId}
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
      {evidence && showEvidenceSummary ? (
        <EvidenceSummary evidence={evidence} />
      ) : null}
    </section>
  );
}
