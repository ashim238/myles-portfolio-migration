import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { ComponentType } from "react";

vi.mock("next/dynamic", () => ({
  default: (
    factory: () => Promise<{ default: ComponentType<Record<string, unknown>> }>,
    _opts?: unknown,
  ) => {
    let ResolvedComponent: ComponentType<Record<string, unknown>> | null = null;
    factory().then((mod) => {
      ResolvedComponent = mod.default;
    });
    const DynamicStub = (props: Record<string, unknown>) => {
      if (!ResolvedComponent) return null;
      return <ResolvedComponent {...props} />;
    };
    DynamicStub.displayName = "DynamicStub";
    return DynamicStub;
  },
}));

vi.mock("@/components/navi/demo/Map.client", () => ({
  default: () => <div data-testid="map-mock" />,
}));

// Test the pure inner view directly. The server page is a thin bridge that
// resolves params and computes the booking/review dates handed in here.
import { ExperienceView } from "@/app/work/navi/(minisite)/demo/experience/[slug]/ExperienceView";
import { EXPERIENCES, type Experience } from "@/lib/navi/demo-data";
import { neighborhoodSlug } from "@/lib/navi/neighborhoods";
import { getUpcomingSessions, formatRelativeMonth } from "@/lib/navi/calendar";

// Mirror what the server page passes the view: dates and review months computed
// from today. None of the assertions below depend on the specific dates.
function viewProps(exp: Experience) {
  const now = new Date();
  return {
    experience: exp,
    dates: getUpcomingSessions(exp.sessions, exp.upcomingCount, now),
    reviewDates: exp.reviewsList.map((r) => formatRelativeMonth(r.monthsAgo, now)),
  };
}

describe("Experience page", () => {
  const e = EXPERIENCES[0];

  it("renders title, gallery, Learn/Plan/Go sections, and booking card", () => {
    render(<ExperienceView {...viewProps(e)} />);
    expect(screen.getByRole("heading", { level: 1, name: e.title })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("renders the impact statement and transit options on the same page", () => {
    render(<ExperienceView {...viewProps(e)} />);
    expect(screen.getByText(e.impactStatement)).toBeVisible();
    expect(screen.getByText(/q or r/i)).toBeVisible();
  });

  it("marks Learn as the initial active section", () => {
    render(<ExperienceView {...viewProps(e)} />);
    expect(screen.getByRole("button", { name: "Learn" })).toHaveAttribute("aria-current", "true");
  });

  it("links every Hosted-by name to the host page", () => {
    // The host is named in two places now: the Learn intro and the booking
    // sidebar's trust footer. Both must resolve to the same host page.
    render(<ExperienceView {...viewProps(e)} />);
    const hostLinks = screen.getAllByRole("link", { name: e.host.name });
    expect(hostLinks.length).toBeGreaterThan(0);
    for (const link of hostLinks) {
      expect(link).toHaveAttribute("href", `/work/navi/demo/host/${e.host.slug}`);
    }
  });

  it("builds both impact cross-links from the experience's real theme", () => {
    const { container } = render(<ExperienceView {...viewProps(e)} />);
    const href = `/work/navi/demo/impact#${e.impactTheme}`;
    // one in the Learn section (ImpactSignal), one in the booking card.
    const links = container.querySelectorAll(`a[href="${href}"]`);
    expect(links.length).toBe(2);
  });

  it("uses each experience's own theme in the impact link, not a fixed value", () => {
    // A second experience with a different theme must produce a different href,
    // proving the link is derived from data rather than hardcoded.
    const other = EXPERIENCES.find((x) => x.impactTheme !== e.impactTheme);
    if (!other) throw new Error("fixture: need two distinct impact themes");
    const { container } = render(<ExperienceView {...viewProps(other)} />);
    expect(
      container.querySelector(`a[href="/work/navi/demo/impact#${other.impactTheme}"]`),
    ).toBeInTheDocument();
  });

  it("links to the neighborhood page from the Go section", () => {
    render(<ExperienceView {...viewProps(e)} />);
    const link = screen.getByRole("link", {
      name: new RegExp(`^Explore ${e.neighborhood}`),
    });
    expect(link).toHaveAttribute(
      "href",
      `/work/navi/demo/neighborhood/${neighborhoodSlug(e.neighborhood)}`,
    );
  });
});
