import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { WeeksvilleDemo } from "../weeksville-demo";

describe("Weeksville route demo", () => {
  it("compares arrival light and draws each route between the same map markers", async () => {
    const user = userEvent.setup();
    render(<WeeksvilleDemo />);

    const phone = within(screen.getByRole("group", { name: "Fresh Greens mobile route preview" }));
    const map = phone.getByRole("img", { name: /to Weeksville Heritage Center via St\. Marks Avenue/i });
    const endpoints = () => Array.from(map.querySelectorAll("g[transform]"), marker => marker.getAttribute("transform"));
    const routePaths = () => Array.from(map.querySelectorAll("path[stroke]"), path => path.getAttribute("d"));
    const firstMarkers = endpoints();
    const firstRoute = routePaths();
    const previous = phone.getByRole("button", { name: "Previous route" });
    const next = phone.getByRole("button", { name: "Next route" });

    expect(firstMarkers).toHaveLength(2);
    expect(firstRoute.length).toBeGreaterThan(0);
    expect(previous).toBeDisabled();
    expect(phone.getByText("2 min")).toBeVisible();
    expect(phone.getByText(/Arrive 4:34 PM/)).toHaveTextContent(/4:34 PM · Dusk/);
    expect(map).toHaveAccessibleName(/Light along the route: dusk\./i);

    next.focus();
    await user.keyboard("{Enter}");
    await waitFor(() => expect(previous).toHaveFocus());
    expect(next).toBeDisabled();
    expect(phone.getByText("3 min")).toBeVisible();
    expect(phone.getByText(/Arrive 4:35 PM/)).toHaveTextContent(/4:35 PM · After dark/);
    expect(map).toHaveAccessibleName(/via Lincoln Place\. Light along the route: dusk, then after dark\./i);
    expect(routePaths()).not.toEqual(firstRoute);
    expect(endpoints()).toEqual(firstMarkers);

    await user.keyboard("{Enter}");
    await waitFor(() => expect(next).toHaveFocus());
    expect(previous).toBeDisabled();
    expect(routePaths()).toEqual(firstRoute);
    expect(endpoints()).toEqual(firstMarkers);
    expect(phone.getByText("2 min")).toBeVisible();
  });

  it("can clear the destination, type a query and select Weeksville by keyboard", async () => {
    const user = userEvent.setup();
    render(<WeeksvilleDemo />);
    await user.click(screen.getByRole("button", { name: "Clear destination" }));
    const emptyMap = screen.getByRole("img", { name: /starting location on Utica Avenue/i });
    expect(emptyMap.querySelectorAll("g[transform]")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: "Start drive preview" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Search for a destination" }));
    const query = screen.getByRole("textbox", { name: "Search for a destination" });
    await user.type(query, "Queens");
    expect(screen.getByRole("status")).toHaveTextContent(/No matches/);
    expect(screen.queryByRole("button", { name: /Weeksville Heritage Center/ })).not.toBeInTheDocument();
    await user.clear(query);
    await user.type(query, "weeks");
    const result = screen.getByRole("button", { name: /Weeksville Heritage Center/ });
    await user.keyboard("{ArrowDown}");
    expect(result).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("img", { name: /to Weeksville Heritage Center via St\. Marks Avenue/i })).toBeVisible();
    expect(screen.getByRole("button", { name: "Start drive preview" })).toBeVisible();
    await waitFor(() => expect(screen.getByRole("button", { name: "Search for a destination" })).toHaveFocus());
  });

  it("toggles the map key and starts and ends a drive on the selected route", async () => {
    const user = userEvent.setup();
    render(<WeeksvilleDemo />);
    const key = screen.getByLabelText("Map key");
    for (const phase of ["Daylight", "Dusk", "After dark"]) {
      expect(within(key).getByText(phase)).toBeVisible();
    }
    await user.click(screen.getByRole("button", { name: "Close map key" }));
    expect(screen.queryByLabelText("Map key", { exact: true })).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Open map key" }));
    expect(screen.getByRole("button", { name: "Close map key" })).toHaveAttribute("aria-expanded", "true");

    await user.click(screen.getByRole("button", { name: "Next route" }));
    await user.click(screen.getByRole("button", { name: "Start drive preview" }));
    expect(screen.getByText("Head north on Utica Avenue")).toBeVisible();
    expect(screen.getByText(/4:35 PM/)).toHaveTextContent(/After dark/);
    await user.click(screen.getByRole("button", { name: "End trip" }));
    expect(screen.getByText("Via Lincoln Place")).toBeVisible();
    await waitFor(() => expect(screen.getByRole("button", { name: "Start drive preview" })).toHaveFocus());
  });
});
