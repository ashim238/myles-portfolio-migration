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
const BOUNDARY_FILLS = new Map([
  [16, "#c4ceac"],
  [24, "#c4ceac"],
  [32, "#c4ceac"],
]);
const BROAD_RIDGE_PATHS = new Map([
  [16, "M3 10H5L7 8H9V7H11V9H12V11H10V9H8L6 11H3Z"],
  [24, "M4 16H7L11 12H13V10H17V8H19V12H17V13H14V15H12L8 19H4Z"],
  [32, "M5 22H9L14 17H17V14H20L23 11H25V15H24L21 18H19V20H16L11 25H5Z"],
]);
const MIN_ROUTE_PIXELS = new Map([
  [16, 24],
  [24, 58],
  [32, 112],
]);

type Grid = (typeof GRIDS)[number];
type Point = [number, number];
type Endpoint = keyof typeof ENDPOINT_FILLS;
type CueSpec = {
  x: number;
  y: number;
  width: number;
  height: number;
  nativePixels: number;
};

const CUE_SPECS = new Map<Grid, CueSpec | null>([
  [16, null],
  [24, { x: 7, y: 3, width: 1, height: 17, nativePixels: 14 }],
  [32, { x: 8, y: 4, width: 2, height: 23, nativePixels: 37 }],
]);

