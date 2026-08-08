import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-polish.css"),
  "utf8",
);

describe("Myles 98 visual refinement", () => {
  it("frames secondary routes as desktop documents", () => {
    expect(css).toMatch(
      /\.myles98-document-canvas\s*\{[\s\S]*?min-height:\s*100svh;[\s\S]*?var\(--m97-desktop\)/,
    );
    expect(css).toMatch(
      /\.myles98-document-window\s*\{[\s\S]*?border:\s*2px solid var\(--m97-ink\);[\s\S]*?box-shadow:/,
    );
    expect(css).toMatch(
      /\.myles98-document-titlebar\s*\{[\s\S]*?background:\s*var\(--m97-active\);/,
    );
    expect(css).toMatch(
      /\.myles98-document-back\s*\{[\s\S]*?min-height:\s*44px;[\s\S]*?background:\s*var\(--m97-signal\);/,
    );
    expect(css).toMatch(
      /\.myles98-document-statusbar\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) auto;/,
    );
  });

  it("transforms the same document language into a full-bleed Pocket surface", () => {
    expect(css).toMatch(
      /@media \(max-width: 767px\), \(pointer: coarse\)\s*\{[\s\S]*?\.myles98-document-canvas\s*\{[\s\S]*?padding:\s*0;[\s\S]*?background:\s*var\(--m97-paper\);/,
    );
    expect(css).toMatch(
      /@media \(max-width: 767px\), \(pointer: coarse\)[\s\S]*?\.myles98-document-window\s*\{[\s\S]*?border:\s*0;[\s\S]*?box-shadow:\s*none;/,
    );
    expect(css).toMatch(
      /@media \(max-width: 767px\), \(pointer: coarse\)[\s\S]*?\.myles98-document-statusbar\s*\{?[\s\S]*?display:\s*none;/,
    );
  });
});
