import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const applicantFacingFiles = [
  "content/projects/navi.md",
  "src/app/work/navi/page.tsx",
  "src/app/resume/page.tsx",
];

const readSource = (file: string) =>
  readFileSync(resolve(process.cwd(), file), "utf8");

describe("Navi evidence claims", () => {
  it("removes the unsupported concept-test preference across public sources", () => {
    for (const file of applicantFacingFiles) {
      const source = readSource(file);
      expect(source).not.toContain("78%");
      expect(source).not.toMatch(/testers? preferred/i);
      expect(source).not.toMatch(/concept-test participants preferred/i);
    }
  });

  it("does not present three respondent groups as one heuristic evaluation", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).not.toMatch(/three user groups/i);
    expect(projectPage).not.toMatch(/tourism professionals, local business owners/i);
    expect(projectPage).not.toMatch(/three groups.{0,80}heuristic/i);
  });

  it("keeps the intro and heatmap framed as an early concept premise", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).not.toMatch(/mapped tourist density/i);
    expect(projectPage).not.toMatch(/mapping tourist density showed/i);
    expect(projectPage).not.toMatch(/over 60 million visitors each year/i);
    expect(projectPage).not.toMatch(/most go to the same ten\s+places/i);
    expect(projectPage).not.toMatch(/businesses[\s\S]{0,100}struggle for visibility/i);
    expect(projectPage).not.toMatch(/residents[\s\S]{0,100}absorb the side effects/i);
    expect(projectPage).toMatch(/early (?:concept|design) premise/i);
    expect(projectPage).toMatch(/exploratory artifact/i);
  });

  it("keeps the checked research facts and team context", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).toContain("six travel platforms");
    expect(projectPage).toContain("Kaori Ogawa");
    expect(projectPage).toMatch(/Amy\s+Zhang/);
    expect(projectPage).toMatch(/14(?:-response resident survey| responses)/);
    expect(projectPage).toContain("71%");
    expect(projectPage).toContain("50%");
    expect(projectPage).toMatch(
      /That dataset is the source for the two\s+survey findings shown below\./,
    );
  });

  it("retains the complete chapter artifact stack", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const researchArtifacts = readSource(
      "src/components/navi/research-artifacts.tsx",
    );

    for (const component of [
      "LeadMedia",
      "RecruiterCut",
      "HeatmapExplorer",
      "HeuristicInsightCards",
      "SurveyStatRings",
      "NaviResearchArtifacts",
      "CompositionStrip",
      "NaviDemoEmbed",
      "ProjectWorkJump",
      "CaseHighlightObserver",
      "NaviAnimReady",
    ]) {
      expect(projectPage).toContain(`<${component}`);
    }

    expect(researchArtifacts).toContain('aria-label="Research-informed archetypes"');
    expect(researchArtifacts).toContain('aria-label="Journey-map excerpt"');
    expect(researchArtifacts).toContain(
      'aria-label="Individual booking-flow excerpt"',
    );
  });

  it("separates research evidence, planning artifacts, and future work", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).toContain("research-informed archetypes");
    expect(projectPage).toContain("internal planning artifacts");
    expect(projectPage).toMatch(/group booking.{0,100}future opportunity/i);
    expect(projectPage).toMatch(/not wired into this demo/i);
    expect(projectPage).not.toMatch(/three personas/i);
    expect(projectPage).not.toContain("Those flows are present in the rebuild");
    expect(projectPage).toMatch(
      /I rebuilt the concept as live React components and connected them to an individual/,
    );
    expect(projectPage).toContain("Deeper Learn pages");
    expect(projectPage).toContain("Local host and business onboarding");
  });

  it("removes the metric frontmatter and gives the gallery a factual artifact outcome", () => {
    const content = readSource("content/projects/navi.md");

    expect(content).not.toContain("outcomeMetricValue:");
    expect(content).not.toContain("outcomeMetricLabel:");
    expect(content).toContain(
      "outcomeRest: Portfolio rebuild with a live component system and working booking flow.",
    );
  });

  it("describes the graduate-studio concept and later portfolio rebuild in condensed copy", () => {
    const content = readSource("content/projects/navi.md");
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const summary =
      "A graduate-studio concept for neighborhood travel. I later rebuilt it as a working portfolio demo.";

    expect(content).toContain(`summary: ${summary}`);
    expect(projectPage).toContain(`"${summary}"`);
    expect(content).not.toMatch(/local heartbeat/i);
    expect(projectPage).not.toMatch(/local heartbeat/i);
  });

  it("labels the current system and demo as a portfolio rebuild", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const resume = readSource("src/app/resume/page.tsx");

    expect(projectPage).toMatch(/portfolio rebuild/i);
    expect(projectPage).not.toContain("This is the prototype that would have shipped on day one.");
    expect(projectPage).not.toContain("Every design decision linked back to research findings");
    expect(projectPage).not.toContain("Journey mapping validated");
    expect(resume).toMatch(/rebuilt (?:it|the concept)/i);
  });

  it("lets the chapter TOC lead directly into the case study", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).not.toContain("case-tier-divider");
    expect(projectPage).not.toContain("The full breakdown");
  });

  it("moves from the early heatmap premise into the next concept without repeating it", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const artifactCopy = readSource("src/components/navi.tsx");

    expect(projectPage).not.toContain(
      "Early on, the team considered a heatmap solution",
    );
    expect(projectPage).not.toMatch(
      /Navi&apos;s proposed alternative connected trip planning/,
    );
    expect(projectPage).toMatch(
      /The next concept paired\s+neighborhood-level experiences and local context with trip\s+planning\./,
    );
    expect(projectPage).toMatch(
      /The next concept direction focused on neighborhood context and\s+participation instead\./,
    );
    expect(artifactCopy).not.toContain("not the same ten default stops");
    expect(artifactCopy).toContain(
      "Learn would open with the neighborhood’s inclusive history and local rhythm.",
    );
  });
});
