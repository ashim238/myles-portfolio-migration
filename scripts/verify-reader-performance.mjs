import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const nextDir = resolve(process.cwd(), ".next");
const appManifestPath = resolve(nextDir, "app-build-manifest.json");
const budgetPath = resolve(
  process.cwd(),
  "docs/verification/reader-performance-budgets.json",
);
const reportPath = resolve(nextDir, "reader-performance-report.json");

const routes = [
  "/work/fresh-greens",
  "/work/navi",
  "/work/understandingfafsa",
  "/work/tiktok",
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function normalizedRouteKey(key) {
  const withoutPage = key.endsWith("/page") ? key.slice(0, -5) : key;
  return withoutPage || "/";
}

function routeFiles(pages, route) {
  const exactCandidates = [route, `${route}/page`];
  for (const candidate of exactCandidates) {
    if (Array.isArray(pages[candidate])) return pages[candidate];
  }

  const matchingKey = Object.keys(pages).find(
    (key) => normalizedRouteKey(key) === route,
  );
  return matchingKey ? pages[matchingKey] : undefined;
}

function fileMetrics(files) {
  const uniqueFiles = [...new Set(files)].filter((file) =>
    /\.(?:js|css)$/.test(file),
  );
  const metrics = uniqueFiles.map((file) => {
    const diskPath = resolve(nextDir, file.replace(/^\/+/, ""));
    if (!existsSync(diskPath)) {
      throw new Error(`Reader performance asset is missing: ${file}`);
    }
    return {
      file,
      bytes: statSync(diskPath).size,
      type: file.endsWith(".css") ? "css" : "js",
    };
  });

  return {
    files: metrics,
    fileCount: metrics.length,
    totalBytes: metrics.reduce((sum, item) => sum + item.bytes, 0),
    jsBytes: metrics
      .filter(({ type }) => type === "js")
      .reduce((sum, item) => sum + item.bytes, 0),
    cssBytes: metrics
      .filter(({ type }) => type === "css")
      .reduce((sum, item) => sum + item.bytes, 0),
  };
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

if (!existsSync(appManifestPath)) {
  throw new Error(
    "Reader performance verification requires a completed Next.js production build.",
  );
}

const manifest = readJson(appManifestPath);
const pages = manifest.pages ?? {};
const routeReport = {};

for (const route of routes) {
  const files = routeFiles(pages, route);
  if (!files) {
    const knownReaderKeys = Object.keys(pages).filter((key) =>
      key.includes("/work/"),
    );
    throw new Error(
      `Reader route ${route} was not found in app-build-manifest.json. Known work keys: ${knownReaderKeys.join(", ")}`,
    );
  }
  routeReport[route] = fileMetrics(files);
}

const report = {
  generatedAt: new Date().toISOString(),
  measurement: "uncompressed unique JavaScript and CSS bytes listed for each route in .next/app-build-manifest.json",
  routes: routeReport,
};

writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log("Reader route asset baseline:");
for (const [route, metrics] of Object.entries(routeReport)) {
  console.log(
    `  ${route}: ${formatKb(metrics.totalBytes)} total (${formatKb(metrics.jsBytes)} JS, ${formatKb(metrics.cssBytes)} CSS, ${metrics.fileCount} files)`,
  );
}
console.log(`READER_PERFORMANCE_REPORT=${reportPath}`);

if (!existsSync(budgetPath)) {
  console.log(
    "No Reader performance budget file exists yet. Baseline report completed without enforcement.",
  );
  process.exit(0);
}

const budgets = readJson(budgetPath);
const failures = [];

for (const route of routes) {
  const budget = budgets.routes?.[route];
  const actual = routeReport[route];
  if (!budget) {
    failures.push(`${route}: missing route budget`);
    continue;
  }

  for (const [metric, actualValue] of [
    ["totalBytes", actual.totalBytes],
    ["jsBytes", actual.jsBytes],
    ["cssBytes", actual.cssBytes],
    ["fileCount", actual.fileCount],
  ]) {
    const limit = budget[metric];
    if (!Number.isFinite(limit)) {
      failures.push(`${route}: missing numeric ${metric} budget`);
    } else if (actualValue > limit) {
      failures.push(
        `${route}: ${metric} ${actualValue} exceeds budget ${limit}`,
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Reader performance budget failures:");
  failures.forEach((failure) => console.error(`  - ${failure}`));
  process.exit(1);
}

console.log("Reader route asset budgets passed.");
