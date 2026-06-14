#!/usr/bin/env node
/**
 * Build aligned heatmap geometry at compile time (no runtime OSM API).
 *
 * Sources:
 *   - Island outline: public/projects/navi/manhattan-island.svg (not overwritten)
 *   - Neighborhoods: content/data/manhattan-neighborhoods.geojson (OSM via Click That Hood)
 *
 * Alignment: geo coordinates are projected into the island path's bounding box
 * inside the SVG viewBox — not the full viewBox — so shapes sit on the island.
 *
 * Run: node scripts/generate-manhattan-heatmap.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const HOOD_MAP = [
  ["inwood", "Inwood", ["Inwood"]],
  ["harlem", "Harlem", ["Harlem"]],
  ["uws", "Upper West Side", ["Upper West Side"]],
  ["ues", "Upper East Side", ["Upper East Side"]],
  ["midtown", "Midtown", ["Midtown"]],
  ["chelsea", "Chelsea", ["Chelsea"]],
  ["gv", "Greenwich Village", ["Greenwich Village"]],
  ["soho", "SoHo", ["SoHo"]],
  ["les", "Lower East Side", ["Lower East Side"]],
  ["chinatown", "Chinatown", ["Chinatown"]],
  ["tribeca", "Tribeca", ["Tribeca"]],
  ["fidi", "Financial District", ["Financial District"]],
];

function parseViewBox(svg) {
  const match = svg.match(/viewBox=["']([^"']+)["']/i);
  if (!match) return { viewBox: "0 0 100 260" };
  return { viewBox: match[1].trim() };
}

function parseIslandPath(svg) {
  const byId = svg.match(/id=["']manhattan-island["'][^>]*\sd=["']([^"']+)["']/i);
  if (byId) return byId[1];
  const firstPath = svg.match(/<path[^>]*\sd=["']([^"']+)["']/i);
  if (firstPath) return firstPath[1];
  throw new Error("Could not find island path in manhattan-island.svg");
}

/** Bounding box of SVG path `d` attribute (M/L commands). */
function pathBBox(d) {
  const numbers = d.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  const xs = [];
  const ys = [];
  for (let i = 0; i + 1 < numbers.length; i += 2) {
    xs.push(numbers[i]);
    ys.push(numbers[i + 1]);
  }
  if (!xs.length) throw new Error("Could not parse island path coordinates");
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
  };
}

function eachCoord(geometry, fn) {
  if (geometry.type === "Polygon") {
    for (const [lon, lat] of geometry.coordinates[0]) fn(lon, lat);
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) {
      for (const [lon, lat] of poly[0]) fn(lon, lat);
    }
  }
}

function geometryGeoBbox(geometries) {
  let minLon = Infinity;
  let maxLon = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;
  for (const geom of geometries) {
    eachCoord(geom, (lon, lat) => {
      minLon = Math.min(minLon, lon);
      maxLon = Math.max(maxLon, lon);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
    });
  }
  return { minLon, maxLon, minLat, maxLat };
}

function project(lon, lat, geoBbox, islandBbox) {
  const { minLon, maxLon, minLat, maxLat } = geoBbox;
  const lonSpan = maxLon - minLon || 1;
  const latSpan = maxLat - minLat || 1;
  const x =
    islandBbox.minX + ((lon - minLon) / lonSpan) * (islandBbox.maxX - islandBbox.minX);
  const y =
    islandBbox.minY + ((maxLat - lat) / latSpan) * (islandBbox.maxY - islandBbox.minY);
  return [x, y];
}

function ringToPath(ring, geoBbox, islandBbox, step = 4) {
  const pts = [];
  for (let i = 0; i < ring.length; i += step) {
    pts.push(project(ring[i][0], ring[i][1], geoBbox, islandBbox));
  }
  const last = ring[ring.length - 1];
  const end = project(last[0], last[1], geoBbox, islandBbox);
  const tail = pts[pts.length - 1];
  if (!tail || tail[0] !== end[0] || tail[1] !== end[1]) pts.push(end);
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;
}

function geometryToPath(geometry, geoBbox, islandBbox) {
  if (geometry.type === "Polygon") {
    return ringToPath(geometry.coordinates[0], geoBbox, islandBbox);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((poly) => ringToPath(poly[0], geoBbox, islandBbox))
      .join(" ");
  }
  return "";
}

function geometryCentroid(geometry) {
  const ring =
    geometry.type === "Polygon"
      ? geometry.coordinates[0]
      : geometry.coordinates.reduce(
          (best, poly) => (poly[0].length > best.length ? poly[0] : best),
          geometry.coordinates[0][0],
        );
  let lon = 0;
  let lat = 0;
  for (const [lo, la] of ring) {
    lon += lo;
    lat += la;
  }
  return [lon / ring.length, lat / ring.length];
}

const islandSvg = readFileSync(join(root, "public/projects/navi/manhattan-island.svg"), "utf8");
const { viewBox } = parseViewBox(islandSvg);
const islandPath = parseIslandPath(islandSvg);
const islandBbox = pathBBox(islandPath);

const geojson = JSON.parse(
  readFileSync(join(root, "content/data/manhattan-neighborhoods.geojson"), "utf8"),
);
const byName = Object.fromEntries(
  geojson.features.map((f) => [f.properties.name, f.geometry]),
);

const allGeometries = HOOD_MAP.flatMap(([, , sources]) =>
  sources.map((name) => {
    const geom = byName[name];
    if (!geom) throw new Error(`Missing neighborhood geometry: ${name}`);
    return geom;
  }),
);
const geoBbox = geometryGeoBbox(allGeometries);

const neighborhoods = HOOD_MAP.map(([id, label, sources]) => {
  const geometries = sources.map((name) => byName[name]);
  const path = geometries.map((g) => geometryToPath(g, geoBbox, islandBbox)).join(" ");
  const [lon, lat] = geometryCentroid(geometries[0]);
  const [labelX, labelY] = project(lon, lat, geoBbox, islandBbox);

  return {
    id,
    name: label,
    path,
    labelX: +labelX.toFixed(1),
    labelY: +labelY.toFixed(1),
  };
});

const hoodLines = neighborhoods
  .map(
    (n) =>
      `  {\n    id: ${JSON.stringify(n.id)},\n    name: ${JSON.stringify(n.name)},\n    path: ${JSON.stringify(n.path)},\n    labelX: ${n.labelX},\n    labelY: ${n.labelY},\n  }`,
  )
  .join(",\n");

const tsOut = `export type HeatmapNeighborhood = {
  id: string;
  name: string;
  /** SVG path(s) aligned to manhattan-island.svg */
  path: string;
  labelX: number;
  labelY: number;
};

/**
 * Heatmap geometry — generated at build time from OSM neighborhood data.
 * Island: public/projects/navi/manhattan-island.svg
 * Neighborhoods: content/data/manhattan-neighborhoods.geojson
 * Regenerate: node scripts/generate-manhattan-heatmap.mjs
 */
export const NAVI_HEATMAP_VIEWBOX = ${JSON.stringify(viewBox)};

export const NAVI_HEATMAP_SILHOUETTE =
  ${JSON.stringify(islandPath)};

export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
${hoodLines},
];
`;

writeFileSync(join(root, "src/lib/navi-heatmap-data.ts"), tsOut);
console.log(
  `Aligned ${neighborhoods.length} neighborhoods to island bbox ` +
    `(${islandBbox.minX.toFixed(1)}–${islandBbox.maxX.toFixed(1)}, ` +
    `${islandBbox.minY.toFixed(1)}–${islandBbox.maxY.toFixed(1)})`,
);
