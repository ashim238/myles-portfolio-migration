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

describe("Projects evaluation paths", () => {
  it("opens each study from the same native link as its artwork and reading action", async () => {
    const user = userEvent.setup();
    render(<SelectedWorkExplorer programs={programs} />);
    const files = screen.getByRole("navigation", { name: "Case studies" });
    for (const program of programs) {
      const file = within(files).getByRole("link", { name: program.title });
      expect(file).toHaveAttribute("href", program.href);
      await user.hover(file);
      const card = screen.getByRole("listitem", { name: program.title });
      const link = within(card).getByRole("link", { name: `Read ${program.title} case study` });
      expect(link).toHaveAttribute("href", program.href);
      expect(link).toContainElement(card.querySelector(".product-thumbnail"));
      expect(link).toContainElement(within(card).getByText("Read case study"));
      expect(within(card).queryByRole("button")).toBeNull();
    }
  });

  it("supports keyboard activation of the illustrated reading link", async () => {
    const user = userEvent.setup();
    render(<SelectedWorkExplorer programs={[programs[1]]} />);
    const link = screen.getByRole("link", { name: "Read TikTok DSA case study" });
    const onClick = vi.fn((event: Event) => event.preventDefault());
    link.addEventListener("click", onClick);
    within(screen.getByRole("navigation", { name: "Case studies" })).getByRole("link").focus();
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("uses the project title as the card identity and keeps the app name as preview context", () => {
    render(<SelectedWorkExplorer programs={programs} />);

    fireEvent.click(screen.getByRole("radio", { name: "Thumbnails" }));
    const tiktokCard = screen.getByRole("listitem", { name: "TikTok DSA" });
    expect(within(tiktokCard).getByText("TikTok DSA")).toBeInTheDocument();
    expect(within(tiktokCard).getByText("TikTok Catalog.studio")).toBeInTheDocument();
    expect(within(tiktokCard).getByText("Catalog-template studio")).toBeInTheDocument();
    expect(within(tiktokCard).queryByText("Shipped")).not.toBeInTheDocument();
  });

  it.each(["understandingfafsa", "navi", "tiktok"] as const)("reveals the %s teardown on hover while keeping its first click a link", (id) => {
    const media = vi.spyOn(window, "matchMedia").mockImplementation(query =>
      ({ matches: query === "(any-hover: hover)", addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList);
    try {
      const program = { ...programs[1], id, href: `/work/${id}` as const };
      render(<SelectedWorkExplorer programs={[program]} />);
      const link = screen.getByRole("link", { name: `Read ${program.title} case study` });
      const art = link.querySelector(".myles97-program-cover")!;
      const cover = art.querySelector(".product-thumbnail");
      fireEvent.pointerEnter(art, { pointerType: "touch" });
      expect(cover).toHaveAttribute("data-inspect", "false");
      fireEvent.pointerEnter(art, { pointerType: "mouse" });
      expect(cover).toHaveAttribute("data-inspect", "true");
      fireEvent.pointerLeave(art, { pointerType: "mouse" });
      expect(cover).toHaveAttribute("data-inspect", "false");
      expect(link).toHaveAttribute("href", program.href);
    } finally {
      media.mockRestore();
    }
  });
  it("routes through the controller without faking a full-card animation", () => {
    sessionStorage.clear();
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    render(
      <SelectedWorkExplorer
        programs={programs}
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
    render(<SelectedWorkExplorer programs={programs} />);

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
