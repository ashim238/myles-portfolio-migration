import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DemoPhoto } from "@/components/navi/demo/DemoPhoto";

describe("DemoPhoto", () => {
  it("renders an image with the given alt text", () => {
    render(<DemoPhoto src="/x.jpg" alt="A harbor at dusk" />);
    expect(screen.getByRole("img", { name: "A harbor at dusk" })).toBeInTheDocument();
  });

  it("falls back to a pending panel when the image fails to load", () => {
    render(<DemoPhoto src="/missing.jpg" alt="A harbor at dusk" />);
    fireEvent.error(screen.getByRole("img"));
    expect(screen.getByText(/photo coming soon/i)).toBeInTheDocument();
    // The panel keeps the alt text as its accessible name.
    expect(screen.getByRole("img", { name: "A harbor at dusk" })).toBeInTheDocument();
  });
});
