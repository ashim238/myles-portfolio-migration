import { describe, it, expect } from "vitest";
import {
  HOSTS,
  slugifyHostName,
  getHostBySlug,
  hostAggregate,
  experiencesByHost,
} from "@/lib/navi/hosts";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("slugifyHostName", () => {
  it("kebab-cases simple names", () => {
    expect(slugifyHostName("Paul Stein")).toBe("paul-stein");
  });
  it("strips diacritics and punctuation", () => {
    expect(slugifyHostName("Eléni Papadópoulos-Smith")).toBe("eleni-papadopoulos-smith");
  });
});

describe("HOSTS record", () => {
  it("has a record for every distinct host slug referenced by an experience", () => {
    const referenced = new Set(EXPERIENCES.map((e) => e.host.slug));
    for (const slug of referenced) {
      expect(HOSTS[slug], `missing HOSTS["${slug}"]`).toBeDefined();
    }
  });

  it("uses a distinct, listing-derived introduction for every host", () => {
    const hosts = Object.values(HOSTS);
    const bios = hosts.map((host) => host.bio);

    expect(new Set(bios).size).toBe(hosts.length);
    for (const host of hosts) {
      const experience = EXPERIENCES.find((item) => item.host.slug === host.slug);
      expect(experience).toBeDefined();
      expect(host.bio).toContain(experience!.title);
      expect(host.bio).toContain(host.neighborhood);
    }
  });
});

describe("getHostBySlug", () => {
  it("returns the host when found", () => {
    const h = getHostBySlug("paul-stein");
    expect(h?.name).toBe("Paul Stein");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getHostBySlug("nobody")).toBeUndefined();
  });
});

describe("hostAggregate", () => {
  it("computes average rating and total review count across the host's experiences", () => {
    const all = EXPERIENCES.filter((e) => e.host.slug === "paul-stein");
    const agg = hostAggregate("paul-stein");
    expect(agg.experienceCount).toBe(all.length);
    expect(agg.reviewCount).toBe(all.reduce((s, e) => s + e.reviews, 0));
    const expectedAvg =
      all.reduce((s, e) => s + e.rating * e.reviews, 0) /
      Math.max(1, all.reduce((s, e) => s + e.reviews, 0));
    expect(agg.averageRating).toBeCloseTo(expectedAvg, 2);
  });

  it("returns zeroes for a host with no experiences", () => {
    const agg = hostAggregate("nobody");
    expect(agg.experienceCount).toBe(0);
    expect(agg.reviewCount).toBe(0);
    expect(agg.averageRating).toBe(0);
  });
});

describe("experiencesByHost", () => {
  it("returns all experiences whose host matches the slug", () => {
    const list = experiencesByHost("paul-stein");
    expect(list.length).toBeGreaterThan(0);
    for (const e of list) expect(e.host.slug).toBe("paul-stein");
  });
  it("returns an empty array for an unknown slug", () => {
    expect(experiencesByHost("nobody")).toEqual([]);
  });
});
