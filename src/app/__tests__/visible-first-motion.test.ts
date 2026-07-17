import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const surfaceStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

function cssBlocks(header: string, source: string) {
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

function cssBlock(header: string, source: string) {
  return cssBlocks(header, source)[0];
}

function expectVisibleFirst(name: string, source: string) {
  const keyframes = cssBlock(`@keyframes ${name}`, source);
  const firstFrame = keyframes.includes("from")
    ? cssBlock("from", keyframes)
    : cssBlock("0%", keyframes);
  expect(firstFrame).toMatch(/opacity:\s*1;/);
  expect(firstFrame).not.toMatch(/filter:\s*blur\([^)]*\);/);
}

describe("visible-first structural motion", () => {
  it("keeps shared base entrances visible", () => {
    expectVisibleFirst("fadeUp", baseStyles);
    expectVisibleFirst("sectionScrollIn", baseStyles);
  });

  it("keeps shared surface entrances visible and unblurred", () => {
    for (const name of [
      "nv-hero-in",
      "od-card-rise",
      "od-highlight-in",
      "od-footer-in",
    ]) {
      expectVisibleFirst(name, surfaceStyles);
    }
  });

  it("does not pre-hide structural lists before their entrance", () => {
    for (const selector of [
      ".work:not(.work-drafts) > h2",
      ".work-drafts > h2",
      ".work:not(.work-drafts) > .work-list > .work-item",
      ".work-drafts > .work-list > .work-item",
      ".play-entry",
      ".project-chapter",
      ".project-chapter-title",
      ".project-evidence-heading",
      ".project-chapter-motif",
      ".project-sections > .project-section",
      ".project-work-jump-card",
      ".project-work-jump-view-all",
    ]) {
      for (const block of cssBlocks(selector, baseStyles)) {
        expect(block).not.toMatch(/opacity:\s*0;/);
      }
    }
  });

  it("retains project-specific artifact motion", () => {
    expect(surfaceStyles).toContain("@keyframes tt-outcome-arrive");
    expect(surfaceStyles).toContain("@keyframes nv-persona-rise");
    expect(surfaceStyles).toContain("@keyframes uf-template-sweep");
  });
});
