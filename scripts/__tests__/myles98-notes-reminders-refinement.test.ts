import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const NOTE_LINE_FILL = "#7a536d";
const NOTE_FOLD_FILLS = new Set(["#c49a78", "#fff8ed"]);
const REMINDER_BOX_FILL = "#285c55";
const REMINDER_CHECK_FILL = "#15906f";
const REMINDER_LINE_FILL = "#63766c";
const EXPECTED_NOTE_LINES = new Map([[16, 3], [24, 4], [32, 5]]);
const EXPECTED_REMINDER_PAIRS = new Map([[16, 2], [24, 3], [32, 3]]);

type Grid = (typeof GRIDS)[number];
type Bounds = { minX: number; minY: number; maxX: number; maxY: number };

function sourceFor(concept: "trini-roti" | "reminders", grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, concept, grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function shapesForFill(source: string, fill: string) {
  return [...source.matchAll(/<(path|rect|polygon)\b([^>]*)\/>/gi)]
    .filter(([, , attributes]) => attribute(attributes, "fill")?.toLowerCase() === fill)
    .map(([, element, attributes]) => ({ element: element.toLowerCase(), attributes }));
}

function rectBounds(attributes: string): Bounds {
  const minX = Number(attribute(attributes, "x"));
  const minY = Number(attribute(attributes, "y"));
  return {
    minX,
    minY,
    maxX: minX + Number(attribute(attributes, "width")) - 1,
    maxY: minY + Number(attribute(attributes, "height")) - 1,
  };
}

function fillsFor(source: string) {
  return new Set([...source.matchAll(/\bfill="(#[0-9a-f]{6})"/gi)].map(([, fill]) => fill.toLowerCase()));
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

function pixelsMatching(
  raster: Awaited<ReturnType<typeof nativeRaster>>,
  predicate: (red: number, green: number, blue: number, alpha: number) => boolean,
) {
  return Array.from({ length: raster.width * raster.height }, (_, index) => index).filter((index) => {
    const offset = index * raster.channels;
    return predicate(
      raster.data[offset],
      raster.data[offset + 1],
      raster.data[offset + 2],
      raster.data[offset + 3],
    );
  });
}

function colorPixels(raster: Awaited<ReturnType<typeof nativeRaster>>, fill: string) {
  const value = Number.parseInt(fill.slice(1), 16);
  const target = [value >> 16, (value >> 8) & 0xff, value & 0xff, 0xff];
  return pixelsMatching(raster, (...channels) => target.every((channel, index) => channels[index] === channel));
}

function components(pixels: number[], width: number) {
  const remaining = new Set(pixels);
  const groups: number[][] = [];
  while (remaining.size > 0) {
    const seed = remaining.values().next().value as number;
    const group: number[] = [];
    const queue = [seed];
    remaining.delete(seed);
    while (queue.length > 0) {
      const index = queue.shift()!;
      group.push(index);
      const x = index % width;
      for (const neighbor of [
        x > 0 ? index - 1 : -1,
        x < width - 1 ? index + 1 : -1,
        index - width,
        index + width,
        x > 0 ? index - width - 1 : -1,
        x < width - 1 ? index - width + 1 : -1,
        x > 0 ? index + width - 1 : -1,
        x < width - 1 ? index + width + 1 : -1,
      ]) {
        if (!remaining.has(neighbor)) continue;
        remaining.delete(neighbor);
        queue.push(neighbor);
      }
    }
    groups.push(group);
  }
  return groups;
}

function boundsFor(pixels: number[], width: number): Bounds {
  const xs = pixels.map((index) => index % width);
  const ys = pixels.map((index) => Math.floor(index / width));
  return { minX: Math.min(...xs), minY: Math.min(...ys), maxX: Math.max(...xs), maxY: Math.max(...ys) };
}

function expandedIntersects(left: Bounds, right: Bounds) {
  return left.minX <= right.maxX + 1
    && left.maxX + 1 >= right.minX
    && left.minY <= right.maxY + 1
    && left.maxY + 1 >= right.minY;
}

function containsBounds(outer: Bounds, inner: Bounds) {
  return inner.minX >= outer.minX
    && inner.maxX <= outer.maxX
    && inner.minY >= outer.minY
    && inner.maxY <= outer.maxY;
}

function alphaMask(raster: Awaited<ReturnType<typeof nativeRaster>>) {
  return new Set(pixelsMatching(raster, (_red, _green, _blue, alpha) => alpha === 0xff));
}

function topRowWidth(mask: Set<number>, width: number) {
  const topY = Math.min(...[...mask].map((index) => Math.floor(index / width)));
  return [...mask].filter((index) => Math.floor(index / width) === topY).length;
}

describe("Myles 98 Notes and Reminders native-size separation", () => {
  it.each(GRIDS)("keeps Notes %ipx to one folded memo with a compact handwritten cluster", async (grid) => {
    const source = sourceFor("trini-roti", grid);
    const raster = await nativeRaster(source, grid);
    const handwritten = components(colorPixels(raster, NOTE_LINE_FILL), grid);
    const squareRects = [...source.matchAll(/<rect\b([^>]*)\/>/gi)]
      .map(([, attributes]) => rectBounds(attributes))
      .filter(({ minX, minY, maxX, maxY }) => maxX - minX === maxY - minY);

    expect(handwritten).toHaveLength(EXPECTED_NOTE_LINES.get(grid));
    expect(handwritten.every((line) => {
      const bounds = boundsFor(line, grid);
      return bounds.maxX - bounds.minX > bounds.maxY - bounds.minY;
    })).toBe(true);
    for (const foldFill of NOTE_FOLD_FILLS) {
      expect(colorPixels(raster, foldFill).length, `${grid}px folded-corner fill ${foldFill}`).toBeGreaterThan(0);
    }
    expect(squareRects, "Notes must not contain checklist boxes").toEqual([]);
    expect(components([...alphaMask(raster)], grid)).toHaveLength(1);
  });

  it.each(GRIDS)("gives Reminders %ipx literal checkbox/checkmark pairs without calendar anatomy", async (grid) => {
    const source = sourceFor("reminders", grid);
    const raster = await nativeRaster(source, grid);
    const boxes = shapesForFill(source, REMINDER_BOX_FILL);
    const checks = shapesForFill(source, REMINDER_CHECK_FILL);
    const lineRects = shapesForFill(source, REMINDER_LINE_FILL);

    expect(boxes).toHaveLength(EXPECTED_REMINDER_PAIRS.get(grid));
    expect(checks).toHaveLength(EXPECTED_REMINDER_PAIRS.get(grid));
    expect(boxes.every(({ element, attributes }) => {
      if (element !== "rect") return false;
      const bounds = rectBounds(attributes);
      return bounds.maxX - bounds.minX === bounds.maxY - bounds.minY;
    })).toBe(true);
    expect(checks.every(({ element }) => element === "path")).toBe(true);
    expect(lineRects.length).toBeGreaterThanOrEqual(boxes.length);

    const checkPixels = colorPixels(raster, REMINDER_CHECK_FILL);
    const boxBounds = boxes.map(({ attributes }) => rectBounds(attributes));
    expect(boxBounds.every((box) => checkPixels.some((pixel) => {
      const point = boundsFor([pixel], grid);
      return expandedIntersects(point, box);
    }))).toBe(true);

    const allRects = [...source.matchAll(/<rect\b([^>]*)\/>/gi)].map(([, attributes]) => ({
      fill: attribute(attributes, "fill")?.toLowerCase(),
      bounds: rectBounds(attributes),
    }));
    expect(allRects.every(({ bounds }) => {
      if (bounds.maxX - bounds.minX > bounds.maxY - bounds.minY) return true;
      return boxBounds.some((box) => containsBounds(box, bounds));
    }), "Reminders must not contain ring stems or date-grid columns").toBe(true);
  });

  it.each(GRIDS)("keeps the %ipx memo and checklist silhouettes and palettes non-interchangeable", async (grid) => {
    const noteSource = sourceFor("trini-roti", grid);
    const reminderSource = sourceFor("reminders", grid);
    const note = await nativeRaster(noteSource, grid);
    const reminder = await nativeRaster(reminderSource, grid);
    const noteMask = alphaMask(note);
    const reminderMask = alphaMask(reminder);
    const overlap = [...noteMask].filter((pixel) => reminderMask.has(pixel)).length;
    const union = new Set([...noteMask, ...reminderMask]).size;

    expect([...fillsFor(noteSource)].filter((fill) => fillsFor(reminderSource).has(fill))).toEqual([]);
    expect(overlap / union).toBeLessThan(0.8);
    expect(topRowWidth(reminderMask, grid) - topRowWidth(noteMask, grid)).toBeGreaterThanOrEqual(2);
  });
});
