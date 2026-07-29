import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ArchitectureDiagram } from "@/components/fresh-greens";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

describe("ArchitectureDiagram", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes the horizontal scroller as a named keyboard-focusable region", () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ArchitectureDiagram />);

    const scroller = screen.getByRole("region", {
      name: "Fresh Greens system architecture diagram",
    });

    expect(scroller).toHaveClass("fg-arch-scroll");
    expect(scroller).toHaveAttribute("tabindex", "0");

    const sourceLabels = scroller.querySelector(".fg-arch-sources");
    expect(sourceLabels).toHaveAttribute("font-size", "12");
    for (const subtitle of sourceLabels?.querySelectorAll(
      'text[opacity="0.62"]',
    ) ?? []) {
      expect(subtitle).toHaveAttribute("font-size", "11");
    }
  });

  it("draws a visible keyboard focus treatment around the scroller", () => {
    expect(styles).toMatch(
      /\.fg-arch-scroll:focus-visible\s*\{[^}]*outline: 2px solid var\(--focus-ring\);[^}]*outline-offset: 3px;/,
    );
    expect(styles).toMatch(
      /\.fg-arch-svg\s*\{[^}]*min-width: 0;/,
    );
  });
});
