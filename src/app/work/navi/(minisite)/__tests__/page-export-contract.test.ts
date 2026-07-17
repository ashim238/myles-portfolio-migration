import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const NAVI_VIEW_ROUTES = [
  "src/app/work/navi/(minisite)/demo/host/[slug]/page.tsx",
  "src/app/work/navi/(minisite)/demo/impact/page.tsx",
  "src/app/work/navi/(minisite)/demo/neighborhood/[slug]/page.tsx",
] as const;

describe("Navi page export contract", () => {
  it("keeps testable view components outside Next.js page modules", () => {
    const exportedViews = NAVI_VIEW_ROUTES.flatMap((path) => {
      const source = readFileSync(resolve(process.cwd(), path), "utf8");
      return [...source.matchAll(/export\s+(?:async\s+)?function\s+(\w+View)\b/g)].map(
        ([, name]) => `${path}: ${name}`,
      );
    });

    expect(exportedViews).toEqual([]);
  });
});
