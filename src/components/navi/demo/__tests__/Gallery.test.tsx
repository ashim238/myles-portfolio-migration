import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Gallery } from "@/components/navi/demo/Gallery";

const photos = [
  { src: "/a.jpg", alt: "Photo A" },
  { src: "/b.jpg", alt: "Photo B" },
  { src: "/c.jpg", alt: "Photo C" },
  { src: "/d.jpg", alt: "Photo D" },
  { src: "/e.jpg", alt: "Photo E" },
];

describe("Gallery", () => {
  it("renders a hero photo plus the rest as a thumb grid", () => {
    render(<Gallery photos={photos} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(photos.length);
    expect(imgs[0].getAttribute("alt")).toBe("Photo A");
  });

  it("places the first photo in the hero and the rest in thumbs", () => {
    render(<Gallery photos={photos} />);
    const imgs = screen.getAllByRole("img");
    expect(imgs[0].closest(".nv-gallery-hero")).toBeInTheDocument();
    expect(imgs[1].closest(".nv-gallery-thumbs")).toBeInTheDocument();
    // Hero is one image; up to 4 thumbs.
    expect(document.querySelectorAll(".nv-gallery-thumb")).toHaveLength(4);
  });
});
