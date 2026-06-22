import { EXPERIENCES } from "@/lib/navi/demo-data";
import { HOSTS, type Host } from "@/lib/navi/hosts";

export type Neighborhood = {
  slug: string;
  name: string;
  borough: string;
  intro: string;
};

export function neighborhoodSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Narrative intros keyed by slug. One source of truth for the prose so the
// page never has to branch on the name. Boroughs come from the experience
// data, so we only store the intro text here.
const INTROS: Record<string, string> = {
  "astoria":
    "Astoria runs on the smell of a dozen kitchens at once, Greek and Egyptian and Bangladeshi within the same block. The people who host here grew up on those corners, and they'll tell you which counter has stayed in the same family the longest.",
  "bedford-stuyvesant":
    "Bed-Stuy wears its brownstone history out loud, on stoops and in the gardens that neighbors tend together. Local hosts here treat the block as the real attraction, not a backdrop.",
  "central-harlem":
    "Harlem's music and its food carry a century of arrivals, and they're still being added to. Hosts who live here can point you past the famous addresses to the rooms where the work actually happens.",
  "chelsea":
    "Chelsea folds galleries, the High Line, and old market halls into a few walkable avenues. The hosts here know which openings are worth your evening and which are just a crowd.",
  "chinatown":
    "Chinatown moves at the pace of its produce stalls and its tea houses, and it rewards anyone who slows down to match it. Local hosts grew up running these errands, so they know the back rooms as well as the storefronts.",
  "coney-island":
    "Coney Island is louder in summer and quieter in a way worth seeing the rest of the year. Hosts from here can walk you past the boardwalk's surface into the community that keeps it running.",
  "dumbo":
    "DUMBO packs cobblestones, bridge views, and converted warehouses into a tight grid by the water. The people who host here remember it before the photos, and they'll show you both versions.",
  "east-flatbush":
    "East Flatbush carries the Caribbean across its bakeries, churches, and weekend markets. Hosts who live here can read the neighborhood's rhythms the way a regular reads a menu.",
  "east-village":
    "The East Village keeps its punk and its poetry close to the surface, in record stores and community gardens that have outlasted every trend. Local hosts can trace which corners earned their reputation.",
  "flushing":
    "Flushing's food halls are a city of their own, dense with regional cooking you won't find in a single guidebook. Hosts from here order in the languages the menus are written in.",
  "greenpoint":
    "Greenpoint holds onto its Polish bakeries while the waterfront fills in around them. The hosts here can tell you which traditions stayed and which ones are brand new.",
  "hamilton-heights":
    "Hamilton Heights climbs uptown with row houses, jazz history, and a college campus folded into the hills. Local hosts know the quiet blocks that the rest of the city skips.",
  "hunts-point":
    "Hunts Point feeds the city before dawn from its market, and it's home long after the trucks leave. Hosts here can show you the neighborhood the headlines usually miss.",
  "inwood":
    "Inwood keeps the island's last old forest and some of its steepest streets, far enough north to feel like a secret. The people who host here treat the parkland as a shared backyard.",
  "jackson-heights":
    "Jackson Heights might be the most spoken-over square mile in the country, with a different country's cooking on every block. Local hosts move between those worlds the way the rest of us cross a street.",
  "long-island-city":
    "Long Island City trades its industrial past for towers and studios, all of it staring back at the Manhattan skyline. Hosts here remember the factories and can point to what they became.",
  "lower-east-side":
    "The Lower East Side stacked immigrant generations on top of each other, and you can still taste each layer. Local hosts know which tenement stories are stitched into which storefronts.",
  "mott-haven":
    "Mott Haven is where hip-hop got its footing, and the murals still argue back. Hosts who live here can walk you through the history without flattening it.",
  "park-slope":
    "Park Slope lines its brownstones up against Prospect Park, and the food co-op runs on the same neighborly logic. The hosts here treat the block as an extension of their living room.",
  "ridgewood":
    "Ridgewood crosses the Brooklyn line quietly, all knish counters and new cafes sharing the same brick. Local hosts can tell you which spots have held the corner for fifty years.",
  "south-street-seaport":
    "The Seaport keeps the city's old harbor in its cobblestones and its tall ships. Hosts here can separate the maritime history from the mall that grew around it.",
  "sugar-hill":
    "Sugar Hill earned its name when Harlem's writers and musicians moved up the slope, and the elegance held. Local hosts know whose front steps the old photographs were taken on.",
  "sunset-park":
    "Sunset Park stacks Brooklyn's Chinatown and its Little Latin America on one hill, with the harbor laid out below. The hosts here shop both main streets in the same afternoon.",
  "van-cortlandt-village":
    "Van Cortlandt Village backs onto the borough's biggest park, with trails and ballfields a few steps from the apartments. Local hosts use that green space the way other neighborhoods use a town square.",
  "west-farms":
    "West Farms grew up along the river and the old trolley lines, and the bones are still visible. Hosts here can show you where the Bronx's industrial story meets its quieter corners.",
};

export const NEIGHBORHOODS: Record<string, Neighborhood> = (() => {
  const map: Record<string, Neighborhood> = {};
  for (const e of EXPERIENCES) {
    const slug = neighborhoodSlug(e.neighborhood);
    if (map[slug]) continue;
    map[slug] = {
      slug,
      name: e.neighborhood,
      borough: e.borough,
      intro: INTROS[slug] ?? "",
    };
  }
  return map;
})();

export function getNeighborhoodBySlug(slug: string): Neighborhood | undefined {
  return NEIGHBORHOODS[slug];
}

export function experiencesByNeighborhood(slug: string) {
  return EXPERIENCES.filter((e) => neighborhoodSlug(e.neighborhood) === slug);
}

export function neighborhoodCentroid(slug: string): [number, number] | null {
  const list = experiencesByNeighborhood(slug);
  if (list.length === 0) return null;
  const lat = list.reduce((s, e) => s + e.lat, 0) / list.length;
  const lng = list.reduce((s, e) => s + e.lng, 0) / list.length;
  return [lat, lng];
}

export function hostsByNeighborhood(slug: string): Host[] {
  const seen = new Set<string>();
  const out: Host[] = [];
  for (const e of experiencesByNeighborhood(slug)) {
    if (seen.has(e.host.slug)) continue;
    seen.add(e.host.slug);
    const host = HOSTS[e.host.slug];
    if (host) out.push(host);
  }
  return out;
}
