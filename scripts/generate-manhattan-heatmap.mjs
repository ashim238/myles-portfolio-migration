#!/usr/bin/env node
/**
 * Regenerate Manhattan heatmap geometry from OpenStreetMap coastline data.
 *
 * Outputs:
 *   - public/projects/navi/manhattan-island.svg  (swap this file to use your own SVG)
 *   - src/lib/navi-heatmap-data.ts
 *
 * Run: node scripts/generate-manhattan-heatmap.mjs
 */

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

/** Manhattan Island proper — excludes Randall's / Wards Island skew */
const BBOX = {
  minLon: -74.047,
  maxLon: -73.908,
  minLat: 40.698,
  maxLat: 40.882,
};

const W = 100;
const H = 260;

const HOODS = [
  ["inwood", "Inwood", 40.868, -73.921, 6, 5],
  ["harlem", "Harlem", 40.811, -73.946, 7, 5.5],
  ["uws", "Upper West Side", 40.787, -73.975, 5.5, 6],
  ["ues", "Upper East Side", 40.773, -73.956, 5.5, 6],
  ["midtown", "Midtown", 40.754, -73.984, 7, 5],
  ["chelsea", "Chelsea", 40.746, -73.997, 5, 5],
  ["gv", "Greenwich Village", 40.734, -74.002, 5.5, 4.5],
  ["soho", "SoHo", 40.723, -73.999, 5, 4],
  ["les", "Lower East Side", 40.715, -73.984, 5, 5],
  ["chinatown", "Chinatown", 40.715, -73.997, 4.5, 4],
  ["tribeca", "Tribeca", 40.718, -74.008, 5, 4.5],
  ["fidi", "Financial District", 40.707, -74.01, 5.5, 5.5],
];

function project(lon, lat) {
  const { minLon, maxLon, minLat, maxLat } = BBOX;
  const x = ((lon - minLon) / (maxLon - minLon)) * W;
  const y = ((maxLat - lat) / (maxLat - minLat)) * H;
  return [x, y];
}

function inBbox([lon, lat]) {
  return lon >= BBOX.minLon && lon <= BBOX.maxLon && lat >= BBOX.minLat && lat <= BBOX.maxLat;
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
const islandSegment = splitRing(mainRing)
  .map((seg) => seg.filter(inBbox))
  .filter((seg) => seg.length > 20)
  .reduce((best, seg) => (seg.length > best.length ? seg : best));

// Coastline sample: every 4th point keeps Hudson/East River curves without huge paths
const sampled = islandSegment.filter((_, i) => i % 4 === 0);
if (sampled.at(-1) !== islandSegment.at(-1)) sampled.push(islandSegment.at(-1));

const pts = sampled.map(([lon, lat]) => project(lon, lat));
const path = `M ${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L ")} Z`;

const markers = HOODS.map(([id, name, lat, lon, rx, ry]) => {
  const [cx, cy] = project(lon, lat);
  return { id, name, cx: +cx.toFixed(1), cy: +cy.toFixed(1), rx, ry };
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" fill="none" role="img" aria-label="Manhattan island outline">
  <!-- Replace this file with your own Manhattan SVG (keep viewBox 0 0 100 260). -->
  <path id="manhattan-island" d="${path}" fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"/>
</svg>
`;

const ts = `export type HeatmapNeighborhood = {
  id: string;
  name: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

/**
 * Manhattan island coastline derived from OpenStreetMap (island bbox clipped).
 * Asset: public/projects/navi/manhattan-island.svg
 * Regenerate: node scripts/generate-manhattan-heatmap.mjs
 * Or drop in your own SVG and update marker cx/cy to match.
 */
export const NAVI_HEATMAP_VIEWBOX = "0 0 ${W} ${H}";

export const NAVI_HEATMAP_SILHOUETTE =
  "${path}";

export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
${markers.map((m) => `  { id: "${m.id}", name: "${m.name}", cx: ${m.cx}, cy: ${m.cy}, rx: ${m.rx}, ry: ${m.ry} },`).join("\n")}
];
`;

writeFileSync(join(root, "public/projects/navi/manhattan-island.svg"), svg);
writeFileSync(join(root, "src/lib/navi-heatmap-data.ts"), ts);
console.log(`Wrote manhattan-island.svg + navi-heatmap-data.ts (${sampled.length} coastline points)`);
