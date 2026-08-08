import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/navi-case-refinement.css"),
  "utf8",
);
const workLayout = readFileSync(
  resolve(process.cwd(), "src/app/work/layout.tsx"),
  "utf8",
);

describe("Navi research rail alignment", () => {
  it("centers horizontal rails on the first and last grid markers", () => {
    expect(css).toMatch(
      /\.nv-page \.nv-research-route--journey\s*\{[\s\S]*?margin-inline:\s*calc\(\(100% - 2rem\) \/ 6\);/,
    );
    expect(css).toMatch(
      /\.nv-page \.nv-research-route--booking\s*\{[\s\S]*?margin-inline:\s*calc\(\(100% - 4rem\) \/ 10\);/,
    );
    expect(css).toMatch(
      /\.nv-page :is\(\.nv-research-journey, \.nv-research-booking\) > li::before\s*\{[\s\S]*?top:\s*-1\.575rem;/,
    );
  });

  it("uses one shared mobile x-coordinate for the rail and markers", () => {
    expect(css).toMatch(
      /--nv-mobile-rail-x:\s*1\.25rem;/,
    );
    expect(css).toMatch(
      /li::before\s*\{[\s\S]*?left:\s*var\(--nv-mobile-rail-x\);/,
    );
    expect(css).toMatch(
      /\.nv-page \.nv-research-route\s*\{[\s\S]*?margin-left:\s*var\(--nv-mobile-rail-x\);/,
    );
  });

  it("loads after the primary portfolio surfaces", () => {
    expect(workLayout).toMatch(
      /portfolio-surfaces\.css";\nimport "\.\.\/styles\/navi-case-refinement\.css";/,
    );
  });
});
