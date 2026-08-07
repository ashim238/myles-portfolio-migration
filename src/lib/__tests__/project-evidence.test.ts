import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";
import { PROJECT_EVIDENCE_MAP } from "@/lib/project-evidence";

describe("case-study evidence maps", () => {
  it("maps every published chapter in the same order as navigation", () => {
    expect(Object.keys(PROJECT_EVIDENCE_MAP).sort()).toEqual(
      Object.keys(CASE_STUDY_CHAPTERS).sort(),
    );

    for (const [project, chapters] of Object.entries(CASE_STUDY_CHAPTERS)) {
      expect(
        PROJECT_EVIDENCE_MAP[
          project as keyof typeof PROJECT_EVIDENCE_MAP
        ].map(({ chapterId }) => chapterId),
      ).toEqual(chapters.map(({ id }) => id));
    }
  });

  it("gives every chapter one dominant claim and one dominant proof", () => {
    for (const chapters of Object.values(PROJECT_EVIDENCE_MAP)) {
      for (const chapter of chapters) {
        expect(chapter.dominantClaim.id).not.toBe("");
        expect(chapter.dominantClaim.text).not.toBe("");
        expect(chapter.interpretation).not.toBe("");
        expect(chapter.caveat).not.toBe("");
        expect(chapter.proofs.length).toBeGreaterThan(0);
        expect(chapter.proofs.length).toBeLessThanOrEqual(3);
        expect(
          chapter.proofs.filter(({ role }) => role === "dominant"),
        ).toHaveLength(1);
      }
    }
  });

  it("keeps claim and proof identifiers unique", () => {
    const claimIds = Object.values(PROJECT_EVIDENCE_MAP).flatMap((chapters) =>
      chapters.map(({ dominantClaim }) => dominantClaim.id),
    );
    const proofIds = Object.values(PROJECT_EVIDENCE_MAP).flatMap((chapters) =>
      chapters.flatMap(({ proofs }) => proofs.map(({ id }) => id)),
    );

    expect(new Set(claimIds).size).toBe(claimIds.length);
    expect(new Set(proofIds).size).toBe(proofIds.length);
  });

  it("requires an explicit trigger for claims that still need proof", () => {
    for (const chapters of Object.values(PROJECT_EVIDENCE_MAP)) {
      for (const chapter of chapters) {
        if (chapter.dominantClaim.state === "needs-proof") {
          expect(chapter.dominantClaim.reopenWhen).toBeTruthy();
        }

        if (chapter.dominantClaim.class === "causal") {
          expect(chapter.dominantClaim.state).toBe("needs-proof");
          expect(chapter.dominantClaim.reopenWhen).toBeTruthy();
        }
      }
    }
  });

  it("keeps proof surfaces inside the project and labels cross-chapter placement", () => {
    for (const [project, chapters] of Object.entries(PROJECT_EVIDENCE_MAP)) {
      const chapterIds = new Set<string>(
        CASE_STUDY_CHAPTERS[
          project as keyof typeof CASE_STUDY_CHAPTERS
        ].map(({ id }) => id),
      );

      for (const chapter of chapters) {
        for (const proof of chapter.proofs) {
          expect(chapterIds.has(proof.surfaceChapterId)).toBe(true);
          expect(proof.label).not.toBe("");
          expect(proof.surface).not.toBe("");
          expect(proof.job).not.toBe("");
          expect(proof.proves).not.toBe("");
          expect(proof.limitation).not.toBe("");
          expect(proof.job).not.toBe(proof.limitation);

          if (proof.surfaceChapterId !== chapter.chapterId) {
            expect(proof.placementNote).toBeTruthy();
          }
        }
      }
    }
  });
});
