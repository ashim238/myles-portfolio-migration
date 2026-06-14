export type HeatmapNeighborhood = {
  id: string;
  name: string;
  /** Marker center inside the island silhouette */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};

/**
 * Illustrative Manhattan map — simplified island outline with marker blobs.
 * viewBox 0 0 80 270: north at top, Hudson River left, East River right.
 */
export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
  { id: "inwood", name: "Inwood", cx: 40, cy: 18, rx: 10, ry: 6 },
  { id: "harlem", name: "Harlem", cx: 40, cy: 38, rx: 11, ry: 8 },
  { id: "uws", name: "Upper West Side", cx: 28, cy: 62, rx: 7, ry: 9 },
  { id: "ues", name: "Upper East Side", cx: 54, cy: 62, rx: 7, ry: 9 },
  { id: "midtown", name: "Midtown", cx: 40, cy: 98, rx: 12, ry: 8 },
  { id: "chelsea", name: "Chelsea", cx: 27, cy: 128, rx: 7, ry: 7 },
  { id: "gv", name: "Greenwich Village", cx: 30, cy: 158, rx: 8, ry: 6 },
  { id: "soho", name: "SoHo", cx: 40, cy: 178, rx: 7, ry: 5 },
  { id: "les", name: "Lower East Side", cx: 54, cy: 182, rx: 6, ry: 7 },
  { id: "chinatown", name: "Chinatown", cx: 48, cy: 198, rx: 6, ry: 5 },
  { id: "tribeca", name: "Tribeca", cx: 32, cy: 210, rx: 7, ry: 6 },
  { id: "fidi", name: "Financial District", cx: 42, cy: 238, rx: 8, ry: 9 },
];

/**
 * Manhattan island silhouette — wider north, Hudson bulge west, tapered Battery tip.
 * Traced as a simplified cartographic outline, not geo-accurate.
 */
export const NAVI_HEATMAP_SILHOUETTE =
  "M 40 4 " +
  "L 26 10 " +
  "L 20 25 " +
  "L 17 42 " +
  "L 16 58 " +
  "L 15 74 " +
  "L 16 90 " +
  "L 17 106 " +
  "L 18 122 " +
  "L 20 138 " +
  "L 22 154 " +
  "L 25 170 " +
  "L 28 186 " +
  "C 31 200 35 215 38 230 " +
  "L 40 256 " +
  "L 44 228 " +
  "L 50 210 " +
  "L 54 192 " +
  "L 57 176 " +
  "L 59 160 " +
  "L 61 144 " +
  "L 62 128 " +
  "L 63 112 " +
  "L 64 96 " +
  "L 64 80 " +
  "L 63 64 " +
  "L 61 48 " +
  "L 58 32 " +
  "L 52 16 " +
  "L 44 8 " +
  "Z";

export const NAVI_HEATMAP_VIEWBOX = "0 0 80 270";
