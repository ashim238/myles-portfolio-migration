import { describe, it, expect } from "vitest";
import {
  SYNTHESIS,
  FEATURE_REQUESTS,
} from "@/lib/fresh-greens/research-synthesis-data";

describe("research synthesis data", () => {
  it("has the four markers plus the community cluster, in order", () => {
    expect(SYNTHESIS.map((s) => s.key)).toEqual([
      "light",
      "police",
      "wildlife",
      "road",
      "community",
    ]);
  });

  it("every cluster cites how many of six raised it, with 2+ snippets", () => {
    for (const s of SYNTHESIS) {
      expect(s.raisedBy).toBeGreaterThanOrEqual(1);
      expect(s.raisedBy).toBeLessThanOrEqual(6);
      expect(s.snippets.length).toBeGreaterThanOrEqual(2);
      expect(s.insight.length).toBeGreaterThan(0);
      expect(s.designResponse.length).toBeGreaterThan(0);
    }
  });

  it("pairs at least three unprompted requests to shipped features", () => {
    expect(FEATURE_REQUESTS.length).toBeGreaterThanOrEqual(3);
    for (const r of FEATURE_REQUESTS) {
      expect(r.asked.length).toBeGreaterThan(0);
      expect(r.became.length).toBeGreaterThan(0);
    }
  });
});
