import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative, resolve } from "node:path";

const nextDir = resolve(process.cwd(), ".next");
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

function walkFiles(root) {
  if (!existsSync(root)) return [];

  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) visit(path);
      else if (entry.isFile()) files.push(path);
    }
  };

  visit(root);
  return files;
}

function normalizeBuildPath(path) {
  return path
    .replaceAll("\\", "/")
    .replace(/^\/_next\//, "")
    .replace(/^_next\//, "")
    .replace(/^\/+/, "");
}

function routeManifest(allFiles, route) {
  const routeDirectory = `server/app${route}/`;
  const candidates = allFiles.filter((path) => {
    const relativePath = relative(nextDir, path).replaceAll("\\", "/");
    return (
      relativePath.includes(routeDirectory) &&
      basename(path).includes("client-reference-manifest") &&
      path.endsWith(".js")
    );
  });

  return (
    candidates.find((path) =>
      relative(nextDir, path)
        .replaceAll("\\", "/")
        .endsWith(`${routeDirectory}page_client-reference-manifest.js`),
    ) ?? candidates[0]
  );
}

function manifestAssets(path) {
  const source = readFileSync(path, "utf8")
    .replaceAll("\\u002F", "/")
    .replaceAll("\\/", "/");
  const assets = new Set();
  const pattern = /(?:\/_next\/)?(static\/(?:chunks|css)\/[^"'\\\s,}\]]+?\.(?:js|css))/g;

  for (const match of source.matchAll(pattern)) {
    assets.add(normalizeBuildPath(match[1]));
  }

  return [...assets];
}

function fileMetrics(files) {
  const uniqueFiles = [...new Set(files)].filter((file) =>
    /\.(?:js|css)$/.test(file),
  );
  const metrics = uniqueFiles.map((file) => {
    const diskPath = resolve(nextDir, normalizeBuildPath(file));
    if (!existsSync(diskPath)) {
      throw new Error(`Reader performance asset is missing: ${file}`);
    }
    return {
      file: normalizeBuildPath(file),
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

if (!existsSync(nextDir)) {
  throw new Error(
    "Reader performance verification requires a completed Next.js production build.",
  );
}

const allFiles = walkFiles(nextDir);
const routeReport = {};

for (const route of routes) {
  const manifestPath = routeManifest(allFiles, route);
  if (!manifestPath) {
    const knownManifests = allFiles
      .filter((path) => basename(path).includes("client-reference-manifest"))
      .map((path) => relative(nextDir, path).replaceAll("\\", "/"));
    throw new Error(
      `Reader route ${route} has no generated client-reference manifest. Known manifests: ${knownManifests.join(", ")}`,
    );
  }

  const assets = manifestAssets(manifestPath);
  if (assets.length === 0) {
    throw new Error(
      `Reader route ${route} has no JavaScript or CSS assets in ${relative(nextDir, manifestPath)}.`,
    );
  }

  routeReport[route] = {
    manifest: relative(nextDir, manifestPath).replaceAll("\\", "/"),
    ...fileMetrics(assets),
  };
}

const report = {
  generatedAt: new Date().toISOString(),
  measurement:
    "uncompressed unique JavaScript and CSS bytes referenced by each route's generated Next.js client-reference manifest",
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
