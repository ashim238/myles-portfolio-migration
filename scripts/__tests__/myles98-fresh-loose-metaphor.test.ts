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
const LOOSE_FRONT_FILLS = ["#5f8d73", "#bd7654", "#667d91"];
const MIN_LOOSE_VISIBLE_COLORS = new Map([[16, 8], [24, 10], [32, 10]]);

type Pixel = {
  color: string;
  x: number;
  y: number;
};

function sourceFor(concept: "fresh-greens" | "loose-parts", grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

async function rasterFor(concept: "fresh-greens" | "loose-parts", grid: number) {
  const source = sourceFor(concept, grid).replace(
    /<svg\s+/,
    `<svg width="${grid}" height="${grid}" `,
  );
  const { data, info } = await sharp(Buffer.from(source))
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

function longStreetRuns(pixels: Pixel[], grid: number, direction: "horizontal" | "vertical") {
  const filled = new Set(pixels.map((pixel) => `${pixel.x},${pixel.y}`));
  const minimum = Math.ceil(grid * 0.3);
  let runs = 0;

  for (let line = 0; line < grid; line += 1) {
    let current = 0;
    let hasLongRun = false;
    for (let offset = 0; offset < grid; offset += 1) {
      const position = direction === "horizontal" ? `${offset},${line}` : `${line},${offset}`;
      current = filled.has(position) ? current + 1 : 0;
      if (current >= minimum) hasLongRun = true;
    }
    if (hasLongRun) runs += 1;
  }

  return runs;
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

describe("Fresh Greens and Loose Parts native-size metaphors", () => {
  it.each(GRIDS)("renders Fresh Greens %ipx as a street-block map with a highlighted route, not a music note or folded map", async (grid) => {
    const raster = await rasterFor("fresh-greens", grid);
    const streets = raster.filter((pixel) => pixel.color === STREET_FILL);
    const road = raster.filter((pixel) => pixel.color === ROUTE_FILL);
    const start = raster.filter((pixel) => pixel.color === START_FILL);
    const destination = raster.filter((pixel) => pixel.color === DESTINATION_FILL);
    const roadComponents = connectedComponents(road);
    const startComponents = connectedComponents(start);
    const destinationComponents = connectedComponents(destination);

    expect(roadComponents).toHaveLength(1);
    expect(streets.length).toBeGreaterThan(road.length);
    expect(longStreetRuns(streets, grid, "horizontal")).toBeGreaterThanOrEqual(2);
    expect(longStreetRuns(streets, grid, "vertical")).toBeGreaterThanOrEqual(1);
    expect(longStreetRuns(road, grid, "horizontal")).toBeGreaterThanOrEqual(1);
    expect(longStreetRuns(road, grid, "vertical")).toBeGreaterThanOrEqual(1);
    const roadBounds = bounds(roadComponents[0]!);
    expect(roadBounds.maxX - roadBounds.minX).toBeGreaterThanOrEqual(Math.floor(grid * 0.4));
    expect(roadBounds.maxY - roadBounds.minY).toBeGreaterThanOrEqual(Math.floor(grid * 0.3));
    expect(roadComponents[0]!.length).toBeLessThan(grid * grid * 0.2);
    expect(hasSolidSquare(roadComponents[0]!, 3)).toBe(false);
    expect(touches(road, start)).toBe(true);
    expect(touches(road, destination)).toBe(true);
    expect(startComponents).toHaveLength(1);
    expect(destinationComponents).toHaveLength(1);
    const startBounds = bounds(startComponents[0]!);
    const destinationBounds = bounds(destinationComponents[0]!);
    expect(Math.hypot(
      (startBounds.minX + startBounds.maxX - destinationBounds.minX - destinationBounds.maxX) / 2,
      (startBounds.minY + startBounds.maxY - destinationBounds.minY - destinationBounds.maxY) / 2,
    )).toBeGreaterThanOrEqual(grid * 0.65);
  });

  it.each(GRIDS)("renders Loose Parts %ipx as three equal-ish stacked cuboids, not books, boots, or people", async (grid) => {
    const raster = await rasterFor("loose-parts", grid);
    const cluster = connectedComponents(raster);
    const frontBounds = LOOSE_FRONT_FILLS.map((fill) => {
      const front = connectedComponents(raster.filter((pixel) => pixel.color === fill));
      expect(front).toHaveLength(1);
      return bounds(front[0]!);
    }).sort((left, right) => left.minY - right.minY || left.minX - right.minX);
    const [upper, left, right] = frontBounds;

    expect(cluster).toHaveLength(1);
    expect(new Set(cluster[0]!.map((pixel) => pixel.color)).size).toBeGreaterThanOrEqual(
      MIN_LOOSE_VISIBLE_COLORS.get(grid)!,
    );
    expect(left!.minY).toBe(right!.minY);
    expect(upper!.maxY).toBeLessThan(left!.minY);
    const upperWidth = upper!.maxX - upper!.minX + 1;
    const leftWidth = left!.maxX - left!.minX + 1;
    const rightWidth = right!.maxX - right!.minX + 1;
    const upperHeight = upper!.maxY - upper!.minY + 1;
    expect(upperWidth).toBe(leftWidth);
    expect(upperWidth).toBe(rightWidth);
    expect(upperWidth / upperHeight).toBeLessThanOrEqual(1.35);
    expect(upper!.minX).toBeLessThanOrEqual(left!.maxX);
    expect(upper!.maxX).toBeGreaterThanOrEqual(right!.minX);
  });
});
