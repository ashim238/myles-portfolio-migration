import type { ReactNode } from "react";
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

vi.mock("next/font/google", () => ({
  Jost: () => ({ variable: "--font-navi-display" }),
  Lato: () => ({ variable: "--font-navi-ui" }),
}));

vi.mock("@/lib/navi/fonts", () => ({
  naviDisplay: { variable: "--font-navi-display" },
  naviBody: { variable: "--font-navi-body" },
}));

import FreshGreensPage from "@/app/work/fresh-greens/page";
import NaviPage from "@/app/work/navi/page";
import NaviMinisiteLayout from "@/app/work/navi/(minisite)/layout";
import UnderstandingFafsaPage from "@/app/work/understandingfafsa/page";

type Surface = {
  name: string;
  slug: string;
  render: () => ReactNode | Promise<ReactNode>;
};

const surfaces: Surface[] = [
  { name: "Fresh Greens", slug: "fresh-greens", render: FreshGreensPage },
  { name: "Navi case study", slug: "navi", render: NaviPage },
  {
    name: "Navi minisite",
    slug: "navi",
    render: () => NaviMinisiteLayout({ children: <p>Demo</p> }),
  },
  {
    name: "UnderstandingFAFSA",
    slug: "understandingfafsa",
    render: UnderstandingFafsaPage,
  },
];

function makeProject(slug: string, status: ProjectStatus): Project {
  return {
    slug,
    title: slug,
    summary: "Summary",
    role: "Product Designer",
    timeframe: "2025",
    status,
    order: 1,
    tags: [],
    sections: [],
    bodyHtml: "",
  };
}

describe("dedicated project route visibility", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getPublishedProjects.mockResolvedValue([]);
  });

  it.each(surfaces)("renders $name only when its project is published", async (surface) => {
    getProjectBySlug.mockResolvedValue(makeProject(surface.slug, "published"));

    await expect(Promise.resolve().then(() => surface.render())).resolves.toBeTruthy();
    expect(getProjectBySlug).toHaveBeenCalledWith(surface.slug);
  });

  it.each(
    surfaces.flatMap((surface) =>
      (["draft", "hidden"] as const).map((status) => ({ surface, status })),
    ),
  )("404s $surface.name when its project is $status", async ({ surface, status }) => {
    getProjectBySlug.mockResolvedValue(makeProject(surface.slug, status));

    await expect(Promise.resolve().then(() => surface.render())).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });

  it.each(surfaces)("404s $name when its project is missing", async (surface) => {
    getProjectBySlug.mockResolvedValue(null);

    await expect(Promise.resolve().then(() => surface.render())).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
  });
});
