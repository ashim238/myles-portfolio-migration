import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project, ProjectStatus } from "@/lib/content";

const getProjectBySlug = vi.fn();
const getPublishedProjects = vi.fn();

vi.mock("@/lib/content", () => ({
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => getPublishedProjects(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import TikTokPage from "@/app/work/tiktok/page";

function makeProject(status: ProjectStatus): Project {
  return {
    slug: "tiktok",
    title: "TikTok Dynamic Showcase Ads",
    summary: "Summary",
    role: "Visual Designer, Brand Studio",
    timeframe: "2021",
    status,
    order: 4,
    tags: [],
    sections: [],
    bodyHtml: "",
  };
}

describe("dedicated TikTok route visibility", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getPublishedProjects.mockResolvedValue([]);
  });

  it.each(["hidden", "draft"] as const)("404s when TikTok is %s", async (status) => {
    getProjectBySlug.mockResolvedValue(makeProject(status));
    await expect(TikTokPage()).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("renders when TikTok is published", async () => {
    getProjectBySlug.mockResolvedValue(makeProject("published"));
    await expect(TikTokPage()).resolves.toBeTruthy();
  });
});
