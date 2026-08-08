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
const latePolishStylesPath = resolve(
  process.cwd(),
  "src/app/styles/late-polish.css",
);
const refinementStylesPath = resolve(
  process.cwd(),
  "src/app/styles/fresh-greens-case-refinement.css",
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
const primaryPathFiles = [pagePath, pivotPath, pulledOverPath];

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
      if (ts.isJsxText(node)) add(node.text);

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
      `Fresh Greens authored primary narrative is ${wordCount} words; target is at most 950`,
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

  it("keeps the five-minute path focused on consequential decisions", () => {
    const source = readPage();

    for (const component of [
      "PivotJourney",
      "DepartureReminderEvidence",
      "PulledOverJourney",
    ]) {
      expect(source).toContain(`<${component}`);
    }
    for (const retired of [
      "ArchitectureDiagram",
      "ResearchSynthesis",
      "LeadVideo",
      "OnboardingIllustrationSequence",
      "TokenExhibit",
      "ReservedPalette",
    ]) {
      expect(source).not.toContain(`<${retired}`);
    }

    expect(source).toContain('name="report-detail"');
    expect(source).not.toContain('name="report-picker"');
    expect(source).not.toContain("26+ screens");
    expect(source).not.toContain("300 accessibility touchpoints");
    expect(source).not.toContain("62 Figma variables");
    expect(source).not.toContain("/superpowers");
    expect(source).not.toContain("/impeccable");
    expect(source).not.toMatch(/core loop/i);
  });

  it("names the main tools without turning them into validation claims", () => {
    const source = readPage();

    expect(source).toContain('stackLabel="Tools"');
    expect(source).toContain(
      'stack="Figma, Illustrator, React Native, Expo, TypeScript, Supabase"',
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
    expect(styles).not.toMatch(
      /\.fg-mod-arrow\s*\{[^}]*transform:\s*rotate\(90deg\)/,
    );
  });

  it("keeps data-source language accurate in the composed diagrams", () => {
    const component = readFileSync(composedCopyPath, "utf8");

    expect(component).not.toContain("eight public data sources");
    expect(component).toMatch(/eight data inputs/i);
    expect(component).toContain("local-first in the prototype");
    expect(component).toContain("Supabase and Postgres path behind configuration");
    expect(component).not.toContain("Postgres + RLS");
    expect(component).toContain("general interface actions");
  });

  it("tells the story in chronological cause-and-effect order", () => {
    const copy = normalizeCopy(readPage());
    const beats = [
      "Fresh Greens started out of a personal need",
      "I interviewed six Black drivers",
      "The interviews revealed two customer problems",
      "My first high-fidelity direction was a Google Maps add-on",
      "The pulled-over feature is the decision I'm proudest to explain",
      "I tested the early Figma flows with classmates",
      "On thesis presentation day",
    ];

    for (const beat of beats) expect(copy).toContain(beat);
    for (let index = 1; index < beats.length; index += 1) {
      expect(copy.indexOf(beats[index - 1])).toBeLessThan(copy.indexOf(beats[index]));
    }
  });

  it("uses one problem, opportunity, and goal brief instead of exposing the taxonomy", () => {
    const source = readPage();
    const styles = readFileSync(refinementStylesPath, "utf8");
    const briefStart = source.indexOf('className="fg-story-brief"');
    const briefEnd = source.indexOf("</div>", briefStart);
    const briefMarkup = source.slice(briefStart, briefEnd);

    expect(source).not.toContain("<ResearchSynthesis");
    expect(source.match(/className="fg-story-brief-label"/g)).toHaveLength(3);
    expect(briefMarkup).toContain("Problem");
    expect(briefMarkup).toContain("Opportunity");
    expect(briefMarkup).toContain("Goal");
    expect(styles).toMatch(
      /\.fg-page \.fg-story-brief\s*\{[\s\S]*?width:\s*min\(68rem, 100%\);[\s\S]*?grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/,
    );
    expect(styles).toMatch(
      /@media \(max-width: 720px\)[\s\S]*?\.fg-page \.fg-story-brief,[\s\S]*?grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
  });

  it("separates available usability evidence from intended-audience validation", () => {
    const copy = normalizeCopy(readPage());

    expect(copy).toContain("tested the early Figma flows with classmates");
    expect(copy).toContain("weren't the audience Fresh Greens was designed for");
    expect(copy).toContain("Basic functionality achieved!");
    expect(copy).toContain("entered their own addresses");
    expect(copy).toContain("Route quality and trust with Black drivers across regions");
    expect(copy).not.toMatch(/validated with Black drivers|proved safety|made drivers safer/i);
  });

  it("describes the project card through the route decision rather than output volume", () => {
    const content = readFileSync(projectContentPath, "utf8");
    const summary = content.match(/^summary: (.+)$/m)?.[1];

    expect(summary).toBe(
      "A wayfinding prototype for Black drivers that brings daylight, road conditions, police presence, wildlife, and community knowledge into the route decision.",
    );
    expect(content).toContain(
      "Students entered their own addresses and generated Fresh Greens routes on thesis day.",
    );
    expect(content).not.toContain("26+ screens");
  });
});
