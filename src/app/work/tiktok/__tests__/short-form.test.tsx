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

  it("links the evidence trailhead to the rendered template-system explanation", async () => {
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
    expect(target).not.toBeNull();
    const chapter = target?.closest(".project-chapter");
    expect(chapter).not.toBeNull();
    expect(within(chapter as HTMLElement).getByTestId("template-system")).toBeInTheDocument();
  });

  it("publishes the approved artifact-led preview as the canonical case study", async () => {
    render(await TikTokPage());

    const hero = document.querySelector(".tt-cover");
    expect(hero).not.toBeNull();
    expect(hero).toHaveClass("tt-cover--preview");
    expect(screen.queryByTestId("hero-three-phones")).not.toBeInTheDocument();

    expect(
      screen.getByRole("region", { name: "At a glance" }),
    ).toBeInTheDocument();
    for (const chapter of CASE_STUDY_CHAPTERS.tiktok) {
      expect(
        screen.getByRole("heading", { name: chapter.title }),
      ).toHaveAttribute("id", chapter.id);
    }
    expect(screen.getByTestId("template-system")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: CASE_STUDY_CHAPTERS.tiktok[3].title,
      }),
    ).toHaveAttribute("id", "tt-outcome");
    const outcome = document.querySelector(".tt-preview-outcome");
    expect(outcome).not.toBeNull();
    expect(outcome).toHaveTextContent("Critique");
    expect(outcome).toHaveTextContent("My response");
    expect(outcome).toHaveTextContent("Shipped result");
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

  it("defines DSA before research and renders the four approved beats", async () => {
    const { container } = render(await TikTokPage());
    const renderedChapters = Array.from(
      container.querySelectorAll<HTMLElement>(".project-chapter"),
    );

    expect(
      CASE_STUDY_CHAPTERS.tiktok.map(({ id, stage }) => ({ id, stage })),
    ).toEqual([
      { id: "tt-brief", stage: "Brief" },
      { id: "tt-research", stage: "Choose" },
      { id: "tt-system", stage: "Build" },
      { id: "tt-outcome", stage: "Deliver" },
    ]);
    expect(renderedChapters).toHaveLength(4);
    expect(
      renderedChapters.map((chapter) => chapter.querySelector("h2")?.id),
    ).toEqual(["tt-brief", "tt-research", "tt-system", "tt-outcome"]);

    const brief = container.querySelector("#tt-brief")?.closest(".project-chapter");
    const research = container
      .querySelector("#tt-research")
      ?.closest(".project-chapter");
    expect(brief).not.toBeNull();
    expect(research).not.toBeNull();
    expect(brief?.compareDocumentPosition(research as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(brief).toHaveTextContent(
      "DSA needed reusable brand catalog templates built around fixed product slots. I had to see how much visual range I could create without moving that structure.",
    );

    const facts = brief?.querySelector("dl");
    expect(facts).not.toBeNull();
    expect(
      Array.from(facts!.querySelectorAll("dt"), (term) => term.textContent),
    ).toEqual([
      "Role",
      "Team",
      "Intended use",
      "Deliverable",
      "Fixed parts",
      "Variable parts",
    ]);
    expect(
      within(facts as HTMLElement).getByText("Creative Strategist Intern"),
    ).toBeInTheDocument();
    expect(
      within(facts as HTMLElement).getByText("Global Creative Lab"),
    ).toBeInTheDocument();
  });

  it("explains why five references became three directions inside one slot map", async () => {
    const { container } = render(await TikTokPage());
    const research = container
      .querySelector("#tt-research")
      ?.closest(".project-chapter") as HTMLElement;
    const system = container
      .querySelector("#tt-system")
      ?.closest(".project-chapter") as HTMLElement;

    expect(research).toHaveTextContent("Y2K");
    expect(research).toHaveTextContent("Maximalism");
    expect(research).toHaveTextContent("Dark Academia");
    expect(research).toHaveTextContent("WitchTok");
    expect(research).toHaveTextContent("Cottagecore");
    expect(research).toHaveTextContent(
      "Dopamine Dressing, e-Boy/e-Girl, and Light Academia gave the fixed slot map three visibly different directions, so I moved them forward.",
    );
    expect(research).toHaveTextContent("Dopamine Dressing");
    expect(research).toHaveTextContent("e-Boy/e-Girl");
    expect(research).toHaveTextContent("Light Academia");

    expect(within(system).getByTestId("template-system")).toBeInTheDocument();
    expect(
      within(system)
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["#DopamineDressing", "#e-Boy/#e-Girl", "#LightAcademia"]);
    expect(within(system).getAllByText("Static template")).toHaveLength(3);
    expect(system).toHaveTextContent("layered Photoshop");
    expect(system).toHaveTextContent(
      "I built and handed off three static directions as layered Photoshop files.",
    );
    expect(system).toHaveTextContent(
      /most parts stayed inside their own visual system/i,
    );
    expect(system).toHaveTextContent(
      "While building the files, I proposed a limited amount of cross-direction modularity.",
    );

    const disclosure = within(system).getByText(/notes below paraphrase/i);
    const processCards = system.querySelector(".tt-preview-process-list");
    expect(processCards).not.toBeNull();
    expect(disclosure.compareDocumentPosition(processCards as Node)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
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
      screen.getByRole("heading", {
        level: 2,
        name: "From critique to the launch library",
      }),
    ).toBeInTheDocument();
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
    expect(outcome).toHaveTextContent(
      "Light Academia entered the launch library.",
    );

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
