import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const latePolishStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);
const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function declarationBlock(styles: string, selector: string): string {
  const start = styles.indexOf(`${selector} {`);
  if (start < 0) return "";
  const open = styles.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < styles.length; index += 1) {
    if (styles[index] === "{") depth += 1;
    if (styles[index] === "}") depth -= 1;
    if (depth === 0) return styles.slice(start, index + 1);
  }
  return "";
}

describe("interaction evidence styling", () => {
  it("gives homepage evidence a distinct compact reading line", () => {
    const label = declarationBlock(baseStyles, ".work-card-evidence");

    expect(label).toContain("display: inline-flex");
    expect(label).toContain("margin-top: 0.9rem");
    expect(label).toContain("font-size: 0.85rem");
    expect(label).toContain("font-weight: 600");
    expect(label).toContain("color: var(--foreground)");
  });

  it("keeps Fresh Greens choices equal-weight and touch-ready", () => {
    const choices = declarationBlock(
      latePolishStyles,
      ".fg-pulled-answer-options",
    );
    const choice = declarationBlock(
      latePolishStyles,
      ".fg-pulled-answer-choice",
    );
    const label = declarationBlock(latePolishStyles, ".fg-pulled-answer-label");
    const control = declarationBlock(latePolishStyles, ".fg-pulled-control");
    const hidden = declarationBlock(
      latePolishStyles,
      ".fg-pulled-interaction[hidden]",
    );

    expect(choices).toContain("grid-template-columns: repeat(3, minmax(7.25rem, 1fr))");
    expect(choice).toContain("justify-content: flex-start");
    expect(choice).toContain("min-height: 44px");
    expect(choice).toContain("border-radius: var(--rounded-md)");
    expect(choice).toContain("font-size: 0.85rem");
    expect(label).toContain("overflow-wrap: anywhere");
    expect(control).toContain("min-height: 44px");
    expect(control).toContain("border-radius: var(--rounded-sm)");
    expect(control).toContain("font-size: 0.85rem");
    expect(hidden).toContain("display: none");
  });

  it("keeps recruiter trailhead targets below the sticky project navigation", () => {
    expect(baseStyles).toMatch(
      /\.project-page\s+:is\(h2\[id\],\s*\.project-evidence-heading\[id\]\)\s*\{[^}]*scroll-margin-top:\s*var\(--project-heading-offset\)/,
    );
  });
});
