import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const ORANGE_CENTER = [0xf2, 0xa2, 0x45, 0xff] as const;
const ORANGE_FILL = "#f2a245";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; height: number; width: number; x: number; y: number };

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

const PIN_CUES = new Map<Grid, Rect>([
  [16, { fill: ORANGE_FILL, x: 7, y: 5, width: 2, height: 2 }],
  [24, { fill: ORANGE_FILL, x: 10, y: 5, width: 3, height: 3 }],
  [32, { fill: ORANGE_FILL, x: 14, y: 7, width: 4, height: 4 }],
]);

const STOREFRONTS = new Map<Exclude<Grid, 16>, {
  awning: string;
  door: Rect;
  facade: Rect;
  roof: Rect;
  stripes: Rect[];
  window: Rect;
}>([
  [24, {
    awning: "M4 18H20V20H19V21H17V20H15V21H13V20H11V21H9V20H7V21H5V20H4Z",
    roof: { fill: "#5a301f", x: 3, y: 17, width: 18, height: 1 },
    facade: { fill: "#f3d8ae", x: 5, y: 20, width: 14, height: 3 },
    window: { fill: "#4d839a", x: 6, y: 21, width: 5, height: 2 },
    door: { fill: "#603722", x: 14, y: 20, width: 3, height: 3 },
    stripes: [
      { fill: "#f8b05d", x: 5, y: 18, width: 3, height: 2 },
      { fill: "#f8b05d", x: 11, y: 18, width: 3, height: 2 },
      { fill: "#f8b05d", x: 17, y: 18, width: 2, height: 2 },
    ],
  }],
  [32, {
    awning: "M4 24H28V27H26V28H23V27H20V28H17V27H14V28H11V27H8V28H5V27H4Z",
    roof: { fill: "#5a301f", x: 3, y: 22, width: 26, height: 2 },
    facade: { fill: "#f3d8ae", x: 5, y: 27, width: 22, height: 4 },
    window: { fill: "#4c839b", x: 7, y: 28, width: 7, height: 3 },
    door: { fill: "#603722", x: 20, y: 27, width: 5, height: 4 },
    stripes: [
      { fill: "#f8b05d", x: 6, y: 24, width: 4, height: 3 },
      { fill: "#f8b05d", x: 13, y: 24, width: 4, height: 3 },
      { fill: "#f8b05d", x: 21, y: 24, width: 4, height: 3 },
    ],
  }],
]);

function sourceFor(concept: string, grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function attribute(source: string, name: string) {
  return source.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1] ?? "";
}

function rectsFor(source: string, fill: string) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .map(([, attributes]) => ({
      fill: attribute(attributes, "fill").toLowerCase(),
      height: Number(attribute(attributes, "height")),
      width: Number(attribute(attributes, "width")),
      x: Number(attribute(attributes, "x")),
      y: Number(attribute(attributes, "y")),
    }))
    .filter((rect): rect is Rect => rect.fill === fill);
}

function sameRect(actual: Rect, expected: Rect) {
  return actual.fill === expected.fill &&
    actual.x === expected.x &&
    actual.y === expected.y &&
    actual.width === expected.width &&
    actual.height === expected.height;
}

function markerPathCount(source: string) {
  const markerSource = source.split(/<(?:path|rect) fill="#5a301f"/i)[0]!;
  return (markerSource.match(/<path\b/gi) ?? []).length;
}

function hasLiteralMapPinSource(source: string, grid: Grid) {
  const cue = PIN_CUES.get(grid)!;
  const compactCue = rectsFor(source, ORANGE_FILL).some((rect) => sameRect(rect, cue));

  return markerPathCount(source) === 2 &&
    compactCue &&
    !/<(?:circle|ellipse)\b|(?:globe|latitude|longitude|ticket|guidebook|book|card)/i.test(source) &&
    !/#(?:96c4cf|98c8d3)/i.test(source);
}

