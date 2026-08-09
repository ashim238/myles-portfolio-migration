import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/reader-evidence.css"),
  "utf8",
);

describe("Reader evidence composition", () => {
  it("keeps the shared layer semantic and project-accented", () => {
    expect(styles).toContain(".reader-evidence-summary {");
    expect(styles).toMatch(
      /\.reader-evidence-summary\s*\{[^}]*border-left:\s*3px solid var\(--chapter-motif-accent\);/,
    );
    expect(styles).not.toMatch(
      /\.reader-evidence-summary\s*\{[^}]*(?:background|border-radius|box-shadow):/,
    );
  });

  it("stacks summary labels on narrow screens and survives forced colors", () => {
    expect(styles).toMatch(
      /@media \(max-width: 560px\)[\s\S]*\.reader-evidence-summary-row\s*\{[^}]*grid-template-columns:\s*1fr;/,
    );
    expect(styles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*\.reader-evidence-summary/,
    );
    expect(styles).toMatch(/border-color:\s*CanvasText;/);
  });
});
