import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";

type Concept = "start" | "about-myles";
type Grid = 16 | 24 | 32;
type Point = { x: number; y: number };
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
type HorizontalFeature = { minX: number; maxX: number; y: number };
type PortraitSpec = {
  concept: Concept;
  grid: Grid;
  face: Bounds;
  facialHairFills: readonly string[];
  skinFills: readonly string[];
  glassesFill: string;
  moustache: HorizontalFeature;
  separation: Bounds;
  chinBeard: Bounds;
};
type NativeRaster = { channels: number; data: Buffer; height: number; width: number };

const PORTRAITS: readonly PortraitSpec[] = [
  {
    concept: "start",
    grid: 16,
    face: { minX: 5, minY: 10, maxX: 10, maxY: 13 },
    facialHairFills: ["#241512", "#2f1915", "#3b2019", "#17100f"],
    skinFills: ["#74442e"],
    glassesFill: "#a9ced0",
    moustache: { minX: 6, maxX: 10, y: 10 },
    separation: { minX: 6, minY: 11, maxX: 10, maxY: 11 },
    chinBeard: { minX: 7, minY: 12, maxX: 9, maxY: 13 },
  },
  {
    concept: "start",
    grid: 24,
    face: { minX: 9, minY: 16, maxX: 16, maxY: 21 },
    facialHairFills: ["#281613", "#3b2019", "#17100f"],
    skinFills: ["#75442e"],
    glassesFill: "#a8cccd",
    moustache: { minX: 9, maxX: 16, y: 16 },
    separation: { minX: 9, minY: 17, maxX: 16, maxY: 17 },
    chinBeard: { minX: 11, minY: 18, maxX: 15, maxY: 21 },
  },
  {
    concept: "start",
    grid: 32,
    face: { minX: 12, minY: 22, maxX: 21, maxY: 28 },
    facialHairFills: ["#2a1713", "#3a1f18", "#17100f"],
    skinFills: ["#73432d"],
    glassesFill: "#a6cbcd",
    moustache: { minX: 12, maxX: 21, y: 22 },
    separation: { minX: 12, minY: 23, maxX: 21, maxY: 23 },
    chinBeard: { minX: 14, minY: 24, maxX: 19, maxY: 28 },
  },
  {
    concept: "about-myles",
    grid: 16,
    face: { minX: 5, minY: 10, maxX: 7, maxY: 12 },
    facialHairFills: ["#14191c", "#17100f"],
    skinFills: ["#73432e"],
    glassesFill: "#a9ced0",
    moustache: { minX: 5, maxX: 7, y: 10 },
    separation: { minX: 5, minY: 11, maxX: 7, maxY: 11 },
    chinBeard: { minX: 6, minY: 12, maxX: 6, maxY: 12 },
  },
  {
    concept: "about-myles",
    grid: 24,
    face: { minX: 7, minY: 15, maxX: 10, maxY: 17 },
    facialHairFills: ["#271613", "#17100f"],
    skinFills: ["#75442e"],
    glassesFill: "#a9ced0",
    moustache: { minX: 7, maxX: 9, y: 15 },
    separation: { minX: 7, minY: 16, maxX: 9, maxY: 16 },
    chinBeard: { minX: 8, minY: 17, maxX: 9, maxY: 17 },
  },
  {
    concept: "about-myles",
    grid: 32,
    face: { minX: 9, minY: 19, maxX: 13, maxY: 23 },
    facialHairFills: ["#281613", "#3b2019", "#17100f"],
    skinFills: ["#75442d"],
    glassesFill: "#a8cccd",
    moustache: { minX: 9, maxX: 13, y: 19 },
    separation: { minX: 9, minY: 20, maxX: 13, maxY: 20 },
    chinBeard: { minX: 10, minY: 21, maxX: 12, maxY: 23 },
  },
];

function masterPath(concept: Concept, grid: Grid) {
  return expectedMasterPath(ROOT, concept, grid);
}

