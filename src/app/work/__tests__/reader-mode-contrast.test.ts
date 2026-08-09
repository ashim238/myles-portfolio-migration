import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/reader-mode.css"),
  "utf8",
);
const portfolioStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

function customProperty(name: string): string {
  const match = styles.match(new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`));
  if (!match) throw new Error(`Missing ${name} in Reader Mode styles.`);
  return match[1];
}

function portfolioCustomProperty(name: string): string {
  const match = portfolioStyles.match(
    new RegExp(`${name}:\\s*(#[0-9a-fA-F]{6});`),
  );
  if (!match) throw new Error(`Missing ${name} in portfolio surface styles.`);
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
    expect(styles).not.toContain("--nv-accent:");
    expect(portfolioStyles).toMatch(
      /\.nv-research-step\s*\{[^}]*color:\s*var\(--nv-accent-text\);/,
    );
  });

  it("gives shared Reader prose paper-owned ink in every surrounding theme", () => {
    expect(styles).toMatch(
      /\.reader-mode\.reader-mode :is\(\.project-section-body, \.project-content\)\s*\{[^}]*color:\s*var\(--m97-reader-ink\);/,
    );
    expect(styles).not.toMatch(
      /\.reader-mode\.reader-mode :is\(\.project-section-body, \.project-content\)\s*\{[^}]*color:\s*var\(--foreground\);/,
    );
  });

  it("keeps Navi's dark research board contrast-safe in every surrounding theme", () => {
    const boardSurface = portfolioCustomProperty("--nv-research-board-surface");
    const boardCard = portfolioCustomProperty("--nv-research-board-card");
    const boardInk = portfolioCustomProperty("--nv-research-board-ink");
    const boardMuted = portfolioCustomProperty("--nv-research-board-muted");
    const boardLine = portfolioCustomProperty("--nv-research-board-line");

    expect(contrastRatio(boardInk, boardSurface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(boardMuted, boardSurface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(boardLine, boardSurface)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(boardLine, boardCard)).toBeGreaterThanOrEqual(3);
    expect(portfolioStyles).toMatch(
      /\.nv-research-board\s*\{[^}]*background:\s*var\(--nv-research-board-surface\);[^}]*color:\s*var\(--nv-research-board-ink\);/,
    );
    expect(portfolioStyles).toMatch(
      /\.nv-research-board \.nv-research-board-head p,[\s\S]*\.nv-research-board \.nv-research-archetype-details dt,[\s\S]*\{[^}]*color:\s*var\(--nv-research-board-muted\);/,
    );
    expect(portfolioStyles).toMatch(
      /\.nv-research-board :is\(h3, h4\),[\s\S]*\{[^}]*color:\s*var\(--nv-research-board-ink\);/,
    );
  });
});
