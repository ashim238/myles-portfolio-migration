import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CapturedRouteComparison } from "../captured-route-comparison";

describe("Captured iOS route comparison", () => {
  it("switches the real capture and announces the corresponding route", async () => {
    const user = userEvent.setup();
    render(<CapturedRouteComparison onBrowse={() => {}} onSearch={() => {}} />);
    const first = screen.getByRole("img");
    const firstSource = first.getAttribute("src");
    expect(screen.getByRole("status")).toHaveTextContent(/Route 1 of 2. Via Utica Avenue.*8:12 AM, daylight/);
    await user.click(screen.getByRole("button", { name: "Next route" }));
    expect(screen.getByRole("img").getAttribute("src")).not.toEqual(firstSource);
    expect(screen.getByRole("status")).toHaveTextContent(/Route 2 of 2. Via Saint Johns Place.*8:13 AM, daylight/);
    await user.click(screen.getByRole("button", { name: "Previous route" }));
    expect(screen.getByRole("img")).toHaveAttribute("src", firstSource);
  });

  it("keeps keyboard focus on the route control when the active arrow moves", async () => {
    const user = userEvent.setup();
    render(<CapturedRouteComparison onBrowse={() => {}} onSearch={() => {}} />);
    await user.tab();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Previous route" })).toHaveFocus();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("button", { name: "Next route" })).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("status")).toHaveTextContent("Route 2 of 2");
  });
});
