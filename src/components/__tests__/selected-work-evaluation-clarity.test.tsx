import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectedWorkExplorer } from "@/components/myles-97/selected-work-explorer";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    src,
    preload,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { preload?: boolean }) => {
    void preload;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={String(src)} alt={alt} />;
  },
}));

const programs: ProgramDefinition[] = [
  {
    id: "fresh-greens",
    appName: "Fresh Greens.exe",
    applicationType: "Route-planning software",
    primaryEvidence: "built",
    title: "Fresh Greens",
    summary: "A route-planning product.",
    href: "/work/fresh-greens",
    coverImage: "/projects/fresh-greens/cover.png",
  },
  {
    id: "tiktok",
    appName: "TikTok Catalog.studio",
    applicationType: "Catalog-template studio",
    primaryEvidence: "shipped",
    title: "TikTok DSA",
    summary: "A catalog-template system.",
    href: "/work/tiktok",
    coverImage: "/projects/tiktok/cover.png",
  },
];

describe("Selected Work evaluation paths", () => {
  it("makes the case study primary and explains the interactive preview before either action", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<SelectedWorkExplorer programs={programs} onOpen={onOpen} />);

    expect(screen.getByText("Portfolio projects")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Read the full design story, or explore the interactive preview.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Portfolio projects" })).toHaveAccessibleDescription(
      "Read the full design story, or explore the interactive preview.",
    );

    const freshCard = screen.getByRole("listitem", { name: "Fresh Greens" });
    const caseStudyLink = within(freshCard).getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    const previewButton = within(freshCard).getByRole("button", {
      name: "Explore Fresh Greens.exe interactive preview",
    });
    const actions = Array.from(freshCard.querySelectorAll("a, button"));

    expect(actions).toEqual([caseStudyLink, previewButton]);
    expect(caseStudyLink).toHaveAttribute("href", "/work/fresh-greens");
    expect(within(freshCard).queryByText("Built")).not.toBeInTheDocument();

    await user.click(previewButton);
    expect(onOpen).toHaveBeenCalledWith("fresh-greens");
  });

  it("uses the project title as the card identity and keeps the app name as preview context", () => {
    render(<SelectedWorkExplorer programs={programs} onOpen={vi.fn()} />);

    const tiktokCard = screen.getByRole("listitem", { name: "TikTok DSA" });
    expect(within(tiktokCard).getByText("TikTok DSA")).toBeInTheDocument();
    expect(within(tiktokCard).getByText("TikTok Catalog.studio")).toBeInTheDocument();
    expect(within(tiktokCard).getByText("Catalog-template studio")).toBeInTheDocument();
    expect(within(tiktokCard).queryByText("Shipped")).not.toBeInTheDocument();
  });
});
