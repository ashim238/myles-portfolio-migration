import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

type CaseStudyContract = {
  name: string;
  path: string;
  mapKey: keyof typeof CASE_STUDY_CHAPTERS;
  readingEndId?: string;
};

function readCaseStudy(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
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
  },
  {
    name: "TikTok",
    path: "src/app/work/tiktok/page.tsx",
    mapKey: "tiktok",
  },
  {
    name: "Navi",
    path: "src/app/work/navi/page.tsx",
    mapKey: "navi",
  },
  {
    name: "UnderstandingFAFSA",
    path: "src/app/work/understandingfafsa/page.tsx",
    mapKey: "understandingfafsa",
  },
];

const readerPages = [
  "src/app/work/[slug]/page.tsx",
  "src/app/work/fresh-greens/page.tsx",
  "src/app/work/understandingfafsa/page.tsx",
  "src/app/work/navi/page.tsx",
  "src/app/work/tiktok/page.tsx",
] as const;

describe("case-study chapter navigation contracts", () => {
  for (const caseStudy of cases) {
    it(`${caseStudy.name} uses the approved typed chapter map`, () => {
      const source = readCaseStudy(caseStudy.path);
      const chapters = CASE_STUDY_CHAPTERS[caseStudy.mapKey];

      expect(chapters.length).toBeLessThanOrEqual(6);
      expect(source).toContain(`const chapters = ${mapAccess(caseStudy.mapKey)}`);
      expect(source).toMatch(/<ProjectToc[\s\S]*?sections=\{chapters\}/);
      expect(source).toContain("<ProjectChapter");

      for (const chapter of chapters) {
        expect(chapterMapIdOccurrences(chapterMapSource, chapter.id)).toBe(1);
      }

      const entryIndexes = Array.from(
        source.matchAll(/entry=\{chapters\[(\d+)\]\}/g),
        ([, index]) => index,
      );
      const expectedIndexes = chapters.map((_, index) => String(index));

      expect(entryIndexes).toEqual(expectedIndexes);

      if (caseStudy.readingEndId) {
        expect(source).toContain(`readingEndId="${caseStudy.readingEndId}"`);
      }
    });
  }

  it("wraps the five case-study page sources in ReaderShell without legacy SiteNav chrome", () => {
    for (const path of readerPages) {
      const source = readCaseStudy(path);
      expect(source, path).toContain('from "@/components/myles-97/reader-shell"');
      expect(source, path).toContain("<ReaderShell");
      expect(source, path).not.toContain("<SiteNav");
      expect(source, path).not.toContain('from "@/components/site-nav"');
    }
  });

  it("keeps the nested Navi demo and system outside Reader Mode", () => {
    for (const path of [
      "src/app/work/navi/(minisite)/demo/page.tsx",
      "src/app/work/navi/(minisite)/system/page.tsx",
    ]) {
      expect(readCaseStudy(path), path).not.toContain("ReaderShell");
    }
  });
});
