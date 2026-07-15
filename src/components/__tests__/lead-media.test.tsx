import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadMedia } from "@/components/lead-media";

describe("LeadMedia", () => {
  it("renders a still image when no clip is given", () => {
    render(<LeadMedia cover="/projects/navi/cover.png" alt="Navi cover" />);
    const img = screen.getByAltText("Navi cover");
    expect(img.tagName).toBe("IMG");
  });

  it("renders a controlled video poster without attaching the clip immediately", () => {
    const { container } = render(
      <LeadMedia cover="/projects/navi/cover.png" alt="Navi demo" clip="/projects/navi/demo.mp4" />,
    );
    const video = container.querySelector("video");
    expect(video).not.toBeNull();
    expect(video!.getAttribute("poster")).toBe("/projects/navi/cover.png");
    expect(video).toHaveAttribute("preload", "none");
    expect(video).toHaveAttribute("controls");
    expect(container.querySelector("source")).toBeNull();
  });
});
