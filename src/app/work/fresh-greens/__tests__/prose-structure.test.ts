import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const pagePath = resolve(
  process.cwd(),
  "src/app/work/fresh-greens/page.tsx",
);
const composedCopyPath = resolve(
  process.cwd(),
  "src/components/fresh-greens.tsx",
);

function readPage() {
  return readFileSync(pagePath, "utf8");
}

function getSectionHeadings(source: string) {
  return Array.from(
    source.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g),
    ([, id, title]) => ({ id, title }),
  );
}

describe("Fresh Greens prose structure", () => {
  it("uses varied process headings in the existing section order", () => {
    expect(getSectionHeadings(readPage())).toEqual([
      { id: "fg-problem", title: "Why time and distance were not enough" },
      { id: "fg-research", title: "What six interviews changed" },
      { id: "fg-scoring", title: "How each route gets scored" },
      { id: "fg-pulled-over", title: "A calmer interface for a traffic stop" },
      {
        id: "fg-pivot",
        title: "The Google Maps feature I moved away from",
      },
      { id: "fg-typecolor", title: "Type and color across a trip" },
      { id: "fg-color", title: "Four colors stay reserved for safety" },
      { id: "fg-trust", title: "Moderating community reports" },
      { id: "fg-scope", title: "What shipped and what comes next" },
    ]);
  });

  it("removes redundant scaffolding while keeping the evidence-bearing lead", () => {
    const source = readPage();

    expect(source).not.toContain("case-tier-divider");
    expect(source).not.toContain("The full breakdown");
    expect(source).not.toContain(
      "Community reports and public data share one adapter and one scoring function",
    );
    expect(source).not.toContain("The interface asks before it assumes");
    expect(source).not.toContain("The first pass was a Google Maps feature");
    expect(source).not.toContain("Warm surfaces and a reserved serif");
    expect(source).not.toContain("Four colors and the daylight gradient");
    expect(source).not.toContain("The honest split between");
    expect(source).toContain("Six interviews with Black drivers");
  });

  it("preserves every story-bearing artifact", () => {
    const source = readPage();

    for (const component of [
      "ResearchSynthesis",
      "ArchitectureDiagram",
      "LeadVideo",
      "PulledOverJourney",
      "PivotJourney",
      "OnboardingIllustrationSequence",
      "TokenExhibit",
      "ReservedPalette",
    ]) {
      expect(source).toContain(`<${component}`);
    }

    expect(source).toContain("thesis-zone-flow.png");
    expect(source).toContain('name="en-route"');
    expect(source).toContain('name="route-preview"');
    expect(source).toContain('name="report-detail"');
    expect(source).toContain('className="fg-moderation"');
  });

  it("keeps house punctuation out of composed reserved-palette copy", () => {
    const source = readFileSync(composedCopyPath, "utf8");

    expect(source).not.toContain("affordance — the");
    expect(source).not.toContain("safety-signal work; the");
  });
});
