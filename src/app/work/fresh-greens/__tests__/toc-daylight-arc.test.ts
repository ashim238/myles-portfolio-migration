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

  it("uses the app daylight anchors with an accessible dark-mode night substitute", () => {
    const arc = getDaylightArc();

    expect(arc).toMatch(/--fg-toc-dawn:\s*#FFB347;/);
    expect(arc).toMatch(/--fg-toc-dusk:\s*#C4785A;/);
    expect(arc).toMatch(/\.fg-page\s*\{[\s\S]*--fg-toc-night:\s*#5559A8;/);
    expect(arc).toMatch(
      /:root\[data-theme="light"\]\s+\.fg-page\s*\{\s*--fg-toc-night:\s*#2D1B69;/,
    );
  });

  it("maps the six chapters across the daylight arc", () => {
    const colors = Array.from(
      getDaylightArc().matchAll(
        /\.project-toc-item:nth-child\((\d+)\)\s*\{\s*--seg-color:\s*(#[0-9A-F]{6}|var\(--fg-toc-(?:dawn|dusk|night)\));\s*\}/g,
      ),
      ([, stage, color]) => ({ stage: Number(stage), color }),
    );

    expect(colors).toEqual([
      { stage: 1, color: "var(--fg-toc-dawn)" },
      { stage: 2, color: "var(--fg-toc-dawn)" },
      { stage: 3, color: "var(--fg-toc-dusk)" },
      { stage: 4, color: "var(--fg-toc-dusk)" },
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
          /(#[0-9A-F]{6}|var\(--fg-toc-(?:dawn|dusk|night)\))\s+(\d+(?:\.\d+)?%)\s+(\d+(?:\.\d+)?%)/g,
        ),
        ([, color, start, end]) => ({ color, start, end }),
      ),
    ).toEqual([
      { color: "var(--fg-toc-dawn)", start: "0%", end: "16.667%" },
      { color: "var(--fg-toc-dawn)", start: "16.667%", end: "33.333%" },
      { color: "var(--fg-toc-dusk)", start: "33.333%", end: "50%" },
      { color: "var(--fg-toc-dusk)", start: "50%", end: "66.667%" },
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
        /\.project-chapter\[data-chapter-index="(\d+)"\]\s*\{\s*--chapter-motif-accent:\s*(#[0-9A-F]{6}|var\(--fg-toc-(?:dawn|dusk|night)\));\s*\}/g,
      ),
      ([, chapter, color]) => ({ chapter: Number(chapter), color }),
    );

    expect(motifs).toEqual([
      { chapter: 1, color: "var(--fg-toc-dawn)" },
      { chapter: 2, color: "var(--fg-toc-dawn)" },
      { chapter: 3, color: "var(--fg-toc-dusk)" },
      { chapter: 4, color: "var(--fg-toc-dusk)" },
      { chapter: 5, color: "var(--fg-toc-night)" },
      { chapter: 6, color: "var(--fg-toc-night)" },
    ]);
  });
});
