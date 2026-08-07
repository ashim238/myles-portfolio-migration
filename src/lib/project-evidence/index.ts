import { FRESH_GREENS_EVIDENCE } from "@/lib/project-evidence/fresh-greens";
import { NAVI_EVIDENCE } from "@/lib/project-evidence/navi";
import { TIKTOK_EVIDENCE } from "@/lib/project-evidence/tiktok";
import type { ProjectEvidenceMap } from "@/lib/project-evidence/types";
import { UNDERSTANDING_FAFSA_EVIDENCE } from "@/lib/project-evidence/understandingfafsa";

export type {
  EvidenceClaimClass,
  EvidenceProofKind,
  EvidenceProofRole,
  EvidenceState,
  ProjectChapterEvidence,
  ProjectEvidenceClaim,
  ProjectEvidenceMap,
  ProjectEvidenceProof,
} from "@/lib/project-evidence/types";

export const PROJECT_EVIDENCE_MAP: ProjectEvidenceMap = {
  navi: NAVI_EVIDENCE,
  "fresh-greens": FRESH_GREENS_EVIDENCE,
  understandingfafsa: UNDERSTANDING_FAFSA_EVIDENCE,
  tiktok: TIKTOK_EVIDENCE,
};
