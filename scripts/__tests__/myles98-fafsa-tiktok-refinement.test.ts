import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const NEWSLETTER_MASTHEAD_FILL = "#1f679f";
const NEWSLETTER_REGION_FILLS = ["#a7bcc2", "#c5963a", "#eeeae3"] as const;
const TIKTOK_INK = "#202126";
const TIKTOK_CYAN = "#25f4ee";
const TIKTOK_MAGENTA = "#fe2c55";
const FORMER_BAG_COLORS = ["#cf526d", "#8d3349", "#f3eee4", "#f07b91"] as const;
const COLLAPSED_LOWER_MODULES = new Map<Grid, [string, string]>([
  [16, [
    '<rect fill="#eeeae3" x="2" y="7" width="10" height="3" />',
    '<rect fill="#eeeae3" x="2" y="7" width="3" height="3" />',
  ]],
  [24, [
    '<rect fill="#eeeae3" x="2" y="12" width="17" height="4" />',
    '<rect fill="#eeeae3" x="2" y="12" width="3" height="4" />',
  ]],
  [32, [
    '<rect fill="#eeeae3" x="3" y="16" width="21" height="4" />',
    '<rect fill="#eeeae3" x="3" y="16" width="4" height="4" />',
  ]],
]);
const TIKTOK_PROBES = new Map<Grid, {
  cyan: readonly [number, number];
  flag: readonly [number, number];
  head: readonly [number, number];
  magenta: readonly [number, number];
  stem: readonly [number, number];
}>([
  [16, { cyan: [1, 11], magenta: [13, 5], stem: [8, 3], flag: [12, 6], head: [3, 10] }],
  [24, { cyan: [2, 18], magenta: [21, 8], stem: [12, 5], flag: [18, 10], head: [5, 16] }],
  [32, { cyan: [3, 25], magenta: [29, 11], stem: [17, 7], flag: [26, 13], head: [7, 23] }],
]);

type Grid = (typeof GRIDS)[number];
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
type NativeRaster = Awaited<ReturnType<typeof nativeRaster>>;

