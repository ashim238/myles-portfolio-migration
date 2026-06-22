import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImpactSignal } from "@/components/navi/ui/ImpactSignal";

describe("ImpactSignal", () => {
  it("renders the impact phrase with a labelled, decorative icon", () => {
    render(<ImpactSignal>Funds Prospect Park tree care</ImpactSignal>);
    const el = screen.getByText("Funds Prospect Park tree care");
    expect(el.closest(".nv-impact")).toBeInTheDocument();
    // group is labelled for assistive tech so it reads as an impact note
    expect(screen.getByRole("note")).toHaveAccessibleName(/impact/i);
  });

  it("renders as a div when as='div'", () => {
    render(<ImpactSignal as="div">Test</ImpactSignal>);
    expect(screen.getByRole("note").tagName).toBe("DIV");
  });

  it("renders as a link to the given href and is not a note", () => {
    render(<ImpactSignal href="/work/navi/demo/impact#heritage">Funds tree care</ImpactSignal>);
    const link = screen.getByRole("link", { name: /Funds tree care/ });
    expect(link).toHaveAttribute("href", "/work/navi/demo/impact#heritage");
    expect(link).toHaveClass("nv-impact");
    expect(screen.queryByRole("note")).not.toBeInTheDocument();
  });
});
