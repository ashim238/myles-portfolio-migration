import { readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import { chromium, type Browser, type Route } from "playwright";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import TikTokPage from "@/app/work/tiktok/page";

vi.mock("next/image", async () =>
  import("@/components/__tests__/fixtures/task-5-image"),
);
vi.mock("next/link", async () =>
  import("@/components/__tests__/fixtures/task-5-link"),
);
vi.mock("@/components/transition-link", () => ({
  TransitionLink: ({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

const testDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = resolve(testDirectory, "../../../public");
const styles = [
  "../../app/styles/base.css",
  "../../app/styles/late-polish.css",
  "../../app/styles/myles-97.css",
  "../../app/styles/myles-97-secondary.css",
  "../../app/styles/reader-mode.css",
  "../../app/styles/reader-evidence.css",
  "../../app/styles/myles-97-pocket.css",
  "../../app/styles/myles-98-polish.css",
  "../../app/styles/myles-98-paper-contrast.css",
  "../../app/styles/portfolio-surfaces.css",
]
  .map((path) => readFileSync(resolve(testDirectory, path), "utf8"))
  .join("\n");
const mobileViewports = [
  { width: 430, height: 932 },
  { width: 390, height: 844 },
  { width: 320, height: 568 },
] as const;
const imageContentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let browser: Browser;
let markup: string;

beforeAll(async () => {
  markup = renderToString(await TikTokPage());
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterAll(async () => {
  await browser?.close();
});

async function fulfillAsset(route: Route) {
  const requestUrl = new URL(route.request().url());
  const requestedAsset = requestUrl.pathname;
  if (!requestedAsset.startsWith("/")) {
    await route.abort();
    return;
  }

  try {
    const assetPath = resolve(publicDirectory, `.${requestedAsset}`);
    await route.fulfill({
      body: readFileSync(assetPath),
      contentType:
        imageContentTypes[extname(assetPath).toLowerCase()] ??
        "application/octet-stream",
    });
  } catch {
    await route.abort();
  }
}

function documentWith(content: string) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="http://portfolio.test/work/tiktok" />
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; }
          ${styles}
        </style>
      </head>
      <body>${content}</body>
    </html>`;
}

describe("Task 6 TikTok mobile hero polish", () => {
  it.each(mobileViewports)(
    "keeps the production fallback art clear of hero copy at $width×$height",
    async (viewport) => {
      const page = await browser.newPage({
        viewport,
        reducedMotion: "reduce",
      });
      await page.route("http://portfolio.test/**", fulfillAsset);
      await page.setContent(documentWith(markup), { waitUntil: "load" });

      const geometry = await page.evaluate(() => {
        const poster = document.querySelector<HTMLElement>(
          "header.tt-cover--preview .tt-cover-poster",
        )!;
        const title = document.querySelector<HTMLElement>(
          "header.tt-cover--preview .tt-title",
        )!;
        const lede = document.querySelector<HTMLElement>(
          "header.tt-cover--preview .tt-lede",
        )!;
        const posterRect = poster.getBoundingClientRect();
        const titleRect = title.getBoundingClientRect();
        const ledeRect = lede.getBoundingClientRect();
        const overlaps = (a: DOMRect, b: DOMRect) =>
          a.left < b.right &&
          a.right > b.left &&
          a.top < b.bottom &&
          a.bottom > b.top;

        return {
          poster: {
            left: posterRect.left,
            top: posterRect.top,
            right: posterRect.right,
            bottom: posterRect.bottom,
          },
          title: {
            left: titleRect.left,
            top: titleRect.top,
            right: titleRect.right,
            bottom: titleRect.bottom,
          },
          lede: {
            left: ledeRect.left,
            top: ledeRect.top,
            right: ledeRect.right,
            bottom: ledeRect.bottom,
          },
          overlapsTitle: overlaps(posterRect, titleRect),
          overlapsLede: overlaps(posterRect, ledeRect),
        };
      });

      expect(geometry, JSON.stringify(geometry, null, 2)).toMatchObject({
        overlapsTitle: false,
        overlapsLede: false,
      });
      await page.close();
    },
    60_000,
  );
});
