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

  it("uses plain, mixed process headings in chronological order", () => {
    const headings = Array.from(
      page.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g),
      ([, id, title]) => ({ id, title: title.trim() }),
    );

    expect(headings).toEqual([
      { id: "uf-context", title: "A rebrand and a weekly workflow" },
      { id: "uf-problem", title: "Where the old template broke down" },
      { id: "uf-audit", title: "What 120 newsletters revealed" },
      { id: "uf-templates", title: "Three send types from the audit" },
      { id: "uf-locked", title: "Rules for fixed and swappable parts" },
      { id: "uf-figma", title: "Rebuilding the system in Mailchimp" },
      { id: "uf-results", title: "The first redesigned send" },
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
  });
});
