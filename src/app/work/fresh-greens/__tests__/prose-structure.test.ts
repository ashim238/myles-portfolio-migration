import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
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
const latePolishStylesPath = resolve(
  process.cwd(),
  "src/app/styles/late-polish.css",
);
const baseStylesPath = resolve(process.cwd(), "src/app/styles/base.css");
const readerFacingFiles = [
  pagePath,
  composedCopyPath,
  resolve(
    process.cwd(),
    "src/components/fresh-greens/onboarding-illustration-sequence.tsx",
  ),
  resolve(
    process.cwd(),
    "src/components/fresh-greens/pivot-journey.tsx",
  ),
  resolve(
    process.cwd(),
    "src/components/fresh-greens/pulled-over-journey.tsx",
  ),
  resolve(
    process.cwd(),
    "src/components/fresh-greens/research-synthesis.tsx",
  ),
  resolve(
    process.cwd(),
    "src/components/fresh-greens/token-exhibit.tsx",
  ),
  resolve(
    process.cwd(),
    "src/lib/fresh-greens/research-synthesis-data.ts",
  ),
  resolve(process.cwd(), "src/lib/fresh-greens/palette.ts"),
  resolve(process.cwd(), "src/lib/fresh-greens/design-tokens.ts"),
];

const readerFacingProperties = new Set([
  "description",
  "role",
  "timeline",
  "stackLabel",
  "stack",
  "outcomeValue",
  "outcomeLabel",
  "moves",
  "label",
  "decision",
  "detail",
  "insight",
  "snippets",
  "designResponse",
  "asked",
  "became",
  "name",
  "note",
]);

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

