import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const globals = readFileSync(resolve(process.cwd(), "src/app/globals.css"), "utf8");
const paperStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-paper-contrast.css"),
  "utf8",
);

function relativeLuminance(hex: string) {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);

  if (!channels || channels.length !== 3) {
    throw new Error(`Expected a six-digit hex color, received ${hex}`);
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string) {
  const light = Math.max(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );
  const dark = Math.min(
    relativeLuminance(foreground),
    relativeLuminance(background),
  );

  return (light + 0.05) / (dark + 0.05);
}

describe("Myles 98 paper-surface contrast", () => {
  it("loads the paper correction after every shared presentation layer", () => {
    expect(globals.trimEnd()).toMatch(
      /@import "\.\/styles\/myles-98-paper-contrast\.css";$/,
    );
  });

  it("keeps the complete Reader hierarchy on paper-safe tokens", () => {
    expect(paperStyles).toContain("--m98-paper-text: var(--m97-reader-ink);");
    expect(paperStyles).toContain("--m98-paper-muted: #5b5953;");

    for (const selector of [
      ".project-hero-title",
      ".project-section-body",
      ".project-chapter-stage",
      ".project-toc-link--active",
      ".project-toc-stage",
      ".case-cut-row dd",
      ".case-cut-evidence-cta",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    for (const selector of [
      ".project-topbar",
      ".project-hero-lede",
      ".project-chapter-meta",
      ".project-toc-link",
      ".project-toc-readout",
      ".case-cut-row dt",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode \.project-toc-dot\s*\{\s*background:\s*var\(--m98-paper-rule\);/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode \.project-toc-rail\s*\{\s*background:\s*color-mix\(in srgb, var\(--m98-paper-text\) 18%, transparent\);/,
    );
  });

  it("covers About, Resume, and Loose Parts without remapping global theme tokens", () => {
    for (const selector of [
      ".about-heading",
      ".about-body",
      ".resume-heading",
      ".resume-role-summary",
      ".resume-role-bullets",
      ".play-entry-hook",
      ".play-entry-body dd",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    for (const selector of [
      ".about-kicker",
      ".resume-label",
      ".resume-body",
      ".resume-role-dates",
      ".play-lede",
      ".play-entry-exploration",
      ".play-entry-body dt",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    expect(paperStyles).not.toMatch(/--foreground\s*:/);
    expect(paperStyles).not.toMatch(/--muted\s*:/);
  });

  it("keeps the muted paper text above the WCAG AA normal-text threshold", () => {
    expect(contrastRatio("#5b5953", "#f5f3ea")).toBeGreaterThanOrEqual(4.5);
  });
});
