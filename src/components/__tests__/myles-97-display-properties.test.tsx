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

  it("confirms a pending color-scheme change before applying it", async () => {
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

    expect(localStorage.getItem("theme")).toBe("dark");
    expect(document.documentElement).toHaveAttribute("data-theme", "dark");

    await user.click(screen.getByRole("button", { name: "Confirm changes" }));

    await waitFor(() => {
      expect(localStorage.getItem("theme")).toBe("light");
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(screen.getByRole("radio", { name: "Light" })).toBeChecked();
    });
  });

  it("confirms pending accessibility changes together", async () => {
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
    await user.click(screen.getByRole("checkbox", { name: "Reduce motion" }));

    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Confirm changes" }));
    expect(onChange).toHaveBeenLastCalledWith({
      highContrast: true,
      reduceMotion: true,
    });
  });

  it("disables confirmation until a setting has changed", async () => {
    const user = userEvent.setup();

    render(
      <DisplayProperties
        preferences={preferences}
        onChange={vi.fn()}
        onReset={vi.fn()}
      />,
    );

    const confirm = screen.getByRole("button", { name: "Confirm changes" });
    expect(confirm).toBeDisabled();

    await user.click(screen.getByRole("checkbox", { name: "High contrast" }));
    expect(confirm).toBeEnabled();
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

    await user.click(
      screen.getByRole("button", { name: "Reset portfolio…" }),
    );
    expect(onReset).not.toHaveBeenCalled();
    expect(screen.getByText("Reset portfolio?")).toBeInTheDocument();
    expect(
      screen.getByText(
        "This closes open programs and resets window positions, color scheme, contrast, and motion preferences.",
      ),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Reset portfolio" }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("opens the confirmation immediately when reset was requested from Start", () => {
    render(
      <DisplayProperties
        preferences={preferences}
        onChange={vi.fn()}
        onReset={vi.fn()}
        requestReset
      />,
    );

    expect(screen.getByText("Reset portfolio?")).toBeInTheDocument();
  });
});
