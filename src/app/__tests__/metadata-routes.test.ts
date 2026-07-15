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
    expect(siteConfig.siteUrl).toBe("https://mylesdesignsthings.com");
    expect(robots().sitemap).toBe(
      "https://mylesdesignsthings.com/sitemap.xml",
    );
  });

  it("includes About and published work without synthetic modified dates", async () => {
    const entries = await sitemap();
    expect(entries.map((entry) => entry.url)).toEqual(
      expect.arrayContaining([
        "https://mylesdesignsthings.com",
        "https://mylesdesignsthings.com/about",
        "https://mylesdesignsthings.com/work/sample-project",
      ]),
    );
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(
      true,
    );
  });
});
