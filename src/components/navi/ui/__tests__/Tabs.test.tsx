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

  it("uses roving tabindex (only the selected tab is tabbable)", () => {
    render(<Tabs items={items} value="learn" onChange={() => {}} />);
    expect(screen.getByRole("tab", { name: "Learn" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("tab", { name: "Plan" })).toHaveAttribute("tabindex", "-1");
  });

  it("moves selection with ArrowRight", async () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="learn" onChange={onChange} />);
    screen.getByRole("tab", { name: "Learn" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenCalledWith("plan");
  });

  it("wires tab to panel via aria-controls/aria-labelledby when content is provided", () => {
    const withContent = [
      { id: "learn", label: "Learn", content: "Learn body" },
      { id: "plan", label: "Plan", content: "Plan body" },
    ];
    render(<Tabs items={withContent} value="learn" onChange={() => {}} />);
    const tab = screen.getByRole("tab", { name: "Learn" });
    const panel = screen.getByRole("tabpanel");
    expect(tab).toHaveAttribute("aria-controls", panel.id);
    expect(panel).toHaveAttribute("aria-labelledby", tab.id);
    expect(panel).toHaveTextContent("Learn body");
  });
});
