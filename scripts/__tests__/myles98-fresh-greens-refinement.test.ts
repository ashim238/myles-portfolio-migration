import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const BEZEL = "#27312b";
const DEPTH = "#3b4a41";
const HOUSING = "#627353";
const HIGHLIGHT = "#aebc9a";
const SCREEN_BEZEL = "#1d2923";
const SCREEN = "#d8dfc3";
const WATER = "#5f99ae";
const ROUTE = "#4d5552";
const DESTINATION = "#f27524";
const CONTROL = "#205a40";
const CONTROL_CENTER = "#c5963a";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; height: number; width: number; x: number; y: number };
type NavigatorSpec = {
  body: Rect;
  depthBottom: Rect;
  depthRight: Rect;
  housing: Rect;
  topLight: Rect;
  leftLight: Rect;
  screenBezel: Rect;
  screen: Rect;
  water: Rect;
  route: Rect[];
  destination: Rect;
  controlWell: Rect;
  dPadVertical: Rect;
  dPadHorizontal: Rect;
  dPadCenter: Rect;
};

const GPS = new Map<Grid, NavigatorSpec>([
  [16, {
    body: { fill: BEZEL, x: 1, y: 3, width: 14, height: 10 },
    depthBottom: { fill: DEPTH, x: 2, y: 12, width: 12, height: 1 },
    depthRight: { fill: DEPTH, x: 14, y: 4, width: 1, height: 8 },
    housing: { fill: HOUSING, x: 2, y: 4, width: 12, height: 8 },
    topLight: { fill: HIGHLIGHT, x: 2, y: 4, width: 11, height: 1 },
    leftLight: { fill: HIGHLIGHT, x: 2, y: 4, width: 1, height: 7 },
    screenBezel: { fill: SCREEN_BEZEL, x: 3, y: 5, width: 7, height: 5 },
    screen: { fill: SCREEN, x: 4, y: 6, width: 5, height: 3 },
    water: { fill: WATER, x: 4, y: 6, width: 2, height: 1 },
    route: [
      { fill: ROUTE, x: 5, y: 6, width: 1, height: 2 },
      { fill: ROUTE, x: 5, y: 7, width: 3, height: 1 },
    ],
    destination: { fill: DESTINATION, x: 7, y: 7, width: 1, height: 1 },
    controlWell: { fill: SCREEN_BEZEL, x: 10, y: 5, width: 3, height: 3 },
    dPadVertical: { fill: CONTROL, x: 11, y: 5, width: 1, height: 3 },
    dPadHorizontal: { fill: CONTROL, x: 10, y: 6, width: 3, height: 1 },
    dPadCenter: { fill: CONTROL_CENTER, x: 11, y: 6, width: 1, height: 1 },
  }],
  [24, {
    body: { fill: BEZEL, x: 1, y: 5, width: 22, height: 14 },
    depthBottom: { fill: DEPTH, x: 2, y: 18, width: 20, height: 1 },
    depthRight: { fill: DEPTH, x: 22, y: 6, width: 1, height: 12 },
    housing: { fill: HOUSING, x: 2, y: 6, width: 20, height: 12 },
    topLight: { fill: HIGHLIGHT, x: 2, y: 6, width: 19, height: 1 },
    leftLight: { fill: HIGHLIGHT, x: 2, y: 6, width: 1, height: 11 },
    screenBezel: { fill: SCREEN_BEZEL, x: 4, y: 8, width: 11, height: 7 },
    screen: { fill: SCREEN, x: 5, y: 9, width: 9, height: 5 },
    water: { fill: WATER, x: 5, y: 9, width: 3, height: 2 },
    route: [
      { fill: ROUTE, x: 7, y: 10, width: 1, height: 3 },
      { fill: ROUTE, x: 7, y: 12, width: 5, height: 1 },
    ],
    destination: { fill: DESTINATION, x: 11, y: 11, width: 2, height: 2 },
    controlWell: { fill: SCREEN_BEZEL, x: 16, y: 8, width: 6, height: 7 },
    dPadVertical: { fill: CONTROL, x: 18, y: 9, width: 2, height: 5 },
    dPadHorizontal: { fill: CONTROL, x: 17, y: 11, width: 4, height: 2 },
    dPadCenter: { fill: CONTROL_CENTER, x: 18, y: 11, width: 2, height: 2 },
  }],
  [32, {
    body: { fill: BEZEL, x: 2, y: 6, width: 28, height: 20 },
    depthBottom: { fill: DEPTH, x: 3, y: 25, width: 26, height: 1 },
    depthRight: { fill: DEPTH, x: 29, y: 7, width: 1, height: 18 },
    housing: { fill: HOUSING, x: 3, y: 7, width: 26, height: 18 },
    topLight: { fill: HIGHLIGHT, x: 3, y: 7, width: 25, height: 1 },
    leftLight: { fill: HIGHLIGHT, x: 3, y: 7, width: 1, height: 17 },
    screenBezel: { fill: SCREEN_BEZEL, x: 5, y: 9, width: 16, height: 12 },
    screen: { fill: SCREEN, x: 6, y: 10, width: 14, height: 10 },
    water: { fill: WATER, x: 6, y: 10, width: 6, height: 3 },
    route: [
      { fill: ROUTE, x: 10, y: 12, width: 2, height: 6 },
      { fill: ROUTE, x: 10, y: 16, width: 7, height: 2 },
    ],
    destination: { fill: DESTINATION, x: 16, y: 14, width: 3, height: 3 },
    controlWell: { fill: SCREEN_BEZEL, x: 21, y: 10, width: 8, height: 10 },
    dPadVertical: { fill: CONTROL, x: 24, y: 11, width: 3, height: 8 },
    dPadHorizontal: { fill: CONTROL, x: 22, y: 13, width: 7, height: 3 },
    dPadCenter: { fill: CONTROL_CENTER, x: 24, y: 13, width: 3, height: 3 },
  }],
]);

