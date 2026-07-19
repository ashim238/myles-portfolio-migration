import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

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
  "src/app/styles/portfolio-surfaces.css",
);
const baseStylesPath = resolve(process.cwd(), "src/app/styles/base.css");

function readPage() {
  return readFileSync(pagePath, "utf8");
}

function getSectionHeadings(source: string) {
  return Array.from(
    source.matchAll(
      /<h3 className="project-evidence-heading" id="([^"]+)">\s*([^<]+?)\s*<\/h3>/g,
    ),
    ([, id, title]) => ({ id, title: title.trim() }),
  );
}

function normalizeCopy(copy: string) {
  return copy
    .replace(/<[^>]+>/g, "")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

describe("Fresh Greens prose structure", () => {
  it("keeps chapter metadata spaced, separated, and mobile-wrappable", () => {
    const styles = readFileSync(baseStylesPath, "utf8");
    const metaRule = styles.match(/\.project-chapter-meta\s*\{([^}]+)\}/)?.[1];
    const titleRule = styles.match(/\.project-chapter-title\s*\{([^}]+)\}/)?.[1];

    expect(metaRule, "shared chapter metadata rule").toBeDefined();
    expect(metaRule).toMatch(/display:\s*flex;/);
    expect(metaRule).toMatch(/flex-wrap:\s*wrap;/);
    expect(metaRule).toMatch(/justify-content:\s*space-between;/);
    expect(metaRule).toMatch(/gap:\s*1rem;/);
    expect(metaRule).toMatch(/margin:\s*0 0 0\.7rem;/);
    expect(titleRule, "shared chapter title rule").toBeDefined();
    expect(titleRule).toMatch(/margin:\s*0;/);
    expect(titleRule).toMatch(/padding-top:\s*0\.85rem;/);
  });

  it("keeps the five evidence headings beneath the six typed chapters", () => {
    expect(CASE_STUDY_CHAPTERS["fresh-greens"][1]).toEqual({
      id: "fg-research",
      stage: "Research",
      title: "What interviews with Black drivers changed",
    });
    expect(getSectionHeadings(readPage())).toEqual([
      { id: "fg-scoring", title: "How each route gets scored" },
      { id: "fg-pulled-over", title: "A calmer interface for a traffic stop" },
      {
        id: "fg-pivot",
        title: "The Google Maps feature I moved away from",
      },
      { id: "fg-typecolor", title: "Type and color across a trip" },
      { id: "fg-color", title: "Four colors stay reserved for safety" },
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

  it("names the tools used without turning them into validation claims", () => {
    const source = readPage();
    const normalized = normalizeCopy(source);

    expect(source).toContain('stackLabel="Tools"');
    expect(source).toContain(
      'stack="Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase"',
    );
    expect(normalized).toContain("I designed the initial flows in Figma");
    expect(normalized).toContain("used Illustrator for the onboarding art");
    expect(normalized).toContain(
      "I also used Claude as a critique partner while tightening token names, color roles, and copy rules",
    );
    expect(source).not.toMatch(/validated safety through Figma/i);
    expect(source).not.toMatch(/proved safety through React Native/i);
    expect(source).not.toMatch(/Claude designed/i);
  });

  it("retains the safety interaction and community-report evidence stack", () => {
    const source = readPage();

    expect(source).toContain("<PulledOverJourney />");
    expect(source).toContain('name="report-picker"');
    expect(source).toContain('name="report-detail"');
    expect(source).toContain('className="fg-moderation"');
  });

  it("ships only the browser-ready active-navigation clip", () => {
    const source = readPage();
    const processDir = resolve(
      process.cwd(),
      "public/projects/fresh-greens/process",
    );

    expect(source).toContain(
      'clip="/projects/fresh-greens/process/active-nav-flat-route.mp4"',
    );
    expect(existsSync(resolve(processDir, "active-nav-flat-route.mp4"))).toBe(true);
    expect(existsSync(resolve(processDir, "active-nav-flat.mp4"))).toBe(false);
    expect(existsSync(resolve(processDir, "active-nav.mp4"))).toBe(false);
    expect(existsSync(resolve(processDir, "active-nav.mov"))).toBe(false);
    expect(
      statSync(resolve(processDir, "active-nav-flat-route.mp4")).size,
    ).toBeLessThan(4_000_000);
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
    const qualifier = source.match(
      /<div className="project-section-body fg-scope-closer">\s*<p>([\s\S]*?)<\/p>/,
    );

    expect(source).not.toContain(
      "What comes next is mostly about accountability",
    );
    expect(qualifier, "Fresh Greens final proof qualifier").not.toBeNull();
    expect(normalizeCopy(qualifier![1])).toBe(
      "I can trace the Held-Question rule, route chips, and source detail cards back to interviews. I'd want broader route testing with Black drivers, moderation outcomes, and failure cases before calling any route safer.",
    );
    expect(source).toMatch(/before\s+calling\s+any\s+route\s+safer/);
    expect(source).toContain(
      "the Held-Question rule, route chips, and source detail",
    );
  });
});
