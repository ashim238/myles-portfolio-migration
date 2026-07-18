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
    "Astoria runs on the smell of a dozen kitchens at once, with Greek, Egyptian, and Bangladeshi food on the same block.",
  "bedford-stuyvesant":
    "Bed-Stuy wears its brownstone history out loud, on stoops and in the gardens that neighbors tend together.",
  "central-harlem":
    "Harlem's music and food carry a century of arrivals, and new work keeps joining that history.",
  "chelsea":
    "Chelsea folds galleries, the High Line, and old market halls into a few walkable avenues.",
  "chinatown":
    "Chinatown moves at the pace of its produce stalls and tea houses. Slow down and the block opens up.",
  "coney-island":
    "Coney Island is loudest in summer, but the boardwalk has a different rhythm the rest of the year.",
  "dumbo":
    "DUMBO packs cobblestones, bridge views, and converted warehouses into a tight grid by the water.",
  "east-flatbush":
    "East Flatbush carries the Caribbean through its bakeries, churches, and weekend markets.",
  "east-village":
    "The East Village keeps its punk and poetry close to the surface, in record stores and community gardens that have outlasted many trends.",
  "flushing":
    "Flushing's food halls are dense with regional cooking that no single guidebook could cover.",
  "greenpoint":
    "Greenpoint holds onto its Polish bakeries while the waterfront fills in around them.",
  "hamilton-heights":
    "Hamilton Heights climbs uptown through row houses, jazz history, and a college campus folded into the hills.",
  "hunts-point":
    "Hunts Point feeds the city before dawn from its market, and it is home long after the trucks leave.",
  "inwood":
    "Inwood keeps the island's last old forest and some of its steepest streets at Manhattan's northern edge.",
  "jackson-heights":
    "Jackson Heights fits an extraordinary range of languages and food into a compact grid of apartment blocks and storefronts.",
  "long-island-city":
    "Long Island City layers towers and studios over an industrial past, all of it facing the Manhattan skyline.",
  "lower-east-side":
    "The Lower East Side carries generations of immigrant history through its tenements, storefronts, and food.",
  "mott-haven":
    "Mott Haven's murals, industrial buildings, and waterfront parks sit within a few blocks of one another.",
  "park-slope":
    "Park Slope lines its brownstones up against Prospect Park, with the food co-op a few blocks away.",
  "ridgewood":
    "Ridgewood crosses the Brooklyn line quietly, with knish counters and new cafes sharing the same brick blocks.",
  "south-street-seaport":
    "The Seaport keeps the city's old harbor visible in its cobblestones, piers, and tall ships.",
  "sugar-hill":
    "Sugar Hill's row houses and apartment buildings still carry the neighborhood's literary and musical history.",
  "sunset-park":
    "Sunset Park brings Brooklyn's Chinatown and Little Latin America onto one hill, with the harbor laid out below.",
  "van-cortlandt-village":
    "Van Cortlandt Village backs onto the borough's biggest park, with trails and ballfields a few steps from the apartments.",
  "west-farms":
    "West Farms grew along the river and old trolley lines, with traces of that history still visible.",
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
