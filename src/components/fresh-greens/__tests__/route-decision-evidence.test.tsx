import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ReportRouteInfluenceEvidence,
  RouteComparisonEvidence,
} from "@/components/fresh-greens/route-decision-evidence";

describe("RouteComparisonEvidence", () => {
  it("reconstructs the implemented pre-drive route controls without presenting representative values as research data", () => {
    render(<RouteComparisonEvidence />);

    expect(screen.getByText("1 of 3")).toBeInTheDocument();
    expect(
      screen.getByText("Option 1"),
    ).toBeInTheDocument();
    expect(screen.getByText("Low light")).toBeInTheDocument();
    expect(screen.getByText("Rough pavement")).toBeInTheDocument();
    expect(screen.getByText(/sample route data/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next route" }));

    expect(screen.getByText("2 of 3")).toBeInTheDocument();
    expect(screen.getByText(/min faster/i)).toBeInTheDocument();
    expect(screen.getByText("Community flag")).toBeInTheDocument();
  });

  it("moves dusk along the bar with the route caption in both directions", () => {
    render(<RouteComparisonEvidence />);

    function duskPosition(caption: string) {
      const bar = screen.getByText(caption).previousElementSibling as HTMLElement;
      return Number.parseFloat(bar.style.getPropertyValue("--fg-dusk-midpoint"));
    }

    const next = screen.getByRole("button", { name: "Next route" });
    const previous = screen.getByRole("button", { name: "Previous route" });
    const first = duskPosition("More daylight near departure");
    fireEvent.click(next);
    const second = duskPosition("Light fades near arrival");
    fireEvent.click(next);
    const third = duskPosition("More of the drive after sunset");

    expect(second).toBeGreaterThan(first);
    expect(third).toBeLessThan(first);
    fireEvent.click(previous);
    expect(duskPosition("Light fades near arrival")).toBe(second);
    fireEvent.click(previous);
    expect(duskPosition("More daylight near departure")).toBe(first);
  });
});

describe("ReportRouteInfluenceEvidence", () => {
  it("shows the implemented report-to-route bridge and preserves its limit", () => {
    render(<ReportRouteInfluenceEvidence />);

    expect(
      screen.getByText(
        "On your selected route — it counts toward the community flag in your preview.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Community flag")).toBeInTheDocument();
    expect(screen.getByText("Start")).toHaveClass(
      "fg-report-route-line-label--start",
    );
    expect(screen.getByText("Report")).toBeInTheDocument();
    expect(screen.getByText("Destination")).toHaveClass(
      "fg-report-route-line-label--end",
    );
    expect(
      screen.getByText(/portfolio reconstruction of the implemented report-to-route link/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/one report can affect ranking/i)).toBeInTheDocument();
    expect(screen.getByText(/not corroboration/i)).toBeInTheDocument();
    expect(screen.queryByText(/verified|proves safe/i)).not.toBeInTheDocument();
    const route = screen.getByRole("img", {
      name: /community report appears 62 percent/i,
    });
    expect(route.querySelector(".fg-report-route-track")).toHaveAttribute(
      "d",
      "M16 36 H384",
    );
    expect(route.querySelector(".fg-report-route-marker circle")).toHaveAttribute(
      "cx",
      "244",
    );
  });
});
