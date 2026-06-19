import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MapPin } from "@/components/navi/ui/MapPin";
import { Card } from "@/components/navi/ui/Card";

describe("MapPin", () => {
  it("renders a place pin with its value and selected modifier", () => {
    render(<MapPin kind="place" value="$48" selected />);
    expect(screen.getByText("$48")).toBeInTheDocument();
    expect(screen.getByText("$48").closest(".nv-pin")).toHaveClass(
      "nv-pin--place",
      "nv-pin--selected",
    );
  });

  it("renders a location pin without a value", () => {
    render(<MapPin kind="location" />);
    expect(document.querySelector(".nv-pin--location")).toBeInTheDocument();
  });
});

describe("Card", () => {
  it("renders children inside a padded surface", () => {
    render(<Card padded>body</Card>);
    const card = screen.getByText("body");
    expect(card).toHaveClass("nv-card", "nv-card--padded");
  });
});
