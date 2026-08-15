import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Myles97Shell } from "@/components/myles-97/myles-97-shell";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

/* eslint-disable @next/next/no-img-element */

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    priority,
    preload,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    preload?: boolean;
  }) => {
    void priority;
    return (
      <img
        {...props}
        alt={alt}
        data-preload={String(Boolean(preload))}
      />
    );
  },
}));

const programs: ProgramDefinition[] = [
  {
    id: "fresh-greens",
    appName: "Fresh Greens.exe",
    applicationType: "Route-planning software",
    primaryEvidence: "built",
    title: "Fresh Greens",
    summary: "A route-planning product for finding fresh food.",
    href: "/work/fresh-greens",
    coverImage: "/projects/fresh-greens/cover.png",
  },
  {
    id: "understandingfafsa",
    appName: "FAFSA Mail.app",
    applicationType: "Modular mail composer",
    primaryEvidence: "observed",
    title: "UnderstandingFAFSA",
    summary: "A modular system for financial-aid communication.",
    href: "/work/understandingfafsa",
    coverImage: "/projects/understandingfafsa/cover.png",
  },
  {
    id: "navi",
    appName: "Navi Places.exe",
    applicationType: "Place-discovery application",
    primaryEvidence: "built",
    title: "Navi",
    summary: "A place-discovery and booking experience.",
    href: "/work/navi",
    coverImage: "/projects/navi/cover.png",
  },
  {
    id: "tiktok",
    appName: "TikTok Catalog.studio",
    applicationType: "Catalog-template studio",
    primaryEvidence: "shipped",
    title: "TikTok DSA",
    summary: "A shipped catalog-template direction.",
    href: "/work/tiktok",
    coverImage: "/projects/tiktok/cover.png",
  },
];

const looseParts = [
  {
    slug: "loom",
    title: "Loom",
    medium: "p5.js",
    state: "testing" as const,
  },
];