function readerFacingWordCount(paths: string[]) {
  const chunks: string[] = [];

  const add = (value: string) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (normalized) chunks.push(normalized);
  };

  for (const path of paths) {
    const source = readFileSync(path, "utf8");
    const sourceFile = ts.createSourceFile(
      path,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );

    const visit = (node: ts.Node) => {
      if (ts.isJsxText(node)) {
        add(node.text);
      }

      if (ts.isPropertyAssignment(node)) {
        const property = node.name.getText(sourceFile).replace(/["']/g, "");
        if (readerFacingProperties.has(property)) {
          if (ts.isStringLiteralLike(node.initializer)) {
            add(node.initializer.text);
          } else if (ts.isArrayLiteralExpression(node.initializer)) {
            node.initializer.elements.forEach((element) => {
              if (ts.isStringLiteralLike(element)) add(element.text);
            });
          }
        }
      }

      if (ts.isJsxAttribute(node)) {
        const property = node.name.getText(sourceFile);
        if (readerFacingProperties.has(property)) {
          const initializer = node.initializer;
          if (initializer && ts.isStringLiteral(initializer)) {
            add(initializer.text);
          } else if (
            initializer &&
            ts.isJsxExpression(initializer) &&
            initializer.expression
          ) {
            if (ts.isStringLiteralLike(initializer.expression)) {
              add(initializer.expression.text);
            } else if (ts.isArrayLiteralExpression(initializer.expression)) {
              initializer.expression.elements.forEach((element) => {
                if (ts.isStringLiteralLike(element)) add(element.text);
              });
            }
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  return (
    chunks
      .join(" ")
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) ?? []
  ).length;
}

describe("Fresh Greens prose structure", () => {
  it("keeps the complete interactive case study within its reader-facing word budget", () => {
    const wordCount = readerFacingWordCount(readerFacingFiles);

    expect(wordCount).toBeGreaterThanOrEqual(1_400);
    expect(wordCount).toBeLessThanOrEqual(1_750);
  });

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
    expect(source).toContain("I interviewed six Black drivers");
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
    expect(normalized).toContain("I designed the flows in Figma");
    expect(normalized).toContain("drew the onboarding art in Illustrator");
    expect(normalized).toContain(
      "Claude helped me critique token names, color roles, and copy rules",
    );
    expect(source).not.toMatch(/validated safety through Figma/i);
    expect(source).not.toMatch(/proved safety through React Native/i);
    expect(source).not.toMatch(/Claude designed/i);
  });

  it("keeps the Refine chapter concise without dropping the craft decisions", () => {
    const source = readPage();
    const normalized = normalizeCopy(source);

    expect(normalized).toContain(
      "After trying Jost and Space Grotesk, I chose Libre Franklin for the hierarchy.",
    );
    expect(normalized).toContain("DM Serif Display appears only in six emotional moments");
    expect(normalized).toContain("Outside the four reserved colors");
    expect(normalized).toContain(
      "Red, orange, yellow, and navy each keep one safety meaning",
    );
    expect(normalized).toContain("WCAG 1.4.1");
    expect(normalized).not.toContain("Reserving it for those six is what keeps them landing.");
    expect(normalized).not.toContain(
      "The daylight gradient sits outside those four reserved safety colors.",
    );
    expect(source).not.toContain("Green carries every button and link.");
  });

  it("retains the safety interaction and community-report evidence stack", () => {
    const source = readPage();

    expect(source).toContain("<PulledOverJourney />");
    expect(source).toContain('name="report-picker"');
    expect(source).toContain('name="report-detail"');
    expect(source).toContain('className="fg-moderation"');
  });

  it("connects moderation stages without rotated text glyphs", () => {
    const source = readPage();
    const styles = readFileSync(latePolishStylesPath, "utf8");
    const moderationStart = source.indexOf('className="fg-moderation"');
    const moderationEnd = source.indexOf(
      "{/* ── Section 8: What was built",
      moderationStart,
    );
    const moderationMarkup =
      moderationStart >= 0 && moderationEnd > moderationStart
        ? source.slice(moderationStart, moderationEnd)
        : undefined;

    expect(moderationMarkup).toBeDefined();
    expect(moderationMarkup).not.toContain("→");
    expect(moderationMarkup).toMatch(
      /<span className="fg-mod-arrow" aria-hidden="true"\s*\/>/g,
    );
    expect(styles).toMatch(
      /\.fg-mod-arrow\s*\{[\s\S]*?align-self:\s*stretch;[\s\S]*?font-size:\s*0;/,
    );
    expect(styles).toMatch(/\.fg-mod-arrow::before\s*\{/);
    expect(styles).toMatch(/\.fg-mod-arrow::after\s*\{/);
    expect(styles).toMatch(
      /@media \(max-width: 620px\)[\s\S]*?\.fg-mod-arrow::before\s*\{[\s\S]*?height:\s*auto;/,
    );
    expect(styles).not.toMatch(
      /\.fg-mod-arrow\s*\{[^}]*transform:\s*rotate\(90deg\)/,
    );
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
    expect(component).toMatch(/eight data inputs/i);
    expect(component).toContain("local-first in the prototype");
    expect(component).toContain("Supabase and Postgres path behind configuration");
    expect(component).toContain("local-first · Supabase when configured");
    expect(component).not.toContain("the only non-reserved color");
    expect(component).not.toContain("Postgres + RLS");
    expect(component).not.toContain("held in Postgres under row-level security");
    expect(page).not.toContain("the one non-reserved color");
    expect(component).toContain("general interface actions");
  });

  it("separates interview evidence, implemented behavior, and unproven outcomes", () => {
    const source = readPage();

    expect(source).toContain("Interview-supported");
    expect(source).toContain("Built in the prototype");
    expect(source).toContain("Not yet proven");
    expect(source).toContain('aria-label="Fresh Greens evidence boundaries"');
  });

  it("anchors the opener to the informed-driving goal and interview evidence", () => {
    const source = readPage();

    expect(source).toContain(
      "I wanted to use modern navigation technology to help Black drivers",
    );
    expect(source).toMatch(/make more informed decisions\s+on the road/);
    expect(source).toMatch(/Interviews showed that\s+time and distance/);
    expect(source).toMatch(/advice from people they\s+trusted/);
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
    expect(source).toContain("A public moderation transparency page");
    expect(source).toContain(
      "exceptions are documented as carve-outs",
    );
    expect(source).toMatch(/When\s+Supabase is configured/);
    expect(source).toContain("Reviewed, hidden, restored, or removed");
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
      "The Held-Question rule, route chips, and source cards trace back to interviews. I'd still test routes, moderation outcomes, and failure cases with more Black drivers before calling any route safer.",
    );
    expect(source).toMatch(/before\s+calling\s+any\s+route\s+safer/);
    expect(source).toContain(
      "The Held-Question rule, route chips, and source cards",
    );
  });
});
