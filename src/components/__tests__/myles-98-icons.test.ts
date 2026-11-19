import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  iconForProgram,
  iconTierForSize,
  Myles97Icon,
  type Myles97IconName,
} from "@/components/myles-97/icons";

const workstationStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
  "utf8",
);

const MASTER_CONCEPT_BY_ICON: Record<Myles97IconName, string> = {
  start: "start",
  folder: "selected-work",
  document: "reminders",
  profile: "about-myles",
  resume: "resume",
  recipe: "trini-roti",
  display: "display-properties",
  mail: "email",
  app: "generic-app",
  paintbrush: "paintbrush",
  "open-apps": "open-apps",
  "reset-desktop": "reset-desktop",
  "loose-parts": "loose-parts",
  "fresh-greens": "fresh-greens",
  fafsa: "understandingfafsa",
  navi: "navi",
  tiktok: "tiktok-catalog",
  music: "now-playing",
};

const COLOR_ICON_NAMES = Object.keys(MASTER_CONCEPT_BY_ICON) as Myles97IconName[];

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
    expect(iconForProgram("reminders")).toBe("document");
    expect(iconForProgram("now-playing")).toBe("music");
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

  it.each(COLOR_ICON_NAMES)("uses the selected color and monochrome masters for %s at all three sizes", (name) => {
    const concept = MASTER_CONCEPT_BY_ICON[name];
    const sheet = readFileSync(resolve("public/myles98-sprites/monochrome.svg"), "utf8");
    for (const grid of [16, 24, 32]) {
      const drawing = `${concept}-${grid}`;
      const { container, rerender, unmount } = render(
        createElement(Myles97Icon, { name, size: grid, variant: "color", title: drawing }),
      );
      const icon = screen.getByRole("img", { name: drawing });
      const file = `/myles98-sprites/${concept}/${drawing}.svg`;
      expect(icon).toHaveAttribute("viewBox", `0 0 ${grid} ${grid}`);
      expect(icon).toHaveAttribute("shape-rendering", "crispEdges");
      expect(icon.querySelector("image")).toHaveAttribute("href", file);
      expect(readFileSync(resolve("public", file.slice(1)), "utf8")).toContain(`data-m98-grid="${grid}"`);
      const mono = `/myles98-sprites/monochrome.svg#${drawing}`;
      expect(icon.querySelector(".myles98-icon-fallback")).toHaveAttribute("href", mono);
      expect(sheet).toContain(`<symbol id="${drawing}" viewBox="0 0 ${grid} ${grid}"`);
      rerender(createElement(Myles97Icon, { name, size: grid }));
      expect(container.querySelector("image")).toBeNull();
      expect(container.querySelector("use")).toHaveAttribute("href", mono);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
      unmount();
    }
  });

  it.each([
    ["start", "6d4cfe75b0e1c060fca4927ed4c8ed55216df12fba049f4070b22ebb530d9a42"],
    ["about-myles", "289e8b9353876aa50f06bedb59bf9af0b41e9327f38394251f2866d418e894d7"],
  ])("retains the approved %s portrait at all three sizes", (concept, expected) => {
    const hash = createHash("sha256");
    for (const size of [16, 24, 32]) {
      hash.update(readFileSync(resolve(`public/myles98-sprites/${concept}/${concept}-${size}.svg`)));
    }
    expect(hash.digest("hex")).toBe(expected);
  });

  it("honors explicit tiers and prioritizes compact chrome", () => {
    const props = { name: "fafsa", size: 48, tier: "menu", variant: "color" } as const;
    const { container, rerender } = render(createElement(Myles97Icon, props));
    expect(container.querySelector("svg")).toHaveAttribute("data-m98-icon-grid", "24");
    rerender(createElement(Myles97Icon, { ...props, compact: true }));
    expect(container.querySelector("svg")).toHaveAttribute("data-m98-icon-grid", "16");
  });

  it("keeps the Start-menu brand text inside the blue identity column", () => {
    const brandRule = workstationStyles.match(
      /\.myles97-start-menu-brand\s*\{([\s\S]*?)\n\}/,
    )?.[1];
    const labelRule = workstationStyles.match(
      /\.myles97-start-menu-brand :is\(span, strong\)\s*\{([\s\S]*?)\n\}/,
    )?.[1];

    expect(brandRule).toBeDefined();
    expect(brandRule).not.toMatch(/writing-mode:\s*vertical-rl/);
    expect(brandRule).not.toMatch(/transform:\s*rotate\(180deg\)/);
    expect(labelRule).toMatch(/writing-mode:\s*vertical-rl/);
    expect(labelRule).toMatch(/transform:\s*rotate\(180deg\)/);
  });
});
