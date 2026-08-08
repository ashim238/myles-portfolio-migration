import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-precision.css"),
  "utf8",
);
const startMenu = readFileSync(
  resolve(process.cwd(), "src/components/myles-97/start-menu.tsx"),
  "utf8",
);

describe("Myles 98 precision corrections", () => {
  it("keeps the Start signal rail outside the rotated wordmark", () => {
    expect(startMenu).toContain('className="myles97-start-menu-wordmark"');
    expect(css).toMatch(
      /\.myles97-start-menu-brand\s*\{[\s\S]*?writing-mode:\s*horizontal-tb;[\s\S]*?transform:\s*none;/,
    );
    expect(css).toMatch(
      /\.myles97-start-menu-wordmark\s*\{[\s\S]*?writing-mode:\s*vertical-rl;[\s\S]*?transform:\s*rotate\(180deg\);/,
    );
    expect(css).toMatch(
      /\.myles97-start-menu-brand\s*\{[\s\S]*?border-right:\s*5px solid var\(--m97-signal\);[\s\S]*?box-shadow:\s*none;/,
    );
    expect(css).not.toContain("inset -5px 0 0 var(--m97-signal)");
  });

  it("reserves enough menu width and taskbar clearance for the full brand", () => {
    expect(css).toMatch(/bottom:\s*64px;/);
    expect(css).toMatch(
      /grid-template-columns:\s*62px minmax\(0, 1fr\);/,
    );
    expect(css).toMatch(/padding:\s*14px 9px;/);
  });

  it("gives the longer tagline a stable workstation and Pocket measure", () => {
    expect(css).toMatch(
      /\.myles97-welcome-statement,[\s\S]*?\.pocket97-statement\s*\{[\s\S]*?max-width:\s*27ch;[\s\S]*?text-wrap:\s*balance;/,
    );
  });
});
