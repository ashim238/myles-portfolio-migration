import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const STREET_FILL = "#aebc9a";
const ROUTE_FILL = "#4d5552";
const START_FILL = "#205a40";
const DESTINATION_FILL = "#f27524";
const LANDMARK_FILL = "#c4ceac";
const ALLOWED_FILLS = new Set([
  "#202621",
  "#d8dfc3",
  STREET_FILL,
  LANDMARK_FILL,
  ROUTE_FILL,
  START_FILL,
  DESTINATION_FILL,
]);

type Grid = (typeof GRIDS)[number];
type Pixel = { color: string; x: number; y: number };
type Rect = { height: number; width: number; x: number; y: number };

const MAP_SPECS = new Map<Grid, { landmarkRects: number; route: Rect[]; streets: Rect[] }>([
  [16, {
    landmarkRects: 0,
    streets: [
      { x: 3, y: 4, width: 10, height: 1 },
      { x: 3, y: 8, width: 10, height: 1 },
      { x: 3, y: 12, width: 10, height: 1 },
      { x: 6, y: 3, width: 1, height: 10 },
      { x: 10, y: 3, width: 1, height: 10 },
    ],
    route: [
      { x: 3, y: 4, width: 4, height: 1 },
      { x: 6, y: 4, width: 1, height: 5 },
      { x: 6, y: 8, width: 5, height: 1 },
      { x: 10, y: 8, width: 1, height: 5 },
    ],
  }],
  [24, {
    landmarkRects: 4,
    streets: [
      { x: 3, y: 6, width: 18, height: 2 },
      { x: 3, y: 12, width: 18, height: 2 },
      { x: 3, y: 18, width: 18, height: 2 },
      { x: 8, y: 3, width: 2, height: 18 },
      { x: 16, y: 3, width: 2, height: 18 },
    ],
    route: [
      { x: 3, y: 6, width: 7, height: 2 },
      { x: 8, y: 6, width: 2, height: 8 },
      { x: 8, y: 12, width: 10, height: 2 },
      { x: 16, y: 12, width: 2, height: 8 },
    ],
  }],
  [32, {
    landmarkRects: 4,
    streets: [
      { x: 4, y: 8, width: 24, height: 2 },
      { x: 4, y: 16, width: 24, height: 2 },
      { x: 4, y: 24, width: 24, height: 2 },
      { x: 11, y: 4, width: 2, height: 24 },
      { x: 22, y: 4, width: 2, height: 24 },
    ],
    route: [
      { x: 4, y: 8, width: 9, height: 2 },
      { x: 11, y: 8, width: 2, height: 10 },
      { x: 11, y: 16, width: 13, height: 2 },
      { x: 22, y: 16, width: 2, height: 10 },
    ],
  }],
]);

function sourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "fresh-greens", grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function allShapePrimitives(source: string) {
  return [...source.matchAll(/<(path|polygon|rect)\b([^>]*?)(?:\/\s*>|>\s*<\/\1\s*>)/gi)];
}

