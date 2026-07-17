import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);

function cssBlock(header: string, source = styles) {
  const start = source.indexOf(header);
  expect(start, `${header} CSS header`).toBeGreaterThanOrEqual(0);
  const open = source.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS block for ${header}`);
}

describe("Fresh Greens lead cover layout", () => {
  it("uses the approved desktop crop and backing", () => {
    const frame = cssBlock(".case-lead-media--fresh-greens");
    const image = cssBlock(".case-lead-media--fresh-greens .case-lead-img");

    expect(frame).toMatch(/--fg-cover-scale:\s*1\.03;/);
    expect(frame).toMatch(/aspect-ratio:\s*16\s*\/\s*9;/);
    expect(frame).toMatch(/margin-bottom:\s*1\.5rem;/);
    expect(frame).toMatch(/background:\s*#001301;/i);
    expect(image).toMatch(/height:\s*100%;/);
    expect(image).toMatch(/object-fit:\s*cover;/);
    expect(image).toMatch(/transform:\s*scale\(var\(--fg-cover-scale\)\);/);
  });

  it("restores the source ratio and approved scale on mobile", () => {
    const mobile = cssBlock("@media (max-width: 640px)");
    const frame = cssBlock(".case-lead-media--fresh-greens", mobile);

    expect(frame).toMatch(/--fg-cover-scale:\s*1\.24;/);
    expect(frame).toMatch(/aspect-ratio:\s*2560\s*\/\s*1862;/);
  });
});
