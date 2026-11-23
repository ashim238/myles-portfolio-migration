// Saved from lib/api/recommendations.ts in Fresh Greens. When the Brooklyn
// capture had no nearby results, iOS displayed its curated Alabama catalog.
import catalog from "./home-sheet-catalog.json";

export const categories = [
  { id: "black-owned", label: "Black-Owned", icon: "mapmarker-glyph-black-owned" },
  { id: "women-owned", label: "Women-Owned", icon: "mapmarker-glyph-womenowned" },
  { id: "lgbtq-welcoming", label: "LGBTQ+ Welcoming", icon: "mapmarker-glyph-lgbtq" },
  { id: "restroom", label: "Restrooms", icon: "mapmarker-glyph-restroom" },
  { id: "late-night-warm-welcome", label: "Late Night, Warm Welcome", icon: "mapmarker-glyph-late-night" },
];

export type PlaceCard = {
  name: string;
  kind: string;
  location: string;
  detail: string;
  icon: string;
};

type BrowseRow = { id: string; label: string; icon?: string; note?: string; places: PlaceCard[] };

export const nearbyRows: BrowseRow[] = [
  { id: "open-now", label: "Open now", note: "Nothing open right now within 10 mi.", places: [] },
  ...categories.map(category => ({
    ...category,
    places: catalog.filter(place => place.category === category.id).map(place => ({ ...place, icon: category.icon })),
  })),
];
