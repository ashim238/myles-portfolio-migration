import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  iconForProgram,
  iconTierForSize,
  Myles97Icon,
  type Myles97IconName,
} from "@/components/myles-97/icons";

const iconStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-98-polish.css"),
  "utf8",
);

describe("Myles 98 program icon identity", () => {
  it("gives every project program a distinct original glyph", () => {
    const icons = [
      iconForProgram("fresh-greens"),
      iconForProgram("understandingfafsa"),
      iconForProgram("navi"),
      iconForProgram("tiktok"),
    ];

    expect(icons).toEqual(["fresh-greens", "fafsa", "navi", "tiktok"]);
    expect(new Set(icons).size).toBe(4);
  });

  it("keeps secondary programs on recognizable system glyphs", () => {
    expect(iconForProgram("selected-work")).toBe("folder");
    expect(iconForProgram("loose-parts")).toBe("loose-parts");
    expect(iconForProgram("display-properties")).toBe("display");
    expect(iconForProgram("about")).toBe("profile");
    expect(iconForProgram("resume")).toBe("resume");
    expect(iconForProgram("trini-roti")).toBe("recipe");
  });

  it("maps rendered sizes onto explicit chrome, menu, and discovery drawings", () => {
    expect(iconTierForSize(14)).toBe("chrome");
    expect(iconTierForSize(18)).toBe("chrome");
    expect(iconTierForSize(20)).toBe("menu");
    expect(iconTierForSize(24)).toBe("menu");
    expect(iconTierForSize(32)).toBe("discovery");
    expect(iconTierForSize(56)).toBe("discovery");
    expect(iconTierForSize(56, true)).toBe("chrome");
  });

  it("renders distinct, size-specific SVG grids instead of scaling one drawing", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        createElement(Myles97Icon, {
          name: "profile",
          size: 16,
          title: "Chrome profile",
        }),
        createElement(Myles97Icon, {
          name: "profile",
          size: 20,
          title: "Menu profile",
        }),
        createElement(Myles97Icon, {
          name: "profile",
          size: 40,
          variant: "color",
          title: "Discovery profile",
        }),
        createElement(Myles97Icon, {
          name: "profile",
          size: 56,
          tier: "menu",
          title: "Explicit menu profile",
        }),
      ),
    );

    const chromeIcon = screen.getByRole("img", { name: "Chrome profile" });
    const menuIcon = screen.getByRole("img", { name: "Menu profile" });
    const discoveryIcon = screen.getByRole("img", {
      name: "Discovery profile",
    });
    const explicitMenuIcon = screen.getByRole("img", {
      name: "Explicit menu profile",
    });

    expect(chromeIcon).toHaveAttribute("data-m98-icon-tier", "chrome");
    expect(chromeIcon).toHaveAttribute("data-m98-icon-grid", "16");
    expect(chromeIcon).toHaveAttribute("viewBox", "0 0 16 16");
    expect(chromeIcon).toHaveAttribute("shape-rendering", "crispEdges");
    expect(menuIcon).toHaveAttribute("data-m98-icon-tier", "menu");
    expect(menuIcon).toHaveAttribute("data-m98-icon-grid", "24");
    expect(menuIcon).toHaveAttribute("viewBox", "0 0 24 24");
    expect(discoveryIcon).toHaveAttribute(
      "data-m98-icon-tier",
      "discovery",
    );
    expect(discoveryIcon).toHaveAttribute("data-m98-icon-grid", "32");
    expect(discoveryIcon).toHaveAttribute("viewBox", "0 0 32 32");
    expect(discoveryIcon).toHaveAttribute(
      "shape-rendering",
      "geometricPrecision",
    );
    expect(explicitMenuIcon).toHaveAttribute("data-m98-icon-tier", "menu");
    expect(explicitMenuIcon).toHaveAttribute("data-m98-icon-grid", "24");
    expect(discoveryIcon).toHaveAttribute("data-m98-icon-variant", "color");
    expect(chromeIcon).toHaveAttribute("data-m98-icon-variant", "mono");
    expect(
      container.querySelector('[data-m98-icon="profile"] [fill="#ffe52f"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-m98-icon="profile"] [fill="#263cb8"]'),
    ).toBeInTheDocument();
  });

  it("keeps every tier on integer-authored geometry", () => {
    const names: Myles97IconName[] = [
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
    const sizes = [16, 20, 32];
    const { container } = render(
      createElement(
        "div",
        null,
        ...names.flatMap((name) =>
          sizes.map((size) =>
            createElement(Myles97Icon, {
              key: `${name}-${size}`,
              name,
              size,
              variant: "color",
              title: `${name}-${size}`,
            }),
          ),
        ),
      ),
    );

    const geometryAttributes = [
      "d",
      "points",
      "x",
      "y",
      "x1",
      "x2",
      "y1",
      "y2",
      "cx",
      "cy",
      "r",
      "rx",
      "ry",
      "width",
      "height",
    ];

    for (const element of container.querySelectorAll(
      "path,rect,circle,line,polyline,polygon",
    )) {
      for (const attribute of geometryAttributes) {
        const value = element.getAttribute(attribute);
        if (!value) continue;
        const numbers = value.match(/-?\d+(?:\.\d+)?/g) ?? [];
        expect(numbers.every((number) => Number.isInteger(Number(number)))).toBe(
          true,
        );
      }
    }
  });

  it("uses color icons on discovery surfaces and preserves forced-color recovery", () => {
    const workstation = readFileSync(
      resolve(process.cwd(), "src/components/myles-97/workstation-desktop.tsx"),
      "utf8",
    );
    const startMenu = readFileSync(
      resolve(process.cwd(), "src/components/myles-97/start-menu.tsx"),
      "utf8",
    );
    const pocket = readFileSync(
      resolve(process.cwd(), "src/components/myles-97/pocket-97-shell.tsx"),
      "utf8",
    );

    expect(workstation).toContain('name="profile" size={32} variant="color"');
    expect(workstation).toContain('name="resume" size={32} variant="color"');
    expect(startMenu).toContain('name="folder" size={20} variant="color"');
    expect(pocket).toContain('variant="color"');
    expect(iconStyles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*?\.myles98-icon-accent,[\s\S]*?fill:\s*CanvasText !important;/,
    );
    expect(iconStyles).not.toMatch(/:global\(/);
  });

  it("reduces the compact FAFSA glyph to one application window and envelope", () => {
    const { container, rerender } = render(
      createElement(Myles97Icon, {
        name: "fafsa",
        size: 16,
        compact: true,
        title: "FAFSA Mail",
      }),
    );
    const compactIcon = container.querySelector("svg");

    expect(compactIcon).toHaveAttribute("data-myles97-icon-density", "compact");
    expect(compactIcon).toHaveAttribute("data-m98-icon-tier", "chrome");
    expect(compactIcon).toHaveAttribute("viewBox", "0 0 16 16");
    expect(compactIcon).toHaveAttribute("stroke", "currentColor");
    expect(compactIcon?.querySelectorAll("path")).toHaveLength(2);
    expect(compactIcon?.querySelectorAll("rect")).toHaveLength(0);
    expect(
      Array.from(compactIcon?.querySelectorAll("path") ?? [], (path) =>
        path.getAttribute("d"),
      ),
    ).toEqual([
      "M1 3h14v11H1zM1 6h14",
      "M3 8h10v4H3zM3 8l5 3 5-3",
    ]);

    rerender(
      createElement(Myles97Icon, {
        name: "fafsa",
        size: 24,
        title: "FAFSA Mail",
      }),
    );
    const fullIcon = container.querySelector("svg");

    expect(fullIcon).not.toHaveAttribute("data-myles97-icon-density", "compact");
    expect(fullIcon?.querySelectorAll("rect")).toHaveLength(4);
  });

  it("reduces the compact Navi glyph to a clear pin and center point", () => {
    const { container, rerender } = render(
      createElement(Myles97Icon, {
        name: "navi",
        size: 18,
        compact: true,
        title: "Navi",
      }),
    );
    const compactIcon = container.querySelector("svg");

    expect(compactIcon).toHaveAttribute("data-myles97-icon-density", "compact");
    expect(compactIcon).toHaveAttribute("data-m98-icon-tier", "chrome");
    expect(compactIcon).toHaveAttribute("viewBox", "0 0 16 16");
    expect(compactIcon?.querySelectorAll("path")).toHaveLength(1);
    expect(compactIcon?.querySelectorAll("circle")).toHaveLength(1);
    expect(compactIcon?.querySelector("circle")).toHaveAttribute("r", "2");
    expect(compactIcon?.querySelector("circle")).toHaveAttribute("cx", "8");

    rerender(
      createElement(Myles97Icon, {
        name: "navi",
        size: 40,
        title: "Navi",
      }),
    );
    const fullIcon = container.querySelector("svg");

    expect(fullIcon).not.toHaveAttribute("data-myles97-icon-density", "compact");
    expect(fullIcon).toHaveAttribute("data-m98-icon-tier", "discovery");
    expect(fullIcon?.querySelectorAll("path")).toHaveLength(1);
    expect(fullIcon?.querySelectorAll("circle")).toHaveLength(1);
    expect(fullIcon?.querySelector("circle")).toHaveAttribute("r", "4");
  });
});
