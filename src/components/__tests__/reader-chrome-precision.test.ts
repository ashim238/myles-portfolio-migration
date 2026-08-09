import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const precisionStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-precision.css"),
  "utf8",
);

describe("Reader chrome precision", () => {
  it("uses a dedicated compact FAFSA mail silhouette in dense monochrome chrome", () => {
    expect(precisionStyles).toMatch(
      /svg\[data-m98-icon="fafsa"\]\[data-m98-icon-variant="mono"\][\s\S]*?-webkit-mask:[\s\S]*?M3 4h18v16H3zM3 8h18M6 11h12v6H6zM6 11l6 4 6-4/,
    );
    expect(precisionStyles).toMatch(
      /svg\[data-m98-icon="fafsa"\]\[data-m98-icon-variant="mono"\][\s\S]*?> \*\s*\{[\s\S]*?display:\s*none;/,
    );
  });

  it("aligns the Pocket Reader back control to the shared 12px safe edge", () => {
    expect(precisionStyles).toMatch(
      /@media \(max-width: 767px\)[\s\S]*?\.reader-mode\.reader-mode \.project-topbar\s*\{[\s\S]*?margin:\s*0 calc\(12px - 1\.4rem\) 0\.35rem;[\s\S]*?padding-top:\s*8px;/,
    );
    expect(precisionStyles).toMatch(
      /\.reader-mode\.reader-mode \.project-topbar a\s*\{[\s\S]*?min-height:\s*44px;[\s\S]*?gap:\s*8px;[\s\S]*?margin:\s*0;/,
    );
  });
});
