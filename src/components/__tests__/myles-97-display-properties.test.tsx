import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DisplayProperties } from "@/components/myles-97/display-properties";

const preferences = {
  highContrast: false,
  reduceMotion: false,
};

describe("DisplayProperties", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("uses the canonical theme store for light and dark", async () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    const user = userEvent.setup();

    render(
      <DisplayProperties
        preferences={preferences}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Light" }));

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("light");
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(screen.getByRole("radio", { name: "Light" })).toBeChecked();
    });
  });

  it("updates high contrast and reduced motion independently", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <DisplayProperties
        preferences={preferences}
        onChange={onChange}
        onReset={vi.fn()}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: "High contrast" }));
    expect(onChange).toHaveBeenLastCalledWith({
      highContrast: true,
      reduceMotion: false,
    });

    await user.click(screen.getByRole("checkbox", { name: "Reduce motion" }));
    expect(onChange).toHaveBeenLastCalledWith({
      highContrast: false,
      reduceMotion: true,
    });
  });

  it("requires explicit confirmation before resetting the desktop", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    render(
      <DisplayProperties
        preferences={preferences}
        onChange={vi.fn()}
        onReset={onReset}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Reset desktop…" }));
    expect(onReset).not.toHaveBeenCalled();
    expect(
      screen.getByText("Reset open programs, positions, and display preferences?"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Confirm reset" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
