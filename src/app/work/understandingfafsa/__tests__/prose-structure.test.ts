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

const pagePath = "src/app/work/understandingfafsa/page.tsx";
const page = readFileSync(resolve(process.cwd(), pagePath), "utf8");
const prose = page.replace(/\s+/g, " ");
const auditRuleSource = readFileSync(
  resolve(process.cwd(), "src/lib/understandingfafsa-audit-rules.ts"),
  "utf8",
).replace(/\s+/g, " ");
const auditActionCopy = [
  "I gave longer sends clearer breaks and more direct section titles to make them easier to scan.",
  "I locked spacing, type hierarchy, and dividers while leaving content and module order swappable.",
  "I built the kit in Mailchimp so the founder could assemble each issue without touching HTML.",
  "I flattened the hierarchy and cut extra wrappers once practice sends exposed Gmail clipping.",
  "I made welcome, weekly, and shorter event templates so different sends could hold different amounts of content.",
] as const;
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
      { id: "uf-problem", title: "What the redesign had to account for" },
      { id: "uf-templates", title: "Building a kit inside Mailchimp" },
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

  it("renders the five audit decisions as a direct action list", () => {
    expect(page).toMatch(
      /UNDERSTANDING_FAFSA_AUDIT_ACTIONS[\s\S]*UNDERSTANDING_FAFSA_AUDIT_RULES[\s\S]*from\s*"@\/lib\/understandingfafsa-audit-rules"/,
    );
    expect(page).toMatch(
      /<ol[\s\S]*className="uf-audit-actions"[\s\S]*aria-label="Design changes from the newsletter audit"/,
    );
    expect(page).toMatch(
      /UNDERSTANDING_FAFSA_AUDIT_RULES\.map\(\(rule\) =>/,
    );
    expect(
      page.match(/UNDERSTANDING_FAFSA_AUDIT_RULES\.map/g) ?? [],
    ).toHaveLength(1);
    expect(page).not.toContain("<strong>Finding:</strong>");
    expect(page).not.toContain("<strong>System rule:</strong>");
    for (const action of auditActionCopy) {
      expect(auditRuleSource).toContain(action);
    }
  });

  it("exposes the audit decisions as a named ordered list", async () => {
    render(await UnderstandingFafsaPage());

    const list = screen.getByRole("list", {
      name: "Design changes from the newsletter audit",
    });
    const items = within(list).getAllByRole("listitem");

    expect(list.tagName).toBe("OL");
    expect(items).toHaveLength(5);
    for (const [index, item] of items.entries()) {
      expect(item).toHaveTextContent(auditActionCopy[index]);
      expect(within(item).queryByText("Finding:")).not.toBeInTheDocument();
      expect(within(item).queryByText("System rule:")).not.toBeInTheDocument();
    }
  });

  it("keeps the founder's problem and Myles's original sentence shape", () => {
    expect(prose).toContain(
      "The founder had her own issues with the newsletter. Open rates were down",
    );
    expect(prose).toContain("My own audit aligned with that.");
    expect(prose).toContain(
      "The world of email marketing was somewhat foreign to me.",
    );
    expect(prose).toContain("That was not the case.");
    expect(prose).not.toContain("That assumption failed once I started building.");
    expect(prose).not.toContain(
      "Gmail&apos;s 102 KB HTML clipping threshold set a rigid constraint.",
    );
  });

  it("preserves the founder constraints, ownership boundaries, validation, and ongoing use", () => {
    expect(prose).toMatch(
      /open rates were down[\s\S]{0,180}newly redesigned website/i,
    );
    expect(prose).toMatch(
      /short turnaround[\s\S]{0,180}(?:articles|copy)[\s\S]{0,120}editor/i,
    );
    expect(prose).toMatch(
      /email marketing was somewhat foreign[\s\S]{0,220}Figma[\s\S]{0,120}Mailchimp/i,
    );
    expect(prose).toMatch(
      /I owned the final visual design[\s\S]{0,240}another designer[\s\S]{0,180}founder/i,
    );
    expect(prose).toMatch(
      /required sections[\s\S]{0,120}colors[\s\S]{0,120}typefaces[\s\S]{0,180}final (?:approval|say)/i,
    );
    expect(prose).toContain("Add some pizzazz.");
    expect(prose).toContain("Snacks");
    expect(prose).toContain("HubSpot");
    expect(prose).toMatch(
      /practice sends[\s\S]{0,220}other designer[\s\S]{0,140}editor[\s\S]{0,140}founder/i,
    );
    expect(prose).toMatch(/mobile[\s\S]{0,100}desktop/i);
    expect(prose).toMatch(/Gmail[\s\S]{0,180}dark.mode/i);
    expect(prose).toMatch(/roughly 20 sends/i);
    expect(prose).toMatch(/three (?:email )?themes/i);
    expect(prose).toMatch(/specific audience[\s\S]{0,120}color pairing/i);
    expect(prose).toContain("It&apos;s a constant back and forth.");
  });

  it("keeps the newsletter review framed as an audit rather than reader research", async () => {
    render(await UnderstandingFafsaPage());

    expect(screen.getAllByText(/120 newsletters/i).length).toBeGreaterThan(1);
    expect(prose).toContain("reviewed more than 120 newsletters");
    for (const auditSource of [
      "Revenews",
      "The 74",
      "Next by Jeff Selingo",
      "Medium",
      "Folderly",
    ]) {
      expect(prose).toContain(auditSource);
    }
    expect(prose).not.toMatch(/interviewed (?:readers|subscribers|students)/i);
    expect(prose).not.toMatch(/(?:readers|subscribers) (?:said|told|asked)/i);
  });

  it("orders the story from operating context through the supporting metric", () => {
    const storyMarkers = [
      "Open rates were down",
      "reviewed more than 120 newsletters",
      "I kept coming back to Snacks",
      "Add some pizzazz.",
      "The world of email marketing was somewhat foreign to me",
      "Practice sends went to me",
      "The founder has launched roughly 20 sends",
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
      "The new system had to work inside Mailchimp without requiring either skill.";
    const feasibility =
      "I hoped whatever I designed in Figma could be ported straight into Mailchimp.";
    const result =
      "The founder has launched roughly 20 sends since the redesign and edits the template herself each week.";

    expect(prose).toContain(brief);
    expect(prose).toContain(feasibility);
    expect(prose).toContain(result);
    expect(prose.indexOf(brief)).toBeLessThan(prose.indexOf(feasibility));
    expect(prose.indexOf(feasibility)).toBeLessThan(
      prose.indexOf("Gmail clips emails once the HTML source crosses 102 KB"),
    );
    expect(page).toContain(
      '"Constraint: The founder needed a Mailchimp-native system she could edit without Figma or HTML.",',
    );
    expect(page).toContain(
      '"Validation: Practice sends on mobile and desktop exposed Gmail clipping and dark-mode inversion.",',
    );
    expect(page).not.toContain(
      '"Build: I owned the final visual design and rebuilt it as a Mailchimp-native kit.",',
    );
    expect(page).not.toContain(
      '"Use: The founder edits the template herself and has launched roughly 20 sends.",',
    );
  });

  it("keeps ownership, workflow, and the implementation constraint explicit", () => {
    expect(prose).toContain(
      "Another designer, the founder, and I worked together on the copy and base structure.",
    );
    expect(prose).toContain("I owned the final visual design.");
    expect(prose).toMatch(/I rebuilt the live system[\s\S]{0,100}native blocks/i);
    expect(prose).toMatch(
      /founder[\s\S]{0,140}without (?:touching|editing) HTML/i,
    );
    expect(prose).toMatch(/102 ?KB/i);
  });

  it("separates Gmail HTML clipping work from PNG download weight", () => {
    expect(prose).not.toContain("The fix arrived through test sends");
    expect(prose).toContain(
      "Those sends exposed Gmail&apos;s 102 KB HTML clipping limit and dark-mode color inversion.",
    );
    expect(prose).toContain(
      "Gmail clips emails once the HTML source crosses 102 KB.",
    );
    expect(prose).toContain(
      "I rebuilt the live system with simpler native blocks, flattened the hierarchy, and removed what didn&apos;t need to ship.",
    );
    expect(prose).toContain(
      "Compressing the PNGs lowered their download weight, but it didn&apos;t reduce the HTML source Gmail measures.",
    );
    expect(prose).not.toContain(
      "Early weight came from custom section icons and themed dividers",
    );
    expect(prose).toMatch(
      /white backgrounds of the custom illustrations had to go[\s\S]{0,160}interrupted the visual rhythm[\s\S]{0,100}removed them in Photoshop/i,
    );
  });

  it("names the three templates and the Mailchimp tradeoff without abstract system language", () => {
    expect(prose).toContain(
      "I made a welcome email, the weekly newsletter, and a shorter ICYMI version for event invites and recaps.",
    );
    expect(prose).toContain(
      "I also left the founder with three email themes inspired by the brand palette.",
    );
    expect(prose).toMatch(
      /Within the founder&apos;s type choices, I locked spacing, type hierarchy, and dividers/i,
    );
    expect(prose).toMatch(
      /hoped whatever I designed in Figma[\s\S]{0,100}Mailchimp[\s\S]{0,100}That was not the case/i,
    );
    expect(prose).not.toContain("The shared framework");
    expect(prose).not.toContain("same vocabulary");
    expect(prose).not.toContain("modular rhythm");
    expect(prose).not.toContain("same design vocabulary");
  });

  it("keeps the build and measured result specific after distillation", () => {
    expect(prose).toMatch(
      /I rebuilt the live system[\s\S]{0,100}simpler native blocks/i,
    );
    expect(prose).toContain(
      "The founder has launched roughly 20 sends since the redesign and edits the template herself each week.",
    );
    expect(prose).toContain("November 4, 2025");
    expect(prose).toContain(
      "Because this wasn&apos;t a controlled attribution test, I don&apos;t attribute the difference to the redesign.",
    );
    expect(prose).not.toContain("That result is supporting context");
    expect(prose).not.toContain(
      "The rest of the newsletter pool served as lighter references",
    );
    expect(prose).not.toContain("Compression wasn&apos;t one recipe.");
  });

  it("keeps a visible space between the measured rate and its label", () => {
    expect(page).toContain('<CountUp value="~52.6%" />{" "}open rate');
  });

  it("counts imported audit-rule copy inside the page-authored prose budget", () => {
    const sourceOnlyCount = readerFacingWordCount([pagePath]);
    const completeCount = readerFacingWordCount(
      [pagePath],
      auditActionCopy,
    );
    const expectedImportedWords =
      auditActionCopy
        .join(" ")
        .match(/[A-Za-z0-9]+(?:['’][A-Za-z0-9]+)*/g)?.length ?? 0;

    expect(completeCount - sourceOnlyCount).toBe(expectedImportedWords);
    expect(completeCount).toBeLessThanOrEqual(800);
  });
});
