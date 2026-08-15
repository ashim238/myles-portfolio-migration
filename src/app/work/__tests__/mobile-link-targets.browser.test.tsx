import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import type { ReactElement } from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  usePathname: () => "/work/navi",
  useRouter: () => ({ push: () => {} }),
}));

vi.mock("next/font/google", () => ({
  Jost: () => ({ variable: "--font-navi-display" }),
  Lato: () => ({ variable: "--font-navi-ui" }),
}));

import AboutPage from "@/app/about/page";
import ResumePage from "@/app/resume/page";
import NaviPage from "@/app/work/navi/page";
import {
  BeforeAfterPhones,
  TemplateSwitcher,
} from "@/components/understandingfafsa";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/late-polish.css",
  "src/app/styles/myles-98-polish.css",
  "src/app/styles/myles-98-paper-contrast.css",
  "src/app/styles/portfolio-surfaces.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

const phoneViewports = [
  { width: 320, height: 844 },
  { width: 390, height: 844 },
  { width: 430, height: 844 },
] as const;

const targetGroups = [
  { name: "About contact", selector: "[data-fixture='about'] .about-detail dd a", count: 1 },
  { name: "Resume contact", selector: "[data-fixture='resume'] .resume-detail dd a", count: 3 },
  { name: "Resume projects", selector: "[data-fixture='resume'] .resume-role-title a", count: 3 },
  { name: "FAFSA originals", selector: "[data-fixture='fafsa'] .uf-before-after-item a, [data-fixture='fafsa'] .uf-switcher > a", count: 3 },
  { name: "Navi proof", selector: "[data-fixture='navi'] .nv-system-proof-links a", count: 2 },
  { name: "Navi closing", selector: "[data-fixture='navi'] .nv-closing-links a", count: 2 },
  { name: "Work index", selector: "[data-fixture='navi'] .project-work-jump-view-all", count: 1 },
] as const;

let browser: Browser;

beforeAll(async () => {
  vi.stubGlobal(
    "IntersectionObserver",
    class IntersectionObserverStub {
      readonly root = null;
      readonly rootMargin = "0px";
      readonly thresholds = [0];

      disconnect() {}
      observe() {}
      takeRecords() { return []; }
      unobserve() {}
    },
  );
  browser = await chromium.launch({ headless: true });
});

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  await browser?.close();
  vi.unstubAllGlobals();
});

function productionMarkup(element: ReactElement) {
  const { container, unmount } = render(element);
  const markup = container.innerHTML;
  unmount();
  return markup;
}

async function fixtureMarkup() {
  const about = productionMarkup(<AboutPage />);
  const resume = productionMarkup(<ResumePage />);
  const fafsa = productionMarkup(
    <>
      <BeforeAfterPhones />
      <TemplateSwitcher />
    </>,
  );
  const navi = productionMarkup(await NaviPage());

  return `
    <section data-fixture="about">${about}</section>
    <section data-fixture="resume">${resume}</section>
    <section class="reader-mode uf-page" data-fixture="fafsa">${fafsa}</section>
    <section data-fixture="navi">${navi}</section>
  `;
}

async function renderedPage(
  viewport: (typeof phoneViewports)[number],
  markup: string,
) {
  const page = await browser.newPage({ viewport });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.setContent(`<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>${styles}</style>
      </head>
      <body>${markup}</body>
    </html>`);
  return page;
}

type TargetRect = {
  label: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

async function targetRects(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((targets) =>
    targets.map((target) => {
      const rect = target.getBoundingClientRect();
      return {
        label: target.getAttribute("aria-label") ?? target.textContent?.trim() ?? "link",
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
      };
    }),
  ) as Promise<TargetRect[]>;
}

function overlaps(first: TargetRect, second: TargetRect) {
  return (
    Math.min(first.right, second.right) - Math.max(first.left, second.left) > 0.5 &&
    Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top) > 0.5
  );
}

describe("mobile standalone link targets", () => {
  it.each(phoneViewports)(
    "keeps production evidence and contact links at least 44px at $width px",
    async (viewport) => {
      const page = await renderedPage(viewport, await fixtureMarkup());

      for (const group of targetGroups) {
        const rects = await targetRects(page, group.selector);
        expect(rects, group.name).toHaveLength(group.count);

        for (const rect of rects) {
          expect.soft(rect.width, `${group.name}: ${rect.label} width`).toBeGreaterThanOrEqual(44);
          expect.soft(rect.height, `${group.name}: ${rect.label} height`).toBeGreaterThanOrEqual(44);
          expect.soft(rect.left, `${group.name}: ${rect.label} left edge`).toBeGreaterThanOrEqual(0);
          expect.soft(rect.right, `${group.name}: ${rect.label} right edge`).toBeLessThanOrEqual(viewport.width + 0.5);
        }

        for (let index = 0; index < rects.length; index += 1) {
          for (let peer = index + 1; peer < rects.length; peer += 1) {
            expect.soft(
              overlaps(rects[index], rects[peer]),
              `${group.name}: ${rects[index].label} overlaps ${rects[peer].label}`,
            ).toBe(false);
          }
        }
      }

      const scaledWorkIndexFrames = await page
        .locator("[data-fixture='navi'] .project-work-jump-view-all")
        .evaluate((target) =>
          target.getAnimations().flatMap((animation) => {
            const effect = animation.effect;
            if (!(effect instanceof KeyframeEffect)) return [];
            return effect
              .getKeyframes()
              .map((frame) => String(frame.transform ?? ""))
              .filter((transform) => transform.includes("scale"));
          }),
        );
      expect(scaledWorkIndexFrames).toEqual([]);

      await page.close();
    },
  );
});
