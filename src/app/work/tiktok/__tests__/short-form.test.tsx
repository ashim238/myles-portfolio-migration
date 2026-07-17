import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Project } from "@/lib/content";
import { CASE_STUDY_CHAPTERS } from "@/lib/project-chapters";

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
  ProjectToc: ({
    sections,
  }: {
    sections: typeof CASE_STUDY_CHAPTERS.tiktok;
  }) => (
    <nav data-testid="project-toc">
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`}>
          {section.stage}: {section.title}
        </a>
      ))}
    </nav>
  ),
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

vi.mock("@/components/expandable-image", () => ({
  // Test double only: production rendering stays on the optimized image component.
  // eslint-disable-next-line @next/next/no-img-element
  ExpandableImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

vi.mock("@/components/tiktok-dsa", () => ({
  ConsoleHello: () => <div data-testid="console-hello" />,
  LineageTimeline: () => <figure data-testid="lineage-timeline" />,
  OutcomeCard: () => <article data-testid="outcome-card" />,
  SystemOverviewBand: () => <figure data-testid="system-overview-band" />,
  TikTokCoverBlobs: () => <div aria-hidden="true" />,
  TikTokLogo: () => <span aria-hidden="true" />,
  TikTokTemplateSystem: () => <section data-testid="template-system" />,
}));

import TikTokPage from "@/app/work/tiktok/page";

const project: Project = {
  slug: "tiktok",
  title: "TikTok Dynamic Showcase Ads",
  summary: "Summary",
  role: "Creative Strategist Intern · Global Creative Lab",
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

  it("publishes the approved artifact-led preview as the canonical case study", async () => {
    render(await TikTokPage());

    const hero = document.querySelector(".tt-cover");
    expect(hero).not.toBeNull();
    expect(hero).toHaveClass("tt-cover--preview");
    expect(screen.queryByTestId("hero-three-phones")).not.toBeInTheDocument();

    expect(screen.getByTestId("recruiter-cut")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Fashion subcultures on TikTok" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "The fixed catalog structure" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("template-system")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Templates as modular parts" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "From sketches to layered files" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What shipped from the launch batch" }),
    ).toHaveAttribute("id", "tt-outcome");
    const outcome = document.querySelector(".tt-preview-outcome");
    expect(outcome).not.toBeNull();
    expect(outcome).toHaveTextContent("Critique");
    expect(outcome).toHaveTextContent("Design move");
    expect(outcome).toHaveTextContent("Shipped direction");
    expect(
      within(outcome as HTMLElement).getByRole("img", {
        name: "Light Academia process sketch",
      }),
    ).toBeInTheDocument();
    expect(
      within(outcome as HTMLElement).getByRole("img", {
        name: "Light Academia editorial title asset",
      }),
    ).toBeInTheDocument();
    expect(
      within(outcome as HTMLElement).getByRole("img", {
        name: "Finished Light Academia catalog template",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Static template")).toHaveLength(3);
    expect(
      screen.getByText(
        "I later learned through Global Creative Lab that American Eagle selected it.",
      ),
    ).toHaveClass("case-highlight");
    expect(screen.getByTestId("project-work-jump")).toBeInTheDocument();
    expect(screen.getByTestId("case-highlight-observer")).toBeInTheDocument();

    expect(screen.getByTestId("project-toc")).toBeInTheDocument();
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

  it("frames the route as five one-to-one process chapters", async () => {
    render(await TikTokPage());

    const chapterHeadings = CASE_STUDY_CHAPTERS.tiktok.map((chapter) =>
      screen.getByRole("heading", { level: 2, name: chapter.title }),
    );

    expect(chapterHeadings.map((heading) => heading.id)).toEqual(
      CASE_STUDY_CHAPTERS.tiktok.map((chapter) => chapter.id),
    );
    expect(document.querySelectorAll(".project-chapter")).toHaveLength(5);
    expect(document.querySelectorAll(".project-chapter-title")).toHaveLength(5);
    expect(document.querySelectorAll(".tt-section h2")).toHaveLength(0);
    expect(document.querySelectorAll(".tt-preview-process > h2")).toHaveLength(0);

    const toc = screen.getByTestId("project-toc");
    for (const chapter of CASE_STUDY_CHAPTERS.tiktok) {
      expect(toc).toHaveTextContent(`${chapter.stage}: ${chapter.title}`);
    }
  });

  it("keeps the artifact cards and shipped claim intact inside chapters", async () => {
    render(await TikTokPage());

    for (const templateName of [
      "#DopamineDressing",
      "#e-Boy/#e-Girl",
      "#LightAcademia",
    ]) {
      expect(
        screen.getByRole("heading", { level: 3, name: templateName }),
      ).toBeInTheDocument();
    }

    expect(screen.getAllByText("Static template")).toHaveLength(3);
    expect(
      screen.getByText("Light Academia entered the launch library."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Dopamine Dressing entered the launch library/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(/e-Boy\/e-Girl entered the launch library/i),
    ).not.toBeInTheDocument();
  });

  it("retires the duplicate preview route and phone-based hero implementation", () => {
    const page = readFileSync(
      resolve(process.cwd(), "src/app/work/tiktok/page.tsx"),
      "utf8",
    );

    expect(
      existsSync(resolve(process.cwd(), "src/app/work/tiktok/preview/page.tsx")),
    ).toBe(false);
    expect(page).toContain("TikTokTemplateSystem");
    expect(page).not.toContain("HeroThreePhones");
    expect(page).not.toContain("hero-rolling-phones.png");
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

  it("removes the repeated three-part summary scaffold from page headings and copy", () => {
    const published = readFileSync(
      resolve(process.cwd(), "src/app/work/tiktok/page.tsx"),
      "utf8",
    );
    const component = readFileSync(
      resolve(process.cwd(), "src/components/tiktok-dsa.tsx"),
      "utf8",
    );

    for (const source of [published, component]) {
      expect(source).not.toContain("One skeleton. Three fills.");
      expect(source).not.toContain("Three aesthetics.");
      expect(source).not.toContain("One catalog structure. Three templates.");
      expect(source).not.toContain("Narrowed the landscape");
      expect(source).not.toContain("gives each template its own voice");
    }
  });
});
