import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const caseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const exhibitStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);

function rule(source: string, selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|\\n)${escapedSelector}\\s*\\{`).exec(source);
  if (!match) return "";

  const openingBrace = match.index + match[0].length - 1;
  const closingBrace = source.indexOf("}", openingBrace);
  return source.slice(openingBrace + 1, closingBrace);
}

describe("Fresh Greens edge language", () => {
  it("gives editorial evidence a single square-corner treatment", () => {
    expect(caseStyles).toMatch(/--fg-editorial-radius:\s*0;/);

    for (const selector of [
      ".fg-evidence-boundaries",
      ".fg-illustrations",
      ".fg-illustration-panel .expandable-trigger",
      ".fg-illustration-panel img",
      ".fg-page .fg-reminder-evidence",
      ".fg-arch",
      ".fg-palette-swatch",
    ]) {
      expect(rule(caseStyles, selector)).toMatch(
        /border-radius:\s*var\(--fg-editorial-radius\);/,
      );
    }

    for (const selector of [
      ".fg-synth-tab",
      ".fg-synth-panel",
      ".fg-synth-community",
      ".fg-pulled-tab",
      ".fg-pulled-panel",
      ".fg-pulled-answer-choice",
      ".fg-pulled-control",
      ".fg-lofi img",
      ".fg-swatch-chip",
      ".fg-mod-flow",
    ]) {
      expect(rule(exhibitStyles, selector)).toMatch(
        /border-radius:\s*var\(--fg-editorial-radius\);/,
      );
    }
  });

  it("keeps rounded corners only for device and product-native geometry", () => {
    expect(rule(caseStyles, ".fg-phone-bezel")).toMatch(/border-radius:\s*34px;/);
    expect(rule(caseStyles, ".fg-phone-screen")).toMatch(/border-radius:\s*27px;/);
    expect(rule(caseStyles, ".fg-page .fg-reminder-notification")).toMatch(
      /border-radius:\s*var\(--rounded-md\);/,
    );
  });
});
