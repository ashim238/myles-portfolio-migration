import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
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
  usePathname: () => "/",
  useRouter: () => ({ push: () => {} }),
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
    vi.stubGlobal(
      "IntersectionObserver",
      class IntersectionObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
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

  it.each([
    {
      name: "Fresh Greens",
      slug: "fresh-greens",
      render: FreshGreensPage,
      type: "Working mobile prototype",
      cta: "See the pulled-over flow",
      href: "#fg-pulled-over",
      artifactName: "Interactive case-study reconstruction",
      artifactRole: "heading" as const,
    },
    {
      name: "UnderstandingFAFSA",
      slug: "understandingfafsa",
      render: UnderstandingFafsaPage,
      type: "Working newsletter system",
      cta: "Build a sample send",
      href: "#uf-locked",
      artifactName: "Try the system",
      artifactRole: "button" as const,
    },
  ])(
    "links the $name evidence trailhead to its rendered artifact",
    async (surface) => {
      getProjectBySlug.mockResolvedValue(makeProject(surface.slug, "published"));
      const { container } = render(await surface.render());

      expect(screen.getByText(surface.type)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: surface.cta })).toHaveAttribute(
        "href",
        surface.href,
      );

      const target = container.querySelector(surface.href);
      expect(target).not.toBeNull();
      const chapter = target?.closest(".project-chapter");
      expect(chapter).not.toBeNull();
      expect(
        within(chapter as HTMLElement).getByRole(surface.artifactRole, {
          name: surface.artifactName,
        }),
      ).toBeInTheDocument();
    },
  );

  it("renders Navi's evidence trailhead as a direct product-demo link", async () => {
    getProjectBySlug.mockResolvedValue(makeProject("navi", "published"));
    render(await NaviPage());

    expect(screen.getByText("Working product demo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try the booking flow" })).toHaveAttribute(
      "href",
      "/work/navi/demo",
    );
  });
});
