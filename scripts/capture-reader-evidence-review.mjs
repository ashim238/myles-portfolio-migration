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
const requestedThemes = (
  process.env.READER_EVIDENCE_REVIEW_THEMES ?? "dark,light"
)
  .split(",")
  .map((theme) => theme.trim());

if (requestedThemes.length === 0 || requestedThemes.some((theme) => !theme)) {
  throw new Error(
    "READER_EVIDENCE_REVIEW_THEMES must select at least one theme.",
  );
}
const unknownThemes = requestedThemes.filter(
  (theme) => theme !== "dark" && theme !== "light",
);
if (unknownThemes.length > 0) {
  throw new Error(
    `READER_EVIDENCE_REVIEW_THEMES contains unknown theme value(s): ${unknownThemes.join(", ")}`,
  );
}
if (new Set(requestedThemes).size !== requestedThemes.length) {
  throw new Error("READER_EVIDENCE_REVIEW_THEMES must not contain duplicate themes.");
}
const themes = requestedThemes;

if (!baseUrl) {
  throw new Error("READER_EVIDENCE_REVIEW_BASE_URL is required.");
}

const viewports = {
  desktop: { width: 1440, height: 900 },
  tabletPocket: { width: 1024, height: 768 },
  tabletWorkstation: { width: 1025, height: 768 },
  coarseTablet: { width: 1024, height: 768, hasTouch: true },
  medium: { width: 820, height: 900 },
  pocket: { width: 390, height: 844, isMobile: true, hasTouch: true },
};
const requestedViewportNames = (
  process.env.READER_EVIDENCE_REVIEW_VIEWPORTS ?? Object.keys(viewports).join(",")
)
  .split(",")
  .map((name) => name.trim());
if (
  requestedViewportNames.length === 0 ||
  requestedViewportNames.some((name) => !name)
) {
  throw new Error(
    "READER_EVIDENCE_REVIEW_VIEWPORTS must select at least one viewport.",
  );
}
if (new Set(requestedViewportNames).size !== requestedViewportNames.length) {
  throw new Error(
    "READER_EVIDENCE_REVIEW_VIEWPORTS must not contain duplicate viewports.",
  );
}
const selectedViewports = Object.fromEntries(
  requestedViewportNames.flatMap((name) =>
    viewports[name] ? [[name, viewports[name]]] : [],
  ),
);

