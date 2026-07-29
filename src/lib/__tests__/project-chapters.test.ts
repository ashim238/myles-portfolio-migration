import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

describe("case-study chapter maps", () => {
  it("uses the approved chapter counts", () => {
    expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toHaveLength(6);
    expect(CASE_STUDY_CHAPTERS.navi).toHaveLength(5);
    expect(CASE_STUDY_CHAPTERS.tiktok).toHaveLength(4);
    expect(CASE_STUDY_CHAPTERS.understandingfafsa).toHaveLength(5);
  });

  it("never exceeds six chapters and keeps IDs unique within each story", () => {
    for (const chapters of Object.values(CASE_STUDY_CHAPTERS)) {
      expect(chapters.length).toBeLessThanOrEqual(6);
      expect(new Set(chapters.map((chapter) => chapter.id)).size).toBe(
        chapters.length,
      );
    }
  });

  it("keeps the public narrative order and navigation anchors", () => {
    expect(
      CASE_STUDY_CHAPTERS["fresh-greens"].map(({ id, stage }) => ({
        id,
        stage,
      })),
    ).toEqual([
      { id: "fg-problem", stage: "Frame" },
      { id: "fg-research", stage: "Research" },
      { id: "fg-design", stage: "Plan" },
      { id: "fg-pulled-over", stage: "Respond" },
      { id: "fg-trust", stage: "Trust" },
      { id: "fg-scope", stage: "Validate" },
    ]);

    expect(
      CASE_STUDY_CHAPTERS.navi.map(({ id, stage }) => ({ id, stage })),
    ).toEqual([
      { id: "nv-intro", stage: "Frame" },
      { id: "nv-insights", stage: "Research" },
      { id: "nv-framework", stage: "Define" },
      { id: "nv-build", stage: "Build" },
      { id: "nv-outcome", stage: "Validate" },
    ]);

    expect(
      CASE_STUDY_CHAPTERS.tiktok.map(({ id, stage }) => ({ id, stage })),
    ).toEqual([
      { id: "tt-brief", stage: "Brief" },
      { id: "tt-research", stage: "Choose" },
      { id: "tt-system", stage: "Build" },
      { id: "tt-outcome", stage: "Deliver" },
    ]);
  });

  it("keeps chapter language free of banned punctuation", () => {
    for (const chapters of Object.values(CASE_STUDY_CHAPTERS)) {
      for (const chapter of chapters) {
        expect(`${chapter.stage} ${chapter.title}`).not.toMatch(/[—;…]/);
      }
    }
  });
});
