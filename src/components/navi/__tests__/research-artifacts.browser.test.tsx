import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { NaviResearchArtifacts } from "@/components/navi/research-artifacts";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/reader-mode.css",
  "src/app/styles/myles-98-paper-contrast.css",
  "src/app/styles/portfolio-surfaces.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterEach(() => cleanup());

afterAll(async () => {
  await browser?.close();
}, 60_000);

describe("Navi research disclosure", () => {
  it("opens on the research board without losing dark-surface contrast", async () => {
    const rendered = render(<NaviResearchArtifacts />);
    const markup = rendered.container.innerHTML;
    rendered.unmount();

    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.setContent(`<!doctype html>
      <html data-theme="light">
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <style>
            *, *::before, *::after { box-sizing: border-box; }
            html, body { margin: 0; }
            ${styles}
          </style>
        </head>
        <body><main class="page-shell project-page reader-mode nv-page">${markup}</main></body>
      </html>`);

    const disclosure = page.locator(".nv-research-board .project-evidence-disclosure");
    await disclosure.locator("summary").click();
    const geometry = await disclosure.evaluate((details) => {
      const caption = details.querySelector("figcaption");
      const summary = details.querySelector("summary");
      const style = getComputedStyle(details);
      return {
        open: details.hasAttribute("open"),
        background: style.backgroundColor,
        color: style.color,
        captionColor: caption ? getComputedStyle(caption).color : null,
        summaryHeight: summary?.getBoundingClientRect().height ?? 0,
        overflow:
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      };
    });

    expect(geometry).toMatchObject({
      open: true,
      background: "rgb(10, 10, 10)",
      color: "rgb(244, 244, 244)",
      captionColor: "rgb(244, 244, 244)",
      overflow: 0,
    });
    expect(geometry.summaryHeight).toBeGreaterThanOrEqual(56);

    await page.close();
  });
});
