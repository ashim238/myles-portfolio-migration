import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/app/globals.css"),
  "utf8",
);

function getDaylightArc() {
  const arc = stylesheet.match(
    /Fresh Greens · Daylight-arc ToC[\s\S]*?(?=\n\/\* ═|$)/,
  );

  expect(arc, "Fresh Greens daylight-arc CSS").not.toBeNull();
  return arc![0];
}

describe("Fresh Greens TOC daylight arc", () => {
  it("uses a more visible night blue in the dark theme", () => {
    const arc = getDaylightArc();

    expect(arc).toMatch(/\.fg-page\s*\{\s*--fg-toc-night:\s*#5559A8;/);
    expect(arc).toMatch(
      /:root\[data-theme="light"\]\s+\.fg-page\s*\{\s*--fg-toc-night:\s*#1B1E4B;/,
    );
  });

  it("maps the four chapters to four staged colors", () => {
    const colors = Array.from(
      getDaylightArc().matchAll(
        /\.project-toc-item:nth-child\((\d+)\)\s*\{\s*--seg-color:\s*(#[0-9A-F]{6}|var\(--fg-toc-night\));\s*\}/g,
      ),
      ([, chapter, color]) => ({ chapter: Number(chapter), color }),
    );

    expect(colors).toEqual([
      { chapter: 1, color: "#F09456" },
      { chapter: 2, color: "#FDD350" },
      { chapter: 3, color: "#C74757" },
      { chapter: 4, color: "var(--fg-toc-night)" },
    ]);
  });

  it("uses four contiguous quarter-ranges in the mobile gradient", () => {
    const background = getDaylightArc().match(
      /\.project-toc-progress\s*\{[\s\S]*?background:\s*linear-gradient\(\s*to right,([\s\S]*?)\);/,
    );

    expect(background, "Fresh Greens TOC progress gradient").not.toBeNull();
    expect(
      Array.from(
        background![1].matchAll(
          /(#[0-9A-F]{6}|var\(--fg-toc-night\))\s+(\d+(?:\.\d+)?%)\s+(\d+(?:\.\d+)?%)/g,
        ),
        ([, color, start, end]) => ({ color, start, end }),
      ),
    ).toEqual([
      { color: "#F09456", start: "0%", end: "25%" },
      { color: "#FDD350", start: "25%", end: "50%" },
      { color: "#C74757", start: "50%", end: "75%" },
      {
        color: "var(--fg-toc-night)",
        start: "75%",
        end: "100%",
      },
    ]);
  });
});
