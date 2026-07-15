import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type TocEntry = {
  title: string;
  id: string;
};

function readCaseStudy(path: string) {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function getProjectToc(source: string): TocEntry[] {
  const toc = source.match(/<ProjectToc\s+sections=\{\[([\s\S]*?)\]\}\s*\/>/);

  expect(toc, "ProjectToc sections array").not.toBeNull();

  return Array.from(
    toc![1].matchAll(/\{ title: "([^"]+)", id: "([^"]+)" \}/g),
    ([, title, id]) => ({ title, id }),
  );
}

const cases = [
  {
    name: "Fresh Greens",
    path: "src/app/work/fresh-greens/page.tsx",
    toc: [
      { title: "Problem", id: "fg-problem" },
      { title: "Research and route scoring", id: "fg-research" },
      { title: "Safety interaction", id: "fg-pulled-over" },
      { title: "Visual system, trust, and scope", id: "fg-pivot" },
    ],
  },
  {
    name: "Navi",
    path: "src/app/work/navi/page.tsx",
    toc: [
      { title: "Concept and first direction", id: "nv-intro" },
      { title: "Research pivot", id: "nv-research" },
      { title: "Participation framework", id: "nv-framework" },
      { title: "Portfolio rebuild", id: "nv-screens" },
    ],
  },
  {
    name: "UnderstandingFAFSA",
    path: "src/app/work/understandingfafsa/page.tsx",
    toc: [
      { title: "Context and problem", id: "uf-context" },
      { title: "Newsletter audit", id: "uf-audit" },
      { title: "Template system", id: "uf-templates" },
      { title: "Mailchimp build and results", id: "uf-figma" },
    ],
  },
] as const;

describe("case-study recruiter paths", () => {
  for (const caseStudy of cases) {
    it(`${caseStudy.name} exposes four chronological decision chapters`, () => {
      const source = readCaseStudy(caseStudy.path);

      expect(getProjectToc(source)).toEqual(caseStudy.toc);

      for (const { id } of caseStudy.toc) {
        expect(source).toContain(`id="${id}"`);
      }
    });
  }
});
