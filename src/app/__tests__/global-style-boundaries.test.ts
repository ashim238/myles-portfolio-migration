import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const appDirectory = resolve(process.cwd(), "src/app");
const expectedImports = [
  '@import "tailwindcss";',
  '@import "./styles/base.css";',
  '@import "./styles/late-polish.css";',
  '@import "./styles/myles-97.css";',
  '@import "./styles/myles-97-secondary.css";',
  '@import "./styles/reader-mode.css";',
];

const sections = [
  ["styles/base.css", ":root {"],
  ["styles/portfolio-surfaces.css", "Fresh Greens case study"],
  ["styles/navi-minisite.css", "Navi mini-site scope (.nv-ui)"],
  ["styles/late-polish.css", "Motion-play: non-gating section-heading emphasis"],
  ["styles/myles-97.css", "Myles 97 workstation foundation"],
  ["styles/myles-97-secondary.css", "Myles 97 secondary programs and recovery surfaces"],
  ["styles/reader-mode.css", "Myles 97 Reader Mode"],
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

  it("loads portfolio and Navi styles only from their route layouts", () => {
    for (const relativePath of [
      "about/layout.tsx",
      "play/layout.tsx",
      "work/layout.tsx",
    ]) {
      expect(
        readFileSync(resolve(appDirectory, relativePath), "utf8"),
      ).toContain('portfolio-surfaces.css"');
    }

    const naviLayout = readFileSync(
      resolve(appDirectory, "work/navi/(minisite)/layout.tsx"),
      "utf8",
    );
    expect(naviLayout).toContain('navi-minisite.css"');
    expect(naviLayout).not.toContain('portfolio-surfaces.css"');
  });

  it("keeps shared TikTok cover art available on the homepage", () => {
    const baseStyles = readFileSync(
      resolve(appDirectory, "styles/base.css"),
      "utf8",
    );

    expect(baseStyles).toContain(".tt-cover-field {");
    expect(baseStyles).toContain(".tt-cover-cluster {");
    expect(baseStyles).toContain(".tt-cblob {");
    expect(baseStyles).toContain(".tt-cover--preview .tt-cblob {");
    expect(baseStyles).toContain("@keyframes tt-preview-piece-a1");
  });

  it("keeps shared site-logo sizing available on every route", () => {
    const baseStyles = readFileSync(
      resolve(appDirectory, "styles/base.css"),
      "utf8",
    );
    const portfolioStyles = readFileSync(
      resolve(appDirectory, "styles/portfolio-surfaces.css"),
      "utf8",
    );

    expect(baseStyles).toContain(".site-logo {");
    expect(baseStyles).toContain(".site-logo svg {");
    expect(portfolioStyles).not.toContain(".site-logo {");
  });

  it("loads Instrument Serif normal only within Fresh Greens", () => {
    const rootLayout = readFileSync(resolve(appDirectory, "layout.tsx"), "utf8");
    const freshGreensLayout = readFileSync(
      resolve(appDirectory, "work/fresh-greens/layout.tsx"),
      "utf8",
    );

    expect(rootLayout).not.toContain("Instrument_Serif");
    expect(rootLayout).not.toContain("serif.variable");
    expect(freshGreensLayout).toContain("Instrument_Serif");
    expect(freshGreensLayout).toContain(
      'variable: "--font-instrument-serif"',
    );
    expect(freshGreensLayout).toContain('style: "normal"');
    expect(freshGreensLayout).not.toContain("italic");
  });

  it("omits proven-unused packages and starter assets", () => {
    const manifest = JSON.parse(
      readFileSync(resolve(process.cwd(), "package.json"), "utf8"),
    ) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    for (const dependency of ["animejs", "react-leaflet"]) {
      expect(manifest.dependencies).not.toHaveProperty(dependency);
    }
    for (const dependency of ["@turf/turf", "@vitest/ui"]) {
      expect(manifest.devDependencies).not.toHaveProperty(dependency);
    }
    expect(existsSync(resolve(process.cwd(), ".npmrc"))).toBe(false);
    for (const asset of [
      "file.svg",
      "globe.svg",
      "next.svg",
      "vercel.svg",
      "window.svg",
    ]) {
      expect(existsSync(resolve(process.cwd(), "public", asset))).toBe(false);
    }
  });
});
