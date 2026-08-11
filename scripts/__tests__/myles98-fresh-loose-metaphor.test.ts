import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;

type Pixel = {
  color: string;
  x: number;
  y: number;
};

type Raster = {
  pixels: Pixel[];
};

function sourceFor(concept: "fresh-greens" | "loose-parts", grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

async function rasterFor(concept: "fresh-greens" | "loose-parts", grid: number): Promise<Raster> {
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

  return { pixels };
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

describe("Fresh Greens and Loose Parts native-size metaphors", () => {
  it.each(GRIDS)("renders Fresh Greens %ipx as a thin, continuous asymmetric route rather than a notebook-like band", async (grid) => {
    const raster = await rasterFor("fresh-greens", grid);
    const road = raster.pixels.filter((pixel) => ["#4d5552", "#4b5350"].includes(pixel.color));
    const start = raster.pixels.filter((pixel) => pixel.color === "#205a40");
    const destination = raster.pixels.filter((pixel) => pixel.color === "#f27524");
    const roadComponents = connectedComponents(road);
    const startComponents = connectedComponents(start);
    const destinationComponents = connectedComponents(destination);

    expect(roadComponents).toHaveLength(1);
    const roadComponent = roadComponents[0]!;
    const roadBounds = bounds(roadComponent);
    expect(roadComponent.length).toBeLessThan(grid * grid * 0.14);
    expect(roadBounds.maxX - roadBounds.minX).toBeGreaterThanOrEqual(Math.floor(grid * 0.4));
    expect(roadBounds.maxY - roadBounds.minY).toBeGreaterThanOrEqual(Math.floor(grid * 0.3));
    expect(hasSolidSquare(roadComponent, 3)).toBe(false);

    expect(startComponents).toHaveLength(1);
    expect(destinationComponents).toHaveLength(1);
    const startComponent = startComponents[0]!;
    const destinationComponent = destinationComponents[0]!;
    expect(bounds(startComponent)).not.toEqual(bounds(destinationComponent));
    const startBounds = bounds(startComponent);
    const destinationBounds = bounds(destinationComponent);
    const endpointDistance = Math.hypot(
      (startBounds.minX + startBounds.maxX - destinationBounds.minX - destinationBounds.maxX) / 2,
      (startBounds.minY + startBounds.maxY - destinationBounds.minY - destinationBounds.maxY) / 2,
    );
    expect(endpointDistance).toBeGreaterThanOrEqual(grid * 0.7);
  });

  it.each(GRIDS)("renders Loose Parts %ipx as three scattered, dimensional pieces instead of a connected stair or chart", async (grid) => {
    const raster = await rasterFor("loose-parts", grid);
    const pieces = connectedComponents(raster.pixels);

    expect(pieces).toHaveLength(3);
    expect(pieces.every((piece) => new Set(piece.map((pixel) => pixel.color)).size >= 4)).toBe(true);

    const orderedBounds = pieces
      .map(bounds)
      .sort((left, right) => (left.minX + left.maxX) - (right.minX + right.maxX));
    expect(new Set(orderedBounds.map((piece) => piece.maxY)).size).toBe(3);
    const verticalSteps = [
      orderedBounds[1].minY + orderedBounds[1].maxY - orderedBounds[0].minY - orderedBounds[0].maxY,
      orderedBounds[2].minY + orderedBounds[2].maxY - orderedBounds[1].minY - orderedBounds[1].maxY,
    ];
    expect(verticalSteps[0] * verticalSteps[1]).toBeLessThan(0);
  });
});
