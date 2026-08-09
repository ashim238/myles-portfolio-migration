import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/reader-mode.css"),
  "utf8",
);

function customProperty(name: string): string {
  const match = styles.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`));
  if (!match) throw new Error(`Missing ${name} in Reader Mode styles.`);
  return match[1];
}

function relativeLuminance(hex: string): number {
  const channels = hex
    .slice(1)
    .match(/.{2}/g)
    ?.map((channel) => Number.parseInt(channel, 16) / 255);
  if (!channels || channels.length !== 3) {
    throw new Error(`Invalid six-digit hex color: ${hex}`);
  }

  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(
    relativeLuminance(first),
    relativeLuminance(second),
  );
  const darker = Math.min(
    relativeLuminance(first),
    relativeLuminance(second),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Reader Mode contrast ownership", () => {
  it("defines a contrast-safe muted color for the paper canvas", () => {
    const paper = "#f5f3ea";
    const muted = customProperty("--m97-reader-muted");

    expect(contrastRatio(muted, paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("keeps hero and recruiter text on Reader tokens", () => {
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode \.project-hero \.project-hero-title\s*\{[^}]*color:\s*var\(--m97-reader-ink\);/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode \.project-hero \.project-hero-lede\s*\{[^}]*color:\s*var\(--m97-reader-muted\);/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode :is\([\s\S]*\.case-cut-row dd[\s\S]*\)\s*\{[^}]*color:\s*var\(--m97-reader-ink\);/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode :is\([\s\S]*\.case-cut-row dt[\s\S]*\)\s*\{[^}]*color:\s*var\(--m97-reader-muted\);/,
    );
  });

  it("keeps Reader navigation legible without changing project accents", () => {
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode \.project-toc-link\s*\{[^}]*color:\s*var\(--m97-reader-muted\);/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode \.project-toc-link--active,[\s\S]*color:\s*var\(--m97-active\);/,
    );
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode \.project-toc-link--active \.project-toc-stage\s*\{[^}]*color:\s*currentColor;/,
    );
  });
});
