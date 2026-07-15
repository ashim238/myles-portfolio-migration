import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";

const getProjectBySlug = vi.fn();
const getPublishedProjects = vi.fn();

vi.mock("@/lib/content", () => ({
  getProjectBySlug: (slug: string) => getProjectBySlug(slug),
  getPublishedProjects: () => getPublishedProjects(),
}));

vi.mock("@/components/site-nav", () => ({
  SiteNav: () => <nav aria-label="Primary" />,
}));

vi.mock("@/components/project-toc", () => ({
  ProjectToc: () => <nav data-testid="project-toc" />,
}));

vi.mock("@/components/recruiter-cut", () => ({
  RecruiterCut: () => <section data-testid="recruiter-cut" />,
}));

vi.mock("@/components/project-work-jump", () => ({
  ProjectWorkJump: () => <nav data-testid="project-work-jump" />,
}));

vi.mock("@/components/case-highlight-observer", () => ({
  CaseHighlightObserver: () => <div data-testid="case-highlight-observer" />,
}));

vi.mock("@/components/tiktok-dsa", () => ({
  AestheticShowcaseCard: ({ name }: { name: string }) => (
    <article data-testid="aesthetic-card">{name}</article>
  ),
  ConsoleHello: () => <div data-testid="console-hello" />,
  HeroThreePhones: () => <figure data-testid="hero-three-phones" />,
  LineageTimeline: () => <figure data-testid="lineage-timeline" />,
  OutcomeCard: () => <article data-testid="outcome-card" />,
  SystemOverviewBand: () => <figure data-testid="system-overview-band" />,
  TemplateAnatomy: () => <figure data-testid="template-anatomy" />,
  TikTokCoverBlobs: () => <div aria-hidden="true" />,
  TikTokLogo: () => <span aria-hidden="true" />,
}));

import TikTokPage from "@/app/work/tiktok/page";

const project: Project = {
  slug: "tiktok",
  title: "TikTok Dynamic Showcase Ads",
  summary: "Summary",
  role: "Visual Designer, Brand Studio",
  timeframe: "May – August 2021",
  status: "published",
  order: 4,
  tags: [],
  sections: [],
  bodyHtml: "",
};

describe("TikTok short-form case study", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getProjectBySlug.mockResolvedValue(project);
    getPublishedProjects.mockResolvedValue([project]);
  });

  it("leads with finished work and keeps only the approved artifact-led beats", async () => {
    render(await TikTokPage());

    const hero = screen.getByRole("banner");
    const lede = hero.querySelector(".tt-lede");
    const finishedWork = within(hero).getByTestId("hero-three-phones");
    expect(lede).not.toBeNull();
    expect(
      lede!.compareDocumentPosition(finishedWork) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    expect(screen.getByTestId("recruiter-cut")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "One skeleton. Three fills." }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("template-anatomy")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Three aesthetics." }),
    ).toBeInTheDocument();
    expect(screen.getAllByTestId("aesthetic-card")).toHaveLength(3);
    expect(
      screen.getByText("American Eagle adopted the Light Academia template."),
    ).toHaveClass("case-highlight");
    expect(screen.getByTestId("project-work-jump")).toBeInTheDocument();
    expect(screen.getByTestId("case-highlight-observer")).toBeInTheDocument();

    expect(screen.queryByTestId("project-toc")).not.toBeInTheDocument();
    expect(screen.queryByTestId("console-hello")).not.toBeInTheDocument();
    expect(screen.queryByTestId("system-overview-band")).not.toBeInTheDocument();
    expect(screen.queryByTestId("outcome-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lineage-timeline")).not.toBeInTheDocument();
    expect(screen.queryByText("The full breakdown ↓")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Five subcultures. Three buckets." }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "What it actually taught me." }),
    ).not.toBeInTheDocument();
  });

  it("removes unsupported or inflated claims from the rendered route source", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/work/tiktok/page.tsx"),
      "utf8",
    );

    expect(source).not.toContain("does not land");
    expect(source).not.toContain("stays native to each audience");
    expect(source).not.toContain("researching an audience");
    expect(source).not.toContain("product-level work");
    expect(source).not.toContain("2022");
  });

  it("avoids repeating the same compressed reference cadence across all three cards", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/app/work/tiktok/page.tsx"),
      "utf8",
    );

    expect(source).not.toContain(
      "70s psychedelia: fluid forms, bold patterning, color treated as content.",
    );
    expect(source).not.toContain(
      "Grungy punk magazine: texture, distress, dimension.",
    );
    expect(source).not.toContain(
      "Acne Studios pastels: clean, restrained, anchored.",
    );
  });
});
