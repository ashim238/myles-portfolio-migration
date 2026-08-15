import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { ArchitectureDiagram } from "@/components/fresh-greens";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/portfolio-surfaces.css",
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

async function renderedArchitecture(viewport: { width: number; height: number }) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.setContent(`<!doctype html>
    <html data-theme="light">
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
    { width: 390, height: 844 },
    { width: 820, height: 1180 },
    { width: 1050, height: 900 },
  ])("stays readable and genuinely pannable at $width px", async (viewport) => {
    const page = await renderedArchitecture(viewport);
    const geometry = await page.locator(".fg-arch-scroll").evaluate((scroller) => {
      const svg = scroller.querySelector<SVGSVGElement>(".fg-arch-svg");
      const labels = Array.from(
        scroller.querySelectorAll<SVGTextElement>(".fg-arch-sources text"),
      );
      if (!svg || labels.length === 0) throw new Error("Missing architecture labels");
      const smallestLabelHeight = Math.min(
        ...labels.map((label) => label.getBoundingClientRect().height),
      );
      const before = scroller.scrollLeft;
      scroller.scrollLeft = 120;
      const after = scroller.scrollLeft;
      scroller.scrollLeft = scroller.scrollWidth;

      return {
        clientWidth: scroller.clientWidth,
        scrollWidth: scroller.scrollWidth,
        svgWidth: svg.getBoundingClientRect().width,
        smallestLabelHeight,
        before,
        after,
        maximum: scroller.scrollLeft,
        maskImage: getComputedStyle(scroller).maskImage,
        webkitMaskImage: getComputedStyle(scroller).webkitMaskImage,
      };
    });

    expect(geometry.scrollWidth - geometry.clientWidth).toBeGreaterThan(200);
    expect(geometry.svgWidth).toBeGreaterThanOrEqual(1250);
    expect(geometry.smallestLabelHeight).toBeGreaterThanOrEqual(8.5);
    expect(geometry.before).toBe(0);
    expect(geometry.after).toBeGreaterThan(0);
    expect(geometry.maximum).toBeGreaterThan(geometry.after);
    expect(geometry.maskImage).toBe("none");
    expect(geometry.webkitMaskImage).toBe("none");
    await page.close();
  });

  it("keeps the final source subtitle inside the desktop SVG", async () => {
    const page = await renderedArchitecture({ width: 1280, height: 900 });
    const geometry = await page.locator(".fg-arch-svg").evaluate((svg) => {
      const subtitle = Array.from(svg.querySelectorAll("text")).find((text) =>
        text.textContent?.includes("local-first"),
      );
      if (!subtitle) throw new Error("Missing community-report subtitle");
      const svgBox = svg.getBoundingClientRect();
      const subtitleBox = subtitle.getBoundingClientRect();
      return { svgRight: svgBox.right, subtitleRight: subtitleBox.right };
    });

    expect(geometry.subtitleRight).toBeLessThanOrEqual(geometry.svgRight - 12);
    await page.close();
  });
});
