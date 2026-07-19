import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

const pageSource = readFileSync(
  resolve(process.cwd(), "src/app/work/fresh-greens/page.tsx"),
  "utf8",
);

describe("Fresh Greens TOC stage map", () => {
  it("uses the exact six typed chapters for the TOC and reading boundary", () => {
    expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toEqual([
      {
        id: "fg-problem",
        stage: "Frame",
        title: "Why time and distance were not enough",
      },
      {
        id: "fg-research",
        stage: "Research",
        title: "What interviews with Black drivers changed",
      },
      { id: "fg-design", stage: "Design", title: "Safer route decisions" },
      {
        id: "fg-refine",
        stage: "Refine",
        title: "The visual system after the routing pivot",
      },
      {
        id: "fg-trust",
        stage: "Trust",
        title: "Moderating community reports",
      },
      {
        id: "fg-scope",
        stage: "Validate",
        title: "What I built and what still needs proof",
      },
    ]);
    expect(pageSource).toContain(
      'const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];',
    );
    expect(pageSource).toMatch(
      /<ProjectToc\s+sections=\{chapters\}\s+readingEndId="fg-scope"\s*\/>/,
    );
    expect(
      Array.from(
        pageSource.matchAll(
          /<ProjectChapter\s+entry=\{chapters\[(\d)\]\}\s+index=\{(\d)\}\s+total=\{chapters\.length\}\s+variant="fresh-greens"\s*>/g,
        ),
        ([, entry, index]) => ({ entry: Number(entry), index: Number(index) }),
      ),
    ).toEqual([
      { entry: 0, index: 1 },
      { entry: 1, index: 2 },
      { entry: 2, index: 3 },
      { entry: 3, index: 4 },
      { entry: 4, index: 5 },
      { entry: 5, index: 6 },
    ]);
  });

  it("groups five evidence headings beneath Design and Refine", () => {
    const chapterEvidence = Object.fromEntries(
      Array.from(
        pageSource.matchAll(
          /<ProjectChapter\s+entry=\{chapters\[(\d)\]\}[\s\S]*?>([\s\S]*?)<\/ProjectChapter>/g,
        ),
        ([, index, body]) => [
          CASE_STUDY_CHAPTERS["fresh-greens"][Number(index)].id,
          Array.from(
            body.matchAll(
              /<h3\s+className="project-evidence-heading"\s+id="([^"]+)"/g,
            ),
            ([, id]) => id,
          ),
        ],
      ),
    );

    expect(chapterEvidence).toMatchObject({
      "fg-design": ["fg-scoring", "fg-pulled-over"],
      "fg-refine": ["fg-pivot", "fg-typecolor", "fg-color"],
    });
  });
});
