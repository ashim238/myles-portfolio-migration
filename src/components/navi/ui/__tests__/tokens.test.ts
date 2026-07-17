import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";
import {
  NAVI_PRIMITIVES,
  NAVI_RADII,
  NAVI_SEMANTIC,
  NAVI_SPACING,
  NAVI_TYPE,
  contrastRatio,
} from "@/lib/navi/tokens";

describe("navi tokens", () => {
  it("exposes brand primitives", () => {
    expect(NAVI_PRIMITIVES.darwin).toBe("#F3722C");
    expect(NAVI_PRIMITIVES.gumball).toBe("#3A86FF");
    expect(NAVI_PRIMITIVES.robinson).toBe("#4A414D");
  });

  it("action color passes WCAG AA on white (>= 4.5)", () => {
    expect(contrastRatio(NAVI_SEMANTIC.action, "#FFFFFF")).toBeGreaterThanOrEqual(4.5);
  });

  it("body text passes WCAG AA on surface (>= 4.5)", () => {
    expect(contrastRatio(NAVI_SEMANTIC.textDefault, NAVI_SEMANTIC.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it("focus ring meets the 3:1 non-text minimum on white", () => {
    expect(contrastRatio(NAVI_SEMANTIC.focus, "#FFFFFF")).toBeGreaterThanOrEqual(3);
  });

  it("documents the focus token as the color the product's focus ring actually renders", () => {
    // The system page renders NAVI_SEMANTIC as live swatches and claims a single
    // source of truth, so the documented focus token must equal the --nv-focus
    // value the product paints on every focus-visible ring.
    const css = readFileSync(
      resolve(process.cwd(), "src/app/styles/navi-minisite.css"),
      "utf8",
    );
    const match = css.match(/--nv-focus:\s*(#[0-9a-fA-F]{6})/);
    expect(
      match,
      "--nv-focus must be defined in navi-minisite.css",
    ).not.toBeNull();
    expect(NAVI_SEMANTIC.focus.toLowerCase()).toBe(match![1].toLowerCase());
  });

  it("spacing scale is 4px-based", () => {
    expect(NAVI_SPACING.find((s) => s.token === "md")?.px).toBe(16);
  });

  it("type ramp names display + body families", () => {
    expect(NAVI_TYPE.display.family).toContain("Jost");
    expect(NAVI_TYPE.body.family).toContain("Lato");
  });

  it("radii are string pixel values", () => {
    expect(NAVI_RADII.pill).toBe("999px");
  });

  it("footer email (action-strong on muted surface) passes AA", () => {
    expect(contrastRatio(NAVI_SEMANTIC.actionStrong, NAVI_SEMANTIC.surfaceMuted)).toBeGreaterThanOrEqual(4.5);
  });
});
