#!/usr/bin/env node
/**
 * Build aligned heatmap geometry from manhattan-neighborhoods.geojson.
 *
 * Island silhouette is derived by unioning neighborhood polygons so coastline
 * and borders share one Mercator fit — no separate OSM fetch.
 *
 * Run: node scripts/generate-manhattan-heatmap.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import union from "@turf/union";
import { featureCollection } from "@turf/helpers";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const VIEW_W = 100;
const VIEW_H = 260;
const VIEWBOX = `0 0 ${VIEW_W} ${VIEW_H}`;
const PAD = 0.05;

const CASE_STUDY_MAP = [
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

/** Not part of the walkable Manhattan island silhouette. */
const EXCLUDE_FROM_SILHOUETTE = new Set([
  "Ellis Island",
  "Liberty Island",
  "Governors Island",
  "Randall's Island",
  "Roosevelt Island",
  "Marble Hill",
]);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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

function ringToPath(ring, transform, step = 1) {
  const pts = [];
  for (let i = 0; i < ring.length; i += step) {
    pts.push(project(ring[i][0], ring[i][1], transform));
  }
  const last = ring[ring.length - 1];
  const end = project(last[0], last[1], transform);
  const tail = pts[pts.length - 1];
  if (!tail || tail[0] !== end[0] || tail[1] !== end[1]) pts.push(end);
  return `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;
}

function geometryToPaths(geometry, transform) {
  if (geometry.type === "Polygon") {
    return [ringToPath(geometry.coordinates[0], transform)];
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.map((poly) => ringToPath(poly[0], transform));
  }
  return [];
}

function geometryToPath(geometry, transform) {
  return geometryToPaths(geometry, transform).join(" ");
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

function unionSilhouette(features) {
  const mainland = features.filter((f) => !EXCLUDE_FROM_SILHOUETTE.has(f.properties.name));
  if (mainland.length === 0) throw new Error("No mainland features for silhouette");
  const result = union(featureCollection(mainland));
  if (!result) throw new Error("Union produced empty geometry");
  return result.geometry;
}

function silhouetteToPath(geometry, transform) {
  if (geometry.type === "Polygon") {
    return ringToPath(geometry.coordinates[0], transform, 2);
  }
  if (geometry.type === "MultiPolygon") {
    const largest = geometry.coordinates.reduce((best, poly) =>
      poly[0].length > best[0].length ? poly : best,
    );
    return ringToPath(largest[0], transform, 2);
  }
  return "";
}

const geojson = JSON.parse(
  readFileSync(join(root, "content/data/manhattan-neighborhoods.geojson"), "utf8"),
);
const byName = Object.fromEntries(geojson.features.map((f) => [f.properties.name, f]));

const silhouetteGeometry = unionSilhouette(geojson.features);
const projectionGeometries = geojson.features
  .filter((f) => !EXCLUDE_FROM_SILHOUETTE.has(f.properties.name))
  .map((f) => f.geometry);

const mercBbox = mercBboxFromGeometries(projectionGeometries);
const transform = buildUniformTransform(mercBbox, VIEW_W, VIEW_H, PAD);
const islandPath = silhouetteToPath(silhouetteGeometry, transform);

const caseStudyNameToId = new Map(
  CASE_STUDY_MAP.flatMap(([id, , sources]) => sources.map((name) => [name, id])),
);

const caseStudyNeighborhoods = CASE_STUDY_MAP.map(([id, label, sources]) => {
  const geometries = sources.map((name) => {
    const geom = byName[name]?.geometry;
    if (!geom) throw new Error(`Missing neighborhood geometry: ${name}`);
    return geom;
  });
  const path = geometries.map((g) => geometryToPath(g, transform)).join(" ");
  const [lon, lat] = geometryCentroid(geometries[0]);
  const [labelX, labelY] = project(lon, lat, transform);

  return {
    id,
    name: label,
    path,
    labelX: +labelX.toFixed(2),
    labelY: +labelY.toFixed(2),
    selectable: true,
  };
});

const borderRegions = geojson.features
  .filter((f) => !EXCLUDE_FROM_SILHOUETTE.has(f.properties.name))
  .map((f) => {
    const caseId = caseStudyNameToId.get(f.properties.name);
    return {
      id: caseId ?? slugify(f.properties.name),
      name: f.properties.name,
      path: geometryToPath(f.geometry, transform),
      selectable: Boolean(caseId),
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

const formatRegion = (n) =>
  `  {\n    id: ${JSON.stringify(n.id)},\n    name: ${JSON.stringify(n.name)},\n    path: ${JSON.stringify(n.path)},\n    selectable: ${n.selectable}${n.labelX != null ? `,\n    labelX: ${n.labelX},\n    labelY: ${n.labelY}` : ""}\n  }`;

const tsOut = `export type HeatmapRegion = {
  id: string;
  name: string;
  path: string;
  selectable: boolean;
  labelX?: number;
  labelY?: number;
};

export type HeatmapNeighborhood = HeatmapRegion & {
  selectable: true;
  labelX: number;
  labelY: number;
};

/**
 * Island + neighborhoods — one shared projection from geojson union.
 * Regenerate: node scripts/generate-manhattan-heatmap.mjs
 */
export const NAVI_HEATMAP_VIEWBOX = ${JSON.stringify(VIEWBOX)};

export const NAVI_HEATMAP_SILHOUETTE =
  ${JSON.stringify(islandPath)};

/** All Manhattan neighborhood borders (stroke layer). */
export const NAVI_HEATMAP_BORDER_REGIONS: HeatmapRegion[] = [
${borderRegions.map(formatRegion).join(",\n")},
];

/** Case-study neighborhoods — selectable in list + map. */
export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
${caseStudyNeighborhoods.map(formatRegion).join(",\n")},
];
`;

writeFileSync(join(root, "src/lib/navi-heatmap-data.ts"), tsOut);
console.log(
  `Wrote navi-heatmap-data.ts — ${borderRegions.length} borders, ${caseStudyNeighborhoods.length} selectable (scale ${transform.scale.toFixed(1)})`,
);
