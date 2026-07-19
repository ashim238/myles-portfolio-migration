import { EXPERIENCES } from "@/lib/navi/demo-data";
import { HOSTS, type Host } from "@/lib/navi/hosts";
import { slugify } from "@/lib/navi/slug";

export type Neighborhood = {
  slug: string;
  name: string;
  borough: string;
  intro: string;
};

export function neighborhoodSlug(name: string): string {
  return slugify(name);
}

// Narrative intros keyed by slug. One source of truth for the prose so the
// page never has to branch on the name. Boroughs come from the experience
// data, so we only store the intro text here.
const INTROS: Record<string, string> = {
  "astoria":
    "Greek, Egyptian, and Bangladeshi kitchens can share the same block, filling Astoria with a dozen smells at once.",
  "bedford-stuyvesant":
    "Brownstone history stays visible on Bed-Stuy's stoops and in the gardens that neighbors tend together.",
  "central-harlem":
    "A century of arrivals lives in Harlem's music and food. New work keeps joining that history.",
  "chelsea":
    "A few walkable avenues in Chelsea connect the High Line with galleries and old market halls.",
  "chinatown":
    "Produce stalls and tea houses set the pace in Chinatown. A slower walk reveals more of the block.",
  "coney-island":
    "Summer is Coney Island's loudest season. The boardwalk has a different rhythm for the rest of the year.",
  "dumbo":
    "Cobblestones and converted warehouses fill DUMBO's tight grid by the water, with bridge views close by.",
  "east-flatbush":
    "Caribbean culture is visible in East Flatbush's bakeries, churches, and weekend markets.",
  "east-village":
    "Record stores and community gardens keep punk and poetry close to the surface in the East Village, where both have outlasted many trends.",
  "flushing":
    "No single guidebook could cover the regional cooking packed into Flushing's food halls.",
  "greenpoint":
    "Polish bakeries remain part of Greenpoint as the waterfront fills in around them.",
  "hamilton-heights":
    "An uptown walk through Hamilton Heights passes row houses, jazz history, and a college campus folded into the hills.",
  "hunts-point":
    "Before dawn, the market in Hunts Point feeds the city. It remains a residential neighborhood long after the trucks leave.",
  "inwood":
    "The island's last old forest and some of its steepest streets meet in Inwood at Manhattan's northern edge.",
  "jackson-heights":
    "An extraordinary range of languages and food fits into Jackson Heights' compact grid of apartment blocks and storefronts.",
  "long-island-city":
    "Towers and studios layer over Long Island City's industrial past, all of it facing the Manhattan skyline.",
  "lower-east-side":
    "Generations of immigrant history remain visible in the Lower East Side's tenements, storefronts, and food.",
  "mott-haven":
    "Waterfront parks sit a few blocks from Mott Haven's murals and industrial buildings.",
  "park-slope":
    "Brownstones line the streets beside Prospect Park in Park Slope, with the food co-op a few blocks away.",
  "ridgewood":
    "Just across the Brooklyn line, knish counters and new cafes quietly share Ridgewood's brick blocks.",
  "south-street-seaport":
    "Cobblestones, piers, and tall ships keep the city's old harbor visible at the Seaport.",
  "sugar-hill":
    "Row houses and apartment buildings still carry Sugar Hill's literary and musical history.",
  "sunset-park":
    "Brooklyn's Chinatown and Little Latin America share one hill in Sunset Park, with the harbor laid out below.",
  "van-cortlandt-village":
    "Trails and ballfields in the borough's biggest park sit a few steps from Van Cortlandt Village's apartments.",
  "west-farms":
    "The river and old trolley lines shaped West Farms, and traces of that history are still visible.",
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
