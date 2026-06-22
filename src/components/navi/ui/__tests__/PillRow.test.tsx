import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { PillRow } from "@/components/navi/ui/PillRow";

describe("PillRow", () => {
  const items = [
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
    { id: "c", label: "Gamma" },
  ];

  it("renders one pill per item with the active class on the active id", () => {
    render(<PillRow items={items} activeId="b" onSelect={() => {}} />);
    expect(screen.getByRole("button", { name: "Alpha" })).not.toHaveClass("nv-pill-row-item--active");
    expect(screen.getByRole("button", { name: "Beta" })).toHaveClass("nv-pill-row-item--active");
    expect(screen.getByRole("button", { name: "Gamma" })).not.toHaveClass("nv-pill-row-item--active");
  });

  it("fires onSelect with the item id when a pill is clicked", async () => {
    const onSelect = vi.fn();
    render(<PillRow items={items} activeId="a" onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button", { name: "Gamma" }));
    expect(onSelect).toHaveBeenCalledWith("c");
  });

  it("merges ARIA attributes returned by extraAttrs onto each button", () => {
    render(
      <PillRow
        items={items}
        activeId="a"
        onSelect={() => {}}
        extraAttrs={(item, active) => ({
          "aria-current": active ? "true" : undefined,
          "data-test-id": item.id,
        })}
      />
    );
    const alpha = screen.getByRole("button", { name: "Alpha" });
    const beta = screen.getByRole("button", { name: "Beta" });
    expect(alpha).toHaveAttribute("aria-current", "true");
    expect(beta).not.toHaveAttribute("aria-current");
    expect(alpha).toHaveAttribute("data-test-id", "a");
  });
});
