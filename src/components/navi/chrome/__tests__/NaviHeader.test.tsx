import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";

describe("NaviHeader", () => {
  it("renders a banner with the Navi wordmark and primary nav", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Navi")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();
  });

  it("links to the system and demo surfaces", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("link", { name: /system/i })).toHaveAttribute(
      "href",
      "/work/navi/system",
    );
    expect(screen.getByRole("link", { name: /explore/i })).toHaveAttribute(
      "href",
      "/work/navi/demo",
    );
  });

  it("links to the impact ledger from primary nav", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("link", { name: /impact/i })).toHaveAttribute(
      "href",
      "/work/navi/demo/impact",
    );
  });

  it("keeps Host an event inside the product, not on the case study", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("link", { name: /host an event/i })).toHaveAttribute(
      "href",
      "/work/navi/demo/host",
    );
  });
});
