import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const resumeClipColors = new Set(["#164b80", "#75acd2"]);
const resetActionColors = new Set(["#8e211e", "#8d211e", "#f15a50"]);
const resetRestartArrowContract = new Map([
  [16, {
    tip: [13, 5],
    gap: [9, 3],
    tail: [7, 3],
    leftArc: [3, 8],
    lowerArc: [7, 12],
    rightArc: [11, 8],
    innerNegative: [8, 8],
    minimumWidth: 11,
    minimumHeight: 10,
  }],
  [24, {
    tip: [20, 7],
    gap: [15, 5],
    tail: [11, 4],
    leftArc: [4, 11],
    lowerArc: [11, 19],
    rightArc: [18, 12],
    innerNegative: [12, 12],
    minimumWidth: 17,
    minimumHeight: 16,
  }],
  [32, {
    tip: [28, 10],
    gap: [21, 6],
    tail: [16, 5],
    leftArc: [5, 16],
    lowerArc: [16, 26],
    rightArc: [25, 17],
    innerNegative: [16, 16],
    minimumWidth: 24,
    minimumHeight: 23,
  }],
] as const);

type Pixel = { red: number; green: number; blue: number; alpha: number };
type Bounds = { minX: number; minY: number; maxX: number; maxY: number; width: number; height: number };

