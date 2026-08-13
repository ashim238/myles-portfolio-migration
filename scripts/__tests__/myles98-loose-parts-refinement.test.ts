import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const FRONT_FILLS = ["#c58c45", "#d6a45c", "#c89149"];
const LEGACY_PRODUCT_FILLS = ["#667d91", "#5f8d73", "#bd7654", "#90a7b5", "#8eaf8d", "#d69c78"];

type Grid = (typeof GRIDS)[number];
type Pixel = { x: number; y: number };
type Rect = { fill: string; height: number; width: number; x: number; y: number };

function attribute(source: string, name: string) {
  return source.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function rectsFor(source: string, fills: string[]) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .map(([, attributes]) => ({
      fill: attribute(attributes, "fill")?.toLowerCase() ?? "",
      height: Number(attribute(attributes, "height")),
      width: Number(attribute(attributes, "width")),
      x: Number(attribute(attributes, "x")),
      y: Number(attribute(attributes, "y")),
    }))
    .filter((rect): rect is Rect => fills.includes(rect.fill));
}

async function nativePixels(source: string, grid: Grid) {
  const rendered = source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `);
  const { data, info } = await sharp(Buffer.from(rendered))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const opaque: Pixel[] = [];
  const alpha: number[] = [];

  for (let y = 0; y < grid; y += 1) {
    for (let x = 0; x < grid; x += 1) {
      const value = data[(y * info.width + x) * info.channels + 3]!;
      alpha.push(value);
      if (value === 0xff) opaque.push({ x, y });
    }
  }

  return { alpha, opaque };
}

function components(pixels: Pixel[]) {
  const remaining = new Set(pixels.map(({ x, y }) => `${x},${y}`));
  let count = 0;

  while (remaining.size > 0) {
    count += 1;
    const [seed] = remaining;
    const queue = [seed!];
    remaining.delete(seed!);
    while (queue.length > 0) {
      const current = queue.pop()!;
      const [x, y] = current.split(",").map(Number);
      for (const neighbor of [`${x - 1},${y}`, `${x + 1},${y}`, `${x},${y - 1}`, `${x},${y + 1}`]) {
        if (!remaining.delete(neighbor)) continue;
        queue.push(neighbor);
      }
    }
  }

  return count;
}

function hasClearPerimeter(alpha: number[], grid: Grid) {
  return Array.from({ length: grid }, (_, coordinate) => [
    alpha[coordinate],
    alpha[(grid - 1) * grid + coordinate],
    alpha[coordinate * grid],
    alpha[coordinate * grid + grid - 1],
  ]).flat().every((value) => value === 0);
}

describe("Myles 98 Loose Parts wooden construction blocks", () => {
  it.each(GRIDS)("keeps the %ipx master as a compact, connected 2+1 stack", async (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const fronts = rectsFor(source, FRONT_FILLS).sort((left, right) => left.y - right.y || left.x - right.x);
    const [upper, left, right] = fronts;
    const raster = await nativePixels(source, grid);

    expect(source).not.toMatch(new RegExp(LEGACY_PRODUCT_FILLS.join("|"), "i"));
    expect(source).not.toMatch(/<path\b|<circle\b|<ellipse\b|stud|lego|boot|shoe|toe|sole|book|page|person|people|head|leg|arm/i);
    expect(fronts).toHaveLength(3);
    expect(fronts.every(({ width, height }) => width === height)).toBe(true);
    expect(upper!.width).toBe(left!.width);
    expect(upper!.width).toBe(right!.width);
    expect(left!.y).toBe(right!.y);
    expect(upper!.y + upper!.height).toBeLessThanOrEqual(left!.y);
    const upperDepth = Math.ceil((left!.y - upper!.y - upper!.height) / 2);
    expect(upper!.x - upperDepth).toBeLessThan(left!.x + left!.width);
    expect(upper!.x + upper!.width + upperDepth).toBeGreaterThan(left!.x);
    expect(upper!.x + upper!.width + upperDepth).toBeLessThan(right!.x + upperDepth);
    expect(raster.alpha.every((value) => value === 0 || value === 0xff)).toBe(true);
    expect(hasClearPerimeter(raster.alpha, grid)).toBe(true);
    expect(components(raster.opaque)).toBe(1);
  });
});
