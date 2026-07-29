import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LoomEmbed } from "@/components/loom-embed";

describe("LoomEmbed", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.theme;
  });

  it("syncs a preloaded frame after registering its message listener", () => {
    localStorage.setItem("theme", "dark");
    const postMessage = vi.fn();
    const contentWindowSpy = vi
      .spyOn(HTMLIFrameElement.prototype, "contentWindow", "get")
      .mockReturnValue({ postMessage } as unknown as Window);

    try {
      render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);

      expect(postMessage).toHaveBeenCalledWith(
        { type: "loom:theme", theme: "dark" },
        window.location.origin,
      );
    } finally {
      contentWindowSpy.mockRestore();
    }
  });

  it("sends the active theme on load and whenever the portfolio theme changes", () => {
    localStorage.setItem("theme", "light");
    render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
    const frame = screen.getByTitle(
      "Loom interactive preview",
    ) as HTMLIFrameElement;
    const postMessage = vi.spyOn(frame.contentWindow!, "postMessage");

    fireEvent.load(frame);
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "loom:theme", theme: "light" },
      window.location.origin,
    );

    localStorage.setItem("theme", "dark");
    fireEvent(window, new Event("theme-change"));
    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "loom:theme", theme: "dark" },
      window.location.origin,
    );
  });

  it("uses the changed system theme when there is no saved preference", () => {
    let systemChangeListener:
      | ((event: MediaQueryListEvent) => void)
      | undefined;
    const mediaQuery = {
      matches: false,
      media: "(prefers-color-scheme: light)",
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(
        (
          type: string,
          listener: (event: MediaQueryListEvent) => void,
        ) => {
          if (type === "change") systemChangeListener = listener;
        },
      ),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as unknown as MediaQueryList;
    vi.spyOn(window, "matchMedia").mockReturnValue(mediaQuery);
    document.documentElement.dataset.theme = "dark";

    render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
    const frame = screen.getByTitle(
      "Loom interactive preview",
    ) as HTMLIFrameElement;
    const postMessage = vi.spyOn(frame.contentWindow!, "postMessage");

    act(() => {
      systemChangeListener?.({ matches: true } as MediaQueryListEvent);
    });

    expect(postMessage).toHaveBeenLastCalledWith(
      { type: "loom:theme", theme: "light" },
      window.location.origin,
    );
  });

  it("auto-sizes only for a valid message from its own same-origin frame", () => {
    render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
    const frame = screen.getByTitle(
      "Loom interactive preview",
    ) as HTMLIFrameElement;

    fireEvent(
      window,
      new MessageEvent("message", {
        data: { type: "loom:resize", height: 811.2 },
        origin: window.location.origin,
        source: frame.contentWindow,
      }),
    );
    expect(frame).toHaveStyle({ height: "812px" });

    for (const event of [
      new MessageEvent("message", {
        data: { type: "loom:resize", height: 999 },
        origin: "https://invalid.example",
        source: frame.contentWindow,
      }),
      new MessageEvent("message", {
        data: { type: "loom:resize", height: 999 },
        origin: window.location.origin,
        source: window,
      }),
      new MessageEvent("message", {
        data: { type: "loom:resize", height: Number.NaN },
        origin: window.location.origin,
        source: frame.contentWindow,
      }),
      new MessageEvent("message", {
        data: { type: "unrelated", height: 999 },
        origin: window.location.origin,
        source: frame.contentWindow,
      }),
    ]) {
      fireEvent(window, event);
      expect(frame).toHaveStyle({ height: "812px" });
    }
  });

  it("keeps a direct protected path when the embed is unavailable", () => {
    render(<LoomEmbed src="/play/loom/index.html" title="Loom" />);
    const fallback = screen.getByRole("link", {
      name: "Open Loom in a new tab",
    });

    expect(fallback).toHaveAttribute("href", "/play/loom/index.html");
    expect(fallback).toHaveAttribute("target", "_blank");
    expect(fallback).toHaveAttribute("rel", "noopener noreferrer");
  });
});
