import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { FiltersSlideOver } from "@/components/navi/demo/FiltersSlideOver";
import { DEFAULT_FILTERS } from "@/components/navi/demo/filters";

const baseProps = {
  open: true,
  initial: DEFAULT_FILTERS,
  languageOptions: ["English", "Spanish"],
  neighborhoodOptions: ["Park Slope", "Bed-Stuy"],
  matchCountFor: () => 12,
};

describe("FiltersSlideOver", () => {
  it("renders nothing when closed", () => {
    const { container } = render(
      <FiltersSlideOver {...baseProps} open={false} onApply={() => {}} onClose={() => {}} />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("renders as a dialog with the Filters heading when open", () => {
    render(<FiltersSlideOver {...baseProps} onApply={() => {}} onClose={() => {}} />);
    expect(screen.getByRole("dialog", { name: "Filters" })).toBeInTheDocument();
  });

  it("calls onApply with the draft filters when Apply is clicked", async () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(<FiltersSlideOver {...baseProps} onApply={onApply} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
    await userEvent.click(screen.getByRole("button", { name: /Show 12 experiences/ }));
    expect(onApply).toHaveBeenCalledWith(
      expect.objectContaining({ price: "under30" }),
    );
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose without applying when ESC is pressed", async () => {
    const onApply = vi.fn();
    const onClose = vi.fn();
    render(<FiltersSlideOver {...baseProps} onApply={onApply} onClose={onClose} />);
    await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
    expect(onApply).not.toHaveBeenCalled();
  });

  it("resets draft to defaults when Clear all is clicked", async () => {
    render(
      <FiltersSlideOver
        {...baseProps}
        initial={{ ...DEFAULT_FILTERS, price: "under30" }}
        onApply={() => {}}
        onClose={() => {}}
      />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    const underBtn = screen.getByRole("button", { name: "Under $30" });
    expect(underBtn).toHaveAttribute("aria-pressed", "false");
  });
});
