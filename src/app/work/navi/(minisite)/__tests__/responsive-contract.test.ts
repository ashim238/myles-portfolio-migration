import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const minisiteCss = readFileSync(
  join(process.cwd(), "src/app/styles/navi-minisite.css"),
  "utf8",
);
const portfolioCss = readFileSync(
  join(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const mapClient = readFileSync(
  join(process.cwd(), "src/components/navi/demo/Map.client.tsx"),
  "utf8",
);
const systemPage = readFileSync(
  join(process.cwd(), "src/app/work/navi/(minisite)/system/page.tsx"),
  "utf8",
);

describe("Navi responsive contract", () => {
  it("gives the compact header and bottom bar one exclusive through-720 breakpoint", () => {
    expect(minisiteCss).toContain(
      "@media (max-width: 720px) {\n  .nv-header-main",
    );
    expect(minisiteCss).toContain(
      "@media (max-width: 720px) {\n  .nv-tabbar",
    );
    expect(minisiteCss).not.toContain(
      "@media (max-width: 640px) {\n  .nv-header-main",
    );
  });

  it("keeps fixed-bar clearance inside the Navi surface rather than leaking to body", () => {
    expect(minisiteCss).not.toMatch(/(?:^|\n)\s*body\s*\{[^}]*padding-bottom/m);
    expect(minisiteCss).toMatch(/\.nv-ui\s*\{[^}]*padding-bottom/);
  });

  it("uses shrinkable seven-column calendar rows and a 320px fallback", () => {
    expect(minisiteCss).toMatch(
      /\.nv-cal-weekdays,\s*\.nv-cal-week\s*\{[^}]*grid-template-columns:\s*repeat\(7, minmax\(0, 1fr\)\)/,
    );
    expect(minisiteCss).toMatch(
      /@media \(max-width: 360px\)[\s\S]*?\.nv-cal-cell\s*\{[^}]*width:\s*100%[^}]*min-height:\s*0/,
    );
  });

  it("keeps the mobile booking-flow spine centered on its markers", () => {
    expect(portfolioCss).toMatch(
      /@keyframes nv-research-route-draw-vertical[\s\S]*?translateX\(-50%\) scaleY\(0\)[\s\S]*?translateX\(-50%\) scaleY\(1\)/,
    );
    expect(portfolioCss).toMatch(
      /@media \(max-width: 700px\)[\s\S]*?\.nv-research-route\s*\{[^}]*transform:\s*translateX\(-50%\) scaleY\(1\)/,
    );
  });

  it("scopes case-study specimen labels away from the embedded system page", () => {
    expect(portfolioCss).toContain(".nv-page .nv-specimen-label");
    expect(portfolioCss).not.toMatch(/\n\.nv-specimen-label\s*\{/);
  });

  it("contains every playground layer without taking horizontal scrolling away from code", () => {
    for (const selector of [
      ".nv-playground",
      ".nv-playground-stage",
      ".nv-playground-controls",
      ".nv-playground-control",
      ".nv-playground-code",
    ]) {
      expect(minisiteCss).toMatch(
        new RegExp(
          `${selector.replace(".", "\\.")}\\s*\\{[^}]*box-sizing:\\s*border-box[^}]*min-width:\\s*0[^}]*max-width:\\s*100%`,
        ),
      );
    }

    expect(minisiteCss).toMatch(
      /\.nv-playground-control\s*\{[^}]*min-inline-size:\s*0/,
    );
    expect(minisiteCss).toMatch(
      /\.nv-playground-code\s*\{[^}]*overflow-x:\s*auto/,
    );
  });

  it("reflows playground controls and gutters for phone-width canvases", () => {
    expect(minisiteCss).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.nv-system\s*\{[^}]*padding-inline:\s*var\(--nv-sp-md\)[\s\S]*?\.nv-hero-stage\s*\{[^}]*padding:\s*var\(--nv-sp-md\)[\s\S]*?\.nv-playground\s*\{[^}]*padding:\s*var\(--nv-sp-md\)/,
    );
    expect(minisiteCss).toMatch(
      /@media \(max-width: 640px\)[\s\S]*?\.nv-playground-controls\s*\{[^}]*display:\s*grid[^}]*grid-template-columns:\s*minmax\(0, 1fr\)/,
    );
    expect(minisiteCss).toMatch(
      /@media \(max-width: 360px\)[\s\S]*?\.nv-playground-opt\s*\{[^}]*flex:/,
    );
  });

  it("keeps coarse-pointer Navi controls and map targets at least 44px", () => {
    expect(minisiteCss).toMatch(
      /@media \(pointer: coarse\), \(any-pointer: coarse\)[\s\S]*?\.nv-nav a,[\s\S]*?\.nv-cat-nav,[\s\S]*?\.nv-feed-select select,[\s\S]*?\.nv-feed-filters,[\s\S]*?\.nv-feed-clear\s*\{[^}]*min-height:\s*44px;/,
    );
    expect(minisiteCss).toMatch(
      /\.nv-map-canvas \.leaflet-control-zoom a\s*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/,
    );
    expect(mapClient).toContain("iconSize: [48, 44]");
    expect(mapClient).toContain("iconSize: [44, 44]");
    expect(minisiteCss.lastIndexOf("@media (pointer: coarse), (any-pointer: coarse)")).toBeGreaterThan(
      minisiteCss.indexOf(".nv-feed-filters"),
    );
    expect(minisiteCss).toMatch(
      /@media \(pointer: coarse\), \(any-pointer: coarse\)[\s\S]*?\.nv-icon-btn--sm,[\s\S]*?\.nv-icon-btn--md\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px;/,
    );
    expect(minisiteCss).toMatch(
      /@media \(pointer: coarse\), \(any-pointer: coarse\)[\s\S]*?\.nv-playground-opt\s*\{[^}]*min-width:\s*44px;[^}]*min-height:\s*44px;/,
    );
    expect(minisiteCss).toMatch(
      /\.nv-booking-date:has\(input:focus-visible\)\s*\{[^}]*outline:\s*2px solid var\(--nv-focus\);[^}]*outline-offset:\s*2px;/,
    );
    expect(minisiteCss).toMatch(
      /\.nv-map-canvas:focus-visible\s*\{[^}]*outline-offset:\s*-3px;/,
    );
    expect(minisiteCss).toMatch(
      /\.leaflet-control-attribution a:focus-visible\s*\{[^}]*outline-offset:\s*-2px;/,
    );
  });

  it("keeps the standalone system surface light and on Navi semantic ink", () => {
    expect(systemPage).toContain('className="nv-system nv-ui"');
    expect(portfolioCss).toMatch(
      /:root\[data-theme="dark"\] \.reader-mode :is\(\s*\.nv-type-cell,\s*\.nv-swatch,\s*\.nv-composition-strip,\s*\.nv-composition-card,\s*\.nv-form-column\s*\)/,
    );
    expect(portfolioCss).toMatch(
      /\.nv-type-label\s*\{[^}]*color:\s*var\(--nv-text-muted, var\(--muted\)\);/,
    );
    expect(portfolioCss).toMatch(
      /\.nv-swatch-name\s*\{[^}]*color:\s*var\(--nv-text-muted, var\(--muted\)\);/,
    );
    expect(portfolioCss).toMatch(
      /\.nv-spacing-token\s*\{[^}]*color:\s*var\(--nv-text-muted, var\(--muted\)\);/,
    );
    expect(minisiteCss).toContain("--nv-ui-bg: var(--nv-surface);");
    expect(minisiteCss).toContain("--nv-ui-border: var(--nv-border);");
    expect(minisiteCss).toContain("--nv-ink: var(--nv-text);");
    expect(portfolioCss).toContain(
      ':root[data-theme="dark"] .reader-mode .nv-type-sample',
    );
  });
});
