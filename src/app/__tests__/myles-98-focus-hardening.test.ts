import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const desktopStyles = readFileSync(
  resolve(__dirname, "../styles/myles-97.css"),
  "utf8",
);
const pocketStyles = readFileSync(
  resolve(__dirname, "../styles/myles-97-pocket.css"),
  "utf8",
);

function channel(hex: string, offset: number) {
  const value = Number.parseInt(hex.slice(offset, offset + 2), 16) / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string) {
  return 0.2126 * channel(hex, 1) + 0.7152 * channel(hex, 3) + 0.0722 * channel(hex, 5);
}

function contrastRatio(first: string, second: string) {
  const lighter = Math.max(luminance(first), luminance(second));
  const darker = Math.min(luminance(first), luminance(second));
  return (lighter + 0.05) / (darker + 0.05);
}

describe("Myles 98 focus hardening", () => {
  it("uses contrasting dark and white focus rings for their actual surfaces", () => {
    expect(contrastRatio("#111111", "#c7c7c7")).toBeGreaterThanOrEqual(3);
    expect(contrastRatio("#ffffff", "#c7c7c7")).toBeLessThan(3);
    expect(contrastRatio("#111111", "#f5f3ea")).toBeGreaterThanOrEqual(3);
    expect(contrastRatio("#111111", "#087f86")).toBeGreaterThanOrEqual(3);
    expect(contrastRatio("#ffffff", "#263cb8")).toBeGreaterThanOrEqual(3);

    const lightRingSelector =
      desktopStyles
        .match(/([^{}]+)\{\s*outline-color: var\(--m97-focus-light\);\s*\}/)?.[1]
        .replace(/\s+/g, " ")
        .trim() ?? "";

    expect(desktopStyles).toMatch(
      /\.myles97-window :is\(button, a, input, select, textarea\):focus-visible,[\s\S]*?outline: 3px solid var\(--m97-focus-dark\);/,
    );
    expect(lightRingSelector).toBe(
      '.myles97-window[data-focused="true"] .myles97-titlebar .myles97-hit-target:focus-visible, .myles97-start-menu-items :is(button, a):focus-visible',
    );
    expect(lightRingSelector).not.toContain(".myles97-task-button");
    expect(pocketStyles).toMatch(
      /\.pocket97-dock button:focus-visible,[\s\S]*?outline: 3px solid var\(--m97-focus-dark\);/,
    );
    expect(pocketStyles).toMatch(
      /\.pocket97-sheet :is\(button, a\):focus-visible,[\s\S]*?outline-color: var\(--m97-focus-light\);/,
    );
  });

  it("reserves transform promotion for an active pointer drag", () => {
    const idleWindow = desktopStyles.match(/\.myles97-window\s*\{([^}]*)\}/)?.[1] ?? "";
    const draggedWindow =
      desktopStyles.match(/\.myles97-window\[data-dragging="true"\]\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(idleWindow).not.toContain("will-change");
    expect(draggedWindow).toContain("will-change: transform");
  });

  it("retains system focus colors in forced-colors mode", () => {
    expect(desktopStyles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*?:focus-visible[\s\S]*?outline-color: Highlight;/,
    );
    expect(pocketStyles).toMatch(
      /@media \(forced-colors: active\)[\s\S]*?\.pocket97-sheet :is\(button, a\):focus-visible,[\s\S]*?outline-color: Highlight;/,
    );
  });
});
