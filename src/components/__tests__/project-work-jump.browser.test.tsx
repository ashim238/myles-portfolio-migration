import { cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { extname, resolve } from "node:path";
import { chromium, type Browser, type Page, type Route } from "playwright";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { ProjectWorkJump } from "@/components/project-work-jump";
import type { Project } from "@/lib/content";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

vi.mock("@/components/transition-link", () => ({
  TransitionLink: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a {...props}>{children}</a>
  ),
}));

const styles = [
  "src/app/styles/base.css",
  "src/app/styles/late-polish.css",
  "src/app/styles/myles-97.css",
  "src/app/styles/myles-97-secondary.css",
  "src/app/styles/reader-mode.css",
  "src/app/styles/reader-evidence.css",
  "src/app/styles/myles-97-pocket.css",
  "src/app/styles/myles-98-polish.css",
  "src/app/styles/myles-98-paper-contrast.css",
  "src/app/styles/accessibility-preferences.css",
  "src/app/styles/portfolio-surfaces.css",
]
  .map((file) => readFileSync(resolve(process.cwd(), file), "utf8"))
  .join("\n");

const publicDirectory = resolve(process.cwd(), "public");
const imageContentTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};
const phoneViewports = [
  { width: 390, height: 844 },
  { width: 320, height: 844 },
] as const;
const projectRoutes = [
  ["fresh-greens", "navi"],
  ["navi", "understandingfafsa"],
  ["understandingfafsa", "tiktok"],
  ["tiktok", "fresh-greens"],
] as const;
const coverImages: Record<string, string> = {
  "fresh-greens": "/projects/fresh-greens/cover.png",
  navi: "/projects/navi/cover.png",
  understandingfafsa: "/projects/understandingfafsa/cover.png",
  tiktok: "/projects/tiktok/cover-phone-mockup.jpg",
};

let browser: Browser;

function project(slug: string, title: string, order: number): Project {
  return {
    slug,
    title,
    summary: `${title} summary`,
    role: "Product Designer",
    timeframe: "2026",
    status: "published",
    order,
    tags: [],
    coverImage: coverImages[slug],
    sections: [],
    bodyHtml: "",
  };
}

const projects = [
  project("fresh-greens", "Fresh Greens", 1),
  project("navi", "Navi", 2),
  project("understandingfafsa", "UnderstandingFAFSA", 3),
  project("tiktok", "TikTok Dynamic Showcase Ads", 4),
];

beforeAll(async () => {
  browser = await chromium.launch({ headless: true });
}, 60_000);

afterEach(() => {
  cleanup();
});

afterAll(async () => {
  await browser?.close();
}, 60_000);

function jumpMarkup(currentSlug: string) {
  const rendered = render(
    <ProjectWorkJump currentSlug={currentSlug} projects={projects} />,
  );
  const markup = rendered.container.innerHTML;
  rendered.unmount();
  return markup;
}

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

async function renderedJump(
  viewport: { width: number; height: number },
  currentSlug: string,
  theme: "light" | "dark" = "light",
) {
  const page = await browser.newPage({ viewport, reducedMotion: "reduce" });
  await page.route("http://portfolio.test/**", fulfillAsset);
  await page.setContent(`<!doctype html>
    <html data-theme="${theme}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <base href="http://portfolio.test/" />
        <style>
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; }
          img { display: block; max-width: 100%; }
          ${styles}
        </style>
      </head>
      <body>
        <main class="page-shell project-page reader-mode nv-page">
          ${jumpMarkup(currentSlug)}
        </main>
      </body>
    </html>`);
  await page.waitForFunction(() => {
    const image = document.querySelector<HTMLImageElement>(
      ".project-work-jump-media img",
    );
    return Boolean(image?.complete && image.naturalWidth > 0);
  });
  return page;
}

async function endcapGeometry(page: Page) {
  return page.locator(".project-work-jump").evaluate((section) => {
    const element = (selector: string) => {
      const found = section.querySelector<HTMLElement>(selector);
      if (!found) throw new Error(`Missing ${selector}`);
      return found;
    };
    const box = (selector: string) => element(selector).getBoundingClientRect();
    const sectionBox = section.getBoundingClientRect();
    const windowBox = box(".project-work-jump-window");
    const well = element(".project-work-jump-window-content");
    const wellBox = well.getBoundingClientRect();
    const textBox = box(".project-work-jump-text");
    const titleBox = box(".project-work-jump-title");
    const mediaBox = box(".project-work-jump-media");
    const image = element(".project-work-jump-media img") as HTMLImageElement;
    const imageStyle = getComputedStyle(image);

    return {
      viewportWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      sectionWidth: sectionBox.width,
      sectionLeft: sectionBox.left,
      sectionRight: sectionBox.right,
      windowLeft: windowBox.left,
      windowRight: windowBox.right,
      wellLeft: wellBox.left,
      wellRight: wellBox.right,
      wellClientWidth: well.clientWidth,
      wellScrollWidth: well.scrollWidth,
      textTop: textBox.top,
      textBottom: textBox.bottom,
      textRight: textBox.right,
      titleRight: titleBox.right,
      mediaLeft: mediaBox.left,
      mediaRight: mediaBox.right,
      mediaTop: mediaBox.top,
      mediaWidth: mediaBox.width,
      imageComplete: image.complete,
      imageNaturalWidth: image.naturalWidth,
      imageNaturalHeight: image.naturalHeight,
      imageObjectFit: imageStyle.objectFit,
    };
  });
}

