import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const page = readFileSync(
  resolve(process.cwd(), "src/app/work/understandingfafsa/page.tsx"),
  "utf8",
);
const prose = page.replace(/\s+/g, " ");

describe("UnderstandingFAFSA case-study structure", () => {
  it("uses plain, mixed process headings in chronological order", () => {
    const headings = Array.from(
      page.matchAll(/<h2 id="([^"]+)">([^<]+)<\/h2>/g),
      ([, id, title]) => ({ id, title: title.trim() }),
    );

    expect(headings).toEqual([
      { id: "uf-context", title: "The newsletter still used the old visual system" },
      { id: "uf-problem", title: "Where the old template broke down" },
      { id: "uf-audit", title: "A 120-newsletter audit" },
      { id: "uf-templates", title: "One skeleton for three send types" },
      { id: "uf-locked", title: "What stays locked and what changes" },
      { id: "uf-figma", title: "Rebuilding the system in Mailchimp" },
      { id: "uf-results", title: "First send after the redesign" },
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
      "NewsletterComposer",
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
});
