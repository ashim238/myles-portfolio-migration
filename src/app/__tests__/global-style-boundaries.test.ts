import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appDirectory = resolve(process.cwd(), "src/app");
const expectedImports = [
  '@import "tailwindcss";',
  '@import "./styles/base.css";',
  '@import "./styles/portfolio-surfaces.css";',
  '@import "./styles/navi-minisite.css";',
  '@import "./styles/late-polish.css";',
];

const sections = [
  ["styles/base.css", ":root {"],
  ["styles/portfolio-surfaces.css", "Fresh Greens case study"],
  ["styles/navi-minisite.css", "Navi mini-site scope (.nv-ui)"],
  ["styles/late-polish.css", "Motion-play: scroll-driven section reveals"],
] as const;

describe("global stylesheet boundaries", () => {
  it("loads Tailwind and the local stylesheets in fixed cascade order", () => {
    const entry = readFileSync(resolve(appDirectory, "globals.css"), "utf8");
    const imports = entry.match(/^@import .+;$/gm);

    expect(imports).toEqual(expectedImports);
    expect(entry.trim().split("\n")).toEqual(expectedImports);
  });

  it("keeps every owned section in one non-importing stylesheet", () => {
    for (const [relativePath, marker] of sections) {
      const path = resolve(appDirectory, relativePath);
      expect(existsSync(path), `${relativePath} must exist`).toBe(true);

      const stylesheet = readFileSync(path, "utf8");
      expect(stylesheet).toContain(marker);
      expect(stylesheet).not.toMatch(/^@import\b/m);
    }
  });
});
