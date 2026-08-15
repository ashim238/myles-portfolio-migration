import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectProgram } from "@/components/myles-97/project-program";
import {
  PROJECT_ENTER_REQUEST,
  readProjectReturnSnapshot,
} from "@/lib/project-enter";
import type { ProgramDefinition } from "@/lib/myles-97/programs";

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    src,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} src={String(src)} alt={alt} />;
  },
}));

const program: ProgramDefinition = {
  id: "fresh-greens",
  appName: "Fresh Greens.exe",
  applicationType: "Route-planning software",
  primaryEvidence: "built",
  title: "Fresh Greens",
  summary: "A route-planning product for finding fresh food.",
  href: "/work/fresh-greens",
  coverImage: "/projects/fresh-greens/cover.png",
};

describe("ProjectProgram", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.spyOn(window, "matchMedia").mockReturnValue({
      matches: false,
    } as MediaQueryList);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("dispatches a structured program transition for an unmodified click", () => {
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    const { container } = render(
      <section className="myles97-window">
        <ProjectProgram program={program} />
      </section>,
    );
    const windowElement = container.querySelector<HTMLElement>(".myles97-window")!;
    windowElement.getBoundingClientRect = vi.fn(() => ({
      top: 64,
      left: 160,
      width: 720,
      height: 520,
      right: 880,
      bottom: 584,
      x: 160,
      y: 64,
      toJSON: () => ({}),
    }));

    const link = screen.getByRole("link", { name: "Read Fresh Greens case study" });
    expect(link).toHaveAttribute("href", "/work/fresh-greens");
    expect(screen.queryByText("Built")).not.toBeInTheDocument();
    fireEvent.click(link);

    expect(onRequest).toHaveBeenCalledTimes(1);
    const event = onRequest.mock.calls[0][0] as CustomEvent;
    expect(event.detail).toMatchObject({
      slug: "fresh-greens",
      href: "/work/fresh-greens",
      visual: {
        type: "program",
        programId: "fresh-greens",
        appName: "Fresh Greens.exe",
      },
    });
    window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
  });

  it("leaves modified clicks on the native case-study link", () => {
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    render(
      <section className="myles97-window">
        <ProjectProgram program={program} />
      </section>,
    );

    const link = screen.getByRole("link", {
      name: "Read Fresh Greens case study",
    });
    link.addEventListener("click", (event) => event.preventDefault(), {
      once: true,
    });
    fireEvent.click(link, { ctrlKey: true });

    expect(onRequest).not.toHaveBeenCalled();
    window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
  });

  it("routes through the controller without animation when reduced motion is active", () => {
    const onRequest = vi.fn((event: Event) => event.preventDefault());
    window.addEventListener(PROJECT_ENTER_REQUEST, onRequest);
    const { container } = render(
      <section className="myles97-window">
        <ProjectProgram program={program} reduceMotion />
      </section>,
    );
    const windowElement = container.querySelector<HTMLElement>(".myles97-window")!;
    windowElement.getBoundingClientRect = vi.fn(() => ({
      top: 64,
      left: 160,
      width: 720,
      height: 520,
      right: 880,
      bottom: 584,
      x: 160,
      y: 64,
      toJSON: () => ({}),
    }));

    fireEvent.click(
      screen.getByRole("link", { name: "Read Fresh Greens case study" }),
    );

    expect(onRequest).toHaveBeenCalledTimes(1);
    expect((onRequest.mock.calls[0][0] as CustomEvent).detail).toMatchObject({
      slug: "fresh-greens",
      href: "/work/fresh-greens",
      reduceMotion: true,
    });
    expect(readProjectReturnSnapshot()).toMatchObject({
      slug: "fresh-greens",
      returnTarget: "program",
      reduceMotion: true,
    });
    window.removeEventListener(PROJECT_ENTER_REQUEST, onRequest);
  });
});
