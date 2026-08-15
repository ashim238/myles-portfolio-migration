import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { PortfolioEndcap } from "@/components/portfolio-endcap";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/myles-98-polish.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  await browser?.close();
});

function endcapMarkup() {
  const { container, unmount } = render(
    <div className="myles98-system-document">
      <PortfolioEndcap context="resume" />
    </div>,
  );
  const markup = container.innerHTML;
  unmount();
  return markup;
}

describe("PortfolioEndcap rendered spacing", () => {
  it.each([
    { width: 768, height: 720 },
    { width: 1280, height: 900 },
  ])("keeps its label and links clear of the frame at $width px", async (viewport) => {
    const page = await browser.newPage({ viewport });
    await page.setContent(`<!doctype html>
      <html data-theme="light">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            *, *::before, *::after { box-sizing: border-box; }
            html, body { margin: 0; }
            .myles98-system-document { padding: 24px; }
            ${styles}
          </style>
        </head>
        <body>${endcapMarkup()}</body>
      </html>`);

    const geometry = await page.locator(".portfolio-endcap").evaluate((panel) => {
      const panelBox = panel.getBoundingClientRect();
      const labelBox = panel
        .querySelector<HTMLElement>(".portfolio-endcap-label")!
        .getBoundingClientRect();
      const linksBox = panel
        .querySelector<HTMLElement>(".portfolio-endcap-links")!
        .getBoundingClientRect();

      return {
        leftInset: labelBox.left - panelBox.left,
        rightInset: panelBox.right - linksBox.right,
        labelCenterOffset:
          labelBox.top + labelBox.height / 2 -
          (panelBox.top + panelBox.height / 2),
        linksCenterOffset:
          linksBox.top + linksBox.height / 2 -
          (panelBox.top + panelBox.height / 2),
        clientWidth: panel.clientWidth,
        scrollWidth: panel.scrollWidth,
      };
    });

    expect(geometry.leftInset).toBeGreaterThanOrEqual(14);
    expect(geometry.rightInset).toBeGreaterThanOrEqual(14);
    expect(Math.abs(geometry.labelCenterOffset)).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.linksCenterOffset)).toBeLessThanOrEqual(1);
    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);

    await page.close();
  });
});
