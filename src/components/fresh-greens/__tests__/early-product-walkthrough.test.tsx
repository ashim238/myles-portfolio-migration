import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EarlyProductWalkthrough } from "../early-product-walkthrough";

afterEach(() => vi.unstubAllGlobals());

describe("Fresh Greens route comparison", () => {
  it("opens directly on a local iOS capture and switches routes without a service", async () => {
    const user = userEvent.setup();
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { container } = render(<EarlyProductWalkthrough />);

    expect(screen.getByRole("heading", { name: "Compare two routes to Weeksville" })).toBeVisible();
    expect(screen.getByRole("img").getAttribute("src")).toMatch(/\/route-comparison\/ios-route-2\.jpg$/);
    await user.click(screen.getByRole("button", { name: "Previous route" }));
    expect(screen.getByRole("img").getAttribute("src")).toMatch(/\/route-comparison\/ios-route-1\.jpg$/);
    expect(screen.getByRole("status")).toHaveTextContent("4:34 PM, After dark");
    await user.click(screen.getByRole("button", { name: "Next route" }));
    expect(screen.getByRole("status")).toHaveTextContent("4:33 PM, Dusk");

    expect(screen.getByRole("button", { name: /^Dusk/ })).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: /^After dark/ }));
    expect(screen.getByRole("status")).toHaveTextContent(/4:34 PM, After dark/);
    expect(screen.getByRole("button", { name: /^After dark/ })).toHaveAttribute("aria-pressed", "true");

    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.queryByRole("button", { name: /simulator|open the ios app/i })).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  it("opens the selected route’s first turn and returns to the same route", async () => {
    const user = userEvent.setup();
    render(<EarlyProductWalkthrough />);
    for (const index of [1, 0]) {
      if (index === 0) await user.click(screen.getByRole("button", { name: "Previous route" }));
      await user.click(screen.getByRole("button", { name: "Go, start route via Rochester Avenue" }));
      expect(screen.getByRole("img").getAttribute("src")).toContain("ios-drive-" + (index + 1));
      await user.click(screen.getByRole("button", { name: "End trip" }));
      expect(screen.getByRole("status")).toHaveTextContent("Route " + (index + 1));
      expect(screen.getByRole("img").getAttribute("src")).toContain("ios-route-" + (index + 1));
    }
  });

  it("connects a recommendation category, business details and the sample destination", async () => {
    const user = userEvent.setup();
    render(<EarlyProductWalkthrough />);
    await user.click(screen.getByRole("button", { name: "Browse recommendations" }));
    await user.click(screen.getByRole("button", { name: /^Black-Owned$/ }));
    await user.click(screen.getByRole("button", { name: /Great Day Latte/ }));
    expect(screen.getByText("700 St Francis St, Mobile, AL", { selector: "p" })).toBeVisible();
    await user.click(screen.getByRole("button", { name: /Back to recommendations/ }));
    await user.click(screen.getByRole("button", { name: /Where are you headed/ }));
    await user.type(screen.getByRole("searchbox"), "Weeks");
    await user.click(screen.getByRole("button", { name: /Weeksville Heritage Center/ }));
    expect(screen.getByRole("button", { name: "Previous route" })).toBeVisible();
  });
});
