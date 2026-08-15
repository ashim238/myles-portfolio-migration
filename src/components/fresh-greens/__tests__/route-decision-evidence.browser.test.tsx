import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";

import { DepartureReminderEvidence } from "@/components/fresh-greens/departure-reminder-evidence";
import {
  ReportRouteInfluenceEvidence,
  RouteComparisonEvidence,
} from "@/components/fresh-greens/route-decision-evidence";
import { ProjectEvidenceDisclosure } from "@/components/project-evidence-disclosure";

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/late-polish.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/myles-97-secondary.css",
  "src/app/styles/reader-mode.css",
  "src/app/styles/reader-evidence.css",
  "src/app/styles/myles-98-polish.css",
  "src/app/styles/myles-98-paper-contrast.css",
  "src/app/styles/accessibility-preferences.css",
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

function evidenceMarkup() {
  const rendered = render(
    <main className="page-shell project-page reader-mode fg-page">
      <RouteComparisonEvidence />
      <DepartureReminderEvidence />
      <ReportRouteInfluenceEvidence />
      <ProjectEvidenceDisclosure summary="View supporting system detail">
        <div data-testid="supporting-detail">Supporting detail</div>
      </ProjectEvidenceDisclosure>
    </main>,
  );
  const markup = rendered.container.innerHTML;
  rendered.unmount();
  return markup;
}

async function renderedEvidence(viewport: { width: number; height: number }) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
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
      <body>${evidenceMarkup()}</body>
    </html>`);
  return page;
}

async function documentOverflow(page: Page) {
  return page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
}

describe("Fresh Greens decision evidence geometry", () => {
  it.each([
    { width: 320, height: 844 },
    { width: 390, height: 844 },
  ])("keeps the three product sequences readable at $width px", async (viewport) => {
    const page = await renderedEvidence(viewport);

    const overflow = await documentOverflow(page);
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);

    const controls = await page
      .locator(".fg-route-proof-controls button")
      .evaluateAll((buttons) =>
        buttons.map((button) => {
          const box = button.getBoundingClientRect();
          return { width: box.width, height: box.height };
        }),
      );
    expect(controls).toHaveLength(2);
    for (const control of controls) {
      expect(control.width).toBeGreaterThanOrEqual(44);
      expect(control.height).toBeGreaterThanOrEqual(44);
    }

    const reminder = await page.locator(".fg-reminder-state-scroll").evaluate((rail) => ({
      clientWidth: rail.clientWidth,
      scrollWidth: rail.scrollWidth,
    }));
    expect(reminder.scrollWidth).toBeGreaterThan(reminder.clientWidth);

    const reminderCards = await page
      .locator(".fg-reminder-state")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const box = card.getBoundingClientRect();
          return { left: box.left, width: box.width };
        }),
      );
    expect(reminderCards).toHaveLength(3);
    expect(reminderCards[0].width).toBeGreaterThan(200);
    expect(reminderCards[1].left - reminderCards[0].left).toBeGreaterThan(
      reminderCards[0].width,
    );

    const reportCards = await page
      .locator(".fg-report-route-card")
      .evaluateAll((cards) =>
        cards.map((card) => {
          const box = card.getBoundingClientRect();
          return { top: box.top, bottom: box.bottom };
        }),
      );
    expect(reportCards).toHaveLength(2);
    expect(reportCards[1].top).toBeGreaterThan(reportCards[0].bottom);

    const disclosure = page.locator(".project-evidence-disclosure");
    expect(await disclosure.getAttribute("open")).toBeNull();
    const summaryHeight = await disclosure
      .locator("summary")
      .evaluate((summary) => summary.getBoundingClientRect().height);
    expect(summaryHeight).toBeGreaterThanOrEqual(44);

    await page.close();
  });

  it("uses a fitted three-column sequence on desktop", async () => {
    const page = await renderedEvidence({ width: 1280, height: 900 });
    const overflow = await documentOverflow(page);
    const reminder = await page.locator(".fg-reminder-state-scroll").evaluate((rail) => ({
      clientWidth: rail.clientWidth,
      scrollWidth: rail.scrollWidth,
    }));
    const reminderTops = await page
      .locator(".fg-reminder-state")
      .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));
    const reportTops = await page
      .locator(".fg-report-route-card")
      .evaluateAll((cards) => cards.map((card) => card.getBoundingClientRect().top));

    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth);
    expect(reminder.scrollWidth).toBeLessThanOrEqual(reminder.clientWidth + 1);
    expect(Math.max(...reminderTops) - Math.min(...reminderTops)).toBeLessThan(1);
    expect(Math.max(...reportTops) - Math.min(...reportTops)).toBeLessThan(1);

    await page.close();
  });
});
