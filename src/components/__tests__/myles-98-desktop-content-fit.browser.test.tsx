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
  type ProjectProgramId,
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

function renderDesktopMarkup(openProgram?: ProgramDefinition) {
  const rendered = render(<DesktopHarness />);
  fireEvent.click(within(rendered.container).getByRole("radio", { name: "Thumbnails" }));
  if (openProgram) {
    fireEvent.click(
      within(rendered.container).getByRole("button", {
        name: `Explore ${openProgram.appName} preview`,
      }),
    );
    expect(
      within(rendered.container).getByRole("region", {
        name: openProgram.appName,
      }),
    ).toBeInTheDocument();
  }
  const markup = rendered.container.innerHTML;
  rendered.unmount();
  return markup;
}

async function browserPage(viewport: { width: number; height: number }, markup: string) {
  const page = await browser.newPage({ viewport });
  await page.route("http://portfolio.test/**", async (route) => {
    const requestUrl = new URL(route.request().url());
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
  await page.setContent(documentWith(markup), { waitUntil: "load" });
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

async function projectPreviewGeometry(page: Page, programId: ProjectProgramId) {
  return page
    .locator(`[data-m97-program-window="${programId}"] .myles97-window-content`)
    .evaluate(async (content) => {
      const cover = content.querySelector<HTMLElement>(".sample-browser");
      const image = cover?.querySelector<HTMLElement>(".sample-detail .artwork-crop, .sample-comparison-capture");
      const action = content.querySelector<HTMLElement>(".myles97-primary-button");
      if (!cover || !image || !action) throw new Error("Incomplete project preview");

      const contentRect = content.getBoundingClientRect();
      const coverRect = cover.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();
      const actionRect = action.getBoundingClientRect();
      const inside = (child: DOMRect, parent: DOMRect) =>
        child.top >= parent.top &&
        child.right <= parent.right &&
        child.bottom <= parent.bottom &&
        child.left >= parent.left;
      const sources = Array.from(cover.querySelectorAll("img"));
      await Promise.all(sources.map(source => source.decode()));
      return {
        noHorizontalScroll: content.scrollWidth === content.clientWidth,
        noVerticalScroll: content.scrollHeight === content.clientHeight,
        coverFullyVisible: inside(coverRect, contentRect),
        imageFullyVisible: inside(imageRect, coverRect) && inside(imageRect, contentRect),
        actionFullyVisible: inside(actionRect, contentRect),
        sourceLoaded: sources.length === 2 && sources.every(source => source.naturalWidth > 0),
        visibleImageWidth: imageRect.width,
      };
    });
}

describe("Myles 98 desktop content fit", () => {
  it("keeps the atlas location and route ticket fully visible in thumbnail view", async () => {
    const page = await browserPage({ width: 1314, height: 1057 }, renderDesktopMarkup());
    const cover = page.locator('.publication-cover[data-project="fresh-greens"]');
    const art = await cover.boundingBox();
    const ticket = await cover.locator(".atlas-ticket").boundingBox();
    const dot = await cover.locator(".atlas-map").evaluate(el => {
      const rect = el.getBoundingClientRect();
      const matrix = new DOMMatrix(getComputedStyle(el).transform);
      // The location dot is printed in the native screenshot at (645, 692) of 1290 × 850.
      const dy = (.814 - .5) * parseFloat(getComputedStyle(el).height);
      return { x:rect.x + rect.width/2 + matrix.c*dy, y:rect.y + rect.height/2 + matrix.d*dy };
    });
    if (!art || !ticket) throw new Error("Missing route artwork");
    for (const edge of [[ticket.x,ticket.y],[ticket.x+ticket.width,ticket.y+ticket.height],[dot.x,dot.y]]) {
      expect(edge[0]).toBeGreaterThanOrEqual(art.x);
      expect(edge[0]).toBeLessThanOrEqual(art.x+art.width);
      expect(edge[1]).toBeGreaterThanOrEqual(art.y);
      expect(edge[1]).toBeLessThanOrEqual(art.y+art.height);
    }
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
            ".myles97-case-study-link, .myles97-program-launch",
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
        initialVisibleActions: programs.length * 2,
        initialVisibleCovers: programs.length,
        finalVisibleActions: programs.length * 2,
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

  it.each(laptopViewports)(
    "opens all real project previews with complete artwork and actions at $width×$height",
    async (viewport) => {
      expect(programs).toHaveLength(4);

      for (const program of programs) {
        const markup = renderDesktopMarkup(program);
        const page = await browserPage(viewport, markup);
        const geometry = await projectPreviewGeometry(page, program.id);

        expect(geometry, program.appName).toMatchObject({
          noHorizontalScroll: true,
          noVerticalScroll: true,
          coverFullyVisible: true,
          imageFullyVisible: true,
          actionFullyVisible: true,
          sourceLoaded: true,
        });
        expect(geometry.visibleImageWidth, program.appName).toBeGreaterThan(135);
        await page.close();
      }
    },
    60_000,
  );
});
