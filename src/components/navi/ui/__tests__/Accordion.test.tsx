import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { Accordion } from "@/components/navi/ui/Accordion";

const items = [
  { id: "bring", title: "What to bring", content: "Comfortable shoes." },
  { id: "impact", title: "Impact initiative", content: "Funds park tree care." },
];

describe("Accordion", () => {
  it("renders collapsed rows with aria-expanded false", () => {
    render(<Accordion items={items} />);
    expect(screen.getByRole("button", { name: "What to bring" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("expands a row on click and reveals its content", async () => {
    render(<Accordion items={items} />);
    const trigger = screen.getByRole("button", { name: "Impact initiative" });
    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Funds park tree care.")).toBeVisible();
  });
});
