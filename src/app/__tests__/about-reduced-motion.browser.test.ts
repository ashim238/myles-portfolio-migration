import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/portfolio-surfaces.css",
]
  .map((path) => readFileSync(resolve(process.cwd(), path), "utf8"))
  .join("\n");

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

afterAll(async () => {
  await browser?.close();
});

describe("About reduced motion", () => {
  it("renders the About layout without an entrance animation when motion is reduced", async () => {
    const page = await browser.newPage();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setContent(`<!doctype html>
      <html>
        <head><style>${styles}</style></head>
        <body><main class="about-layout">About Myles</main></body>
      </html>`);

    const motion = await page.locator(".about-layout").evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        animationName: style.animationName,
        transform: style.transform,
      };
    });

    expect(motion).toEqual({ animationName: "none", transform: "none" });
    await page.close();
  });
});
