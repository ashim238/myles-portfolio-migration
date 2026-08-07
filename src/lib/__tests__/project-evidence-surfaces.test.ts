import { describe, expect, it } from "vitest";
import {
  NAVI_DEMO_EVIDENCE_SURFACE,
  NAVI_RESEARCH_EVIDENCE_SURFACE,
  PROJECT_EVIDENCE_MAP,
  type EvidenceSurfaceMetadata,
} from "@/lib/project-evidence";

function naviProof(proofId: string) {
  return PROJECT_EVIDENCE_MAP.navi
    .flatMap(({ proofs }) => proofs)
    .find(({ id }) => id === proofId);
}

describe("Reader evidence surfaces", () => {
  it.each([
    NAVI_RESEARCH_EVIDENCE_SURFACE,
    NAVI_DEMO_EVIDENCE_SURFACE,
  ])(
    "matches $proofId to the typed project map",
    (surface: EvidenceSurfaceMetadata) => {
      expect(naviProof(surface.proofId)).toMatchObject({
        id: surface.proofId,
        role: surface.role,
        kind: surface.kind,
        surfaceChapterId: surface.chapterId,
      });
    },
  );
});
