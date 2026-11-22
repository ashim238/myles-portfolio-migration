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
vi.mock("@/components/lead-media", () => ({
  LeadMedia: () => <figure data-testid="lead-media" />,
}));
vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ alt, src, previewSrc }: { alt: string; src: string; previewSrc?: string }) => (
    <span role="img" aria-label={alt} data-screen={src} data-preview={previewSrc} />
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
    ).toHaveClass("fg-prototype-limit-label");
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
    expect(container.querySelector('a[href="#fg-app-walkthrough"]')).not.toBeNull();

    expect(container.querySelectorAll(".project-chapter")).toHaveLength(6);
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>(
          ".project-chapter > header > .project-chapter-title",
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

    expect(frame).toHaveTextContent("The Green Book and the drive home");
    expect(research).toHaveTextContent(
      "Drivers couldn't compare the conditions they cared about across routes before choosing.",
    );
    const participants = within(research).getByLabelText("Interview participants");
    expect(participants).toHaveTextContent("Six Black drivers of different genders");
    expect(participants).toHaveTextContent("Across the South");
    expect(participants).toHaveTextContent("19 to 34");
    expect(research.querySelector("blockquote")).toHaveTextContent("bright where you are and dark where you arrive");
    expect(within(research).getByText("police encounters", { selector: "strong" })).toBeInTheDocument();
    expect(frame.querySelector("#fg-app-walkthrough")).toBeInTheDocument();
    expect(within(chapter(container, "fg-design")).getByRole("heading", {name: /three onboarding screens/i})).toBeInTheDocument();
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
    expect(plan).toHaveTextContent("I kept the information architecture");
    expect(plan).toHaveTextContent("Chicago to rural Georgia");
    expect(plan).toHaveTextContent(
      'comparison below uses a neutral label',
    );
    expect(respond).toHaveTextContent(
      "In the pulled-over flow, I ask “Are you armed?” first. Which guidance applies depends on the driver's answer and the state they're in.",
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

  it("pairs the final illustration sequence and car drawings with their native screens", async () => {
    const { container } = render(await FreshGreensPage());
    const gallery = within(chapter(container, "fg-design")).getByRole("region", {
      name: "Drawing the first three onboarding screens",
    });
    const pairedFiles = within(gallery).getAllByRole("img").map((image) =>
      [image.dataset.preview, image.dataset.screen].map((path) => path?.split("/").pop()),
    );
    expect(pairedFiles).toEqual([
      ["at-the-wheel.svg", "panel-1-screen.webp"],
      ["for-us-by-us.svg", "panel-2-screen.webp"],
      ["your-viewpoint.svg", "panel-3-screen.webp"],
      ["get-started-cars.png", "get-started-screen.webp"],
      ["permissions-car.svg", "permissions-screen.webp"],
    ]);
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
