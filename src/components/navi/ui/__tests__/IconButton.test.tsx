import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
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

  it("fires onClick and is blocked when disabled", async () => {
    const onClick = vi.fn();
    const { rerender } = render(<IconButton label="Like" icon={<svg />} onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
    rerender(<IconButton label="Like" icon={<svg />} onClick={onClick} disabled />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
