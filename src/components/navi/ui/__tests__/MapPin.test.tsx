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
    const el = screen.getByText("body").closest(".nv-card");
    expect(el).toBeInTheDocument();
    expect(el).toHaveClass("nv-card--padded");
  });

  it("renders a non-padded card by default", () => {
    render(<Card>plain</Card>);
    const el = screen.getByText("plain").closest(".nv-card");
    expect(el).toBeInTheDocument();
    expect(el).not.toHaveClass("nv-card--padded");
  });
});

describe("MapPin hollow", () => {
  it("renders a hollow place pin when filled is false", () => {
    render(<MapPin kind="place" value="$10" filled={false} />);
    expect(screen.getByText("$10").closest(".nv-pin")).toHaveClass("nv-pin--hollow");
  });
});
