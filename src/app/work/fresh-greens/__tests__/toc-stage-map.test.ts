import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pageSource = readFileSync(
  resolve(process.cwd(), "src/app/work/fresh-greens/page.tsx"),
  "utf8",
);

describe("Fresh Greens TOC stage map", () => {
  it("follows all nine visible process headings in order", () => {
    const toc = pageSource.match(
      /<ProjectToc\s+sections=\{\[([\s\S]*?)\]\}\s+readingEndId="fg-scope"/,
    );

    expect(toc, "Fresh Greens ProjectToc sections").not.toBeNull();
    expect(
      Array.from(
        toc![1].matchAll(/\{\s*title:\s*"([^"]+)",\s*id:\s*"([^"]+)"\s*\}/g),
        ([, title, id]) => ({ title, id }),
      ),
    ).toEqual([
      { title: "Problem", id: "fg-problem" },
      { title: "Research", id: "fg-research" },
      { title: "Route scoring", id: "fg-scoring" },
      { title: "Safety interaction", id: "fg-pulled-over" },
      { title: "Design pivot", id: "fg-pivot" },
      { title: "Type and color", id: "fg-typecolor" },
      { title: "Reserved color", id: "fg-color" },
      { title: "Community trust", id: "fg-trust" },
      { title: "Scope and proof", id: "fg-scope" },
    ]);
  });
});
