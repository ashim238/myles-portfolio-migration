import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const applicantFacingFiles = [
  "content/projects/understandingfafsa.md",
  "src/app/work/understandingfafsa/page.tsx",
  "src/components/understandingfafsa.tsx",
  "src/app/about/page.tsx",
  "src/app/resume/page.tsx",
];

describe("UnderstandingFAFSA outcome claims", () => {
  it("does not present the observed open-rate change as causal proof", () => {
    for (const file of applicantFacingFiles) {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(source).not.toMatch(/75% lift/i);
      expect(source).not.toMatch(/lost readers/i);
    }
  });

  it("preserves the measured result and its reporting context", () => {
    const projectPage = readFileSync(
      resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
      "utf8",
    );

    expect(projectPage).toContain("November 4, 2025");
    expect(projectPage).toContain("~52.6%");
    expect(projectPage).toContain("around 30%");
    expect(projectPage).toContain("MPP excluded");
  });

  it("qualifies the open-rate labels in the mobile layout comparison", () => {
    const comparisonComponent = readFileSync(
      resolve(process.cwd(), "src/components/understandingfafsa.tsx"),
      "utf8",
    );

    expect(comparisonComponent).toContain("Prior sends · around 30% open rate");
    expect(comparisonComponent).toContain(
      "First redesigned send · ~52.6% open rate (MPP excluded)",
    );
    expect(comparisonComponent).toContain(
      "Newsletter mobile layouts and reported open rates",
    );
    expect(comparisonComponent).not.toContain("Before · ~30% open rate");
    expect(comparisonComponent).not.toContain("After · ~52.6% open rate");
    expect(comparisonComponent).not.toContain(
      "Newsletter open rate before and after redesign",
    );
  });
});
