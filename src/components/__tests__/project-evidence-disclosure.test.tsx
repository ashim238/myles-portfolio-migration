import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectEvidenceDisclosure } from "@/components/project-evidence-disclosure";

describe("ProjectEvidenceDisclosure", () => {
  it("keeps supporting evidence optional while preserving native disclosure semantics", () => {
    const { container } = render(
      <ProjectEvidenceDisclosure summary="View the supporting artifacts">
        <p>Supporting artifact</p>
      </ProjectEvidenceDisclosure>,
    );

    const details = container.querySelector("details");
    const summary = container.querySelector("summary");

    expect(details).not.toHaveAttribute("open");
    expect(summary).toHaveTextContent("View the supporting artifacts");
    expect(screen.getByText("Supporting artifact")).toBeInTheDocument();

    fireEvent.click(summary!);
    expect(details).toHaveAttribute("open");
  });
});
