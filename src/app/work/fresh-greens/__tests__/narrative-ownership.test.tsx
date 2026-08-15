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
vi.mock("@/components/fresh-greens/departure-reminder-evidence", () => ({
  DepartureReminderEvidence: () => (
    <figure data-testid="departure-reminder-evidence" />
  ),
}));
vi.mock("@/components/fresh-greens/route-decision-evidence", () => ({
  RouteComparisonEvidence: () => (
    <figure data-testid="route-comparison-evidence" />
  ),
  ReportRouteInfluenceEvidence: () => (
    <figure data-testid="report-route-influence" />
  ),
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

  it("gives Plan, Respond, and Trust the approved evidence", async () => {
    const { container } = render(await FreshGreensPage());
    const plan = chapter(container, "fg-design");
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");

    expect(within(plan).getByTestId("pivot-journey")).toBeInTheDocument();
    expect(
      within(plan).getByTestId("departure-reminder-evidence"),
    ).toBeInTheDocument();
    expect(
      within(plan).getByTestId("route-comparison-evidence"),
    ).toBeInTheDocument();
    expect(
      within(plan).queryByTestId("architecture-diagram"),
    ).not.toBeInTheDocument();
    expect(
      within(plan).queryByTestId("pulled-over-journey"),
    ).not.toBeInTheDocument();

    expect(
      within(respond).getByTestId("pulled-over-journey"),
    ).toBeInTheDocument();
    expect(
      within(respond).queryByTestId("pivot-journey"),
    ).not.toBeInTheDocument();

    expect(
      within(trust).getByTestId("report-route-influence"),
    ).toBeInTheDocument();
    expect(
      within(trust).queryByRole("img", { name: /report picker/i }),
    ).not.toBeInTheDocument();
    expect(
      within(trust).getByLabelText("How a report moves through moderation"),
    ).toBeInTheDocument();
    expect(
      within(trust).getByText("Current prototype limit:"),
    ).toBeInTheDocument();
    expect(trust).toHaveTextContent(/one report creates a scored zone/i);
    expect(trust).toHaveTextContent("corroboration weighting");
    expect(
      within(chapter(container, "fg-scope")).getByText("Built now"),
    ).toBeInTheDocument();
    expect(
      within(chapter(container, "fg-scope")).getByTestId(
        "architecture-diagram",
      ),
    ).toBeInTheDocument();
    expect(
      within(chapter(container, "fg-scope")).getByText("What remains"),
    ).toBeInTheDocument();
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
    expect(container.querySelectorAll(".project-evidence-heading")).toHaveLength(
      0,
    );
    expect(
      container.querySelector('[data-testid="research-synthesis"]'),
    ).toBeNull();
    expect(
      container.querySelector('[data-testid="onboarding-sequence"]'),
    ).toBeNull();
    expect(container.querySelector('[data-testid="token-exhibit"]')).toBeNull();
  });

  it("connects the personal origin to the three research problems", async () => {
    const { container } = render(await FreshGreensPage());
    const frame = chapter(container, "fg-problem");
    const research = chapter(container, "fg-research");

    expect(frame).toHaveTextContent("I'd slow down, avoid backroads");
    expect(research).toHaveTextContent(
      "Drivers couldn't compare the conditions they cared about across routes before choosing.",
    );
    expect(research).toHaveTextContent(
      "Qualitative interviews were new to me, but I tried to navigate them like everyday conversations",
    );
    expect(research).toHaveTextContent(
      "I wasn't the only person getting the heebie-jeebies during a drive",
    );
  });

  it("carries the failed concept, product constraints, and search correction through the six chapters", async () => {
    const { container } = render(await FreshGreensPage());
    const plan = chapter(container, "fg-design");
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");
    const scope = chapter(container, "fg-scope");

    expect(plan).toHaveTextContent(
      "1. Compare route conditions before choosing",
    );
    expect(plan).toHaveTextContent("He was content, not impressed");
    expect(plan).toHaveTextContent("Chicago to rural Georgia");
    expect(plan).toHaveTextContent(
      'current build still labels the top option "Safest route,"',
    );
    expect(respond).toHaveTextContent(
      "One tap opens four support paths, including the pulled-over flow",
    );
    expect(respond).toHaveTextContent(
      "I haven't tested this flow with drivers yet, let alone during a real encounter.",
    );
    expect(trust).toHaveTextContent("The full score and its weights aren't exposed yet");
    expect(trust).toHaveTextContent("With Supabase configured");
    expect(scope).toHaveTextContent(
      "I used Figma to set the initial rules, then built them in code",
    );
    expect(scope).toHaveTextContent(/my own address was sitting in Recent/i);
    expect(scope).toHaveTextContent("I added street addresses");
  });

  it("frames current trust behavior before naming the route-ranking limit", async () => {
    const { container } = render(await FreshGreensPage());
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");
    const trustCopy = trust.textContent ?? "";

    expect(trust).toHaveTextContent(
      "Show what influenced a route recommendation",
    );
    expect(`${respond.textContent} ${trustCopy}`).not.toMatch(/trusted agents/i);
    expect(trust).toHaveTextContent("Reports stay on the device first");
    expect(trustCopy.indexOf("Reports stay on the device first")).toBeLessThan(
      trustCopy.indexOf("Current prototype limit:"),
    );
    expect(trust).not.toHaveTextContent(
      "A single account is never hidden or treated as proof",
    );
    expect(trust).toHaveTextContent(/one report creates a scored zone/i);
    expect(trust).toHaveTextContent(
      "I haven't added corroboration weighting, visible contributor provenance, or route-level trust tiers yet",
    );
    expect(within(trust).getByTestId("report-route-influence")).toBeInTheDocument();
  });

  it("keeps stress-state and failure-mode proof in the validation ledger", async () => {
    const { container } = render(await FreshGreensPage());
    const scope = chapter(container, "fg-scope");
    const scopeCopy = scope.textContent ?? "";

    expect(scope).toHaveTextContent("Built now");
    expect(scope).toHaveTextContent("What remains");
    expect(scopeCopy.indexOf("Built now")).toBeLessThan(
      scopeCopy.indexOf("What remains"),
    );
    expect(container).toHaveTextContent(
      "Working React Native prototype across 26+ screens",
    );
    expect(scope).toHaveTextContent(
      "The prototype still hasn't shown that a route is safer",
    );
    expect(scope).toHaveTextContent(
      "Respond: real-device stress-state and failure-mode testing in configured builds",
    );
    expect(scope).toHaveTextContent(
      "Trust: route-level corroboration by distinct contributors",
    );
    expect(scope).toHaveTextContent(
      "broader route-quality testing before any safety claim",
    );
    expect(scopeCopy).not.toMatch(
      /improves safety|made drivers safer|a safer route recommendation/i,
    );
  });
});
