import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(
  resolve(process.cwd(), "src/app/work/navi/page.tsx"),
  "utf8",
);
const researchChapter = page.slice(
  page.indexOf("entry={chapters[1]}"),
  page.indexOf("entry={chapters[2]}"),
);

describe("Navi evidence hierarchy", () => {
  it("leads the Research chapter with the dominant survey proof", () => {
    expect(researchChapter).toContain(
      "Resident evidence and supporting platform audit",
    );
    expect(researchChapter.indexOf("<SurveyStatRings")).toBeLessThan(
      researchChapter.indexOf("<HeuristicInsightCards"),
    );
  });
});
