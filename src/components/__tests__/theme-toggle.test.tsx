import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeToggle } from "@/components/theme-toggle";

describe("ThemeToggle", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("keeps the document, stored preference, and control label in sync", async () => {
    localStorage.setItem("theme", "dark");
    document.documentElement.setAttribute("data-theme", "dark");
    const user = userEvent.setup();

    render(<ThemeToggle />);
    await user.click(
      screen.getByRole("button", { name: "Switch to light mode" }),
    );

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(localStorage.getItem("theme")).toBe("light");
      expect(
        screen.getByRole("button", { name: "Switch to dark mode" }),
      ).toBeInTheDocument();
    });
  });

  it("uses the persisted preference when the DOM attribute is stale", async () => {
    localStorage.setItem("theme", "light");
    document.documentElement.setAttribute("data-theme", "dark");

    render(<ThemeToggle />);

    await waitFor(() => {
      expect(document.documentElement).toHaveAttribute("data-theme", "light");
      expect(
        screen.getByRole("button", { name: "Switch to dark mode" }),
      ).toBeInTheDocument();
    });
  });
});
