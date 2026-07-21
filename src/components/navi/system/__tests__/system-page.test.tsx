import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import SystemPage from "@/app/work/navi/(minisite)/system/page";

function specimenNamed(name: string) {
  const heading = screen.getByRole("heading", { level: 3, name });
  const specimen = heading.closest("section");
  if (!specimen) throw new Error(`Missing specimen section for ${name}`);
  return within(specimen);
}

describe("System page", () => {
  it("leads with the Live playground hero", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { level: 2, name: "Live" })).toBeInTheDocument();
  });

  it("organizes specimens into six chapters", () => {
    render(<SystemPage />);
    for (const name of ["Live", "Foundations", "Actions", "Forms", "Content", "Navigation"]) {
      expect(screen.getByRole("heading", { level: 2, name })).toBeInTheDocument();
    }
  });

  it("renders the foundation specimens (Color, Type, Spacing) inside Foundations", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { level: 3, name: "Color" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Type" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Spacing" })).toBeInTheDocument();
  });

  it("renders the gallery heading and a documented correction note", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: /design system/i })).toBeInTheDocument();
    expect(screen.getByText(/accessible derivation/i)).toBeInTheDocument();
  });

  it("renders specimens for the core components", () => {
    render(<SystemPage />);
    expect(screen.getByRole("heading", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Rating" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Impact signal" })).toBeInTheDocument();
  });

  it("renders the interactive Button playground", () => {
    render(<SystemPage />);
    expect(screen.getByTestId("nv-playground-code")).toHaveTextContent("<Button");
  });

  it("runs the live playground button and preserves its controls", async () => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const heading = screen.getByRole("heading", { level: 2, name: "Live" });
    const section = heading.closest("section");
    if (!section) throw new Error("Missing Live playground section");
    const playground = within(section);

    await user.click(playground.getByRole("radio", { name: "transparent" }));
    expect(playground.getByTestId("nv-playground-code")).toHaveTextContent(
      'variant="transparent"',
    );

    await user.click(playground.getByRole("button", { name: "Reserve now" }));

    const feedback = playground.getByRole("status", { name: "Reservation feedback" });
    expect(feedback).toBeVisible();
    expect(feedback).toHaveTextContent("Reservation started.");
  });

  it.each([
    ["Primary", "Primary action activated."],
    ["Transparent", "Transparent action activated."],
    ["Outline", "Outline action activated."],
  ])("announces visible feedback from the %s action", async (label, message) => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const specimen = specimenNamed("Button");

    await user.click(specimen.getByRole("button", { name: label }));

    expect(specimen.getByRole("status", { name: "Action feedback" })).toBeVisible();
    expect(specimen.getByRole("status", { name: "Action feedback" })).toHaveTextContent(message);
    expect(specimen.getByRole("button", { name: "Disabled" })).toBeDisabled();
  });

  it("toggles the wishlist button and announces each saved state", async () => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const specimen = specimenNamed("Icon button");
    const save = specimen.getByRole("button", { name: "Save to wishlist" });

    expect(save).toHaveAttribute("aria-pressed", "false");
    await user.click(save);

    const saved = specimen.getByRole("button", { name: "Save to wishlist" });
    expect(saved).toHaveAttribute("aria-pressed", "true");
    expect(specimen.getByRole("status", { name: "Wishlist feedback" })).toBeVisible();
    expect(specimen.getByRole("status", { name: "Wishlist feedback" })).toHaveTextContent(
      "Saved to wishlist.",
    );

    await user.click(saved);
    expect(specimen.getByRole("button", { name: "Save to wishlist" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(specimen.getByRole("status", { name: "Wishlist feedback" })).toHaveTextContent(
      "Removed from wishlist.",
    );
  });

  it("announces the selected PillRow option", async () => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const specimen = specimenNamed("PillRow");
    const group = specimen.getByRole("group", { name: "Journey stage" });

    expect(within(group).getByRole("button", { name: "Plan" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(group).getByRole("button", { name: "Learn" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );

    await user.click(within(group).getByRole("button", { name: "Go" }));

    expect(within(group).getByRole("button", { name: "Go" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(group).getByRole("button", { name: "Plan" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("describes all three enabled action variants", () => {
    render(<SystemPage />);

    expect(
      screen.getByText(
        "Trigger something. Primary, transparent, and outline variants use the contrast-corrected --nv-action token.",
      ),
    ).toBeVisible();
  });

  it("changes the selected tab and its visible panel", async () => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const specimen = specimenNamed("Tabs");

    await user.click(specimen.getByRole("tab", { name: "Plan" }));

    expect(specimen.getByRole("tab", { name: "Plan" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(specimen.getByRole("tabpanel", { name: "Plan" })).toBeVisible();
    expect(specimen.getByRole("tabpanel", { name: "Plan" })).toHaveTextContent(
      "Choose a date, check access details, and review local impact.",
    );

    await user.click(specimen.getByRole("tab", { name: "Go" }));
    expect(specimen.getByRole("tabpanel", { name: "Go" })).toBeVisible();
  });

  it("updates the sticky section selection and preview", async () => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const specimen = specimenNamed("Sticky section nav");
    const navigation = specimen.getByRole("navigation", { name: "Sections (demo)" });

    await user.click(within(navigation).getByRole("button", { name: "Go" }));

    expect(within(navigation).getByRole("button", { name: "Go" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(specimen.getByRole("status", { name: "Section preview" })).toBeVisible();
    expect(specimen.getByRole("status", { name: "Section preview" })).toHaveTextContent(
      "Use transit details and arrival guidance.",
    );
    expect(specimen.getByText(
      "This specimen previews selected state only. The product page owns anchors and scroll tracking.",
    )).toBeVisible();
  });

  it("moves between carousel slides with arrows and dots", async () => {
    const user = userEvent.setup();
    render(<SystemPage />);
    const specimen = specimenNamed("Carousel controls");
    const previous = specimen.getByRole("button", { name: "Previous photo" });
    const next = specimen.getByRole("button", { name: "Next photo" });

    expect(specimen.getByRole("group", { name: "photo pagination" })).toBeInTheDocument();
    expect(specimen.queryAllByRole("tab")).toHaveLength(0);
    expect(previous).toBeDisabled();
    expect(next).toBeEnabled();
    expect(specimen.getByRole("button", { name: "Go to photo 1" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(specimen.getByRole("status", { name: "Carousel status" })).toHaveTextContent(
      "Slide 1 of 4: Street food tour.",
    );

    await user.click(next);
    expect(previous).toBeEnabled();
    expect(specimen.getByRole("button", { name: "Go to photo 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    expect(specimen.getByRole("status", { name: "Carousel status" })).toHaveTextContent(
      "Slide 2 of 4: Pottery workshop.",
    );

    await user.click(specimen.getByRole("button", { name: "Go to photo 4" }));
    expect(next).toBeDisabled();
    expect(specimen.getByRole("status", { name: "Carousel status" })).toHaveTextContent(
      "Slide 4 of 4: Garden walk.",
    );
  });
});
