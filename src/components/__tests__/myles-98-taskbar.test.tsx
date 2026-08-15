import { createRef } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Taskbar } from "@/components/myles-97/taskbar";

vi.mock("next/image", () => ({
  default: ({ alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

describe("Myles 98 taskbar", () => {
  it("uses the native 24px portrait master for Start without changing its control contract", () => {
    const startButtonRef = createRef<HTMLButtonElement>();
    const onToggleStart = vi.fn();
    const { container } = render(
      <Taskbar
        programs={[]}
        openPrograms={[]}
        minimizedPrograms={[]}
        focusedProgram={null}
        startOpen={false}
        startButtonRef={startButtonRef}
        onToggleStart={onToggleStart}
        onFocus={vi.fn()}
        onMinimize={vi.fn()}
        onRestore={vi.fn()}
      />,
    );

    const start = screen.getByRole("button", { name: "Start" });
    const portrait = container.querySelector<HTMLImageElement>(
      ".myles97-start-mark img",
    );

    expect(portrait).toHaveAttribute(
      "src",
      "/myles98-icons/start/start-24.svg",
    );
    expect(portrait).not.toHaveAttribute("src", "/logomark.svg");
    expect(portrait).toHaveAttribute("width", "24");
    expect(portrait).toHaveAttribute("height", "24");
    expect(start).toHaveAttribute("aria-haspopup", "dialog");
    expect(start).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(start);
    expect(onToggleStart).toHaveBeenCalledTimes(1);
  });

  it("hydrates the clock from browser-local time instead of server render time", async () => {
    const startButtonRef = createRef<HTMLButtonElement>();

    render(
      <Taskbar
        programs={[]}
        openPrograms={[]}
        minimizedPrograms={[]}
        focusedProgram={null}
        startOpen={false}
        startButtonRef={startButtonRef}
        onToggleStart={vi.fn()}
        onFocus={vi.fn()}
        onMinimize={vi.fn()}
        onRestore={vi.fn()}
      />,
    );

    await waitFor(() => {
      const expected = new Date().toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      });
      expect(screen.getByText(expected)).toBeInTheDocument();
    });
    expect(screen.queryByText("--:--")).toBeNull();
  });
});
