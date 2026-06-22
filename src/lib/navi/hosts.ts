import { EXPERIENCES } from "@/lib/navi/demo-data";

export type Host = {
  slug: string;
  name: string;
  bio: string;
  neighborhood: string;
  yearsHosting: number;
  responseRate: number;
  avatarSrc?: string;
};

export function slugifyHostName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function pickIn(seed: number, min: number, max: number): number {
  const range = max - min + 1;
  return min + (seed % range);
}

const BIO_TEMPLATES = [
  "Lives a block from where the experience meets. Started hosting after friends kept asking for the inside route, and still treats every booking that way.",
  "Has run this experience long enough to know which week of the year it's quietest, and which corner of the room catches the best afternoon light.",
  "Trained as a teacher before going independent. Keeps groups small on purpose, because the conversation is the point.",
  "Came to Brooklyn for one specific reason and stayed for ten others. Each is somewhere on the tour.",
  "Was a regular at every place this experience visits, long before turning host. Knows the staff by name and brings receipts.",
];

function deterministicHost(slug: string, name: string, neighborhood: string): Host {
  const seed = hashSeed(slug);
  return {
    slug,
    name,
    neighborhood,
    bio: BIO_TEMPLATES[seed % BIO_TEMPLATES.length],
    yearsHosting: pickIn(seed >>> 3, 2, 9),
    responseRate: pickIn(seed >>> 7, 88, 99),
  };
}

export const HOSTS: Record<string, Host> = (() => {
  const map: Record<string, Host> = {};
  for (const e of EXPERIENCES) {
    if (map[e.host.slug]) continue;
    map[e.host.slug] = deterministicHost(e.host.slug, e.host.name, e.neighborhood);
  }
  return map;
})();

export function getHostBySlug(slug: string): Host | undefined {
  return HOSTS[slug];
}

export type HostAggregate = {
  experienceCount: number;
  reviewCount: number;
  averageRating: number;
};

export function hostAggregate(slug: string): HostAggregate {
  const list = EXPERIENCES.filter((e) => e.host.slug === slug);
  const reviewCount = list.reduce((s, e) => s + e.reviews, 0);
  const weighted = list.reduce((s, e) => s + e.rating * e.reviews, 0);
  return {
    experienceCount: list.length,
    reviewCount,
    averageRating: reviewCount === 0 ? 0 : weighted / reviewCount,
  };
}
