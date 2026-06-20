import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

let mockPath = "/work/navi/demo";
vi.mock("next/navigation", () => ({
  usePathname: () => mockPath,
}));

import { ActiveTabBar } from "@/components/navi/chrome/ActiveTabBar";

describe("ActiveTabBar", () => {
  it("marks Explore active on the feed route", () => {
    mockPath = "/work/navi/demo";
    render(<ActiveTabBar />);
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute("aria-current", "page");
  });

  it("marks Search active on the search route", () => {
    mockPath = "/work/navi/demo/search";
    render(<ActiveTabBar />);
    expect(screen.getByRole("link", { name: /search/i })).toHaveAttribute("aria-current", "page");
  });

  it("marks System active on the system route", () => {
    mockPath = "/work/navi/system";
    render(<ActiveTabBar />);
    expect(screen.getByRole("link", { name: /system/i })).toHaveAttribute("aria-current", "page");
  });
});
