import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { HostView } from "@/app/work/navi/(minisite)/demo/host/[slug]/HostView";
import { getHostBySlug, experiencesByHost } from "@/lib/navi/hosts";

describe("Host page", () => {
  const host = getHostBySlug("paul-stein");
  if (!host) throw new Error("test fixture: paul-stein host missing");

  it("renders the host name and back link", () => {
    render(<HostView host={host} />);
    expect(screen.getByRole("heading", { level: 1, name: "Paul Stein" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back/ })).toHaveAttribute(
      "href",
      "/work/navi/demo/search",
    );
  });

  it("shows the bio paragraph", () => {
    render(<HostView host={host} />);
    expect(screen.getByText(host.bio)).toBeInTheDocument();
  });

  it("renders an Experiences-from heading", () => {
    render(<HostView host={host} />);
    expect(
      screen.getByRole("heading", { level: 2, name: /Experiences from Paul Stein/ }),
    ).toBeInTheDocument();
  });

  it("renders ExperienceCards linking to each experience detail page", () => {
    const { container } = render(<HostView host={host} />);
    const expected = experiencesByHost("paul-stein");
    const cards = container.querySelectorAll("a.nv-exp-card");
    expect(cards.length).toBe(expected.length);
    cards.forEach((c) => {
      expect(c.getAttribute("href")).toMatch(/^\/work\/navi\/demo\/experience\/[a-z0-9-]+$/);
    });
  });

  it("links the neighborhood label to the neighborhood page", () => {
    render(<HostView host={host} />);
    const nbSlug = host.neighborhood
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    expect(
      screen.getByRole("link", { name: new RegExp(`Based in ${host.neighborhood}`) }),
    ).toHaveAttribute("href", `/work/navi/demo/neighborhood/${nbSlug}`);
  });
});
