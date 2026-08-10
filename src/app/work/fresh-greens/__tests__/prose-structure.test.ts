import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
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
  "src/app/styles/portfolio-surfaces.css",
);
const latePolishStylesPath = resolve(
  process.cwd(),
  "src/app/styles/late-polish.css",
);
const baseStylesPath = resolve(process.cwd(), "src/app/styles/base.css");
const pivotPath = resolve(
  process.cwd(),
  "src/components/fresh-greens/pivot-journey.tsx",
);
const pulledOverPath = resolve(
  process.cwd(),
  "src/components/fresh-greens/pulled-over-journey.tsx",
);
const reminderPath = resolve(
  process.cwd(),
  "src/components/fresh-greens/departure-reminder-evidence.tsx",
);
const primaryPathFiles = [
  pagePath,
  pivotPath,
  pulledOverPath,
  reminderPath,
];

const recruiterCutAttributes = new Set([
  "role",
  "timeline",
  "stackLabel",
  "stack",
  "outcomeValue",
  "outcomeLabel",
  "moves",
]);
const recruiterCutEvidenceProperties = new Set(["type", "cta"]);
const pulledOverDisplayProperties = new Set([
  "label",
  "decision",
  "detail",
]);

function readPage() {
  return readFileSync(pagePath, "utf8");
}

