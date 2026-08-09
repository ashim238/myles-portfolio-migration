#!/usr/bin/env node

import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { basename, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";

export const READER_ROUTES = [
  "/work/fresh-greens",
  "/work/navi",
  "/work/understandingfafsa",
  "/work/tiktok",
];

export const MEASUREMENT =
  "uncompressed unique JavaScript and CSS bytes referenced by each route's generated Next.js client-reference manifest";

/**
 * @typedef {{
 *   manifest: string,
 *   files: Array<{ file: string, bytes: number, type: string }>,
 *   totalBytes: number,
 *   jsBytes: number,
 *   cssBytes: number,
 *   fileCount: number,
 * }} RouteMetrics
 */

/** @typedef {Record<string, RouteMetrics>} RouteReport */

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

function routeManifest(nextDir, allFiles, route) {
  const routeDirectory = `server/app${route}/`;
  const candidates = allFiles.filter((path) => {
    const relativePath = relative(nextDir, path).replaceAll("\\", "/");
    return (
      relativePath.startsWith(routeDirectory) &&
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
  const pattern =
    /(?:\/_next\/)?(static\/(?:chunks|css)\/[^"'\\\s,}\]]+?\.(?:js|css))/g;

  for (const match of source.matchAll(pattern)) {
    assets.add(normalizeBuildPath(match[1]));
  }

  return [...assets];
}

function fileMetrics(nextDir, files) {
  const uniqueFiles = [...new Set(files)].filter((file) =>
    /\.(?:js|css)$/.test(file),
  );
  const metrics = uniqueFiles.map((file) => {
    const normalizedFile = normalizeBuildPath(file);
    const diskPath = resolve(nextDir, normalizedFile);
    if (!existsSync(diskPath)) {
      throw new Error(`Reader performance asset is missing: ${file}`);
    }
    return {
      file: normalizedFile,
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

export function buildReaderPerformanceReport({ nextDir, routes }) {
  if (!existsSync(nextDir)) {
    throw new Error(
      "Reader performance verification requires a completed Next.js production build.",
    );
  }

  const allFiles = walkFiles(nextDir);
  /** @type {RouteReport} */
  const routeReport = {};

  for (const route of routes) {
    const manifestPath = routeManifest(nextDir, allFiles, route);
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
      ...fileMetrics(nextDir, assets),
    };
  }

  return {
    generatedAt: new Date().toISOString(),
    measurement: MEASUREMENT,
    routes: routeReport,
  };
}

export function findBudgetFailures({ routeReport, routes, budgets }) {
  const failures = [];

  for (const route of routes) {
    const budget = budgets.routes?.[route];
    const actual = routeReport[route];
    if (!budget) {
      failures.push(`${route}: missing route budget`);
      continue;
    }

    for (const metric of ["totalBytes", "jsBytes", "cssBytes", "fileCount"]) {
      const limit = budget[metric];
      if (!Number.isFinite(limit)) {
        failures.push(`${route}: missing numeric ${metric} budget`);
      } else if (actual[metric] > limit) {
        failures.push(
          `${route}: ${metric} ${actual[metric]} exceeds budget ${limit}`,
        );
      }
    }
  }

  return failures;
}

function formatKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function verifyReaderPerformance({
  projectDir = process.cwd(),
  routes = READER_ROUTES,
} = {}) {
  const nextDir = resolve(projectDir, ".next");
  const budgetPath = resolve(
    projectDir,
    "docs/verification/reader-performance-budgets.json",
  );
  const reportPath = resolve(nextDir, "reader-performance-report.json");

  if (!existsSync(budgetPath)) {
    throw new Error(`Reader performance budget file is missing: ${budgetPath}`);
  }

  const report = buildReaderPerformanceReport({ nextDir, routes });
  writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);

  console.log("Reader route asset baseline:");
  for (const [route, metrics] of Object.entries(report.routes)) {
    console.log(
      `  ${route}: ${formatKb(metrics.totalBytes)} total (${formatKb(metrics.jsBytes)} JS, ${formatKb(metrics.cssBytes)} CSS, ${metrics.fileCount} files)`,
    );
  }
  console.log(`READER_PERFORMANCE_REPORT=${reportPath}`);

  const failures = findBudgetFailures({
    routeReport: report.routes,
    routes,
    budgets: readJson(budgetPath),
  });
  if (failures.length > 0) {
    throw new Error(
      `Reader performance budget failures:\n${failures.map((failure) => `  - ${failure}`).join("\n")}`,
    );
  }

  console.log("Reader route asset budgets passed.");
  return report;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    verifyReaderPerformance();
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}
