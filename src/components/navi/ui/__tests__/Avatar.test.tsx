import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Avatar } from "@/components/navi/ui/Avatar";

describe("Avatar", () => {
  it("renders initials from the name when no image is given", () => {
    render(<Avatar name="Janice Doeherty" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByLabelText("Janice Doeherty")).toHaveClass("nv-avatar--md");
  });

  it("renders an image with alt when src is provided", () => {
    render(<Avatar name="Janice Doeherty" src="/janice.jpg" size="lg" />);
    const img = screen.getByRole("img", { name: "Janice Doeherty" });
    expect(img).toHaveAttribute("src", "/janice.jpg");
    expect(img.closest(".nv-avatar")).toHaveClass("nv-avatar--lg");
  });

  it("falls back to '?' for an empty name", () => {
    render(<Avatar name="   " />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("can be decorative when the same name is adjacent in text", () => {
    const { rerender } = render(<Avatar name="Janice Doeherty" decorative />);
    expect(screen.queryByRole("img", { name: "Janice Doeherty" })).not.toBeInTheDocument();
    expect(document.querySelector(".nv-avatar")).toHaveAttribute("aria-hidden", "true");

    rerender(<Avatar name="Janice Doeherty" src="/janice.jpg" decorative />);
    expect(document.querySelector(".nv-avatar img")).toHaveAttribute("alt", "");
  });
});