describe("Myles98 product shell", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it("renders the approved first impression with Selected Work focused beside Welcome", () => {
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    expect(screen.getByRole("heading", { name: "Myles Ashitey" })).toBeInTheDocument();
    expect(
      screen.getByText("Design, code, and everything in between."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Previously TikTok and UMG. Latest project: Fresh Greens."),
    ).toBeInTheDocument();

    expect(screen.getByRole("region", { name: "Welcome to Myles 98" })).toHaveAttribute(
      "data-focused",
      "false",
    );
    expect(screen.getByRole("region", { name: "Selected Work" })).toHaveAttribute(
      "data-focused",
      "true",
    );
    expect(screen.getAllByRole("link", { name: /Read .* case study/ })).toHaveLength(4);
  });

  it("preloads one universal above-fold cover candidate", () => {
    const { container } = render(
      <Myles97Shell programs={programs} looseParts={looseParts} />,
    );
    const preloadSources = Array.from(
      container.querySelectorAll<HTMLImageElement>(
        '.myles97-program-cover img[data-preload="true"]',
      ),
      (image) => image.getAttribute("src"),
    );

    expect(preloadSources).toEqual(["/projects/fresh-greens/cover.png"]);
  });

  it("focuses Selected Work and launches a project program while preserving a native case-study link", async () => {
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const welcome = screen.getByRole("region", { name: "Welcome to Myles 98" });
    await user.click(within(welcome).getByRole("button", { name: "Browse projects" }));
    const selectedWork = screen.getByRole("region", { name: "Selected Work" });
    expect(selectedWork).toHaveAttribute("data-focused", "true");

    const freshGreensLink = within(selectedWork).getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    expect(freshGreensLink).toHaveAttribute("href", "/work/fresh-greens");

    await user.click(
      within(selectedWork).getByRole("button", {
        name: "Explore Fresh Greens.exe interactive preview",
      }),
    );
    const freshGreensWindow = screen.getByRole("region", {
      name: "Fresh Greens.exe",
    });
    expect(freshGreensWindow).toHaveAttribute("data-focused", "true");
    await waitFor(() => {
      expect(
        within(freshGreensWindow).getByRole("button", {
          name: "Move Fresh Greens.exe",
        }),
      ).toHaveFocus();
    });
  });

  it("opens Start, exposes program actions, and closes the transient menu with Escape", async () => {
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const startButton = screen.getByRole("button", { name: "Start" });
    const desktopStage = screen.getByRole("navigation", {
      name: "Desktop shortcuts",
    }).parentElement;
    const taskbar = screen.getByRole("navigation", { name: "Open programs" });

    expect(startButton).toHaveAttribute("aria-haspopup", "dialog");
    await user.click(startButton);
    const startMenu = screen.getByRole("dialog", { name: "Start" });
    const firstAction = within(startMenu).getByRole("button", { name: "Selected Work" });
    const startMenuMasters = Array.from(
      startMenu.querySelectorAll<SVGImageElement>(
        "image[data-m98-icon-master]",
      ),
    );

    expect(startMenuMasters).toHaveLength(7);
    expect(
      startMenuMasters.map((master) => master.getAttribute("href")),
    ).toEqual([
      "/myles98-icons/selected-work/selected-work-24.svg",
      "/myles98-icons/about-myles/about-myles-24.svg",
      "/myles98-icons/loose-parts/loose-parts-24.svg",
      "/myles98-icons/resume/resume-24.svg",
      "/myles98-icons/email/email-24.svg",
      "/myles98-icons/display-properties/display-properties-24.svg",
      "/myles98-icons/reset-desktop/reset-desktop-24.svg",
    ]);
    for (const master of startMenuMasters) {
      expect(master).toHaveAttribute("data-m98-icon-master-grid", "24");
      expect(master).toHaveAttribute("width", "24");
      expect(master).toHaveAttribute("height", "24");
      expect(master).not.toHaveAttribute("transform");
    }

    expect(firstAction).toHaveFocus();
    expect(startMenu).toHaveAttribute("aria-modal", "true");
    expect(desktopStage).toHaveAttribute("inert");
    expect(taskbar).toHaveAttribute("inert");
    expect(within(startMenu).getByRole("button", { name: "About Myles" })).toBeInTheDocument();
    expect(within(startMenu).getByRole("button", { name: "Loose Parts" })).toBeInTheDocument();
    expect(within(startMenu).getByRole("button", { name: "Résumé" })).toBeInTheDocument();
    expect(within(startMenu).getByRole("link", { name: "E-mail" })).toHaveAttribute(
      "href",
      "mailto:mylesashitey@gmail.com",
    );
    expect(within(startMenu).getByText("Display Properties")).toBeInTheDocument();
    expect(within(startMenu).getByText("Reset Desktop…")).toBeInTheDocument();

    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.queryByRole("dialog", { name: "Start" })).toBeNull();
    expect(desktopStage).not.toHaveAttribute("inert");
    expect(taskbar).not.toHaveAttribute("inert");
    expect(startButton).toHaveFocus();
    expect(screen.getByRole("region", { name: "Welcome to Myles 98" })).toBeInTheDocument();
  });

  it("closes Start with the pointer and restores focus after releasing the desktop", async () => {
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const startButton = screen.getByRole("button", { name: "Start" });
    const desktopStage = screen.getByRole("navigation", {
      name: "Desktop shortcuts",
    }).parentElement;
    const taskbar = screen.getByRole("navigation", { name: "Open programs" });

    await user.click(startButton);
    await user.click(
      within(screen.getByRole("dialog", { name: "Start" })).getByRole("button", {
        name: "Close Start",
      }),
    );

    expect(screen.queryByRole("dialog", { name: "Start" })).toBeNull();
    expect(desktopStage).not.toHaveAttribute("inert");
    expect(taskbar).not.toHaveAttribute("inert");
    expect(startButton).toHaveFocus();
  });

  it("contains Start focus and sends program choices into the launched window", async () => {
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    await user.click(screen.getByRole("button", { name: "Start" }));
    const startMenu = screen.getByRole("dialog", { name: "Start" });
    const firstAction = within(startMenu).getByRole("button", { name: "Selected Work" });
    const lastAction = within(startMenu).getByRole("button", { name: "Close Start" });

    expect(firstAction).toHaveFocus();
    await user.tab({ shift: true });
    expect(lastAction).toHaveFocus();
    await user.tab();
    expect(firstAction).toHaveFocus();

    await user.click(within(startMenu).getByRole("button", { name: "About Myles" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Move About Myles" })).toHaveFocus();
    });
    expect(screen.getByRole("button", { name: "Start" })).not.toHaveFocus();
  });

  it("raises windows on keyboard entry and focuses the result of taskbar and close actions", async () => {
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const welcome = screen.getByRole("region", { name: "Welcome to Myles 98" });
    fireEvent.focus(within(welcome).getByRole("button", { name: "Browse projects" }));
    await waitFor(() => expect(welcome).toHaveAttribute("data-focused", "true"));

    await user.click(
      within(screen.getByRole("navigation", { name: "Open programs" })).getByRole(
        "button",
        { name: "Selected Work" },
      ),
    );
    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Move Selected Work" }),
      ).toHaveFocus();
    });

    await user.click(
      within(screen.getByRole("region", { name: "Selected Work" })).getByRole(
        "button",
        { name: "Close Selected Work" },
      ),
    );
    await waitFor(() => {
      expect(
        within(welcome).getByRole("button", {
          name: "Move Welcome to Myles 98",
        }),
      ).toHaveFocus();
    });
  });
});