function hasStorefrontAnatomy(source: string, grid: Exclude<Grid, 16>) {
  const storefront = STOREFRONTS.get(grid)!;
  const stripeRects = rectsFor(source, "#f8b05d");

  return source.includes(`<path fill="#e56d2b" d="${storefront.awning}" />`) &&
    rectsFor(source, storefront.roof.fill).some((rect) => sameRect(rect, storefront.roof)) &&
    rectsFor(source, storefront.facade.fill).some((rect) => sameRect(rect, storefront.facade)) &&
    rectsFor(source, storefront.window.fill).some((rect) => sameRect(rect, storefront.window)) &&
    rectsFor(source, storefront.door.fill).some((rect) => sameRect(rect, storefront.door)) &&
    storefront.stripes.every((stripe) => stripeRects.some((rect) => sameRect(rect, stripe)));
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

function containsBounds(outer: Bounds, inner: Bounds | null) {
  return inner !== null
    && inner.minX >= outer.minX
    && inner.maxX <= outer.maxX
    && inner.minY >= outer.minY
    && inner.maxY <= outer.maxY;
}

function pinTailX(raster: NativeRaster) {
  const component = opaqueComponents(raster)[0];
  const maxY = Math.max(...component.map((index) => Math.floor(index / raster.width)));
  const tailXs = component
    .filter((index) => Math.floor(index / raster.width) === maxY)
    .map((index) => index % raster.width);
  return (Math.min(...tailXs) + Math.max(...tailXs)) / 2;
}

function pointedTail(raster: NativeRaster) {
  const component = opaqueComponents(raster)[0];
  const bounds = boundsForPixels(component, raster.width);
  const widthAt = (y: number) => component.filter((index) => Math.floor(index / raster.width) === y).length;
  const tailWidth = widthAt(bounds.maxY);
  const shoulderWidth = widthAt(bounds.maxY - 1);

  return tailWidth <= 2 && shoulderWidth > tailWidth;
}

describe("Myles 98 Navi pin-to-store refinement", () => {
  it.each(GRIDS)("uses a compact orange cue in a literal two-plane map pin at %ipx", async (grid) => {
    const source = sourceFor("navi", grid);
    const raster = await nativeRaster(source);
    const marker = pinBounds(raster);

    expect(hasLiteralMapPinSource(source, grid)).toBe(true);
    expect(containsBounds(marker, await orangeCenterBounds(source))).toBe(true);
    expect(marker.height).toBeGreaterThan(marker.width);
    expect(pointedTail(raster)).toBe(true);
  });

  it("keeps 16px pin-only rather than introducing a confusing miniature storefront", async () => {
    const navi16 = await nativeRaster(sourceFor("navi", 16));

    expect(opaqueComponents(navi16)).toHaveLength(1);
  });

  it("places the 24px pin above an awning, facade, window, and doorway storefront", async () => {
    const source = sourceFor("navi", 24);
    const navi24 = await nativeRaster(source);
    const storefront = storefrontBounds(navi24);

    expect(hasStorefrontAnatomy(source, 24)).toBe(true);
    expect(opaqueComponents(navi24)).toHaveLength(2);
    expect(verticalGap(pinBounds(navi24), storefront)).toBeGreaterThanOrEqual(1);
    expect(storefront.width).toBeGreaterThanOrEqual(14);
    expect(pinTailX(navi24)).toBeGreaterThanOrEqual(storefront.minX);
    expect(pinTailX(navi24)).toBeLessThanOrEqual(storefront.maxX);
  });

  it("keeps the 32px marker above a widened storefront with distinct awning anatomy", async () => {
    const source = sourceFor("navi", 32);
    const navi32 = await nativeRaster(source);

    expect(hasStorefrontAnatomy(source, 32)).toBe(true);
    expect(opaqueComponents(navi32)).toHaveLength(2);
    expect(verticalGap(pinBounds(navi32), storefrontBounds(navi32))).toBeGreaterThanOrEqual(1);
    expect(storefrontBounds(navi32).width).toBeGreaterThanOrEqual(22);
  });

  it("rejects a latitude-band globe mutation in place of the compact pin cue", () => {
    const source = sourceFor("navi", 24);
    const globeLikeMarker = source.replace(
      '<rect fill="#f2a245" x="10" y="5" width="3" height="3" />',
      '<path fill="#96c4cf" d="M7 7H17V8H7Z" />\n  <rect fill="#f2a245" x="10" y="5" width="3" height="3" />',
    );

    expect(hasLiteralMapPinSource(source, 24)).toBe(true);
    expect(hasLiteralMapPinSource(globeLikeMarker, 24)).toBe(false);
  });

  it("rejects a ticket-like flat awning mutation in place of the storefront", () => {
    const source = sourceFor("navi", 24);
    const storefront = STOREFRONTS.get(24)!;
    const ticketLikeStore = source
      .replace(
        `<path fill="#e56d2b" d="${storefront.awning}" />`,
        '<rect fill="#e56d2b" x="4" y="18" width="16" height="3" />',
      )
      .replaceAll("#f8b05d", "#e56d2b");

    expect(hasStorefrontAnatomy(source, 24)).toBe(true);
    expect(hasStorefrontAnatomy(ticketLikeStore, 24)).toBe(false);
  });
});
