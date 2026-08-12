import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;

type Concept = "start" | "about-myles";
type Grid = (typeof GRIDS)[number];
type Point = { x: number; y: number };
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
type PortraitSpec = {
  concept: Concept;
  grid: Grid;
  face: Bounds;
  facialHairFills: readonly string[];
  glassesFill: string;
  moustacheY: number;
  chinY: number;
  bridge: Bounds;
};
type NativeRaster = { channels: number; data: Buffer; height: number; width: number };

const PORTRAITS: readonly PortraitSpec[] = [
  {
    concept: "start",
    grid: 16,
    face: { minX: 5, minY: 10, maxX: 10, maxY: 13 },
    facialHairFills: ["#241512", "#2f1915", "#3b2019", "#17100f"],
    glassesFill: "#a9ced0",
    moustacheY: 10,
    chinY: 13,
    bridge: { minX: 7, minY: 12, maxX: 9, maxY: 12 },
  },
  {
    concept: "start",
    grid: 24,
    face: { minX: 9, minY: 16, maxX: 16, maxY: 21 },
    facialHairFills: ["#281613", "#3b2019", "#17100f"],
    glassesFill: "#a8cccd",
    moustacheY: 16,
    chinY: 20,
    bridge: { minX: 12, minY: 19, maxX: 14, maxY: 19 },
  },
  {
    concept: "start",
    grid: 32,
    face: { minX: 12, minY: 22, maxX: 21, maxY: 28 },
    facialHairFills: ["#2a1713", "#3a1f18", "#17100f"],
    glassesFill: "#a6cbcd",
    moustacheY: 22,
    chinY: 27,
    bridge: { minX: 17, minY: 25, maxX: 17, maxY: 26 },
  },
  {
    concept: "about-myles",
    grid: 16,
    face: { minX: 5, minY: 10, maxX: 6, maxY: 11 },
    facialHairFills: ["#14191c", "#17100f"],
    glassesFill: "#a9ced0",
    moustacheY: 10,
    chinY: 11,
    bridge: { minX: 6, minY: 11, maxX: 6, maxY: 11 },
  },
  {
    concept: "about-myles",
    grid: 24,
    face: { minX: 7, minY: 15, maxX: 10, maxY: 17 },
    facialHairFills: ["#271613", "#17100f"],
    glassesFill: "#a9ced0",
    moustacheY: 15,
    chinY: 17,
    bridge: { minX: 7, minY: 16, maxX: 9, maxY: 16 },
  },
  {
    concept: "about-myles",
    grid: 32,
    face: { minX: 9, minY: 19, maxX: 13, maxY: 23 },
    facialHairFills: ["#281613", "#3b2019", "#17100f"],
    glassesFill: "#a8cccd",
    moustacheY: 19,
    chinY: 23,
    bridge: { minX: 11, minY: 22, maxX: 11, maxY: 22 },
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

function hasContinuousMoustacheToChinHair(raster: NativeRaster, portrait: PortraitSpec) {
  const facialHair = pointsForFills(raster, portrait.facialHairFills, portrait.face);
  return components(facialHair).some((component) =>
    component.some(({ y }) => y === portrait.moustacheY) && component.some(({ y }) => y === portrait.chinY),
  );
}

function bridgeRemovedRaster(source: string, portrait: PortraitSpec) {
  const { bridge } = portrait;
  return nativeRaster(
    source.replace(
      "</svg>",
      `  <rect fill="#985d3d" x="${bridge.minX}" y="${bridge.minY}" width="${bridge.maxX - bridge.minX + 1}" height="${bridge.maxY - bridge.minY + 1}" />\n</svg>`,
    ),
    portrait.grid,
  );
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

  it.each(PORTRAITS)("connects $concept $grid px moustache to chin hair without closing the glasses openings", async (portrait) => {
    const raster = await nativeRaster(sourceFor(portrait), portrait.grid);
    const glasses = components(pointsForFills(raster, [portrait.glassesFill]));
    const [leftOpening, rightOpening] = glasses
      .map(boundsFor)
      .sort((left, right) => left.minX - right.minX);

    expect(raster.width).toBe(portrait.grid);
    expect(raster.height).toBe(portrait.grid);
    expect(hasContinuousMoustacheToChinHair(raster, portrait)).toBe(true);
    expect(glasses).toHaveLength(2);
    expect(leftOpening!.maxX).toBeLessThan(rightOpening!.minX - 1);
    expect(portrait.chinY).toBeGreaterThan(rightOpening!.maxY);
  });

  it.each(PORTRAITS)("rejects a one-pixel interruption in the $concept $grid px face-hair bridge", async (portrait) => {
    const source = sourceFor(portrait);
    const withoutBridge = await bridgeRemovedRaster(source, portrait);

    expect(hasContinuousMoustacheToChinHair(withoutBridge, portrait)).toBe(false);
  });
});
