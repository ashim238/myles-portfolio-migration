import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.READER_EVIDENCE_REVIEW_BASE_URL;
const outputDir = resolve(
  process.cwd(),
  process.env.READER_EVIDENCE_REVIEW_OUTPUT ?? "reader-evidence-review",
);
const MIN_PROOF_TO_SUMMARY_GAP = 0;
const MAX_PROOF_TO_SUMMARY_GAP = 64;
const MIN_OPENING_FOLD_GAP = 8;
const requiredOpeningFacts = ["Role", "Scope", "Outcome", "Proof"];
const themes = (process.env.READER_EVIDENCE_REVIEW_THEMES ?? "dark,light")
  .split(",")
  .map((theme) => theme.trim())
  .filter((theme) => theme === "dark" || theme === "light");

if (themes.length === 0) {
  throw new Error(
    "READER_EVIDENCE_REVIEW_THEMES must include dark, light, or both.",
  );
}

if (!baseUrl) {
  throw new Error("READER_EVIDENCE_REVIEW_BASE_URL is required.");
}

const viewports = {
  desktop: { width: 1440, height: 900 },
  tabletPocket: { width: 1024, height: 768 },
  tabletWorkstation: { width: 1025, height: 768 },
  medium: { width: 820, height: 900 },
  pocket: { width: 390, height: 844, isMobile: true, hasTouch: true },
};