function publicPath(concept: Concept, grid: Grid) {
  return `public/myles98-icons/${concept}/${concept}-${grid}.svg`;
}

function sourceFor({ concept, grid }: PortraitSpec) {
  return readFileSync(masterPath(concept, grid), "utf8");
}

async function nativeRaster(source: string, grid: Grid): Promise<NativeRaster> {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { channels: info.channels, data, height: info.height, width: info.width };
}

function colorAt(raster: NativeRaster, x: number, y: number) {
  const offset = (y * raster.width + x) * raster.channels;
  return `#${[0, 1, 2]
    .map((channel) => raster.data[offset + channel].toString(16).padStart(2, "0"))
    .join("")}`;
}

function pointsForFills(raster: NativeRaster, fills: readonly string[], bounds?: Bounds): Point[] {
  const allowed = new Set(fills);
  const points: Point[] = [];
  for (let y = 0; y < raster.height; y += 1) {
    for (let x = 0; x < raster.width; x += 1) {
      if (bounds && (x < bounds.minX || x > bounds.maxX || y < bounds.minY || y > bounds.maxY)) continue;
      if (allowed.has(colorAt(raster, x, y))) points.push({ x, y });
    }
  }
  return points;
}

function components(points: Point[]) {
  const remaining = new Map(points.map((point) => [`${point.x},${point.y}`, point]));
  const groups: Point[][] = [];
  while (remaining.size > 0) {
    const seed = remaining.values().next().value as Point;
    const group: Point[] = [];
    const queue = [seed];
    remaining.delete(`${seed.x},${seed.y}`);
    while (queue.length > 0) {
      const point = queue.pop()!;
      group.push(point);
      for (const neighbor of [
        { x: point.x - 1, y: point.y },
        { x: point.x + 1, y: point.y },
        { x: point.x, y: point.y - 1 },
        { x: point.x, y: point.y + 1 },
      ]) {
        const key = `${neighbor.x},${neighbor.y}`;
        const next = remaining.get(key);
        if (!next) continue;
        remaining.delete(key);
        queue.push(next);
      }
    }
    groups.push(group);
  }
  return groups;
}

function boundsFor(points: Point[]): Bounds {
  return {
    minX: Math.min(...points.map(({ x }) => x)),
    minY: Math.min(...points.map(({ y }) => y)),
    maxX: Math.max(...points.map(({ x }) => x)),
    maxY: Math.max(...points.map(({ y }) => y)),
  };
}

function pointsInside(points: Point[], bounds: Bounds) {
  return points.filter(
    ({ x, y }) => x >= bounds.minX && x <= bounds.maxX && y >= bounds.minY && y <= bounds.maxY,
  );
}

function moustacheIsContinuous(raster: NativeRaster, portrait: PortraitSpec) {
  const { minX, maxX, y } = portrait.moustache;
  const allowed = new Set(portrait.facialHairFills);
  return Array.from({ length: maxX - minX + 1 }, (_, offset) => allowed.has(colorAt(raster, minX + offset, y))).every(
    Boolean,
  );
}

function separationShowsSkin(raster: NativeRaster, portrait: PortraitSpec) {
  const skin = new Set(portrait.skinFills);
  return pointsInside(
    Array.from({ length: raster.width * raster.height }, (_, index) => ({
      x: index % raster.width,
      y: Math.floor(index / raster.width),
    })),
    portrait.separation,
  ).every(({ x, y }) => skin.has(colorAt(raster, x, y)));
}

function separateMoustacheAndChinBeard(raster: NativeRaster, portrait: PortraitSpec) {
  const facialHair = pointsForFills(raster, portrait.facialHairFills, portrait.face);
  const facialHairComponents = components(facialHair);
  const moustache = facialHairComponents.find((component) =>
    Array.from(
      { length: portrait.moustache.maxX - portrait.moustache.minX + 1 },
      (_, offset) => `${portrait.moustache.minX + offset},${portrait.moustache.y}`,
    ).every((key) => component.some((point) => `${point.x},${point.y}` === key)),
  );
  const chinBeard = facialHairComponents.find((component) => pointsInside(component, portrait.chinBeard).length > 0);

  return moustache !== undefined && chinBeard !== undefined && moustache !== chinBeard;
}

