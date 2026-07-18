import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImpactView } from "@/app/work/navi/(minisite)/demo/impact/ImpactView";
import { getImpactSummary } from "@/lib/navi/impact";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Impact ledger page", () => {
  it("renders the page heading and a methodology paragraph", () => {
    render(<ImpactView />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Where bookings go" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/experiences, not dollars/i)).toBeInTheDocument();
    expect(screen.getByText(/This demo has no revenue figures/i)).toBeInTheDocument();
    expect(screen.queryByText(/honest caveats/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/The point is/i)).not.toBeInTheDocument();
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

  it("uses concise impact labels in the full ledger instead of repeating every claim paragraph", () => {
    render(<ImpactView />);
    const first = EXPERIENCES[0];

    expect(screen.getAllByText(first.impactPhrase).length).toBeGreaterThan(0);
    expect(screen.queryByText(first.impactStatement)).not.toBeInTheDocument();
  });

  it("offers a way back to the feed and forward to booking, not a dead end", () => {
    render(<ImpactView />);
    expect(screen.getByRole("link", { name: /back to exploring/i })).toHaveAttribute(
      "href",
      "/work/navi/demo",
    );
    const cta = screen.getByRole("navigation", { name: /keep exploring/i });
    expect(within(cta).getByRole("link", { name: /browse experiences/i })).toHaveAttribute(
      "href",
      "/work/navi/demo",
    );
    expect(within(cta).getByRole("link", { name: /host an event/i })).toHaveAttribute(
      "href",
      "/work/navi/demo/host",
    );
  });
});
