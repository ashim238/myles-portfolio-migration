import { describe, expect, it } from "vitest";
import { RESERVED_LANES } from "../palette";

describe("RESERVED_LANES", () => {
  it("has the five reserved families in order", () => {
    expect(RESERVED_LANES.map((l) => l.family)).toEqual([
      "red",
      "orange",
      "yellow",
      "navy",
      "daylight",
    ]);
  });

  it("documents all 12 carve-outs", () => {
    const total = RESERVED_LANES.reduce((n, l) => n + l.carveOuts.length, 0);
    expect(total).toBe(12);
  });

  it("gives every lane a swatch and every carve-out a tag + note", () => {
    for (const lane of RESERVED_LANES) {
      expect(lane.swatch).toMatch(/\S/);
      expect(lane.name).toMatch(/\S/);
      expect(lane.carveOuts.length).toBeGreaterThan(0);
      for (const c of lane.carveOuts) {
        expect(c.tag).toMatch(/\S/);
        expect(c.note).toMatch(/\S/);
      }
    }
  });
});
