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
    expect(screen.getByRole("img").getAttribute("src")).toMatch(/\/route-comparison\/ios-route-1\.jpg$/);
    await user.click(screen.getByRole("button", { name: "Next route" }));
    expect(screen.getByRole("img").getAttribute("src")).toMatch(/\/route-comparison\/ios-route-2\.jpg$/);
    expect(screen.getByRole("status")).toHaveTextContent("Via Saint Johns Place");
    await user.click(screen.getByRole("button", { name: "Previous route" }));
    expect(screen.getByRole("status")).toHaveTextContent("Via Utica Avenue");

    expect(container.querySelector("iframe")).toBeNull();
    expect(screen.queryByRole("button", { name: /simulator|open the ios app/i })).not.toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });
});
