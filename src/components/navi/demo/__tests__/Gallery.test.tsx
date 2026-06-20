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

  it("renders a See gallery affordance", () => {
    render(<Gallery photos={photos} />);
    expect(screen.getByText(/see gallery/i)).toBeInTheDocument();
  });
});
