import { render, screen, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useReducer, type ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";
import { WorkstationDesktop } from "@/components/myles-97/workstation-desktop";
import type { ProgramDefinition } from "@/lib/myles-97/programs";
import {
  createInitialWorkstationState,
  workstationReducer,
} from "@/lib/myles-97/state";

const desktopStyles = readFileSync(
  resolve(__dirname, "../../app/styles/myles-97.css"),
  "utf8",
);

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    src = "/logomark.svg",
    priority,
    preload,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    preload?: boolean;
  }) => {
    void priority;
    void preload;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={src} alt={alt} />;
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
];

function DesktopHarness({ bootCompleted = false }: { bootCompleted?: boolean }) {
  const [state, dispatch] = useReducer(
    workstationReducer,
    undefined,
    () => {
      const initial = createInitialWorkstationState();
      return bootCompleted
        ? {
            ...initial,
            bootCompleted: true,
            openPrograms: ["selected-work", "welcome"],
            focusedProgram: "welcome",
          }
        : initial;
    },
  );

  return (
    <WorkstationDesktop
      programs={programs}
      looseParts={[]}
      state={state}
      dispatch={dispatch}
    />
  );
}

function windowRect(windowElement: HTMLElement) {
  return {
    left: Number.parseFloat(windowElement.style.left),
    top: Number.parseFloat(windowElement.style.top),
    right: Number.parseFloat(windowElement.style.left) + Number.parseFloat(windowElement.style.width),
    bottom: Number.parseFloat(windowElement.style.top) + Number.parseFloat(windowElement.style.height),
  };
}

function overlaps(first: ReturnType<typeof windowRect>, second: ReturnType<typeof windowRect>) {
  return (
    first.left < second.right &&
    first.right > second.left &&
    first.top < second.bottom &&
    first.bottom > second.top
  );
}

describe("Myles 98 desktop initial composition", () => {
  it("keeps Selected Work clear and foremost on a fresh desktop", () => {
    render(<DesktopHarness />);

    const selectedWork = screen.getByRole("region", { name: "Selected Work" });
    const welcome = screen.getByRole("region", { name: "Welcome to Myles 98" });
    const taskbar = screen.getByRole("navigation", { name: "Open programs" });

    expect(overlaps(windowRect(selectedWork), windowRect(welcome))).toBe(false);
    expect(windowRect(welcome).bottom - windowRect(welcome).top).toBeGreaterThanOrEqual(300);
    expect(selectedWork.getAttribute("data-focused")).toBe("true");
    expect(
      within(taskbar)
        .getByRole("button", { name: "Selected Work" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
    expect(
      within(selectedWork).getByRole("button", { name: "Open Fresh Greens.exe program" })
        .disabled,
    ).toBe(false);
  });

  it("leaves the later welcome task-tab focus contract intact", () => {
    render(<DesktopHarness bootCompleted />);

    const welcome = screen.getByRole("region", { name: "Welcome to Myles 98" });
    const selectedWork = screen.getByRole("region", { name: "Selected Work" });
    const taskbar = screen.getByRole("navigation", { name: "Open programs" });

    expect(welcome.getAttribute("data-focused")).toBe("true");
    expect(selectedWork.getAttribute("data-focused")).toBe("false");
    expect(
      within(taskbar)
        .getByRole("button", { name: "Welcome to Myles 98" })
        .getAttribute("aria-pressed"),
    ).toBe("true");
  });

  it.each([1280, 1440])("keeps the fresh desktop inside the %ipx canvas", (viewportWidth) => {
    render(<DesktopHarness />);

    const selectedWork = screen.getByRole("region", { name: "Selected Work" });
    const welcome = screen.getByRole("region", { name: "Welcome to Myles 98" });

    expect(windowRect(selectedWork).right).toBeLessThanOrEqual(viewportWidth);
    expect(windowRect(welcome).right).toBeLessThanOrEqual(viewportWidth);
    expect(overlaps(windowRect(selectedWork), windowRect(welcome))).toBe(false);
  });

  it("keeps the compact welcome lane inside narrow desktop canvases", () => {
    expect(desktopStyles).toMatch(
      /@media \(min-width: 1025px\) and \(max-width: 1279px\) \{[\s\S]*?\[data-m97-program-window="selected-work"\] \{[\s\S]*?width: calc\(100vw - 521px\) !important;[\s\S]*?\[data-m97-default-position="true"\]\[data-m97-program-window="welcome"\] \{[\s\S]*?left: calc\(100vw - 368px\) !important;/,
    );
  });

  it("uses a compact welcome composition that leaves room for its full introduction", () => {
    expect(desktopStyles).toMatch(
      /\.myles97-window\[data-m97-program-window="welcome"\] \.myles97-welcome \{[\s\S]*?grid-template-columns: 48px minmax\(0, 1fr\);[\s\S]*?gap: 14px;/,
    );
    expect(desktopStyles).toMatch(
      /\.myles97-window\[data-m97-program-window="welcome"\] \.myles97-welcome-mark \{[\s\S]*?width: 48px;[\s\S]*?height: 48px;/,
    );
  });
});
