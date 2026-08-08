import type { ReactNode } from "react";
import { render, within } from "@testing-library/react";
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
vi.mock("@/components/transition-link", () => ({
  TransitionLink: ({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));
vi.mock("@/components/project-toc", () => ({
  ProjectToc: () => <nav data-testid="project-toc" />,
}));
vi.mock("@/components/project-work-jump", () => ({
  ProjectWorkJump: () => <nav data-testid="project-work-jump" />,
}));
vi.mock("@/components/case-highlight-observer", () => ({
  CaseHighlightObserver: () => <div data-testid="highlight-observer" />,
}));
vi.mock("@/components/lead-media", () => ({
  LeadMedia: () => <figure data-testid="lead-media" />,
}));
vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ alt }: { alt: string }) => (
    <span role="img" aria-label={alt} />
  ),
}));
vi.mock("@/components/fresh-greens", () => ({
  ArchitectureDiagram: () => <figure data-testid="architecture-diagram" />,
  PhoneFrame: ({ children }: { children: ReactNode }) => (
    <div data-testid="phone-frame">{children}</div>
  ),
  ReservedPalette: () => <figure data-testid="reserved-palette" />,
}));
vi.mock("@/components/fresh-greens/pivot-journey", () => ({
  PivotJourney: () => <figure data-testid="pivot-journey" />,
}));
vi.mock("@/components/fresh-greens/pulled-over-journey", () => ({
  PulledOverJourney: () => <section data-testid="pulled-over-journey" />,
}));
vi.mock("@/components/fresh-greens/research-synthesis", () => ({
  ResearchSynthesis: () => <section data-testid="research-synthesis" />,
}));
vi.mock("@/components/fresh-greens/onboarding-illustration-sequence", () => ({
  OnboardingIllustrationSequence: () => (
    <figure data-testid="onboarding-sequence" />
  ),
}));
vi.mock("@/components/fresh-greens/token-exhibit", () => ({
  TokenExhibit: () => <figure data-testid="token-exhibit" />,
}));

import FreshGreensPage from "@/app/work/fresh-greens/page";

const project: Project = {
  slug: "fresh-greens",
  title: "Fresh Greens",
  summary: "Summary",
  role: "Product Designer",
  timeframe: "2025",
  status: "published",
  order: 1,
  tags: [],
  sections: [],
  bodyHtml: "",
};

function chapter(container: HTMLElement, id: string) {
  const heading = container.querySelector(`#${id}`);
  const owner = heading?.closest<HTMLElement>(".project-chapter");
  expect(owner, `${id} chapter`).not.toBeNull();
  return owner as HTMLElement;
}

describe("Fresh Greens rendered narrative ownership", () => {
  beforeEach(() => {
    getProjectBySlug.mockReset();
    getPublishedProjects.mockReset();
    getProjectBySlug.mockResolvedValue(project);
    getPublishedProjects.mockResolvedValue([project]);
  });

  it("keeps each major decision beside the proof that explains it", async () => {
    const { container } = render(await FreshGreensPage());
    const pivot = chapter(container, "fg-design");
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");
    const validation = chapter(container, "fg-scope");

    expect(within(pivot).getByTestId("pivot-journey")).toBeInTheDocument();
    expect(within(pivot).queryByTestId("architecture-diagram")).not.toBeInTheDocument();
    expect(within(pivot).getByText("Time to head out")).toBeInTheDocument();
    expect(
      within(pivot).getByRole("img", {
        name: /route preview showing route conditions, daylight timing/i,
      }),
    ).toBeInTheDocument();

    expect(
      within(respond).getByTestId("pulled-over-journey"),
    ).toBeInTheDocument();
    expect(within(respond).queryByTestId("pivot-journey")).not.toBeInTheDocument();

    expect(
      within(trust).getByRole("img", {
        name: /Felt welcome contribution form/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(trust).getByLabelText("How a report moves through moderation"),
    ).toBeInTheDocument();

    expect(within(validation).getByText("Basic functionality achieved!")).toBeInTheDocument();
    expect(within(validation).getByText("What I could test")).toBeInTheDocument();
    expect(within(validation).getByText("What still needs testing")).toBeInTheDocument();

    expect(container.querySelector('a[href="#fg-pulled-over"]')).not.toBeNull();
    expect(container.querySelectorAll(".project-chapter")).toHaveLength(6);
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>(
          ".project-chapter > .project-chapter-title",
        ),
        (heading) => heading.id,
      ),
    ).toEqual(
      CASE_STUDY_CHAPTERS["fresh-greens"].map((entry) => entry.id),
    );
    expect(container.querySelectorAll("#fg-pulled-over")).toHaveLength(1);
    expect(container.querySelectorAll(".project-evidence-heading")).toHaveLength(0);
    expect(container.querySelector('[data-testid="research-synthesis"]')).toBeNull();
    expect(container.querySelector('[data-testid="onboarding-sequence"]')).toBeNull();
    expect(container.querySelector('[data-testid="token-exhibit"]')).toBeNull();
  });

  it("moves from the personal origin into a problem, opportunity, and goal", async () => {
    const { container } = render(await FreshGreensPage());
    const frame = chapter(container, "fg-problem");
    const research = chapter(container, "fg-research");

    expect(frame).toHaveTextContent("Maps found the fastest route");
    expect(frame).toHaveTextContent("I interviewed six Black drivers");
    expect(research).toHaveTextContent("useful safety knowledge lived outside navigation");
    expect(research).toHaveTextContent("routes hid who or what shaped them");
    expect(research).toHaveTextContent("Problem");
    expect(research).toHaveTextContent("Opportunity");
    expect(research).toHaveTextContent("Goal");
    expect(research).toHaveTextContent("Help people feel more secure on the road");
  });

  it("keeps the pulled-over and trust claims bounded", async () => {
    const { container } = render(await FreshGreensPage());
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");

    expect(respond).toHaveTextContent("ACLU guidance");
    expect(respond).toHaveTextContent("hopefully never");
    expect(respond).toHaveTextContent("haven't tested it in a real encounter");

    expect(trust).toHaveTextContent("one report couldn't become an official-looking safety fact");
    expect(trust).toHaveTextContent("Similar reports should gain influence over time");
    expect(trust).toHaveTextContent("sparse coverage stays uncertain");
    expect(trust).toHaveTextContent("one report can affect one scored zone");
    expect(trust).toHaveTextContent("weighted corroboration");
    expect(trust).toHaveTextContent("public moderation transparency");
  });

  it("separates basic usability and functionality from intended-audience validation", async () => {
    const { container } = render(await FreshGreensPage());
    const validation = chapter(container, "fg-scope");
    const copy = validation.textContent ?? "";

    expect(validation).toHaveTextContent("tested the early Figma flows with classmates");
    expect(validation).toHaveTextContent("weren't the audience Fresh Greens was designed for");
    expect(validation).toHaveTextContent("entered their own addresses");
    expect(validation).toHaveTextContent("daylight gradient and all");
    expect(validation).toHaveTextContent("Route quality and trust with Black drivers across regions");
    expect(validation).toHaveTextContent("under stress and device failure");
    expect(copy).not.toMatch(/proved safety|made drivers safer|validated with Black drivers/i);
  });
});
