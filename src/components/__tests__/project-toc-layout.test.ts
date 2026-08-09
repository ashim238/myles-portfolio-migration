import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function cssBlocks(header: string, source = styles) {
  const blocks: string[] = [];
  const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ruleStart = new RegExp(
    `(?:^|\\n)\\s*${escapedHeader}\\s*(?:,|\\{)`,
    "g",
  );
  let match: RegExpExecArray | null;

  while ((match = ruleStart.exec(source)) !== null) {
    const open = source.indexOf("{", match.index);
    let depth = 0;

    for (let index = open; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(open + 1, index));
        ruleStart.lastIndex = index + 1;
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
  it("keeps stage and title inside the ellipsis boundary without shrinking targets", () => {
    const link = cssBlock(".project-toc-link");
    const label = cssBlock(".project-toc-text");
    const stage = cssBlock(".project-toc-stage");
    const separator = cssBlock(".project-toc-separator");
    const title = cssBlock(".project-toc-title");

    expect(link).toMatch(/min-height:\s*44px;/);
    expect(label).toMatch(/display:\s*inline-flex;/);
    expect(label).toMatch(/min-width:\s*0;/);
    expect(label).toMatch(/overflow:\s*hidden;/);
    expect(stage).toMatch(/flex:\s*0 0 auto;/);
    expect(separator).toMatch(/flex:\s*0 0 auto;/);
    expect(separator).toMatch(/margin-right:\s*0\.28em;/);
    expect(title).toMatch(/min-width:\s*0;/);
    expect(title).toMatch(/overflow:\s*hidden;/);
    expect(title).toMatch(/text-overflow:\s*ellipsis;/);
  });

  it("ellipsizes only the mobile title while keeping the stage readable", () => {
    const mobile = cssBlocks("@media (max-width: 767px)").find((block) =>
      block.includes(".project-toc-active-title"),
    );
    expect(mobile).toBeDefined();

    const activeTitle = cssBlock(".project-toc-active-title", mobile!);
    const stage = cssBlock(
      ".project-toc-active-title .project-toc-stage",
      mobile!,
    );
    const title = cssBlock(
      ".project-toc-active-title .project-toc-title",
      mobile!,
    );

    expect(activeTitle).toMatch(/display:\s*inline-flex;/);
    expect(activeTitle).toMatch(/overflow:\s*hidden;/);
    expect(stage).toMatch(/flex:\s*0 0 auto;/);
    expect(title).toMatch(/min-width:\s*0;/);
    expect(title).toMatch(/text-overflow:\s*ellipsis;/);
  });

  it("keeps the mobile fallback in document flow until enhancement succeeds", () => {
    const mobile = cssBlocks("@media (max-width: 767px)").find((block) =>
      block.includes(".project-toc-toggle"),
    );
    expect(mobile).toBeDefined();

    const fallback = cssBlock(".project-toc", mobile!);
    const enhanced = cssBlock(
      '.project-toc[data-toc-ready="true"]',
      mobile!,
    );

    expect(fallback).toMatch(/position:\s*static;/);
    expect(fallback).toMatch(/top:\s*auto;/);
    expect(enhanced).toMatch(/position:\s*sticky;/);
    expect(enhanced).toMatch(/top:\s*0;/);
  });

  it("keeps mobile keyboard help out of the fixed navigation layout on focus", () => {
    const mobile = cssBlocks("@media (max-width: 767px)").find((block) =>
      block.includes(".project-toc-toggle"),
    );
    expect(mobile).toBeDefined();

    const focusedHelp = cssBlock(
      ".project-toc:focus-within .project-toc-help",
      mobile!,
    );

    expect(focusedHelp).toMatch(/position:\s*absolute;/);
    expect(focusedHelp).toMatch(/width:\s*1px;/);
    expect(focusedHelp).toMatch(/height:\s*1px;/);
    expect(focusedHelp).toMatch(/margin:\s*0;/);
    expect(focusedHelp).toMatch(/overflow:\s*hidden;/);
    expect(focusedHelp).toMatch(/clip:\s*rect\(0,\s*0,\s*0,\s*0\);/);
    expect(focusedHelp).toMatch(/white-space:\s*nowrap;/);
  });

  it("keeps 1440px horizontal and starts the vertical spine at 1600px", () => {
    expect(styles).not.toContain("@media (min-width: 1280px)");
    expect(styles).not.toContain("@media (min-width: 1440px)");
    const wide = cssBlock("@media (min-width: 1600px)");
    const toc = cssBlock(".project-toc", wide);
    const link = cssBlock(".project-toc-link", wide);
    const rail = cssBlock(".project-toc-rail", wide);
    const label = cssBlock(".project-toc-text", wide);
    const active = cssBlock(
      ".project-toc-link--active .project-toc-text",
      wide,
    );

    expect(toc).toMatch(/width:\s*3\.6rem;/);
    expect(rail).toMatch(/height:\s*44px;/);
    expect(link).toMatch(/min-height:\s*44px;/);
    expect(label).toMatch(/right:\s*2\.5rem;/);
    expect(label).toMatch(/left:\s*auto;/);
    expect(label).toMatch(/text-align:\s*right;/);
    expect(active).toMatch(/opacity:\s*1;/);
  });

  it("raises the return control above mobile navigation and the safe area", () => {
    const mobile = cssBlocks("@media (max-width: 767px)").find((block) =>
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
