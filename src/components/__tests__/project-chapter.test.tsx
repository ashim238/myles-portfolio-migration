import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectChapter } from "@/components/project-chapter";

const entry = {
  id: "nv-framework",
  stage: "Define",
  title: "Mapping the experience",
};

describe("ProjectChapter", () => {
  it("renders a named semantic region with the chapter hierarchy", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <p>Journey map evidence</p>
      </ProjectChapter>,
    );

    expect(
      screen.getByRole("region", { name: "Mapping the experience" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: entry.title }),
    ).toHaveAttribute("id", entry.id);
    expect(screen.getByText("Define")).toBeInTheDocument();
    expect(screen.getByText("3 of 5")).toBeInTheDocument();
    expect(screen.getByText("Journey map evidence")).toBeVisible();
    expect(container.querySelector(".project-chapter-motif")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelector(".project-chapter")).toHaveAttribute(
      "data-chapter-variant",
      "navi",
    );
  });
});
