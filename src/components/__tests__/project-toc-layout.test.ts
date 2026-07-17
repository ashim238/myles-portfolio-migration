import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function cssBlocks(header: string, source = styles) {
  const blocks: string[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf(header, cursor);
    if (start === -1) break;
    const open = source.indexOf("{", start);
    let depth = 0;

    for (let index = open; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(open + 1, index));
        cursor = index + 1;
        break;
      }
    }
  }

  expect(blocks.length, `${header} CSS blocks`).toBeGreaterThan(0);
  return blocks;
}

function cssBlock(header: string, source = styles) {
  return cssBlocks(header, source)[0];
}

describe("ProjectToc responsive layout", () => {
  it("starts the vertical spine at 1440px and keeps its active label visible", () => {
    expect(styles).not.toContain("@media (min-width: 1280px)");
    const wide = cssBlock("@media (min-width: 1440px)");
    const label = cssBlock(".project-toc-text", wide);
    const active = cssBlock(
      ".project-toc-link--active .project-toc-text",
      wide,
    );

    expect(label).toMatch(/right:\s*2\.5rem;/);
    expect(label).toMatch(/left:\s*auto;/);
    expect(label).toMatch(/text-align:\s*right;/);
    expect(active).toMatch(/opacity:\s*1;/);
  });

  it("raises the return control above mobile navigation and the safe area", () => {
    const mobile = cssBlocks("@media (max-width: 768px)").find((block) =>
      block.includes(".reading-top"),
    );
    expect(mobile).toBeDefined();
    const top = cssBlock(".reading-top", mobile!);

    expect(top).toMatch(
      /bottom:\s*calc\(3\.6rem \+ env\(safe-area-inset-bottom, 0px\) \+ 0\.75rem\);/,
    );
    expect(top).toMatch(/z-index:\s*110;/);
  });
});
