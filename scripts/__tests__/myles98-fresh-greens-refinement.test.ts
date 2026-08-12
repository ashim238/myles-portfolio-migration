import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;

type Grid = (typeof GRIDS)[number];
type Pixel = {
  color: string;
  x: number;
  y: number;
};
type Bounds = {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
};

const ROUTE_FILL = "#4d5552";
const START_FILL = "#205a40";
const DESTINATION_FILL = "#f27524";
const BOUNDARY_FILL = "#c4ceac";
const ALLOWED_FILLS = new Set([
  "#202621",
  "#d8dfc3",
  BOUNDARY_FILL,
  ROUTE_FILL,
  START_FILL,
  DESTINATION_FILL,
]);
const MIN_ROUTE_PIXELS = new Map([
  [16, 15],
  [24, 38],
  [32, 52],
]);
const ROUTE_RECT_COUNTS = new Map<Grid, number>([
  [16, 5],
  [24, 8],
  [32, 10],
]);
const ROUTE_GEOMETRY = new Map<Grid, {
  destinationPixels: number;
  roadBounds: Bounds;
  roadPixels: number;
  startPixels: number;
}>([
  [16, {
    roadPixels: 19,
    roadBounds: { minX: 4, minY: 6, maxX: 11, maxY: 11 },
    startPixels: 4,
    destinationPixels: 12,
  }],
  [24, {
    roadPixels: 42,
    roadBounds: { minX: 6, minY: 6, maxX: 19, maxY: 18 },
    startPixels: 9,
    destinationPixels: 12,
  }],
  [32, {
    roadPixels: 56,
    roadBounds: { minX: 8, minY: 9, maxX: 26, maxY: 24 },
    startPixels: 16,
    destinationPixels: 21,
  }],
]);
const BOUNDARY_CUES = new Map([
  [16, null],
  [24, { d: "M3 5H8V6H7V10H5V8H3Z", nativePixels: 17 }],
  [32, { d: "M4 6H10V7H8V10H6V9H4Z", nativePixels: 16 }],
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

async function hasAllowedBoundaryCue(source: string, grid: Grid) {
  const expected = BOUNDARY_CUES.get(grid)!;
  const cues = shapesForFill(source, BOUNDARY_FILL);
  const pixels = pixelsForFill(await rasterFor(source, grid), BOUNDARY_FILL);

  if (!expected) return cues.length === 0 && pixels.length === 0;
  return cues.length === 1 &&
    cues[0][1].toLowerCase() === "path" &&
    attribute(cues[0][2], "d") === expected.d &&
    pixels.length === expected.nativePixels;
}

function appendRect(source: string, fill: string, grid: Grid, paired = false) {
  const end = paired ? "></rect>" : " />";
  return source.replace(
    "</svg>",
    `  <rect fill="${fill}" x="2" y="2" width="1" height="${grid - 4}"${end}\n</svg>`,
  );
}

function appendBoundaryCue(source: string, grid: Grid, paired = false) {
  const d = grid === 16 ? "M4 4H6V5H5V7H4Z" : BOUNDARY_CUES.get(grid)!.d;
  const end = paired ? "></path>" : " />";
  return source.replace("</svg>", `  <path fill="${BOUNDARY_FILL}" d="${d}"${end}\n</svg>`);
}

function broadRidgeMutation(source: string, grid: Grid) {
  const routeRects = /\s*<rect\s+[^>]*\bfill="#4d5552"[^>]*\/>/gi;
  return source
    .replace(routeRects, "")
    .replace(
      "</svg>",
      `  <rect fill="${ROUTE_FILL}" x="3" y="${Math.floor(grid / 2) - 1}" width="${grid - 6}" height="3" />\n</svg>`,
    );
}

describe("Myles 98 Fresh Greens route-map refinement", () => {
  it.each(GRIDS)("keeps the %ipx master free of vector effects and unknown map fills", (grid) => {
    const source = sourceFor(grid);

    expect(source.replace(/^<svg[^>]*>/, "")).not.toMatch(
      /<svg[^>]*>|transform=|opacity=|filter=|stroke=/i,
    );
    expect(fillsFor(source).every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    expect(shapesForFill(source, ROUTE_FILL)).toHaveLength(ROUTE_RECT_COUNTS.get(grid)!);
    expect(shapesForFill(source, ROUTE_FILL).every((shape) => shape[1].toLowerCase() === "rect")).toBe(true);
  });

  it.each(GRIDS)("renders the %ipx road as a thin four-connected route with attached, distinct endpoints", async (grid) => {
    const pixels = await rasterFor(sourceFor(grid), grid);
    const road = pixelsForFill(pixels, ROUTE_FILL);
    const start = pixelsForFill(pixels, START_FILL);
    const destination = pixelsForFill(pixels, DESTINATION_FILL);
    const roadComponents = connectedComponents(road);
    const startComponents = connectedComponents(start);
    const destinationComponents = connectedComponents(destination);
    const expected = ROUTE_GEOMETRY.get(grid)!;

    expect(roadComponents).toHaveLength(1);
    const roadComponent = roadComponents[0]!;
    expect(roadComponent.length).toBe(expected.roadPixels);
    expect(roadComponent.length).toBeGreaterThanOrEqual(MIN_ROUTE_PIXELS.get(grid)!);
    expect(roadComponent.length).toBeLessThan(grid * grid * 0.14);
    expect(bounds(roadComponent)).toEqual(expected.roadBounds);
    expect(hasSolidSquare(roadComponent, 3)).toBe(false);
    expect(touches(road, start)).toBe(true);
    expect(touches(road, destination)).toBe(true);

    expect(startComponents).toHaveLength(1);
    expect(destinationComponents).toHaveLength(1);
    expect(startComponents[0]).toHaveLength(expected.startPixels);
    expect(destinationComponents[0]).toHaveLength(expected.destinationPixels);
    expect(startComponents[0]!.length).toBeLessThanOrEqual(Math.ceil(grid * grid * 0.04));
    expect(destinationComponents[0]!.length).toBeLessThanOrEqual(Math.ceil(grid * grid * 0.05));
    const startBounds = bounds(startComponents[0]!);
    const destinationBounds = bounds(destinationComponents[0]!);
    expect(startBounds).not.toEqual(destinationBounds);
    expect(Math.hypot(
      (startBounds.minX + startBounds.maxX - destinationBounds.minX - destinationBounds.maxX) / 2,
      (startBounds.minY + startBounds.maxY - destinationBounds.minY - destinationBounds.maxY) / 2,
    )).toBeGreaterThanOrEqual(grid * 0.7);
  });

  it.each(GRIDS)("rejects a broad %ipx ridge in place of the route", async (grid) => {
    const ridgePixels = pixelsForFill(await rasterFor(broadRidgeMutation(sourceFor(grid), grid), grid), ROUTE_FILL);

    expect(hasSolidSquare(ridgePixels, 3)).toBe(true);
  });

  it.each(GRIDS)("uses exactly the allowed subordinate map-boundary cue at %ipx", async (grid) => {
    expect(await hasAllowedBoundaryCue(sourceFor(grid), grid)).toBe(true);
  });

  it.each(GRIDS)("rejects a duplicate boundary cue at %ipx", async (grid) => {
    const source = sourceFor(grid);

    expect(await hasAllowedBoundaryCue(source, grid)).toBe(true);
    for (const paired of [false, true]) {
      expect(await hasAllowedBoundaryCue(appendBoundaryCue(source, grid, paired), grid)).toBe(false);
    }
  });

  it.each(GRIDS)("rejects an added non-map fill at %ipx", (grid) => {
    const source = sourceFor(grid);

    expect(fillsFor(source).every((fill) => ALLOWED_FILLS.has(fill))).toBe(true);
    for (const paired of [false, true]) {
      const mutation = appendRect(source, "#8b9d84", grid, paired);
      expect(fillsFor(mutation).every((fill) => ALLOWED_FILLS.has(fill))).toBe(false);
    }
  });
});
