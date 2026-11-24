import { describe, it, expect } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("published gallery order", () => {
  it("shows the published case studies in portfolio order", async () => {
    const slugs = (await getPublishedProjects()).map((p) => p.slug);
    expect(slugs).toEqual([
      "julius-design-system",
      "fresh-greens",
      "navi",
      "understandingfafsa",
      "tiktok",
    ]);
  });
});
