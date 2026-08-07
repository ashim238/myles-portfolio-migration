import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
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

describe("Myles 97 homepage layout", () => {
  it("uses the workstation field as the full first-impression surface", () => {
    const shell = block(".myles97-shell");
    const desktop = block(".myles97-desktop");

    expect(shell).toMatch(/min-height:\s*100svh/);
    expect(shell).toMatch(/background:\s*var\(--m97-desktop\)/);
    expect(desktop).toMatch(/position:\s*relative/);
  });

  it("keeps the approved welcome line prominent without overpowering program discovery", () => {
    const statement = block(".myles97-welcome-statement");
    const explorer = block(".myles97-selected-work-list");

    expect(statement).toMatch(/max-width:\s*19ch/);
    expect(statement).toMatch(/clamp\(1\.25rem, 2\.5vw, 1\.75rem\)/);
    expect(explorer).toMatch(/grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  });
});
