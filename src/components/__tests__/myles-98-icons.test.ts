import { createElement } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { iconForProgram, Myles97Icon } from "@/components/myles-97/icons";

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
    expect(iconForProgram("trini-roti")).toBe("document");
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
