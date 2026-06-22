import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Hero } from "@/components/navi/system/Hero";

describe("Hero", () => {
  it("renders an h2 title, optional lede, and children", () => {
    render(
      <Hero title="Live" lede="Pick a variant. Watch it update.">
        <div data-testid="stage">x</div>
      </Hero>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Live" })).toBeInTheDocument();
    expect(screen.getByText("Pick a variant. Watch it update.")).toBeInTheDocument();
    expect(screen.getByTestId("stage")).toBeInTheDocument();
  });
});
