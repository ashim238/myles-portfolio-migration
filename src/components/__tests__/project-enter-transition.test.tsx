import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectEnterTransition } from "@/components/project-enter-transition";
import {
  PROJECT_ENTER_REQUEST,
  type ProjectEnterRequestDetail,
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

function request(detail: ProjectEnterRequestDetail) {
  window.dispatchEvent(
    new CustomEvent<ProjectEnterRequestDetail>(PROJECT_ENTER_REQUEST, { detail }),
  );
}

describe("ProjectEnterTransition", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    navigation.pathname = "/";
    navigation.push.mockReset();
    animationCancels.length = 0;
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

  it("lands an image frame on the marked destination geometry and cleans up once", async () => {
    const complete = vi.fn();
    window.addEventListener("project-enter-complete", complete);
    const { container, rerender } = render(
      <ProjectEnterTransition>
        <main className="project-page" data-project-slug="fresh-greens">
          <figure data-project-enter-cover style={{ borderRadius: "32px" }} />
        </main>
      </ProjectEnterTransition>,
    );
    const target = container.querySelector<HTMLElement>(
      "[data-project-enter-cover]",
    )!;
    target.getBoundingClientRect = vi.fn(() => ({
      top: 40,
      left: 160,
      width: 900,
      height: 600,
      right: 1060,
      bottom: 640,
      x: 160,
      y: 40,
      toJSON: () => ({}),
    }));

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
      ([keyframes]) => Array.isArray(keyframes) && "top" in keyframes[0],
    );
    expect(frameCall?.[0]?.[1]).toMatchObject({
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

  it("uses direct navigation without mounting an overlay for reduced motion", async () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);
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
    });

    expect(navigation.push).toHaveBeenCalledTimes(1);
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

    expect(
      document.querySelector(".project-enter-tiktok .tt-cover-field"),
    ).not.toBeNull();
    expect(document.querySelector(".project-enter-image")).toBeNull();
  });
});
