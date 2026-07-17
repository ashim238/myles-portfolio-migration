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
const projectContentPath = resolve(
  process.cwd(),
  "content/projects/fresh-greens.md",
);
const portfolioStylesPath = resolve(
  process.cwd(),
  "src/app/globals.css",
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
      { id: "fg-scope", title: "What I built and what still needs proof" },
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
    expect(source).toContain('name="report-picker"');
    expect(source).toContain('name="report-detail"');
    expect(source).toContain('className="fg-moderation"');
  });

  it("keeps house punctuation out of composed reserved-palette copy", () => {
    const source = readFileSync(composedCopyPath, "utf8");

    expect(source).not.toContain("affordance — the");
    expect(source).not.toContain("safety-signal work; the");
  });

  it("distinguishes public data from community input and keeps color categories consistent", () => {
    const component = readFileSync(composedCopyPath, "utf8");
    const page = readPage();

    expect(component).not.toContain("eight public data sources");
    expect(component).toContain("Eight data inputs");
    expect(component).toContain("local-first in the prototype");
    expect(component).toContain("Supabase and Postgres path behind configuration");
    expect(component).toContain("local-first · Supabase when configured");
    expect(component).not.toContain("the only non-reserved color");
    expect(component).not.toContain("Postgres + RLS");
    expect(component).not.toContain("held in Postgres under row-level security");
    expect(page).not.toContain("the one non-reserved color");
    expect(component).toContain("general interface color");
  });

  it("separates interview evidence, implemented behavior, and unproven outcomes", () => {
    const source = readPage();

    expect(source).toContain("Interview-supported");
    expect(source).toContain("Built in the prototype");
    expect(source).toContain("Not yet proven");
    expect(source).toContain('aria-label="Fresh Greens evidence boundaries"');
  });

  it("anchors the opener to interview evidence without an absolute historical claim", () => {
    const source = readPage();

    expect(source).toContain("In interviews, Black drivers described routes");
    expect(source).not.toContain("For a Black driver");
    expect(source).not.toContain("The Green Book was a routing system");
    expect(source).not.toContain("no institutional one existed");
  });

  it("keeps the evidence labels in the portfolio's sentence-case type system", () => {
    const styles = readFileSync(portfolioStylesPath, "utf8");
    const labelRule = styles.match(/\.fg-evidence-label\s*\{([^}]+)\}/)?.[1];

    expect(labelRule).toBeDefined();
    expect(labelRule).not.toMatch(/text-transform:\s*uppercase/);
    expect(labelRule).not.toMatch(/font-family:\s*var\(--font-mono\)/);
  });

  it("does not present prototype mechanics or output volume as validated safety outcomes", () => {
    const source = `${readPage()}\n${readFileSync(projectContentPath, "utf8")}`;

    expect(source).not.toMatch(/every score labeled by source/i);
    expect(source).not.toMatch(/with source labels/i);
    expect(source).not.toMatch(/weighted exactly like|weighted the same way/i);
    expect(source).not.toMatch(/equal-weighting routing pipeline/i);
    expect(source).not.toMatch(/screens shipped/i);
    expect(source).not.toMatch(/A shipped wayfinding app/i);
    expect(source).toMatch(/working React Native prototype/i);
  });

  it("describes the project-card work as a prototype for Black drivers", () => {
    const content = readFileSync(projectContentPath, "utf8");
    const summary = content.match(/^summary: (.+)$/m)?.[1];

    expect(summary).toBe(
      "A working wayfinding prototype for Black drivers that brings community safety reports into route scoring alongside public map data.",
    );
    expect(summary).not.toMatch(/\bapp\b|maximi[sz]/i);
  });

  it("states the moderation transparency plan without empty transitions", () => {
    const source = readPage();

    expect(source).not.toMatch(/the rule holds/i);
    expect(source).not.toContain(
      "It&apos;s where community reports and public data meet the same",
    );
    expect(source).toContain(
      "A planned transparency page will publish moderation outcomes so",
    );
    expect(source).toContain(
      "exceptions are documented as carve-outs",
    );
    expect(source).toContain("When the Supabase path is configured");
    expect(source).toMatch(/review,\s+hide,\s+restore,\s+or\s+remove\s+reports/);
    expect(source).not.toContain("Nothing publishes without a human");
    expect(source).not.toContain("Published or held");
  });

  it("closes on demonstrated judgment before describing future validation", () => {
    const source = readPage();

    expect(source).not.toContain(
      "What comes next is mostly about accountability",
    );
    expect(source).toMatch(/before\s+calling\s+any\s+route\s+safer/);
    expect(source).toContain(
      "the Held-Question rule, route chips, and source detail",
    );
  });
});
