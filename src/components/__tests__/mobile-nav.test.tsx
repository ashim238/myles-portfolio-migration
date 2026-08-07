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
    "/work/fresh-greens",
    "/work/understandingfafsa",
    "/work/navi",
    "/work/tiktok",
    "/work/navi/demo",
    "/work/navi/demo/experience/harlem-jazz-walk",
    "/work/navi/system",
    "/work/navi/system/components",
  ])("stays out of Pocket, Reader, or Navi-owned route %s", (pathname) => {
    route.pathname = pathname;
    render(<MobileNav />);
    expect(
      screen.queryByRole("navigation", { name: "Mobile navigation" }),
    ).not.toBeInTheDocument();
  });

  it.each(["/about", "/play", "/resume"])(
    "remains available on direct utility route %s",
    (pathname) => {
      route.pathname = pathname;
      render(<MobileNav />);
      expect(
        screen.getByRole("navigation", { name: "Mobile navigation" }),
      ).toBeInTheDocument();
    },
  );

  it("uses an opaque-enough surface to keep page content from bleeding through", () => {
    expect(baseStyles).toContain(
      "background: color-mix(in srgb, var(--background) 96%, transparent)",
    );
  });

  it.each(["/work", "/work/other-project"])(
    "marks Work current where legacy mobile navigation still owns %s",
    (pathname) => {
      route.pathname = pathname;
      const { container } = render(
        <>
          <MobileNav />
          <SiteNavList />
        </>,
      );

      const mobile = screen.getByRole("navigation", {
        name: "Mobile navigation",
      });
      expect(within(mobile).getByRole("link", { name: "Work" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      expect(
        container.querySelector('.site-nav-list a[href="/#work"]'),
      ).toHaveAttribute("aria-current", "page");
    },
  );
});
