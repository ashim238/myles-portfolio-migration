import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SpecimenCard } from "@/components/specimen-card";

vi.mock("next/image", () => ({
  default: ({
    priority,
    unoptimized,
    alt = "",
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean;
    unoptimized?: boolean;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...props}
      alt={alt}
      data-priority={priority ? "true" : "false"}
      data-unoptimized={unoptimized ? "true" : "false"}
    />
  ),
}));

vi.mock("@/components/lightbox-provider", () => ({
  useLightbox: () => ({ openLightbox: vi.fn() }),
}));

const images = [
  { src: "/play/sukunas-finger/01.jpg", alt: "Full specimen" },
  { src: "/play/sukunas-finger/02.jpg", alt: "Surface detail" },
];

describe("SpecimenCard", () => {
  it("optimizes every image and eagerly prioritizes only the first requested image", () => {
    render(
      <SpecimenCard
        designation="Sukuna's Finger"
        classification="Special Grade Cursed Object"
        material="PLA filament"
        status="SEALED"
        images={images}
        priority
      />,
    );

    const [firstImage, secondImage] = screen.getAllByRole("img");

    expect(firstImage).toHaveAttribute("data-unoptimized", "false");
    expect(firstImage).toHaveAttribute("data-priority", "true");
    expect(firstImage).toHaveAttribute("loading", "eager");
    expect(firstImage).toHaveAttribute(
      "sizes",
      "(max-width: 480px) 92vw, (max-width: 900px) 46vw, 36rem",
    );
    expect(secondImage).toHaveAttribute("data-unoptimized", "false");
    expect(secondImage).toHaveAttribute("data-priority", "false");
    expect(secondImage).toHaveAttribute("loading", "lazy");
    expect(secondImage).toHaveAttribute(
      "sizes",
      "(max-width: 480px) 92vw, (max-width: 900px) 46vw, 36rem",
    );
  });
});
