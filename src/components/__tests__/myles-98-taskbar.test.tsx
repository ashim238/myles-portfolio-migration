import { createRef } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Taskbar } from "@/components/myles-97/taskbar";

vi.mock("next/image", () => ({
  default: ({ alt = "", ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt} />;
  },
}));

describe("Myles 98 taskbar", () => {
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
