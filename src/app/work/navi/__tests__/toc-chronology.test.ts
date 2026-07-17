import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

const pageSource = readFileSync(
  resolve(process.cwd(), "src/app/work/navi/page.tsx"),
  "utf8",
);

describe("Navi chapter chronology", () => {
  it("uses the exact five typed chapters for the TOC", () => {
    expect(CASE_STUDY_CHAPTERS.navi).toEqual([
      {
        id: "nv-intro",
        stage: "Frame",
        title: "Concentrated tourism as a routing problem",
      },
      {
        id: "nv-insights",
        stage: "Research",
        title: "The resident survey redirected the concept",
      },
      {
        id: "nv-framework",
        stage: "Define",
        title: "Mapping the experience",
      },
      {
        id: "nv-build",
        stage: "Build",
        title: "From prototype to booking flow",
      },
      {
        id: "nv-outcome",
        stage: "Validate",
        title: "What I would test next",
      },
    ]);
    expect(pageSource).toContain("const chapters = CASE_STUDY_CHAPTERS.navi;");
    expect(pageSource).toMatch(/<ProjectToc\s+sections=\{chapters\}\s*\/>/);
    expect(
      Array.from(
        pageSource.matchAll(
          /<ProjectChapter\s+entry=\{chapters\[(\d)\]\}\s+index=\{(\d)\}\s+total=\{chapters\.length\}\s+variant="navi"\s*>/g,
        ),
        ([, entry, index]) => ({ entry: Number(entry), index: Number(index) }),
      ),
    ).toEqual([
      { entry: 0, index: 1 },
      { entry: 1, index: 2 },
      { entry: 2, index: 3 },
      { entry: 3, index: 4 },
      { entry: 4, index: 5 },
    ]);
  });

  it("groups the four page evidence headings beneath their approved chapters", () => {
    const chapterEvidence = Object.fromEntries(
      Array.from(
        pageSource.matchAll(
          /<ProjectChapter\s+entry=\{chapters\[(\d)\]\}[\s\S]*?>([\s\S]*?)<\/ProjectChapter>/g,
        ),
        ([, index, body]) => [
          CASE_STUDY_CHAPTERS.navi[Number(index)].id,
          Array.from(
            body.matchAll(
              /<h3\s+className="project-evidence-heading"\s+id="([^"]+)"/g,
            ),
            ([, id]) => id,
          ),
        ] as const,
      ).filter(([, evidence]) => evidence.length > 0),
    );

    expect(chapterEvidence).toEqual({
      "nv-intro": ["nv-heatmap"],
      "nv-insights": ["nv-research"],
      "nv-build": ["nv-system", "nv-screens"],
    });
  });
});
