import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { useReducer } from "react";
import { renderToString } from "react-dom/server";
import { chromium, type Browser, type Page, type Route } from "playwright";
import { build } from "vite";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  TASK5_CHAPTERS,
  Task5HydratedFixture,
  type Task5FixtureKind,
} from "@/components/__tests__/fixtures/task-5-hydrated-fixture";
import { Pocket97Shell } from "@/components/myles-97/pocket-97-shell";
import { ReaderShell } from "@/components/myles-97/reader-shell";
import { ProjectToc } from "@/components/project-toc";
import { getPublishedProjects } from "@/lib/content";
import { buildProgramRegistry, type ProgramDefinition } from "@/lib/myles-97/programs";
import {
  createInitialWorkstationState,
  workstationReducer,
} from "@/lib/myles-97/state";

vi.mock("next/image", async () =>
  import("@/components/__tests__/fixtures/task-5-image"),
);
vi.mock("next/link", async () =>
  import("@/components/__tests__/fixtures/task-5-link"),
);

const testDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = resolve(testDirectory, "../../../public");
const styles = [
  "../../app/styles/base.css",
  "../../app/styles/myles-97.css",
  "../../app/styles/myles-97-secondary.css",
  "../../app/styles/myles-97-pocket.css",
  "../../app/styles/reader-mode.css",
]
  .map((path) => readFileSync(resolve(testDirectory, path), "utf8"))
  .join("\n");

const tabletViewports = [
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 768 },
] as const;
const phoneViewports = [
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
let programs: ProgramDefinition[];
let hydratedClientBundle: string;

beforeAll(async () => {
  programs = buildProgramRegistry(await getPublishedProjects());
  const bundleResult = await build({
    configFile: false,
    logLevel: "silent",
    resolve: {
      alias: [
        {
          find: "next/image",
          replacement: resolve(testDirectory, "fixtures/task-5-image.tsx"),
        },
        {
          find: "next/link",
          replacement: resolve(testDirectory, "fixtures/task-5-link.tsx"),
        },
        { find: "@", replacement: resolve(testDirectory, "../..") },
      ],
    },
    build: {
      write: false,
      minify: false,
      rollupOptions: {
        input: resolve(testDirectory, "fixtures/task-5-hydrated.client.tsx"),
        output: {
          format: "iife",
          name: "Task5HydratedClient",
        },
      },
    },
  });
  const bundle = Array.isArray(bundleResult) ? bundleResult[0] : bundleResult;
  if (!("output" in bundle)) {
    throw new Error("Task 5 hydration build unexpectedly returned a watcher");
  }
  const entry = bundle.output.find(
    (output) => output.type === "chunk" && output.isEntry,
  );
  if (!entry || entry.type !== "chunk") {
    throw new Error("Task 5 hydration bundle did not produce an entry chunk");
  }
  hydratedClientBundle = entry.code;
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

afterAll(async () => {
  await browser?.close();
});

function PocketHarness() {
  const [state, dispatch] = useReducer(
    workstationReducer,
    undefined,
    createInitialWorkstationState,
  );

  return (
    <main className="myles97-shell" data-m97-shell="pocket">
      <Pocket97Shell
        programs={programs}
        looseParts={[]}
        state={state}
        dispatch={dispatch}
      />
    </main>
  );
}

function ReaderHarness() {
  return (
    <ReaderShell slug="fresh-greens" title="Fresh Greens" className="fg-page">
      <article>
        <h1>Fresh Greens</h1>
        <ProjectToc sections={TASK5_CHAPTERS} />
        {TASK5_CHAPTERS.map((chapter) => (
          <section className="project-section" key={chapter.id}>
            <h2 id={chapter.id}>{chapter.title}</h2>
            <p>{`${chapter.title} `.repeat(80)}</p>
          </section>
        ))}
      </article>
    </ReaderShell>
  );
}

function installTocObservers() {
  class PassiveIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "0px";
    readonly thresholds = [0];
    disconnect() {}
    observe() {}
    takeRecords() { return []; }
    unobserve() {}
  }

  class PassiveResizeObserver {
    disconnect() {}
    observe() {}
    unobserve() {}
  }

  vi.stubGlobal("IntersectionObserver", PassiveIntersectionObserver);
  vi.stubGlobal("ResizeObserver", PassiveResizeObserver);
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList)),
  );
}

