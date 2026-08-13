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
      scope:
        "Six interviews shaped route comparison, reminders, stress support, reporting, and moderation.",
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
        "I designed three static catalog templates for Dynamic Showcase Ads during my Global Creative Lab internship.",
      outcome:
        "Light Academia was 1 of 3 templates shipped in the launch library.",
    },
    recruiter: {
      timeline: "May – August 2021",
      moves: [
        "Studied Y2K, Maximalism, Dark Academia, WitchTok, and Cottagecore before choosing the final directions.",
        "Used one product slot map across Dopamine Dressing, e-Boy/e-Girl, and Light Academia.",
        "Built the files in parts and tested which elements could mix across directions.",
      ],
    },
  },
  {
    route: "navi",
    opening: {
      role: "UI/UX Designer",
      scope:
        "I collected and synthesized 14 resident and stakeholder responses, including two local businesses.",
      outcome:
        "In a later solo rebuild, I turned Learn, Plan, Go into a React component system and working individual booking flow.",
    },
    recruiter: {
      timeline: "January 2025 – June 2025",
      tools: "Figma, FigJam, React, TypeScript",
      moves: [
        "Graduate studio: the team tested an early Manhattan redirection concept and audited six travel platforms.",
        "My contribution: I collected and synthesized the 14 responses, then created research-informed archetypes, journeys, opportunity areas, flows, and studio design-system work.",
        "Solo rebuild: I turned Learn, Plan, Go into a React component system and working individual booking flow.",
      ],
    },
  },
  {
    route: "understandingfafsa",
    opening: {
      role: "Product Designer",
      scope:
        "I designed the modular rules and rebuilt the live system in Mailchimp.",
      outcome:
        "A Mailchimp-native kit the founder uses for weekly sends and ICYMI without editing HTML.",
    },
    recruiter: {
      timeline: "February 2025 – Ongoing",
      tools: "Figma, Mailchimp",
      moves: [
        "Outcome: I designed and rebuilt a Mailchimp-native kit the founder uses for weekly sends and ICYMI without editing HTML.",
        "Rules: I defined the fixed and swappable parts across three send types.",
        "Feasibility: I tested the Figma direction through Mailchimp practice sends.",
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
