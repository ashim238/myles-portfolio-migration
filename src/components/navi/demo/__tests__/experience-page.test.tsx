import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import type React from "react";

vi.mock("next/dynamic", () => ({
  default: (
    factory: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    _opts?: unknown,
  ) => {
    let ResolvedComponent: React.ComponentType<Record<string, unknown>> | null = null;
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

import ExperiencePage from "@/app/work/navi/(minisite)/demo/experience/[slug]/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Experience page", () => {
  const e = EXPERIENCES[0];

  it("renders title, gallery, Learn/Plan/Go tabs, and booking card", () => {
    render(<ExperiencePage params={{ slug: e.slug }} />);
    expect(screen.getByRole("heading", { level: 1, name: e.title })).toBeInTheDocument();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Plan" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Go" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reserve now" })).toBeInTheDocument();
  });

  it("opens with Learn tab and shows the impact statement up front", () => {
    render(<ExperiencePage params={{ slug: e.slug }} />);
    expect(screen.getByRole("tab", { name: "Learn" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(e.impactStatement)).toBeVisible();
  });

  it("switching to Go reveals the transit options", async () => {
    render(<ExperiencePage params={{ slug: e.slug }} />);
    await userEvent.click(screen.getByRole("tab", { name: "Go" }));
    expect(screen.getByText(/q or r/i)).toBeVisible();
  });
});
