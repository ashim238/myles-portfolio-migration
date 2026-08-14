import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectEnterTransition } from "@/components/project-enter-transition";
import {
  PROJECT_ENTER_REQUEST,
  PROJECT_RETURN_REQUEST,
  saveProjectReturnSnapshot,
  type ProjectEnterRequestDetail,
  type ProjectProgramVisual,
  type ProjectReturnRequestDetail,
  type ProjectReturnSnapshot,
} from "@/lib/project-enter";

const navigation = vi.hoisted(() => ({
  pathname: "/",
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: navigation.push }),
}));

vi.mock("next/image", () => ({
  default: ({
    alt = "",
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean }) => {
    void priority;
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

const rect = { top: 120, left: 80, width: 480, height: 320 };
const animationCancels: ReturnType<typeof vi.fn>[] = [];
const programVisual: ProjectProgramVisual = {
  type: "program",
  programId: "fresh-greens",
  appName: "Fresh Greens.exe",
  title: "Fresh Greens",
  cover: { type: "image", src: "/projects/fresh-greens/cover.png" },
};
const returnSnapshot: ProjectReturnSnapshot = {
  version: 1,
  slug: "fresh-greens",
  rect: { top: 88, left: 160, width: 720, height: 520 },
  borderRadius: "0px",
  visual: programVisual,
};

function domRect(top: number, left: number, width: number, height: number): DOMRect {
  return {
    top,
    left,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

let coverGeometry = domRect(40, 160, 900, 600);
let programGeometry = domRect(88, 160, 720, 520);

function request(detail: ProjectEnterRequestDetail) {
  window.dispatchEvent(
    new CustomEvent<ProjectEnterRequestDetail>(PROJECT_ENTER_REQUEST, { detail }),
  );
}

function requestReturn(snapshot = returnSnapshot) {
  window.dispatchEvent(
    new CustomEvent<ProjectReturnRequestDetail>(PROJECT_RETURN_REQUEST, {
      detail: { href: "/", snapshot },
    }),
  );
}

describe("ProjectEnterTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.pathname = "/";
    navigation.push.mockReset();
    animationCancels.length = 0;
    sessionStorage.clear();
    coverGeometry = domRect(40, 160, 900, 600);
    programGeometry = domRect(88, 160, 720, 520);

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn(() => ({
        matches: false,
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: vi.fn((callback: FrameRequestCallback) => {
        callback(0);
        return 1;
      }),
    });
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: function getBoundingClientRect(this: HTMLElement) {
        if (this.hasAttribute("data-project-enter-cover")) return coverGeometry;
        if (this.hasAttribute("data-m97-program-window")) return programGeometry;
        return domRect(0, 0, 100, 100);
      },
    });
    Object.defineProperty(HTMLElement.prototype, "animate", {
      configurable: true,
      value: vi.fn(() => {
        const cancel = vi.fn();
        animationCancels.push(cancel);
        return {
          cancel,
          finished: new Promise<Animation>(() => undefined),
        };
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("starts route navigation after mounting the source-cover overlay", async () => {
    render(
      <ProjectEnterTransition>
        <main>Homepage</main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      request({
        slug: "fresh-greens",
        href: "/work/fresh-greens",
        rect,
        visual: { type: "image", src: "/projects/fresh-greens/cover.png" },
        borderRadius: "0.75rem",
      });
      await Promise.resolve();
    });

    expect(document.querySelector(".project-enter-overlay")).not.toBeNull();
    expect(document.querySelector(".project-enter-backdrop")).not.toBeNull();
    expect(navigation.push).toHaveBeenCalledWith("/work/fresh-greens");
  });

  it("renders a structured Myles 97 program instead of serializing the source DOM", async () => {
    render(
      <ProjectEnterTransition>
        <main>Homepage</main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      request({
        slug: "fresh-greens",
        href: "/work/fresh-greens",
        rect,
        visual: programVisual,
        borderRadius: "0px",
      });
      await Promise.resolve();
    });

    expect(document.querySelector(".project-enter-program-title")).toHaveTextContent(
      "Fresh Greens.exe",
    );
    expect(document.querySelector(".project-enter-program-cover img")).toHaveAttribute(
      "src",
      "/projects/fresh-greens/cover.png",
    );
  });

  it("settles an image frame with transform-only FLIP keyframes and cleans up once", async () => {
    const complete = vi.fn();
    window.addEventListener("project-enter-complete", complete);
    const { rerender } = render(
      <ProjectEnterTransition>
        <main className="project-page" data-project-slug="fresh-greens">
          <figure data-project-enter-cover style={{ borderRadius: "32px" }} />
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      request({
        slug: "fresh-greens",
        href: "/work/fresh-greens",
        rect,
        visual: { type: "image", src: "/projects/fresh-greens/cover.png" },
        borderRadius: "12px",
      });
      await Promise.resolve();
    });

    navigation.pathname = "/work/fresh-greens";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main className="project-page" data-project-slug="fresh-greens">
            <figure data-project-enter-cover style={{ borderRadius: "32px" }} />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const animate = HTMLElement.prototype.animate as ReturnType<typeof vi.fn>;
    const frameCall = animate.mock.calls.find(
      ([keyframes]) => Array.isArray(keyframes) && "transform" in keyframes[0],
    );
    expect(frameCall?.[0]).toEqual([
      {
        transform:
          "translate3d(-80px, 80px, 0) scale(0.533333, 0.533333)",
      },
      { transform: "translate3d(0px, 0px, 0) scale(1, 1)" },
    ]);
    for (const keyframe of frameCall?.[0] ?? []) {
      expect(keyframe).not.toHaveProperty("top");
      expect(keyframe).not.toHaveProperty("left");
      expect(keyframe).not.toHaveProperty("width");
      expect(keyframe).not.toHaveProperty("height");
      expect(keyframe).not.toHaveProperty("borderRadius");
    }
    expect(document.querySelector(".project-enter-frame")).toHaveStyle({
      top: "40px",
      left: "160px",
      width: "900px",
      height: "600px",
      borderRadius: "32px",
    });

    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
    expect(document.documentElement).not.toHaveClass("project-enter-lock");
    expect(animationCancels.every((cancel) => cancel.mock.calls.length === 1)).toBe(true);
    expect(complete).toHaveBeenCalledTimes(1);

    act(() => vi.advanceTimersByTime(5_000));
    expect(complete).toHaveBeenCalledTimes(1);
    window.removeEventListener("project-enter-complete", complete);
  });

  it("uses inverse FLIP geometry when returning to the restored desktop program", async () => {
    navigation.pathname = "/work/fresh-greens";
    coverGeometry = domRect(32, 120, 960, 620);
    programGeometry = domRect(88, 160, 720, 520);
    const { rerender } = render(
      <ProjectEnterTransition>
        <main>
          <article className="project-page" data-project-slug="fresh-greens">
            <figure data-project-enter-cover />
          </article>
          <section data-m97-program-window="fresh-greens" />
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      requestReturn();
      await Promise.resolve();
    });
    expect(navigation.push).toHaveBeenCalledWith("/");
    expect(document.querySelector(".project-enter-overlay")).toHaveAttribute(
      "data-direction",
      "return",
    );

    navigation.pathname = "/";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main>
            <section data-m97-program-window="fresh-greens" />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const animate = HTMLElement.prototype.animate as ReturnType<typeof vi.fn>;
    const reverseFrameCall = animate.mock.calls.find(
      ([keyframes]) =>
        Array.isArray(keyframes) &&
        "transform" in keyframes[0] &&
        keyframes[0].transform ===
          "translate3d(-40px, -56px, 0) scale(1.333333, 1.192308)",
    );
    expect(reverseFrameCall?.[0]).toEqual([
      {
        transform:
          "translate3d(-40px, -56px, 0) scale(1.333333, 1.192308)",
      },
      { transform: "translate3d(0px, 0px, 0) scale(1, 1)" },
    ]);
    expect(document.querySelector(".project-enter-frame")).toHaveStyle({
      top: "88px",
      left: "160px",
      width: "720px",
      height: "520px",
    });
  });

  it("falls back to a crossfade when the restored program target is missing", async () => {
    navigation.pathname = "/work/fresh-greens";
    const { rerender } = render(
      <ProjectEnterTransition>
        <article className="project-page" data-project-slug="fresh-greens">
          <figure data-project-enter-cover />
        </article>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      requestReturn();
      await Promise.resolve();
    });
    navigation.pathname = "/";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main>Desktop without restored project window</main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const animate = HTMLElement.prototype.animate as ReturnType<typeof vi.fn>;
    const geometryCalls = animate.mock.calls.filter(
      ([keyframes]) => Array.isArray(keyframes) && "transform" in keyframes[0],
    );
    expect(geometryCalls).toHaveLength(0);
    expect(
      animate.mock.calls.some(
        ([keyframes]) => Array.isArray(keyframes) && "opacity" in keyframes[0],
      ),
    ).toBe(true);
  });

  it("crossfades when the destination cover has no usable geometry", async () => {
    coverGeometry = domRect(0, 0, 0, 0);
    const { rerender } = render(
      <ProjectEnterTransition>
        <main className="project-page" data-project-slug="fresh-greens">
          <figure data-project-enter-cover />
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      request({
        slug: "fresh-greens",
        href: "/work/fresh-greens",
        rect,
        visual: { type: "image", src: "/projects/fresh-greens/cover.png" },
        borderRadius: "12px",
      });
      await Promise.resolve();
    });

    navigation.pathname = "/work/fresh-greens";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main className="project-page" data-project-slug="fresh-greens">
            <figure data-project-enter-cover />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const animate = HTMLElement.prototype.animate as ReturnType<typeof vi.fn>;
    expect(
      animate.mock.calls.filter(
        ([keyframes]) => Array.isArray(keyframes) && "transform" in keyframes[0],
      ),
    ).toHaveLength(0);
    expect(
      animate.mock.calls.some(
        ([keyframes]) => Array.isArray(keyframes) && "opacity" in keyframes[0],
      ),
    ).toBe(true);
  });

  it("uses direct navigation without mounting overlays for reduced motion", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    render(
      <ProjectEnterTransition>
        <main>Current route</main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      request({
        slug: "fresh-greens",
        href: "/work/fresh-greens",
        rect,
        visual: programVisual,
        borderRadius: "0px",
      });
    });
    expect(navigation.push).toHaveBeenLastCalledWith("/work/fresh-greens");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();

    navigation.push.mockReset();
    await act(async () => {
      requestReturn();
    });
    expect(navigation.push).toHaveBeenCalledWith("/");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
  });

  it("carries the live TikTok cover treatment instead of a static image", async () => {
    render(
      <ProjectEnterTransition>
        <main>Homepage</main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      request({
        slug: "tiktok",
        href: "/work/tiktok",
        rect,
        visual: { type: "tiktok" },
        borderRadius: "0.75rem",
      });
      await Promise.resolve();
    });

    expect(document.querySelector(".project-enter-tiktok .tt-cover-field")).not.toBeNull();
    expect(document.querySelector(".project-enter-image")).toBeNull();
  });

  it("uses a stored snapshot for browser Back only on the exact case-study route", async () => {
    saveProjectReturnSnapshot(returnSnapshot);
    navigation.pathname = "/work/fresh-greens";
    const { rerender } = render(
      <ProjectEnterTransition>
        <article className="project-page" data-project-slug="fresh-greens">
          <figure data-project-enter-cover />
        </article>
      </ProjectEnterTransition>,
    );

    fireEvent.popState(window);
    expect(document.querySelector(".project-enter-overlay")).toHaveAttribute(
      "data-direction",
      "return",
    );
    expect(navigation.push).not.toHaveBeenCalled();

    fireEvent.keyDown(window, { key: "Escape" });
    navigation.pathname = "/work/navi/demo";
    saveProjectReturnSnapshot({
      ...returnSnapshot,
      slug: "navi",
      visual: {
        ...programVisual,
        programId: "navi",
        appName: "Navi Places.exe",
        title: "Navi",
      },
    });
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main>Navi demo</main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
    });
    fireEvent.popState(window);
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
  });
});