function sourceFor(concept: "email" | "generic-app" | "understandingfafsa" | "tiktok-catalog", grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

async function nativeRaster(source: string, grid: Grid) {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function pixelsMatching(
  raster: NativeRaster,
  predicate: (red: number, green: number, blue: number, alpha: number) => boolean,
) {
  return Array.from({ length: raster.width * raster.height }, (_, index) => index).filter((index) => {
    const offset = index * raster.channels;
    return predicate(
      raster.data[offset],
      raster.data[offset + 1],
      raster.data[offset + 2],
      raster.data[offset + 3],
    );
  });
}

function opaquePixels(raster: NativeRaster) {
  return pixelsMatching(raster, (_red, _green, _blue, alpha) => alpha === 0xff);
}

function colorPixels(raster: NativeRaster, fill: string) {
  const value = Number.parseInt(fill.slice(1), 16);
  const target = [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff];
  return pixelsMatching(raster, (...channels) => target.every((channel, index) => channels[index] === channel));
}

function boundsFor(pixels: number[], width: number): Bounds {
  const xs = pixels.map((index) => index % width);
  const ys = pixels.map((index) => Math.floor(index / width));
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

function widthOf(bounds: Bounds) {
  return bounds.maxX - bounds.minX + 1;
}

function heightOf(bounds: Bounds) {
  return bounds.maxY - bounds.minY + 1;
}

function contains(outer: Bounds, inner: Bounds) {
  return inner.minX >= outer.minX
    && inner.maxX <= outer.maxX
    && inner.minY >= outer.minY
    && inner.maxY <= outer.maxY;
}

function intersectionOverUnion(left: number[], right: number[]) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection = [...leftSet].filter((pixel) => rightSet.has(pixel)).length;
  return intersection / new Set([...leftSet, ...rightSet]).size;
}

function components(pixels: number[], width: number) {
  const remaining = new Set(pixels);
  const groups: number[][] = [];
  while (remaining.size > 0) {
    const seed = remaining.values().next().value as number;
    const group: number[] = [];
    const queue = [seed];
    remaining.delete(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      group.push(index);
      const x = index % width;
      for (const neighbor of [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        index - width,
        index + width,
      ]) {
        if (!remaining.has(neighbor)) continue;
        remaining.delete(neighbor);
        queue.push(neighbor);
      }
    }
    groups.push(group);
  }
  return groups;
}

function largestComponentBounds(raster: NativeRaster, fill: string) {
  const largest = components(colorPixels(raster, fill), raster.width)
    .sort((left, right) => right.length - left.length)[0];
  if (!largest) throw new Error(`Expected ${fill} raster component`);
  return boundsFor(largest, raster.width);
}

function topRowWidth(pixels: number[], width: number) {
  const topY = Math.min(...pixels.map((pixel) => Math.floor(pixel / width)));
  return pixels.filter((pixel) => Math.floor(pixel / width) === topY).length;
}

function matchesFill(raster: NativeRaster, x: number, y: number, fill: string) {
  if (x < 0 || y < 0 || x >= raster.width || y >= raster.height) return false;
  const value = Number.parseInt(fill.slice(1), 16);
  const offset = (y * raster.width + x) * raster.channels;
  return raster.data[offset] === (value >> 16)
    && raster.data[offset + 1] === ((value >> 8) & 0xff)
    && raster.data[offset + 2] === (value & 0xff)
    && raster.data[offset + 3] === 0xff;
}

function opaquePathConnects(raster: NativeRaster, start: { x: number; y: number }, end: { x: number; y: number }) {
  const opaqueAt = (x: number, y: number) => x >= 0
    && y >= 0
    && x < raster.width
    && y < raster.height
    && raster.data[(y * raster.width + x) * raster.channels + 3] === 0xff;
  if (!opaqueAt(start.x, start.y) || !opaqueAt(end.x, end.y)) return false;
  const target = end.y * raster.width + end.x;
  const visited = new Set<number>();
  const queue = [start.y * raster.width + start.x];
  visited.add(queue[0]);
  while (queue.length > 0) {
    const index = queue.shift()!;
    if (index === target) return true;
    const x = index % raster.width;
    for (const neighbor of [
      x > 0 ? index - 1 : -1,
      x < raster.width - 1 ? index + 1 : -1,
      index - raster.width,
      index + raster.width,
    ]) {
      if (neighbor < 0 || neighbor >= raster.width * raster.height || visited.has(neighbor)) continue;
      const neighborX = neighbor % raster.width;
      const neighborY = Math.floor(neighbor / raster.width);
      if (!opaqueAt(neighborX, neighborY)) continue;
      visited.add(neighbor);
      queue.push(neighbor);
    }
  }
  return false;
}

function newsletterLayout(raster: NativeRaster) {
  return {
    page: boundsFor(opaquePixels(raster), raster.width),
    masthead: largestComponentBounds(raster, NEWSLETTER_MASTHEAD_FILL),
    feature: largestComponentBounds(raster, NEWSLETTER_REGION_FILLS[0]),
    lowerLeft: largestComponentBounds(raster, NEWSLETTER_REGION_FILLS[1]),
    lowerRight: boundsFor(colorPixels(raster, NEWSLETTER_REGION_FILLS[2]), raster.width),
  };
}

function newsletterHasDistinctModules(raster: NativeRaster) {
  const layout = newsletterLayout(raster);
  return [layout.masthead, layout.feature, layout.lowerLeft, layout.lowerRight]
    .every((region) => contains(layout.page, region))
    && widthOf(layout.page) / heightOf(layout.page) >= 1.2
    && layout.masthead.maxY < layout.feature.minY
    && layout.feature.maxY < layout.lowerLeft.minY
    && layout.lowerRight.minY < layout.lowerLeft.minY
    && widthOf(layout.lowerRight) / widthOf(layout.page) > 0.55;
}

function isPixelatedTikTokMark(raster: NativeRaster, grid: Grid) {
  const probe = TIKTOK_PROBES.get(grid)!;
  const ink = colorPixels(raster, TIKTOK_INK);
  const cyan = colorPixels(raster, TIKTOK_CYAN);
  const magenta = colorPixels(raster, TIKTOK_MAGENTA);
  if (ink.length === 0 || cyan.length === 0 || magenta.length === 0) return false;
  const inkBounds = boundsFor(ink, raster.width);
  const cyanBounds = boundsFor(cyan, raster.width);
  const magentaBounds = boundsFor(magenta, raster.width);

  return matchesFill(raster, ...probe.stem, TIKTOK_INK)
    && matchesFill(raster, ...probe.flag, TIKTOK_INK)
    && matchesFill(raster, ...probe.head, TIKTOK_INK)
    && matchesFill(raster, ...probe.cyan, TIKTOK_CYAN)
    && matchesFill(raster, ...probe.magenta, TIKTOK_MAGENTA)
    && opaquePathConnects(raster, { x: probe.head[0], y: probe.head[1] }, { x: probe.flag[0], y: probe.flag[1] })
    && cyanBounds.minX < inkBounds.minX
    && cyanBounds.maxY > inkBounds.maxY
    && magentaBounds.maxX > inkBounds.maxX
    && magentaBounds.minY < inkBounds.minY;
}

function collapseLowerNewsletterModule(source: string, grid: Grid) {
  const [original, collapsed] = COLLAPSED_LOWER_MODULES.get(grid)!;
  return source.replace(original, collapsed);
}

function removeTikTokHead(source: string, grid: Grid) {
  const yFloor = grid === 16 ? 8 : grid === 24 ? 12 : 18;
  return source.replace(
    new RegExp(`  <rect fill="${TIKTOK_INK}"[^>]* y="(?:${Array.from(
      { length: 9 },
      (_, index) => yFloor + index,
    ).join("|")})"[^>]*/>\\n`, "g"),
    "",
  );
}

function removeTikTokFlag(source: string, grid: Grid) {
  const flagX = grid === 16 ? 11 : grid === 24 ? 17 : 24;
  return source.replace(new RegExp(`  <rect fill="${TIKTOK_INK}" x="${flagX}"[^>]*/>\\n`), "");
}

describe("Myles 98 UnderstandingFAFSA and TikTok Catalog refinement", () => {
  it.each(GRIDS)("makes UnderstandingFAFSA %ipx a wide folded-newsprint stack without envelope folds", async (grid) => {
    const source = sourceFor("understandingfafsa", grid);
    const raster = await nativeRaster(source, grid);
    const layout = newsletterLayout(raster);

    expect(widthOf(layout.page) / heightOf(layout.page), "newsletter silhouette must be a wide printed spread").toBeGreaterThanOrEqual(1.2);
    expect(source, "newsletter must not contain diagonal envelope or mountain anatomy").not.toMatch(
      /<(?:polygon|polyline)\b|<path\b[^>]*\bd="[^"]*[LACQST]/i,
    );
    expect(widthOf(layout.masthead) / widthOf(layout.page)).toBeLessThan(0.6);
    expect(layout.masthead.maxY).toBeLessThan(layout.page.minY + Math.ceil(heightOf(layout.page) / 3));
    expect(layout.masthead.maxY).toBeLessThan(layout.feature.minY);
    expect(layout.feature.maxY).toBeLessThan(layout.lowerLeft.minY);
    expect(layout.lowerRight.minY).toBeLessThan(layout.lowerLeft.minY);
    expect(widthOf(layout.lowerRight) / widthOf(layout.page)).toBeGreaterThan(0.55);
    expect(newsletterHasDistinctModules(raster)).toBe(true);

    const email = await nativeRaster(sourceFor("email", grid), grid);
    expect(
      intersectionOverUnion(opaquePixels(raster), opaquePixels(email)),
      "wide physical newsprint may overlap Email's broad bounds, but must remain distinct through its print anatomy",
    ).toBeLessThan(0.84);
    expect(source, "newsprint must not gain Generic App's dark frame or system-blue browser chrome").not.toMatch(
      /#202020|#154c9a|#174b96/i,
    );
  });

  it.each(GRIDS)("makes TikTok Catalog %ipx a compact three-channel TikTok note", async (grid) => {
    const source = sourceFor("tiktok-catalog", grid);
    const raster = await nativeRaster(source, grid);
    expect(isPixelatedTikTokMark(raster, grid)).toBe(true);
    expect(FORMER_BAG_COLORS.some((color) => source.toLowerCase().includes(color))).toBe(false);
    expect(source).not.toMatch(/<(?:circle|ellipse|line|polyline|text|use)\b|\b(?:opacity|filter|stroke|transform)=/i);

    const genericApp = await nativeRaster(sourceFor("generic-app", grid), grid);
    expect(
      intersectionOverUnion(opaquePixels(raster), opaquePixels(genericApp)),
      "TikTok note must not collapse into the Generic App silhouette",
    ).toBeLessThan(0.82);
    expect(topRowWidth(opaquePixels(raster), grid)).toBeLessThan(topRowWidth(opaquePixels(genericApp), grid) * 0.75);
  });

  it.each(GRIDS)("rejects a %ipx newsletter whose physical fold collapses into a dashboard-like tile", async (grid) => {
    const source = sourceFor("understandingfafsa", grid);
    expect(newsletterHasDistinctModules(await nativeRaster(source, grid))).toBe(true);
    expect(newsletterHasDistinctModules(await nativeRaster(collapseLowerNewsletterModule(source, grid), grid))).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx TikTok mark with its lower note head removed", async (grid) => {
    const source = sourceFor("tiktok-catalog", grid);
    expect(isPixelatedTikTokMark(await nativeRaster(source, grid), grid)).toBe(true);
    expect(isPixelatedTikTokMark(await nativeRaster(removeTikTokHead(source, grid), grid), grid)).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx TikTok mark with its right-facing flag removed", async (grid) => {
    const source = sourceFor("tiktok-catalog", grid);
    expect(isPixelatedTikTokMark(await nativeRaster(source, grid), grid)).toBe(true);
    expect(isPixelatedTikTokMark(await nativeRaster(removeTikTokFlag(source, grid), grid), grid)).toBe(false);
  });
});
