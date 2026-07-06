import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadMedia } from "@/components/lead-media";

describe("LeadMedia", () => {
  it("renders a still image when no clip is given", () => {
    render(<LeadMedia cover="/projects/navi/cover.png" alt="Navi cover" />);
    const img = screen.getByAltText("Navi cover");
    expect(img.tagName).toBe("IMG");
  });

  it("renders a video with the cover as poster when a clip is given", () => {
    const { container } = render(
      <LeadMedia cover="/projects/navi/cover.png" alt="Navi demo" clip="/projects/navi/demo.mp4" />,
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.getAttribute("poster")).toBe("/projects/navi/cover.png");
    expect(container.querySelector("source")!.getAttribute("src")).toBe("/projects/navi/demo.mp4");
  });
});
