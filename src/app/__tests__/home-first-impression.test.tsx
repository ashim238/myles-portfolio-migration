import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

vi.mock("@/lib/content", () => ({
  getPublishedProjects: vi.fn().mockResolvedValue([]),
  getDraftProjects: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/components/site-nav", () => ({
  SiteNav: () => <nav aria-label="Primary" />,
}));

vi.mock("@/components/work-gallery", () => ({
  WorkGallery: () => <div data-testid="work-gallery" />,
}));

vi.mock("@/components/home-browser-intro", () => ({
  HomeBrowserIntro: () => <div data-testid="blocking-browser-intro" />,
}));

vi.mock("@/components/home-entrance", () => ({
  HomeEntrance: () => <div data-testid="chained-home-entrance" />,
}));

vi.mock("@/components/home-intro-focus-guard", () => ({
  HomeIntroFocusGuard: () => <div data-testid="home-focus-guard" />,
}));

vi.mock("@/components/home-intro-guard", () => ({
  HomeIntroGuard: () => <div data-testid="home-intro-guard" />,
}));

vi.mock("@/components/hero-interest-typer", () => ({
  HeroInterestTyper: () => <p data-testid="finite-interest-decoder" />,
}));

describe("homepage first impression", () => {
  it("leads with a broad role, concrete proof, credentials, and work link", async () => {
    render(await Home());

    expect(screen.getByText("Product Designer")).toBeInTheDocument();
    expect(
      screen.getByText("I design digital products and stay close through the build."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Previously TikTok and UMG. My latest project is Fresh Greens.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByTestId("finite-interest-decoder")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View selected work" }),
    ).toHaveAttribute("href", "/#work");
  });

  it("does not block the homepage with intro choreography", async () => {
    render(await Home());

    expect(screen.queryByTestId("blocking-browser-intro")).toBeNull();
    expect(screen.queryByTestId("chained-home-entrance")).toBeNull();
    expect(screen.queryByTestId("home-focus-guard")).toBeNull();
    expect(screen.queryByTestId("home-intro-guard")).toBeNull();
  });
});
