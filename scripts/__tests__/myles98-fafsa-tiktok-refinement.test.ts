import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const NEWSLETTER_MASTHEAD_FILL = "#1f679f";
const NEWSLETTER_REGION_FILLS = ["#5f889f", "#c5963a", "#d8d4cc"] as const;
const BAG_FACE_FILL = "#cf526d";
const BAG_DEPTH_FILL = "#8d3349";
const BAG_OPENING_FILL = "#f3eee4";
const BAG_HANDLE_FILL = "#202126";
const COLLAPSED_LOWER_MODULES = new Map<Grid, [string, string]>([
  [16, [
    '<rect fill="#d8d4cc" x="8" y="10" width="3" height="2" />',
    '<rect fill="#d8d4cc" x="6" y="7" width="3" height="2" />',
  ]],
  [24, [
    '<rect fill="#d8d4cc" x="12" y="14" width="6" height="5" />',
    '<rect fill="#d8d4cc" x="12" y="9" width="6" height="5" />',
  ]],
  [32, [
    '<rect fill="#d8d4cc" x="16" y="19" width="8" height="6" />',
    '<rect fill="#d8d4cc" x="16" y="12" width="8" height="6" />',
  ]],
]);
const MISSING_HANDLE_SIDE_FRAMES = new Map<Grid, [string, string]>([
  [16, [
    '<rect fill="#202126" x="5" y="1" width="6" height="5" />',
    '<rect fill="#202126" x="5" y="1" width="6" height="1" />\n  <rect fill="#202126" x="10" y="2" width="1" height="4" />',
  ]],
  [24, [
    '<rect fill="#202126" x="8" y="1" width="9" height="8" />',
    '<rect fill="#202126" x="8" y="1" width="9" height="2" />\n  <rect fill="#202126" x="8" y="3" width="1" height="6" />\n  <rect fill="#202126" x="15" y="3" width="2" height="6" />',
  ]],
  [32, [
    '<rect fill="#202126" x="10" y="1" width="13" height="10" />',
    '<rect fill="#202126" x="10" y="1" width="13" height="2" />\n  <rect fill="#202126" x="10" y="3" width="2" height="8" />\n  <rect fill="#202126" x="20" y="3" width="3" height="8" />',
  ]],
]);
const MISSING_HANDLE_TOP_FRAMES = new Map<Grid, [string, string]>([
  [16, [
    '<rect fill="#202126" x="5" y="1" width="6" height="5" />',
    '<rect fill="#202126" x="5" y="1" width="1" height="5" />\n  <rect fill="#202126" x="10" y="1" width="1" height="5" />',
  ]],
  [24, [
    '<rect fill="#202126" x="8" y="1" width="9" height="8" />',
    '<rect fill="#202126" x="8" y="1" width="9" height="1" />\n  <rect fill="#202126" x="8" y="2" width="2" height="7" />\n  <rect fill="#202126" x="15" y="2" width="2" height="7" />',
  ]],
  [32, [
    '<rect fill="#202126" x="10" y="1" width="13" height="10" />',
    '<rect fill="#202126" x="10" y="1" width="13" height="1" />\n  <rect fill="#202126" x="10" y="2" width="3" height="9" />\n  <rect fill="#202126" x="20" y="2" width="3" height="9" />',
  ]],
]);
const MAX_HANDLE_OPENING_WIDTH_RATIO = new Map<Grid, number>([
  [16, 0.5],
  [24, 0.4],
  [32, 0.4],
]);
const MAX_HANDLE_OPENING_HEIGHT_RATIO = new Map<Grid, number>([
  [16, 0.5],
  [24, 0.5],
  [32, 0.4],
]);

type Grid = (typeof GRIDS)[number];
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
type NativeRaster = Awaited<ReturnType<typeof nativeRaster>>;

