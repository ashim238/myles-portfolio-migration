import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { NaviResearchArtifacts } from "@/components/navi/research-artifacts";

describe("NaviResearchArtifacts", () => {
  it("names the three research-informed archetypes and their scope", () => {
    render(<NaviResearchArtifacts />);
    const archetypes = screen.getByLabelText("Research-informed archetypes");
    expect(within(archetypes).getByText("Cain")).toBeInTheDocument();
    expect(within(archetypes).getByText("Ororo")).toBeInTheDocument();
    expect(within(archetypes).getByText("Selina")).toBeInTheDocument();
    expect(within(archetypes).getByText("Future opportunity")).toBeInTheDocument();
  });

  it("keeps the journey and individual booking sequence available as text", () => {
    render(<NaviResearchArtifacts />);
    const journey = screen.getByLabelText("Journey-map excerpt");
    for (const stage of ["Awareness", "Consideration", "Decision"]) {
      expect(within(journey).getByText(stage)).toBeInTheDocument();
    }
    const booking = screen.getByLabelText("Individual booking-flow excerpt");
    for (const step of ["Neighborhood discovery", "Activity detail", "Date and time", "Cost review", "Confirmation"]) {
      expect(within(booking).getByText(step)).toBeInTheDocument();
    }
  });

  it("labels the diagrams as internal planning rather than validation", () => {
    render(<NaviResearchArtifacts />);
    expect(screen.getByText("Internal planning artifact")).toBeInTheDocument();
    expect(screen.queryByText(/validated/i)).not.toBeInTheDocument();
  });
});
