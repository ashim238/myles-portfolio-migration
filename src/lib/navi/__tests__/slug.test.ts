import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { slugify } from "@/lib/navi/slug";

describe("slugify", () => {
  it("normalizes diacritics, punctuation, and repeated separators", () => {
    expect(slugify("  Eléni's Bedford–Stuyvesant Walk  ")).toBe(
      "eleni-s-bedford-stuyvesant-walk",
    );
  });

  it("keeps slugification data-free", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/lib/navi/slug.ts"),
      "utf8",
    );

    expect(source).not.toMatch(/demo-data|EXPERIENCES/);
  });
});
