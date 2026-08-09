import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.READER_EVIDENCE_REVIEW_BASE_URL;
const outputDir = resolve(
  process.cwd(),
  process.env.READER_EVIDENCE_REVIEW_OUTPUT ?? "reader-evidence-review",
);

if (!baseUrl) {
  throw new Error("READER_EVIDENCE_REVIEW_BASE_URL is required.");
}

const viewports = {
  desktop: { width: 1440, height: 900 },
  pocket: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

const routes = [
  {
    name: "navi",
    path: "/work/navi",
    proofs: [
      {
        id: "navi-research-artifacts",
        artifactSelectors: [".nv-research-artifacts"],
      },
      {
        id: "navi-booking-demo",
        artifactSelectors: [".nv-demo-embed"],
      },
    ],
  },
  {
    name: "understandingfafsa",
    path: "/work/understandingfafsa",
    proofs: [
      {
        id: "fafsa-composer-demo",
        artifactSelectors: [".uf-switcher", ".uf-composer-demo"],
      },
      {
        id: "fafsa-figma-mailchimp",
        artifactSelectors: [".uf-figma-pair"],
      },
    ],
  },
];

const sleep = (milliseconds) =>
  new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));

async function waitForApp() {
  let latestError;
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    try {
      const response = await fetch(baseUrl, { redirect: "follow" });
      if (response.ok) return;
      latestError = new Error(`App returned HTTP ${response.status}.`);
    } catch (error) {
      latestError = error;
    }
    await sleep(2_000);
  }
  throw latestError ?? new Error("The local app did not become available.");
}

async function wakeLazyMedia(page) {
  await page.evaluate(async () => {
    const delay = (milliseconds) =>
      new Promise((resolvePromise) => setTimeout(resolvePromise, milliseconds));
    const step = Math.max(520, Math.floor(window.innerHeight * 0.78));
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(70);
    }
    window.scrollTo(0, 0);
  });
}

function toDocumentBox(box, scroll) {
  return {
    x: box.x + scroll.x,
    y: box.y + scroll.y,
    width: box.width,
    height: box.height,
  };
}

function expandedBox(boxes, pageMetrics, padding = 28) {
  const left = Math.max(0, Math.min(...boxes.map((box) => box.x)) - padding);
  const top = Math.max(0, Math.min(...boxes.map((box) => box.y)) - padding);
  const right = Math.min(
    pageMetrics.scrollWidth,
    Math.max(...boxes.map((box) => box.x + box.width)) + padding,
  );
  const bottom = Math.min(
    pageMetrics.scrollHeight,
    Math.max(...boxes.map((box) => box.y + box.height)) + padding,
  );

  return {
    x: left,
    y: top,
    width: Math.max(1, right - left),
    height: Math.max(1, bottom - top),
  };
}

