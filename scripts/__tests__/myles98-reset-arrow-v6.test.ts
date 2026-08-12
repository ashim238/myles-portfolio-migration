import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const ACTION_COLORS = new Set(["#8e211e", "#8d211e", "#f15a50"]);

type Grid = 16 | 24 | 32;
type Point = readonly [number, number];
type HeadRow = { y: number; minX: number; maxX: number };
type RestartSpec = {
  grid: Grid;
  tip: Point;
  headZoneMinX: number;
  headRows: readonly HeadRow[];
  gapCorridor: readonly Point[];
  arcAnchors: readonly Point[];
  center: Point;
};

const SPECS: readonly RestartSpec[] = [
  {
    grid: 16,
    tip: [13, 6],
    headZoneMinX: 9,
    headRows: [
      { y: 4, minX: 10, maxX: 11 },
      { y: 5, minX: 10, maxX: 12 },
      { y: 6, minX: 9, maxX: 13 },
      { y: 7, minX: 10, maxX: 12 },
      { y: 8, minX: 11, maxX: 12 },
    ],
    gapCorridor: [[8, 5], [9, 5], [9, 4], [9, 3], [10, 3], [10, 2]],
    arcAnchors: [[2, 8], [7, 13], [12, 10]],
    center: [8, 8],
  },
  {
    grid: 24,
    tip: [20, 8],
    headZoneMinX: 14,
    headRows: [
      { y: 5, minX: 15, maxX: 16 },
      { y: 6, minX: 14, maxX: 17 },
      { y: 7, minX: 14, maxX: 19 },
      { y: 8, minX: 14, maxX: 20 },
      { y: 9, minX: 14, maxX: 19 },
      { y: 10, minX: 15, maxX: 19 },
    ],
    gapCorridor: [[13, 5], [13, 4], [14, 4], [15, 4], [15, 3]],
    arcAnchors: [[4, 10], [12, 20], [19, 12]],
    center: [12, 12],
  },
  {
    grid: 32,
    tip: [28, 9],
    headZoneMinX: 20,
    headRows: [
      { y: 6, minX: 21, maxX: 23 },
      { y: 7, minX: 20, maxX: 25 },
      { y: 8, minX: 20, maxX: 27 },
      { y: 9, minX: 20, maxX: 28 },
      { y: 10, minX: 20, maxX: 27 },
      { y: 11, minX: 21, maxX: 26 },
      { y: 12, minX: 22, maxX: 27 },
    ],
    gapCorridor: [[18, 6], [18, 5], [19, 5], [20, 5], [20, 4]],
    arcAnchors: [[5, 14], [16, 27], [26, 16]],
    center: [16, 16],
  },
];

function sourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "reset-desktop", grid), "utf8");
}

function rgba(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff] as const;
}

async function nativeActionMask(grid: Grid) {
  const source = sourceFor(grid).replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `);
  const { data, info } = await sharp(Buffer.from(source)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const colors = [...ACTION_COLORS].map(rgba);
  const action = Array.from({ length: grid * grid }, (_, index) => {
    const offset = index * info.channels;
    return colors.some((color) => color.every((channel, channelIndex) => data[offset + channelIndex] === channel));
  });
  const opaque = Array.from({ length: grid * grid }, (_, index) => data[index * info.channels + 3] === 0xff);
  return { action, opaque };
}

function at(mask: boolean[], grid: number, [x, y]: Point) {
  return mask[y * grid + x];
}

function topology(mask: boolean[], width: number) {
  const height = mask.length / width;
  const neighbors = (index: number) => {
    const x = index % width;
    const y = Math.floor(index / width);
    return [
      x > 0 ? index - 1 : -1,
      x + 1 < width ? index + 1 : -1,
      y > 0 ? index - width : -1,
      y + 1 < height ? index + width : -1,
    ].filter((candidate) => candidate >= 0);
  };
  const flood = (seed: number, value: boolean, visited: Set<number>) => {
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      for (const neighbor of neighbors(index)) {
        if (visited.has(neighbor) || mask[neighbor] !== value) continue;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  };

  const exterior = new Set<number>();
  for (let x = 0; x < width; x += 1) {
    for (const y of [0, height - 1]) {
      const index = y * width + x;
      if (!mask[index] && !exterior.has(index)) flood(index, false, exterior);
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (const x of [0, width - 1]) {
      const index = y * width + x;
      if (!mask[index] && !exterior.has(index)) flood(index, false, exterior);
    }
  }

  const filled = new Set<number>();
  let components = 0;
  mask.forEach((pixel, index) => {
    if (!pixel || filled.has(index)) return;
    components += 1;
    flood(index, true, filled);
  });
  return { components, enclosedTransparency: mask.filter((pixel, index) => !pixel && !exterior.has(index)).length };
}

function hasExactHeadWedge(mask: boolean[], spec: RestartSpec) {
  const { grid, headZoneMinX, tip, headRows } = spec;
  for (const { y, minX, maxX } of headRows) {
    for (let x = headZoneMinX; x <= tip[0]; x += 1) {
      if (at(mask, grid, [x, y]) !== (x >= minX && x <= maxX)) return false;
    }
  }
  return true;
}

function hasOnePixelApex(mask: boolean[], spec: RestartSpec) {
  const maxX = spec.tip[0];
  return mask.filter((pixel, index) => pixel && index % spec.grid === maxX).length === 1 && at(mask, spec.grid, spec.tip);
}

function preservesRestartAnatomy(mask: boolean[], spec: RestartSpec) {
  const { grid, gapCorridor, arcAnchors, center } = spec;
  const openArc = topology(mask, grid);
  return (
    openArc.components === 1 &&
    openArc.enclosedTransparency === 0 &&
    hasOnePixelApex(mask, spec) &&
    hasExactHeadWedge(mask, spec) &&
    gapCorridor.every((point) => !at(mask, grid, point)) &&
    arcAnchors.every((point) => at(mask, grid, point)) &&
    !at(mask, grid, center)
  );
}

describe("Myles 98 Reset Desktop v6 arrow anatomy", () => {
  it.each(SPECS)("keeps %ipx as a compact arrowhead attached to one open restart loop", async (spec) => {
    const { action, opaque } = await nativeActionMask(spec.grid);

    expect(action).toEqual(opaque);
    expect(preservesRestartAnatomy(action, spec)).toBe(true);
  });

  it.each(SPECS)("rejects a thin diagonal pencil shaft in place of the arrowhead at %ipx", async (spec) => {
    const { action } = await nativeActionMask(spec.grid);
    const pencilLikeShaft = [...action];

    for (const { y } of spec.headRows) {
      for (let x = spec.headZoneMinX; x <= spec.tip[0]; x += 1) pencilLikeShaft[y * spec.grid + x] = false;
    }
    spec.headRows.forEach(({ y }, index) => {
      const x = Math.min(spec.tip[0], spec.headZoneMinX + index);
      pencilLikeShaft[y * spec.grid + x] = true;
    });

    expect(preservesRestartAnatomy(pencilLikeShaft, spec)).toBe(false);
  });

  it.each(SPECS)("rejects a paperclip-like closure that fills the intentional open gap at %ipx", async (spec) => {
    const { action } = await nativeActionMask(spec.grid);
    const paperclipLikeLoop = [...action];
    for (const point of spec.gapCorridor) paperclipLikeLoop[point[1] * spec.grid + point[0]] = true;

    expect(preservesRestartAnatomy(paperclipLikeLoop, spec)).toBe(false);
  });
});
