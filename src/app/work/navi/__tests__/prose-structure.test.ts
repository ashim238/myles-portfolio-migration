import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(resolve(process.cwd(), "src/app/work/navi/page.tsx"), "utf8");
const prose = page.replace(/\s+/g, " ");
const lateStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/late-polish.css"),
  "utf8",
);
const portfolioStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
  "utf8",
);

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

  it("preserves all eight story bodies and places resident research before survey findings", () => {
    for (const copy of [
      "The early design premise treated concentrated tourism as a routing problem.",
      "A Manhattan heatmap turned the routing premise into an exploratory artifact.",
      "The team audited six travel platforms.",
      "Two concerns appeared most often in the 14-response resident survey.",
      "I created three research-informed archetypes from the survey findings",
      "For this portfolio case study, I translated the Navi visual system into live React",
      "The screens below come from the current React build.",
      "I rebuilt the concept as live React components",
    ]) {
      expect(prose).toContain(copy);
    }

    expect(page.indexOf('id="nv-research"')).toBeLessThan(
      page.indexOf("Two concerns appeared most often"),
    );
  });

  it("keeps future validation framed as planned work", () => {
    expect(prose).toContain("I rebuilt the concept as live React components");
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
