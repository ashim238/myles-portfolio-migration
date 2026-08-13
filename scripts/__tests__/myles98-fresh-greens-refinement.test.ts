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
  antennaCap: Rect;
  antennaStem: Rect;
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
  upperButtonWell: Rect;
  upperButton: Rect;
  lowerButtonWell: Rect;
  lowerButton: Rect;
};

const GPS = new Map<Grid, NavigatorSpec>([
  [16, {
    antennaCap: { fill: BEZEL, x: 6, y: 1, width: 4, height: 2 },
    antennaStem: { fill: DEPTH, x: 7, y: 2, width: 2, height: 1 },
    body: { fill: BEZEL, x: 3, y: 3, width: 10, height: 12 },
    depthBottom: { fill: DEPTH, x: 4, y: 14, width: 8, height: 1 },
    depthRight: { fill: DEPTH, x: 12, y: 4, width: 1, height: 10 },
    housing: { fill: HOUSING, x: 4, y: 4, width: 8, height: 10 },
    topLight: { fill: HIGHLIGHT, x: 4, y: 4, width: 7, height: 1 },
    leftLight: { fill: HIGHLIGHT, x: 4, y: 4, width: 1, height: 9 },
    screenBezel: { fill: SCREEN_BEZEL, x: 5, y: 5, width: 6, height: 4 },
    screen: { fill: SCREEN, x: 6, y: 6, width: 4, height: 2 },
    water: { fill: WATER, x: 6, y: 6, width: 2, height: 1 },
    route: [
      { fill: ROUTE, x: 7, y: 6, width: 1, height: 2 },
      { fill: ROUTE, x: 7, y: 7, width: 2, height: 1 },
    ],
    destination: { fill: DESTINATION, x: 8, y: 7, width: 1, height: 1 },
    controlWell: { fill: SCREEN_BEZEL, x: 5, y: 10, width: 3, height: 3 },
    dPadVertical: { fill: CONTROL, x: 6, y: 10, width: 1, height: 3 },
    dPadHorizontal: { fill: CONTROL, x: 5, y: 11, width: 3, height: 1 },
    dPadCenter: { fill: CONTROL_CENTER, x: 6, y: 11, width: 1, height: 1 },
    upperButtonWell: { fill: SCREEN_BEZEL, x: 9, y: 10, width: 2, height: 1 },
    upperButton: { fill: CONTROL_CENTER, x: 9, y: 10, width: 1, height: 1 },
    lowerButtonWell: { fill: SCREEN_BEZEL, x: 9, y: 12, width: 2, height: 1 },
    lowerButton: { fill: CONTROL_CENTER, x: 9, y: 12, width: 1, height: 1 },
  }],
  [24, {
    antennaCap: { fill: BEZEL, x: 9, y: 1, width: 6, height: 2 },
    antennaStem: { fill: DEPTH, x: 11, y: 3, width: 2, height: 1 },
    body: { fill: BEZEL, x: 5, y: 4, width: 14, height: 18 },
    depthBottom: { fill: DEPTH, x: 6, y: 21, width: 12, height: 1 },
    depthRight: { fill: DEPTH, x: 18, y: 5, width: 1, height: 16 },
    housing: { fill: HOUSING, x: 6, y: 5, width: 12, height: 16 },
    topLight: { fill: HIGHLIGHT, x: 6, y: 5, width: 11, height: 1 },
    leftLight: { fill: HIGHLIGHT, x: 6, y: 5, width: 1, height: 15 },
    screenBezel: { fill: SCREEN_BEZEL, x: 7, y: 7, width: 10, height: 6 },
    screen: { fill: SCREEN, x: 8, y: 8, width: 8, height: 4 },
    water: { fill: WATER, x: 8, y: 8, width: 3, height: 2 },
    route: [
      { fill: ROUTE, x: 10, y: 9, width: 1, height: 3 },
      { fill: ROUTE, x: 10, y: 11, width: 4, height: 1 },
    ],
    destination: { fill: DESTINATION, x: 13, y: 10, width: 2, height: 2 },
    controlWell: { fill: SCREEN_BEZEL, x: 8, y: 14, width: 5, height: 5 },
    dPadVertical: { fill: CONTROL, x: 10, y: 15, width: 1, height: 3 },
    dPadHorizontal: { fill: CONTROL, x: 9, y: 16, width: 3, height: 1 },
    dPadCenter: { fill: CONTROL_CENTER, x: 10, y: 16, width: 1, height: 1 },
    upperButtonWell: { fill: SCREEN_BEZEL, x: 14, y: 15, width: 2, height: 2 },
    upperButton: { fill: CONTROL_CENTER, x: 14, y: 15, width: 1, height: 1 },
    lowerButtonWell: { fill: SCREEN_BEZEL, x: 14, y: 18, width: 2, height: 1 },
    lowerButton: { fill: CONTROL_CENTER, x: 14, y: 18, width: 1, height: 1 },
  }],
  [32, {
    antennaCap: { fill: BEZEL, x: 13, y: 1, width: 6, height: 3 },
    antennaStem: { fill: DEPTH, x: 14, y: 3, width: 4, height: 2 },
    body: { fill: BEZEL, x: 7, y: 5, width: 18, height: 23 },
    depthBottom: { fill: DEPTH, x: 8, y: 27, width: 16, height: 1 },
    depthRight: { fill: DEPTH, x: 24, y: 6, width: 1, height: 21 },
    housing: { fill: HOUSING, x: 8, y: 6, width: 16, height: 21 },
    topLight: { fill: HIGHLIGHT, x: 8, y: 6, width: 15, height: 1 },
    leftLight: { fill: HIGHLIGHT, x: 8, y: 6, width: 1, height: 20 },
    screenBezel: { fill: SCREEN_BEZEL, x: 9, y: 8, width: 14, height: 8 },
    screen: { fill: SCREEN, x: 10, y: 9, width: 12, height: 6 },
    water: { fill: WATER, x: 10, y: 9, width: 5, height: 3 },
    route: [
      { fill: ROUTE, x: 14, y: 10, width: 2, height: 4 },
      { fill: ROUTE, x: 14, y: 12, width: 5, height: 2 },
    ],
    destination: { fill: DESTINATION, x: 18, y: 11, width: 3, height: 3 },
    controlWell: { fill: SCREEN_BEZEL, x: 10, y: 18, width: 6, height: 7 },
    dPadVertical: { fill: CONTROL, x: 12, y: 19, width: 2, height: 5 },
    dPadHorizontal: { fill: CONTROL, x: 11, y: 20, width: 4, height: 2 },
    dPadCenter: { fill: CONTROL_CENTER, x: 12, y: 20, width: 2, height: 2 },
    upperButtonWell: { fill: SCREEN_BEZEL, x: 18, y: 19, width: 3, height: 3 },
    upperButton: { fill: CONTROL_CENTER, x: 19, y: 20, width: 1, height: 1 },
    lowerButtonWell: { fill: SCREEN_BEZEL, x: 18, y: 23, width: 3, height: 2 },
    lowerButton: { fill: CONTROL_CENTER, x: 19, y: 23, width: 1, height: 1 },
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
    spec.antennaCap,
    spec.antennaStem,
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
    spec.upperButtonWell,
    spec.upperButton,
    spec.lowerButtonWell,
    spec.lowerButton,
    spec.water,
    ...spec.route,
    spec.destination,
    spec.controlWell,
  ];

  return structuralParts.every((rect) => hasRect(rects, rect))
    && spec.body.height / spec.body.width >= 1.2
    && spec.antennaCap.x >= spec.body.x
    && spec.antennaCap.x + spec.antennaCap.width <= spec.body.x + spec.body.width
    && spec.antennaStem.x >= spec.body.x
    && spec.antennaStem.y + spec.antennaStem.height === spec.body.y
    && isInside(spec.screen, spec.screenBezel)
    && isInside(spec.screenBezel, spec.housing)
    && [spec.water, ...spec.route, spec.destination].every((rect) => isInside(rect, spec.screen))
    && isInside(spec.controlWell, spec.housing)
    && [spec.dPadVertical, spec.dPadHorizontal, spec.dPadCenter].every((rect) => isInside(rect, spec.controlWell))
    && spec.dPadHorizontal.y > spec.screen.y + spec.screen.height
    && spec.dPadVertical.y > spec.screen.y + spec.screen.height
    && spec.dPadVertical.x < spec.dPadHorizontal.x + spec.dPadHorizontal.width
    && spec.dPadHorizontal.y < spec.dPadVertical.y + spec.dPadVertical.height
    && [spec.upperButtonWell, spec.upperButton, spec.lowerButtonWell, spec.lowerButton]
      .every((rect) => isInside(rect, spec.housing))
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

describe("Myles 98 Fresh Greens physical handheld GPS navigator refinement", () => {
  it.each(GRIDS)("uses a tall handheld GPS receiver, not a generic screen, wallet, or television at %ipx", (grid) => {
    const source = sourceFor(grid);
    const fills = rectsFor(source).map((rect) => rect.fill);

    expect(isNavigator(source, grid)).toBe(true);
    expect(fills.every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    expect(source).not.toMatch(/<(?:path|polygon|polyline|circle|ellipse|line|text|use)\b|\b(?:filter|stroke|transform|opacity)=/i);
    expect(source).not.toContain("#ffffff");
  });

  it.each(GRIDS)("renders the antenna, recessed map, below-screen D-pad, and tactile buttons at native %ipx", async (grid) => {
    const { data, info } = await nativePixels(sourceFor(grid), grid);
    const spec = GPS.get(grid)!;

    expect(hasColorWithin(data, info.channels, grid, WATER, spec.screen)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, ROUTE, spec.screen)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, DESTINATION, spec.screen)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, CONTROL, spec.body)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, CONTROL_CENTER, spec.upperButtonWell)).toBe(true);
    expect(hasColorWithin(data, info.channels, grid, CONTROL_CENTER, spec.lowerButtonWell)).toBe(true);
    expect(hasTransparentPerimeter(data, info.channels, grid)).toBe(true);
    expect(Array.from({ length: grid * grid }, (_, index) => data[index * info.channels + 3])
      .every((alpha) => alpha === 0 || alpha === 0xff)).toBe(true);
  });

  it.each(GRIDS)("rejects the %ipx navigator when hardware-navigation anatomy is removed", (grid) => {
    const source = sourceFor(grid);
    const spec = GPS.get(grid)!;

    expect(isNavigator(source, grid)).toBe(true);
    expect(isNavigator(withoutRects(source, [spec.antennaCap, spec.antennaStem]), grid)).toBe(false);
    expect(isNavigator(withoutRects(source, [
      spec.dPadVertical,
      spec.dPadHorizontal,
      spec.dPadCenter,
      spec.upperButtonWell,
      spec.upperButton,
      spec.lowerButtonWell,
      spec.lowerButton,
    ]), grid)).toBe(false);
  });

  it.each(GRIDS)("rejects a %ipx device without its recessed map screen", (grid) => {
    const source = sourceFor(grid);
    const { screen, screenBezel } = GPS.get(grid)!;

    expect(isNavigator(withoutRects(source, [screen, screenBezel]), grid)).toBe(false);
  });
});
