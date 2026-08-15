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
const fallbackStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);

function block(selector: string, source: string): string {
  const start = source.indexOf(`${selector} {`);
  if (start < 0) return "";
  const open = source.indexOf("{", start);
  let depth = 0;

  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(start, index + 1);
  }

  return "";
}

function atRuleBlockContaining(atRule: string, needle: string): string {
  let cursor = 0;

  while (cursor < baseStyles.length) {
    const start = baseStyles.indexOf(`${atRule} {`, cursor);
    if (start < 0) break;
    const candidate = block(atRule, baseStyles.slice(start));
    if (candidate.includes(needle)) return candidate;
    cursor = start + atRule.length;
  }

  return "";
}

describe("ProjectWorkJump editorial endcap layout", () => {
  it("places the endcap inside a static Myles 98 program window", () => {
    expect(block(".project-work-jump", baseStyles)).toContain(
      "width: min(100%, 64rem)",
    );
    expect(block(".project-work-jump", baseStyles)).toContain(
      "margin-inline: auto",
    );
    expect(block(".project-work-jump-window", baseStyles)).toContain(
      "border: 2px solid var(--m97-ink)",
    );
    expect(block(".project-work-jump-window", baseStyles)).toContain(
      "background: var(--m97-chrome)",
    );
    expect(block(".project-work-jump-window", baseStyles)).toContain(
      "scroll-margin-top: calc(var(--project-heading-offset) + 3.5rem)",
    );
    expect(block(".project-work-jump-window-titlebar", baseStyles)).toContain(
      "background: var(--m97-active)",
    );
    expect(block(".project-work-jump-window-titlebar", baseStyles)).toContain(
      "min-height: 28px",
    );
    expect(block(".project-work-jump-window-content", baseStyles)).toContain(
      "box-shadow: var(--m97-bevel-recessed)",
    );
    expect(block(".project-work-jump-window-status", baseStyles)).toContain(
      "font-family: var(--m97-ui-font)",
    );
  });

  it("uses one accessible editorial card with destination-specific media", () => {
    expect(block(".project-work-jump-card", baseStyles)).toContain(
      "display: grid",
    );
    expect(block(".project-work-jump-card", baseStyles)).toContain(
      "min-height: 44px",
    );
    expect(block(".project-work-jump-card", baseStyles)).toContain("gap: 0");
    expect(block(".project-work-jump-view-all", baseStyles)).toContain(
      "min-height: 44px",
    );
    expect(block(".project-work-jump-text", baseStyles)).toContain(
      "padding: clamp(1.5rem, 3vw, 3rem)",
    );
    expect(block(".project-work-jump-text", baseStyles)).toContain(
      "align-items: flex-start",
    );
    expect(
      block(
        '.project-work-jump-card[data-next-project="fresh-greens"] .project-work-jump-media',
        baseStyles,
      ),
    ).toContain("background:");
    expect(
      block(
        '.project-work-jump-card[data-next-project="navi"] .project-work-jump-media',
        baseStyles,
      ),
    ).toContain("background:");
    expect(
      block(
        '.project-work-jump-card[data-next-project="understandingfafsa"] .project-work-jump-media',
        baseStyles,
      ),
    ).toContain("background:");
    expect(
      block(
        '.project-work-jump-card[data-next-project="tiktok"] .project-work-jump-media',
        baseStyles,
      ),
    ).toContain("background:");
  });

  it("keeps the UnderstandingFAFSA title from breaking inside either word", () => {
    const titleStyles = block(
      '.project-work-jump-card[data-next-project="understandingfafsa"]\n  .project-work-jump-title',
      baseStyles,
    );
    expect(titleStyles).toContain("font-size: clamp(1.85rem, 3.5vw, 3rem)");
    expect(titleStyles).toContain("overflow-wrap: normal");
  });

  it("pairs hover polish with focus and honors reduced motion", () => {
    expect(baseStyles).toMatch(
      /\.project-work-jump-card:hover[\s\S]*?\.project-work-jump-card:focus-visible/,
    );
    expect(baseStyles).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*?\.project-work-jump-card[\s\S]*?transform: none/,
    );
    expect(
      block(".project-work-jump-card:focus-visible", baseStyles),
    ).toContain("inset 0 0 0 3px var(--focus-ring)");
  });

  it("uses scroll-linked entrance only where supported", () => {
    expect(surfaceStyles).toMatch(
      /\.project-work-jump-card[\s\S]*?animation-timeline: view\(\)/,
    );
    expect(fallbackStyles).not.toMatch(
      /\.project-work-jump-list|\.project-work-jump > h2/,
    );
  });

  it("lets endcard media shrink safely at mobile zoom levels", () => {
    const mobile = atRuleBlockContaining(
      "@media (max-width: 767px)",
      ".mobile-nav",
    );

    expect(block(".project-work-jump-media", mobile)).toContain(
      "min-height: 0",
    );
  });
});
