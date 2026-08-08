import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/fafsa-case-refinement.css"),
  "utf8",
);
const workLayout = readFileSync(
  resolve(process.cwd(), "src/app/work/layout.tsx"),
  "utf8",
);

describe("UnderstandingFAFSA composer fidelity", () => {
  it("frames the interaction as an email assembly workspace", () => {
    expect(css).toMatch(
      /\.uf-page \.uf-composer\s*\{[\s\S]*?overflow:\s*hidden;[\s\S]*?box-shadow:/,
    );
    expect(css).toMatch(
      /\.uf-page :is\(\.uf-composer-shelf, \.uf-composer-preview\)\s*\{[\s\S]*?border:\s*1px solid var\(--line\);[\s\S]*?background:\s*var\(--surface\);/,
    );
    expect(css).toMatch(
      /\.uf-page \.uf-composer-canvas\s*\{[\s\S]*?width:\s*min\(38rem, calc\(100% - 1\.5rem\)\);[\s\S]*?background:\s*#fff;/,
    );
  });

  it("lets the actual newsletter modules dominate the assembled preview", () => {
    expect(css).toMatch(
      /grid-template-areas:[\s\S]*?"leading meta trailing"[\s\S]*?"preview preview preview";/,
    );
    expect(css).toMatch(
      /\.uf-page :is\(\.uf-composer-pinned-thumb, \.uf-composer-item-thumb\)\s*\{[\s\S]*?grid-area:\s*preview;[\s\S]*?width:\s*100%;[\s\S]*?height:\s*clamp\(9rem, 22vw, 15rem\);/,
    );
    expect(css).toMatch(
      /object-fit:\s*cover;[\s\S]*?object-position:\s*top center;/,
    );
  });

  it("keeps mobile reorder controls at a full touch target", () => {
    expect(css).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.uf-page \.uf-composer-mini\s*\{[\s\S]*?width:\s*2\.75rem;[\s\S]*?height:\s*2\.75rem;/,
    );
  });

  it("loads after the shared portfolio and Navi case-study surfaces", () => {
    expect(workLayout).toMatch(
      /portfolio-surfaces\.css";\nimport "\.\.\/styles\/navi-case-refinement\.css";\nimport "\.\.\/styles\/fafsa-case-refinement\.css";/,
    );
  });
});
