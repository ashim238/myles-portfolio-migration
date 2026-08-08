import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.VISUAL_REVIEW_BASE_URL;
const outputDir = resolve(
  process.cwd(),
  process.env.VISUAL_REVIEW_OUTPUT ?? ".visual-review",
);

if (!baseUrl) {
  throw new Error("VISUAL_REVIEW_BASE_URL is required.");
}

const viewports = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 720 },
  tabletLandscape: { width: 1024, height: 768 },
  tabletPortrait: { width: 768, height: 1024 },
  pocket: { width: 390, height: 844, isMobile: true, hasTouch: true },
  pocketSmall: { width: 320, height: 568, isMobile: true, hasTouch: true },
};

const targets = [
  { name: "home-1440x900", path: "/", viewport: viewports.desktop },
  { name: "home-1280x720", path: "/", viewport: viewports.laptop },
  {
    name: "home-1024x768",
    path: "/",
    viewport: viewports.tabletLandscape,
  },
  {
    name: "home-768x1024",
    path: "/",
    viewport: viewports.tabletPortrait,
  },
  { name: "home-390x844", path: "/", viewport: viewports.pocket },
  {
    name: "home-320x568",
    path: "/",
    viewport: viewports.pocketSmall,
  },
  ...[
    ["fresh-greens", "/work/fresh-greens"],
    ["navi", "/work/navi"],
    ["understandingfafsa", "/work/understandingfafsa"],
    ["tiktok", "/work/tiktok"],
  ].flatMap(([name, path]) => [
    {
      name: `${name}-desktop-full`,
      path,
      viewport: viewports.desktop,
      fullPage: true,
    },
    {
      name: `${name}-pocket-full`,
      path,
      viewport: viewports.pocket,
      fullPage: true,
    },
  ]),
  {
    name: "about-pocket-full",
    path: "/about",
    viewport: viewports.pocket,
    fullPage: true,
  },
  {
    name: "resume-pocket-full",
    path: "/resume",
    viewport: viewports.pocket,
    fullPage: true,
  },
  {
    name: "loose-parts-pocket-full",
    path: "/play",
    viewport: viewports.pocket,
    fullPage: true,
  },
  {
    name: "navi-demo-desktop",
    path: "/work/navi/demo",
    viewport: viewports.desktop,
  },
  {
    name: "navi-demo-pocket",
    path: "/work/navi/demo",
    viewport: viewports.pocket,
  },
];

const sleep = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function waitForPreview() {
  let latestError;
  for (let attempt = 1; attempt <= 48; attempt += 1) {
    try {
      const response = await fetch(baseUrl, { redirect: "follow" });
      if (response.ok) return;
      latestError = new Error(`Preview returned HTTP ${response.status}.`);
    } catch (error) {
      latestError = error;
    }
    console.log(`Preview is not ready yet (${attempt}/48).`);
    await sleep(10_000);
  }
  throw latestError ?? new Error("Preview did not become available.");
}

async function wakeLazyMedia(page) {
  await page.evaluate(async () => {
    const delay = (milliseconds) =>
      new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
    const step = Math.max(480, Math.floor(window.innerHeight * 0.75));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(90);
    }
    window.scrollTo(0, 0);
  });
}

await mkdir(outputDir, { recursive: true });
await waitForPreview();

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  captures: [],
};

try {
  for (const target of targets) {
    const { width, height, isMobile = false, hasTouch = false } =
      target.viewport;
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      colorScheme: "dark",
      reducedMotion: "reduce",
      isMobile,
      hasTouch,
    });
    await context.addInitScript(() => {
      localStorage.setItem("theme", "dark");
    });

    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    const url = new URL(target.path, baseUrl).toString();
    console.log(`Capturing ${target.name}: ${url}`);
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 120_000,
    });
    if (!response?.ok()) {
      throw new Error(
        `${target.name} returned HTTP ${response?.status() ?? "unknown"}.`,
      );
    }

    await page.addStyleTag({
      content: `
        vercel-live-feedback,
        [data-vercel-toolbar],
        [data-vercel-feedback],
        .vercel-toolbar { display: none !important; }
      `,
    });
    await wakeLazyMedia(page);
    await page.waitForTimeout(800);

    const metrics = await page.evaluate(() => ({
      title: document.title,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientWidth: document.documentElement.clientWidth,
      clientHeight: document.documentElement.clientHeight,
      horizontalOverflow:
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth + 1,
    }));
    const file = `${target.name}.jpg`;
    await page.screenshot({
      path: resolve(outputDir, file),
      type: "jpeg",
      quality: 82,
      fullPage: target.fullPage ?? false,
    });

    report.captures.push({
      ...target,
      viewport: { width, height, isMobile, hasTouch },
      file,
      url,
      metrics,
      consoleErrors,
      pageErrors,
    });
    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  resolve(outputDir, "manifest.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const failures = report.captures.flatMap((capture) => {
  const messages = [];
  if (capture.metrics.horizontalOverflow) {
    messages.push(`${capture.name}: horizontal overflow`);
  }
  if (capture.pageErrors.length > 0) {
    messages.push(`${capture.name}: ${capture.pageErrors.length} page error(s)`);
  }
  return messages;
});

if (failures.length > 0) {
  console.error("Visual review capture failures:");
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exitCode = 1;
}
