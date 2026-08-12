import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const OUTLINE_FILL = "#20242a";
const FRONT_FILLS = ["#c58c45", "#d6a45c", "#c89149"];
const TOP_FILLS = ["#ffe8b0", "#f4d99a", "#f0ce85"];
const SIDE_FILLS = ["#805224", "#8e5d2a", "#71451f"];
const LEGACY_V5_FILLS = ["#667d91", "#5f8d73", "#bd7654", "#90a7b5", "#8eaf8d", "#d69c78"];

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; height: number; width: number; x: number; y: number };
type Cube = { depth: number; front: Rect; side: string; top: string };
type Pixel = { color: string; x: number; y: number };

const CUBES = new Map<Grid, Cube[]>([
  [16, [
    { front: { fill: "#c58c45", x: 6, y: 6, width: 3, height: 3 }, depth: 1, top: "#ffe8b0", side: "#805224" },
    { front: { fill: "#d6a45c", x: 2, y: 10, width: 3, height: 3 }, depth: 1, top: "#f4d99a", side: "#8e5d2a" },
    { front: { fill: "#c89149", x: 9, y: 10, width: 3, height: 3 }, depth: 1, top: "#f0ce85", side: "#71451f" },
  ]],
  [24, [
    { front: { fill: "#c58c45", x: 10, y: 8, width: 5, height: 5 }, depth: 2, top: "#ffe8b0", side: "#805224" },
    { front: { fill: "#d6a45c", x: 4, y: 15, width: 5, height: 5 }, depth: 2, top: "#f4d99a", side: "#8e5d2a" },
    { front: { fill: "#c89149", x: 15, y: 15, width: 5, height: 5 }, depth: 2, top: "#f0ce85", side: "#71451f" },
  ]],
  [32, [
    { front: { fill: "#c58c45", x: 13, y: 10, width: 7, height: 7 }, depth: 2, top: "#ffe8b0", side: "#805224" },
    { front: { fill: "#d6a45c", x: 6, y: 20, width: 7, height: 7 }, depth: 2, top: "#f4d99a", side: "#8e5d2a" },
    { front: { fill: "#c89149", x: 19, y: 20, width: 7, height: 7 }, depth: 2, top: "#f0ce85", side: "#71451f" },
  ]],
]);

const HIGHLIGHTS = new Map<Grid, Rect[]>([
  [16, []],
  [24, [
    { fill: "#fff6d3", x: 13, y: 7, width: 2, height: 1 },
    { fill: "#fff0c4", x: 7, y: 14, width: 2, height: 1 },
    { fill: "#fff0c4", x: 18, y: 14, width: 2, height: 1 },
  ]],
  [32, [
    { fill: "#fff6d3", x: 17, y: 9, width: 3, height: 1 },
    { fill: "#fff0c4", x: 10, y: 19, width: 3, height: 1 },
    { fill: "#fff0c4", x: 23, y: 19, width: 3, height: 1 },
  ]],
]);

function attribute(source: string, name: string) {
  return source.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1] ?? "";
}

function rectsFor(source: string, fills: string[]) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .map(([, attributes]) => ({
      fill: attribute(attributes, "fill").toLowerCase(),
      height: Number(attribute(attributes, "height")),
      width: Number(attribute(attributes, "width")),
      x: Number(attribute(attributes, "x")),
      y: Number(attribute(attributes, "y")),
    }))
    .filter((rect): rect is Rect => fills.includes(rect.fill));
}

function polygonsFor(source: string, fills: string[]) {
  return [...source.matchAll(/<polygon\b([^>]*)\/>/gi)]
    .map(([, attributes]) => ({ fill: attribute(attributes, "fill").toLowerCase(), points: attribute(attributes, "points") }))
    .filter((polygon) => fills.includes(polygon.fill));
}

function sameRect(actual: Rect, expected: Rect) {
  return actual.fill === expected.fill &&
    actual.x === expected.x &&
    actual.y === expected.y &&
    actual.width === expected.width &&
    actual.height === expected.height;
}

function pointsForCube({ front, depth }: Cube) {
  const { x, y, width, height } = front;
  return {
    outline: `${x - depth},${y} ${x},${y - depth} ${x + width},${y - depth} ${x + width + depth},${y} ${x + width + depth},${y + height} ${x + width},${y + height + depth} ${x},${y + height + depth} ${x - depth},${y + height}`,
    side: `${x + width},${y} ${x + width + depth},${y - depth} ${x + width + depth},${y + height - depth} ${x + width},${y + height}`,
    top: `${x},${y} ${x + depth},${y - depth} ${x + width},${y - depth} ${x + width},${y}`,
  };
}

