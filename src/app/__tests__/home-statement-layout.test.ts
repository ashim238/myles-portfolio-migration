import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

function block(selector: string) {
  const start = css.indexOf(`${selector} {`);
  expect(start, `${selector} rule`).toBeGreaterThanOrEqual(0);
  const open = css.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < css.length; index += 1) {
    if (css[index] === "{") depth += 1;
    if (css[index] === "}") depth -= 1;
    if (depth === 0) return css.slice(open + 1, index);
  }

  throw new Error(`Unclosed rule for ${selector}`);
}

describe("homepage statement decoder layout", () => {
  it("reserves one stable grid area with the primary hero typography", () => {
    const decoder = block(".hero-statement-decoder");
    const sizer = block(".hero-statement-decoder-sizer");
    const cursorReserve = block(".hero-statement-decoder-sizer::after");
    const visible = block(".hero-statement-decoder-visible");

    expect(decoder).toMatch(/display:\s*grid/);
    expect(decoder).toMatch(/font-size:\s*clamp\(1\.18rem, 2\.5vw, 1\.55rem\)/);
    expect(decoder).not.toMatch(/font-family:\s*var\(--font-mono\)/);
    expect(sizer).toMatch(/grid-area:\s*1\s*\/\s*1/);
    expect(sizer).toMatch(/visibility:\s*hidden/);
    expect(cursorReserve).toMatch(/content:\s*"\|"/);
    expect(cursorReserve).toMatch(/display:\s*inline-block/);
    expect(cursorReserve).toMatch(/inline-size:\s*0\.5ch/);
    expect(visible).toMatch(/grid-area:\s*1\s*\/\s*1/);
    expect(visible).toMatch(/min-width:\s*0/);
  });

  it("removes the superseded typer selectors", () => {
    expect(css).not.toMatch(/\.hero-typer(?:-|\s|\{)/);
  });
});
