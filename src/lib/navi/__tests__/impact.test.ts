import { describe, it, expect } from "vitest";
import { EXPERIENCES, type ImpactTheme } from "@/lib/navi/demo-data";
import { IMPACT_THEMES, getImpactSummary } from "@/lib/navi/impact";

const THEMES: ImpactTheme[] = [
  "heritage",
  "education",
  "food-security",
  "environment",
  "arts-funding",
];

describe("impactTheme migration", () => {
  it("gives every experience a valid impactTheme", () => {
    for (const e of EXPERIENCES) {
      expect(THEMES).toContain(e.impactTheme);
    }
  });

  it("assigns the expected count to each theme", () => {
    const counts = THEMES.reduce<Record<string, number>>((acc, t) => {
      acc[t] = EXPERIENCES.filter((e) => e.impactTheme === t).length;
      return acc;
    }, {});
    expect(counts).toEqual({
      heritage: 10,
      education: 5,
      "food-security": 4,
      environment: 10,
      "arts-funding": 8,
    });
  });

  it("covers all 37 experiences with no theme empty", () => {
    expect(EXPERIENCES).toHaveLength(37);
    for (const t of THEMES) {
      expect(EXPERIENCES.some((e) => e.impactTheme === t)).toBe(true);
    }
  });
});

describe("getImpactSummary", () => {
  it("returns one section per theme in declared order", () => {
    const summary = getImpactSummary();
    expect(summary.map((s) => s.id)).toEqual([
      "heritage",
      "education",
      "food-security",
      "environment",
      "arts-funding",
    ]);
  });

  it("gives each section a human label and its theme anchor", () => {
    const summary = getImpactSummary();
    const heritage = summary.find((s) => s.id === "heritage");
    expect(heritage?.label).toBe("Heritage preservation");
    expect(heritage?.anchor).toBe("heritage");
  });

  it("puts every experience in exactly one section", () => {
    const summary = getImpactSummary();
    const total = summary.reduce((n, s) => n + s.experiences.length, 0);
    expect(total).toBe(EXPERIENCES.length);
  });

  it("section experiences all share the section theme", () => {
    for (const s of getImpactSummary()) {
      for (const e of s.experiences) {
        expect(e.impactTheme).toBe(s.id);
      }
    }
  });

  it("IMPACT_THEMES has five entries with id and label", () => {
    expect(IMPACT_THEMES).toHaveLength(5);
    for (const t of IMPACT_THEMES) {
      expect(typeof t.id).toBe("string");
      expect(t.label.length).toBeGreaterThan(0);
    }
  });
});
