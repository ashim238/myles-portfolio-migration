import { readFileSync } from "node:fs";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const PAPER = "#f3efe7";
const BACK_PAGE = "#d2cec6";
const PAGE_SHADOW = "#6c6962";
const MASTHEAD_BLUE = "#1f679f";
const HEADLINE_INK = "#29282a";
const FOLD_CREASE = "#d8d4cc";
const FOLD_FACE = "#eeeae3";
const PHOTO = "#a7bcc2";
const COPY_INK = "#6c6962";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; x: number; y: number; width: number; height: number };

function sourceFor(grid: Grid) {
  return readFileSync(expectedMasterPath(ROOT, "understandingfafsa", grid), "utf8");
}

function attribute(attributes: string, name: string) {
  return attributes.match(new RegExp(`\\b${name}="([^"]+)"`, "i"))?.[1];
}

function rectsFor(source: string): Rect[] {
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

function rectMarkup(rect: Rect) {
  return `<rect fill="${rect.fill}" x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" />`;
}

function largest(rects: Rect[]) {
  return [...rects].sort((left, right) => right.width * right.height - left.width * left.height)[0];
}

function isPhysicalFoldedNewsletter(source: string, grid: Grid) {
  const rects = rectsFor(source);
  const page = exactRects(rects, PAPER)[0];
  const back = largest(exactRects(rects, BACK_PAGE));
  const shadow = largest(exactRects(rects, PAGE_SHADOW));
  const mastheads = exactRects(rects, MASTHEAD_BLUE).sort((left, right) => left.x - right.x);
  const headline = exactRects(rects, HEADLINE_INK)[0];
  const crease = exactRects(rects, FOLD_CREASE)[0];
  const foldFace = exactRects(rects, FOLD_FACE)[0];
  const photo = exactRects(rects, PHOTO)[0];
  const copy = exactRects(rects, COPY_INK).filter((rect) => (
    rect.width < page!.width / 2
    && rect.x >= page!.x
    && rect.x + rect.width <= page!.x + page!.width
    && rect.y >= page!.y
    && rect.y + rect.height <= page!.y + page!.height
  ));

  if (!page || !back || !shadow || !headline || !crease || !foldFace || !photo || mastheads.length !== 3) return false;

  const mastheadGaps = mastheads.slice(1).map((masthead, index) => masthead.x - (mastheads[index]!.x + mastheads[index]!.width));
  const hasBrowserBar = rects.some((rect) => (
    rect.fill === MASTHEAD_BLUE
    && rect.y <= page.y + 1
    && rect.x <= page.x
    && rect.width >= Math.ceil(page.width * 0.7)
  ));

  return page.width / page.height >= 1.2
    && back.x > page.x
    && back.y > page.y
    && shadow.x > back.x
    && shadow.y > back.y
    && mastheads.every((masthead) => (
      masthead.height === 1
      && masthead.y === page.y + 1
      && masthead.width <= Math.ceil(page.width * 0.35)
    ))
    && mastheadGaps.every((gap) => gap >= 1)
    && headline.height === 1
    && headline.y >= page.y + 2
    && headline.width >= Math.floor(page.width * 0.6)
    && crease.height === 1
    && crease.x > page.x
    && crease.y > headline.y
    && crease.width >= Math.floor(page.width * 0.75)
    && foldFace.x === crease.x
    && foldFace.y === crease.y + 1
    && foldFace.width === crease.width
    && foldFace.height >= (grid === 16 ? 3 : 4)
    && photo.y > headline.y
    && photo.width < page.width / 2
    && copy.length >= (grid === 16 ? 3 : 8)
    && !hasBrowserBar;
}

async function nativeRaster(source: string, grid: Grid) {
  const { data, info } = await sharp(Buffer.from(source.replace(/<svg\s+/, `<svg width="${grid}" height="${grid}" `)))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { data, info };
}

function flattenPaperStack(source: string) {
  const rects = rectsFor(source);
  const page = exactRects(rects, PAPER)[0]!;
  const back = largest(exactRects(rects, BACK_PAGE))!;
  const shadow = largest(exactRects(rects, PAGE_SHADOW))!;
  return source
    .replace(rectMarkup(back), `<rect fill="${BACK_PAGE}" x="${page.x}" y="${page.y}" width="${page.width}" height="${page.height}" />`)
    .replace(rectMarkup(shadow), `<rect fill="${PAGE_SHADOW}" x="${page.x}" y="${page.y}" width="${page.width}" height="${page.height}" />`);
}

function turnMastheadIntoBrowserChrome(source: string) {
  const rects = rectsFor(source);
  const page = exactRects(rects, PAPER)[0]!;
  const mastheads = exactRects(rects, MASTHEAD_BLUE);
  const withoutTypeBlocks = mastheads.reduce((current, masthead) => current.replace(rectMarkup(masthead), ""), source);
  return withoutTypeBlocks.replace(
    rectMarkup(page),
    `${rectMarkup(page)}\n  <rect fill="${MASTHEAD_BLUE}" x="${page.x}" y="${page.y}" width="${page.width}" height="2" />`,
  );
}

function collapseFoldIntoDashboardTile(source: string) {
  const foldFace = exactRects(rectsFor(source), FOLD_FACE)[0]!;
  return source.replace(
    rectMarkup(foldFace),
    `<rect fill="${FOLD_FACE}" x="${foldFace.x}" y="${foldFace.y}" width="${Math.max(1, Math.floor(foldFace.width / 3))}" height="${foldFace.height}" />`,
  );
}

describe("Myles 98 UnderstandingFAFSA v7 physical-newsprint anatomy", () => {
  it.each(GRIDS)("renders %ipx as a wide folded printed newsletter with paper depth and a tangible crease", async (grid) => {
    const source = sourceFor(grid);
    const { data, info } = await nativeRaster(source, grid);
    const alpha = Array.from({ length: info.width * info.height }, (_, index) => data[index * info.channels + 3]);
    const perimeter = [
      ...Array.from({ length: grid }, (_, x) => alpha[x]),
      ...Array.from({ length: grid }, (_, x) => alpha[(grid - 1) * grid + x]),
      ...Array.from({ length: grid }, (_, y) => alpha[y * grid]),
      ...Array.from({ length: grid }, (_, y) => alpha[y * grid + grid - 1]),
    ];

    expect(isPhysicalFoldedNewsletter(source, grid)).toBe(true);
    expect(info.width).toBe(grid);
    expect(info.height).toBe(grid);
    expect(alpha.every((value) => value === 0 || value === 255)).toBe(true);
    expect(perimeter.every((value) => value === 0)).toBe(true);
    expect(source).not.toMatch(/<(?:path|polygon|polyline|circle|ellipse|line|text|use)\b|\b(?:filter|stroke|transform|opacity)=/i);
  });

  it.each(GRIDS)("rejects %ipx flat-screen, browser-chrome, and dashboard-tile mutations", (grid) => {
    const source = sourceFor(grid);

    expect(isPhysicalFoldedNewsletter(source, grid)).toBe(true);
    expect(isPhysicalFoldedNewsletter(flattenPaperStack(source), grid)).toBe(false);
    expect(isPhysicalFoldedNewsletter(turnMastheadIntoBrowserChrome(source), grid)).toBe(false);
    expect(isPhysicalFoldedNewsletter(collapseFoldIntoDashboardTile(source), grid)).toBe(false);
  });
});
