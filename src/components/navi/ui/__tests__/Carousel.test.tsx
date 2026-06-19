import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CarouselArrow } from "@/components/navi/ui/CarouselArrow";
import { PaginationDots } from "@/components/navi/ui/PaginationDots";

describe("CarouselArrow", () => {
  it("uses a directional accessible label and fires onClick", async () => {
    const onClick = vi.fn();
    render(<CarouselArrow direction="next" label="Next photo" onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe("PaginationDots", () => {
  it("renders count dots and marks the active one", () => {
    render(<PaginationDots count={4} active={2} onSelect={() => {}} />);
    const dots = screen.getAllByRole("tab");
    expect(dots).toHaveLength(4);
    expect(dots[2]).toHaveAttribute("aria-selected", "true");
  });

  it("selects a dot on click", async () => {
    const onSelect = vi.fn();
    render(<PaginationDots count={3} active={0} onSelect={onSelect} />);
    await userEvent.click(screen.getAllByRole("tab")[1]);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});
