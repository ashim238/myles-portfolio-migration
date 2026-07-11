import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Project, ProjectStatus } from "@/lib/content";

// Stub the content pipeline: the unit under test is the hidden-project
// filtering in the [slug] route, not the markdown + sharp image pipeline that
// getAllProjects runs. Controlling the data source keeps this fast and
// deterministic.
const getAllProjects = vi.fn();
const getProjectBySlug = vi.fn();
const getPublishedProjects = vi.fn();
vi.mock("@/lib/content", () => ({
  getAllProjects: () => getAllProjects(),
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => getPublishedProjects(),
}));

// notFound() normally throws a framework sentinel; mirror that so we can assert
// the route bails for hidden projects.
vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
}));

import ProjectPage, { generateStaticParams } from "@/app/work/[slug]/page";

function makeProject(slug: string, status: ProjectStatus): Project {
  return {
    slug,
    title: `${slug} title`,
    summary: `${slug} summary`,
    role: "Designer",
    timeframe: "2025",
    status,
    order: 0,
    tags: [],
    sections: [],
    bodyHtml: "",
  };
}

describe("work/[slug] route hides hidden projects", () => {
  beforeEach(() => {
    getAllProjects.mockReset();
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getPublishedProjects.mockResolvedValue([]);
  });

  it("generateStaticParams emits published and draft slugs but not hidden ones", async () => {
    getAllProjects.mockResolvedValue([
      makeProject("navi", "published"),
      makeProject("understandingfafsa", "published"),
      makeProject("work-in-progress", "draft"),
      makeProject("secret-case", "hidden"),
    ]);

    const slugs = (await generateStaticParams()).map((p) => p.slug);

    expect(slugs).toEqual(
      expect.arrayContaining(["navi", "understandingfafsa", "work-in-progress"]),
    );
    expect(slugs).not.toContain("secret-case");
  });

  it("404s a hidden project requested directly", async () => {
    getProjectBySlug.mockResolvedValue(makeProject("secret-case", "hidden"));

    await expect(
      ProjectPage({ params: Promise.resolve({ slug: "secret-case" }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("still renders a draft project so in-progress work stays viewable", async () => {
    getProjectBySlug.mockResolvedValue(makeProject("work-in-progress", "draft"));

    const result = await ProjectPage({
      params: Promise.resolve({ slug: "work-in-progress" }),
    });

    expect(result).toBeTruthy();
  });
});
