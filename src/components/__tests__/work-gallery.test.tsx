import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { WorkGallery } from "@/components/work-gallery";

vi.mock("@/components/work-project-card", () => ({
  WorkProjectCard: ({
    project,
    index,
  }: {
    project: Project;
    index: number;
  }) => (
    <article
      data-testid={`project-${project.slug}`}
      data-index={index}
    >
      {project.title}
    </article>
  ),
}));

vi.mock("@/components/gallery-reveal", () => ({
  GalleryReveal: () => null,
}));

function project(slug: string): Project {
  return {
    slug,
    title: slug,
    summary: `${slug} summary`,
    role: "Product Designer",
    timeframe: "2026",
    status: "published",
    order: 1,
    tags: [],
    sections: [],
    bodyHtml: "",
  };
}

describe("WorkGallery", () => {
  it("keeps all four projects in one equal ordered grid", () => {
    const projects = ["fresh-greens", "understandingfafsa", "navi", "tiktok"].map(project);
    const { container } = render(<WorkGallery projects={projects} />);

    const cards = screen.getAllByRole("article");
    expect(cards.map((card) => card.textContent)).toEqual([
      "fresh-greens",
      "understandingfafsa",
      "navi",
      "tiktok",
    ]);
    expect(cards.map((card) => card.dataset.index)).toEqual(["0", "1", "2", "3"]);

    const grid = container.querySelector(".work-gallery-grid");
    expect(grid).not.toBeNull();
    expect(within(grid as HTMLElement).getAllByRole("article")).toHaveLength(4);
    expect(container.querySelector(".work-gallery-feature")).toBeNull();
    expect(container.querySelector(".work-gallery-closing")).toBeNull();
    expect(container.querySelector(".work-gallery-closing-wrap")).toBeNull();
  });

  it("keeps smaller project sets in the same shared grid", () => {
    const projects = ["first", "second", "third"].map(project);
    const { container } = render(<WorkGallery projects={projects} />);

    expect(
      within(container.querySelector(".work-gallery-grid") as HTMLElement).getAllByRole(
        "article",
      ),
    ).toHaveLength(3);
    expect(screen.getAllByRole("article").map((card) => card.dataset.index)).toEqual([
      "0",
      "1",
      "2",
    ]);
  });

  it("renders the empty-state message without an empty grid", () => {
    const projects: Project[] = [];
    const { container } = render(<WorkGallery projects={projects} />);

    expect(screen.getByText("No published projects yet.")).toBeInTheDocument();
    expect(container.querySelector(".work-gallery-grid")).toBeNull();
  });
});
