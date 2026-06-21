import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Legend } from "@/components/navi/demo/Legend";

describe("Legend", () => {
  it("renders a labelled list with pin entries", () => {
    render(<Legend />);
    expect(screen.getByRole("group", { name: /legend/i })).toBeInTheDocument();
    expect(screen.getByText(/price per person/i)).toBeInTheDocument();
    expect(screen.getByText(/current location/i)).toBeInTheDocument();
  });
});
