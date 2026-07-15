import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PulledOverJourney } from "@/components/fresh-greens/pulled-over-journey";

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ alt }: { alt: string }) => (
    <span role="img" aria-label={alt} />
  ),
}));

describe("Fresh Greens pulled-over journey", () => {
  it("moves from the toolkit to the trusted-contact state", async () => {
    const user = userEvent.setup();
    render(<PulledOverJourney />);

    expect(screen.getByRole("tab", { name: /Toolkit/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Starts with the driver's question.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Contact/i }));

    expect(screen.getByRole("tab", { name: /Contact/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByText("A trusted contact and the live recording stay one tap away."),
    ).toBeInTheDocument();
  });

  it("supports arrow-key movement through the sequence", async () => {
    const user = userEvent.setup();
    render(<PulledOverJourney />);

    const toolkit = screen.getByRole("tab", { name: /Toolkit/i });
    toolkit.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: /Reassurance/i })).toHaveFocus();
    expect(screen.getByText("Recording starts quietly before the next decision.")).toBeInTheDocument();
  });
});
