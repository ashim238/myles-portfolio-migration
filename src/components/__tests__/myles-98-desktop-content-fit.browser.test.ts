import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const desktopStyles = readFileSync(
  resolve(__dirname, "../../app/styles/myles-97.css"),
  "utf8",
);

const laptopViewports = [
  { width: 1280, height: 800 },
  { width: 1117, height: 837 },
] as const;

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterAll(async () => {
  await browser?.close();
});

function documentWith(content: string) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { margin: 0; }
          ${desktopStyles}
        </style>
      </head>
      <body>
        <main class="myles97-shell">
          <div class="myles97-desktop">${content}</div>
        </main>
      </body>
    </html>`;
}

function titlebar(title: string) {
  return `<header class="myles97-titlebar">
    <span class="myles97-titlebar-icon" aria-hidden="true"></span>
    <strong class="myles97-window-title">${title}</strong>
    <div class="myles97-window-controls" aria-hidden="true">
      <button class="myles97-hit-target" type="button">
        <span class="myles97-window-control">-</span>
      </button>
      <button class="myles97-hit-target" type="button">
        <span class="myles97-window-control">x</span>
      </button>
    </div>
  </header>`;
}

const projectCards = [
  ["Fresh Greens.exe", "Route-planning software", "Built"],
  ["FAFSA Mail.app", "Modular mail composer", "Observed"],
  ["Navi Places.exe", "Place-discovery application", "Built"],
  ["TikTok Catalog.studio", "Catalog-template studio", "Shipped"],
]
  .map(
    ([name, type, evidence]) => `<li class="myles97-program-card">
      <button class="myles97-program-launch" type="button">
        <span class="myles97-program-cover" aria-hidden="true"></span>
        <span class="myles97-program-card-copy">
          <strong>${name}</strong>
          <span>${type}</span>
          <span class="myles97-evidence-badge">${evidence}</span>
        </span>
      </button>
      <a class="myles97-case-study-link" href="#${name}">
        Open case study <span aria-hidden="true">↗</span>
      </a>
    </li>`,
  )
  .join("");

const openingWindows = `
  <section
    class="myles97-window"
    data-m97-default-position="true"
    data-m97-program-window="selected-work"
    style="left:136px;top:112px;width:744px;height:536px"
  >
    ${titlebar("Selected Work")}
    <div class="myles97-window-content">
      <div class="myles97-explorer">
        <div class="myles97-explorer-toolbar">
          <span>Portfolio Programs</span><span>4 items</span>
        </div>
        <ul class="myles97-selected-work-list">${projectCards}</ul>
      </div>
    </div>
    <div class="myles97-window-status">4 portfolio programs</div>
  </section>
  <section
    class="myles97-window"
    data-m97-default-position="true"
    data-m97-program-window="welcome"
    style="left:896px;top:160px;width:352px;height:312px"
  >
    ${titlebar("Welcome to Myles 98")}
    <div class="myles97-window-content">
      <div class="myles97-welcome">
        <div class="myles97-welcome-mark" aria-hidden="true"></div>
        <div class="myles97-welcome-copy">
          <p class="myles97-eyebrow">Welcome to Myles 98</p>
          <h1>Myles Ashitey</h1>
          <p class="myles97-welcome-statement">Design, code, and everything in between.</p>
          <p class="myles97-welcome-context">Previously TikTok and UMG. Latest project: Fresh Greens.</p>
          <button class="myles97-primary-button" type="button">Selected Work</button>
        </div>
      </div>
    </div>
  </section>`;

async function elementFit(page: Page, selector: string, childSelector: string) {
  return page.locator(selector).evaluate(
    (element, child) => {
      const childElement = element.querySelector<HTMLElement>(child);
      if (!childElement) throw new Error(`Missing ${child}`);
      const elementRect = element.getBoundingClientRect();
      const childRect = childElement.getBoundingClientRect();
      return {
        noInternalScroll: element.scrollHeight === element.clientHeight,
        childFullyVisible:
          childRect.top >= elementRect.top && childRect.bottom <= elementRect.bottom,
      };
    },
    childSelector,
  );
}

describe("Myles 98 desktop content fit", () => {
  it.each(laptopViewports)(
    "keeps all four Selected Work actions and the complete Welcome action visible at $width×$height",
    async (viewport) => {
      const page = await browser.newPage({ viewport });
      await page.setContent(documentWith(openingWindows), { waitUntil: "load" });

      const selectedContent = page.locator(
        '[data-m97-program-window="selected-work"] .myles97-window-content',
      );
      const selectedRect = await selectedContent.evaluate((element) => {
        const contentRect = element.getBoundingClientRect();
        const links = Array.from(
          element.querySelectorAll<HTMLElement>(".myles97-case-study-link"),
        );
        return {
          noInternalScroll: element.scrollHeight === element.clientHeight,
          visibleActions: links.filter((link) => {
            const linkRect = link.getBoundingClientRect();
            return linkRect.top >= contentRect.top && linkRect.bottom <= contentRect.bottom;
          }).length,
        };
      });
      const welcomeFit = await elementFit(
        page,
        '[data-m97-program-window="welcome"] .myles97-window-content',
        ".myles97-primary-button",
      );

      expect(selectedRect).toEqual({ noInternalScroll: true, visibleActions: 4 });
      expect(welcomeFit).toEqual({
        noInternalScroll: true,
        childFullyVisible: true,
      });
      await page.close();
    },
    60_000,
  );

  it("keeps a project-preview case-study action visible without internal scroll", async () => {
    const page = await browser.newPage({ viewport: laptopViewports[0] });
    const projectWindow = `<section
      class="myles97-window"
      data-m97-program-window="fresh-greens"
      style="left:232px;top:152px;width:720px;height:520px"
    >
      ${titlebar("Fresh Greens.exe")}
      <div class="myles97-window-content">
        <div class="myles97-project-preview">
          <div class="myles97-project-preview-cover">
            <img
              alt=""
              width="960"
              height="540"
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='540'/%3E"
            />
          </div>
          <div class="myles97-project-preview-copy">
            <p class="myles97-eyebrow">Route-planning software</p>
            <h2>Fresh Greens</h2>
            <p>A route-planning product for finding fresh food.</p>
            <p><span class="myles97-evidence-badge">Built</span></p>
            <a class="myles97-primary-button" href="#fresh-greens">
              Open Fresh Greens case study
            </a>
          </div>
        </div>
      </div>
      <div class="myles97-window-status">Built</div>
    </section>`;
    await page.setContent(documentWith(projectWindow), { waitUntil: "load" });

    const projectFit = await elementFit(
      page,
      '[data-m97-program-window="fresh-greens"] .myles97-window-content',
      ".myles97-primary-button",
    );

    expect(projectFit).toEqual({
      noInternalScroll: true,
      childFullyVisible: true,
    });
    await page.close();
  }, 60_000);
});
