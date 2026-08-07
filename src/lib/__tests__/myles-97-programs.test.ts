import { describe, expect, it } from "vitest";
import {
  buildProgramRegistry,
  isProgramId,
  PROJECT_PROGRAM_BLUEPRINTS,
} from "@/lib/myles-97/programs";
import type { Project } from "@/lib/content";

const project = (slug: string, title: string): Project => ({
  slug,
  title,
  summary: `${title} summary`,
  role: "Product Designer",
  timeframe: "2026",
  status: "published",
  order: 1,
  tags: [],
  sections: [],
  bodyHtml: "",
  coverImage: `/projects/${slug}/cover.png`,
});

describe("Myles 97 program registry", () => {
  it("maps each published project to one purpose-built program", () => {
    const programs = buildProgramRegistry([
      project("fresh-greens", "Fresh Greens"),
      project("understandingfafsa", "UnderstandingFAFSA"),
      project("navi", "Navi"),
      project("tiktok", "TikTok DSA"),
    ]);

    expect(programs.map(({ id, appName, primaryEvidence }) => ({ id, appName, primaryEvidence }))).toEqual([
      { id: "fresh-greens", appName: "Fresh Greens.exe", primaryEvidence: "built" },
      { id: "understandingfafsa", appName: "FAFSA Mail.app", primaryEvidence: "observed" },
      { id: "navi", appName: "Navi Places.exe", primaryEvidence: "built" },
      { id: "tiktok", appName: "TikTok Catalog.studio", primaryEvidence: "shipped" },
    ]);
  });

  it("contains no Microsoft asset references", () => {
    expect(JSON.stringify(PROJECT_PROGRAM_BLUEPRINTS)).not.toMatch(/windows|microsoft|start\.wav/i);
  });

  it("validates both project and system program ids", () => {
    expect(isProgramId("fresh-greens")).toBe(true);
    expect(isProgramId("display-properties")).toBe(true);
    expect(isProgramId("not-a-program")).toBe(false);
  });
});
