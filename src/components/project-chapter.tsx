import { Children, Fragment, type ReactNode } from "react";
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

// Each featured summary follows the top-level child that owns its dominant
// proof. This keeps interpretation beside the artifact without imposing shared
// visual chrome on project-specific compositions.
const FEATURED_EVIDENCE_PLACEMENTS = new Map<string, number>([
  ["navi-research-artifacts", 0],
  ["navi-booking-demo", 1],
  ["fresh-greens-route-comparison", 0],
  ["fresh-greens-report-route-influence", 0],
  ["fafsa-composer-demo", 0],
  ["fafsa-figma-mailchimp", 0],
  ["tiktok-template-system", 0],
  ["tiktok-light-academia-sequence", 0],
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
  const hasRedundantVisibleEvidenceState = Boolean(
    evidenceStateLabel &&
      entry.stage.toLocaleLowerCase() === "build" &&
      evidenceStateLabel.toLocaleLowerCase() === "built",
  );
  const chapterChildren = Children.toArray(children);
  const summaryAfterChildIndex = evidence
    ? FEATURED_EVIDENCE_PLACEMENTS.get(evidence.dominantProof.id)
    : undefined;
  const showEvidenceSummary = Boolean(
    evidence &&
      summaryAfterChildIndex !== undefined &&
      summaryAfterChildIndex >= 0 &&
      summaryAfterChildIndex < chapterChildren.length,
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
          {evidenceStateLabel && !hasRedundantVisibleEvidenceState ? (
            <span className="project-chapter-evidence-state">
              <span className="sr-only">Evidence state: </span>
              {evidenceStateLabel}
            </span>
          ) : null}
          {evidenceStateLabel && hasRedundantVisibleEvidenceState ? (
            <span className="sr-only">Evidence state: {evidenceStateLabel}</span>
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
      {chapterChildren.map((child, childIndex) => (
        <Fragment key={childIndex}>
          {child}
          {evidence &&
          showEvidenceSummary &&
          childIndex === summaryAfterChildIndex ? (
            <EvidenceSummary evidence={evidence} />
          ) : null}
        </Fragment>
      ))}
    </section>
  );
}
