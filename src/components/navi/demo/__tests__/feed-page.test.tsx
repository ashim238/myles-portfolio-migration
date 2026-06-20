import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("filters cards by typed query", async () => {
    render(<FeedPage />);
    const before = screen.getAllByRole("link").length;
    const box = screen.getByRole("searchbox");
    await userEvent.type(box, "prospect");
    const after = screen.getAllByRole("link").length;
    expect(after).toBeLessThan(before);
  });

  it("filters by category button", async () => {
    render(<FeedPage />);
    const before = screen.getAllByRole("link").length;
    await userEvent.click(screen.getByRole("button", { name: "Cooking" }));
    const after = screen.getAllByRole("link").length;
    expect(after).toBeLessThanOrEqual(before);
  });
});
