import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const ORANGE_CENTER = [0xf2, 0xa2, 0x45, 0xff] as const;

type Bounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
};

type NativeRaster = {
  data: Buffer;
  width: number;
  height: number;
  channels: number;
};

function sourceFor(concept: string, grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function gridFor(source: string) {
  const grid = Number(source.match(/\bdata-m98-grid="(\d+)"/)?.[1]);
  if (!Number.isInteger(grid)) throw new Error("Navi master is missing an integer data-m98-grid");
  return grid;
}

async function nativeRaster(source: string): Promise<NativeRaster> {
  const grid = gridFor(source);
  const { data, info } = await sharp(
    Buffer.from(source.replace("<svg ", `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return { data, width: info.width, height: info.height, channels: info.channels };
}

function boundsForPixels(pixels: number[], width: number): Bounds {
  const xs = pixels.map((index) => index % width);
  const ys = pixels.map((index) => Math.floor(index / width));
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function opaqueComponents(raster: NativeRaster) {
  const opaque = Array.from(
    { length: raster.width * raster.height },
    (_, index) => raster.data[index * raster.channels + 3] === 0xff,
  );
  const visited = new Set<number>();
  const components: number[][] = [];

  opaque.forEach((isOpaque, seed) => {
    if (!isOpaque || visited.has(seed)) return;
    const component: number[] = [];
    const queue = [seed];
    visited.add(seed);

    while (queue.length > 0) {
      const index = queue.shift()!;
      component.push(index);
      const x = index % raster.width;
      const y = Math.floor(index / raster.width);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x < raster.width - 1 ? index + 1 : -1,
        y > 0 ? index - raster.width : -1,
        y < raster.height - 1 ? index + raster.width : -1,
      ];
      for (const candidate of neighbors) {
        if (candidate < 0 || visited.has(candidate) || !opaque[candidate]) continue;
        visited.add(candidate);
        queue.push(candidate);
      }
    }

    components.push(component);
  });

  return components.sort((left, right) => {
    const leftBounds = boundsForPixels(left, raster.width);
    const rightBounds = boundsForPixels(right, raster.width);
    return leftBounds.minY - rightBounds.minY;
  });
}

async function orangeCenterBounds(source: string) {
  const raster = await nativeRaster(source);
  const pixels = Array.from(
    { length: raster.width * raster.height },
    (_, index) => index,
  ).filter((index) =>
    ORANGE_CENTER.every(
      (channel, offset) => raster.data[index * raster.channels + offset] === channel,
    ),
  );
  return pixels.length > 0 ? boundsForPixels(pixels, raster.width) : null;
}

function pinBounds(raster: NativeRaster) {
  return boundsForPixels(opaqueComponents(raster)[0], raster.width);
}

function storefrontBounds(raster: NativeRaster) {
  const storefront = opaqueComponents(raster)[1];
  if (!storefront) throw new Error("Navi storefront is not a separate opaque component");
  return boundsForPixels(storefront, raster.width);
}

function verticalGap(upper: Bounds, lower: Bounds) {
  return lower.minY - upper.maxY - 1;
}

function pinTailX(raster: NativeRaster) {
  const component = opaqueComponents(raster)[0];
  const maxY = Math.max(...component.map((index) => Math.floor(index / raster.width)));
  const tailXs = component
    .filter((index) => Math.floor(index / raster.width) === maxY)
    .map((index) => index % raster.width);
  return (Math.min(...tailXs) + Math.max(...tailXs)) / 2;
}

describe("Myles 98 Navi pin-to-store refinement", () => {
  it("keeps 16px as one location marker with a filled orange center and no store", async () => {
    const source = sourceFor("navi", 16);
    const navi16 = await nativeRaster(source);
    const components = opaqueComponents(navi16);
    const marker = pinBounds(navi16);
    const bottomRowWidth = components[0].filter(
      (index) => Math.floor(index / navi16.width) === marker.maxY,
    ).length;

    expect(await orangeCenterBounds(source)).toEqual({
      minX: expect.any(Number),
      minY: expect.any(Number),
      maxX: expect.any(Number),
      maxY: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
    });
    expect(components).toHaveLength(1);
    expect(marker.height).toBeGreaterThan(marker.width);
    expect(bottomRowWidth).toBeLessThanOrEqual(2);
  });

  it("restores the filled orange center to the 24px pin", async () => {
    const source = sourceFor("navi", 24);

    expect(await orangeCenterBounds(source)).toEqual({
      minX: expect.any(Number),
      minY: expect.any(Number),
      maxX: expect.any(Number),
      maxY: expect.any(Number),
      width: expect.any(Number),
      height: expect.any(Number),
    });
  });

  it("places the 24px pin one transparent row above a broad storefront", async () => {
    const navi24 = await nativeRaster(sourceFor("navi", 24));
    const storefront = storefrontBounds(navi24);

    expect(opaqueComponents(navi24)).toHaveLength(2);
    expect(verticalGap(pinBounds(navi24), storefront)).toBe(1);
    expect(storefront.width).toBeGreaterThanOrEqual(14);
    expect(pinTailX(navi24)).toBeGreaterThanOrEqual(storefront.minX);
    expect(pinTailX(navi24)).toBeLessThanOrEqual(storefront.maxX);
  });

  it("keeps the 32px pin separate from a storefront at least 22 pixels wide", async () => {
    const source = sourceFor("navi", 32);
    const navi32 = await nativeRaster(source);

    expect(await orangeCenterBounds(source)).not.toBeNull();
    expect(opaqueComponents(navi32)).toHaveLength(2);
    expect(verticalGap(pinBounds(navi32), storefrontBounds(navi32))).toBeGreaterThanOrEqual(1);
    expect(storefrontBounds(navi32).width).toBeGreaterThanOrEqual(22);
  });
});
