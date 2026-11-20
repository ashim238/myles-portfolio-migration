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

describe("Work Stuff evaluation paths", () => {
  it("opens the artwork on keyboard focus and closes when focus moves to the reading link", async () => {
    const user = userEvent.setup();
    render(<SelectedWorkExplorer programs={programs} onOpen={vi.fn()} reduceMotion />);
    const card = screen.getByRole("listitem", { name:"Fresh Greens" });
    const cover = within(card).getByRole("button", { name:/View layers/ });
    within(card).getByRole("link").focus();
    await user.tab({ shift:true });
    expect(cover).toHaveFocus();
    expect(cover).toHaveAttribute("aria-pressed","true");
    await user.keyboard("{Escape}");
    expect(cover).toHaveAttribute("aria-pressed","false");
    await user.keyboard("{Enter}");
    expect(cover).toHaveAttribute("aria-pressed","true");
    await user.tab();
    expect(within(card).getByRole("link")).toHaveFocus();
    expect(cover).toHaveAttribute("aria-pressed","false");
  });

  it.each(["fresh-greens", "understandingfafsa", "navi", "tiktok"] as const)(
    "opens the %s drawing only while the mouse is on the artwork", (id) => {
      const media = vi.spyOn(window, "matchMedia").mockImplementation(query =>
        ({ matches:query === "(any-hover: hover)", addEventListener:vi.fn(), removeEventListener:vi.fn() }) as unknown as MediaQueryList);
      try {
        render(<SelectedWorkExplorer programs={[{ ...programs[0], id }]} onOpen={vi.fn()} />);
        const cover = screen.getByRole("button", { name:/View layers/ });
        fireEvent.pointerEnter(cover, { pointerType:"touch" });
        expect(cover).toHaveAttribute("aria-pressed","false");
        fireEvent.pointerEnter(cover, { pointerType:"mouse" });
        expect(cover).toHaveAttribute("aria-pressed","true");
        fireEvent.pointerDown(cover, { pointerType:"mouse" });
        fireEvent.pointerUp(cover, { pointerType:"mouse" });
        fireEvent.click(cover, { detail:1 });
        expect(cover).toHaveAttribute("aria-pressed","true");
        fireEvent.pointerLeave(cover, { pointerType:"mouse" });
        expect(cover).toHaveAttribute("aria-pressed","false");
      } finally {
        media.mockRestore();
      }
    });
  it("makes the case study primary and explains the preview before either action", async () => {
    const user = userEvent.setup();
    const onOpen = vi.fn();
    render(<SelectedWorkExplorer programs={programs} onOpen={onOpen} />);

    expect(screen.getByText("Portfolio projects")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Read a case study or open a project preview.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Portfolio projects" })).toHaveAccessibleDescription(
      "Read a case study or open a project preview.",
    );

    const freshCard = screen.getByRole("listitem", { name: "Fresh Greens" });
    const caseStudyLink = within(freshCard).getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    const previewButton = within(freshCard).getByRole("button", {
      name: "Explore Fresh Greens.exe preview",
    });
    const actions = Array.from(freshCard.querySelectorAll(".myles97-program-actions :is(a, button)"));

    expect(actions).toEqual([caseStudyLink, previewButton]);
    expect(caseStudyLink).toHaveAttribute("href", "/work/fresh-greens");
    expect(within(freshCard).queryByText("Built")).not.toBeInTheDocument();

    await user.click(previewButton);
    expect(onOpen).toHaveBeenCalledWith("fresh-greens");
  });

  it("uses the project title as the card identity and keeps the app name as preview context", () => {
    render(<SelectedWorkExplorer programs={programs} onOpen={vi.fn()} />);

    fireEvent.click(screen.getByRole("radio", { name: "Thumbnails" }));
    const tiktokCard = screen.getByRole("listitem", { name: "TikTok DSA" });
    expect(within(tiktokCard).getByText("TikTok DSA")).toBeInTheDocument();
    expect(within(tiktokCard).getByText("TikTok Catalog.studio")).toBeInTheDocument();
    expect(within(tiktokCard).getByText("Catalog-template studio")).toBeInTheDocument();
    expect(within(tiktokCard).queryByText("Shipped")).not.toBeInTheDocument();
  });

  it.each([
    ["fresh-greens", "Street map", ".atlas-map"],
    ["understandingfafsa", "Story block", ".mail-edition"],
    ["navi", "Reservation", ".postcard-photo"],
    ["tiktok", "Catalog slot", ".catalog-proofs"],
  ] as const)("opens and reassembles the %s publication with the original scene in place", (id, detail, artwork) => {
    const program = { ...programs[1], id, title: id, href: `/work/${id}` as const };
    const { container } = render(<SelectedWorkExplorer programs={[program]} onOpen={vi.fn()} />);
    const cover = container.querySelector(".publication-cover");
    const toggle = screen.getByRole("button", {name: /View layers/});
    expect(cover).toHaveAttribute("aria-hidden", "true");
    expect(cover?.querySelector(artwork)).toBeInTheDocument();
    fireEvent.click(toggle);
    expect(toggle).toHaveAccessibleDescription(expect.stringContaining(detail));
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(cover).toHaveAttribute("data-inspect", "true");
    fireEvent.keyDown(toggle, {key: "Escape"});
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(cover?.querySelector(artwork)).toBeInTheDocument();
    expect(screen.getByRole("listitem", {name:id})).toBeInTheDocument();
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
