import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DotCursor } from "@/components/dot-cursor";

describe("DotCursor", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dot-cursor-ready");
  });

  it("hides the native cursor only after the custom cursor is ready", () => {
    const { unmount } = render(<DotCursor />);

    expect(document.documentElement).toHaveClass("dot-cursor-ready");

    unmount();
    expect(document.documentElement).not.toHaveClass("dot-cursor-ready");
  });

  it("keeps the native cursor when reduced motion is requested", () => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === "(prefers-reduced-motion: reduce)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<DotCursor />);

    expect(document.documentElement).not.toHaveClass("dot-cursor-ready");
  });
});
