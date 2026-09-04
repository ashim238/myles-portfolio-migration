import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

const productLanguageFiles = [
  "src/components/myles-97/welcome-program.tsx",
  "src/components/myles-97/boot-sequence.tsx",
  "src/components/myles-97/start-menu.tsx",
  "src/components/myles-97/taskbar.tsx",
  "src/components/myles-97/workstation-desktop.tsx",
  "src/components/myles-97/pocket-97-shell.tsx",
  "src/components/myles-97/system-document-shell.tsx",
  "src/app/not-found.tsx",
  "docs/MYLES_98_NAMING.md",
] as const;

function read(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

describe("Myles 98 product language", () => {
  it("uses Myles 98 and Pocket 98 on visitor-facing system surfaces", () => {
    const source = productLanguageFiles.map(read).join("\n");

    expect(source).not.toMatch(/Welcome to Myles 97|Starting Myles 97|Myles 97 desktop/);
    expect(source).not.toMatch(/Pocket 97(?:\s|<|"|')/);
    expect(source).toContain("Welcome to Myles 98");
    expect(source).toContain("Starting Myles 98");
    expect(source).toContain("Myles 98 desktop");
    expect(source).toContain("Pocket 98");
  });

  it("uses Work Stuff and Loose Parts in current navigation while preserving the /play URL", () => {
    const config = read("src/lib/site-config.ts");
    const mobile = read("src/components/mobile-nav.tsx");
    const play = read("src/app/play/page.tsx");

    expect(config).toContain('label: "01. Work Stuff"');
    expect(config).toContain('href: "/#selected-work"');
    expect(config).toContain('label: "03. Loose Parts"');
    expect(config).not.toContain('label: "03. Play"');

    expect(mobile).toContain('label: "Work Stuff"');
    expect(mobile).toContain('label: "Loose Parts"');
    expect(mobile).not.toContain('label: "Play"');
    expect(mobile).not.toContain('href: "/#work"');

    expect(play).toContain('title: "Loose Parts"');
    expect(play).toContain('path: "/play"');
  });

  it("documents 97 identifiers as legacy implementation details, not product names", () => {
    const naming = read("docs/MYLES_98_NAMING.md");

    expect(naming).toContain("**Myles 98**");
    expect(naming).toContain("**Pocket 98**");
    expect(naming).toContain("Legacy implementation namespace");
    expect(naming).toContain("`myles-97`");
  });
});
