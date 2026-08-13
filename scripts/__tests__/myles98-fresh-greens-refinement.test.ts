import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const BEZEL = "#27312b";
const HOUSING = "#627353";
const SCREEN = "#d8dfc3";
const WATER = "#5f99ae";
const ROUTE = "#4d5552";
const DESTINATION = "#f27524";
const CONTROL = "#205a40";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; height: number; width: number; x: number; y: number };

const GPS = new Map<Grid, { bezel: Rect; control: Rect; housing: Rect; screen: Rect }>([
  [16, {
    bezel: { fill: BEZEL, x: 2, y: 3, width: 12, height: 10 },
    housing: { fill: HOUSING, x: 3, y: 4, width: 10, height: 8 },
    screen: { fill: SCREEN, x: 5, y: 6, width: 6, height: 3 },
    control: { fill: CONTROL, x: 7, y: 10, width: 2, height: 1 },
  }],
  [24, {
    bezel: { fill: BEZEL, x: 3, y: 4, width: 19, height: 16 },
    housing: { fill: HOUSING, x: 4, y: 5, width: 17, height: 14 },
    screen: { fill: SCREEN, x: 6, y: 7, width: 11, height: 7 },
    control: { fill: CONTROL, x: 10, y: 16, width: 4, height: 1 },
  }],
  [32, {
    bezel: { fill: BEZEL, x: 4, y: 5, width: 24, height: 21 },
    housing: { fill: HOUSING, x: 5, y: 6, width: 22, height: 18 },
    screen: { fill: SCREEN, x: 8, y: 9, width: 15, height: 10 },
    control: { fill: CONTROL, x: 13, y: 21, width: 5, height: 2 },
  }],
]);

const ALLOWED_FILLS = new Set([
  BEZEL,
  "#3b4a41",
  HOUSING,
  "#aebc9a",
  "#1d2923",
  SCREEN,
  WATER,
  "#c4ceac",
  "#78a85d",
  ROUTE,
  DESTINATION,
  CONTROL,
  "#c5963a",
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

function isNavigator(source: string, grid: Grid) {
  const spec = GPS.get(grid)!;
  const rects = rectsFor(source);
  return [spec.bezel, spec.housing, spec.screen, spec.control].every((rect) => hasRect(rects, rect))
    && rects.some((rect) => rect.fill === WATER)
    && rects.some((rect) => rect.fill === ROUTE)
    && rects.some((rect) => rect.fill === DESTINATION)
    && spec.screen.x > spec.housing.x
    && spec.screen.y > spec.housing.y
    && spec.control.y > spec.screen.y + spec.screen.height;
}

function withoutRect(source: string, rect: Rect) {
  return source.replace(
    `<rect fill="${rect.fill}" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" />`,
    "",
  );
}

async function nativePixels(source: string, grid: Grid) {
  const { data, info } = await sharp(Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function hasColor(data: Buffer, channels: number, grid: Grid, color: string) {
  const value = Number.parseInt(color.slice(1), 16);
  return Array.from({ length: grid * grid }, (_, index) => index).some((index) => {
    const offset = index * channels;
    return data[offset] === (value >> 16)
      && data[offset + 1] === ((value >> 8) & 0xff)
      && data[offset + 2] === (value & 0xff)
      && data[offset + 3] === 0xff;
  });
}

describe("Myles 98 Fresh Greens rendered GPS refinement", () => {
  it.each(GRIDS)("uses an object-rendered GPS navigator rather than a flat circuit at %ipx", (grid) => {
    const source = sourceFor(grid);
    const fills = rectsFor(source).map((rect) => rect.fill);

    expect(isNavigator(source, grid)).toBe(true);
    expect(fills.every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    expect(source).not.toMatch(/<(?:path|polygon|polyline|circle|ellipse|line|text|use)\b|\b(?:filter|stroke|transform|opacity)=/i);
    expect(source).not.toContain("#ffffff");
  });

  it.each(GRIDS)("renders map information inside the GPS screen at native size for %ipx", async (grid) => {
    const { data, info } = await nativePixels(sourceFor(grid), grid);

    expect(hasColor(data, info.channels, grid, WATER)).toBe(true);
    expect(hasColor(data, info.channels, grid, ROUTE)).toBe(true);
    expect(hasColor(data, info.channels, grid, DESTINATION)).toBe(true);
    expect(hasColor(data, info.channels, grid, CONTROL)).toBe(true);
  });

  it.each(GRIDS)("rejects a %ipx device without its map screen or physical lower control", (grid) => {
    const source = sourceFor(grid);
    const { screen, control } = GPS.get(grid)!;

    expect(isNavigator(source, grid)).toBe(true);
    expect(isNavigator(withoutRect(source, screen), grid)).toBe(false);
    expect(isNavigator(withoutRect(source, control), grid)).toBe(false);
  });
});
