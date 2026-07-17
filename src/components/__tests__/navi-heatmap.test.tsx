import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HeatmapExplorer } from "@/components/navi";

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn(() => ({ matches: false })));
  Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
    configurable: true,
    value: vi.fn(),
  });
});

describe("Navi neighborhood heatmap", () => {
  it("uses a native list of pressed-state buttons instead of a malformed listbox", () => {
    render(<HeatmapExplorer />);

    const list = screen.getByRole("list", { name: "Manhattan neighborhoods" });
    const buttons = within(list).getAllByRole("button");
    expect(within(list).queryAllByRole("option")).toHaveLength(0);

    fireEvent.click(buttons[0]);
    expect(buttons[0]).toHaveAttribute("aria-pressed", "true");
  });
});
