import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TabBar } from "@/components/navi/ui/TabBar";

const items = [
  { id: "feed", label: "Feed", icon: <span>F</span>, href: "/work/navi/demo" },
  { id: "search", label: "Search", icon: <span>S</span>, href: "/work/navi/demo/search" },
  { id: "trips", label: "Trips", icon: <span>T</span>, href: "/work/navi/demo/trips" },
];

describe("TabBar", () => {
  it("renders a labelled tab list with one item per link", () => {
    render(<TabBar items={items} active="feed" />);
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link")).toHaveLength(3);
  });

  it("marks the active item with aria-current=page", () => {
    render(<TabBar items={items} active="search" />);
    const links = screen.getAllByRole("link");
    expect(links.find((a) => a.getAttribute("aria-current") === "page")?.textContent).toMatch(
      /Search/,
    );
  });

  it("renders icons as decorative", () => {
    render(<TabBar items={items} active="feed" />);
    const icons = document.querySelectorAll(".nv-tabbar-icon");
    icons.forEach((i) => expect(i.getAttribute("aria-hidden")).toBe("true"));
  });
});
