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

  it("keeps map selection, list selection, and the neighborhood caption in sync", () => {
    render(<HeatmapExplorer />);
    const list = screen.getByRole("list", { name: "Manhattan neighborhoods" });
    const map = screen.getByRole("group", { name: "Manhattan neighborhood map" });
    const rows = within(list).getAllByRole("button");
    const firstRegion = within(map).getByRole("button", { name: rows[0].textContent! });
    const secondRegion = within(map).getByRole("button", { name: rows[1].textContent! });

    fireEvent.click(secondRegion);
    expect(rows[1]).toHaveAttribute("aria-pressed", "true");
    expect(secondRegion).toHaveAttribute("aria-pressed", "true");
    expect(document.querySelector(".nv-heatmap-map-name")).toHaveTextContent(rows[1].textContent!);

    fireEvent.click(rows[0]);
    expect(firstRegion).toHaveAttribute("aria-pressed", "true");
    expect(secondRegion).toHaveAttribute("aria-pressed", "false");
    expect(rows[1]).toHaveAttribute("aria-pressed", "false");
  });

  it("supports map keyboard activation and arrow navigation with one Tab stop", () => {
    render(<HeatmapExplorer />);
    const map = screen.getByRole("group", { name: "Manhattan neighborhood map" });
    const regions = within(map).getAllByRole("button");
    const firstRegion = regions.find((region) => region.getAttribute("tabindex") === "0")!;
    fireEvent.keyDown(firstRegion, { key: "Enter" });
    expect(firstRegion).toHaveAttribute("aria-pressed", "true");
    fireEvent.keyDown(firstRegion, { key: "ArrowDown" });
    const selected = regions.find((region) => region.getAttribute("aria-pressed") === "true")!;
    expect(selected).not.toBe(firstRegion);
    expect(selected).toHaveFocus();
    expect(regions.filter((region) => region.getAttribute("tabindex") === "0")).toHaveLength(1);
    fireEvent.keyDown(selected, { key: "Escape" });
    expect(regions.every((region) => region.getAttribute("aria-pressed") === "false")).toBe(true);
    fireEvent.keyDown(firstRegion, { key: " " });
    expect(firstRegion).toHaveAttribute("aria-pressed", "true");
  });
});
