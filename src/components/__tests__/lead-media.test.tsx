import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadMedia } from "@/components/lead-media";

describe("LeadMedia", () => {
  it("renders the verified still-image geometry and presentation", () => {
    const { container } = render(
      <LeadMedia
        cover="/projects/fresh-greens/cover.png"
        alt="Fresh Greens cover"
        width={2560}
        height={1862}
        presentation="fresh-greens"
      />,
    );

    expect(screen.getByAltText("Fresh Greens cover")).toHaveAttribute(
      "width",
      "2560",
    );
    expect(screen.getByAltText("Fresh Greens cover")).toHaveAttribute(
      "height",
      "1862",
    );
    expect(container.querySelector("figure")).toHaveClass(
      "case-lead-media",
      "case-lead-media--fresh-greens",
    );
  });

  it("reserves the verified poster geometry before attaching the clip", () => {
    const { container } = render(
      <LeadMedia
        cover="/projects/navi/cover.png"
        alt="Navi demo"
        clip="/projects/navi/demo.mp4"
        width={2048}
        height={1365}
      />,
    );
    const video = container.querySelector("video");
    expect(video).toHaveAttribute("width", "2048");
    expect(video).toHaveAttribute("height", "1365");
    expect(video).toHaveAttribute("poster", "/projects/navi/cover.png");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("controls");
    expect(container.querySelector("source")).toBeNull();
  });
});
