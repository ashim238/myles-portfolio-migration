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
    expect(within(plan).getByTestId("architecture-diagram")).toBeInTheDocument();
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
      within(trust).getByRole("img", {
        name: /Felt welcome contribution form/i,
      }),
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
    expect(trust).toHaveTextContent(/one report maps to one scored zone/i);
    expect(trust).toHaveTextContent("Corroboration-weighted ranking");
    expect(
      within(chapter(container, "fg-scope")).getByText("Built now"),
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

    expect(frame).toHaveTextContent("drove below the speed limit");
    expect(research).toHaveTextContent(
      "Drivers couldn't inspect conditions on each route before choosing.",
    );
    expect(research).toHaveTextContent(
      "Useful community knowledge lived outside navigation",
    );
  });

  it("frames the four trust states as intended before naming the current limit", async () => {
    const { container } = render(await FreshGreensPage());
    const respond = chapter(container, "fg-pulled-over");
    const trust = chapter(container, "fg-trust");
    const trustCopy = trust.textContent ?? "";

    expect(respond).toHaveTextContent("trusted-contact actions");
    expect(trust).toHaveTextContent("community contributors");
    expect(`${respond.textContent} ${trustCopy}`).not.toMatch(/trusted agents/i);
    expect(trust).toHaveTextContent(
      "Each report remained one person's account",
    );
    expect(
      trustCopy.indexOf("Each report remained"),
    ).toBeLessThan(trustCopy.indexOf("Current prototype limit:"));
    expect(trust).not.toHaveTextContent(
      "A single account is never hidden or treated as proof",
    );
    expect(trust).toHaveTextContent(
      "Over time, separate reports should carry more weight",
    );
    expect(trust).toHaveTextContent(
      "time-sensitive hazards could appear sooner",
    );
    expect(trust).toHaveTextContent(
      "Fresh Greens shows uncertainty where coverage is thin",
    );
    expect(trust).toHaveTextContent(/one report maps to one scored zone/i);
    expect(trust).toHaveTextContent(
      "Corroboration-weighted ranking is still an intended safeguard, not a built feature",
    );
    expect(trust).toHaveTextContent(
      "Contributor provenance and trust levels aren't visible yet",
    );
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
    expect(scope).toHaveTextContent(
      "I turned six interviews into a working React Native prototype for route comparison",
    );
    expect(scope).toHaveTextContent("can explain why it prefers one route");
    expect(scope).toHaveTextContent(
      "Respond: stress-state and failure-mode testing on real devices and configured builds",
    );
    expect(scope).toHaveTextContent(
      "before making any claim that a preferred route is safer",
    );
    expect(scopeCopy).not.toMatch(
      /improves safety|made drivers safer|a safer route recommendation/i,
    );
  });
});
