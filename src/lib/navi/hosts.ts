import { EXPERIENCES } from "@/lib/navi/demo-data";
import { slugify } from "@/lib/navi/slug";

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
  return slugify(name);
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

function deterministicHost(
  slug: string,
  name: string,
  neighborhood: string,
  experienceTitle: string,
): Host {
  const seed = hashSeed(slug);
  return {
    slug,
    name,
    neighborhood,
    bio: `${name} hosts ${experienceTitle} in ${neighborhood}.`,
    yearsHosting: pickIn(seed >>> 3, 2, 9),
    responseRate: pickIn(seed >>> 7, 88, 99),
  };
}

export const HOSTS: Record<string, Host> = (() => {
  const map: Record<string, Host> = {};
  for (const e of EXPERIENCES) {
    if (map[e.host.slug]) continue;
    map[e.host.slug] = deterministicHost(
      e.host.slug,
      e.host.name,
      e.neighborhood,
      e.title,
    );
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

export function experiencesByHost(slug: string) {
  return EXPERIENCES.filter((e) => e.host.slug === slug);
}
