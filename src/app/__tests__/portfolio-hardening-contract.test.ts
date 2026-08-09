import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const pocketStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97-pocket.css"),
  "utf8",
);
const precisionStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-precision.css"),
  "utf8",
);
const pocketHook = readFileSync(
  resolve(process.cwd(), "src/components/myles-97/use-pocket-97.ts"),
  "utf8",
);

function cssBlock(selector: string, source = baseStyles) {
  const start = source.indexOf(`${selector} {`);
  expect(start, `${selector} rule`).toBeGreaterThanOrEqual(0);

  const open = source.indexOf("{", start);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS rule for ${selector}`);
}

function cssBlockContaining(atRule: string, needle: string) {
  let cursor = 0;

  while (cursor < baseStyles.length) {
    const start = baseStyles.indexOf(`${atRule} {`, cursor);
    if (start < 0) break;
    const candidate = cssBlock(atRule, baseStyles.slice(start));
    if (candidate.includes(needle)) return candidate;
    cursor = start + atRule.length;
  }

  throw new Error(`${atRule} block containing ${needle} was not found`);
}

describe("portfolio hardening style contract", () => {
  it("defines the shared radius tokens", () => {
    const root = cssBlock(":root");

    expect(root).toMatch(/--rounded-sm:\s*0\.35rem;/);
    expect(root).toMatch(/--rounded-md:\s*0\.7rem;/);
    expect(root).toMatch(/--rounded-lg:\s*1rem;/);
  });

  it("switches Pocket 97 through the approved capability query with a safe server snapshot", () => {
    expect(pocketHook).toContain("useSyncExternalStore");
    expect(pocketHook).toContain(
      '"(max-width: 1023px), (pointer: coarse)"',
    );
    expect(pocketHook).toMatch(/function getServerSnapshot\(\)\s*\{\s*return false;/);
    expect(pocketHook).not.toContain("window.innerWidth");
    expect(pocketStyles).toContain(
      "@media (max-width: 1023px), (pointer: coarse)",
    );
  });

  it("prevents horizontal desktop panning before Pocket hydration", () => {
    const fallback = cssBlock(
      '.myles97-shell[data-m97-shell="workstation"] .myles97-desktop',
      pocketStyles,
    );

    expect(fallback).toMatch(/min-width:\s*0;/);
    expect(fallback).toMatch(/overflow-x:\s*hidden;/);
    expect(pocketStyles).toMatch(
      /\.myles97-window\s*\{[\s\S]*position:\s*relative !important;/,
    );
  });

  it("keeps the narrow workstation recipe note in its dedicated column", () => {
    const compact = cssBlock(
      "@media (min-width: 1024px) and (max-width: 1080px) and (pointer: fine)",
      precisionStyles,
    );
    const note = cssBlock(".myles97-roti-note", compact);
    const title = cssBlock(".myles97-roti-note strong", compact);
    const copy = cssBlock(
      ".myles97-roti-note > span:last-child",
      compact,
    );

    expect(note).toMatch(/width:\s*116px;/);
    expect(note).toMatch(/min-height:\s*176px;/);
    expect(note).toMatch(/justify-self:\s*end;/);
    expect(note).toMatch(/margin-right:\s*8px;/);
    expect(note).toMatch(/padding:\s*12px;/);
    expect(title).toMatch(/font-size:\s*15px;/);
    expect(copy).toMatch(/font-size:\s*10px;/);
  });

  it("gives the Pocket dock safe-area clearance and 44px controls", () => {
    const dock = cssBlock(".pocket97-dock", pocketStyles);
    const button = cssBlock(".pocket97-dock button", pocketStyles);
    const stage = cssBlock(".pocket97-stage", pocketStyles);

    expect(dock).toMatch(/env\(safe-area-inset-bottom, 0px\)/);
    expect(dock).toMatch(/grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\);/);
    expect(button).toMatch(/min-height:\s*44px;/);
    expect(stage).toMatch(/env\(safe-area-inset-bottom, 0px\)/);
  });

  it("lets every legacy mobile navigation item share narrow utility routes", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const item = cssBlock(".mobile-nav-item", mobile);

    expect(item).toMatch(/flex:\s*1 1 0;/);
    expect(item).toMatch(/min-width:\s*0;/);
  });

  it("normalizes inline arrow spacing without baked-in text spaces", () => {
    const forwardArrowRule = cssBlock(
      ':where(\n  .about-action,\n  .project-work-jump-cta,\n  .project-work-jump-view-all,\n  .case-cut-evidence-cta,\n  .nv-demo-embed-mobile-cta,\n  .nv-system-cta-link,\n  .uf-before-after-item a,\n  .uf-switcher-preview a,\n  .play-embed-fallback a\n) > span[aria-hidden="true"]:last-child',
    );
    const backArrowRule = cssBlock(
      '.project-topbar a > span[aria-hidden="true"]:first-child',
    );

    expect(forwardArrowRule).toMatch(/margin-inline-start:\s*0\.32em;/);
    expect(forwardArrowRule).toMatch(/transform:\s*translateY\(-0\.04em\);/);
    const arrowSources = [
      "src/app/page.tsx",
      "src/app/about/page.tsx",
      "src/app/play/page.tsx",
      "src/app/resume/page.tsx",
      "src/app/work/[slug]/page.tsx",
      "src/app/work/fresh-greens/page.tsx",
      "src/app/work/navi/page.tsx",
      "src/app/work/tiktok/page.tsx",
      "src/app/work/understandingfafsa/page.tsx",
      "src/components/loom-embed.tsx",
      "src/components/navi-demo-embed.tsx",
      "src/components/project-work-jump.tsx",
      "src/components/understandingfafsa.tsx",
    ]
      .map((path) => readFileSync(resolve(process.cwd(), path), "utf8"))
      .join("\n");

    expect(backArrowRule).toMatch(/margin-inline-end:\s*0\.34em;/);
    expect(arrowSources).not.toMatch(/<span aria-hidden="true"> [↓→↗]/);
    expect(arrowSources).not.toMatch(/<span aria-hidden="true">← /);
  });

  it("adds the safe area to legacy mobile navigation without shrinking its controls", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const nav = cssBlock(".mobile-nav", mobile);
    const item = cssBlock(".mobile-nav-item", mobile);

    expect(nav).toMatch(
      /height:\s*calc\(3\.6rem \+ env\(safe-area-inset-bottom, 0px\)\);/,
    );
    expect(nav).toMatch(
      /padding-bottom:\s*env\(safe-area-inset-bottom, 0px\);/,
    );
    expect(nav).toMatch(/box-sizing:\s*border-box;/);
    expect(item).toMatch(/min-height:\s*2\.75rem;/);
  });

  it("clears the fixed legacy mobile navigation and device safe area", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const shell = cssBlock(".page-shell", mobile);

    expect(shell).toMatch(
      /padding-bottom:\s*calc\(3\.6rem \+ env\(safe-area-inset-bottom\) \+ 2rem\);/,
    );
  });

  it("keeps only Email in the legacy mobile footer navigation", () => {
    const mobile = cssBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav-item",
    );
    const duplicateLinks = cssBlock(
      '.footer-nav a:not([href^="mailto:"])',
      mobile,
    );

    expect(duplicateLinks).toMatch(/display:\s*none;/);
  });
});
