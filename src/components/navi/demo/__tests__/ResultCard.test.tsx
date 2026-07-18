import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ResultCard } from "@/components/navi/demo/ResultCard";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("ResultCard", () => {
  const e = EXPERIENCES[0];

  it("renders a horizontal row with photo, title, location, rating, impact, price", () => {
    render(<ResultCard experience={e} href="#" />);
    expect(screen.getByRole("link", { name: new RegExp(e.title, "i") })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(e.neighborhood))).toBeInTheDocument();
    expect(screen.getByText(/rated/i)).toHaveClass("nv-sr-only");
    expect(screen.getByText(e.impactPhrase)).toBeInTheDocument();
    expect(screen.getByText(`$${e.price} per person`)).toBeInTheDocument();
  });

  it("requests an image sized for the result-row slot", () => {
    render(<ResultCard experience={e} href="#" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "sizes",
      "(max-width: 720px) calc(100vw - 32px), 160px",
    );
  });

  it("fires onHover when the row is moused over", async () => {
    const onHover = vi.fn();
    render(<ResultCard experience={e} href="#" onHover={onHover} />);
    await userEvent.hover(screen.getByRole("link"));
    expect(onHover).toHaveBeenCalledWith(e.slug);
  });

  it("fires onHover when the row receives focus", async () => {
    const onHover = vi.fn();
    render(<ResultCard experience={e} href="#" onHover={onHover} />);
    await userEvent.tab();
    expect(onHover).toHaveBeenCalledWith(e.slug);
  });
});
