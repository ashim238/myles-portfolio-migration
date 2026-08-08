import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import ts from "typescript";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";

const getProjectBySlug = vi.fn();
const getPublishedProjects = vi.fn();

vi.mock("@/lib/content", () => ({
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => getPublishedProjects(),
}));

vi.mock("next/navigation", () => ({
  notFound: () => {
    throw new Error("NEXT_NOT_FOUND");
  },
  usePathname: () => "/work/understandingfafsa",
  useRouter: () => ({ push: () => {} }),
}));

import UnderstandingFafsaPage from "@/app/work/understandingfafsa/page";

const pagePath = resolve(
  process.cwd(),
  "src/app/work/understandingfafsa/page.tsx",
);
const page = readFileSync(pagePath, "utf8");
const prose = page.replace(/\s+/g, " ");
const readerFacingProperties = new Set([
  "description",
  "role",
  "timeline",
  "stackLabel",
  "stack",
  "outcomeValue",
  "outcomeLabel",
  "moves",
  "type",
  "cta",
]);

const project: Project = {
  slug: "understandingfafsa",
  title: "UnderstandingFAFSA",
  summary: "Summary",
  role: "Product Designer",
  timeframe: "February 2025 – Ongoing",
  status: "published",
  order: 2,
  tags: [],
  sections: [],
  bodyHtml: "",
};

function readerFacingWordCount(path: string) {
  const source = readFileSync(path, "utf8");
  const sourceFile = ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const chunks: string[] = [];
  const add = (value: string) => {
    const normalized = value.replace(/\s+/g, " ").trim();
    if (normalized) chunks.push(normalized);
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) add(node.text);

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
          initializer.expression &&
          ts.isStringLiteralLike(initializer.expression)
        ) {
          add(initializer.expression.text);
        }
      }
    }

    ts.forEachChild(node, visit);
  };

  visit(sourceFile);

  return (
    chunks
      .join(" ")
      .replace(/&apos;|&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g) ?? []
  ).length;
}

describe("UnderstandingFAFSA case-study structure", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getProjectBySlug.mockResolvedValue(project);
    getPublishedProjects.mockResolvedValue([project]);
    vi.stubGlobal(
      "IntersectionObserver",
      class IntersectionObserverStub {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  it("offers a preferred title break without changing the product name", () => {
    const title = page.match(
      /<h1 id="uf-title" className="project-hero-title uf-title">([\s\S]*?)<\/h1>/,
    )?.[1];

    expect(title).toBeDefined();
    expect(title).toMatch(/Understanding\s*<wbr\s*\/>\s*FAFSA/);
    expect(title?.replace(/<[^>]+>/g, "").replace(/\s+/g, "").trim()).toBe(
      "UnderstandingFAFSA",
    );
  });

  it("uses five chapters without nested evidence-heading scaffolding", () => {
    const chapterIndexes = Array.from(
      page.matchAll(/entry=\{chapters\[(\d+)\]\}/g),
      ([, index]) => index,
    );

    expect(page).toContain("const chapters = CASE_STUDY_CHAPTERS.understandingfafsa");
    expect(page).toContain("<ProjectToc sections={chapters} />");
    expect(page.match(/<ProjectChapter/g)).toHaveLength(5);
    expect(chapterIndexes).toEqual(["0", "1", "2", "3", "4"]);
    expect(page).not.toContain("project-evidence-heading");
    expect(page).not.toContain("Where the old template broke down");
    expect(page).not.toContain("Three send types from the audit");
  });

  it("keeps one proof surface for each major part of the story", () => {
    for (const artifact of [
      "BeforeAfterPhones",
      "NewsletterComposerDemo",
      "FigmaMailchimpPair",
      "CountUp",
    ]) {
      expect(page).toContain(`<${artifact}`);
    }

    for (const retired of [
      "TemplateSwitcher",
      "LockedSwappableView",
      "ColorPalette",
      "UNDERSTANDING_FAFSA_AUDIT_RULES",
    ]) {
      expect(page).not.toContain(retired);
    }
    expect(page).not.toContain("case-tier-divider");
    expect(page).not.toContain("The full breakdown");
  });

  it("compresses the audit into a problem, opportunity, and goal", async () => {
    const { container } = render(await UnderstandingFafsaPage());
    const brief = container.querySelector(".uf-story-brief") as HTMLElement;

    expect(brief).not.toBeNull();
    expect(brief).toHaveTextContent("Problem");
    expect(brief).toHaveTextContent("Opportunity");
    expect(brief).toHaveTextContent("Goal");
    expect(brief).toHaveTextContent("Important guidance was hard to scan");
    expect(brief).toHaveTextContent("Lock the system, not the weekly content");
    expect(brief).toHaveTextContent("Make the kit work inside Mailchimp");
    expect(within(brief).getAllByRole("article")).toHaveLength(3);
    expect(
      screen.queryByRole("list", { name: "Audit findings and system rules" }),
    ).toBeNull();
  });

  it("orders the story from the old template to the qualified result", () => {
    const storyMarkers = [
      "The website had just been rebranded",
      "compiled and reviewed more than 120 newsletters",
      "The audit led to three send types",
      "I rebuilt the system in Mailchimp",
      "Gmail&apos;s 102 KB HTML clipping threshold",
      "I shipped a master template",
      "November 4, 2025",
    ];

    for (const marker of storyMarkers) expect(prose).toContain(marker);
    for (let index = 1; index < storyMarkers.length; index += 1) {
      expect(prose.indexOf(storyMarkers[index - 1])).toBeLessThan(
        prose.indexOf(storyMarkers[index]),
      );
    }
  });

  it("keeps ownership, workflow, and the implementation constraint explicit", () => {
    expect(prose).toMatch(/one collaborator and I[\s\S]{0,80}more than 120/i);
    expect(prose).toMatch(/I used that audit to define what should stay fixed/i);
    expect(prose).toMatch(/I rebuilt the system in Mailchimp/i);
    expect(prose).toMatch(/founder[\s\S]{0,100}without (?:touching|editing) HTML/i);
    expect(prose).toMatch(/102 ?KB/i);
    expect(prose).toContain("Image compression helped download weight");
    expect(prose).toContain("it did not change that HTML limit");

    for (const removedMinutia of [
      "Revenews",
      "The 74",
      "Next by Jeff Selingo",
      "Folderly",
      "removed backgrounds in Photoshop",
      "counselor toolkit needed more image work",
      "duotone icons",
    ]) {
      expect(prose).not.toContain(removedMinutia);
    }
  });

  it("keeps the metric specific, observational, and visibly spaced", () => {
    expect(page).toContain("November 4, 2025");
    expect(page).toContain('<CountUp value="~52.6%" />{" "}open rate');
    expect(prose).toContain("while earlier sends were around 30%");
    expect(prose).toContain(
      "That result is supporting context, not a controlled attribution test.",
    );
    expect(prose).toContain("I don&apos;t claim the redesign caused the change.");
  });

  it("keeps the authored page below a 650-word reading budget", () => {
    const count = readerFacingWordCount(pagePath);
    expect(
      count,
      `UnderstandingFAFSA reader-facing source is ${count} words; target is at most 650`,
    ).toBeLessThanOrEqual(650);
  });

  it("avoids evidence-map and generic product language in public copy", () => {
    for (const phrase of [
      "dominant proof",
      "supporting proof",
      "the core loop worked",
      "leveraging insights",
      "seamless experience",
      "This proves",
    ]) {
      expect(prose).not.toMatch(new RegExp(phrase, "i"));
    }
  });
});
