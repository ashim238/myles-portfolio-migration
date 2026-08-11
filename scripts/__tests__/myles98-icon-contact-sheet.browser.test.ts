import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildIconContactSheet } from "../build-myles98-icon-contact-sheet.mjs";

declare global {
  interface Window {
    myles98ContactSheetReady?: boolean;
    myles98BlindModeStates?: Array<{ mode?: string; display: string }>;
  }
}

const outputPath = "docs/design-assets/myles98-icons/contact-sheet.html";
const screenshotPaths = {
  labeled: "/private/tmp/myles98-contact-labeled-fix2.png",
  blind: "/private/tmp/myles98-contact-blind-fix2.png",
};
const surfaces = [
  ["teal", "rgb(0, 128, 128)"],
  ["chrome", "rgb(192, 192, 192)"],
  ["white", "rgb(255, 255, 255)"],
] as const;

let root = "";
let browser: Awaited<ReturnType<typeof chromium.launch>>;

beforeAll(async () => {
  root = mkdtempSync(join(tmpdir(), "myles98-contact-sheet-browser-"));
  cpSync("docs/design-assets/myles98-icons", join(root, "docs/design-assets/myles98-icons"), { recursive: true });
  buildIconContactSheet({ root });
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterAll(async () => {
  await browser?.close();
  rmSync(root, { recursive: true, force: true });
});

function pageUrl(mode?: "blind") {
  const url = pathToFileURL(join(root, outputPath));
  if (mode) url.searchParams.set("mode", mode);
  return url.href;
}

describe("Myles 98 icon contact sheet browser rendering", () => {
  it("keeps every labeled surface well opaque and renders true 6x raster pixel blocks", async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await page.goto(pageUrl(), { waitUntil: "load" });
    await page.waitForFunction(() => document.documentElement.dataset.myles98Rasterized === "true");
    await page.screenshot({ path: screenshotPaths.labeled, fullPage: true });

    const result = await page.evaluate(() => {
      const surfaceResult = Object.fromEntries(
        ["teal", "chrome", "white"].map((surface) => [
          surface,
          [...document.querySelectorAll(`#surface-${surface} .icon-render`)].map(
            (well) => getComputedStyle(well).backgroundColor,
          ),
        ]),
      );
      const canvases = [...document.querySelectorAll<HTMLCanvasElement>('[data-render="magnified"] canvas')];
      const pixelBlocksAreUniform = canvases.every((canvas) => {
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (!context || canvas.width % 6 !== 0 || canvas.height % 6 !== 0) return false;
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        for (let y = 0; y < canvas.height; y += 6) {
          for (let x = 0; x < canvas.width; x += 6) {
            const start = (y * canvas.width + x) * 4;
            for (let row = 0; row < 6; row += 1) {
              for (let column = 0; column < 6; column += 1) {
                const index = ((y + row) * canvas.width + x + column) * 4;
                for (let channel = 0; channel < 4; channel += 1) {
                  if (pixels[index + channel] !== pixels[start + channel]) return false;
                }
              }
            }
          }
        }
        return true;
      });
      return {
        mode: document.documentElement.dataset.reviewMode,
        labeledCards: document.querySelectorAll('[data-review-mode="labeled"] [data-master]').length,
        magnifiedSvgCount: document.querySelectorAll('[data-render="magnified"] svg').length,
        magnifiedCanvasCount: canvases.length,
        pixelBlocksAreUniform,
        surfaceResult,
      };
    });

    expect(result.mode).toBe("labeled");
    expect(result.labeledCards).toBe(144);
    expect(result.magnifiedSvgCount).toBe(0);
    expect(result.magnifiedCanvasCount).toBe(288);
    expect(result.pixelBlocksAreUniform).toBe(true);
    for (const [surface, color] of surfaces) {
      expect(result.surfaceResult[surface]).toHaveLength(96);
      expect(new Set(result.surfaceResult[surface])).toEqual(new Set([color]));
    }
    await page.close();
  }, 60_000);

  it("makes blind mode visible before render while hiding every labeled card", async () => {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
    await page.addInitScript(() => {
      window.myles98BlindModeStates = [];
      new MutationObserver(() => {
        const labeled = document.querySelector<HTMLElement>('main[data-review-mode="labeled"]');
        if (labeled && window.myles98BlindModeStates?.length === 0) {
          window.myles98BlindModeStates?.push({
            mode: document.documentElement.dataset.reviewMode,
            display: getComputedStyle(labeled).display,
          });
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await page.goto(pageUrl("blind"), { waitUntil: "load" });
    await page.waitForFunction(() => document.documentElement.dataset.myles98Rasterized === "true");
    await page.screenshot({ path: screenshotPaths.blind, fullPage: true });

    const result = await page.evaluate(() => {
      const labeledSheet = document.querySelector('[data-review-mode="labeled"]');
      return {
        mode: document.documentElement.dataset.reviewMode,
        bodyVisible: getComputedStyle(document.body).display !== "none",
        blindCards: [...document.querySelectorAll('[data-review-mode="unlabeled"] [data-review-grid]')]
          .filter((card) => getComputedStyle(card).display !== "none" && card.getClientRects().length > 0).length,
        blindFamilies: [...document.querySelectorAll<HTMLElement>('[data-review-mode="unlabeled"] [data-review-family-id]')]
          .filter((family) => getComputedStyle(family).display !== "none" && family.getClientRects().length > 0)
          .map((family) => ({
            id: family.dataset.reviewFamilyId,
            grids: [...family.querySelectorAll<HTMLElement>("[data-review-grid]")].map((card) => card.dataset.reviewGrid),
          })),
        labeledCardsVisible: [...document.querySelectorAll('[data-review-mode="labeled"] [data-master]')]
          .filter((card) => getComputedStyle(card).display !== "none" && card.getClientRects().length > 0).length,
        labeledSheetVisible: labeledSheet ? getComputedStyle(labeledSheet).display !== "none" : false,
        earlyLabeledStates: window.myles98BlindModeStates,
        blindWells: Object.fromEntries(
          ["teal", "chrome", "white"].map((surface) => [
            surface,
            [...document.querySelectorAll(`[data-review-mode="unlabeled"] [data-review-surface="${surface}"] .icon-render`)]
              .map((well) => getComputedStyle(well).backgroundColor),
          ]),
        ),
      };
    });

    expect(result.mode).toBe("unlabeled");
    expect(result.bodyVisible).toBe(true);
    expect(result.blindCards).toBe(144);
    expect(result.blindFamilies).toHaveLength(48);
    expect(new Set(result.blindFamilies.map((family) => family.id))).toHaveLength(16);
    expect(result.blindFamilies.slice(0, 16).map((family) => family.id)).toEqual(
      result.blindFamilies.slice(16, 32).map((family) => family.id),
    );
    for (const family of result.blindFamilies) expect(family.grids).toEqual(["16", "24", "32"]);
    expect(result.labeledCardsVisible).toBe(0);
    expect(result.labeledSheetVisible).toBe(false);
    expect(result.earlyLabeledStates).toHaveLength(1);
    expect(result.earlyLabeledStates).toEqual([{ mode: "unlabeled", display: "none" }]);
    for (const [surface, color] of surfaces) {
      expect(result.blindWells[surface]).toHaveLength(96);
      expect(new Set(result.blindWells[surface])).toEqual(new Set([color]));
    }
    await page.close();
  }, 60_000);
});