function documentWith(markup: string, baseHref = "http://portfolio.test/") {
  return `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <base href="${baseHref}" />
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; }
          ${styles}
        </style>
      </head>
      <body>${markup}</body>
    </html>`;
}

async function fulfillAsset(route: Route) {
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

async function browserPage(
  viewport: { width: number; height: number },
  markup: string,
) {
  const page = await browser.newPage({ viewport });
  await page.route("http://portfolio.test/**", fulfillAsset);
  await page.setContent(documentWith(markup), { waitUntil: "load" });
  return page;
}

async function hydratedBrowserPage(
  fixture: Task5FixtureKind,
  viewport: { width: number; height: number },
  javaScriptEnabled = true,
) {
  const page = await browser.newPage({ viewport, javaScriptEnabled });
  const path = `/__task5/${fixture}`;
  const markup = renderToString(
    <Task5HydratedFixture fixture={fixture} programs={programs} />,
  );
  const html = documentWith(
    `<div id="task5-root" data-fixture="${fixture}">${markup}</div>`,
    `http://portfolio.test${path}`,
  );

  await page.route("http://portfolio.test/**", async (route) => {
    const requestUrl = new URL(route.request().url());
    if (
      route.request().resourceType() === "document" &&
      requestUrl.pathname === path
    ) {
      await route.fulfill({ body: html, contentType: "text/html" });
      return;
    }
    await fulfillAsset(route);
  });
  await page.goto(`http://portfolio.test${path}`, { waitUntil: "load" });

  if (!javaScriptEnabled) return page;

  await page.evaluate((fixturePrograms) => {
    window.__TASK5_PROGRAMS__ = fixturePrograms;
    window.localStorage.setItem(
      "myles97.desktop.v1",
      JSON.stringify({
        version: 1,
        bootCompleted: true,
        recentPrograms: [],
        displayPreferences: { highContrast: false, reduceMotion: true },
      }),
    );
    window.sessionStorage.clear();
  }, programs);
  await page.addScriptTag({ content: hydratedClientBundle });
  await page.waitForFunction(
    (expectedFixture) =>
      document.documentElement.dataset.task5Hydrated === expectedFixture,
    fixture,
  );

  return page;
}

function renderPocketMarkup() {
  const rendered = render(<PocketHarness />);
  const markup = rendered.container.innerHTML;
  rendered.unmount();
  return markup;
}

async function renderReaderMarkup() {
  installTocObservers();
  const rendered = render(<ReaderHarness />);
  const toc = rendered.container.querySelector<HTMLElement>(".project-toc");
  const toggle = rendered.container.querySelector<HTMLButtonElement>(
    ".project-toc-toggle",
  );
  expect(toc).not.toBeNull();
  expect(toggle).not.toBeNull();

  await waitFor(() => expect(toc).toHaveAttribute("data-toc-ready", "true"));
  const closed = rendered.container.innerHTML;

  fireEvent.click(toggle!);
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "true"));
  const open = rendered.container.innerHTML;

  fireEvent.click(toggle!);
  await waitFor(() => expect(toggle).toHaveAttribute("aria-expanded", "false"));
  toc!.removeAttribute("data-toc-ready");
  const fallback = rendered.container.innerHTML;
  rendered.unmount();

  return { closed, open, fallback };
}

async function assertNoHorizontalOverflow(page: Page) {
  const result = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
    offenders: Array.from(document.querySelectorAll<HTMLElement>("body *"))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          selector: element.id
            ? `#${element.id}`
            : `${element.tagName.toLowerCase()}.${Array.from(element.classList).join(".")}`,
          left: rect.left,
          right: rect.right,
          scrollWidth: element.scrollWidth,
          clientWidth: element.clientWidth,
          overflowX: getComputedStyle(element).overflowX,
        };
      })
      .filter(({ left, right, scrollWidth, clientWidth, overflowX }) =>
        left < -0.5 ||
        right > innerWidth + 0.5 ||
        (overflowX === "visible" && scrollWidth > clientWidth + 1),
      )
      .slice(0, 20),
  }));

  expect(result, JSON.stringify(result, null, 2)).toMatchObject({
    clientWidth: result.scrollWidth,
    offenders: [],
  });
}

