import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const GPS_BEZEL = "#27312b";
const GPS_HOUSING = "#627353";
const GPS_SCREEN = "#d8dfc3";
const GPS_CONTROL = "#205a40";
const DESTINATION_FILL = "#f27524";
const LOOSE_FRONT_FILLS = ["#c58c45", "#d6a45c", "#c89149"];
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

describe("Fresh Greens and Loose Parts native-size metaphors", () => {
  it.each(GRIDS)("renders Fresh Greens %ipx as a physical GPS navigator, not a folded map or generic screen", async (grid) => {
    const raster = await rasterFor("fresh-greens", grid);
    const bezel = raster.filter((pixel) => pixel.color === GPS_BEZEL);
    const housing = raster.filter((pixel) => pixel.color === GPS_HOUSING);
    const screen = raster.filter((pixel) => pixel.color === GPS_SCREEN);
    const control = raster.filter((pixel) => pixel.color === GPS_CONTROL);
    const destination = raster.filter((pixel) => pixel.color === DESTINATION_FILL);

    expect(connectedComponents(raster)).toHaveLength(1);
    expect(bezel.length).toBeGreaterThan(housing.length * 0.25);
    expect(housing.length).toBeGreaterThan(screen.length);
    expect(screen.length).toBeGreaterThan(destination.length * 5);
    expect(control.length).toBeGreaterThanOrEqual(grid === 16 ? 2 : 4);
    expect(destination.length).toBeGreaterThan(0);
    const bezelBounds = bounds(bezel);
    const screenBounds = bounds(screen);
    const controlBounds = bounds(control);
    expect(bezelBounds.minX).toBeLessThan(screenBounds.minX);
    expect(bezelBounds.maxX).toBeGreaterThan(screenBounds.maxX);
    expect(controlBounds.minY).toBeGreaterThan(screenBounds.maxY);
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
    const stackDepth = Math.ceil((left!.minY - upper!.maxY) / 2) + 1;
    expect(upper!.minX - stackDepth).toBeLessThanOrEqual(left!.maxX);
    expect(upper!.maxX + stackDepth).toBeGreaterThanOrEqual(right!.minX);
  });
});
