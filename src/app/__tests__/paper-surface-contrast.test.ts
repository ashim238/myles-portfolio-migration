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

  it("keeps secondary-document copy on paper-safe scoped tokens", () => {
    expect(paperStyles).toContain("--m98-paper-text: var(--m97-reader-ink);");
    expect(paperStyles).toContain("--m98-paper-muted: #5b5953;");

    for (const selector of [
      ".about-heading",
      ".about-body",
      ".about-detail dd",
      ".resume-heading",
      ".resume-role-summary",
      ".play-entry-hook",
      ".play-entry-body dd",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    for (const selector of [
      ".about-kicker",
      ".about-detail dt",
      ".resume-label",
      ".resume-role-dates",
      ".play-lede",
      ".play-entry-exploration",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    expect(paperStyles).not.toMatch(/--foreground\s*:/);
    expect(paperStyles).not.toMatch(/--muted\s*:/);
  });

  it("keeps muted paper copy above WCAG AA for normal text", () => {
    expect(contrastRatio("#5b5953", "#f5f3ea")).toBeGreaterThanOrEqual(4.5);
  });
});
