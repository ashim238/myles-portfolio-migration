import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ArchitectureDiagram } from "@/components/fresh-greens";

describe("ArchitectureDiagram", () => {
  it("exposes the route scoring flow as readable text in order", () => {
    render(<ArchitectureDiagram />);

    const diagram = screen.getByRole("figure", {
      name: "How Fresh Greens scores routes",
    });
    const headings = within(diagram).getAllByRole("heading");
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Data sources",
      "Data adapters",
      "Route scoring",
      "Route comparison",
    ]);
    expect(diagram.querySelectorAll("dt")).toHaveLength(8);
    expect(within(diagram).getByText("DOT-511")).toBeVisible();
    expect(within(diagram).getByText(/live feed unavailable/i)).toBeVisible();
    expect(within(diagram).getByText(/unless Supabase is configured/)).toBeVisible();
    expect(within(diagram).getByText(/route and zone data/)).toBeVisible();
    expect(diagram.querySelector("[tabindex]")).toBeNull();
  });
});
