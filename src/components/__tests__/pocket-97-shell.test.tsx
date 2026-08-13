import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Myles97Shell } from "@/components/myles-97/myles-97-shell";
import { POCKET_97_QUERY } from "@/components/myles-97/use-pocket-97";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

vi.mock("@/components/myles-97/boot-sequence", () => ({
  BootSequence: () => null,
}));

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
    void preload;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
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
    medium: "p5.js, text hashing, generative drawing",
    state: "testing" as const,
  },
];

function installMatchMedia(pocket: boolean) {
  const listeners = new Map<string, Set<() => void>>();
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === POCKET_97_QUERY ? pocket : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_type: string, listener: () => void) => {
        const set = listeners.get(query) ?? new Set();
        set.add(listener);
        listeners.set(query, set);
      }),
      removeEventListener: vi.fn((_type: string, listener: () => void) => {
        listeners.get(query)?.delete(listener);
      }),
      dispatchEvent: vi.fn(),
    } as MediaQueryList)),
  );
}

describe("Pocket 98", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.unstubAllGlobals();
  });

  it("uses the approved Pocket capability boundary", () => {
    expect(POCKET_97_QUERY).toBe("(max-width: 1024px), (pointer: coarse)");
  });

  it("switches to a single-app dock model for narrow or coarse capabilities", async () => {
    installMatchMedia(true);
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    const dockMasters = Array.from(
      dock.querySelectorAll<SVGImageElement>("image[data-m98-icon-master]"),
    );

    expect(dockMasters).toHaveLength(4);
    expect(dockMasters.map((master) => master.getAttribute("href"))).toEqual([
      "/myles98-icons/generic-app/generic-app-24.svg",
      "/myles98-icons/selected-work/selected-work-24.svg",
      "/myles98-icons/loose-parts/loose-parts-24.svg",
      "/myles98-icons/open-apps/open-apps-24.svg",
    ]);
    for (const master of dockMasters) {
      expect(master).toHaveAttribute("data-m98-icon-master-grid", "24");
      expect(master).toHaveAttribute("width", "24");
      expect(master).toHaveAttribute("height", "24");
      expect(master).not.toHaveAttribute("transform");
    }

    expect(dock).toBeInTheDocument();
    expect(document.querySelector("[data-draggable-window]")).toBeNull();
    expect(screen.getAllByRole("link", { name: /Open .* case study/ })).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Myles Ashitey" })).toBeInTheDocument();
  });

  it("opens one project program, keeps its native case-study link, and returns to the stack", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    await user.click(
      screen.getByRole("button", { name: "Open Fresh Greens.exe program" }),
    );

    const app = screen.getByRole("region", { name: /Fresh Greens.exe/ });
    expect(within(app).getByRole("link", { name: "Open Fresh Greens case study" })).toHaveAttribute(
      "href",
      "/work/fresh-greens",
    );
    expect(screen.queryByRole("region", { name: "Selected Work" })).toBeNull();

    await user.click(within(app).getByRole("button", { name: "Back" }));
    expect(screen.getByRole("heading", { name: "Selected Work" })).toBeInTheDocument();
  });

  it("opens Loose Parts from the dock and exposes it in Open Apps", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    await user.click(within(dock).getByRole("button", { name: "Loose Parts" }));
    expect(screen.getByRole("region", { name: /Loose Parts/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open Loom in Loose Parts" })).toHaveAttribute(
      "href",
      "/play#loom",
    );

    await user.click(within(dock).getByRole("button", { name: "Open Apps" }));
    const apps = screen.getByRole("group", { name: "Open Apps" });
    expect(within(apps).getByRole("button", { name: /Loose Parts/ })).toBeInTheDocument();
  });

  it("contains Pocket sheet focus, returns Escape to its opener, and focuses Back on launch", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    const start = within(dock).getByRole("button", { name: "Start" });
    await user.click(start);

    const startSheet = screen.getByRole("group", { name: "Pocket 98 Start" });
    const firstAction = within(startSheet).getByRole("button", { name: "About Myles" });
    const lastAction = within(startSheet).getByRole("link", { name: "E-mail" });
    expect(firstAction).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastAction).toHaveFocus();
    await user.tab();
    expect(firstAction).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("group", { name: "Pocket 98 Start" })).toBeNull();
    expect(start).toHaveFocus();

    await user.click(start);
    await user.click(screen.getByRole("button", { name: "About Myles" }));
    const app = screen.getByRole("region", { name: /About Myles/ });
    expect(within(app).getByRole("button", { name: "Back" })).toHaveFocus();

    await user.click(within(app).getByRole("button", { name: "Back" }));
    await waitFor(() => {
      expect(within(dock).getByRole("button", { name: "Work" })).toHaveFocus();
    });
  });

  it("focuses the first Open Apps action and returns Escape to Open Apps", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    await user.click(within(dock).getByRole("button", { name: "Loose Parts" }));
    const openApps = within(dock).getByRole("button", { name: "Open Apps" });
    await user.click(openApps);

    const appsSheet = screen.getByRole("group", { name: "Open Apps" });
    expect(within(appsSheet).getByRole("button", { name: /Loose Parts/ })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("group", { name: "Open Apps" })).toBeNull();
    expect(openApps).toHaveFocus();
  });

  it("keeps the workstation model when the capability query does not match", async () => {
    installMatchMedia(false);
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    await waitFor(() => {
      expect(screen.queryByRole("navigation", { name: "Pocket 98 dock" })).toBeNull();
      expect(screen.getByRole("navigation", { name: "Open programs" })).toBeInTheDocument();
    });
    expect(document.querySelector("[data-draggable-window]")).not.toBeNull();
  });
});