const ALLOWED_FILLS = new Set([
  BEZEL,
  DEPTH,
  HOUSING,
  HIGHLIGHT,
  SCREEN_BEZEL,
  SCREEN,
  WATER,
  "#c4ceac",
  "#78a85d",
  ROUTE,
  DESTINATION,
  CONTROL,
  CONTROL_CENTER,
]);

function sourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "fresh-greens", grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function rectsFor(source: string) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)].map(([, attributes]) => ({
    fill: attribute(attributes, "fill")?.toLowerCase() ?? "",
    x: Number(attribute(attributes, "x")),
    y: Number(attribute(attributes, "y")),
    width: Number(attribute(attributes, "width")),
    height: Number(attribute(attributes, "height")),
  }));
}

function hasRect(rects: Rect[], expected: Rect) {
  return rects.some((rect) => (
    rect.fill === expected.fill
    && rect.x === expected.x
    && rect.y === expected.y
    && rect.width === expected.width
    && rect.height === expected.height
  ));
}

function isInside(inner: Rect, outer: Rect) {
  return inner.x >= outer.x
    && inner.y >= outer.y
    && inner.x + inner.width <= outer.x + outer.width
    && inner.y + inner.height <= outer.y + outer.height;
}

function isNavigator(source: string, grid: Grid) {
  const spec = GPS.get(grid)!;
  const rects = rectsFor(source);
  const structuralParts = [
    spec.body,
    spec.depthBottom,
    spec.depthRight,
    spec.housing,
    spec.topLight,
    spec.leftLight,
    spec.screenBezel,
    spec.screen,
    spec.dPadVertical,
    spec.dPadHorizontal,
    spec.dPadCenter,
    spec.water,
    ...spec.route,
    spec.destination,
    spec.controlWell,
  ];

  return structuralParts.every((rect) => hasRect(rects, rect))
    && spec.body.width / spec.body.height >= 1.35
    && isInside(spec.screen, spec.screenBezel)
    && isInside(spec.screenBezel, spec.housing)
    && [spec.water, ...spec.route, spec.destination].every((rect) => isInside(rect, spec.screen))
    && isInside(spec.controlWell, spec.housing)
    && [spec.dPadVertical, spec.dPadHorizontal, spec.dPadCenter].every((rect) => isInside(rect, spec.controlWell))
    && spec.dPadHorizontal.x >= spec.screen.x + spec.screen.width
    && spec.dPadVertical.x >= spec.screen.x + spec.screen.width
    && spec.dPadVertical.x < spec.dPadHorizontal.x + spec.dPadHorizontal.width
    && spec.dPadHorizontal.y < spec.dPadVertical.y + spec.dPadVertical.height
    && !rects.some((rect) => rect.y >= spec.body.y + spec.body.height);
}