describe("Task 5 responsive adaptation", () => {
  it("hydrates the production Reader TOC with keyboard, fragment, and focus-return behavior", async () => {
    const page = await hydratedBrowserPage("reader", phoneViewports[0]);
    await page.waitForSelector('.project-toc[data-toc-ready="true"]');
    const toggle = page.locator(".project-toc-toggle");
    const links = page.locator(".project-toc-link");

    await toggle.click();
    expect(await toggle.getAttribute("aria-expanded")).toBe("true");
    await links.nth(0).focus();
    await links.nth(0).press("ArrowDown");
    expect(
      await links.nth(1).evaluate((element) => element === document.activeElement),
    ).toBe(true);

    await links.nth(1).press("Escape");
    expect(await toggle.getAttribute("aria-expanded")).toBe("false");
    expect(await toggle.evaluate((element) => element === document.activeElement)).toBe(
      true,
    );

    await toggle.click();
    await links.nth(0).click();
    await page.waitForFunction(() => window.location.hash === "#frame");
    await page.waitForFunction(
      () => document.activeElement?.classList.contains("project-toc-toggle") ?? false,
    );
    expect(await toggle.getAttribute("aria-expanded")).toBe("false");
    expect(await toggle.evaluate((element) => element === document.activeElement)).toBe(
      true,
    );
    await page.close();
  }, 60_000);

  it("hydrates the real shell into Pocket and preserves single-app back focus", async () => {
    const page = await hydratedBrowserPage("pocket", tabletViewports[1]);
    await page.waitForSelector('[data-m97-shell="pocket"] .pocket97-dock');

    expect(await page.locator(".pocket97-dock button").count()).toBe(4);
    expect(await page.locator("[data-draggable-window]").count()).toBe(0);
    await page
      .getByRole("button", { name: "Open Fresh Greens.exe program" })
      .click();
    await page.waitForSelector(".pocket97-app");
    expect(await page.locator(".pocket97-home").count()).toBe(0);

    const back = page.getByRole("button", { name: "Back" });
    await page.waitForFunction(
      () => document.activeElement?.classList.contains("pocket97-back"),
    );
    await back.click();
    await page.waitForSelector(".pocket97-home");
    await page.waitForFunction(
      () => document.activeElement?.textContent?.trim() === "Work",
    );
    await page.close();
  }, 60_000);

  it("keeps the real JavaScript-disabled server snapshots navigable", async () => {
    const pocketPage = await hydratedBrowserPage(
      "pocket",
      tabletViewports[1],
      false,
    );
    expect(
      await pocketPage.locator(".myles97-shell").getAttribute("data-m97-shell"),
    ).toBe("workstation");
    expect(
      await pocketPage.locator(".myles97-desktop").evaluate(
        (element) => getComputedStyle(element).display,
      ),
    ).toBe("grid");
    expect(
      await pocketPage.locator(".myles97-taskbar").evaluate(
        (element) => getComputedStyle(element).display,
      ),
    ).toBe("none");
    expect(await pocketPage.getByRole("link", { name: /Open .* case study/ }).count()).toBe(
      programs.length,
    );
    await assertNoHorizontalOverflow(pocketPage);
    await pocketPage.close();

    const readerPage = await hydratedBrowserPage(
      "reader",
      phoneViewports[1],
      false,
    );
    expect(
      await readerPage.locator(".project-toc-toggle").evaluate(
        (element) => getComputedStyle(element).display,
      ),
    ).toBe("none");
    expect(
      await readerPage.locator(".project-toc-list").evaluate(
        (element) => getComputedStyle(element).display,
      ),
    ).toBe("flex");
    await readerPage
      .getByRole("link", { name: "Frame: The routing problem" })
      .click();
    expect(new URL(readerPage.url()).hash).toBe("#frame");
    await assertNoHorizontalOverflow(readerPage);
    await readerPage.close();
  }, 60_000);

  it.each(tabletViewports)(
    "keeps the production Pocket folio and fixed dock clear at $width×$height",
    async (viewport) => {
      const page = await browserPage(viewport, renderPocketMarkup());
      await assertNoHorizontalOverflow(page);
      await page.waitForFunction(() =>
        Array.from(document.querySelectorAll<HTMLImageElement>(".myles97-program-cover img"))
          .every((image) => image.complete && image.naturalWidth > 0),
      );

      const geometry = await page.evaluate(() => {
        const intro = document.querySelector<HTMLElement>(".pocket97-intro")!;
        const work = document.querySelector<HTMLElement>(".pocket97-work")!;
        const recipe = document.querySelector<HTMLElement>(".pocket97-recipe-card")!;
        const dock = document.querySelector<HTMLElement>(".pocket97-dock")!;
        const cards = Array.from(
          document.querySelectorAll<HTMLElement>(".myles97-program-card"),
        );
        const targets = Array.from(
          document.querySelectorAll<HTMLElement>(
            ".pocket97-dock button, .myles97-program-launch, .myles97-case-study-link, .pocket97-recipe-card",
          ),
        );
        const introRect = intro.getBoundingClientRect();
        const workRect = work.getBoundingClientRect();
        const recipeRect = recipe.getBoundingClientRect();
        const dockRect = dock.getBoundingClientRect();
        const cardRects = cards.map((card) => card.getBoundingClientRect());

        return {
          dockActions: dock.querySelectorAll("button").length,
          dockFixed: getComputedStyle(dock).position === "fixed",
          dockAtViewportBottom: Math.abs(dockRect.bottom - innerHeight) <= 1,
          columnsSeparate: introRect.right <= workRect.left && recipeRect.right <= workRect.left,
          columnsStartTogether: Math.abs(introRect.top - workRect.top) <= 1,
          recipeFollowsIntro: recipeRect.top >= introRect.bottom,
          twoCardRows:
            cardRects.length === 4 &&
            Math.abs(cardRects[0].top - cardRects[1].top) <= 1 &&
            Math.abs(cardRects[2].top - cardRects[3].top) <= 1 &&
            cardRects[1].left > cardRects[0].left,
          allTargets44: targets.every((target) => {
            const rect = target.getBoundingClientRect();
            return rect.width >= 44 && rect.height >= 44;
          }),
          coverCount: document.querySelectorAll(".myles97-program-cover img").length,
        };
      });

      expect(geometry).toEqual({
        dockActions: 4,
        dockFixed: true,
        dockAtViewportBottom: true,
        columnsSeparate: true,
        columnsStartTogether: true,
        recipeFollowsIntro: true,
        twoCardRows: true,
        allTargets44: true,
        coverCount: programs.length,
      });

      await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
      const clearsDock = await page.evaluate(() => {
        const home = document.querySelector<HTMLElement>(".pocket97-home")!;
        const dock = document.querySelector<HTMLElement>(".pocket97-dock")!;
        return home.getBoundingClientRect().bottom <= dock.getBoundingClientRect().top;
      });
      expect(clearsDock).toBe(true);
      await page.close();
    },
    60_000,
  );

  it.each(phoneViewports)(
    "keeps compact Reader chrome and the real TOC states clear at $width×$height",
    async (viewport) => {
      const markup = await renderReaderMarkup();
      const closedPage = await browserPage(viewport, markup.closed);
      await closedPage.evaluate(() => scrollTo(0, 480));
      await assertNoHorizontalOverflow(closedPage);

      const closed = await closedPage.evaluate(() => {
        const header = document.querySelector<HTMLElement>(".reader-header")!;
        const toc = document.querySelector<HTMLElement>(".project-toc")!;
        const returnLink = document.querySelector<HTMLElement>(".reader-return")!;
        const toggle = document.querySelector<HTMLElement>(".project-toc-toggle")!;
        const headerRect = header.getBoundingClientRect();
        const tocRect = toc.getBoundingClientRect();
        const returnRect = returnLink.getBoundingClientRect();
        const toggleRect = toggle.getBoundingClientRect();

        return {
          headerAtTop: Math.abs(headerRect.top) <= 1,
          tocClearsHeader: tocRect.top >= headerRect.bottom - 1,
          headerBottom: headerRect.bottom,
          tocTop: tocRect.top,
          tocPosition: getComputedStyle(toc).position,
          tocInset: getComputedStyle(toc).top,
          returnName: returnLink.getAttribute("aria-label"),
          returnTarget44: returnRect.width >= 44 && returnRect.height >= 44,
          toggleName: toggle.getAttribute("aria-label"),
          toggleTarget44: toggleRect.width >= 44 && toggleRect.height >= 44,
          fullLabelDisplay: getComputedStyle(
            document.querySelector<HTMLElement>(".reader-return-label--full")!,
          ).display,
          compactLabelVisible: getComputedStyle(
            document.querySelector<HTMLElement>(".reader-return-label--compact")!,
          ).display !== "none",
          stageDisplay: getComputedStyle(
            document.querySelector<HTMLElement>(".project-toc-stage")!,
          ).display,
          readoutVisible: getComputedStyle(
            document.querySelector<HTMLElement>(".project-toc-readout-mobile")!,
          ).display !== "none",
          listDisplay: getComputedStyle(
            document.querySelector<HTMLElement>(".project-toc-list")!,
          ).display,
        };
      });

      expect(closed, JSON.stringify(closed, null, 2)).toMatchObject({
        headerAtTop: true,
        tocClearsHeader: true,
        returnName: "Return to Desktop",
        returnTarget44: true,
        toggleName: "Frame: The routing problem",
        toggleTarget44: true,
        fullLabelDisplay: "none",
        compactLabelVisible: true,
        stageDisplay: "none",
        listDisplay: "none",
      });
      expect(closed.readoutVisible).toBe(viewport.width > 360);
      await closedPage.close();

      const openPage = await browserPage(viewport, markup.open);
      await openPage.evaluate(() => scrollTo(0, 480));
      await assertNoHorizontalOverflow(openPage);
      const open = await openPage.evaluate(() => {
        const header = document.querySelector<HTMLElement>(".reader-header")!;
        const toc = document.querySelector<HTMLElement>(".project-toc")!;
        const list = document.querySelector<HTMLElement>(".project-toc-list")!;
        const links = Array.from(
          document.querySelectorAll<HTMLElement>(".project-toc-link"),
        );
        return {
          expanded: document
            .querySelector(".project-toc-toggle")
            ?.getAttribute("aria-expanded"),
          listDisplay: getComputedStyle(list).display,
          tocClearsHeader:
            toc.getBoundingClientRect().top >= header.getBoundingClientRect().bottom - 1,
          listInsideViewport: list.getBoundingClientRect().bottom <= innerHeight,
          links44: links.every((link) => link.getBoundingClientRect().height >= 44),
          linkNames: links.map((link) => link.getAttribute("aria-label")),
        };
      });
      expect(open).toMatchObject({
        expanded: "true",
        listDisplay: "flex",
        tocClearsHeader: true,
        listInsideViewport: true,
        links44: true,
        linkNames: TASK5_CHAPTERS.map(
          (chapter) => `${chapter.stage}: ${chapter.title}`,
        ),
      });
      await openPage.close();

      const fallbackPage = await browserPage(viewport, markup.fallback);
      await assertNoHorizontalOverflow(fallbackPage);
      expect(
        await fallbackPage.evaluate(() => ({
          toggleDisplay: getComputedStyle(
            document.querySelector<HTMLElement>(".project-toc-toggle")!,
          ).display,
          listDisplay: getComputedStyle(
            document.querySelector<HTMLElement>(".project-toc-list")!,
          ).display,
          position: getComputedStyle(
            document.querySelector<HTMLElement>(".project-toc")!,
          ).position,
        })),
      ).toEqual({ toggleDisplay: "none", listDisplay: "flex", position: "static" });
      await fallbackPage.close();
    },
    60_000,
  );
});
