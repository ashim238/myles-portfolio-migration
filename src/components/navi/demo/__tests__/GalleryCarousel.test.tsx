import { render, screen } from "@testing-library/react";
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
    expect(hero).toHaveAttribute("src", "/a.jpg");
    expect(hero).toHaveAttribute("alt", "A");
  });

  it("renders a thumb per non-hero photo", () => {
    render(<GalleryCarousel photos={photos} />);
    expect(screen.getAllByTestId("gallery-thumb")).toHaveLength(3);
  });

  it("advances the hero when the next arrow is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: "Next photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/b.jpg");
  });

  it("wraps to the last photo when previous is clicked from the first", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getByRole("button", { name: "Previous photo" }));
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/c.jpg");
  });

  it("jumps to a photo when its thumb is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    await userEvent.click(screen.getAllByTestId("gallery-thumb")[2]);
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/c.jpg");
  });

  it("jumps to a photo when its dot is clicked", async () => {
    render(<GalleryCarousel photos={photos} />);
    const dots = screen.getAllByRole("button", { name: /Go to photo/ });
    await userEvent.click(dots[1]);
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/b.jpg");
  });

  it("advances with the ArrowRight key when the hero region is focused", async () => {
    render(<GalleryCarousel photos={photos} />);
    const region = screen.getByRole("region", { name: "Experience photos" });
    region.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByTestId("gallery-hero-img")).toHaveAttribute("src", "/b.jpg");
  });
});
