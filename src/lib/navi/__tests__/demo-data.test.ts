import { describe, it, expect } from "vitest";
import { EXPERIENCES, getExperienceBySlug, CATEGORIES } from "@/lib/navi/demo-data";

describe("demo data", () => {
  it("exports at least 8 experiences", () => {
    expect(EXPERIENCES.length).toBeGreaterThanOrEqual(8);
  });

  it("every experience has a unique slug", () => {
    const slugs = EXPERIENCES.map((e) => e.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("every experience has lat/lng, price, rating, photos, and impactPhrase", () => {
    for (const e of EXPERIENCES) {
      expect(typeof e.lat).toBe("number");
      expect(typeof e.lng).toBe("number");
      // NYC bounding box: roughly lat 40.4-40.95, lng -74.3 to -73.7
      expect(e.lat).toBeGreaterThan(40.4);
      expect(e.lat).toBeLessThan(40.95);
      expect(e.lng).toBeGreaterThan(-74.3);
      expect(e.lng).toBeLessThan(-73.7);
      expect(e.price).toBeGreaterThanOrEqual(0); // some experiences are free / donation-based
      expect(e.rating).toBeGreaterThan(0);
      expect(e.rating).toBeLessThanOrEqual(5);
      expect(e.photos.length).toBeGreaterThan(0);
      for (const p of e.photos) {
        expect(p.src).toMatch(/^\/projects\/navi-demo\//);
        expect(p.alt.length).toBeGreaterThan(0);
      }
      expect(e.impactPhrase.length).toBeGreaterThan(0);
    }
  });

  it("every experience has Learn, Plan, and Go content", () => {
    for (const e of EXPERIENCES) {
      expect(e.learn.length).toBeGreaterThan(20);
      expect(e.plan.bring.length).toBeGreaterThan(0);
      expect(e.go.addressLine1.length).toBeGreaterThan(0);
      expect(e.go.transit.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("getExperienceBySlug returns the matching experience or undefined", () => {
    const first = EXPERIENCES[0];
    expect(getExperienceBySlug(first.slug)).toBe(first);
    expect(getExperienceBySlug("nope-not-real")).toBeUndefined();
  });

  it("CATEGORIES covers every experience's category", () => {
    for (const e of EXPERIENCES) {
      expect(CATEGORIES).toContain(e.category);
    }
  });
});
