import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Specimen } from "@/components/navi/system/Specimen";

describe("Specimen", () => {
  it("renders a titled, optionally-noted region around its children", () => {
    render(
      <Specimen title="Button" note="Contrast-corrected to --nv-action.">
        <button type="button">x</button>
      </Specimen>,
    );
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByText("Contrast-corrected to --nv-action.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "x" })).toBeInTheDocument();
  });
});
