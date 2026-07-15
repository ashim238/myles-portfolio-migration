import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { WorkGallery } from "@/components/work-gallery";

vi.mock("@/components/work-project-card", () => ({
  WorkProjectCard: ({
    project,
    index,
    featured,
    closing,
  }: {
    project: Project;
    index: number;
    featured?: boolean;
    closing?: boolean;
  }) => (
    <article
      data-testid={`project-${project.slug}`}
      data-index={index}
      data-featured={featured ? "true" : "false"}
      data-closing={closing ? "true" : "false"}
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
  it("keeps four projects in order with a featured lead, paired middle, and closing card", () => {
    const projects = ["fresh-greens", "understandingfafsa", "navi", "tiktok"].map(project);
    const { container } = render(<WorkGallery projects={projects} />);

    const cards = screen.getAllByRole("article");
    expect(cards.map((card) => card.textContent)).toEqual([
      "fresh-greens",
      "understandingfafsa",
      "navi",
      "tiktok",
    ]);
    expect(screen.getByTestId("project-fresh-greens")).toHaveAttribute(
      "data-featured",
      "true",
    );

    const grid = container.querySelector(".work-gallery-grid");
    expect(grid).not.toBeNull();
    expect(within(grid as HTMLElement).getAllByRole("article")).toHaveLength(3);
    expect(screen.getByTestId("project-tiktok")).toHaveAttribute(
      "data-closing",
      "true",
    );
    expect(screen.getByTestId("project-tiktok").parentElement).toHaveClass(
      "work-gallery-closing-wrap",
    );
    expect(screen.getByTestId("project-tiktok").parentElement?.parentElement).toBe(grid);
  });

  it("keeps an even remainder entirely in the two-column grid", () => {
    const projects = ["featured", "second", "third"].map(project);
    const { container } = render(<WorkGallery projects={projects} />);

    expect(
      within(container.querySelector(".work-gallery-grid") as HTMLElement).getAllByRole(
        "article",
      ),
    ).toHaveLength(2);
    expect(container.querySelector(".work-gallery-closing-wrap")).toBeNull();
    expect(screen.getAllByRole("article").every((card) => card.dataset.closing === "false"))
      .toBe(true);
  });

  it("promotes a one-card odd remainder into the closing position", () => {
    const projects = ["featured", "closer"].map(project);
    const { container } = render(<WorkGallery projects={projects} />);

    expect(container.querySelector(".work-gallery-grid")).not.toBeNull();
    expect(screen.getByTestId("project-closer")).toHaveAttribute("data-index", "1");
    expect(screen.getByTestId("project-closer")).toHaveAttribute("data-closing", "true");
  });
});
