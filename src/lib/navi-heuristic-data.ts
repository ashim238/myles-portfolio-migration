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
    body: "Nearly every listing we reviewed carried the badge, but we couldn't see consistent criteria. That made it less useful as a quick decision signal.",
  },
  {
    id: "family-filters",
    headline: "Minimal family & accessibility filters",
    body: "Kid-friendly and accessibility filters were thin. A crib was often the only family-facing signal, so group planners had little to compare.",
  },
  {
    id: "visual-clutter",
    headline: "Visual clutter and repetitive listings",
    body: "Similar photography and copy made listings hard to distinguish before a traveler could compare neighborhood context.",
  },
];
