import { describe, expect, it } from "vitest";
import {
  FRESH_GREENS_REMINDER_EVIDENCE_SURFACE,
  NAVI_DEMO_EVIDENCE_SURFACE,
  NAVI_RESEARCH_EVIDENCE_SURFACE,
  PROJECT_EVIDENCE_MAP,
  TIKTOK_DIRECTION_EVIDENCE_SURFACE,
  type EvidenceSurfaceMetadata,
} from "@/lib/project-evidence";
import type { ProjectChapterVariant } from "@/lib/project-chapters";

function projectProof(project: ProjectChapterVariant, proofId: string) {
  return PROJECT_EVIDENCE_MAP[project]
    .flatMap(({ proofs }) => proofs)
    .find(({ id }) => id === proofId);
}

describe("Reader evidence surfaces", () => {
  it.each([
    {
      project: "fresh-greens",
      surface: FRESH_GREENS_REMINDER_EVIDENCE_SURFACE,
    },
    { project: "navi", surface: NAVI_RESEARCH_EVIDENCE_SURFACE },
    { project: "navi", surface: NAVI_DEMO_EVIDENCE_SURFACE },
    { project: "tiktok", surface: TIKTOK_DIRECTION_EVIDENCE_SURFACE },
  ] as const)(
    "matches $surface.proofId to the typed $project map",
    ({ project, surface }: {
      project: ProjectChapterVariant;
      surface: EvidenceSurfaceMetadata;
    }) => {
      expect(projectProof(project, surface.proofId)).toMatchObject({
        id: surface.proofId,
        role: surface.role,
        kind: surface.kind,
        surfaceChapterId: surface.chapterId,
      });
    },
  );
});
