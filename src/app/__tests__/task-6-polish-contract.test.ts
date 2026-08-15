import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("Task 6 polish contracts", () => {
  it("places the existing About actions before the body copy", () => {
    const about = read("src/app/about/page.tsx");
    const actionsIndex = about.indexOf(
      '<div className="about-actions about-page-actions">',
    );
    const bodyIndex = about.indexOf('<div className="about-body">');

    expect(actionsIndex).toBeGreaterThan(-1);
    expect(bodyIndex).toBeGreaterThan(-1);
    expect(actionsIndex).toBeLessThan(bodyIndex);
  });

  it("qualifies icon fidelity with current mechanical and recognition evidence", () => {
    const closeout = read("docs/verification/2026-08-09-portfolio-closeout.md");
    const iconRow = closeout
      .split("\n")
      .find((line) => line.startsWith("| Icon fidelity |"));

    expect(iconRow).toBeDefined();
    expect(iconRow).toContain("The current family is mechanically valid.");
    expect(iconRow).toContain(
      "The latest FAFSA crease and branded TikTok-mark revisions have not received a new source-free recognition review.",
    );
    expect(iconRow).toContain(
      "[Current family-consistency review](../design-assets/myles98-icons/reviews/family-consistency-review.md)",
    );
  });

  it("keeps the closeout aligned with the current chrome and case-study structure", () => {
    const closeout = read("docs/verification/2026-08-09-portfolio-closeout.md");

    expect(closeout).not.toContain("retaining the full RecruiterCut");
    expect(closeout).not.toContain("without replacing the full RecruiterCut");
    expect(closeout).not.toContain("titlebar, taskbar, and Reader chrome intentionally remain monochrome");
    expect(closeout).not.toContain("dense chrome stays monochrome");
    expect(closeout).not.toContain("simplified dense-chrome mark in Reader, titlebar, and taskbar contexts");
    expect(closeout).toContain(
      "At a glance retains only Team, Timeline, Tools, and Key moves",
    );
    expect(closeout).toContain(
      "titlebars, taskbar, and Reader chrome use distinct size-specific color icons",
    );
    expect(closeout).toContain(
      "Reader now uses the exact 16px project masters rather than alternate monochrome metaphors",
    );
  });

  it("binds the final Impeccable sequence evidence to the verified product candidate", () => {
    const closeout = read("docs/verification/2026-08-09-portfolio-closeout.md");

    expect(closeout).toContain(
      "Verified product candidate: `763650a7106d0d2d713afa3a48dc0d78aaf507cb`",
    );
    expect(closeout).toContain(
      "Candidate tree: `37983bc015135a011d53694bb5960cb6b7acc2e3`",
    );
    expect(closeout).toContain(
      "Build ID: `w21AZ1Byde7KrfAG5jVnC`",
    );
    expect(closeout).toContain(
      "63 of 63 route and viewport frames passed",
    );
    expect(closeout).toContain(
      "Manifest SHA-256: `972effddf9f28c52d970f45e50c25efc7cadbbea32cf10d293a53f6c86d86f5a`",
    );
    expect(closeout).toContain(
      "The focused TikTok browser regression separately requires visible, nonzero art inside the cover and no overlap with the eyebrow, title, or lede",
    );
  });
});
