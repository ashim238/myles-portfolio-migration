import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HostPage from "@/app/work/navi/(minisite)/demo/host/page";

describe("Host page", () => {
  it("shows an in-product hosting empty state", () => {
    render(<HostPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /hosting opens soon/i }),
    ).toBeInTheDocument();
  });

  it("links back to the feed, staying inside the demo", () => {
    render(<HostPage />);
    expect(screen.getByRole("link", { name: /explore experiences/i })).toHaveAttribute(
      "href",
      "/work/navi/demo",
    );
  });
});