describe("ProjectWorkJump rendered geometry", () => {
  it.each(projectRoutes)(
    "keeps the $destination handoff readable under the dark site preference",
    async (currentSlug, destination) => {
      const page = await renderedJump(
        { width: 390, height: 844 },
        currentSlug,
        "dark",
      );
      const contrast = await page.locator(".project-work-jump-window-content").evaluate(
        (panel) => {
          const parse = (color: string) =>
            color.match(/[\d.]+/g)?.slice(0, 3).map(Number) ?? [];
          const luminance = (color: string) => {
            const [red, green, blue] = parse(color).map((channel) => {
              const value = channel / 255;
              return value <= 0.04045
                ? value / 12.92
                : ((value + 0.055) / 1.055) ** 2.4;
            });
            return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
          };
          const ratio = (foreground: string, background: string) => {
            const lighter = Math.max(luminance(foreground), luminance(background));
            const darker = Math.min(luminance(foreground), luminance(background));
            return (lighter + 0.05) / (darker + 0.05);
          };
          const background = getComputedStyle(panel).backgroundColor;
          const selectors = [
            ".project-work-jump-label",
            ".project-work-jump-title",
            ".project-work-jump-bridge",
            ".project-work-jump-cta",
          ];

          return selectors.map((selector) => {
            const element = panel.querySelector<HTMLElement>(selector);
            if (!element) throw new Error(`Missing ${selector}`);
            const color = getComputedStyle(element).color;
            return { selector, color, background, ratio: ratio(color, background) };
          });
        },
      );

      contrast.forEach((sample) =>
        expect(sample.ratio, `${destination} ${sample.selector}`).toBeGreaterThanOrEqual(4.5),
      );
      await page.close();
    },
  );

  it.each(projectRoutes)(
    "gives $destination desktop copy and imagery distinct, unclipped panes",
    async (currentSlug, destination) => {
      const page = await renderedJump(
        { width: 1280, height: 900 },
        currentSlug,
      );
      const geometry = await endcapGeometry(page);

      expect(
        geometry.sectionWidth / geometry.viewportWidth,
        destination,
      ).toBeGreaterThanOrEqual(0.72);
      expect(
        geometry.sectionWidth / geometry.viewportWidth,
        destination,
      ).toBeLessThanOrEqual(0.84);
      expect(
        Math.abs(
          geometry.sectionLeft -
            (geometry.viewportWidth - geometry.sectionRight),
        ),
        destination,
      ).toBeLessThanOrEqual(1);
      expect(geometry.wellScrollWidth, destination).toBeLessThanOrEqual(
        geometry.wellClientWidth,
      );
      expect(geometry.mediaRight, destination).toBeLessThanOrEqual(
        geometry.wellRight + 1,
      );
      expect(
        geometry.mediaLeft - geometry.textRight,
        `${destination} pane gutter`,
      ).toBeGreaterThanOrEqual(16);
      expect(geometry.titleRight, destination).toBeLessThanOrEqual(
        geometry.textRight,
      );
      expect(geometry.mediaWidth, destination).toBeGreaterThanOrEqual(440);
      expect(geometry.imageObjectFit, destination).toBe("contain");
      expect(geometry.imageComplete, destination).toBe(true);
      expect(geometry.imageNaturalWidth, destination).toBeGreaterThan(0);
      expect(geometry.imageNaturalHeight, destination).toBeGreaterThan(0);

      await page.close();
    },
  );

  it.each(
    phoneViewports.flatMap((viewport) =>
      projectRoutes.map(([currentSlug, destination]) => ({
        ...viewport,
        currentSlug,
        destination,
      })),
    ),
  )(
    "stacks the $destination end card without losing targets at $width px",
    async ({ currentSlug, destination, ...viewport }) => {
      const page = await renderedJump(viewport, currentSlug);
      const geometry = await endcapGeometry(page);

      expect(
        geometry.sectionWidth / geometry.viewportWidth,
        destination,
      ).toBeGreaterThanOrEqual(0.84);
      expect(geometry.sectionLeft, destination).toBeGreaterThanOrEqual(16);
      expect(geometry.sectionRight, destination).toBeLessThanOrEqual(
        geometry.viewportWidth - 16,
      );
      expect(geometry.mediaTop, destination).toBeGreaterThanOrEqual(
        geometry.textBottom,
      );
      expect(geometry.mediaLeft, destination).toBeGreaterThanOrEqual(
        geometry.wellLeft - 1,
      );
      expect(geometry.mediaRight, destination).toBeLessThanOrEqual(
        geometry.wellRight + 1,
      );
      expect(geometry.imageObjectFit, destination).toBe("contain");
      expect(geometry.documentScrollWidth, destination).toBeLessThanOrEqual(
        geometry.viewportWidth,
      );

      const destinationLink = page.locator(".project-work-jump-card");
      const viewAll = page.locator(".project-work-jump-view-all");
      expect(
        (await destinationLink.boundingBox())?.height ?? 0,
      ).toBeGreaterThanOrEqual(44);
      expect((await viewAll.boundingBox())?.height ?? 0).toBeGreaterThanOrEqual(
        44,
      );

      await destinationLink.focus();
      expect(
        await destinationLink.evaluate(
          (link) => getComputedStyle(link).boxShadow,
        ),
      ).not.toBe("none");

      await viewAll.focus();
      const viewAllFocus = await viewAll.evaluate((link) => {
        const style = getComputedStyle(link);
        return {
          outlineStyle: style.outlineStyle,
          outlineWidth: Number.parseFloat(style.outlineWidth),
          boxShadow: style.boxShadow,
        };
      });
      expect(
        (viewAllFocus.outlineStyle !== "none" &&
          viewAllFocus.outlineWidth >= 2) ||
          viewAllFocus.boxShadow !== "none",
      ).toBe(true);

      await page.close();
    },
  );
});
