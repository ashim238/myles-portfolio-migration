import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
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

  it("maps the nine process stages across the daylight arc", () => {
    const colors = Array.from(
      getDaylightArc().matchAll(
        /\.project-toc-item:nth-child\((\d+)\)\s*\{\s*--seg-color:\s*(#[0-9A-F]{6}|var\(--fg-toc-night\));\s*\}/g,
      ),
      ([, stage, color]) => ({ stage: Number(stage), color }),
    );

    expect(colors).toEqual([
      { stage: 1, color: "#F09456" },
      { stage: 2, color: "#F09456" },
      { stage: 3, color: "#FDD350" },
      { stage: 4, color: "#FDD350" },
      { stage: 5, color: "#C74757" },
      { stage: 6, color: "#C74757" },
      { stage: 7, color: "#C74757" },
      { stage: 8, color: "var(--fg-toc-night)" },
      { stage: 9, color: "var(--fg-toc-night)" },
    ]);
  });

  it("uses nine contiguous stage ranges in the mobile gradient", () => {
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
      { color: "#F09456", start: "0%", end: "11.11%" },
      { color: "#F09456", start: "11.11%", end: "22.22%" },
      { color: "#FDD350", start: "22.22%", end: "33.33%" },
      { color: "#FDD350", start: "33.33%", end: "44.44%" },
      { color: "#C74757", start: "44.44%", end: "55.56%" },
      { color: "#C74757", start: "55.56%", end: "66.67%" },
      { color: "#C74757", start: "66.67%", end: "77.78%" },
      {
        color: "var(--fg-toc-night)",
        start: "77.78%",
        end: "88.89%",
      },
      {
        color: "var(--fg-toc-night)",
        start: "88.89%",
        end: "100%",
      },
    ]);
  });
});
