import {
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  buildReaderPerformanceReport,
  findBudgetFailures,
} from "../../../../scripts/verify-reader-performance.mjs";

const temporaryDirectories: string[] = [];

function temporaryBuild() {
  const directory = mkdtempSync(join(tmpdir(), "reader-performance-"));
  temporaryDirectories.push(directory);
  return directory;
}

function writeFixture(root: string, path: string, contents: string | Buffer) {
  const target = join(root, path);
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, contents);
}

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

describe("Reader performance report", () => {
  it("counts each generated client asset once even when the manifest repeats it", () => {
    const nextDir = temporaryBuild();
    writeFixture(nextDir, "static/chunks/shared.js", Buffer.alloc(100));
    writeFixture(nextDir, "static/css/reader.css", Buffer.alloc(40));
    writeFixture(
      nextDir,
      "server/app/work/example/page_client-reference-manifest.js",
      [
        '"/_next/static/chunks/shared.js"',
        '"static/chunks/shared.js"',
        '"static/css/reader.css"',
      ].join(","),
    );

    const report = buildReaderPerformanceReport({
      nextDir,
      routes: ["/work/example"],
    });

    expect(report.routes["/work/example"]).toMatchObject({
      totalBytes: 140,
      jsBytes: 100,
      cssBytes: 40,
      fileCount: 2,
    });
  });

  it("rejects a generated route whose manifest points to a missing asset", () => {
    const nextDir = temporaryBuild();
    writeFixture(
      nextDir,
      "server/app/work/example/page_client-reference-manifest.js",
      '"static/chunks/missing.js"',
    );

    expect(() =>
      buildReaderPerformanceReport({
        nextDir,
        routes: ["/work/example"],
      }),
    ).toThrow("Reader performance asset is missing");
  });
});

describe("Reader performance budgets", () => {
  const routeReport = {
    "/work/example": {
      manifest:
        "server/app/work/example/page_client-reference-manifest.js",
      files: [],
      totalBytes: 140,
      jsBytes: 100,
      cssBytes: 40,
      fileCount: 2,
    },
  };

  it("reports every exceeded byte and file-count ceiling", () => {
    expect(
      findBudgetFailures({
        routeReport,
        routes: ["/work/example"],
        budgets: {
          routes: {
            "/work/example": {
              totalBytes: 139,
              jsBytes: 99,
              cssBytes: 39,
              fileCount: 1,
            },
          },
        },
      }),
    ).toEqual([
      "/work/example: totalBytes 140 exceeds budget 139",
      "/work/example: jsBytes 100 exceeds budget 99",
      "/work/example: cssBytes 40 exceeds budget 39",
      "/work/example: fileCount 2 exceeds budget 1",
    ]);
  });

  it("fails closed when a route or metric has no numeric budget", () => {
    expect(
      findBudgetFailures({
        routeReport,
        routes: ["/work/example", "/work/missing"],
        budgets: {
          routes: {
            "/work/example": {
              totalBytes: 140,
              jsBytes: 100,
              cssBytes: 40,
            },
          },
        },
      }),
    ).toEqual([
      "/work/example: missing numeric fileCount budget",
      "/work/missing: missing route budget",
    ]);
  });
});
