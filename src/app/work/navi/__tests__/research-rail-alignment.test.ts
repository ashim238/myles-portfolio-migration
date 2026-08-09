import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

describe("Navi research rail alignment", () => {
  it("centers horizontal rails on the first and last grid markers", () => {
    expect(css).toMatch(
      /\.nv-research-route--journey\s*\{[^}]*margin-inline:\s*calc\(\(100% - 2rem\) \/ 6\);/,
    );
    expect(css).toMatch(
      /\.nv-research-route--booking\s*\{[^}]*margin-inline:\s*calc\(\(100% - 4rem\) \/ 10\);/,
    );
    expect(css).toMatch(
      /\.nv-research-journey > li::before,[\s\S]*\.nv-research-booking > li::before\s*\{[^}]*top:\s*-1\.575rem;/,
    );
  });

  it("uses one shared mobile x-coordinate for the rail and markers", () => {
    expect(css).toMatch(
      /\.nv-research-artifact\s*\{[^}]*--nv-mobile-rail-x:\s*1\.25rem;/,
    );
    expect(css).toMatch(
      /\.nv-research-journey > li::before,[\s\S]*\.nv-research-booking > li::before\s*\{[^}]*left:\s*var\(--nv-mobile-rail-x\);/,
    );
    expect(css).toMatch(
      /\.nv-research-route\s*\{[^}]*margin-left:\s*var\(--nv-mobile-rail-x\);/,
    );
  });
});
