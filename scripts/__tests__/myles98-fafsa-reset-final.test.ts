import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const PRINT_INK = "#29282a";
const MASTHEAD_RULE = "#1f679f";
const FEATURE_INK = "#a7bcc2";
const LOWER_LEFT_MODULE = "#c5963a";
const LOWER_RIGHT_MODULE = "#eeeae3";
const RESTART_COLORS = new Set(["#8e211e", "#8d211e", "#f15a50"]);

type Grid = (typeof GRIDS)[number];
type Bounds = { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number };
type Raster = { data: Buffer; width: number; height: number; channels: number };

function sourceFor(concept: "understandingfafsa" | "reset-desktop", grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

async function nativeRaster(source: string, grid: Grid): Promise<Raster> {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function rgba(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff] as const;
}

function maskFor(raster: Raster, colors: Iterable<string>) {
  const colorsToMatch = [...colors].map(rgba);
  return Array.from({ length: raster.width * raster.height }, (_, index) => {
    const offset = index * raster.channels;
    return colorsToMatch.some((color) => color.every((channel, channelIndex) => (
      raster.data[offset + channelIndex] === channel
    )));
  });
}

function opaqueMask(raster: Raster) {
  return Array.from(
    { length: raster.width * raster.height },
    (_, index) => raster.data[index * raster.channels + 3] === 0xff,
  );
}

function boundsFor(mask: boolean[], width: number): Bounds {
  const points = mask.flatMap((filled, index) => filled ? [[index % width, Math.floor(index / width)]] : []);
  if (points.length === 0) throw new Error("Expected a non-empty raster mask");
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function hasOpenTopology(mask: boolean[], width: number) {
  const height = mask.length / width;
  const neighbors = (index: number) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [
      x > 0 ? index - 1 : -1,
      x < width - 1 ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y < height - 1 ? index + width : -1,
    ].filter((candidate) => candidate >= 0);
  };
  const flood = (seed: number, filled: boolean, visited: Set<number>) => {
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      for (const neighbor of neighbors(index)) {
        if (visited.has(neighbor) || mask[neighbor] !== filled) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  };

  const exterior = new Set<number>();
  for (let x = 0; x < width; x += 1) {
    for (const y of [0, height - 1]) {
      const index = y * width + x;
      if (!mask[index] && !exterior.has(index)) flood(index, false, exterior);
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (const x of [0, width - 1]) {
      const index = y * width + x;
      if (!mask[index] && !exterior.has(index)) flood(index, false, exterior);
    }
  }

  const filled = new Set<number>();
  let components = 0;
  mask.forEach((isFilled, index) => {
    if (!isFilled || filled.has(index)) return;
    components += 1;
    flood(index, true, filled);
  });
  return {
    components,
    enclosedTransparentPixels: mask.filter((isFilled, index) => !isFilled && !exterior.has(index)).length,
  };
}

function componentCount(mask: boolean[], width: number) {
  const height = mask.length / width;
  const seen = new Set<number>();
  let count = 0;

  for (let index = 0; index < mask.length; index += 1) {
    if (!mask[index] || seen.has(index)) continue;
    count += 1;
    const queue = [index];
    seen.add(index);
    while (queue.length > 0) {
      const current = queue.shift()!;
      const x = current % width;
      const y = Math.floor(current / width);
      const neighbors = [
        x > 0 ? current - 1 : -1,
        x < width - 1 ? current + 1 : -1,
        y > 0 ? current - width : -1,
        y < height - 1 ? current + width : -1,
      ];
      for (const neighbor of neighbors) {
        if (neighbor >= 0 && mask[neighbor] && !seen.has(neighbor)) {
          seen.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  return count;
}

describe("Myles 98 final FAFSA and Reset icon metaphors", () => {
  it.each(GRIDS)("renders UnderstandingFAFSA %ipx as a folded print spread, not a framed web surface", async (grid) => {
    const raster = await nativeRaster(sourceFor("understandingfafsa", grid), grid);
    const page = boundsFor(opaqueMask(raster), raster.width);
    const ink = boundsFor(maskFor(raster, [PRINT_INK]), raster.width);
    const masthead = boundsFor(maskFor(raster, [MASTHEAD_RULE]), raster.width);
    const feature = boundsFor(maskFor(raster, [FEATURE_INK]), raster.width);
    const lowerLeft = boundsFor(maskFor(raster, [LOWER_LEFT_MODULE]), raster.width);
    const lowerRight = boundsFor(maskFor(raster, [LOWER_RIGHT_MODULE]), raster.width);

    expect(page.width / page.height).toBeGreaterThanOrEqual(1.2);
    expect(ink.minX).toBeGreaterThan(page.minX);
    expect(ink.maxX).toBeLessThan(page.maxX);
    expect(ink.minY).toBeGreaterThan(page.minY);
    expect(ink.maxY).toBeLessThan(page.maxY);
    expect(ink.height).toBe(1);
    expect(masthead.width / page.width).toBeLessThan(0.75);
    expect(masthead.height).toBe(1);
    expect(componentCount(maskFor(raster, [MASTHEAD_RULE]), raster.width)).toBeGreaterThanOrEqual(3);
    expect(ink.maxY).toBeLessThan(feature.minY);
    expect(masthead.maxY).toBeLessThan(feature.minY);
    expect(feature.width).toBeLessThan(page.width / 2);
    expect(lowerLeft.maxY).toBeGreaterThan(feature.maxY);
    expect(lowerRight.width / page.width).toBeGreaterThan(0.55);
    expect(lowerRight.minY).toBeLessThan(lowerLeft.maxY);
  });

  it.each(GRIDS)("renders Reset Desktop %ipx as one open circular restart arrow, not a device", async (grid) => {
    const raster = await nativeRaster(sourceFor("reset-desktop", grid), grid);
    const action = maskFor(raster, RESTART_COLORS);
    const opaque = opaqueMask(raster);
    const bounds = boundsFor(action, raster.width);
    const tipPixels = action.filter((filled, index) => filled && index % grid === bounds.maxX).length;
    const center = Math.floor(grid / 2);
    const density = action.filter(Boolean).length / (bounds.width * bounds.height);

    expect(action).toEqual(opaque);
    expect(hasOpenTopology(action, grid)).toEqual({ components: 1, enclosedTransparentPixels: 0 });
    expect(Math.abs(bounds.width - bounds.height)).toBeLessThanOrEqual(2);
    expect(tipPixels).toBe(1);
    expect(action[center * grid + center]).toBe(false);
    expect(density).toBeLessThan(0.56);
    expect(bounds.minX).toBeGreaterThanOrEqual(2);
    expect(bounds.minY).toBeGreaterThanOrEqual(2);
    expect(bounds.maxX).toBeLessThanOrEqual(grid - 3);
    expect(bounds.maxY).toBeLessThanOrEqual(grid - 3);
  });
});