function normalizeCopy(copy: string) {
  return copy
    .replace(/<[^>]+>/g, "")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function enclosingJsxAttribute(node: ts.Node) {
  let current: ts.Node | undefined = node.parent;
  while (current) {
    if (ts.isJsxAttribute(current)) return current;
    current = current.parent;
  }
  return undefined;
}

function jsxAttributeOwner(
  attribute: ts.JsxAttribute,
  sourceFile: ts.SourceFile,
) {
  const owner = attribute.parent.parent;
  if (ts.isJsxOpeningElement(owner) || ts.isJsxSelfClosingElement(owner)) {
    return owner.tagName.getText(sourceFile);
  }
  return undefined;
}

function primaryPathWordCount(
  paths: string[],
  readSource: (path: string) => string = (path) => readFileSync(path, "utf8"),
) {
  const chunks: string[] = [];

  const add = (value: string) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (normalized) chunks.push(normalized);
  };

  for (const path of paths) {
    const source = readSource(path);
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
        const attribute = enclosingJsxAttribute(node);
        const isRecruiterEvidence =
          path === pagePath &&
          attribute?.name.getText(sourceFile) === "evidence" &&
          jsxAttributeOwner(attribute, sourceFile) === "RecruiterCut" &&
          recruiterCutEvidenceProperties.has(property);
        const isPulledOverDisplayCopy =
          path === pulledOverPath && pulledOverDisplayProperties.has(property);

        if (isRecruiterEvidence || isPulledOverDisplayCopy) {
          if (ts.isStringLiteralLike(node.initializer)) {
            add(node.initializer.text);
          } else if (ts.isArrayLiteralExpression(node.initializer)) {
            node.initializer.elements.forEach((element) => {
              if (ts.isStringLiteralLike(element)) add(element.text);
            });
          }
        }
      }

      if (
        path === pulledOverPath &&
        ts.isVariableDeclaration(node) &&
        node.name.getText(sourceFile) === "ANSWERS" &&
        node.initializer &&
        ts.isArrayLiteralExpression(node.initializer)
      ) {
        node.initializer.elements.forEach((element) => {
          if (ts.isStringLiteralLike(element)) add(element.text);
        });
      }

      if (ts.isJsxAttribute(node)) {
        const property = node.name.getText(sourceFile);
        if (
          path === pagePath &&
          jsxAttributeOwner(node, sourceFile) === "RecruiterCut" &&
          recruiterCutAttributes.has(property)
        ) {
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
  it("keeps the authored primary narrative within the 950-word ceiling", () => {
    const wordCount = primaryPathWordCount(primaryPathFiles);

    expect(
      wordCount,
      `Fresh Greens authored primary narrative is ${wordCount} words; target is 800 to 950`,
    ).toBeLessThanOrEqual(950);
  });

  it("counts display props without counting metadata or internal identifiers", () => {
    const fixture = `
      const metadata = { description: "Hidden metadata" };
      const page = (
        <>
          <RecruiterCut
            role="Solo"
            evidence={{ type: "Working prototype", cta: "Try flow" }}
          />
          <ul role="list">
            <Shot name="report-detail" />
          </ul>
        </>
      );
    `;

    expect(primaryPathWordCount([pagePath], () => fixture)).toBe(5);
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

  it("removes redundant scaffolding while keeping the evidence-bearing lead", () => {
    const source = readPage();
    const copy = normalizeCopy(source);

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
    expect(copy).toContain("I interviewed six Black drivers");
  });

  it("keeps only decision-bearing artifacts in the five-minute path", () => {
    const source = readPage();

    for (const component of [
      "PivotJourney",
      "ArchitectureDiagram",
      "PulledOverJourney",
      "LeadVideo",
    ]) {
      expect(source).toContain(`<${component}`);
    }
    for (const retired of [
      "ResearchSynthesis",
      "OnboardingIllustrationSequence",
      "TokenExhibit",
      "ReservedPalette",
    ]) {
      expect(source).not.toContain(`<${retired}`);
    }
    expect(source).toContain('name="report-detail"');
    expect(source).not.toContain('name="report-picker"');
    expect(source).not.toContain('name="en-route"');
    expect(source).not.toContain('name="route-preview"');
    expect(source).not.toContain("thesis-zone-flow.png");
    expect(source).toMatch(
      /<LeadVideo[\s\S]*?clip="\/projects\/fresh-greens\/process\/active-nav-flat-route\.mp4"[\s\S]*?poster="\/projects\/fresh-greens\/v2\/en-route\.png"[\s\S]*?width=\{1290\}[\s\S]*?height=\{2796\}/,
    );
    expect(source).toContain("En-route prototype on a simulated route.");
  });

  it("names the second route-planning state as the final direction", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/components/fresh-greens/pivot-journey.tsx",
      ),
      "utf8",
    );

    expect(source).toContain(">The final<");
    expect(source).not.toContain(">The break<");
  });

  it("names the tools used without turning them into validation claims", () => {
    const source = readPage();

    expect(source).toContain('stackLabel="Tools"');
    expect(source).toContain(
      'stack="Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase"',
    );
    expect(source).not.toMatch(/validated safety through Figma/i);
    expect(source).not.toMatch(/proved safety through React Native/i);
    expect(source).not.toMatch(/Claude designed/i);
  });

  it("connects moderation stages without rotated text glyphs", () => {
    const source = readPage();
    const styles = readFileSync(latePolishStylesPath, "utf8");
    const moderationStart = source.indexOf('className="fg-moderation"');
    const moderationEnd = source.indexOf("</ProjectChapter>", moderationStart);
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

  it("moves from Myles's experience to a research-backed three-problem brief", () => {
    const source = readPage();
    const copy = normalizeCopy(source);

    expect(copy).toContain(
      "Fresh Greens brings the safety knowledge Black drivers already use into route planning.",
    );
    expect(copy).toContain("I grew up in Brooklyn");
    expect(copy).toContain("moved to rural South Jersey around age ten");
    expect(copy).toContain("Confederate flags on front lawns");
    expect(copy).toContain("a police stop or car trouble");
    expect(copy).toContain("Google Maps or Apple Maps");
    expect(copy).toContain("drove comfortably below the speed limit");
    expect(copy).toContain("That experience gave me a hypothesis, not proof.");
    expect(copy).toContain("I interviewed six Black drivers");

    expect(source).toContain(
      'href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america"',
    );
    expect(copy).toContain("Plan");
    expect(copy).toContain("Respond");
    expect(copy).toContain("Trust");
    expect(copy).toContain("6 of 6 connected trip timing to daylight");
    expect(copy).toContain("5 of 6 raised road conditions");
    expect(copy).toContain("5 of 6 raised police presence");
    expect(copy).toContain("3 of 6 raised wildlife");
    expect(copy).toContain(
      "5 of 6 asked family or friends before trusting an unfamiliar place",
    );
    expect(copy).toContain(
      "Drivers couldn't inspect conditions on each route before choosing.",
    );
    expect(copy).toContain(
      "Useful community knowledge lived outside navigation",
    );
    expect(copy).toContain(
      "Six interviews don't represent every Black driver.",
    );
    expect(copy).toContain(
      "I wanted to explore what that principle could look like inside navigation.",
    );
  });

  it("retires the four-tab taxonomy from the primary research path", () => {
    const source = readPage();

    expect(source).not.toContain("<ResearchSynthesis");
    expect(source).not.toContain("Four recurring signals shaped the route model");
    expect(source.match(/className="fg-evidence-boundary"/g)).toHaveLength(3);
    expect(source).toContain("moves={[]}");
  });

  it("keeps the evidence labels in the portfolio's sentence-case type system", () => {
    const styles = readFileSync(portfolioStylesPath, "utf8");
    const labelRule = styles.match(/\.fg-evidence-label\s*\{([^}]+)\}/)?.[1];

    expect(labelRule).toBeDefined();
    expect(labelRule).not.toMatch(/text-transform:\s*uppercase/);
    expect(labelRule).not.toMatch(/font-family:\s*var\(--font-mono\)/);
  });

  it("gives the three research problems enough horizontal measure", () => {
    const styles = readFileSync(portfolioStylesPath, "utf8");
    const gridRule = styles.match(/\.fg-evidence-boundaries\s*\{([^}]+)\}/)?.[1];
    const bodyRule = styles.match(/\.fg-evidence-boundary p:last-child\s*\{([^}]+)\}/)?.[1];

    expect(gridRule).toContain("max-width: min(68rem, 100%)");
    expect(bodyRule).toContain("font-size: 0.96rem");
    expect(bodyRule).toContain("line-height: 1.58");
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
      "A working wayfinding prototype for Black drivers that brings community safety reports and daylight reminders into route planning alongside public map data.",
    );
    expect(summary).not.toMatch(/\bapp\b|maximi[sz]/i);
  });
});
