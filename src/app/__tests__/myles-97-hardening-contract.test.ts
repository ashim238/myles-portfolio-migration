import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function read(path: string) {
  return readFileSync(resolve(root, path), "utf8");
}

function readTree(directory: string): string {
  const absolute = resolve(root, directory);
  return readdirSync(absolute)
    .flatMap((entry) => {
      const path = resolve(absolute, entry);
      if (statSync(path).isDirectory()) {
        return readTree(`${directory}/${entry}`);
      }
      if (!/\.(?:ts|tsx|css)$/.test(entry)) return [];
      return [readFileSync(path, "utf8")];
    })
    .join("\n");
}

const mylesSource = [
  readTree("src/components/myles-97"),
  readTree("src/lib/myles-97"),
  read("src/app/styles/myles-97.css"),
  read("src/app/styles/myles-97-secondary.css"),
  read("src/app/styles/myles-97-pocket.css"),
  read("src/app/styles/reader-mode.css"),
].join("\n");

describe("Myles 98 hardening contract", () => {
  it("uses original local UI resources without hotlinked or proprietary assets", () => {
    expect(mylesSource).not.toMatch(/(?:src|poster)\s*=\s*[{"']\s*https?:\/\//i);

    const resourceReferences =
      mylesSource.match(
        /(?:src|poster)\s*=\s*(?:\{\s*)?["'][^"']+["'](?:\s*\})?|url\([^)]*\)|from\s+["'][^"']+["']/gi,
      )?.join("\n") ?? "";
    expect(resourceReferences).not.toMatch(/windows|microsoft|\.wav\b/i);
    expect(mylesSource).not.toMatch(/\.wav\b/i);

    const icons = read("src/components/myles-97/icons.tsx");
    expect(icons).toContain('import type { SVGProps } from "react";');
    expect(icons).not.toMatch(/from\s+["'](?!react)/);
    expect(existsSync(resolve(root, "THIRD_PARTY_NOTICES.md"))).toBe(false);
  });

  it("keeps boot presentation below the 1.5 second ceiling", () => {
    const boot = read("src/components/myles-97/boot-sequence.tsx");
    const match = boot.match(/MYLES97_BOOT_MAX_MS\s*=\s*(\d+)/);
    expect(match).not.toBeNull();
    expect(Number(match?.[1])).toBeLessThanOrEqual(1500);
    expect(boot).toContain("prefers-reduced-motion: reduce");
  });

  it("keeps a transition failsafe and explicit cleanup exits", () => {
    const transition = read("src/components/project-enter-transition.tsx");
    expect(transition).toMatch(/TRANSITION_FAILSAFE_MS\s*=\s*\d+/);
    expect(transition).toContain('event.key === "Escape"');
    expect(transition).toContain("unlockProjectEnter();");
    expect(transition).toContain("animation.cancel()");
  });

  it("preserves canonical project URLs and explicit transition target markers", () => {
    const programs = read("src/lib/myles-97/programs.ts");
    expect(programs).toContain('href: `/work/${blueprint.id}` as const');

    const readerShell = read("src/components/myles-97/reader-shell.tsx");
    expect(readerShell).toContain("data-project-slug={slug}");

    const leadMedia = read("src/components/lead-media.tsx");
    const projectCover = read("src/components/project-cover.tsx");
    const tiktok = read("src/app/work/tiktok/page.tsx");
    expect(leadMedia).toContain("data-project-enter-cover");
    expect(projectCover).toContain("data-project-enter-cover");
    expect(tiktok).toContain("data-project-enter-cover");
  });

  it("keeps Pocket 98 free of horizontal desktop panning", () => {
    const pocket = read("src/app/styles/myles-97-pocket.css");
    expect(pocket).toContain("overflow-x: hidden");
    expect(pocket).toContain('@media (max-width: 767px), (pointer: coarse)');
    expect(pocket).toContain('data-m97-shell="workstation"');
    expect(pocket).not.toMatch(/overflow-x:\s*(?:auto|scroll)/);
  });

  it("declares the approved Reader prose measure and mobile typography", () => {
    const reader = read("src/app/styles/reader-mode.css");
    expect(reader).toMatch(/max-width:\s*68ch/);
    expect(reader).toMatch(/font-size:\s*18px/);
    expect(reader).toMatch(/line-height:\s*1\.7/);
    expect(reader).toMatch(/font-size:\s*16\.5px/);
    expect(reader).toMatch(/line-height:\s*1\.68/);
  });

  it("keeps secondary note surfaces free of generic side-stripe chrome", () => {
    const secondary = read("src/app/styles/myles-97-secondary.css");
    expect(secondary).not.toMatch(
      /\.myles97-recipe-note-copy\s*\{[^}]*border-(?:left|right):\s*[2-9]/,
    );
    expect(secondary).toMatch(
      /\.myles97-recipe-note-copy\s*\{[^}]*border:\s*1px solid #9c9270;/,
    );
  });

  it("keeps direct case-study routes in Reader Mode without requiring desktop state", () => {
    const pages = [
      "src/app/work/[slug]/page.tsx",
      "src/app/work/fresh-greens/page.tsx",
      "src/app/work/understandingfafsa/page.tsx",
      "src/app/work/navi/page.tsx",
      "src/app/work/tiktok/page.tsx",
    ];

    for (const path of pages) {
      const source = read(path);
      expect(source, path).toContain("<ReaderShell");
      expect(source, path).not.toContain("readProjectReturnSnapshot");
    }
  });
});
