import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Home from "@/app/page";

const mocks = vi.hoisted(() => ({
  getPublishedProjects: vi.fn(),
  shell: vi.fn(),
}));

vi.mock("@/lib/content", () => ({
  getPublishedProjects: mocks.getPublishedProjects,
}));

vi.mock("@/components/myles-97/myles-97-shell", () => ({
  Myles97Shell: ({ programs }: { programs: Array<{ id: string }> }) => {
    mocks.shell(programs);
    return <main data-testid="myles-97-shell" />;
  },
}));

const project = (slug: string, title: string, order: number) => ({
  slug,
  title,
  summary: `${title} summary`,
  role: "Product Designer",
  timeframe: "2026",
  status: "published" as const,
  order,
  tags: [],
  sections: [],
  bodyHtml: "",
  coverImage: `/projects/${slug}/cover.png`,
});

describe("homepage first impression", () => {
  beforeEach(() => {
    mocks.shell.mockClear();
    mocks.getPublishedProjects.mockResolvedValue([
      project("fresh-greens", "Fresh Greens", 1),
      project("understandingfafsa", "UnderstandingFAFSA", 2),
      project("navi", "Navi", 3),
      project("tiktok", "TikTok DSA", 4),
    ]);
  });

  it("server-renders the Myles 97 shell with four published programs", async () => {
    render(await Home());

    expect(screen.getByTestId("myles-97-shell")).toBeInTheDocument();
    expect(mocks.shell).toHaveBeenCalledTimes(1);
    expect(
      mocks.shell.mock.calls[0][0].map((program: { id: string }) => program.id),
    ).toEqual(["fresh-greens", "understandingfafsa", "navi", "tiktok"]);
  });
});
