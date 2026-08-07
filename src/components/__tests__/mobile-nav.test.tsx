import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

const baseStyles = readFileSync(
  resolve(process.cwd(), "src/app/styles/base.css"),
  "utf8",
);

const route = vi.hoisted(() => ({ pathname: "/" }));

vi.mock("next/navigation", () => ({
  usePathname: () => route.pathname,
}));

import { MobileNav } from "@/components/mobile-nav";
import { SiteNavList } from "@/components/site-nav-list";

describe("MobileNav route ownership", () => {
  beforeEach(() => {
    route.pathname = "/";
  });

  it.each([
    "/",
    "/about",
    "/play",
    "/resume",
    "/work/fresh-greens",
    "/work/understandingfafsa",
    "/work/navi",
    "/work/tiktok",
    "/work/other-project",
    "/work/navi/demo",
    "/work/navi/demo/experience/harlem-jazz-walk",
    "/work/navi/system",
    "/work/navi/system/components",
  ])("stays out of Myles 98, Reader, or Navi-owned route %s", (pathname) => {
    route.pathname = pathname;
    render(<MobileNav />);
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it("uses an opaque-enough surface to keep legacy-owned page content from bleeding through", () => {
    expect(baseStyles).toContain(
      "background: color-mix(in srgb, var(--background) 96%, transparent)",
    );
  });

  it("marks Selected Work current on the legacy /work index", () => {
    route.pathname = "/work";
    const { container } = render(
      <>
        <MobileNav />
        <SiteNavList />
      </>,
    );

    const mobile = screen.getByRole("navigation", {
      name: "Mobile navigation",
    });
    expect(
      within(mobile).getByRole("link", { name: "Selected Work" }),
    ).toHaveAttribute("aria-current", "page");
    expect(
      container.querySelector('.site-nav-list a[href="/#selected-work"]'),
    ).toHaveAttribute("aria-current", "page");
  });
});