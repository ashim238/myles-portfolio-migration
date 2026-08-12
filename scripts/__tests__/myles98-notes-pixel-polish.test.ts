import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const HANDWRITING_FILL = "#7a536d";
const PAPER_FILLS = new Map<number, string>([
  [16, "#e8d8c6"],
  [24, "#e7d6c3"],
  [32, "#e6d4c0"],
]);

type Grid = (typeof GRIDS)[number];
type Rgba = readonly [number, number, number, number];
type Raster = { data: Buffer; width: number; height: number; channels: number };

function masterSourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "trini-roti", grid), "utf8");
}

function publicSourceFor(grid: Grid) {
  return readFileSync(`public/myles98-icons/trini-roti/trini-roti-${grid}.svg`, "utf8");
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

function rgba(hex: string): Rgba {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff];
}

function rgbaAt(raster: Raster, x: number, y: number): Rgba {
  const offset = (y * raster.width + x) * raster.channels;
  return [
    raster.data[offset]!,
    raster.data[offset + 1]!,
    raster.data[offset + 2]!,
    raster.data[offset + 3]!,
  ];
}

function matches(raster: Raster, x: number, y: number, expected: Rgba) {
  return rgbaAt(raster, x, y).every((channel, index) => channel === expected[index]);
}

describe("Myles 98 Notes native pixel polish", () => {
  it.each(GRIDS)("keeps %ipx handwritten rows inset from the memo's left paper edge", async (grid) => {
    const raster = await nativeRaster(masterSourceFor(grid), grid);
    const handwriting = rgba(HANDWRITING_FILL);
    const paper = rgba(PAPER_FILLS.get(grid)!);

    for (let y = 0; y < grid; y += 1) {
      const firstInkX = Array.from({ length: grid }, (_, x) => x).find((x) => matches(raster, x, y, handwriting));
      if (firstInkX === undefined) continue;

      expect(firstInkX, `${grid}px memo writing at row ${y} needs a left paper margin`).toBeGreaterThan(0);
      expect(matches(raster, firstInkX - 1, y, paper), `${grid}px memo writing at row ${y} must not meet the outline`).toBe(true);
    }
  });

  it.each(GRIDS)("keeps the public %ipx Notes mirror pixel-identical to its master", async (grid) => {
    const [master, mirror] = await Promise.all([
      nativeRaster(masterSourceFor(grid), grid),
      nativeRaster(publicSourceFor(grid), grid),
    ]);

    expect(mirror).toEqual(master);
  });
});
