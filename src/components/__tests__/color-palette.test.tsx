import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ColorPalette } from "@/components/color-palette";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function setClipboard(value: { writeText: (value: string) => Promise<void> } | undefined) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value,
  });
}

afterEach(() => {
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    Reflect.deleteProperty(navigator, "clipboard");
  }
});

describe("ColorPalette", () => {
  it("announces a successful clipboard copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    const user = userEvent.setup();
    setClipboard({ writeText });
    const { container } = render(<ColorPalette colors={["#123456"]} />);

    expect(container.querySelector(".color-palette")).toHaveAttribute(
      "data-copy-state",
      "idle",
    );
    await user.click(screen.getByRole("button", { name: "Copy color #123456" }));

    expect(writeText).toHaveBeenCalledWith("#123456");
    expect(await screen.findByRole("status")).toHaveTextContent("Copied #123456");
    expect(container.querySelector(".color-palette")).toHaveAttribute(
      "data-copy-state",
      "copied",
    );
  });

  it("announces clipboard failure and leaves the value selectable", async () => {
    const user = userEvent.setup();
    setClipboard(undefined);
    const { container } = render(<ColorPalette colors={["#abcdef"]} />);

    await user.click(screen.getByRole("button", { name: "Copy color #abcdef" }));

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(
        "Clipboard unavailable. Select #abcdef and copy it manually.",
      );
    });
    expect(container.querySelector(".color-palette")).toHaveAttribute(
      "data-copy-state",
      "error",
    );
    expect(screen.getByRole("status")).toHaveClass(
      "color-palette-status--visible",
    );
    expect(screen.getByRole("status")).not.toHaveClass("sr-only");
    expect(screen.getByText("#abcdef")).toHaveClass("color-swatch-label");
  });

  it("handles a rejected clipboard write without an unhandled promise", async () => {
    const user = userEvent.setup();
    setClipboard({ writeText: vi.fn().mockRejectedValue(new Error("denied")) });
    render(<ColorPalette colors={["#fedcba"]} />);

    await user.click(screen.getByRole("button", { name: "Copy color #fedcba" }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Clipboard unavailable. Select #fedcba and copy it manually.",
    );
  });
});
