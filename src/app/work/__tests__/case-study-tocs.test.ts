import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

type CaseStudyContract = {
  name: string;
  path: string;
  mapKey: keyof typeof CASE_STUDY_CHAPTERS;
  readingEndId?: string;
  evidenceIds: readonly string[];
};

function readCaseStudy(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function idOccurrences(source: string, id: string) {
  return source.match(new RegExp(`id="${id}"`, "g"))?.length ?? 0;
}

function chapterMapIdOccurrences(source: string, id: string) {
  return source.match(new RegExp(`id: "${id}"`, "g"))?.length ?? 0;
}

function mapAccess(mapKey: keyof typeof CASE_STUDY_CHAPTERS) {
  return mapKey.includes("-")
    ? `CASE_STUDY_CHAPTERS["${mapKey}"]`
    : `CASE_STUDY_CHAPTERS.${mapKey}`;
}

const chapterMapSource = readCaseStudy("src/lib/project-chapters.ts");

const cases: readonly CaseStudyContract[] = [
  {
    name: "Fresh Greens",
    path: "src/app/work/fresh-greens/page.tsx",
    mapKey: "fresh-greens",
    readingEndId: "fg-scope",
    evidenceIds: ["fg-scoring", "fg-pulled-over", "fg-pivot", "fg-typecolor", "fg-color"],
  },
  {
    name: "TikTok",
    path: "src/app/work/tiktok/page.tsx",
    mapKey: "tiktok",
    evidenceIds: [],
  },
  {
    name: "Navi",
    path: "src/app/work/navi/page.tsx",
    mapKey: "navi",
    evidenceIds: ["nv-heatmap", "nv-research", "nv-system", "nv-screens"],
  },
  {
    name: "UnderstandingFAFSA",
    path: "src/app/work/understandingfafsa/page.tsx",
    mapKey: "understandingfafsa",
    evidenceIds: ["uf-problem", "uf-templates"],
  },
];

describe("case-study chapter navigation contracts", () => {
  for (const caseStudy of cases) {
    it(`${caseStudy.name} uses the approved typed chapter map`, () => {
      const source = readCaseStudy(caseStudy.path);
      const chapters = CASE_STUDY_CHAPTERS[caseStudy.mapKey];

      expect(chapters.length).toBeLessThanOrEqual(6);
      expect(source).toContain(`const chapters = ${mapAccess(caseStudy.mapKey)}`);
      expect(source).toMatch(/<ProjectToc[\s\S]*?sections=\{chapters\}/);
      expect(source).toContain("<ProjectChapter");

      for (const [index, chapter] of chapters.entries()) {
        expect(chapterMapIdOccurrences(chapterMapSource, chapter.id)).toBe(1);
        expect(source).toContain(`entry={chapters[${index}]}`);
      }

      if (caseStudy.readingEndId) {
        expect(source).toContain(`readingEndId="${caseStudy.readingEndId}"`);
      }

      for (const evidenceId of caseStudy.evidenceIds) {
        expect(idOccurrences(source, evidenceId)).toBe(1);
      }
    });
  }
});
