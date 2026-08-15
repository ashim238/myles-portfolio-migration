import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import AboutPage from "@/app/about/page";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/late-polish.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/myles-97-secondary.css",
  "src/app/styles/reader-mode.css",
  "src/app/styles/reader-evidence.css",
  "src/app/styles/myles-97-pocket.css",
  "src/app/styles/myles-98-polish.css",
  "src/app/styles/myles-98-paper-contrast.css",
  "src/app/styles/accessibility-preferences.css",
  "src/app/styles/portfolio-surfaces.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

const phoneViewports = [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
] as const;

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

function aboutMarkup() {
  const { container, unmount } = render(<AboutPage />);
  const markup = container.innerHTML;
  unmount();
  return markup;
}

async function renderedAbout(
  viewport: { width: number; height: number },
) {
  const page = await browser.newPage({ viewport });
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
      <body>${aboutMarkup()}</body>
    </html>`);
  return page;
}

async function verticalGap(page: Page, upper: string, lower: string) {
  const upperBox = await page.locator(upper).boundingBox();
  const lowerBox = await page.locator(lower).boundingBox();

  if (!upperBox || !lowerBox) {
    throw new Error(`Missing geometry for ${upper} or ${lower}`);
  }

  return lowerBox.y - (upperBox.y + upperBox.height);
}

describe("About facts panel responsive geometry", () => {
  it.each(phoneViewports)(
    "uses a compact, controlled facts rhythm at $width px",
    async (viewport) => {
      const page = await renderedAbout(viewport);

      expect.soft(
        await verticalGap(page, ".about-primary", ".about-aside"),
        "space between the main copy and facts panel",
      ).toBeLessThanOrEqual(32);

      const rowStyles = await page.locator(".about-detail").evaluateAll((rows) =>
        rows.map((row) => {
          const style = getComputedStyle(row);
          const value = row.querySelector("dd");
          return {
            paddingTop: Number.parseFloat(style.paddingTop),
            paddingBottom: Number.parseFloat(style.paddingBottom),
            valueFontSize: value
              ? Number.parseFloat(getComputedStyle(value).fontSize)
              : 0,
          };
        }),
      );

      for (const row of rowStyles) {
        expect.soft(row.paddingTop, "facts row top padding").toBeLessThanOrEqual(10);
        expect.soft(row.paddingBottom, "facts row bottom padding").toBeLessThanOrEqual(10);
        expect.soft(row.valueFontSize, "facts value font size").toBeGreaterThanOrEqual(15);
      }

      const boundaryInsets = await page.evaluate(() => {
        const panel = document.querySelector<HTMLElement>(".about-details");
        const firstLabel = document.querySelector<HTMLElement>(
          ".about-detail:first-child dt",
        );
        const contactLink = document.querySelector<HTMLElement>(
          '.about-detail:last-child a[href^="mailto:"]',
        );

        if (!panel || !firstLabel || !contactLink) {
          throw new Error("Missing About facts boundary geometry");
        }

        const panelBox = panel.getBoundingClientRect();
        const firstLabelBox = firstLabel.getBoundingClientRect();
        const contactLinkBox = contactLink.getBoundingClientRect();

        return {
          top: firstLabelBox.top - panelBox.top,
          bottom: panelBox.bottom - contactLinkBox.bottom,
        };
      });

      expect.soft(
        Math.abs(boundaryInsets.top - boundaryInsets.bottom),
        "matching top and bottom facts-panel insets",
      ).toBeLessThanOrEqual(1);

      const educationLines = await page
        .locator(".about-detail-education-line")
        .evaluateAll((lines) =>
          lines.map((line) => {
            const rect = line.getBoundingClientRect();
            return { text: line.textContent?.trim(), top: rect.top };
          }),
        );

      expect(educationLines.map(({ text }) => text)).toEqual([
        "MFA · Design and Technology",
        "Parsons · 2026",
      ]);
      expect(educationLines[1].top - educationLines[0].top).toBeGreaterThan(10);

      const tools = await page.locator(".about-tools > li").evaluateAll((items) =>
        items.map((item) => {
          const rect = item.getBoundingClientRect();
          return {
            text: item.textContent?.trim(),
            left: rect.left,
            top: rect.top,
          };
        }),
      );

      expect(tools.map(({ text }) => text)).toEqual([
        "Figma",
        "Adobe Suite",
        "React Native",
        "TypeScript",
      ]);
      expect(Math.abs(tools[0].top - tools[1].top)).toBeLessThan(1);
      expect(Math.abs(tools[2].top - tools[3].top)).toBeLessThan(1);
      expect(tools[2].top - tools[0].top).toBeGreaterThan(10);
      expect(Math.abs(tools[0].left - tools[2].left)).toBeLessThan(1);
      expect(Math.abs(tools[1].left - tools[3].left)).toBeLessThan(1);

      const overflow = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

      await page.close();
    },
  );

  it("preserves the desktop two-column facts treatment", async () => {
    const page = await renderedAbout({ width: 1280, height: 900 });
    const primary = await page.locator(".about-primary").boundingBox();
    const aside = await page.locator(".about-aside").boundingBox();
    const detailRowPadding = await page
      .locator(".about-detail")
      .nth(1)
      .evaluate((row) => Number.parseFloat(getComputedStyle(row).paddingTop));

    expect(primary).not.toBeNull();
    expect(aside).not.toBeNull();
    expect(aside!.x).toBeGreaterThan(primary!.x + primary!.width);
    expect(Math.abs(aside!.y - primary!.y)).toBeLessThan(1);
    expect(detailRowPadding).toBe(14);

    await page.close();
  });
});
