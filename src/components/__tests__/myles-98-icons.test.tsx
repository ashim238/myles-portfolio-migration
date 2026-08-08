import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  iconForProgram,
  Myles97Icon,
} from "@/components/myles-97/icons";

describe("Myles 98 icon system", () => {
  it("assigns distinct authored icons to project and document programs", () => {
    expect(iconForProgram("fresh-greens")).toBe("fresh-greens");
    expect(iconForProgram("understandingfafsa")).toBe("fafsa");
    expect(iconForProgram("navi")).toBe("navi");
    expect(iconForProgram("tiktok")).toBe("tiktok");
    expect(iconForProgram("about")).toBe("profile");
    expect(iconForProgram("resume")).toBe("resume");
    expect(iconForProgram("trini-roti")).toBe("recipe");

    expect(
      new Set([
        iconForProgram("fresh-greens"),
        iconForProgram("understandingfafsa"),
        iconForProgram("navi"),
        iconForProgram("tiktok"),
      ]).size,
    ).toBe(4);
  });

  it("renders rich color and compact monochrome variants from the same glyph", () => {
    const { container } = render(
      <>
        <Myles97Icon
          name="profile"
          size={32}
          variant="color"
          title="About Myles icon"
        />
        <Myles97Icon name="profile" size={16} title="About title-bar icon" />
      </>,
    );

    expect(screen.getByRole("img", { name: "About Myles icon" })).toHaveAttribute(
      "data-m98-icon-variant",
      "color",
    );
    expect(
      screen.getByRole("img", { name: "About title-bar icon" }),
    ).toHaveAttribute("data-m98-icon-variant", "mono");

    const colorIcon = container.querySelector<SVGElement>(
      '[data-m98-icon="profile"][data-m98-icon-variant="color"]',
    );
    expect(colorIcon).not.toBeNull();
    expect(colorIcon?.querySelector('[fill="#ffe52f"]')).not.toBeNull();
    expect(colorIcon?.querySelector('[fill="#263cb8"]')).not.toBeNull();
  });

  it("preserves accessible labelling without exposing decorative icons", () => {
    const { container } = render(
      <>
        <Myles97Icon name="folder" title="Selected Work" />
        <Myles97Icon name="folder" />
      </>,
    );

    expect(screen.getByRole("img", { name: "Selected Work" })).toBeInTheDocument();
    expect(
      container.querySelector('svg[data-m98-icon="folder"][aria-hidden="true"]'),
    ).toBeInTheDocument();
  });
});
