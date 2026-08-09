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

  it("exposes the mapped claim, evidence state, and dominant proof", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <p>Journey map evidence</p>
      </ProjectChapter>,
    );

    const chapter = container.querySelector(".project-chapter");
    expect(chapter).toHaveAttribute("data-claim-class", "interpretive");
    expect(chapter).toHaveAttribute("data-evidence-state", "proposed");
    expect(chapter).toHaveAttribute(
      "data-dominant-proof",
      "navi-research-artifacts",
    );
    expect(screen.getByText("Proposed")).toBeVisible();
    expect(screen.getByText("Proposed").parentElement).toHaveTextContent(
      "Evidence state: Proposed",
    );
  });

  it("keeps ad hoc chapter fixtures renderable without false metadata", () => {
    const { container } = render(
      <ProjectChapter
        entry={{ id: "test-only", stage: "Test", title: "Fixture chapter" }}
        index={1}
        total={1}
        variant="navi"
      >
        <p>Fixture evidence</p>
      </ProjectChapter>,
    );

    const chapter = container.querySelector(".project-chapter");
    expect(chapter).not.toHaveAttribute("data-claim-class");
    expect(chapter).not.toHaveAttribute("data-evidence-state");
    expect(chapter).not.toHaveAttribute("data-dominant-proof");
    expect(screen.queryByText(/Evidence state:/)).not.toBeInTheDocument();
  });
});
