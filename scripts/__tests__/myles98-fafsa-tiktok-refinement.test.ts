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

function intersectionOverUnion(left: number[], right: number[]) {
  const leftSet = new Set(left);
  const rightSet = new Set(right);
  const intersection = [...leftSet].filter((pixel) => rightSet.has(pixel)).length;
  return intersection / new Set([...leftSet, ...rightSet]).size;
}

describe("Myles 98 UnderstandingFAFSA and TikTok Catalog refinement", () => {
  it.each(GRIDS)("makes UnderstandingFAFSA %ipx an upright three-region newsletter without envelope folds", async (grid) => {
    const source = sourceFor("understandingfafsa", grid);
    const raster = await nativeRaster(source, grid);
    const pageBounds = boundsFor(opaquePixels(raster), grid);
    const mastheadBounds = boundsFor(colorPixels(raster, NEWSLETTER_MASTHEAD_FILL), grid);
    const regionBounds = NEWSLETTER_REGION_FILLS.map((fill) => boundsFor(colorPixels(raster, fill), grid));

    expect(heightOf(pageBounds) / widthOf(pageBounds), "newsletter silhouette must be upright").toBeGreaterThan(1.2);
    expect(source, "newsletter must not contain diagonal envelope or mountain anatomy").not.toMatch(
      /<(?:polygon|polyline)\b|<path\b[^>]*\bd="[^"]*[LACQST]/i,
    );
    expect(widthOf(mastheadBounds) / widthOf(pageBounds)).toBeGreaterThan(0.6);
    expect(mastheadBounds.maxY).toBeLessThan(pageBounds.minY + Math.ceil(heightOf(pageBounds) / 3));
    expect(regionBounds).toHaveLength(3);
    expect(regionBounds.every((region) => contains(pageBounds, region))).toBe(true);

    const genericApp = await nativeRaster(sourceFor("generic-app", grid), grid);
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

    expect(faceRects, "bag face must keep parallel sides instead of a wastebasket taper").toHaveLength(1);
    expect(openingRects, "handled opening must be one clearly separated light aperture").toHaveLength(1);
    expect(depthShapes, "bag must use one object-specific side plane, not basket seams").toHaveLength(1);
    expect(openingBounds.maxY).toBeLessThan(faceBounds.minY);
    expect(widthOf(openingBounds)).toBeLessThan(widthOf(faceBounds) * 0.65);
    expect(widthOf(faceBounds) / heightOf(faceBounds)).toBeGreaterThan(0.7);
    expect(depthBounds.maxX).toBeGreaterThan(faceBounds.maxX);
    expect(depthBounds.minX).toBeGreaterThanOrEqual(faceBounds.maxX - 1);
    expect(depthBounds.maxY - depthBounds.minY).toBeGreaterThanOrEqual(heightOf(faceBounds) - 2);
    expect(source, "shopping bag must not include an open-bin rim or branded/social ornament").not.toMatch(
      /#6f293d|<(?:circle|ellipse|line|polyline|text|use)\b|\b(?:opacity|filter|stroke|transform)=/i,
    );
  });
});
