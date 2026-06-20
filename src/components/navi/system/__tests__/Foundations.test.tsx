import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { NaviColorSpecimen, NaviTypeSpecimen, NaviSpacingSpecimen } from "@/components/navi/system/Foundations";
import { NAVI_PRIMITIVES, NAVI_SEMANTIC, NAVI_SPACING, NAVI_TYPE } from "@/lib/navi/tokens";

describe("NaviColorSpecimen", () => {
  it("renders a swatch button for each primitive color", () => {
    render(<NaviColorSpecimen />);
    const primitives = Object.entries(NAVI_PRIMITIVES);
    primitives.forEach(([name, hex]) => {
      expect(
        screen.getByRole("button", { name: `Copy ${name} ${hex}` })
      ).toBeInTheDocument();
    });
  });

  it("renders a swatch button for each semantic alias", () => {
    render(<NaviColorSpecimen />);
    const aliases = Object.entries(NAVI_SEMANTIC);
    aliases.forEach(([name, hex]) => {
      expect(
        screen.getByRole("button", { name: `Copy ${name} ${hex}` })
      ).toBeInTheDocument();
    });
  });

  it("renders both primitive and semantic sections", () => {
    render(<NaviColorSpecimen />);
    expect(screen.getByTestId("nv-color-primitives")).toBeInTheDocument();
    expect(screen.getByTestId("nv-color-semantic")).toBeInTheDocument();
  });
});

describe("NaviTypeSpecimen", () => {
  it("renders a type cell for each ramp entry", () => {
    render(<NaviTypeSpecimen />);
    const roles = Object.keys(NAVI_TYPE) as (keyof typeof NAVI_TYPE)[];
    roles.forEach((role) => {
      const label = screen.getByText(new RegExp(role, "i"));
      expect(label).toBeInTheDocument();
    });
  });

  it("renders the type grid container", () => {
    render(<NaviTypeSpecimen />);
    expect(screen.getByTestId("nv-type-grid")).toBeInTheDocument();
  });
});

describe("NaviSpacingSpecimen", () => {
  it("renders a row for each spacing scale entry", () => {
    render(<NaviSpacingSpecimen />);
    NAVI_SPACING.forEach((row) => {
      expect(screen.getByText(row.token)).toBeInTheDocument();
      expect(screen.getByText(`${row.px}px`)).toBeInTheDocument();
    });
  });

  it("renders the spacing table container with the correct label", () => {
    render(<NaviSpacingSpecimen />);
    expect(
      screen.getByRole("table", { name: /4px spacing scale/i })
    ).toBeInTheDocument();
  });
});
