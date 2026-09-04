import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Myles97Shell } from "@/components/myles-97/myles-97-shell";
import { POCKET_97_QUERY } from "@/components/myles-97/use-pocket-97";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  PROJECT_ENTER_REQUEST,
  readProjectReturnSnapshot,
} from "@/lib/project-enter";

const testDirectory = dirname(fileURLToPath(import.meta.url));
const pocketStyles = readFileSync(
  resolve(testDirectory, "../../app/styles/myles-97-pocket.css"),
  "utf8",
);

function cssBlock(header: string, source = pocketStyles) {
  const escapedHeader = header.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`(?:^|\\n)\\s*${escapedHeader}\\s*\\{`).exec(source);
  expect(match, `${header} CSS block`).not.toBeNull();

  const open = source.indexOf("{", match!.index);
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    if (source[index] === "{") depth += 1;
    if (source[index] === "}") depth -= 1;
    if (depth === 0) return source.slice(open + 1, index);
  }

  throw new Error(`Unclosed CSS block for ${header}`);
}

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
    expect(screen.getAllByRole("link", { name: /Read .* case study/ })).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Myles Ashitey" })).toBeInTheDocument();
  });

  it("lays out the real Pocket home as a two-column tablet folio without losing project covers", async () => {
    installMatchMedia(true);
    const { container } = render(
      <Myles97Shell programs={programs} looseParts={looseParts} />,
    );

    await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    expect(
      Array.from(container.querySelectorAll<HTMLImageElement>(".myles97-program-cover img:not(.fg-focus-map-image)"))
        .map((image) => image.getAttribute("src")),
    ).toEqual(programs.map((program) => program.coverImage));

    const tablet = cssBlock("@media (min-width: 768px) and (max-width: 1024px)");
    expect(cssBlock(".pocket97-stage", tablet)).toMatch(/width:\s*min\(100%,\s*64rem\);/);
    expect(cssBlock(".pocket97-home", tablet)).toMatch(
      /grid-template-columns:\s*minmax\(15rem,\s*0\.72fr\) minmax\(0,\s*1\.28fr\);/,
    );
    expect(cssBlock(".pocket97-intro", tablet)).toMatch(/grid-area:\s*intro;/);
    expect(cssBlock(".pocket97-work", tablet)).toMatch(/grid-area:\s*work;/);
    expect(cssBlock(".pocket97-recipe-card", tablet)).toMatch(/grid-area:\s*recipe;/);
    expect(cssBlock(".pocket97-shell .myles97-selected-work-list", tablet)).toMatch(
      /grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);/,
    );
  });

  it("keeps functional Pocket and narrow-workstation note copy on the 12px floor", () => {
    const dockButton = cssBlock(".pocket97-dock button");
    const compact = cssBlock(
      "@media (min-width: 1025px) and (max-width: 1080px) and (pointer: fine)",
    );
    const recipeLabel = cssBlock(
      ".myles97-roti-note .myles97-roti-label",
      compact,
    );
    const recipePreview = cssBlock(
      ".myles97-roti-note > span:last-child",
      compact,
    );

    expect(dockButton).toMatch(/font:\s*700 12px\/1\.1 var\(--m97-ui-font\);/);
    expect(recipeLabel).toMatch(/font-size:\s*12px;/);
    expect(recipePreview).toMatch(/font-size:\s*12px;/);
  });

  it("opens one project program, keeps its native case-study link, and returns to the stack", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    await user.click(
      screen.getByRole("button", {
        name: "Explore Fresh Greens.exe interactive preview",
      }),
    );

    const app = screen.getByRole("region", { name: /Fresh Greens.exe/ });
    const caseStudyLink = within(app).getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    expect(caseStudyLink).toHaveAttribute(
      "href",
      "/work/fresh-greens",
    );
    expect(screen.queryByRole("region", { name: "Work Stuff" })).toBeNull();

    Object.defineProperty(app, "getBoundingClientRect", {
      configurable: true,
      value: () => ({
        top: 0,
        left: 0,
        width: 390,
        height: 760,
        right: 390,
        bottom: 760,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    });
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    fireEvent.click(caseStudyLink);

    expect(onRequest).toHaveBeenCalledTimes(1);
    expect((onRequest.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      slug: "fresh-greens",
      href: "/work/fresh-greens",
      animate: false,
    });
    expect(readProjectReturnSnapshot()).toMatchObject({
      slug: "fresh-greens",
      returnTarget: "selected-work",
      animate: false,
    });
    window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);

    await user.click(within(app).getByRole("button", { name: "Back" }));
    expect(screen.getByRole("heading", { name: "Work Stuff" })).toBeInTheDocument();
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
    const apps = screen.getByRole("dialog", { name: "Open Apps" });
    expect(within(apps).getByRole("button", { name: /Loose Parts/ })).toBeInTheDocument();
  });

  it("opens Start as an isolated modal, contains focus, and restores its opener", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    const start = within(dock).getByRole("button", { name: "Start" });
    expect(start).toHaveAttribute("aria-controls", "pocket97-start-sheet");
    expect(start).toHaveAttribute("aria-haspopup", "dialog");
    await user.click(start);

    const startSheet = screen.getByRole("dialog", { name: "Pocket 98 Start" });
    const firstAction = within(startSheet).getByRole("button", { name: "About Myles" });
    const lastAction = within(startSheet).getByRole("button", {
      name: "Close Pocket 98 Start",
    });
    expect(startSheet).toHaveAttribute("id", "pocket97-start-sheet");
    expect(startSheet).toHaveAttribute("aria-modal", "true");
    expect(document.querySelector(".pocket97-stage")).toHaveAttribute("inert");
    expect(dock).toHaveAttribute("inert");
    expect(firstAction).toHaveFocus();

    await user.tab({ shift: true });
    expect(lastAction).toHaveFocus();
    await user.tab();
    expect(firstAction).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Pocket 98 Start" })).toBeNull();
    expect(document.querySelector(".pocket97-stage")).not.toHaveAttribute("inert");
    expect(dock).not.toHaveAttribute("inert");
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

  it("offers a touch dismissal action for Start and restores its opener", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    const start = within(dock).getByRole("button", { name: "Start" });
    await user.click(start);

    const startSheet = screen.getByRole("dialog", { name: "Pocket 98 Start" });
    await user.click(
      within(startSheet).getByRole("button", { name: "Close Pocket 98 Start" }),
    );

    expect(screen.queryByRole("dialog", { name: "Pocket 98 Start" })).toBeNull();
    expect(start).toHaveFocus();
  });

  it("focuses a touch dismissal action when Open Apps is empty", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    const openApps = within(dock).getByRole("button", { name: "Open Apps" });
    await user.click(openApps);

    const appsSheet = screen.getByRole("dialog", { name: "Open Apps" });
    const close = within(appsSheet).getByRole("button", { name: "Close Open Apps" });
    expect(close).toHaveFocus();

    await user.click(close);
    expect(screen.queryByRole("dialog", { name: "Open Apps" })).toBeNull();
    expect(openApps).toHaveFocus();
  });

  it("focuses the first Open Apps action and returns Escape to Open Apps", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    await user.click(within(dock).getByRole("button", { name: "Loose Parts" }));
    const openApps = within(dock).getByRole("button", { name: "Open Apps" });
    expect(openApps).toHaveAttribute("aria-controls", "pocket97-open-apps-sheet");
    expect(openApps).toHaveAttribute("aria-haspopup", "dialog");
    await user.click(openApps);

    const appsSheet = screen.getByRole("dialog", { name: "Open Apps" });
    expect(appsSheet).toHaveAttribute("id", "pocket97-open-apps-sheet");
    expect(appsSheet).toHaveAttribute("aria-modal", "true");
    expect(within(appsSheet).getByRole("button", { name: /Loose Parts/ })).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Open Apps" })).toBeNull();
    expect(openApps).toHaveFocus();
  });

  it("focuses Back after selecting the already-active program from Open Apps", async () => {
    installMatchMedia(true);
    const user = userEvent.setup();
    render(<Myles97Shell programs={programs} looseParts={looseParts} />);

    const dock = await screen.findByRole("navigation", { name: "Pocket 98 dock" });
    await user.click(within(dock).getByRole("button", { name: "Loose Parts" }));
    await user.click(within(dock).getByRole("button", { name: "Open Apps" }));

    const appsSheet = screen.getByRole("dialog", { name: "Open Apps" });
    await user.click(within(appsSheet).getByRole("button", { name: /Loose Parts/ }));

    expect(screen.queryByRole("dialog", { name: "Open Apps" })).toBeNull();
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Back" })).toHaveFocus();
    });
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
