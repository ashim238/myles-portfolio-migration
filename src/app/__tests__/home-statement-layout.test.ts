import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
  "utf8",
);
const pocketCss = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97-pocket.css"),
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

describe("Myles 98 homepage layout", () => {
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

  it("keeps the welcome mark compact so identity copy remains dominant", () => {
    const welcome = block(".myles97-welcome");
    const mark = block(".myles97-welcome-mark");
    const artwork = block(".myles97-welcome-mark img");

    expect(welcome).toMatch(/grid-template-columns:\s*64px minmax\(0, 1fr\)/);
    expect(mark).toMatch(/width:\s*64px/);
    expect(mark).toMatch(/height:\s*64px/);
    expect(artwork).toMatch(/width:\s*48px/);
    expect(artwork).toMatch(/height:\s*48px/);
  });

  it("fits 16:9 program covers inside their fixed well without vertical crop", () => {
    const summary = block(".myles97-program-summary");
    const cover = block(".myles97-program-cover");
    const image = block(".myles97-program-cover img");

    expect(summary).toMatch(/grid-template-rows:\s*116px auto/);
    expect(cover).toMatch(/position:\s*relative/);
    expect(cover).toMatch(/background:\s*#dfdfdf/);
    expect(image).toMatch(/position:\s*absolute/);
    expect(image).toMatch(/inset:\s*0/);
    expect(image).toMatch(/width:\s*100%/);
    expect(image).toMatch(/height:\s*100%/);
    expect(image).toMatch(/object-fit:\s*contain/);
  });

  it("keeps both project-choice actions on the functional 12px type floor", () => {
    const guide = block(".myles97-explorer-guide");
    const caseStudy = block(".myles97-case-study-link");
    const preview = block(".myles97-program-launch");

    expect(guide).toMatch(/font-size:\s*12px/);
    expect(caseStudy).toMatch(/font:\s*700 12px\/1\.2 var\(--m97-ui-font\)/);
    expect(preview).toMatch(/font:\s*700 12px\/1\.2 var\(--m97-ui-font\)/);
  });

  it("preserves the primary case-study action in the custom high-contrast mode", () => {
    const primary = block(
      '.myles97-shell[data-m97-contrast="high"] .myles97-case-study-link',
    );

    expect(primary).toMatch(/background:\s*#000/);
    expect(primary).toMatch(/color:\s*#fff/);
  });

  it("highlights project cards only when an actual action receives focus", () => {
    expect(css).not.toContain(".myles97-program-card:hover {");
    const focusedCard = block(".myles97-program-card:focus-within");
    expect(focusedCard).toMatch(/border-color:\s*var\(--m97-active\)/);
  });

  it("keeps the large name open enough to preserve letter shapes", () => {
    const name = block(".myles97-welcome h1");

    expect(name).toMatch(/letter-spacing:\s*-0\.025em/);
    expect(pocketCss).toMatch(
      /\.pocket97-intro h1\s*\{[^}]*letter-spacing:\s*-0\.025em;/,
    );
  });

  it("contains the Start menu within the available viewport", () => {
    const menu = block(".myles97-start-menu");
    const items = block(".myles97-start-menu-items");

    expect(menu).toMatch(/max-height:\s*calc\(100svh - 66px\)/);
    expect(items).toMatch(/min-height:\s*0/);
    expect(items).toMatch(/overflow-y:\s*auto/);
  });
});
