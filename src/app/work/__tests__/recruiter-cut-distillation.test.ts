import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

type RouteContract = {
  route: string;
  opening: {
    role: string;
    scope: string;
    outcome: string;
  };
  recruiter: {
    team?: string;
    timeline: string;
    tools?: string;
    moves: string[];
  };
};

const routes: RouteContract[] = [
  {
    route: "fresh-greens",
    opening: {
      role: "Solo, design and engineering",
      scope: "Six interviews helped me frame three problems: Plan, Respond, and Trust.",
      outcome: "Working React Native prototype across 26+ screens.",
    },
    recruiter: {
      timeline: "Sep 2025 – Jun 2026",
      tools:
        "Figma, Illustrator, Claude, React Native, Expo, TypeScript, Supabase",
      moves: [],
    },
  },
  {
    route: "tiktok",
    opening: {
      role: "Creative Strategist Intern · Global Creative Lab",
      scope:
        "I designed three fashion catalog templates inside dimensions and product slots that were fixed before I received the brief.",
      outcome:
        "Light Academia entered the launch library. I later learned through Global Creative Lab that American Eagle selected it.",
    },
    recruiter: {
      timeline: "May – August 2021",
      moves: [
        "Review: I showed early sketches in weekly GCL huddles and refined the directions through internal critique.",
        "Research: market research and burner accounts helped me study how different TikTok subcultures presented themselves.",
        "Boundary: the work was reviewed internally. I did not receive selection rationale, performance data, or the final fate of the other templates.",
      ],
    },
  },
  {
    route: "navi",
    opening: {
      role: "UI/UX Designer",
      scope:
        "I synthesized 14 resident and stakeholder responses, including two Manhattan businesses, adjusted the information architecture, and created the design system.",
      outcome:
        "A functional team Figma prototype, followed by my solo React portfolio demo.",
    },
    recruiter: {
      timeline: "January 2025 – June 2025",
      tools: "Figma, FigJam, React, TypeScript",
      moves: [
        "Tested: Other design students reviewed the homepage and search. We aligned card heights and reduced copy and tags.",
        "Untested: The semester ended before we could test Learn, Plan, Go or booking.",
        "Current demo: Plan lacks the full cost breakdown, and Go does not calculate a route from the visitor's current location.",
      ],
    },
  },
  {
    route: "understandingfafsa",
    opening: {
      role: "Product Designer",
      scope:
        "I owned the final visual design and Mailchimp build. Another designer, the founder, and I shaped the copy and base structure.",
      outcome:
        "A three-theme kit the founder edits herself. She has launched roughly 20 sends since the redesign.",
    },
    recruiter: {
      timeline: "February 2025 – Ongoing",
      tools: "Figma, Mailchimp",
      moves: [
        "Problem: Open rates were down, and the newsletter no longer matched the redesigned website.",
        "Constraint: The founder needed a Mailchimp-native system she could edit without Figma or HTML.",
        "Validation: Practice sends on mobile and desktop exposed Gmail clipping and dark-mode inversion.",
      ],
    },
  },
];

function literalPropsFor(route: string, component: string) {
  const pagePath = resolve(
    process.cwd(),
    `src/app/work/${route}/page.tsx`,
  );
  const source = readFileSync(pagePath, "utf8");
  const sourceFile = ts.createSourceFile(
    pagePath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let match: ts.JsxSelfClosingElement | undefined;

  const visit = (node: ts.Node) => {
    if (
      ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(sourceFile) === component
    ) {
      match = node;
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  expect(match, `${component} is missing from ${route}`).toBeDefined();
  const props = new Map<string, string | string[]>();
  for (const property of match?.attributes.properties ?? []) {
    if (!ts.isJsxAttribute(property)) continue;
    const name = property.name.getText(sourceFile);
    const initializer = property.initializer;
    if (initializer && ts.isStringLiteral(initializer)) {
      props.set(name, initializer.text);
      continue;
    }
    const expression =
      initializer && ts.isJsxExpression(initializer)
        ? initializer.expression
        : undefined;
    if (expression && ts.isArrayLiteralExpression(expression)) {
      props.set(
        name,
        expression.elements.map((element) => {
          expect(ts.isStringLiteralLike(element)).toBe(true);
          return (element as ts.StringLiteralLike).text;
        }),
      );
    }
  }
  return { match, props };
}

describe("case-study RecruiterCut distillation", () => {
  it.each(routes)(
    "keeps $route opening facts canonical and unchanged",
    ({ route, opening }) => {
      const { props } = literalPropsFor(route, "ProjectOpeningFacts");

      expect(Object.fromEntries(props)).toMatchObject(opening);
    },
  );

  it.each(routes)(
    "keeps only new $route RecruiterCut facts and authored moves",
    ({ route, recruiter }) => {
      const { match, props } = literalPropsFor(route, "RecruiterCut");
      const attributeNames = match?.attributes.properties
        .filter(ts.isJsxAttribute)
        .map((attribute) => attribute.name.getText())
        .sort();
      const expectedNames = Object.keys(recruiter).sort();

      expect(attributeNames).toEqual(expectedNames);
      expect(Object.fromEntries(props)).toEqual(recruiter);
    },
  );

  it("omits TikTok Team because the opening Role already names Global Creative Lab", () => {
    const { props } = literalPropsFor("tiktok", "RecruiterCut");

    expect(props.has("team")).toBe(false);
  });
});
