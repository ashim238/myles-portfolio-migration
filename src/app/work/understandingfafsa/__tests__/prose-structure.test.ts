import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import ts from "typescript";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { UNDERSTANDING_FAFSA_AUDIT_RULES } from "@/lib/understandingfafsa-audit-rules";

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

const pagePath = "src/app/work/understandingfafsa/page.tsx";
const page = readFileSync(resolve(process.cwd(), pagePath), "utf8");
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

  it("uses five process chapters with nested evidence headings", () => {
    const chapterIndexes = Array.from(
      page.matchAll(/entry=\{chapters\[(\d+)\]\}/g),
      ([, index]) => index,
    );
    const evidenceHeadings = Array.from(
      page.matchAll(
        /<h3 className="project-evidence-heading" id="([^"]+)">\s*([^<]+)\s*<\/h3>/g,
      ),
      ([, id, title]) => ({ id, title: title.trim() }),
    );

    expect(page).toContain("const chapters = CASE_STUDY_CHAPTERS.understandingfafsa");
    expect(page).toContain("<ProjectToc sections={chapters} />");
    expect(page.match(/<ProjectChapter/g)).toHaveLength(5);
    expect(chapterIndexes).toEqual(["0", "1", "2", "3", "4"]);
    expect(evidenceHeadings).toEqual([
      { id: "uf-problem", title: "Where the old template broke down" },
      { id: "uf-templates", title: "Three send types from the audit" },
    ]);
  });

  it("removes repeated framing while retaining the evidence artifacts", () => {
    expect(page).not.toContain("case-tier-divider");
    expect(page).not.toContain("case-pullquote");
    expect(page).not.toContain("case-section-lead");
    expect(page).not.toContain("The full breakdown");
    expect(page).not.toContain("From there we put our own spin on it");

    for (const artifact of [
      "BeforeAfterPhones",
      "TemplateSwitcher",
      "NewsletterComposerDemo",
      "LockedSwappableView",
      "ColorPalette",
      "FigmaMailchimpPair",
      "CountUp",
    ]) {
      expect(page).toContain(`<${artifact}`);
    }
  });

  it("renders the five audit findings as one ordered rule chain", () => {
    expect(page).toMatch(
      /import\s*\{\s*UNDERSTANDING_FAFSA_AUDIT_RULES\s*\}\s*from\s*"@\/lib\/understandingfafsa-audit-rules"/,
    );
    expect(page).toContain(
      '<ol aria-label="Audit findings and system rules">',
    );
    expect(page).toMatch(
      /UNDERSTANDING_FAFSA_AUDIT_RULES\.map\(\(rule\) =>/,
    );
    expect(
      page.match(/UNDERSTANDING_FAFSA_AUDIT_RULES\.map/g) ?? [],
    ).toHaveLength(1);
    expect(page).toContain("<strong>Finding:</strong>");
    expect(page).toContain("<strong>System rule:</strong>");
  });

  it("exposes the audit chain as a named ordered list", async () => {
    render(await UnderstandingFafsaPage());

    const list = screen.getByRole("list", {
      name: "Audit findings and system rules",
    });
    const items = within(list).getAllByRole("listitem");

    expect(list.tagName).toBe("OL");
    expect(items).toHaveLength(5);
    for (const item of items) {
      expect(within(item).getByText("Finding:")).toBeVisible();
      expect(within(item).getByText("System rule:")).toBeVisible();
    }
  });

  it("orders the story from operating context through the supporting metric", () => {
    const storyMarkers = [
      "Where the old template broke down",
      "reviewed more than 120 newsletters",
      "Audit findings and system rules",
      "Three send types from the audit",
      "Gmail&apos;s 102 KB HTML clipping threshold",
      "I shipped a master template",
      "November 4, 2025",
    ];

    for (const [current, next] of storyMarkers
      .slice(0, -1)
      .map((marker, index) => [marker, storyMarkers[index + 1]] as const)) {
      expect(page.indexOf(current)).toBeGreaterThan(-1);
      expect(page.indexOf(current)).toBeLessThan(page.indexOf(next));
    }
  });

  it("centers founder autonomy before the rules and feasibility work that enabled it", () => {
    const brief =
      "The brief was to design a new email newsletter system the founder could update at a moment&apos;s notice without much technical know-how.";
    const feasibility =
      "I moved the design from Figma into Mailchimp for feasibility checks and practice sends, then built a version ready for user testing.";
    const result =
      "The founder now assembles each send from the Mailchimp-native kit without editing HTML.";

    expect(prose).toContain(brief);
    expect(prose).toContain(feasibility);
    expect(prose).toContain(result);
    expect(page.indexOf(brief)).toBeLessThan(
      page.indexOf("reviewed more than 120 newsletters"),
    );
    expect(page.indexOf(feasibility)).toBeLessThan(
      page.indexOf("Gmail&apos;s 102 KB HTML clipping threshold"),
    );
    expect(page).toContain(
      '"Outcome: I designed and rebuilt a Mailchimp-native newsletter kit the founder can update without editing HTML.",',
    );
  });

  it("keeps ownership, workflow, and the implementation constraint explicit", () => {
    expect(prose).toMatch(/one collaborator and I[\s\S]{0,100}more than 120/i);
    expect(prose).toMatch(/I designed[\s\S]{0,100}modular rules/i);
    expect(prose).toMatch(/I rebuilt[\s\S]{0,100}Mailchimp/i);
    expect(prose).toMatch(
      /founder[\s\S]{0,100}without (?:touching|editing) HTML/i,
    );
    expect(prose).toMatch(/102 ?KB/i);

    for (const source of [
      "Revenews",
      "The 74",
      "Next by Jeff Selingo",
      "Medium",
      "Folderly",
    ]) {
      expect(prose).toContain(source);
    }
  });

  it("separates Gmail HTML clipping work from PNG download weight", () => {
    expect(prose).not.toContain("The fix arrived through test sends");
    expect(prose).toContain(
      "Test sends showed which wrappers and dividers could go.",
    );
    expect(prose).toContain(
      "To reduce the HTML Gmail measures, I flattened the hierarchy, removed wrappers and blocks that didn&apos;t need to ship, and used Mailchimp-native structure where it replaced custom markup.",
    );
    expect(prose).toContain(
      "Compressing the PNGs through an external tool lowered their download weight. It didn&apos;t reduce the HTML source Gmail measures.",
    );
    expect(prose).not.toContain(
      "Early weight came from custom section icons and themed dividers",
    );
    expect(prose).toContain("removed backgrounds in Photoshop");
  });

  it("names the three templates and the Mailchimp tradeoff without abstract system language", () => {
    expect(prose).toContain(
      "The audit led to three templates: a welcome email, the weekly newsletter, and a shorter version for event invites and recaps.",
    );
    expect(prose).toMatch(/I designed the modular rules around a fixed section order/i);
    expect(prose).not.toContain("The shared framework");
    expect(prose).not.toContain("same vocabulary");
    expect(prose).not.toContain("modular rhythm");
    expect(prose).not.toContain("same design vocabulary");
  });

  it("keeps the build and measured result specific after distillation", () => {
    expect(prose).toMatch(
      /I rebuilt the live (?:system|template) in Mailchimp[\s\S]{0,100}without touching HTML/i,
    );
    expect(prose).toContain("November 4, 2025");
    expect(prose).toContain(
      "That result is supporting context, not a controlled attribution test.",
    );
    expect(prose).toContain(
      "I don&apos;t claim the redesign caused the change.",
    );
    expect(prose).not.toContain(
      "The rest of the newsletter pool served as lighter references",
    );
    expect(prose).not.toContain("Compression wasn&apos;t one recipe.");
  });

  it("keeps a visible space between the measured rate and its label", () => {
    expect(page).toContain('<CountUp value="~52.6%" />{" "}open rate');
  });

  it("counts imported audit-rule copy inside the prose budget", () => {
    const importedAuditCopy = UNDERSTANDING_FAFSA_AUDIT_RULES.flatMap(
      ({ finding, response }) => [finding, response],
    );
    const repeatedLabels = Array.from(
      { length: UNDERSTANDING_FAFSA_AUDIT_RULES.length - 1 },
      () => ["Finding", "System rule"],
    ).flat();
    const sourceOnlyCount = readerFacingWordCount([pagePath]);
    const completeCount = readerFacingWordCount(
      [pagePath],
      [...importedAuditCopy, ...repeatedLabels],
    );

    expect(completeCount - sourceOnlyCount).toBe(96);
    expect(completeCount).toBeLessThanOrEqual(800);
  });
});
