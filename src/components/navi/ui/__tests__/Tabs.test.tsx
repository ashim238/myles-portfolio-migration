import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Tabs } from "@/components/navi/ui/Tabs";

const items = [
  { id: "learn", label: "Learn" },
  { id: "plan", label: "Plan" },
  { id: "go", label: "Go" },
];

describe("Tabs", () => {
  it("renders a tablist with the active tab selected", () => {
    render(<Tabs items={items} value="learn" onChange={() => {}} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tab", { name: "Plan" })).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the tab id when clicked", async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="learn" onChange={onChange} />);
    await userEvent.click(screen.getByRole("tab", { name: "Go" }));
    expect(onChange).toHaveBeenCalledWith("go");
  });
});
