import { beforeEach, describe, expect, it, vi } from "vitest";

const getPublishedProjects = vi.fn();
vi.mock("@/lib/content", () => ({
  getPublishedProjects: () => getPublishedProjects(),
}));

import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import { siteConfig } from "@/lib/site-config";

describe("metadata routes", () => {
  beforeEach(() => {
    getPublishedProjects.mockResolvedValue([{ slug: "sample-project" }]);
  });

  it("uses one canonical production origin", () => {
    expect(siteConfig.siteUrl).toBe("https://www.mylesdesignsthings.com");
    expect(robots().sitemap).toBe(
      "https://www.mylesdesignsthings.com/sitemap.xml",
    );
  });

  it("includes About and published work without synthetic modified dates", async () => {
    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://www.mylesdesignsthings.com",
        "https://www.mylesdesignsthings.com/about",
        "https://www.mylesdesignsthings.com/work/sample-project",
      ]),
    );
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });
});
