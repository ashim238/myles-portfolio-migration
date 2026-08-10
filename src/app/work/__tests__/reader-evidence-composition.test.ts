import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/reader-evidence.css"),
  "utf8",
);

describe("Reader evidence composition", () => {
  it("keeps the shared layer semantic without generic side-stripe chrome", () => {
    expect(styles).toContain(".reader-evidence-summary {");
    expect(styles).not.toMatch(
      /\.reader-evidence-summary\s*\{[^}]*border-left:/,
    );
    expect(styles).toMatch(
      /\.reader-evidence-summary\s*\{[^}]*border-top:\s*1px solid/,
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

  it("keeps evidence-state text on contrast-safe ink instead of decorative motif colors", () => {
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode \.project-chapter-evidence-state\s*\{[^}]*color:\s*var\(--chapter-evidence-ink\);/,
    );
    expect(styles).not.toMatch(
      /\.project-chapter-evidence-state\s*\{[^}]*color:\s*var\(--chapter-motif-accent\);/,
    );
    expect(styles).toContain("--chapter-evidence-ink: #3d6447;");
    expect(styles).toContain("--chapter-evidence-ink: #9f3f0d;");
    expect(styles).toContain("--chapter-evidence-ink: #164f73;");
    expect(styles).toContain("--chapter-evidence-ink: #9d174d;");
  });
});
