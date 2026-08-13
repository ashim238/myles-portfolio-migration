import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const PAPER = "#f3efe7";
const REAR_SHEET = "#d2cec6";
const STACK_SHADOW = "#6c6962";
const CREASE = "#d8d4cc";
const FOLD_SHADOW = "#b8b4ad";
const FOLD_FACE = "#eeeae3";
const BROWSER_CHROME = new Set(["#202020", "#154c9a", "#174b96"]);

type Grid = (typeof GRIDS)[number];
type Rgba = readonly [number, number, number, number];
type NativeRaster = { data: Buffer; width: number; height: number; channels: number };

const FOLD = new Map<Grid, {
  sideHeight: number;
  lowerFaceProbeX: number;
  sideX: number;
  upperFaceProbeX: number;
  width: number;
  x: number;
  y: number;
}>([
  [16, { x: 2, y: 6, width: 10, sideHeight: 3, sideX: 12, upperFaceProbeX: 6, lowerFaceProbeX: 8 }],
  [24, { x: 2, y: 11, width: 17, sideHeight: 4, sideX: 19, upperFaceProbeX: 9, lowerFaceProbeX: 16 }],
  [32, { x: 3, y: 15, width: 21, sideHeight: 4, sideX: 25, upperFaceProbeX: 9, lowerFaceProbeX: 23 }],
]);

function masterSource(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "understandingfafsa", grid), "utf8");
}

function publicSource(grid: Grid) {
  return readFileSync(`public/myles98-icons/understandingfafsa/understandingfafsa-${grid}.svg`, "utf8");
}

function rgba(hex: string): Rgba {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff];
}

async function nativeRaster(source: string, grid: Grid): Promise<NativeRaster> {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { data, width: info.width, height: info.height, channels: info.channels };
}

function rgbaAt(raster: NativeRaster, x: number, y: number): Rgba {
  const offset = (y * raster.width + x) * raster.channels;
  return [
    raster.data[offset]!,
    raster.data[offset + 1]!,
    raster.data[offset + 2]!,
    raster.data[offset + 3]!,
  ];
}

function hasColorAt(raster: NativeRaster, x: number, y: number, color: string) {
  return rgbaAt(raster, x, y).every((channel, index) => channel === rgba(color)[index]);
}

function hasPhysicalLowerLeaf(raster: NativeRaster, grid: Grid) {
  const fold = FOLD.get(grid)!;
  const rightEdge = fold.x + fold.width - 1;
  const lowerEdge = fold.y + fold.sideHeight;

  return hasColorAt(raster, fold.x, fold.y, CREASE)
    && hasColorAt(raster, rightEdge, fold.y, CREASE)
    && hasColorAt(raster, fold.sideX, fold.y + 1, FOLD_SHADOW)
    && hasColorAt(raster, fold.sideX, lowerEdge, FOLD_SHADOW)
    && hasColorAt(raster, fold.upperFaceProbeX, fold.y + 1, FOLD_FACE)
    && hasColorAt(raster, fold.lowerFaceProbeX, lowerEdge, FOLD_FACE);
}

function opaqueTopology(raster: NativeRaster) {
  const opaque = Array.from(
    { length: raster.width * raster.height },
    (_, index) => raster.data[index * raster.channels + 3] === 0xff,
  );
  const neighbors = (index: number) => {
    const x = index % raster.width;
    const y = Math.floor(index / raster.width);
    return [
      x > 0 ? index - 1 : -1,
      x < raster.width - 1 ? index + 1 : -1,
      y > 0 ? index - raster.width : -1,
      y < raster.height - 1 ? index + raster.width : -1,
    ].filter((candidate) => candidate >= 0);
  };
  const flood = (seed: number, target: boolean, visited: Set<number>) => {
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      for (const neighbor of neighbors(index)) {
        if (visited.has(neighbor) || opaque[neighbor] !== target) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  };

  const exterior = new Set<number>();
  for (let x = 0; x < raster.width; x += 1) {
    for (const y of [0, raster.height - 1]) {
      const index = y * raster.width + x;
      if (!opaque[index] && !exterior.has(index)) flood(index, false, exterior);
    }
  }
  for (let y = 0; y < raster.height; y += 1) {
    for (const x of [0, raster.width - 1]) {
      const index = y * raster.width + x;
      if (!opaque[index] && !exterior.has(index)) flood(index, false, exterior);
    }
  }

  const filled = new Set<number>();
  let components = 0;
  opaque.forEach((isFilled, index) => {
    if (!isFilled || filled.has(index)) return;
    components += 1;
    flood(index, true, filled);
  });

  return {
    components,
    enclosedTransparency: opaque.filter((isFilled, index) => !isFilled && !exterior.has(index)).length,
  };
}

function flattenLowerLeaf(source: string) {
  return source.replaceAll(FOLD_SHADOW, FOLD_FACE);
}

describe("Myles 98 UnderstandingFAFSA native paper-fold polish", () => {
  it.each(GRIDS)("renders %ipx as one un-clipped, folded printed newsletter with a material fold transition", async (grid) => {
    const source = masterSource(grid);
    const raster = await nativeRaster(source, grid);
    const alpha = Array.from(
      { length: raster.width * raster.height },
      (_, index) => raster.data[index * raster.channels + 3],
    );
    const perimeter = [
      ...Array.from({ length: grid }, (_, x) => alpha[x]),
      ...Array.from({ length: grid }, (_, x) => alpha[(grid - 1) * grid + x]),
      ...Array.from({ length: grid }, (_, y) => alpha[y * grid]),
      ...Array.from({ length: grid }, (_, y) => alpha[y * grid + grid - 1]),
    ];

    expect(raster.width).toBe(grid);
    expect(raster.height).toBe(grid);
    expect(alpha.every((value) => value === 0 || value === 0xff)).toBe(true);
    expect(perimeter.every((value) => value === 0)).toBe(true);
    expect(opaqueTopology(raster)).toEqual({ components: 1, enclosedTransparency: 0 });
    expect(hasPhysicalLowerLeaf(raster, grid)).toBe(true);
    expect(source).toContain(PAPER);
    expect(source).toContain(REAR_SHEET);
    expect(source).toContain(STACK_SHADOW);
    expect([...BROWSER_CHROME].some((color) => source.toLowerCase().includes(color))).toBe(false);
  });

  it.each(GRIDS)("rejects %ipx flattening that turns the lower leaf into a dashboard-like panel", async (grid) => {
    const source = masterSource(grid);

    expect(hasPhysicalLowerLeaf(await nativeRaster(source, grid), grid)).toBe(true);
    expect(hasPhysicalLowerLeaf(await nativeRaster(flattenLowerLeaf(source), grid), grid)).toBe(false);
  });

  it.each(GRIDS)("keeps the public %ipx asset byte-for-byte authored from the matching master", (grid) => {
    expect(publicSource(grid)).toBe(masterSource(grid));
  });
});
