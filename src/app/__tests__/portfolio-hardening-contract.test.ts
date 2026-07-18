import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function cssBlock(selector: string, source = baseStyles) {
  const start = source.indexOf(`${selector} {`);
  expect(start, `${selector} rule`).toBeGreaterThanOrEqual(0);

  const open = source.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS rule for ${selector}`);
}

function cssBlockContaining(atRule: string, needle: string) {
  let cursor = 0;

  while (cursor < baseStyles.length) {
    const start = baseStyles.indexOf(`${atRule} {`, cursor);
    if (start < 0) break;
    const candidate = cssBlock(atRule, baseStyles.slice(start));
    if (candidate.includes(needle)) return candidate;
    cursor = start + atRule.length;
  }

  throw new Error(`${atRule} block containing ${needle} was not found`);
}

describe("portfolio hardening style contract", () => {
  it("defines the shared radius tokens", () => {
    const root = cssBlock(":root");

    expect(root).toMatch(/--rounded-sm:\s*0\.35rem;/);
    expect(root).toMatch(/--rounded-md:\s*0\.7rem;/);
    expect(root).toMatch(/--rounded-lg:\s*1rem;/);
  });

  it("gives mobile and desktop exclusive ownership at 767 and 768 pixels", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const desktop = cssBlockContaining(
      "@media (min-width: 768px)",
      ".project-work-jump-card",
    );

    expect(baseStyles).not.toMatch(/@media\s*\(max-width:\s*768px\)/);
    expect(baseStyles).not.toMatch(/@media\s*\(max-width:\s*760px\)/);
    expect(baseStyles).not.toMatch(/@media\s*\(min-width:\s*760px\)/);
    expect(cssBlock(".mobile-nav", mobile)).toMatch(/display:\s*flex;/);
    expect(cssBlock(".project-work-jump-card", desktop)).toMatch(
      /grid-template-columns:/,
    );
  });

  it("lets every mobile navigation item share narrow viewports", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const item = cssBlock(".mobile-nav-item", mobile);

    expect(item).toMatch(/flex:\s*1 1 0;/);
    expect(item).toMatch(/min-width:\s*0;/);
  });

  it("clears the fixed mobile navigation and device safe area", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const shell = cssBlock(".page-shell", mobile);

    expect(shell).toMatch(
      /padding-bottom:\s*calc\(3\.6rem \+ env\(safe-area-inset-bottom\) \+ 2rem\);/,
    );
  });

  it("keeps only Email in the mobile footer navigation", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const duplicateLinks = cssBlock(
      '.footer-nav a:not([href^="mailto:"])',
      mobile,
    );

    expect(duplicateLinks).toMatch(/display:\s*none;/);
  });
});
