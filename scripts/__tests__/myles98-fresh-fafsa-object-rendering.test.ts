import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { expectedMasterPath } from "../lib/myles98-icon-contract.mjs";

const ROOT = "docs/design-assets/myles98-icons";
const GRIDS = [16, 24, 32] as const;
const GPS_BEZEL = "#27312b";
const GPS_HOUSING = "#627353";
const GPS_SCREEN = "#d8dfc3";
const GPS_CONTROL = "#205a40";
const PAPER = "#f3efe7";
const BACK_PAGE = "#d2cec6";
const PAGE_SHADOW = "#6c6962";
const PAGE_EDGE = "#b8b4ad";
const GUTTER = "#d8d4cc";

type Grid = (typeof GRIDS)[number];
type Rect = { fill: string; height: number; width: number; x: number; y: number };

const GPS = new Map<Grid, { bezel: Rect; control: Rect; housing: Rect; screen: Rect }>([
  [16, {
    bezel: { fill: GPS_BEZEL, x: 3, y: 3, width: 10, height: 12 },
    housing: { fill: GPS_HOUSING, x: 4, y: 4, width: 8, height: 10 },
    screen: { fill: GPS_SCREEN, x: 6, y: 6, width: 4, height: 2 },
    control: { fill: GPS_CONTROL, x: 6, y: 10, width: 1, height: 3 },
  }],
  [24, {
    bezel: { fill: GPS_BEZEL, x: 5, y: 4, width: 14, height: 18 },
    housing: { fill: GPS_HOUSING, x: 6, y: 5, width: 12, height: 16 },
    screen: { fill: GPS_SCREEN, x: 8, y: 8, width: 8, height: 4 },
    control: { fill: GPS_CONTROL, x: 10, y: 15, width: 1, height: 3 },
  }],
  [32, {
    bezel: { fill: GPS_BEZEL, x: 7, y: 5, width: 18, height: 23 },
    housing: { fill: GPS_HOUSING, x: 8, y: 6, width: 16, height: 21 },
    screen: { fill: GPS_SCREEN, x: 10, y: 9, width: 12, height: 6 },
    control: { fill: GPS_CONTROL, x: 12, y: 19, width: 2, height: 5 },
  }],
]);

const NEWSLETTER = new Map<Grid, { back: Rect; edge: Rect; gutter: Rect; page: Rect; shadow: Rect }>([
  [16, {
    page: { fill: PAPER, x: 1, y: 2, width: 12, height: 8 },
    back: { fill: BACK_PAGE, x: 3, y: 4, width: 11, height: 7 },
    shadow: { fill: PAGE_SHADOW, x: 4, y: 5, width: 11, height: 8 },
    edge: { fill: PAGE_EDGE, x: 12, y: 3, width: 1, height: 7 },
    gutter: { fill: GUTTER, x: 7, y: 8, width: 1, height: 2 },
  }],
  [24, {
    page: { fill: PAPER, x: 1, y: 3, width: 19, height: 13 },
    back: { fill: BACK_PAGE, x: 3, y: 5, width: 18, height: 13 },
    shadow: { fill: PAGE_SHADOW, x: 4, y: 6, width: 19, height: 14 },
    edge: { fill: PAGE_EDGE, x: 19, y: 4, width: 1, height: 12 },
    gutter: { fill: GUTTER, x: 11, y: 13, width: 1, height: 3 },
  }],
  [32, {
    page: { fill: PAPER, x: 2, y: 4, width: 24, height: 16 },
    back: { fill: BACK_PAGE, x: 3, y: 6, width: 24, height: 16 },
    shadow: { fill: PAGE_SHADOW, x: 5, y: 8, width: 24, height: 17 },
    edge: { fill: PAGE_EDGE, x: 25, y: 5, width: 1, height: 15 },
    gutter: { fill: GUTTER, x: 16, y: 17, width: 1, height: 3 },
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

function hasRect(rects: Rect[], expected: Rect) {
  return rects.some((rect) => (
    rect.fill === expected.fill
    && rect.x === expected.x
    && rect.y === expected.y
    && rect.width === expected.width
    && rect.height === expected.height
  ));
}

function contains(outer: Rect, inner: Rect) {
  return inner.x > outer.x
    && inner.y > outer.y
    && inner.x + inner.width < outer.x + outer.width
    && inner.y + inner.height < outer.y + outer.height;
}

function isGpsNavigator(source: string, grid: Grid) {
  const spec = GPS.get(grid)!;
  const rects = rectsFor(source);
  return [spec.bezel, spec.housing, spec.screen, spec.control].every((rect) => hasRect(rects, rect))
    && contains(spec.bezel, spec.housing)
    && contains(spec.housing, spec.screen)
    && spec.control.y > spec.screen.y + spec.screen.height
    && spec.control.x > spec.housing.x
    && spec.control.x + spec.control.width < spec.housing.x + spec.housing.width;
}

function isPrintedPacket(source: string, grid: Grid) {
  const spec = NEWSLETTER.get(grid)!;
  const rects = rectsFor(source);
  return [spec.page, spec.back, spec.shadow, spec.edge, spec.gutter].every((rect) => hasRect(rects, rect))
    && spec.page.width / spec.page.height >= 1.4
    && spec.back.x > spec.page.x
    && spec.back.y > spec.page.y
    && spec.shadow.x > spec.back.x
    && spec.shadow.y > spec.back.y
    && spec.edge.x === spec.page.x + spec.page.width - 1;
}

function removeGpsControl(source: string, grid: Grid) {
  const control = GPS.get(grid)!.control;
  return source.replace(
    `<rect fill="${control.fill}" x="${control.x}" y="${control.y}" width="${control.width}" height="${control.height}" />`,
    "",
  );
}

function flattenNewsletterStack(source: string, grid: Grid) {
  const { back, shadow } = NEWSLETTER.get(grid)!;
  return source
    .replace(`<rect fill="${back.fill}" x="${back.x}" y="${back.y}" width="${back.width}" height="${back.height}" />`, "")
    .replace(`<rect fill="${shadow.fill}" x="${shadow.x}" y="${shadow.y}" width="${shadow.width}" height="${shadow.height}" />`, "");
}

describe("Myles 98 Fresh Greens and UnderstandingFAFSA rendered-object anatomy", () => {
  it.each(GRIDS)("makes Fresh Greens %ipx a physical handheld GPS navigator with a screen and lower D-pad", (grid) => {
    const source = sourceFor("fresh-greens", grid);

    expect(isGpsNavigator(source, grid)).toBe(true);
    expect(isGpsNavigator(removeGpsControl(source, grid), grid)).toBe(false);
    expect(publicSourceFor("fresh-greens", grid)).toBe(source);
  });

  it.each(GRIDS)("makes UnderstandingFAFSA %ipx a dimensional printed-newsletter packet", (grid) => {
    const source = sourceFor("understandingfafsa", grid);

    expect(isPrintedPacket(source, grid)).toBe(true);
    expect(isPrintedPacket(flattenNewsletterStack(source, grid), grid)).toBe(false);
    expect(publicSourceFor("understandingfafsa", grid)).toBe(source);
  });
});
