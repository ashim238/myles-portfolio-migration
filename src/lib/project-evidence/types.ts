import type { ProjectChapterVariant } from "@/lib/project-chapters";

export type EvidenceClaimClass =
  | "descriptive"
  | "behavioral"
  | "interpretive"
  | "outcome"
  | "causal";

export type EvidenceState =
  | "built"
  | "shipped"
  | "observed"
  | "proposed"
  | "needs-proof";

export type EvidenceProofKind =
  | "narrative"
  | "reference"
  | "image"
  | "comparison"
  | "structured"
  | "interactive"
  | "sequence"
  | "metric"
  | "working-product"
  | "scope-ledger";

export type EvidenceProofRole = "dominant" | "supporting";
export type EvidenceSurfaceRole = EvidenceProofRole | "orientation";

export type ProjectEvidenceClaim = {
  readonly id: string;
  readonly text: string;
  readonly class: EvidenceClaimClass;
  readonly state: EvidenceState;
  readonly reopenWhen?: string;
};

export type ProjectEvidenceProof = {
  readonly id: string;
  readonly label: string;
  readonly kind: EvidenceProofKind;
  readonly role: EvidenceProofRole;
  readonly surface: string;
  readonly surfaceChapterId: string;
  readonly job: string;
  readonly proves: string;
  readonly limitation: string;
  readonly placementNote?: string;
};

export type EvidenceSurfaceMetadata = {
  readonly proofId: ProjectEvidenceProof["id"];
  readonly role: ProjectEvidenceProof["role"];
  readonly kind: ProjectEvidenceProof["kind"];
  readonly chapterId: ProjectEvidenceProof["surfaceChapterId"];
};

export type ProjectChapterEvidence = {
  readonly chapterId: string;
  readonly dominantClaim: ProjectEvidenceClaim;
  readonly interpretation: string;
  readonly caveat: string;
  readonly proofs: readonly ProjectEvidenceProof[];
};

export type ProjectEvidenceMap = Record<
  ProjectChapterVariant,
  readonly ProjectChapterEvidence[]
>;
