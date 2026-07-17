import {
  existsSync,
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const componentPath = resolve(process.cwd(), "src/components/tiktok-dsa.tsx");
const stylesheetPath = resolve(
  process.cwd(),
  "src/app/styles/portfolio-surfaces.css",
);
const pagePath = resolve(process.cwd(), "src/app/work/tiktok/page.tsx");
const assetDirectory = resolve(process.cwd(), "public/projects/tiktok");
const coverBlobDirectory = join(assetDirectory, "cover-blobs");

const retiredExports = [
  "OutcomeCard",
  "LineageTimeline",
  "ConsoleHello",
  "SystemOverviewBand",
  "HeroThreePhones",
  "TemplateAnatomy",
  "AestheticShowcaseCard",
] as const;

const retainedExports = [
  "TikTokLogo",
  "TikTokCoverBlobs",
  "TikTokTemplateSystem",
] as const;

const retiredAssets = [
  "anatomy-grid-dark.png",
  "anatomy-grid-light-academia.png",
  "asset-academia-barcode.svg",
  "asset-academia-text.svg",
  "asset-dopamine-title.svg",
  "composite-flat-lay.png",
  "composite-flower.png",
  "dopamine-ornament-crescents.png",
  "dopamine-ornament-rings.png",
  "dopamine-ornament-star.png",
  "dopamine-ornament-swirl.png",
  "feed-ref-light-academia.png",
  "feed-ref-maximalism.png",
  "gradient-cover.png",
  "hero-three-phones.png",
  "hero-rolling-phones.png",
  "mood-cottagecore.png",
  "shipped-light-academia-in-hand.png",
  "template-dopamine.png",
  "template-eboy.png",
  "template-light-academia.png",
  "tpl-academia.svg",
  "tpl-dopamine.svg",
  "tpl-eboy.svg",
] as const;

const sourceExtensions = /\.(?:css|js|json|jsx|md|mjs|ts|tsx|yaml|yml)$/;

function collectRuntimeSources(directory: string): string[] {
  if (!existsSync(directory)) return [];

  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      return entry === "__tests__" ? [] : collectRuntimeSources(path);
    }

    return sourceExtensions.test(entry) ? [readFileSync(path, "utf8")] : [];
  });
}

describe("TikTok retired implementation pruning", () => {
  it("removes the retired component exports", () => {
    const source = readFileSync(componentPath, "utf8");
    const exportsStillPresent = retiredExports.filter((name) =>
      new RegExp(`export function ${name}\\b`).test(source),
    );

    expect(exportsStillPresent).toEqual([]);
  });

  it("removes the retired deployment assets", () => {
    const assetsStillPresent = retiredAssets.filter((asset) =>
      existsSync(join(assetDirectory, asset)),
    );

    expect(assetsStillPresent).toEqual([]);
  });

  it("preserves the retained component export surface", () => {
    const source = readFileSync(componentPath, "utf8");

    expect(source).not.toContain('export { AESTHETICS } from "@/lib/tiktok-data";');
    for (const name of retainedExports) {
      expect(source).toMatch(new RegExp(`export function ${name}\\b`));
    }
  });

  it("removes only the retired CSS and keeps the semantic outcome section", () => {
    const stylesheet = readFileSync(stylesheetPath, "utf8");
    const page = readFileSync(pagePath, "utf8");

    for (const selector of [
      ".tt-overview",
      ".tt-pullquote",
      ".tt-outcome {",
      ".tt-outcome--visible",
      ".tt-outcome-text",
      ".tt-outcome-headline",
      ".tt-outcome-sub",
      ".tt-outcome-image",
      ".tt-timeline",
      ".tt-anatomy",
      ".tt-aesthetic",
    ]) {
      expect(stylesheet).not.toContain(selector);
    }
    expect(page).toContain("entry={chapters[4]}");
    expect(page).toContain("CASE_STUDY_CHAPTERS.tiktok");
    expect(page).not.toContain('aria-labelledby="tt-outcome"');
    expect(page).not.toContain('<h2 id="tt-outcome">What shipped from the launch batch</h2>');
    expect(page).not.toContain("tt-outcome-closer");
  });

  it("keeps only live top-level assets plus the published gallery cover", () => {
    const runtimeSource = [
      ...collectRuntimeSources(resolve(process.cwd(), "src")),
      ...collectRuntimeSources(resolve(process.cwd(), "content")),
    ].join("\n");
    const unreferencedAssets = readdirSync(assetDirectory)
      .filter((entry) => statSync(join(assetDirectory, entry)).isFile())
      .filter((asset) => !runtimeSource.includes(asset));

    expect(unreferencedAssets).toEqual([]);
  });

  it("keeps every cover blob aligned with the component sequence", () => {
    const source = readFileSync(componentPath, "utf8");
    const blobFiles = readdirSync(coverBlobDirectory).sort();
    const expectedBlobFiles = Array.from(
      { length: 16 },
      (_, index) => `b${String(index).padStart(2, "0")}.png`,
    );

    expect(blobFiles).toEqual(expectedBlobFiles);
    for (const blobFile of blobFiles) {
      expect(source).toContain(`{ f: "${blobFile.replace(".png", "")}"`);
    }
  });
});
