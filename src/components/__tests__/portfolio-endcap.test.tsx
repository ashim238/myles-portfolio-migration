import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PortfolioEndcap } from "@/components/portfolio-endcap";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const playPage = readFileSync(
  resolve(process.cwd(), "src/app/play/page.tsx"),
  "utf8",
);
const resumePage = readFileSync(
  resolve(process.cwd(), "src/app/resume/page.tsx"),
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

function cssAtRuleContaining(atRule: string, needle: string) {
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

describe("PortfolioEndcap", () => {
  it("keeps Selected Work primary and adapts the secondary destination", () => {
    const play = render(<PortfolioEndcap context="play" />);
    const playNav = screen.getByRole("navigation", {
      name: "Continue exploring",
    });
    expect(
      within(playNav).getByRole("link", { name: "Selected Work" }),
    ).toHaveAttribute("href", "/#selected-work");
    expect(within(playNav).getByRole("link", { name: "Résumé" })).toHaveAttribute(
      "href",
      "/resume",
    );

    play.unmount();
    render(<PortfolioEndcap context="resume" />);
    const resumeNav = screen.getByRole("navigation", {
      name: "Continue exploring",
    });
    expect(
      within(resumeNav).getByRole("link", { name: "Selected Work" }),
    ).toHaveAttribute("href", "/#selected-work");
    expect(
      within(resumeNav).getByRole("link", { name: "Loose Parts" }),
    ).toHaveAttribute("href", "/play");
  });

  it("stays compact and desktop-only beside the persistent mobile nav", () => {
    expect(cssBlock(".portfolio-endcap")).toMatch(/display:\s*none;/);

    const desktop = cssAtRuleContaining(
      "@media (min-width: 768px)",
      ".portfolio-endcap",
    );
    const endcap = cssBlock(".portfolio-endcap", desktop);
    expect(endcap).toMatch(/display:\s*flex;/);
    expect(endcap).toMatch(/border-top:\s*1px solid var\(--line\);/);
    expect(endcap).toMatch(/padding-top:\s*1\.25rem;/);
    expect(cssBlock(".portfolio-endcap-links a")).toMatch(
      /min-height:\s*44px;/,
    );
  });

  it("stays out of printed resumes", () => {
    const print = cssAtRuleContaining("@media print", ".portfolio-endcap");
    expect(print).toMatch(/\.portfolio-endcap[\s\S]*?display:\s*none !important;/);
  });

  it("continues both Loose Parts and Résumé into the rest of the portfolio", () => {
    expect(playPage).toContain('import { PortfolioEndcap } from "@/components/portfolio-endcap";');
    expect(playPage).toContain('<PortfolioEndcap context="play" />');
    expect(resumePage).toContain('import { PortfolioEndcap } from "@/components/portfolio-endcap";');
    expect(resumePage).toContain('<PortfolioEndcap context="resume" />');
  });
});