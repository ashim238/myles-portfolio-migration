import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(
  resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
  "utf8",
);
const prose = page.replace(/\s+/g, " ");

describe("UnderstandingFAFSA case-study structure", () => {
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

  it("keeps the audited facts that support the case", () => {
    for (const fact of [
      "I worked with one collaborator to compile",
      "Compiled and evaluated 120+ newsletters with one collaborator.",
      "over 120 newsletter",
      "Revenews",
      "The 74",
      "Next by Jeff Selingo",
      "Medium",
      "Folderly",
      "three template variants",
      "stay locked",
      "Editors swap",
      "founder assembles every issue",
      "102KB",
      "November 4, 2025",
      "MPP excluded",
      "~52.6%",
      "around 30%",
      "someone else assembles every week",
    ]) {
      expect(prose).toContain(fact);
    }
  });

  it("describes the Mailchimp weight work as concrete actions", () => {
    expect(prose).not.toContain("The fix arrived through test sends");
    expect(prose).toContain(
      "Test sends showed which wrappers and dividers could go.",
    );
    expect(prose).toContain(
      "I merged sections where they still scanned and compressed PNGs through an external tool.",
    );
    expect(prose).toContain("removed backgrounds in Photoshop");
  });

  it("names the three templates and the Mailchimp tradeoff without abstract system language", () => {
    expect(prose).toContain(
      "The audit led to three templates: a welcome email, the weekly newsletter, and a shorter version for event invites and recaps.",
    );
    expect(prose).toContain(
      "The Figma file defined the spacing, type, and reusable sections.",
    );
    expect(prose).not.toContain("The shared framework");
    expect(prose).not.toContain("same vocabulary");
    expect(prose).not.toContain("modular rhythm");
    expect(prose).not.toContain("same design vocabulary");
  });

  it("keeps the audit, build, and measured result specific after distillation", () => {
    expect(prose).toContain(
      "We evaluated them for clarity, personalization, and tone of voice.",
    );
    expect(prose).toContain(
      "A fourth criterion paired visual appeal with branding consistency.",
    );
    expect(prose).toContain(
      "I rebuilt the live template in Mailchimp so the founder could edit it without touching HTML.",
    );
    expect(prose).toContain("The first redesigned send went out November 4, 2025.");
    expect(prose).toContain(
      "That result is encouraging, but it&apos;s not a controlled attribution test. I don&apos;t claim the redesign caused the change.",
    );
    expect(prose).not.toContain(
      "The rest of the newsletter pool served as lighter references",
    );
    expect(prose).not.toContain("Compression wasn&apos;t one recipe.");
  });

  it("keeps a visible space between the measured rate and its label", () => {
    expect(page).toContain('<CountUp value="~52.6%" />{" "}open rate');
  });
});