function hasV6WoodenBlockAnatomy(source: string, grid: Grid) {
  const cubes = CUBES.get(grid)!;
  const fronts = rectsFor(source, FRONT_FILLS).sort((left, right) => left.y - right.y || left.x - right.x);
  const highlights = rectsFor(source, ["#fff6d3", "#fff0c4"]).sort((left, right) => left.y - right.y || left.x - right.x);
  const outlines = polygonsFor(source, [OUTLINE_FILL]);
  const tops = polygonsFor(source, TOP_FILLS);
  const sides = polygonsFor(source, SIDE_FILLS);
  const stack = fronts.length === 3 &&
    fronts[1]!.y === fronts[2]!.y &&
    fronts[0]!.y + fronts[0]!.height <= fronts[1]!.y &&
    fronts[0]!.x - cubes[0]!.depth <= fronts[1]!.x + fronts[1]!.width &&
    fronts[0]!.x + fronts[0]!.width + cubes[0]!.depth >= fronts[2]!.x;

  const cubeChecks = cubes.map((cube) => {
    const expected = pointsForCube(cube);
    return outlines.some((polygon) => polygon.points === expected.outline) &&
      tops.some((polygon) => polygon.fill === cube.top && polygon.points === expected.top) &&
      sides.some((polygon) => polygon.fill === cube.side && polygon.points === expected.side);
  });
  const checks = {
    cubes: cubeChecks.every(Boolean),
    forbidden: !/<(?:path|circle|ellipse|line)\b|stud|lego|book|page|boot|shoe|toe|sole|person|people|head|leg|arm/i.test(source),
    fronts: fronts.length === cubes.length && fronts.every((front, index) => sameRect(front, cubes[index]!.front)),
    highlights: highlights.length === HIGHLIGHTS.get(grid)!.length && highlights.every((highlight, index) => sameRect(highlight, HIGHLIGHTS.get(grid)![index]!)),
    legacy: !new RegExp(LEGACY_V5_FILLS.join("|"), "i").test(source),
    outline: outlines.length === 3,
    square: fronts.every(({ width, height }) => width === height),
    stack,
    sides: sides.length === 3,
    tops: tops.length === 3,
  };
  return Object.values(checks).every(Boolean);
}

async function nativePixels(source: string, grid: Grid) {
  const rendered = source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `);
  const { data, info } = await sharp(Buffer.from(rendered))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels: Pixel[] = [];
  const alpha: number[] = [];

  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const opacity = data[offset + 3]!;
      alpha.push(opacity);
      if (opacity === 0) continue;
      pixels.push({
        color: `#${[0, 1, 2].map((channel) => data[offset + channel]!.toString(16).padStart(2, "0")).join("")}`,
        x,
        y,
      });
    }
  }

  return { alpha, pixels };
}

function componentCount(pixels: Pixel[]) {
  const remaining = new Set(pixels.map(({ x, y }) => `${x},${y}`));
  let count = 0;
  while (remaining.size > 0) {
    count += 1;
    const [seed] = remaining;
    const queue = [seed!];
    remaining.delete(seed!);
    while (queue.length > 0) {
      const current = queue.pop()!;
      const [x, y] = current.split(",").map(Number);
      for (const neighbor of [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`]) {
        if (remaining.delete(neighbor)) queue.push(neighbor);
      }
    }
  }
  return count;
}

function enclosedTransparency(alpha: number[], grid: Grid) {
  const opaque = new Set(alpha.flatMap((value, index) => value === 0 ? [] : [`${index % grid},${Math.floor(index / grid)}`]));
  const exterior = new Set<string>();
  const queue: string[] = [];
  for (let coordinate = 0; coordinate < grid; coordinate += 1) {
    for (const point of [`${coordinate},0`, `${coordinate},${grid - 1}`, `0,${coordinate}`, `${grid - 1},${coordinate}`]) {
      if (opaque.has(point) || exterior.has(point)) continue;
      exterior.add(point);
      queue.push(point);
    }
  }
  while (queue.length > 0) {
    const current = queue.pop()!;
    const [x, y] = current.split(",").map(Number);
    for (const neighbor of [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`]) {
      const [nextX, nextY] = neighbor.split(",").map(Number);
      if (nextX < 0 || nextY < 0 || nextX >= grid || nextY >= grid || opaque.has(neighbor) || exterior.has(neighbor)) continue;
      exterior.add(neighbor);
      queue.push(neighbor);
    }
  }
  return alpha.flatMap((value, index) => {
    const point = `${index % grid},${Math.floor(index / grid)}`;
    return value === 0 && !exterior.has(point) ? [point] : [];
  });
}

describe("Myles 98 Loose Parts v6 literal construction-block precision", () => {
  it.each(GRIDS)("uses exact, independent wooden cube anatomy at %ipx", async (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const raster = await nativePixels(source, grid);
    const visibleColors = new Set(raster.pixels.map(({ color }) => color));

    expect(hasV6WoodenBlockAnatomy(source, grid)).toBe(true);
    expect(raster.alpha.every((value) => value === 0 || value === 0xff)).toBe(true);
    expect(componentCount(raster.pixels)).toBe(1);
    expect(enclosedTransparency(raster.alpha, grid)).toEqual([]);
    expect(visibleColors.size).toBeGreaterThanOrEqual(grid === 16 ? 8 : 11);
  });

  it.each(GRIDS)("rejects v5 bottle-or-clothing regressions at %ipx", (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const upper = CUBES.get(grid)![0]!.front;
    const v5Palette = source
      .replace("#c58c45", "#667d91")
      .replace("#d6a45c", "#5f8d73")
      .replace("#c89149", "#bd7654");
    const tallBottleBody = source.replace(
      `fill="${upper.fill}" x="${upper.x}" y="${upper.y}" width="${upper.width}" height="${upper.height}"`,
      `fill="${upper.fill}" x="${upper.x}" y="${upper.y}" width="${upper.width}" height="${upper.height + 2}"`,
    );
    const badgeLikeClothingMark = source.replace(
      "</svg>",
      '<path fill="#90a7b5" d="M2 2H4V3H5V5H4V6H2V5H1V3H2Z" /></svg>',
    );

    expect(hasV6WoodenBlockAnatomy(source, grid)).toBe(true);
    expect(hasV6WoodenBlockAnatomy(v5Palette, grid)).toBe(false);
    expect(hasV6WoodenBlockAnatomy(tallBottleBody, grid)).toBe(false);
    expect(hasV6WoodenBlockAnatomy(badgeLikeClothingMark, grid)).toBe(false);
  });
});
