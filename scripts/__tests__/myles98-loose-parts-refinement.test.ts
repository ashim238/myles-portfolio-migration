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

type Grid = (typeof GRIDS)[number];
type Pixel = { color: string; x: number; y: number };
type Rect = { fill: string; height: number; width: number; x: number; y: number };

const CUBE_SPECS = new Map<Grid, { fronts: Rect[] }>([
  [16, {
    fronts: [
      { fill: "#667d91", x: 5, y: 6, width: 4, height: 3 },
      { fill: "#5f8d73", x: 2, y: 10, width: 4, height: 3 },
      { fill: "#bd7654", x: 8, y: 10, width: 4, height: 3 },
    ],
  }],
  [24, {
    fronts: [
      { fill: "#667d91", x: 8, y: 7, width: 6, height: 5 },
      { fill: "#5f8d73", x: 4, y: 14, width: 6, height: 5 },
      { fill: "#bd7654", x: 13, y: 14, width: 6, height: 5 },
    ],
  }],
  [32, {
    fronts: [
      { fill: "#667d91", x: 11, y: 9, width: 8, height: 7 },
      { fill: "#5f8d73", x: 6, y: 18, width: 8, height: 7 },
      { fill: "#bd7654", x: 18, y: 18, width: 8, height: 7 },
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
  it.each(GRIDS)("renders three equal-ish material cuboids with construction-joint marks at %ipx, never books, people, or branded studs", async (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const coloredRects = coloredRectsFor(source);
    const fronts = frontFacesFor(source);
    const [upper, left, right] = fronts;
    const cluster = connectedComponents(await rasterFor(source, grid));

    expect(source).not.toMatch(/<(?:circle|ellipse|line)\b|stud|lego|book|page|#(?:ff0000|ffff00|0000ff)/i);
    expect(outlinePolygonsFor(source)).toHaveLength(3);
    expect(topPlanesFor(source)).toHaveLength(3);
    expect(sidePlanesFor(source)).toHaveLength(3);
    expect(coloredRects).toHaveLength(6);
    expect(fronts).toEqual(CUBE_SPECS.get(grid)!.fronts);
    expect(coloredRects.filter(({ width, height }) => width > height * 1.45)).toHaveLength(0);
    expect(fronts.every(({ width, height }) => width / height <= 1.35)).toBe(true);
    expect(inlaidJointMarksFor(source)).toHaveLength(grid === 16 ? 0 : 3);
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