function overlayRaster(source: string, grid: Grid, fill: string, bounds: Bounds) {
  return nativeRaster(
    source.replace(
      "</svg>",
      `  <rect fill="${fill}" x="${bounds.minX}" y="${bounds.minY}" width="${bounds.maxX - bounds.minX + 1}" height="${bounds.maxY - bounds.minY + 1}" />\n</svg>`,
    ),
    grid,
  );
}

function interruptedMoustacheRaster(source: string, portrait: PortraitSpec) {
  const x = Math.floor((portrait.moustache.minX + portrait.moustache.maxX) / 2);
  return overlayRaster(source, portrait.grid, portrait.skinFills[0]!, { minX: x, minY: portrait.moustache.y, maxX: x, maxY: portrait.moustache.y });
}

function joinedFacialHairRaster(source: string, portrait: PortraitSpec) {
  const x = Math.floor((portrait.chinBeard.minX + portrait.chinBeard.maxX) / 2);
  return overlayRaster(source, portrait.grid, portrait.facialHairFills[0]!, {
    minX: x,
    minY: portrait.moustache.y + 1,
    maxX: x,
    maxY: portrait.chinBeard.minY - 1,
  });
}

describe("Myles 98 portrait facial-hair tightening", () => {
  it.each(PORTRAITS)("keeps $concept $grid px masters source-identical to their public mirror", (portrait) => {
    expect(readFileSync(publicPath(portrait.concept, portrait.grid), "utf8")).toBe(sourceFor(portrait));
  });

  it.each(PORTRAITS)("uses integer-only crisp geometry for $concept $grid px", (portrait) => {
    const source = sourceFor(portrait);

    expect(source).toContain(`viewBox="0 0 ${portrait.grid} ${portrait.grid}"`);
    expect(source).toContain('shape-rendering="crispEdges"');
    expect(source).not.toMatch(/(?:\bd="[^"]*|\b(?:x|y|width|height|points)="[^"]*)\d+\.\d+/i);
  });

  it.each(PORTRAITS)("renders a continuous $concept $grid px moustache above a separate chin beard without closing the glasses openings", async (portrait) => {
    const raster = await nativeRaster(sourceFor(portrait), portrait.grid);
    const glasses = components(pointsForFills(raster, [portrait.glassesFill]));
    const [leftOpening, rightOpening] = glasses
      .map(boundsFor)
      .sort((left, right) => left.minX - right.minX);

    expect(raster.width).toBe(portrait.grid);
    expect(raster.height).toBe(portrait.grid);
    expect(moustacheIsContinuous(raster, portrait)).toBe(true);
    expect(separationShowsSkin(raster, portrait)).toBe(true);
    expect(separateMoustacheAndChinBeard(raster, portrait)).toBe(true);
    expect(glasses).toHaveLength(2);
    expect(leftOpening!.maxX).toBeLessThan(rightOpening!.minX - 1);
    expect(portrait.chinBeard.minY).toBeGreaterThan(rightOpening!.maxY);
  });

  it.each(PORTRAITS)("rejects a one-pixel interruption in the $concept $grid px moustache", async (portrait) => {
    const source = sourceFor(portrait);
    const interrupted = await interruptedMoustacheRaster(source, portrait);

    expect(moustacheIsContinuous(interrupted, portrait)).toBe(false);
  });

  it.each(PORTRAITS)("rejects a one-pixel $concept $grid px moustache-to-chin bridge", async (portrait) => {
    const source = sourceFor(portrait);
    const joined = await joinedFacialHairRaster(source, portrait);

    expect(separationShowsSkin(joined, portrait)).toBe(false);
    expect(separateMoustacheAndChinBeard(joined, portrait)).toBe(false);
  });
});
