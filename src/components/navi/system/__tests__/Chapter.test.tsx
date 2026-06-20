import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Chapter } from "@/components/navi/system/Chapter";

describe("Chapter", () => {
  it("renders an h2 title and optional intro around its children", () => {
    render(
      <Chapter title="Foundations" intro="The canvas.">
        <div>child</div>
      </Chapter>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Foundations" })).toBeInTheDocument();
    expect(screen.getByText("The canvas.")).toBeInTheDocument();
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("omits intro paragraph when not provided", () => {
    render(<Chapter title="Actions"><div>x</div></Chapter>);
    expect(screen.queryByRole("paragraph")).not.toBeInTheDocument();
  });
});