const routes = [
  {
    name: "fresh-greens",
    path: "/work/fresh-greens",
    proofs: [
      {
        id: "fresh-greens-pivot-journey",
        artifactSelectors: [".fg-pivot", ".fg-arch"],
      },
      {
        id: "fresh-greens-report-moderation",
        artifactSelectors: [".fg-safety-visual", ".fg-moderation"],
      },
    ],
  },
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
  {
    name: "tiktok",
    path: "/work/tiktok",
    proofs: [
      {
        id: "tiktok-template-system",
        artifactSelectors: [".tt-template-system", ".tt-preview-process"],
      },
      {
        id: "tiktok-light-academia-sequence",
        artifactSelectors: [".tt-outcome-sequence", ".project-section-body"],
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

async function measureDocumentBox(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + window.scrollX,
      y: rect.top + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  });
}

async function captureProof(
  page,
  routeName,
  theme,
  viewportName,
  proof,
  report,
) {
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

  const chapterBox = await measureDocumentBox(chapter);
  const summaryBox = await measureDocumentBox(summary);
  const artifactBoxes = [];
  for (const artifact of artifactLocators) {
    artifactBoxes.push(await measureDocumentBox(artifact));
  }

  const artifactBottom = Math.max(
    ...artifactBoxes.map((box) => box.y + box.height),
  );
  const prefix = `${routeName}-${proof.id}-${theme}-${viewportName}`;
  const chapterFile = `${prefix}-chapter.jpg`;
  const summaryFile = `${prefix}-summary.png`;
  const artifactFiles = [];

  await chapter.screenshot({
    path: resolve(outputDir, chapterFile),
    type: "jpeg",
    quality: 82,
  });
  await summary.screenshot({
    path: resolve(outputDir, summaryFile),
    type: "png",
  });

  for (const [index, artifact] of artifactLocators.entries()) {
    const artifactFile = `${prefix}-artifact-${index + 1}.png`;
    await artifact.screenshot({
      path: resolve(outputDir, artifactFile),
      type: "png",
    });
    artifactFiles.push(artifactFile);
  }

  report.proofs.push({
    route: routeName,
    theme,
    viewport: viewportName,
    proof: proof.id,
    artifactSelectors: proof.artifactSelectors,
    chapterBox,
    artifactBoxes,
    summaryBox,
    artifactToSummaryGap: Math.round(summaryBox.y - artifactBottom),
    chapterFile,
    artifactFiles,
    summaryFile,
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
  for (const theme of themes) {
    for (const [viewportName, viewport] of Object.entries(viewports)) {
      const { width, height, isMobile = false, hasTouch = false } = viewport;
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: 1,
        colorScheme: theme,
        reducedMotion: "reduce",
        isMobile,
        hasTouch,
      });
      await context.addInitScript((selectedTheme) => {
        localStorage.setItem("theme", selectedTheme);
      }, theme);

      for (const route of routes) {
        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        page.on("console", (message) => {
          if (message.type() === "error") consoleErrors.push(message.text());
        });
        page.on("pageerror", (error) => pageErrors.push(error.message));

        const url = new URL(route.path, baseUrl).toString();
        console.log(
          `Reviewing ${route.name} in ${theme} at ${width}x${height}: ${url}`,
        );
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

        const routeMetrics = await page.evaluate(() => {
          window.scrollTo(0, 0);

          const chapterControl = document.querySelector(".project-toc");
          const chapterControlBox = chapterControl?.getBoundingClientRect();
          const chapterControlStyle = chapterControl
            ? getComputedStyle(chapterControl)
            : null;
          const hasVisibleFixedChapterControl = Boolean(
            chapterControlBox &&
              chapterControlStyle?.position === "fixed" &&
              chapterControlBox.width > 0 &&
              chapterControlBox.height > 0 &&
              chapterControlBox.bottom > 0 &&
              chapterControlBox.top < window.innerHeight,
          );
          const firstFoldLimit = hasVisibleFixedChapterControl
            ? Math.min(
                window.innerHeight,
                chapterControlBox?.top ?? window.innerHeight,
              )
            : window.innerHeight;
          const openingFacts = Array.from(
            document.querySelectorAll(".project-opening-facts-row"),
          ).map((row) => {
            const box = row.getBoundingClientRect();
            return {
              label: row.querySelector("dt")?.textContent?.trim() ?? "",
              box: {
                x: box.x,
                y: box.y,
                width: box.width,
                height: box.height,
                right: box.right,
                bottom: box.bottom,
              },
            };
          });

          return {
            title: document.title,
            theme: document.documentElement.dataset.theme,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            scrollWidth: document.documentElement.scrollWidth,
            scrollHeight: document.documentElement.scrollHeight,
            clientWidth: document.documentElement.clientWidth,
            clientHeight: document.documentElement.clientHeight,
            firstFoldLimit,
            chapterControlBox: chapterControlBox
              ? {
                  x: chapterControlBox.x,
                  y: chapterControlBox.y,
                  width: chapterControlBox.width,
                  height: chapterControlBox.height,
                  right: chapterControlBox.right,
                  bottom: chapterControlBox.bottom,
                }
              : null,
            openingFacts,
            horizontalOverflow:
              document.documentElement.scrollWidth >
              document.documentElement.clientWidth + 1,
            brokenImages: Array.from(document.images)
              .filter((image) => image.complete && image.naturalWidth === 0)
              .map((image) => image.currentSrc || image.src),
          };
        });
        const fullPageFile = `${route.name}-${theme}-${viewportName}-full.jpg`;
        await page.screenshot({
          path: resolve(outputDir, fullPageFile),
          type: "jpeg",
          quality: 68,
          fullPage: true,
        });

        report.routes.push({
          name: route.name,
          path: route.path,
          theme,
          viewport: { name: viewportName, width, height, isMobile, hasTouch },
          file: fullPageFile,
          metrics: routeMetrics,
          consoleErrors,
          pageErrors,
        });

        for (const proof of route.proofs) {
          await captureProof(
            page,
            route.name,
            theme,
            viewportName,
            proof,
            report,
          );
        }

        await page.close();
      }

      await context.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(
  resolve(outputDir, "manifest.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);

const routeFailures = report.routes.flatMap((route) => {
  const messages = [];
  if (route.metrics.horizontalOverflow) {
    messages.push(`${route.name}/${route.viewport.name}: horizontal overflow`);
  }
  if (route.metrics.theme !== route.theme) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: expected ` +
        `${route.theme} theme but found ${route.metrics.theme || "unset"}`,
    );
  }
  if (route.pageErrors.length > 0) {
    messages.push(
      `${route.name}/${route.viewport.name}: ${route.pageErrors.length} page error(s)`,
    );
  }
  if (route.consoleErrors.length > 0) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: ` +
        `${route.consoleErrors.length} console error(s)`,
    );
  }
  if (route.metrics.brokenImages.length > 0) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: ` +
        `${route.metrics.brokenImages.length} broken image(s)`,
    );
  }
  return messages;
});

const proofFailures = report.proofs.flatMap((proof) => {
  if (
    proof.artifactToSummaryGap >= MIN_PROOF_TO_SUMMARY_GAP &&
    proof.artifactToSummaryGap <= MAX_PROOF_TO_SUMMARY_GAP
  ) {
    return [];
  }

  return [
    `${proof.route}/${proof.viewport}/${proof.proof}: proof-to-summary gap ` +
      `${proof.artifactToSummaryGap}px is outside ` +
      `${MIN_PROOF_TO_SUMMARY_GAP}-${MAX_PROOF_TO_SUMMARY_GAP}px`,
  ];
});

const openingFailures = report.routes.flatMap((route) => {
  const messages = [];
  for (const label of requiredOpeningFacts) {
    const fact = route.metrics.openingFacts.find(
      (openingFact) => openingFact.label === label,
    );
    if (!fact) {
      messages.push(
        `${route.name}/${route.theme}/${route.viewport.name}: missing ${label} opening fact`,
      );
      continue;
    }

    const isFullyVisible =
      fact.box.width > 0 &&
      fact.box.height > 0 &&
      fact.box.y >= 0 &&
      fact.box.bottom <=
        route.metrics.firstFoldLimit - MIN_OPENING_FOLD_GAP;
    if (!isFullyVisible) {
      messages.push(
        `${route.name}/${route.theme}/${route.viewport.name}: ${label} opening fact ` +
          `ends at ${Math.round(fact.box.bottom)}px beyond the ` +
          `${Math.round(route.metrics.firstFoldLimit)}px first-fold limit`,
      );
    }
  }
  return messages;
});

const failures = [...routeFailures, ...proofFailures, ...openingFailures];
if (failures.length > 0) {
  console.error("Reader evidence visual-review failures:");
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exitCode = 1;
}
