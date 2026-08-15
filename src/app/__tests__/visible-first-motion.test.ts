import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);
const surfaceStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const lateStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);
const aboutPage = readFileSync(
  resolve(process.cwd(), "src/app/about/page.tsx"),
  "utf8",
);

function cssBlocks(header: string, source: string) {
  const blocks: string[] = [];
  let cursor = 0;

  while (cursor < source.length) {
    const start = source.indexOf(header, cursor);
    if (start === -1) break;
    const open = source.indexOf("{", start);
    let depth = 0;

    for (let index = open; index < source.length; index += 1) {
      if (source[index] === "{") depth += 1;
      if (source[index] === "}") depth -= 1;
      if (depth === 0) {
        blocks.push(source.slice(open + 1, index));
        cursor = index + 1;
        break;
      }
    }
  }

  expect(blocks.length, `${header} CSS blocks`).toBeGreaterThan(0);
  return blocks;
}

function cssBlock(header: string, source: string) {
  return cssBlocks(header, source)[0];
}

function expectVisibleFirst(name: string, source: string) {
  const keyframes = cssBlock(`@keyframes ${name}`, source);
  const firstFrame = keyframes.includes("from")
    ? cssBlock("from", keyframes)
    : cssBlock("0%", keyframes);
  expect(firstFrame).toMatch(/opacity:\s*1;/);
  expect(firstFrame).not.toMatch(/filter:\s*blur\([^)]*\);/);
}

describe("visible-first structural motion", () => {
  it("keeps shared base entrances visible", () => {
    expectVisibleFirst("fadeUp", baseStyles);
    expectVisibleFirst("sectionScrollIn", baseStyles);
  });

  it("keeps shared surface entrances visible and unblurred", () => {
    for (const name of [
      "nv-hero-in",
      "od-card-rise",
      "od-highlight-in",
      "od-footer-in",
    ]) {
      expectVisibleFirst(name, surfaceStyles);
    }
  });

  it("does not pre-hide structural lists before their entrance", () => {
    for (const selector of [
      ".work:not(.work-drafts) > h2",
      ".work-drafts > h2",
      ".work:not(.work-drafts) > .work-list > .work-item",
      ".work-drafts > .work-list > .work-item",
      ".play-entry",
      ".project-chapter",
      ".project-chapter-title",
      ".project-evidence-heading",
      ".project-chapter-motif",
      ".project-sections > .project-section",
      ".project-work-jump-card",
      ".project-work-jump-view-all",
    ]) {
      for (const block of cssBlocks(selector, baseStyles)) {
        expect(block).not.toMatch(/opacity:\s*0;/);
      }
    }
  });

  it("retains meaningful artifact motion without a decorative FAFSA preview wash", () => {
    expect(surfaceStyles).toContain("@keyframes tt-outcome-arrive");
    expect(surfaceStyles).toContain("@keyframes nv-persona-rise");
    expect(surfaceStyles).not.toContain("@keyframes uf-template-sweep");
  });

  it("keeps Fresh Greens, TikTok, and Navi evidence copy visible throughout motion", () => {
    const freshPivotPending = cssBlock(
      '.fg-pivot[data-reveal="pending"] .fg-pivot-step',
      lateStyles,
    );
    const naviPending = cssBlock(
      ".nv-page[data-nv-anim-ready] .nv-reveal:not(.nv-reveal--visible)",
      surfaceStyles,
    );

    expect(freshPivotPending).toMatch(/opacity:\s*1;/);
    expectVisibleFirst("tt-outcome-arrive", surfaceStyles);
    expect(naviPending).toMatch(/opacity:\s*1;/);
  });

  it("only animates Fresh Greens panels after progressive enhancement", () => {
    const noPreference = cssBlocks(
      "@media (prefers-reduced-motion: no-preference)",
      lateStyles,
    ).join("\n");

    expect(noPreference).toContain(
      '.fg-synth[data-enhanced="true"] .fg-synth-panel',
    );
    expect(noPreference).toContain(
      '.fg-pulled-journey[data-enhanced="true"] .fg-pulled-panel',
    );
    expect(noPreference).not.toMatch(/(?:^|\n)\s*\.fg-synth-panel\s*\{/);
    expect(noPreference).not.toMatch(/(?:^|\n)\s*\.fg-pulled-panel\s*\{/);
  });

  it("uses a labelled section for About details instead of complementary content", () => {
    expect(aboutPage).not.toContain("<aside");
    expect(aboutPage).toMatch(
      /<section className="about-aside" aria-labelledby="about-details-title">/,
    );
    expect(aboutPage).toContain('id="about-details-title"');
  });

  it("removes the About entrance animation when motion is reduced", () => {
    const reduced = cssBlocks(
      "@media (prefers-reduced-motion: reduce)",
      surfaceStyles,
    ).join("\n");
    const aboutLayout = cssBlock(".about-layout", reduced);

    expect(aboutLayout).toMatch(/animation:\s*none;/);
  });

  it("limits artifact transforms to motion-safe contexts and resets exact layers", () => {
    const noPreference = cssBlocks(
      "@media (prefers-reduced-motion: no-preference)",
      surfaceStyles,
    ).join("\n");
    const reduced = cssBlocks(
      "@media (prefers-reduced-motion: reduce)",
      surfaceStyles,
    ).join("\n");

    expect(noPreference).toContain(".nv-reveal--visible .nv-heuristic-card");
    for (const selector of [
      ".fg-illustration-panel",
      ".fg-synth-panel",
      ".fg-pulled-panel",
      ".nv-heuristic-card",
    ]) {
      expect(reduced).toContain(selector);
    }
    expect(reduced).toContain("animation: none !important");
    expect(reduced).toContain("transform: none !important");
  });

  it("stops the Navi demo skeleton pulse for reduced motion", () => {
    const reduced = cssBlocks(
      "@media (prefers-reduced-motion: reduce)",
      lateStyles,
    ).join("\n");

    expect(reduced).toMatch(
      /\.nv-demo-embed-skeleton-bar\s*\{[^}]*animation:\s*none;[^}]*opacity:\s*0\.7;/,
    );
  });
});
