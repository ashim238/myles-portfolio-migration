import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ProjectEvidenceDisclosure } from "@/components/project-evidence-disclosure";

const styles = readFileSync(resolve(process.cwd(), "src/app/styles/base.css"), "utf8");
const disclosureCallsites = [
  ["Fresh Greens", "src/app/work/fresh-greens/page.tsx", 3],
  ["TikTok", "src/app/work/tiktok/page.tsx", 1],
  ["Understanding FAFSA", "src/app/work/understandingfafsa/page.tsx", 1],
  ["Navi", "src/components/navi/research-artifacts.tsx", 1],
] as const;

describe("ProjectEvidenceDisclosure", () => {
  it("keeps supporting evidence optional while preserving native disclosure semantics", () => {
    const { container } = render(
      <ProjectEvidenceDisclosure summary="View the supporting artifacts">
        <p>Supporting artifact</p>
      </ProjectEvidenceDisclosure>,
    );

    const details = container.querySelector("details");
    const summary = container.querySelector("summary");

    expect(details).not.toHaveAttribute("open");
    expect(summary).toHaveTextContent("View the supporting artifacts");
    expect(screen.getByText("Supporting artifact")).toBeInTheDocument();

    fireEvent.click(summary!);
    expect(details).toHaveAttribute("open");
  });

  it("keeps the disclosure trigger and revealed evidence visibly inset from its rule", () => {
    expect(styles).toMatch(
      /\.project-evidence-disclosure > summary\s*\{[\s\S]*?padding:\s*0\.85rem 1rem;/,
    );
    expect(styles).toMatch(
      /\.project-evidence-disclosure > summary\s*\{[\s\S]*?font-size:\s*1\.125rem;[\s\S]*?line-height:\s*1\.25;/,
    );
    expect(styles).toMatch(
      /\.project-evidence-disclosure-content\s*\{[\s\S]*?padding:\s*1\.5rem 1rem 0\.75rem;/,
    );
  });

  it.each(disclosureCallsites)(
    "routes %s evidence through the shared inset disclosure (%i instances)",
    (_name, file, expectedInstances) => {
      const source = readFileSync(resolve(process.cwd(), file), "utf8");
      const instances = source.match(/<ProjectEvidenceDisclosure(?=[\s>])/g) ?? [];

      expect(instances).toHaveLength(expectedInstances);
    },
  );
});