function sourceFor(concept: "email" | "generic-app" | "understandingfafsa" | "tiktok-catalog", grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function rectsForFill(source: string, fill: string) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .filter(([, attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill)
    .map(([, attributes]) => {
      const minX = Number(attribute(attributes, "x"));
      const minY = Number(attribute(attributes, "y"));
      return {
        minX,
        minY,
        maxX: minX + Number(attribute(attributes, "width")) - 1,
        maxY: minY + Number(attribute(attributes, "height")) - 1,
      };
    });
}

function shapesForFill(source: string, fill: string) {
  return [...source.matchAll(/<(path|rect|polygon)\b([^>]*)\/>/gi)]
    .filter(([, , attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill);
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

function intersects(left: Bounds, right: Bounds) {
  return left.minX <= right.maxX
    && left.maxX >= right.minX
    && left.minY <= right.maxY
    && left.maxY >= right.minY;
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
    lowerRight: largestComponentBounds(raster, NEWSLETTER_REGION_FILLS[2]),
  };
}

function newsletterHasDistinctModules(raster: NativeRaster) {
  const layout = newsletterLayout(raster);
  return [layout.masthead, layout.feature, layout.lowerLeft, layout.lowerRight]
    .every((region) => contains(layout.page, region))
    && layout.masthead.maxY < layout.feature.minY
    && layout.feature.maxY < layout.lowerLeft.minY
    && layout.feature.maxY < layout.lowerRight.minY
    && !intersects(layout.feature, layout.lowerLeft)
    && !intersects(layout.feature, layout.lowerRight)
    && !intersects(layout.lowerLeft, layout.lowerRight)
    && layout.lowerLeft.maxX + 1 < layout.lowerRight.minX;
}

function bagHandleFrame(raster: NativeRaster) {
  const opening = largestComponentBounds(raster, BAG_OPENING_FILL);
  const face = largestComponentBounds(raster, BAG_FACE_FILL);
  const topFrame = Array.from(
    { length: widthOf(opening) },
    (_, offset) => matchesFill(raster, opening.minX + offset, opening.minY - 1, BAG_HANDLE_FILL),
  ).every(Boolean);
  const leftFrame = Array.from(
    { length: heightOf(opening) },
    (_, offset) => matchesFill(raster, opening.minX - 1, opening.minY + offset, BAG_HANDLE_FILL),
  ).every(Boolean);
  const rightFrame = Array.from(
    { length: heightOf(opening) },
    (_, offset) => matchesFill(raster, opening.maxX + 1, opening.minY + offset, BAG_HANDLE_FILL),
  ).every(Boolean);
  const joinsBody = opaquePathConnects(
    raster,
    { x: opening.minX - 1, y: opening.maxY },
    { x: face.minX, y: face.minY },
  );
  return { opening, face, topFrame, leftFrame, rightFrame, joinsBody };
}

function bagHasFramedHandle(raster: NativeRaster) {
  const handle = bagHandleFrame(raster);
  return handle.opening.maxY < handle.face.minY
    && widthOf(handle.opening) / widthOf(handle.face) < MAX_HANDLE_OPENING_WIDTH_RATIO.get(raster.width)!
    && heightOf(handle.opening) / heightOf(handle.face) < MAX_HANDLE_OPENING_HEIGHT_RATIO.get(raster.width)!
    && handle.topFrame
    && handle.leftFrame
    && handle.rightFrame
    && handle.joinsBody;
}

function collapseLowerNewsletterModule(source: string, grid: Grid) {
  const [original, collapsed] = COLLAPSED_LOWER_MODULES.get(grid)!;
  return source.replace(original, collapsed);
}

function removeHandleSide(source: string, grid: Grid) {
  const [original, missingSide] = MISSING_HANDLE_SIDE_FRAMES.get(grid)!;
  return source.replace(original, missingSide);
}

function removeHandleTop(source: string, grid: Grid) {
  const [original, missingTop] = MISSING_HANDLE_TOP_FRAMES.get(grid)!;
  return source.replace(original, missingTop);
}

describe("Myles 98 UnderstandingFAFSA and TikTok Catalog refinement", () => {
  it.each(GRIDS)("makes UnderstandingFAFSA %ipx an upright three-region newsletter without envelope folds", async (grid) => {
    const source = sourceFor("understandingfafsa", grid);
    const raster = await nativeRaster(source, grid);
    const layout = newsletterLayout(raster);

    expect(heightOf(layout.page) / widthOf(layout.page), "newsletter silhouette must be upright").toBeGreaterThan(1.2);
    expect(source, "newsletter must not contain diagonal envelope or mountain anatomy").not.toMatch(
      /<(?:polygon|polyline)\b|<path\b[^>]*\bd="[^"]*[LACQST]/i,
    );
    expect(widthOf(layout.masthead) / widthOf(layout.page)).toBeGreaterThan(0.6);
    expect(layout.masthead.maxY).toBeLessThan(layout.page.minY + Math.ceil(heightOf(layout.page) / 3));
    expect(layout.masthead.maxY).toBeLessThan(layout.feature.minY);
    expect(layout.feature.maxY).toBeLessThan(layout.lowerLeft.minY);
    expect(layout.feature.maxY).toBeLessThan(layout.lowerRight.minY);
    expect(intersects(layout.feature, layout.lowerLeft)).toBe(false);
    expect(intersects(layout.feature, layout.lowerRight)).toBe(false);
    expect(intersects(layout.lowerLeft, layout.lowerRight)).toBe(false);
    expect(layout.lowerLeft.maxX + 1).toBeLessThan(layout.lowerRight.minX);
    expect(newsletterHasDistinctModules(raster)).toBe(true);

    const email = await nativeRaster(sourceFor("email", grid), grid);
    const genericApp = await nativeRaster(sourceFor("generic-app", grid), grid);
    expect(
      intersectionOverUnion(opaquePixels(raster), opaquePixels(email)),
      "newsletter page must not collapse into Email's flap silhouette",
    ).toBeLessThan(0.6);
    expect(
      intersectionOverUnion(opaquePixels(raster), opaquePixels(genericApp)),
      "standalone newsletter page must not collapse into the Generic App silhouette",
    ).toBeLessThan(0.75);
  });

  it.each(GRIDS)("makes TikTok Catalog %ipx a handled rectangular shopping bag with one side depth plane", async (grid) => {
    const source = sourceFor("tiktok-catalog", grid);
    const raster = await nativeRaster(source, grid);
    const faceRects = rectsForFill(source, BAG_FACE_FILL);
    const openingRects = rectsForFill(source, BAG_OPENING_FILL);
    const depthShapes = shapesForFill(source, BAG_DEPTH_FILL);
    const faceBounds = boundsFor(colorPixels(raster, BAG_FACE_FILL), grid);
    const openingBounds = boundsFor(colorPixels(raster, BAG_OPENING_FILL), grid);
    const depthBounds = boundsFor(colorPixels(raster, BAG_DEPTH_FILL), grid);
    const handle = bagHandleFrame(raster);

    expect(faceRects, "bag face must keep parallel sides instead of a wastebasket taper").toHaveLength(1);
    expect(openingRects, "handled opening must be one clearly separated light aperture").toHaveLength(1);
    expect(depthShapes, "bag must use one object-specific side plane, not basket seams").toHaveLength(1);
    expect(openingBounds.maxY).toBeLessThan(faceBounds.minY);
    expect(widthOf(openingBounds)).toBeLessThan(widthOf(faceBounds) * 0.65);
    expect(widthOf(faceBounds) / heightOf(faceBounds)).toBeGreaterThan(0.7);
    expect(depthBounds.maxX).toBeGreaterThan(faceBounds.maxX);
    expect(depthBounds.minX).toBeGreaterThanOrEqual(faceBounds.maxX - 1);
    expect(depthBounds.maxY - depthBounds.minY).toBeGreaterThanOrEqual(heightOf(faceBounds) - 2);
    expect(handle.topFrame, "shopping-bag handle needs an opaque top over its aperture").toBe(true);
    expect(handle.leftFrame, "shopping-bag handle needs an opaque left side").toBe(true);
    expect(handle.rightFrame, "shopping-bag handle needs an opaque right side").toBe(true);
    expect(handle.joinsBody, "shopping-bag handle must connect to the bag body").toBe(true);
    expect(widthOf(handle.opening) / widthOf(handle.face)).toBeLessThan(MAX_HANDLE_OPENING_WIDTH_RATIO.get(grid)!);
    expect(heightOf(handle.opening) / heightOf(handle.face)).toBeLessThan(MAX_HANDLE_OPENING_HEIGHT_RATIO.get(grid)!);
    expect(bagHasFramedHandle(raster)).toBe(true);
    expect(source, "shopping bag must not include an open-bin rim or branded/social ornament").not.toMatch(
      /#6f293d|<(?:circle|ellipse|line|polyline|text|use)\b|\b(?:opacity|filter|stroke|transform)=/i,
    );

    const genericApp = await nativeRaster(sourceFor("generic-app", grid), grid);
    expect(
      intersectionOverUnion(opaquePixels(raster), opaquePixels(genericApp)),
      "shopping bag must not collapse into the Generic App silhouette",
    ).toBeLessThan(0.82);
    expect(topRowWidth(opaquePixels(raster), grid)).toBeLessThan(topRowWidth(opaquePixels(genericApp), grid) * 0.65);
  });

  it.each(GRIDS)("rejects a %ipx newsletter whose lower module collapses into the feature", async (grid) => {
    const source = sourceFor("understandingfafsa", grid);
    expect(newsletterHasDistinctModules(await nativeRaster(source, grid))).toBe(true);
    expect(newsletterHasDistinctModules(await nativeRaster(collapseLowerNewsletterModule(source, grid), grid))).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx shopping bag with a missing handle side", async (grid) => {
    const source = sourceFor("tiktok-catalog", grid);
    expect(bagHasFramedHandle(await nativeRaster(source, grid))).toBe(true);
    expect(bagHasFramedHandle(await nativeRaster(removeHandleSide(source, grid), grid))).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx shopping bag with a missing handle top", async (grid) => {
    const source = sourceFor("tiktok-catalog", grid);
    expect(bagHasFramedHandle(await nativeRaster(source, grid))).toBe(true);
    expect(bagHasFramedHandle(await nativeRaster(removeHandleTop(source, grid), grid))).toBe(false);
  });
});
