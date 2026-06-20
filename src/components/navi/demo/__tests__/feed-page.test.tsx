import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import FeedPage from "@/app/work/navi/(minisite)/demo/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Feed page", () => {
  it("renders a card for every experience", () => {
    render(<FeedPage />);
    // each card is a link to its slug
    for (const e of EXPERIENCES) {
      expect(
        screen.getByRole("link", { name: new RegExp(e.title, "i") }),
      ).toBeInTheDocument();
    }
  });

  it("renders the category taskbar with all categories", () => {
    render(<FeedPage />);
    expect(screen.getByRole("region", { name: /categories/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cooking" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Architecture" })).toBeInTheDocument();
  });
});
