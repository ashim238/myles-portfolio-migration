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

  it("labels each region by its trigger", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Impact initiative" }));
    const region = screen.getByRole("region");
    const labelledby = region.getAttribute("aria-labelledby");
    expect(labelledby).toBeTruthy();
    expect(document.getElementById(labelledby as string)).toHaveTextContent("Impact initiative");
  });

  it("collapses the previously open row when a new row is opened", async () => {
    render(<Accordion items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "What to bring" }));
    await userEvent.click(screen.getByRole("button", { name: "Impact initiative" }));
    expect(screen.getByRole("button", { name: "What to bring" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("button", { name: "Impact initiative" })).toHaveAttribute("aria-expanded", "true");
  });
});
