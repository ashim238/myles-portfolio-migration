#!/usr/bin/env node
/**
 * Build heatmap data from:
 *   - public/projects/navi/manhattan-island.svg  (user-provided island outline — not overwritten)
 *   - content/data/manhattan-neighborhoods.geojson (NYC neighborhood polygons)
 *
 * Run: node scripts/generate-manhattan-heatmap.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const BBOX = {
  minLon: -74.047,
  maxLon: -73.908,
  minLat: 40.698,
  maxLat: 40.882,
};

/** Case-study neighborhoods → GeoJSON feature name(s) */
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
  if (!match) return { width: 100, height: 260, viewBox: "0 0 100 260" };
  const parts = match[1].trim().split(/\s+/).map(Number);
  if (parts.length === 4) {
    return { width: parts[2], height: parts[3], viewBox: match[1] };
  }
  return { width: 100, height: 260, viewBox: "0 0 100 260" };
}

function parseIslandPath(svg) {
  const byId = svg.match(/id=["']manhattan-island["'][^>]*\sd=["']([^"']+)["']/i);
  if (byId) return byId[1];
  const firstPath = svg.match(/<path[^>]*\sd=["']([^"']+)["']/i);
  if (firstPath) return firstPath[1];
  throw new Error("Could not find island path in manhattan-island.svg");
}

function project(lon, lat, width, height) {
  const x = ((lon - BBOX.minLon) / (BBOX.maxLon - BBOX.minLon)) * width;
  const y = ((BBOX.maxLat - lat) / (BBOX.maxLat - BBOX.minLat)) * height;
  return [x, y];
}

function ringToPath(ring, width, height, step = 5) {
  const pts = [];
  for (let i = 0; i < ring.length; i += step) {
    pts.push(project(ring[i][0], ring[i][1], width, height));
  }
  const last = ring[ring.length - 1];
  const end = project(last[0], last[1], width, height);
  const tail = pts[pts.length - 1];
  if (!tail || tail[0] !== end[0] || tail[1] !== end[1]) pts.push(end);
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;
}

function geometryToPath(geometry, width, height) {
  if (geometry.type === "Polygon") {
    return ringToPath(geometry.coordinates[0], width, height);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((poly) => ringToPath(poly[0], width, height))
      .join(" ");
  }
  return "";
}

function ringCentroid(ring) {
  let x = 0;
  let y = 0;
  let n = 0;
  for (const [lon, lat] of ring) {
    x += lon;
    y += lat;
    n++;
  }
  return [x / n, y / n];
}

function geometryCentroid(geometry) {
  if (geometry.type === "Polygon") return ringCentroid(geometry.coordinates[0]);
  if (geometry.type === "MultiPolygon") {
    const ring = geometry.coordinates.reduce(
      (best, poly) => (poly[0].length > best.length ? poly[0] : best),
      geometry.coordinates[0][0],
    );
    return ringCentroid(ring);
  }
  return [0, 0];
}

const islandSvg = readFileSync(join(root, "public/projects/navi/manhattan-island.svg"), "utf8");
const { width, height, viewBox } = parseViewBox(islandSvg);
const islandPath = parseIslandPath(islandSvg);

const geojson = JSON.parse(
  readFileSync(join(root, "content/data/manhattan-neighborhoods.geojson"), "utf8"),
);
const byName = Object.fromEntries(
  geojson.features.map((f) => [f.properties.name, f.geometry]),
);

const neighborhoods = HOOD_MAP.map(([id, label, sources]) => {
  const geometries = sources.map((name) => {
    const geom = byName[name];
    if (!geom) throw new Error(`Missing neighborhood geometry: ${name}`);
    return geom;
  });

  const path = geometries.map((g) => geometryToPath(g, width, height)).join(" ");
  const [lon, lat] = geometryCentroid(geometries[0]);
  const [labelX, labelY] = project(lon, lat, width, height);

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
  /** SVG path(s) in island viewBox coordinates */
  path: string;
  labelX: number;
  labelY: number;
};

/**
 * Island + neighborhood geometry for the heatmap explorer.
 * Island path: public/projects/navi/manhattan-island.svg
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
  `Wrote navi-heatmap-data.ts — viewBox ${viewBox}, ${neighborhoods.length} neighborhood shapes`,
);
