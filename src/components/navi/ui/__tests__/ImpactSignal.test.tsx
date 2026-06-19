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
});
