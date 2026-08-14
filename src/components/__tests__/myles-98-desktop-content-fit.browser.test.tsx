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
        </style>
      </head>
      <body>
        <main class="myles97-shell">${desktopMarkup}</main>
      </body>
    </html>`;
}

function renderDesktopMarkup(openProgram?: ProgramDefinition) {
  const rendered = render(<DesktopHarness />);
  if (openProgram) {
    fireEvent.click(
      within(rendered.container).getByRole("button", {
        name: `Explore ${openProgram.appName} interactive preview`,
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

async function browserPage(viewport: (typeof laptopViewports)[number], markup: string) {
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
    .evaluate((content) => {
      const cover = content.querySelector<HTMLElement>(
        ".myles97-project-preview-cover",
      );
      const image = cover?.querySelector<HTMLImageElement>("img");
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
      const sourceAspectRatio = image.naturalWidth / image.naturalHeight;
      const visibleImageWidth = Math.min(
        imageRect.width,
        imageRect.height * sourceAspectRatio,
      );
      const visibleImageHeight = visibleImageWidth / sourceAspectRatio;

      return {
        noHorizontalScroll: content.scrollWidth === content.clientWidth,
        noVerticalScroll: content.scrollHeight === content.clientHeight,
        coverFullyVisible: inside(coverRect, contentRect),
        imageFullyVisible: inside(imageRect, coverRect) && inside(imageRect, contentRect),
        actionFullyVisible: inside(actionRect, contentRect),
        objectFit: getComputedStyle(image).objectFit,
        sourceLoaded: image.complete && image.naturalWidth > 0,
        sourceAspectRatio,
        visibleImageWidth,
        visibleImageHeight,
      };
    });
}

describe("Myles 98 desktop content fit", () => {
  it.each(laptopViewports)(
    "keeps the real Selected Work and Welcome actions visible at $width×$height",
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
        const actions = Array.from(
          element.querySelectorAll<HTMLElement>(
            ".myles97-case-study-link, .myles97-program-launch",
          ),
        );
        const covers = Array.from(
          element.querySelectorAll<HTMLElement>(".myles97-program-cover"),
        );
        const images = Array.from(
          element.querySelectorAll<HTMLImageElement>(".myles97-program-cover img"),
        );
        return {
          noHorizontalScroll: element.scrollWidth === element.clientWidth,
          noVerticalScroll: element.scrollHeight === element.clientHeight,
          visibleActions: actions.filter((action) =>
            inside(action.getBoundingClientRect(), contentRect),
          ).length,
          visibleCovers: covers.filter((cover) =>
            inside(cover.getBoundingClientRect(), contentRect),
          ).length,
          loadedImages: images.filter(
            (image) =>
              image.complete &&
              image.naturalWidth > 0 &&
              getComputedStyle(image).objectFit === "contain" &&
              inside(image.getBoundingClientRect(), contentRect),
          ).length,
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
        visibleActions: programs.length * 2,
        visibleCovers: programs.length,
        loadedImages: programs.length,
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
          objectFit: "contain",
          sourceLoaded: true,
        });
        expect(geometry.sourceAspectRatio, program.appName).toBeGreaterThan(1.3);
        expect(geometry.sourceAspectRatio, program.appName).toBeLessThan(1.7);
        expect(geometry.visibleImageWidth, program.appName).toBeGreaterThanOrEqual(300);
        expect(geometry.visibleImageHeight, program.appName).toBeGreaterThanOrEqual(200);
        await page.close();
      }
    },
    60_000,
  );
});
