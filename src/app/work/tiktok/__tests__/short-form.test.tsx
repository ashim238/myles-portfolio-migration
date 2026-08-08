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

  it("links the evidence trailhead to the template-system explanation", async () => {
    const { container } = render(await TikTokPage());

    expect(
      screen.getByText(
        "Static shipped deliverable with an interactive explanation",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Inspect the template system" }),
    ).toHaveAttribute("href", "#tt-system");

    const target = container.querySelector("#tt-system");
    const chapter = target?.closest(".project-chapter");
    expect(chapter).not.toBeNull();
    expect(
      within(chapter as HTMLElement).getByTestId("template-system"),
    ).toBeInTheDocument();
  });

  it("publishes four visual beats without the retired component stack", async () => {
    render(await TikTokPage());

    const hero = document.querySelector(".tt-cover");
    expect(hero).toHaveClass("tt-cover--preview");
    for (const chapter of CASE_STUDY_CHAPTERS.tiktok) {
      expect(
        screen.getByRole("heading", { name: chapter.title }),
      ).toHaveAttribute("id", chapter.id);
    }

    expect(screen.getByTestId("template-system")).toBeInTheDocument();
    const outcome = document.querySelector(".tt-preview-outcome") as HTMLElement;
    expect(outcome).not.toBeNull();
    expect(outcome).toHaveTextContent("Critique");
    expect(outcome).toHaveTextContent("My response");
    expect(outcome).toHaveTextContent("Shipped result");
    expect(
      within(outcome).getByRole("img", { name: "Light Academia process sketch" }),
    ).toBeInTheDocument();
    expect(
      within(outcome).getByRole("img", {
        name: "Light Academia editorial title asset",
      }),
    ).toBeInTheDocument();
    expect(
      within(outcome).getByRole("img", {
        name: "Finished Light Academia catalog template",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "I later learned through Global Creative Lab that American Eagle selected it.",
      ),
    ).toHaveClass("case-highlight");

    expect(screen.getByTestId("project-toc")).toBeInTheDocument();
    expect(screen.getByTestId("project-work-jump")).toBeInTheDocument();
    expect(screen.queryByTestId("console-hello")).not.toBeInTheDocument();
    expect(screen.queryByTestId("system-overview-band")).not.toBeInTheDocument();
    expect(screen.queryByTestId("outcome-card")).not.toBeInTheDocument();
    expect(screen.queryByTestId("lineage-timeline")).not.toBeInTheDocument();
  });

  it("defines the deliverable once instead of repeating six brief facts", async () => {
    const { container } = render(await TikTokPage());
    const chapters = Array.from(
      container.querySelectorAll<HTMLElement>(".project-chapter"),
    );

    expect(chapters).toHaveLength(4);
    expect(
      chapters.map((chapter) => chapter.querySelector("h2")?.id),
    ).toEqual(["tt-brief", "tt-research", "tt-system", "tt-outcome"]);

    const brief = container.querySelector("#tt-brief")?.closest(".project-chapter");
    expect(brief).toHaveTextContent(
      "Dynamic Showcase Ads turned brand catalogs into reusable ad templates with fixed product slots.",
    );
    expect(brief).toHaveTextContent("three static, layered Photoshop directions");
    expect(brief?.querySelector("dl")).toBeNull();
    expect(brief).not.toHaveTextContent("Intended use");
    expect(brief).not.toHaveTextContent("Variable parts");
  });

  it("uses a light direction strip and keeps the full comparison in Build", async () => {
    const { container } = render(await TikTokPage());
    const research = container
      .querySelector("#tt-research")
      ?.closest(".project-chapter") as HTMLElement;
    const system = container
      .querySelector("#tt-system")
      ?.closest(".project-chapter") as HTMLElement;

    for (const reference of [
      "Y2K",
      "Maximalism",
      "Dark Academia",
      "WitchTok",
      "Cottagecore",
    ]) {
      expect(research).toHaveTextContent(reference);
    }
    for (const direction of [
      "#DopamineDressing",
      "#e-Boy/#e-Girl",
      "#LightAcademia",
    ]) {
      expect(research).toHaveTextContent(direction);
    }
    expect(research).toHaveTextContent("Three directions, one catalog structure.");
    expect(research).toHaveTextContent("Bright color, oversized type");
    expect(research).toHaveTextContent("Dark texture, harder edges");
    expect(research).toHaveTextContent("Editorial type, softer color");
    expect(research).not.toHaveTextContent("Authored regions");

    expect(within(system).getByTestId("template-system")).toBeInTheDocument();
    expect(system).toHaveTextContent("layered Photoshop file");
    expect(system).toHaveTextContent("Feedback summaries are paraphrased");
    expect(system.querySelector(".tt-preview-process-list")).toBeNull();
    expect(system).not.toHaveTextContent("Process sketch");
  });

  it("orders the Light Academia critique, response, result, and relationship", async () => {
    const { container } = render(await TikTokPage());
    const outcome = container
      .querySelector("#tt-outcome")
      ?.closest(".project-chapter") as HTMLElement;
    const labels = within(outcome)
      .getAllByText(/^(Critique|My response|Shipped result)$/)
      .map((node) => node.textContent);
    const relationship = within(outcome).getByText(
      "I later learned through Global Creative Lab that American Eagle selected it.",
    );

    expect(labels).toEqual(["Critique", "My response", "Shipped result"]);
    expect(outcome).toHaveTextContent(
      "Global Creative Lab felt the simplicity was working and encouraged a more upbeat, deliberate direction.",
    );
    expect(outcome).toHaveTextContent(
      "I kept the fixed catalog slot and refined the editorial title, color, and supporting details.",
    );
    expect(outcome).toHaveTextContent("Light Academia entered the launch library.");

    const shippedStep = within(outcome).getByText("Shipped result").closest("li");
    expect(shippedStep?.compareDocumentPosition(relationship)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("keeps outcome cards inside the sequence flow", () => {
    const css = readFileSync(
      resolve(process.cwd(), "src/app/styles/portfolio-surfaces.css"),
      "utf8",
    );
    const stepRule = css.match(/\.tt-outcome-step\s*\{([^}]*)\}/)?.[1] ?? "";
    const figureRule =
      css.match(/\.tt-outcome-step figure\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(stepRule).toMatch(/display:\s*grid/);
    expect(stepRule).toMatch(/grid-template-rows:\s*auto 1fr/);
    expect(figureRule).toMatch(/min-height:\s*0/);
    expect(figureRule).not.toMatch(/min-height:\s*100%/);
  });

  it("retires the duplicate preview route and unsupported claims", () => {
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
    expect(page).not.toContain("does not land");
    expect(page).not.toContain("stays native to each audience");
    expect(page).not.toContain("product-level work");
    expect(page).not.toContain("One skeleton. Three fills.");
    expect(page).not.toContain("One catalog structure. Three templates.");
  });
});
