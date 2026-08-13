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
      "Strict source-free noun recognition remains mixed for four targeted families.",
    );
    expect(iconRow).toContain(
      "[Current family-consistency review](../design-assets/myles98-icons/reviews/family-consistency-review.md)",
    );
  });
});