if (Object.keys(selectedViewports).length !== requestedViewportNames.length) {
  const unknown = requestedViewportNames.filter((name) => !viewports[name]);
  throw new Error(
    `READER_EVIDENCE_REVIEW_VIEWPORTS contains unknown viewport(s): ${unknown.join(", ")}`,
  );
}

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
  {
    name: "navi-demo-feed",
    path: "/work/navi/demo",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-demo-search",
    path: "/work/navi/demo/search",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-demo-host-intro",
    path: "/work/navi/demo/host",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-demo-host",
    path: "/work/navi/demo/host/paul-stein",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-demo-impact",
    path: "/work/navi/demo/impact",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-system",
    path: "/work/navi/system",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-demo-neighborhood",
    path: "/work/navi/demo/neighborhood/park-slope",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
  },
  {
    name: "navi-demo-experience",
    path: "/work/navi/demo/experience/prospect-park-carriage",
    proofs: [],
    openingFactsRequired: false,
    viewportNames: ["desktop", "coarseTablet", "pocket"],
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
    for (const [viewportName, viewport] of Object.entries(selectedViewports)) {
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
        if (
          route.viewportNames &&
          !route.viewportNames.includes(viewportName)
        ) {
          continue;
        }
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
        await page.keyboard.press("Tab");

        const routeMetrics = await page.evaluate(() => {
          window.scrollTo(0, 0);
          const focusAuditStyle = document.createElement("style");
          focusAuditStyle.setAttribute("data-reader-focus-audit", "true");
          focusAuditStyle.textContent = "* { transition: none !important; }";
          document.head.append(focusAuditStyle);

          const parseCssColor = (value) => {
            const channels = value.match(/[\d.]+/g)?.map(Number) ?? [];
            if (channels.length < 3) return null;
            if (value.startsWith("color(srgb")) {
              return [
                channels[0] * 255,
                channels[1] * 255,
                channels[2] * 255,
                channels[3] ?? 1,
              ];
            }
            return [
              channels[0],
              channels[1],
              channels[2],
              channels[3] ?? 1,
            ];
          };
          const compositeColor = (foreground, background) => {
            const alpha = foreground[3] ?? 1;
            return [
              foreground[0] * alpha + background[0] * (1 - alpha),
              foreground[1] * alpha + background[1] * (1 - alpha),
              foreground[2] * alpha + background[2] * (1 - alpha),
              1,
            ];
          };
          const backgroundCache = new WeakMap();
          const renderedBackground = (element) => {
            if (!element) return [255, 255, 255, 1];
            const cached = backgroundCache.get(element);
            if (cached) return cached;
            const parentBackground = renderedBackground(element.parentElement);
            const ownBackground = parseCssColor(
              getComputedStyle(element).backgroundColor,
            );
            const background =
              ownBackground && ownBackground[3] > 0
                ? compositeColor(ownBackground, parentBackground)
                : parentBackground;
            backgroundCache.set(element, background);
            return background;
          };
          const relativeLuminance = (color) => {
            const channels = color.slice(0, 3).map((channel) => {
              const normalized = channel / 255;
              return normalized <= 0.04045
                ? normalized / 12.92
                : ((normalized + 0.055) / 1.055) ** 2.4;
            });
            return (
              0.2126 * channels[0] +
              0.7152 * channels[1] +
              0.0722 * channels[2]
            );
          };
          const contrastRatio = (foreground, background) => {
            const foregroundLuminance = relativeLuminance(foreground);
            const backgroundLuminance = relativeLuminance(background);
            return (
              (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
              (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
            );
          };
          const opacityCache = new WeakMap();
          const renderedOpacity = (element) => {
            if (!element) return 1;
            const cached = opacityCache.get(element);
            if (cached !== undefined) return cached;
            const ownOpacity = Number.parseFloat(
              getComputedStyle(element).opacity,
            );
            const effectiveOpacity =
              (Number.isFinite(ownOpacity) ? ownOpacity : 1) *
              renderedOpacity(element.parentElement);
            opacityCache.set(element, effectiveOpacity);
            return effectiveOpacity;
          };
          const textContrastFailures = Array.from(
            document.querySelectorAll("body *"),
          ).flatMap((element) => {
            if (
              !(
                element instanceof HTMLElement ||
                element instanceof SVGTextElement
              )
            ) {
              return [];
            }
            if (
              element.matches(".sr-only") ||
              element.closest('[aria-hidden="true"]') ||
              element.closest(":disabled, [aria-disabled='true']")
            ) {
              return [];
            }
            const style = getComputedStyle(element);
            if (style.display === "none" || style.visibility === "hidden") {
              return [];
            }
            const text = Array.from(element.childNodes)
              .filter((node) => node.nodeType === Node.TEXT_NODE)
              .map((node) => node.textContent?.trim() ?? "")
              .join(" ")
              .trim();
            if (!text) return [];
            const svgFill =
              element instanceof SVGTextElement
                ? parseCssColor(style.fill)
                : null;
            const rawForeground = svgFill ?? parseCssColor(style.color);
            if (!rawForeground) return [];
            const effectiveOpacity = renderedOpacity(element);
            if (effectiveOpacity <= 0.01) return [];
            const background = renderedBackground(element);
            const foreground = compositeColor(
              [
                rawForeground[0],
                rawForeground[1],
                rawForeground[2],
                rawForeground[3] * effectiveOpacity,
              ],
              background,
            );
            const fontSize = Number.parseFloat(style.fontSize);
            const fontWeight = Number.parseInt(style.fontWeight, 10) || 400;
            const requiredRatio =
              fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700)
                ? 3
                : 4.5;
            const actualRatio = contrastRatio(foreground, background);
            if (actualRatio + 0.01 >= requiredRatio) return [];
            return [
              {
                selector:
                  element.getAttribute("class") || element.tagName,
                text: text.slice(0, 120),
                foreground: style.color,
                background: `rgb(${background
                  .slice(0, 3)
                  .map(Math.round)
                  .join(", ")})`,
                actualRatio: Number(actualRatio.toFixed(2)),
                requiredRatio,
                effectiveOpacity: Number(effectiveOpacity.toFixed(3)),
              },
            ];
          });

          const coarsePointer = window.matchMedia(
            "(pointer: coarse), (any-pointer: coarse)",
          ).matches;
          const associatedLabelFor = (element) => {
            if (!(element instanceof HTMLInputElement)) return null;
            const wrappingLabel = element.closest("label");
            if (wrappingLabel) return wrappingLabel;
            return element.id
              ? document.querySelector(`label[for="${CSS.escape(element.id)}"]`)
              : null;
          };
          const coarseTargetSelector = [
            "button",
            'input:not([type="hidden"])',
            "select",
            "textarea",
            '[role="button"]',
            ".reader-return",
            ".project-toc-link",
            ".project-work-jump-card",
            ".project-work-jump-view-all",
            '.leaflet-marker-icon[tabindex="0"]',
            ".leaflet-control-zoom a",
            ".nv-nav a",
          ].join(",");
          const undersizedTargets = coarsePointer
            ? Array.from(document.querySelectorAll(coarseTargetSelector)).flatMap(
                (element) => {
                  if (!(element instanceof HTMLElement)) return [];
                  const style = getComputedStyle(element);
                  const box = element.getBoundingClientRect();
                  const associatedLabel = associatedLabelFor(element);
                  const associatedLabelBox =
                    associatedLabel?.getBoundingClientRect();
                  const effectiveTargetBox =
                    associatedLabelBox &&
                    associatedLabelBox.width >= box.width &&
                    associatedLabelBox.height >= box.height
                      ? associatedLabelBox
                      : box;
                  if (
                    style.display === "none" ||
                    style.visibility === "hidden" ||
                    style.pointerEvents === "none" ||
                    element.matches(":disabled, [aria-disabled='true']") ||
                    box.width === 0 ||
                    box.height === 0
                  ) {
                    return [];
                  }
                  if (
                    effectiveTargetBox.width >= 44 &&
                    effectiveTargetBox.height >= 44
                  ) {
                    return [];
                  }
                  return [
                    {
                      selector:
                        element.className?.toString() || element.tagName,
                      label:
                        element.getAttribute("aria-label") ||
                        element.textContent?.trim().slice(0, 80) ||
                        element.tagName,
                      width: Number(effectiveTargetBox.width.toFixed(2)),
                      height: Number(effectiveTargetBox.height.toFixed(2)),
                      measuredBy:
                        effectiveTargetBox === associatedLabelBox
                          ? "associated label"
                          : "element",
                    },
                  ];
                },
              )
            : [];

          const focusableSelector = [
            "a[href]",
            "button",
            'input:not([type="hidden"])',
            "select",
            "textarea",
            '[tabindex]:not([tabindex="-1"])',
          ].join(",");
          const focusIndicatorFailures = Array.from(
            document.querySelectorAll(focusableSelector),
          ).flatMap((element) => {
            if (!(element instanceof HTMLElement)) return [];
            const restingStyle = getComputedStyle(element);
            const box = element.getBoundingClientRect();
            if (
              restingStyle.display === "none" ||
              restingStyle.visibility === "hidden" ||
              restingStyle.pointerEvents === "none" ||
              element.matches(":disabled, [aria-disabled='true']") ||
              box.width === 0 ||
              box.height === 0
            ) {
              return [];
            }

            element.focus({ preventScroll: true });
            const associatedLabel = associatedLabelFor(element);
            const elementFocusStyle = getComputedStyle(element);
            const labelFocusStyle = associatedLabel
              ? getComputedStyle(associatedLabel)
              : null;
            const labelHasOutline = Boolean(
              labelFocusStyle &&
                labelFocusStyle.outlineStyle !== "none" &&
                Number.parseFloat(labelFocusStyle.outlineWidth) >= 2,
            );
            const focusIndicatorElement = labelHasOutline
              ? associatedLabel
              : element;
            const focusStyle = labelHasOutline
              ? labelFocusStyle
              : elementFocusStyle;
            if (!focusIndicatorElement || !focusStyle) return [];
            const focusIndicatorBox =
              focusIndicatorElement.getBoundingClientRect();
            const outlineColor = parseCssColor(focusStyle.outlineColor);
            const outlineWidth = Number.parseFloat(focusStyle.outlineWidth);
            const outlineOffset = Number.parseFloat(focusStyle.outlineOffset);
            const adjacentBackground = renderedBackground(
              focusIndicatorElement.parentElement,
            );
            const actualRatio = outlineColor
              ? contrastRatio(outlineColor, adjacentBackground)
              : 0;
            const outlineReach = Math.max(
              0,
              outlineWidth +
                (Number.isFinite(outlineOffset) ? outlineOffset : 0),
            );
            let focusIndicatorClipped = false;
            for (
              let ancestor = focusIndicatorElement.parentElement;
              ancestor && ancestor !== document.body;
              ancestor = ancestor.parentElement
            ) {
              const ancestorStyle = getComputedStyle(ancestor);
              if (
                !/hidden|clip/.test(
                  `${ancestorStyle.overflow} ${ancestorStyle.overflowX} ${ancestorStyle.overflowY}`,
                )
              ) {
                continue;
              }
              const ancestorBox = ancestor.getBoundingClientRect();
              if (
                focusIndicatorBox.left - outlineReach < ancestorBox.left - 0.5 ||
                focusIndicatorBox.top - outlineReach < ancestorBox.top - 0.5 ||
                focusIndicatorBox.right + outlineReach > ancestorBox.right + 0.5 ||
                focusIndicatorBox.bottom + outlineReach > ancestorBox.bottom + 0.5
              ) {
                focusIndicatorClipped = true;
                break;
              }
            }
            const visibleOutline =
              element.matches(":focus-visible") &&
              focusStyle.outlineStyle !== "none" &&
              outlineWidth >= 2 &&
              Boolean(outlineColor) &&
              !focusIndicatorClipped;
            if (visibleOutline && actualRatio + 0.01 >= 3) return [];

            return [
              {
                selector:
                  element.getAttribute("class") || element.tagName,
                label:
                  element.getAttribute("aria-label") ||
                  element.textContent?.trim().slice(0, 80) ||
                  element.tagName,
                outlineColor: focusStyle.outlineColor,
                outlineStyle: focusStyle.outlineStyle,
                outlineWidth,
                outlineOffset,
                focusIndicatorClipped,
                measuredBy: labelHasOutline ? "associated label" : "element",
                adjacentBackground: `rgb(${adjacentBackground
                  .slice(0, 3)
                  .map(Math.round)
                  .join(", ")})`,
                actualRatio: Number(actualRatio.toFixed(2)),
              },
            ];
          });
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
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
          const openingFactsBlock = document.querySelector(
            ".project-opening-facts",
          );
          const openingFactsBlockBox =
            openingFactsBlock?.getBoundingClientRect();
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
            openingFactsBlock: openingFactsBlockBox
              ? {
                  box: {
                    x: openingFactsBlockBox.x,
                    y: openingFactsBlockBox.y,
                    width: openingFactsBlockBox.width,
                    height: openingFactsBlockBox.height,
                    right: openingFactsBlockBox.right,
                    bottom: openingFactsBlockBox.bottom,
                  },
                }
              : null,
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
            textContrastFailures,
            coarsePointer,
            undersizedTargets,
            focusIndicatorFailures,
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
          openingFactsRequired: route.openingFactsRequired !== false,
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
  if (route.metrics.textContrastFailures.length > 0) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: Text contrast ` +
        `failed for ${route.metrics.textContrastFailures.length} rendered role(s)`,
    );
  }
  if (route.metrics.undersizedTargets.length > 0) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: 44px coarse-pointer target ` +
        `failed for ${route.metrics.undersizedTargets.length} control(s)`,
    );
  }
  if (route.metrics.focusIndicatorFailures.length > 0) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: 3:1 focus indicator ` +
        `failed for ${route.metrics.focusIndicatorFailures.length} control(s)`,
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
  if (route.openingFactsRequired === false) return [];
  const messages = [];
  const openingFactsBlock = route.metrics.openingFactsBlock;
  if (!openingFactsBlock) {
    messages.push(
      `${route.name}/${route.theme}/${route.viewport.name}: missing opening facts block`,
    );
  } else {
    const clearance =
      route.metrics.firstFoldLimit - openingFactsBlock.box.bottom;
    const isFullyVisible =
      openingFactsBlock.box.width > 0 &&
      openingFactsBlock.box.height > 0 &&
      openingFactsBlock.box.y >= 0 &&
      clearance >= MIN_OPENING_FOLD_GAP;
    if (!isFullyVisible) {
      messages.push(
        `${route.name}/${route.theme}/${route.viewport.name}: opening facts block ` +
          `actual clearance ${clearance.toFixed(1)}px; ` +
          `required ${MIN_OPENING_FOLD_GAP}px`,
      );
    }
  }

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

    const clearance = route.metrics.firstFoldLimit - fact.box.bottom;
    const isFullyVisible =
      fact.box.width > 0 &&
      fact.box.height > 0 &&
      fact.box.y >= 0 &&
      clearance >= MIN_OPENING_FOLD_GAP;
    if (!isFullyVisible) {
      messages.push(
        `${route.name}/${route.theme}/${route.viewport.name}: ${label} opening fact ` +
          `actual clearance ${clearance.toFixed(1)}px; ` +
          `required ${MIN_OPENING_FOLD_GAP}px`,
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