function sourceFor(concept: string, grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function allShapePrimitives(source: string) {
  return [...source.matchAll(/<(path|polygon|rect)\b([^>]*)\/>/gi)];
}

function shapesForFill(source: string, fill: string) {
  return allShapePrimitives(source).filter(
    ([, , attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill,
  );
}

function shapeForFill(source: string, fill: string) {
  return shapesForFill(source, fill)[0];
}

function cueBounds(attributes: string) {
  return {
    x: Number(attribute(attributes, "x")),
    y: Number(attribute(attributes, "y")),
    width: Number(attribute(attributes, "width")),
    height: Number(attribute(attributes, "height")),
  };
}

function cueMatchesSpec(shape: RegExpMatchArray | undefined, spec: CueSpec) {
  if (shape?.[1].toLowerCase() !== "rect") return false;
  const bounds = cueBounds(shape[2]);
  return bounds.x === spec.x &&
    bounds.y === spec.y &&
    bounds.width === spec.width &&
    bounds.height === spec.height;
}

function shapeBounds(shape: RegExpMatchArray) {
  const primitive = shape[1].toLowerCase();
  const vertices = verticesForShape(primitive, shape[2]);
  const xs = vertices.map(([x]) => x);
  const ys = vertices.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function isStreetLikeCue(shape: RegExpMatchArray, grid: Grid) {
  const fill = attribute(shape[2], "fill");
  if (!fill || fill.toLowerCase() === "none") return false;
  const { width, height } = shapeBounds(shape);
  const longSide = Math.max(width, height);
  const shortSide = Math.min(width, height);
  return longSide >= Math.ceil(grid * 0.65) && shortSide <= Math.ceil(grid / 16);
}

function sameShape(left: RegExpMatchArray, right: RegExpMatchArray) {
  return left[1] === right[1] && left[2] === right[2];
}

async function hasAllowedSubordinateCue(source: string, grid: Grid) {
  const boundaryFill = BOUNDARY_FILLS.get(grid)!;
  const spec = CUE_SPECS.get(grid)!;
  const boundaryCues = shapesForFill(source, boundaryFill);
  const streetLikeCues = allShapePrimitives(source).filter((shape) => isStreetLikeCue(shape, grid));

  if (!spec) {
    return boundaryCues.length === 0 &&
      streetLikeCues.length === 0 &&
      (await nativeColorCount(source, grid, boundaryFill)) === 0;
  }

  if (boundaryCues.length !== 1 || streetLikeCues.length !== 1) return false;
  const cue = boundaryCues[0];
  return cueMatchesSpec(cue, spec) &&
    sameShape(cue, streetLikeCues[0]) &&
    (await nativeColorCount(source, grid, boundaryFill)) === spec.nativePixels;
}

function extraCueMutation(source: string, grid: Grid, fill: string) {
  const spec = CUE_SPECS.get(grid) ?? { x: 7, y: 2, width: 1, height: 12 };
  const x = spec.x + spec.width + 1;
  return source.replace(
    "</svg>",
    `<rect fill="${fill}" x="${x}" y="${spec.y}" width="${spec.width}" height="${spec.height}" />\n</svg>`,
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
  const primitive = route[1].toLowerCase();
  const subpaths = primitive === "path"
    ? (attribute(route[2], "d") ?? "").split(/(?=M)/i).filter(Boolean)
    : [attribute(route[2], "points") ?? ""];
  const vectors = subpaths.flatMap((subpath) => {
    const attributes = primitive === "path" ? `d="${subpath}"` : `points="${subpath}"`;
    const vertices = verticesForShape(primitive, attributes);
    return vertices.slice(1).map<Point>(([x, y], index) => [
      x - vertices[index][0],
      y - vertices[index][1],
    ]);
  });
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
  return (await nativePixelsForFills(source, grid, [fill])).size;
}

async function nativePixelsForFills(source: string, grid: Grid, fills: string[]) {
  const targets = fills.map((fill) => {
    const value = Number.parseInt(fill.slice(1), 16);
    return [value >> 16, (value >> 8) & 0xff, value & 0xff, 255];
  });
  const { data, info } = await sharp(
    Buffer.from(source.replace("<svg ", `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  return new Set(
    Array.from({ length: data.length / info.channels }, (_, index) => index)
      .filter((index) =>
        targets.some((target) =>
          target.every((channel, offset) => data[index * info.channels + offset] === channel),
        ),
      )
      .map((index) => `${index % info.width},${Math.floor(index / info.width)}`),
  );
}

function opaqueComponents(pixels: Set<string>) {
  const remaining = new Set(pixels);
  let count = 0;

  while (remaining.size > 0) {
    count += 1;
    const queue = [remaining.values().next().value as string];
    remaining.delete(queue[0]);

    while (queue.length > 0) {
      const [x, y] = queue.shift()!.split(",").map(Number);
      for (const neighbor of [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`]) {
        if (!remaining.delete(neighbor)) continue;
        queue.push(neighbor);
      }
    }
  }

  return count;
}

function hasOnlyOrthogonalRuns(d: string) {
  return d
    .split(/(?=M)/i)
    .filter(Boolean)
    .every((subpath) => {
      const vertices = verticesForPath(subpath);
      return vertices.slice(1).every(([x, y], index) => {
        const [previousX, previousY] = vertices[index];
        return x === previousX || y === previousY;
      });
    });
}

function replaceRoutePath(source: string, grid: Grid, replacement: string) {
  const route = shapeForFill(source, ROUTE_FILLS.get(grid)!);
  if (!route) return source;
  const current = attribute(route[2], "d");
  return current ? source.replace(`d="${current}"`, `d="${replacement}"`) : source;
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

  it.each(GRIDS)("makes one continuous directional road the %ipx visual subject", async (grid) => {
    const source = sourceFor("fresh-greens", grid);
    const route = shapeForFill(source, ROUTE_FILLS.get(grid)!);

    expect(route?.[1].toLowerCase()).toBe("path");
    expect(hasOnlyOrthogonalRuns(attribute(route?.[2] ?? "", "d") ?? "")).toBe(true);

    const routePixels = await nativePixelsForFills(source, grid, [ROUTE_FILLS.get(grid)!]);
    const connectedRoute = await nativePixelsForFills(source, grid, [
      ROUTE_FILLS.get(grid)!,
      ENDPOINT_FILLS.start.get(grid)!,
      ENDPOINT_FILLS.destination.get(grid)!,
    ]);

    expect(routePixels.size).toBeGreaterThanOrEqual(MIN_ROUTE_PIXELS.get(grid)!);
    expect(routePixels.size).toBeLessThan(grid * grid * 0.18);
    expect(opaqueComponents(routePixels)).toBe(1);
    expect(opaqueComponents(connectedRoute)).toBe(1);
  });

  it.each(GRIDS)("rejects the former broad %ipx diagonal ridge", async (grid) => {
    const source = sourceFor("fresh-greens", grid);
    const ridgeMutation = replaceRoutePath(source, grid, BROAD_RIDGE_PATHS.get(grid)!);
    const ridgePixels = await nativePixelsForFills(ridgeMutation, grid, [ROUTE_FILLS.get(grid)!]);

    expect(ridgePixels.size).toBeLessThan(MIN_ROUTE_PIXELS.get(grid)!);
  });

  it.each(GRIDS)("keeps compact directional endpoints attached at %ipx", async (grid) => {
    const source = sourceFor("fresh-greens", grid);
    const startPixels = await nativePixelsForFills(source, grid, [ENDPOINT_FILLS.start.get(grid)!]);
    const destinationPixels = await nativePixelsForFills(source, grid, [
      ENDPOINT_FILLS.destination.get(grid)!,
    ]);
    const destination = endpointShape(source, grid, "destination");

    expect(startPixels.size).toBeLessThanOrEqual(Math.ceil(grid * grid * 0.04));
    expect(destinationPixels.size).toBeLessThanOrEqual(Math.ceil(grid * grid * 0.04));
    expect(destination?.primitive).toBe("path");
    expect(destination!.height).toBeGreaterThan(destination!.width);
  });

  it.each(GRIDS)("uses exactly the allowed subordinate map cue at %ipx", async (grid) => {
    const source = sourceFor("fresh-greens", grid);

    expect(await hasAllowedSubordinateCue(source, grid)).toBe(true);
  });

  it.each(GRIDS)("rejects a duplicate boundary-fill cue at %ipx", async (grid) => {
    const source = sourceFor("fresh-greens", grid);
    const boundaryFill = BOUNDARY_FILLS.get(grid)!;

    expect(await hasAllowedSubordinateCue(source, grid)).toBe(true);
    expect(await hasAllowedSubordinateCue(extraCueMutation(source, grid, boundaryFill), grid)).toBe(false);
  });

  it.each(GRIDS)("rejects an extra street-like opaque cue at %ipx", async (grid) => {
    const source = sourceFor("fresh-greens", grid);

    expect(await hasAllowedSubordinateCue(source, grid)).toBe(true);
    expect(await hasAllowedSubordinateCue(extraCueMutation(source, grid, "#8b9d84"), grid)).toBe(false);
  });
});
