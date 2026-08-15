import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import {
  NAVI_SURVEY_META,
  NAVI_SURVEY_STATS,
} from "@/lib/navi-survey-data";

const pagePath = "src/app/work/navi/page.tsx";
const page = readFileSync(resolve(process.cwd(), pagePath), "utf8");
const prose = page.replace(/\s+/g, " ");
const lateStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);
const portfolioStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);
const readerFacingProperties = new Set([
  "description",
  "role",
  "timeline",
  "tools",
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

function readerFacingWordCount(
  paths: string[],
  importedDisplayChunks: readonly string[] = [],
) {
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

      if (
        ts.isJsxExpression(node) &&
        !ts.isJsxAttribute(node.parent) &&
        node.expression &&
        ts.isStringLiteralLike(node.expression)
      ) {
        add(node.expression.text);
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

  importedDisplayChunks.forEach(add);

  return (
    chunks
      .join(" ")
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) ?? []
  ).length;
}

function getRuleBody(styles: string, selector: string) {
  const selectorStart = styles.indexOf(selector);
  if (selectorStart === -1) return undefined;

  const openBrace = styles.indexOf("{", selectorStart + selector.length);
  if (openBrace === -1) return undefined;

  let depth = 1;
  for (let index = openBrace + 1; index < styles.length; index += 1) {
    if (styles[index] === "{") depth += 1;
    if (styles[index] === "}") depth -= 1;
    if (depth === 0) return styles.slice(openBrace + 1, index);
  }

  return undefined;
}

describe("Navi case-study structure", () => {
  it("keeps only the four approved page evidence headings", () => {
    const headings = Array.from(
      page.matchAll(
        /<h3 className="project-evidence-heading" id="([^"]+)">\s*([^<]+?)\s*<\/h3>/g,
      ),
      ([, id, title]) => ({ id, title: title.trim() }),
    );

    expect(headings).toEqual([
      { id: "nv-heatmap", title: "The first prototype: a Manhattan heatmap" },
      { id: "nv-research", title: "Platform audits and resident research" },
      { id: "nv-system", title: "Rebuilding Navi as a working system" },
      { id: "nv-screens", title: "A working booking flow" },
    ]);
  });

  it("keeps each evidence section labelled by its own H3", () => {
    for (const id of ["nv-heatmap", "nv-research", "nv-system", "nv-screens"]) {
      expect(page).toMatch(
        new RegExp(
          `<section[^>]*aria-labelledby="${id}"[^>]*>[\\s\\S]*?<h3 className="project-evidence-heading" id="${id}">`,
        ),
      );
    }

    expect(page).not.toMatch(/<h[23][^>]+id="nv-(?:intro|insights|framework|build|outcome)"/);
  });

  it("orders the primary story from resident evidence through future validation", () => {
    const primaryStory = page
      .slice(page.indexOf("<ProjectToc"))
      .replace(/\s+/g, " ");
    const storyMarkers = [
      "The Manhattan heatmap was an exploratory hypothesis",
      "resident and stakeholder responses",
      "overcrowdingStat.count",
      "Learn, Plan, Go",
      "After the semester, I rebuilt the system",
      "Next research",
    ];

    for (const [current, next] of storyMarkers
      .slice(0, -1)
      .map((marker, index) => [marker, storyMarkers[index + 1]] as const)) {
      expect(primaryStory.indexOf(current)).toBeGreaterThan(-1);
      expect(primaryStory.indexOf(current)).toBeLessThan(
        primaryStory.indexOf(next),
      );
    }

    expect(page.match(/After the semester, I rebuilt the system/gi) ?? []).toHaveLength(1);
    expect(page).toContain('href="/work/navi/demo"');
    expect(page).toContain('href="/work/navi/system"');
  });

  it("lets the heatmap and research board carry their details without losing boundaries", () => {
    expect(prose).toContain("exploratory hypothesis");
    expect(prose).toContain("not actual tourist density or live geo analytics");
    expect(prose).toContain("internal planning artifacts");
    expect(prose).toContain("with no engineering handoff");
    expect(prose).toContain("Cost, location, and event type were non-negotiable");
    expect(prose).toContain("Going Fast reflected remaining availability");
    expect(prose).not.toContain(
      "A Manhattan heatmap turned the routing premise into an exploratory artifact.",
    );
    expect(prose).not.toContain(
      "The first Navi concept treated concentrated tourism as a routing problem.",
    );
    expect(prose).not.toContain(
      "Before the survey, the team sketched a routing layer that could redirect a visitor",
    );
  });

  it("keeps future validation framed as planned work", () => {
    expect(prose).not.toContain(
      "The current demo makes the interaction model clickable.",
    );
    expect(prose).toContain("The browser demo supports the individual flow.");
    expect(page).toContain("I could see NYC Tourism as a future partner");
    expect(
      page.indexOf("I could see NYC Tourism as a future partner"),
    ).toBeLessThan(
      page.indexOf("The browser demo supports the individual flow"),
    );
    expect(prose).not.toContain("The portfolio rebuild makes the concept easier to inspect");
    expect(prose).not.toContain("The graduate-studio concept did not ship");
    expect(prose).toContain("Working now");
    expect(prose).toContain("Next research");
    expect(prose).toContain("Deeper Learn pages");
    expect(prose).toContain("Local host and business onboarding");
    expect(prose).toMatch(/Group booking.{0,100}future opportunity/);
    expect(prose).toContain("not wired into this demo");
    expect(prose).not.toContain("Current rebuild");
    expect(prose).toContain('href="/work/navi/demo"');
    expect(prose).toContain('href="/work/navi/system"');
    expect(page.indexOf("Working now")).toBeLessThan(
      page.indexOf("<ProjectWorkJump"),
    );
  });

  it("counts imported survey display data inside the page-authored prose budget", () => {
    const [overcrowdingStat, authenticExperienceStat] = NAVI_SURVEY_STATS;
    const importedSurveyDisplay = [
      String(overcrowdingStat.count),
      String(NAVI_SURVEY_META.responseCount),
      overcrowdingStat.label,
      String(authenticExperienceStat.count),
      String(NAVI_SURVEY_META.responseCount),
      authenticExperienceStat.label,
      String(NAVI_SURVEY_META.responseCount),
      String(NAVI_SURVEY_META.localBusinessCount),
      NAVI_SURVEY_META.source,
    ];
    const sourceOnlyCount = readerFacingWordCount([pagePath]);
    const completeCount = readerFacingWordCount(
      [pagePath],
      importedSurveyDisplay,
    );

    expect(completeCount - sourceOnlyCount).toBe(20);
    expect(completeCount).toBeLessThanOrEqual(800);
  });

  it("uses Navi orange for the completed motif while retaining the neutral track", () => {
    expect(getRuleBody(lateStyles, ".nv-page .project-chapter")).toMatch(
      /--chapter-motif-accent:\s*var\(--nv-accent\);/,
    );
    expect(getRuleBody(lateStyles, ".nv-page .project-chapter-motif-line")).toMatch(
      /background:\s*var\(--line\);/,
    );
    expect(getRuleBody(lateStyles, ".nv-page .project-chapter-motif-line::after")).toMatch(
      /background:\s*var\(--chapter-motif-accent\);/,
    );
    expect(getRuleBody(lateStyles, ".nv-page .project-chapter-motif-point")).toMatch(
      /border-color:\s*var\(--chapter-motif-accent\);/,
    );
  });

  it("keeps Navi display type on chapter and evidence headings after demotion", () => {
    expect(portfolioStyles).not.toContain('.nv-page h2[id^="nv-"]');
    expect(
      getRuleBody(
        portfolioStyles,
        ".nv-page .project-chapter-title,\n.nv-page .project-evidence-heading",
      ),
    ).toMatch(/font-family:\s*var\(--font-navi-display\)/);
  });
});
