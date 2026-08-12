import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const PAPER = "#f3efe7";
const PRINT_INK = "#29282a";
const MASTHEAD_BLUE = "#1f679f";
const HEADLINE_INK = "#3c3c3e";
const DECK_INK = "#5f889f";
const COPY_INK = "#6c6962";
const PHOTO = "#a7bcc2";
const LOWER_LEFT = "#c5963a";
const LOWER_RIGHT = "#d8d4cc";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; x: number; y: number; width: number; height: number };

function sourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "understandingfafsa", grid), "utf8");
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

function exactRects(rects: Rect[], fill: string) {
  return rects.filter((rect) => rect.fill === fill);
}

function isPhysicalEditorialPage(source: string, grid: Grid) {
  const rects = rectsFor(source);
  const paper = exactRects(rects, PAPER);
  const masthead = exactRects(rects, MASTHEAD_BLUE);
  const printMark = exactRects(rects, PRINT_INK);
  const headline = exactRects(rects, HEADLINE_INK);
  const deck = exactRects(rects, DECK_INK);
  const copy = exactRects(rects, COPY_INK);
  const photo = exactRects(rects, PHOTO);
  const lowerLeft = exactRects(rects, LOWER_LEFT);
  const lowerRight = exactRects(rects, LOWER_RIGHT);

  if (paper.length !== 1 || masthead.length !== 1 || headline.length !== 1 || photo.length !== 1 || lowerLeft.length !== 1 || lowerRight.length !== 1) {
    return false;
  }

  const page = paper[0]!;
  const rule = masthead[0]!;
  const title = headline[0]!;
  const [firstDeck, secondDeck] = deck;
  const isMicro = grid === 16;

  return page.height > page.width &&
    rule.height === 1 &&
    rule.y > page.y &&
    rule.y < page.y + Math.ceil(page.height / 2) &&
    rule.x > page.x &&
    rule.x + rule.width < page.x + page.width &&
    rule.width >= Math.ceil(page.width * 0.7) &&
    printMark.length >= 3 &&
    printMark.every((mark) => mark.height === 1 && mark.y < rule.y && mark.width < page.width / 2) &&
    new Set(printMark.map((mark) => mark.y)).size === 1 &&
    title.height === 1 &&
    title.y > rule.y &&
    title.width >= Math.floor(page.width * 0.65) &&
    deck.length === 2 &&
    firstDeck!.height === 1 &&
    secondDeck!.height === 1 &&
    firstDeck!.y + 1 === secondDeck!.y &&
    firstDeck!.width > secondDeck!.width &&
    firstDeck!.y > title.y &&
    photo[0]!.y > secondDeck!.y &&
    lowerLeft[0]!.y > secondDeck!.y &&
    lowerRight[0]!.y > secondDeck!.y &&
    lowerLeft[0]!.x + lowerLeft[0]!.width < lowerRight[0]!.x &&
    copy.length >= (isMicro ? 1 : 3) &&
    copy.every((line) => line.height === 1 && line.width < page.width / 2) &&
    !rects.some((rect) => rect.fill === PRINT_INK && rect.width >= Math.ceil(page.width * 0.6));
}

async function nativeRaster(source: string, grid: Grid) {
  const { data, info } = await sharp(Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function mutateRuleIntoBrowserChrome(source: string, grid: Grid) {
  const paper = exactRects(rectsFor(source), PAPER)[0]!;
  const masthead = exactRects(rectsFor(source), MASTHEAD_BLUE)[0]!;
  const original = `<rect fill="${MASTHEAD_BLUE}" x="${masthead.x}" y="${masthead.y}" width="${masthead.width}" height="${masthead.height}" />`;
  const chrome = `<rect fill="${MASTHEAD_BLUE}" x="${paper.x}" y="${paper.y}" width="${paper.width}" height="${grid === 16 ? 2 : 3}" />`;
  return source.replace(original, chrome);
}

function mutateDeckIntoDashboardTile(source: string) {
  const deck = exactRects(rectsFor(source), DECK_INK)[0]!;
  const original = `<rect fill="${DECK_INK}" x="${deck.x}" y="${deck.y}" width="${deck.width}" height="${deck.height}" />`;
  const tile = `<rect fill="${DECK_INK}" x="${deck.x}" y="${deck.y}" width="${deck.width}" height="3" />`;
  return source.replace(original, tile);
}

describe("Myles 98 UnderstandingFAFSA v6 printed-editorial anatomy", () => {
  it.each(GRIDS)("renders %ipx as a physical newsletter with masthead, headline, copy, photo, and page shadow", async (grid) => {
    const source = sourceFor(grid);
    const { data, info } = await nativeRaster(source, grid);
    const alpha = Array.from({ length: info.width * info.height }, (_, index) => data[index * info.channels + 3]);
    const perimeter = [
      ...Array.from({ length: grid }, (_, x) => alpha[x]),
      ...Array.from({ length: grid }, (_, x) => alpha[(grid - 1) * grid + x]),
      ...Array.from({ length: grid }, (_, y) => alpha[y * grid]),
      ...Array.from({ length: grid }, (_, y) => alpha[y * grid + grid - 1]),
    ];

    expect(isPhysicalEditorialPage(source, grid)).toBe(true);
    expect(info.width).toBe(grid);
    expect(info.height).toBe(grid);
    expect(alpha.every((value) => value === 0 || value === 255)).toBe(true);
    expect(perimeter.every((value) => value === 0)).toBe(true);
    expect(source).not.toMatch(/<(?:path|polygon|polyline|circle|ellipse|line|text|use)\b|\b(?:filter|stroke|transform|opacity)=/i);
  });

  it.each(GRIDS)("rejects %ipx browser chrome and dashboard-tile mutations", (grid) => {
    const source = sourceFor(grid);

    expect(isPhysicalEditorialPage(source, grid)).toBe(true);
    expect(isPhysicalEditorialPage(mutateRuleIntoBrowserChrome(source, grid), grid)).toBe(false);
    expect(isPhysicalEditorialPage(mutateDeckIntoDashboardTile(source), grid)).toBe(false);
  });
});
