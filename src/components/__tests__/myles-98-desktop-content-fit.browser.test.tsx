import { cleanup, fireEvent, render, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { useReducer } from "react";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { WorkstationDesktop } from "@/components/myles-97/workstation-desktop";
import { getPublishedProjects } from "@/lib/content";
import {
  buildProgramRegistry,
  type ProgramDefinition,
} from "@/lib/myles-97/programs";
import {
  createInitialWorkstationState,
  workstationReducer,
} from "@/lib/myles-97/state";

const desktopStyles = readFileSync(
  resolve(__dirname, "../../app/styles/myles-97.css"),
  "utf8",
);
const nowPlayingStyles = readFileSync(
  resolve(__dirname, "../../app/styles/myles-97-now-playing.css"),
  "utf8",
);
const archiveStyles = ["workstation-documents.css", "archive-layout.css", "project-artwork.css"]
  .map((file) => readFileSync(resolve(__dirname, "../../app/styles", file), "utf8"))
  .join("\n");
const publicDirectory = resolve(__dirname, "../../../public");
const laptopViewports = [
  { width: 1440, height: 900 },
  { width: 1280, height: 800 },
  { width: 1117, height: 837 },
  { width: 1025, height: 768 },
] as const;
const imageContentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let browser: Browser;
let programs: ProgramDefinition[];

beforeAll(async () => {
  programs = buildProgramRegistry(await getPublishedProjects());
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  await browser?.close();
});

function DesktopHarness() {
  const [state, dispatch] = useReducer(
    workstationReducer,
    undefined,
    createInitialWorkstationState,
  );

  return (
    <WorkstationDesktop
      programs={programs}
      looseParts={[]}
      state={state}
      dispatch={dispatch}
    />
  );
}

function documentWith(desktopMarkup: string) {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <base href="http://portfolio.test/" />
        <style>
          * { box-sizing: border-box; }
          html, body { margin: 0; }
          ${desktopStyles}
          ${nowPlayingStyles}
          ${archiveStyles}
        </style>
      </head>
      <body>
        <main class="myles97-shell">${desktopMarkup}</main>
      </body>
    </html>`;
}

function renderDesktopMarkup() {
  const rendered = render(<DesktopHarness />);
  fireEvent.click(within(rendered.container).getByRole("radio", { name: "Thumbnails" }));
  const markup = rendered.container.innerHTML;
  rendered.unmount();
  return markup;
}

async function browserPage(viewport: { width: number; height: number }, markup: string) {
  const page = await browser.newPage({ viewport });
  await page.route("http://portfolio.test/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (requestUrl.pathname === "/") {
      await route.fulfill({ contentType: "text/html", body: documentWith(markup) });
      return;
    }
    const requestedAsset =
      requestUrl.pathname === "/_next/image"
        ? requestUrl.searchParams.get("url")
        : requestUrl.pathname;
    if (!requestedAsset?.startsWith("/")) {
      await route.abort();
      return;
    }

    try {
      const assetPath = resolve(publicDirectory, `.${requestedAsset}`);
      const body = readFileSync(assetPath);
      await route.fulfill({
        body,
        contentType:
          imageContentTypes[extname(assetPath).toLocaleLowerCase()] ??
          "application/octet-stream",
      });
    } catch {
      await route.abort();
    }
  });
  await page.goto("http://portfolio.test/", { waitUntil: "load" });
  return page;
}

async function contentFit(page: Page, selector: string, childSelector: string) {
  return page.locator(selector).evaluate(
    (element, child) => {
      const childElement = element.querySelector<HTMLElement>(child);
      if (!childElement) throw new Error(`Missing ${child}`);
      const elementRect = element.getBoundingClientRect();
      const childRect = childElement.getBoundingClientRect();
      return {
        noHorizontalScroll: element.scrollWidth === element.clientWidth,
        noVerticalScroll: element.scrollHeight === element.clientHeight,
        bottomClearance: elementRect.bottom - childRect.bottom,
        childFullyVisible:
          childRect.top >= elementRect.top &&
          childRect.right <= elementRect.right &&
          childRect.bottom <= elementRect.bottom &&
          childRect.left >= elementRect.left,
      };
    },
    childSelector,
  );
}

describe("Myles 98 desktop content fit", () => {
  it("keeps the atlas lettering in frame and reveals its layers with reduced motion", async () => {
    const page = await browserPage({ width: 1314, height: 1057 }, renderDesktopMarkup());
    const cover = page.locator('.publication-cover[data-project="fresh-greens"]');
    const jacket = await cover.boundingBox();
    for (const detail of [".atlas-title", ".atlas-ticket"]) {
      const bounds = await cover.locator(detail).boundingBox();
      if (!jacket || !bounds) throw new Error("Missing atlas cover artwork");
      expect(bounds.x).toBeGreaterThanOrEqual(jacket.x);
      expect(bounds.y).toBeGreaterThanOrEqual(jacket.y);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(jacket.x + jacket.width);
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(jacket.y + jacket.height);
    }
    expect(await cover.locator(".atlas-map").count()).toBe(1);
    expect(await cover.locator(".assembly-part").count()).toBeGreaterThan(2);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await cover.evaluate(element => { element.setAttribute("data-inspect", "true"); });
    expect(await cover.locator(".edition-face").evaluate(layer => getComputedStyle(layer).opacity)).toBe("0");
    expect(await cover.locator(".assembly-part").first().evaluate(layer => getComputedStyle(layer).transitionDuration)).toBe("0s");
    await page.close();
  });

  it.each(laptopViewports)(
    "keeps the real Projects and Welcome actions visible at $width×$height",
    async (viewport) => {
      const markup = renderDesktopMarkup();
      const page = await browserPage(viewport, markup);
      const selectedContent = page.locator(
        '[data-m97-program-window="selected-work"] .myles97-window-content',
      );
      const selectedGeometry = await selectedContent.evaluate((element) => {
        const contentRect = element.getBoundingClientRect();
        const inside = (child: DOMRect, parent: DOMRect) =>
          child.top >= parent.top &&
          child.right <= parent.right &&
          child.bottom <= parent.bottom &&
          child.left >= parent.left;
        const list = element.querySelector<HTMLElement>(".myles97-selected-work-list");
        if (!list) throw new Error("Missing selected work list");
        const actions = Array.from(
          element.querySelectorAll<HTMLElement>(
            ".myles97-case-study-link",
          ),
        );
        const covers = Array.from(
          element.querySelectorAll<HTMLElement>(".myles97-program-cover"),
        );
        const listRect = list.getBoundingClientRect();
        const visibleCount = (items: HTMLElement[]) =>
          items.filter((item) => {
            const rect = item.getBoundingClientRect();
            return inside(rect, contentRect) && inside(rect, listRect);
          }).length;
        const initialVisibleActions = visibleCount(actions);
        const initialVisibleCovers = visibleCount(covers);
        const listHasVerticalOverflow = list.scrollHeight > list.clientHeight;

        list.scrollTop = list.scrollHeight;

        return {
          noHorizontalScroll: element.scrollWidth === element.clientWidth,
          noVerticalScroll: element.scrollHeight === element.clientHeight,
          listHasVerticalOverflow,
          totalThumbnails: element.querySelectorAll(".publication-cover").length,
          initialVisibleActions,
          initialVisibleCovers,
          finalVisibleActions: visibleCount(actions),
          finalVisibleCovers: visibleCount(covers),
        };
      });
      const welcomeFit = await contentFit(
        page,
        '[data-m97-program-window="welcome"] .myles97-window-content',
        ".myles97-primary-button",
      );

      expect(programs).toHaveLength(4);
      expect(selectedGeometry).toEqual({
        noHorizontalScroll: true,
        noVerticalScroll: true,
        listHasVerticalOverflow: false,
        totalThumbnails: programs.length,
        initialVisibleActions: programs.length,
        initialVisibleCovers: programs.length,
        finalVisibleActions: programs.length,
        finalVisibleCovers: programs.length,
      });
      expect(welcomeFit).toEqual({
        noHorizontalScroll: true,
        noVerticalScroll: true,
        bottomClearance: expect.any(Number),
        childFullyVisible: true,
      });
      expect(welcomeFit.bottomClearance).toBeGreaterThanOrEqual(16);
      await page.close();
    },
    60_000,
  );

  it("moves the Now Playing bars only during playback and honors reduced motion", async () => {
    const page = await browserPage(
      laptopViewports[0],
      `<span class="now-playing-equalizer" data-playing="true" aria-hidden="true">
        <i></i><i></i><i></i><i></i>
      </span>`,
    );
    const bars = page.locator(".now-playing-equalizer i");

    expect(await bars.first().evaluate((bar) => getComputedStyle(bar).animationName))
      .not.toBe("none");

    await page.locator(".now-playing-equalizer").evaluate((equalizer) => {
      equalizer.setAttribute("data-playing", "false");
    });
    expect(await bars.first().evaluate((bar) => getComputedStyle(bar).animationName))
      .toBe("none");

    await page.locator(".now-playing-equalizer").evaluate((equalizer) => {
      equalizer.setAttribute("data-playing", "true");
    });
    await page.emulateMedia({ reducedMotion: "reduce" });
    expect(await bars.first().evaluate((bar) => getComputedStyle(bar).animationName))
      .toBe("none");

    await page.close();
  });

  it("lets the matched Spotify surface show through a blank player iframe", async () => {
    const page = await browserPage(
      laptopViewports[0],
      `<div class="now-playing-player-well" style="background-color:#9c190b">
        <div class="now-playing-embed-host" style="background-color:#9c190b">
          <iframe title="Loading Spotify player"></iframe>
        </div>
      </div>`,
    );

    const colors = await page.locator(".now-playing-player-well").evaluate((well) => {
      const host = well.querySelector<HTMLElement>(".now-playing-embed-host");
      const frame = well.querySelector<HTMLIFrameElement>("iframe");
      if (!host || !frame) throw new Error("Incomplete player shell");
      return {
        well: getComputedStyle(well).backgroundColor,
        host: getComputedStyle(host).backgroundColor,
        frame: getComputedStyle(frame).backgroundColor,
      };
    });

    expect(colors).toEqual({
      well: "rgb(156, 25, 11)",
      host: "rgb(156, 25, 11)",
      frame: "rgba(0, 0, 0, 0)",
    });

    await page.close();
  });

  it("gives every thumbnail and its reading action the same destination", async () => {
    const page = await browserPage(laptopViewports[0], renderDesktopMarkup());
    for (const program of programs) {
      const link = page.getByRole("link", { name: `Read ${program.title} case study` });
      expect(await link.getAttribute("href")).toBe(program.href);
      expect(await link.locator(".myles97-program-cover").isVisible()).toBe(true);
      expect(await link.getByText("Read case study").isVisible()).toBe(true);
    }
    expect(await page.getByRole("button", { name: /explore.*preview/i }).count()).toBe(0);
    await page.close();
  });
});
