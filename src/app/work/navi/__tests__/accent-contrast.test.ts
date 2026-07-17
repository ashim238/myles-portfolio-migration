import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const styles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

function declarationBlock(selector: string) {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

describe("Navi accent contrast", () => {
  it("uses a contrast-safe token for selected and active text", () => {
    expect(declarationBlock(".nv-page")).toContain("--nv-accent-text: #f3722c");
    expect(declarationBlock(':root[data-theme="light"] .nv-page')).toContain(
      "--nv-accent-text: #9f3f0d",
    );
    expect(declarationBlock(".nv-ui-tab--selected")).toContain(
      "color: var(--nv-accent-text)",
    );
    expect(declarationBlock(".nv-ui-tab--selected")).toContain(
      "border-bottom-color: var(--nv-accent)",
    );
    expect(declarationBlock(".nv-heatmap-item--active")).toContain(
      "color: var(--nv-accent-text)",
    );
  });

  it("keeps selected text above 4.5 to 1 on the tinted active background", () => {
    function luminance(hex: string) {
      const channels = hex.match(/[\da-f]{2}/gi)!.map((value) => {
        const channel = Number.parseInt(value, 16) / 255;
        return channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4;
      });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    }

    const foreground = luminance("#9f3f0d");
    const activeBackground = luminance("#fbebe2");
    const contrast = (activeBackground + 0.05) / (foreground + 0.05);

    expect(contrast).toBeGreaterThanOrEqual(4.5);
    expect(declarationBlock(':root[data-theme="light"] .nv-page')).toContain(
      "--nv-accent-text: #9f3f0d",
    );
  });

  it("keeps Fresh Greens evidence copy on its semantic foreground token", () => {
    expect(declarationBlock(".fg-evidence-boundary p:last-child")).toContain(
      "color: var(--foreground)",
    );
    expect(declarationBlock(".fg-evidence-boundary p:last-child")).not.toContain(
      "var(--tt-accent)",
    );
  });
});
