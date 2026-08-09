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

  it("keeps interpretation and its boundary beside a featured Navi chapter", () => {
    const { container } = render(
      <ProjectChapter entry={entry} index={3} total={5} variant="navi">
        <p>Journey map evidence</p>
      </ProjectChapter>,
    );

    const summary = container.querySelector(".reader-evidence-summary");
    expect(summary).toHaveAttribute(
      "id",
      "reader-evidence-navi-research-artifacts-summary",
    );
    expect(summary).toHaveAttribute(
      "data-evidence-for",
      "navi-research-artifacts",
    );
    expect(container.querySelector(".project-chapter")).toHaveAttribute(
      "aria-describedby",
      "reader-evidence-navi-research-artifacts-summary",
    );
    expect(screen.getByText("What this shows")).toBeVisible();
    expect(
      screen.getByText(
        "The artifacts connect observed needs to product areas and the individual booking flow.",
      ),
    ).toBeVisible();
    expect(screen.getByText("Boundary")).toBeVisible();
    expect(
      screen.getByText(
        "These remained internal planning artifacts because the studio project ended before engineering handoff.",
      ),
    ).toBeVisible();
  });

  it("applies the same summary grammar to a featured FAFSA chapter", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "uf-figma",
          stage: "Build",
          title: "Rebuilding the system in Mailchimp",
        }}
        index={4}
        total={5}
        variant="understandingfafsa"
      >
        <p>Implementation comparison</p>
      </ProjectChapter>,
    );

    expect(container.querySelector(".reader-evidence-summary")).toHaveAttribute(
      "data-evidence-for",
      "fafsa-figma-mailchimp",
    );
    expect(
      screen.getByText(
        "Flattened hierarchy and native blocks reduced unnecessary HTML while preserving the brand.",
      ),
    ).toBeVisible();
    expect(
      screen.getByText(
        "Image compression reduced download weight, not the HTML source Gmail measures.",
      ),
    ).toBeVisible();
  });

  it("does not add a visible summary to a mapped chapter outside the pilot", () => {
    const { container } = render(
      <ProjectChapter
        entry={{
          id: "nv-intro",
          stage: "Frame",
          title: "The first idea moved visitors, not behavior",
        }}
        index={1}
        total={5}
        variant="navi"
      >
        <p>Early concept evidence</p>
      </ProjectChapter>,
    );

    expect(
      container.querySelector(".reader-evidence-summary"),
    ).not.toBeInTheDocument();
    expect(container.querySelector(".project-chapter")).not.toHaveAttribute(
      "aria-describedby",
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
    expect(chapter).not.toHaveAttribute("aria-describedby");
    expect(screen.queryByText(/Evidence state:/)).not.toBeInTheDocument();
    expect(
      container.querySelector(".reader-evidence-summary"),
    ).not.toBeInTheDocument();
  });
});
