import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Rating } from "@/components/navi/ui/Rating";

describe("Rating", () => {
  it("renders the numeral and an accessible label", () => {
    render(<Rating value={4.9} reviews={213} />);
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByLabelText("Rated 4.9 out of 5, 213 reviews")).toBeInTheDocument();
  });

  it("omits reviews phrasing when not provided", () => {
    render(<Rating value={5} />);
    expect(screen.getByLabelText("Rated 5 out of 5")).toBeInTheDocument();
  });
});
