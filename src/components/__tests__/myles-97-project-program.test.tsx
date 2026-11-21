import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { projectSamples } from "@/lib/myles-97/preview-originals";
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

  it.each(["fresh-greens", "navi", "tiktok"] as const)(
    "registers each %s detail against its own source", (id) => {
      const { container } = render(<ProjectProgram program={{ ...program, id }} reduceMotion />);
      const samples = projectSamples[id];
      expect(screen.getAllByRole("radio")).toHaveLength(samples.length + 1);
      for (const [index, sample] of samples.entries()) {
        const select = screen.getByRole("radio", { name: sample.label });
        fireEvent.click(select);
        expect(select).toBeChecked();
        expect(screen.getByRole("figure", { name: sample.alt })).toHaveTextContent(sample.detail);
        expect(screen.getByRole("button", { name: `Enlarge ${sample.label} original` })).toBeVisible();
        expect(screen.getByText(new RegExp(`${index + 1} of ${samples.length}`))).toBeVisible();
        expect(container.querySelector(".sample-page img")).toHaveAttribute("src", sample.src);
        expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", sample.src);
      }
    },
  );

  it("keeps the same evening route when switching from Plan to Drive", () => {
    const { container } = render(<ProjectProgram program={program} reduceMotion />);
    fireEvent.change(screen.getByRole("combobox", { name: "Route" }), { target: { value: "brixton" } });
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("brixton-evening-preview.png"));
    fireEvent.click(screen.getByRole("radio", { name: "Drive" }));
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("04-brixton-evening-navigation.png"));
    fireEvent.click(screen.getByRole("radio", { name: "Map key" }));
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("01-weeksville-daylight-preview.png"));
    fireEvent.change(screen.getByRole("combobox", { name: "Map key view" }), { target: { value: "drive" } });
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", expect.stringContaining("05-brixton-navigation-key-reopened.png"));
  });

  it("opens the FAFSA preview with both original sends and offers the built Mailchimp sample", () => {
    const { container } = render(<ProjectProgram program={{ ...program, id: "understandingfafsa" }} reduceMotion />);
    expect(screen.getByRole("radio", { name: "Compare sends" })).toBeChecked();
    for (const sample of projectSamples.understandingfafsa.slice(0, 2)) {
      const button = screen.getByRole("button", { name: `Enlarge ${sample.label} original` });
      expect(button.querySelector("img")).toHaveAttribute("src", sample.src);
    }
    fireEvent.click(screen.getByRole("radio", { name: "Mailchimp" }));
    expect(container.querySelector(".artwork-crop img")).toHaveAttribute("src", projectSamples.understandingfafsa[2].src);
    expect(screen.getByText(/2 of 2/)).toBeVisible();
  });

  it("reassembles the projected parts and returns to the original sample", () => {
    render(<ProjectProgram program={program} reduceMotion />);
    fireEvent.click(screen.getByRole("radio", { name: "Layers" }));
    const drawing = screen.getByRole("button", { name: /View layers/ });
    expect(drawing).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(drawing);
    expect(drawing).toHaveAttribute("aria-pressed", "true");
    expect(drawing).toHaveAccessibleDescription(expect.stringContaining("Street map"));
    fireEvent.click(drawing);
    expect(drawing).toHaveAttribute("aria-pressed", "false");
    fireEvent.click(screen.getByRole("radio", { name: "Plan" }));
    expect(screen.getByRole("button", { name: "Enlarge Plan original" })).toBeVisible();
  });

  it("pairs the project title with the designer's role", () => {
    render(<ProjectProgram program={program} />);
    expect(screen.getByRole("heading", { name: "Fresh Greens" }).parentElement)
      .toContainElement(screen.getByText("Solo design + build"));
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
