import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const OUTLINE = "#202126";
const FACE = "#cf526d";
const DEPTH = "#8d3349";
const HANDLE_OPENING = "#f3eee4";
const TOP_LEFT_LIGHT = "#f07b91";

type Grid = (typeof GRIDS)[number];
type Rect = { height: number; width: number; x: number; y: number };
type Bounds = { maxX: number; maxY: number; minX: number; minY: number };
type Raster = Awaited<ReturnType<typeof nativeRaster>>;

const TIERS = new Map<Grid, { aperture: Rect; face: Rect; light: Rect }>([
  [16, {
    aperture: { x: 6, y: 2, width: 4, height: 3 },
    face: { x: 3, y: 5, width: 9, height: 10 },
    light: { x: 3, y: 5, width: 1, height: 1 },
  }],
  [24, {
    aperture: { x: 10, y: 3, width: 5, height: 4 },
    face: { x: 6, y: 7, width: 13, height: 16 },
    light: { x: 6, y: 7, width: 3, height: 1 },
  }],
  [32, {
    aperture: { x: 13, y: 3, width: 7, height: 6 },
    face: { x: 7, y: 9, width: 18, height: 22 },
    light: { x: 7, y: 9, width: 4, height: 1 },
  }],
]);

const NATIVE_MASKS = new Map<Grid, readonly string[]>([
  [16, [
    "................",
    ".....KKKKKK.....",
    ".....KOOOOK.....",
    ".....KOOOOK.....",
    "..KKKKOOOOKKK...",
    "..KLPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "..KPPPPPPPPPK...",
    "................",
  ]],
  [24, [
    "........................",
    "........KKKKKKKKK.......",
    "........KKKKKKKKK.......",
    "........KKOOOOOKK.......",
    "........KKOOOOOKK.......",
    "........KKOOOOOKK.......",
    ".....KKKKKOOOOOKKKKK....",
    ".....KLLLPPPPPPPPPPK....",
    ".....KPPPPPPPPPPPPPD....",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPDD...",
    ".....KPPPPPPPPPPPPPD....",
    "........................",
  ]],
  [32, [
    "................................",
    "..........KKKKKKKKKKKKK.........",
    "..........KKKKKKKKKKKKK.........",
    "..........KKKOOOOOOOKKK.........",
    "..........KKKOOOOOOOKKK.........",
    "..........KKKOOOOOOOKKK.........",
    "..........KKKOOOOOOOKKK.........",
    "..........KKKOOOOOOOKKK.........",
    "......KKKKKKKOOOOOOOKKKKKK......",
    "......KLLLLPPPPPPPPPPPPPPD......",
    "......KPPPPPPPPPPPPPPPPPPDD.....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDDD....",
    "......KPPPPPPPPPPPPPPPPPPDD.....",
    "................................",
  ]],
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

function rasterMask(raster: Raster) {
  const symbols = [[OUTLINE, "K"], [FACE, "P"], [DEPTH, "D"], [HANDLE_OPENING, "O"], [TOP_LEFT_LIGHT, "L"]] as const;
  return Array.from({ length: raster.height }, (_, y) => Array.from({ length: raster.width }, (_, x) => {
    const offset = (y * raster.width + x) * raster.channels;
    if (raster.data[offset + 3] === 0) return ".";
    const symbol = symbols.find(([fill]) => matchesFill(raster, x, y, fill))?.[1];
    if (!symbol) throw new Error(`Unexpected opaque color at ${x},${y}`);
    return symbol;
  }).join(""));
}

function boundsFor(pixels: number[], width: number): Bounds {
  const xs = pixels.map((pixel) => pixel % width);
  const ys = pixels.map((pixel) => Math.floor(pixel / width));
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

function boundsFromRect(rect: Rect): Bounds {
  return { minX: rect.x, minY: rect.y, maxX: rect.x + rect.width - 1, maxY: rect.y + rect.height - 1 };
}

function widthOf(bounds: Bounds) {
  return bounds.maxX - bounds.minX + 1;
}

function heightOf(bounds: Bounds) {
  return bounds.maxY - bounds.minY + 1;
}

function hasLiteralShoppingBag(raster: Raster, grid: Grid) {
  const tier = TIERS.get(grid)!;
  const aperture = boundsFor(pixelsFor(raster, HANDLE_OPENING), raster.width);
  const face = boundsFor(pixelsFor(raster, FACE), raster.width);
  const light = boundsFor(pixelsFor(raster, TOP_LEFT_LIGHT), raster.width);
  const topFrame = Array.from(
    { length: widthOf(aperture) },
    (_, offset) => matchesFill(raster, aperture.minX + offset, aperture.minY - 1, OUTLINE),
  ).every(Boolean);
  const leftLeg = Array.from(
    { length: heightOf(aperture) },
    (_, offset) => matchesFill(raster, aperture.minX - 1, aperture.minY + offset, OUTLINE),
  ).every(Boolean);
  const rightLeg = Array.from(
    { length: heightOf(aperture) },
    (_, offset) => matchesFill(raster, aperture.maxX + 1, aperture.minY + offset, OUTLINE),
  ).every(Boolean);
  const opensIntoFace = Array.from(
    { length: widthOf(aperture) },
    (_, offset) => matchesFill(raster, aperture.minX + offset, aperture.maxY + 1, FACE),
  ).every(Boolean);
  const hasExpectedDepth = grid === 16
    ? pixelsFor(raster, DEPTH).length === 0
    : (() => {
      const depth = boundsFor(pixelsFor(raster, DEPTH), raster.width);
      return depth.minX === face.maxX + 1
        && depth.maxY === face.maxY
        && heightOf(depth) >= heightOf(face) - 2;
    })();

  return {
    aperture,
    face,
    hasExpectedDepth,
    light,
    literal: aperture.minX === boundsFromRect(tier.aperture).minX
      && aperture.minY === boundsFromRect(tier.aperture).minY
      && aperture.maxX === boundsFromRect(tier.aperture).maxX
      && aperture.maxY === boundsFromRect(tier.aperture).maxY
      && face.minX === boundsFromRect(tier.face).minX
      && face.minY === boundsFromRect(tier.face).minY
      && face.maxX === boundsFromRect(tier.face).maxX
      && face.maxY === boundsFromRect(tier.face).maxY
      && light.minX === boundsFromRect(tier.light).minX
      && light.minY === boundsFromRect(tier.light).minY
      && light.maxX === boundsFromRect(tier.light).maxX
      && light.maxY === boundsFromRect(tier.light).maxY
      && heightOf(face) > widthOf(face)
      && aperture.maxY + 1 === face.minY
      && topFrame
      && leftLeg
      && rightLeg
      && opensIntoFace
      && hasExpectedDepth,
  };
}

function floppySaveSlotMutation(source: string) {
  return source.replace(
    new RegExp(`<rect fill="${FACE}" x="(\\d+)" y="(\\d+)" width="(\\d+)" height="(\\d+)" />`),
    (_match, x, y, width, height) => `<rect fill="${FACE}" x="${x}" y="${Number(y) + 1}" width="${width}" height="${Number(height) - 1}" />`,
  );
}

function forbiddenOrnamentMutation(source: string, grid: Grid) {
  const face = TIERS.get(grid)!.face;
  return source.replace(
    "</svg>",
    `  <rect fill="${OUTLINE}" x="${face.x + 2}" y="${face.y + 2}" width="1" height="1" />\n</svg>`,
  );
}

function isApprovedShoppingBag(raster: Raster, grid: Grid) {
  return hasLiteralShoppingBag(raster, grid).literal
    && rasterMask(raster).every((row, index) => row === NATIVE_MASKS.get(grid)![index]);
}

describe("Myles 98 TikTok Catalog literal shopping-bag recognition", () => {
  it.each(GRIDS)("renders %ipx as a tall handled retail bag whose U-handle opens directly into its front", async (grid) => {
    const source = sourceFor(grid);
    const anatomy = hasLiteralShoppingBag(await nativeRaster(source, grid), grid);

    expect(anatomy.literal).toBe(true);
    expect(rasterMask(await nativeRaster(source, grid))).toEqual(NATIVE_MASKS.get(grid));
    expect(isApprovedShoppingBag(await nativeRaster(source, grid), grid)).toBe(true);
    expect(publicSourceFor(grid)).toBe(source);
  });

  it.each(GRIDS)("rejects a %ipx floppy/save-slot mutation with a dark bar beneath the handle aperture", async (grid) => {
    const source = sourceFor(grid);
    const mutated = floppySaveSlotMutation(source);

    expect(mutated).not.toBe(source);
    expect(isApprovedShoppingBag(await nativeRaster(mutated, grid), grid)).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx forbidden black ornament even when the bag structure remains intact", async (grid) => {
    const source = sourceFor(grid);
    const mutated = forbiddenOrnamentMutation(source, grid);
    const raster = await nativeRaster(mutated, grid);

    expect(hasLiteralShoppingBag(raster, grid).literal).toBe(true);
    expect(rasterMask(raster)).not.toEqual(NATIVE_MASKS.get(grid));
    expect(isApprovedShoppingBag(raster, grid)).toBe(false);
  });
});
