import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

const pageSource = readFileSync(
  resolve(process.cwd(), "src/app/work/fresh-greens/page.tsx"),
  "utf8",
);

describe("Fresh Greens TOC stage map", () => {
  it("uses the shared six-chapter map through the scope reading boundary", () => {
    expect(CASE_STUDY_CHAPTERS["fresh-greens"]).toHaveLength(6);
    expect(pageSource).toContain(
      'const chapters = CASE_STUDY_CHAPTERS["fresh-greens"];',
    );
    expect(pageSource).toContain('readingEndId="fg-scope"');
    expect(pageSource).not.toContain('className="project-evidence-heading"');
  });
});
