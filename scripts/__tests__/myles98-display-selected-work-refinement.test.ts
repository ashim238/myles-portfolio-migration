import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const DISPLAY_TRACK_FILL = "#6f746e";
const DISPLAY_KNOB_FILL = "#3f7188";
const PROJECT_CARD_FILL = "#f4efe2";
const PROJECT_HEADER_FILLS = new Set(["#4a7d8e", "#b57d28"]);
const EXPECTED_CONTROLS = new Map([[16, 1], [24, 2], [32, 2]]);

type Grid = (typeof GRIDS)[number];
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };
type Raster = Awaited<ReturnType<typeof nativeRaster>>;

const FOLDER_LIP_FILLS = new Map<Grid, string>([
  [16, "#f8db76"],
  [24, "#f6dd8a"],
  [32, "#ffe394"],
]);

function masterSourceFor(concept: "display-properties" | "selected-work", grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function sourceFor(concept: "display-properties" | "selected-work", grid: Grid) {
  const source = masterSourceFor(concept, grid);
  return concept === "selected-work" && process.env.M98_TEST_BREAK_FOLDER_LIP === "1"
    ? withBrokenFolderLip(source, grid)
    : source;
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function rectsForFill(source: string, fill: string) {
  return [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
    .filter(([, attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill)
    .map(([, attributes]) => {
      const minX = Number(attribute(attributes, "x"));
      const minY = Number(attribute(attributes, "y"));
      return {
        minX,
        minY,
        maxX: minX + Number(attribute(attributes, "width")) - 1,
        maxY: minY + Number(attribute(attributes, "height")) - 1,
      };
    });
}

function intersects(left: Bounds, right: Bounds) {
  return left.minX <= right.maxX
    && left.maxX >= right.minX
    && left.minY <= right.maxY
    && left.maxY >= right.minY;
}

function contains(outer: Bounds, inner: Bounds) {
  return inner.minX >= outer.minX
    && inner.maxX <= outer.maxX
    && inner.minY >= outer.minY
    && inner.maxY <= outer.maxY;
}

function hexChannels(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff];
}

async function nativeRaster(source: string, grid: Grid) {
  const { data, info } = await sharp(
    Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)),
  )
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height, channels: info.channels };
}

function alphaTopology(raster: Raster) {
  const alphas = Array.from(
    { length: raster.width * raster.height },
    (_, index) => raster.data[index * raster.channels + 3],
  );
  const neighbors = (index: number) => {
    const x = index % raster.width;
    const y = Math.floor(index / raster.width);
    return [
      x > 0 ? index - 1 : -1,
      x < raster.width - 1 ? index + 1 : -1,
      y > 0 ? index - raster.width : -1,
      y < raster.height - 1 ? index + raster.width : -1,
    ].filter((candidate) => candidate >= 0);
  };
  const visited = new Set<number>();
  let opaqueComponents = 0;
  alphas.forEach((alpha, seed) => {
    if (alpha !== 0xff || visited.has(seed)) return;
    opaqueComponents += 1;
    const queue = [seed];
    visited.add(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      for (const candidate of neighbors(index)) {
        if (visited.has(candidate) || alphas[candidate] !== 0xff) continue;
        visited.add(candidate);
        queue.push(candidate);
      }
    }
  });
  const perimeter = [
    ...Array.from({ length: raster.width }, (_, x) => alphas[x]),
    ...Array.from({ length: raster.width }, (_, x) => alphas[(raster.height - 1) * raster.width + x]),
    ...Array.from({ length: raster.height }, (_, y) => alphas[y * raster.width]),
    ...Array.from({ length: raster.height }, (_, y) => alphas[y * raster.width + raster.width - 1]),
  ];
  const opaque = alphas.flatMap((alpha, index) => alpha === 0xff ? [index] : []);
  const opaqueXs = opaque.map((index) => index % raster.width);
  const topY = Math.min(...opaque.map((index) => Math.floor(index / raster.width)));
  const topRowWidth = opaque.filter((index) => Math.floor(index / raster.width) === topY).length;
  const opaqueBoundsWidth = Math.max(...opaqueXs) - Math.min(...opaqueXs) + 1;
  return { alphas, opaqueComponents, perimeter, topRowWidth, opaqueBoundsWidth };
}

function continuousFolderLip(raster: Raster, cards: Bounds[], headers: Bounds[], fill: string) {
  const [red, green, blue, alpha] = hexChannels(fill);
  const minimumX = Math.min(...cards.map((card) => card.minX));
  const maximumX = Math.max(...cards.map((card) => card.maxX));
  const firstLipRow = Math.max(...headers.map((header) => header.maxY)) + 1;

  return Array.from({ length: raster.height - firstLipRow - 1 }, (_, offset) => firstLipRow + offset)
    .some((y) => Array.from({ length: maximumX - minimumX + 1 }, (_, offset) => minimumX + offset)
      .every((x) => {
        const pixel = (y * raster.width + x) * raster.channels;
        return raster.data[pixel] === red
          && raster.data[pixel + 1] === green
          && raster.data[pixel + 2] === blue
          && raster.data[pixel + 3] === alpha;
      }));
}

function withBrokenFolderLip(source: string, grid: Grid) {
  const fill = FOLDER_LIP_FILLS.get(grid)!;
  const [lip] = rectsForFill(source, fill);
  const width = lip.maxX - lip.minX + 1;
  const splitX = lip.minX + Math.floor(width / 2);
  const leftWidth = splitX - lip.minX;
  const rightX = splitX + 1;
  const rightWidth = lip.maxX - rightX + 1;
  const original = `<rect fill="${fill}" x="${lip.minX}" y="${lip.minY}" width="${width}" height="1" />`;
  const replacement = [
    `<rect fill="${fill}" x="${lip.minX}" y="${lip.minY}" width="${leftWidth}" height="1" />`,
    `<rect fill="${fill}" x="${rightX}" y="${lip.minY}" width="${rightWidth}" height="1" />`,
  ].join("\n  ");
  const broken = source.replace(original, replacement);
  if (broken === source) throw new Error(`${grid}px folder-lip fixture could not be split`);
  return broken;
}

describe("Myles 98 Display Properties and Selected Work refinement", () => {
  it.each(GRIDS)("gives Display Properties %ipx literal in-screen controls without detached TV anatomy", async (grid) => {
    const source = sourceFor("display-properties", grid);
    const tracks = rectsForFill(source, DISPLAY_TRACK_FILL);
    const knobs = rectsForFill(source, DISPLAY_KNOB_FILL);
    const expected = EXPECTED_CONTROLS.get(grid)!;

    expect(tracks).toHaveLength(expected);
    expect(knobs).toHaveLength(expected);
    expect(tracks.every((track) => track.maxX - track.minX > track.maxY - track.minY)).toBe(true);
    expect(knobs.every((knob) => tracks.some((track) => intersects(knob, track)))).toBe(true);

    const raster = await nativeRaster(source, grid);
    const topology = alphaTopology(raster);
    expect(topology.opaqueComponents, "CRT and controls must stay one object, without antenna parts").toBe(1);
    expect(topology.topRowWidth / topology.opaqueBoundsWidth, "CRT must begin with a broad casing, not an antenna").toBeGreaterThan(0.6);
    expect(topology.alphas.every((alpha) => alpha === 0 || alpha === 0xff)).toBe(true);
    expect(topology.perimeter.every((alpha) => alpha === 0)).toBe(true);
  });

  it.each(GRIDS)("shows two distinct project cards inside Selected Work %ipx instead of a photo landscape", async (grid) => {
    const source = sourceFor("selected-work", grid);
    const cards = rectsForFill(source, PROJECT_CARD_FILL);
    const headers = [...PROJECT_HEADER_FILLS].flatMap((fill) => rectsForFill(source, fill));

    expect(cards).toHaveLength(2);
    expect(headers).toHaveLength(2);
    expect(headers.every((header) => cards.some((card) => contains(card, header)))).toBe(true);
    expect(cards.every((card) => headers.filter((header) => contains(card, header)).length === 1)).toBe(true);
    expect(new Set(headers.map((header) => `${header.minX},${header.minY}`)).size).toBe(2);
    expect(source).not.toMatch(/<polygon\b/i);

    const raster = await nativeRaster(source, grid);
    expect(
      continuousFolderLip(raster, cards, headers, FOLDER_LIP_FILLS.get(grid)!),
      "folder front/lip must be one continuous opaque row spanning beneath both project cards",
    ).toBe(true);
    const topology = alphaTopology(raster);
    expect(topology.opaqueComponents, "folder, dossier, and project cards must stay one object").toBe(1);
    expect(topology.alphas.every((alpha) => alpha === 0 || alpha === 0xff)).toBe(true);
    expect(topology.perimeter.every((alpha) => alpha === 0)).toBe(true);
  });

  it.each(GRIDS)("rejects Selected Work %ipx when the folder-front lip is split between its project cards", async (grid) => {
    const source = masterSourceFor("selected-work", grid);
    const cards = rectsForFill(source, PROJECT_CARD_FILL);
    const headers = [...PROJECT_HEADER_FILLS].flatMap((fill) => rectsForFill(source, fill));
    const brokenRaster = await nativeRaster(withBrokenFolderLip(source, grid), grid);

    expect(
      continuousFolderLip(brokenRaster, cards, headers, FOLDER_LIP_FILLS.get(grid)!),
      "a split folder-front lip must not satisfy the dossier-shell contract",
    ).toBe(false);
  });
});
