import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { ICON_CONCEPTS, ICON_GRIDS, expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
// These exact pixels form deliberate object anatomy: paperclip openings and reset-arrow negative space.
const INTENTIONAL_ENCLOSED_TRANSPARENCY = new Map<string, string[]>([
  ["resume-24", ["19,3", "19,4"]],
  ["resume-32", ["26,4", "27,4", "27,5", "27,6", "27,7", "27,8", "27,9", "27,10", "27,11", "27,12", "27,13"]],
  ["reset-desktop-32", ["22,6", "5,24", "6,24", "9,25", "10,25", "11,25", "12,25", "13,25"]],
]);
const INTENTIONAL_OPAQUE_COMPONENTS = new Map([
  ["navi-24", 2],
  ["navi-32", 2],
  ["reset-desktop-16", 2],
]);

function sourceFor(concept: string, grid: number) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function analyzeAlphaTopology(alphas: number[], width: number, height: number) {
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
  const flood = (seed: number, value: number, visited: Set<number>) => {
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      for (const candidate of neighbors(index)) {
        if (visited.has(candidate) || alphas[candidate] !== value) continue;
        visited.add(candidate);
        queue.push(candidate);
      }
    }
  };

  const outside = new Set<number>();
  for (let x = 0; x < width; x += 1) {
    for (const y of [0, height - 1]) {
      const index = y * width + x;
      if (alphas[index] === 0 && !outside.has(index)) flood(index, 0, outside);
    }
  }
  for (let y = 0; y < height; y += 1) {
    for (const x of [0, width - 1]) {
      const index = y * width + x;
      if (alphas[index] === 0 && !outside.has(index)) flood(index, 0, outside);
    }
  }

  const opaque = new Set<number>();
  let opaqueComponents = 0;
  alphas.forEach((alpha, index) => {
    if (alpha !== 255 || opaque.has(index)) return;
    opaqueComponents += 1;
    flood(index, 255, opaque);
  });

  return {
    opaqueComponents,
    enclosedTransparency: alphas.flatMap((alpha, index) =>
      alpha === 0 && !outside.has(index)
        ? [`${index % width},${Math.floor(index / width)}`]
        : [],
    ),
  };
}

describe("Myles 98 icon fill integrity", () => {
  it.each(ICON_CONCEPTS.flatMap((concept) => ICON_GRIDS.map((grid) => [concept, grid] as const)))(
    "%s %ipx keeps a transparent one-pixel perimeter",
    async (concept, grid) => {
      const source = sourceFor(concept, grid).replace(
        "<svg ",
        `<svg width="${grid}" height="${grid}" `,
      );
      const { data, info } = await sharp(Buffer.from(source))
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const alphaAt = (x: number, y: number) => data[(y * info.width + x) * info.channels + 3];
      const alphas = Array.from({ length: grid * grid }, (_, index) =>
        data[index * info.channels + 3],
      );
      const perimeter = [
        ...Array.from({ length: grid }, (_, x) => alphaAt(x, 0)),
        ...Array.from({ length: grid }, (_, x) => alphaAt(x, grid - 1)),
        ...Array.from({ length: grid }, (_, y) => alphaAt(0, y)),
        ...Array.from({ length: grid }, (_, y) => alphaAt(grid - 1, y)),
      ];

      expect(info.width).toBe(grid);
      expect(info.height).toBe(grid);
      expect(
        alphas.every((alpha) => alpha === 0 || alpha === 255),
        `${concept}-${grid} contains partially transparent pixels`,
      ).toBe(true);
      expect(
        perimeter.every((alpha) => alpha === 0),
        `${concept}-${grid} touches the canvas edge`,
      ).toBe(true);

      const topology = analyzeAlphaTopology(alphas, grid, grid);
      expect(
        topology.opaqueComponents,
        `${concept}-${grid} contains an unapproved split opaque object`,
      ).toBe(INTENTIONAL_OPAQUE_COMPONENTS.get(`${concept}-${grid}`) ?? 1);
      expect(
        topology.enclosedTransparency,
        `${concept}-${grid} contains an unapproved enclosed transparent fill gap`,
      ).toEqual(INTENTIONAL_ENCLOSED_TRANSPARENCY.get(`${concept}-${grid}`) ?? []);
    },
  );

  it("fails closed when an enclosed gap is slit open, relocated, or split from the object", () => {
    const ring = (width: number, height: number, centerX: number, centerY: number) => {
      const alphas = Array.from({ length: width * height }, () => 0);
      for (let y = centerY - 1; y <= centerY + 1; y += 1) {
        for (let x = centerX - 1; x <= centerX + 1; x += 1) {
          if (x === centerX && y === centerY) continue;
          alphas[y * width + x] = 255;
        }
      }
      return alphas;
    };

    const intact = ring(6, 5, 2, 2);
    expect(analyzeAlphaTopology(intact, 6, 5)).toEqual({
      opaqueComponents: 1,
      enclosedTransparency: ["2,2"],
    });

    const slit = [...intact];
    slit[1 * 6 + 2] = 0;
    expect(analyzeAlphaTopology(slit, 6, 5).enclosedTransparency).not.toEqual(["2,2"]);

    const relocated = ring(6, 5, 3, 2);
    expect(analyzeAlphaTopology(relocated, 6, 5).enclosedTransparency).not.toEqual(["2,2"]);

    const split = Array.from({ length: 25 }, () => 0);
    split[1 * 5 + 1] = 255;
    split[3 * 5 + 3] = 255;
    expect(analyzeAlphaTopology(split, 5, 5).opaqueComponents).toBe(2);
  });

  it("keeps the Reminders noun to a bound checklist pad without a clipped pencil", () => {
    for (const grid of ICON_GRIDS) {
      const source = sourceFor("reminders", grid);
      expect(source).not.toContain("<polygon");
      expect(source).not.toMatch(/#(?:dc7d2d|f4b04f|ba5140)/i);
    }
  });

  it("uses one fully filled road-map tile for Fresh Greens", () => {
    for (const grid of ICON_GRIDS) {
      const source = sourceFor("fresh-greens", grid);
      expect(source).not.toContain("<polygon");
      expect(source).not.toMatch(/#ffffff/i);
      expect(source).not.toMatch(/#(?:613519|5d3218)/i);
    }
  });
});
