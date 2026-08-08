import { FRESH_GREENS_EVIDENCE } from "@/lib/project-evidence/fresh-greens";
import { NAVI_EVIDENCE } from "@/lib/project-evidence/navi";
import { TIKTOK_EVIDENCE } from "@/lib/project-evidence/tiktok";
import type { ProjectEvidenceMap } from "@/lib/project-evidence/types";
import { UNDERSTANDING_FAFSA_EVIDENCE } from "@/lib/project-evidence/understandingfafsa";

export {
  evidenceSurfaceData,
  NAVI_DEMO_EVIDENCE_SURFACE,
  NAVI_RESEARCH_EVIDENCE_SURFACE,
  orientationSurfaceData,
  TIKTOK_DIRECTION_EVIDENCE_SURFACE,
} from "@/lib/project-evidence/surfaces";

export type {
  EvidenceClaimClass,
  EvidenceProofKind,
  EvidenceProofRole,
  EvidenceState,
  EvidenceSurfaceMetadata,
  EvidenceSurfaceRole,
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
