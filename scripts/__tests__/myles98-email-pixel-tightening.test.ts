import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const OFF_WHITE: Rgba = [0xff, 0xfa, 0xf0, 0xff];
const POSTAL_OUTLINE: Rgba = [0x75, 0x6c, 0x62, 0xff];

const blankFlapWindows = new Map<number, { x: number; y: number; width: number; height: number }>([
  [24, { x: 14, y: 9, width: 3, height: 3 }],
  [32, { x: 20, y: 11, width: 3, height: 3 }],
]);

type Rgba = readonly [number, number, number, number];
type NativeRaster = {
  data: Buffer;
  width: number;
  height: number;
  channels: number;
};

function sourceFor(grid: number) {
  return readFileSync(expectedMasterPath(ROOT, "email", grid), "utf8");
}

function publicSourceFor(grid: number) {
  return readFileSync(`public/myles98-icons/email/email-${grid}.svg`, "utf8");
}

async function nativeRaster(source: string, grid: number): Promise<NativeRaster> {
  const { data, info } = await sharp(
    Buffer.from(source.replace("<svg ", `<svg width="${grid}" height="${grid}" `)),
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

function equalRgba(left: Rgba, right: Rgba) {
  return left.every((channel, index) => channel === right[index]);
}

function isYellowOrBrownStampInk([red, green, blue, alpha]: Rgba) {
  return alpha === 0xff && red >= 90 && red - blue >= 70 && green - blue >= 35;
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

  const outside = new Set<number>();
  for (let x = 0; x < raster.width; x += 1) {
    for (const y of [0, raster.height - 1]) {
      const index = y * raster.width + x;
      if (!opaque[index] && !outside.has(index)) flood(index, false, outside);
    }
  }
  for (let y = 0; y < raster.height; y += 1) {
    for (const x of [0, raster.width - 1]) {
      const index = y * raster.width + x;
      if (!opaque[index] && !outside.has(index)) flood(index, false, outside);
    }
  }

  const visitedOpaque = new Set<number>();
  let components = 0;
  opaque.forEach((filled, index) => {
    if (!filled || visitedOpaque.has(index)) return;
    components += 1;
    flood(index, true, visitedOpaque);
  });

  return {
    components,
    enclosedTransparency: opaque.flatMap((filled, index) =>
      !filled && !outside.has(index) ? [`${index % raster.width},${Math.floor(index / raster.width)}`] : [],
    ),
  };
}

describe("Myles 98 Email pixel tightening", () => {
  it("keeps the 16px side folds mirrored at their native one-pixel positions", async () => {
    const email16 = await nativeRaster(sourceFor(16), 16);

    for (let y = 6; y <= 11; y += 1) {
      expect(rgbaAt(email16, 2, y), `left fold at 2,${y}`).toEqual(rgbaAt(email16, 13, y));
    }
    for (let y = 9; y <= 11; y += 1) {
      for (let x = 3; x <= 7; x += 1) {
        expect(rgbaAt(email16, x, y), `lower left fold at ${x},${y}`).toEqual(
          rgbaAt(email16, 15 - x, y),
        );
      }
    }
  });

  it.each([24, 32])("leaves the %ipx flap free of yellow-brown stamp ink and a postal outline", async (grid) => {
    const raster = await nativeRaster(sourceFor(grid), grid);
    const stampInk: string[] = [];
    const postalOutline: string[] = [];

    for (let y = 0; y < raster.height; y += 1) {
      for (let x = 0; x < raster.width; x += 1) {
        const pixel = rgbaAt(raster, x, y);
        if (isYellowOrBrownStampInk(pixel)) stampInk.push(`${x},${y}`);
        if (equalRgba(pixel, POSTAL_OUTLINE)) postalOutline.push(`${x},${y}`);
      }
    }

    expect(stampInk).toEqual([]);
    expect(postalOutline).toEqual([]);
  });

  it.each([24, 32])("keeps the %ipx upper-right flap an uninterrupted paper surface", async (grid) => {
    const raster = await nativeRaster(sourceFor(grid), grid);
    const window = blankFlapWindows.get(grid)!;

    for (let y = window.y; y < window.y + window.height; y += 1) {
      for (let x = window.x; x < window.x + window.width; x += 1) {
        expect(rgbaAt(raster, x, y), `blank flap at ${x},${y}`).toEqual(OFF_WHITE);
      }
    }
  });

  it.each(GRIDS)("renders the %ipx envelope as one filled object with a transparent perimeter", async (grid) => {
    const raster = await nativeRaster(sourceFor(grid), grid);
    const perimeter = [
      ...Array.from({ length: grid }, (_, x) => rgbaAt(raster, x, 0)[3]),
      ...Array.from({ length: grid }, (_, x) => rgbaAt(raster, x, grid - 1)[3]),
      ...Array.from({ length: grid }, (_, y) => rgbaAt(raster, 0, y)[3]),
      ...Array.from({ length: grid }, (_, y) => rgbaAt(raster, grid - 1, y)[3]),
    ];

    expect(perimeter.every((alpha) => alpha === 0)).toBe(true);
    expect(opaqueTopology(raster)).toEqual({ components: 1, enclosedTransparency: [] });
  });

  it.each(GRIDS)("keeps the public %ipx mirror visually identical to its authored master", async (grid) => {
    const master = await nativeRaster(sourceFor(grid), grid);
    const mirror = await nativeRaster(publicSourceFor(grid), grid);

    expect(mirror).toEqual(master);
  });
});
