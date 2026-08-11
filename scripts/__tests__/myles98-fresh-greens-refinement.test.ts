import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const ROUTE_FILLS = new Map([
  [16, "#4d5552"],
  [24, "#4d5552"],
  [32, "#4b5350"],
]);
const ENDPOINT_FILLS = {
  start: new Map([
    [16, "#205a40"],
    [24, "#226142"],
    [32, "#205a40"],
  ]),
  destination: new Map(GRIDS.map((grid) => [grid, "#f27524"])),
};

type Grid = (typeof GRIDS)[number];
type Point = [number, number];
type Endpoint = keyof typeof ENDPOINT_FILLS;

function sourceFor(concept: string, grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function shapeForFill(source: string, fill: string) {
  return [...source.matchAll(/<(path|polygon|rect)\b([^>]*)\/>/gi)].find(
    ([, , attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill,
  );
}

function verticesForPath(d: string) {
  const tokens = d.match(/[MLHVZ]|-?\d+(?:\.\d+)?/gi) ?? [];
  const vertices: Point[] = [];
  let index = 0;
  let current: Point = [0, 0];
  let start: Point = [0, 0];

  while (index < tokens.length) {
    const command = tokens[index++].toUpperCase();
    if (command === "M" || command === "L") {
      current = [Number(tokens[index++]), Number(tokens[index++])];
      if (command === "M") start = current;
      vertices.push(current);
    } else if (command === "H") {
      current = [Number(tokens[index++]), current[1]];
      vertices.push(current);
    } else if (command === "V") {
      current = [current[0], Number(tokens[index++])];
      vertices.push(current);
    } else if (command === "Z") {
      vertices.push(start);
    }
  }

  return vertices;
}

function verticesForShape(primitive: string, attributes: string) {
  if (primitive === "rect") {
    const x = Number(attribute(attributes, "x"));
    const y = Number(attribute(attributes, "y"));
    const width = Number(attribute(attributes, "width"));
    const height = Number(attribute(attributes, "height"));
    return [[x, y], [x + width, y + height]] as Point[];
  }
  if (primitive === "polygon") {
    const coordinates = (attribute(attributes, "points")?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    return coordinates.flatMap<Point>((coordinate, index) =>
      index % 2 === 0 ? [[coordinate, coordinates[index + 1]]] : [],
    );
  }
  return verticesForPath(attribute(attributes, "d") ?? "");
}

function routeTurns(source: string, grid: Grid) {
  const route = shapeForFill(source, ROUTE_FILLS.get(grid)!);
  if (!route || !["path", "polygon"].includes(route[1].toLowerCase())) return [];
  const vertices = verticesForShape(route[1].toLowerCase(), route[2]);
  const vectors = vertices.slice(1).map<Point>(([x, y], index) => [
    x - vertices[index][0],
    y - vertices[index][1],
  ]);
  const hasDiagonal = vectors.some(([x, y]) => x !== 0 && y !== 0);
  const hasAsymmetricStep = vectors.some(([x, y], index) => {
    const next = vectors[index + 1];
    if (!next) return false;
    const turns = (x === 0) !== (next[0] === 0);
    return turns && Math.abs(x + y) !== Math.abs(next[0] + next[1]);
  });
  return hasDiagonal || hasAsymmetricStep ? ["diagonal-or-asymmetric-step"] : [];
}

function endpointShape(source: string, grid: Grid, endpoint: Endpoint) {
  const shape = shapeForFill(source, ENDPOINT_FILLS[endpoint].get(grid)!);
  if (!shape) return null;
  const primitive = shape[1].toLowerCase();
  const vertices = verticesForShape(primitive, shape[2]);
  const xs = vertices.map(([x]) => x);
  const ys = vertices.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
    primitive,
  };
}

async function nativeColorCount(source: string, grid: Grid, fill: string) {
  const value = Number.parseInt(fill.slice(1), 16);
  const target = [value >> 16, (value >> 8) & 0xff, value & 0xff, 255];
  const { data, info } = await sharp(
    Buffer.from(source.replace("<svg ", `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return Array.from({ length: data.length / info.channels }, (_, index) => index).filter(
    (index) => target.every((channel, offset) => data[index * info.channels + offset] === channel),
  ).length;
}

describe("Myles 98 Fresh Greens route-map refinement", () => {
  it.each(GRIDS)("makes the %ipx route asymmetric with geometrically distinct endpoints", (grid) => {
    const source = sourceFor("fresh-greens", grid);

    expect(source).toMatch(/<(?:path|polygon)\b[^>]*(?:points|d)=/);
    expect(routeTurns(source, grid)).toContain("diagonal-or-asymmetric-step");
    expect(endpointShape(source, grid, "start")).not.toEqual(
      endpointShape(source, grid, "destination"),
    );
    expect(source.replace(/^<svg[^>]*>/, "")).not.toMatch(
      /<svg[^>]*>|transform=|opacity=|filter=|stroke=/i,
    );
  });

  it.each(GRIDS)("keeps the %ipx route and both endpoints visible in the native raster", async (grid) => {
    const source = sourceFor("fresh-greens", grid);

    expect(await nativeColorCount(source, grid, ROUTE_FILLS.get(grid)!)).toBeGreaterThan(0);
    expect(await nativeColorCount(source, grid, ENDPOINT_FILLS.start.get(grid)!)).toBeGreaterThan(0);
    expect(await nativeColorCount(source, grid, ENDPOINT_FILLS.destination.get(grid)!)).toBeGreaterThan(0);
  });
});
