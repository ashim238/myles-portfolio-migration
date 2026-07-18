import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { ProjectWorkJump } from "@/components/project-work-jump";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

vi.mock("@/components/transition-link", () => ({
  TransitionLink: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

vi.mock("@/components/tiktok-dsa", () => ({
  TikTokCoverBlobs: ({
    deferUntilVisible,
  }: {
    deferUntilVisible?: boolean;
  }) => (
    <span data-testid="tiktok-cover-blobs" data-deferred={deferUntilVisible} />
  ),
}));

function project(slug: string, title: string): Project {
  return {
    slug,
    title,
    summary: `${title} summary`,
    role: "Product Designer",
    timeframe: "2026",
    status: "published",
    order: 1,
    tags: [],
    coverImage: `/projects/${slug}/cover.png`,
    sections: [],
    bodyHtml: "",
  };
}

const projects = [
  project("fresh-greens", "Fresh Greens"),
  project("navi", "Navi"),
  project("understandingfafsa", "UnderstandingFAFSA"),
  project("tiktok", "TikTok Dynamic Showcase Ads"),
];

describe("ProjectWorkJump", () => {
  it("renders one destination link and one work-index link", () => {
    render(<ProjectWorkJump currentSlug="fresh-greens" projects={projects} />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/work/navi");
    expect(links[0]).toHaveTextContent("Next project");
    expect(links[0]).toHaveTextContent("Navi");
    expect(links[0]).toHaveTextContent(
      "I also explored routing through neighborhood discovery and local booking.",
    );
    expect(links[1]).toHaveAttribute("href", "/#work");
    expect(links[1]).toHaveTextContent("View all work");
  });

  it("treats destination media as decorative inside the descriptive link", () => {
    const { container } = render(
      <ProjectWorkJump currentSlug="fresh-greens" projects={projects} />,
    );

    expect(
      container.querySelector(".project-work-jump-media img"),
    ).toHaveAttribute("alt", "");
  });

  it("uses the deferred TikTok mark for the TikTok destination", () => {
    render(
      <ProjectWorkJump currentSlug="understandingfafsa" projects={projects} />,
    );

    expect(screen.getByTestId("tiktok-cover-blobs")).toHaveAttribute(
      "data-deferred",
      "true",
    );
    expect(screen.queryByRole("img", { hidden: true })).toBeNull();
  });

  it("retains the media surface when a published image is missing", () => {
    const withoutCover = projects.map((item) =>
      item.slug === "navi" ? { ...item, coverImage: undefined } : item,
    );
    const { container } = render(
      <ProjectWorkJump currentSlug="fresh-greens" projects={withoutCover} />,
    );

    expect(container.querySelector(".project-work-jump-media")).not.toBeNull();
  });

  it("gives UnderstandingFAFSA a semantic wrap point between its two words", () => {
    render(<ProjectWorkJump currentSlug="navi" projects={projects} />);

    const title = screen.getByRole("heading", { name: "UnderstandingFAFSA" });
    expect(title.querySelector("wbr")).not.toBeNull();
  });

  it.each([
    ["unknown", projects],
    [
      "fresh-greens",
      projects.map((item) =>
        item.slug === "navi" ? { ...item, status: "draft" as const } : item,
      ),
    ],
  ])("keeps View all work when no destination resolves", (slug, items) => {
    render(<ProjectWorkJump currentSlug={slug} projects={items} />);

    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link", { name: /View all work/ })).toHaveAttribute(
      "href",
      "/#work",
    );
    expect(screen.queryByText("Next project")).toBeNull();
  });
});
