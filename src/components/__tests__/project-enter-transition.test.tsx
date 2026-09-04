import { act, fireEvent, render, screen } from "@testing-library/react";
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
    window.history.replaceState({}, "", "/");
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
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: vi.fn(),
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

  it("makes the routed surface inert while the transition overlay is active", async () => {
    render(
      <ProjectEnterTransition>
        <main>
          <button type="button">Underlying route action</button>
        </main>
      </ProjectEnterTransition>,
    );

    const routeSurface = document.querySelector("[data-project-route-surface]");
    expect(routeSurface).not.toHaveAttribute("inert");
    expect(routeSurface).not.toHaveAttribute("aria-hidden");

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

    expect(routeSurface).toHaveAttribute("inert");
    expect(routeSurface).toHaveAttribute("aria-hidden", "true");

    fireEvent.keyDown(window, { key: "Escape" });
    expect(routeSurface).not.toHaveAttribute("inert");
    expect(routeSurface).not.toHaveAttribute("aria-hidden");
  });

  it("expires a failed route intent so later navigation still receives focus", async () => {
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">
          <h1>Homepage</h1>
        </main>
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

    await act(async () => {
      vi.advanceTimersByTime(4_500);
      await Promise.resolve();
    });
    expect(document.querySelector(".project-enter-overlay")).toBeNull();

    navigation.pathname = "/about";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main id="main-content">
            <h1>About Myles</h1>
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
    });

    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("About Myles");
  });

  it("expires a failed reduced-motion route intent", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({ matches: true } as MediaQueryList);
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">
          <h1>Homepage</h1>
        </main>
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
    });
    expect(document.querySelector(".project-enter-overlay")).toBeNull();

    await act(async () => {
      vi.advanceTimersByTime(4_500);
      await Promise.resolve();
    });

    navigation.pathname = "/about";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main id="main-content">
            <h1>About Myles</h1>
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
    });

    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("About Myles");
  });

  it("politely announces the destination title only after the enter transition settles", async () => {
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">Homepage</main>
      </ProjectEnterTransition>,
    );

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveAttribute("aria-atomic", "true");
    expect(status).toBeEmptyDOMElement();

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
          <main
            id="main-content"
            className="project-page"
            data-project-slug="fresh-greens"
          >
            <h1>Fresh Greens</h1>
            <figure data-project-enter-cover />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(status).toBeEmptyDOMElement();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(screen.getByRole("status")).toHaveTextContent("Fresh Greens");
  });

  it("moves focus from the removed project trigger to the destination main after settling", async () => {
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">
          <button type="button">Open Fresh Greens</button>
        </main>
      </ProjectEnterTransition>,
    );
    screen.getByRole("button", { name: "Open Fresh Greens" }).focus();

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
          <main
            id="main-content"
            className="project-page"
            data-project-slug="fresh-greens"
          >
            <h1>Fresh Greens</h1>
            <figure data-project-enter-cover />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const destination = screen.getByRole("main", { hidden: true });
    expect(destination).not.toHaveFocus();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(destination).toHaveFocus();
    expect(destination).toHaveAttribute("tabindex", "-1");
  });

  it("restores focus to the originating project trigger after the return settles", async () => {
    navigation.pathname = "/work/fresh-greens";
    const { rerender } = render(
      <ProjectEnterTransition>
        <main
          id="main-content"
          className="project-page"
          data-project-slug="fresh-greens"
        >
          <h1>Fresh Greens</h1>
          <figure data-project-enter-cover />
        </main>
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
          <main id="main-content">
            <h1>Myles Ashitey</h1>
            <section data-m97-program-window="fresh-greens" tabIndex={-1}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/work/fresh-greens">Read Fresh Greens case study</a>
            </section>
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const trigger = screen.getByRole("link", {
      name: "Read Fresh Greens case study",
      hidden: true,
    });
    expect(trigger).not.toHaveFocus();
    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(trigger).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Myles Ashitey");
  });

  it("restores focus to Work Stuff even when its project preview is already open", async () => {
    navigation.pathname = "/work/fresh-greens";
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content" className="project-page" data-project-slug="fresh-greens">
          <h1>Fresh Greens</h1>
          <figure data-project-enter-cover />
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      requestReturn({ ...returnSnapshot, returnTarget: "selected-work" });
      await Promise.resolve();
    });

    navigation.pathname = "/";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main id="main-content">
            <h1>Myles Ashitey</h1>
            <section data-m97-program-window="fresh-greens" tabIndex={-1}>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/work/fresh-greens">Preview-window case-study link</a>
            </section>
            <section data-m97-program-window="selected-work">
              <article data-m97-selected-work-project="fresh-greens">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/work/fresh-greens">Read Fresh Greens case study</a>
              </article>
            </section>
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    const trigger = screen.getByRole("link", {
      name: "Read Fresh Greens case study",
      hidden: true,
    });
    await act(async () => {
      fireEvent.keyDown(window, { key: "Escape" });
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(trigger).toHaveFocus();
  });

  it("uses the newest route intent when a second request interrupts the transition", async () => {
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">Homepage</main>
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
    await act(async () => {
      request({
        slug: "navi",
        href: "/work/navi",
        rect: { ...rect, left: 160 },
        visual: { type: "image", src: "/projects/navi/cover.png" },
        borderRadius: "0px",
      });
      await Promise.resolve();
    });

    expect(navigation.push.mock.calls).toEqual([
      ["/work/fresh-greens"],
      ["/work/navi"],
    ]);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(document.querySelector(".project-enter-overlay")).toBeNull();

    navigation.pathname = "/work/fresh-greens";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main
            id="main-content"
            className="project-page"
            data-project-slug="fresh-greens"
          >
            <h1>Fresh Greens</h1>
            <figure data-project-enter-cover />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
    });

    expect(screen.getByRole("main")).not.toHaveFocus();
    expect(screen.getByRole("status")).toBeEmptyDOMElement();

    navigation.pathname = "/work/navi";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main id="main-content" className="project-page" data-project-slug="navi">
            <h1>Navi</h1>
            <figure data-project-enter-cover />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Navi");
  });

  it("keeps the requested route and focuses it when Escape skips animation before arrival", async () => {
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">Homepage</main>
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
    fireEvent.keyDown(window, { key: "Escape" });

    expect(navigation.push).toHaveBeenLastCalledWith("/work/fresh-greens");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();

    navigation.pathname = "/work/fresh-greens";
    await act(async () => {
      rerender(
        <ProjectEnterTransition>
          <main id="main-content" className="project-page" data-project-slug="fresh-greens">
            <h1>Fresh Greens</h1>
            <figure data-project-enter-cover />
          </main>
        </ProjectEnterTransition>,
      );
      await Promise.resolve();
    });

    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("Fresh Greens");
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

  it("settles matching image geometry with a uniform FLIP and interpolated radius", async () => {
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
          "translate3d(-80px, 80px, 0) scale(0.533333)",
        borderRadius: "22.5px",
      },
      {
        transform: "translate3d(0px, 0px, 0) scale(1)",
        borderRadius: "32px",
      },
    ]);
    for (const keyframe of frameCall?.[0] ?? []) {
      expect(keyframe).not.toHaveProperty("top");
      expect(keyframe).not.toHaveProperty("left");
      expect(keyframe).not.toHaveProperty("width");
      expect(keyframe).not.toHaveProperty("height");
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

  it("crossfades enter content when source and target aspect ratios differ", async () => {
    coverGeometry = domRect(40, 160, 900, 500);
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

  it("uses a uniform inverse FLIP when returning to matching desktop geometry", async () => {
    navigation.pathname = "/work/fresh-greens";
    coverGeometry = domRect(32, 120, 936, 676);
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
          "translate3d(-40px, -56px, 0) scale(1.3)",
    );
    expect(reverseFrameCall?.[0]).toEqual([
      {
        transform:
          "translate3d(-40px, -56px, 0) scale(1.3)",
        borderRadius: "0px",
      },
      {
        transform: "translate3d(0px, 0px, 0) scale(1)",
        borderRadius: "0px",
      },
    ]);
    expect(document.querySelector(".project-enter-frame")).toHaveStyle({
      top: "88px",
      left: "160px",
      width: "720px",
      height: "520px",
    });
  });

  it("crossfades return content when cover and desktop aspect ratios differ", async () => {
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

  it("uses direct return navigation for an app-level reduced-motion snapshot", async () => {
    render(
      <ProjectEnterTransition>
        <main>Current route</main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      requestReturn({ ...returnSnapshot, reduceMotion: true });
    });

    expect(navigation.push).toHaveBeenCalledWith("/");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
  });

  it("uses direct enter navigation for an app-level reduced-motion request", async () => {
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
        reduceMotion: true,
      });
    });

    expect(navigation.push).toHaveBeenCalledWith("/work/fresh-greens");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
  });

  it("uses controller-owned direct navigation when a source cannot animate truthfully", async () => {
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
        animate: false,
      });
    });

    expect(navigation.push).toHaveBeenCalledWith("/work/fresh-greens");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
  });

  it("uses controller-owned direct return for a non-animated origin", async () => {
    render(
      <ProjectEnterTransition>
        <main>Current route</main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      requestReturn({ ...returnSnapshot, animate: false });
    });

    expect(navigation.push).toHaveBeenCalledWith("/");
    expect(document.querySelector(".project-enter-overlay")).toBeNull();
  });

  it("waits for a persisted program window before restoring direct-return focus", async () => {
    const frames: FrameRequestCallback[] = [];
    vi.mocked(window.requestAnimationFrame).mockImplementation((callback) => {
      frames.push(callback);
      return frames.length;
    });
    navigation.pathname = "/work/fresh-greens";
    const { rerender } = render(
      <ProjectEnterTransition>
        <main id="main-content">
          <h1>Fresh Greens</h1>
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      requestReturn({ ...returnSnapshot, animate: false });
      await Promise.resolve();
    });

    navigation.pathname = "/";
    rerender(
      <ProjectEnterTransition>
        <main id="main-content">
          <h1>Myles Ashitey</h1>
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      frames.shift()?.(0);
      await Promise.resolve();
    });
    expect(screen.getByRole("main")).not.toHaveFocus();

    rerender(
      <ProjectEnterTransition>
        <main id="main-content">
          <h1>Myles Ashitey</h1>
          <section data-m97-program-window="fresh-greens">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/work/fresh-greens">Read Fresh Greens case study</a>
          </section>
        </main>
      </ProjectEnterTransition>,
    );

    await act(async () => {
      while (frames.length > 0) frames.shift()?.(0);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(
      screen.getByRole("link", { name: "Read Fresh Greens case study" }),
    ).toHaveFocus();
    expect(HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({
      block: "nearest",
      inline: "nearest",
    });
    expect(screen.getByRole("status")).toHaveTextContent("Myles Ashitey");
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

  it("uses a stored snapshot only when browser Back reaches the homepage", async () => {
    saveProjectReturnSnapshot(returnSnapshot);
    navigation.pathname = "/work/fresh-greens";
    const { rerender } = render(
      <ProjectEnterTransition>
        <article className="project-page" data-project-slug="fresh-greens">
          <figure data-project-enter-cover />
        </article>
      </ProjectEnterTransition>,
    );

    window.history.replaceState({}, "", "/work/fresh-greens#fg-plan");
    fireEvent.popState(window);
    expect(document.querySelector(".project-enter-overlay")).toBeNull();

    window.history.replaceState({}, "", "/");
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
