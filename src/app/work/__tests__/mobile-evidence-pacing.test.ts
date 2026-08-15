import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

function read(relativePath: string) {
  return readFileSync(resolve(process.cwd(), relativePath), "utf8");
}

describe("case-study mobile evidence pacing", () => {
  it("keeps one primary proof visible and moves supporting evidence behind native disclosures", () => {
    const fresh = read("src/app/work/fresh-greens/page.tsx");
    const naviArtifacts = read("src/components/navi/research-artifacts.tsx");
    const fafsa = read("src/app/work/understandingfafsa/page.tsx");
    const tiktok = read("src/app/work/tiktok/page.tsx");

    expect(fresh).toMatch(
      /<RouteComparisonEvidence \/>[\s\S]*?<ProjectEvidenceDisclosure summary="View the visual pivot and daylight reminder">[\s\S]*?<PivotJourney \/>[\s\S]*?<DepartureReminderEvidence \/>[\s\S]*?<\/ProjectEvidenceDisclosure>/,
    );
    expect(fresh).toMatch(
      /<ProjectEvidenceDisclosure summary="See how the data reaches route scoring">[\s\S]*?<ArchitectureDiagram \/>[\s\S]*?<\/ProjectEvidenceDisclosure>/,
    );
    expect(naviArtifacts).toMatch(
      /<ProjectEvidenceDisclosure summary="View the journey and booking artifacts">[\s\S]*?Journey-map excerpt[\s\S]*?Individual booking-flow excerpt[\s\S]*?<\/ProjectEvidenceDisclosure>/,
    );
    expect(fafsa).toMatch(
      /<TemplateSwitcher \/>[\s\S]*?<NewsletterComposerDemo \/>[\s\S]*?<ProjectEvidenceDisclosure summary="Open the supporting system details">[\s\S]*?<LockedSwappableView \/>[\s\S]*?<ColorPalette/,
    );
    expect(tiktok).toMatch(
      /<TikTokTemplateSystem \/>[\s\S]*?<ProjectEvidenceDisclosure summary="View all three sketch-to-template comparisons">[\s\S]*?className="tt-preview-process"/,
    );
  });
});
