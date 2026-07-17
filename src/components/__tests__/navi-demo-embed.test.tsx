import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NaviDemoEmbed } from "@/components/navi-demo-embed";

describe("NaviDemoEmbed", () => {
  beforeEach(() => {
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      matches: query === "(min-width: 900px)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
  });

  it("keeps the unloaded iframe out of the keyboard and accessibility trees", () => {
    render(<NaviDemoEmbed />);

    const iframe = screen.getByTitle("Navi interactive demo");
    expect(iframe).toHaveAttribute("tabindex", "-1");
    expect(iframe).toHaveAttribute("aria-hidden", "true");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Loading interactive demo",
    );
  });

  it("exposes the iframe after load", () => {
    render(<NaviDemoEmbed />);
    const iframe = screen.getByTitle("Navi interactive demo");

    fireEvent.load(iframe);

    expect(iframe).not.toHaveAttribute("tabindex");
    expect(iframe).not.toHaveAttribute("aria-hidden");
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("opens the full demo in a protected new tab", () => {
    render(<NaviDemoEmbed />);

    const link = screen.getByRole("link", {
      name: /open full demo in a new tab/i,
    });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});
