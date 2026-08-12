import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const OUTLINE_FILL = "#20242a";

type Grid = (typeof GRIDS)[number];
type Pixel = {
  color: string;
  x: number;
  y: number;
};
type FillBounds = {
  kind: "front-face" | "top-or-side-plane";
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};
type Rect = {
  fill: string;
  height: number;
  width: number;
  x: number;
  y: number;
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
  const shapes: Array<{
    element: "rect" | "polygon";
    area: number;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  }> = [];

  for (const match of source.matchAll(/<(rect|polygon)\b([^>]*)\/>/gi)) {
    const [, elementName, attributes] = match;
    const fill = attribute(attributes, "fill")?.toLowerCase();
    if (!fill || fill === OUTLINE_FILL) continue;

    if (elementName.toLowerCase() === "rect") {
      const x = Number(attribute(attributes, "x"));
      const y = Number(attribute(attributes, "y"));
      const width = Number(attribute(attributes, "width"));
      const height = Number(attribute(attributes, "height"));
      shapes.push({ element: "rect", area: width * height, minX: x, minY: y, maxX: x + width, maxY: y + height });
      continue;
    }

    const coordinates = (attribute(attributes, "points")?.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
    const points: Array<[number, number]> = [];
    for (let index = 0; index < coordinates.length; index += 2) {
      points.push([coordinates[index]!, coordinates[index + 1]!]);
    }
    if (points.length < 3 || points.some(([x, y]) => !Number.isFinite(x) || !Number.isFinite(y))) continue;

    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    shapes.push({
      element: "polygon",
      area: polygonArea(points),
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    });
  }

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

function frontFacesFor(source: string): Rect[] {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .map(([, attributes]) => ({
      fill: attribute(attributes, "fill")?.toLowerCase(),
      height: Number(attribute(attributes, "height")),
      width: Number(attribute(attributes, "width")),
      x: Number(attribute(attributes, "x")),
      y: Number(attribute(attributes, "y")),
    }))
    .filter((rect): rect is Rect =>
      Boolean(rect.fill) &&
      rect.fill !== OUTLINE_FILL &&
      Number.isFinite(rect.x) &&
      Number.isFinite(rect.y) &&
      rect.width > 1 &&
      rect.height > 1,
    );
}

function outlinePolygonsFor(source: string) {
  return [...source.matchAll(/<polygon\b([^>]*)\/>/gi)]
    .filter(([, attributes]) => attribute(attributes, "fill")?.toLowerCase() === OUTLINE_FILL);
}

async function rasterFor(source: string, grid: Grid) {
  const rendered = source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `);
  const { data, info } = await sharp(Buffer.from(rendered))
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

  it.each(GRIDS)("renders a literal 2+1 stack of three non-branded blocks at %ipx", async (grid) => {
    const source = readFileSync(expectedMasterPath(ROOT, "loose-parts", grid), "utf8");
    const planes = nonBackgroundFillBounds(source).filter(({ kind }) => kind === "top-or-side-plane");
    const cluster = connectedComponents(await rasterFor(source, grid));
    const frontFaces = frontFacesFor(source).sort((left, right) => left.y - right.y || left.x - right.x);
    const [top, ...lowerRow] = frontFaces;
    const [left, right] = lowerRow;

    expect(source).not.toMatch(/<(?:circle|ellipse)\b|stud|lego|#(?:ff0000|ffff00|0000ff)/i);
    expect(outlinePolygonsFor(source)).toHaveLength(3);
    expect(planes).toHaveLength(3);
    expect(cluster).toHaveLength(1);
    expect(new Set(cluster[0]!.map((pixel) => pixel.color)).size).toBeGreaterThanOrEqual(10);

    expect(frontFaces).toHaveLength(3);
    expect(top).toBeDefined();
    expect(left).toBeDefined();
    expect(right).toBeDefined();
    expect(left!.y).toBe(right!.y);
    expect(top!.y + top!.height).toBeLessThanOrEqual(left!.y);
    expect([top!.width, left!.width, right!.width]).toEqual([
      left!.width,
      left!.width,
      left!.width,
    ]);
    expect(top!.x).toBeGreaterThan(left!.x);
    expect(top!.x).toBeLessThanOrEqual(left!.x + left!.width);
    expect(top!.x + top!.width).toBeGreaterThanOrEqual(right!.x);
    expect(top!.x + top!.width).toBeLessThan(right!.x + right!.width);
  });
});
