import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { RouteComparison } from "../route-comparison";

describe("Weeksville route comparison", () => {
  it("keeps the endpoints and map key in place while switching route, trip time and arrival light", async () => {
    const user = userEvent.setup();
    render(<RouteComparison />);

    const choices = within(screen.getByRole("group", { name: "Choose a route" }));
    const stMarks = choices.getByRole("radio", { name: /St\.? Marks Avenue/i });
    const lincoln = choices.getByRole("radio", { name: /Lincoln Place/i });
    const map = screen.getByRole("img", { name: /to Weeksville Heritage Center via/i });
    const key = within(screen.getByText("Map key").parentElement!);
    const endpoints = () => Array.from(map.querySelectorAll("g[transform]"), marker => marker.getAttribute("transform"));
    const roads = () => Array.from(map.querySelectorAll("path[d]"), path => path.getAttribute("d"));
    const fixedMarkers = endpoints();
    const firstRoute = roads();

    expect(stMarks).toBeChecked();
    expect(lincoln).not.toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent(/2 minutes.*4:34 PM, dusk/i);
    expect(fixedMarkers).toHaveLength(2);
    expect(firstRoute.length).toBeGreaterThan(0);
    expect(key.getByText("Dusk")).toHaveAttribute("data-active", "true");
    expect(key.getByText("After dark")).toHaveAttribute("data-active", "false");

    await user.tab();
    expect(stMarks).toHaveFocus();
    await user.keyboard("{ArrowRight}");

    expect(lincoln).toHaveFocus();
    expect(lincoln).toBeChecked();
    expect(stMarks).not.toBeChecked();
    expect(screen.getByRole("status")).toHaveTextContent(/Lincoln Place, 3 minutes.*4:35 PM, after dark/i);
    expect(screen.getByText("4:35 PM", { exact: true })).toBeVisible();
    expect(screen.getByText("3 min", { exact: true })).toBeVisible();
    expect(map).toHaveAccessibleName(/to Weeksville Heritage Center via Lincoln Place/i);
    expect(map).toHaveAccessibleName(/dusk, then after dark/i);
    expect(roads()).not.toEqual(firstRoute);
    expect(endpoints()).toEqual(fixedMarkers);
    for (const phase of ["Daylight", "Dusk", "After dark"]) {
      expect(key.getByText(phase)).toBeVisible();
    }
    expect(key.getByText("After dark")).toHaveAttribute("data-active", "true");

    await user.click(stMarks);
    expect(stMarks).toBeChecked();
    expect(roads()).toEqual(firstRoute);
    expect(screen.getByText("4:34 PM", { exact: true })).toBeVisible();
    expect(screen.getByText("2 min", { exact: true })).toBeVisible();
  });
});
