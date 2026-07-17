import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const projectRoot = process.cwd();
const styles = readFileSync(
  resolve(projectRoot, "src/app/styles/navi-minisite.css"),
  "utf8",
);

const scrollCallsites = [
  "src/app/work/navi/(minisite)/demo/page.tsx",
  "src/app/work/navi/(minisite)/demo/search/page.tsx",
  "src/app/work/navi/(minisite)/demo/neighborhood/[slug]/NeighborhoodView.tsx",
  "src/app/work/navi/(minisite)/demo/experience/[slug]/ExperienceView.tsx",
];

function mediaBlocks(query: string) {
  const blocks: string[] = [];
  const marker = `@media ${query}`;
  let cursor = 0;
  while ((cursor = styles.indexOf(marker, cursor)) >= 0) {
    const open = styles.indexOf("{", cursor + marker.length);
    if (open < 0) break;
    let depth = 1;
    let end = open + 1;
    while (end < styles.length && depth > 0) {
      if (styles[end] === "{") depth += 1;
      if (styles[end] === "}") depth -= 1;
      end += 1;
    }
    blocks.push(styles.slice(open + 1, end - 1));
    cursor = end;
  }
  return blocks;
}

describe("Navi motion accessibility", () => {
  it("routes every scripted scroll through the reduced-motion preference", () => {
    const helperPath = resolve(projectRoot, "src/lib/navi/motion.ts");
    expect(existsSync(helperPath), "shared motion preference helper must exist").toBe(true);
    if (!existsSync(helperPath)) return;

    const helper = readFileSync(helperPath, "utf8");
    expect(helper).toContain('(prefers-reduced-motion: reduce)');
    expect(helper).toMatch(/matches\s*\?\s*["']auto["']\s*:\s*["']smooth["']/);

    for (const relativePath of scrollCallsites) {
      const source = readFileSync(resolve(projectRoot, relativePath), "utf8");
      expect(source, relativePath).not.toMatch(/behavior:\s*["']smooth["']/);
      expect(source, relativePath).toContain("motionSafeScrollBehavior()");
    }
  });

  it("keeps loading and selection feedback non-animated under reduced motion", () => {
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*?\.nv-search-result\[data-pulse="true"\][\s\S]*?animation:\s*none;/,
    );
    const skeletonBlock = styles.match(/\.nv-map-skeleton\s*\{([^}]+)\}/)?.[1] ?? "";
    expect(skeletonBlock).not.toContain("animation");
  });
});

describe("Navi mobile target sizing", () => {
  it("gives compact header and feed utility controls a 44px mobile target", () => {
    expect(mediaBlocks("(max-width: 640px)")).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/\.nv-nav a\s*\{[^}]*min-height:\s*44px;/),
      ]),
    );
    expect(mediaBlocks("(max-width: 767px)")).toEqual(
      expect.arrayContaining([
        expect.stringMatching(
          /\.nv-feed-select select,\s*\.nv-feed-filters,\s*\.nv-feed-clear\s*\{[^}]*min-height:\s*44px;/,
        ),
      ]),
    );
  });
});
