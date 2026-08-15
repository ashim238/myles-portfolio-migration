import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { transform } from "lightningcss";
import { chromium, type Browser, type Page } from "playwright";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const preferenceStylesPath = resolve(
  __dirname,
  "../styles/accessibility-preferences.css",
);
const preferenceStyles = existsSync(preferenceStylesPath)
  ? readFileSync(preferenceStylesPath, "utf8")
  : "";
const productionReaderStyles = transform({
  filename: "reader-accessibility.css",
  code: Buffer.from(
    [
      "../styles/base.css",
      "../styles/reader-mode.css",
      "../styles/myles-98-paper-contrast.css",
      "../styles/accessibility-preferences.css",
      "../styles/portfolio-surfaces.css",
    ]
      .map((file) => readFileSync(resolve(__dirname, file), "utf8"))
      .join("\n"),
  ),
  minify: true,
}).code.toString();

let browser: Browser;

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
});

afterAll(async () => {
  await browser?.close();
});

function documentWithPreferences() {
  return `<!doctype html>
    <html>
      <head>
        <style>
          :root {
            --background: rgb(250, 250, 250);
            --foreground: rgb(17, 17, 17);
            --line: rgb(136, 136, 136);
            --m97-active: rgb(45, 63, 181);
            --m97-chrome: rgb(210, 210, 210);
            --m97-ink: rgb(17, 17, 17);
            --m97-paper: rgb(255, 252, 240);
            --m97-reader-ink: rgb(27, 26, 23);
            --m98-paper-focus: rgb(38, 60, 184);
          }

          .myles97-taskbar,
          .myles97-start-menu,
          .myles98-document-header,
          .pocket97-dock,
          .pocket97-sheet,
          .reader-header,
          .reader-mode.reader-mode .project-toc,
          .mobile-nav {
            border: 1px solid rgb(136, 136, 136);
            background: rgb(255 255 255 / 45%);
            backdrop-filter: blur(16px) saturate(1.4);
            -webkit-backdrop-filter: blur(16px) saturate(1.4);
          }

          .preference-focus:focus-visible {
            outline: 1px solid rgb(38, 60, 184);
          }

          .myles97-task-button[data-focused="true"],
          .reader-mode.reader-mode .project-toc-link--active {
            box-shadow: none;
          }

          .forced-canvas-reference {
            border-color: CanvasText;
            background: Canvas;
            color: CanvasText;
          }

          .forced-highlight-reference {
            background: Highlight;
            color: HighlightText;
          }

          @media (forced-colors: active) {
            .myles97-taskbar,
            .myles97-start-menu,
            .myles98-document-header,
            .pocket97-dock,
            .pocket97-sheet,
            .reader-header,
            .reader-mode.reader-mode .project-toc,
            .mobile-nav {
              border-color: CanvasText;
              background: Canvas;
              color: CanvasText;
              box-shadow: none;
              backdrop-filter: none;
            }

            .myles97-task-button[data-focused="true"],
            .reader-mode.reader-mode .project-toc-link--active {
              background: Highlight;
              color: HighlightText;
              box-shadow: none;
            }

            .preference-focus:focus-visible {
              outline-color: Highlight;
            }
          }

          ${preferenceStyles}
        </style>
      </head>
      <body>
        <nav class="myles97-taskbar">
          <button class="preference-focus myles97-task-button" data-focused="true">
            Selected Work
          </button>
        </nav>
        <div class="myles97-start-menu">Start</div>
        <header class="myles98-document-header">Document</header>
        <nav class="pocket97-dock">Pocket dock</nav>
        <div class="pocket97-sheet">Pocket sheet</div>
        <header class="reader-header">Reader</header>
        <main class="reader-mode">
          <nav class="project-toc">
            <a class="project-toc-link project-toc-link--active">Frame</a>
          </nav>
        </main>
        <nav class="mobile-nav">Mobile navigation</nav>
        <main class="myles97-desktop">
          <div class="myles97-desktop-stage">
            <button>Desktop shortcut</button>
          </div>
        </main>
        <div class="forced-canvas-reference">Canvas reference</div>
        <div class="forced-highlight-reference">Highlight reference</div>
      </body>
    </html>`;
}

