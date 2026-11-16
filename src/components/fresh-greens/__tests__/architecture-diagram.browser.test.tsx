import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { ArchitectureDiagram } from "@/components/fresh-greens";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/portfolio-surfaces.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/myles-98-paper-contrast.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  await browser?.close();
}, 60_000);

function architectureMarkup() {
  const rendered = render(<ArchitectureDiagram />);
  const markup = rendered.container.innerHTML;
  rendered.unmount();
  return markup;
}

async function renderedArchitecture(
  viewport: { width: number; height: number },
  theme = "light",
) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.setContent(`<!doctype html>
    <html data-theme="${theme}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          :root { --font-mono: ui-monospace, "SFMono-Regular", Menlo, monospace; }
          html, body { margin: 0; }
          ${styles}
        </style>
      </head>
      <body>
        <main class="page-shell project-page reader-mode fg-page">
          ${architectureMarkup()}
        </main>
      </body>
    </html>`);
  return page;
}

describe("Fresh Greens architecture diagram geometry", () => {
  it.each([
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1050, height: 900 },
    { width: 1280, height: 900 },
  ])("keeps all eight sources readable without panning at $width px", async (viewport) => {
    const page = await renderedArchitecture(viewport);
    try {
      const geometry = await page.locator(".fg-route-scoring").evaluate((diagram) => {
        const diagramBox = diagram.getBoundingClientRect();
        const labels = Array.from(diagram.querySelectorAll("dt, dd"));
        const steps = Array.from(diagram.querySelectorAll(".fg-route-scoring-step"));
        return {
          scrollWidth: diagram.scrollWidth,
          clientWidth: diagram.clientWidth,
          right: diagramBox.right,
          labelsFit: labels.every((label) => {
            const box = label.getBoundingClientRect();
            return box.width > 0 && box.left >= diagramBox.left && box.right <= diagramBox.right;
          }),
          smallestLabelSize: Math.min(
            ...labels.map((label) => parseFloat(getComputedStyle(label).fontSize)),
          ),
          stepTops: steps.map((step) => step.getBoundingClientRect().top),
        };
      });

      expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
      expect(geometry.right).toBeLessThanOrEqual(viewport.width);
      expect(geometry.labelsFit).toBe(true);
      expect(geometry.smallestLabelSize).toBeGreaterThanOrEqual(15);
      expect(geometry.stepTops).toHaveLength(4);
      expect(geometry.stepTops).toEqual([...geometry.stepTops].sort((a, b) => a - b));
    } finally {
      await page.close();
    }
  });

  it("uses paper text colors when the global theme is dark", async () => {
    const page = await renderedArchitecture({ width: 390, height: 844 }, "dark");
    try {
      const colors = await page.locator(".fg-route-scoring").evaluate((diagram) =>
        Array.from(diagram.querySelectorAll("h3, dd, figcaption"), (label) => ({
          tag: label.tagName,
          color: getComputedStyle(label).color,
        })),
      );
      expect(colors).toHaveLength(13);
      for (const label of colors) {
        expect(label.color).toBe(label.tag === "H3" ? "rgb(23, 23, 23)" : "rgb(91, 89, 83)");
      }
    } finally {
      await page.close();
    }
  });
});
