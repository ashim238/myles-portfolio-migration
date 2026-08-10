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
      ".case-section-lead",
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

    expect(paperStyles).not.toMatch(/--foreground\s*:/);
    expect(paperStyles).not.toMatch(/--muted\s*:/);
    expect(paperStyles).not.toMatch(/--surface\s*:/);

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

  });

  it("keeps muted paper copy above WCAG AA for normal text", () => {
    expect(contrastRatio("#5b5953", "#f5f3ea")).toBeGreaterThanOrEqual(4.5);
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode :is\(\s*\.uf-composer-pinned-badge,\s*\.uf-composer-item-position\s*\)\s*\{[^}]*opacity:\s*1;/,
    );
  });

  it("uses a focus color that clears the 3 to 1 UI threshold on Reader paper", () => {
    expect(contrastRatio("#263cb8", "#f5f3ea")).toBeGreaterThanOrEqual(3);
    expect(paperStyles).toContain("--m98-paper-focus: #263cb8;");
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode :is\(a, button, input, select, textarea\):focus-visible\s*\{[^}]*outline:\s*3px solid var\(--m98-context-focus, var\(--m98-paper-focus\)\);/,
    );
  });

  it("gives dark and art-directed evidence a locally contrasting focus ring", () => {
    expect(contrastRatio("#ffffff", "#0a0a0a")).toBeGreaterThanOrEqual(3);
    expect(contrastRatio("#ffffff", "#171717")).toBeGreaterThanOrEqual(3);
    expect(contrastRatio("#ffffff", "#314951")).toBeGreaterThanOrEqual(3);
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode :is\(\s*\.fg-phone-screen,\s*\.fg-pulled-decision,\s*\.nv-research-board,\s*\.tt-cover--preview,\s*\.tt-preview-sketch\s*\)\s*\{[^}]*--m98-context-focus:\s*#fff;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode \.fg-phone-screen \.expandable-trigger:focus-visible\s*\{[^}]*outline-offset:\s*-4px;[^}]*box-shadow:\s*inset 0 0 0 7px var\(--m98-paper-focus\);/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode \.tt-preview-final \.expandable-trigger:focus-visible\s*\{[^}]*outline-offset:\s*-4px;[^}]*box-shadow:\s*inset 0 0 0 7px #fff;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-header \.reader-return:focus-visible\s*\{[^}]*outline-color:\s*#263cb8;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.fg-page \.fg-arch-scroll:focus-visible\s*\{[^}]*outline:\s*2px solid var\(--m98-paper-focus\) !important;[^}]*outline-offset:\s*3px !important;/,
    );
    expect(paperStyles).toMatch(
      /:root\[data-theme="dark"\]\s+\.reader-mode\.reader-mode\.fg-page\s+\.fg-arch-scroll:focus-visible\s*\{[^}]*outline-color:\s*#fff !important;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.nv-page \.nv-system-cta-link\s*\{[^}]*--m98-context-focus:\s*var\(--m98-paper-focus\);/,
    );
    expect(paperStyles).toMatch(
      /:root\[data-theme="dark"\]\s+\.reader-mode\.reader-mode\.nv-page\s+\.nv-system-cta-link\s*\{[^}]*--m98-context-focus:\s*#fff;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.nv-page \.nv-demo-embed-mobile-cta:focus-visible\s*\{[^}]*outline-offset:\s*-4px;/,
    );
    expect(paperStyles).toMatch(
      /:root\[data-theme="dark"\]\s+\.reader-mode\.reader-mode\.nv-page\s+\.nv-demo-embed-mobile-cta\s*\{[^}]*--m98-context-focus:\s*#fff;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.uf-page \.uf-switcher-preview--scroll\s*\{[^}]*--focus-ring:\s*var\(--m98-paper-focus\);/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.uf-page :is\(\s*\.uf-lock-stage,\s*\.uf-switcher-preview--scroll\s*\) \.expandable-trigger:focus-visible\s*\{[^}]*outline-offset:\s*-4px;[^}]*box-shadow:\s*inset 0 0 0 7px #fff;/,
    );
  });

  it("assigns paper copy by semantic role without remapping global theme aliases", () => {
    for (const selector of [
      ".project-work-jump-label",
      ".fg-pulled-reconstruction-note",
      ".fg-reminder-evidence > figcaption",
      ".nv-ring-caption",
      ".uf-lock-palette-caption",
      ".tt-preview-process-lede",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    for (const selector of [
      ".fg-pulled-reconstruction-title",
      ".fg-pulled-decision",
      ".fg-mod-stage-text",
      ".fg-reminder-copy h3",
      ".nv-ring-value",
      ".uf-lock-legend strong",
      ".tt-preview-process-card h3",
    ]) {
      expect(paperStyles).toContain(selector);
    }

    for (const selector of [
      ".fg-pulled-detail",
      ".fg-mod-checks li",
    ]) {
      expect(paperStyles).toContain(selector);
    }
  });

  it("returns TikTok's art-directed cover copy to its project-owned dark-surface colors", () => {
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.tt-page \.tt-cover \.tt-title\s*\{\s*color:\s*#fff;/,
    );
    expect(paperStyles).toMatch(
      /\.reader-mode\.reader-mode\.tt-page \.tt-cover \.tt-lede\s*\{\s*color:\s*rgba\(255, 255, 255, 0\.82\);/,
    );
  });
});
