import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Rating } from "@/components/navi/ui/Rating";

describe("Rating", () => {
  it("renders the numeral and real screen-reader text", () => {
    render(<Rating value={4.9} reviews={213} />);
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("Rated 4.9 out of 5, 213 reviews")).toHaveClass("nv-sr-only");
    expect(document.querySelector(".nv-rating[aria-label]")).not.toBeInTheDocument();
  });

  it("omits reviews phrasing when not provided", () => {
    render(<Rating value={5} />);
    expect(screen.getByText("Rated 5 out of 5")).toHaveClass("nv-sr-only");
  });
});
