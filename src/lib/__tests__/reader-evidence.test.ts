import { describe, expect, it } from "vitest";
import {
  CASE_STUDY_CHAPTERS,
  type ProjectChapterVariant,
} from "@/lib/project-chapters";
import {
  CLAIM_CLASSES,
  EVIDENCE_ARTIFACT_KINDS,
  EVIDENCE_STATES,
  READER_EVIDENCE_MAPS,
  getChapterEvidence,
  type ChapterEvidenceMap,
} from "@/lib/reader-evidence";

const projects = Object.keys(
  CASE_STUDY_CHAPTERS,
) as ProjectChapterVariant[];

function allChapters(): ChapterEvidenceMap[] {
  return projects.flatMap(
    (project) =>
      READER_EVIDENCE_MAPS[project]
        .chapters as readonly ChapterEvidenceMap[],
  );
}

describe("Reader evidence maps", () => {
  it("maps every case-study chapter exactly once and in reading order", () => {
    for (const project of projects) {
      const expectedIds = CASE_STUDY_CHAPTERS[project].map(({ id }) => id);
      const mappedIds = (
        READER_EVIDENCE_MAPS[project]
          .chapters as readonly ChapterEvidenceMap[]
      ).map(({ chapterId }) => chapterId);

      expect(mappedIds).toEqual(expectedIds);
      expect(new Set(mappedIds).size).toBe(mappedIds.length);
      expect(READER_EVIDENCE_MAPS[project].project).toBe(project);
      expect(READER_EVIDENCE_MAPS[project].portfolioSignal.trim()).not.toBe("");
    }

    expect(allChapters()).toHaveLength(20);
  });

  it("keeps every dominant claim, proof, and interpretation inspectable", () => {
    for (const chapter of allChapters()) {
      expect(chapter.dominantClaim.trim()).not.toBe("");
      expect(chapter.interpretation.trim()).not.toBe("");
      expect(CLAIM_CLASSES).toContain(chapter.claimClass);
      expect(EVIDENCE_STATES).toContain(chapter.evidenceState);
      expect(EVIDENCE_ARTIFACT_KINDS).toContain(chapter.dominantProof.kind);
      expect(chapter.dominantProof.id.trim()).not.toBe("");
      expect(chapter.dominantProof.label.trim()).not.toBe("");

      const proofs = [
        chapter.dominantProof,
        ...(chapter.supportingProofs ?? []),
      ];
      expect(new Set(proofs.map(({ id }) => id)).size).toBe(proofs.length);

      for (const proof of proofs) {
        expect(EVIDENCE_ARTIFACT_KINDS).toContain(proof.kind);
        expect(proof.id.trim()).not.toBe("");
        expect(proof.label.trim()).not.toBe("");
      }
    }
  });

  it("requires an explicit limitation for needs-proof and causal claims", () => {
    for (const chapter of allChapters()) {
      if (
        chapter.evidenceState === "needs-proof" ||
        chapter.claimClass === "causal"
      ) {
        expect(chapter.caveat?.trim().length ?? 0).toBeGreaterThan(0);
      }
    }
  });

  it("does not currently overstate any portfolio claim as causal", () => {
    expect(
      allChapters().filter(({ claimClass }) => claimClass === "causal"),
    ).toEqual([]);
  });

  it("retrieves canonical chapters and rejects project/chapter mismatches", () => {
    expect(getChapterEvidence("navi", "nv-build")).toMatchObject({
      evidenceState: "built",
      claimClass: "behavioral",
      dominantProof: { id: "navi-booking-demo", kind: "interaction" },
    });

    expect(() => getChapterEvidence("navi", "fg-design")).toThrow(
      "Missing Reader evidence map for navi:fg-design",
    );
  });
});
