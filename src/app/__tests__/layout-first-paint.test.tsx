import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import RootLayout from "@/app/layout";

vi.mock("@/components/console-greeting", () => ({ ConsoleGreeting: () => null }));
vi.mock("@/components/dot-cursor", () => ({ DotCursor: () => null }));
vi.mock("@/components/lightbox-provider", () => ({
  LightboxProvider: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("@/components/mobile-nav", () => ({ MobileNav: () => null }));
vi.mock("@/components/project-enter-transition", () => ({
  ProjectEnterTransition: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("@/components/scroll-reveal-fallback", () => ({
  ScrollRevealFallback: () => null,
}));

describe("root layout first paint", () => {
  it("declares smooth scrolling on the root html element", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Portfolio</main>
      </RootLayout>,
    );
    const document = new DOMParser().parseFromString(markup, "text/html");

    expect(document.documentElement.getAttribute("data-scroll-behavior")).toBe(
      "smooth",
    );
  });

  it("does not inject a script that hides homepage content before hydration", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Portfolio</main>
      </RootLayout>,
    );

    expect(markup).not.toContain("home-intro-guard");
    expect(markup).not.toContain("home-intro-wait");
    expect(markup).toContain("theme-init");
  });

  it("applies the saved or operating-system theme before hydration", () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>Portfolio</main>
      </RootLayout>,
    );
    const document = new DOMParser().parseFromString(markup, "text/html");
    const themeScript = document.querySelector("#theme-init")?.textContent ?? "";

    expect(themeScript).toContain('t==="dark"||t==="light"');
    expect(themeScript).toContain('matchMedia("(prefers-color-scheme: light)")');
    expect(themeScript).toContain('setAttribute("data-theme",v)');
  });
});
