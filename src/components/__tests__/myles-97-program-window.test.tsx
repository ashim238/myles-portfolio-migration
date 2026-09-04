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

    const move = screen.getByLabelText(/Move Fresh Greens\.exe/);
    expect(move).toHaveAttribute("data-m97-window-move", "fresh-greens");
    expect(move).toHaveClass("myles97-titlebar");
    move.focus();
    expect(move).toHaveFocus();

    const minimize = screen.getByRole("button", { name: "Minimize Fresh Greens.exe" });
    expect(minimize).toHaveClass("myles97-hit-target");
    await user.click(minimize);
    expect(onMinimize).toHaveBeenCalledWith("fresh-greens");

    const maximize = screen.getByRole("button", {
      name: "Read Fresh Greens case study",
    });
    expect(maximize).toHaveClass("myles97-hit-target");
    expect(maximize).toHaveTextContent("↗");
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

  it("adds elastic resistance beyond desktop bounds before committing the clamped position", () => {
    const onMove = vi.fn();
    const { container } = render(
      <ProgramWindow
        id="fresh-greens"
        title="Fresh Greens.exe"
        geometry={{ x: 40, y: 64, width: 720, height: 520 }}
        focused
        isDefaultPosition={false}
        reduceMotion
        onFocus={vi.fn()}
        onMove={onMove}
        onMinimize={vi.fn()}
        onClose={vi.fn()}
      >
        <p>Program content</p>
      </ProgramWindow>,
    );

    const region = screen.getByRole("region", { name: "Fresh Greens.exe" });
    const titlebar = container.querySelector<HTMLElement>(".myles97-titlebar")!;
    fireEvent.pointerDown(titlebar, {
      pointerId: 9,
      button: 0,
      clientX: 100,
      clientY: 100,
    });
    fireEvent.pointerMove(titlebar, {
      pointerId: 9,
      clientX: -400,
      clientY: 100,
    });

    expect(region.style.transform).toMatch(/^translate3d\(-1\d{2}(?:\.\d+)?px, 0px, 0\)$/);
    expect(region.style.transform).not.toContain("-500px");

    fireEvent.pointerUp(titlebar, {
      pointerId: 9,
      clientX: -400,
      clientY: 100,
    });
    expect(onMove).toHaveBeenCalledWith(
      "fresh-greens",
      expect.objectContaining({ x: 0, y: 64 }),
    );
  });

  it("raises an obscured window when keyboard focus enters it", () => {
    const onFocus = vi.fn();

    render(
      <ProgramWindow
        id="fresh-greens"
        title="Fresh Greens.exe"
        geometry={{ x: 40, y: 64, width: 720, height: 520 }}
        focused={false}
        onFocus={onFocus}
        onMove={vi.fn()}
        onMinimize={vi.fn()}
        onClose={vi.fn()}
      >
        <button type="button">Program action</button>
      </ProgramWindow>,
    );

    screen.getByRole("button", { name: "Program action" }).focus();

    expect(onFocus).toHaveBeenCalledWith("fresh-greens");
  });

  it("moves with arrow keys through the focused title bar", async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();

    render(
      <ProgramWindow
        id="fresh-greens"
        title="Fresh Greens.exe"
        geometry={{ x: 40, y: 64, width: 720, height: 520 }}
        focused
        onFocus={vi.fn()}
        onMove={onMove}
        onMinimize={vi.fn()}
        onClose={vi.fn()}
      >
        <p>Program content</p>
      </ProgramWindow>,
    );

    const move = screen.getByLabelText(/Move Fresh Greens\.exe/);
    move.focus();
    await user.keyboard("{ArrowRight}");

    expect(onMove).toHaveBeenLastCalledWith("fresh-greens", {
      x: 56,
      y: 64,
      width: 720,
      height: 520,
    });

    await user.keyboard("{Shift>}{ArrowDown}{/Shift}");
    expect(onMove).toHaveBeenLastCalledWith("fresh-greens", {
      x: 40,
      y: 128,
      width: 720,
      height: 520,
    });
  });
});
