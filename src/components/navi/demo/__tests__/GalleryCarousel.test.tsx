import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { GalleryCarousel } from "@/components/navi/demo/GalleryCarousel";

const photos = [
  { src: "/a.jpg", alt: "A" },
  { src: "/b.jpg", alt: "B" },
  { src: "/c.jpg", alt: "C" },
];

describe("GalleryCarousel", () => {
  it("renders the first photo as the hero", () => {
    render(<GalleryCarousel photos={photos} />);
    const hero = screen.getByTestId("gallery-hero-img");
    expect(hero).toHaveAttribute("alt", "A");
    expect(hero).toHaveAttribute(
      "sizes",
      "(max-width: 720px) 100vw, min(70vw, 960px)",
    );
    expect(hero).not.toHaveAttribute("loading", "lazy");
  });

  it("renders a thumb per non-hero photo", () => {
    render(<GalleryCarousel photos={photos} />);
    expect(screen.getAllByTestId("gallery-thumb")).toHaveLength(3);
    for (const thumb of screen.getAllByTestId("gallery-thumb")) {
      expect(thumb.querySelector("img")).toHaveAttribute(
        "sizes",
        "(max-width: 720px) 22vw, 220px",
      );
    }
  });

  it("advances the hero when the next arrow is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("alt", "B");
  });

  it("wraps to the last photo when previous is clicked from the first", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("alt", "C");
  });

  it("jumps to a photo when its thumb is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getAllByTestId("gallery-thumb")[2]);
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("alt", "C");
  });

  it("jumps to a photo when its dot is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    const dots = screen.getAllByRole("button", { name: /Go to photo/ });
    await userEvent.click(dots[1]);
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("alt", "B");
  });

  it("advances with the ArrowRight key when the hero region is focused", async () => {
    render(<GalleryCarousel photos={photos} />);
    const region = screen.getByRole("region", { name: "Experience photos" });
    region.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("alt", "B");
  });

  it("recovers when a failed slide is replaced by a valid one", async () => {
    render(<GalleryCarousel photos={photos} />);
    fireEvent.error(screen.getByTestId("gallery-hero-img"));
    expect(screen.getByText(/photo coming soon/i)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("alt", "B");
  });
});
