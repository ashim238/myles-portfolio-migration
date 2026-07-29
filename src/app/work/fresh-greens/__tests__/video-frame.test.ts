import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);

describe("Fresh Greens en-route video frame", () => {
  it("adds a restrained phone shell on desktop without shrinking mobile video", () => {
    expect(stylesheet).toMatch(
      /@media \(min-width: 641px\) \{[\s\S]*?\.fg-en-route-video \.case-video-frame\s*\{[\s\S]*?padding:\s*8px;[\s\S]*?border-radius:\s*2rem;[\s\S]*?background:\s*#111;[\s\S]*?\}/,
    );
    expect(stylesheet).toMatch(
      /@media \(min-width: 641px\) \{[\s\S]*?\.fg-en-route-video \.case-lead-video\s*\{[\s\S]*?border:\s*0;[\s\S]*?border-radius:\s*1\.5rem;[\s\S]*?\}/,
    );
    expect(stylesheet).toMatch(
      /\.fg-en-route-video\s*\{[\s\S]*?max-width:\s*320px;/,
    );
  });
});
