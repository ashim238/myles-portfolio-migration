import { describe, it, expect } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("published gallery order", () => {
  it("leads with FAFSA, then Fresh Greens, Navi (TikTok stays hidden)", async () => {
    const slugs = (await getPublishedProjects()).map((p) => p.slug);
    expect(slugs).toEqual(["understandingfafsa", "fresh-greens", "navi"]);
  });
});
