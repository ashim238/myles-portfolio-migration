export type HeuristicInsight = {
  id: string;
  headline: string;
  body: string;
};

/** Synthesized from Airbnb heuristic evaluation — not the full 12-row scorecard */
export const NAVI_HEURISTIC_INSIGHTS: HeuristicInsight[] = [
  {
    id: "guest-favorite",
    headline: "Guest Favorite label overuse",
    body: "The designation appeared on nearly every listing we reviewed, with no consistent criteria visible to the evaluator — eroding trust in a signal meant to shortcut decisions.",
  },
  {
    id: "family-filters",
    headline: "Minimal family & accessibility filters",
    body: "Kid-friendly and accessibility-specific filters were thin. A crib amenity was often the only family-facing signal, leaving group planners without meaningful constraints.",
  },
  {
    id: "visual-clutter",
    headline: "Visual clutter and repetitive listings",
    body: "Grid layouts offered minimal differentiation between stays. Similar photography and copy patterns created decision fatigue before a traveler could compare neighborhood context.",
  },
];