function withoutRects(source: string, toRemove: Rect[]) {
  return toRemove.reduce((next, rect) => next.replace(
    `<rect fill="${rect.fill}" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" />`,
    "",
  ), source);
}

async function nativePixels(source: string, grid: Grid) {
  const { data, info } = await sharp(Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function hasColorWithin(data: Buffer, channels: number, grid: Grid, color: string, bounds: Rect) {
  const value = Number.parseInt(color.slice(1), 16);
  return Array.from({ length: bounds.width * bounds.height }, (_, index) => index).some((index) => {
    const x = bounds.x + (index % bounds.width);
    const y = bounds.y + Math.floor(index / bounds.width);
    const offset = (y * grid + x) * channels;
    return data[offset] === (value >> 16)
      && data[offset + 1] === ((value >> 8) & 0xff)
      && data[offset + 2] === (value & 0xff)
      && data[offset + 3] === 0xff;
  });
}

function hasTransparentPerimeter(data: Buffer, channels: number, grid: Grid) {
  return Array.from({ length: grid * grid }, (_, index) => index).every((index) => {
    const x = index % grid;
    const y = Math.floor(index / grid);
    if (x !== 0 && y !== 0 && x !== grid - 1 && y !== grid - 1) return true;
    return data[index * channels + 3] === 0;
  });
}

describe("Myles 98 Fresh Greens physical GPS navigator refinement", () => {
  it.each(GRIDS)("uses a dimensional, landscape GPS navigator rather than a generic screen at %ipx", (grid) => {
    const source = sourceFor(grid);
    const fills = rectsFor(source).map((rect) => rect.fill);

    expect(isNavigator(source, grid)).toBe(true);
    expect(fills.every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    expect(source).not.toMatch(/<(?:path|polygon|polyline|circle|ellipse|line|text|use)\b|\b(?:filter|stroke|transform|opacity)=/i);
    expect(source).not.toContain("#ffffff");
  });

  it.each(GRIDS)("renders the recessed map route, destination marker, and side D-pad at native %ipx", async (grid) => {
    const { data, info } = await nativePixels(sourceFor(grid), grid);
    const spec = GPS.get(grid)!;

    expect(hasColorWithin(data, info.channels, grid, WATER, spec.screen)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, ROUTE, spec.screen)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, DESTINATION, spec.screen)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, CONTROL, spec.body)).toBe(true);
    expect(hasTransparentPerimeter(data, info.channels, grid)).toBe(true);
    expect(Array.from({ length: grid * grid }, (_, index) => data[index * info.channels + 3])
      .every((alpha) => alpha === 0 || alpha === 0xff)).toBe(true);
  });

  it.each(GRIDS)("rejects the %ipx navigator when hardware-navigation anatomy is removed", (grid) => {
    const source = sourceFor(grid);
    const spec = GPS.get(grid)!;

    expect(isNavigator(source, grid)).toBe(true);
    expect(isNavigator(withoutRects(source, [spec.dPadVertical, spec.dPadHorizontal, spec.dPadCenter]), grid)).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx device without its recessed map screen", (grid) => {
    const source = sourceFor(grid);
    const { screen, screenBezel } = GPS.get(grid)!;

    expect(isNavigator(withoutRects(source, [screen, screenBezel]), grid)).toBe(false);
  });
});
