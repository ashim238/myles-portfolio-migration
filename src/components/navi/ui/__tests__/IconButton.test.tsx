import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IconButton } from "@/components/navi/ui/IconButton";

describe("IconButton", () => {
  it("uses the required label as its accessible name", () => {
    render(<IconButton label="Save to wishlist" icon={<svg />} />);
    expect(screen.getByRole("button", { name: "Save to wishlist" })).toBeInTheDocument();
  });

  it("marks the icon decorative and applies variant class", () => {
    render(<IconButton label="Like" icon={<svg data-testid="i" />} variant="outline" />);
    const btn = screen.getByRole("button", { name: "Like" });
    expect(btn).toHaveClass("nv-icon-btn", "nv-icon-btn--outline");
    expect(screen.getByTestId("i").parentElement).toHaveAttribute("aria-hidden", "true");
  });
});
