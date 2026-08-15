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
const pulledOverPath = resolve(
  process.cwd(),
  "src/components/fresh-greens/pulled-over-journey.tsx",
);
const routeDecisionPath = resolve(
  process.cwd(),
  "src/components/fresh-greens/route-decision-evidence.tsx",
);
const projectChaptersPath = resolve(
  process.cwd(),
  "src/lib/project-chapters.ts",
);
const primaryPathFiles = [
  pagePath,
  pulledOverPath,
  routeDecisionPath,
];

const recruiterCutAttributes = new Set([
  "timeline",
  "tools",
  "moves",
]);
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
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
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
        const isPulledOverDisplayCopy =
          path === pulledOverPath && pulledOverDisplayProperties.has(property);

        if (isPulledOverDisplayCopy) {
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
            timeline="Six months"
            tools="Figma"
            moves={[]}
          />
          <ul role="list">
            <Shot name="report-detail" />
          </ul>
        </>
      );
    `;

    expect(primaryPathWordCount([pagePath], () => fixture)).toBe(3);
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
    expect(copy).toContain("I spoke with six Black drivers");
  });

  it("keeps only decision-bearing artifacts in the primary reading path", () => {
    const source = readPage();

    for (const component of [
      "PivotJourney",
      "RouteComparisonEvidence",
      "ArchitectureDiagram",
      "PulledOverJourney",
      "ReportRouteInfluenceEvidence",
      "ProjectEvidenceDisclosure",
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
    expect(source).toContain("<ReportRouteInfluenceEvidence");
    expect(source).not.toContain('name="report-picker"');
    expect(source).not.toContain('name="en-route"');
    expect(source).not.toContain('name="route-preview"');
    expect(source).not.toContain("thesis-zone-flow.png");
    expect(source).toMatch(
      /<LeadVideo[\s\S]*?clip="\/projects\/fresh-greens\/process\/active-nav-flat-route\.mp4"[\s\S]*?poster="\/projects\/fresh-greens\/v2\/en-route\.png"[\s\S]*?width=\{1290\}[\s\S]*?height=\{2796\}/,
    );
    expect(source).toContain("En-route prototype on a simulated route.");
  });

  it("names the second route-planning state without portfolio shorthand", () => {
    const source = readFileSync(
      resolve(
        process.cwd(),
        "src/components/fresh-greens/pivot-journey.tsx",
      ),
      "utf8",
    );

    expect(source).toContain(">Standalone app<");
    expect(source).not.toContain(">The final<");
    expect(source).not.toContain(">The break<");
  });

  it("names the tools used without turning them into validation claims", () => {
    const source = readPage();

    expect(source).toContain(
      'tools="Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase"',
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
    expect(component).toMatch(/eight source adapters/i);
    expect(component).not.toMatch(/eight data inputs pass/i);
    expect(component).toContain("live feed not wired");
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
      "A navigation tool for Black drivers at different stages of a drive.",
    );
    expect(readFileSync(projectChaptersPath, "utf8")).toContain(
      "Car culture and South Jersey go hand in hand",
    );
    expect(copy).toContain("I moved there from Brooklyn as a kid");
    expect(copy).toContain("The roads would start to break down a bit");
    expect(copy).toContain("Reception would become unreliable");
    expect(copy).toContain("what would happen if the car broke down right there");
    expect(copy).toContain("Drivers already relied on tools like Google Maps");
    expect(copy).toContain("I'd slow down, avoid backroads");
    expect(copy).toContain("I didn't know whether that discomfort was mine alone");
    expect(copy).toContain("I spoke with six Black drivers");

    expect(source).toContain(
      'href="https://nmaahc.si.edu/explore/stories/traveling-through-jim-crow-america"',
    );
    expect(copy).toContain("Plan");
    expect(copy).toContain("Respond");
    expect(copy).toContain("Trust");
    expect(copy).toContain("All six mentioned daylight");
    expect(copy).toContain("five mentioned road conditions");
    expect(copy).toContain("five mentioned police presence");
    expect(copy).toContain("three mentioned wildlife");
    expect(copy).toContain(
      "Five of six asked family or friends before trusting an unfamiliar place",
    );
    expect(copy).toContain(
      "Drivers couldn't compare the conditions they cared about across routes before choosing.",
    );
    expect(copy).toContain(
      "Five of six asked family or friends before trusting an unfamiliar place",
    );
    expect(copy).toContain(
      "Six interviews can't represent every Black driver.",
    );
    expect(copy).toContain(
      "I returned to the Green Book for the visual system",
    );
  });

  it("keeps Myles's causal spine from existing workarounds through the build and test correction", () => {
    const copy = normalizeCopy(readPage());

    expect(readFileSync(projectChaptersPath, "utf8")).toContain(
      "Car culture and South Jersey go hand in hand",
    );
    expect(copy).toContain(
      "Qualitative interviews were new to me, but I tried to navigate them like everyday conversations.",
    );
    expect(copy).toContain("I wasn't the only person getting the heebie-jeebies during a drive.");
    expect(copy).toContain("He was content, not impressed.");
    expect(copy).toContain("I was about a month from delivering it");
    expect(copy).toContain("Chicago to rural Georgia");
    expect(copy).toContain(
      "The driver isn't expecting perfection, but they are expecting the clarity and autonomy to choose a route that they can feel adequately prepared for.",
    );
    expect(copy).not.toContain(
      "The driver isn't expecting perfection. They're expecting",
    );
    expect(copy).toContain("Worst comes to worst, a Black driver needs to be informed.");
    expect(copy).toContain(
      "People just need transparency into how the app is doing what it claims it does.",
    );
    expect(copy).toContain(
      'The current build still labels the top option "Safest route,"',
    );
    expect(copy).toContain("The full score and its weights aren't exposed yet.");
    expect(copy).toContain(
      "I used Figma to set the initial rules, then built them in code.",
    );
    expect(copy).toContain("My own address was sitting in Recent");
    expect(copy).toContain("I added street addresses");
    expect(copy).toContain(
      "where it asks for too much, and what I need to change.",
    );

    expect(copy).not.toContain(
      "Roadside help, location sharing, guidance, and emergency steps work offline.",
    );
    expect(copy).not.toContain(
      "Fresh Greens shows uncertainty where coverage is thin.",
    );
    expect(copy).toContain("With Supabase configured");
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
    const highlightQuote = content.match(/^highlightQuote: (.+)$/m)?.[1];

    expect(summary).toBe(
      "Fresh Greens is a working navigation prototype for Black drivers. It shows conditions before a drive and keeps support tools one tap away during a drive.",
    );
    expect(highlightQuote).toBe(
      "The route preview shows daylight, road conditions, and community reports before the driver chooses. Detail cards show where those signals came from.",
    );
    expect(`${readPage()}\n${content}`).not.toMatch(
      /\bbrings?\b[^.]{0,120}\binto\b[^.]{0,120}\balongside\b/i,
    );
    expect(summary).not.toMatch(/\bapp\b|maximi[sz]/i);
  });
});
