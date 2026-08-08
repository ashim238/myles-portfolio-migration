import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-refinement.css"),
  "utf8",
);

describe("Myles 98 system signals", () => {
  it("gives About and Resume controls real interior space", () => {
    expect(css).toMatch(
      /\.myles98-system-document \.about-action\s*\{[\s\S]*?min-height:\s*44px;[\s\S]*?padding:\s*10px 12px;/,
    );
    expect(css).toMatch(
      /\.myles98-system-document :is\(\.about-detail, \.resume-detail\)\s*\{[\s\S]*?padding:\s*14px 16px;/,
    );
    expect(css).toMatch(
      /\.myles98-system-document \.resume-note\s*\{[\s\S]*?margin-top:\s*1\.6rem;[\s\S]*?padding:\s*10px 14px;/,
    );
  });

  it("turns the Reader handoff into a window-like system object", () => {
    expect(css).toMatch(
      /\.reader-mode \.project-work-jump-card\s*\{[\s\S]*?border:\s*2px solid var\(--m97-ink\);[\s\S]*?box-shadow:/,
    );
    expect(css).toMatch(
      /\.reader-mode \.project-work-jump-chrome\s*\{[\s\S]*?background:\s*var\(--m97-active\);/,
    );
    expect(css).toMatch(
      /\.reader-mode \.project-work-jump-window-action\s*\{[\s\S]*?background:\s*var\(--m97-signal\);/,
    );
    expect(css).toMatch(
      /\.reader-mode \.project-work-jump-status\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\) auto;/,
    );
  });

  it("uses a crisp pointer, a click state, and an input I-beam", () => {
    expect(css).toMatch(
      /\.dot-cursor\s*\{[\s\S]*?width:\s*24px;[\s\S]*?height:\s*32px;/,
    );
    expect(css).toContain("shape-rendering: crispEdges");
    expect(css).toMatch(
      /\.dot-cursor--pressed \.myles98-cursor-arrow\s*\{[\s\S]*?transform:\s*translate\(-1px, -1px\);/,
    );
    expect(css).toMatch(
      /\.dot-cursor--input \.myles98-cursor-ibeam\s*\{[\s\S]*?display:\s*block;/,
    );
  });

  it("stacks the handoff and preserves full-width document actions on Pocket", () => {
    expect(css).toMatch(
      /@media \(max-width: 767px\), \(pointer: coarse\)[\s\S]*?\.myles98-system-document \.about-action,[\s\S]*?width:\s*100%;/,
    );
    expect(css).toMatch(
      /@media \(max-width: 767px\), \(pointer: coarse\)[\s\S]*?\.reader-mode \.project-work-jump-body\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
  });
});
