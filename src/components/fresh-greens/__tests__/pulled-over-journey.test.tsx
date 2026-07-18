import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { PulledOverJourney } from "@/components/fresh-greens/pulled-over-journey";

vi.mock("@/components/expandable-image", () => ({
  ExpandableImage: ({ alt }: { alt: string }) => (
    <span role="img" aria-label={alt} />
  ),
}));

describe("Fresh Greens pulled-over journey", () => {
  it("renders every stable journey panel before hydration", () => {
    const markup = renderToStaticMarkup(<PulledOverJourney />);

    expect(markup.match(/role="tabpanel"/g)).toHaveLength(4);
    for (const key of ["toolkit", "reassurance", "question", "contact"]) {
      expect(markup).toContain(`id="fg-pulled-panel-${key}"`);
      expect(markup).toContain(`aria-controls="fg-pulled-panel-${key}"`);
    }
    expect(markup).not.toContain(" hidden=");
  });

  it("keeps every tab target mounted after progressive enhancement", () => {
    const { container } = render(<PulledOverJourney />);
    const tabs = screen.getAllByRole("tab");
    const panels = screen.getAllByRole("tabpanel", { hidden: true });

    expect(panels).toHaveLength(4);
    for (const tab of tabs) {
      const panelId = tab.getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(container.querySelector(`#${panelId}`)).not.toBeNull();
    }
    expect(panels.filter((panel) => panel.hasAttribute("hidden"))).toHaveLength(3);
  });

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
      screen.getByText("A trusted contact and the recording stay one tap away."),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The final state keeps Call and Text available while making it clear that no message or location has been sent.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: /no message or location has been sent.*Jordan Lee/i,
      }),
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
