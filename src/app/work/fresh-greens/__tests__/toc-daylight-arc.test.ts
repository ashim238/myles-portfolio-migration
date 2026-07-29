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
  it("keeps the traffic-stop emphasis on its chapter title", () => {
    expect(stylesheet).toMatch(
      /\.project-chapter-title#fg-pulled-over\s*\{/,
    );
    expect(stylesheet).not.toMatch(
      /\.project-evidence-heading#fg-pulled-over\s*\{/,
    );
  });

  it("uses a more visible night blue in the dark theme", () => {
    const arc = getDaylightArc();

    expect(arc).toMatch(/\.fg-page\s*\{\s*--fg-toc-night:\s*#5559A8;/);
    expect(arc).toMatch(
      /:root\[data-theme="light"\]\s+\.fg-page\s*\{\s*--fg-toc-night:\s*#1B1E4B;/,
    );
  });

  it("maps the six chapters across the daylight arc", () => {
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
      { stage: 4, color: "#C74757" },
      { stage: 5, color: "var(--fg-toc-night)" },
      { stage: 6, color: "var(--fg-toc-night)" },
    ]);
  });

  it("uses six contiguous chapter ranges in the mobile gradient", () => {
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
      { color: "#F09456", start: "0%", end: "16.667%" },
      { color: "#F09456", start: "16.667%", end: "33.333%" },
      { color: "#FDD350", start: "33.333%", end: "50%" },
      { color: "#C74757", start: "50%", end: "66.667%" },
      {
        color: "var(--fg-toc-night)",
        start: "66.667%",
        end: "83.333%",
      },
      {
        color: "var(--fg-toc-night)",
        start: "83.333%",
        end: "100%",
      },
    ]);
  });

  it("matches chapter motifs to the approved daylight palette", () => {
    const motifs = Array.from(
      getDaylightArc().matchAll(
        /\.project-chapter\[data-chapter-index="(\d+)"\]\s*\{\s*--chapter-motif-accent:\s*(#[0-9A-F]{6}|var\(--fg-toc-night\));\s*\}/g,
      ),
      ([, chapter, color]) => ({ chapter: Number(chapter), color }),
    );

    expect(motifs).toEqual([
      { chapter: 1, color: "#F09456" },
      { chapter: 2, color: "#F09456" },
      { chapter: 3, color: "#FDD350" },
      { chapter: 4, color: "#C74757" },
      { chapter: 5, color: "var(--fg-toc-night)" },
      { chapter: 6, color: "var(--fg-toc-night)" },
    ]);
  });
});
