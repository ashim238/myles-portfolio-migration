import type { ReactNode } from "react";
import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
    render: () => UnderstandingFafsaPage({}),
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
  afterEach(() => vi.unstubAllEnvs());

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
      cta: "Compare two routes to Weeksville",
      href: "#fg-app-walkthrough",
      artifactName: "Compare two routes to Weeksville",
      artifactRole: "heading" as const,
    },
    {
      name: "UnderstandingFAFSA",
      slug: "understandingfafsa",
      render: () => UnderstandingFafsaPage({}),
      cta: "Try the newsletter templates",
      href: "#uf-locked",
      artifactName: "Try the system",
      artifactRole: "button" as const,
    },
  ])(
    "links the $name canonical opening proof to its rendered artifact",
    async (surface) => {
      getProjectBySlug.mockResolvedValue(makeProject(surface.slug, "published"));
      const { container } = render(await surface.render());

      expect(
        screen.getByRole("link", { name: `Open proof: ${surface.cta}` }),
      ).toHaveAttribute("href", surface.href);

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

  it("keeps the comparison directly usable in the first chapter even with a former simulator setting", async () => {
    vi.stubEnv("FRESH_GREENS_APPETIZE_BUILD_ID", "demo");
    getProjectBySlug.mockResolvedValue(makeProject("fresh-greens", "published"));
    const { container } = render(await FreshGreensPage());
    const chapter = container.querySelector(".project-chapter");
    const comparison = chapter?.querySelector<HTMLElement>("#fg-app-walkthrough");
    expect(comparison).toBeInTheDocument();
    expect(comparison?.closest("details")).toBeNull();
    expect(container.querySelectorAll("#fg-app-walkthrough")).toHaveLength(1);
    expect(within(comparison!).getByRole("button", { name: "Next route" })).toBeVisible();
    expect(within(comparison!).queryByRole("button", { name: /simulator|open the ios app/i })).toBeNull();
    expect(comparison?.querySelector("iframe")).toBeNull();
  });

  it("renders Navi's canonical opening proof as a direct product-demo link", async () => {
    getProjectBySlug.mockResolvedValue(makeProject("navi", "published"));
    render(await NaviPage());

    expect(
      screen.getByRole("link", { name: "Open proof: Try the booking flow" }),
    ).toHaveAttribute("href", "/work/navi/demo");
  });
});
