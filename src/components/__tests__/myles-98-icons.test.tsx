import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  iconForProgram,
  Myles97Icon,
  type Myles97IconName,
} from "@/components/myles-97/icons";

const iconStyles = readFileSync(
  resolve(process.cwd(), "src/components/myles-97/icons.module.css"),
  "utf8",
);

const iconNames: readonly Myles97IconName[] = [
  "folder",
  "document",
  "profile",
  "resume",
  "recipe",
  "display",
  "mail",
  "app",
  "loose-parts",
  "fresh-greens",
  "fafsa",
  "navi",
  "tiktok",
];

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

  it("uses one precise grid and stroke system across every glyph", () => {
    render(
      <>
        {iconNames.map((name) => (
          <Myles97Icon key={name} name={name} title={`${name} icon`} />
        ))}
      </>,
    );

    for (const name of iconNames) {
      const icon = screen.getByRole("img", { name: `${name} icon` });
      expect(icon).toHaveAttribute("viewBox", "0 0 24 24");
      expect(icon).toHaveAttribute("data-m98-icon-grid", "24");
      expect(icon).toHaveAttribute("stroke-width", "1.5");
      expect(icon).toHaveAttribute("stroke-linecap", "square");
      expect(icon).toHaveAttribute("stroke-linejoin", "miter");
      expect(icon).toHaveAttribute("shape-rendering", "geometricPrecision");
    }
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

  it("keeps dense chrome crisp while reserving one hard shadow for desktop shortcuts", () => {
    expect(iconStyles).toMatch(
      /:global\(\.myles97-desktop-shortcuts\) \.color\s*\{[\s\S]*?drop-shadow\(1px 1px 0/,
    );
    expect(iconStyles).toMatch(
      /:global\(\.myles97-start-menu-items\) \.color,[\s\S]*?:global\(\.myles97-taskbar\) \.color\s*\{[\s\S]*?filter:\s*none;/,
    );
    expect(iconStyles).not.toContain("drop-shadow(1px 2px");
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
