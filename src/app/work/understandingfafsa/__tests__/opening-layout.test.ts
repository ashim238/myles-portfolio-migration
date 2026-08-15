import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readerStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/reader-mode.css"),
  "utf8",
);

describe("UnderstandingFAFSA opening layout", () => {
  it("compacts only the mobile facts grid so lead media arrives sooner", () => {
    const mobile = readerStyles.match(
      /@media \(max-width: 767px\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(mobile).toBeDefined();
    expect(mobile).toMatch(
      /\.reader-mode\.reader-mode\.uf-page \.project-opening-facts-list\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    );
    expect(mobile).toMatch(
      /\.reader-mode\.reader-mode\.uf-page \.project-opening-facts-row:last-child\s*\{[\s\S]*?grid-column:\s*1 \/ -1;/,
    );
  });
});
