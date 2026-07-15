import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import type React from "react";

vi.mock("next/dynamic", () => ({
  default: (
    factory: () => Promise<{ default: React.ComponentType<Record<string, unknown>> }>,
    opts?: unknown,
  ) => {
    void opts;
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
  default: ({ markers }: { markers: { id: string }[] }) => (
    <div data-testid="map-mock">{markers.length} markers</div>
  ),
}));

import SearchPage from "@/app/work/navi/(minisite)/demo/search/page";
import { EXPERIENCES } from "@/lib/navi/demo-data";

describe("Search page", () => {
  it("shows a result count header", () => {
    render(<SearchPage />);
    expect(
      screen.getByRole("heading", { name: new RegExp(`${EXPERIENCES.length} nearby`, "i") }),
    ).toBeInTheDocument();
  });

  it("filters results by typed query and updates the count", async () => {
    render(<SearchPage />);
    const box = screen.getByRole("searchbox");
    await userEvent.type(box, "prospect");
    const onlyMatches = EXPERIENCES.filter((e) =>
      `${e.title} ${e.neighborhood}`.toLowerCase().includes("prospect"),
    );
    expect(
      screen.getByRole("heading", { name: new RegExp(`${onlyMatches.length} nearby`, "i") }),
    ).toBeInTheDocument();
  });

  it("renders the map and the legend", () => {
    render(<SearchPage />);
    expect(screen.getByRole("region", { name: /map/i })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /legend/i })).toBeInTheDocument();
  });

  it("announces the live result count to assistive tech", () => {
    render(<SearchPage />);
    const heading = screen.getByRole("heading", {
      name: new RegExp(`${EXPERIENCES.length} nearby`, "i"),
    });
    expect(heading).toHaveAttribute("aria-live", "polite");
  });

  it("announces the empty state when nothing matches", async () => {
    render(<SearchPage />);
    await userEvent.type(screen.getByRole("searchbox"), "zzzznotarealplace");
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent(/no matches/i);
  });
});
