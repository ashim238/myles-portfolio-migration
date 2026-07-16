import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type TocEntry = {
  title: string;
  id: string;
};

const expectedChronology: TocEntry[] = [
  { title: "Concentrated tourism as a routing problem", id: "nv-intro" },
  { title: "The first prototype: a Manhattan heatmap", id: "nv-heatmap" },
  { title: "Platform audits and resident research", id: "nv-research" },
  { title: "The resident survey redirected the concept", id: "nv-insights" },
  { title: "Mapping the experience before the build", id: "nv-framework" },
  { title: "Rebuilding Navi as a working system", id: "nv-system" },
  { title: "A working booking flow", id: "nv-screens" },
  { title: "What I would validate next", id: "nv-outcome" },
];

function normalizeTitle(title: string) {
  return title.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

describe("Navi chapter chronology", () => {
  it("keeps the Task 2 TOC aligned with all eight story headings", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/work/navi/page.tsx"),
      "utf8",
    );
    const projectToc = source.match(/<ProjectToc\s+([\s\S]*?)\/>/);
    const sections = projectToc?.[1].match(/sections=\{\[([\s\S]*?)\]\}/);

    expect(projectToc, "ProjectToc props").not.toBeNull();
    expect(sections, "ProjectToc sections array").not.toBeNull();

    const tocEntries = Array.from(
      sections![1].matchAll(
        /\{\s*title:\s*"([^"]+)",\s*id:\s*"([^"]+)"\s*,?\s*\}/g,
      ),
      ([, title, id]) => ({ title, id }),
    );
    const storyHeadings = Array.from(
      source.matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>/g),
      ([, id, title]) => ({ id, title: normalizeTitle(title) }),
    );

    expect(tocEntries).toEqual(expectedChronology);
    expect(storyHeadings).toEqual(expectedChronology);
  });
});
