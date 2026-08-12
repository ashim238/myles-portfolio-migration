import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const OUTLINE_FILL = "#20242a";
const FRONT_FILLS = ["#667d91", "#5f8d73", "#bd7654"];
const TOP_FILLS = ["#b3c2ce", "#a9c7a5", "#e5af8d"];
const SIDE_FILLS = ["#42586b", "#3c624e", "#814633"];
const INLAY_FILLS = ["#90a7b5", "#8eaf8d", "#d69c78"];
const MIN_VISIBLE_COLORS = new Map([[16, 8], [24, 13], [32, 13]]);
const INLAY_SPECS = new Map<Grid, string[]>([
  [16, []],
  [24, [
    "M11 9H13V10H14V12H13V13H11V12H10V10H11Z",
    "M6 16H8V17H9V19H8V20H6V19H5V17H6Z",
    "M16 16H18V17H19V19H18V20H16V19H15V17H16Z",
  ]],
  [32, [
    "M15 12H18V13H19V16H18V17H15V16H14V13H15Z",
    "M9 21H12V22H13V25H12V26H9V25H8V22H9Z",
    "M21 21H24V22H25V25H24V26H21V25H20V22H21Z",
  ]],
]);

type Grid = (typeof GRIDS)[number];
type Pixel = { color: string; x: number; y: number };
type Rect = { fill: string; height: number; width: number; x: number; y: number };

const CUBE_SPECS = new Map<Grid, { fronts: Rect[] }>([
  [16, {
    fronts: [
      { fill: "#667d91", x: 5, y: 5, width: 4, height: 4 },
      { fill: "#5f8d73", x: 2, y: 10, width: 4, height: 4 },
      { fill: "#bd7654", x: 8, y: 10, width: 4, height: 4 },
    ],
  }],
  [24, {
    fronts: [
      { fill: "#667d91", x: 9, y: 8, width: 6, height: 6 },
      { fill: "#5f8d73", x: 4, y: 15, width: 6, height: 6 },
      { fill: "#bd7654", x: 14, y: 15, width: 6, height: 6 },
    ],
  }],
  [32, {
    fronts: [
      { fill: "#667d91", x: 12, y: 10, width: 8, height: 8 },
      { fill: "#5f8d73", x: 6, y: 19, width: 8, height: 8 },
      { fill: "#bd7654", x: 18, y: 19, width: 8, height: 8 },
    ],
  }],
]);

