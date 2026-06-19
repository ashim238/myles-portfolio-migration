import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Tag } from "@/components/navi/ui/Tag";

describe("Tag", () => {
  it("renders its text and default neutral tone", () => {
    render(<Tag>Popular</Tag>);
    const tag = screen.getByText("Popular");
    expect(tag).toHaveClass("nv-tag", "nv-tag--neutral");
  });

  it("applies the local tone (category, distinct from rating green)", () => {
    render(<Tag tone="local">Locally-owned</Tag>);
    expect(screen.getByText("Locally-owned")).toHaveClass("nv-tag--local");
  });
});
