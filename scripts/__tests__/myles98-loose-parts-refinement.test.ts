import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const OUTLINE_FILL = "#20242a";

type FillBounds = {
  kind: "front-face" | "top-or-side-plane";
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

function attribute(source: string, name: string) {
  return source.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function polygonArea(points: Array<[number, number]>) {
  return Math.abs(
    points.reduce((sum, [x, y], index) => {
      const [nextX, nextY] = points[(index + 1) % points.length];
      return sum + x * nextY - nextX * y;
    }, 0) / 2,
  );
}

function nonBackgroundFillBounds(source: string): FillBounds[] {
  const shapes = [...source.matchAll(/<(rect|polygon)\b([^>]*)\/>/gi)].flatMap(
    ([, element, attributes]) => {
      const fill = attribute(attributes, "fill")?.toLowerCase();
      if (!fill || fill === OUTLINE_FILL) return [];

      if (element.toLowerCase() === "rect") {
        const x = Number(attribute(attributes, "x"));
        const y = Number(attribute(attributes, "y"));
        const width = Number(attribute(attributes, "width"));
        const height = Number(attribute(attributes, "height"));
        return [{ element: "rect" as const, area: width * height, minX: x, minY: y, maxX: x + width, maxY: y + height }];
      }

      const points = (attribute(attributes, "points")?.match(/-?\d+(?:\.\d+)?/g) ?? [])
        .map(Number)
        .reduce<Array<[number, number]>>((pairs, coordinate, index, coordinates) => {
          if (index % 2 === 0) pairs.push([coordinate, coordinates[index + 1]]);
          return pairs;
        }, []);
      if (points.length < 3 || points.some(([, y]) => !Number.isFinite(y))) return [];

      const xs = points.map(([x]) => x);
      const ys = points.map(([, y]) => y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      return [{
        element: "polygon" as const,
        area: polygonArea(points),
        minX,
        minY,
        maxX,
        maxY,
      }];
    },
  );

  const frontFaces = shapes.filter(({ element }) => element === "rect");
  return shapes.map(({ element, area, ...bounds }) => {
    const isNonRectangular = area < (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY);
    const meetsFrontEdge = frontFaces.some((front) => {
      const horizontalOverlap = Math.min(bounds.maxX, front.maxX) - Math.max(bounds.minX, front.minX);
      const verticalOverlap = Math.min(bounds.maxY, front.maxY) - Math.max(bounds.minY, front.minY);
      return (
        (bounds.maxY === front.minY && horizontalOverlap > 0) ||
        (bounds.minX === front.maxX && verticalOverlap > 0)
      );
    });
    return {
      kind: element === "polygon" && isNonRectangular && meetsFrontEdge
        ? "top-or-side-plane" as const
        : "front-face" as const,
      ...bounds,
    };
  });
}

async function alphaFor(source: string, grid: number) {
  const { data, info } = await sharp(
    Buffer.from(source.replace("<svg ", `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return Array.from({ length: grid * grid }, (_, index) => data[index * info.channels + 3]);
}

function analyzeAlphaTopology(alphas: number[], width: number, height: number) {
  const visited = new Set<number>();
  let opaqueComponents = 0;

  alphas.forEach((alpha, seed) => {
    if (alpha !== 255 || visited.has(seed)) return;
    opaqueComponents += 1;
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      const x = index % width;
      const y = Math.floor(index / width);
      const neighbors = [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        y > 0 ? index - width : -1,
        y < height - 1 ? index + width : -1,
      ];
      for (const candidate of neighbors) {
        if (candidate < 0 || visited.has(candidate) || alphas[candidate] !== 255) continue;
        visited.add(candidate);
        queue.push(candidate);
      }
    }
  });

  return { opaqueComponents };
}

describe("Myles 98 Loose Parts volume refinement", () => {
  it("does not mistake an inset highlight for an offset material plane", () => {
    const insetHighlight = [
      '<svg xmlns="http://www.w3.org/2000/svg">',
      '  <rect fill="#123456" x="1" y="1" width="10" height="10" />',
      '  <polygon fill="#abcdef" points="2,2 6,2 6,3 3,3 3,4 2,4" />',
      "</svg>",
    ].join("\n");

    expect(nonBackgroundFillBounds(insetHighlight)).not.toContainEqual(
      expect.objectContaining({ kind: "top-or-side-plane" }),
    );
  });

  it.each(GRIDS)("gives all three %ipx blocks a real offset plane in one cluster", async (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const planes = nonBackgroundFillBounds(source).filter(({ kind }) => kind === "top-or-side-plane");

    expect(source).not.toMatch(/stud|lego|#(?:ff0000|ffff00|0000ff)/i);
    expect(source).toMatch(/<(?:path|polygon)\b/);
    expect(planes).toHaveLength(3);
    expect(nonBackgroundFillBounds(source)).toContainEqual(
      expect.objectContaining({ kind: "top-or-side-plane" }),
    );
    expect(analyzeAlphaTopology(await alphaFor(source, grid), grid, grid).opaqueComponents).toBe(1);
  });
});
