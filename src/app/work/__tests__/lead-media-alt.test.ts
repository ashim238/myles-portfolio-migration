import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const cases = [
  {
    path: "src/app/work/fresh-greens/page.tsx",
    alt: "Fresh Greens welcome screen on a phone, with an illustrated Black driver at sunrise.",
  },
  {
    path: "src/app/work/understandingfafsa/page.tsx",
    alt: "Two phone mockups showing blue and orange UnderstandingFAFSA newsletter templates.",
  },
  {
    path: "src/app/work/navi/page.tsx",
    alt: "Navi neighborhood experience search results and cards on a tablet on a wooden table.",
  },
] as const;

describe("case-study lead media alternatives", () => {
  for (const caseStudy of cases) {
    it(`describes the visible artifact in ${caseStudy.path}`, () => {
      const source = readFileSync(resolve(process.cwd(), caseStudy.path), "utf8");

      expect(source).toContain(`alt="${caseStudy.alt}"`);
      expect(source).not.toMatch(/alt="(?:Fresh Greens|UnderstandingFAFSA|Navi) cover"/);
    });
  }
});
