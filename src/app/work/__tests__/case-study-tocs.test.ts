import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type TocEntry = {
  title: string;
  id: string;
};

type TocContract = {
  sections: TocEntry[];
  readingEndId?: string;
};

function readCaseStudy(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function getProjectToc(source: string): TocContract {
  const toc = source.match(/<ProjectToc\s+([\s\S]*?)\/>/);

  expect(toc, "ProjectToc props").not.toBeNull();

  const sections = toc![1].match(/sections=\{\[([\s\S]*?)\]\}/);
  const readingEndId = toc![1].match(/readingEndId="([^"]+)"/)?.[1];

  expect(sections, "ProjectToc sections array").not.toBeNull();

  return {
    sections: Array.from(
      sections![1].matchAll(
        /\{\s*title:\s*"([^"]+)",\s*id:\s*"([^"]+)"\s*,?\s*\}/g,
      ),
      ([, title, id]) => ({ title, id }),
    ),
    readingEndId,
  };
}

function getStoryHeadings(source: string): TocEntry[] {
  return Array.from(
    source.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g),
    ([, id, title]) => ({
      id,
      title: title.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim(),
    }),
  );
}

const cases = [
  {
    name: "Fresh Greens",
    path: "src/app/work/fresh-greens/page.tsx",
    toc: [
      { title: "Problem", id: "fg-problem" },
      { title: "Research", id: "fg-research" },
      { title: "Route scoring", id: "fg-scoring" },
      { title: "Safety interaction", id: "fg-pulled-over" },
      { title: "Design pivot", id: "fg-pivot" },
      { title: "Type and color", id: "fg-typecolor" },
      { title: "Reserved color", id: "fg-color" },
      { title: "Community trust", id: "fg-trust" },
      { title: "Scope and proof", id: "fg-scope" },
    ],
    readingEndId: "fg-scope",
  },
  {
    name: "TikTok",
    path: "src/app/work/tiktok/page.tsx",
    toc: [
      { title: "Fashion subcultures on TikTok", id: "tt-research" },
      { title: "Defining the fixed catalog structure", id: "tt-system" },
      { title: "Templates as modular parts", id: "tt-modular" },
      { title: "From sketches to layered files", id: "tt-templates" },
      { title: "What shipped from the launch batch", id: "tt-outcome" },
    ],
    readingEndId: undefined,
  },
  {
    name: "Navi",
    path: "src/app/work/navi/page.tsx",
    toc: [
      { title: "Concentrated tourism as a routing problem", id: "nv-intro" },
      { title: "The first prototype: a Manhattan heatmap", id: "nv-heatmap" },
      {
        title: "Platform audits and resident research",
        id: "nv-research",
      },
      { title: "The resident survey redirected the concept", id: "nv-insights" },
      { title: "Mapping the experience before the build", id: "nv-framework" },
      { title: "Rebuilding Navi as a working system", id: "nv-system" },
      { title: "A working booking flow", id: "nv-screens" },
      { title: "What I would validate next", id: "nv-outcome" },
    ],
    readingEndId: undefined,
  },
  {
    name: "UnderstandingFAFSA",
    path: "src/app/work/understandingfafsa/page.tsx",
    toc: [
      { title: "A rebrand and a weekly workflow", id: "uf-context" },
      { title: "Where the old template broke down", id: "uf-problem" },
      { title: "What 120 newsletters revealed", id: "uf-audit" },
      { title: "Three send types from the audit", id: "uf-templates" },
      { title: "Rules for fixed and swappable parts", id: "uf-locked" },
      { title: "Rebuilding the system in Mailchimp", id: "uf-figma" },
      { title: "The first redesigned send", id: "uf-results" },
    ],
    readingEndId: undefined,
  },
] as const;

describe("case-study recruiter paths", () => {
  for (const caseStudy of cases) {
    it(`${caseStudy.name} exposes its complete chronological process`, () => {
      const source = readCaseStudy(caseStudy.path);
      const toc = getProjectToc(source);

      expect(toc.sections).toEqual(caseStudy.toc);
      expect(toc.readingEndId).toBe(caseStudy.readingEndId);

      if (caseStudy.name !== "Fresh Greens") {
        expect(getStoryHeadings(source)).toEqual(caseStudy.toc);
      }

      for (const { id } of caseStudy.toc) {
        expect(source).toContain(`id="${id}"`);
      }

      if (caseStudy.readingEndId) {
        expect(source).toContain(`id="${caseStudy.readingEndId}"`);
      }
    });
  }
});
