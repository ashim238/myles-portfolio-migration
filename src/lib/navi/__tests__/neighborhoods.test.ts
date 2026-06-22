import { describe, it, expect } from "vitest";
import {
  NEIGHBORHOODS,
  neighborhoodSlug,
  getNeighborhoodBySlug,
  experiencesByNeighborhood,
  neighborhoodCentroid,
  hostsByNeighborhood,
} from "@/lib/navi/neighborhoods";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("neighborhoodSlug", () => {
  it("kebab-cases names", () => {
    expect(neighborhoodSlug("Park Slope")).toBe("park-slope");
  });
  it("handles hyphens and uppercase acronyms", () => {
    expect(neighborhoodSlug("Bedford-Stuyvesant")).toBe("bedford-stuyvesant");
    expect(neighborhoodSlug("DUMBO")).toBe("dumbo");
  });
});

describe("NEIGHBORHOODS record", () => {
  it("has an entry for every distinct neighborhood referenced by an experience", () => {
    const referenced = new Set(EXPERIENCES.map((e) => neighborhoodSlug(e.neighborhood)));
    for (const slug of referenced) {
      expect(NEIGHBORHOODS[slug], `missing NEIGHBORHOODS["${slug}"]`).toBeDefined();
    }
  });
  it("gives each entry a non-empty intro and a borough", () => {
    for (const n of Object.values(NEIGHBORHOODS)) {
      expect(n.intro.length).toBeGreaterThan(0);
      expect(n.borough.length).toBeGreaterThan(0);
    }
  });
});

describe("getNeighborhoodBySlug", () => {
  it("returns the neighborhood when found", () => {
    expect(getNeighborhoodBySlug("park-slope")?.name).toBe("Park Slope");
  });
  it("returns undefined for an unknown slug", () => {
    expect(getNeighborhoodBySlug("nowhere")).toBeUndefined();
  });
});

describe("experiencesByNeighborhood", () => {
  it("returns every experience whose neighborhood slug matches", () => {
    const list = experiencesByNeighborhood("park-slope");
    expect(list.length).toBeGreaterThan(0);
    for (const e of list) expect(neighborhoodSlug(e.neighborhood)).toBe("park-slope");
  });
  it("returns an empty array for an unknown slug", () => {
    expect(experiencesByNeighborhood("nowhere")).toEqual([]);
  });
});

describe("neighborhoodCentroid", () => {
  it("averages lat and lng across the neighborhood's experiences", () => {
    const list = experiencesByNeighborhood("park-slope");
    const expectedLat = list.reduce((s, e) => s + e.lat, 0) / list.length;
    const expectedLng = list.reduce((s, e) => s + e.lng, 0) / list.length;
    const c = neighborhoodCentroid("park-slope");
    expect(c).not.toBeNull();
    expect(c![0]).toBeCloseTo(expectedLat, 6);
    expect(c![1]).toBeCloseTo(expectedLng, 6);
  });
  it("returns null when there are no experiences", () => {
    expect(neighborhoodCentroid("nowhere")).toBeNull();
  });
});

describe("hostsByNeighborhood", () => {
  it("returns distinct hosts whose experiences are in the neighborhood", () => {
    const hosts = hostsByNeighborhood("park-slope");
    expect(hosts.length).toBeGreaterThan(0);
    const slugs = hosts.map((h) => h.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
  it("returns an empty array for an unknown slug", () => {
    expect(hostsByNeighborhood("nowhere")).toEqual([]);
  });
});
