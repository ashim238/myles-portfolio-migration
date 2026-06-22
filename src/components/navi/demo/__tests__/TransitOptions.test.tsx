import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TransitOptions } from "@/components/navi/demo/TransitOptions";

const options = [
  { mode: "subway" as const, label: "Take the", detail: "Q or R" },
  { mode: "citibike" as const, label: "Grab a Citibike", detail: "0.2 miles away" },
  { mode: "walk" as const, label: "Walk", detail: "30 min to dock" },
];

describe("TransitOptions", () => {
  it("renders one entry per option with mode label and detail", () => {
    render(<TransitOptions options={options} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("Q or R")).toBeInTheDocument();
    expect(screen.getByText("0.2 miles away")).toBeInTheDocument();
  });

  it("renders the bus, ferry, and lirr modes", () => {
    render(
      <TransitOptions
        options={[
          { mode: "bus", label: "Take the", detail: "B46 Select Bus on Utica Avenue" },
          { mode: "ferry", label: "Take the", detail: "East River ferry to DUMBO" },
          { mode: "lirr", label: "Take the", detail: "LIRR to Flushing–Main St" },
        ]}
      />,
    );
    expect(screen.getByText("B46 Select Bus on Utica Avenue")).toBeInTheDocument();
    expect(screen.getByText("East River ferry to DUMBO")).toBeInTheDocument();
    expect(screen.getByText("LIRR to Flushing–Main St")).toBeInTheDocument();
  });

  it("renders every option even when two share the same mode", () => {
    render(
      <TransitOptions
        options={[
          { mode: "subway", label: "A to Dyckman St", detail: "Walk 8 minutes west" },
          { mode: "subway", label: "1 to 215 St", detail: "Walk 10 minutes north" },
        ]}
      />,
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getByText("A to Dyckman St")).toBeInTheDocument();
    expect(screen.getByText("1 to 215 St")).toBeInTheDocument();
  });
});
