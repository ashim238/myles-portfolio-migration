import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SelectedWorkExplorer } from "@/components/myles-97/selected-work-explorer";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  PROJECT_ENTER_REQUEST,
  readProjectReturnSnapshot,
} from "@/lib/project-enter";

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

  it("routes through the controller without faking a full-card animation", () => {
    sessionStorage.clear();
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    render(
      <SelectedWorkExplorer
        programs={programs}
        onOpen={vi.fn()}
      />,
    );

    const freshCard = screen.getByRole("listitem", { name: "Fresh Greens" });
    Object.defineProperty(freshCard, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        top: 112,
        left: 136,
        width: 744,
        height: 126,
        right: 880,
        bottom: 238,
        x: 136,
        y: 112,
        toJSON: () => ({}),
      }),
    });
    const link = within(freshCard).getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    link.addEventListener("click", (event) => event.preventDefault());

    fireEvent.click(link);

    expect(readProjectReturnSnapshot()).toMatchObject({
      version: 1,
      slug: "fresh-greens",
      returnTarget: "selected-work",
      reduceMotion: false,
      animate: false,
      visual: {
        type: "program",
        programId: "fresh-greens",
        appName: "Fresh Greens.exe",
        title: "Fresh Greens",
        cover: { type: "image", src: "/projects/fresh-greens/cover.png" },
      },
    });
    expect(onRequest).toHaveBeenCalledTimes(1);
    expect((onRequest.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      slug: "fresh-greens",
      href: "/work/fresh-greens",
      reduceMotion: false,
      animate: false,
    });
    window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
  });

  it("leaves modified case-study clicks to the native link", () => {
    sessionStorage.clear();
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    render(<SelectedWorkExplorer programs={programs} onOpen={vi.fn()} />);

    const link = screen.getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    link.addEventListener("click", (event) => event.preventDefault());
    fireEvent.click(link, { ctrlKey: true });

    expect(onRequest).not.toHaveBeenCalled();
    expect(readProjectReturnSnapshot()).toBeNull();
    window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
  });
});
