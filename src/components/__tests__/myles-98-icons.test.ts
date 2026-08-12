import { createElement } from "react";
import { render, screen } from "@testing-library/react";
import { readdirSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";
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

const workstationStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/myles-97.css"),
  "utf8",
);

const MASTER_CONCEPT_BY_ICON: Record<Myles97IconName, string> = {
  folder: "selected-work",
  document: "reminders",
  profile: "about-myles",
  resume: "resume",
  recipe: "trini-roti",
  display: "display-properties",
  mail: "email",
  app: "generic-app",
  "open-apps": "open-apps",
  "reset-desktop": "reset-desktop",
  "loose-parts": "loose-parts",
  "fresh-greens": "fresh-greens",
  fafsa: "understandingfafsa",
  navi: "navi",
  tiktok: "tiktok-catalog",
};

const COLOR_ICON_NAMES = Object.keys(MASTER_CONCEPT_BY_ICON) as Myles97IconName[];

function svgFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);

    if (entry.isDirectory()) return svgFiles(path);
    return entry.isFile() && entry.name.endsWith(".svg") ? [path] : [];
  });
}

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

  it("uses the audited public SVG master at each color tier without an interior scale", () => {
    const nativeSizes = [16, 24, 32] as const;
    const { container } = render(
      createElement(
        "div",
        null,
        ...COLOR_ICON_NAMES.flatMap((name) =>
          nativeSizes.map((size) =>
            createElement(Myles97Icon, {
              key: `${name}-${size}`,
              name,
              size,
              variant: "color",
              title: `${name}-${size}-master`,
            }),
          ),
        ),
      ),
    );

    for (const name of COLOR_ICON_NAMES) {
      const concept = MASTER_CONCEPT_BY_ICON[name];

      for (const size of nativeSizes) {
        const icon = screen.getByRole("img", { name: `${name}-${size}-master` });
        const master = icon.querySelector<SVGImageElement>(
          "image[data-m98-icon-master]",
        );
        const source = `/myles98-icons/${concept}/${concept}-${size}.svg`;

        expect(master).toBeInTheDocument();
        expect(master).toHaveClass("myles98-icon-master");
        expect(master).toHaveAttribute("href", source);
        expect(master).toHaveAttribute("data-m98-icon-master-concept", concept);
        expect(master).toHaveAttribute("data-m98-icon-master-grid", String(size));
        expect(master).toHaveAttribute("x", "0");
        expect(master).toHaveAttribute("y", "0");
        expect(master).toHaveAttribute("width", String(size));
        expect(master).toHaveAttribute("height", String(size));
        expect(master).toHaveAttribute("preserveAspectRatio", "none");
        expect(master).not.toHaveAttribute("transform");

        const publicMaster = resolve(process.cwd(), "public", source.slice(1));
        const documentedMaster = resolve(
          process.cwd(),
          "docs/design-assets/myles98-icons/masters",
          concept,
          `${concept}-${size}.svg`,
        );

        expect(readFileSync(publicMaster, "utf8")).toBe(
          readFileSync(documentedMaster, "utf8"),
        );
      }
    }

    expect(
      container.querySelectorAll("image[data-m98-icon-master]"),
    ).toHaveLength(COLOR_ICON_NAMES.length * nativeSizes.length);
  });

  it("keeps the public master directory byte-identical to the audited family", () => {
    const documentedRoot = resolve(
      process.cwd(),
      "docs/design-assets/myles98-icons/masters",
    );
    const publicRoot = resolve(process.cwd(), "public/myles98-icons");
    const documentedFiles = svgFiles(documentedRoot).map((path) =>
      relative(documentedRoot, path),
    );
    const publicFiles = svgFiles(publicRoot).map((path) =>
      relative(publicRoot, path),
    );

    expect(publicFiles.sort()).toEqual(documentedFiles.sort());
    expect(publicFiles).toHaveLength(48);

    for (const path of publicFiles) {
      expect(readFileSync(resolve(publicRoot, path), "utf8")).toBe(
        readFileSync(resolve(documentedRoot, path), "utf8"),
      );
    }
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
      "open-apps",
      "reset-desktop",
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

  it("builds color menu and discovery icons from object-specific pixel-depth planes", () => {
    const names: Myles97IconName[] = [
      "folder",
      "document",
      "profile",
      "resume",
      "recipe",
      "display",
      "mail",
      "app",
      "open-apps",
      "reset-desktop",
      "loose-parts",
      "fresh-greens",
      "fafsa",
      "navi",
      "tiktok",
    ];
    render(
      createElement(
        "div",
        null,
        ...names.flatMap((name) =>
          [20, 32, 40].map((size) =>
            createElement(Myles97Icon, {
              key: `${name}-${size}`,
              name,
              size,
              variant: "color",
              title: `${name}-${size}`,
            }),
          ),
        ),
        createElement(Myles97Icon, {
          name: "mail",
          size: 16,
          variant: "color",
          title: "mail-chrome",
        }),
      ),
    );

    for (const name of names) {
      for (const size of [20, 32, 40]) {
        const icon = screen.getByRole("img", { name: `${name}-${size}` });
        expect(icon).toHaveAttribute("width", String(size));
        expect(icon).toHaveAttribute("height", String(size));
        expect(icon.querySelector("[transform]")).not.toBeInTheDocument();
        expect(
          icon.querySelector("[data-m98-icon-silhouette]"),
        ).not.toBeInTheDocument();
        expect(
          icon.querySelector('[data-m98-icon-master]'),
        ).toBeInTheDocument();
        expect(
          Array.from(
            icon.querySelectorAll(":scope > .myles98-icon-fallback > [data-m98-icon-layer]"),
            (layer) => layer.getAttribute("data-m98-icon-layer"),
          ),
        ).toEqual(["cast-shadow", "face", "side", "highlight"]);

        const visibleSide = icon.querySelector(
          '[data-m98-icon-layer="side"]',
        );
        expect(visibleSide).toBeInTheDocument();
        expect(
          visibleSide?.querySelectorAll(
            `[data-m98-icon-object="${name}"][data-m98-icon-plane="side"]`,
          ).length,
        ).toBeGreaterThan(0);

        for (const planeName of ["cast-shadow", "side", "highlight"]) {
          const geometry = icon.querySelectorAll(
            `[data-m98-icon-plane="${planeName}"]`,
          );
          expect(geometry.length).toBeGreaterThan(0);

          for (const element of geometry) {
            expect(element).toHaveAttribute("data-m98-icon-object", name);
            expect(element).toHaveAttribute("stroke", "none");
            expect(element.getAttribute("fill")).not.toBe("none");
            expect(element).not.toHaveClass("myles98-icon-line");
            expect(element).not.toHaveAttribute("data-m98-mail-part");
            expect(
              element.closest(
                `[data-m98-icon-depth="${planeName === "highlight" ? "highlight" : "shadow"}"]`,
              ),
            ).toBeInTheDocument();
          }
        }
      }
    }

    for (const size of [20, 32]) {
      const objectSignatures = names.map((name) => {
        const icon = screen.getByRole("img", { name: `${name}-${size}` });
        return Array.from(icon.querySelectorAll("[data-m98-icon-plane]"), (plane) =>
          `${plane.getAttribute("data-m98-icon-plane")}:${plane.getAttribute("d")}`,
        ).join("|");
      });

      expect(new Set(objectSignatures).size).toBe(names.length);
    }

    expect(
      screen
        .getByRole("img", { name: "mail-chrome" })
        .querySelector("[data-m98-icon-depth]"),
    ).not.toBeInTheDocument();
  });

  it("keeps every decorative depth plane inside its authored grid", () => {
    const names: Myles97IconName[] = [
      "folder",
      "document",
      "profile",
      "resume",
      "recipe",
      "display",
      "mail",
      "app",
      "open-apps",
      "reset-desktop",
      "loose-parts",
      "fresh-greens",
      "fafsa",
      "navi",
      "tiktok",
    ];
    const { container } = render(
      createElement(
        "div",
        null,
        ...names.flatMap((name) =>
          [20, 32].map((size) =>
            createElement(Myles97Icon, {
              key: `${name}-${size}`,
              name,
              size,
              variant: "color",
              title: `${name}-bounds-${size}`,
            }),
          ),
        ),
      ),
    );

    for (const icon of container.querySelectorAll("svg")) {
      const grid = Number(icon.getAttribute("data-m98-icon-grid"));
      for (const plane of icon.querySelectorAll<SVGPathElement>(
        "path[data-m98-icon-plane]",
      )) {
        const data = plane.getAttribute("d") ?? "";
        expect(data).toMatch(/^[MLHVZ0-9\s]+$/);
        const coordinates = data.match(/\d+/g)?.map(Number) ?? [];
        expect(coordinates.length).toBeGreaterThan(0);
        expect(coordinates.every((value) => value >= 0 && value <= grid)).toBe(
          true,
        );
      }
    }
  });

  it("groups Loose Parts into one recognizable parts tray at menu and discovery sizes", () => {
    render(
      createElement(
        "div",
        null,
        createElement(Myles97Icon, {
          name: "loose-parts",
          size: 20,
          title: "Loose Parts menu",
        }),
        createElement(Myles97Icon, {
          name: "loose-parts",
          size: 32,
          title: "Loose Parts desktop",
        }),
      ),
    );

    for (const label of ["Loose Parts menu", "Loose Parts desktop"]) {
      const icon = screen.getByRole("img", { name: label });
      const tray = icon.querySelector<SVGRectElement>(
        'rect[data-m98-loose-parts-object="tray"]',
      );
      const parts = Array.from(
        icon.querySelectorAll<SVGGraphicsElement>(
          '[data-m98-loose-parts-object="part"]',
        ),
      );

      expect(tray).toBeInTheDocument();
      expect(parts).toHaveLength(3);

      const trayBounds = {
        left: Number(tray?.getAttribute("x")),
        top: Number(tray?.getAttribute("y")),
        right:
          Number(tray?.getAttribute("x")) +
          Number(tray?.getAttribute("width")),
        bottom:
          Number(tray?.getAttribute("y")) +
          Number(tray?.getAttribute("height")),
      };

      for (const part of parts) {
        let bounds: typeof trayBounds;

        if (part.tagName.toLowerCase() === "circle") {
          const radius = Number(part.getAttribute("r"));
          const cx = Number(part.getAttribute("cx"));
          const cy = Number(part.getAttribute("cy"));
          bounds = {
            left: cx - radius,
            top: cy - radius,
            right: cx + radius,
            bottom: cy + radius,
          };
        } else if (part.tagName.toLowerCase() === "rect") {
          const left = Number(part.getAttribute("x"));
          const top = Number(part.getAttribute("y"));
          bounds = {
            left,
            top,
            right: left + Number(part.getAttribute("width")),
            bottom: top + Number(part.getAttribute("height")),
          };
        } else {
          const triangle = part
            .getAttribute("d")
            ?.match(/^M(\d+) (\d+)h(\d+)l(-?\d+)(-?\d+)z$/);
          expect(triangle).not.toBeNull();
          const [, xValue, yValue, widthValue, dxValue, dyValue] =
            triangle ?? [];
          const x = Number(xValue);
          const y = Number(yValue);
          const width = Number(widthValue);
          const dx = Number(dxValue);
          const dy = Number(dyValue);
          const xValues = [x, x + width, x + width + dx];
          const yValues = [y, y, y + dy];
          bounds = {
            left: Math.min(...xValues),
            top: Math.min(...yValues),
            right: Math.max(...xValues),
            bottom: Math.max(...yValues),
          };
        }

        expect(bounds.left).toBeGreaterThanOrEqual(trayBounds.left);
        expect(bounds.top).toBeGreaterThanOrEqual(trayBounds.top);
        expect(bounds.right).toBeLessThanOrEqual(trayBounds.right);
        expect(bounds.bottom).toBeLessThanOrEqual(trayBounds.bottom);
      }
    }
  });

  it("constructs the mail glyph from a paper inset and balanced envelope planes", () => {
    const { container } = render(
      createElement(
        "div",
        null,
        createElement(Myles97Icon, {
          name: "mail",
          size: 20,
          variant: "color",
          title: "Menu mail",
        }),
        createElement(Myles97Icon, {
          name: "mail",
          size: 32,
          variant: "color",
          title: "Discovery mail",
        }),
      ),
    );

    for (const title of ["Menu mail", "Discovery mail"]) {
      const icon = screen.getByRole("img", { name: title });
      expect(
        icon.querySelector('[data-m98-mail-part="paper"]'),
      ).toBeInTheDocument();
      expect(
        icon.querySelector('[data-m98-mail-part="envelope"]'),
      ).toBeInTheDocument();
      expect(
        icon.querySelector('[data-m98-mail-part="fold"]'),
      ).toBeInTheDocument();
      expect(
        icon.querySelector('[data-m98-icon-plane="cast-shadow"]'),
      ).toBeInTheDocument();
      expect(
        icon.querySelector('[data-m98-mail-part="shadow"]'),
      ).not.toBeInTheDocument();
      expect(icon.querySelector("[transform]")).not.toBeInTheDocument();

      const grid = Number(icon.getAttribute("data-m98-icon-grid"));
      for (const rect of icon.querySelectorAll("rect")) {
        const x = Number(rect.getAttribute("x"));
        const y = Number(rect.getAttribute("y"));
        const right = x + Number(rect.getAttribute("width"));
        const bottom = y + Number(rect.getAttribute("height"));

        expect(x).toBeGreaterThanOrEqual(0);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(right).toBeLessThanOrEqual(grid);
        expect(bottom).toBeLessThanOrEqual(grid);
      }
    }

    expect(
      container.querySelectorAll('[data-m98-mail-part="badge"]'),
    ).toHaveLength(0);
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

  it("uses native-size color masters on live surfaces and preserves forced-color recovery", () => {
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
    expect(startMenu).toContain('name="folder" size={24} variant="color"');
    expect(startMenu).toContain(
      'name="reset-desktop" size={24} variant="color"',
    );
    expect(startMenu).not.toMatch(/size=\{20\}\s+variant="color"/);
    expect(pocket).toContain('name="open-apps" size={24} variant="color"');
    expect(pocket).toMatch(
      /name=\{iconForProgram\([^)]*\)\}\s+size=\{24\}\s+variant="color"/,
    );
    expect(pocket).not.toMatch(/size=\{20\}\s+variant="color"/);
    expect(iconStyles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*?\.myles98-icon-accent,[\s\S]*?fill:\s*CanvasText !important;/,
    );
    const forcedColorStyles = iconStyles.slice(
      iconStyles.indexOf("@media (forced-colors: active)"),
    );
    const hiddenDepthRule = forcedColorStyles.match(
      /((?:\s*\[data-m98-icon-depth="[^"]+"\]\s*,?)+)\s*\{([^}]*)\}/,
    );

    expect(hiddenDepthRule?.[1]).toContain(
      '[data-m98-icon-depth="shadow"]',
    );
    expect(hiddenDepthRule?.[1]).toContain(
      '[data-m98-icon-depth="highlight"]',
    );
    expect(hiddenDepthRule?.[2]).toMatch(/display:\s*none/);
    expect(iconStyles).toMatch(/\.myles98-icon-master\s*\{[^}]*display:\s*block;/);
    expect(iconStyles).toMatch(/\.myles98-icon-fallback\s*\{[^}]*display:\s*none;/);
    expect(forcedColorStyles).toMatch(
      /\.myles98-icon-master\s*\{[^}]*display:\s*none;/,
    );
    expect(forcedColorStyles).toMatch(
      /\.myles98-icon-fallback\s*\{[^}]*display:\s*block;/,
    );

    const { container } = render(
      createElement(Myles97Icon, {
        name: "reset-desktop",
        size: 24,
        variant: "color",
        title: "Reset Desktop color master",
      }),
    );
    const master = container.querySelector("image[data-m98-icon-master]");
    const fallback = container.querySelector(".myles98-icon-fallback");

    expect(master).toHaveClass("myles98-icon-master");
    expect(fallback).toBeInTheDocument();
    expect(forcedColorStyles).toMatch(
      /\.myles98-icon-master\s*\{[^}]*display:\s*none;/,
    );
    expect(forcedColorStyles).toMatch(
      /\.myles98-icon-fallback\s*\{[^}]*display:\s*block;/,
    );
    expect(iconStyles).not.toMatch(
      /\.myles97-desktop-shortcuts[\s\S]*?drop-shadow/,
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
