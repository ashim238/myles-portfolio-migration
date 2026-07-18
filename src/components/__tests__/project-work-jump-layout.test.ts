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

describe("ProjectWorkJump editorial endcap layout", () => {
  it("uses one accessible editorial card with destination-specific media", () => {
    expect(block(".project-work-jump-card", baseStyles)).toContain(
      "display: grid",
    );
    expect(block(".project-work-jump-card", baseStyles)).toContain(
      "min-height: 44px",
    );
    expect(block(".project-work-jump-card", baseStyles)).toContain(
      "gap: 1.6rem",
    );
    expect(block(".project-work-jump-view-all", baseStyles)).toContain(
      "min-height: 44px",
    );
    expect(block(".project-work-jump-text", baseStyles)).toContain(
      "padding: clamp(1.6rem, 3vw, 2.4rem)",
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
    expect(titleStyles).toContain("font-size: clamp(2rem, 4vw, 3.5rem)");
    expect(titleStyles).toContain("overflow-wrap: normal");
  });

  it("pairs hover polish with focus and honors reduced motion", () => {
    expect(baseStyles).toMatch(
      /\.project-work-jump-card:hover[\s\S]*?\.project-work-jump-card:focus-visible/,
    );
    expect(baseStyles).toMatch(
      /prefers-reduced-motion: reduce[\s\S]*?\.project-work-jump-card[\s\S]*?transform: none/,
    );
  });

  it("uses scroll-linked entrance only where supported", () => {
    expect(surfaceStyles).toMatch(
      /\.project-work-jump-card[\s\S]*?animation-timeline: view\(\)/,
    );
    expect(fallbackStyles).not.toMatch(
      /\.project-work-jump-list|\.project-work-jump > h2/,
    );
  });
});