function shapesForFill(source: string, fill: string) {
  return allShapePrimitives(source).filter(
    ([, , attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill,
  );
}

function fillsFor(source: string) {
  return allShapePrimitives(source)
    .map(([, , attributes]) => attribute(attributes, "fill")?.toLowerCase())
    .filter((fill): fill is string => Boolean(fill));
}

function rectsForFill(source: string, fill: string): Rect[] {
  return shapesForFill(source, fill)
    .filter(([, tag]) => tag.toLowerCase() === "rect")
    .map(([, , attributes]) => ({
      height: Number(attribute(attributes, "height")),
      width: Number(attribute(attributes, "width")),
      x: Number(attribute(attributes, "x")),
      y: Number(attribute(attributes, "y")),
    }));
}

function overlaps(left: Rect, right: Rect) {
  return left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y;
}

function isStreetBlockNetwork(rects: Rect[]) {
  if (rects.length !== 5) return false;
  const horizontal = rects.filter(({ width, height }) => width > height);
  const vertical = rects.filter(({ width, height }) => height > width);
  const intersections = horizontal.flatMap((street) => vertical.filter((crossStreet) => overlaps(street, crossStreet)));
  return horizontal.length === 3 && vertical.length === 2 && intersections.length === 6;
}

function isHighlightedMapRoute(rects: Rect[]) {
  if (rects.length !== 4) return false;
  const horizontal = rects.filter(({ width, height }) => width > height);
  const vertical = rects.filter(({ width, height }) => height > width);
  const degrees = rects
    .map((rect, index) => rects.filter((candidate, candidateIndex) => index !== candidateIndex && overlaps(rect, candidate)).length)
    .sort((left, right) => left - right);
  return horizontal.length === 2 && vertical.length === 2 && degrees.join(",") === "1,1,2,2";
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

function pixelsForFill(pixels: Pixel[], fill: string) {
  return pixels.filter((pixel) => pixel.color === fill);
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

function bounds(pixels: Pixel[]) {
  return {
    maxX: Math.max(...pixels.map((pixel) => pixel.x)),
    maxY: Math.max(...pixels.map((pixel) => pixel.y)),
    minX: Math.min(...pixels.map((pixel) => pixel.x)),
    minY: Math.min(...pixels.map((pixel) => pixel.y)),
  };
}

function hasSolidSquare(pixels: Pixel[], side: number) {
  const filled = new Set(pixels.map((pixel) => `${pixel.x},${pixel.y}`));
  return pixels.some(({ x, y }) =>
    Array.from({ length: side }, (_, offsetY) =>
      Array.from({ length: side }, (_, offsetX) => filled.has(`${x + offsetX},${y + offsetY}`))
        .every(Boolean),
    ).every(Boolean),
  );
}

function touches(left: Pixel[], right: Pixel[]) {
  const positions = new Set(right.map((pixel) => `${pixel.x},${pixel.y}`));
  return left.some(({ x, y }) => [
    `${x - 1},${y}`,
    `${x + 1},${y}`,
    `${x},${y - 1}`,
    `${x},${y + 1}`,
  ].some((position) => positions.has(position)));
}

function loneRouteMutation(source: string, grid: Grid) {
  return source
    .replace(/\s*<rect\s+[^>]*\bfill="#4d5552"[^>]*\/>/gi, "")
    .replace(
      "</svg>",
      `  <rect fill="${ROUTE_FILL}" x="3" y="${Math.floor(grid / 2)}" width="${grid - 6}" height="2" />\n</svg>`,
    );
}

function routeWithoutMapMutation(source: string) {
  return source.replace(/\s*<rect\s+[^>]*\bfill="#aebc9a"[^>]*\/>/gi, "");
}

describe("Myles 98 Fresh Greens street-block route-map refinement", () => {
  it.each(GRIDS)("uses a street-block network beneath one highlighted three-turn route at %ipx", (grid) => {
    const source = sourceFor(grid);
    const streets = rectsForFill(source, STREET_FILL);
    const route = rectsForFill(source, ROUTE_FILL);
    const landmarks = rectsForFill(source, LANDMARK_FILL);
    const expected = MAP_SPECS.get(grid)!;

    expect(source.replace(/^<svg[^>]*>/, "")).not.toMatch(
      /<svg[^>]*>|transform=|opacity=|filter=|stroke=/i,
    );
    expect(fillsFor(source).every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    expect(streets).toEqual(expected.streets);
    expect(route).toEqual(expected.route);
    expect(landmarks).toHaveLength(expected.landmarkRects);
    expect(isStreetBlockNetwork(streets)).toBe(true);
    expect(isHighlightedMapRoute(route)).toBe(true);
    expect(route.every((segment) => streets.some((street) => overlaps(segment, street)))).toBe(true);
    expect(shapesForFill(source, START_FILL).map(([, tag]) => tag.toLowerCase())).toEqual(["rect"]);
    expect(shapesForFill(source, DESTINATION_FILL).map(([, tag]) => tag.toLowerCase())).toEqual(["path"]);
  });

  it.each(GRIDS)("renders %ipx as a map before a music glyph: visible streets, connected route, and distant endpoints", async (grid) => {
    const pixels = await rasterFor(sourceFor(grid), grid);
    const street = pixelsForFill(pixels, STREET_FILL);
    const route = pixelsForFill(pixels, ROUTE_FILL);
    const start = pixelsForFill(pixels, START_FILL);
    const destination = pixelsForFill(pixels, DESTINATION_FILL);
    const routeComponents = connectedComponents(route);
    const startComponents = connectedComponents(start);
    const destinationComponents = connectedComponents(destination);

    expect(street.length).toBeGreaterThan(route.length);
    expect(routeComponents).toHaveLength(1);
    const routeBounds = bounds(routeComponents[0]!);
    expect(routeBounds.maxX - routeBounds.minX).toBeGreaterThanOrEqual(Math.floor(grid * 0.35));
    expect(routeBounds.maxY - routeBounds.minY).toBeGreaterThanOrEqual(Math.floor(grid * 0.35));
    expect(hasSolidSquare(routeComponents[0]!, 3)).toBe(false);
    expect(touches(route, start)).toBe(true);
    expect(touches(route, destination)).toBe(true);

    expect(startComponents).toHaveLength(1);
    expect(destinationComponents).toHaveLength(1);
    const startBounds = bounds(startComponents[0]!);
    const destinationBounds = bounds(destinationComponents[0]!);
    expect(Math.hypot(
      (startBounds.minX + startBounds.maxX - destinationBounds.minX - destinationBounds.maxX) / 2,
      (startBounds.minY + startBounds.maxY - destinationBounds.minY - destinationBounds.maxY) / 2,
    )).toBeGreaterThanOrEqual(grid * 0.55);
  });

  it.each(GRIDS)("rejects a lone route stroke or a route stripped of its %ipx street map", (grid) => {
    const source = sourceFor(grid);

    expect(isStreetBlockNetwork(rectsForFill(source, STREET_FILL))).toBe(true);
    expect(isHighlightedMapRoute(rectsForFill(source, ROUTE_FILL))).toBe(true);
    expect(isHighlightedMapRoute(rectsForFill(loneRouteMutation(source, grid), ROUTE_FILL))).toBe(false);
    expect(isStreetBlockNetwork(rectsForFill(routeWithoutMapMutation(source), STREET_FILL))).toBe(false);
  });

  it.each(GRIDS)("rejects an added non-map fill at %ipx", (grid) => {
    const source = sourceFor(grid);
    const mutation = source.replace(
      "</svg>",
      `  <rect fill="#8b9d84" x="2" y="2" width="1" height="${grid - 4}" />\n</svg>`,
    );

    expect(fillsFor(source).every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    expect(fillsFor(mutation).every((fill) => ALLOWED_FILLS.has(fill))).toBe(false);
  });
});
