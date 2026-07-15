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
  HeroInterestTyper: () => <p data-testid="endless-interest-typer" />,
}));

describe("homepage first impression", () => {
  it("leads with a broad role, concrete proof, credentials, and work link", async () => {
    render(await Home());

    expect(screen.getByText("Product Designer")).toBeInTheDocument();
    expect(
      screen.getByText("I design products end to end and tend to go past the prototype."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "For my Parsons thesis, I designed and built a React Native app with more than 26 screens, VoiceOver labels, dynamic type, and a WCAG dash pattern.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Previously TikTok and UMG. MFA in Design and Technology from Parsons.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View selected work" }),
    ).toHaveAttribute("href", "/#work");
  });

  it("does not block the homepage with intro choreography or an endless typer", async () => {
    render(await Home());

    expect(screen.queryByTestId("blocking-browser-intro")).toBeNull();
    expect(screen.queryByTestId("chained-home-entrance")).toBeNull();
    expect(screen.queryByTestId("home-focus-guard")).toBeNull();
    expect(screen.queryByTestId("home-intro-guard")).toBeNull();
    expect(screen.queryByTestId("endless-interest-typer")).toBeNull();
  });
});
