import { describe, it, expect } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("published gallery order", () => {
  it("leads with the latest project, then Navi, FAFSA, and TikTok", async () => {
    const slugs = (await getPublishedProjects()).map((p) => p.slug);
    expect(slugs).toEqual([
      "fresh-greens",
      "navi",
      "understandingfafsa",
      "tiktok",
    ]);
  });
});
