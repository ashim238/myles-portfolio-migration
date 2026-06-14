#!/usr/bin/env node
/**
 * Build aligned heatmap geometry at compile time from OpenStreetMap.
 *
 * Island coastline + neighborhood polygons share one Mercator uniform-scale
 * transform into the SVG viewBox. Output is src/lib/navi-heatmap-data.ts only.
 *
 * Run: node scripts/generate-manhattan-heatmap.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const VIEW_W = 100;
const VIEW_H = 260;
const VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`;
const PAD = 0.04;

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

const ISLAND_BBOX = {
  minLon: -74.047,
  maxLon: -73.908,
  minLat: 40.698,
  maxLat: 40.882,
};

function lonLatToMerc(lon, lat) {
  const x = (lon * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360));
  return [x, y];
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

function mercBboxFromGeometries(geometries) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const geom of geometries) {
    eachCoord(geom, (lon, lat) => {
      const [mx, my] = lonLatToMerc(lon, lat);
      if (mx < minX) minX = mx;
      if (mx > maxX) maxX = mx;
      if (my < minY) minY = my;
      if (my > maxY) maxY = my;
    });
  }
  return { minX, maxX, minY, maxY };
}

function buildUniformTransform(mercBbox, width, height, pad) {
  const srcW = mercBbox.maxX - mercBbox.minX || 1;
  const srcH = mercBbox.maxY - mercBbox.minY || 1;
  const innerW = width * (1 - 2 * pad);
  const innerH = height * (1 - 2 * pad);
  const scale = Math.min(innerW / srcW, innerH / srcH);
  const xPad = (width - srcW * scale) / 2;
  const yPad = (height - srcH * scale) / 2;
  return { scale, offsetX: xPad, offsetY: yPad, mercBbox };
}

function project(lon, lat, transform) {
  const [mx, my] = lonLatToMerc(lon, lat);
  const { scale, offsetX, offsetY, mercBbox } = transform;
  const x = offsetX + (mx - mercBbox.minX) * scale;
  const y = offsetY + (mercBbox.maxY - my) * scale;
  return [x, y];
}

function ringToPath(ring, transform, step = 4) {
  const pts = [];
  for (let i = 0; i < ring.length; i += step) {
    pts.push(project(ring[i][0], ring[i][1], transform));
  }
  const last = ring[ring.length - 1];
  const end = project(last[0], last[1], transform);
  const tail = pts[pts.length - 1];
  if (!tail || tail[0] !== end[0] || tail[1] !== end[1]) pts.push(end);
  return `M ${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L ")} Z`;
}

function geometryToPath(geometry, transform) {
  if (geometry.type === "Polygon") {
    return ringToPath(geometry.coordinates[0], transform);
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((poly) => ringToPath(poly[0], transform)).join(" ");
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

function ringArea(ring) {
  let a = 0;
  for (let i = 0; i < ring.length - 1; i++) {
    a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
  }
  return Math.abs(a);
}

function splitRing(ring, threshold = 0.01) {
  const segments = [];
  let current = [ring[0]];
  for (let i = 1; i < ring.length; i++) {
    current.push(ring[i]);
    const d = Math.hypot(ring[i - 1][0] - ring[i][0], ring[i - 1][1] - ring[i][1]);
    if (d > threshold) {
      if (current.length > 1) segments.push(current);
      current = [ring[i]];
    }
  }
  if (current.length > 1) segments.push(current);
  return segments;
}

function inIslandBbox(lon, lat) {
  return (
    lon >= ISLAND_BBOX.minLon &&
    lon <= ISLAND_BBOX.maxLon &&
    lat >= ISLAND_BBOX.minLat &&
    lat <= ISLAND_BBOX.maxLat
  );
}

async function fetchIslandRing() {
  const url =
    "https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&city=Manhattan&county=New+York+County&state=NY&country=USA&limit=1";
  const res = await fetch(url, {
    headers: { "User-Agent": "portfolio-navi-heatmap/1.0 (github.com/ashim238/portfolio)" },
  });
  const data = await res.json();
  const geo = data[0]?.geojson;
  if (!geo) throw new Error("No Manhattan geojson from Nominatim");

  const rings =
    geo.type === "Polygon" ? [geo.coordinates[0]] : geo.coordinates.map((poly) => poly[0]);

  const mainRing = rings.reduce((best, ring) => (ringArea(ring) > ringArea(best) ? ring : best));
  const segment = splitRing(mainRing)
    .map((seg) => seg.filter(([lon, lat]) => inIslandBbox(lon, lat)))
    .filter((seg) => seg.length > 20)
    .reduce((best, seg) => (seg.length > best.length ? seg : best));

  return segment;
}

const geojson = JSON.parse(
  readFileSync(join(root, "content/data/manhattan-neighborhoods.geojson"), "utf8"),
);
const byName = Object.fromEntries(
  geojson.features.map((f) => [f.properties.name, f.geometry]),
);

const hoodGeometries = HOOD_MAP.flatMap(([, , sources]) =>
  sources.map((name) => {
    const geom = byName[name];
    if (!geom) throw new Error(`Missing neighborhood geometry: ${name}`);
    return geom;
  }),
);

const islandRing = await fetchIslandRing();
const islandGeometry = { type: "Polygon", coordinates: [islandRing] };

const mercBbox = mercBboxFromGeometries([islandGeometry, ...hoodGeometries]);
const transform = buildUniformTransform(mercBbox, VIEW_W, VIEW_H, PAD);

const islandPath = ringToPath(islandRing, transform, 3);

const neighborhoods = HOOD_MAP.map(([id, label, sources]) => {
  const geometries = sources.map((name) => byName[name]);
  const path = geometries.map((g) => geometryToPath(g, transform)).join(" ");
  const [lon, lat] = geometryCentroid(geometries[0]);
  const [labelX, labelY] = project(lon, lat, transform);

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
  path: string;
  labelX: number;
  labelY: number;
};

/**
 * Island + neighborhoods — OSM data, one shared projection.
 * Regenerate: node scripts/generate-manhattan-heatmap.mjs
 */
export const NAVI_HEATMAP_VIEWBOX = ${JSON.stringify(VIEWBOX)};

export const NAVI_HEATMAP_SILHOUETTE =
  ${JSON.stringify(islandPath)};

export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
${hoodLines},
];
`;

writeFileSync(join(root, "src/lib/navi-heatmap-data.ts"), tsOut);
console.log(
  `Wrote navi-heatmap-data.ts — ${neighborhoods.length} neighborhoods (scale ${transform.scale.toFixed(1)})`,
);
