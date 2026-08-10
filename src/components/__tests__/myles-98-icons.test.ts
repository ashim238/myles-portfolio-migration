import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";

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

  it("renders color and monochrome variants from one authored 24-unit grid", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        createElement(Myles97Icon, {
          name: "profile",
          size: 32,
          variant: "color",
          title: "About Myles icon",
        }),
        createElement(Myles97Icon, {
          name: "profile",
          size: 16,
          title: "About title-bar icon",
        }),
      ),
    );

    const colorIcon = screen.getByRole("img", { name: "About Myles icon" });
    const monoIcon = screen.getByRole("img", { name: "About title-bar icon" });

    expect(colorIcon).toHaveAttribute("data-m98-icon", "profile");
    expect(colorIcon).toHaveAttribute("data-m98-icon-grid", "24");
    expect(colorIcon).toHaveAttribute("data-m98-icon-variant", "color");
    expect(colorIcon).toHaveAttribute("stroke-width", "1.5");
    expect(monoIcon).toHaveAttribute("data-m98-icon-variant", "mono");
    expect(
      container.querySelector('[data-m98-icon="profile"] [fill="#ffe52f"]'),
    ).toBeInTheDocument();
    expect(
      container.querySelector('[data-m98-icon="profile"] [fill="#263cb8"]'),
    ).toBeInTheDocument();
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
    expect(compactIcon).toHaveAttribute("stroke", "currentColor");
    expect(compactIcon?.querySelectorAll("path")).toHaveLength(2);
    expect(compactIcon?.querySelectorAll("rect")).toHaveLength(0);
    expect(
      Array.from(compactIcon?.querySelectorAll("path") ?? [], (path) =>
        path.getAttribute("d"),
      ),
    ).toEqual([
      "M3 4h18v16H3zM3 8h18",
      "M6 11h12v6H6zM6 11l6 4 6-4",
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
});
