import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToStaticMarkup, renderToString } from "react-dom/server";
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
    const container = document.createElement("div");
    container.innerHTML = markup;
    const controls = container.querySelector(".fg-pulled-tabs");
    const panels = Array.from(
      container.querySelectorAll<HTMLElement>(".fg-pulled-panel"),
    );

    expect(controls).toHaveAttribute("hidden");
    expect(
      container.querySelector("h3.fg-pulled-reconstruction-title"),
    ).toHaveTextContent("Interactive case-study reconstruction");
    expect(markup).toContain(
      "This web reconstruction shows one representative path. The native prototype contains the full flow.",
    );
    expect(container.querySelectorAll('[role="tablist"], [role="tab"]')).toHaveLength(0);
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(0);
    expect(container.querySelectorAll(".fg-pulled-interaction")).toHaveLength(4);
    for (const interaction of container.querySelectorAll(
      ".fg-pulled-interaction",
    )) {
      expect(interaction).toHaveAttribute("hidden");
    }
    expect(panels).toHaveLength(4);
    for (const key of ["toolkit", "reassurance", "question", "contact"]) {
      expect(markup).toContain(`id="fg-pulled-panel-${key}"`);
    }
    for (const panel of panels) {
      expect(panel).toHaveAttribute("role", "group");
      expect(panel.getAttribute("aria-label")).toBeTruthy();
      expect(panel).not.toHaveAttribute("hidden");
    }
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

  it("hydrates without recoverable errors or changing stable panel IDs", async () => {
    const container = document.createElement("div");
    container.innerHTML = renderToString(<PulledOverJourney />);
    document.body.append(container);
    const idsBefore = Array.from(
      container.querySelectorAll<HTMLElement>(".fg-pulled-panel"),
      (panel) => panel.id,
    );
    const recoverableErrors: unknown[] = [];
    let root: Root | undefined;

    await act(async () => {
      root = hydrateRoot(container, <PulledOverJourney />, {
        onRecoverableError: (error) => recoverableErrors.push(error),
      });
      await Promise.resolve();
    });

    expect(recoverableErrors).toEqual([]);
    expect(
      Array.from(
        container.querySelectorAll<HTMLElement>(".fg-pulled-panel"),
        (panel) => panel.id,
      ),
    ).toEqual(idsBefore);
    expect(container.querySelector(".fg-pulled-journey")).toHaveAttribute(
      "data-enhanced",
      "true",
    );
    expect(container.querySelector(".fg-pulled-tabs")).not.toHaveAttribute(
      "hidden",
    );
    expect(container.querySelectorAll('[role="tab"]')).toHaveLength(4);
    expect(container.querySelectorAll('[role="tabpanel"]')).toHaveLength(4);
    expect(
      Array.from(container.querySelectorAll('[role="tabpanel"]')).filter(
        (panel) => panel.hasAttribute("hidden"),
      ),
    ).toHaveLength(3);

    await act(async () => root?.unmount());
    container.remove();
  });

  it("moves from the toolkit to the trusted-contact state", async () => {
    const user = userEvent.setup();
    render(<PulledOverJourney />);

    expect(screen.getByRole("tab", { name: /Toolkit/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("I started with the driver's question.")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: /Contact/i }));

    expect(screen.getByRole("tab", { name: /Contact/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByText("I kept recording and trusted-contact actions visible."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("The screen confirms that nothing has been sent."),
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
    expect(
      screen.getByText("I started recording before asking for another decision."),
    ).toBeInTheDocument();
  });

  it("walks a visitor through the representative path after an equal-weight answer", async () => {
    const user = userEvent.setup();
    render(<PulledOverJourney />);

    expect(
      screen.getByRole("group", { name: "Toolkit controls" }),
    ).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Continue" }));
    const reassuranceTab = screen.getByRole("tab", { name: /Reassurance/i });
    expect(reassuranceTab).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(reassuranceTab).toHaveFocus();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByRole("tab", { name: /Question/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("status")).toHaveTextContent("Choose an answer to continue.");
    expect(screen.getByRole("button", { name: "Continue" })).toBeDisabled();

    await user.click(screen.getByLabelText("Yes"));

    expect(screen.getByRole("status")).toHaveTextContent("You selected Yes.");
    expect(screen.getByRole("button", { name: "Continue" })).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByRole("tab", { name: /Contact/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      screen.getByText(
        "This web reconstruction does not place a call, send a message, or share location.",
      ),
    ).toBeInTheDocument();
  });

  it("restarts at Toolkit and clears a selected answer", async () => {
    const user = userEvent.setup();
    render(<PulledOverJourney />);

    await user.click(screen.getByRole("tab", { name: /Question/i }));
    await user.click(screen.getByLabelText("Prefer not to answer"));
    await user.click(screen.getByRole("tab", { name: /Contact/i }));
    await user.click(screen.getByRole("button", { name: "Restart" }));

    expect(screen.getByRole("tab", { name: /Toolkit/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByLabelText("Prefer not to answer")).not.toBeChecked();
  });
});
