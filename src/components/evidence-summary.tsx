import type { ChapterEvidenceMap } from "@/lib/reader-evidence";

type EvidenceSummaryProps = {
  evidence: ChapterEvidenceMap;
};

export function evidenceSummaryIdFor(evidence: ChapterEvidenceMap): string {
  return `reader-evidence-${evidence.dominantProof.id}-summary`;
}

export function EvidenceSummary({ evidence }: EvidenceSummaryProps) {
  const summaryId = evidenceSummaryIdFor(evidence);

  return (
    <div
      id={summaryId}
      className="reader-evidence-summary"
      data-evidence-for={evidence.dominantProof.id}
      data-evidence-kind={evidence.dominantProof.kind}
      data-evidence-state={evidence.evidenceState}
    >
      <p className="reader-evidence-summary-row">
        <span className="reader-evidence-summary-label">What this shows</span>
        <span>{evidence.interpretation}</span>
      </p>
      {evidence.caveat ? (
        <p
          className="reader-evidence-summary-row"
          data-evidence-summary-row="boundary"
        >
          <span className="reader-evidence-summary-label">Boundary</span>
          <span>{evidence.caveat}</span>
        </p>
      ) : null}
    </div>
  );
}
