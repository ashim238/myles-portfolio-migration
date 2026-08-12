import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const readerStyles = readFileSync(
  resolve(testDirectory, "../../app/styles/reader-mode.css"),
  "utf8",
);

function cssBlock(header: string, source = readerStyles) {
  const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const ruleStart = new RegExp(
    `(?:^|\\n)\\s*${escapedHeader}\\s*(?:,|\\{)`,
    "g",
  );
  const match = ruleStart.exec(source);

  expect(match, `${header} CSS block`).not.toBeNull();

  const open = source.indexOf("{", match!.index);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS block for ${header}`);
}

describe("ProjectToc Reader layout", () => {
  it("keeps the enhanced coarse Reader TOC in the sticky reading lane instead of a fixed bottom overlay", () => {
    const coarseReader = cssBlock(
      "@media (max-width: 767px), (pointer: coarse)",
    );
    const toc = cssBlock(
      '.reader-mode.reader-mode .project-toc[data-toc-ready="true"]',
      coarseReader,
    );

    expect(toc).toMatch(/position:\s*sticky;/);
    expect(toc).toMatch(/top:\s*52px;/);
    expect(toc).toMatch(/bottom:\s*auto;/);
    expect(toc).not.toMatch(/position:\s*fixed;/);
    expect(toc).not.toMatch(/z-index:\s*140;/);
  });
});