async function captureProof(page, routeName, viewportName, proof, report) {
  const chapter = page.locator(`[data-dominant-proof="${proof.id}"]`).first();
  await chapter.waitFor({ state: "visible", timeout: 30_000 });

  const summary = chapter
    .locator(`.reader-evidence-summary[data-evidence-for="${proof.id}"]`)
    .first();
  await summary.waitFor({ state: "visible", timeout: 30_000 });

  const artifactLocators = proof.artifactSelectors.map((selector) =>
    chapter.locator(selector).first(),
  );
  for (const artifact of artifactLocators) {
    await artifact.waitFor({ state: "visible", timeout: 30_000 });
  }

  await summary.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  const scroll = await page.evaluate(() => ({ x: window.scrollX, y: window.scrollY }));
  const rawChapterBox = await chapter.boundingBox();
  const rawSummaryBox = await summary.boundingBox();
  const rawArtifactBoxes = [];
  for (const artifact of artifactLocators) {
    const box = await artifact.boundingBox();
    if (box) rawArtifactBoxes.push(box);
  }

  if (!rawChapterBox || !rawSummaryBox || rawArtifactBoxes.length === 0) {
    throw new Error(`Could not measure evidence composition for ${proof.id}.`);
  }

  const chapterBox = toDocumentBox(rawChapterBox, scroll);
  const summaryBox = toDocumentBox(rawSummaryBox, scroll);
  const artifactBoxes = rawArtifactBoxes.map((box) =>
    toDocumentBox(box, scroll),
  );
  const pageMetrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
    clientWidth: document.documentElement.clientWidth,
    clientHeight: document.documentElement.clientHeight,
  }));
  const artifactBottom = Math.max(
    ...artifactBoxes.map((box) => box.y + box.height),
  );
  const focusedClip = expandedBox(
    [...artifactBoxes, summaryBox],
    pageMetrics,
    viewportName === "pocket" ? 14 : 28,
  );
  const prefix = `${routeName}-${proof.id}-${viewportName}`;

  await page.screenshot({
    path: resolve(outputDir, `${prefix}-composition.jpg`),
    type: "jpeg",
    quality: 82,
    clip: focusedClip,
  });
  await summary.screenshot({
    path: resolve(outputDir, `${prefix}-summary.png`),
    type: "png",
  });

  report.proofs.push({
    route: routeName,
    viewport: viewportName,
    proof: proof.id,
    artifactSelectors: proof.artifactSelectors,
    chapterBox,
    artifactBoxes,
    summaryBox,
    artifactToSummaryGap: Math.round(summaryBox.y - artifactBottom),
    compositionFile: `${prefix}-composition.jpg`,
    summaryFile: `${prefix}-summary.png`,
  });
}

await mkdir(outputDir, { recursive: true });
await waitForApp();

const browser = await chromium.launch({ headless: true });
const report = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  routes: [],
  proofs: [],
};

try {
  for (const [viewportName, viewport] of Object.entries(viewports)) {
    const { width, height, isMobile = false, hasTouch = false } = viewport;
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

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => pageErrors.push(error.message));

      const url = new URL(route.path, baseUrl).toString();
      console.log(`Reviewing ${route.name} at ${width}x${height}: ${url}`);
      const response = await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 120_000,
      });
      if (!response?.ok()) {
        throw new Error(
          `${route.name} returned HTTP ${response?.status() ?? "unknown"}.`,
        );
      }

      await page
        .waitForLoadState("networkidle", { timeout: 30_000 })
        .catch(() => undefined);
      await wakeLazyMedia(page);
      await page.waitForTimeout(800);

      const routeMetrics = await page.evaluate(() => ({
        title: document.title,
        scrollWidth: document.documentElement.scrollWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientWidth: document.documentElement.clientWidth,
        clientHeight: document.documentElement.clientHeight,
        horizontalOverflow:
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1,
      }));
      const fullPageFile = `${route.name}-${viewportName}-full.jpg`;
      await page.screenshot({
        path: resolve(outputDir, fullPageFile),
        type: "jpeg",
        quality: 68,
        fullPage: true,
      });

      report.routes.push({
        name: route.name,
        path: route.path,
        viewport: { name: viewportName, width, height, isMobile, hasTouch },
        file: fullPageFile,
        metrics: routeMetrics,
        consoleErrors,
        pageErrors,
      });

      for (const proof of route.proofs) {
        await captureProof(page, route.name, viewportName, proof, report);
      }

      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  resolve(outputDir, "manifest.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const failures = report.routes.flatMap((route) => {
  const messages = [];
  if (route.metrics.horizontalOverflow) {
    messages.push(`${route.name}/${route.viewport.name}: horizontal overflow`);
  }
  if (route.pageErrors.length > 0) {
    messages.push(
      `${route.name}/${route.viewport.name}: ${route.pageErrors.length} page error(s)`,
    );
  }
  return messages;
});

if (failures.length > 0) {
  console.error("Reader evidence visual-review failures:");
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exitCode = 1;
}