function documentWithProductionReaderStyles() {
  return `<!doctype html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          :root {
            --background: rgb(250, 250, 250);
            --foreground: rgb(17, 17, 17);
            --line: rgb(136, 136, 136);
            --m97-active: rgb(45, 63, 181);
            --m97-chrome: rgb(210, 210, 210);
            --m97-ink: rgb(17, 17, 17);
            --m97-paper: rgb(255, 252, 240);
            --m97-reader-ink: rgb(27, 26, 23);
            --m97-reader-muted: rgb(91, 89, 83);
            --m97-ui-font: Arial, sans-serif;
            --m98-paper-focus: rgb(38, 60, 184);
          }
          .forced-canvas-reference {
            background: Canvas;
            color: CanvasText;
          }
          ${productionReaderStyles}
        </style>
      </head>
      <body>
        <main class="reader-mode">
          <nav class="project-toc" data-toc-ready="true" aria-label="Case study chapters">
            <ol class="project-toc-list project-toc-list--open">
              <li class="project-toc-item" style="--toc-i: 0">
                <a class="project-toc-link project-toc-link--active" href="#frame">
                  <span class="project-toc-num">01</span>
                  <span class="project-toc-text">Frame</span>
                </a>
              </li>
              <li class="project-toc-item" style="--toc-i: 1">
                <a class="project-toc-link" href="#plan">
                  <span class="project-toc-num">02</span>
                  <span class="project-toc-text">Plan</span>
                </a>
              </li>
            </ol>
          </nav>
        </main>
        <div class="forced-canvas-reference">Canvas reference</div>
      </body>
    </html>`;
}

async function emulateMediaFeature(page: Page, name: string, value: string) {
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [{ name, value }],
  });
}

