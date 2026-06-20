import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("Experience page", () => {
  const e = EXPERIENCES[0];

  it("renders title, gallery, Learn/Plan/Go tabs, and booking card", () => {
    render(<ExperienceView experience={e} />);
    expect(screen.getByRole("heading", { level: 1, name: e.title })).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("opens with Learn tab and shows the impact statement up front", () => {
    render(<ExperienceView experience={e} />);
    expect(screen.getByRole("tab", { name: "Learn" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(e.impactStatement)).toBeVisible();
  });

  it("switching to Go reveals the transit options", async () => {
    render(<ExperienceView experience={e} />);
    await userEvent.click(screen.getByRole("tab", { name: "Go" }));
    expect(screen.getByText(/q or r/i)).toBeVisible();
  });
});
