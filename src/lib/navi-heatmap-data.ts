export type HeatmapNeighborhood = {
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
export const NAVI_HEATMAP_VIEWBOX = "0 0 100 260";

export const NAVI_HEATMAP_SILHOUETTE =
  "M 33.02 259.87 L 36.44 252.41 L 37.35 251.49 L 40.47 250.25 L 45.74 249.08 L 47.54 248.74 L 53.77 244.31 L 55.28 247.40 L 55.89 249.44 L 55.49 245.99 L 56.07 240.58 L 56.90 232.70 L 60.06 226.47 L 61.07 221.70 L 61.33 220.74 L 61.60 216.10 L 60.94 208.72 L 60.45 202.92 L 63.07 191.93 L 65.36 186.82 L 66.54 184.92 L 66.69 184.47 L 67.75 182.28 L 68.62 180.45 L 72.88 169.84 L 77.10 160.98 L 80.17 156.00 L 78.49 152.56 L 79.93 147.65 L 81.88 146.67 L 84.15 149.22 L 90.82 141.08 L 97.04 130.61 L 95.56 120.37 L 92.91 117.98 L 91.44 116.73 L 90.68 114.89 L 90.08 113.48 L 89.65 113.05 L 86.69 112.80 L 85.10 110.05 L 83.79 106.72 L 82.98 105.08 L 82.47 103.83 L 82.28 102.22 L 82.15 101.56 L 82.15 101.14 L 82.33 100.49 L 82.20 99.58 L 82.31 90.12 L 81.94 79.20 L 81.84 65.52 L 84.10 57.24 L 87.69 45.63 L 90.80 37.29 L 92.12 34.34 L 95.95 26.64 L 98.00 21.42 L 99.04 16.51 L 99.09 13.21 L 99.52 12.75 L 99.87 6.30 L 99.19 5.65 L 98.61 4.46 L 97.21 4.30 L 96.72 5.80 L 94.97 7.79 L 94.55 8.91 L 94.11 8.92 L 94.04 8.92 L 93.56 8.77 L 93.03 8.94 L 92.53 8.70 L 91.62 8.02 L 90.71 6.35 L 87.94 4.42 L 87.55 4.21 L 69.57 33.03 Z";

export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
  { id: "inwood", name: "Inwood", cx: 90.6, cy: 19.8, rx: 6, ry: 5 },
  { id: "harlem", name: "Harlem", cx: 72.7, cy: 100.3, rx: 7, ry: 5.5 },
  { id: "uws", name: "Upper West Side", cx: 51.8, cy: 134.2, rx: 5.5, ry: 6 },
  { id: "ues", name: "Upper East Side", cx: 65.5, cy: 154, rx: 5.5, ry: 6 },
  { id: "midtown", name: "Midtown", cx: 45.3, cy: 180.9, rx: 7, ry: 5 },
  { id: "chelsea", name: "Chelsea", cx: 36, cy: 192.2, rx: 5, ry: 5 },
  { id: "gv", name: "Greenwich Village", cx: 32.4, cy: 209.1, rx: 5.5, ry: 4.5 },
  { id: "soho", name: "SoHo", cx: 34.5, cy: 224.7, rx: 5, ry: 4 },
  { id: "les", name: "Lower East Side", cx: 45.3, cy: 236, rx: 5, ry: 5 },
  { id: "chinatown", name: "Chinatown", cx: 36, cy: 236, rx: 4.5, ry: 4 },
  { id: "tribeca", name: "Tribeca", cx: 28.1, cy: 231.7, rx: 5, ry: 4.5 },
  { id: "fidi", name: "Financial District", cx: 26.6, cy: 247.3, rx: 5.5, ry: 5.5 },
];