function sourceFor(concept: string, grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function hexToPixel(hex: string): Pixel {
  const value = Number.parseInt(hex.slice(1), 16);
  return {
    red: value >> 16,
    green: (value >> 8) & 0xff,
    blue: value & 0xff,
    alpha: 255,
  };
}

async function nativeRaster(source: string, grid: number) {
  return sharp(Buffer.from(source.replace("<svg ", `<svg width="${grid}" height="${grid}" `)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
}

function boundsFor(
  data: Buffer,
  width: number,
  channels: number,
  colors: Set<string>,
): Bounds {
  const targetPixels = [...colors].map(hexToPixel);
  const points: Array<[number, number]> = [];

  for (let index = 0; index < data.length / channels; index += 1) {
    const offset = index * channels;
    const matches = targetPixels.some(
      ({ red, green, blue, alpha }) =>
        data[offset] === red &&
        data[offset + 1] === green &&
        data[offset + 2] === blue &&
        data[offset + 3] === alpha,
    );
    if (matches) points.push([index % width, Math.floor(index / width)]);
  }

  if (points.length === 0) throw new Error("Expected color cluster was absent from native raster");
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return { minX, minY, maxX, maxY, width: maxX - minX + 1, height: maxY - minY + 1 };
}

function colorMask(data: Buffer, channels: number, colors: Set<string>) {
  const targets = [...colors].map(hexToPixel);
  return Array.from({ length: data.length / channels }, (_, index) => {
    const offset = index * channels;
    return targets.some(
      ({ red, green, blue, alpha }) =>
        data[offset] === red &&
        data[offset + 1] === green &&
        data[offset + 2] === blue &&
        data[offset + 3] === alpha,
    );
  });
}

function maskTopology(mask: boolean[], width: number) {
  const height = mask.length / width;
  const neighbors = (index: number) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [
      x > 0 ? index - 1 : -1,
      x < width - 1 ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y < height - 1 ? index + width : -1,
    ].filter((candidate) => candidate >= 0);
  };
  const flood = (seed: number, value: boolean, visited: Set<number>) => {
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      for (const candidate of neighbors(index)) {
        if (visited.has(candidate) || mask[candidate] !== value) continue;
        visited.add(candidate);
        queue.push(candidate);
      }
    }
  };

  const outside = new Set<number>();
  for (let x = 0; x < width; x += 1) {
    for (const y of [0, height - 1]) {
      const index = y * width + x;
      if (!mask[index] && !outside.has(index)) flood(index, false, outside);
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (const x of [0, width - 1]) {
      const index = y * width + x;
      if (!mask[index] && !outside.has(index)) flood(index, false, outside);
    }
  }

  const filled = new Set<number>();
  let components = 0;
  mask.forEach((isFilled, index) => {
    if (!isFilled || filled.has(index)) return;
    components += 1;
    flood(index, true, filled);
  });
  return {
    components,
    enclosedOpenings: mask.filter((isFilled, index) => !isFilled && !outside.has(index)).length,
  };
}

function rectCoverage(source: string, grid: number, colors: Set<string>) {
  const coverage = Array.from({ length: grid * grid }, () => false);
  const rects = [...source.matchAll(/<rect fill="(#[0-9a-f]{6})" x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"\s*\/>/gi)];
  for (const [, color, x, y, width, height] of rects) {
    if (!colors.has(color.toLowerCase())) continue;
    for (let row = Number(y); row < Number(y) + Number(height); row += 1) {
      for (let column = Number(x); column < Number(x) + Number(width); column += 1) {
        coverage[row * grid + column] = true;
      }
    }
  }
  return coverage;
}

function enclosedOpenings(source: string, grid: number, colors: Set<string>) {
  const coverage = rectCoverage(source, grid, colors);
  const outside = new Set<number>();
  const queue: number[] = [];
  const visit = (index: number) => {
    if (!coverage[index] && !outside.has(index)) {
      outside.add(index);
      queue.push(index);
    }
  };

  for (let coordinate = 0; coordinate < grid; coordinate += 1) {
    visit(coordinate);
    visit((grid - 1) * grid + coordinate);
    visit(coordinate * grid);
    visit(coordinate * grid + grid - 1);
  }
  while (queue.length > 0) {
    const index = queue.shift()!;
    const x = index % grid;
    const y = Math.floor(index / grid);
    if (x > 0) visit(index - 1);
    if (x < grid - 1) visit(index + 1);
    if (y > 0) visit(index - grid);
    if (y < grid - 1) visit(index + grid);
  }

  const openings: Array<Array<[number, number]>> = [];
  const visited = new Set<number>();
  coverage.forEach((filled, seed) => {
    if (filled || outside.has(seed) || visited.has(seed)) return;
    const opening: Array<[number, number]> = [];
    const pending = [seed];
    visited.add(seed);
    while (pending.length > 0) {
      const index = pending.shift()!;
      const x = index % grid;
      const y = Math.floor(index / grid);
      opening.push([x, y]);
      for (const neighbor of [x > 0 ? index - 1 : -1, x < grid - 1 ? index + 1 : -1, y > 0 ? index - grid : -1, y < grid - 1 ? index + grid : -1]) {
        if (neighbor >= 0 && !coverage[neighbor] && !outside.has(neighbor) && !visited.has(neighbor)) {
          visited.add(neighbor);
          pending.push(neighbor);
        }
      }
    }
    openings.push(opening);
  });
  return openings;
}

describe("Myles 98 Resume and Reset Desktop refinement", () => {
  it("subordinates Resume's paperclip to one upper-right source opening", () => {
    for (const grid of [24, 32]) {
      const openings = enclosedOpenings(sourceFor("resume", grid), grid, resumeClipColors);
      expect(openings).toHaveLength(1);
      expect(openings[0].every(([x, y]) => x >= grid / 2 && y < grid / 2)).toBe(true);
    }
  });

  it("keeps Resume's paperclip shorter than the document at native size", async () => {
    const resume24 = await nativeRaster(sourceFor("resume", 24), 24);
    const resume32 = await nativeRaster(sourceFor("resume", 32), 32);

    const resume24Bounds = boundsFor(resume24.data, resume24.info.width, resume24.info.channels, resumeClipColors);
    const resume32Bounds = boundsFor(resume32.data, resume32.info.width, resume32.info.channels, resumeClipColors);

    expect(resume24Bounds).toMatchObject({ maxY: expect.any(Number) });
    expect(resume24Bounds.height).toBeLessThanOrEqual(6);
    expect(resume32Bounds.height).toBeLessThanOrEqual(8);
  });

  it("maps every visible Reset Desktop pixel to the restart action, with no device companion", async () => {
    for (const grid of [16, 24, 32]) {
      const reset = await nativeRaster(sourceFor("reset-desktop", grid), grid);
      const action = colorMask(reset.data, reset.info.channels, resetActionColors);
      const opaque = Array.from(
        { length: reset.data.length / reset.info.channels },
        (_, index) => reset.data[index * reset.info.channels + 3] === 0xff,
      );
      expect(action).toEqual(opaque);
    }
  });

  it("renders one stepped restart arrow with a directional tip, circular arc, and intentional gap", async () => {
    for (const [grid, { tip, gap, tail, leftArc, lowerArc, rightArc, innerNegative, minimumWidth, minimumHeight }] of resetRestartArrowContract) {
      const reset = await nativeRaster(sourceFor("reset-desktop", grid), grid);
      const mask = colorMask(reset.data, reset.info.channels, resetActionColors);
      const actionBounds = boundsFor(reset.data, reset.info.width, reset.info.channels, resetActionColors);
      const at = (x: number, y: number) => mask[y * grid + x];

      expect(maskTopology(mask, grid)).toEqual({ components: 1, enclosedOpenings: 0 });
      expect(at(...tip)).toBe(true);
      expect(at(...gap)).toBe(false);
      expect(at(...tail)).toBe(true);
      expect(at(...leftArc)).toBe(true);
      expect(at(...lowerArc)).toBe(true);
      expect(at(...rightArc)).toBe(true);
      expect(at(...innerNegative)).toBe(false);
      expect(actionBounds.maxX).toBe(tip[0]);
      expect(mask.filter((filled, index) => filled && index % grid === tip[0])).toHaveLength(1);
      expect(actionBounds.width).toBeGreaterThanOrEqual(minimumWidth);
      expect(actionBounds.height).toBeGreaterThanOrEqual(minimumHeight);
      expect(mask.filter(Boolean).length / (actionBounds.width * actionBounds.height)).toBeLessThan(0.56);
    }
  });
});
