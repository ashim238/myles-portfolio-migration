import { describe, expect, it } from "vitest";
import type { Project } from "@/lib/content";
import { resolveNextProject } from "@/lib/project-sequence";

function project(slug: string, status: Project["status"] = "published"): Project {
  return {
    slug,
    title: slug,
    summary: `${slug} summary`,
    role: "Product Designer",
    timeframe: "2026",
    status,
    order: 1,
    tags: [],
    coverImage: `/projects/${slug}/cover.png`,
    sections: [],
    bodyHtml: "",
  };
}

const projects = [
  project("fresh-greens"),
  project("navi"),
  project("understandingfafsa"),
  project("tiktok"),
];

describe("resolveNextProject", () => {
  it.each([
    [
      "fresh-greens",
      "navi",
      "I also explored routing through neighborhood discovery and local booking.",
    ],
    [
      "navi",
      "understandingfafsa",
      "I turned an audit of 120 newsletter sends into a modular system a non-designer could run each week.",
    ],
    [
      "understandingfafsa",
      "tiktok",
      "At TikTok, I designed static catalog templates for different product categories, keeping the product slots fixed while the visual systems changed.",
    ],
    [
      "tiktok",
      "fresh-greens",
      "Fresh Greens is my most recent project: a route-planning prototype shaped by interviews with Black drivers.",
    ],
  ])("maps %s to %s", (currentSlug, nextSlug, bridge) => {
    expect(resolveNextProject(currentSlug, projects)).toEqual({
      project: expect.objectContaining({ slug: nextSlug }),
      bridge,
    });
  });

  it("returns null for an unknown current project", () => {
    expect(resolveNextProject("unknown", projects)).toBeNull();
  });

  it("returns null when the mapped destination is missing", () => {
    expect(resolveNextProject("fresh-greens", projects.slice(0, 1))).toBeNull();
  });

  it("returns null when the mapped destination is a draft", () => {
    const withDraftNavi = projects.map((item) =>
      item.slug === "navi" ? { ...item, status: "draft" as const } : item,
    );

    expect(resolveNextProject("fresh-greens", withDraftNavi)).toBeNull();
  });

  it("keeps every bridge free of banned punctuation", () => {
    for (const current of projects) {
      const resolved = resolveNextProject(current.slug, projects);
      expect(resolved?.bridge).not.toMatch(/[—;…]/);
    }
  });
});
