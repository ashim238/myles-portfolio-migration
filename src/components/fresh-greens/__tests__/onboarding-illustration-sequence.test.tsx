import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OnboardingIllustrationSequence } from "@/components/fresh-greens/onboarding-illustration-sequence";

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ src, alt }: { src: string; alt: string }) => (
    <span role="img" aria-label={alt} data-src={src} />
  ),
}));

describe("Fresh Greens onboarding illustration sequence", () => {
  it("presents the four individual illustrations in narrative order", () => {
    const { container } = render(<OnboardingIllustrationSequence />);

    const scroller = screen.getByRole("region", {
      name: "Fresh Greens onboarding illustration sequence",
    });
    expect(scroller).toHaveAttribute("tabindex", "0");

    const sequence = screen.getByRole("list", {
      name: "Fresh Greens onboarding illustration sequence",
    });
    const panels = Array.from(sequence.querySelectorAll("li"));
    const images = screen.getAllByRole("img");

    expect(panels).toHaveLength(4);
    expect(images.map((image) => image.getAttribute("data-src"))).toEqual([
      "/projects/fresh-greens/process/onboarding/driver-location-journey.svg",
      "/projects/fresh-greens/process/onboarding/driver-reflection.svg",
      "/projects/fresh-greens/process/onboarding/trust-and-safety.svg",
      "/projects/fresh-greens/process/onboarding/community-conversation.svg",
    ]);
    expect(images[0]).toHaveAccessibleName(/Black driver/i);
    expect(images[1]).toHaveAccessibleName(/Black driver/i);
    expect(images[3]).toHaveAccessibleName(/Black driver/i);
    expect(container.innerHTML).not.toContain("onboarding-illustrations.svg");
  });

  it("keeps the static-visible state when reduced motion is requested", () => {
    const matchMedia = vi
      .spyOn(window, "matchMedia")
      .mockImplementation((query: string) => ({
        matches: query === "(prefers-reduced-motion: reduce)",
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

    try {
      const { container } = render(<OnboardingIllustrationSequence />);
      expect(container.querySelector("figure.fg-illustrations")).not.toHaveAttribute(
        "data-reveal",
      );
    } finally {
      matchMedia.mockRestore();
    }
  });
});
