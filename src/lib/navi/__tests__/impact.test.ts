import { describe, it, expect } from "vitest";
import { EXPERIENCES, type ImpactTheme } from "@/lib/navi/demo-data";

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
      heritage: 9,
      education: 5,
      "food-security": 4,
      environment: 11,
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
