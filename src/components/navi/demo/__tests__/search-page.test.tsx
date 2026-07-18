import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { beforeEach, describe, it, expect, vi } from "vitest";

const mapProbe = vi.hoisted(() => ({ props: [] as Record<string, unknown>[] }));

vi.mock("@/components/navi/demo/Map", () => ({
  Map: (props: Record<string, unknown>) => {
    mapProbe.props.push(props);
    return <section aria-label="Map of nearby results" />;
  },
}));

import SearchPage from "@/app/work/navi/(minisite)/demo/search/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Search page", () => {
  beforeEach(() => {
    mapProbe.props.length = 0;
  });
  it("shows a result count header", () => {
    render(<SearchPage />);
    expect(
      screen.getByRole("heading", { name: new RegExp(`${EXPERIENCES.length} nearby`, "i") }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(12);
  });

  it("uses a primary labelled section and level-two result headings", () => {
    render(<SearchPage />);
    expect(screen.queryByRole("complementary")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: /nearby experiences/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(12);
  });

  it("reveals search results in batches of 12", async () => {
    render(<SearchPage />);
    await userEvent.click(screen.getByRole("button", { name: /load 12 more experiences/i }));
    expect(screen.getAllByRole("link")).toHaveLength(24);
  });

  it("announces the visible batch and preserves the final pagination control", async () => {
    render(<SearchPage />);
    const loadMore = screen.getByRole("button", { name: /load 12 more experiences/i });
    expect(screen.getByRole("status")).toHaveTextContent("Showing 12 of 37 results");
    await userEvent.click(loadMore);
    await userEvent.click(loadMore);
    await userEvent.click(screen.getByRole("button", { name: /load 1 more experience/i }));

    expect(screen.getByRole("button", { name: /all 37 experiences shown/i })).toBeDisabled();
    expect(screen.getByRole("status")).toHaveTextContent("Showing 37 of 37 results");
  });

  it("keeps the client search view independent of the full detail dataset", () => {
    const sources = [
      "src/app/work/navi/(minisite)/demo/search/SearchView.tsx",
      "src/components/navi/demo/ResultCard.tsx",
      "src/lib/navi/experience-summary.ts",
    ].map((file) => readFileSync(join(process.cwd(), file), "utf8"));
    expect(sources.join("\n")).not.toMatch(
      /import\s+(?!type\b)[^;]*from ["']@\/lib\/navi\/demo-data["']/,
    );
  });

  it("filters results by typed query and updates the count", async () => {
    render(<SearchPage />);
    const box = screen.getByRole("searchbox");
    await userEvent.type(box, "prospect");
    const onlyMatches = EXPERIENCES.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes("prospect"),
    );
    expect(
      screen.getByRole("heading", { name: new RegExp(`${onlyMatches.length} nearby`, "i") }),
    ).toBeInTheDocument();
  });

  it("renders the map and the legend", () => {
    render(<SearchPage />);
    expect(screen.getByRole("region", { name: /map/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /legend/i })).toBeInTheDocument();
  });

  it("keeps map data references stable when only card hover state changes", async () => {
    render(<SearchPage />);
    const initial = mapProbe.props.at(-1);
    if (!initial) throw new Error("fixture: map should render");

    await userEvent.hover(screen.getAllByRole("link")[0]);
    const afterHover = mapProbe.props.at(-1);
    if (!afterHover) throw new Error("fixture: map should rerender on selection");

    expect(afterHover.markers).toBe(initial.markers);
    expect(afterHover.center).toBe(initial.center);
    expect(afterHover.currentLocation).toBe(initial.currentLocation);
  });

  it("uses one concise live result announcement instead of announcing both counts", () => {
    const { container } = render(<SearchPage />);
    const heading = screen.getByRole("heading", {
      name: new RegExp(`${EXPERIENCES.length} nearby`, "i"),
    });
    expect(heading).not.toHaveAttribute("aria-live");
    expect(screen.getAllByRole("status")).toHaveLength(1);
    expect(container.querySelectorAll('[aria-live="polite"], [role="status"]')).toHaveLength(1);
  });

  it("announces the empty state when nothing matches", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzznotarealplace");
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/no matches/i);
  });
});
