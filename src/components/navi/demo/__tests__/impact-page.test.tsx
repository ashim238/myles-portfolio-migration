import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImpactView } from "@/app/work/navi/(minisite)/demo/impact/page";
import { getImpactSummary } from "@/lib/navi/impact";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Impact ledger page", () => {
  it("renders the page heading and a methodology paragraph", () => {
    render(<ImpactView />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Where bookings go" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/experiences, not dollars/i)).toBeInTheDocument();
  });

  it("renders one section per theme with its label and anchor id", () => {
    render(<ImpactView />);
    for (const section of getImpactSummary()) {
      const heading = screen.getByRole("heading", { level: 2, name: section.label });
      expect(heading).toHaveAttribute("id", section.anchor);
    }
  });

  it("states the contributing-experience count per theme", () => {
    render(<ImpactView />);
    const heritage = getImpactSummary().find((s) => s.id === "heritage");
    if (!heritage) throw new Error("fixture: heritage section missing");
    const region = screen.getByRole("region", { name: heritage.label });
    expect(
      within(region).getByText(
        new RegExp(`${heritage.experiences.length} experiences contribute`),
      ),
    ).toBeInTheDocument();
  });

  it("renders one experience card per experience across all sections", () => {
    const { container } = render(<ImpactView />);
    const cards = container.querySelectorAll("a.nv-exp-card");
    expect(cards.length).toBe(EXPERIENCES.length);
  });
});
