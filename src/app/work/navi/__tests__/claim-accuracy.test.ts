import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  NAVI_SURVEY_META,
  NAVI_SURVEY_STATS,
} from "@/lib/navi-survey-data";

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

  it("stores exact survey counts and participant scope with the percentages", () => {
    expect(NAVI_SURVEY_META).toMatchObject({
      responseCount: 14,
      localBusinessCount: 2,
    });
    expect(NAVI_SURVEY_META.source).toMatch(/resident and stakeholder/i);
    expect(
      NAVI_SURVEY_STATS.map(({ id, count, value }) => ({ id, count, value })),
    ).toEqual([
      { id: "overcrowding", count: 10, value: 71 },
      { id: "authentic", count: 7, value: 50 },
    ]);
  });

  it("keeps the intro and heatmap framed as an unmeasured first concept", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).not.toMatch(/mapped tourist density/i);
    expect(projectPage).not.toMatch(/mapping tourist density showed/i);
    expect(projectPage).not.toMatch(/over 60 million visitors each year/i);
    expect(projectPage).not.toMatch(/most go to the same ten\s+places/i);
    expect(projectPage).not.toMatch(/businesses[\s\S]{0,100}struggle for visibility/i);
    expect(projectPage).not.toMatch(/residents[\s\S]{0,100}absorb the side effects/i);
    expect(projectPage).toMatch(/early team concept could move a visitor/i);
    expect(projectPage).toMatch(/first artifact worked/i);
  });

  it("keeps participant scope, ownership, and exact findings connected", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).not.toMatch(/14(?:-response)? resident survey/i);
    expect(
      projectPage.indexOf("resident and stakeholder responses"),
    ).toBeLessThan(projectPage.indexOf("<HeatmapExplorer"));
    expect(projectPage).toMatch(/including two\s+local businesses/i);
    expect(projectPage).toMatch(
      /I collected[\s\S]{0,120}resident and stakeholder responses/i,
    );
    expect(projectPage).toMatch(
      /It doesn&apos;t\s+stand in for all NYC residents\./,
    );
    expect(projectPage).not.toContain(
      "It does not stand in for all NYC residents.",
    );
    expect(projectPage).toMatch(/The team[\s\S]{0,100}six travel platforms/i);
    expect(projectPage).toMatch(
      /I evaluated Airbnb with Kaori\s+Ogawa and Amy\s+Zhang/i,
    );
    expect(projectPage).toMatch(
      /\{overcrowdingStat\.count\} of \{NAVI_SURVEY_META\.responseCount\} responses \([\s\S]{0,40}\{overcrowdingStat\.label\}\)/,
    );
    expect(projectPage).toMatch(
      /\{authenticExperienceStat\.count\} of \{NAVI_SURVEY_META\.responseCount\} \([\s\S]{0,40}\{authenticExperienceStat\.label\}\)/,
    );
    expect(projectPage).not.toMatch(
      /NYC residents (?:wanted|needed|preferred|said)/i,
    );
  });

  it("separates graduate-studio ownership from the solo rebuild", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");

    expect(projectPage).toContain(
      'stack="Figma, FigJam, React, TypeScript"',
    );
    expect(projectPage).toMatch(/Graduate studio:[\s\S]{0,180}The team/i);
    expect(projectPage).toMatch(/My contribution:[\s\S]{0,220}I collected/i);
    expect(projectPage).toMatch(/Solo rebuild:[\s\S]{0,180}React/i);
  });

  it("preserves the studio brief, sample boundaries, and wider findings", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const projectProse = projectPage.replace(/\s+/g, " ");

    expect(projectProse).toMatch(
      /regenerative.{0,120}participatory and contributive/i,
    );
    expect(projectProse).toMatch(
      /visitors, local businesses and artisans, and longtime residents/i,
    );
    expect(projectProse).toMatch(/many college-aged/i);
    expect(projectProse).toMatch(/rising costs/i);
    expect(projectProse).toMatch(/displacement of local businesses/i);
    expect(projectProse).toMatch(/repeat visitor relationships/i);
    expect(projectProse).toMatch(/outside traditional social platforms/i);
    expect(projectProse).toMatch(/regenerative work already happening/i);
    expect(projectProse).toMatch(
      /Survey responses.{0,120}rising costs.{0,120}displacement of local businesses/i,
    );
    expect(projectProse).toMatch(
      /Other stakeholder input.{0,120}repeat visitor relationships/i,
    );
    expect(projectProse).toMatch(
      /Tourism professionals.{0,120}regenerative work already happening/i,
    );
  });

  it("labels target segments as a hypothesis and the studio as unimplemented", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const projectProse = projectPage.replace(/\s+/g, " ");

    expect(projectProse).toMatch(/digital nomads, ethical travelers/i);
    expect(projectProse).toMatch(/research-informed target hypothesis/i);
    expect(projectProse).toMatch(/not a validated market segment/i);
    expect(projectProse).toMatch(/no engineering resources/i);
    expect(projectProse).toMatch(/no implementation budget/i);
    expect(projectProse).toMatch(/not a production website/i);
  });

  it("keeps the institutional path plausible rather than claimed", () => {
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const projectProse = projectPage.replace(/\s+/g, " ");

    expect(projectProse).toMatch(/plausible long-term path/i);
    expect(projectProse).toMatch(/such as NYC Tourism/i);
    expect(projectProse).toMatch(/future path, not a launch outcome/i);
    expect(projectProse).not.toMatch(/presented (?:to|Navi to) NYC Tourism/i);
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
    expect(content).toContain(
      "highlightQuote: Navi pairs neighborhood experiences with local context and trip planning.",
    );
    expect(content).not.toContain(
      "Navi reframes tourism from destination checklists to intentional neighborhood participation.",
    );
  });

  it("keeps condensed gallery copy separate from the evidence-led page lede", () => {
    const content = readSource("content/projects/navi.md");
    const projectPage = readSource("src/app/work/navi/page.tsx");
    const summary =
      "A graduate-studio concept for neighborhood travel. I later rebuilt it as a working portfolio demo.";

    expect(content).toContain(`summary: ${summary}`);
    expect(projectPage).toMatch(
      /I collected 14 resident and stakeholder responses/i,
    );
    expect(projectPage).not.toContain("{project?.summary ??");
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
      /What I learned redirected[\s\S]{0,160}neighborhood context/i,
    );
    expect(projectPage).toMatch(
      /The research changed the product question/i,
    );
    expect(artifactCopy).not.toContain("not the same ten default stops");
    expect(artifactCopy).toContain(
      "Learn would open with the neighborhood’s inclusive history and local rhythm.",
    );
    expect(artifactCopy).toContain('className="nv-heatmap-map-selection"');
    expect(artifactCopy).toContain('className="nv-heatmap-map-context"');
    expect(artifactCopy).not.toContain('className="nv-heatmap-map-name">{activeName}.</strong>');
  });
});
