import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ProgramWindow } from "@/components/myles-97/program-window";

describe("ProgramWindow", () => {
  it("exposes semantic window controls with accessible hit targets", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    const onMove = vi.fn();
    const onMinimize = vi.fn();
    const onClose = vi.fn();
    const onMaximize = vi.fn();

    render(
      <ProgramWindow
        id="fresh-greens"
        title="Fresh Greens.exe"
        geometry={{ x: 40, y: 64, width: 720, height: 520 }}
        focused
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={onMinimize}
        onClose={onClose}
        onMaximize={onMaximize}
      >
        <p>Program content</p>
      </ProgramWindow>,
    );

    expect(screen.getByRole("region", { name: "Fresh Greens.exe" })).toHaveAttribute(
      "data-focused",
      "true",
    );
    expect(screen.getByRole("region", { name: "Fresh Greens.exe" })).toHaveAttribute(
      "data-m97-default-position",
      "true",
    );
    expect(screen.getByText("Program content")).toBeInTheDocument();

    const minimize = screen.getByRole("button", { name: "Minimize Fresh Greens.exe" });
    expect(minimize).toHaveClass("myles97-hit-target");
    await user.click(minimize);
    expect(onMinimize).toHaveBeenCalledWith("fresh-greens");

    const maximize = screen.getByRole("button", {
      name: "Open Fresh Greens case study",
    });
    expect(maximize).toHaveClass("myles97-hit-target");
    await user.click(maximize);
    expect(onMaximize).toHaveBeenCalledWith("fresh-greens");

    await user.click(screen.getByRole("button", { name: "Close Fresh Greens.exe" }));
    expect(onClose).toHaveBeenCalledWith("fresh-greens");
  });

  it("focuses on pointer interaction and commits one clamped move on pointer up", () => {
    const onFocus = vi.fn();
    const onMove = vi.fn();
    const { container } = render(
      <ProgramWindow
        id="fresh-greens"
        title="Fresh Greens.exe"
        geometry={{ x: 40, y: 64, width: 720, height: 520 }}
        focused={false}
        isDefaultPosition={false}
        onFocus={onFocus}
        onMove={onMove}
        onMinimize={vi.fn()}
        onClose={vi.fn()}
      >
        <p>Program content</p>
      </ProgramWindow>,
    );

    const region = screen.getByRole("region", { name: "Fresh Greens.exe" });
    const titlebar = container.querySelector<HTMLElement>(".myles97-titlebar")!;

    expect(region).toHaveAttribute("data-m97-default-position", "false");

    fireEvent.pointerDown(region, { pointerId: 4, button: 0 });
    expect(onFocus).toHaveBeenCalledWith("fresh-greens");

    fireEvent.pointerDown(titlebar, {
      pointerId: 8,
      button: 0,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(titlebar, {
      pointerId: 8,
      clientX: 140,
      clientY: 132,
    });
    fireEvent.pointerUp(titlebar, {
      pointerId: 8,
      clientX: 140,
      clientY: 132,
    });

    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(
      "fresh-greens",
      expect.objectContaining({ x: 80, y: 96, width: 720, height: 520 }),
    );
  });
});
