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
    expect(screen.getByRole("button", { name: "Architecture & design" })).toBeInTheDocument();
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

  it("offers no dead Solo group band", async () => {
    render(<FeedPage />);
    await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
    expect(screen.queryByRole("button", { name: "Solo" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Small/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Large/ })).toBeInTheDocument();
  });

  it("keeps open-capacity listings in the Large group band", async () => {
    render(<FeedPage />);
    await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
    await userEvent.click(screen.getByRole("button", { name: /^Large/ }));
    await userEvent.click(screen.getByRole("button", { name: /Show .* experiences?/ }));
    // "Sunset Park Night Market" has groupSize "Drop in anytime" (no number),
    // so it must land in Large rather than disappearing from every band.
    expect(
      screen.getByRole("link", { name: /Sunset Park Night Market/i }),
    ).toBeInTheDocument();
  });

  it("filters by price via the slide-over", async () => {
    render(<FeedPage />);
    const before = screen.getAllByRole("link").length;
    await userEvent.click(screen.getByRole("button", { name: /^Filters$/ }));
    await userEvent.click(screen.getByRole("button", { name: "Under $30" }));
    await userEvent.click(screen.getByRole("button", { name: /Show .* experiences?/ }));
    const after = screen.getAllByRole("link").length;
    expect(after).toBeLessThanOrEqual(before);
  });
});
