export type HeatmapNeighborhood = {
  id: string;
  name: string;
  /** SVG path `d` for illustrative blob region */
  path: string;
};

/** Illustrative Manhattan regions — not live geo analytics */
export const NAVI_HEATMAP_NEIGHBORHOODS: HeatmapNeighborhood[] = [
  {
    id: "inwood",
    name: "Inwood",
    path: "M 118 8 L 132 22 L 128 48 L 110 52 L 98 36 Z",
  },
  {
    id: "harlem",
    name: "Harlem",
    path: "M 98 36 L 110 52 L 108 78 L 88 82 L 76 58 Z",
  },
  {
    id: "uws",
    name: "Upper West Side",
    path: "M 76 58 L 88 82 L 84 108 L 62 112 L 54 86 Z",
  },
  {
    id: "ues",
    name: "Upper East Side",
    path: "M 108 78 L 128 74 L 136 100 L 124 118 L 104 112 Z",
  },
  {
    id: "midtown",
    name: "Midtown",
    path: "M 84 108 L 104 112 L 100 138 L 78 142 L 70 118 Z",
  },
  {
    id: "chelsea",
    name: "Chelsea",
    path: "M 62 112 L 84 108 L 78 142 L 58 148 L 48 124 Z",
  },
  {
    id: "gv",
    name: "Greenwich Village",
    path: "M 48 124 L 58 148 L 52 168 L 34 164 L 30 140 Z",
  },
  {
    id: "soho",
    name: "SoHo",
    path: "M 52 168 L 58 148 L 78 142 L 74 166 L 60 178 Z",
  },
  {
    id: "les",
    name: "Lower East Side",
    path: "M 74 166 L 78 142 L 100 138 L 96 162 L 82 176 Z",
  },
  {
    id: "chinatown",
    name: "Chinatown",
    path: "M 82 176 L 96 162 L 108 168 L 102 188 L 86 192 Z",
  },
  {
    id: "fidi",
    name: "Financial District",
    path: "M 86 192 L 102 188 L 110 204 L 94 212 L 78 206 Z",
  },
  {
    id: "tribeca",
    name: "Tribeca",
    path: "M 60 178 L 74 166 L 82 176 L 78 206 L 62 200 Z",
  },
];

export const NAVI_HEATMAP_SILHOUETTE =
  "M 120 4 C 138 18 140 40 132 62 C 128 88 140 108 136 132 C 132 156 118 176 108 196 C 98 214 88 220 72 218 C 56 214 44 198 38 176 C 32 152 28 128 34 104 C 40 80 48 58 62 40 C 78 22 98 8 120 4 Z";
