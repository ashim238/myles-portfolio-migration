import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const WATER = "#5f99ae";
const PARK = "#78a85d";
const PAPER = "#f3efe7";
const CREASE = "#d8d4cc";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; height: number; width: number; x: number; y: number };

const FRESH_LANDMARKS = new Map<Grid, { park: Rect; water: Rect }>([
  [16, {
    water: { fill: WATER, x: 7, y: 5, width: 3, height: 2 },
    park: { fill: PARK, x: 3, y: 10, width: 2, height: 2 },
  }],
  [24, {
    water: { fill: WATER, x: 11, y: 4, width: 4, height: 2 },
    park: { fill: PARK, x: 4, y: 15, width: 3, height: 2 },
  }],
  [32, {
    water: { fill: WATER, x: 14, y: 5, width: 6, height: 2 },
    park: { fill: PARK, x: 5, y: 19, width: 4, height: 3 },
  }],
]);

const NEWSPRINT = new Map<Grid, { gutter: Rect; page: Rect }>([
  [16, {
    page: { fill: PAPER, x: 1, y: 2, width: 13, height: 8 },
    gutter: { fill: CREASE, x: 7, y: 8, width: 1, height: 2 },
  }],
  [24, {
    page: { fill: PAPER, x: 1, y: 5, width: 21, height: 14 },
    gutter: { fill: CREASE, x: 11, y: 16, width: 1, height: 3 },
  }],
  [32, {
    page: { fill: PAPER, x: 2, y: 6, width: 27, height: 16 },
    gutter: { fill: CREASE, x: 16, y: 18, width: 1, height: 4 },
  }],
]);

function sourceFor(concept: "fresh-greens" | "understandingfafsa", grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function publicSourceFor(concept: "fresh-greens" | "understandingfafsa", grid: Grid) {
  return readFileSync(`public/myles98-icons/${concept}/${concept}-${grid}.svg`, "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function rectsFor(source: string) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)].map(([, attributes]) => ({
    fill: attribute(attributes, "fill")?.toLowerCase() ?? "",
    x: Number(attribute(attributes, "x")),
    y: Number(attribute(attributes, "y")),
    width: Number(attribute(attributes, "width")),
    height: Number(attribute(attributes, "height")),
  }));
}

function includesRect(rects: Rect[], expected: Rect) {
  return rects.some((rect) => (
    rect.fill === expected.fill
    && rect.x === expected.x
    && rect.y === expected.y
    && rect.width === expected.width
    && rect.height === expected.height
  ));
}

async function raster(source: string, grid: Grid) {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function colorAt(data: Buffer, channels: number, width: number, x: number, y: number) {
  const offset = (y * width + x) * channels;
  return `#${[0, 1, 2].map((channel) => data[offset + channel]!.toString(16).padStart(2, "0")).join("")}`;
}

describe("Myles 98 Fresh Greens and UnderstandingFAFSA clarity pass", () => {
  it.each(GRIDS)("uses map-specific water and park landmarks at %ipx, not only a circuit-like street grid", async (grid) => {
    const source = sourceFor("fresh-greens", grid);
    const landmarks = FRESH_LANDMARKS.get(grid)!;
    const rects = rectsFor(source);
    const rendered = await raster(source, grid);

    expect(includesRect(rects, landmarks.water)).toBe(true);
    expect(includesRect(rects, landmarks.park)).toBe(true);
    expect(colorAt(rendered.data, rendered.info.channels, grid, landmarks.water.x, landmarks.water.y)).toBe(WATER);
    expect(colorAt(rendered.data, rendered.info.channels, grid, landmarks.park.x, landmarks.park.y)).toBe(PARK);
    expect(publicSourceFor("fresh-greens", grid)).toBe(source);
  });

  it.each(GRIDS)("uses a deliberately wide printed-newsprint silhouette and a lower print gutter at %ipx", async (grid) => {
    const source = sourceFor("understandingfafsa", grid);
    const expected = NEWSPRINT.get(grid)!;
    const rects = rectsFor(source);
    const rendered = await raster(source, grid);

    expect(includesRect(rects, expected.page)).toBe(true);
    expect(expected.page.width / expected.page.height).toBeGreaterThanOrEqual(1.5);
    expect(includesRect(rects, expected.gutter)).toBe(true);
    expect(colorAt(rendered.data, rendered.info.channels, grid, expected.gutter.x, expected.gutter.y)).toBe(CREASE);
    expect(publicSourceFor("understandingfafsa", grid)).toBe(source);
  });
});