describe("persistent chrome accessibility preferences", () => {
  it("keeps the inert desktop stage transparent to the existing desktop layout", async () => {
    const page = await browser.newPage();
    await page.setContent(documentWithPreferences());

    expect(
      await page.locator(".myles97-desktop-stage").evaluate(
        (element) => getComputedStyle(element).display,
      ),
    ).toBe("contents");

    await page.close();
  });

  it("uses opaque, blur-free materials when reduced transparency is requested", async () => {
    const page = await browser.newPage();
    await emulateMediaFeature(page, "prefers-reduced-transparency", "reduce");
    await page.setContent(documentWithPreferences());

    const materials = await page.locator(
      ".myles97-taskbar, .myles97-start-menu, .myles98-document-header, .pocket97-dock, .pocket97-sheet, .reader-header, .project-toc, .mobile-nav",
    ).evaluateAll((elements) =>
      elements.map((element) => {
        const style = getComputedStyle(element);
        return {
          className: element.className,
          backgroundColor: style.backgroundColor,
          backdropFilter: style.backdropFilter,
        };
      }),
    );

    expect(materials).toEqual([
      {
        className: "myles97-taskbar",
        backgroundColor: "rgb(210, 210, 210)",
        backdropFilter: "none",
      },
      {
        className: "myles97-start-menu",
        backgroundColor: "rgb(210, 210, 210)",
        backdropFilter: "none",
      },
      {
        className: "myles98-document-header",
        backgroundColor: "rgb(210, 210, 210)",
        backdropFilter: "none",
      },
      {
        className: "pocket97-dock",
        backgroundColor: "rgb(210, 210, 210)",
        backdropFilter: "none",
      },
      {
        className: "pocket97-sheet",
        backgroundColor: "rgb(210, 210, 210)",
        backdropFilter: "none",
      },
      {
        className: "reader-header",
        backgroundColor: "rgb(210, 210, 210)",
        backdropFilter: "none",
      },
      {
        className: "project-toc",
        backgroundColor: "rgb(255, 252, 240)",
        backdropFilter: "none",
      },
      {
        className: "mobile-nav",
        backgroundColor: "rgb(250, 250, 250)",
        backdropFilter: "none",
      },
    ]);

    await page.close();
  });

  it("strengthens dividers, focus, and selected states when more contrast is requested", async () => {
    const page = await browser.newPage();
    await page.emulateMedia({ contrast: "more" });
    await page.setContent(documentWithPreferences());
    await page.locator(".preference-focus").focus();

    const contrast = await page.evaluate(() => {
      const taskbar = getComputedStyle(
        document.querySelector<HTMLElement>(".myles97-taskbar")!,
      );
      const focused = getComputedStyle(
        document.querySelector<HTMLElement>(".preference-focus")!,
      );
      const selectedTask = getComputedStyle(
        document.querySelector<HTMLElement>(
          '.myles97-task-button[data-focused="true"]',
        )!,
      );
      const selectedChapter = getComputedStyle(
        document.querySelector<HTMLElement>(".project-toc-link--active")!,
      );

      return {
        dividerWidth: taskbar.borderTopWidth,
        focusWidth: focused.outlineWidth,
        selectedTaskShadow: selectedTask.boxShadow,
        selectedChapterShadow: selectedChapter.boxShadow,
      };
    });

    expect(contrast.dividerWidth).toBe("3px");
    expect(contrast.focusWidth).toBe("4px");
    expect(contrast.selectedTaskShadow).not.toBe("none");
    expect(contrast.selectedChapterShadow).not.toBe("none");

    await page.close();
  });

  it("preserves forced-color surfaces and selection when contrast is also increased", async () => {
    const page = await browser.newPage();
    await page.emulateMedia({ contrast: "more", forcedColors: "active" });
    await page.setContent(documentWithPreferences());
    await page.locator(".preference-focus").focus();

    const colors = await page.evaluate(() => {
      const taskbar = getComputedStyle(
        document.querySelector<HTMLElement>(".myles97-taskbar")!,
      );
      const selected = getComputedStyle(
        document.querySelector<HTMLElement>(
          '.myles97-task-button[data-focused="true"]',
        )!,
      );
      const focused = getComputedStyle(
        document.querySelector<HTMLElement>(".preference-focus")!,
      );
      const canvas = getComputedStyle(
        document.querySelector<HTMLElement>(".forced-canvas-reference")!,
      );
      const highlight = getComputedStyle(
        document.querySelector<HTMLElement>(".forced-highlight-reference")!,
      );

      return {
        taskbarBackground: taskbar.backgroundColor,
        taskbarBorder: taskbar.borderTopColor,
        selectedBackground: selected.backgroundColor,
        selectedColor: selected.color,
        selectedShadow: selected.boxShadow,
        focusColor: focused.outlineColor,
        canvasBackground: canvas.backgroundColor,
        canvasText: canvas.color,
        highlightBackground: highlight.backgroundColor,
        highlightText: highlight.color,
      };
    });

    expect(colors).toMatchObject({
      taskbarBackground: colors.canvasBackground,
      taskbarBorder: colors.canvasText,
      selectedBackground: colors.highlightBackground,
      selectedColor: colors.highlightText,
      selectedShadow: "none",
      focusColor: colors.highlightBackground,
    });

    await page.close();
  });
});

