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

// Test the pure inner view, not the outer params-Promise unwrapper, to avoid
// Suspense ceremony in jsdom. The page-level Promise.unwrap is a thin bridge.
import { ExperienceView } from "@/app/work/navi/(minisite)/demo/experience/[slug]/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";
import { neighborhoodSlug } from "@/lib/navi/neighborhoods";

describe("Experience page", () => {
  const e = EXPERIENCES[0];

  it("renders title, gallery, Learn/Plan/Go sections, and booking card", () => {
    render(<ExperienceView experience={e} />);
    expect(screen.getByRole("heading", { level: 1, name: e.title })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Sections" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("renders the impact statement and transit options on the same page", () => {
    render(<ExperienceView experience={e} />);
    expect(screen.getByText(e.impactStatement)).toBeVisible();
    expect(screen.getByText(/q or r/i)).toBeVisible();
  });

  it("marks Learn as the initial active section", () => {
    render(<ExperienceView experience={e} />);
    expect(screen.getByRole("button", { name: "Learn" })).toHaveAttribute("aria-current", "true");
  });

  it("links the Hosted-by name to the host page", () => {
    render(<ExperienceView experience={e} />);
    expect(
      screen.getByRole("link", { name: e.host.name }),
    ).toHaveAttribute("href", `/work/navi/demo/host/${e.host.slug}`);
  });

  it("links to the neighborhood page from the Go section", () => {
    render(<ExperienceView experience={e} />);
    const link = screen.getByRole("link", {
      name: new RegExp(`^Explore ${e.neighborhood}`),
    });
    expect(link).toHaveAttribute(
      "href",
      `/work/navi/demo/neighborhood/${neighborhoodSlug(e.neighborhood)}`,
    );
  });
});
