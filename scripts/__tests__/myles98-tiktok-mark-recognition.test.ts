import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const INK = "#202126";
const CYAN = "#25f4ee";
const MAGENTA = "#fe2c55";
const FORMER_BAG_COLORS = ["#cf526d", "#8d3349", "#f3eee4", "#f07b91"] as const;

type Grid = (typeof GRIDS)[number];
type Bounds = { maxX: number; maxY: number; minX: number; minY: number };
type Raster = Awaited<ReturnType<typeof nativeRaster>>;

const PROBES = new Map<Grid, {
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

function sourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "tiktok-catalog", grid), "utf8");
}

function publicSourceFor(grid: Grid) {
  return readFileSync(`public/myles98-icons/tiktok-catalog/tiktok-catalog-${grid}.svg`, "utf8");
}

async function nativeRaster(source: string, grid: Grid) {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { channels: info.channels, data, height: info.height, width: info.width };
}

function rgb(fill: string) {
  const value = Number.parseInt(fill.slice(1), 16);
  return [value >> 16, (value >> 8) & 0xff, value & 0xff] as const;
}

function matchesFill(raster: Raster, x: number, y: number, fill: string) {
  if (x < 0 || y < 0 || x >= raster.width || y >= raster.height) return false;
  const [red, green, blue] = rgb(fill);
  const offset = (y * raster.width + x) * raster.channels;
  return raster.data[offset] === red
    && raster.data[offset + 1] === green
    && raster.data[offset + 2] === blue
    && raster.data[offset + 3] === 0xff;
}

function pixelsFor(raster: Raster, fill: string) {
  return Array.from({ length: raster.width * raster.height }, (_, index) => index).filter((index) => {
    const x = index % raster.width;
    const y = Math.floor(index / raster.width);
    return matchesFill(raster, x, y, fill);
  });
}

function boundsFor(pixels: number[], width: number): Bounds {
  if (pixels.length === 0) throw new Error("Expected a non-empty pixel set");
  const xs = pixels.map((pixel) => pixel % width);
  const ys = pixels.map((pixel) => Math.floor(pixel / width));
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

function componentCount(pixels: number[], width: number, height: number) {
  const remaining = new Set(pixels);
  let components = 0;
  while (remaining.size > 0) {
    components += 1;
    const seed = remaining.values().next().value as number;
    const queue = [seed];
    remaining.delete(seed);
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
        if (remaining.delete(neighbor)) queue.push(neighbor);
      }
    }
  }
  return components;
}

function isRecognizableTikTokMark(raster: Raster, grid: Grid) {
  const probe = PROBES.get(grid)!;
  const ink = pixelsFor(raster, INK);
  const cyan = pixelsFor(raster, CYAN);
  const magenta = pixelsFor(raster, MAGENTA);
  if (ink.length === 0 || cyan.length === 0 || magenta.length === 0) return false;

  const inkBounds = boundsFor(ink, raster.width);
  const cyanBounds = boundsFor(cyan, raster.width);
  const magentaBounds = boundsFor(magenta, raster.width);
  const hardAlpha = Array.from(
    { length: raster.width * raster.height },
    (_, index) => raster.data[index * raster.channels + 3],
  ).every((alpha) => alpha === 0 || alpha === 0xff);
  const perimeter = [
    ...Array.from({ length: grid }, (_, x) => raster.data[(x * raster.channels) + 3]),
    ...Array.from({ length: grid }, (_, x) => raster.data[(((grid - 1) * grid + x) * raster.channels) + 3]),
    ...Array.from({ length: grid }, (_, y) => raster.data[((y * grid) * raster.channels) + 3]),
    ...Array.from({ length: grid }, (_, y) => raster.data[((y * grid + grid - 1) * raster.channels) + 3]),
  ];

  return componentCount(ink, raster.width, raster.height) === 1
    && hardAlpha
    && perimeter.every((alpha) => alpha === 0)
    && matchesFill(raster, ...probe.stem, INK)
    && matchesFill(raster, ...probe.flag, INK)
    && matchesFill(raster, ...probe.head, INK)
    && matchesFill(raster, ...probe.cyan, CYAN)
    && matchesFill(raster, ...probe.magenta, MAGENTA)
    && inkBounds.minX < probe.stem[0] - 2
    && inkBounds.maxX > probe.stem[0] + 2
    && inkBounds.maxY > probe.stem[1] + Math.floor(grid * 0.35)
    && cyanBounds.minX < inkBounds.minX
    && cyanBounds.maxY > inkBounds.maxY
    && magentaBounds.maxX > inkBounds.maxX
    && magentaBounds.minY < inkBounds.minY;
}

function removeInkHead(source: string, grid: Grid) {
  const yFloor = grid === 16 ? 8 : grid === 24 ? 12 : 18;
  return source.replace(
    new RegExp(`  <rect fill="${INK}"[^>]* y="(?:${yFloor}|${yFloor + 1}|${yFloor + 2}|${yFloor + 3}|${yFloor + 4}|${yFloor + 5}|${yFloor + 6}|${yFloor + 7}|${yFloor + 8})"[^>]*/>\\n`, "g"),
    "",
  );
}

function removeInkFlag(source: string, grid: Grid) {
  const flagX = grid === 16 ? 11 : grid === 24 ? 17 : 24;
  return source.replace(
    new RegExp(`  <rect fill="${INK}" x="${flagX}"[^>]*/>\\n`),
    "",
  );
}

describe("Myles 98 TikTok Catalog pixelated TikTok-mark recognition", () => {
  it.each(GRIDS)("renders %ipx as a compact three-channel TikTok note, not a shopping bag", async (grid) => {
    const source = sourceFor(grid);
    const raster = await nativeRaster(source, grid);

    expect(isRecognizableTikTokMark(raster, grid)).toBe(true);
    expect(FORMER_BAG_COLORS.some((color) => source.toLowerCase().includes(color))).toBe(false);
    expect(publicSourceFor(grid)).toBe(source);
  });

  it.each(GRIDS)("rejects a %ipx mark whose lower note head is removed", async (grid) => {
    const source = sourceFor(grid);
    const mutated = removeInkHead(source, grid);

    expect(mutated).not.toBe(source);
    expect(isRecognizableTikTokMark(await nativeRaster(mutated, grid), grid)).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx mark whose right-facing flag is removed", async (grid) => {
    const source = sourceFor(grid);
    const mutated = removeInkFlag(source, grid);

    expect(mutated).not.toBe(source);
    expect(isRecognizableTikTokMark(await nativeRaster(mutated, grid), grid)).toBe(false);
  });
});