function attribute(source: string, name: string) {
  return source.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function polygonArea(points: Array<[number, number]>) {
  return Math.abs(
    points.reduce((sum, [x, y], index) => {
      const [nextX, nextY] = points[(index + 1) % points.length];
      return sum + x * nextY - nextX * y;
    }, 0) / 2,
  );
}

function coloredRectsFor(source: string): Rect[] {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .map(([, attributes]) => ({
      fill: attribute(attributes, "fill")?.toLowerCase(),
      height: Number(attribute(attributes, "height")),
      width: Number(attribute(attributes, "width")),
      x: Number(attribute(attributes, "x")),
      y: Number(attribute(attributes, "y")),
    }))
    .filter((rect): rect is Rect =>
      Boolean(rect.fill) &&
      rect.fill !== OUTLINE_FILL &&
      Number.isFinite(rect.x) &&
      Number.isFinite(rect.y),
    );
}

function frontFacesFor(source: string) {
  return coloredRectsFor(source)
    .filter((rect) => FRONT_FILLS.includes(rect.fill))
    .sort((left, right) => left.y - right.y || left.x - right.x);
}

function topPlanesFor(source: string) {
  return [...source.matchAll(/<polygon\b([^>]*)\/>/gi)]
    .filter(([, attributes]) => {
      const fill = attribute(attributes, "fill")?.toLowerCase();
      if (!fill || !TOP_FILLS.includes(fill)) return false;
      const coordinates = (attribute(attributes, "points")?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
      const points: Array<[number, number]> = [];
      for (let index = 0; index < coordinates.length; index += 2) {
        points.push([coordinates[index]!, coordinates[index + 1]!]);
      }
      if (points.length < 3) return false;
      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);
      return polygonArea(points) < (Math.max(...xs) - Math.min(...xs)) * (Math.max(...ys) - Math.min(...ys));
    });
}

function sidePlanesFor(source: string) {
  return coloredRectsFor(source).filter((rect) => SIDE_FILLS.includes(rect.fill));
}

function inlaidJointMarksFor(source: string) {
  return [...source.matchAll(/<path\b([^>]*)\/>/gi)]
    .filter(([, attributes]) => INLAY_FILLS.includes(attribute(attributes, "fill")?.toLowerCase() ?? ""));
}

function outlinePolygonsFor(source: string) {
  return [...source.matchAll(/<polygon\b([^>]*)\/>/gi)]
    .filter(([, attributes]) => attribute(attributes, "fill")?.toLowerCase() === OUTLINE_FILL);
}

function pointsFor(attributes: string) {
  const coordinates = (attribute(attributes, "points")?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  const points: Array<[number, number]> = [];
  for (let index = 0; index < coordinates.length; index += 2) {
    points.push([coordinates[index]!, coordinates[index + 1]!]);
  }
  return points;
}

function hasCompactCuboidSilhouette(attributes: string) {
  const points = pointsFor(attributes);
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const width = Math.max(...xs) - Math.min(...xs);
  const height = Math.max(...ys) - Math.min(...ys);
  const topEdge = points.filter(([, y]) => y === Math.min(...ys));
  const baseline = points.filter(([, y]) => y === Math.max(...ys));

  return points.length === 6 &&
    topEdge.length === 2 &&
    baseline.length === 2 &&
    Math.abs(width - height) <= 1;
}

function hasFlushDiamondInlay(attributes: string) {
  const data = attribute(attributes, "d") ?? "";
  const commands = data.match(/[MLHVZ]/g) ?? [];
  return commands.length === 13 &&
    (data.match(/H/g) ?? []).length === 6 &&
    (data.match(/V/g) ?? []).length === 5 &&
    !/^M\d+ \d+H\d+V\d+H\d+Z$/i.test(data);
}

function matchesRects(actual: Rect[], expected: Rect[]) {
  return actual.length === expected.length && actual.every((rect, index) =>
    rect.fill === expected[index]!.fill &&
    rect.x === expected[index]!.x &&
    rect.y === expected[index]!.y &&
    rect.width === expected[index]!.width &&
    rect.height === expected[index]!.height,
  );
}

function hasLiteralConstructionBlockAnatomy(source: string, grid: Grid) {
  const coloredRects = coloredRectsFor(source);
  const fronts = frontFacesFor(source);
  const [upper, left, right] = fronts;
  const outlines = outlinePolygonsFor(source);
  const inlays = inlaidJointMarksFor(source);

  return !/<(?:circle|ellipse|line)\b|stud|lego|boot|shoe|toe|sole|book|page|people|person|head|leg|arm|#(?:ff0000|ffff00|0000ff)/i.test(source) &&
    outlines.length === 3 &&
    outlines.every(([, attributes]) => hasCompactCuboidSilhouette(attributes)) &&
    topPlanesFor(source).length === 3 &&
    sidePlanesFor(source).length === 3 &&
    coloredRects.length === 6 &&
    matchesRects(fronts, CUBE_SPECS.get(grid)!.fronts) &&
    fronts.every(({ width, height }) => width === height) &&
    inlays.length === (grid === 16 ? 0 : 3) &&
    JSON.stringify(inlays.map(([, attributes]) => attribute(attributes, "d"))) === JSON.stringify(INLAY_SPECS.get(grid)!) &&
    inlays.every(([, attributes]) => hasFlushDiamondInlay(attributes)) &&
    Boolean(upper && left && right) &&
    left!.y === right!.y &&
    upper!.y + upper!.height <= left!.y &&
    upper!.width === left!.width &&
    upper!.width === right!.width &&
    upper!.x < left!.x + left!.width &&
    upper!.x + upper!.width > right!.x;
}

async function rasterFor(source: string, grid: Grid) {
  const rendered = source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `);
  const { data, info } = await sharp(Buffer.from(rendered))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels: Pixel[] = [];

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      if (data[offset + 3] === 0) continue;
      const color = `#${[0, 1, 2]
        .map((channel) => data[offset + channel].toString(16).padStart(2, "0"))
        .join("")}`;
      pixels.push({ color, x, y });
    }
  }

  return pixels;
}

function connectedComponents(pixels: Pixel[]) {
  const remaining = new Map(pixels.map((pixel) => [`${pixel.x},${pixel.y}`, pixel]));
  const components: Pixel[][] = [];

  while (remaining.size > 0) {
    const seed = remaining.values().next().value as Pixel;
    const component: Pixel[] = [];
    const queue = [seed];
    remaining.delete(`${seed.x},${seed.y}`);

    while (queue.length > 0) {
      const pixel = queue.pop()!;
      component.push(pixel);
      for (const [x, y] of [[pixel.x - 1, pixel.y], [pixel.x + 1, pixel.y], [pixel.x, pixel.y - 1], [pixel.x, pixel.y + 1]]) {
        const neighbor = remaining.get(`${x},${y}`);
        if (!neighbor) continue;
        remaining.delete(`${x},${y}`);
        queue.push(neighbor);
      }
    }

    components.push(component);
  }

  return components;
}

function enclosedTransparentPixels(pixels: Pixel[], grid: Grid) {
  const opaque = new Set(pixels.map((pixel) => `${pixel.x},${pixel.y}`));
  const exterior = new Set<string>();
  const queue: Array<[number, number]> = [];

  for (let coordinate = 0; coordinate < grid; coordinate += 1) {
    for (const [x, y] of [[coordinate, 0], [coordinate, grid - 1], [0, coordinate], [grid - 1, coordinate]]) {
      const position = `${x},${y}`;
      if (opaque.has(position) || exterior.has(position)) continue;
      exterior.add(position);
      queue.push([x, y]);
    }
  }

  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    for (const [nextX, nextY] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      const position = `${nextX},${nextY}`;
      if (
        nextX < 0 || nextY < 0 || nextX >= grid || nextY >= grid ||
        opaque.has(position) || exterior.has(position)
      ) continue;
      exterior.add(position);
      queue.push([nextX, nextY]);
    }
  }

  const pockets: string[] = [];
  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const position = `${x},${y}`;
      if (!opaque.has(position) && !exterior.has(position)) pockets.push(position);
    }
  }
  return pockets;
}

describe("Myles 98 Loose Parts stacked-cube refinement", () => {
  it.each(GRIDS)("rejects book, boot, and person regressions while preserving building-block anatomy at %ipx", (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const upper = CUBE_SPECS.get(grid)!.fronts[0]!;
    const bookLike = source.replace(
      `fill="${upper.fill}" x="${upper.x}" y="${upper.y}" width="${upper.width}" height="${upper.height}"`,
      `fill="${upper.fill}" x="${upper.x}" y="${upper.y}" width="${upper.width + 2}" height="${upper.height}"`,
    );
    const bootLike = source.replace(
      /(<polygon fill="#20242a" points=")[^"]+(" \/>)/,
      (_, prefix, suffix) => `${prefix}1,10 2,9 5,9 6,10 9,13 8,15 1,15${suffix}`,
    );
    const personLike = source.replace(
      "</svg>",
      '<circle fill="#20242a" cx="3" cy="3" r="1" /></svg>',
    );

    expect(hasLiteralConstructionBlockAnatomy(source, grid)).toBe(true);
    expect(hasLiteralConstructionBlockAnatomy(bookLike, grid)).toBe(false);
    expect(hasLiteralConstructionBlockAnatomy(bootLike, grid)).toBe(false);
    expect(hasLiteralConstructionBlockAnatomy(personLike, grid)).toBe(false);
  });

  it.each(GRIDS)("renders literal building blocks at %ipx, rejecting boot, book, people, and branded-stud anatomy", async (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const coloredRects = coloredRectsFor(source);
    const fronts = frontFacesFor(source);
    const [upper, left, right] = fronts;
    const cluster = connectedComponents(await rasterFor(source, grid));
    const outlines = outlinePolygonsFor(source);
    const inlays = inlaidJointMarksFor(source);

    expect(hasLiteralConstructionBlockAnatomy(source, grid)).toBe(true);
    expect(source).not.toMatch(/<(?:circle|ellipse|line)\b|stud|lego|boot|shoe|toe|sole|book|page|people|person|head|leg|arm|#(?:ff0000|ffff00|0000ff)/i);
    expect(outlines).toHaveLength(3);
    expect(outlines.every(([, attributes]) => hasCompactCuboidSilhouette(attributes))).toBe(true);
    expect(topPlanesFor(source)).toHaveLength(3);
    expect(sidePlanesFor(source)).toHaveLength(3);
    expect(coloredRects).toHaveLength(6);
    expect(fronts).toEqual(CUBE_SPECS.get(grid)!.fronts);
    expect(fronts.every(({ width, height }) => width === height)).toBe(true);
    expect(inlays).toHaveLength(grid === 16 ? 0 : 3);
    expect(inlays.map(([, attributes]) => attribute(attributes, "d"))).toEqual(INLAY_SPECS.get(grid)!);
    expect(inlays.every(([, attributes]) => hasFlushDiamondInlay(attributes))).toBe(true);
    expect(cluster).toHaveLength(1);
    expect(enclosedTransparentPixels(cluster[0]!, grid)).toEqual([]);
    expect(new Set(cluster[0]!.map((pixel) => pixel.color)).size).toBeGreaterThanOrEqual(
      MIN_VISIBLE_COLORS.get(grid)!,
    );

    expect(upper).toBeDefined();
    expect(left).toBeDefined();
    expect(right).toBeDefined();
    expect(left!.y).toBe(right!.y);
    expect(upper!.y + upper!.height).toBeLessThanOrEqual(left!.y);
    expect(upper!.width).toBe(left!.width);
    expect(upper!.width).toBe(right!.width);
    expect(upper!.x).toBeLessThan(left!.x + left!.width);
    expect(upper!.x + upper!.width).toBeGreaterThan(right!.x);
  });
});
