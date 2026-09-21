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
  it("resolves keyboard focus without motion and does not replace the source scene", () => {
    const { container } = render(<SelectedWorkExplorer programs={programs} onOpen={vi.fn()} />);
    const card = screen.getByRole('listitem', { name: 'Fresh Greens' });
    const scene = card.querySelector('.product-thumbnail-scene');
    fireEvent.focus(within(card).getByRole('link'));
    expect(card.querySelector('.product-thumbnail')).toHaveAttribute('data-reduced', 'true');
    expect(card.querySelector('.product-thumbnail-scene')).toBe(scene);
    expect(container.querySelector('.product-thumbnail-cover')).toBeNull();
  });
  it("uses one movable TikTok title and masks its baked-in duplicate", () => {
    const { container } = render(<SelectedWorkExplorer programs={[programs[1]]} onOpen={vi.fn()} />);
    const template = container.querySelector('image[href="/projects/tiktok/system/academia.webp"]');
    expect(template).toHaveAttribute('mask');
    expect(container.querySelectorAll('image[href="/projects/tiktok/system/academia-text.svg"]')).toHaveLength(1);
    expect(container.querySelector('.motion-catalog-main .motion-catalog-type')).toBeInTheDocument();
  });

  it("keeps Navi search typography proportional to its header", () => {
    const program = { ...programs[1], id: "navi" as const };
    const { container } = render(<SelectedWorkExplorer programs={[program]} onOpen={vi.fn()} />);
    expect(container.querySelector('.navi-thumbnail-search rect')).toHaveAttribute('height', '42');
    expect(container.querySelector('.navi-thumbnail-search text')).toHaveAttribute('font-size', '14');
  });
  it("clips Fresh Greens source screens to rounded boundaries without invented taglines", () => {
    const { container } = render(<SelectedWorkExplorer programs={[programs[0]]} onOpen={vi.fn()} />);
    expect(container).not.toHaveTextContent("A clearer way forward");
    expect(container.querySelector('.motion-phone clipPath rect')).toHaveAttribute('rx', '24');
    expect(container.querySelector('.motion-focus-panel clipPath rect')).toHaveAttribute('rx', '16');
    expect(container.querySelector('.motion-focus-panel g[clip-path]')).toBeInTheDocument();
  });

  it("contains FAFSA modules within the sheet and anchors decoration to the bottom edge", () => {
    const program = { ...programs[1], id: "understandingfafsa" as const };
    const { container } = render(<SelectedWorkExplorer programs={[program]} onOpen={vi.fn()} />);
    expect(container.querySelector('.motion-mail-body')?.parentElement).toHaveAttribute('clip-path');
    expect(container.querySelector('.motion-mail-links')).toBeNull();
    expect(container.querySelector('.product-thumbnail-scene')).toHaveAttribute('preserveAspectRatio', 'xMidYMax meet');
    const panel = container.querySelector('.motion-mail-label rect')!;
    expect(Number(panel.getAttribute('x')) + Number(panel.getAttribute('width'))).toBeLessThanOrEqual(616);
    expect(Number(panel.getAttribute('y')) + Number(panel.getAttribute('height'))).toBeLessThanOrEqual(336);
  });
  it.each(["fresh-greens", "understandingfafsa", "navi", "tiktok"] as const)(
    "reveals %s on keyboard focus, keeps it between actions, and resets on exit",
    (id) => {
      const program = { ...programs[1], id, title: id, href: `/work/${id}` as const };
      const { container } = render(<SelectedWorkExplorer programs={[program]} onOpen={vi.fn()} reduceMotion />);
      const card = screen.getByRole("listitem", { name: id });
      const scene = container.querySelector(".product-thumbnail")!;
      const link = within(card).getByRole("link");
      const button = within(card).getByRole("button");
      expect(scene).toHaveAttribute("data-active", "false");
      fireEvent.focus(link);
      expect(scene).toHaveAttribute("data-active", "true");
      expect(scene).toHaveAttribute("data-reduced", "true");
      fireEvent.blur(link, { relatedTarget: button });
      expect(scene).toHaveAttribute("data-active", "true");
      fireEvent.blur(button, { relatedTarget: document.body });
      expect(scene).toHaveAttribute("data-active", "false");
      fireEvent.pointerEnter(card, { pointerType: "touch" });
      expect(scene).toHaveAttribute("data-active", "false");
    },
  );
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

  it.each([
    ["fresh-greens", "/projects/fresh-greens/v2/route-preview.png"],
    ["understandingfafsa", "/projects/understandingfafsa/modular-header.png"],
    ["navi", "/projects/navi-demo/prospect-tunnel.jpg"],
    ["tiktok", "/projects/tiktok/system/academia.webp"],
  ] as const)("grounds %s in original project artwork", (id, source) => {
    const program = { ...programs[1], id, title: id, href: `/work/${id}` as const };
    const { container } = render(<SelectedWorkExplorer programs={[program]} onOpen={vi.fn()} />);
    expect(container.querySelector(`image[href="${source}"]`)).toBeInTheDocument();
    const scene = container.querySelector(".product-thumbnail-scene");
    expect(scene).toHaveAttribute("viewBox", "0 0 640 360");
    expect(scene).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("video")).toBeNull();
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
