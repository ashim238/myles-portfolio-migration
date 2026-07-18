import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NaviHeader } from "@/components/navi/chrome/NaviHeader";

describe("NaviHeader", () => {
  it("renders a banner with a distinct Navi project navigation landmark", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Navi")).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: "Navi project navigation" }),
    ).toBeInTheDocument();
  });

  it("offers a way out of the demo back to the case study", () => {
    render(<NaviHeader />);
    expect(screen.getByRole("link", { name: /case study/i })).toHaveAttribute(
      "href",
      "/work/navi",
    );
  });

  it("identifies every Navi-owned route as sample portfolio content", () => {
    render(<NaviHeader />);

    expect(
      screen.getByText(
        "Portfolio concept. Hosts, reviews, prices, and impact claims are sample content.",
      ),
    ).toBeInTheDocument();
  });

  it("provides a shorter visual exit label for narrow screens", () => {
    const { container } = render(<NaviHeader />);
    const link = screen.getByRole("link", { name: "Return to case study" });
    const wideLabel = container.querySelector(".nv-nav-back-wide");
    const shortLabel = container.querySelector(".nv-nav-back-short");
    expect(link).toHaveAttribute("href", "/work/navi");
    expect(wideLabel).not.toBeNull();
    expect(shortLabel).not.toBeNull();
    expect(wideLabel!).toHaveTextContent("Return to case study");
    expect(shortLabel!).toHaveTextContent("Case study");
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
