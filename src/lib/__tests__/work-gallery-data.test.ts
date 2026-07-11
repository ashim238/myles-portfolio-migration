import { describe, expect, it } from "vitest";
import { galleryOutcome, galleryMeta } from "@/lib/work-gallery-data";
import type { Project } from "@/lib/content";

const base: Project = {
  slug: "x", title: "X", summary: "A summary sentence.", role: "Product Designer",
  timeframe: "2025", status: "published", order: 1, tags: ["Thesis", "Mobile"],
  sections: [], bodyHtml: "",
};

describe("galleryOutcome", () => {
  it("uses outcomeLead + outcomeRest when set", () => {
    expect(galleryOutcome({ ...base, outcomeLead: "75% lift", outcomeRest: "in open rate." }))
      .toEqual({ lead: "75% lift", rest: "in open rate." });
  });
  it("falls back to metric value + label", () => {
    expect(galleryOutcome({ ...base, outcomeMetricValue: "78%", outcomeMetricLabel: "preferred it" }))
      .toEqual({ lead: "78%", rest: "preferred it" });
  });
  it("falls back to summary with no lead when nothing else", () => {
    expect(galleryOutcome(base)).toEqual({ lead: "", rest: "A summary sentence." });
  });
});

describe("galleryMeta", () => {
  it("joins role and timeframe with a middot", () => {
    expect(galleryMeta(base)).toBe("Product Designer · 2025");
  });
});