describe("Reader chapter navigation accessibility preferences", () => {
  it.each([
    { label: "desktop", width: 1280 },
    { label: "mobile", width: 390 },
  ])(
    "removes standard and prefixed TOC blur with reduced transparency on $label",
    async ({ width }) => {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await emulateMediaFeature(
        page,
        "prefers-reduced-transparency",
        "reduce",
      );
      await page.setContent(documentWithProductionReaderStyles());

      const material = await page.locator(".project-toc").evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          backdropFilter: style.backdropFilter,
          prefixedBackdropFilter: style.getPropertyValue(
            "-webkit-backdrop-filter",
          ),
          backgroundColor: style.backgroundColor,
        };
      });

      expect(material.backdropFilter).toBe("none");
      expect(material.prefixedBackdropFilter).not.toContain("blur");
      expect(material.backgroundColor).toBe("rgb(255, 252, 240)");

      await page.close();
    },
  );

  it.each([
    { label: "desktop", width: 1280 },
    { label: "mobile", width: 390 },
  ])(
    "uses a blur-free system surface in Forced Colors on $label",
    async ({ width }) => {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      await page.emulateMedia({ contrast: "more", forcedColors: "active" });
      await page.setContent(documentWithProductionReaderStyles());

      const material = await page.evaluate(() => {
        const toc = getComputedStyle(
          document.querySelector<HTMLElement>(".project-toc")!,
        );
        const canvas = getComputedStyle(
          document.querySelector<HTMLElement>(".forced-canvas-reference")!,
        );
        return {
          backdropFilter: toc.backdropFilter,
          prefixedBackdropFilter: toc.getPropertyValue(
            "-webkit-backdrop-filter",
          ),
          backgroundColor: toc.backgroundColor,
          canvasBackground: canvas.backgroundColor,
        };
      });

      expect(material).toMatchObject({
        backdropFilter: "none",
        backgroundColor: material.canvasBackground,
      });
      expect(material.prefixedBackdropFilter).not.toContain("blur");

      await page.close();
    },
  );

  it("uses a 4px keyboard focus ring when more contrast is requested", async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.emulateMedia({ contrast: "more" });
    await page.setContent(documentWithProductionReaderStyles());
    await page.keyboard.press("Tab");

    const focusedLink = page.locator(".project-toc-link").first();
    expect(
      await focusedLink.evaluate((element) => element.matches(":focus-visible")),
    ).toBe(true);
    expect(
      await focusedLink.evaluate(
        (element) => getComputedStyle(element).outlineWidth,
      ),
    ).toBe("4px");

    await page.close();
  });

  it("keeps TOC targets at least 44px throughout the entrance motion", async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.setContent(documentWithProductionReaderStyles());

    const entrance = await page.locator(".project-toc-item").evaluateAll(
      (items) =>
        items.map((item) => {
          const animations = item.getAnimations();
          for (const animation of animations) {
            const effect = animation.effect;
            if (!(effect instanceof KeyframeEffect)) continue;
            animation.pause();
            animation.currentTime = Number(effect.getTiming().delay ?? 0);
          }

          return {
            linkHeight:
              item.querySelector<HTMLElement>(".project-toc-link")!
                .getBoundingClientRect().height,
            transforms: animations.flatMap((animation) => {
              const effect = animation.effect;
              if (!(effect instanceof KeyframeEffect)) return [];
              return effect
                .getKeyframes()
                .map((frame) => String(frame.transform ?? ""));
            }),
          };
        }),
    );

    for (const item of entrance) {
      expect(item.linkHeight).toBeGreaterThanOrEqual(44);
      expect(
        item.transforms.some((transform) => transform.includes("scale")),
      ).toBe(false);
    }

    await page.close();
  });

  it("keeps TOC entrance motion disabled when reduced motion is requested", async () => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setContent(documentWithProductionReaderStyles());

    const targets = await page.locator(".project-toc-item").evaluateAll((items) =>
      items.map((item) => ({
        animationName: getComputedStyle(item).animationName,
        linkHeight:
          item.querySelector<HTMLElement>(".project-toc-link")!
            .getBoundingClientRect().height,
      })),
    );

    for (const target of targets) {
      expect(target.animationName).toBe("none");
      expect(target.linkHeight).toBeGreaterThanOrEqual(44);
    }

    await page.close();
  });
});
