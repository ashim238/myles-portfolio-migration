import { describe, it, expect } from "vitest";
import { getPublishedProjects } from "@/lib/content";

describe("published gallery order", () => {
  it("leads with the latest project, then FAFSA and Navi (TikTok stays hidden)", async () => {
    const slugs = (await getPublishedProjects()).map((p) => p.slug);
    expect(slugs).toEqual(["fresh-greens", "understandingfafsa", "navi"]);
  });
});
